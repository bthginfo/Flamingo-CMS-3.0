import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/crm/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('flamingo_crm_session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/crm/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/crm/:path*'],
};
