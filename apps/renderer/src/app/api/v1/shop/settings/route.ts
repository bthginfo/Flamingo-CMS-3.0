import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { shopSettings, tenantAddons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

async function checkShop(tenantId: string) {
  const db = getDb();
  const [addon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')));
  return addon?.active === true;
}

export async function PUT(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await req.json();
  const db = getDb();

  const updateData: Record<string, unknown> = {};
  if (body.currency !== undefined) updateData.currency = body.currency;
  if (body.paymentMethods !== undefined) updateData.paymentMethods = body.paymentMethods;
  if (body.pickupEnabled !== undefined) updateData.pickupEnabled = body.pickupEnabled;
  if (body.pickupInstructions !== undefined) updateData.pickupInstructions = body.pickupInstructions;
  if (body.notificationEmail !== undefined) updateData.notificationEmail = body.notificationEmail;
  if (body.orderPrefix !== undefined) updateData.orderPrefix = body.orderPrefix;
  if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = body.lowStockThreshold;

  const [existing] = await db.select({ id: shopSettings.id }).from(shopSettings).where(eq(shopSettings.tenantId, auth.tenantId));

  if (existing) {
    await db.update(shopSettings).set(updateData).where(eq(shopSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(shopSettings).values({ tenantId: auth.tenantId, ...updateData });
  }

  return NextResponse.json({ ok: true });
}
