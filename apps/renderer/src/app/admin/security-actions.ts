'use server';

import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { adminSecrets } from '@flamingo/db';
import { verifyPassword, hashPassword } from '@flamingo/auth';
import { eq } from 'drizzle-orm';

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const session = await getWritableSession();
  if (!session) return { success: false, error: 'Nicht angemeldet' };

  const db = getDb();
  const [secret] = await db.select().from(adminSecrets).where(eq(adminSecrets.tenantId, session.tenantId)).limit(1);
  if (!secret) return { success: false, error: 'Konfigurationsfehler' };

  const valid = await verifyPassword(currentPassword, secret.passwordHash);
  if (!valid) return { success: false, error: 'Aktuelles Passwort ist falsch' };

  const newHash = await hashPassword(newPassword);
  await db.update(adminSecrets).set({
    passwordHash: newHash,
    passwordUpdatedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(adminSecrets.tenantId, session.tenantId));

  return { success: true };
}
