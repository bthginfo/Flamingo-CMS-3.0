import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts, tenants } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { resolveTenant, resolveDemoTenantBySlug } from '@/lib/snapshot';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9-]{1,64}$/;

/**
 * Public Instagram feed. Resolves the tenant whose feed should be shown via,
 * in order:
 *   1. ?tenantId=<UUID>  — but only when a valid admin session for that tenant
 *      exists (used by the live preview inside the admin)
 *   2. Host header against tenant_domains (custom-domain tenants)
 *   3. ?slug=<tenant-slug> fallback (shared renderer with path-prefixed routing)
 *
 * Source override (for demo / showcase pages that don't own an IG connection):
 *   • ?fromSlug=<demo-tenant-slug> — explicit per-section override, only
 *     honored when the source tenant has isDemo=true (prevents cross-tenant
 *     content scraping).
 *   • DEMO_IG_FALLBACK_SLUG env var — automatic fallback for any demo tenant
 *     that has no own connection. Lets all demo industries borrow a single
 *     curated feed without per-tenant OAuth.
 *
 * Returns at most `limit` cached posts. 5-minute CDN cache on the public path.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '12'), 1), 50);
  const slug = url.searchParams.get('slug') || undefined;
  const queryTenantId = url.searchParams.get('tenantId') || undefined;
  const fromSlugRaw = url.searchParams.get('fromSlug') || undefined;
  const fromSlug = fromSlugRaw && SLUG_RE.test(fromSlugRaw) ? fromSlugRaw : undefined;

  let viewerTenantId: string | null = null;
  let isAdminContext = false;

  // 1) Session-gated explicit tenantId — only honored when the admin session
  //    matches the requested tenant (prevents cross-tenant peeking).
  if (queryTenantId && UUID_RE.test(queryTenantId)) {
    const session = await getSession();
    if (session && session.tenantId === queryTenantId) {
      viewerTenantId = queryTenantId;
      isAdminContext = true;
    }
  }

  // 2 + 3) Host / slug resolution for public requests
  if (!viewerTenantId) viewerTenantId = await resolveTenant(slug);

  try {
    const db = getDb();

    // Determine which tenant we actually pull posts from.
    // Default: the viewer tenant itself. Demos may borrow another demo's feed.
    let sourceTenantId: string | null = viewerTenantId;
    let usedFallback = false;

    // Explicit override has highest priority (validated as demo).
    if (fromSlug) {
      const overrideId = await resolveDemoTenantBySlug(fromSlug);
      if (overrideId) {
        sourceTenantId = overrideId;
        usedFallback = true;
      }
    }

    // Look up the connection for the chosen source tenant.
    let conn: { username: string } | undefined;
    if (sourceTenantId) {
      [conn] = await db
        .select({ username: instagramConnections.igUsername })
        .from(instagramConnections)
        .where(eq(instagramConnections.tenantId, sourceTenantId))
        .limit(1);
    }

    // Auto-fallback: if no connection found AND DEMO_IG_FALLBACK_SLUG is set,
    // borrow that demo tenant's feed. Triggers either when:
    //   • the viewer is a demo tenant with no own connection, OR
    //   • there is no viewer tenant at all (showcase / section-preview pages
    //     that render sections out-of-context for marketing purposes).
    if (!conn && !usedFallback && process.env.DEMO_IG_FALLBACK_SLUG) {
      let allowFallback = !viewerTenantId; // no-tenant context (preview/showcase)
      if (viewerTenantId) {
        const [viewer] = await db
          .select({ isDemo: tenants.isDemo })
          .from(tenants)
          .where(eq(tenants.id, viewerTenantId))
          .limit(1);
        allowFallback = !!viewer?.isDemo;
      }
      if (allowFallback) {
        const fallbackId = await resolveDemoTenantBySlug(process.env.DEMO_IG_FALLBACK_SLUG);
        if (fallbackId && fallbackId !== viewerTenantId) {
          sourceTenantId = fallbackId;
          usedFallback = true;
          [conn] = await db
            .select({ username: instagramConnections.igUsername })
            .from(instagramConnections)
            .where(eq(instagramConnections.tenantId, sourceTenantId))
            .limit(1);
        }
      }
    }

    if (!sourceTenantId) {
      return NextResponse.json({ connected: false, posts: [] });
    }

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
      .where(and(eq(instagramPosts.tenantId, sourceTenantId)))
      .orderBy(asc(instagramPosts.position))
      .limit(limit);

    // Admin live-preview must never see stale CDN copies.
    const cacheHeaders = isAdminContext
      ? { 'Cache-Control': 'no-store' }
      : { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

    return NextResponse.json(
      { connected: true, username: conn.username, posts: rows, fallback: usedFallback || undefined },
      { headers: cacheHeaders },
    );
  } catch (err) {
    console.error('[instagram/feed] error:', err);
    return NextResponse.json({ connected: false, posts: [], error: 'db_error' });
  }
}
