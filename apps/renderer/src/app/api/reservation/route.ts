import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { reservations } from '@flamingo/db';
import { isDemoTenant, resolveTenant } from '@/lib/snapshot';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
      return NextResponse.json({ error: 'Content-Type wird nicht unterstützt.' }, { status: 415 });
    }
    if (!isTrustedRendererContactOrigin(req)) {
      return NextResponse.json({ error: 'Ungültiger Request-Ursprung.' }, { status: 403 });
    }
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    let body: Record<string, unknown>;
    try {
      body = await readBoundedRendererContactJson(req, 64 * 1024) as Record<string, unknown>;
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RendererContactBodyInvalidError();
    } catch (error) {
      if (error instanceof RendererContactBodyTooLargeError) return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
      return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }
    const denied = await consumeRendererContactRateRules([
      { scope: 'renderer_reservation_ip', subject: `${tenantId}:${getRendererContactClientAddress(req.headers)}`, limit: 5, windowSeconds: 10 * 60 },
      { scope: 'renderer_reservation_tenant', subject: tenantId, limit: 50, windowSeconds: 10 * 60 },
      { scope: 'renderer_reservation_global', subject: 'all', limit: 600, windowSeconds: 10 * 60 },
    ]);
    if (denied) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(denied.retryAfterSeconds) } },
      );
    }

    const { name, email, phone, date, time, guests, message } = body;

    if (!name || !date) {
      return NextResponse.json({ error: 'Name und Datum sind Pflichtfelder.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }
    if (time && (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return NextResponse.json({ error: 'Ungültige Uhrzeit.' }, { status: 400 });
    if (phone != null && typeof phone !== 'string') return NextResponse.json({ error: 'Ungültige Telefonnummer.' }, { status: 400 });
    if (message != null && typeof message !== 'string') return NextResponse.json({ error: 'Ungültige Nachricht.' }, { status: 400 });

    if (await isDemoTenant(tenantId)) {
      return NextResponse.json({ success: true, demo: true });
    }

    const db = await getDb();
    await db.insert(reservations).values({
      tenantId,
      name: name.slice(0, 200),
      email: email ? String(email).slice(0, 200) : null,
      phone: phone ? String(phone).slice(0, 50) : null,
      date: date.slice(0, 20),
      time: time ? String(time).slice(0, 10) : null,
      guests: Math.min(Math.max(Number(guests) || 2, 1), 20),
      message: message ? String(message).slice(0, 1000) : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Reservation] request failed', error);
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
