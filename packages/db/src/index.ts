import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl, { fetchOptions: { cache: 'no-store' } });
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export const DATABASE_SCHEMA_VERSION = 21;

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
  const db = createDb(databaseUrl);
  await migrate(db, { migrationsFolder: resolveMigrationsFolder(migrationsFolder) });
  return { schemaVersion: DATABASE_SCHEMA_VERSION };
}

export * from './schema';
export * from './constants';
