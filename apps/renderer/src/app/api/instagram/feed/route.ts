import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { resolveTenantByHost } from '@/lib/tenant-host';

export const dynamic = 'force-dynamic';

/**
 * Public, host-scoped Instagram feed for the renderer. Resolves the tenant
 * from the request Host (matches tenantDomains), returns at most `limit`
 * cached posts. Caches for 5 minutes at the CDN; sync happens server-side.
 */
export async function GET(req: NextRequest) {
  const tenantId = await resolveTenantByHost();
  if (!tenantId) return NextResponse.json({ connected: false, posts: [] });

  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '12'), 1), 50);

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
}
