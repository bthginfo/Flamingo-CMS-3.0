import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookieName } from '@flamingo/auth/cookie';

// Reject common exploit scans at the edge. The public catch-all otherwise
// resolves a tenant and snapshot for every random WordPress/PHP probe, which
// wastes database transfer even though Flamingo does not serve those paths.
const EXPLOIT_SCAN_PATH = /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|wp-admin(?:\/|$)|wp-content(?:\/|$)|wp-includes(?:\/|$)|xmlrpc\.php$|wp-login\.php$|vendor\/phpunit(?:\/|$)|[^/]+\.php$)/i;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (EXPLOIT_SCAN_PATH.test(pathname)) {
    return new NextResponse(null, {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    });
  }

  // The broader matcher is only needed for the cheap exploit-scan rejection.
  // Normal public pages must continue to the renderer without admin auth.
  if (!pathname.startsWith('/admin') && pathname !== '/live-preview') {
    return NextResponse.next();
  }

  // Allow login page, demo-login and API routes
  if (pathname === '/admin/login' || pathname === '/admin/demo-login' || pathname.startsWith('/api/')) {
    // If a tenant param is specified and user has an existing session from a different tenant,
    // clear the old session and redirect to clean login URL (preserving tenant as cookie hint)
    const tenantParam = searchParams.get('tenant');
    const existingToken = request.cookies.get(getSessionCookieName())?.value;
    if (tenantParam && existingToken) {
      const cleanUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.delete(getSessionCookieName());
      response.cookies.set('flamingo_login_tenant', tenantParam, { path: '/admin', maxAge: 300, httpOnly: false });
      return response;
    }
    return NextResponse.next();
  }

  // Handle demo token passed via URL (cross-origin iframe support).
  // Set same-origin cookies and redirect to strip the token from the URL.
  const demoToken = searchParams.get('_dt');
  if (demoToken) {
    const clean = new URL(request.url);
    clean.searchParams.delete('_dt');
    clean.searchParams.delete('_demo');
    clean.searchParams.delete('_demoTenant');
    const response = NextResponse.redirect(clean);
    response.cookies.set(getSessionCookieName(), demoToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60,
    });
    if (searchParams.get('_demo') === '1') {
      response.cookies.set('flamingo_public_demo', searchParams.get('_demoTenant') || 'public', {
        path: '/admin',
        httpOnly: false,
        sameSite: 'none',
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
