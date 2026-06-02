import { getDb } from '@/lib/db';
import { bookingAvailabilityRules, bookingBlackouts, bookingRequests, bookingResources, bookingSettings, tenantAddons } from '@flamingo/db';
import { and, eq, gt, lt, ne, type SQL } from 'drizzle-orm';

export const BOOKING_ADDON_KEY = 'booking';

export const BOOKING_SECTION_TYPES = new Set([
  'bookingWidget',
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
}) {
  const date = stringValue(input.date || input.startDate);
  if (!date) throw new Error('DATE_REQUIRED');

  if (input.timeModel === 'date_range') {
    const endDate = stringValue(input.endDate);
    if (!endDate) throw new Error('END_DATE_REQUIRED');
    const startsAt = new Date(`${date}T00:00:00.000Z`);
    const endsAt = new Date(`${endDate}T00:00:00.000Z`);
    if (!isValidRange(startsAt, endsAt)) throw new Error('INVALID_DATE_RANGE');
    return { startsAt, endsAt };
  }

  if (input.timeModel === 'full_day') {
    const startsAt = new Date(`${date}T00:00:00.000Z`);
    const endsAt = new Date(`${date}T23:59:59.999Z`);
    return { startsAt, endsAt };
  }

  const time = stringValue(input.time);
  if (!time) throw new Error('TIME_REQUIRED');
  const startsAt = new Date(`${date}T${time}:00.000Z`);
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
}) {
  const db = getDb();
  const predicates: SQL[] = [
    eq(bookingRequests.tenantId, input.tenantId),
    eq(bookingRequests.status, 'confirmed'),
    lt(bookingRequests.startsAt, input.endsAt),
    gt(bookingRequests.endsAt, input.startsAt),
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
    const weekday = input.startsAt.getUTCDay();
    const rules = await db.select({ capacity: bookingAvailabilityRules.capacity }).from(bookingAvailabilityRules)
      .where(and(
        eq(bookingAvailabilityRules.tenantId, input.tenantId),
        eq(bookingAvailabilityRules.weekday, weekday),
        eq(bookingAvailabilityRules.active, true),
      ));
    capacity = Math.max(rules.find(rule => (rule.capacity || 0) > 0)?.capacity || 1, 1);
  }

  const rows = await db.select({ id: bookingRequests.id }).from(bookingRequests).where(and(...predicates)).limit(capacity);
  return rows.length >= capacity;
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

  return blackouts.some((blackout) => !blackout.resourceId || !input.resourceId || blackout.resourceId === input.resourceId);
}

export async function isWithinBookingAvailability(input: {
  tenantId: string;
  serviceId?: string | null;
  resourceId?: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
}) {
  const db = getDb();
  const rules = await db.select().from(bookingAvailabilityRules)
    .where(and(eq(bookingAvailabilityRules.tenantId, input.tenantId), eq(bookingAvailabilityRules.active, true)));

  if (rules.length === 0) return true;

  const relevantRules = rules.filter((rule) => {
    const resourceMatches = !rule.resourceId || !input.resourceId || rule.resourceId === input.resourceId;
    const serviceMatches = !rule.serviceId || !input.serviceId || rule.serviceId === input.serviceId;
    return resourceMatches && serviceMatches;
  });
  if (relevantRules.length === 0) return false;

  if (input.timeModel === 'time_slot') {
    const weekday = input.startsAt.getUTCDay();
    const startTime = toUtcTime(input.startsAt);
    const endTime = toUtcTime(input.endsAt);
    return relevantRules.some((rule) => rule.weekday === weekday && rule.startTime <= startTime && rule.endTime >= endTime);
  }

  return getTouchedUtcWeekdays(input.startsAt, input.endsAt).every((weekday) => relevantRules.some((rule) => rule.weekday === weekday));
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidRange(startsAt: Date, endsAt: Date) {
  return Number.isFinite(startsAt.getTime()) && Number.isFinite(endsAt.getTime()) && endsAt > startsAt;
}

function toUtcTime(date: Date) {
  return date.toISOString().slice(11, 16);
}

function getTouchedUtcWeekdays(startsAt: Date, endsAt: Date) {
  const days = new Set<number>();
  const cursor = new Date(Date.UTC(startsAt.getUTCFullYear(), startsAt.getUTCMonth(), startsAt.getUTCDate()));
  const inclusiveEnd = new Date(Math.max(startsAt.getTime(), endsAt.getTime() - 1));
  const endDay = Date.UTC(inclusiveEnd.getUTCFullYear(), inclusiveEnd.getUTCMonth(), inclusiveEnd.getUTCDate());
  while (cursor.getTime() <= endDay) {
    days.add(cursor.getUTCDay());
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return [...days];
}
