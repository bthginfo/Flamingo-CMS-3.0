import { withApiHandler } from '@/lib/api-utils';
import { readApiJsonObject } from '@/lib/api-request-body';
import { categoryUpdates } from '@/lib/shop-api-input';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const GET = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const cats = await db.select().from(productCategories).where(eq(productCategories.tenantId, auth.tenantId));
  return NextResponse.json({ categories: cats });
});

export const POST = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await readApiJsonObject(req);
  categoryUpdates(body, true);
  const { name, slug, description, image } = body;
  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 });

  const db = getDb();
  const [cat] = await db.insert(productCategories).values({
    tenantId: auth.tenantId,
    name: name.trim(),
    slug: slug.trim(),
    description: description || null,
    image: image || null,
  }).returning();

  return NextResponse.json({ category: cat }, { status: 201 });
});
