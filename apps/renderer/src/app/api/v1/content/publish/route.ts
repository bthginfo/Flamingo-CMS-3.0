import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, pageSections, collections, collectionItems, globalSettings } from '@flamingo/db';
import { publishedSnapshots, publishHistory } from '@flamingo/db';
import { eq, asc, and, inArray, desc } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createHash } from 'crypto';
import { getDraftSnapshot } from '@/lib/snapshot';
import {
  validateDesignPayload,
  validateBrandPayload,
  validateSectionStyleOverrides,
  type ColorIssue,
} from '@/lib/color-validation';

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDb();

    const snapshot = await getDraftSnapshot(auth.tenantId);
    if (!snapshot) return NextResponse.json({ error: 'No content to publish' }, { status: 400 });
    const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

    await db.transaction(async (tx) => {
      await tx.update(pages).set({ status: 'published' }).where(eq(pages.tenantId, auth.tenantId));

      const [currentActive] = await tx
        .select({ id: publishedSnapshots.id, version: publishedSnapshots.version, checksum: publishedSnapshots.checksum })
        .from(publishedSnapshots)
        .where(and(eq(publishedSnapshots.tenantId, auth.tenantId), eq(publishedSnapshots.isActive, true)))
        .orderBy(desc(publishedSnapshots.version))
        .limit(1);

      if (currentActive?.checksum === checksum) return;

      const [latest] = await tx
        .select({ version: publishedSnapshots.version })
        .from(publishedSnapshots)
        .where(eq(publishedSnapshots.tenantId, auth.tenantId))
        .orderBy(desc(publishedSnapshots.version))
        .limit(1);

      await tx.update(publishedSnapshots)
        .set({ isActive: false })
        .where(and(eq(publishedSnapshots.tenantId, auth.tenantId), eq(publishedSnapshots.isActive, true)));

      const nextVersion = (latest?.version ?? 0) + 1;
      const [created] = await tx.insert(publishedSnapshots).values({
        tenantId: auth.tenantId,
        version: nextVersion,
        snapshot: snapshot as unknown as Record<string, unknown>,
        checksum,
        createdBy: `pat:${auth.tokenId}`,
        isActive: true,
      }).returning({ id: publishedSnapshots.id });

      if (!created?.id) throw new Error('Published snapshot could not be created');

      await tx.insert(publishHistory).values({
        tenantId: auth.tenantId,
        snapshotId: created.id,
        previousSnapshotId: currentActive?.id ?? null,
        action: 'publish',
        note: 'Published via API',
      });
    });

    // Get all pages to revalidate their paths
    const allPages = await db.select({ id: pages.id, slug: pages.slug, title: pages.title }).from(pages).where(eq(pages.tenantId, auth.tenantId));

    // Build warnings by scanning sections for incomplete content
    const warnings: string[] = [];
    const colorWarnings: ColorIssue[] = [];

    // ── Brand + design color audit ────────────────────────────────────────
    const [settingsRow] = await db
      .select({ brand: globalSettings.brand, design: globalSettings.design })
      .from(globalSettings)
      .where(eq(globalSettings.tenantId, auth.tenantId));
    if (settingsRow?.brand && typeof settingsRow.brand === 'object') {
      colorWarnings.push(...validateBrandPayload(settingsRow.brand as Record<string, unknown>));
    }
    if (settingsRow?.design && typeof settingsRow.design === 'object') {
      colorWarnings.push(...validateDesignPayload(settingsRow.design as Record<string, unknown>));
    }
    const allPageIds = allPages.map(p => p.id);
    const allSections = allPageIds.length > 0
      ? await db.select({ pageId: pageSections.pageId, type: pageSections.type, data: pageSections.data, styleOverrides: pageSections.styleOverrides })
          .from(pageSections).where(inArray(pageSections.pageId, allPageIds)).orderBy(asc(pageSections.sortOrder))
      : [];
    const sectionsByPage = new Map<string, typeof allSections>();
    for (const s of allSections) { const arr = sectionsByPage.get(s.pageId) || []; arr.push(s); sectionsByPage.set(s.pageId, arr); }
    for (const p of allPages) {
      const sections = sectionsByPage.get(p.id) || [];
      if (sections.length === 0) {
        warnings.push(`Page "${p.title || p.slug}" has no sections`);
      }
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
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
        // Section-level color/contrast audit
        if (s.styleOverrides && typeof s.styleOverrides === 'object') {
          const issues = validateSectionStyleOverrides(i, s.type, s.styleOverrides as Record<string, unknown>);
          for (const issue of issues) {
            // Prefix the existing location with the page name so the AI sees
            // which page each warning belongs to.
            colorWarnings.push({ ...issue, location: `${p.title || p.slug} → ${issue.location ?? `sections[${i}]`}` });
          }
        }
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
        return !hero?.data?.backgroundImage && !hero?.data?.bgImage && !hero?.data?.image;
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
      ...(colorWarnings.length > 0 ? { colorWarnings } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /publish error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
