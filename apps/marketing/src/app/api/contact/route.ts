import { inquiries } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import {
  buildStoredContactMessage,
  contactInquiryMatchesSubmission,
  createContactPostHandler,
  type ContactSubmission,
} from '@/lib/contact';
import { getDb } from '@/lib/db';
import { consumeFirstDeniedRateLimit } from '@/lib/marketing-security';
import { contactRateLimitRules } from '@/lib/marketing-rate-policies';
import { getClientAddress } from '@/lib/request-security';
import { createHardenedSmtpTransport, resolveCrmSmtpConfiguration } from '@/lib/crm-smtp';

export const runtime = 'nodejs';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendNotification(submission: ContactSubmission, inquiryId: string) {
  const smtp = resolveCrmSmtpConfiguration(process.env);
  const transporter = createHardenedSmtpTransport(smtp);
  const lines = [
    `<strong>Name:</strong> ${escapeHtml(submission.name)}`,
    `<strong>E-Mail:</strong> ${escapeHtml(submission.email)}`,
    submission.phone ? `<strong>Telefon:</strong> ${escapeHtml(submission.phone)}` : '',
    submission.branche ? `<strong>Branche:</strong> ${escapeHtml(submission.branche)}` : '',
    submission.paket ? `<strong>Paket:</strong> ${escapeHtml(submission.paket)}` : '',
    submission.subject ? `<strong>Betreff:</strong> ${escapeHtml(submission.subject)}` : '',
    submission.addons.length ? `<strong>Add-ons:</strong> ${escapeHtml(submission.addons.join(', '))}` : '',
    `<strong>Nachricht:</strong><br>${escapeHtml(submission.message || '(keine Nachricht)').replace(/\r?\n/g, '<br>')}`,
    ...Object.entries(submission.extras).map(([key, value]) => `<strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}`),
    submission.source ? `<em>Quelle: ${escapeHtml(submission.source)}</em>` : '',
    `<small>CRM-Anfrage: ${escapeHtml(inquiryId)}</small>`,
  ].filter(Boolean);
  const safeName = submission.name.replace(/[\r\n]+/g, ' ').trim().slice(0, 120) || 'Website';

  await transporter.sendMail({
    from: { name: 'Flamingo Media Website', address: smtp.fromAddress },
    replyTo: { name: safeName, address: submission.email },
    to: { name: 'Flamingo Media', address: 'hello@flamingomedia.online' },
    subject: `Neue Anfrage von ${safeName}`,
    text: buildStoredContactMessage(submission),
    html: `<div style="font-family:sans-serif;line-height:1.6">${lines.join('<br><br>')}</div>`,
    headers: { 'X-Mailer': 'Flamingo Media Contact' },
  });
}

export const POST = createContactPostHandler({
  inspectInquiry: async (idempotencyKey, submission) => {
    const [existing] = await getDb()
      .select({
        id: inquiries.id,
        name: inquiries.name,
        email: inquiries.email,
        branche: inquiries.branche,
        paket: inquiries.paket,
        message: inquiries.message,
        source: inquiries.source,
      })
      .from(inquiries)
      .where(eq(inquiries.id, idempotencyKey))
      .limit(1);
    if (!existing) return 'new';
    return contactInquiryMatchesSubmission(existing, submission) ? 'duplicate' : 'conflict';
  },
  checkRateLimits: async (request, email) => {
    const denied = await consumeFirstDeniedRateLimit(
      contactRateLimitRules(getClientAddress(request.headers), email),
    );
    return denied || { allowed: true, limit: 120, remaining: 1, retryAfterSeconds: 0 };
  },
  saveInquiry: async (submission, idempotencyKey) => {
    const [inquiry] = await getDb().insert(inquiries).values({
      id: idempotencyKey,
      name: submission.name,
      email: submission.email,
      branche: submission.branche || null,
      paket: submission.paket || null,
      message: buildStoredContactMessage(submission),
      source: submission.source || null,
    }).onConflictDoNothing({ target: inquiries.id }).returning({ id: inquiries.id });
    if (inquiry) return { ...inquiry, state: 'created' as const };

    const [existing] = await getDb()
      .select({
        id: inquiries.id,
        name: inquiries.name,
        email: inquiries.email,
        branche: inquiries.branche,
        paket: inquiries.paket,
        message: inquiries.message,
        source: inquiries.source,
      })
      .from(inquiries)
      .where(eq(inquiries.id, idempotencyKey))
      .limit(1);
    if (!existing) throw new Error('Inquiry disappeared after idempotency conflict.');
    return {
      id: existing.id,
      state: contactInquiryMatchesSubmission(existing, submission) ? 'duplicate' as const : 'conflict' as const,
    };
  },
  sendNotification,
  onNotificationError: (error, inquiryId) => {
    console.error(`[api/contact] notification failed for inquiry ${inquiryId}`, error);
  },
});
