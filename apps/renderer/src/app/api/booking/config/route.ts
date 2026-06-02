import { NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolveTenant } from '@/lib/snapshot';
import { getOrCreateBookingSettings, hasBookingAddon } from '@/lib/booking-core';
import { bookingResources, bookingServices } from '@flamingo/db';

export async function GET() {
  const tenantId = await resolveTenant();
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
      priceLabel: bookingServices.priceLabel,
      timeModelOverride: bookingServices.timeModelOverride,
    }).from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name)),
    db.select({
      id: bookingResources.id,
      name: bookingResources.name,
      type: bookingResources.type,
      capacity: bookingResources.capacity,
    }).from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true))).orderBy(asc(bookingResources.sortOrder), asc(bookingResources.name)),
  ]);

  return NextResponse.json({
    enabled: true,
    mode: settings.mode,
    timeModel: settings.timeModel,
    intervalMinutes: settings.intervalMinutes,
    services,
    resources,
  });
}
