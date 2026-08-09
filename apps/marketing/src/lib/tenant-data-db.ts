import { createDb, DATABASE_SCHEMA_VERSION, type Database, tenantDatabaseConnections, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { protectCrmSecret, revealCrmSecret } from './secret-storage';

function requireStableDatabaseEncryptionKey() {
  const value = process.env.CRM_CONFIG_ENCRYPTION_KEY?.trim() || process.env.CONFIG_ENCRYPTION_KEY?.trim();
  if (!value || value.length < 32) {
    throw new Error('CRM_CONFIG_ENCRYPTION_KEY (mindestens 32 Zeichen) ist für Standalone-Datenbanken erforderlich.');
  }
}

export async function getTenantDatabaseRecord(tenantId: string) {
  const db = getDb();
  try {
    const [record] = await db.select().from(tenantDatabaseConnections).where(eq(tenantDatabaseConnections.tenantId, tenantId)).limit(1);
    return record || null;
  } catch (error) {
    if (!/billing_plan_intent|column .* does not exist/i.test(error instanceof Error ? error.message : String(error))) throw error;
    const [record] = await db.select({
      tenantId: tenantDatabaseConnections.tenantId,
      provider: tenantDatabaseConnections.provider,
      projectId: tenantDatabaseConnections.projectId,
      region: tenantDatabaseConnections.region,
      databaseName: tenantDatabaseConnections.databaseName,
      roleName: tenantDatabaseConnections.roleName,
      connectionUriEncrypted: tenantDatabaseConnections.connectionUriEncrypted,
      directConnectionUriEncrypted: tenantDatabaseConnections.directConnectionUriEncrypted,
      status: tenantDatabaseConnections.status,
      schemaVersion: tenantDatabaseConnections.schemaVersion,
      lastMigratedAt: tenantDatabaseConnections.lastMigratedAt,
      createdAt: tenantDatabaseConnections.createdAt,
      updatedAt: tenantDatabaseConnections.updatedAt,
    }).from(tenantDatabaseConnections).where(eq(tenantDatabaseConnections.tenantId, tenantId)).limit(1);
    return record ? { ...record, billingPlanIntent: 'free' as const } : null;
  }
}

export async function getTenantDataDb(tenantId: string): Promise<Database> {
  const controlDb = getDb();
  const [tenant] = await controlDb
    .select({ deploymentMode: tenants.deploymentMode, status: tenants.status })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);
  if (!tenant) throw new Error('Der Tenant ist im Control-Plane-Register nicht vorhanden.');

  // Provisioning is the distributed write-quiesce barrier during cutover.
  if (tenant.status !== 'active') throw new Error('Der Tenant ist für Schreibzugriffe derzeit nicht aktiv.');
  // The control-plane mode is the routing authority. A target connection can
  // be prepared and verified before it is allowed to receive application IO.
  if (tenant.deploymentMode !== 'standalone') return controlDb;

  const record = await getTenantDatabaseRecord(tenantId);
  if (!record) throw new Error('Für diesen Standalone-Tenant ist keine dedizierte Datenbank registriert.');
  if (record.status === 'provisioning') {
    throw new Error('Die Standalone-Datenbank wird noch bereitgestellt und ist noch nicht verfügbar.');
  }
  if (record.status === 'migration_failed') {
    throw new Error('Die Standalone-Datenbank benötigt eine erfolgreiche Schema-Migration, bevor sie wieder verwendet werden kann.');
  }
  if (record.status !== 'active') throw new Error('Die Standalone-Datenbank ist derzeit nicht verfügbar.');
  const uri = revealCrmSecret(record.connectionUriEncrypted);
  if (!uri) throw new Error(`Die Standalone-Datenbank für Tenant ${tenantId} kann nicht entschlüsselt werden.`);

  // No permanent handle cache: a warm serverless process must observe a
  // registry rotation before its next write instead of retaining the old URI.
  return createDb(uri);
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
}

export async function removeTenantDatabaseRecord(tenantId: string) {
  await getDb().delete(tenantDatabaseConnections).where(eq(tenantDatabaseConnections.tenantId, tenantId));
}

export async function markTenantDatabaseActive(tenantId: string, schemaVersion = DATABASE_SCHEMA_VERSION) {
  await getDb().update(tenantDatabaseConnections).set({ status: 'active', schemaVersion, lastMigratedAt: new Date(), updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, tenantId));
}

export async function markTenantDatabaseMigrationFailed(tenantId: string) {
  await getDb().update(tenantDatabaseConnections).set({ status: 'migration_failed', updatedAt: new Date() }).where(eq(tenantDatabaseConnections.tenantId, tenantId));
}

export async function updateTenantRuntimeDatabaseConnection(tenantId: string, input: { roleName: string; connectionUri: string }) {
  requireStableDatabaseEncryptionKey();
  const connectionUriEncrypted = protectCrmSecret(input.connectionUri);
  if (!connectionUriEncrypted) throw new Error('Die Runtime-Datenbankverbindung ist ungültig.');
  await getDb().update(tenantDatabaseConnections).set({
    roleName: input.roleName,
    connectionUriEncrypted,
    updatedAt: new Date(),
  }).where(eq(tenantDatabaseConnections.tenantId, tenantId));
}

export async function mirrorTenantControlFields(tenantId: string, values: Partial<typeof tenants.$inferInsert>) {
  const controlDb = getDb();
  const dataDb = await getTenantDataDb(tenantId);
  if (dataDb === controlDb) return;
  await dataDb.update(tenants).set({ ...values, updatedAt: new Date() }).where(eq(tenants.id, tenantId));
}
