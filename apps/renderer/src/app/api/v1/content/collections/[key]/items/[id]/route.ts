import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { withApiHandlerParams } from '@/lib/api-utils';

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  const { id } = params;
  const body = await req.json();
  const db = getDb();

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

export const DELETE = withApiHandlerParams(async (_req, auth, params) => {
  const { id } = params;
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));
  return NextResponse.json({ ok: true });
});
