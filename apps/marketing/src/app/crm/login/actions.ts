'use server';

import { cookies } from 'next/headers';
import { createCrmToken, getCrmCookieName } from '@/lib/session';

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get('password') as string;
  if (!password) return { error: 'Passwort erforderlich' };

  const masterPw = process.env.CRM_MASTER_PASSWORD;
  if (!masterPw) return { error: 'CRM nicht konfiguriert (CRM_MASTER_PASSWORD fehlt)' };

  if (password !== masterPw) return { error: 'Falsches Passwort' };

  const token = await createCrmToken();
  const cookieStore = await cookies();
  cookieStore.set(getCrmCookieName(), token, {
    path: '/crm',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
  });

  return { success: true };
}
