'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { BOOKING_ADDON_KEY, getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isWithinBookingAvailability } from '@/lib/booking-core';
import { getBookingNotificationEmail, getDefaultBookingEmailTemplate, sendBookingEmail, type BookingEmailTrigger } from '@/lib/booking-email';
import { bookingAvailabilityRules, bookingBlackouts, bookingCalendarBlocks, bookingRequests, bookingResources, bookingServices, bookingSettings, bookingStatusHistory, emailTemplates, tenantAddons } from '@flamingo/db';
import { formatBookingDate, normalizeTimezone, zonedDateTimeToUtc } from '@/lib/booking-time';

const BOOKING_MODES = ['request', 'instant'] as const;
const BOOKING_TIME_MODELS = ['time_slot', 'full_day', 'date_range'] as const;
const BOOKING_RESOURCE_TYPES = ['table', 'room', 'space', 'room_unit', 'staff', 'equipment', 'generic'] as const;
const BOOKING_CALENDAR_BLOCK_TYPES = ['available', 'blocked'] as const;
const BOOKING_EMAIL_TRIGGERS = [
  'booking_requested_customer',
  'booking_requested_admin',
  'booking_confirmed_customer',
  'booking_cancelled_customer',
  'booking_cancelled_admin',
] as const;

async function requireTenant() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session.tenantId;
}

async function requireBooking(tenantId: string) {
  if (!(await hasBookingAddon(tenantId))) redirect('/admin/functions');
}

export async function getBookingAdminData() {
  const tenantId = await requireTenant();
  const db = getDb();
  const addonActive = await hasBookingAddon(tenantId);
  if (!addonActive) {
    const cookieStore = await cookies();
    if (cookieStore.get('flamingo_public_demo')?.value === tenantId) {
      return getPublicDemoBookingAdminData(tenantId);
    }
    return {
      addonActive,
      settings: null,
      resources: [],
      services: [],
      availabilityRules: [],
      calendarBlocks: [],
      blackouts: [],
      requests: [],
      templates: [],
    };
  }

  const settings = await getOrCreateBookingSettings(tenantId);
  const [resources, services, availabilityRules, calendarBlocks, blackouts, requests, templates] = await Promise.all([
    db.select().from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true))).orderBy(asc(bookingResources.sortOrder), asc(bookingResources.name)),
    db.select().from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name)),
    db.select().from(bookingAvailabilityRules).where(and(eq(bookingAvailabilityRules.tenantId, tenantId), eq(bookingAvailabilityRules.active, true))).orderBy(asc(bookingAvailabilityRules.weekday), asc(bookingAvailabilityRules.startTime)),
    db.select().from(bookingCalendarBlocks).where(and(eq(bookingCalendarBlocks.tenantId, tenantId), eq(bookingCalendarBlocks.active, true))).orderBy(asc(bookingCalendarBlocks.startsAt)),
    db.select().from(bookingBlackouts).where(eq(bookingBlackouts.tenantId, tenantId)).orderBy(asc(bookingBlackouts.startsAt)),
    db.select().from(bookingRequests).where(eq(bookingRequests.tenantId, tenantId)).orderBy(asc(bookingRequests.startsAt)),
    db.select().from(emailTemplates).where(eq(emailTemplates.tenantId, tenantId)),
  ]);

  return { addonActive, settings, resources, services, availabilityRules, calendarBlocks, blackouts, requests, templates };
}

