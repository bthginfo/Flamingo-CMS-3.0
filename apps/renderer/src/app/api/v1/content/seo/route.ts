import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seoGlobal } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const [row] = await db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, auth.tenantId));
  return NextResponse.json(row || {});
});

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select({ id: seoGlobal.id }).from(seoGlobal).where(eq(seoGlobal.tenantId, auth.tenantId));
  const data = {
    defaultTitle: body.defaultTitle || null,
    titleTemplate: body.titleTemplate || null,
    defaultDescription: body.defaultDescription || null,
    defaultOgImage: body.defaultOgImage || null,
    canonicalBase: body.canonicalBase || null,
    locale: body.locale || 'de_DE',
  };

  if (existing) {
    await db.update(seoGlobal).set(data).where(eq(seoGlobal.tenantId, auth.tenantId));
  } else {
    await db.insert(seoGlobal).values({ tenantId: auth.tenantId, ...data });
  }

  return NextResponse.json({ success: true });
});
