import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, pageSections, collections, collectionItems } from '@flamingo/db';
import { eq, asc, and, inArray } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDb();

    // Set all pages to "published" status
    await db.update(pages).set({ status: 'published' }).where(eq(pages.tenantId, auth.tenantId));

    // Get all pages to revalidate their paths
    const allPages = await db.select({ id: pages.id, slug: pages.slug, title: pages.title }).from(pages).where(eq(pages.tenantId, auth.tenantId));

    // Build warnings by scanning sections for incomplete content
    const warnings: string[] = [];
    const allPageIds = allPages.map(p => p.id);
    const allSections = allPageIds.length > 0
      ? await db.select({ pageId: pageSections.pageId, type: pageSections.type, data: pageSections.data })
          .from(pageSections).where(inArray(pageSections.pageId, allPageIds)).orderBy(asc(pageSections.sortOrder))
      : [];
    const sectionsByPage = new Map<string, typeof allSections>();
    for (const s of allSections) { const arr = sectionsByPage.get(s.pageId) || []; arr.push(s); sectionsByPage.set(s.pageId, arr); }
    for (const p of allPages) {
      const sections = sectionsByPage.get(p.id) || [];
      if (sections.length === 0) {
        warnings.push(`Page "${p.title || p.slug}" has no sections`);
      }
      for (const s of sections) {
        const data = (s.data || {}) as Record<string, unknown>;
        const label = `"${p.title || p.slug}" → ${s.type}`;
        if (s.type === 'servicesGrid' && (!Array.isArray(data.manualCards) || data.manualCards.length === 0))
          warnings.push(`${label}: manualCards array is empty`);
        if (s.type === 'faq' && (!Array.isArray(data.items) || data.items.length === 0))
          warnings.push(`${label}: items array is empty`);
        if (s.type === 'testimonials' && (!Array.isArray(data.items) || data.items.length === 0))
          warnings.push(`${label}: items array is empty`);
        if ((s.type === 'team' || s.type === 'teamShowcase' || s.type === 'doctorTeam') && (!Array.isArray(data.members || data.doctors) || ((data.members || data.doctors) as any[]).length === 0))
          warnings.push(`${label}: members/doctors array is empty`);
      }
    }

    // Check collection items for missing images/excerpts (batch query)
    const allCollections = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId));
    const collectionIds = allCollections.map(c => c.id);
    const allColItems = collectionIds.length > 0
      ? await db.select().from(collectionItems).where(and(inArray(collectionItems.collectionId, collectionIds), eq(collectionItems.tenantId, auth.tenantId), eq(collectionItems.published, true)))
      : [];
    const itemsByCollection = new Map<string, typeof allColItems>();
    for (const item of allColItems) { const arr = itemsByCollection.get(item.collectionId) || []; arr.push(item); itemsByCollection.set(item.collectionId, arr); }
    for (const col of allCollections) {
      const items = itemsByCollection.get(col.id) || [];
      const withoutImage = items.filter(item => {
        const data = (item.data || {}) as Record<string, unknown>;
        if (data.image) return false;
        const sections = data.sections as Array<{ type: string; data: Record<string, unknown> }> | undefined;
        if (!sections) return true;
        const hero = sections.find(s => s.type === 'hero' || s.type === 'collectionHero');
        return !hero?.data?.backgroundImage && !hero?.data?.image;
      });
      if (withoutImage.length > 0) {
        warnings.push(`Collection "${col.label}" (${col.key}): ${withoutImage.length}/${items.length} published items have no image (set backgroundImage in hero section)`);
      }
    }

    // Invalidate the cached snapshot for this tenant
    revalidateTag(`tenant-${auth.tenantId}`);

    // Revalidate homepage
    revalidatePath('/', 'page');

    // Revalidate all page paths
    for (const p of allPages) {
      const path = p.slug ? `/${p.slug}` : '/';
      revalidatePath(path, 'page');
    }

    // Revalidate layout (nav/footer changes)
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Published successfully',
      pagesRevalidated: allPages.length,
      ...(warnings.length > 0 ? { warnings } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /publish error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
