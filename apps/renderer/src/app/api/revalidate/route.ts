import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { verifyFwRevalidationOidcToken } from '@/lib/github-actions-oidc';

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret') || '';
  const authorization = request.headers.get('authorization') || '';
  const oidcToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
  const authorized = safeCompare(secret, process.env.REVALIDATE_SECRET || '')
    || await verifyFwRevalidationOidcToken(oidcToken);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optional ?tenant=<id> for surgical revalidation. Without it, we nuke
  // the whole tree (kept for back-compat with the old publish helper).
  const tenantId = request.nextUrl.searchParams.get('tenant');
  if (tenantId) {
    revalidateTag(`tenant-${tenantId}`);
    // This endpoint runs inside the standalone renderer. Invalidating the
    // layout also evicts full-route output that depended on the old snapshot.
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, scope: 'tenant', tenantId });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, scope: 'all', now: Date.now() });
}

