import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seoPage } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { withApiHandlerParams } from '@/lib/api-utils';

// Column limits (packages/db seo_page) — reject over-long values with a clear
// 400 instead of letting the DB fail the whole query with an opaque 500.
const LIMITS: Record<string, number> = { metaTitle: 70, metaDescription: 170, canonical: 255 };

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { pageId } = params;
  const body = await req.json();
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = body[field];
    if (typeof value === 'string' && value.length > max) {
      return NextResponse.json({ error: `${field} exceeds ${max} characters (got ${value.length})` }, { status: 400 });
    }
  }
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
});
