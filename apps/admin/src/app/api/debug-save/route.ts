import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { pageSections, pages } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const session = await getSession();
    const db = getDb();
    
    // Check env
    const dbUrl = process.env.DATABASE_URL || 'NOT SET';
    const maskedUrl = dbUrl.replace(/:[^@]+@/, ':***@');
    
    // Try to read sections
    const allPages = await db.select({ id: pages.id, slug: pages.slug, tenantId: pages.tenantId })
      .from(pages)
      .where(eq(pages.slug, 'leistungen'));

    let heroData = null;
    if (allPages.length > 0) {
      const sections = await db.select({
        id: pageSections.id,
        type: pageSections.type,
        data: pageSections.data,
        updatedAt: pageSections.updatedAt,
        tenantId: pageSections.tenantId,
      }).from(pageSections)
        .where(and(eq(pageSections.pageId, allPages[0].id)))
        .orderBy(asc(pageSections.sortOrder));
      
      const hero = sections.find(s => s.type === 'hero');
      heroData = hero ? {
        id: hero.id,
        headline: (hero.data as any)?.headline,
        updatedAt: hero.updatedAt,
        tenantId: hero.tenantId,
      } : null;
    }

    // Test write
    let writeTest = 'SKIPPED';
    if (heroData && session) {
      const testResult = await db.update(pageSections)
        .set({ updatedAt: new Date() })
        .where(and(eq(pageSections.id, heroData.id), eq(pageSections.tenantId, session.tenantId)))
        .returning({ id: pageSections.id });
      writeTest = testResult.length > 0 ? 'SUCCESS' : 'FAILED - 0 rows (tenant mismatch?)';
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      dbUrl: maskedUrl,
      session: session ? { tenantId: session.tenantId } : null,
      page: allPages[0] || null,
      hero: heroData,
      writeTest,
      pageHasSameTenant: allPages[0]?.tenantId === session?.tenantId,
      heroHasSameTenant: heroData?.tenantId === session?.tenantId,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.substring(0, 500) }, { status: 500 });
  }
}
