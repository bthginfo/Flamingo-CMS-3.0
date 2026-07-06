import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandler, normalizeSlug, validateSections, normalizeSectionData, normalizeStyleOverridesForSection } from '@/lib/api-utils';

export const POST = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const { slug, title, sections } = body;
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const db = getDb();
  const pageId = crypto.randomUUID();
  const normalizedSlug = slug ? normalizeSlug(slug) : normalizeSlug(title);

  // A duplicate slug otherwise surfaces as an opaque 500 from the unique index.
  // Return a clear 409 so an AI agent knows to update the existing page (PUT
  // /pages/:id) or choose a different slug instead of blindly retrying.
  const [clash] = await db.select({ id: pages.id }).from(pages)
    .where(and(eq(pages.tenantId, auth.tenantId), eq(pages.slug, normalizedSlug))).limit(1);
  if (clash) {
    return NextResponse.json({
      error: `A page with slug "${normalizedSlug}" already exists. Update it with PUT /api/v1/content/pages/${clash.id}, or choose a different slug.`,
      existingPageId: clash.id,
    }, { status: 409 });
  }

  // Validate + normalize sections BEFORE inserting the page row. The neon-http
  // driver has no interactive transactions, so a validation 400 AFTER the insert
  // would orphan the page row and a naive retry would then collide on the unique
  // slug with a 500 — a long-standing pain point for AI agents writing content.
  let sectionValues: Record<string, unknown>[] = [];
  if (Array.isArray(sections) && sections.length > 0) {
    const sectionErr = validateSections(sections, auth.tenant.industry);
    if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
    sectionValues = sections.map((s: any, i: number) => ({
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
    }));
  }

  await db.insert(pages).values({
    id: pageId,
    tenantId: auth.tenantId,
    slug: normalizedSlug,
    title,
    status: 'published',
  });

  if (sectionValues.length > 0) {
    try {
      await db.insert(pageSections).values(sectionValues as never);
    } catch (e) {
      // No transactions: clean up the page row we just inserted so the caller
      // can retry without colliding on the unique slug.
      await db.delete(pages).where(eq(pages.id, pageId)).catch(() => {});
      throw e;
    }
  }

  return NextResponse.json({ success: true, id: pageId, slug: normalizedSlug });
});

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  return NextResponse.json({ pages: allPages.map(p => ({ id: p.id, slug: p.slug, title: p.title })) });
});
