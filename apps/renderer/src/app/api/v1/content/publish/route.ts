import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq, asc } from 'drizzle-orm';
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
    for (const p of allPages) {
      const sections = await db.select({ type: pageSections.type, data: pageSections.data })
        .from(pageSections).where(eq(pageSections.pageId, p.id)).orderBy(asc(pageSections.sortOrder));
      if (sections.length === 0) {
        warnings.push(`Page "${p.title || p.slug}" has no sections`);
      }
      for (const s of sections) {
        const data = (s.data || {}) as Record<string, unknown>;
        const label = `"${p.title || p.slug}" → ${s.type}`;
        if (s.type === 'servicesGrid' && (!Array.isArray(data.services) || data.services.length === 0))
          warnings.push(`${label}: services array is empty`);
        if (s.type === 'faq' && (!Array.isArray(data.items) || data.items.length === 0))
          warnings.push(`${label}: items array is empty`);
        if (s.type === 'testimonials' && (!Array.isArray(data.items) || data.items.length === 0))
          warnings.push(`${label}: items array is empty`);
        if ((s.type === 'team' || s.type === 'teamShowcase' || s.type === 'doctorTeam') && (!Array.isArray(data.members || data.doctors) || ((data.members || data.doctors) as any[]).length === 0))
          warnings.push(`${label}: members/doctors array is empty`);
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
