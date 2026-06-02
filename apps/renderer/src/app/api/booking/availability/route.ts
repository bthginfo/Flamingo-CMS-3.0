import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isWithinBookingAvailability, type BookingTimeModel } from '@/lib/booking-core';
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

  const date = req.nextUrl.searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ enabled: true, slots: [] });

  const serviceId = req.nextUrl.searchParams.get('serviceId') || null;
  const resourceId = req.nextUrl.searchParams.get('resourceId') || null;
  const db = getDb();
  const settings = await getOrCreateBookingSettings(tenantId);
  const timezone = normalizeTimezone(settings.timezone);

  const [service] = serviceId
    ? await db.select().from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.id, serviceId), eq(bookingServices.active, true))).limit(1)
    : [];
  const [resource] = resourceId
    ? await db.select({ id: bookingResources.id, type: bookingResources.type }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.id, resourceId), eq(bookingResources.active, true))).limit(1)
    : [];
  if (serviceId && !service) return NextResponse.json({ enabled: true, slots: [] });
  if (resourceId && !resource) return NextResponse.json({ enabled: true, slots: [] });
  if (service?.requiresResource && !resourceId) return NextResponse.json({ enabled: true, resourceRequired: true, slots: [] });

  const allowedTypes = Array.isArray(service?.allowedResourceTypes) ? service.allowedResourceTypes : [];
  if (resource && allowedTypes.length && !allowedTypes.includes(resource.type)) return NextResponse.json({ enabled: true, slots: [] });

  const timeModel = (service?.timeModelOverride || settings.timeModel) as BookingTimeModel;
  if (timeModel === 'full_day' || timeModel === 'date_range') {
    const startsAt = zonedDayStartToUtc(date, timezone);
    const endsAt = zonedDayEndToUtc(date, timezone);
    const available = await isSlotAvailable({ tenantId, serviceId, resourceId, timeModel, startsAt, endsAt, timezone });
    return NextResponse.json({ enabled: true, timeModel, timezone, slots: available ? [{ value: 'full_day', label: 'Ganzer Tag verfügbar' }] : [] });
  }

  const weekday = getZonedWeekday(zonedDayStartToUtc(date, timezone), timezone);
  const rules = await db.select().from(bookingAvailabilityRules)
    .where(and(eq(bookingAvailabilityRules.tenantId, tenantId), eq(bookingAvailabilityRules.weekday, weekday), eq(bookingAvailabilityRules.active, true)));
  const relevantRules = rules.filter((rule) => {
    const resourceMatches = rule.resourceId ? rule.resourceId === resourceId : true;
    const serviceMatches = rule.serviceId ? rule.serviceId === serviceId : true;
    return resourceMatches && serviceMatches;
  });

  const duration = Math.max(service?.durationMinutes || settings.intervalMinutes, 5);
  const interval = Math.max(settings.intervalMinutes, 5);
  const slots: { value: string; label: string }[] = [];
  for (const rule of relevantRules) {
    let cursor = minutes(rule.startTime);
    const latestStart = minutes(rule.endTime) - duration;
    while (cursor <= latestStart) {
      const value = toTime(cursor);
      const startsAt = zonedDateTimeToUtc(date, value, timezone);
      const endsAt = new Date(startsAt.getTime() + duration * 60_000);
      if (await isSlotAvailable({ tenantId, serviceId, resourceId, timeModel, startsAt, endsAt, timezone })) {
        slots.push({ value, label: `${value} Uhr` });
      }
      cursor += interval;
    }
  }

  const uniqueSlots = [...new Map(slots.map(slot => [slot.value, slot])).values()].sort((a, b) => a.value.localeCompare(b.value));
  return NextResponse.json({ enabled: true, timeModel, timezone, slots: uniqueSlots });
}

async function isSlotAvailable(input: {
  tenantId: string;
  serviceId: string | null;
  resourceId: string | null;
  timeModel: BookingTimeModel;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
}) {
  if (!(await isWithinBookingAvailability(input))) return false;
  if (await hasBookingBlackout(input)) return false;
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
