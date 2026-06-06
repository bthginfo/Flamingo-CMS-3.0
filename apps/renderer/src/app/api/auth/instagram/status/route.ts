import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * Status of the current tenant's Instagram connection — used by the admin UI
 * to render "connected", "expired", or "not connected" states.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const [conn] = await db
    .select()
    .from(instagramConnections)
    .where(eq(instagramConnections.tenantId, session.tenantId))
    .limit(1);

  if (!conn) return NextResponse.json({ connected: false });

  const postsCount = await db
    .select({ id: instagramPosts.id })
    .from(instagramPosts)
    .where(eq(instagramPosts.connectionId, conn.id));

  return NextResponse.json({
    connected: true,
    username: conn.igUsername,
    accountType: conn.igAccountType,
    tokenExpiresAt: conn.tokenExpiresAt,
    lastSyncedAt: conn.lastSyncedAt,
    syncStatus: conn.syncStatus,
    syncError: conn.syncError,
    postsCount: postsCount.length,
  });
}
