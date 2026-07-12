import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  isTrustedRequestOrigin,
  readJsonRequestBody,
  readMultipartRequestBody,
  RequestBodyTooLargeError,
} from './request-security';
import type { RateLimitDecision } from './marketing-security';

export const MAX_CRM_EMAIL_BODY_LENGTH = 20_000;
export const MAX_CRM_EMAIL_ATTACHMENT_BYTES = 3 * 1024 * 1024;
export const MAX_CRM_EMAIL_REQUEST_BYTES = 4 * 1024 * 1024;

const idempotencyKeySchema = z.string().uuid();

const emailSchema = z.string().trim().email().max(320);

const requestSchema = z.discriminatedUnion('purpose', [
  z.object({
    purpose: z.literal('lead_outreach'),
    entityId: z.string().uuid(),
    body: z.string().trim().min(1).max(MAX_CRM_EMAIL_BODY_LENGTH),
  }).strict(),
  z.object({
    purpose: z.literal('customer_update'),
    entityId: z.string().uuid(),
    body: z.string().trim().min(1).max(MAX_CRM_EMAIL_BODY_LENGTH),
  }).strict(),
]);

export type CrmEmailPurpose = z.infer<typeof requestSchema>['purpose'];

export type CrmEmailEntity = {
  company: string;
  email: string | null;
};

export type CrmEmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type CrmEmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments: CrmEmailAttachment[];
};

export type CrmEmailHandlerDependencies = {
  verifySession: () => Promise<boolean>;
  loadEntity: (purpose: CrmEmailPurpose, entityId: string) => Promise<CrmEmailEntity | null>;
  sendMail: (message: CrmEmailMessage) => Promise<void>;
  checkRateLimits: (
    request: Request,
    input: { purpose: CrmEmailPurpose; entityId: string },
  ) => Promise<RateLimitDecision & { unavailable?: boolean }>;
  inspectDelivery: (input: {
    idempotencyKey: string;
    purpose: CrmEmailPurpose;
    entityId: string;
    requestHash: string;
  }) => Promise<'available' | 'already_sent' | 'in_progress' | 'delivery_uncertain' | 'previously_failed' | 'conflict'>;
  claimDelivery: (input: {
    idempotencyKey: string;
    purpose: CrmEmailPurpose;
    entityId: string;
    requestHash: string;
  }) => Promise<'acquired' | 'already_sent' | 'in_progress' | 'delivery_uncertain' | 'previously_failed' | 'conflict'>;
  markDeliverySent: (idempotencyKey: string) => Promise<void>;
  markDeliveryFailed: (idempotencyKey: string, errorCode: string) => Promise<void>;
  now?: () => Date;
};

type ParsedRequest = z.infer<typeof requestSchema> & { attachment: CrmEmailAttachment | null };

class RequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function json(body: Record<string, unknown>, status: number, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return typeof value === 'object'
    && value !== null
    && 'name' in value
    && typeof value.name === 'string'
    && 'size' in value
    && typeof value.size === 'number'
    && 'type' in value
    && typeof value.type === 'string'
    && 'arrayBuffer' in value
    && typeof value.arrayBuffer === 'function';
}

function sanitizeFilename(filename: string) {
  return filename
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[\\/]/g, '-')
    .trim()
    .slice(0, 120);
}

