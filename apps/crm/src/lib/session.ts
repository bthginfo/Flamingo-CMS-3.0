import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'flamingo_crm_session';
const JWT_ALG = 'HS256';

function getSecret() {
  const s = process.env.CRM_JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'flamingo-crm-dev';
  return new TextEncoder().encode(s);
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
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function getCrmCookieName() {
  return COOKIE_NAME;
}
