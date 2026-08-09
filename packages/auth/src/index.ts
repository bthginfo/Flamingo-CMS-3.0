import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SALT_ROUNDS = 12;
export const BCRYPT_MAX_PASSWORD_BYTES = 72;
import { SESSION_COOKIE_NAME as COOKIE_NAME } from './cookie';
const JWT_ALG = 'HS256';

// ─── Password hashing ───────────────────────────────────────────────
export function getPasswordByteLength(plain: string): number {
  return Buffer.byteLength(plain, 'utf8');
}

export function isPasswordWithinBcryptLimit(plain: string): boolean {
  return getPasswordByteLength(plain) <= BCRYPT_MAX_PASSWORD_BYTES;
}

export async function hashPassword(plain: string): Promise<string> {
  if (!isPasswordWithinBcryptLimit(plain)) {
    throw new RangeError(`Password exceeds bcrypt's ${BCRYPT_MAX_PASSWORD_BYTES}-byte UTF-8 limit.`);
  }
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!isPasswordWithinBcryptLimit(plain)) return false;
  return bcrypt.compare(plain, hash);
}

// ─── JWT session token ──────────────────────────────────────────────
function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) {
    throw new Error('[Flamingo Auth] ADMIN_JWT_SECRET is not set. Refusing to start without a secure secret. Set ADMIN_JWT_SECRET in your environment.');
  }
  return new TextEncoder().encode(s);
}

export type SessionRole = 'admin' | 'demo';
export type SessionClaims = { tenantId: string; role: SessionRole; sessionVersion: number };

export async function createSessionToken(
  tenantId: string,
  ttl: string | number = '7d',
  role: SessionRole = 'admin',
  sessionVersion = 0,
): Promise<string> {
  if (!Number.isSafeInteger(sessionVersion) || sessionVersion < 0) {
    throw new RangeError('sessionVersion must be a non-negative safe integer.');
  }
  return new SignJWT({ tenantId, role, sessionVersion })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.tenantId !== 'string' || !payload.tenantId) return null;
    if (payload.role !== 'admin' && payload.role !== 'demo') return null;
    // Tokens issued before session-version revocation was introduced are
    // version zero. Once a tenant is revoked, they no longer match.
    const sessionVersion = payload.sessionVersion ?? 0;
    if (!Number.isSafeInteger(sessionVersion) || (sessionVersion as number) < 0) return null;
    return { tenantId: payload.tenantId, role: payload.role, sessionVersion: sessionVersion as number };
  } catch {
    return null;
  }
}

// ─── Cookie helpers ─────────────────────────────────────────────────
export { getSessionCookieName, SESSION_COOKIE_NAME } from './cookie';

export function buildSessionCookie(token: string, isProduction: boolean): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
