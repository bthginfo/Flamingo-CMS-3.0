import { createDb, DATABASE_SCHEMA_VERSION, type Database, tenantDatabaseConnections, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { protectCrmSecret, revealCrmSecret } from './secret-storage';

const tenantDbs = new Map<string, Database>();

function requireStableDatabaseEncryptionKey() {
  const value = process.env.CRM_CONFIG_ENCRYPTION_KEY?.trim() || process.env.CONFIG_ENCRYPTION_KEY?.trim();
  if (!value || value.length < 32) {
    throw new Error('CRM_CONFIG_ENCRYPTION_KEY (mindestens 32 Zeichen) ist für Standalone-Datenbanken erforderlich.');
  }
}

export async function getTenantDatabaseRecord(tenantId: string) {
  const [record] = await getDb().select().from(tenantDatabaseConnections).where(eq(tenantDatabaseConnections.tenantId, tenantId)).limit(1);
  return record || null;
}

export async function getTenantDataDb(tenantId: string): Promise<Database> {
  const cached = tenantDbs.get(tenantId);
  if (cached) return cached;
  const record = await getTenantDatabaseRecord(tenantId);
  if (!record || record.status === 'provisioning') return getDb();
  if (record.status === 'migration_failed') {
    throw new Error('Die Standalone-Datenbank benötigt eine erfolgreiche Schema-Migration, bevor sie wieder verwendet werden kann.');
  }
  if (record.status !== 'active') throw new Error('Die Standalone-Datenbank ist derzeit nicht verfügbar.');
  const uri = revealCrmSecret(record.connectionUriEncrypted);
  if (!uri) throw new Error(`Die Standalone-Datenbank für Tenant ${tenantId} kann nicht entschlüsselt werden.`);
  const tenantDb = createDb(uri);
  tenantDbs.set(tenantId, tenantDb);
  return tenantDb;
}

export async function getRequiredStandaloneDatabase(tenantId: string) {
  const record = await getTenantDatabaseRecord(tenantId);
  if (!record) throw new Error('Für diesen Standalone-Tenant ist keine dedizierte Datenbank registriert.');
  const pooledConnectionUri = revealCrmSecret(record.connectionUriEncrypted);
  const directConnectionUri = revealCrmSecret(record.directConnectionUriEncrypted) || pooledConnectionUri;
  if (!pooledConnectionUri || !directConnectionUri) throw new Error('Die Standalone-Datenbankverbindung ist nicht lesbar.');
  return { record, pooledConnectionUri, directConnectionUri, db: createDb(pooledConnectionUri) };
}

export async function registerTenantDatabase(input: { tenantId: string; projectId: string; region: string | null; databaseName: string; roleName: string; pooledConnectionUri: string; directConnectionUri: string }) {
  requireStableDatabaseEncryptionKey();
  const connectionUriEncrypted = protectCrmSecret(input.pooledConnectionUri);
  const directConnectionUriEncrypted = protectCrmSecret(input.directConnectionUri);
  if (!connectionUriEncrypted || !directConnectionUriEncrypted) throw new Error('Die Standalone-Datenbankverbindung ist ungültig.');
  const values = {
    projectId: input.projectId,
    region: input.region,
    databaseName: input.databaseName,
    roleName: input.roleName,
    connectionUriEncrypted,
    directConnectionUriEncrypted,
    status: 'provisioning' as const,
    updatedAt: new Date(),
  };
  await getDb().insert(tenantDatabaseConnections).values({ tenantId: input.tenantId, provider: 'neon', ...values })
    .onConflictDoUpdate({ target: tenantDatabaseConnections.tenantId, set: values });
  tenantDbs.delete(input.tenantId);
}

export async function removeTenantDatabaseRecord(tenantId: string) {
  await getDb().delete(tenantDatabaseConnections).where(eq(tenantDatabaseConnections.tenantId, tenantId));
  tenantDbs.delete(tenantId);
}

export async function markTenantDatabaseActive(tenantId: string, schemaVersion = DATABASE_SCHEMA_VERSION) {
  await getDb().update(tenantDatabaseConnections).set({ status: 'active', schemaVersion, lastMigratedAt: new Date(), updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, tenantId));
  tenantDbs.delete(tenantId);
}

export async function markTenantDatabaseMigrationFailed(tenantId: string) {
  await getDb().update(tenantDatabaseConnections).set({ status: 'migration_failed', updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, tenantId));
  tenantDbs.delete(tenantId);
}

export async function mirrorTenantControlFields(tenantId: string, values: Partial<typeof tenants.$inferInsert>) {
  const controlDb = getDb();
  const dataDb = await getTenantDataDb(tenantId);
  if (dataDb === controlDb) return;
  await dataDb.update(tenants).set({ ...values, updatedAt: new Date() }).where(eq(tenants.id, tenantId));
}
