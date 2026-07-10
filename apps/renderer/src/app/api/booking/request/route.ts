import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isBookingOverlapError, isWithinBookingAvailability, parseBookingDateRange, type BookingTimeModel } from '@/lib/booking-core';
import { getBookingNotificationEmail, sendBookingEmail } from '@/lib/booking-email';
import { formatBookingDate, normalizeTimezone } from '@/lib/booking-time';
import { bookingCustomers, bookingRequests, bookingResources, bookingServices } from '@flamingo/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

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

    // Rate limit: 10 booking requests / 10 min per IP+tenant. Stops bots from
    // flooding the calendar with fake reservations and the admin's inbox with
    // notification emails. Real customers comfortably stay under this.
    const ip = getClientIp(req);
    const rl = rateLimit(`booking:${tenantId}:${ip}`, 10, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Zu viele Buchungsanfragen. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

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
    const timezone = normalizeTimezone(settings.timezone);
    const service = serviceId ? await selectBookingServiceCompat(tenantId, serviceId) : null;
    if (serviceId && !service) return NextResponse.json({ error: 'Diese Leistung ist nicht verfügbar.' }, { status: 400 });
    if (service?.minPartySize && partySize < service.minPartySize) {
      return NextResponse.json({ error: `Mindestens ${service.minPartySize} Person(en)/Einheit(en) erforderlich.` }, { status: 400 });
    }
    if (service?.maxPartySize && partySize > service.maxPartySize) {
      return NextResponse.json({ error: `Maximal ${service.maxPartySize} Person(en)/Einheit(en) möglich.` }, { status: 400 });
    }
    const intakeQuestions = Array.isArray(service?.intakeQuestions) ? service.intakeQuestions : [];
    const intakeAnswers = normalizeIntakeAnswers(body.intakeAnswers, intakeQuestions);
    const missingQuestion = intakeQuestions.find(question => question.required && !intakeAnswers[question.id]);
    if (missingQuestion) return NextResponse.json({ error: `Bitte ausfüllen: ${missingQuestion.label}` }, { status: 400 });

    const [resource] = resourceId
      ? await db.select({ id: bookingResources.id, name: bookingResources.name, type: bookingResources.type }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.id, resourceId), eq(bookingResources.active, true))).limit(1)
      : [];
    if (resourceId && !resource) return NextResponse.json({ error: 'Diese Ressource ist nicht verfügbar.' }, { status: 400 });
    if (service?.requiresResource && !resourceId) return NextResponse.json({ error: 'Diese Leistung benötigt eine Ressource.' }, { status: 400 });
    const allowedTypes = Array.isArray(service?.allowedResourceTypes) ? service.allowedResourceTypes : [];
    if (resource && allowedTypes.length && !allowedTypes.includes(resource.type)) {
      return NextResponse.json({ error: 'Diese Ressource passt nicht zur gewählten Leistung.' }, { status: 400 });
    }

    const requestedTimeModel = ['time_slot', 'full_day', 'date_range'].includes(clean(body.timeModel, 30))
      ? clean(body.timeModel, 30) as BookingTimeModel
      : null;
    const timeModel = (service?.timeModelOverride || requestedTimeModel || settings.timeModel) as BookingTimeModel;
    const bufferBeforeMinutes = Math.max(service?.bufferBeforeMinutes || 0, 0);
    const bufferAfterMinutes = Math.max(service?.bufferAfterMinutes || 0, 0);
    const { startsAt, endsAt } = parseBookingDateRange({
      date: body.date,
      startDate: body.startDate,
      endDate: body.endDate,
      time: body.time,
      timeModel,
      durationMinutes: service?.durationMinutes || settings.intervalMinutes,
      timezone,
    });

    const now = Date.now();
    if (startsAt.getTime() < now + settings.minNoticeHours * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Dieser Termin liegt zu kurzfristig.' }, { status: 400 });
    }
    if (startsAt.getTime() > now + settings.maxAdvanceDays * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Dieser Termin liegt zu weit in der Zukunft.' }, { status: 400 });
    }

    const blockedStartsAt = addMinutes(startsAt, -bufferBeforeMinutes);
    const blockedEndsAt = addMinutes(endsAt, bufferAfterMinutes);
    const available = await isWithinBookingAvailability({ tenantId, serviceId, resourceId, timeModel, startsAt: blockedStartsAt, endsAt: blockedEndsAt, timezone });
    if (!available) return NextResponse.json({ error: 'Dieser Zeitraum ist nicht verfügbar.' }, { status: 409 });
    const blackout = await hasBookingBlackout({ tenantId, resourceId, startsAt: blockedStartsAt, endsAt: blockedEndsAt });
    if (blackout) return NextResponse.json({ error: 'Dieser Zeitraum ist gesperrt.' }, { status: 409 });

    const cancellationToken = crypto.randomBytes(24).toString('hex');
    const cancellationTokenHash = crypto.createHash('sha256').update(cancellationToken).digest('hex');

    // The neon-http driver has NO interactive transactions, so the former
    // pg_advisory_xact_lock + tx wrapper (which made this endpoint throw on
    // every request) is removed. For instant bookings we re-check conflicts
    // immediately before inserting — this covers the common sequential case.
    // A fully race-proof guard needs a DB exclusion constraint
    // (btree_gist over a tstzrange of [startsAt, endsAt) per resource); tracked
    // as a follow-up since it requires a reviewed migration.
    if (settings.mode === 'instant') {
      const conflict = await hasBookingConflict({ tenantId, resourceId, timeModel, startsAt, endsAt, timezone, bufferBeforeMinutes, bufferAfterMinutes });
      if (conflict) return NextResponse.json({ error: 'Dieser Zeitraum ist nicht mehr verfügbar.' }, { status: 409 });
    }
    const [customer] = await db.insert(bookingCustomers).values({
      tenantId,
      name: customerName,
      email: customerEmail || null,
      phone: customerPhone || null,
    }).returning();
    const bookingStatus = settings.mode === 'instant' ? 'confirmed' as const : 'requested' as const;
    const bookingValues = {
      tenantId,
      customerId: customer.id,
      serviceId,
      resourceId,
      mode: settings.mode,
      timeModel,
      status: bookingStatus,
      customerName,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || null,
      partySize,
      startsAt,
      endsAt,
      bufferBeforeMinutes,
      bufferAfterMinutes,
      intakeAnswers,
      message,
      cancellationTokenHash,
    };
    let booking: typeof bookingRequests.$inferSelect;
    try {
      [booking] = await db.insert(bookingRequests).values(bookingValues).returning().catch(async (error) => {
        if (!isMissingBookingRulesColumn(error)) throw error;
        const { bufferBeforeMinutes: _before, bufferAfterMinutes: _after, intakeAnswers: _answers, ...legacyValues } = bookingValues;
        return db.insert(bookingRequests).values(legacyValues).returning();
      });
    } catch (error) {
      await db.delete(bookingCustomers).where(and(
        eq(bookingCustomers.id, customer.id),
        eq(bookingCustomers.tenantId, tenantId),
      )).catch(() => {});
      if (isBookingOverlapError(error)) throw new Error('BOOKING_CONFLICT');
      throw error;
    }

    const bookingSummary = [
      service?.name ? `Leistung: ${service.name}` : null,
      resource?.name ? `Ressource: ${resource.name}` : null,
      `Zeitraum: ${formatBookingDate(startsAt, timezone)} bis ${formatBookingDate(endsAt, timezone)}`,
      `Personen/Menge: ${partySize}`,
    ].filter(Boolean).join('\n');
    const baseUrl = process.env.SITE_URL || req.nextUrl.origin;
    const values = {
      companyName: 'Ihre Website',
      customerName,
      customerEmail,
      customerPhone,
      bookingDate: formatBookingDate(startsAt, timezone),
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
    if (message === 'BOOKING_CONFLICT') return NextResponse.json({ error: 'Dieser Zeitraum ist nicht mehr verfügbar.' }, { status: 409 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeIntakeAnswers(
  value: unknown,
  questions: { id: string; label: string; type?: string; required?: boolean; options?: string[] }[],
) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  return Object.fromEntries(questions.map((question) => {
    const answer = clean(raw[question.id], 1000);
    const options = Array.isArray(question.options) ? question.options : [];
    const safeAnswer = options.length && answer && !options.includes(answer) ? '' : answer;
    return [question.id, safeAnswer];
  }).filter(([, answer]) => Boolean(answer)));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function selectBookingServiceCompat(tenantId: string, serviceId: string) {
  const db = getDb();
  try {
    const [service] = await db.select().from(bookingServices)
      .where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.id, serviceId), eq(bookingServices.active, true)))
      .limit(1);
    return service || null;
  } catch (error) {
    if (!isMissingBookingRulesColumn(error)) throw error;
    const [service] = await db.select({
      id: bookingServices.id,
      tenantId: bookingServices.tenantId,
      name: bookingServices.name,
      description: bookingServices.description,
      durationMinutes: bookingServices.durationMinutes,
      timeModelOverride: bookingServices.timeModelOverride,
      priceLabel: bookingServices.priceLabel,
      requiresResource: bookingServices.requiresResource,
      allowedResourceTypes: bookingServices.allowedResourceTypes,
      active: bookingServices.active,
      sortOrder: bookingServices.sortOrder,
      createdAt: bookingServices.createdAt,
      updatedAt: bookingServices.updatedAt,
    }).from(bookingServices)
      .where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.id, serviceId), eq(bookingServices.active, true)))
      .limit(1);
    return service ? { ...service, bufferBeforeMinutes: 0, bufferAfterMinutes: 0, minPartySize: null, maxPartySize: null, intakeQuestions: [] } : null;
  }
}

function isMissingBookingRulesColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /buffer_before_minutes|buffer_after_minutes|min_party_size|max_party_size|intake_questions|intake_answers|column .* does not exist/i.test(message);
}
