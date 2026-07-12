import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { hasValidCrmClaims } from './crm-session-claims';

const COOKIE_NAME = 'flamingo_crm_session';
const JWT_ALG = 'HS256';

function getSecret() {
  const dedicated = process.env.CRM_JWT_SECRET?.trim();
  if (dedicated && dedicated.length >= 32) {
    return new TextEncoder().encode(dedicated);
  }

  const rootSecret = process.env.ADMIN_JWT_SECRET?.trim();
  if (!rootSecret || rootSecret.length < 32) {
    throw new Error('[Flamingo CRM] A strong CRM_JWT_SECRET or ADMIN_JWT_SECRET is required.');
  }
  // Domain separation avoids reusing the admin JWT key directly while keeping
  // existing correctly configured installations operational.
  return createHmac('sha256', rootSecret)
    .update('flamingo:crm-session:v1')
    .digest();
}

export async function createCrmToken(): Promise<string> {
  return new SignJWT({ role: 'crm_admin' })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyCrmSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [JWT_ALG] });
    return hasValidCrmClaims(payload);
  } catch {
    return false;
  }
}

export function getCrmCookieName() {
  return COOKIE_NAME;
}
