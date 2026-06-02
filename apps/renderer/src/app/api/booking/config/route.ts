import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getOrCreateBookingSettings, hasBookingAddon } from '@/lib/booking-core';
import { bookingResources, bookingServices } from '@flamingo/db';

function resolveExplicitTenant(value: string | null) {
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return null;
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (fixedTenantId) return value === fixedTenantId ? value : null;
  return value;
}

export async function GET(req: NextRequest) {
  const tenantId = resolveExplicitTenant(req.nextUrl.searchParams.get('tenantId')) || await resolveTenant();
  if (!tenantId) return NextResponse.json({ enabled: false }, { status: 404 });
  const enabled = await hasBookingAddon(tenantId);
  if (!enabled) return NextResponse.json({ enabled: false });

  const db = getDb();
  const settings = await getOrCreateBookingSettings(tenantId);
  const [services, resources] = await Promise.all([
    db.select({
      id: bookingServices.id,
      name: bookingServices.name,
      durationMinutes: bookingServices.durationMinutes,
      bufferBeforeMinutes: bookingServices.bufferBeforeMinutes,
      bufferAfterMinutes: bookingServices.bufferAfterMinutes,
      priceLabel: bookingServices.priceLabel,
      timeModelOverride: bookingServices.timeModelOverride,
      requiresResource: bookingServices.requiresResource,
      minPartySize: bookingServices.minPartySize,
      maxPartySize: bookingServices.maxPartySize,
      allowedResourceTypes: bookingServices.allowedResourceTypes,
      intakeQuestions: bookingServices.intakeQuestions,
    }).from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name)),
    db.select({
      id: bookingResources.id,
      name: bookingResources.name,
      type: bookingResources.type,
      capacity: bookingResources.capacity,
      seats: bookingResources.seats,
    }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true))).orderBy(asc(bookingResources.sortOrder), asc(bookingResources.name)),
  ]);

  return NextResponse.json({
    enabled: true,
    mode: settings.mode,
    timeModel: settings.timeModel,
    timezone: settings.timezone,
    intervalMinutes: settings.intervalMinutes,
    services,
    resources,
  });
}
