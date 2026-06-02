'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { BOOKING_ADDON_KEY, getOrCreateBookingSettings, hasBookingAddon, hasBookingBlackout, hasBookingConflict, isWithinBookingAvailability } from '@/lib/booking-core';
import { getBookingNotificationEmail, getDefaultBookingEmailTemplate, sendBookingEmail, type BookingEmailTrigger } from '@/lib/booking-email';
import { bookingAvailabilityRules, bookingRequests, bookingResources, bookingServices, bookingSettings, bookingStatusHistory, emailTemplates, tenantAddons } from '@flamingo/db';

const BOOKING_MODES = ['request', 'instant'] as const;
const BOOKING_TIME_MODELS = ['time_slot', 'full_day', 'date_range'] as const;
const BOOKING_RESOURCE_TYPES = ['table', 'room', 'space', 'room_unit', 'staff', 'equipment', 'generic'] as const;
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
    return {
      addonActive,
      settings: null,
      resources: [],
      services: [],
      availabilityRules: [],
      requests: [],
      templates: [],
    };
  }

  const settings = await getOrCreateBookingSettings(tenantId);
  const [resources, services, availabilityRules, requests, templates] = await Promise.all([
    db.select().from(bookingResources).where(and(eq(bookingResources.tenantId, tenantId), eq(bookingResources.active, true))).orderBy(asc(bookingResources.sortOrder), asc(bookingResources.name)),
    db.select().from(bookingServices).where(and(eq(bookingServices.tenantId, tenantId), eq(bookingServices.active, true))).orderBy(asc(bookingServices.sortOrder), asc(bookingServices.name)),
    db.select().from(bookingAvailabilityRules).where(and(eq(bookingAvailabilityRules.tenantId, tenantId), eq(bookingAvailabilityRules.active, true))).orderBy(asc(bookingAvailabilityRules.weekday), asc(bookingAvailabilityRules.startTime)),
    db.select().from(bookingRequests).where(eq(bookingRequests.tenantId, tenantId)).orderBy(asc(bookingRequests.startsAt)),
    db.select().from(emailTemplates).where(eq(emailTemplates.tenantId, tenantId)),
  ]);

  return { addonActive, settings, resources, services, availabilityRules, requests, templates };
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
    description: cleanString(formData.get('description'), 2000) || null,
  });
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
    timeModelOverride: timeModelOverrideRaw ? stringOption(timeModelOverrideRaw, BOOKING_TIME_MODELS, 'time_slot') : null,
    priceLabel: cleanString(formData.get('priceLabel'), 100) || null,
    requiresResource: formData.get('requiresResource') === 'on',
  });
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
    weekday: intValue(formData.get('weekday'), 1, 0, 6),
    startTime,
    endTime,
    capacity: intValue(formData.get('capacity'), 1, 1, 10000),
  });
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

  if (nextStatus === 'confirmed') {
    const available = await isWithinBookingAvailability({
      tenantId,
      serviceId: booking.serviceId,
      resourceId: booking.resourceId,
      timeModel: booking.timeModel,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    });
    if (!available) return;

    const blackout = await hasBookingBlackout({
      tenantId,
      resourceId: booking.resourceId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    });
    if (blackout) return;

    const conflict = await hasBookingConflict({
      tenantId,
      excludeBookingId: booking.id,
      resourceId: booking.resourceId,
      timeModel: booking.timeModel,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    });
    if (conflict) return;
  }

  await db.update(bookingRequests).set({
    status: nextStatus,
    cancellationReason: nextStatus === 'cancelled_by_admin' ? note : booking.cancellationReason,
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

  const values = bookingEmailValues(booking, note);
  if (nextStatus === 'confirmed' && booking.customerEmail) {
    sendBookingEmail({ tenantId, trigger: 'booking_confirmed_customer', to: booking.customerEmail, values }).catch(console.error);
  }
  if (nextStatus === 'cancelled_by_admin') {
    if (booking.customerEmail) sendBookingEmail({ tenantId, trigger: 'booking_cancelled_customer', to: booking.customerEmail, values }).catch(console.error);
    const adminEmail = await getBookingNotificationEmail(tenantId);
    sendBookingEmail({ tenantId, trigger: 'booking_cancelled_admin', to: adminEmail, values }).catch(console.error);
  }

  revalidatePath('/admin/functions/booking');
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

function intValue(value: FormDataEntryValue | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.round(parsed), min), max);
}

function stringOption<const T extends readonly string[]>(value: FormDataEntryValue | null | string, allowed: T, fallback: T[number]): T[number] {
  return allowed.includes(value as T[number]) ? value as T[number] : fallback;
}

function bookingEmailValues(booking: typeof bookingRequests.$inferSelect, cancellationReason?: string | null) {
  const summary = `Zeitraum: ${formatDate(booking.startsAt)} bis ${formatDate(booking.endsAt)}\nPersonen/Menge: ${booking.partySize}`;
  return {
    companyName: 'Ihre Website',
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    bookingDate: formatDate(booking.startsAt),
    bookingSummary: summary,
    message: booking.message,
    cancellationUrl: '',
    cancellationReason,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
