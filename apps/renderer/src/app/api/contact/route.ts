import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { formSubmissions, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import nodemailer from 'nodemailer';

const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 20;

export async function POST(req: NextRequest) {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
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
        .select({ smtp: globalSettings.smtp, autoResponse: globalSettings.autoResponse })
        .from(globalSettings)
        .where(eq(globalSettings.tenantId, tenantId))
        .limit(1);

      const smtp = settings?.smtp as { host: string; port: number; user: string; pass: string; from: string } | null;
      const autoResponse = settings?.autoResponse as { enabled: boolean; subject: string; body: string } | null;

      if (smtp?.host && smtp?.user && smtp?.pass && smtp?.from) {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port || 587,
          secure: smtp.port === 465,
          auth: { user: smtp.user, pass: smtp.pass },
        });

        // Build field summary for notification
        const fieldLines = Object.entries(sanitizedFields)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n');

        // 1) Notification email to business owner
        await transporter.sendMail({
          from: smtp.from,
          to: smtp.from,
          subject: `Neue Kontaktanfrage von ${name}`,
          text: `Neue Anfrage über das Kontaktformular:\n\n${fieldLines}\n\nSeite: ${_page || '-'}`,
        });

        // 2) Auto-response email to sender
        if (autoResponse?.enabled && autoResponse.subject && autoResponse.body) {
          const responseBody = autoResponse.body.replace(/\{name\}/g, name);
          await transporter.sendMail({
            from: smtp.from,
            to: email,
            subject: autoResponse.subject,
            text: responseBody,
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
