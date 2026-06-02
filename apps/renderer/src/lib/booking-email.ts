import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';
import { getEffectiveSmtp } from '@/lib/smtp';
import { bookingSettings, emailTemplates } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';

export type BookingEmailTrigger =
  | 'booking_requested_customer'
  | 'booking_requested_admin'
  | 'booking_confirmed_customer'
  | 'booking_cancelled_customer'
  | 'booking_cancelled_admin';

type BookingEmailContext = {
  tenantId: string;
  trigger: BookingEmailTrigger;
  to?: string | null;
  values: Record<string, string | number | null | undefined>;
};

const DEFAULT_TEMPLATES: Record<BookingEmailTrigger, { subject: string; body: string }> = {
  booking_requested_customer: {
    subject: 'Ihre Buchungsanfrage bei {{companyName}}',
    body: 'Hallo {{customerName}},\n\nvielen Dank für Ihre Anfrage. Wir haben Ihre Buchung für {{bookingDate}} erhalten und melden uns zeitnah mit einer Bestätigung.\n\nIhre Angaben:\n{{bookingSummary}}\n\nViele Grüße\n{{companyName}}',
  },
  booking_requested_admin: {
    subject: 'Neue Buchungsanfrage: {{customerName}}',
    body: 'Es ist eine neue Buchungsanfrage eingegangen.\n\n{{bookingSummary}}\n\nKontakt:\n{{customerName}}\n{{customerEmail}}\n{{customerPhone}}\n\nNachricht:\n{{message}}',
  },
  booking_confirmed_customer: {
    subject: 'Ihre Buchung bei {{companyName}} ist bestätigt',
    body: 'Hallo {{customerName}},\n\nIhre Buchung ist bestätigt.\n\n{{bookingSummary}}\n\nFalls Sie absagen müssen, nutzen Sie bitte diesen Link:\n{{cancellationUrl}}\n\nViele Grüße\n{{companyName}}',
  },
  booking_cancelled_customer: {
    subject: 'Ihre Buchung bei {{companyName}} wurde abgesagt',
    body: 'Hallo {{customerName}},\n\nIhre Buchung wurde abgesagt.\n\n{{bookingSummary}}\n\nViele Grüße\n{{companyName}}',
  },
  booking_cancelled_admin: {
    subject: 'Buchung abgesagt: {{customerName}}',
    body: 'Eine Buchung wurde abgesagt.\n\n{{bookingSummary}}\n\nGrund:\n{{cancellationReason}}',
  },
};

export async function sendBookingEmail({ tenantId, trigger, to, values }: BookingEmailContext) {
  if (!to) return { sent: false, reason: 'missing_recipient' as const };

  const smtp = await getEffectiveSmtp(tenantId);
  if (!smtp) return { sent: false, reason: 'missing_smtp' as const };

  const template = await getTemplate(tenantId, trigger);
  const subject = renderTemplate(template.subject, values);
  const text = renderTemplate(template.body, values);
  const html = textToHtml(text);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  await transporter.sendMail({ from: smtp.from, to, subject, text, html });
  return { sent: true as const };
}

export async function getBookingNotificationEmail(tenantId: string) {
  const db = getDb();
  const [settings] = await db
    .select({ notificationEmail: bookingSettings.notificationEmail })
    .from(bookingSettings)
    .where(eq(bookingSettings.tenantId, tenantId))
    .limit(1);
  if (settings?.notificationEmail) return settings.notificationEmail;
  const smtp = await getEffectiveSmtp(tenantId);
  return smtp?.from ?? null;
}

export function getDefaultBookingEmailTemplate(trigger: BookingEmailTrigger) {
  return DEFAULT_TEMPLATES[trigger];
}

async function getTemplate(tenantId: string, trigger: BookingEmailTrigger) {
  const db = getDb();
  const [template] = await db
    .select({ subject: emailTemplates.subject, body: emailTemplates.body, active: emailTemplates.active })
    .from(emailTemplates)
    .where(and(eq(emailTemplates.tenantId, tenantId), eq(emailTemplates.trigger, trigger)))
    .limit(1);
  if (template?.active) return { subject: template.subject, body: template.body };
  return DEFAULT_TEMPLATES[trigger];
}

function renderTemplate(template: string, values: Record<string, string | number | null | undefined>) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => String(values[key] ?? ''));
}

function textToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 14px;color:#374151;line-height:1.6">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));
}
