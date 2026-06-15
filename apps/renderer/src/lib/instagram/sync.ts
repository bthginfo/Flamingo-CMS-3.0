import { and, eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { decryptToken, encryptToken } from './cipher';
import { fetchUserMedia, refreshLongToken, type IgMedia } from './graph';

/**
 * Pull latest media for a connection, upsert into instagram_posts, drop
 * anything that no longer exists upstream, and refresh the long-lived token
 * if it's within REFRESH_THRESHOLD_MS of expiry.
 */
const REFRESH_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function syncConnection(connectionId: string): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const db = getDb();
  const [conn] = await db
    .select()
    .from(instagramConnections)
    .where(eq(instagramConnections.id, connectionId))
    .limit(1);
  if (!conn) return { ok: false, error: 'connection not found' };

  let token = decryptToken(conn.accessTokenEncrypted);

  // Refresh the long-lived token if it's close to expiry
  const msUntilExpiry = new Date(conn.tokenExpiresAt).getTime() - Date.now();
  if (msUntilExpiry < REFRESH_THRESHOLD_MS) {
    try {
      const refreshed = await refreshLongToken(token);
      token = refreshed.access_token;
      await db
        .update(instagramConnections)
        .set({
          accessTokenEncrypted: encryptToken(token),
          tokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
          lastRefreshedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(instagramConnections.id, conn.id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await db
        .update(instagramConnections)
        .set({ syncStatus: 'token_error', syncError: msg, updatedAt: new Date() })
        .where(eq(instagramConnections.id, conn.id));
      return { ok: false, error: msg };
    }
  }

  let media: IgMedia[];
  try {
    media = await fetchUserMedia(token, 25);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .update(instagramConnections)
      .set({ syncStatus: 'fetch_error', syncError: msg, updatedAt: new Date() })
      .where(eq(instagramConnections.id, conn.id));
    return { ok: false, error: msg };
  }

  // Replace all posts for this connection (simpler than diffing — IDs are stable
  // but ordering changes and Meta may delete posts upstream).
  await db.delete(instagramPosts).where(eq(instagramPosts.connectionId, conn.id));
  if (media.length > 0) {
    await db.insert(instagramPosts).values(
      media.map((m, idx) => ({
        connectionId: conn.id,
        tenantId: conn.tenantId,
        igMediaId: m.id,
        mediaType: m.media_type,
        mediaUrl: m.media_url,
        thumbnailUrl: m.thumbnail_url ?? null,
        permalink: m.permalink,
        caption: m.caption ?? null,
        timestamp: new Date(m.timestamp),
        position: idx,
      })),
    );
  }

  await db
    .update(instagramConnections)
    .set({ lastSyncedAt: new Date(), syncStatus: 'ok', syncError: null, updatedAt: new Date() })
    .where(eq(instagramConnections.id, conn.id));

  return { ok: true, count: media.length };
}

export async function syncTenant(tenantId: string) {
  const db = getDb();
  const [conn] = await db
    .select({ id: instagramConnections.id })
    .from(instagramConnections)
    .where(eq(instagramConnections.tenantId, tenantId))
    .limit(1);
  if (!conn) return { ok: false as const, error: 'no connection' };
  return syncConnection(conn.id);
}

export async function syncAll() {
  const db = getDb();
  const all = await db.select({ id: instagramConnections.id }).from(instagramConnections);
  const results = await Promise.allSettled(all.map(c => syncConnection(c.id)));
  return {
    total: all.length,
    succeeded: results.filter(r => r.status === 'fulfilled' && (r.value as { ok: boolean }).ok).length,
    failed: results.filter(r => r.status === 'rejected' || !(r.status === 'fulfilled' && (r.value as { ok: boolean }).ok)).length,
  };
}

export async function disconnectTenant(tenantId: string) {
  const db = getDb();
  await db.delete(instagramConnections).where(eq(instagramConnections.tenantId, tenantId));
}

export async function deleteByIgUserId(igUserId: string) {
  const db = getDb();
  await db.delete(instagramConnections).where(eq(instagramConnections.igUserId, igUserId));
}

export { and, eq };
