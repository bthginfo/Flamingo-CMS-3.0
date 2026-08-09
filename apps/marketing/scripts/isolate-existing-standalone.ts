import { createDb, createRuntimeDatabaseRole, migrateDatabase, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/lib/db';
import { createNeonTenantProject, findNeonTenantProject, getNeonTenantProjectById } from '../src/lib/neon';
import { getTenantDatabaseRecord, markTenantDatabaseActive, registerTenantDatabase, removeTenantDatabaseRecord } from '../src/lib/tenant-data-db';
import { copyTenantData, purgeSharedTenantData, verifyTenantDataCopy } from '../src/lib/tenant-data-migration';
import { setStandaloneDatabaseConnection } from '../src/lib/vercel';
import { acquireTenantOperation, completeTenantOperation, createTenantOperationFingerprint, failTenantOperation, heartbeatTenantOperation } from '../src/lib/tenant-operation';

async function main() {
  const tenantId = process.env.TENANT_ID?.trim();
  if (!tenantId) throw new Error('TENANT_ID is required.');
  if (!process.env.GITHUB_REPO_NUMERIC_ID?.trim()) throw new Error('GITHUB_REPO_NUMERIC_ID is required to deploy the database cutover.');
  const sharedDatabaseUrl = process.env.DATABASE_URL?.trim();
  if (!sharedDatabaseUrl) throw new Error('DATABASE_URL is required.');

  const controlDb = getDb();
  const [tenant] = await controlDb.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) throw new Error('Tenant not found.');
  if (tenant.deploymentMode !== 'standalone' || !tenant.vercelProjectId) {
    throw new Error('Only an existing standalone tenant with a Vercel project can be isolated.');
  }
  const existingRegistry = await getTenantDatabaseRecord(tenantId);

  const operationKey = `isolate-existing:${tenantId}`;
  const claim = await acquireTenantOperation({
    operationKey,
    kind: 'isolate_existing_standalone',
    tenantId,
    slug: tenant.slug,
    inputFingerprint: createTenantOperationFingerprint({ tenantId, slug: tenant.slug, vercelProjectId: tenant.vercelProjectId }),
  });
  if (claim.state === 'completed') return;
  if (claim.state === 'in_progress') throw new Error(`Isolation already running (${claim.phase}).`);
  if (existingRegistry) {
    if (existingRegistry.status === 'active' && claim.resources.targetProjectId === existingRegistry.projectId) {
      await completeTenantOperation({
        operationKey,
        ownerToken: claim.ownerToken,
        result: { targetProjectId: existingRegistry.projectId, recoveredAfterInterruptedResponse: true },
      });
      return;
    }
    const error = new Error('This tenant already has a different registered dedicated database.');
    await failTenantOperation({ operationKey, ownerToken: claim.ownerToken, error });
    throw error;
  }

  let neonProject: Awaited<ReturnType<typeof createNeonTenantProject>> | undefined;
  let connectionSwitched = false;
  let registrySwitched = false;
  try {
    await controlDb.update(tenants).set({ status: 'provisioning', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
    await heartbeatTenantOperation({ operationKey, ownerToken: claim.ownerToken, phase: 'writes_quiesced', tenantId });

    const rememberedProjectId = typeof claim.resources.targetProjectId === 'string' ? claim.resources.targetProjectId : '';
    neonProject = rememberedProjectId
      ? await getNeonTenantProjectById(rememberedProjectId)
      : await findNeonTenantProject(tenant.slug) || await createNeonTenantProject(tenant.slug);
    await migrateDatabase(neonProject.directConnectionUri);
    const runtime = await createRuntimeDatabaseRole(neonProject.directConnectionUri);
    neonProject = { ...neonProject, roleName: runtime.roleName, pooledConnectionUri: runtime.connectionUri };
    await heartbeatTenantOperation({
      operationKey,
      ownerToken: claim.ownerToken,
      phase: 'target_database_ready',
      tenantId,
      resources: { targetProjectId: neonProject.projectId },
    });

    const targetDb = createDb(neonProject.pooledConnectionUri);
    let verified = false;
    try {
      await verifyTenantDataCopy(controlDb, targetDb, tenantId);
      verified = true;
    } catch {
      const [partial] = await targetDb.select({ id: tenants.id }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
      if (partial) {
        await heartbeatTenantOperation({ operationKey, ownerToken: claim.ownerToken, phase: 'resetting_partial_target', tenantId });
        await purgeSharedTenantData(targetDb, tenantId);
        await targetDb.delete(tenants).where(eq(tenants.id, tenantId));
      }
    }
    const result = verified ? { totalRows: 0 } : await copyTenantData(controlDb, targetDb, tenantId);
    await verifyTenantDataCopy(controlDb, targetDb, tenantId);
    await targetDb.update(tenants).set({
      deploymentMode: 'standalone',
      vercelProjectId: tenant.vercelProjectId,
      status: 'active',
      updatedAt: new Date(),
    }).where(eq(tenants.id, tenantId));

    await setStandaloneDatabaseConnection(tenant.vercelProjectId, tenant.slug, tenantId, neonProject.pooledConnectionUri);
    connectionSwitched = true;
    await heartbeatTenantOperation({ operationKey, ownerToken: claim.ownerToken, phase: 'deployment_ready', tenantId });
    await verifyTenantDataCopy(controlDb, targetDb, tenantId);
    await registerTenantDatabase({ tenantId, ...neonProject });
    registrySwitched = true;
    await markTenantDatabaseActive(tenantId);
    await controlDb.update(tenants).set({ status: 'active', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
    await completeTenantOperation({ operationKey, ownerToken: claim.ownerToken, result: { targetProjectId: neonProject.projectId } });

    console.log(`${tenant.slug}: dedicated database active (${result.totalRows} rows copied in this attempt).`);
    console.log('The shared copy was retained for rollback. Verify the website, then use purge:standalone-shared-copy explicitly.');
  } catch (error) {
    if (connectionSwitched) {
      await setStandaloneDatabaseConnection(tenant.vercelProjectId, tenant.slug, tenantId, sharedDatabaseUrl)
        .catch(rollbackError => console.error('Vercel database rollback failed:', rollbackError));
    }
    if (registrySwitched) await removeTenantDatabaseRecord(tenantId).catch(rollbackError => console.error('Registry rollback failed:', rollbackError));
    await controlDb.update(tenants).set({ status: 'active', updatedAt: new Date() }).where(eq(tenants.id, tenantId)).catch(() => undefined);
    if (neonProject) {
      await createDb(neonProject.pooledConnectionUri).update(tenants).set({ status: 'provisioning', updatedAt: new Date() })
        .where(eq(tenants.id, tenantId)).catch(() => undefined);
    }
    await failTenantOperation({ operationKey, ownerToken: claim.ownerToken, error }).catch(() => undefined);
    throw error;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
