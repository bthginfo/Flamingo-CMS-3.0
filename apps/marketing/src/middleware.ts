import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSecret() {
  const secret = process.env.CRM_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  return secret || null;
}

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyHs256Jwt(token: string, secret: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return false;

  const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader))) as { alg?: string };
  if (header.alg !== 'HS256') return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  if (!valid) return false;

  const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload))) as { exp?: number; role?: string };
  if (payload.exp && payload.exp * 1000 < Date.now()) return false;
  return payload.role === 'crm_admin';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/crm/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('flamingo_crm_session')?.value;
  const secret = getSecret();
  if (!token || !secret) {
    return NextResponse.redirect(new URL('/crm/login', request.url));
  }

  try {
    if (!(await verifyHs256Jwt(token, secret))) throw new Error('Invalid CRM session');
  } catch {
    const response = NextResponse.redirect(new URL('/crm/login', request.url));
    response.cookies.delete('flamingo_crm_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/crm/:path*'],
};
