import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';

export const dynamic = 'force-dynamic';

/**
 * Public Instagram feed. Resolves tenant via:
 *   1. Host header against tenant_domains (custom-domain tenants)
 *   2. ?slug=<tenant-slug> fallback (shared renderer with path-prefixed routing)
 *
 * Returns at most `limit` cached posts. 5-minute CDN cache.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '12'), 1), 50);
  const slug = url.searchParams.get('slug') || undefined;

  const tenantId = await resolveTenant(slug);
  if (!tenantId) return NextResponse.json({ connected: false, posts: [] });

  try {
    const db = getDb();
    const [conn] = await db
      .select({ username: instagramConnections.igUsername })
      .from(instagramConnections)
      .where(eq(instagramConnections.tenantId, tenantId))
      .limit(1);
    if (!conn) {
      return NextResponse.json({ connected: false, posts: [] });
    }

    const rows = await db
      .select({
        id: instagramPosts.id,
        mediaType: instagramPosts.mediaType,
        mediaUrl: instagramPosts.mediaUrl,
        thumbnailUrl: instagramPosts.thumbnailUrl,
        permalink: instagramPosts.permalink,
        caption: instagramPosts.caption,
        timestamp: instagramPosts.timestamp,
      })
      .from(instagramPosts)
      .where(and(eq(instagramPosts.tenantId, tenantId)))
      .orderBy(asc(instagramPosts.position))
      .limit(limit);

    return NextResponse.json(
      { connected: true, username: conn.username, posts: rows },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (err) {
    console.error('[instagram/feed] error:', err);
    return NextResponse.json({ connected: false, posts: [], error: 'db_error' });
  }
}
