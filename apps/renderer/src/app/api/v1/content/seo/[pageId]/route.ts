import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { seoPage } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ pageId: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { pageId } = await params;
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select({ id: seoPage.id }).from(seoPage).where(and(eq(seoPage.tenantId, auth.tenantId), eq(seoPage.pageId, pageId)));
  const data = {
    metaTitle: body.metaTitle || null,
    metaDescription: body.metaDescription || null,
    ogImage: body.ogImage || null,
    canonical: body.canonical || null,
    noindex: body.noindex ?? false,
  };

  if (existing) {
    await db.update(seoPage).set(data).where(eq(seoPage.id, existing.id));
  } else {
    await db.insert(seoPage).values({ tenantId: auth.tenantId, pageId, ...data });
  }

  return NextResponse.json({ success: true });
}
