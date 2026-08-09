import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { bookingRequests, bookingSettings } from '@flamingo/db';
import { getBookingNotificationEmail, sendBookingEmail } from '@/lib/booking-email';
import { formatBookingDate } from '@/lib/booking-time';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  rendererBookingCancellationRateRules,
} from '@/lib/renderer-contact-security';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get('booking') || '';
  const token = req.nextUrl.searchParams.get('token') || '';
  const loaded = await loadCancellation(req, bookingId, token);
  if ('response' in loaded) return loaded.response;

  const { booking, settings } = loaded;
  if (booking.status === 'cancelled_by_customer' || booking.status === 'cancelled_by_admin') {
    return htmlPage('Buchung bereits storniert', 'Diese Buchung wurde bereits storniert.', 200);
  }

  const bookingDate = escapeHtml(formatBookingDate(booking.startsAt, settings.timezone));
  const customerName = escapeHtml(booking.customerName || '');
  return htmlPage(
    'Buchung stornieren',
    `<p>Hallo ${customerName},</p><p>Möchten Sie Ihre Buchung am <strong>${bookingDate}</strong> wirklich stornieren?</p>
    <form method="post">
      <input type="hidden" name="booking" value="${escapeHtml(bookingId)}">
      <input type="hidden" name="token" value="${escapeHtml(token)}">
      <button type="submit">Buchung verbindlich stornieren</button>
    </form>
    <p class="muted">Ohne Klick auf den Button bleibt Ihre Buchung bestehen.</p>`,
    200,
  );
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return htmlPage('Ungültige Anfrage', 'Die Stornierung konnte nicht verarbeitet werden.', 400);
  }
  const bookingId = String(form.get('booking') || '');
  const token = String(form.get('token') || '');
  const loaded = await loadCancellation(req, bookingId, token);
  if ('response' in loaded) return loaded.response;

  const { booking, settings } = loaded;
  if (booking.status === 'cancelled_by_customer' || booking.status === 'cancelled_by_admin') {
    return htmlPage('Buchung bereits storniert', 'Diese Buchung wurde bereits storniert.', 200);
  }

  const db = getDb();
  const result = await db.execute(sql`
    WITH cancelled_booking AS (
      UPDATE booking_requests
      SET status = 'cancelled_by_customer',
          cancellation_reason = 'Online-Storno durch Kunden',
          updated_at = now()
      WHERE id = ${booking.id}::uuid
        AND tenant_id = ${booking.tenantId}::uuid
        AND status = ${booking.status}::booking_status
      RETURNING id
    )
    INSERT INTO booking_status_history (tenant_id, booking_id, from_status, to_status, actor, note)
    SELECT ${booking.tenantId}::uuid, id, ${booking.status}::booking_status, 'cancelled_by_customer', 'customer', 'Online-Storno durch Kunden'
    FROM cancelled_booking
    RETURNING booking_id
  `);
  if (!result.rows?.length) {
    return htmlPage('Buchung bereits bearbeitet', 'Der Status dieser Buchung wurde bereits geändert. Bitte laden Sie den Link erneut.', 409);
  }

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

  return htmlPage('Buchung storniert', 'Ihre Buchung wurde storniert. Sie erhalten eine Bestätigung per E-Mail.', 200, true);
}

async function loadCancellation(req: NextRequest, bookingId: string, token: string) {
  if (!UUID_RE.test(bookingId) || token.length < 32 || token.length > 256) {
    return { response: htmlPage('Ungültiger Storno-Link', 'Dieser Link ist unvollständig oder ungültig.', 400) };
  }
  const denied = await consumeRendererContactRateRules(
    rendererBookingCancellationRateRules(getRendererContactClientAddress(req.headers)),
  );
  if (denied) {
    const response = htmlPage('Zu viele Versuche', 'Bitte versuchen Sie es später erneut.', 429);
    response.headers.set('Retry-After', String(denied.retryAfterSeconds));
    return { response };
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const db = getDb();
  const [booking] = await db.select().from(bookingRequests)
    .where(and(eq(bookingRequests.id, bookingId), eq(bookingRequests.cancellationTokenHash, tokenHash)))
    .limit(1);
  if (!booking) return { response: htmlPage('Buchung nicht gefunden', 'Der Link ist nicht mehr gültig.', 404) };

  const [settings] = await db.select().from(bookingSettings).where(eq(bookingSettings.tenantId, booking.tenantId)).limit(1);
  if (!settings?.cancellationAllowed) return { response: htmlPage('Online-Storno deaktiviert', 'Bitte kontaktieren Sie den Anbieter direkt.', 403) };
  const deadlineMs = booking.startsAt.getTime() - settings.cancellationDeadlineHours * 60 * 60 * 1000;
  if (Date.now() > deadlineMs) return { response: htmlPage('Storno-Frist abgelaufen', 'Bitte kontaktieren Sie den Anbieter direkt.', 403) };

  return { booking, settings };
}

function htmlPage(title: string, content: string, status: number, success = false) {
  const safeTitle = escapeHtml(title);
  const body = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle}</title>
  <style>body{margin:0;background:#f4f4f5;color:#18181b;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(100%,520px);box-sizing:border-box;background:#fff;border:1px solid #e4e4e7;border-radius:20px;padding:32px;box-shadow:0 16px 50px rgba(24,24,27,.08)}.mark{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:${success ? '#dcfce7' : '#f4f4f5'};color:${success ? '#15803d' : '#3f3f46'};font-size:22px;margin-bottom:22px}h1{font-size:25px;line-height:1.2;margin:0 0 16px}p{line-height:1.65;color:#52525b}strong{color:#18181b}button{width:100%;border:0;border-radius:12px;background:#18181b;color:#fff;font:inherit;font-weight:700;padding:14px 18px;cursor:pointer;margin-top:10px}button:hover{background:#27272a}.muted{font-size:13px;color:#71717a;margin-bottom:0}</style></head><body><main class="wrap"><section class="card"><div class="mark">${success ? '✓' : '·'}</div><h1>${safeTitle}</h1>${content}</section></main></body></html>`;
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);
}
