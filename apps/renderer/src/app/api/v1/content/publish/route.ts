import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, publishedSnapshots, publishHistory } from '@flamingo/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createHash } from 'crypto';
import { getDraftSnapshot } from '@/lib/snapshot';

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getDb();
    const snapshot = await getDraftSnapshot(auth.tenantId);
    if (!snapshot) return NextResponse.json({ error: 'No content to publish' }, { status: 400 });
    const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

    // Publishing intentionally has no editorial, completeness, or color
    // readiness gate. Only technical failures may prevent the snapshot switch.
    await db.update(pages).set({ status: 'published' }).where(eq(pages.tenantId, auth.tenantId));

    const [currentActive] = await db
      .select({
        id: publishedSnapshots.id,
        version: publishedSnapshots.version,
        checksum: publishedSnapshots.checksum,
      })
      .from(publishedSnapshots)
      .where(and(
        eq(publishedSnapshots.tenantId, auth.tenantId),
        eq(publishedSnapshots.isActive, true),
      ))
      .orderBy(desc(publishedSnapshots.version))
      .limit(1);

    if (currentActive?.checksum !== checksum) {
      const [latest] = await db
        .select({ version: publishedSnapshots.version })
        .from(publishedSnapshots)
        .where(eq(publishedSnapshots.tenantId, auth.tenantId))
        .orderBy(desc(publishedSnapshots.version))
        .limit(1);

      const nextVersion = (latest?.version ?? 0) + 1;
      const [created] = await db.insert(publishedSnapshots).values({
        tenantId: auth.tenantId,
        version: nextVersion,
        snapshot: snapshot as unknown as Record<string, unknown>,
        checksum,
        createdBy: `pat:${auth.tokenId}`,
        isActive: false,
      }).returning({ id: publishedSnapshots.id });

      if (!created?.id) throw new Error('Published snapshot could not be created');

      await db.execute(sql`
        WITH deactivated AS (
          UPDATE published_snapshots
          SET is_active = false
          WHERE tenant_id = ${auth.tenantId} AND is_active = true AND id <> ${created.id}
          RETURNING id
        )
        UPDATE published_snapshots
        SET is_active = true
        WHERE id = ${created.id}
          AND tenant_id = ${auth.tenantId}
          AND (SELECT count(*) FROM deactivated) >= 0
      `);

      await db.insert(publishHistory).values({
        tenantId: auth.tenantId,
        snapshotId: created.id,
        previousSnapshotId: currentActive?.id ?? null,
        action: 'publish',
        note: 'Published via API',
      });
    }

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
