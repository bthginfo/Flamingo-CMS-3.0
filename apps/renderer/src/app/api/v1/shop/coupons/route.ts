import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { coupons, tenantAddons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

async function checkShop(tenantId: string) {
  const db = getDb();
  const [addon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')));
  return addon?.active === true;
}

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const all = await db.select().from(coupons).where(eq(coupons.tenantId, auth.tenantId));
  return NextResponse.json({ coupons: all });
}

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await req.json();
  const { code, type, value, minOrderCents, maxUses, validFrom, validUntil, appliesTo, appliesToIds } = body;
  if (!code || !type || value == null) return NextResponse.json({ error: 'code, type, and value required' }, { status: 400 });

  const db = getDb();
  const [coupon] = await db.insert(coupons).values({
    tenantId: auth.tenantId,
    code: code.toUpperCase(),
    type,
    value,
    minOrderCents: minOrderCents || null,
    maxUses: maxUses || null,
    validFrom: validFrom ? new Date(validFrom) : null,
    validUntil: validUntil ? new Date(validUntil) : null,
    appliesTo: appliesTo || 'all',
    appliesToIds: appliesToIds || [],
  }).returning();

  return NextResponse.json({ coupon }, { status: 201 });
}
