import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, invoices } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) return new NextResponse('Not found', { status: 404 });

  const db = getDb();
  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));

  if (!order) return new NextResponse('Order not found', { status: 404 });

  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);

  // Check if invoice already exists for this order
  let [existingInvoice] = await db.select().from(invoices)
    .where(and(eq(invoices.orderId, orderId), eq(invoices.tenantId, tenantId), eq(invoices.type, 'invoice'))).limit(1);

  let invoiceNumber: string;

  if (existingInvoice) {
    invoiceNumber = existingInvoice.invoiceNumber;
  } else {
    // Generate sequential invoice number
    const prefix = settings?.invoicePrefix || 'RE';
    const nextNum = settings?.nextInvoiceNumber || 1;
    const year = new Date().getFullYear();
    const paddedNum = String(nextNum).padStart(4, '0');
    invoiceNumber = `${prefix}-${year}-${paddedNum}`;

    // Create invoice record
    await db.insert(invoices).values({
      tenantId,
      orderId,
      invoiceNumber,
      amountNetCents: order.subtotalCents - order.taxCents,
      taxCents: order.taxCents,
      amountGrossCents: order.totalCents,
    });

    // Increment invoice counter
    await db.update(shopSettings)
      .set({ nextInvoiceNumber: nextNum + 1 })
      .where(eq(shopSettings.tenantId, tenantId));
  }

  // Build PDF
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();

  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);

  let y = height - 50;

  // Header
  page.drawText('RECHNUNG', { x: 50, y, font: fontBold, size: 24, color: black });
  y -= 30;
  page.drawText(`Rechnungsnummer: ${invoiceNumber}`, { x: 50, y, font, size: 10, color: gray });
  y -= 15;
  page.drawText(`Bestellnummer: ${order.orderNumber}`, { x: 50, y, font, size: 10, color: gray });
  y -= 15;
  page.drawText(`Datum: ${new Date(order.createdAt).toLocaleDateString('de-DE')}`, { x: 50, y, font, size: 10, color: gray });
  y -= 40;

  // Customer
  page.drawText('Rechnungsadresse:', { x: 50, y, font: fontBold, size: 10, color: black });
  y -= 15;
  page.drawText(order.customerName, { x: 50, y, font, size: 10, color: black });
  y -= 13;
  if (order.billingAddress || order.shippingAddress) {
    const addr = (order.billingAddress || order.shippingAddress) as { street: string; city: string; zip: string; country: string; company?: string };
    if (addr.company) { page.drawText(addr.company, { x: 50, y, font, size: 10, color: black }); y -= 13; }
    page.drawText(addr.street, { x: 50, y, font, size: 10, color: black }); y -= 13;
    page.drawText(`${addr.zip} ${addr.city}`, { x: 50, y, font, size: 10, color: black }); y -= 13;
  }
  page.drawText(order.customerEmail, { x: 50, y, font, size: 10, color: gray });
  y -= 40;

  // Table header
  const colX = { pos: 50, qty: 280, price: 360, total: 460 };
  page.drawText('Artikel', { x: colX.pos, y, font: fontBold, size: 9, color: black });
  page.drawText('Menge', { x: colX.qty, y, font: fontBold, size: 9, color: black });
  page.drawText('Einzelpreis', { x: colX.price, y, font: fontBold, size: 9, color: black });
  page.drawText('Gesamt', { x: colX.total, y, font: fontBold, size: 9, color: black });
  y -= 5;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: gray });
  y -= 15;

  // Items
  const items = order.items as { title: string; variantName?: string; quantity: number; priceCents: number }[];
  for (const item of items) {
    const title = item.variantName ? `${item.title} (${item.variantName})` : item.title;
    page.drawText(title.slice(0, 40), { x: colX.pos, y, font, size: 9, color: black });
    page.drawText(String(item.quantity), { x: colX.qty, y, font, size: 9, color: black });
    page.drawText(fmtPrice(item.priceCents), { x: colX.price, y, font, size: 9, color: black });
    page.drawText(fmtPrice(item.priceCents * item.quantity), { x: colX.total, y, font, size: 9, color: black });
    y -= 18;
  }

  // Totals
  y -= 10;
  page.drawLine({ start: { x: 350, y: y + 8 }, end: { x: 545, y: y + 8 }, thickness: 0.5, color: gray });
  page.drawText('Zwischensumme:', { x: 350, y, font, size: 9, color: black });
  page.drawText(fmtPrice(order.subtotalCents), { x: 460, y, font, size: 9, color: black });
  y -= 15;

  if (order.shippingCents > 0) {
    page.drawText('Versand:', { x: 350, y, font, size: 9, color: black });
    page.drawText(fmtPrice(order.shippingCents), { x: 460, y, font, size: 9, color: black });
    y -= 15;
  }

  if (order.discountCents > 0) {
    page.drawText('Rabatt:', { x: 350, y, font, size: 9, color: black });
    page.drawText(`-${fmtPrice(order.discountCents)}`, { x: 460, y, font, size: 9, color: black });
    y -= 15;
  }

  // Tax line
  const taxCents = order.taxCents;
  page.drawText('davon MwSt. 19%:', { x: 350, y, font, size: 9, color: gray });
  page.drawText(fmtPrice(taxCents), { x: 460, y, font, size: 9, color: gray });
  y -= 18;

  page.drawText('Gesamtbetrag:', { x: 350, y, font: fontBold, size: 11, color: black });
  page.drawText(fmtPrice(order.totalCents), { x: 460, y, font: fontBold, size: 11, color: black });
  y -= 30;

  // Payment info
  page.drawText(`Zahlungsart: ${order.paymentMethod || 'Vorkasse'}`, { x: 50, y, font, size: 9, color: gray });
  y -= 30;

  // Footer
  page.drawText('Vielen Dank für Ihren Einkauf!', { x: 50, y, font, size: 9, color: gray });

  const pdfBytes = await doc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Rechnung-${invoiceNumber}.pdf"`,
    },
  });
}

function fmtPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}