function getPublicDemoBookingAdminData(tenantId: string) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(21, 0, 0, 0);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  nextWeek.setHours(10, 0, 0, 0);
  const nextWeekEnd = new Date(nextWeek);
  nextWeekEnd.setHours(11, 0, 0, 0);
  const resourceTable = {
    id: 'demo-booking-resource-table',
    tenantId,
    type: 'table' as const,
    name: 'Tisch 4',
    description: 'Fensterplatz für kleinere Gruppen',
    capacity: 1,
    seats: 4,
    image: null,
    active: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  };
  const resourceRoom = {
    id: 'demo-booking-resource-room',
    tenantId,
    type: 'room' as const,
    name: 'Private Dining Raum',
    description: 'Separater Bereich für Feiern und Business-Dinner',
    capacity: 1,
    seats: 12,
    image: null,
    active: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  };
  const serviceDinner = {
    id: 'demo-booking-service-dinner',
    tenantId,
    name: 'Dinner-Reservierung',
    description: 'Tischreservierung mit manueller Bestätigung',
    durationMinutes: 120,
    timeModelOverride: null,
    priceLabel: null,
    requiresResource: true,
    allowedResourceTypes: ['table', 'room'],
    active: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  };
  const serviceConsulting = {
    id: 'demo-booking-service-consulting',
    tenantId,
    name: 'Event-Anfrage',
    description: 'Datumsbereich oder ganzer Abend für Events',
    durationMinutes: null,
    timeModelOverride: 'date_range' as const,
    priceLabel: 'auf Anfrage',
    requiresResource: true,
    allowedResourceTypes: ['room'],
    active: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  };
  return {
    addonActive: true,
    settings: {
      id: 'demo-booking-settings',
      tenantId,
      mode: 'request' as const,
      timeModel: 'time_slot' as const,
      timezone: 'Europe/Berlin',
      intervalMinutes: 30,
      minNoticeHours: 12,
      maxAdvanceDays: 90,
      cancellationAllowed: true,
      cancellationDeadlineHours: 24,
      notificationEmail: 'booking@demo.flamingomedia.online',
      customerEmailEnabled: true,
      adminEmailEnabled: true,
      createdAt: now,
      updatedAt: now,
    },
    resources: [resourceTable, resourceRoom],
    services: [serviceDinner, serviceConsulting],
    availabilityRules: [
      { id: 'demo-rule-1', tenantId, resourceId: resourceTable.id, serviceId: serviceDinner.id, weekday: 5, startTime: '18:00', endTime: '22:00', capacity: 1, active: true, createdAt: now },
      { id: 'demo-rule-2', tenantId, resourceId: resourceRoom.id, serviceId: serviceConsulting.id, weekday: 6, startTime: '10:00', endTime: '18:00', capacity: 1, active: true, createdAt: now },
    ],
    calendarBlocks: [
      { id: 'demo-block-1', tenantId, resourceId: resourceRoom.id, serviceId: serviceConsulting.id, type: 'available', startsAt: nextWeek, endsAt: nextWeekEnd, capacity: 1, note: 'Event-Slot verfügbar', active: true, createdAt: now, updatedAt: now },
    ],
    blackouts: [],
    requests: [
      { id: 'demo-request-1', tenantId, customerId: null, serviceId: serviceDinner.id, resourceId: resourceTable.id, mode: 'request' as const, timeModel: 'time_slot' as const, status: 'requested' as const, customerName: 'Anna Beispiel', customerEmail: 'anna@example.com', customerPhone: '+49 89 123456', partySize: 4, startsAt: tomorrow, endsAt: tomorrowEnd, message: 'Fensterplatz wäre schön.', cancellationTokenHash: null, cancellationReason: null, createdAt: now, updatedAt: now },
      { id: 'demo-request-2', tenantId, customerId: null, serviceId: serviceConsulting.id, resourceId: resourceRoom.id, mode: 'request' as const, timeModel: 'date_range' as const, status: 'confirmed' as const, customerName: 'Max Muster', customerEmail: 'max@example.com', customerPhone: '+49 30 555000', partySize: 12, startsAt: nextWeek, endsAt: nextWeekEnd, message: 'Business-Dinner mit Menü.', cancellationTokenHash: null, cancellationReason: null, createdAt: now, updatedAt: now },
    ],
    templates: [],
  };
}

export async function requestBookingAddonAction() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, BOOKING_ADDON_KEY)))
    .limit(1);
  if (!existing) {
    await db.insert(tenantAddons).values({ tenantId, addonKey: BOOKING_ADDON_KEY, active: false });
  }
  revalidatePath('/admin/functions');
}

