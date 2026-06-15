import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandlerParams, normalizeSlug, validateSections, normalizeSectionData, normalizeStyleOverrides } from '@/lib/api-utils';

export const GET = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  const [page] = await db.select().from(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  const sections = await db.select().from(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId))).orderBy(asc(pageSections.sortOrder));
  return NextResponse.json({
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    visible: page.visible,
    sections: sections.map(s => ({ id: s.id, type: s.type, data: s.data, variant: s.variant, visible: s.visible, sortOrder: s.sortOrder, styleOverrides: s.styleOverrides })),
  });
});

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  const updates: Record<string, unknown> = {};
  if (body.title) updates.title = body.title;
  if (body.slug != null) updates.slug = normalizeSlug(body.slug);

  if (Object.keys(updates).length > 0) {
    await db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  }

  if (Array.isArray(body.sections)) {
    const sectionErr = validateSections(body.sections);
    if (sectionErr) return NextResponse.json({ error: sectionErr }, { status: 400 });
    await db.delete(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId)));
    if (body.sections.length > 0) {
      await db.insert(pageSections).values(
        body.sections.map((s: any, i: number) => ({
          id: s.id || crypto.randomUUID(),
          tenantId: auth.tenantId,
          pageId: id,
          type: s.type,
          data: normalizeSectionData(s.type, s.data || {}),
          variant: s.variant || null,
          visible: s.visible !== false,
          container: s.container || 'default',
          spacingTop: s.spacingTop || 'm',
          spacingBottom: s.spacingBottom || 'm',
          anchorId: s.anchorId || null,
          styleOverrides: normalizeStyleOverrides(s.styleOverrides),
          sortOrder: i,
        }))
      );
    }
  }

  return NextResponse.json({ success: true });
});

export const PATCH = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  const [page] = await db.select().from(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  // Page-level fields
  const updates: Record<string, unknown> = {};
  if (body.title) updates.title = body.title;
  if (body.slug != null) updates.slug = normalizeSlug(body.slug);
  if (body.visible != null) updates.visible = body.visible;
  if (Object.keys(updates).length > 0) {
    await db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  }

  // Patch individual sections by ID (merge data fields)
  if (Array.isArray(body.patchSections)) {
    for (const patch of body.patchSections) {
      if (!patch.id) continue;
      const [existing] = await db.select().from(pageSections)
        .where(and(eq(pageSections.id, patch.id), eq(pageSections.tenantId, auth.tenantId)));
      if (!existing) continue;
      const mergedData = { ...(existing.data as Record<string, unknown>), ...(patch.data || {}) };
      const sectionUpdates: Record<string, unknown> = { data: mergedData };
      if (patch.visible != null) sectionUpdates.visible = patch.visible;
      if (patch.variant != null) sectionUpdates.variant = patch.variant;
      if (patch.styleOverrides !== undefined) {
        sectionUpdates.styleOverrides = normalizeStyleOverrides({
          ...((existing.styleOverrides as Record<string, string> | null) || {}),
          ...(patch.styleOverrides || {}),
        });
      }
      await db.update(pageSections).set(sectionUpdates).where(and(eq(pageSections.id, patch.id), eq(pageSections.tenantId, auth.tenantId)));
    }
  }

  return NextResponse.json({ success: true });
});

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  await db.delete(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));
  return NextResponse.json({ success: true });
});
