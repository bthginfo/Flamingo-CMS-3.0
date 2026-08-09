import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { coupons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolvePublicTenantId } from '@/lib/public-tenant';
import { couponEffect } from '@/lib/shop-totals';
import { isShopActive } from '@/lib/shop-pages';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  rendererCouponRateRules,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';

const MAX_COUPON_REQUEST_BYTES = 8 * 1024;

export async function POST(req: NextRequest) {
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'Content-Type wird nicht unterstützt.' }, { status: 415 });
  }
  if (!isTrustedRendererContactOrigin(req)) return NextResponse.json({ error: 'Ungültiger Request-Ursprung.' }, { status: 403 });
  let body: Record<string, unknown>;
  try {
    const parsed = await readBoundedRendererContactJson(req, MAX_COUPON_REQUEST_BYTES);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new RendererContactBodyInvalidError();
    body = parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return NextResponse.json({ error: 'Anfrage zu groß.' }, { status: 413 });
    if (error instanceof RendererContactBodyInvalidError) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    throw error;
  }
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase().slice(0, 50) : '';
  const subtotalCents = Number.isInteger(body.subtotalCents) ? Math.max(Number(body.subtotalCents), 0) : 0;
  const bodyTenantId = body.tenantId;
  const tenantId = await resolvePublicTenantId(bodyTenantId);
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  if (!await isShopActive(tenantId)) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  // Throttle to stop brute-forcing valid coupon codes / hammering the DB.
  const denied = await consumeRendererContactRateRules(
    rendererCouponRateRules(tenantId, getRendererContactClientAddress(req.headers)),
  );
  if (denied) {
    return NextResponse.json(
      { error: 'Zu viele Versuche. Bitte später erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(denied.retryAfterSeconds) } },
    );
  }

  const db = getDb();
  const [coupon] = await db.select().from(coupons)
    .where(and(eq(coupons.tenantId, tenantId), eq(coupons.code, code), eq(coupons.active, true)))
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