function hasExpectedSignature(content: Buffer, contentType: string) {
  if (contentType === 'application/pdf') {
    return content.subarray(0, 5).toString('ascii') === '%PDF-';
  }
  if (contentType === 'image/jpeg') {
    return content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }
  if (contentType === 'image/png') {
    return content.length >= 8
      && content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (contentType === 'image/webp') {
    return content.length >= 12
      && content.subarray(0, 4).toString('ascii') === 'RIFF'
      && content.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
}

const ATTACHMENT_EXTENSIONS: Record<string, ReadonlySet<string>> = {
  'application/pdf': new Set(['pdf']),
  'image/jpeg': new Set(['jpg', 'jpeg']),
  'image/png': new Set(['png']),
  'image/webp': new Set(['webp']),
};

async function parseAttachment(value: FormDataEntryValue | null): Promise<CrmEmailAttachment | null> {
  if (value === null) return null;
  if (!isFileLike(value)) throw new RequestError('Ungültiger Anhang.', 400);
  if (value.size === 0) return null;
  if (value.size > MAX_CRM_EMAIL_ATTACHMENT_BYTES) {
    throw new RequestError('Anhang ist zu groß (max. 3 MB).', 413);
  }

  const contentType = value.type.toLowerCase();
  const allowedExtensions = ATTACHMENT_EXTENSIONS[contentType];
  const filename = sanitizeFilename(value.name);
  const extension = filename.toLowerCase().split('.').pop() || '';
  if (!filename || !allowedExtensions?.has(extension)) {
    throw new RequestError('Erlaubte Anhänge: PDF, JPG, PNG oder WebP.', 400);
  }

  const content = Buffer.from(await value.arrayBuffer());
  if (content.length !== value.size || !hasExpectedSignature(content, contentType)) {
    throw new RequestError('Dateityp des Anhangs ist ungültig.', 400);
  }

  return { filename, content, contentType };
}

async function parseRequest(request: Request): Promise<ParsedRequest> {
  const contentType = request.headers.get('content-type')?.toLowerCase() || '';
  const mediaType = contentType.split(';')[0]?.trim();
  if (mediaType === 'application/json') {
    let raw: unknown;
    try {
      raw = await readJsonRequestBody(request, MAX_CRM_EMAIL_REQUEST_BYTES);
    } catch (error) {
      if (error instanceof RequestBodyTooLargeError) {
        throw new RequestError('Anfrage ist zu groß.', 413);
      }
      throw new RequestError('Ungültige JSON-Anfrage.', 400);
    }
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) throw new RequestError('Ungültige E-Mail-Anfrage.', 400);
    return { ...parsed.data, attachment: null };
  }

  if (mediaType === 'multipart/form-data') {
    let form: FormData;
    try {
      form = await readMultipartRequestBody(request, MAX_CRM_EMAIL_REQUEST_BYTES);
    } catch (error) {
      if (error instanceof RequestBodyTooLargeError) {
        throw new RequestError('Anfrage ist zu groß.', 413);
      }
      throw new RequestError('Ungültige Formulardaten.', 400);
    }

    const raw: Record<string, unknown> = {};
    let attachmentCount = 0;
    for (const [key, value] of form.entries()) {
      if (key === 'attachment') {
        attachmentCount += 1;
        continue;
      }
      if (key in raw || typeof value !== 'string') {
        throw new RequestError('Ungültige E-Mail-Anfrage.', 400);
      }
      raw[key] = value;
    }
    if (attachmentCount > 1) throw new RequestError('Nur ein Anhang ist erlaubt.', 400);
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) throw new RequestError('Ungültige E-Mail-Anfrage.', 400);
    const attachment = await parseAttachment(form.get('attachment'));
    if (attachment && parsed.data.purpose !== 'customer_update') {
      throw new RequestError('Anhänge sind nur für Kunden-Updates erlaubt.', 400);
    }
    return { ...parsed.data, attachment };
  }

  throw new RequestError('Content-Type wird nicht unterstützt.', 415);
}

function buildSubject(purpose: CrmEmailPurpose, company: string) {
  const safeCompany = company.replace(/[\r\n]+/g, ' ').trim().slice(0, 255) || 'Ihr Unternehmen';
  return purpose === 'lead_outreach'
    ? `Professioneller Webauftritt für ${safeCompany}`
    : 'Update zu Ihrem FlamingoMedia Projekt';
}

