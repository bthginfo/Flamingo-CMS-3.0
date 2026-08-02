import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getDraftSnapshot } from '@/lib/snapshot';
import { checksumPublishedSnapshot, publishSnapshotAtomically } from '@/lib/publish-snapshot';

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDb();
    const snapshot = await getDraftSnapshot(auth.tenantId);
    if (!snapshot) return NextResponse.json({ error: 'No content to publish' }, { status: 400 });
    // Publishing intentionally has no editorial, completeness, or color
    // readiness gate. The switch is nevertheless one serialized DB statement.
    await publishSnapshotAtomically(db, {
      tenantId: auth.tenantId,
      snapshot,
      checksum: checksumPublishedSnapshot(snapshot),
      createdBy: `pat:${auth.tokenId}`,
      publishDraftPages: true,
    });

    const allPages = await db
      .select({ slug: pages.slug })
      .from(pages)
      .where(eq(pages.tenantId, auth.tenantId));

    revalidateTag(`tenant-${auth.tenantId}`);
    revalidatePath('/', 'page');
    for (const page of allPages) {
      revalidatePath(page.slug ? `/${page.slug}` : '/', 'page');
    }
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Published successfully',
      pagesRevalidated: allPages.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /publish error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
