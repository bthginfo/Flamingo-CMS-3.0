import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { instagramConnections } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { verifyState } from '@/lib/instagram/state';
import { encryptToken } from '@/lib/instagram/cipher';
import {
  exchangeCodeForShortToken,
  exchangeShortForLongToken,
  fetchUserProfile,
} from '@/lib/instagram/graph';
import { syncConnection } from '@/lib/instagram/sync';

export const dynamic = 'force-dynamic';

function redirectBack(returnTo: string, params: Record<string, string>, req: NextRequest) {
  const base = new URL(returnTo || '/admin/pages', req.url);
  for (const [k, v] of Object.entries(params)) base.searchParams.set(k, v);
  return NextResponse.redirect(base);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorReason = url.searchParams.get('error_reason') || '';
  const rawState = url.searchParams.get('state') || '';

  const state = verifyState(rawState);
  // Fall back to /admin/pages if state is missing; we cannot trust the raw value
  const returnTo = state?.returnTo || '/admin/pages';

  if (error || !state) {
    return redirectBack(returnTo, {
      igConnected: '0',
      igError: error || 'invalid_state',
      igErrorReason: errorReason,
      ...(state?.sectionId ? { openSection: state.sectionId } : {}),
    }, req);
  }

  if (!code) {
    return redirectBack(returnTo, {
      igConnected: '0',
      igError: 'missing_code',
      openSection: state.sectionId,
    }, req);
  }

  try {
    // Exchange code → short-lived token → long-lived token
    const short = await exchangeCodeForShortToken(code);
    const long = await exchangeShortForLongToken(short.access_token);
    const profile = await fetchUserProfile(long.access_token);

    const db = getDb();
    const encrypted = encryptToken(long.access_token);
    const tokenExpiresAt = new Date(Date.now() + long.expires_in * 1000);

    // Upsert: one connection per tenant
    const [existing] = await db
      .select({ id: instagramConnections.id })
      .from(instagramConnections)
      .where(eq(instagramConnections.tenantId, state.tenantId))
      .limit(1);

    let connectionId: string;
    if (existing) {
      await db
        .update(instagramConnections)
        .set({
          igUserId: profile.id,
          igUsername: profile.username,
          igAccountType: profile.account_type,
          accessTokenEncrypted: encrypted,
          tokenExpiresAt,
          lastRefreshedAt: new Date(),
          syncStatus: 'ok',
          syncError: null,
          updatedAt: new Date(),
        })
        .where(eq(instagramConnections.id, existing.id));
      connectionId = existing.id;
    } else {
      const [inserted] = await db
        .insert(instagramConnections)
        .values({
          tenantId: state.tenantId,
          igUserId: profile.id,
          igUsername: profile.username,
          igAccountType: profile.account_type,
          accessTokenEncrypted: encrypted,
          tokenExpiresAt,
        })
        .returning({ id: instagramConnections.id });
      connectionId = inserted.id;
    }

    // Run an initial sync immediately so the user sees real posts as soon as
    // they land back in the editor. Errors are recorded on the connection row.
    const syncResult = await syncConnection(connectionId).catch(() => null);
    const importedCount = syncResult && 'ok' in syncResult && syncResult.ok ? syncResult.count : 0;

    return redirectBack(returnTo, {
      igConnected: '1',
      igImported: String(importedCount),
      openSection: state.sectionId,
    }, req);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown_error';
    return redirectBack(returnTo, {
      igConnected: '0',
      igError: 'exchange_failed',
      igErrorReason: msg.slice(0, 200),
      openSection: state.sectionId,
    }, req);
  }
}
