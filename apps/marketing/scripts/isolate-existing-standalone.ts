import { createDb, migrateDatabase, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/lib/db';
import { createNeonTenantProject, deleteNeonProject } from '../src/lib/neon';
import {
  getTenantDatabaseRecord,
  markTenantDatabaseActive,
  registerTenantDatabase,
  removeTenantDatabaseRecord,
} from '../src/lib/tenant-data-db';
import { copyTenantData } from '../src/lib/tenant-data-migration';
import { setStandaloneDatabaseConnection } from '../src/lib/vercel';

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
if (await getTenantDatabaseRecord(tenantId)) throw new Error('This tenant already has a registered dedicated database.');

let neonProject: Awaited<ReturnType<typeof createNeonTenantProject>> | undefined;
let connectionSwitched = false;
try {
  neonProject = await createNeonTenantProject(tenant.slug);
  await registerTenantDatabase({ tenantId, ...neonProject });
  await migrateDatabase(neonProject.directConnectionUri);
  const targetDb = createDb(neonProject.pooledConnectionUri);
  const result = await copyTenantData(controlDb, targetDb, tenantId);
  await targetDb.update(tenants).set({
    deploymentMode: 'standalone',
    vercelProjectId: tenant.vercelProjectId,
    status: 'active',
    updatedAt: new Date(),
  }).where(eq(tenants.id, tenantId));

  connectionSwitched = true;
  await setStandaloneDatabaseConnection(tenant.vercelProjectId, tenant.slug, tenantId, neonProject.pooledConnectionUri);
  await markTenantDatabaseActive(tenantId);
  console.log(`${tenant.slug}: dedicated database active (${result.totalRows} rows copied).`);
  console.log('The shared copy was retained for rollback. Verify the website, then use purge:standalone-shared-copy explicitly.');
} catch (error) {
  if (connectionSwitched) {
    await setStandaloneDatabaseConnection(tenant.vercelProjectId, tenant.slug, tenantId, sharedDatabaseUrl)
      .catch(rollbackError => console.error('Vercel database rollback failed:', rollbackError));
  }
  if (neonProject?.projectId) await deleteNeonProject(neonProject.projectId).catch(rollbackError => console.error('Neon rollback failed:', rollbackError));
  await removeTenantDatabaseRecord(tenantId).catch(rollbackError => console.error('Registry rollback failed:', rollbackError));
  throw error;
}
