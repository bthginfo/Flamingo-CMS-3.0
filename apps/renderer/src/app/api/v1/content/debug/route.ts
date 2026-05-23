import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, pageSections, collections, collectionItems } from '@flamingo/db';
import { eq, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const [allPages, allSections, allCollections, allItems] = await Promise.all([
    db.select().from(pages).where(eq(pages.tenantId, auth.tenantId)).orderBy(asc(pages.sortOrder)),
    db.select().from(pageSections).where(eq(pageSections.tenantId, auth.tenantId)).orderBy(asc(pageSections.sortOrder)),
    db.select().from(collections).where(eq(collections.tenantId, auth.tenantId)),
    db.select().from(collectionItems).where(eq(collectionItems.tenantId, auth.tenantId)).orderBy(asc(collectionItems.priority)),
  ]);

  return NextResponse.json({
    tenantId: auth.tenantId,
    generatedAt: new Date().toISOString(),
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id),
    })),
    collections: allCollections.map(c => ({
      ...c,
      items: allItems.filter(i => i.collectionId === c.id),
    })),
  }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
