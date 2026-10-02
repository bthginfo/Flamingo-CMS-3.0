import { withApiHandlerParams } from '@/lib/api-utils';
import { readApiJsonObject } from '@/lib/api-request-body';
import { categoryUpdates } from '@/lib/shop-api-input';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = params;
  const body = await readApiJsonObject(req);
  const updates = categoryUpdates(body);
  const db = getDb();

  const [updated] = await db.update(productCategories)
    .set(updates)
    .where(and(eq(productCategories.id, id), eq(productCategories.tenantId, auth.tenantId)))
    .returning();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ category: updated });
});

export const DELETE = withApiHandlerParams(async (req, auth, params) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = params;
  const db = getDb();
  const [deleted] = await db.delete(productCategories).where(and(eq(productCategories.id, id), eq(productCategories.tenantId, auth.tenantId))).returning({ id: productCategories.id });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
});
