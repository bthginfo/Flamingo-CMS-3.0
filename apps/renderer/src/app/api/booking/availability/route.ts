import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getBookingCalendarBlocks, getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isWithinBookingAvailability, type BookingTimeModel } from '@/lib/booking-core';
import { getZonedWeekday, normalizeTimezone, zonedDateTimeToUtc, zonedDayEndToUtc, zonedDayStartToUtc } from '@/lib/booking-time';
import { bookingAvailabilityRules, bookingResources, bookingServices } from '@flamingo/db';

function resolveExplicitTenant(value: string | null) {
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return null;
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (fixedTenantId) return value === fixedTenantId ? value : null;
  return value;
}

export async function GET(req: NextRequest) {
  const tenantId = resolveExplicitTenant(req.nextUrl.searchParams.get('tenantId')) || await resolveTenant();
  if (!tenantId) return NextResponse.json({ enabled: false, slots: [] }, { status: 404 });
  if (!(await hasBookingAddon(tenantId))) return NextResponse.json({ enabled: false, slots: [] });
  const activeTenantId = tenantId;

  const date = req.nextUrl.searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ enabled: true, slots: [] });

  const serviceId = req.nextUrl.searchParams.get('serviceId') || null;
  const resourceId = req.nextUrl.searchParams.get('resourceId') || null;
  const db = getDb();
  const settings = await getOrCreateBookingSettings(tenantId);
  const timezone = normalizeTimezone(settings.timezone);

  const service = serviceId ? await selectBookingServiceCompat(tenantId, serviceId) : null;
  const [resource] = resourceId
    ? await db.select({ id: bookingResources.id, type: bookingResources.type }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.id, resourceId), eq(bookingResources.active, true))).limit(1)
    : [];
  if (serviceId && !service) return NextResponse.json({ enabled: true, slots: [] });
  if (resourceId && !resource) return NextResponse.json({ enabled: true, slots: [] });
  if (service?.requiresResource && !resourceId) return NextResponse.json({ enabled: true, resourceRequired: true, slots: [] });

  const allowedTypes = Array.isArray(service?.allowedResourceTypes) ? service.allowedResourceTypes : [];
  if (resource && allowedTypes.length && !allowedTypes.includes(resource.type)) return NextResponse.json({ enabled: true, slots: [] });

  const timeModel = (service?.timeModelOverride || settings.timeModel) as BookingTimeModel;
  const bufferBeforeMinutes = Math.max(service?.bufferBeforeMinutes || 0, 0);
  const bufferAfterMinutes = Math.max(service?.bufferAfterMinutes || 0, 0);
  if (timeModel === 'full_day' || timeModel === 'date_range') {
    const startsAt = zonedDayStartToUtc(date, timezone);
    const endsAt = zonedDayEndToUtc(date, timezone);
    const available = await isSlotAvailable({ tenantId, serviceId, resourceId, timeModel, startsAt, endsAt, timezone, bufferBeforeMinutes, bufferAfterMinutes });
    return NextResponse.json({ enabled: true, timeModel, timezone, slots: available ? [{ value: 'full_day', label: 'Ganzer Tag verfügbar' }] : [] });
  }

  const duration = Math.max(service?.durationMinutes || settings.intervalMinutes, 5);
  const interval = Math.max(settings.intervalMinutes, 5);
  const uniqueSlots = await computeSlots(date);
  const suggestions = uniqueSlots.length ? [] : await computeSuggestions(date);
  return NextResponse.json({ enabled: true, timeModel, timezone, slots: uniqueSlots, suggestions });

  async function computeSlots(day: string) {
    const weekday = getZonedWeekday(zonedDayStartToUtc(day, timezone), timezone);
    const rules = await db.select().from(bookingAvailabilityRules)
      .where(and(eq(bookingAvailabilityRules.tenantId, activeTenantId), eq(bookingAvailabilityRules.weekday, weekday), eq(bookingAvailabilityRules.active, true)));
    const relevantRules = rules.filter((rule) => {
      const resourceMatches = rule.resourceId ? rule.resourceId === resourceId : true;
      const serviceMatches = rule.serviceId ? rule.serviceId === serviceId : true;
      return resourceMatches && serviceMatches;
    });
    const slots: { value: string; label: string }[] = [];
    const dayStart = zonedDayStartToUtc(day, timezone);
    const dayEnd = zonedDayEndToUtc(day, timezone);
    const calendarBlocks = await getBookingCalendarBlocks({ tenantId: activeTenantId, serviceId, resourceId, startsAt: dayStart, endsAt: dayEnd });
    const availableBlocks = calendarBlocks.filter(block => block.type === 'available');
    const windows = [
      ...relevantRules.map(rule => ({ startTime: rule.startTime, endTime: rule.endTime })),
      ...availableBlocks.map(block => ({ startTime: zonedTimeValue(block.startsAt, timezone), endTime: zonedTimeValue(block.endsAt, timezone) })),
    ];

    for (const window of windows) {
      let cursor = minutes(window.startTime);
      const latestStart = minutes(window.endTime) - duration;
      while (cursor <= latestStart) {
        const value = toTime(cursor);
        const startsAt = zonedDateTimeToUtc(day, value, timezone);
        const endsAt = new Date(startsAt.getTime() + duration * 60_000);
        if (await isSlotAvailable({ tenantId: activeTenantId, serviceId, resourceId, timeModel, startsAt, endsAt, timezone, bufferBeforeMinutes, bufferAfterMinutes })) {
          slots.push({ value, label: `${value} Uhr` });
        }
        cursor += interval;
      }
    }

    return [...new Map(slots.map(slot => [slot.value, slot])).values()].sort((a, b) => a.value.localeCompare(b.value));
  }

  async function computeSuggestions(fromDate: string) {
    const results: { date: string; slots: { value: string; label: string }[] }[] = [];
    for (let offset = 1; offset <= 14 && results.length < 4; offset += 1) {
      const nextDate = addDays(fromDate, offset);
      const nextSlots = await computeSlots(nextDate);
      if (nextSlots.length) results.push({ date: nextDate, slots: nextSlots.slice(0, 3) });
    }
    return results;
  }
}

async function isSlotAvailable(input: {
  tenantId: string;
  serviceId: string | null;
  resourceId: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
}) {
  const blockedInput = {
    ...input,
    startsAt: addMinutes(input.startsAt, -Math.max(input.bufferBeforeMinutes || 0, 0)),
    endsAt: addMinutes(input.endsAt, Math.max(input.bufferAfterMinutes || 0, 0)),
  };
  if (!(await isWithinBookingAvailability(blockedInput))) return false;
  if (await hasBookingBlackout(blockedInput)) return false;
  return !(await hasBookingConflict(input));
}

function minutes(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function toTime(total: number) {
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function zonedTimeValue(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
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
