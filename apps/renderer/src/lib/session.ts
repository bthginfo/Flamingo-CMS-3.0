import { cookies } from 'next/headers';
import { verifySessionToken, getSessionCookieName } from '@flamingo/auth';

/** Returns tenantId if session is valid, null otherwise. */
export async function getSession(): Promise<{ tenantId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
