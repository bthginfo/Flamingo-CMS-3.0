import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  if (existing) {
    await db.update(globalSettings).set({ contact: body }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, contact: body });
  }

  return NextResponse.json({ success: true });
});
