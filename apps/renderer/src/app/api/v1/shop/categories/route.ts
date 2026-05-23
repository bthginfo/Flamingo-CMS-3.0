import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { productCategories, tenantAddons } from '@flamingo/db';
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
  const cats = await db.select().from(productCategories).where(eq(productCategories.tenantId, auth.tenantId));
  return NextResponse.json({ categories: cats });
}

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, image } = body;
  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 });

  const db = getDb();
  const [cat] = await db.insert(productCategories).values({
    tenantId: auth.tenantId,
    name,
    slug,
    description: description || null,
    image: image || null,
  }).returning();

  return NextResponse.json({ category: cat }, { status: 201 });
}
