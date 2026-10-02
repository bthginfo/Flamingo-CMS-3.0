import { withApiHandler } from '@/lib/api-utils';
import { validateProductInput } from '@/lib/shop-api-input';
import { readApiJsonObject } from '@/lib/api-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const GET = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const items = await db.select().from(products).where(eq(products.tenantId, auth.tenantId));
  return NextResponse.json({ products: items });
});

export const POST = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await readApiJsonObject(req);
  validateProductInput(body, true);
  const { title, slug, categoryId, description, shortDescription, priceCents, comparePriceCents, images, stock, status, highlights } = body;
  if (!title || !slug || priceCents == null) return NextResponse.json({ error: 'title, slug, and priceCents required' }, { status: 400 });

  const db = getDb();
  if (categoryId) {
    const [category] = await db.select({ id: productCategories.id }).from(productCategories)
      .where(and(eq(productCategories.id, categoryId), eq(productCategories.tenantId, auth.tenantId))).limit(1);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  const [product] = await db.insert(products).values({
    tenantId: auth.tenantId,
    title,
    slug,
    categoryId: categoryId || null,
    description: description || null,
    shortDescription: shortDescription || null,
    priceCents,
    comparePriceCents: comparePriceCents ?? null,
    images: images || [],
    stock: stock ?? 0,
    status: status || 'active',
    highlights: highlights || [],
  }).returning();

  return NextResponse.json({ product }, { status: 201 });
});
