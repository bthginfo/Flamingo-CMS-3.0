import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandler, normalizeSlug, validateSections, normalizeSectionData, normalizeStyleOverridesForSection } from '@/lib/api-utils';

export const POST = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const { slug, title, sections } = body;
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const db = getDb();
  const pageId = crypto.randomUUID();
  const normalizedSlug = slug ? normalizeSlug(slug) : normalizeSlug(title);

  await db.insert(pages).values({
    id: pageId,
    tenantId: auth.tenantId,
    slug: normalizedSlug,
    title,
    status: 'published',
  });

  if (Array.isArray(sections) && sections.length > 0) {
    const sectionErr = validateSections(sections, auth.tenant.industry);
    if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
    await db.insert(pageSections).values(
      sections.map((s: any, i: number) => ({
        id: s.id || crypto.randomUUID(),
        tenantId: auth.tenantId,
        pageId,
        type: s.type,
        data: normalizeSectionData(s.type, s.data || {}),
        variant: s.variant || null,
        visible: s.visible !== false,
        container: s.container || 'default',
        spacingTop: s.spacingTop || 'm',
        spacingBottom: s.spacingBottom || 'm',
        anchorId: s.anchorId || null,
        styleOverrides: normalizeStyleOverridesForSection(s.type, s.styleOverrides, auth.tenant.industry),
        sortOrder: i,
      }))
    );
  }

  return NextResponse.json({ success: true, id: pageId, slug: normalizedSlug });
});

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  return NextResponse.json({ pages: allPages.map(p => ({ id: p.id, slug: p.slug, title: p.title })) });
});
