import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { parsePublicTenantId, resolvePublicTenantId } from '@/lib/public-tenant';
import { isShopActive } from '@/lib/shop-pages';

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' };

function resolveTenantFromReferer(request: NextRequest) {
  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    const refererUrl = new URL(referer);
    return parsePublicTenantId(refererUrl.searchParams.get('tenant'));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const queryTenantId = request.nextUrl.searchParams.get('tenantId');
  const tenantId = await resolvePublicTenantId(queryTenantId || resolveTenantFromReferer(request));
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  if (!await isShopActive(tenantId)) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

  const { searchParams } = request.nextUrl;
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 100, 1), 100);
  const categoryFilter = (searchParams.get('category') || '').slice(0, 120);
  const idsParam = (searchParams.get('ids') || '').slice(0, 3_700);

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
    const ids = idsParam.split(',').map(s => s.trim()).filter(id => /^[0-9a-f-]{36}$/i.test(id)).slice(0, 100);
    mapped = mapped.filter(p => ids.includes(p.id));
  }

  return NextResponse.json({ products: mapped.slice(0, limit), categories: allCategories }, { headers: CACHE_HEADERS });
}
