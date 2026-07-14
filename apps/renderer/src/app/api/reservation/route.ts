import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { reservations } from '@flamingo/db';
import { isDemoTenant, resolveTenant } from '@/lib/snapshot';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    const ip = getClientIp(req);
    const rl = rateLimit(`reservation:${tenantId}:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

    const body = await req.json();
    const { name, email, phone, date, time, guests, message } = body;

    if (!name || !date) {
      return NextResponse.json({ error: 'Name und Datum sind Pflichtfelder.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof date !== 'string') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
