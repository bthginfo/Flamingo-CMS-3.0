import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { products, productVariants, variantOptions, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveExplicitTenant(queryTenantId: string | null) {
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (!queryTenantId || !UUID_RE.test(queryTenantId)) return null;
  if (fixedTenantId) return queryTenantId === fixedTenantId ? queryTenantId : null;
  return queryTenantId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const queryTenantId = req.nextUrl.searchParams.get('tenantId');
  const tenantId = resolveExplicitTenant(queryTenantId) || await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const db = getDb();

  const [product] = await db.select()
    .from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.slug, slug), eq(products.status, 'active')));

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [variants, options] = await Promise.all([
    db.select().from(productVariants).where(eq(productVariants.productId, product.id)),
    db.select().from(variantOptions).where(eq(variantOptions.productId, product.id)),
  ]);

  let category = null;
  if (product.categoryId) {
    const [cat] = await db.select({ name: productCategories.name, slug: productCategories.slug })
      .from(productCategories).where(eq(productCategories.id, product.categoryId));
    category = cat ?? null;
  }

  return NextResponse.json({
    product: { ...product, images: product.images ?? [], categoryName: category?.name, categorySlug: category?.slug },
    variants,
    options,
  });
}
