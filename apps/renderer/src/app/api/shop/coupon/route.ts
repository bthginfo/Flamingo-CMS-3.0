import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { coupons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';

export async function POST(req: NextRequest) {
  const tenantId = await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const { code, subtotalCents } = await req.json();
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

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

  // Calculate discount
  let discountCents = 0;
  let freeShipping = false;

  switch (coupon.type) {
    case 'percent':
      discountCents = Math.round((subtotalCents * coupon.value) / 100);
      break;
    case 'fixed_amount':
      discountCents = Math.min(coupon.value, subtotalCents);
      break;
    case 'free_shipping':
      freeShipping = true;
      break;
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discountCents,
    freeShipping,
    label: coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed_amount' ? `${(coupon.value / 100).toFixed(2).replace('.', ',')} €` : 'Kostenloser Versand',
  });
}
