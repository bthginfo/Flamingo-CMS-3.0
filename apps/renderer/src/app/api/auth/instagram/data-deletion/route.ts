import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { verifySignedRequest } from '@/lib/instagram/state';
import { deleteByIgUserId } from '@/lib/instagram/sync';

export const dynamic = 'force-dynamic';

/**
 * Data-Deletion Request callback. Meta calls this when a user requests
 * deletion of their data from third parties. We delete the user's stored
 * connection + posts and return a confirmation code + status URL so the user
 * can verify the request has been processed.
 * Docs: https://developers.facebook.com/docs/facebook-login/guides/data-deletion-request
 */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const signed = form?.get('signed_request');
  if (typeof signed !== 'string') return NextResponse.json({ error: 'missing signed_request' }, { status: 400 });
  const payload = verifySignedRequest(signed);
  if (!payload || !payload.user_id) return NextResponse.json({ error: 'invalid signature' }, { status: 400 });

  await deleteByIgUserId(payload.user_id);

  const code = createHash('sha256').update(`${payload.user_id}:${Date.now()}`).digest('hex').slice(0, 24);
  const origin = new URL(req.url).origin;

  return NextResponse.json({
    url: `${origin}/api/auth/instagram/data-deletion/status?code=${code}`,
    confirmation_code: code,
  });
}
