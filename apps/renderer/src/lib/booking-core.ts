import { getDb } from '@/lib/db';
import { bookingAvailabilityRules, bookingBlackouts, bookingCalendarBlocks, bookingRequests, bookingResources, bookingSettings, tenantAddons } from '@flamingo/db';
import { and, eq, gt, lt, ne, type SQL } from 'drizzle-orm';
import { getTouchedZonedWeekdays, getZonedTime, getZonedWeekday, normalizeTimezone, zonedDateTimeToUtc, zonedDayEndToUtc, zonedDayStartToUtc } from '@/lib/booking-time';

export const BOOKING_ADDON_KEY = 'booking';

export const BOOKING_SECTION_TYPES = new Set([
  'bookingWidget',
  'bookingSlotPicker',
  'bookingDateRange',
  'availabilityCalendar',
  'resourceBookingShowcase',
  'bookingCtaPro',
]);

export type BookingMode = 'request' | 'instant';
export type BookingTimeModel = 'time_slot' | 'full_day' | 'date_range';

export async function hasBookingAddon(tenantId: string): Promise<boolean> {
  const db = getDb();
  const [addon] = await db
    .select({ active: tenantAddons.active })
    .from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, BOOKING_ADDON_KEY)))
    .limit(1);
  return addon?.active === true;
}

export async function requireBookingAddon(tenantId: string) {
  if (!(await hasBookingAddon(tenantId))) {
    throw new Error('BOOKING_ADDON_REQUIRED');
  }
}

export async function getOrCreateBookingSettings(tenantId: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(bookingSettings)
    .where(eq(bookingSettings.tenantId, tenantId))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(bookingSettings)
    .values({ tenantId })
    .returning();
  return created;
}

export function parseBookingDateRange(input: {
  date?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  time?: unknown;
  timeModel: BookingTimeModel;
  durationMinutes?: number | null;
  timezone?: string | null;
}) {
  const date = stringValue(input.date || input.startDate);
  if (!date) throw new Error('DATE_REQUIRED');
  const timezone = normalizeTimezone(input.timezone);

  if (input.timeModel === 'date_range') {
    const endDate = stringValue(input.endDate);
    if (!endDate) throw new Error('END_DATE_REQUIRED');
    const startsAt = zonedDayStartToUtc(date, timezone);
    const endsAt = zonedDayEndToUtc(endDate, timezone);
    if (!isValidRange(startsAt, endsAt)) throw new Error('INVALID_DATE_RANGE');
    return { startsAt, endsAt };
  }

  if (input.timeModel === 'full_day') {
    const startsAt = zonedDayStartToUtc(date, timezone);
    const endsAt = zonedDayEndToUtc(date, timezone);
    return { startsAt, endsAt };
  }

  const time = stringValue(input.time);
  if (!time) throw new Error('TIME_REQUIRED');
  const startsAt = zonedDateTimeToUtc(date, time, timezone);
  const endsAt = new Date(startsAt.getTime() + Math.max(input.durationMinutes || 30, 5) * 60_000);
  if (!isValidRange(startsAt, endsAt)) throw new Error('INVALID_TIME_RANGE');
  return { startsAt, endsAt };
}

export async function hasBookingConflict(input: {
  tenantId: string;
  excludeBookingId?: string;
  resourceId: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
  timezone?: string | null;
  bufferBeforeMinutes?: number | null;
  bufferAfterMinutes?: number | null;
}) {
  const db = getDb();
  const timezone = normalizeTimezone(input.timezone);
  const requestedStartsAt = addMinutes(input.startsAt, -Math.max(input.bufferBeforeMinutes || 0, 0));
  const requestedEndsAt = addMinutes(input.endsAt, Math.max(input.bufferAfterMinutes || 0, 0));
  const predicates: SQL[] = [
    eq(bookingRequests.tenantId, input.tenantId),
    eq(bookingRequests.status, 'confirmed'),
    lt(bookingRequests.startsAt, addMinutes(requestedEndsAt, 1440)),
    gt(bookingRequests.endsAt, addMinutes(requestedStartsAt, -1440)),
  ];
  if (input.excludeBookingId) predicates.push(ne(bookingRequests.id, input.excludeBookingId));

  let capacity = 1;
  if (input.resourceId) {
    const [resource] = await db.select({ capacity: bookingResources.capacity }).from(bookingResources)
      .where(and(eq(bookingResources.id, input.resourceId), eq(bookingResources.tenantId, input.tenantId)))
      .limit(1);
    capacity = Math.max(resource?.capacity || 1, 1);
    predicates.push(eq(bookingRequests.resourceId, input.resourceId));
  } else {
    predicates.push(eq(bookingRequests.timeModel, input.timeModel));
    const calendarBlocks = await getBookingCalendarBlocks(input);
    const calendarCapacity = calendarBlocks
      .filter(block => block.type === 'available' && block.startsAt <= input.startsAt && block.endsAt >= input.endsAt)
      .find(block => (block.capacity || 0) > 0)?.capacity;
    if (calendarCapacity) {
      capacity = Math.max(calendarCapacity, 1);
    } else {
      const weekday = getZonedWeekday(input.startsAt, timezone);
      const rules = await db.select({ capacity: bookingAvailabilityRules.capacity }).from(bookingAvailabilityRules)
        .where(and(
          eq(bookingAvailabilityRules.tenantId, input.tenantId),
          eq(bookingAvailabilityRules.weekday, weekday),
          eq(bookingAvailabilityRules.active, true),
        ));
      capacity = Math.max(rules.find(rule => (rule.capacity || 0) > 0)?.capacity || 1, 1);
    }
  }

  const rows = await selectBookingConflictRowsCompat(predicates);
  const overlaps = rows.filter((row) => {
    const rowStartsAt = addMinutes(row.startsAt, -Math.max(row.bufferBeforeMinutes || 0, 0));
    const rowEndsAt = addMinutes(row.endsAt, Math.max(row.bufferAfterMinutes || 0, 0));
    return rowStartsAt < requestedEndsAt && rowEndsAt > requestedStartsAt;
  });
  return overlaps.length >= capacity;
}

