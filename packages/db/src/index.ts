import { Client, neon, neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWebSocket } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import ws from 'ws';
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl, { fetchOptions: { cache: 'no-store' } });
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export const DATABASE_SCHEMA_VERSION = 25;

const RUNTIME_DATABASE_ROLE_PREFIX = 'flamingo_app';

function assertSafeIdentifier(value: string, label: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(value)) {
    throw new Error(`${label} ist kein gültiger PostgreSQL-Identifier.`);
  }
}

function quoteIdentifier(value: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) throw new Error('Identifier enthält unzulässige Zeichen.');
  return `"${value.replace(/"/g, '""')}"`;
}

function quoteLiteral(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

export async function grantRuntimeDatabasePrivileges(ownerDatabaseUrl: string, roleName: string) {
  assertSafeIdentifier(roleName, 'Runtime-Rolle');
  const client = new Client({ connectionString: ownerDatabaseUrl });
  await client.connect();
  try {
    const databaseResult = await client.query<{ database_name: string }>('SELECT current_database() AS database_name');
    const databaseName = databaseResult.rows[0]?.database_name;
    if (!databaseName || !/^[a-zA-Z0-9_-]+$/.test(databaseName)) throw new Error('Der Datenbankname ist für die Runtime-Rolle ungültig.');
    const role = quoteIdentifier(roleName);
    await client.query(`
      GRANT CONNECT ON DATABASE ${quoteIdentifier(databaseName)} TO ${role};
      GRANT USAGE ON SCHEMA public TO ${role};
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${role};
      GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ${role};
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${role};
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO ${role};
    `);
  } finally {
    await client.end();
  }
}

/**
 * Create a least-privilege login for the renderer after owner-led migrations.
 * The returned URI can read/write application data but cannot own or alter the
 * schema. The original owner URI remains available only to the control plane.
 */
export async function createRuntimeDatabaseRole(ownerDatabaseUrl: string) {
  const password = randomBytes(32).toString('hex');
  const roleName = `${RUNTIME_DATABASE_ROLE_PREFIX}_${randomBytes(4).toString('hex')}`;
  const client = new Client({ connectionString: ownerDatabaseUrl });
  await client.connect();
  try {
    const databaseResult = await client.query<{ database_name: string }>('SELECT current_database() AS database_name');
    const databaseName = databaseResult.rows[0]?.database_name;
    if (!databaseName || !/^[a-zA-Z0-9_-]+$/.test(databaseName)) throw new Error('Der Datenbankname ist für die Runtime-Rolle ungültig.');
    await client.query(`
      DO $role$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = ${quoteLiteral(roleName)}) THEN
          CREATE ROLE ${quoteIdentifier(roleName)} LOGIN;
        END IF;
      END
      $role$;
      ALTER ROLE ${quoteIdentifier(roleName)} WITH LOGIN PASSWORD ${quoteLiteral(password)} NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
    `);
  } finally {
    await client.end();
  }

  await grantRuntimeDatabasePrivileges(ownerDatabaseUrl, roleName);

  const runtimeUrl = new URL(ownerDatabaseUrl);
  runtimeUrl.username = roleName;
  runtimeUrl.password = password;
  return { roleName, connectionUri: runtimeUrl.toString() };
}

function resolveMigrationsFolder(explicit?: string) {
  const candidates = [
    explicit,
    process.env.FLAMINGO_MIGRATIONS_DIR,
    path.join(process.cwd(), 'packages', 'db', 'drizzle'),
    path.join(process.cwd(), '..', '..', 'packages', 'db', 'drizzle'),
    path.join(process.cwd(), 'drizzle'),
  ].filter((candidate): candidate is string => Boolean(candidate));
  const found = candidates.find(candidate => existsSync(path.join(candidate, 'meta', '_journal.json')));
  if (!found) throw new Error('Flamingo database migrations are not available in this deployment.');
  return found;
}

export async function migrateDatabase(databaseUrl: string, migrationsFolder?: string) {
  const folder = resolveMigrationsFolder(migrationsFolder);
  // Several historical migrations intentionally contain multiple PostgreSQL
  // commands. Neon HTTP uses prepared statements and rejects those files with
  // `cannot insert multiple commands into a prepared statement`, which made a
  // fresh standalone tenant impossible to provision. The WebSocket driver uses
  // PostgreSQL's simple-query path and can apply the same immutable migration
  // history safely without rewriting already-applied migrations.
  neonConfig.webSocketConstructor = ws;

  // The original migration history predates several control-plane tables and
  // enum columns, so replaying it into an entirely empty tenant database is not
  // a reliable schema bootstrap. Fresh standalone databases instead receive a
  // generated snapshot of the current schema, then the existing journal is
  // marked as applied. Subsequent deploys continue through normal migrations.
  const bootstrap = new Client({ connectionString: databaseUrl });
  await bootstrap.connect();
  try {
    const relation = await bootstrap.query<{ tenants: string | null }>("select to_regclass('public.tenants')::text as tenants");
    if (!relation.rows[0]?.tenants) {
      const baselinePath = path.join(folder, 'baseline.sql');
      if (!existsSync(baselinePath)) throw new Error('Flamingo database baseline is not available in this deployment.');
      await bootstrap.query(readFileSync(baselinePath, 'utf8').replace(/^\uFEFF/, ''));
      await bootstrap.query(`
        CREATE SCHEMA IF NOT EXISTS drizzle;
        CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
          id serial PRIMARY KEY,
          hash text NOT NULL,
          created_at bigint
        );
      `);
      const journal = JSON.parse(readFileSync(path.join(folder, 'meta', '_journal.json'), 'utf8')) as {
        entries?: Array<{ tag: string; when: number }>;
      };
      const baselineMeta = JSON.parse(readFileSync(path.join(folder, 'baseline.meta.json'), 'utf8')) as {
        lastJournalTag?: string;
      };
      const baselineIndex = (journal.entries || []).findIndex(entry => entry.tag === baselineMeta.lastJournalTag);
      if (baselineIndex < 0) throw new Error('Flamingo database baseline metadata does not match the migration journal.');
      // Mark only the migrations represented by this baseline. Any migration
      // added later is intentionally left pending and applied below, so a
      // future migration cannot be skipped if the baseline is not regenerated.
      for (const entry of (journal.entries || []).slice(0, baselineIndex + 1)) {
        const sqlText = readFileSync(path.join(folder, `${entry.tag}.sql`), 'utf8');
        const hash = createHash('sha256').update(sqlText).digest('hex');
        await bootstrap.query(
          'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)',
          [hash, entry.when],
        );
      }
    }
  } finally {
    await bootstrap.end();
  }

  const client = new Pool({ connectionString: databaseUrl });
  const db = drizzleWebSocket({ client, schema });
  try {
    await migrate(db, { migrationsFolder: folder });
    return { schemaVersion: DATABASE_SCHEMA_VERSION };
  } finally {
    await client.end();
  }
}

export * from './schema';
export * from './constants';
