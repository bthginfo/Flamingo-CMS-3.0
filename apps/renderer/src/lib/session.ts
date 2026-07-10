import { cookies } from 'next/headers';
import { verifySessionToken, getSessionCookieName, type SessionClaims } from '@flamingo/auth';

/** Returns tenantId if session is valid, null otherwise. */
export async function getSession(): Promise<SessionClaims | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Mutating or secret-bearing admin operations must never trust demo sessions. */
export async function getWritableSession(): Promise<SessionClaims | null> {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}
