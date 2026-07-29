import { createDb, migrateDatabase, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/lib/db';
import { createNeonRuntimeDatabaseRole, createNeonTenantProject, deleteNeonProject } from '../src/lib/neon';
import {
  getRequiredStandaloneDatabase,
  markTenantDatabaseActive,
  registerTenantDatabase,
} from '../src/lib/tenant-data-db';
import { copyTenantData, verifyTenantDataCopy } from '../src/lib/tenant-data-migration';
import { setStandaloneDatabaseConnection } from '../src/lib/vercel';

const VERCEL_ENV_PROJECT = process.env.VERCEL_ENV_PROJECT || 'flamingo-cms-3-0';

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function loadVercelProjectEnv() {
  const token = process.env.VERCEL_TOKEN?.trim();
  if (!token) return;
  const response = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(VERCEL_ENV_PROJECT)}/env?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null) as { envs?: Array<{ key: string; value?: string; target?: string[] }> } | null;
  if (!response.ok || !data?.envs) {
    console.warn(`Vercel Env could not be loaded from ${VERCEL_ENV_PROJECT}; using local env only.`);
    return;
  }
  for (const envVar of data.envs) {
    if (envVar.key === 'VERCEL_TOKEN') continue;
    const targets = Array.isArray(envVar.target) ? envVar.target : [];
    if (targets.length && !targets.includes('production')) continue;
    const value = typeof envVar.value === 'string' ? envVar.value : '';
    if (!value || value.startsWith('__PLACEHOLDER')) continue;
    if (!process.env[envVar.key]) process.env[envVar.key] = value;
  }
}

async function resolveTenant() {
  const tenantId = process.env.TENANT_ID?.trim();
  const tenantSlug = process.env.TENANT_SLUG?.trim();
  if (!tenantId && !tenantSlug) throw new Error('TENANT_ID or TENANT_SLUG is required.');

  const db = getDb();
  const [tenant] = tenantId
    ? await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1)
    : await db.select().from(tenants).where(eq(tenants.slug, tenantSlug!)).limit(1);
  if (!tenant) throw new Error('Tenant not found.');
  if (tenant.deploymentMode !== 'standalone' || !tenant.vercelProjectId) {
    throw new Error('Only an existing standalone tenant with a Vercel project can be rotated.');
  }
  return tenant;
}

async function main() {
  await loadVercelProjectEnv();
  requiredEnv('DATABASE_URL');
  requiredEnv('NEON_API_KEY');
  requiredEnv('CRM_CONFIG_ENCRYPTION_KEY');
  requiredEnv('VERCEL_TOKEN');
  requiredEnv('GITHUB_REPO_NUMERIC_ID');

  const tenant = await resolveTenant();
  const vercelProjectId = tenant.vercelProjectId;
  if (!vercelProjectId) throw new Error('Tenant has no Vercel project id.');
  const current = await getRequiredStandaloneDatabase(tenant.id);

  const suffix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const neonSlug = process.env.NEW_NEON_PROJECT_SLUG?.trim() || `${tenant.slug}-${suffix}`;
  let nextProject: Awaited<ReturnType<typeof createNeonTenantProject>> | undefined;
  let connectionSwitched = false;

  try {
    nextProject = await createNeonTenantProject(neonSlug);
    await migrateDatabase(nextProject.directConnectionUri);
    const runtime = await createNeonRuntimeDatabaseRole(nextProject);
    nextProject = { ...nextProject, roleName: runtime.roleName, pooledConnectionUri: runtime.connectionUri };

    await registerTenantDatabase({ tenantId: tenant.id, ...nextProject });
    const targetDb = createDb(nextProject.pooledConnectionUri);
    const copy = await copyTenantData(current.db, targetDb, tenant.id);
    await targetDb.update(tenants).set({
      deploymentMode: 'standalone',
      vercelProjectId,
      status: 'active',
      updatedAt: new Date(),
    }).where(eq(tenants.id, tenant.id));
    await verifyTenantDataCopy(current.db, targetDb, tenant.id);

    await setStandaloneDatabaseConnection(vercelProjectId, tenant.slug, tenant.id, nextProject.pooledConnectionUri);
    connectionSwitched = true;
    await markTenantDatabaseActive(tenant.id);

    console.log(`${tenant.slug}: rotated standalone database to ${nextProject.projectId}.`);
    console.log(`${copy.totalRows} tenant-owned rows copied and verified.`);
    console.log(`Old Neon project retained for rollback: ${current.record.projectId}.`);
  } catch (error) {
    if (connectionSwitched) {
      await setStandaloneDatabaseConnection(vercelProjectId, tenant.slug, tenant.id, current.pooledConnectionUri)
        .catch(rollbackError => console.error('Vercel database rollback failed:', rollbackError));
    }
    await registerTenantDatabase({
      tenantId: tenant.id,
      projectId: current.record.projectId,
      region: current.record.region,
      databaseName: current.record.databaseName,
      roleName: current.record.roleName,
      pooledConnectionUri: current.pooledConnectionUri,
      directConnectionUri: current.directConnectionUri,
    }).catch(rollbackError => console.error('Registry rollback failed:', rollbackError));
    await markTenantDatabaseActive(tenant.id).catch(rollbackError => console.error('Registry activation rollback failed:', rollbackError));
    if (nextProject?.projectId) {
      await deleteNeonProject(nextProject.projectId).catch(rollbackError => console.error('New Neon cleanup failed:', rollbackError));
    }
    throw error;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
