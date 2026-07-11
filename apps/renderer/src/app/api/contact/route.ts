import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { formSubmissions, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';
import { getEffectiveSmtp } from '@/lib/smtp';
import {
  isHoneypotFilled,
  mergeContactFormFields,
  validateContactFormFields,
  validateContactSubmission,
} from '@/lib/contact-form';

const MAX_REQUEST_BYTES = 100_000;

/**
 * HTML-escape a string so user-supplied form values can't break out of the
 * notification/auto-response email templates (XSS / phishing-link injection).
 * Encodes &, <, >, ", ' — sufficient for text in element bodies and attributes.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    // Honeypot bots receive a neutral success response so they cannot tune
    // their payload against the anti-spam rule. No DB row or email is created.
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ success: true });
    }

    // Anti-spam: 5 real submission attempts / 10 min per IP+tenant.
    const ip = getClientIp(req);
    const rl = rateLimit(`contact:${tenantId}:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

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
        return NextResponse.json({ error: submittedContract.errors[0] || 'Ungültige Formularfelder.' }, { status: 400 });
      }
      fieldContract = mergeContactFormFields(settings?.formFields, submittedContract.fields);
    }

    const submission = validateContactSubmission(body, fieldContract);
    if (!submission.success) {
      return NextResponse.json({ error: submission.error }, { status: 400 });
    }

    const name = submission.values.name;
    const email = submission.values.email;
    const phone = submission.values.phone || null;
    const message = submission.values.message || '';

    // Save to DB
    await db.insert(formSubmissions).values({
      tenantId,
      name,
      email,
      phone,
      message,
      page: submission.page,
      payload: submission.payload,
    });

    // Load SMTP + auto-response settings
    try {
      const autoResponse = settings?.autoResponse as { enabled: boolean; subject: string; body: string; notificationEmail?: string } | null;
      const effectiveSmtp = await getEffectiveSmtp(tenantId);

      if (effectiveSmtp) {
        const transporter = nodemailer.createTransport({
          host: effectiveSmtp.host,
          port: effectiveSmtp.port || 587,
          secure: effectiveSmtp.port === 465,
          auth: { user: effectiveSmtp.user, pass: effectiveSmtp.pass },
        });

        // Build HTML field rows for notification — every interpolation is
        // HTML-escaped to prevent injected markup from form submissions
        // executing in the admin's email client.
        const fieldRows = submission.payload.fields
          .map(field => `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;white-space:nowrap">${escapeHtml(field.label)}</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f3f4f6">${escapeHtml(field.value).replace(/\n/g, '<br>')}</td></tr>`)
          .concat(submission.payload.context?.summary
            ? [`<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;white-space:nowrap">Auswahl</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f3f4f6">${escapeHtml(submission.payload.context.summary).replace(/\n/g, '<br>')}</td></tr>`]
            : [])
          .join('');

        const notificationHtml = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Eine neue Anfrage von Ihrem Kontaktformular</h1>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Sie haben eine neue Nachricht über Ihre Website erhalten:</p>
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;background:#f9fafb">${fieldRows}</table>
      ${submission.page ? `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">Gesendet von: ${escapeHtml(submission.page)}</p>` : ''}
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;color:#9ca3af;font-size:11px">Diese E-Mail wurde automatisch von Ihrem Kontaktformular generiert.</p>
    </div>
  </div>
</div>
</body></html>`;

        const notificationTo = autoResponse?.notificationEmail || effectiveSmtp.from;

        // 1) Notification email to business owner
        await transporter.sendMail({
          from: effectiveSmtp.from,
          to: notificationTo,
          subject: `Eine neue Anfrage von Ihrem Kontaktformular`,
          html: notificationHtml,
        });

        if (autoResponse?.enabled && autoResponse.subject && autoResponse.body) {
          // The settings UI is a plain-text editor. Escape the complete body
          // and only then substitute the escaped name, keeping email markup
          // predictable even when a tenant pastes HTML by accident.
          const responseBody = escapeHtml(autoResponse.body).replace(/\{name\}/g, () => escapeHtml(name || ''));
          const autoResponseHtml = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${escapeHtml(autoResponse.subject)}</h1>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;white-space:pre-line">${responseBody}</p>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;color:#9ca3af;font-size:11px">Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht direkt auf diese Nachricht.</p>
    </div>
  </div>
</div>
</body></html>`;

          await transporter.sendMail({
            from: effectiveSmtp.from,
            to: email,
            subject: autoResponse.subject,
            html: autoResponseHtml,
          });
        }
      }
    } catch {
      // SMTP failure should not fail the submission
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
