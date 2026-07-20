import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gt, lt } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolvePublicTenantId } from '@/lib/public-tenant';
import { getOrCreateBookingSettings, hasBookingAddon, type BookingTimeModel } from '@/lib/booking-core';
import {
  getTouchedZonedWeekdays,
  getZonedTime,
  getZonedWeekday,
  normalizeTimezone,
  zonedDateTimeToUtc,
  zonedDayEndToUtc,
  zonedDayStartToUtc,
} from '@/lib/booking-time';
import {
  bookingAvailabilityRules,
  bookingBlackouts,
  bookingCalendarBlocks,
  bookingRequests,
  bookingResources,
  bookingServices,
} from '@flamingo/db';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' };

export async function GET(req: NextRequest) {
  const tenantId = await resolvePublicTenantId(req.nextUrl.searchParams.get('tenantId'));
  if (!tenantId) return NextResponse.json({ enabled: false, slots: [] }, { status: 404 });
  if (!(await hasBookingAddon(tenantId))) return NextResponse.json({ enabled: false, slots: [] }, { headers: CACHE_HEADERS });

  const date = req.nextUrl.searchParams.get('date') || '';
  if (!isAllowedBookingDate(date)) return NextResponse.json({ enabled: true, slots: [] }, { headers: CACHE_HEADERS });

  const serviceId = req.nextUrl.searchParams.get('serviceId') || null;
  const resourceId = req.nextUrl.searchParams.get('resourceId') || null;
  if ((serviceId && !UUID_RE.test(serviceId)) || (resourceId && !UUID_RE.test(resourceId))) {
    return NextResponse.json({ enabled: true, slots: [] }, { headers: CACHE_HEADERS });
  }

  const db = getDb();
  const settings = await getOrCreateBookingSettings(tenantId);
  const timezone = normalizeTimezone(settings.timezone);
  const service = serviceId ? await selectBookingServiceCompat(tenantId, serviceId) : null;
  const [resource] = resourceId
    ? await db.select({ id: bookingResources.id, type: bookingResources.type, capacity: bookingResources.capacity })
      .from(bookingResources)
      .where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.id, resourceId), eq(bookingResources.active, true)))
      .limit(1)
    : [];
  if (serviceId && !service) return NextResponse.json({ enabled: true, slots: [] }, { headers: CACHE_HEADERS });
  if (resourceId && !resource) return NextResponse.json({ enabled: true, slots: [] }, { headers: CACHE_HEADERS });
  if (service?.requiresResource && !resourceId) return NextResponse.json({ enabled: true, resourceRequired: true, slots: [] }, { headers: CACHE_HEADERS });

  const allowedTypes = Array.isArray(service?.allowedResourceTypes) ? service.allowedResourceTypes : [];
  if (resource && allowedTypes.length && !allowedTypes.includes(resource.type)) {
    return NextResponse.json({ enabled: true, slots: [] }, { headers: CACHE_HEADERS });
  }

  const timeModel = (service?.timeModelOverride || settings.timeModel) as BookingTimeModel;
  const bufferBeforeMinutes = Math.max(service?.bufferBeforeMinutes || 0, 0);
  const bufferAfterMinutes = Math.max(service?.bufferAfterMinutes || 0, 0);
  const rangeStartsAt = addMinutes(zonedDayStartToUtc(date, timezone), -1440);
  const rangeEndsAt = addMinutes(zonedDayEndToUtc(addDays(date, 14), timezone), 1440);
  const state = await loadAvailabilityState({ tenantId, rangeStartsAt, rangeEndsAt });
  const resourceCapacity = Math.max(resource?.capacity || 1, 1);

  if (timeModel === 'full_day' || timeModel === 'date_range') {
    const startsAt = zonedDayStartToUtc(date, timezone);
    const endsAt = zonedDayEndToUtc(date, timezone);
    const available = isSlotAvailableFromState({
      state,
      serviceId,
      resourceId,
      timeModel,
      startsAt,
      endsAt,
      timezone,
      bufferBeforeMinutes,
      bufferAfterMinutes,
      resourceCapacity,
    });
    return NextResponse.json({
      enabled: true,
      timeModel,
      timezone,
      slots: available ? [{ value: 'full_day', label: 'Ganzer Tag verfügbar' }] : [],
    }, { headers: CACHE_HEADERS });
  }

  const duration = Math.max(service?.durationMinutes || settings.intervalMinutes, 5);
  const interval = Math.max(settings.intervalMinutes, 5);
  const uniqueSlots = computeSlots(date);
  const suggestions = uniqueSlots.length ? [] : computeSuggestions(date);
  return NextResponse.json({ enabled: true, timeModel, timezone, slots: uniqueSlots, suggestions }, { headers: CACHE_HEADERS });

  function computeSlots(day: string) {
    const weekday = getZonedWeekday(zonedDayStartToUtc(day, timezone), timezone);
    const relevantRules = state.rules.filter(rule => rule.weekday === weekday && scopeMatches(rule, serviceId, resourceId));
    const slots: { value: string; label: string }[] = [];
    const dayStart = zonedDayStartToUtc(day, timezone);
    const dayEnd = zonedDayEndToUtc(day, timezone);
    const calendarBlocks = state.calendarBlocks.filter(block =>
      scopeMatches(block, serviceId, resourceId) && overlaps(block.startsAt, block.endsAt, dayStart, dayEnd));
    const windows = [
      ...relevantRules.map(rule => ({ startTime: rule.startTime, endTime: rule.endTime })),
      ...calendarBlocks.filter(block => block.type === 'available').map(block => ({
        startTime: zonedTimeValue(block.startsAt, timezone),
        endTime: zonedTimeValue(block.endsAt, timezone),
      })),
    ];

    for (const window of windows) {
      let cursor = minutes(window.startTime);
      const latestStart = minutes(window.endTime) - duration;
      while (cursor <= latestStart) {
        const value = toTime(cursor);
        const startsAt = zonedDateTimeToUtc(day, value, timezone);
        const endsAt = new Date(startsAt.getTime() + duration * 60_000);
        if (isSlotAvailableFromState({
          state,
          serviceId,
          resourceId,
          timeModel,
          startsAt,
          endsAt,
          timezone,
          bufferBeforeMinutes,
          bufferAfterMinutes,
          resourceCapacity,
        })) slots.push({ value, label: `${value} Uhr` });
        cursor += interval;
      }
    }

    return [...new Map(slots.map(slot => [slot.value, slot])).values()].sort((a, b) => a.value.localeCompare(b.value));
  }

  function computeSuggestions(fromDate: string) {
    const results: { date: string; slots: { value: string; label: string }[] }[] = [];
    for (let offset = 1; offset <= 14 && results.length < 4; offset += 1) {
      const nextDate = addDays(fromDate, offset);
      const nextSlots = computeSlots(nextDate);
      if (nextSlots.length) results.push({ date: nextDate, slots: nextSlots.slice(0, 3) });
    }
    return results;
  }
}

