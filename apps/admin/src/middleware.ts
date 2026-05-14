import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookieName } from '@flamingo/auth';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow login page, demo-login and API routes
  if (pathname === '/admin/login' || pathname === '/admin/demo-login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle demo token passed via URL (cross-origin iframe support).
  // Set same-origin cookies and redirect to strip the token from the URL.
  const demoToken = searchParams.get('_dt');
  if (demoToken) {
    const clean = new URL(request.url);
    clean.searchParams.delete('_dt');
    clean.searchParams.delete('_demo');
    const response = NextResponse.redirect(clean);
    response.cookies.set(getSessionCookieName(), demoToken, {
      path: '/admin',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60,
    });
    if (searchParams.get('_demo') === '1') {
      response.cookies.set('flamingo_demo', '1', {
        path: '/admin',
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60,
      });
    }
    return response;
  }

  // Check for session cookie (actual JWT validation happens server-side)
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
