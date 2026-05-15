'use server';

import { getDb } from '@/lib/db';
import { adminSecrets, tenants } from '@flamingo/db';
import { verifyPassword, createSessionToken, buildSessionCookie } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const password = formData.get('password') as string;
  if (!password) return { error: 'Passwort ist erforderlich' };

  const db = getDb();

  // For MVP: find first tenant + admin secret (single-tenant mode)
  // Later: resolve tenant by domain or explicit selection
  const [tenant] = await db.select().from(tenants).limit(1);
  if (!tenant) return { error: 'Kein Tenant konfiguriert' };

  const [secret] = await db.select().from(adminSecrets).where(eq(adminSecrets.tenantId, tenant.id));
  if (!secret) return { error: 'Kein Admin-Passwort konfiguriert' };

  const valid = await verifyPassword(password, secret.passwordHash);
  if (!valid) return { error: 'Falsches Passwort' };

  const token = await createSessionToken(tenant.id);
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieStore = await cookies();
  cookieStore.set('flamingo_admin_session', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60,
  });

  return {};
}
