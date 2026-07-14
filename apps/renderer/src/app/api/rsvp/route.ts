import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rsvpResponses } from '@flamingo/db';
import { isDemoTenant, resolveTenant } from '@/lib/snapshot';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    const ip = getClientIp(req);
    const rl = rateLimit(`rsvp:${tenantId}:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

    const body = await req.json();
    const { name, email, attending, guestCount, guestNames, dietary, allergies, songWish, comment } = body;

    if (!name || !email || !attending) {
      return NextResponse.json({ error: 'Name, E-Mail und Zusage sind Pflichtfelder.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    if (!['yes', 'no'].includes(attending)) {
      return NextResponse.json({ error: 'Ungültige Zusage.' }, { status: 400 });
    }

    if (await isDemoTenant(tenantId)) {
      return NextResponse.json({ success: true, demo: true });
    }

    const db = await getDb();
    await db.insert(rsvpResponses).values({
      tenantId,
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      attending: attending === 'yes',
      guestCount: Math.min(Math.max(Number(guestCount) || 1, 1), 10),
      guestNames: (guestNames || '').slice(0, 500),
      dietary: (dietary || '').slice(0, 300),
      allergies: (allergies || '').slice(0, 300),
      songWish: (songWish || '').slice(0, 300),
      comment: (comment || '').slice(0, 1000),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
