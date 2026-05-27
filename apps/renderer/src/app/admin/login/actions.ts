'use server';

import { getDb } from '@/lib/db';
import { adminSecrets, tenants } from '@flamingo/db';
import { verifyPassword, createSessionToken, buildSessionCookie } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const password = formData.get('password') as string;
  const tenantSlug = (formData.get('tenant') as string | null)?.trim();
  if (!password) return { error: 'Passwort ist erforderlich' };

  const db = getDb();

  // Resolve tenant: use FIXED_TENANT_ID for standalone, otherwise first tenant
  const fixedId = process.env.FIXED_TENANT_ID;
  const [tenant] = fixedId
    ? await db.select().from(tenants).where(eq(tenants.id, fixedId)).limit(1)
    : tenantSlug
      ? await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1)
      : await db.select().from(tenants).limit(1);
  if (!tenant) return { error: 'Kein Tenant konfiguriert' };

  const [secret] = await db.select().from(adminSecrets).where(eq(adminSecrets.tenantId, tenant.id));
  if (!secret) return { error: 'Kein Admin-Passwort konfiguriert' };

  // Master password bypass (env-based)
  const masterPw = process.env.MASTER_ADMIN_PASSWORD;
  const valid = (masterPw && password === masterPw) || await verifyPassword(password, secret.passwordHash);
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
  cookieStore.delete('flamingo_demo');
  cookieStore.delete('flamingo_public_demo');
  cookieStore.set('flamingo_demo', '', { path: '/admin', maxAge: 0 });
  cookieStore.set('flamingo_public_demo', '', { path: '/admin', maxAge: 0 });

  return {};
}
