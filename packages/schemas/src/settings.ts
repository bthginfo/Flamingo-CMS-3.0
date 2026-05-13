import { z } from 'zod';

// ─── Global Settings ────────────────────────────────────────────────
export const brandSchema = z.object({
  companyName: z.string().min(1),
  slogan: z.string().optional(),
  logoUrl: z.string().optional(),
  logoAlt: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  themePresetId: z.string().optional(),
});

export const contactInfoSchema = z.object({
  address: z.string().optional(),
  phone: z.string().optional(),
  emergencyPhone: z.string().optional(),
  email: z.string().email().optional(),
});

export const openingHourRowSchema = z.object({
  day: z.string(),
  from: z.string(),
  to: z.string(),
  closed: z.boolean().default(false),
  note: z.string().optional(),
});

export const socialLinksSchema = z.object({
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
  tiktok: z.string().url().optional(),
});

export const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  children: z.array(z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  })).optional(),
});

export const footerColumnSchema = z.object({
  title: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
});

// ─── SEO ────────────────────────────────────────────────────────────
export const seoGlobalSchema = z.object({
  defaultTitle: z.string().max(70).optional(),
  titleTemplate: z.string().max(100).optional(),
  defaultDescription: z.string().max(170).optional(),
  defaultOgImage: z.string().optional(),
  canonicalBase: z.string().url().optional(),
  locale: z.string().default('de_DE'),
  robots: z.string().default('index,follow'),
});

export const seoPageSchema = z.object({
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
});

// ─── Scripts / Tracking ─────────────────────────────────────────────
export const scriptSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['necessary', 'functional', 'analytics', 'marketing']),
  placement: z.enum(['head', 'body_start', 'body_end']),
  code: z.string().min(1),
  enabled: z.boolean().default(true),
});

// ─── Mail Settings ──────────────────────────────────────────────────
export const mailSettingsSchema = z.object({
  useTenantSmtp: z.boolean().default(false),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
});

// ─── Login ──────────────────────────────────────────────────────────
export const loginSchema = z.object({
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Mindestens 8 Zeichen'),
  confirmPassword: z.string().min(1),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});
