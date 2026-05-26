import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { inquiries } from '@flamingo/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
    const branche = typeof body.branche === 'string' ? body.branche.trim().slice(0, 100) : null;
    const paket = typeof body.paket === 'string' ? body.paket.trim().slice(0, 100) : null;
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
    const source = typeof body.source === 'string' ? body.source.trim().slice(0, 100) : null;
    const rawAddons: unknown[] = Array.isArray(body.addons) ? body.addons : [];
    const addons = rawAddons
          .filter((addon: unknown): addon is string => typeof addon === 'string')
          .map((addon) => addon.trim().slice(0, 160))
          .filter(Boolean)
          .slice(0, 20);

    // Honeypot
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Name und E-Mail sind Pflichtfelder.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    const db = getDb();

    await db.insert(inquiries).values({
      name,
      email,
      branche,
      paket,
      message: [message || '(keine Nachricht)', addons.length ? `Gewünschte Add-ons: ${addons.join(', ')}` : ''].filter(Boolean).join('\n\n'),
      source,
    });

    // Send notification email (fire-and-forget)
    sendNotification({ name, email, branche, paket, message, source, addons }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/contact] Error:', e);
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}

async function sendNotification(data: { name: string; email: string; branche: string | null; paket: string | null; message: string; source: string | null; addons: string[] }) {
  const host = process.env.PLATFORM_SMTP_HOST;
  const user = process.env.PLATFORM_SMTP_USER;
  const pass = process.env.PLATFORM_SMTP_PASS;
  const from = process.env.PLATFORM_SMTP_FROM;
  if (!host || !user || !pass || !from) return;

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.PLATFORM_SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  const lines = [
    `<strong>Name:</strong> ${escapeHtml(data.name)}`,
    `<strong>E-Mail:</strong> ${escapeHtml(data.email)}`,
    data.branche ? `<strong>Branche:</strong> ${escapeHtml(data.branche)}` : '',
    data.paket ? `<strong>Paket:</strong> ${escapeHtml(data.paket)}` : '',
    data.addons.length ? `<strong>Add-ons:</strong> ${escapeHtml(data.addons.join(', '))}` : '',
    `<strong>Nachricht:</strong><br>${escapeHtml(data.message).replace(/\n/g, '<br>')}`,
    data.source ? `<em>Quelle: ${escapeHtml(data.source)}</em>` : '',
  ].filter(Boolean);

  await transporter.sendMail({
    from,
    to: 'hello@flamingomedia.online',
    subject: `Neue Anfrage von ${data.name}`,
    html: `<div style="font-family:sans-serif;line-height:1.6">${lines.join('<br><br>')}</div>`,
  });
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
