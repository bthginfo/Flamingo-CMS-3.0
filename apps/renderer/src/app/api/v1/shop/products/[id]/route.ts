import { withApiHandlerParams } from '@/lib/api-utils';
import { validateProductInput } from '@/lib/shop-api-input';
import { readApiJsonObject } from '@/lib/api-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const PUT = withApiHandlerParams(async (req, auth, params) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = params;
  const body = await readApiJsonObject(req);
  validateProductInput(body);
  const db = getDb();

  if (body.categoryId) {
    const [category] = await db.select({ id: productCategories.id }).from(productCategories)
      .where(and(eq(productCategories.id, body.categoryId), eq(productCategories.tenantId, auth.tenantId))).limit(1);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
  if (body.priceCents !== undefined) updateData.priceCents = body.priceCents;
  if (body.comparePriceCents !== undefined) updateData.comparePriceCents = body.comparePriceCents;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.stock !== undefined) updateData.stock = body.stock;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.highlights !== undefined) updateData.highlights = body.highlights;

  const [updated] = await db.update(products)
    .set(updateData)
    .where(and(eq(products.id, id), eq(products.tenantId, auth.tenantId)))
    .returning();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: updated });
});

export const DELETE = withApiHandlerParams(async (req, auth, params) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = params;
  const db = getDb();
  const [deleted] = await db.delete(products).where(and(eq(products.id, id), eq(products.tenantId, auth.tenantId))).returning({ id: products.id });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
});