export async function saveBookingSettingsAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const db = getDb();
  await getOrCreateBookingSettings(tenantId);
  await db.update(bookingSettings).set({
    mode: stringOption(formData.get('mode'), BOOKING_MODES, 'request'),
    timeModel: stringOption(formData.get('timeModel'), BOOKING_TIME_MODELS, 'time_slot'),
    timezone: normalizeTimezone(cleanString(formData.get('timezone'), 80)),
    intervalMinutes: intValue(formData.get('intervalMinutes'), 30, 5, 1440),
    minNoticeHours: intValue(formData.get('minNoticeHours'), 12, 0, 8760),
    maxAdvanceDays: intValue(formData.get('maxAdvanceDays'), 90, 1, 730),
    cancellationAllowed: formData.get('cancellationAllowed') === 'on',
    cancellationDeadlineHours: intValue(formData.get('cancellationDeadlineHours'), 24, 0, 8760),
    notificationEmail: cleanString(formData.get('notificationEmail'), 255) || null,
    customerEmailEnabled: formData.get('customerEmailEnabled') === 'on',
    adminEmailEnabled: formData.get('adminEmailEnabled') === 'on',
    updatedAt: new Date(),
  }).where(eq(bookingSettings.tenantId, tenantId));
  revalidatePath('/admin/functions/booking');
}

export async function addBookingResourceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const name = cleanString(formData.get('name'), 255);
  if (!name) return;
  await getDb().insert(bookingResources).values({
    tenantId,
    name,
    type: stringOption(formData.get('type'), BOOKING_RESOURCE_TYPES, 'generic'),
    capacity: intValue(formData.get('capacity'), 1, 1, 10000),
    seats: intOptional(formData.get('seats'), 1, 10000),
    description: cleanString(formData.get('description'), 2000) || null,
  });
  revalidatePath('/admin/functions/booking');
}

