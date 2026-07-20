import { Client, neon, neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWebSocket } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import ws from 'ws';
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl, { fetchOptions: { cache: 'no-store' } });
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export const DATABASE_SCHEMA_VERSION = 22;

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
