import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDb, DATABASE_SCHEMA_VERSION, migrateDatabase, tenantDatabaseConnections } from '@flamingo/db';
import { eq, inArray } from 'drizzle-orm';
import { revealCrmSecret } from '../src/lib/secret-storage';

async function main() {
const controlUrl = process.env.DATABASE_URL?.trim();
if (!controlUrl) throw new Error('DATABASE_URL is required.');
const controlDb = createDb(controlUrl);
const records = await controlDb.select().from(tenantDatabaseConnections)
  .where(inArray(tenantDatabaseConnections.status, ['active', 'migration_failed']));

if (!records.length) {
  console.log('No dedicated standalone databases registered.');
  return;
}
if (!process.env.CRM_CONFIG_ENCRYPTION_KEY?.trim() && !process.env.CONFIG_ENCRYPTION_KEY?.trim()) {
  throw new Error('CRM_CONFIG_ENCRYPTION_KEY is required to migrate standalone databases.');
}

const migrationsFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../packages/db/drizzle');
let failures = 0;
for (const record of records) {
  const uri = revealCrmSecret(record.directConnectionUriEncrypted) || revealCrmSecret(record.connectionUriEncrypted);
  if (!uri) {
    failures += 1;
    console.error(`${record.tenantId}: database connection cannot be decrypted`);
    await controlDb.update(tenantDatabaseConnections).set({ status: 'migration_failed', updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, record.tenantId));
    continue;
  }
  try {
    await migrateDatabase(uri, migrationsFolder);
    await controlDb.update(tenantDatabaseConnections).set({
      status: 'active', schemaVersion: DATABASE_SCHEMA_VERSION, lastMigratedAt: new Date(), updatedAt: new Date(),
    }).where(eq(tenantDatabaseConnections.tenantId, record.tenantId));
    console.log(`${record.tenantId}: migrated to schema ${DATABASE_SCHEMA_VERSION}`);
  } catch (error) {
    failures += 1;
    await controlDb.update(tenantDatabaseConnections).set({ status: 'migration_failed', updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, record.tenantId));
    console.error(`${record.tenantId}: migration failed`, error instanceof Error ? error.message : error);
  }
}

if (failures) throw new Error(`${failures} standalone database migration(s) failed.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
