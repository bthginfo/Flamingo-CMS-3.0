'use server';

import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { createCrmToken, getCrmCookieName } from '@/lib/session';
import {
  CRM_MASTER_PASSWORD_MAX_LENGTH,
  CRM_MASTER_PASSWORD_MIN_LENGTH,
  normalizeConfiguredCrmMasterPassword,
} from '@/lib/crm-login-policy';
import { clearMarketingRateLimit, consumeFirstDeniedRateLimit } from '@/lib/marketing-security';
import { crmLoginRateLimitRules } from '@/lib/marketing-rate-policies';
import { getClientAddress } from '@/lib/request-security';

function passwordsMatch(candidate: string, expected: string) {
  const candidateDigest = createHash('sha256').update(candidate).digest();
  const expectedDigest = createHash('sha256').update(expected).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const rawPassword = formData.get('password');
  const password = typeof rawPassword === 'string' ? rawPassword : '';
  if (!password || password.length > 1_024) return { error: 'Anmeldung fehlgeschlagen' };

  const clientAddress = getClientAddress(await headers());
  let decision;
  try {
    decision = await consumeFirstDeniedRateLimit(crmLoginRateLimitRules(clientAddress));
  } catch (error) {
    console.error('[crm-login] rate-limit store unavailable', error);
    return { error: 'Anmeldung vorübergehend nicht verfügbar' };
  }
  if (decision && !decision.allowed) {
    return { error: 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.' };
  }

  const masterPw = normalizeConfiguredCrmMasterPassword(process.env.CRM_MASTER_PASSWORD);
  if (!masterPw) {
    console.error(
      `[crm-login] CRM_MASTER_PASSWORD must contain between ${CRM_MASTER_PASSWORD_MIN_LENGTH} and ${CRM_MASTER_PASSWORD_MAX_LENGTH} characters`,
    );
    return { error: 'Anmeldung vorübergehend nicht verfügbar' };
  }

  if (!passwordsMatch(password, masterPw)) return { error: 'Anmeldung fehlgeschlagen' };

  // Clear only the successful client's bucket. The account-wide bucket keeps
  // its short fixed window so one valid login cannot erase concurrent attacks.
  await clearMarketingRateLimit('crm_login_ip', clientAddress).catch((error) => {
    console.error('[crm-login] failed to clear successful login attempts', error);
  });

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
