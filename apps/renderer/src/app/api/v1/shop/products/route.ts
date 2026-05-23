import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { products, tenantAddons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

async function checkShop(tenantId: string) {
  const db = getDb();
  const [addon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')));
  return addon?.active === true;
}

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const items = await db.select().from(products).where(eq(products.tenantId, auth.tenantId));
  return NextResponse.json({ products: items });
}

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await req.json();
  const { title, slug, categoryId, description, shortDescription, priceCents, comparePriceCents, images, stock, status, highlights } = body;
  if (!title || !slug || priceCents == null) return NextResponse.json({ error: 'title, slug, and priceCents required' }, { status: 400 });

  const db = getDb();
  const [product] = await db.insert(products).values({
    tenantId: auth.tenantId,
    title,
    slug,
    categoryId: categoryId || null,
    description: description || null,
    shortDescription: shortDescription || null,
    priceCents,
    comparePriceCents: comparePriceCents || null,
    images: images || [],
    stock: stock ?? 0,
    status: status || 'active',
    highlights: highlights || [],
  }).returning();

  return NextResponse.json({ product }, { status: 201 });
}
