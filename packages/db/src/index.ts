import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl, { fetchOptions: { cache: 'no-store' } });
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export const DATABASE_SCHEMA_VERSION = 28;

const RUNTIME_DATABASE_ROLE_PREFIX = 'flamingo_app';
const STATEMENT_BREAKPOINT = /^\s*-->\s*statement-breakpoint\s*$/m;

type MigrationJournal = {
  entries?: Array<{ tag: string; when: number }>;
};

type NeonSql = {
  query: (queryText: string, params?: unknown[]) => Promise<unknown[]>;
};

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

function splitSqlChunkBySemicolon(input: string) {
  const statements: string[] = [];
  let current = '';
  let singleQuoted = false;
  let doubleQuoted = false;
  let lineComment = false;
  let blockComment = false;
  let dollarQuote: string | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    current += char;

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        current += next;
        index += 1;
        blockComment = false;
      }
      continue;
    }
    if (dollarQuote) {
      if (input.slice(index, index + dollarQuote.length) === dollarQuote) {
        current += input.slice(index + 1, index + dollarQuote.length);
        index += dollarQuote.length - 1;
        dollarQuote = null;
      }
      continue;
    }
    if (singleQuoted) {
      if (char === "'" && next === "'") {
        current += next;
        index += 1;
      } else if (char === "'") {
        singleQuoted = false;
      }
      continue;
    }
    if (doubleQuoted) {
      if (char === '"' && next === '"') {
        current += next;
        index += 1;
      } else if (char === '"') {
        doubleQuoted = false;
      }
      continue;
    }

    if (char === '-' && next === '-') {
      current += next;
      index += 1;
      lineComment = true;
      continue;
    }
    if (char === '/' && next === '*') {
      current += next;
      index += 1;
      blockComment = true;
      continue;
    }
    if (char === "'") {
      singleQuoted = true;
      continue;
    }
    if (char === '"') {
      doubleQuoted = true;
      continue;
    }
    if (char === '$') {
      const match = input.slice(index).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
      if (match) {
        dollarQuote = match[0];
        current += input.slice(index + 1, index + match[0].length);
        index += match[0].length - 1;
      }
      continue;
    }
    if (char === ';') {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = '';
    }
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

function splitSqlStatements(sqlText: string) {
  const input = sqlText.replace(/^\uFEFF/, '');
  const chunks = STATEMENT_BREAKPOINT.test(input)
    ? input.split(STATEMENT_BREAKPOINT)
    : [input];
  return chunks.flatMap((chunk) => splitSqlChunkBySemicolon(chunk)).filter(Boolean);
}

function stripLeadingSqlComments(statement: string) {
  let current = statement.trimStart();

  while (current.startsWith('--') || current.startsWith('/*')) {
    if (current.startsWith('--')) {
      const lineEnd = current.indexOf('\n');
      if (lineEnd === -1) return '';
      current = current.slice(lineEnd + 1).trimStart();
      continue;
    }

    const blockEnd = current.indexOf('*/');
    if (blockEnd === -1) return current;
    current = current.slice(blockEnd + 2).trimStart();
  }

  return current;
}

function makeMigrationStatementIdempotent(statement: string) {
  const executableStatement = stripLeadingSqlComments(statement);
  const trimmedStatement = executableStatement.trim().replace(/;+\s*$/, '');

  if (/^CREATE\s+TYPE\s+/i.test(trimmedStatement) && /\s+AS\s+ENUM\s*\(/i.test(trimmedStatement)) {
    return wrapMigrationStatementWithDuplicateHandler(trimmedStatement, 'duplicate_object');
  }

  if (/^CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS\b)/i.test(trimmedStatement)) {
    return `${trimmedStatement.replace(/^CREATE\s+TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS ')};`;
  }

  if (/^CREATE\s+(UNIQUE\s+)?INDEX\s+(?!IF\s+NOT\s+EXISTS\b)/i.test(trimmedStatement)) {
    return `${trimmedStatement.replace(/^CREATE\s+(UNIQUE\s+)?INDEX\s+/i, (_match, uniquePrefix: string | undefined) => (
      `CREATE ${uniquePrefix ?? ''}INDEX IF NOT EXISTS `
    ))};`;
  }

  if (/^ALTER\s+TABLE\s+[\s\S]+\s+ADD\s+COLUMN\s+/i.test(trimmedStatement)) {
    return wrapMigrationStatementWithDuplicateHandler(trimmedStatement, 'duplicate_column');
  }

  if (/^ALTER\s+TABLE\s+[\s\S]+\s+ADD\s+CONSTRAINT\s+/i.test(trimmedStatement)) {
    return wrapMigrationStatementWithDuplicateHandler(trimmedStatement, 'duplicate_object');
  }

  return statement;
}

function wrapMigrationStatementWithDuplicateHandler(statement: string, duplicateCondition: 'duplicate_column' | 'duplicate_object') {
  return `DO $flamingo_migration$
BEGIN
  ${statement};
EXCEPTION WHEN ${duplicateCondition} THEN
  NULL;
END
$flamingo_migration$;`;
}

