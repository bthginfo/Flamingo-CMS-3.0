import { withApiHandler } from '@/lib/api-utils';
import { readApiJsonObject } from '@/lib/api-request-body';
import { validateShopSettingsInput } from '@/lib/shop-api-input';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { shopSettings } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const GET = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const [settings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, auth.tenantId)).limit(1);
  if (!settings) return NextResponse.json({ settings: null });

  // Don't expose secrets via API
  const { stripeSecretKey, stripeWebhookSecret, paypalSecret, sumupApiKey, ...safe } = settings;
  return NextResponse.json({ settings: safe });
});

export const PUT = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await readApiJsonObject(req);
  validateShopSettingsInput(body);
  const db = getDb();

  const updateData: Record<string, unknown> = {};
  if (body.currency !== undefined) updateData.currency = body.currency;
  if (body.paymentMethods !== undefined) updateData.paymentMethods = [...new Set(body.paymentMethods)];
  if (body.pickupEnabled !== undefined) updateData.pickupEnabled = body.pickupEnabled;
  if (body.pickupInstructions !== undefined) updateData.pickupInstructions = body.pickupInstructions;
  if (body.notificationEmail !== undefined) updateData.notificationEmail = body.notificationEmail;
  if (body.orderPrefix !== undefined) updateData.orderPrefix = body.orderPrefix;
  if (body.invoicePrefix !== undefined) updateData.invoicePrefix = body.invoicePrefix;
  if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = body.lowStockThreshold;
  if (body.companyInfo !== undefined) updateData.companyInfo = body.companyInfo;
  if (body.bankDetails !== undefined) updateData.bankDetails = body.bankDetails;

  const [existing] = await db.select({ id: shopSettings.id }).from(shopSettings).where(eq(shopSettings.tenantId, auth.tenantId));

  if (existing) {
    await db.update(shopSettings).set(updateData).where(eq(shopSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(shopSettings).values({ tenantId: auth.tenantId, ...updateData });
  }

  return NextResponse.json({ ok: true });
});
