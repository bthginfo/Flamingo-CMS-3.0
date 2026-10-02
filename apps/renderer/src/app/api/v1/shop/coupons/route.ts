import { withApiHandler } from '@/lib/api-utils';
import { readApiJsonObject } from '@/lib/api-request-body';
import { validateCouponInput } from '@/lib/shop-api-input';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { coupons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const GET = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const all = await db.select().from(coupons).where(eq(coupons.tenantId, auth.tenantId));
  return NextResponse.json({ coupons: all });
});

export const POST = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await readApiJsonObject(req);
  validateCouponInput(body);
  const { code, type, value, minOrderCents, maxUses, validFrom, validUntil, appliesTo, appliesToIds } = body;
  if (!code || !type || value == null) return NextResponse.json({ error: 'code, type, and value required' }, { status: 400 });

  const db = getDb();
  const [coupon] = await db.insert(coupons).values({
    tenantId: auth.tenantId,
    code: code.trim().toUpperCase(),
    type,
    value,
    minOrderCents: minOrderCents ?? null,
    maxUses: maxUses ?? null,
    validFrom: validFrom ? new Date(validFrom) : null,
    validUntil: validUntil ? new Date(validUntil) : null,
    appliesTo: appliesTo || 'all',
    appliesToIds: appliesToIds || [],
  }).returning();

  return NextResponse.json({ coupon }, { status: 201 });
});
