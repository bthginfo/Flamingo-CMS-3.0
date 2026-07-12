import nodemailer from 'nodemailer';
import { z } from 'zod';

type SmtpEnvironment = Readonly<Record<string, string | undefined>>;

export type CrmSmtpConfiguration = {
  profile: 'SMTP' | 'PLATFORM_SMTP';
  host: string;
  port: number;
  user: string;
  pass: string;
  fromAddress: string;
  secure: boolean;
  requireTLS: boolean;
};

const PROFILE_FIELDS = ['HOST', 'PORT', 'USER', 'PASS', 'FROM', 'SECURE'] as const;
const REQUIRED_PROFILE_FIELDS = ['HOST', 'USER', 'PASS'] as const;

function profileIsPresent(environment: SmtpEnvironment, prefix: 'SMTP' | 'PLATFORM_SMTP') {
  return PROFILE_FIELDS.some(field => environment[`${prefix}_${field}`] !== undefined);
}

function profileIsComplete(environment: SmtpEnvironment, prefix: 'SMTP' | 'PLATFORM_SMTP') {
  return REQUIRED_PROFILE_FIELDS.every(field => Boolean(environment[`${prefix}_${field}`]?.trim()));
}

function requiredValue(environment: SmtpEnvironment, key: string) {
  const value = environment[key];
  if (!value?.trim()) throw new Error(`SMTP-Konfiguration unvollständig: ${key} fehlt.`);
  return value;
}

export function resolveCrmSmtpConfiguration(environment: SmtpEnvironment): CrmSmtpConfiguration {
  const smtpPresent = profileIsPresent(environment, 'SMTP');
  const platformPresent = profileIsPresent(environment, 'PLATFORM_SMTP');
  if (!smtpPresent && !platformPresent) throw new Error('SMTP-Konfiguration fehlt.');

  // Select one complete profile atomically. A stray/partial tenant SMTP_*
  // variable must not disable a complete platform fallback, and fields are
  // never mixed across the two profiles.
  const profile = profileIsComplete(environment, 'SMTP')
    ? 'SMTP'
    : profileIsComplete(environment, 'PLATFORM_SMTP')
      ? 'PLATFORM_SMTP'
      : smtpPresent
        ? 'SMTP'
        : 'PLATFORM_SMTP';
  const host = requiredValue(environment, `${profile}_HOST`).trim();
  if (host.length > 253 || !/^[a-z0-9.-]+$/i.test(host)) {
    throw new Error(`${profile}_HOST ist ungültig.`);
  }
  const user = requiredValue(environment, `${profile}_USER`).trim();
  const pass = requiredValue(environment, `${profile}_PASS`);
  const rawPort = environment[`${profile}_PORT`]?.trim() || '587';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${profile}_PORT ist ungültig.`);
  }

  const rawSecure = environment[`${profile}_SECURE`]?.trim().toLowerCase();
  if (rawSecure && rawSecure !== 'true' && rawSecure !== 'false') {
    throw new Error(`${profile}_SECURE muss true oder false sein.`);
  }
  const secure = port === 465;
  if (rawSecure && (rawSecure === 'true') !== secure) {
    throw new Error(`${profile}_SECURE passt nicht zum Port. Port 465 nutzt implizites TLS; andere Ports nutzen STARTTLS.`);
  }

  const configuredFrom = environment[`${profile}_FROM`];
  if (configuredFrom !== undefined && !configuredFrom.trim()) {
    throw new Error(`${profile}_FROM darf nicht leer sein.`);
  }
  const fromAddress = configuredFrom?.trim() || user;
  if (!z.string().max(320).email().safeParse(fromAddress).success || /[\r\n<>]/.test(fromAddress)) {
    throw new Error(`${profile}_FROM muss eine gültige einzelne E-Mail-Adresse sein.`);
  }

  return {
    profile,
    host,
    port,
    user,
    pass,
    fromAddress,
    secure,
    requireTLS: !secure,
  };
}

export function createHardenedSmtpTransport(configuration: CrmSmtpConfiguration) {
  return nodemailer.createTransport({
    host: configuration.host,
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
