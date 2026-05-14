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
    const dbUrl = (process.env.DATABASE_URL || 'NOT SET').replace(/:[^@]+@/, ':***@');
    const jwtSecret = process.env.ADMIN_JWT_SECRET ? 'SET (' + process.env.ADMIN_JWT_SECRET.substring(0, 4) + '...)' : 'NOT SET (using fallback)';

    if (!session) {
      return NextResponse.json({ error: 'NO SESSION', dbUrl, jwtSecret, hint: 'Cookie not sent or JWT verification failed' });
    }

    // Find leistungen hero
    const [page] = await db.select({ id: pages.id, slug: pages.slug, tenantId: pages.tenantId })
      .from(pages).where(and(eq(pages.slug, 'leistungen'), eq(pages.tenantId, session.tenantId)));

    if (!page) {
      return NextResponse.json({ session, dbUrl, jwtSecret, error: 'No leistungen page for this tenant' });
    }

    const sections = await db.select().from(pageSections)
      .where(and(eq(pageSections.pageId, page.id), eq(pageSections.tenantId, session.tenantId)))
      .orderBy(asc(pageSections.sortOrder));

    const hero = sections.find(s => s.type === 'hero');
    if (!hero) {
      return NextResponse.json({ session, dbUrl, jwtSecret, page, error: 'No hero section' });
    }

    // TEST: Update the hero headline
    const oldHeadline = (hero.data as any)?.headline;
    const testHeadline = 'DEBUG-WRITE-' + Date.now();
    const newData = { ...(hero.data as Record<string, unknown>), headline: testHeadline };

    const writeResult = await db.update(pageSections)
      .set({ data: newData, updatedAt: new Date() })
      .where(and(eq(pageSections.id, hero.id), eq(pageSections.tenantId, session.tenantId)))
      .returning({ id: pageSections.id });

    // Re-read immediately
    const [reread] = await db.select({ data: pageSections.data, updatedAt: pageSections.updatedAt })
      .from(pageSections).where(eq(pageSections.id, hero.id));

    const rereadHeadline = (reread.data as any)?.headline;

    // Restore original
    await db.update(pageSections)
      .set({ data: hero.data as Record<string, unknown> })
      .where(eq(pageSections.id, hero.id));

    return NextResponse.json({
      session,
      dbUrl,
      jwtSecret,
      heroId: hero.id,
      oldHeadline,
      testHeadline,
      writeResult: writeResult.length > 0 ? 'SUCCESS' : 'FAILED (0 rows)',
      rereadHeadline,
      writeVerified: rereadHeadline === testHeadline,
      restored: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.substring(0, 800) }, { status: 500 });
  }
}
