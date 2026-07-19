import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { coupons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { couponEffect } from '@/lib/shop-totals';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { isShopActive } from '@/lib/shop-pages';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveExplicitTenant(queryTenantId: unknown) {
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (typeof queryTenantId !== 'string' || !UUID_RE.test(queryTenantId)) return null;
  if (fixedTenantId) return queryTenantId === fixedTenantId ? queryTenantId : null;
  return queryTenantId;
}

export async function POST(req: NextRequest) {
  const { code, subtotalCents, tenantId: bodyTenantId } = await req.json();
  const tenantId = resolveExplicitTenant(bodyTenantId) || await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  if (!await isShopActive(tenantId)) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  // Throttle to stop brute-forcing valid coupon codes / hammering the DB.
  const rl = rateLimit(`coupon:${tenantId}:${getClientIp(req)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Zu viele Versuche. Bitte später erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  const db = getDb();
  const [coupon] = await db.select().from(coupons)
    .where(and(eq(coupons.tenantId, tenantId), eq(coupons.code, code.toUpperCase()), eq(coupons.active, true)))
    .limit(1);

  if (!coupon) return NextResponse.json({ error: 'Ungültiger Gutscheincode' }, { status: 404 });

  // Check expiry
  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
    return NextResponse.json({ error: 'Gutschein ist abgelaufen' }, { status: 400 });
  }
  if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
    return NextResponse.json({ error: 'Gutschein ist noch nicht gültig' }, { status: 400 });
  }

  // Check usage limits
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Gutschein wurde bereits zu oft eingelöst' }, { status: 400 });
  }

  // Check min order
  if (coupon.minOrderCents && subtotalCents < coupon.minOrderCents) {
    return NextResponse.json({ error: `Mindestbestellwert: ${(coupon.minOrderCents / 100).toFixed(2).replace('.', ',')} €` }, { status: 400 });
  }

  // Calculate discount (shared with the checkout charge — see lib/shop-totals)
  const { discountCents, freeShipping } = couponEffect(coupon, subtotalCents);

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discountCents,
    freeShipping,
    label: coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed_amount' ? `${(coupon.value / 100).toFixed(2).replace('.', ',')} €` : 'Kostenloser Versand',
  });
}