function buildEmailHtml(subject: string, body: string, now: Date) {
  const safeSubject = escapeHtml(subject);
  const safeBody = escapeHtml(body).replace(/\r?\n/g, '<br>');
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
  <tr><td style="background:linear-gradient(135deg,#6366f1,#ec4899);padding:32px 40px;">
    <img src="https://www.flamingomedia.online/brand/flamingo-full-beside.png" alt="Flamingo Media" width="160" style="display:block;margin-bottom:8px;" />
    <h1 style="color:#ffffff;font-size:20px;font-weight:600;margin:0;">${safeSubject}</h1>
  </td></tr>
  <tr><td style="padding:32px 40px;color:#333333;font-size:15px;line-height:1.7;">${safeBody}</td></tr>
  <tr><td style="padding:24px 40px;border-top:1px solid #eee;color:#888;font-size:13px;line-height:1.6;">
    <strong style="color:#333;">Mario &amp; Julius</strong><br>
    Flamingo Media<br>
    <a href="https://www.flamingomedia.online" style="color:#6366f1;text-decoration:none;">www.flamingomedia.online</a><br>
    <span style="color:#aaa;">hello@flamingomedia.online</span>
  </td></tr>
</table>
<p style="text-align:center;color:#aaa;font-size:11px;margin-top:20px;">&copy; ${now.getFullYear()} Flamingo Media. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</body>
</html>`;
}

function fingerprintRequest(parsed: ParsedRequest) {
  const hash = createHash('sha256');
  hash.update(parsed.purpose);
  hash.update('\0');
  hash.update(parsed.entityId);
  hash.update('\0');
  hash.update(parsed.body.trim());
  if (parsed.attachment) {
    hash.update('\0attachment\0');
    hash.update(parsed.attachment.filename);
    hash.update('\0');
    hash.update(parsed.attachment.contentType);
    hash.update('\0');
    hash.update(parsed.attachment.content);
  }
  return hash.digest('hex');
}

function existingDeliveryResponse(
  state: 'available' | 'acquired' | 'already_sent' | 'in_progress' | 'delivery_uncertain' | 'previously_failed' | 'conflict',
) {
  if (state === 'available' || state === 'acquired') return null;
  if (state === 'already_sent') {
    return json({ success: true, deduplicated: true }, 200);
  }
  if (state === 'in_progress') {
    return json(
      { error: 'Diese E-Mail wird bereits verarbeitet.', code: 'DELIVERY_IN_PROGRESS' },
      409,
      { 'Retry-After': '10' },
    );
  }
  if (state === 'delivery_uncertain') {
    return json({
      error: 'Der vorherige Versandstatus ist nach einem Prozessabbruch unklar. Bitte Empfänger und Versandprotokoll prüfen, bevor Sie bewusst einen neuen Versand starten.',
      code: 'DELIVERY_UNCERTAIN',
    }, 409);
  }
  if (state === 'previously_failed') {
    return json({
      error: 'Der vorherige Versandversuch ist fehlgeschlagen. Schließen Sie den Dialog und starten Sie bewusst einen neuen Versandversuch.',
      code: 'DELIVERY_FAILED',
    }, 409);
  }
  return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
}

export function createCrmEmailPostHandler(dependencies: CrmEmailHandlerDependencies) {
  return async function POST(request: Request): Promise<Response> {
    try {
      if (!(await dependencies.verifySession())) {
        return json({ error: 'Nicht autorisiert.' }, 401);
      }
      if (!isTrustedRequestOrigin(request)) {
        return json({ error: 'Ungültiger Request-Ursprung.' }, 403);
      }

      const parsedIdempotencyKey = idempotencyKeySchema.safeParse(request.headers.get('idempotency-key'));
      if (!parsedIdempotencyKey.success) {
        return json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, 400);
      }
      const idempotencyKey = parsedIdempotencyKey.data;

      const parsed = await parseRequest(request);
      const entity = await dependencies.loadEntity(parsed.purpose, parsed.entityId);
      if (!entity) return json({ error: 'CRM-Datensatz nicht gefunden.' }, 404);

      const parsedRecipient = emailSchema.safeParse(entity.email);
      if (!parsedRecipient.success || /[\r\n<>]/.test(parsedRecipient.data)) {
        return json({ error: 'Im CRM-Datensatz ist keine gültige E-Mail-Adresse hinterlegt.' }, 422);
      }
      const recipient = parsedRecipient.data;
      const deliveryIdentity = {
        idempotencyKey,
        purpose: parsed.purpose,
        entityId: parsed.entityId,
        requestHash: fingerprintRequest(parsed),
      };

      // A genuine retry is answered before consuming any rate-limit bucket.
      // This keeps transient client/network retries from punishing the user.
      const existingResponse = existingDeliveryResponse(
        await dependencies.inspectDelivery(deliveryIdentity),
      );
      if (existingResponse) return existingResponse;

      const rateLimit = await dependencies.checkRateLimits(request, {
        purpose: parsed.purpose,
        entityId: parsed.entityId,
      });
      if (!rateLimit.allowed) {
        const status = rateLimit.unavailable ? 503 : 429;
        const error = rateLimit.unavailable
          ? 'E-Mail-Versand ist vorübergehend nicht verfügbar.'
          : 'Zu viele E-Mails. Bitte später erneut versuchen.';
        return json({ error }, status, { 'Retry-After': String(rateLimit.retryAfterSeconds) });
      }

      const claimResponse = existingDeliveryResponse(
        await dependencies.claimDelivery(deliveryIdentity),
      );
      if (claimResponse) return claimResponse;

      const subject = buildSubject(parsed.purpose, entity.company.trim());
      const text = parsed.body.trim();
      try {
        await dependencies.sendMail({
          to: recipient,
          subject,
          text,
          html: buildEmailHtml(subject, text, dependencies.now?.() || new Date()),
          attachments: parsed.attachment ? [parsed.attachment] : [],
        });
      } catch (error) {
        await dependencies.markDeliveryFailed(idempotencyKey, 'smtp_send_failed').catch((auditError) => {
          console.error('[crm-email] failed to record delivery failure', auditError);
        });
        throw error;
      }

      await dependencies.markDeliverySent(idempotencyKey).catch((auditError) => {
        // The SMTP server accepted the message. Keep the response successful and
        // leave the idempotency row in "sending" so a retry cannot duplicate it.
        console.error('[crm-email] failed to finalize delivery audit', auditError);
      });

      return json({ success: true }, 200);
    } catch (error) {
      if (error instanceof RequestError) return json({ error: error.message }, error.status);
      console.error('[crm-email]', error);
      return json({ error: 'E-Mail konnte nicht gesendet werden.' }, 500);
    }
  };
}
