import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '../..');
const migrationRunner = readFileSync(path.join(root, 'packages/db/src/index.ts'), 'utf8');

test('database migrations serialize concurrent serverless runners', () => {
  assert.match(migrationRunner, /pg_advisory_xact_lock/);
  assert.match(migrationRunner, /sql\.transaction/);
  assert.match(migrationRunner, /isolationLevel: 'Serializable'/);
});

test('migration statements and their journal row are committed atomically', () => {
  assert.match(migrationRunner, /migrationTransactionQueries/);
  assert.match(migrationRunner, /IF NOT EXISTS \(SELECT 1 FROM drizzle\.__drizzle_migrations WHERE hash =/);
  assert.match(migrationRunner, /ON CONFLICT \(hash\) DO NOTHING/);
  assert.match(migrationRunner, /CREATE UNIQUE INDEX IF NOT EXISTS drizzle_migrations_hash_unique/);
});

test('the migration journal is validated before any migration file is executed', () => {
  assert.match(migrationRunner, /validateJournalEntries\(entries, folder\)/);
  assert.match(migrationRunner, /Duplicate migration journal entry/);
  assert.match(migrationRunner, /Migration file is missing for journal entry/);
});
