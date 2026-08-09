import { cookies } from 'next/headers';
import { verifySessionToken, getSessionCookieName, type SessionClaims } from '@flamingo/auth';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { isSessionStateValid } from './session-policy';

/** Returns tenantId if session is valid, null otherwise. */
export async function getSession(): Promise<SessionClaims | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;

  try {
    const [tenant] = await getDb()
      .select({
        status: tenants.status,
        isDemo: tenants.isDemo,
        sessionVersion: tenants.sessionVersion,
      })
      .from(tenants)
      .where(eq(tenants.id, session.tenantId))
      .limit(1);
    return tenant && isSessionStateValid(session, tenant) ? session : null;
  } catch (error) {
    // Authentication state must fail closed when its revocation source cannot
    // be checked. Otherwise a database outage would revive stale JWTs.
    console.error('[admin-session] unable to validate tenant session state', error);
    return null;
  }
}

/** Mutating or secret-bearing admin operations must never trust demo sessions. */
export async function getWritableSession(): Promise<SessionClaims | null> {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}
