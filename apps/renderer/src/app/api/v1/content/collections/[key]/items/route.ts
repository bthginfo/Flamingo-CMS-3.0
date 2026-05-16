import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collections, collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key } = await params;
  const db = getDb();

  const [collection] = await db.select().from(collections).where(and(eq(collections.tenantId, auth.tenantId), eq(collections.key, key)));
  if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });

  const { title, slug, data, published } = await req.json();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const itemSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = crypto.randomUUID();

  await db.insert(collectionItems).values({
    id,
    tenantId: auth.tenantId,
    collectionId: collection.id,
    title,
    slug: itemSlug,
    data: data || {},
    published: published ?? false,
  });

  return NextResponse.json({ id, slug: itemSlug }, { status: 201 });
}
