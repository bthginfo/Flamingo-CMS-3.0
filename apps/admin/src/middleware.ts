import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookieName } from '@flamingo/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page, demo-login and API routes
  if (pathname === '/admin/login' || pathname === '/admin/demo-login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
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
