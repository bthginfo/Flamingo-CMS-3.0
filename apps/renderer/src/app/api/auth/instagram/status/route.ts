import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { instagramConnections, instagramPosts } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * Status of the current tenant's Instagram connection — used by the admin UI
 * to render "connected", "expired", or "not connected" states.
 *
 * Always returns 200 OK (never 500) so the admin panel doesn't go into an
 * error loop. DB errors (e.g. missing tables before migration runs) are
 * surfaced via { connected: false, error: '...' } so the UI can still
 * render the connect button.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Likely the migration hasn't been applied yet (relation does not exist).
    // Surface a clear error to the admin instead of a 500 cascade.
    console.error('[instagram/status] error:', message);
    const isMissingTable = /relation .* does not exist|no such table/i.test(message);
    return NextResponse.json(
      {
        connected: false,
        error: isMissingTable ? 'migration_pending' : 'db_error',
        detail: message.slice(0, 300),
      },
      { status: 200 },
    );
  }
}
