import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createCrmApiUnauthorizedResponse } from './lib/crm-api-auth';
import { hasValidCrmClaims } from './lib/crm-session-claims';

async function getSecret() {
  const dedicated = process.env.CRM_JWT_SECRET?.trim();
  if (dedicated && dedicated.length >= 32) return new TextEncoder().encode(dedicated);

  const rootSecret = process.env.ADMIN_JWT_SECRET?.trim();
  if (!rootSecret || rootSecret.length < 32) return null;
  const rootKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(rootSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return new Uint8Array(await crypto.subtle.sign(
    'HMAC',
    rootKey,
    new TextEncoder().encode('flamingo:crm-session:v1'),
  ));
}

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyHs256Jwt(token: string, secret: Uint8Array) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return false;

  const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader))) as { alg?: string };
  if (header.alg !== 'HS256') return false;

  const secretBuffer = new ArrayBuffer(secret.byteLength);
  new Uint8Array(secretBuffer).set(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
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

  const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload))) as unknown;
  return hasValidCrmClaims(payload);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/crm/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('flamingo_crm_session')?.value;
  const secret = await getSecret();
  if (!token || !secret) {
    const apiResponse = createCrmApiUnauthorizedResponse(pathname);
    if (apiResponse) return apiResponse;
    return NextResponse.redirect(new URL('/crm/login', request.url));
  }

  try {
    if (!(await verifyHs256Jwt(token, secret))) throw new Error('Invalid CRM session');
  } catch {
    const apiResponse = createCrmApiUnauthorizedResponse(pathname);
    if (apiResponse) return apiResponse;
    const response = NextResponse.redirect(new URL('/crm/login', request.url));
    response.cookies.delete('flamingo_crm_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/crm/:path*'],
};
