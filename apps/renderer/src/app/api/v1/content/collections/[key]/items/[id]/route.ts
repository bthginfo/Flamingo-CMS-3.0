import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { withApiHandlerParams } from '@/lib/api-utils';
import crypto from 'crypto';

export const GET = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  const [item] = await db.select().from(collectionItems)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json({
    id: item.id,
    title: item.title,
    slug: item.slug,
    published: item.published,
    priority: item.priority,
    data: item.data,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
});

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  // Ensure all sections have IDs for DnD support
  if (body.data && Array.isArray(body.data.sections)) {
    body.data.sections = body.data.sections.map((s: Record<string, unknown>) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
    }));
  }

  // Only allow safe fields to be updated
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title != null) updates.title = body.title;
  if (body.slug != null) updates.slug = body.slug;
  if (body.data != null) updates.data = body.data;
  if (body.published != null) updates.published = body.published;
  if (body.priority != null) updates.priority = body.priority;

  await db.update(collectionItems).set(updates)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
});

export const PATCH = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(collectionItems)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  if (!existing) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title != null) updates.title = body.title;
  if (body.slug != null) updates.slug = body.slug;
  if (body.published != null) updates.published = body.published;
  if (body.priority != null) updates.priority = body.priority;

  // Merge data fields instead of full replace
  if (body.data != null) {
    const mergedData = { ...(existing.data as Record<string, unknown>), ...body.data };
    if (Array.isArray(mergedData.sections)) {
      mergedData.sections = (mergedData.sections as Record<string, unknown>[]).map(s => ({
        ...s,
        id: s.id || crypto.randomUUID(),
      }));
    }
    updates.data = mergedData;
  }

  await db.update(collectionItems).set(updates)
    .where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
});

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  return NextResponse.json({ ok: true });
});
