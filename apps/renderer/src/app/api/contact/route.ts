import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { formSubmissions, globalSettings } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { isDemoTenant, resolveTenant } from '@/lib/snapshot';
import {
  isHoneypotFilled,
  mergeContactFormFields,
  validateContactAutoResponse,
  validateContactFormFields,
  validateContactSubmission,
} from '@/lib/contact-form';
import {
  createHardenedRendererSmtpTransport,
  getEffectiveSmtp,
  isValidSmtpAddress,
} from '@/lib/smtp';
import {
  classifyRendererContactIdempotency,
  consumeRendererContactRateRules,
  fingerprintRendererContactSubmission,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  parseRendererContactIdempotencyKey,
  readBoundedRendererContactJson,
  rendererAutoResponseRateRules,
  rendererContactRateRules,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';

export const runtime = 'nodejs';

function json(body: Record<string, unknown>, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    return json({ error: 'Content-Type wird nicht unterstützt.' }, 415);
  }
  if (!isTrustedRendererContactOrigin(req)) {
    return json({ error: 'Ungültiger Request-Ursprung.' }, 403);
  }

  let body: unknown;
  try {
    body = await readBoundedRendererContactJson(req);
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return json({ error: 'Die Anfrage ist zu groß.' }, 413);
    if (error instanceof RendererContactBodyInvalidError) return json({ error: 'Ungültige Eingabe.' }, 400);
    console.error('[renderer-contact] body read failed', error);
    return json({ error: 'Ungültige Eingabe.' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'Ungültige Eingabe.' }, 400);

  // Do not reveal the anti-bot contract and do not create DB/rate-limit keys.
  if (isHoneypotFilled(body)) return json({ success: true });

  const idempotencyKey = parseRendererContactIdempotencyKey(req.headers.get('idempotency-key'));
  if (!idempotencyKey) return json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, 400);

  try {
    const tenantId = await resolveTenant();
    if (!tenantId) return json({ error: 'Tenant not found' }, 404);
    const db = getDb();
    const [settings] = await db
      .select({ formFields: globalSettings.formFields, autoResponse: globalSettings.autoResponse })
      .from(globalSettings)
      .where(eq(globalSettings.tenantId, tenantId))
      .limit(1);

    const record = body as Record<string, unknown>;
    let fieldContract: unknown = settings?.formFields;
    if (record._formFields !== undefined) {
      const submittedContract = validateContactFormFields(record._formFields);
      if (!submittedContract.success) {
        return json({ error: submittedContract.errors[0] || 'Ungültige Formularfelder.' }, 400);
      }
      fieldContract = mergeContactFormFields(settings?.formFields, submittedContract.fields);
    }

    const submission = validateContactSubmission(body, fieldContract);
    if (!submission.success) return json({ error: submission.error }, 400);

    if (await isDemoTenant(tenantId)) {
      return json({ success: true, demo: true });
    }

    const name = submission.values.name;
    const email = submission.values.email;
    const phone = submission.values.phone || null;
    const message = submission.values.message || '';
    const clientAddress = getRendererContactClientAddress(req.headers);
    const requestHash = fingerprintRendererContactSubmission({
      tenantId,
      values: submission.values,
      payload: submission.payload,
      page: submission.page,
    });

    const [existingSubmission] = await db
      .select({ requestHash: formSubmissions.requestHash })
      .from(formSubmissions)
      .where(and(
        eq(formSubmissions.tenantId, tenantId),
        eq(formSubmissions.idempotencyKey, idempotencyKey),
      ))
      .limit(1);
    if (existingSubmission) {
      const classification = classifyRendererContactIdempotency(existingSubmission.requestHash, requestHash);
      if (classification === 'duplicate') return json({ success: true, deduplicated: true });
      return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    }

    let denied;
    try {
      denied = await consumeRendererContactRateRules(
        rendererContactRateRules(tenantId, clientAddress, email),
      );
    } catch (error) {
      console.error('[renderer-contact] persistent rate-limit unavailable', error);
      return json({ error: 'Kontaktformular ist vorübergehend nicht verfügbar.' }, 503, { 'Retry-After': '60' });
    }
    if (denied) {
      return json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        429,
        { 'Retry-After': String(denied.retryAfterSeconds) },
      );
    }

    const validatedAutoResponse = validateContactAutoResponse(
      settings?.autoResponse || { enabled: false, subject: '', body: '' },
    );
    const autoResponse = validatedAutoResponse.success ? validatedAutoResponse.value : null;
    const [saved] = await db
      .insert(formSubmissions)
      .values({
        tenantId,
        idempotencyKey,
        requestHash,
        name,
        email,
        phone,
        message,
        page: submission.page,
        payload: submission.payload,
        notificationStatus: 'pending',
        autoResponseStatus: autoResponse?.enabled ? 'pending' : 'disabled',
      })
      .onConflictDoNothing({ target: [formSubmissions.tenantId, formSubmissions.idempotencyKey] })
      .returning({ id: formSubmissions.id });

    if (!saved) {
      const [existing] = await db
        .select({ requestHash: formSubmissions.requestHash })
        .from(formSubmissions)
        .where(and(
          eq(formSubmissions.tenantId, tenantId),
          eq(formSubmissions.idempotencyKey, idempotencyKey),
        ))
        .limit(1);
      const classification = classifyRendererContactIdempotency(existing?.requestHash || null, requestHash);
      if (classification === 'duplicate') return json({ success: true, deduplicated: true });
      return json({ error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.' }, 409);
    }

    const effectiveSmtp = await getEffectiveSmtp(tenantId);
    if (!effectiveSmtp) {
      await db.update(formSubmissions).set({
        notificationStatus: 'not_configured',
        autoResponseStatus: autoResponse?.enabled ? 'not_configured' : 'disabled',
      }).where(eq(formSubmissions.id, saved.id));
      return json({ success: true, notificationDelayed: true }, 202);
    }

    const notificationTo = autoResponse?.notificationEmail && isValidSmtpAddress(autoResponse.notificationEmail)
      ? autoResponse.notificationEmail
      : effectiveSmtp.from;
    const transporter = createHardenedRendererSmtpTransport(effectiveSmtp);
    const fieldRows = submission.payload.fields
      .map(field => `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;white-space:nowrap">${escapeHtml(field.label)}</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f3f4f6">${escapeHtml(field.value).replace(/\r?\n/g, '<br>')}</td></tr>`)
      .concat(submission.payload.context?.summary
        ? [`<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;white-space:nowrap">Auswahl</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f3f4f6">${escapeHtml(submission.payload.context.summary).replace(/\r?\n/g, '<br>')}</td></tr>`]
        : [])
      .join('');
    const notificationHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb"><div style="max-width:600px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border-radius:12px;overflow:hidden"><div style="background:#1a5276;padding:24px 32px"><h1 style="margin:0;color:#fff;font-size:20px">Neue Kontaktanfrage</h1></div><div style="padding:24px 32px"><table style="width:100%;border-collapse:collapse;background:#f9fafb">${fieldRows}</table>${submission.page ? `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">Gesendet von: ${escapeHtml(submission.page)}</p>` : ''}</div></div></div></body></html>`;

    try {
      await transporter.sendMail({
        from: { name: 'Website Kontaktformular', address: effectiveSmtp.from },
        replyTo: { name: name.replace(/[\r\n]+/g, ' ').slice(0, 120), address: email },
        to: { name: 'Kontakt-Empfang', address: notificationTo },
        subject: 'Eine neue Anfrage von Ihrem Kontaktformular',
        text: submission.payload.fields.map(field => `${field.label}: ${field.value}`).join('\n'),
        html: notificationHtml,
        headers: { 'X-Mailer': 'Flamingo CMS Contact' },
      });
      await db.update(formSubmissions).set({ notificationStatus: 'sent' }).where(eq(formSubmissions.id, saved.id));
    } catch (error) {
      console.error(`[renderer-contact] notification failed for submission ${saved.id}`, error);
      await db.update(formSubmissions).set({
        notificationStatus: 'failed',
        autoResponseStatus: autoResponse?.enabled ? 'skipped' : 'disabled',
      }).where(eq(formSubmissions.id, saved.id));
      return json({ success: true, notificationDelayed: true }, 202);
    }

    if (autoResponse?.enabled && autoResponse.subject && autoResponse.body) {
      let autoResponseDenied;
      try {
        autoResponseDenied = await consumeRendererContactRateRules(
          rendererAutoResponseRateRules(tenantId, clientAddress, email),
        );
      } catch (error) {
        console.error('[renderer-contact] auto-response limiter unavailable', error);
        autoResponseDenied = { allowed: false, retryAfterSeconds: 60 };
      }
      if (autoResponseDenied) {
        await db.update(formSubmissions).set({ autoResponseStatus: 'rate_limited' }).where(eq(formSubmissions.id, saved.id));
        return json({ success: true });
      }

      const safeResponseBody = escapeHtml(autoResponse.body).replace(/\{name\}/g, () => escapeHtml(name || ''));
      const autoResponseHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb"><div style="max-width:600px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border-radius:12px;overflow:hidden"><div style="background:#1a5276;padding:24px 32px"><h1 style="margin:0;color:#fff;font-size:20px">${escapeHtml(autoResponse.subject)}</h1></div><div style="padding:24px 32px"><p style="margin:0;color:#374151;font-size:15px;line-height:1.6;white-space:pre-line">${safeResponseBody}</p></div></div></div></body></html>`;
      try {
        await transporter.sendMail({
          from: { name: 'Website Kontaktformular', address: effectiveSmtp.from },
          replyTo: { name: 'Website-Team', address: notificationTo },
          to: { name: name.replace(/[\r\n]+/g, ' ').slice(0, 120), address: email },
          subject: autoResponse.subject,
          text: autoResponse.body.replace(/\{name\}/g, name || ''),
          html: autoResponseHtml,
          headers: { 'X-Mailer': 'Flamingo CMS Auto Response' },
        });
        await db.update(formSubmissions).set({ autoResponseStatus: 'sent' }).where(eq(formSubmissions.id, saved.id));
      } catch (error) {
        console.error(`[renderer-contact] auto-response failed for submission ${saved.id}`, error);
        await db.update(formSubmissions).set({ autoResponseStatus: 'failed' }).where(eq(formSubmissions.id, saved.id));
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error('[renderer-contact] request failed', error);
    return json({ error: 'Interner Fehler.' }, 500);
  }
}
