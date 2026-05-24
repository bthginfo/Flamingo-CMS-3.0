import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.PLATFORM_SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.PLATFORM_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.PLATFORM_SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('SMTP-Konfiguration fehlt (SMTP_HOST/USER/PASS)');
  }
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || process.env.PLATFORM_SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
}

function buildEmailHtml(subject: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#6366f1,#ec4899);padding:32px 40px;">
    <img src="https://www.flamingomedia.online/brand/flamingo-full-beside.png" alt="Flamingo Media" width="160" style="display:block;margin-bottom:8px;" />
    <h1 style="color:#ffffff;font-size:20px;font-weight:600;margin:0;">${subject}</h1>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:32px 40px;color:#333333;font-size:15px;line-height:1.7;">
    ${body.replace(/\n/g, '<br>')}
  </td></tr>
  <!-- Footer / Signature -->
  <tr><td style="padding:24px 40px;border-top:1px solid #eee;color:#888;font-size:13px;line-height:1.6;">
    <strong style="color:#333;">Mario & Julius</strong><br>
    Flamingo Media<br>
    <a href="https://www.flamingomedia.online" style="color:#6366f1;text-decoration:none;">www.flamingomedia.online</a><br>
    <span style="color:#aaa;">hello@flamingomedia.online</span>
  </td></tr>
</table>
<p style="text-align:center;color:#aaa;font-size:11px;margin-top:20px;">&copy; ${new Date().getFullYear()} Flamingo Media. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'to, subject und body sind erforderlich' }, { status: 400 });
    }

    const html = buildEmailHtml(subject, body);
    const transporter = getTransporter();
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.PLATFORM_SMTP_FROM || process.env.PLATFORM_SMTP_USER;

    await transporter.sendMail({
      from: `"Mario & Julius - Flamingo Media" <${fromAddress}>`,
      replyTo: `"Flamingo Media" <${fromAddress}>`,
      to,
      subject,
      text: body,
      html,
      headers: {
        'X-Mailer': 'Flamingo Media CRM',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-lead-email]', err);
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 });
  }
}
