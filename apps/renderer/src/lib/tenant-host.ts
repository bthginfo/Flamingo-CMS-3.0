import { headers } from 'next/headers';
import { getDb } from './db';
import { tenantDomains, tenants } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import { resolveActiveFixedTenantId } from './active-tenant';

/**
 * Resolve a tenant strictly from the HTTP Host header against tenant_domains.
 *
 * Order of precedence:
 *   1. `FIXED_TENANT_ID` env var (standalone-mode deploys)
 *   2. exact match in `tenant_domains.domain`
 *
 * Returns `null` when the host cannot be mapped — callers must treat that as
 * an unauthenticated request, not as "pick any tenant".
 */
export async function resolveTenantByHost(): Promise<string | null> {
  const fixed = process.env.FIXED_TENANT_ID;
  if (fixed) return resolveActiveFixedTenantId();

  const h = await headers();
  const host = (h.get('host') || '').toLowerCase();
  if (!host) return null;

  const db = getDb();
  const [row] = await db
    .select({ tenantId: tenantDomains.tenantId })
    .from(tenantDomains)
    .innerJoin(tenants, eq(tenants.id, tenantDomains.tenantId))
    .where(and(eq(tenantDomains.domain, host), eq(tenants.status, 'active')))
    .limit(1);
  return row?.tenantId ?? null;
}
