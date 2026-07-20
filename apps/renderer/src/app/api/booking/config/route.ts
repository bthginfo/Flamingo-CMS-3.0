import { NextRequest, NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { resolvePublicTenantId } from '@/lib/public-tenant';
import { getOrCreateBookingSettings, hasBookingAddon } from '@/lib/booking-core';
import { bookingResources, bookingServices } from '@flamingo/db';

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' };

export async function GET(req: NextRequest) {
  const tenantId = await resolvePublicTenantId(req.nextUrl.searchParams.get('tenantId'));
  if (!tenantId) return NextResponse.json({ enabled: false }, { status: 404 });
  const enabled = await hasBookingAddon(tenantId);
  if (!enabled) return NextResponse.json({ enabled: false }, { headers: CACHE_HEADERS });

  const db = getDb();
  const settings = await getOrCreateBookingSettings(tenantId);
  const [services, resources] = await Promise.all([
    selectBookingServicesCompat(tenantId),
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
  }, { headers: CACHE_HEADERS });
}

async function selectBookingServicesCompat(tenantId: string) {
  const db = getDb();
  try {
    return await db.select({
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
    }).from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name));
  } catch (error) {
    if (!isMissingBookingRulesColumn(error)) throw error;
    const rows = await db.select({
      id: bookingServices.id,
      name: bookingServices.name,
      durationMinutes: bookingServices.durationMinutes,
      priceLabel: bookingServices.priceLabel,
      timeModelOverride: bookingServices.timeModelOverride,
      requiresResource: bookingServices.requiresResource,
      allowedResourceTypes: bookingServices.allowedResourceTypes,
    }).from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name));
    return rows.map(row => ({
      ...row,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      minPartySize: null,
      maxPartySize: null,
      intakeQuestions: [],
    }));
  }
}

function isMissingBookingRulesColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /buffer_before_minutes|buffer_after_minutes|min_party_size|max_party_size|intake_questions|intake_answers|column .* does not exist/i.test(message);
}