async function executeSqlScript(sql: NeonSql, sqlText: string) {
  for (const statement of splitSqlStatements(sqlText)) {
    await sql.query(makeMigrationStatementIdempotent(statement), []);
  }
}

export async function grantRuntimeDatabasePrivileges(ownerDatabaseUrl: string, roleName: string) {
  assertSafeIdentifier(roleName, 'Runtime-Rolle');
  const sql = neon(ownerDatabaseUrl, { fetchOptions: { cache: 'no-store' } });
  const databaseResult = await sql.query('SELECT current_database() AS database_name', []) as Array<{ database_name: string }>;
  const databaseName = databaseResult[0]?.database_name;
  if (!databaseName || !/^[a-zA-Z0-9_-]+$/.test(databaseName)) throw new Error('Der Datenbankname ist für die Runtime-Rolle ungültig.');
  const role = quoteIdentifier(roleName);
  await executeSqlScript(sql, `
    GRANT CONNECT ON DATABASE ${quoteIdentifier(databaseName)} TO ${role};
    GRANT USAGE ON SCHEMA public TO ${role};
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${role};
    GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ${role};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${role};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO ${role};
  `);
}

/**
 * Create a least-privilege login for the renderer after owner-led migrations.
 * The returned URI can read/write application data but cannot own or alter the
 * schema. The original owner URI remains available only to the control plane.
 */
export async function createRuntimeDatabaseRole(ownerDatabaseUrl: string) {
  const password = randomBytes(32).toString('hex');
  const roleName = `${RUNTIME_DATABASE_ROLE_PREFIX}_${randomBytes(4).toString('hex')}`;
  const sql = neon(ownerDatabaseUrl, { fetchOptions: { cache: 'no-store' } });
  await sql.query(`
    DO $role$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = ${quoteLiteral(roleName)}) THEN
        CREATE ROLE ${quoteIdentifier(roleName)} LOGIN;
      END IF;
    END
    $role$;
  `, []);
  await sql.query(`ALTER ROLE ${quoteIdentifier(roleName)} WITH LOGIN PASSWORD ${quoteLiteral(password)} NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION`, []);
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

async function ensureMigrationTable(sql: NeonSql) {
  await executeSqlScript(sql, `
    CREATE SCHEMA IF NOT EXISTS drizzle;
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id serial PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    );
  `);
}

export async function migrateDatabase(databaseUrl: string, migrationsFolder?: string) {
  const folder = resolveMigrationsFolder(migrationsFolder);
  const sql = neon(databaseUrl, { fetchOptions: { cache: 'no-store' } });

  // Fresh standalone tenant databases receive a generated snapshot of the
  // current schema first. Running the historic migration chain into an empty
  // DB is brittle, and the previous WebSocket migrator is not stable in Vercel
  // Serverless. This HTTP runner executes one SQL statement per request.
  const relation = await sql.query("select to_regclass('public.tenants')::text as tenants", []) as Array<{ tenants: string | null }>;
  const journal = JSON.parse(readFileSync(path.join(folder, 'meta', '_journal.json'), 'utf8')) as MigrationJournal;
  const entries = journal.entries || [];

  if (!relation[0]?.tenants) {
    const baselinePath = path.join(folder, 'baseline.sql');
    if (!existsSync(baselinePath)) throw new Error('Flamingo database baseline is not available in this deployment.');
    await executeSqlScript(sql, readFileSync(baselinePath, 'utf8'));
    await ensureMigrationTable(sql);

    const baselineMeta = JSON.parse(readFileSync(path.join(folder, 'baseline.meta.json'), 'utf8')) as {
      lastJournalTag?: string;
    };
    const baselineIndex = entries.findIndex(entry => entry.tag === baselineMeta.lastJournalTag);
    if (baselineIndex < 0) throw new Error('Flamingo database baseline metadata does not match the migration journal.');
    for (const entry of entries.slice(0, baselineIndex + 1)) {
      const sqlText = readFileSync(path.join(folder, `${entry.tag}.sql`), 'utf8');
      const hash = createHash('sha256').update(sqlText).digest('hex');
      await sql.query('INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)', [hash, entry.when]);
    }
  } else {
    await ensureMigrationTable(sql);
  }

  const appliedRows = await sql.query('SELECT hash FROM drizzle.__drizzle_migrations', []) as Array<{ hash: string }>;
  const applied = new Set(appliedRows.map(row => row.hash));
  for (const entry of entries) {
    const migrationPath = path.join(folder, `${entry.tag}.sql`);
    const sqlText = readFileSync(migrationPath, 'utf8');
    const hash = createHash('sha256').update(sqlText).digest('hex');
    if (applied.has(hash)) continue;
    await executeSqlScript(sql, sqlText);
    await sql.query('INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)', [hash, entry.when]);
    applied.add(hash);
  }

  return { schemaVersion: DATABASE_SCHEMA_VERSION };
}

export * from './schema';
export * from './constants';
