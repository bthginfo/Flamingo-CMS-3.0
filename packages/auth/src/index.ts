import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SALT_ROUNDS = 12;
const COOKIE_NAME = 'flamingo_admin_session';
const JWT_ALG = 'HS256';

// ─── Password hashing ───────────────────────────────────────────────
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── JWT session token ──────────────────────────────────────────────
function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET || process.env.PREVIEW_SECRET || 'flamingo-dev-secret';
  return new TextEncoder().encode(s);
}

export async function createSessionToken(tenantId: string): Promise<string> {
  return new SignJWT({ tenantId })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<{ tenantId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { tenantId: payload.tenantId as string };
  } catch {
    return null;
  }
}

// ─── Cookie helpers ─────────────────────────────────────────────────
export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function buildSessionCookie(token: string, isProduction: boolean): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/admin`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`;
}
