import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSessionToken } from '@flamingo/auth';

const DEMO_TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

export async function GET(request: NextRequest) {
  const token = await createSessionToken(DEMO_TENANT_ID);
  const origin = request.nextUrl.origin;
  const target = `${origin}/admin/pages`;

  // Return an HTML page that sets the cookie and then redirects.
  // This ensures the browser stores the cookie before navigating.
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Demo Login</title></head><body>
<script>document.cookie="flamingo_demo=1;path=/admin;max-age=3600;secure;samesite=none";</script>
<p>Redirecting...</p>
<meta http-equiv="refresh" content="0;url=${target}">
</body></html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  response.cookies.set('flamingo_admin_session', token, {
    path: '/admin',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });

  response.cookies.set('flamingo_demo', '1', {
    path: '/admin',
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });

  return response;
}
