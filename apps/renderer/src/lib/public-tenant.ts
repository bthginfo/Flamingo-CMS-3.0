import { and, eq, inArray } from 'drizzle-orm';
import { tenants } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parsePublicTenantId(value: unknown): string | null {
  return typeof value === 'string' && UUID_RE.test(value) ? value : null;
}

export function canUseExplicitSharedTenant(tenant: {
  deploymentMode: string;
  status: string;
  isDemo: boolean;
  isLead: boolean;
}) {
  return tenant.status === 'active'
    && (tenant.deploymentMode === 'shared' || tenant.deploymentMode === 'lead_shared')
    && (tenant.isDemo || tenant.isLead);
}

/**
 * Resolve tenant identifiers supplied by public booking/shop widgets.
 *
 * Standalone deployments are bound to FIXED_TENANT_ID. On the shared
 * renderer, caller-supplied UUIDs are accepted only for active demo/lead
 * tenants. This prevents a public request from selecting a real customer's
 * data merely by knowing its UUID.
 */
export async function resolvePublicTenantId(explicitValue?: unknown): Promise<string | null> {
  const explicitTenantId = parsePublicTenantId(explicitValue);
  const fixedTenantId = process.env.FIXED_TENANT_ID?.trim();
  if (fixedTenantId) {
    return !explicitValue || explicitTenantId === fixedTenantId ? fixedTenantId : null;
  }

  if (!explicitValue) return resolveTenant();
  if (!explicitTenantId) return null;

  const [tenant] = await getDb()
    .select({
      id: tenants.id,
      deploymentMode: tenants.deploymentMode,
      status: tenants.status,
      isDemo: tenants.isDemo,
      isLead: tenants.isLead,
    })
    .from(tenants)
    .where(and(
      eq(tenants.id, explicitTenantId),
      inArray(tenants.deploymentMode, ['shared', 'lead_shared']),
    ))
    .limit(1);

  return tenant && canUseExplicitSharedTenant(tenant) ? tenant.id : null;
}
