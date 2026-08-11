import nodemailer from 'nodemailer';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revealStoredSecret } from './secret-storage';

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
  requireTLS: boolean;
  connectionHost?: string;
};

const smtpSchema = z.object({
  host: z.string().trim().min(1).max(253).regex(/^[a-z0-9.-]+$/i),
  port: z.coerce.number().int().min(1).max(65_535).default(587),
  user: z.string().trim().min(1).max(320),
  pass: z.string().min(1).max(2_000),
  from: z.string().trim().max(320).email().refine(value => !/[\r\n<>]/.test(value)),
}).strict();

export function normalizeSmtpConfig(value: unknown): SmtpConfig | null {
  const parsed = smtpSchema.safeParse(value);
  if (!parsed.success) return null;
  const secure = parsed.data.port === 465;
  return { ...parsed.data, secure, requireTLS: !secure };
}

export function isValidSmtpAddress(value: string) {
  return z.string().trim().max(320).email().safeParse(value).success && !/[\r\n<>]/.test(value);
}

function isPrivateOrReservedAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return a === 0
      || a === 10
      || a === 127
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 0 && (c === 0 || c === 2))
      || (a === 192 && b === 88 && c === 99)
      || (a === 192 && b === 168)
      || (a === 198 && (b === 18 || b === 19))
      || (a === 198 && b === 51 && c === 100)
      || (a === 203 && b === 0 && c === 113)
      || a >= 224;
  }
  if (isIP(address) === 6) {
    const normalized = address.toLowerCase();
    const mappedV4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
    if (mappedV4) return isPrivateOrReservedAddress(mappedV4);
    return normalized === '::'
      || normalized === '::1'
      || normalized.startsWith('fc')
      || normalized.startsWith('fd')
      || normalized.startsWith('::ffff:')
      || /^fe[89ab]/.test(normalized)
      || normalized.startsWith('ff')
      || normalized.startsWith('2001:db8:');
  }
  return true;
}

export async function pinPublicSmtpHost(configuration: SmtpConfig): Promise<SmtpConfig | null> {
  const hostname = configuration.host.toLowerCase();
  if (
    hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || hostname.endsWith('.local')
    || hostname.endsWith('.internal')
    || hostname.endsWith('.lan')
  ) return null;

  try {
    const addresses = isIP(hostname)
      ? [{ address: hostname }]
      : await lookup(hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(result => isPrivateOrReservedAddress(result.address))) return null;
    return { ...configuration, connectionHost: addresses[0].address };
  } catch {
    return null;
  }
}

/** Resolve tenant SMTP first, then the complete platform profile. */
export async function getEffectiveSmtp(tenantId: string): Promise<SmtpConfig | null> {
  const db = getDb();
  const [settings] = await db
    .select({ smtp: globalSettings.smtp })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, tenantId))
    .limit(1);

  if (settings?.smtp) {
    const stored = settings.smtp as Partial<SmtpConfig>;
    const tenantSmtp = normalizeSmtpConfig({
      ...stored,
      pass: revealStoredSecret(stored.pass),
    });
    if (tenantSmtp) {
      const pinnedTenantSmtp = await pinPublicSmtpHost(tenantSmtp);
      if (pinnedTenantSmtp) return pinnedTenantSmtp;
    }
    console.error(`[smtp] invalid tenant SMTP configuration for tenant ${tenantId}`);
  }

  return getPlatformSmtp();
}

export function resolveRendererPlatformSmtpProfiles(
  environment: Readonly<Record<string, string | undefined>>,
) {
  return [
    normalizeSmtpConfig({
      host: environment.PLATFORM_SMTP_HOST,
      port: environment.PLATFORM_SMTP_PORT || 587,
      user: environment.PLATFORM_SMTP_USER,
      pass: environment.PLATFORM_SMTP_PASS,
      from: environment.PLATFORM_SMTP_FROM || environment.PLATFORM_SMTP_USER,
    }),
    normalizeSmtpConfig({
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT || 587,
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASS,
      from: environment.SMTP_FROM || environment.SMTP_USER,
    }),
  ].filter((configuration): configuration is SmtpConfig => configuration !== null);
}

/** Load, validate and DNS-pin the platform profile, then its legacy alias. */
export async function getPlatformSmtp(): Promise<SmtpConfig | null> {
  for (const configuration of resolveRendererPlatformSmtpProfiles(process.env)) {
    const pinned = await pinPublicSmtpHost(configuration);
    if (pinned) return pinned;
  }
  return null;
}

export function createHardenedRendererSmtpTransport(configuration: SmtpConfig) {
  return nodemailer.createTransport({
    host: configuration.connectionHost || configuration.host,
    port: configuration.port,
    secure: configuration.secure,
    requireTLS: configuration.requireTLS,
    auth: { user: configuration.user, pass: configuration.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
    tls: {
      minVersion: 'TLSv1.2',
      servername: configuration.host,
    },
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
