import { createHash } from 'crypto';
import { getDb } from '@/lib/db';
import { tenantAddons, tenantApiTokens, tenants } from '@flamingo/db';
import { eq, and, or, isNull, lte, sql } from 'drizzle-orm';
import { parsePatBearer, isPatExpired, patUsageCutoff, shouldTouchPatUsage } from './pat-auth-policy';

export type PatAuthResult = {
  tenantId: string;
  tokenId: string;
  addons: string[];
  tenant: { name: string; industry: string; slug: string; activeStyle: string; i18nEnabled: boolean; i18nLocales: string; i18nDefaultLocale: string };
};

/**
 * Validate a PAT from Bearer token header.
 * Returns tenant info if valid, null otherwise.
 */
export async function validatePat(authHeader: string | null): Promise<PatAuthResult | null> {
  const token = parsePatBearer(authHeader);
  if (!token) return null;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const db = getDb();

  const [row] = await db
    .select({
      tokenId: tenantApiTokens.id,
      tenantId: tenantApiTokens.tenantId,
      revoked: tenantApiTokens.revoked,
      expiresAt: tenantApiTokens.expiresAt,
      lastUsedAt: tenantApiTokens.lastUsedAt,
      addons: sql<string[]>`ARRAY(SELECT ${tenantAddons.addonKey} FROM ${tenantAddons} WHERE ${tenantAddons.tenantId} = ${tenantApiTokens.tenantId} AND ${tenantAddons.active} = true)`,
      tenantName: tenants.name,
      industry: tenants.industry,
      slug: tenants.slug,
      activeStyle: tenants.activeStyle,
      i18nEnabled: tenants.i18nEnabled,
      i18nLocales: tenants.i18nLocales,
      i18nDefaultLocale: tenants.i18nDefaultLocale,
    })
    .from(tenantApiTokens)
    .innerJoin(tenants, eq(tenants.id, tenantApiTokens.tenantId))
    .where(and(
      eq(tenantApiTokens.tokenHash, tokenHash),
      eq(tenantApiTokens.revoked, false),
      eq(tenants.status, 'active'),
    ));

  if (!row) return null;
  const now = new Date();
  if (isPatExpired(row.expiresAt, now)) return null;

  // Keep authorization and entitlements live. Coalesce only usage bookkeeping;
  // the conditional write also avoids duplicate touches from concurrent calls.
  if (shouldTouchPatUsage(row.lastUsedAt, now)) {
    await db.update(tenantApiTokens).set({ lastUsedAt: now }).where(and(
      eq(tenantApiTokens.id, row.tokenId),
      or(isNull(tenantApiTokens.lastUsedAt), lte(tenantApiTokens.lastUsedAt, patUsageCutoff(now))),
    )).catch((err) => console.error('[pat-auth] Failed to update lastUsedAt:', err.message));
  }

  return {
    tenantId: row.tenantId,
    tokenId: row.tokenId,
    addons: row.addons,
    tenant: { name: row.tenantName, industry: row.industry, slug: row.slug, activeStyle: row.activeStyle, i18nEnabled: row.i18nEnabled, i18nLocales: row.i18nLocales, i18nDefaultLocale: row.i18nDefaultLocale },
  };
}