export async function updateBookingResourceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const name = cleanString(formData.get('name'), 255);
  if (!id || !name) return;
  await getDb().update(bookingResources).set({
    name,
    type: stringOption(formData.get('type'), BOOKING_RESOURCE_TYPES, 'generic'),
    capacity: intValue(formData.get('capacity'), 1, 1, 10000),
    seats: intOptional(formData.get('seats'), 1, 10000),
    description: cleanString(formData.get('description'), 2000) || null,
    updatedAt: new Date(),
  }).where(and(eq(bookingResources.id, id), eq(bookingResources.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function addBookingServiceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const name = cleanString(formData.get('name'), 255);
  if (!name) return;
  const timeModelOverrideRaw = cleanString(formData.get('timeModelOverride'), 20);
  await getDb().insert(bookingServices).values({
    tenantId,
    name,
    description: cleanString(formData.get('description'), 2000) || null,
    durationMinutes: intValue(formData.get('durationMinutes'), 30, 0, 1440) || null,
    bufferBeforeMinutes: intValue(formData.get('bufferBeforeMinutes'), 0, 0, 1440),
    bufferAfterMinutes: intValue(formData.get('bufferAfterMinutes'), 0, 0, 1440),
    timeModelOverride: timeModelOverrideRaw ? stringOption(timeModelOverrideRaw, BOOKING_TIME_MODELS, 'time_slot') : null,
    priceLabel: cleanString(formData.get('priceLabel'), 100) || null,
    requiresResource: formData.get('requiresResource') === 'on',
    minPartySize: intOptional(formData.get('minPartySize'), 1, 10000),
    maxPartySize: intOptional(formData.get('maxPartySize'), 1, 10000),
    allowedResourceTypes: stringList(formData.getAll('allowedResourceTypes'), BOOKING_RESOURCE_TYPES),
    intakeQuestions: parseIntakeQuestions(formData.get('intakeQuestions')),
  });
  revalidatePath('/admin/functions/booking');
}

export async function updateBookingServiceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const name = cleanString(formData.get('name'), 255);
  if (!id || !name) return;
  const timeModelOverrideRaw = cleanString(formData.get('timeModelOverride'), 20);
  await getDb().update(bookingServices).set({
    name,
    description: cleanString(formData.get('description'), 2000) || null,
    durationMinutes: intValue(formData.get('durationMinutes'), 30, 0, 1440) || null,
    bufferBeforeMinutes: intValue(formData.get('bufferBeforeMinutes'), 0, 0, 1440),
    bufferAfterMinutes: intValue(formData.get('bufferAfterMinutes'), 0, 0, 1440),
    timeModelOverride: timeModelOverrideRaw ? stringOption(timeModelOverrideRaw, BOOKING_TIME_MODELS, 'time_slot') : null,
    priceLabel: cleanString(formData.get('priceLabel'), 100) || null,
    requiresResource: formData.get('requiresResource') === 'on',
    minPartySize: intOptional(formData.get('minPartySize'), 1, 10000),
    maxPartySize: intOptional(formData.get('maxPartySize'), 1, 10000),
    allowedResourceTypes: stringList(formData.getAll('allowedResourceTypes'), BOOKING_RESOURCE_TYPES),
    intakeQuestions: parseIntakeQuestions(formData.get('intakeQuestions')),
    updatedAt: new Date(),
  }).where(and(eq(bookingServices.id, id), eq(bookingServices.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function addBookingAvailabilityRuleAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const startTime = cleanString(formData.get('startTime'), 10);
  const endTime = cleanString(formData.get('endTime'), 10);
  if (!startTime || !endTime) return;
  await getDb().insert(bookingAvailabilityRules).values({
    tenantId,
    resourceId: uuidOrNull(formData.get('resourceId')),
    serviceId: uuidOrNull(formData.get('serviceId')),
    weekday: intValue(formData.get('weekday'), 1, 0, 6),
    startTime,
    endTime,
    capacity: intValue(formData.get('capacity'), 1, 1, 10000),
  });
  revalidatePath('/admin/functions/booking');
}

export async function updateBookingAvailabilityRuleAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const startTime = cleanString(formData.get('startTime'), 10);
  const endTime = cleanString(formData.get('endTime'), 10);
  if (!id || !startTime || !endTime) return;
  await getDb().update(bookingAvailabilityRules).set({
    resourceId: uuidOrNull(formData.get('resourceId')),
    serviceId: uuidOrNull(formData.get('serviceId')),
    weekday: intValue(formData.get('weekday'), 1, 0, 6),
    startTime,
    endTime,
    capacity: intValue(formData.get('capacity'), 1, 1, 10000),
  }).where(and(eq(bookingAvailabilityRules.id, id), eq(bookingAvailabilityRules.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function addBookingBlackoutAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const settings = await getOrCreateBookingSettings(tenantId);
  const startsAt = dateTimeValue(formData.get('startsAt'), settings.timezone);
  const endsAt = dateTimeValue(formData.get('endsAt'), settings.timezone);
  if (!startsAt || !endsAt || endsAt <= startsAt) return;
  await getDb().insert(bookingBlackouts).values({
    tenantId,
    resourceId: uuidOrNull(formData.get('resourceId')),
    startsAt,
    endsAt,
    reason: cleanString(formData.get('reason'), 255) || null,
  });
  revalidatePath('/admin/functions/booking');
  redirectWithFeedback(formData, 'Sperrzeit gespeichert.', 'success');
}

export async function deleteBookingBlackoutAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  if (!id) return;
  await getDb().delete(bookingBlackouts).where(and(eq(bookingBlackouts.id, id), eq(bookingBlackouts.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function deleteBookingResourceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  if (!id) return;
  await getDb().update(bookingResources).set({ active: false, updatedAt: new Date() }).where(and(eq(bookingResources.id, id), eq(bookingResources.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function deleteBookingServiceAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  if (!id) return;
  await getDb().update(bookingServices).set({ active: false, updatedAt: new Date() }).where(and(eq(bookingServices.id, id), eq(bookingServices.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function deleteBookingAvailabilityRuleAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  if (!id) return;
  await getDb().update(bookingAvailabilityRules).set({ active: false }).where(and(eq(bookingAvailabilityRules.id, id), eq(bookingAvailabilityRules.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function addBookingCalendarBlockAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const settings = await getOrCreateBookingSettings(tenantId);
  const startsAt = dateTimeValue(formData.get('startsAt'), settings.timezone);
  const endsAt = dateTimeValue(formData.get('endsAt'), settings.timezone);
  if (!startsAt || !endsAt || endsAt <= startsAt) {
    redirectWithFeedback(formData, 'Bitte einen gültigen Zeitraum eintragen.', 'error');
    return;
  }
  await getDb().insert(bookingCalendarBlocks).values({
    tenantId,
    resourceId: uuidOrNull(formData.get('resourceId')),
    serviceId: uuidOrNull(formData.get('serviceId')),
    type: stringOption(formData.get('type'), BOOKING_CALENDAR_BLOCK_TYPES, 'available'),
    startsAt,
    endsAt,
    capacity: intOptional(formData.get('capacity'), 1, 10000),
    note: cleanString(formData.get('note'), 255) || null,
  });
  revalidatePath('/admin/functions/booking');
  redirectWithFeedback(formData, 'Kalenderblock gespeichert.', 'success');
}

export async function updateBookingCalendarBlockAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const settings = await getOrCreateBookingSettings(tenantId);
  const startsAt = dateTimeValue(formData.get('startsAt'), settings.timezone);
  const endsAt = dateTimeValue(formData.get('endsAt'), settings.timezone);
  if (!id || !startsAt || !endsAt || endsAt <= startsAt) {
    redirectWithFeedback(formData, 'Bitte einen gültigen Zeitraum eintragen.', 'error');
    return;
  }
  await getDb().update(bookingCalendarBlocks).set({
    resourceId: uuidOrNull(formData.get('resourceId')),
    serviceId: uuidOrNull(formData.get('serviceId')),
    type: stringOption(formData.get('type'), BOOKING_CALENDAR_BLOCK_TYPES, 'available'),
    startsAt,
    endsAt,
    capacity: intOptional(formData.get('capacity'), 1, 10000),
    note: cleanString(formData.get('note'), 255) || null,
    updatedAt: new Date(),
  }).where(and(eq(bookingCalendarBlocks.id, id), eq(bookingCalendarBlocks.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
  redirectWithFeedback(formData, 'Kalenderblock aktualisiert.', 'success');
}

export async function deleteBookingCalendarBlockAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  if (!id) return;
  await getDb().update(bookingCalendarBlocks).set({ active: false, updatedAt: new Date() }).where(and(eq(bookingCalendarBlocks.id, id), eq(bookingCalendarBlocks.tenantId, tenantId)));
  revalidatePath('/admin/functions/booking');
}

export async function updateBookingAssignmentAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const resourceId = uuidOrNull(formData.get('resourceId'));
  if (!id) return;
  const db = getDb();
  const [booking] = await db.select().from(bookingRequests).where(and(eq(bookingRequests.id, id), eq(bookingRequests.tenantId, tenantId))).limit(1);
  if (!booking) return;
  if (resourceId) {
    const [resource] = await db.select({ id: bookingResources.id, type: bookingResources.type }).from(bookingResources)
      .where(and(eq(bookingResources.id, resourceId), eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true)))
      .limit(1);
    if (!resource) return;
    const [service] = booking.serviceId
      ? await db.select({ allowedResourceTypes: bookingServices.allowedResourceTypes }).from(bookingServices)
        .where(and(eq(bookingServices.id, booking.serviceId), eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true)))
        .limit(1)
      : [];
    const allowedTypes = Array.isArray(service?.allowedResourceTypes) ? service.allowedResourceTypes : [];
    if (allowedTypes.length && !allowedTypes.includes(resource.type)) redirectWithFeedback(formData, 'Diese Ressource passt nicht zur Leistung.', 'error');
    const blackout = await hasBookingBlackout({ tenantId, resourceId, startsAt: booking.startsAt, endsAt: booking.endsAt });
    if (blackout) redirectWithFeedback(formData, 'Diese Ressource ist in diesem Zeitraum gesperrt.', 'error');
    const settings = await getOrCreateBookingSettings(tenantId);
    const conflict = await hasBookingConflict({ tenantId, excludeBookingId: booking.id, resourceId, timeModel: booking.timeModel, startsAt: booking.startsAt, endsAt: booking.endsAt, timezone: settings.timezone });
    if (conflict) redirectWithFeedback(formData, 'Diese Ressource ist in diesem Zeitraum bereits belegt.', 'error');
  }
  await db.update(bookingRequests).set({ resourceId, updatedAt: new Date() }).where(and(eq(bookingRequests.id, id), eq(bookingRequests.tenantId, tenantId)));
  await db.insert(bookingStatusHistory).values({
    tenantId,
    bookingId: booking.id,
    fromStatus: booking.status,
    toStatus: booking.status,
    actor: 'admin',
    note: resourceId ? 'Ressource manuell zugeordnet.' : 'Ressourcenzuordnung entfernt.',
  });
  revalidatePath('/admin/functions/booking');
  redirectWithFeedback(formData, 'Ressource zugeordnet.', 'success');
}

export async function updateBookingStatusAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const id = cleanString(formData.get('id'), 80);
  const nextStatus = stringOption(formData.get('status'), ['requested', 'confirmed', 'cancelled_by_customer', 'cancelled_by_admin', 'completed', 'no_show'] as const, 'requested');
  const note = cleanString(formData.get('note'), 1000) || null;
  if (!id) return;

  const db = getDb();
  const [booking] = await db.select().from(bookingRequests).where(and(eq(bookingRequests.id, id), eq(bookingRequests.tenantId, tenantId))).limit(1);
  if (!booking) return;
  const [service] = booking.serviceId
    ? await db.select({ requiresResource: bookingServices.requiresResource, allowedResourceTypes: bookingServices.allowedResourceTypes }).from(bookingServices)
      .where(and(eq(bookingServices.id, booking.serviceId), eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true)))
      .limit(1)
    : [];

  if (nextStatus === 'confirmed') {
    if (service?.requiresResource && !booking.resourceId) redirectWithFeedback(formData, 'Diese Leistung benötigt vor der Bestätigung eine Ressource.', 'error');
    if (booking.resourceId && service) {
      const [resource] = await db.select({ type: bookingResources.type }).from(bookingResources)
        .where(and(eq(bookingResources.id, booking.resourceId), eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true)))
        .limit(1);
      const allowedTypes = Array.isArray(service.allowedResourceTypes) ? service.allowedResourceTypes : [];
      if (resource && allowedTypes.length && !allowedTypes.includes(resource.type)) redirectWithFeedback(formData, 'Die zugeordnete Ressource passt nicht zur Leistung.', 'error');
    }
    const settings = await getOrCreateBookingSettings(tenantId);
    const available = await isWithinBookingAvailability({
      tenantId,
      serviceId: booking.serviceId,
      resourceId: booking.resourceId,
      timeModel: booking.timeModel,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      timezone: settings.timezone,
    });
    if (!available) redirectWithFeedback(formData, 'Diese Buchung liegt außerhalb der Verfügbarkeiten.', 'error');

    const blackout = await hasBookingBlackout({
      tenantId,
      resourceId: booking.resourceId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    });
    if (blackout) redirectWithFeedback(formData, 'Dieser Zeitraum ist gesperrt.', 'error');

    const conflict = await hasBookingConflict({
      tenantId,
      excludeBookingId: booking.id,
      resourceId: booking.resourceId,
      timeModel: booking.timeModel,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      timezone: settings.timezone,
    });
    if (conflict) redirectWithFeedback(formData, 'Dieser Zeitraum ist bereits belegt.', 'error');
  }

  const cancellationToken = nextStatus === 'confirmed' ? crypto.randomBytes(24).toString('hex') : null;
  const cancellationTokenHash = cancellationToken ? crypto.createHash('sha256').update(cancellationToken).digest('hex') : booking.cancellationTokenHash;
  await db.update(bookingRequests).set({
    status: nextStatus,
    cancellationReason: nextStatus === 'cancelled_by_admin' ? note : booking.cancellationReason,
    cancellationTokenHash,
    updatedAt: new Date(),
  }).where(and(eq(bookingRequests.id, id), eq(bookingRequests.tenantId, tenantId)));

  await db.insert(bookingStatusHistory).values({
    tenantId,
    bookingId: booking.id,
    fromStatus: booking.status,
    toStatus: nextStatus,
    actor: 'admin',
    note,
  });

  const settings = await getOrCreateBookingSettings(tenantId);
  const values = bookingEmailValues({ ...booking, cancellationToken }, settings.timezone, note);
  if (nextStatus === 'confirmed' && booking.customerEmail) {
    sendBookingEmail({ tenantId, trigger: 'booking_confirmed_customer', to: booking.customerEmail, values }).catch(console.error);
  }
  if (nextStatus === 'cancelled_by_admin') {
    if (booking.customerEmail) sendBookingEmail({ tenantId, trigger: 'booking_cancelled_customer', to: booking.customerEmail, values }).catch(console.error);
    const adminEmail = await getBookingNotificationEmail(tenantId);
    sendBookingEmail({ tenantId, trigger: 'booking_cancelled_admin', to: adminEmail, values }).catch(console.error);
  }

  revalidatePath('/admin/functions/booking');
  redirectWithFeedback(formData, 'Änderung gespeichert.', 'success');
}

export async function saveBookingEmailTemplateAction(formData: FormData) {
  const tenantId = await requireTenant();
  await requireBooking(tenantId);
  const trigger = stringOption(formData.get('trigger'), BOOKING_EMAIL_TRIGGERS, 'booking_requested_customer') as BookingEmailTrigger;
  const fallback = getDefaultBookingEmailTemplate(trigger);
  const subject = cleanString(formData.get('subject'), 255) || fallback.subject;
  const body = cleanString(formData.get('body'), 10000) || fallback.body;
  const db = getDb();
  const [existing] = await db.select({ id: emailTemplates.id }).from(emailTemplates)
    .where(and(eq(emailTemplates.tenantId, tenantId), eq(emailTemplates.trigger, trigger)))
    .limit(1);
  if (existing) {
    await db.update(emailTemplates).set({ subject, body, active: true }).where(eq(emailTemplates.id, existing.id));
  } else {
    await db.insert(emailTemplates).values({ tenantId, trigger, subject, body, active: true });
  }
  revalidatePath('/admin/functions/booking');
}

function cleanString(value: FormDataEntryValue | null, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuidOrNull(value: FormDataEntryValue | null) {
  const cleaned = cleanString(value, 80);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned) ? cleaned : null;
}

function dateTimeValue(value: FormDataEntryValue | null, timezone: string) {
  const cleaned = cleanString(value, 40);
  if (!cleaned) return null;
  const [datePart, timePart] = cleaned.split('T');
  const date = datePart && timePart ? zonedDateTimeToUtc(datePart, timePart, timezone) : new Date(cleaned);
  return Number.isNaN(date.getTime()) ? null : date;
}

function intValue(value: FormDataEntryValue | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.round(parsed), min), max);
}

function intOptional(value: FormDataEntryValue | null, min: number, max: number) {
  const raw = cleanString(value, 20);
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(Math.max(Math.round(parsed), min), max);
}

function stringOption<const T extends readonly string[]>(value: FormDataEntryValue | null | string, allowed: T, fallback: T[number]): T[number] {
  return allowed.includes(value as T[number]) ? value as T[number] : fallback;
}

function stringList<const T extends readonly string[]>(values: FormDataEntryValue[], allowed: T) {
  return values.filter((value): value is T[number] => typeof value === 'string' && allowed.includes(value as T[number]));
}

function parseIntakeQuestions(value: FormDataEntryValue | null) {
  const raw = cleanString(value, 5000);
  if (!raw) return [];
  return raw.split('\n').map((line, index) => {
    const cleaned = line.trim();
    if (!cleaned) return null;
    const [labelPart, optionsPart] = cleaned.split('|').map(part => part.trim());
    const required = labelPart.endsWith('*');
    const label = required ? labelPart.slice(0, -1).trim() : labelPart;
    if (!label) return null;
    const options = optionsPart ? optionsPart.split(',').map(option => option.trim()).filter(Boolean).slice(0, 12) : [];
    return {
      id: `q_${index + 1}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'frage'}`,
      label,
      required,
      type: options.length ? 'select' : 'text',
      options,
    };
  }).filter((item): item is { id: string; label: string; required: boolean; type: string; options: string[] } => Boolean(item));
}

function bookingEmailValues(booking: typeof bookingRequests.$inferSelect & { cancellationToken?: string | null }, timezone?: string | null, cancellationReason?: string | null) {
  const summary = `Zeitraum: ${formatBookingDate(booking.startsAt, timezone)} bis ${formatBookingDate(booking.endsAt, timezone)}\nPersonen/Menge: ${booking.partySize}`;
  const siteUrl = process.env.SITE_URL || '';
  return {
    companyName: 'Ihre Website',
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    bookingDate: formatBookingDate(booking.startsAt, timezone),
    bookingSummary: summary,
    message: booking.message,
    cancellationUrl: booking.cancellationToken && siteUrl ? `${siteUrl}/api/booking/cancel?booking=${booking.id}&token=${booking.cancellationToken}` : '',
    cancellationReason,
  };
}

function redirectWithFeedback(formData: FormData, message: string, type: 'success' | 'error') {
  const returnTo = cleanString(formData.get('returnTo'), 300) || '/admin/functions/booking';
  const safePath = returnTo.startsWith('/admin/functions/booking') ? returnTo : '/admin/functions/booking';
  const join = safePath.includes('?') ? '&' : '?';
  redirect(`${safePath}${join}${type}=${encodeURIComponent(message)}`);
}
