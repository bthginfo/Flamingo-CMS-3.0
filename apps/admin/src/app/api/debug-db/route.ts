import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pageSections, pages } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const dbUrl = process.env.DATABASE_URL?.replace(/:[^@]+@/, ':***@') || 'NOT SET';
    
    // Find leistungen page hero
    const allPages = await db.select({ id: pages.id, slug: pages.slug }).from(pages).where(eq(pages.slug, 'leistungen'));
    if (allPages.length === 0) {
      return NextResponse.json({ error: 'No leistungen page', dbUrl });
    }
    
    const sections = await db.select({
      id: pageSections.id,
      type: pageSections.type,
      data: pageSections.data,
      updatedAt: pageSections.updatedAt,
    }).from(pageSections).where(and(eq(pageSections.pageId, allPages[0].id))).orderBy(asc(pageSections.sortOrder));
    
    const hero = sections.find(s => s.type === 'hero');
    
    return NextResponse.json({
      dbUrl,
      pageId: allPages[0].id,
      heroId: hero?.id,
      heroHeadline: (hero?.data as any)?.headline,
      heroUpdatedAt: hero?.updatedAt,
      sectionCount: sections.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.slice(0, 500) }, { status: 500 });
  }
}
