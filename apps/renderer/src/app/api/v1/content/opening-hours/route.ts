import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const [row] = await db.select({ openingHours: globalSettings.openingHours }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  return NextResponse.json({ hours: row?.openingHours || [] });
});

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const hours = body.hours;
  if (!Array.isArray(hours)) return NextResponse.json({ error: 'hours must be an array of { day, hours }' }, { status: 400 });

  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  if (existing) {
    await db.update(globalSettings).set({ openingHours: hours, updatedAt: new Date() }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, openingHours: hours });
  }

  return NextResponse.json({ success: true });
});
