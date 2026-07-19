import { getDb } from '@/lib/db';
import { shopSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import {
  createHardenedRendererSmtpTransport,
  getEffectiveSmtp,
  isValidSmtpAddress,
  type SmtpConfig,
} from '@/lib/smtp';
import {
  escapeShopEmailHtml,
  sanitizeShopEmailHeaderValue,
} from '@/lib/shop-email-security';


type OrderData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { title: string; variantName?: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  paymentMethod: string;
  bankDetails?: { iban: string; bic: string; bankName: string; accountHolder: string } | null;
  shippingAddress?: { street: string; city: string; zip: string; country: string; company?: string } | null;
};

async function getSmtp(tenantId: string): Promise<SmtpConfig | null> {
  return getEffectiveSmtp(tenantId);
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function buildOrderHtml(order: OrderData, isCustomer: boolean) {
  const htmlOrderNumber = escapeShopEmailHtml(sanitizeShopEmailHeaderValue(order.orderNumber));
  const htmlCustomerName = escapeShopEmailHtml(order.customerName);
  const htmlCustomerEmail = escapeShopEmailHtml(order.customerEmail);
  const htmlPaymentMethod = escapeShopEmailHtml(order.paymentMethod || 'k.A.');
  const itemRows = order.items.map(i => {
    const title = escapeShopEmailHtml(i.title);
    const variant = i.variantName ? ` (${escapeShopEmailHtml(i.variantName)})` : '';
    return `<tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${i.quantity}× ${title}${variant}</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${formatPrice(i.priceCents * i.quantity)}</td></tr>`;
  }).join('');

  const address = order.shippingAddress
    ? `<p style="margin:8px 0;color:#374151">${escapeShopEmailHtml(order.shippingAddress.street)}<br>${escapeShopEmailHtml(order.shippingAddress.zip)} ${escapeShopEmailHtml(order.shippingAddress.city)}</p>`
    : '';

  const heading = isCustomer
    ? 'Vielen Dank für Ihre Bestellung!'
    : `Neue Bestellung: ${htmlOrderNumber}`;
  const bankDetails = isCustomer && order.paymentMethod === 'prepayment' && order.bankDetails
    ? `<div style="margin-top:18px;padding:16px;background:#f4f4f5;border-radius:10px"><h3 style="margin:0 0 8px;font-size:14px;color:#18181b">Zahlung per Vorkasse</h3><p style="margin:0;color:#52525b;font-size:13px;line-height:1.6">Empfänger: ${escapeShopEmailHtml(order.bankDetails.accountHolder)}<br>IBAN: ${escapeShopEmailHtml(order.bankDetails.iban)}<br>BIC: ${escapeShopEmailHtml(order.bankDetails.bic)}<br>Bank: ${escapeShopEmailHtml(order.bankDetails.bankName)}<br>Verwendungszweck: ${htmlOrderNumber}</p></div>`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#1a5276,#2e86c1);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${heading}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Bestellnummer: ${htmlOrderNumber}</p>
    </div>
    <div style="padding:24px 32px">
      ${isCustomer ? `<p style="margin:0 0 16px;color:#374151">Hallo ${htmlCustomerName},</p><p style="margin:0 0 16px;color:#6b7280;font-size:14px">Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten.</p>` : `<p style="margin:0 0 16px;color:#374151">Neue Bestellung von <strong>${htmlCustomerName}</strong> (${htmlCustomerEmail})</p>`}
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
      ${bankDetails}
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af">Zahlungsart: ${htmlPaymentMethod}</p>
    </div>
  </div>
</div></body></html>`;
}

export async function sendOrderEmails(tenantId: string, order: OrderData) {
  const smtp = await getSmtp(tenantId);
  if (!smtp) return; // No SMTP configured - skip silently

  const transporter = createHardenedRendererSmtpTransport(smtp);

  // Get notification email from shop settings
  const db = getDb();
  const [shop] = await db.select({ notificationEmail: shopSettings.notificationEmail, bankDetails: shopSettings.bankDetails })
    .from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);

  const configuredAdminEmail = shop?.notificationEmail?.trim() || '';
  const adminEmail = isValidSmtpAddress(configuredAdminEmail) ? configuredAdminEmail : smtp.from;
  if (configuredAdminEmail && adminEmail === smtp.from) {
    console.error('[Shop Email] Invalid notification email; falling back to SMTP sender');
  }
  const customerEmail = order.customerEmail.trim();
  const safeOrderNumber = sanitizeShopEmailHeaderValue(order.orderNumber);
  const safeCustomerName = sanitizeShopEmailHeaderValue(order.customerName);
  const customerOrder = order.paymentMethod === 'prepayment' ? { ...order, bankDetails: shop?.bankDetails || null } : order;

  // Send customer confirmation
  if (isValidSmtpAddress(customerEmail)) {
    try {
      await transporter.sendMail({
        from: smtp.from,
        to: customerEmail,
        subject: `Bestellbestätigung ${safeOrderNumber}`,
        html: buildOrderHtml(customerOrder, true),
      });
    } catch (e) {
      console.error('[Shop Email] Customer email failed:', e);
    }
  } else {
    console.error('[Shop Email] Customer email skipped: invalid recipient');
  }

  // Send admin notification
  try {
    await transporter.sendMail({
      from: smtp.from,
      to: adminEmail,
      subject: `Neue Bestellung: ${safeOrderNumber} - ${safeCustomerName}`,
      html: buildOrderHtml(order, false),
    });
  } catch (e) {
    console.error('[Shop Email] Admin email failed:', e);
  }
}
