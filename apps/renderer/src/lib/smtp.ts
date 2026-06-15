import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

/**
 * Resolve effective SMTP config for a tenant.
 * Priority: tenant-specific SMTP → platform SMTP from env → null
 */
export async function getEffectiveSmtp(tenantId: string): Promise<SmtpConfig | null> {
  const db = getDb();
  const [settings] = await db
    .select({ smtp: globalSettings.smtp })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, tenantId))
    .limit(1);

  const smtp = settings?.smtp as SmtpConfig | null;

  if (smtp?.host && smtp?.user && smtp?.pass && smtp?.from) {
    return smtp;
  }

  // Fallback to platform SMTP
  const { PLATFORM_SMTP_HOST, PLATFORM_SMTP_USER, PLATFORM_SMTP_PASS, PLATFORM_SMTP_FROM, PLATFORM_SMTP_PORT } = process.env;
  if (PLATFORM_SMTP_HOST && PLATFORM_SMTP_USER && PLATFORM_SMTP_PASS && PLATFORM_SMTP_FROM) {
    return {
      host: PLATFORM_SMTP_HOST,
      port: Number(PLATFORM_SMTP_PORT) || 587,
      user: PLATFORM_SMTP_USER,
      pass: PLATFORM_SMTP_PASS,
      from: PLATFORM_SMTP_FROM,
    };
  }

  return null;
}
