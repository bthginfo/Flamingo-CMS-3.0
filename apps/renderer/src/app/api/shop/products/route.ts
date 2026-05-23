import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';

export async function GET(request: NextRequest) {
  const tenantId = await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 100);
  const categoryFilter = searchParams.get('category') || '';
  const idsParam = searchParams.get('ids') || '';

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
  let mapped = allProducts.map(p => ({
    ...p,
    images: p.images ?? [],
    categoryName: p.categoryId ? catMap.get(p.categoryId)?.name : undefined,
    categorySlug: p.categoryId ? catMap.get(p.categoryId)?.slug : undefined,
  }));

  // Filter by category slug
  if (categoryFilter) {
    mapped = mapped.filter(p => p.categorySlug === categoryFilter);
  }

  // Filter by explicit IDs
  if (idsParam) {
    const ids = idsParam.split(',').map(s => s.trim());
    mapped = mapped.filter(p => ids.includes(p.id));
  }

  return NextResponse.json({ products: mapped.slice(0, limit), categories: allCategories });
}
