import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rsvpResponses } from '@flamingo/db';
import { isDemoTenant, resolveTenant } from '@/lib/snapshot';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  rendererRsvpRateRules,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';

const MAX_RSVP_REQUEST_BYTES = 32 * 1024;

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
      const parsed = await readBoundedRendererContactJson(req, MAX_RSVP_REQUEST_BYTES);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new RendererContactBodyInvalidError();
      body = parsed as Record<string, unknown>;
    } catch (error) {
      if (error instanceof RendererContactBodyTooLargeError) {
        return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
      }
      return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
    }

    const { name, email, attending, guestCount, guestNames, dietary, allergies, songWish, comment } = body;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof attending !== 'string') {
      return NextResponse.json({ error: 'Name, E-Mail und Zusage sind Pflichtfelder.' }, { status: 400 });
    }
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedName) {
      return NextResponse.json({ error: 'Name ist ein Pflichtfeld.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }
    if (!['yes', 'no'].includes(attending)) {
      return NextResponse.json({ error: 'Ungültige Zusage.' }, { status: 400 });
    }
    for (const value of [guestNames, dietary, allergies, songWish, comment]) {
      if (value != null && typeof value !== 'string') {
        return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
      }
    }
    if (guestCount != null && typeof guestCount !== 'number' && typeof guestCount !== 'string') {
      return NextResponse.json({ error: 'Ungültige Gästezahl.' }, { status: 400 });
    }
    const parsedGuestCount = guestCount == null || guestCount === '' ? 1 : Number(guestCount);
    if (!Number.isFinite(parsedGuestCount)) {
      return NextResponse.json({ error: 'Ungültige Gästezahl.' }, { status: 400 });
    }

    const denied = await consumeRendererContactRateRules(rendererRsvpRateRules(
      tenantId,
      getRendererContactClientAddress(req.headers),
      normalizedEmail,
    ));
    if (denied) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(denied.retryAfterSeconds) } },
      );
    }

    if (await isDemoTenant(tenantId)) {
      return NextResponse.json({ success: true, demo: true });
    }

    const db = await getDb();
    await db.insert(rsvpResponses).values({
      tenantId,
      name: normalizedName.slice(0, 200),
      email: normalizedEmail.slice(0, 200),
      attending: attending === 'yes',
      guestCount: Math.min(Math.max(Math.trunc(parsedGuestCount), 1), 10),
      guestNames: typeof guestNames === 'string' ? guestNames.slice(0, 500) : '',
      dietary: typeof dietary === 'string' ? dietary.slice(0, 300) : '',
      allergies: typeof allergies === 'string' ? allergies.slice(0, 300) : '',
      songWish: typeof songWish === 'string' ? songWish.slice(0, 300) : '',
      comment: typeof comment === 'string' ? comment.slice(0, 1000) : '',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
