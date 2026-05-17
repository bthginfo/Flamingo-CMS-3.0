import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDb();

    // Get all pages to revalidate their paths
    const allPages = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.tenantId, auth.tenantId));

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

    return NextResponse.json({ success: true, message: 'Published successfully', pagesRevalidated: allPages.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /publish error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
