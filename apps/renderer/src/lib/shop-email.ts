import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';
import { shopSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getEffectiveSmtp, type SmtpConfig } from '@/lib/smtp';


type OrderData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { title: string; variantName?: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  paymentMethod: string;
  shippingAddress?: { street: string; city: string; zip: string; country: string; company?: string } | null;
};

async function getSmtp(tenantId: string): Promise<SmtpConfig | null> {
  return getEffectiveSmtp(tenantId);
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function buildOrderHtml(order: OrderData, isCustomer: boolean) {
  const itemRows = order.items.map(i =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${i.quantity}× ${i.title}${i.variantName ? ` (${i.variantName})` : ''}</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${formatPrice(i.priceCents * i.quantity)}</td></tr>`
  ).join('');

  const address = order.shippingAddress
    ? `<p style="margin:8px 0;color:#374151">${order.shippingAddress.street}<br>${order.shippingAddress.zip} ${order.shippingAddress.city}</p>`
    : '';

  const heading = isCustomer
    ? 'Vielen Dank für Ihre Bestellung!'
    : `Neue Bestellung: ${order.orderNumber}`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${heading}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Bestellnummer: ${order.orderNumber}</p>
    </div>
    <div style="padding:24px 32px">
      ${isCustomer ? `<p style="margin:0 0 16px;color:#374151">Hallo ${order.customerName},</p><p style="margin:0 0 16px;color:#6b7280;font-size:14px">Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten.</p>` : `<p style="margin:0 0 16px;color:#374151">Neue Bestellung von <strong>${order.customerName}</strong> (${order.customerEmail})</p>`}
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb">Artikel</th><th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb">Preis</th></tr></thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr><td style="padding:8px 12px;font-weight:600">Zwischensumme</td><td style="padding:8px 12px;text-align:right">${formatPrice(order.subtotalCents)}</td></tr>
          ${order.shippingCents > 0 ? `<tr><td style="padding:8px 12px">Versand</td><td style="padding:8px 12px;text-align:right">${formatPrice(order.shippingCents)}</td></tr>` : ''}
          <tr><td style="padding:8px 12px;font-weight:700;font-size:16px">Gesamt</td><td style="padding:8px 12px;text-align:right;font-weight:700;font-size:16px">${formatPrice(order.totalCents)}</td></tr>
        </tfoot>
      </table>
      ${address ? `<div style="margin-top:16px"><h3 style="margin:0 0 4px;font-size:14px;color:#6b7280">Lieferadresse</h3>${address}</div>` : ''}
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af">Zahlungsart: ${order.paymentMethod || 'k.A.'}</p>
    </div>
  </div>
</div></body></html>`;
}

export async function sendOrderEmails(tenantId: string, order: OrderData) {
  const smtp = await getSmtp(tenantId);
  if (!smtp) return; // No SMTP configured - skip silently

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  // Get notification email from shop settings
  const db = getDb();
  const [shop] = await db.select({ notificationEmail: shopSettings.notificationEmail })
    .from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);

  const adminEmail = shop?.notificationEmail || smtp.from;

  // Send customer confirmation
  try {
    await transporter.sendMail({
      from: smtp.from,
      to: order.customerEmail,
      subject: `Bestellbestätigung ${order.orderNumber}`,
      html: buildOrderHtml(order, true),
    });
  } catch (e) {
    console.error('[Shop Email] Customer email failed:', e);
  }

  // Send admin notification
  try {
    await transporter.sendMail({
      from: smtp.from,
      to: adminEmail,
      subject: `Neue Bestellung: ${order.orderNumber} - ${order.customerName}`,
      html: buildOrderHtml(order, false),
    });
  } catch (e) {
    console.error('[Shop Email] Admin email failed:', e);
  }
}
