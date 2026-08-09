'use server';

import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { adminSecrets, tenants } from '@flamingo/db';
import {
  BCRYPT_MAX_PASSWORD_BYTES,
  createSessionToken,
  getSessionCookieName,
  hashPassword,
  isPasswordWithinBcryptLimit,
  verifyPassword,
} from '@flamingo/auth';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const session = await getWritableSession();
  if (!session) return { success: false, error: 'Nicht angemeldet' };
  if (!isPasswordWithinBcryptLimit(newPassword)) {
    return { success: false, error: `Das neue Passwort ist zu lang. Maximal ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8-Bytes sind erlaubt.` };
  }

  const db = getDb();
  const [secret] = await db.select().from(adminSecrets).where(eq(adminSecrets.tenantId, session.tenantId)).limit(1);
  if (!secret) return { success: false, error: 'Konfigurationsfehler' };

  const valid = await verifyPassword(currentPassword, secret.passwordHash);
  if (!valid) return { success: false, error: 'Aktuelles Passwort ist falsch' };

  const newHash = await hashPassword(newPassword);
  const now = new Date();
  // neon-http does not support interactive Drizzle transactions. Keep the
  // password update and the revocation counter in one atomic SQL statement.
  const result = await db.execute(sql`
    WITH updated_secret AS (
      UPDATE admin_secrets
      SET password_hash = ${newHash},
          password_updated_at = ${now},
          updated_at = ${now}
      WHERE tenant_id = ${session.tenantId}::uuid
      RETURNING tenant_id
    ),
    updated_tenant AS (
      UPDATE tenants
      SET session_version = session_version + 1,
          updated_at = ${now}
      WHERE id = ${session.tenantId}::uuid
        AND EXISTS (SELECT 1 FROM updated_secret)
      RETURNING session_version
    )
    SELECT session_version FROM updated_tenant
  `);
  const nextSessionVersion = Number((result.rows[0] as { session_version?: number | string } | undefined)?.session_version);
  if (!Number.isSafeInteger(nextSessionVersion) || nextSessionVersion < 0) throw new Error('Tenant nicht gefunden');

  // Keep the caller signed in while every previously issued token is revoked.
  const token = await createSessionToken(session.tenantId, '7d', 'admin', nextSessionVersion);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true };
}
