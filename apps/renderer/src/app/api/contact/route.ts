import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { formSubmissions, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import nodemailer from 'nodemailer';

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(req: NextRequest) {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, email, phone, message, page } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Nachricht ist zu lang.' }, { status: 400 });
    }

    const db = getDb();

    // Save to DB
    await db.insert(formSubmissions).values({
      tenantId,
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 320),
      phone: phone ? String(phone).trim().slice(0, 50) : null,
      message: message.trim().slice(0, MAX_MESSAGE_LENGTH),
      page: page ? String(page).slice(0, 200) : null,
    });

    // Try to send email notification if SMTP is configured
    try {
      const [settings] = await db
        .select({ smtp: globalSettings.smtp })
        .from(globalSettings)
        .where(eq(globalSettings.tenantId, tenantId))
        .limit(1);

      const smtp = settings?.smtp as { host: string; port: number; user: string; pass: string; from: string } | null;

      if (smtp?.host && smtp?.user && smtp?.pass && smtp?.from) {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port || 587,
          secure: smtp.port === 465,
          auth: { user: smtp.user, pass: smtp.pass },
        });

        await transporter.sendMail({
          from: smtp.from,
          to: smtp.from, // Send notification to the configured sender address
          subject: `Neue Kontaktanfrage von ${name}`,
          text: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone || '-'}\n\nNachricht:\n${message}`,
        });
      }
    } catch {
      // SMTP failure should not fail the submission
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
