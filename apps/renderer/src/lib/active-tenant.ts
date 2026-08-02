import { tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { getDb } from './db';

const ACTIVE_TENANT_REVALIDATE_SECONDS = 60;

/**
 * Standalone deployments still mirror their tenant control row locally.
 * Cache the status check so suspension becomes effective without adding one
 * database roundtrip to every public request.
 */
export async function resolveActiveFixedTenantId(): Promise<string | null> {
  const fixedTenantId = process.env.FIXED_TENANT_ID?.trim();
  if (!fixedTenantId) return null;

  const readActiveTenant = unstable_cache(
    async () => {
      const [tenant] = await getDb()
        .select({ id: tenants.id })
        .from(tenants)
        .where(and(eq(tenants.id, fixedTenantId), eq(tenants.status, 'active')))
        .limit(1);
      return tenant?.id ?? null;
    },
    ['active-fixed-tenant', fixedTenantId],
    { revalidate: ACTIVE_TENANT_REVALIDATE_SECONDS, tags: [`tenant-${fixedTenantId}`] },
  );

  return readActiveTenant();
}
