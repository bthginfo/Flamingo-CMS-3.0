import { getDb } from '@/lib/db';
import { taxRates } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';

/**
 * Map a product taxClass to a tax rate (percent) for a tenant.
 *
 * Resolution order:
 *   1. tax_rates row where name === taxClass (per-tenant, country=DE for now)
 *   2. Sane DE defaults: standard=19, reduced=7, zero=0
 *
 * Cached per-process for the lifetime of the lambda to avoid DB hits on
 * every checkout line. Callers should treat the returned value as immutable.
 */
const DE_DEFAULTS: Record<string, number> = {
  standard: 19,
  reduced: 7,
  zero: 0,
  free: 0,
};

type Key = `${string}:${string}`;
const cache = new Map<Key, number>();

export async function getTaxRate(tenantId: string, taxClass: string | null | undefined, country = 'DE'): Promise<number> {
  const cls = (taxClass || 'standard').toLowerCase();
  const key: Key = `${tenantId}:${cls}:${country}` as Key;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const db = getDb();
  const [row] = await db.select({ rate: taxRates.rate }).from(taxRates)
    .where(and(
      eq(taxRates.tenantId, tenantId),
      eq(taxRates.name, cls),
      eq(taxRates.country, country),
    ))
    .limit(1);

  const rate = row ? Number(row.rate) : (DE_DEFAULTS[cls] ?? 19);
  cache.set(key, rate);
  return rate;
}

/** Inclusive-tax extraction: gross → tax portion in cents. */
export function extractTaxCentsFromGross(grossCents: number, ratePercent: number): number {
  if (ratePercent <= 0) return 0;
  return Math.round(grossCents * ratePercent / (100 + ratePercent));
}
