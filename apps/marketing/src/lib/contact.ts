import { z } from 'zod';
import type { RateLimitDecision } from './marketing-security';
import {
  InvalidRequestBodyError,
  isTrustedRequestOrigin,
  readJsonRequestBody,
  RequestBodyTooLargeError,
} from './request-security';

export const MAX_CONTACT_REQUEST_BYTES = 32 * 1024;

const optionalShortText = (maximum: number) => z.string().trim().max(maximum).optional().default('');
const idempotencyKeySchema = z.string().uuid();
const contactRequestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: optionalShortText(50),
  branche: optionalShortText(100),
  paket: optionalShortText(100),
  subject: optionalShortText(200),
  message: optionalShortText(5_000),
  source: optionalShortText(100),
  tenant: optionalShortText(120),
  website: optionalShortText(500),
  addons: z.array(z.string().trim().min(1).max(160)).max(20).optional().default([]),
  extras: z.record(z.string().min(1).max(100), z.string().trim().max(1_000)).optional().default({}),
}).strict().superRefine((value, context) => {
  if (Object.keys(value.extras).length > 20) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['extras'], message: 'Zu viele Zusatzfelder.' });
  }
});

export type ContactSubmission = z.infer<typeof contactRequestSchema>;
export type ContactInquiryState = 'new' | 'duplicate' | 'conflict';

export type StoredContactInquiry = {
  id: string;
  name: string;
  email: string;
  branche: string | null;
  paket: string | null;
  message: string;
  source: string | null;
};

export function buildStoredContactMessage(submission: ContactSubmission) {
  const details = [
    submission.message || '(keine Nachricht)',
    submission.phone ? `Telefon: ${submission.phone}` : '',
    submission.subject ? `Betreff: ${submission.subject}` : '',
    submission.tenant ? `Mandant: ${submission.tenant}` : '',
    submission.addons.length ? `Gewünschte Add-ons: ${submission.addons.join(', ')}` : '',
    ...Object.entries(submission.extras).map(([key, value]) => `${key}: ${value}`),
  ];
  return details.filter(Boolean).join('\n\n');
}

export function contactInquiryMatchesSubmission(
  inquiry: StoredContactInquiry,
  submission: ContactSubmission,
) {
  return inquiry.name === submission.name
    && inquiry.email === submission.email
    && inquiry.branche === (submission.branche || null)
    && inquiry.paket === (submission.paket || null)
    && inquiry.message === buildStoredContactMessage(submission)
    && inquiry.source === (submission.source || null);
}

export type ContactHandlerDependencies = {
  inspectInquiry: (
    idempotencyKey: string,
    submission: ContactSubmission,
  ) => Promise<ContactInquiryState>;
  checkRateLimits: (
    request: Request,
    email: string,
  ) => Promise<RateLimitDecision & { unavailable?: boolean }>;
  saveInquiry: (
    submission: ContactSubmission,
    idempotencyKey: string,
  ) => Promise<{ id: string; state: Exclude<ContactInquiryState, 'new'> | 'created' }>;
  sendNotification: (submission: ContactSubmission, inquiryId: string) => Promise<void>;
  onNotificationError?: (error: unknown, inquiryId: string) => void;
};

function json(body: Record<string, unknown>, status: number, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

export function createContactPostHandler(dependencies: ContactHandlerDependencies) {
  return async function POST(request: Request): Promise<Response> {
    const mediaType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
    if (mediaType !== 'application/json') {
      return json({ error: 'Content-Type wird nicht unterstützt.' }, 415);
    }
    if (!isTrustedRequestOrigin(request)) {
      return json({ error: 'Ungültiger Request-Ursprung.' }, 403);
    }

    let raw: unknown;
    try {
      raw = await readJsonRequestBody(request, MAX_CONTACT_REQUEST_BYTES);
    } catch (error) {
      if (error instanceof RequestBodyTooLargeError) {
        return json({ error: 'Anfrage ist zu groß.' }, 413);
      }
      if (error instanceof InvalidRequestBodyError) {
        return json({ error: 'Ungültige JSON-Anfrage.' }, 400);
      }
      throw error;
    }

    const parsed = contactRequestSchema.safeParse(raw);
    if (!parsed.success) return json({ error: 'Ungültige Eingabe.' }, 400);
    const submission = parsed.data;

    // Deliberately acknowledge honeypot submissions without touching DB or SMTP.
    if (submission.website) return json({ ok: true }, 200);

    const parsedIdempotencyKey = idempotencyKeySchema.safeParse(request.headers.get('idempotency-key'));
    if (!parsedIdempotencyKey.success) {
      return json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, 400);
    }
    const idempotencyKey = parsedIdempotencyKey.data;

    let inquiryState: ContactInquiryState;
    try {
      inquiryState = await dependencies.inspectInquiry(idempotencyKey, submission);
    } catch (error) {
      console.error('[api/contact] inquiry idempotency lookup failed', error);
      return json({ error: 'Interner Fehler.' }, 500);
    }
    if (inquiryState === 'duplicate') return json({ ok: true, deduplicated: true }, 200);
    if (inquiryState === 'conflict') {
      return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    }

    let rateLimit: RateLimitDecision & { unavailable?: boolean };
    try {
      rateLimit = await dependencies.checkRateLimits(request, submission.email.toLowerCase());
    } catch (error) {
      console.error('[api/contact] rate-limit store unavailable', error);
      rateLimit = { allowed: false, unavailable: true, limit: 0, remaining: 0, retryAfterSeconds: 60 };
    }
    if (!rateLimit.allowed) {
      const status = rateLimit.unavailable ? 503 : 429;
      const error = rateLimit.unavailable
        ? 'Kontaktformular ist vorübergehend nicht verfügbar.'
        : 'Zu viele Anfragen. Bitte später erneut versuchen.';
      return json({ error }, status, { 'Retry-After': String(rateLimit.retryAfterSeconds) });
    }

    let inquiry: { id: string; state: 'created' | 'duplicate' | 'conflict' };
    try {
      inquiry = await dependencies.saveInquiry(submission, idempotencyKey);
    } catch (error) {
      console.error('[api/contact] inquiry persistence failed', error);
      return json({ error: 'Interner Fehler.' }, 500);
    }
    if (inquiry.state === 'duplicate') return json({ ok: true, deduplicated: true }, 200);
    if (inquiry.state === 'conflict') {
      return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    }

    try {
      await dependencies.sendNotification(submission, inquiry.id);
      return json({ ok: true }, 200);
    } catch (error) {
      dependencies.onNotificationError?.(error, inquiry.id);
      // The inquiry is durably stored and visible in the CRM. Do not make the
      // visitor retry and create a duplicate merely because notification failed.
      return json({ ok: true, notificationDelayed: true }, 202);
    }
  };
}