type AvailabilityState = Awaited<ReturnType<typeof loadAvailabilityState>>;

function isSlotAvailableFromState(input: {
  state: AvailabilityState;
  serviceId: string | null;
  resourceId: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  resourceCapacity: number;
}) {
  const bufferedStartsAt = addMinutes(input.startsAt, -input.bufferBeforeMinutes);
  const bufferedEndsAt = addMinutes(input.endsAt, input.bufferAfterMinutes);
  const blocks = input.state.calendarBlocks.filter(block =>
    scopeMatches(block, input.serviceId, input.resourceId)
    && overlaps(block.startsAt, block.endsAt, bufferedStartsAt, bufferedEndsAt));
  if (blocks.some(block => block.type === 'blocked')) return false;

  const availableBlocks = blocks.filter(block => block.type === 'available');
  if (availableBlocks.length > 0) {
    if (!availableBlocks.some(block => block.startsAt <= bufferedStartsAt && block.endsAt >= bufferedEndsAt)) return false;
  } else if (input.state.rules.length > 0) {
    const relevantRules = input.state.rules.filter(rule => scopeMatches(rule, input.serviceId, input.resourceId));
    if (relevantRules.length === 0) return false;
    if (input.timeModel === 'time_slot') {
      const weekday = getZonedWeekday(bufferedStartsAt, input.timezone);
      const startTime = getZonedTime(bufferedStartsAt, input.timezone);
      const endTime = getZonedTime(bufferedEndsAt, input.timezone);
      if (!relevantRules.some(rule => rule.weekday === weekday && rule.startTime <= startTime && rule.endTime >= endTime)) return false;
    } else if (!getTouchedZonedWeekdays(bufferedStartsAt, bufferedEndsAt, input.timezone)
      .every(weekday => relevantRules.some(rule => rule.weekday === weekday))) {
      return false;
    }
  }

  if (input.state.blackouts.some(blackout =>
    (!blackout.resourceId || blackout.resourceId === input.resourceId)
    && overlaps(blackout.startsAt, blackout.endsAt, bufferedStartsAt, bufferedEndsAt))) return false;

  let capacity = input.resourceId ? input.resourceCapacity : 1;
  if (!input.resourceId) {
    const blockCapacity = availableBlocks
      .find(block => block.startsAt <= input.startsAt && block.endsAt >= input.endsAt && (block.capacity || 0) > 0)?.capacity;
    const weekday = getZonedWeekday(input.startsAt, input.timezone);
    const ruleCapacity = input.state.rules
      .filter(rule => scopeMatches(rule, input.serviceId, input.resourceId))
      .find(rule => rule.weekday === weekday && (rule.capacity || 0) > 0)?.capacity;
    capacity = Math.max(blockCapacity || ruleCapacity || 1, 1);
  }

  const conflicts = input.state.bookings.filter(booking => {
    if (input.resourceId ? booking.resourceId !== input.resourceId : booking.timeModel !== input.timeModel) return false;
    const bookingStartsAt = addMinutes(booking.startsAt, -Math.max(booking.bufferBeforeMinutes || 0, 0));
    const bookingEndsAt = addMinutes(booking.endsAt, Math.max(booking.bufferAfterMinutes || 0, 0));
    return overlaps(bookingStartsAt, bookingEndsAt, bufferedStartsAt, bufferedEndsAt);
  });
  return conflicts.length < capacity;
}

