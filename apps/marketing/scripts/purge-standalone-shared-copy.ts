import { publishedSnapshots, tenants } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import { getDb } from '../src/lib/db';
import { getRequiredStandaloneDatabase } from '../src/lib/tenant-data-db';
import { purgeSharedTenantData } from '../src/lib/tenant-data-migration';

const tenantId = process.env.TENANT_ID?.trim();
const confirmation = process.env.CONFIRM_TENANT_SLUG?.trim();
if (!tenantId || !confirmation) throw new Error('TENANT_ID and CONFIRM_TENANT_SLUG are required.');

const controlDb = getDb();
const [tenant] = await controlDb.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
if (!tenant) throw new Error('Tenant not found.');
if (tenant.slug !== confirmation) throw new Error('CONFIRM_TENANT_SLUG does not match the selected tenant.');
if (tenant.deploymentMode !== 'standalone') throw new Error('Only standalone tenant copies can be purged.');

const dedicated = await getRequiredStandaloneDatabase(tenantId);
if (dedicated.record.status !== 'active') throw new Error('The dedicated database is not active.');
const [targetTenant] = await dedicated.db.select().from(tenants).where(and(eq(tenants.id, tenantId), eq(tenants.status, 'active'))).limit(1);
const [snapshot] = await dedicated.db.select({ id: publishedSnapshots.id }).from(publishedSnapshots)
  .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true))).limit(1);
if (!targetTenant || !snapshot) throw new Error('Dedicated database verification failed; shared data was not touched.');

await purgeSharedTenantData(controlDb, tenantId);
console.log(`${tenant.slug}: shared customer-data copy purged. Control-plane tenant and domains were retained.`);
