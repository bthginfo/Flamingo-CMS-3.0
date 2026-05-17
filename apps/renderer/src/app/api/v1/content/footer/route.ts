import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { footer } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const { columns, legalLinks, cta } = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, auth.tenantId));
  if (existing) {
    await db.update(footer).set({ columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} }).where(eq(footer.tenantId, auth.tenantId));
  } else {
    await db.insert(footer).values({ tenantId: auth.tenantId, columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} });
  }

  return NextResponse.json({ success: true });
});
