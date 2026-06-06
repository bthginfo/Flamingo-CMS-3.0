import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Public Instagram feed. Resolves tenant via, in order:
 *   1. ?tenantId=<UUID>  — but only when a valid admin session for that tenant exists
 *      (used by the live preview inside the admin)
 *   2. Host header against tenant_domains (custom-domain tenants)
 *   3. ?slug=<tenant-slug> fallback (shared renderer with path-prefixed routing)
 *
 * Returns at most `limit` cached posts. 5-minute CDN cache on the public path.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '12'), 1), 50);
  const slug = url.searchParams.get('slug') || undefined;
  const queryTenantId = url.searchParams.get('tenantId') || undefined;

  let tenantId: string | null = null;
  let isAdminContext = false;

  // 1) Session-gated explicit tenantId — only honored when the admin session
  //    matches the requested tenant (prevents cross-tenant peeking).
  if (queryTenantId && UUID_RE.test(queryTenantId)) {
    const session = await getSession();
    if (session && session.tenantId === queryTenantId) {
      tenantId = queryTenantId;
      isAdminContext = true;
    }
  }

  // 2 + 3) Host / slug resolution for public requests
  if (!tenantId) tenantId = await resolveTenant(slug);
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

    // Admin live-preview must never see stale CDN copies.
    const cacheHeaders = isAdminContext
      ? { 'Cache-Control': 'no-store' }
      : { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

    return NextResponse.json(
      { connected: true, username: conn.username, posts: rows },
      { headers: cacheHeaders },
    );
  } catch (err) {
    console.error('[instagram/feed] error:', err);
    return NextResponse.json({ connected: false, posts: [], error: 'db_error' });
  }
}
