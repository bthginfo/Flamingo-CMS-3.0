import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { withApiHandlerParams, normalizeSlug } from '@/lib/api-utils';

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
    await db.delete(pageSections).where(and(eq(pageSections.pageId, id), eq(pageSections.tenantId, auth.tenantId)));
    if (body.sections.length > 0) {
      await db.insert(pageSections).values(
        body.sections.map((s: any, i: number) => ({
          id: s.id || crypto.randomUUID(),
          tenantId: auth.tenantId,
          pageId: id,
          type: s.type,
          data: s.data || {},
          variant: s.variant || null,
          visible: s.visible !== false,
          container: s.container || 'default',
          spacingTop: s.spacingTop || 'm',
          spacingBottom: s.spacingBottom || 'm',
          anchorId: s.anchorId || null,
          sortOrder: i,
        }))
      );
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
