import { crmCustomers, leads } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { createCrmEmailPostHandler, type CrmEmailPurpose } from '@/lib/crm-email';
import {
  claimCrmEmailDelivery,
  inspectCrmEmailDelivery,
  markCrmEmailDeliveryFailed,
  markCrmEmailDeliverySent,
} from '@/lib/crm-email-store';
import { createHardenedSmtpTransport, resolveCrmSmtpConfiguration } from '@/lib/crm-smtp';
import { getDb } from '@/lib/db';
import { consumeFirstDeniedRateLimit } from '@/lib/marketing-security';
import { crmEmailRateLimitRules } from '@/lib/marketing-rate-policies';
import { getClientAddress } from '@/lib/request-security';
import { verifyCrmSession } from '@/lib/session';

export const runtime = 'nodejs';

async function loadEntity(purpose: CrmEmailPurpose, entityId: string) {
  const db = getDb();
  if (purpose === 'lead_outreach') {
    const [lead] = await db
      .select({ company: leads.company, email: leads.email })
      .from(leads)
      .where(eq(leads.id, entityId))
      .limit(1);
    return lead || null;
  }

  const [customer] = await db
    .select({ company: crmCustomers.company, email: crmCustomers.email })
    .from(crmCustomers)
    .where(eq(crmCustomers.id, entityId))
    .limit(1);
  return customer || null;
}

export const POST = createCrmEmailPostHandler({
  verifySession: verifyCrmSession,
  loadEntity,
  checkRateLimits: async (request, input) => {
    try {
      const denied = await consumeFirstDeniedRateLimit(
        crmEmailRateLimitRules(getClientAddress(request.headers), input.purpose, input.entityId),
      );
      return denied || { allowed: true, limit: 100, remaining: 1, retryAfterSeconds: 0 };
    } catch (error) {
      console.error('[crm-email] rate-limit store unavailable', error);
      return { allowed: false, unavailable: true, limit: 0, remaining: 0, retryAfterSeconds: 60 };
    }
  },
  claimDelivery: claimCrmEmailDelivery,
  inspectDelivery: inspectCrmEmailDelivery,
  markDeliverySent: markCrmEmailDeliverySent,
  markDeliveryFailed: markCrmEmailDeliveryFailed,
  sendMail: async (message) => {
    const smtp = resolveCrmSmtpConfiguration(process.env);
    const transporter = createHardenedSmtpTransport(smtp);

    await transporter.sendMail({
      from: { name: 'Mario & Julius - Flamingo Media', address: smtp.fromAddress },
      replyTo: { name: 'Flamingo Media', address: smtp.fromAddress },
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
      headers: {
        'X-Mailer': 'Flamingo Media CRM',
      },
    });
  },
});
