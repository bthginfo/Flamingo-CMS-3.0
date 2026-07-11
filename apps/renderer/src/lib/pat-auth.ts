import { createHash } from 'crypto';
import { getDb } from '@/lib/db';
import { tenantAddons, tenantApiTokens, tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

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
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token.startsWith('flm_pat_')) return null;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const db = getDb();

  const [row] = await db
    .select({
      tokenId: tenantApiTokens.id,
      tenantId: tenantApiTokens.tenantId,
      revoked: tenantApiTokens.revoked,
      expiresAt: tenantApiTokens.expiresAt,
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
  if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;

  const addonRows = await db.select({ key: tenantAddons.addonKey })
    .from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, row.tenantId), eq(tenantAddons.active, true)));

  // Update last_used_at (fire and forget, log errors)
  db.update(tenantApiTokens)
    .set({ lastUsedAt: new Date() })
    .where(eq(tenantApiTokens.id, row.tokenId))
    .catch((err) => console.error('[pat-auth] Failed to update lastUsedAt:', err.message));

  return {
    tenantId: row.tenantId,
    tokenId: row.tokenId,
    addons: addonRows.map(addon => addon.key),
    tenant: { name: row.tenantName, industry: row.industry, slug: row.slug, activeStyle: row.activeStyle, i18nEnabled: row.i18nEnabled, i18nLocales: row.i18nLocales, i18nDefaultLocale: row.i18nDefaultLocale },
  };
}
