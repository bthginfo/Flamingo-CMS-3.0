import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSessionToken } from '@flamingo/auth';

const DEMO_TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

export async function GET(request: NextRequest) {
  const token = await createSessionToken(DEMO_TENANT_ID);
  const target = new URL('/admin/pages', request.nextUrl.origin);
  // Pass token via URL so it works inside cross-origin iframes
  // where third-party cookies are blocked. The middleware will
  // pick up _dt, set the cookie same-origin, and redirect clean.
  target.searchParams.set('_dt', token);
  target.searchParams.set('_demo', '1');

  return NextResponse.redirect(target);
}
