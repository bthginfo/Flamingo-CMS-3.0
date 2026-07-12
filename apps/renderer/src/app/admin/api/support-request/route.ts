import { createHash } from 'node:crypto';
import { crmEmailDeliveries, inquiries } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  parseRendererContactIdempotencyKey,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';
import { getWritableSession } from '@/lib/session';
import {
  createHardenedRendererSmtpTransport,
  getPlatformSmtp,
} from '@/lib/smtp';

export const runtime = 'nodejs';

const SUPPORT_REQUEST_MAX_BYTES = 16 * 1024;
const SUPPORT_STALE_AFTER_MS = 15 * 60 * 1000;
const requestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5_000),
}).strict();

function json(body: Record<string, unknown>, status = 200, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  const session = await getWritableSession();
  if (!session) return json({ error: 'Nicht autorisiert.' }, 401);
  if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    return json({ error: 'Content-Type wird nicht unterstützt.' }, 415);
  }
  if (!isTrustedRendererContactOrigin(request)) {
    return json({ error: 'Ungültiger Request-Ursprung.' }, 403);
  }

  const idempotencyKey = parseRendererContactIdempotencyKey(request.headers.get('idempotency-key'));
  if (!idempotencyKey) return json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, 400);

  let raw: unknown;
  try {
    raw = await readBoundedRendererContactJson(request, SUPPORT_REQUEST_MAX_BYTES);
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return json({ error: 'Die Anfrage ist zu groß.' }, 413);
    if (error instanceof RendererContactBodyInvalidError) return json({ error: 'Ungültige Eingabe.' }, 400);
    console.error('[admin-support] request body failed', error);
    return json({ error: 'Ungültige Eingabe.' }, 400);
  }
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) return json({ error: 'Ungültige Eingabe.' }, 400);

  try {
    const denied = await consumeRendererContactRateRules([
      {
        scope: 'admin_support_ip',
        subject: `${session.tenantId}:${getRendererContactClientAddress(request.headers)}`,
        limit: 8,
        windowSeconds: 60 * 60,
      },
      { scope: 'admin_support_tenant', subject: session.tenantId, limit: 5, windowSeconds: 60 * 60 },
      { scope: 'admin_support_global', subject: 'all', limit: 100, windowSeconds: 60 * 60 },
    ]);
    if (denied) {
      return json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        429,
        { 'Retry-After': String(denied.retryAfterSeconds) },
      );
    }
  } catch (error) {
    console.error('[admin-support] rate-limit unavailable', error);
    return json({ error: 'Support-Anfrage ist vorübergehend nicht verfügbar.' }, 503, { 'Retry-After': '60' });
  }

  const requestHash = createHash('sha256')
    .update(session.tenantId)
    .update('\0')
    .update(parsed.data.name)
    .update('\0')
    .update(parsed.data.email.toLowerCase())
    .update('\0')
    .update(parsed.data.message)
    .digest('hex');
  const source = `cms_support:${idempotencyKey}`;
  const db = getDb();

  let claimed: { idempotencyKey: string } | undefined;
  try {
    [claimed] = await db.insert(crmEmailDeliveries).values({
      idempotencyKey,
      purpose: 'admin_support',
      entityId: session.tenantId,
      requestHash,
      status: 'sending',
    }).onConflictDoNothing({ target: crmEmailDeliveries.idempotencyKey }).returning({
      idempotencyKey: crmEmailDeliveries.idempotencyKey,
    });
  } catch (error) {
    console.error('[admin-support] idempotency store unavailable', error);
    return json({ error: 'Support-Anfrage ist vorübergehend nicht verfügbar.' }, 503, { 'Retry-After': '60' });
  }

  if (!claimed) {
    const [existing] = await db.select({
      purpose: crmEmailDeliveries.purpose,
      entityId: crmEmailDeliveries.entityId,
      requestHash: crmEmailDeliveries.requestHash,
      status: crmEmailDeliveries.status,
      updatedAt: crmEmailDeliveries.updatedAt,
    }).from(crmEmailDeliveries).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).limit(1);

    if (!existing
      || existing.purpose !== 'admin_support'
      || existing.entityId !== session.tenantId
      || existing.requestHash !== requestHash) {
      return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    }
    if (existing.status === 'sent') return json({ success: true, deduplicated: true });
    if (existing.status === 'failed') {
      return json({ error: 'Der vorherige Versuch ist fehlgeschlagen.', code: 'SUPPORT_PREVIOUSLY_FAILED' }, 409);
    }
    if (existing.status === 'uncertain') {
      return json({ error: 'Der Versandstatus ist unklar. Bitte Flamingo Media direkt kontaktieren.', code: 'SUPPORT_UNCERTAIN' }, 409);
    }

    if (existing.updatedAt.getTime() <= Date.now() - SUPPORT_STALE_AFTER_MS) {
      const [savedInquiry] = await db.select({ id: inquiries.id })
        .from(inquiries)
        .where(eq(inquiries.source, source))
        .limit(1);
      await db.update(crmEmailDeliveries).set({
        status: savedInquiry ? 'sent' : 'failed',
        sentAt: savedInquiry ? new Date() : null,
        lastErrorCode: savedInquiry ? null : 'stale_before_persist',
        updatedAt: new Date(),
      }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey));
      if (savedInquiry) return json({ success: true, deduplicated: true });
      return json({ error: 'Der vorherige Versuch ist fehlgeschlagen.', code: 'SUPPORT_PREVIOUSLY_FAILED' }, 409);
    }
    return json(
      { error: 'Diese Anfrage wird bereits verarbeitet.', code: 'SUPPORT_IN_PROGRESS' },
      409,
      { 'Retry-After': '10' },
    );
  }

  const message = [
    'CMS Admin – Individuelle Funktionen',
    `Tenant: ${session.tenantId}`,
    '',
    parsed.data.message,
  ].join('\n');
  try {
    await db.insert(inquiries).values({
      name: parsed.data.name,
      email: parsed.data.email,
      message,
      source,
    });
  } catch (error) {
    await db.update(crmEmailDeliveries).set({
      status: 'failed',
      lastErrorCode: 'support_persist_failed',
      updatedAt: new Date(),
    }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).catch(() => undefined);
    console.error('[admin-support] request persistence failed', error);
    return json({ error: 'Support-Anfrage konnte nicht gespeichert werden.', code: 'SUPPORT_PREVIOUSLY_FAILED' }, 500);
  }

  // Once the CRM record exists, the user action is durably accepted. Audit
  // finalization and the notification are best effort and must never invite a
  // retry that creates a second inquiry.
  const acceptedAt = new Date();
  await db.update(crmEmailDeliveries).set({
    status: 'sent',
    sentAt: acceptedAt,
    updatedAt: acceptedAt,
    lastErrorCode: null,
  }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).catch((error) => {
    console.error(`[admin-support] failed to finalize ${idempotencyKey}`, error);
  });

  const smtp = await getPlatformSmtp();
  if (!smtp) return json({ success: true, notificationDelayed: true }, 202);

  const safeName = parsed.data.name.replace(/[\r\n]+/g, ' ').slice(0, 120);
  try {
    await createHardenedRendererSmtpTransport(smtp).sendMail({
      from: { name: 'Flamingo CMS Support', address: smtp.from },
      replyTo: { name: safeName, address: parsed.data.email },
      to: { name: 'Flamingo Media', address: 'hello@flamingomedia.online' },
      subject: `CMS Support-Anfrage von ${safeName}`,
      text: message,
      html: `<div style="font-family:sans-serif;line-height:1.6"><strong>Tenant:</strong> ${escapeHtml(session.tenantId)}<br><strong>Name:</strong> ${escapeHtml(parsed.data.name)}<br><strong>E-Mail:</strong> ${escapeHtml(parsed.data.email)}<br><br>${escapeHtml(parsed.data.message).replace(/\r?\n/g, '<br>')}</div>`,
      headers: { 'X-Mailer': 'Flamingo CMS Support' },
    });
    return json({ success: true });
  } catch (error) {
    console.error(`[admin-support] notification failed for ${idempotencyKey}`, error);
    return json({ success: true, notificationDelayed: true }, 202);
  }
}
