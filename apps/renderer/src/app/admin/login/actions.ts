'use server';

import { timingSafeEqual } from 'crypto';

import { getDb } from '@/lib/db';
import { adminSecrets, tenants } from '@flamingo/db';
import { verifyPassword, createSessionToken } from '@flamingo/auth';
import { and, eq } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { resolveTenantByHost } from '@/lib/tenant-host';
import {
  clearRendererRateLimit,
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  rendererAdminLoginRateRules,
} from '@/lib/renderer-contact-security';

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get('password') as string;
  const tenantSlug = (formData.get('tenant') as string | null)?.trim();
  if (!password) return { error: 'Passwort ist erforderlich' };

  // Persistent serverless-safe throttle. Failing closed prevents cold-start
  // fan-out from bypassing the login boundary.
  const h = await headers();
  const ip = getRendererContactClientAddress(h);
  let denied;
  try {
    denied = await consumeRendererContactRateRules(rendererAdminLoginRateRules(ip));
  } catch (error) {
    console.error('[admin-login] rate-limit store unavailable', error);
    return { error: 'Anmeldung vorübergehend nicht verfügbar' };
  }
  if (denied) {
    return { error: `Zu viele Anmeldeversuche. Bitte in ${Math.ceil(denied.retryAfterSeconds / 60)} Min. erneut versuchen.` };
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
    const [t] = await db.select({ id: tenants.id }).from(tenants)
      .where(and(eq(tenants.slug, tenantSlug), eq(tenants.status, 'active')))
      .limit(1);
    tenantId = t?.id ?? null;
  } else {
    tenantId = await resolveTenantByHost();
  }
  if (!tenantId) return { error: 'Kein Tenant für diese Domain konfiguriert' };

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant || tenant.status !== 'active') return { error: 'Kein aktiver Tenant konfiguriert' };

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

  await clearRendererRateLimit('renderer_admin_login_ip', ip).catch(error => {
    console.error('[admin-login] failed to clear successful login attempts', error);
  });

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
