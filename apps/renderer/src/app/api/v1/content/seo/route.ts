import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { seoGlobal } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const [row] = await db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, auth.tenantId));
  return NextResponse.json(row || {});
}

export async function PUT(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
}
