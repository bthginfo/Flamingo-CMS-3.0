import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';

export async function GET() {
  const tenantId = await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const db = getDb();

  const [allProducts, allCategories] = await Promise.all([
    db.select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      priceCents: products.priceCents,
      comparePriceCents: products.comparePriceCents,
      images: products.images,
      shortDescription: products.shortDescription,
      status: products.status,
      stock: products.stock,
      categoryId: products.categoryId,
      sortOrder: products.sortOrder,
    })
      .from(products)
      .where(and(eq(products.tenantId, tenantId), eq(products.status, 'active'))),
    db.select({
      id: productCategories.id,
      name: productCategories.name,
      slug: productCategories.slug,
      description: productCategories.description,
      image: productCategories.image,
    })
      .from(productCategories)
      .where(eq(productCategories.tenantId, tenantId)),
  ]);

  // Map category names onto products
  const catMap = new Map(allCategories.map(c => [c.id, c]));
  const mapped = allProducts.map(p => ({
    ...p,
    images: p.images ?? [],
    categoryName: p.categoryId ? catMap.get(p.categoryId)?.name : undefined,
    categorySlug: p.categoryId ? catMap.get(p.categoryId)?.slug : undefined,
  }));

  return NextResponse.json({ products: mapped, categories: allCategories });
}
