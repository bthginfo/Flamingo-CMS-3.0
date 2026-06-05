import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret') || '';
  if (!safeCompare(secret, process.env.REVALIDATE_SECRET || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optional ?tenant=<id> for surgical revalidation. Without it, we nuke
  // the whole tree (kept for back-compat with the old publish helper).
  const tenantId = request.nextUrl.searchParams.get('tenant');
  if (tenantId) {
    revalidateTag(`tenant-${tenantId}`);
    return NextResponse.json({ revalidated: true, scope: 'tenant', tenantId });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, scope: 'all', now: Date.now() });
}

