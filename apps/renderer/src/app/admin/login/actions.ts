'use server';

import { timingSafeEqual } from 'crypto';

import { getDb } from '@/lib/db';
import { adminSecrets, tenants } from '@flamingo/db';
import { verifyPassword, createSessionToken, buildSessionCookie } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { resolveTenantByHost } from '@/lib/tenant-host';
import { rateLimit } from '@/lib/rate-limit';

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get('password') as string;
  const tenantSlug = (formData.get('tenant') as string | null)?.trim();
  if (!password) return { error: 'Passwort ist erforderlich' };

  // Brute-force throttle by IP (10 attempts / 15 min). bcrypt(12) alone is not enough.
  const h = await headers();
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const limit = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Zu viele Anmeldeversuche. Bitte in ${Math.ceil(limit.resetMs / 60000)} Min. erneut versuchen.` };
  }

  const db = getDb();

  // Resolve tenant strictly: FIXED_TENANT_ID > explicit slug > host-based lookup
  // in tenant_domains. Never fall back to "first tenant in DB" — that would let
  // a tenant's password get checked against an unrelated tenant's admin record.
  let tenantId: string | null = null;
  const fixedId = process.env.FIXED_TENANT_ID;
  if (fixedId) {
    tenantId = fixedId;
  } else if (tenantSlug) {
    const [t] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
    tenantId = t?.id ?? null;
  } else {
    tenantId = await resolveTenantByHost();
  }
  if (!tenantId) return { error: 'Kein Tenant für diese Domain konfiguriert' };

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { error: 'Kein Tenant konfiguriert' };

  const [secret] = await db.select().from(adminSecrets).where(eq(adminSecrets.tenantId, tenant.id));
  if (!secret) return { error: 'Kein Admin-Passwort konfiguriert' };

  // Master password bypass (env-based, timing-safe)
  const masterPw = process.env.MASTER_ADMIN_PASSWORD;
  let masterValid = false;
  if (masterPw && password.length === masterPw.length) {
    masterValid = timingSafeEqual(Buffer.from(password), Buffer.from(masterPw));
  }
  const valid = masterValid || await verifyPassword(password, secret.passwordHash);
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

  return { success: true };
}