/** PostgreSQL exclusion violation from booking_requests_no_confirmed_overlap. */
export function isBookingOverlapError(error: unknown): boolean {
  const candidate = error as { code?: string; constraint?: string; message?: string } | null;
  return candidate?.code === '23P01'
    || candidate?.constraint === 'booking_requests_no_confirmed_overlap'
    || /booking_requests_no_confirmed_overlap|conflicting key value violates exclusion constraint/i.test(candidate?.message || '');
}

export async function getBookingCalendarBlocks(input: {
  tenantId: string;
  serviceId?: string | null;
  resourceId?: string | null;
  startsAt: Date;
  endsAt: Date;
}) {
  const db = getDb();
  const blocks = await db.select().from(bookingCalendarBlocks)
    .where(and(
      eq(bookingCalendarBlocks.tenantId, input.tenantId),
      eq(bookingCalendarBlocks.active, true),
      lt(bookingCalendarBlocks.startsAt, input.endsAt),
      gt(bookingCalendarBlocks.endsAt, input.startsAt),
    ));

  return blocks.filter((block) => {
    const resourceMatches = block.resourceId ? block.resourceId === input.resourceId : true;
    const serviceMatches = block.serviceId ? block.serviceId === input.serviceId : true;
    return resourceMatches && serviceMatches;
  });
}

export async function hasBookingBlackout(input: {
  tenantId: string;
  resourceId?: string | null;
  startsAt: Date;
  endsAt: Date;
}) {
  const db = getDb();
  const blackouts = await db.select({
    resourceId: bookingBlackouts.resourceId,
  }).from(bookingBlackouts)
    .where(and(
      eq(bookingBlackouts.tenantId, input.tenantId),
      lt(bookingBlackouts.startsAt, input.endsAt),
      gt(bookingBlackouts.endsAt, input.startsAt),
    ));

  return blackouts.some((blackout) => !blackout.resourceId || (input.resourceId && blackout.resourceId === input.resourceId));
}

export async function isWithinBookingAvailability(input: {
  tenantId: string;
  serviceId?: string | null;
  resourceId?: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
  timezone?: string | null;
}) {
  const db = getDb();
  const timezone = normalizeTimezone(input.timezone);
  const calendarBlocks = await getBookingCalendarBlocks(input);
  if (calendarBlocks.some(block => block.type === 'blocked')) return false;
  const availableCalendarBlocks = calendarBlocks.filter(block => block.type === 'available');
  if (availableCalendarBlocks.length > 0) {
    return availableCalendarBlocks.some(block => block.startsAt <= input.startsAt && block.endsAt >= input.endsAt);
  }

  const rules = await db.select().from(bookingAvailabilityRules)
    .where(and(eq(bookingAvailabilityRules.tenantId, input.tenantId), eq(bookingAvailabilityRules.active, true)));

  if (rules.length === 0) return true;

  const relevantRules = rules.filter((rule) => {
    const resourceMatches = rule.resourceId ? rule.resourceId === input.resourceId : true;
    const serviceMatches = rule.serviceId ? rule.serviceId === input.serviceId : true;
    return resourceMatches && serviceMatches;
  });
  if (relevantRules.length === 0) return false;

  if (input.timeModel === 'time_slot') {
    const weekday = getZonedWeekday(input.startsAt, timezone);
    const startTime = getZonedTime(input.startsAt, timezone);
    const endTime = getZonedTime(input.endsAt, timezone);
    return relevantRules.some((rule) => rule.weekday === weekday && rule.startTime <= startTime && rule.endTime >= endTime);
  }

  return getTouchedZonedWeekdays(input.startsAt, input.endsAt, timezone).every((weekday) => relevantRules.some((rule) => rule.weekday === weekday));
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidRange(startsAt: Date, endsAt: Date) {
  return Number.isFinite(startsAt.getTime()) && Number.isFinite(endsAt.getTime()) && endsAt > startsAt;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function selectBookingConflictRowsCompat(predicates: SQL[]) {
  const db = getDb();
  try {
    return await db.select({
      id: bookingRequests.id,
      startsAt: bookingRequests.startsAt,
      endsAt: bookingRequests.endsAt,
      bufferBeforeMinutes: bookingRequests.bufferBeforeMinutes,
      bufferAfterMinutes: bookingRequests.bufferAfterMinutes,
    }).from(bookingRequests).where(and(...predicates));
  } catch (error) {
    if (!isMissingBookingRulesColumn(error)) throw error;
    const rows = await db.select({
      id: bookingRequests.id,
      startsAt: bookingRequests.startsAt,
      endsAt: bookingRequests.endsAt,
    }).from(bookingRequests).where(and(...predicates));
    return rows.map(row => ({ ...row, bufferBeforeMinutes: 0, bufferAfterMinutes: 0 }));
  }
}

function isMissingBookingRulesColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /buffer_before_minutes|buffer_after_minutes|min_party_size|max_party_size|intake_questions|intake_answers|column .* does not exist/i.test(message);
}
