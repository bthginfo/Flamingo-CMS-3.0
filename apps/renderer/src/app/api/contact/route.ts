import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { formSubmissions, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';
import { getEffectiveSmtp } from '@/lib/smtp';

const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 20;

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
    // Anti-spam: 5 submissions / 10 min per IP+tenant
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    const ip = getClientIp(req);
    const rl = rateLimit(`contact:${tenantId}:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    const { _page, ...fields } = body as Record<string, unknown>;

    // Extract standard fields for DB storage (backwards-compatible)
    const name = typeof fields.name === 'string' ? fields.name.trim().slice(0, 200) : null;
    const email = typeof fields.email === 'string' ? fields.email.trim().slice(0, 320) : null;
    const phone = typeof fields.phone === 'string' ? fields.phone.trim().slice(0, 50) : null;
    const message = typeof fields.message === 'string' ? fields.message.trim().slice(0, MAX_FIELD_LENGTH) : null;

    // Require at least name and email
    if (!name || !email) {
      return NextResponse.json({ error: 'Name und E-Mail sind Pflichtfelder.' }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    // Sanitize all fields for notification email
    const sanitizedFields: Record<string, string> = {};
    let fieldCount = 0;
    for (const [key, val] of Object.entries(fields)) {
      if (fieldCount >= MAX_FIELDS) break;
      if (typeof val === 'string' && val.trim()) {
        sanitizedFields[key] = val.trim().slice(0, MAX_FIELD_LENGTH);
        fieldCount++;
      }
    }

    const db = getDb();

    // Save to DB
    await db.insert(formSubmissions).values({
      tenantId,
      name: name!,
      email: email!,
      phone,
      message: message || '',
      page: typeof _page === 'string' ? _page.slice(0, 200) : null,
    });

    // Load SMTP + auto-response settings
    try {
      const [settings] = await db
        .select({ autoResponse: globalSettings.autoResponse })
        .from(globalSettings)
        .where(eq(globalSettings.tenantId, tenantId))
        .limit(1);

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
        const fieldRows = Object.entries(sanitizedFields)
          .map(([key, val]) => `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;white-space:nowrap">${escapeHtml(key)}</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f3f4f6">${escapeHtml(val).replace(/\n/g, '<br>')}</td></tr>`)
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
      ${_page ? `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">Gesendet von: ${escapeHtml(_page)}</p>` : ''}
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

        //// Replace {name} with the escaped name so an attacker can't smuggle
          // HTML/JS via their submitted name. Body itself is admin-authored,
          // so we treat it as trusted template content (kept as-is).
          const responseBody = autoResponse.body.replace(/\{name\}/g, escapeHtml(name || ''));
          const autoResponseHtml = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${escapeHtml(autoResponse.subject)0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${autoResponse.subject}</h1>
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
