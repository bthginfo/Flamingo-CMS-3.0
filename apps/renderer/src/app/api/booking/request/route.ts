import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isWithinBookingAvailability, parseBookingDateRange, type BookingTimeModel } from '@/lib/booking-core';
import { getBookingNotificationEmail, sendBookingEmail } from '@/lib/booking-email';
import { bookingCustomers, bookingRequests, bookingResources, bookingServices } from '@flamingo/db';

function resolveExplicitTenant(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return null;
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (fixedTenantId) return value === fixedTenantId ? value : null;
  return value;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = resolveExplicitTenant(body.tenantId) || await resolveTenant();
    if (!tenantId) return NextResponse.json({ error: 'Tenant nicht gefunden.' }, { status: 404 });
    if (!(await hasBookingAddon(tenantId))) return NextResponse.json({ error: 'Booking ist nicht aktiviert.' }, { status: 403 });

    const customerName = clean(body.customerName, 255);
    const customerEmail = clean(body.customerEmail, 320);
    const customerPhone = clean(body.customerPhone, 80);
    const serviceId = clean(body.serviceId, 80) || null;
    const resourceId = clean(body.resourceId, 80) || null;
    const message = clean(body.message, 2000) || null;
    const partySize = clamp(Number(body.partySize) || 1, 1, 10000);
    if (!customerName) return NextResponse.json({ error: 'Name ist ein Pflichtfeld.' }, { status: 400 });
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });

    const db = getDb();
    const settings = await getOrCreateBookingSettings(tenantId);
    const [service] = serviceId
      ? await db.select().from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.id, serviceId), eq(bookingServices.active, true))).limit(1)
      : [];
    if (serviceId && !service) return NextResponse.json({ error: 'Diese Leistung ist nicht verfügbar.' }, { status: 400 });

    const [resource] = resourceId
      ? await db.select({ id: bookingResources.id }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.id, resourceId), eq(bookingResources.active, true))).limit(1)
      : [];
    if (resourceId && !resource) return NextResponse.json({ error: 'Diese Ressource ist nicht verfügbar.' }, { status: 400 });

    const timeModel = (service?.timeModelOverride || settings.timeModel) as BookingTimeModel;
    const { startsAt, endsAt } = parseBookingDateRange({
      date: body.date,
      startDate: body.startDate,
      endDate: body.endDate,
      time: body.time,
      timeModel,
      durationMinutes: service?.durationMinutes || settings.intervalMinutes,
    });

    const now = Date.now();
    if (startsAt.getTime() < now + settings.minNoticeHours * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Dieser Termin liegt zu kurzfristig.' }, { status: 400 });
    }
    if (startsAt.getTime() > now + settings.maxAdvanceDays * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Dieser Termin liegt zu weit in der Zukunft.' }, { status: 400 });
    }

    const available = await isWithinBookingAvailability({ tenantId, serviceId, resourceId, timeModel, startsAt, endsAt });
    if (!available) return NextResponse.json({ error: 'Dieser Zeitraum ist nicht verfügbar.' }, { status: 409 });

    const blackout = await hasBookingBlackout({ tenantId, resourceId, startsAt, endsAt });
    if (blackout) return NextResponse.json({ error: 'Dieser Zeitraum ist gesperrt.' }, { status: 409 });

    if (settings.mode === 'instant') {
      const conflict = await hasBookingConflict({ tenantId, resourceId, timeModel, startsAt, endsAt });
      if (conflict) return NextResponse.json({ error: 'Dieser Zeitraum ist nicht mehr verfügbar.' }, { status: 409 });
    }

    const [customer] = await db.insert(bookingCustomers).values({
      tenantId,
      name: customerName,
      email: customerEmail || null,
      phone: customerPhone || null,
    }).returning();

    const cancellationToken = crypto.randomBytes(24).toString('hex');
    const cancellationTokenHash = crypto.createHash('sha256').update(cancellationToken).digest('hex');
    const [booking] = await db.insert(bookingRequests).values({
      tenantId,
      customerId: customer.id,
      serviceId,
      resourceId,
      mode: settings.mode,
      timeModel,
      status: settings.mode === 'instant' ? 'confirmed' : 'requested',
      customerName,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || null,
      partySize,
      startsAt,
      endsAt,
      message,
      cancellationTokenHash,
    }).returning();

    const bookingSummary = [
      service?.name ? `Leistung: ${service.name}` : null,
      `Zeitraum: ${formatDate(startsAt)} bis ${formatDate(endsAt)}`,
      `Personen/Menge: ${partySize}`,
    ].filter(Boolean).join('\n');
    const baseUrl = process.env.SITE_URL || req.nextUrl.origin;
    const values = {
      companyName: 'Ihre Website',
      customerName,
      customerEmail,
      customerPhone,
      bookingDate: formatDate(startsAt),
      bookingSummary,
      message,
      cancellationUrl: `${baseUrl}/api/booking/cancel?booking=${booking.id}&token=${cancellationToken}`,
    };

    if (settings.customerEmailEnabled && customerEmail) {
      sendBookingEmail({ tenantId, trigger: settings.mode === 'instant' ? 'booking_confirmed_customer' : 'booking_requested_customer', to: customerEmail, values }).catch(console.error);
    }
    if (settings.adminEmailEnabled) {
      const adminEmail = await getBookingNotificationEmail(tenantId);
      sendBookingEmail({ tenantId, trigger: 'booking_requested_admin', to: adminEmail, values }).catch(console.error);
    }

    return NextResponse.json({ success: true, id: booking.id, status: booking.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Interner Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
