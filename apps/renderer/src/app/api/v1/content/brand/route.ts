import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  const existingBrand = (existing?.brand as Record<string, unknown>) || {};
  const nextBrand = { ...body };
  if (existingBrand.localSeo && !nextBrand.localSeo) nextBrand.localSeo = existingBrand.localSeo;

  if (existing) {
    await db.update(globalSettings).set({ brand: nextBrand }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, brand: nextBrand });
  }

  return NextResponse.json({ success: true });
});
