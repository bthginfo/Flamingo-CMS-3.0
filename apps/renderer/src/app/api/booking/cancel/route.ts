import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { bookingRequests, bookingSettings, bookingStatusHistory } from '@flamingo/db';
import { getBookingNotificationEmail, sendBookingEmail } from '@/lib/booking-email';
import { formatBookingDate } from '@/lib/booking-time';

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get('booking') || '';
  const token = req.nextUrl.searchParams.get('token') || '';
  if (!bookingId || !token) return NextResponse.json({ error: 'Ungültiger Storno-Link.' }, { status: 400 });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const db = getDb();
  const [booking] = await db.select().from(bookingRequests)
    .where(and(eq(bookingRequests.id, bookingId), eq(bookingRequests.cancellationTokenHash, tokenHash)))
    .limit(1);
  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden.' }, { status: 404 });

  const [settings] = await db.select().from(bookingSettings).where(eq(bookingSettings.tenantId, booking.tenantId)).limit(1);
  if (!settings?.cancellationAllowed) return NextResponse.json({ error: 'Storno ist online nicht aktiviert.' }, { status: 403 });
  const deadlineMs = booking.startsAt.getTime() - settings.cancellationDeadlineHours * 60 * 60 * 1000;
  if (Date.now() > deadlineMs) return NextResponse.json({ error: 'Die Online-Storno-Frist ist abgelaufen.' }, { status: 403 });
  if (booking.status === 'cancelled_by_customer' || booking.status === 'cancelled_by_admin') {
    return NextResponse.json({ success: true, status: booking.status });
  }

  await db.update(bookingRequests).set({
    status: 'cancelled_by_customer',
    cancellationReason: 'Online-Storno durch Kunden',
    updatedAt: new Date(),
  }).where(and(eq(bookingRequests.id, booking.id), eq(bookingRequests.tenantId, booking.tenantId)));
  await db.insert(bookingStatusHistory).values({
    tenantId: booking.tenantId,
    bookingId: booking.id,
    fromStatus: booking.status,
    toStatus: 'cancelled_by_customer',
    actor: 'customer',
    note: 'Online-Storno durch Kunden',
  });

  const values = {
    companyName: 'Ihre Website',
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    bookingDate: formatBookingDate(booking.startsAt, settings.timezone),
    bookingSummary: `Zeitraum: ${formatBookingDate(booking.startsAt, settings.timezone)} bis ${formatBookingDate(booking.endsAt, settings.timezone)}\nPersonen/Menge: ${booking.partySize}`,
    cancellationReason: 'Online-Storno durch Kunden',
  };
  if (booking.customerEmail) {
    sendBookingEmail({ tenantId: booking.tenantId, trigger: 'booking_cancelled_customer', to: booking.customerEmail, values }).catch(console.error);
  }
  const adminEmail = await getBookingNotificationEmail(booking.tenantId);
  sendBookingEmail({ tenantId: booking.tenantId, trigger: 'booking_cancelled_admin', to: adminEmail, values }).catch(console.error);

  return NextResponse.json({ success: true, status: 'cancelled_by_customer' });
}
