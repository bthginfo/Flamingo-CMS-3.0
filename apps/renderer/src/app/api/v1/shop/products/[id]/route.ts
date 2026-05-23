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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

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
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const { id } = await params;
  const db = getDb();
  await db.delete(products).where(and(eq(products.id, id), eq(products.tenantId, auth.tenantId)));
  return NextResponse.json({ ok: true });
}