async function loadAvailabilityState(input: { tenantId: string; rangeStartsAt: Date; rangeEndsAt: Date }) {
  const db = getDb();
  const [rules, calendarBlocks, blackouts, bookings] = await Promise.all([
    db.select().from(bookingAvailabilityRules)
      .where(and(eq(bookingAvailabilityRules.tenantId, input.tenantId), eq(bookingAvailabilityRules.active, true))),
    db.select().from(bookingCalendarBlocks).where(and(
      eq(bookingCalendarBlocks.tenantId, input.tenantId),
      eq(bookingCalendarBlocks.active, true),
      lt(bookingCalendarBlocks.startsAt, input.rangeEndsAt),
      gt(bookingCalendarBlocks.endsAt, input.rangeStartsAt),
    )),
    db.select().from(bookingBlackouts).where(and(
      eq(bookingBlackouts.tenantId, input.tenantId),
      lt(bookingBlackouts.startsAt, input.rangeEndsAt),
      gt(bookingBlackouts.endsAt, input.rangeStartsAt),
    )),
    selectConfirmedBookingRows(input),
  ]);
  return { rules, calendarBlocks, blackouts, bookings };
}

async function selectConfirmedBookingRows(input: { tenantId: string; rangeStartsAt: Date; rangeEndsAt: Date }) {
  const db = getDb();
  const where = and(
    eq(bookingRequests.tenantId, input.tenantId),
    eq(bookingRequests.status, 'confirmed'),
    lt(bookingRequests.startsAt, input.rangeEndsAt),
    gt(bookingRequests.endsAt, input.rangeStartsAt),
  );
  try {
    return await db.select({
      resourceId: bookingRequests.resourceId,
      timeModel: bookingRequests.timeModel,
      startsAt: bookingRequests.startsAt,
      endsAt: bookingRequests.endsAt,
      bufferBeforeMinutes: bookingRequests.bufferBeforeMinutes,
      bufferAfterMinutes: bookingRequests.bufferAfterMinutes,
    }).from(bookingRequests).where(where);
  } catch (error) {
    if (!isMissingBookingRulesColumn(error)) throw error;
    const rows = await db.select({
      resourceId: bookingRequests.resourceId,
      timeModel: bookingRequests.timeModel,
      startsAt: bookingRequests.startsAt,
      endsAt: bookingRequests.endsAt,
    }).from(bookingRequests).where(where);
    return rows.map(row => ({ ...row, bufferBeforeMinutes: 0, bufferAfterMinutes: 0 }));
  }
}

function scopeMatches(value: { serviceId: string | null; resourceId: string | null }, serviceId: string | null, resourceId: string | null) {
  return (!value.serviceId || value.serviceId === serviceId) && (!value.resourceId || value.resourceId === resourceId);
}

function overlaps(startsAt: Date, endsAt: Date, rangeStartsAt: Date, rangeEndsAt: Date) {
  return startsAt < rangeEndsAt && endsAt > rangeStartsAt;
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

function addMinutes(date: Date, minutesToAdd: number) {
  return new Date(date.getTime() + minutesToAdd * 60_000);
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function isAllowedBookingDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return parsed.getTime() >= todayUtc - 86_400_000 && parsed.getTime() <= todayUtc + 730 * 86_400_000;
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
