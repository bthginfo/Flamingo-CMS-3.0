import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { signState } from '@/lib/instagram/state';
import { buildAuthorizeUrl } from '@/lib/instagram/graph';

export const dynamic = 'force-dynamic';

/**
 * Start the Instagram OAuth flow. Requires an authenticated admin session.
 * Caller passes `sectionId`, `pageId`, and `returnTo` so the callback can
 * redirect the admin straight back into the section that initiated the flow.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const sectionId = url.searchParams.get('sectionId') || '';
  const pageId = url.searchParams.get('pageId') || '';
  const returnTo = url.searchParams.get('returnTo') || '/admin/pages';

  // Defensive: only allow relative paths to prevent open-redirect
  const safeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/admin/pages';

  const state = signState({ tenantId: session.tenantId, sectionId, pageId, returnTo: safeReturnTo });
  const authorizeUrl = buildAuthorizeUrl(state);

  return NextResponse.redirect(authorizeUrl);
}
