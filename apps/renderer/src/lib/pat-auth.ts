import { createHash } from 'crypto';
import { getDb } from '@/lib/db';
import { tenantApiTokens, tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export type PatAuthResult = {
  tenantId: string;
  tokenId: string;
  tenant: { name: string; industry: string; slug: string; activeStyle: string };
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
    })
    .from(tenantApiTokens)
    .innerJoin(tenants, eq(tenants.id, tenantApiTokens.tenantId))
    .where(and(eq(tenantApiTokens.tokenHash, tokenHash), eq(tenantApiTokens.revoked, false)));

  if (!row) return null;
  if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;

  // Update last_used_at (fire and forget)
  db.update(tenantApiTokens)
    .set({ lastUsedAt: new Date() })
    .where(eq(tenantApiTokens.id, row.tokenId))
    .then(() => {})
    .catch(() => {});

  return {
    tenantId: row.tenantId,
    tokenId: row.tokenId,
    tenant: { name: row.tenantName, industry: row.industry, slug: row.slug, activeStyle: row.activeStyle },
  };
}
