import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collections, collectionItems } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const cols = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId)).orderBy(asc(collections.key));
  
  const items = await db.select({
    id: collectionItems.id, collectionId: collectionItems.collectionId,
    title: collectionItems.title, slug: collectionItems.slug, published: collectionItems.published,
  }).from(collectionItems).where(eq(collectionItems.tenantId, auth.tenantId));

  return NextResponse.json(cols.map(c => ({
    id: c.id,
    key: c.key,
    label: c.label,
    items: items.filter(i => i.collectionId === c.id),
  })));
}
