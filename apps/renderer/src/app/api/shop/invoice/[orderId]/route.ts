import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, invoices, globalSettings } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { getWritableSession } from '@/lib/session';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const session = await getWritableSession();
  if (!session) return new NextResponse('Not found', { status: 404 });
  const tenantId = session.tenantId;

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

  // Fetch brand for logo and colors
  const [gs] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  const brand = (gs?.brand as { logoUrl?: string; primaryColor?: string } | null) || {};
  const logoUrl = brand.logoUrl || null;
  const primaryColor = brand.primaryColor || null;

  // Parse hex color to rgb
  function hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    return rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
  }

  // Build PDF
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.85, 0.85, 0.85);
  const accentColor = primaryColor ? hexToRgb(primaryColor) : rgb(0.1, 0.1, 0.1);

  let y = height - 50;
  const marginLeft = 50;
  const marginRight = 545;

  // ─── Logo (top left) ───────────────────────────────
  let logoOffset = 0;
  if (logoUrl) {
    try {
      const parsedLogoUrl = new URL(logoUrl);
      const allowedLogoHost = parsedLogoUrl.protocol === 'https:'
        && (parsedLogoUrl.hostname.endsWith('.public.blob.vercel-storage.com')
          || parsedLogoUrl.hostname.endsWith('.blob.vercel-storage.com'));
      if (!allowedLogoHost) throw new Error('Untrusted invoice logo host');
      const logoRes = await fetch(parsedLogoUrl, { signal: AbortSignal.timeout(5_000) });
      if (!logoRes.ok) throw new Error('Invoice logo fetch failed');
      const declaredLength = Number(logoRes.headers.get('content-length') || 0);
      if (declaredLength > 2 * 1024 * 1024) throw new Error('Invoice logo too large');
      const logoBytes = new Uint8Array(await logoRes.arrayBuffer());
      if (logoBytes.byteLength > 2 * 1024 * 1024) throw new Error('Invoice logo too large');
      const contentType = logoRes.headers.get('content-type') || '';
      let logoImage;
      if (contentType.includes('png') || logoUrl.endsWith('.png')) {
        logoImage = await doc.embedPng(logoBytes);
      } else {
        logoImage = await doc.embedJpg(logoBytes);
      }
      const logoDims = logoImage.scale(Math.min(120 / logoImage.width, 40 / logoImage.height));
      page.drawImage(logoImage, { x: marginLeft, y: height - 45 - logoDims.height / 2 + 15, width: logoDims.width, height: logoDims.height });
      logoOffset = logoDims.width + 15;
    } catch { /* logo fetch failed, skip */ }
  }

  // ─── Seller info (top right) ───────────────────────
  const company = (settings as any)?.companyInfo as { name: string; street: string; zip: string; city: string; country: string; email?: string; phone?: string; taxId?: string; vatId?: string; registerCourt?: string; registerNumber?: string; ceo?: string } | null;

  if (company?.name) {
    let sy = height - 50;
    const drawRight = (text: string, f = font, s = 9) => {
      const tw = f.widthOfTextAtSize(text, s);
      page.drawText(text, { x: marginRight - tw, y: sy, font: f, size: s, color: black });
      sy -= 13;
    };
    drawRight(company.name, fontBold, 10);
    drawRight(company.street);
    drawRight(`${company.zip} ${company.city}`);
    if (company.phone) drawRight(`Tel: ${company.phone}`);
    if (company.email) drawRight(company.email);
  }

  // ─── Title ─────────────────────────────────────────
  page.drawText('RECHNUNG', { x: marginLeft, y, font: fontBold, size: 22, color: accentColor });
  y -= 35;

  // Accent line
  page.drawRectangle({ x: marginLeft, y: y + 8, width: 60, height: 3, color: accentColor });
  y -= 10;

  // Meta info
  const metaLines = [
    ['Rechnungsnr.:', invoiceNumber],
    ['Bestellnr.:', order.orderNumber],
    ['Rechnungsdatum:', new Date(order.createdAt).toLocaleDateString('de-DE')],
    ['Zahlungsart:', order.paymentMethod === 'prepayment' ? 'Vorkasse' : order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod === 'stripe' ? 'Kreditkarte' : order.paymentMethod === 'pickup' ? 'Abholung' : order.paymentMethod || 'Vorkasse'],
  ];
  for (const [label, value] of metaLines) {
    page.drawText(label, { x: marginLeft, y, font: fontBold, size: 9, color: gray });
    page.drawText(value, { x: marginLeft + 95, y, font, size: 9, color: black });
    y -= 14;
  }
  y -= 20;

  // ─── Sender line (small, above customer address) ───
  if (company?.name) {
    page.drawText(`${company.name} · ${company.street} · ${company.zip} ${company.city}`, { x: marginLeft, y, font, size: 7, color: gray });
    y -= 5;
    page.drawLine({ start: { x: marginLeft, y }, end: { x: 280, y }, thickness: 0.3, color: lightGray });
    y -= 12;
  }

  // ─── Customer address ──────────────────────────────
  page.drawText('Rechnungsempfänger', { x: marginLeft, y, font: fontBold, size: 8, color: gray });
  y -= 14;
  page.drawText(order.customerName, { x: marginLeft, y, font: fontBold, size: 10, color: black });
  y -= 14;
  if (order.billingAddress || order.shippingAddress) {
    const addr = (order.billingAddress || order.shippingAddress) as { street: string; city: string; zip: string; country: string; company?: string };
    if (addr.company) { page.drawText(addr.company, { x: marginLeft, y, font, size: 9, color: black }); y -= 13; }
    page.drawText(addr.street, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
    page.drawText(`${addr.zip} ${addr.city}`, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
  }
  page.drawText(order.customerEmail, { x: marginLeft, y, font, size: 9, color: gray });
  y -= 35;

  // ─── Items table ───────────────────────────────────
  const colX = { pos: marginLeft, qty: 310, price: 390, total: 480 };

  // Table header background
  page.drawRectangle({ x: marginLeft - 5, y: y - 4, width: marginRight - marginLeft + 10, height: 18, color: rgb(0.95, 0.95, 0.95) });
  page.drawText('Artikel', { x: colX.pos, y, font: fontBold, size: 8, color: gray });
  page.drawText('Menge', { x: colX.qty, y, font: fontBold, size: 8, color: gray });
  page.drawText('Einzelpreis', { x: colX.price, y, font: fontBold, size: 8, color: gray });
  page.drawText('Gesamt', { x: colX.total, y, font: fontBold, size: 8, color: gray });
  y -= 20;

  // Items
  const items = order.items as { title: string; variantName?: string; quantity: number; priceCents: number }[];
  for (const item of items) {
    const title = item.variantName ? `${item.title} (${item.variantName})` : item.title;
    page.drawText(title.slice(0, 45), { x: colX.pos, y, font, size: 9, color: black });
    page.drawText(String(item.quantity), { x: colX.qty, y, font, size: 9, color: black });
    page.drawText(fmtPrice(item.priceCents), { x: colX.price, y, font, size: 9, color: black });
    page.drawText(fmtPrice(item.priceCents * item.quantity), { x: colX.total, y, font, size: 9, color: black });
    y -= 18;
    // Light separator between items
    page.drawLine({ start: { x: marginLeft, y: y + 6 }, end: { x: marginRight, y: y + 6 }, thickness: 0.3, color: lightGray });
  }

  // ─── Totals ────────────────────────────────────────
  y -= 10;
  const totalsX = 380;
  const totalsValX = 480;

  page.drawText('Zwischensumme', { x: totalsX, y, font, size: 9, color: gray });
  page.drawText(fmtPrice(order.subtotalCents), { x: totalsValX, y, font, size: 9, color: black });
  y -= 15;

  if (order.shippingCents > 0) {
    page.drawText('Versand', { x: totalsX, y, font, size: 9, color: gray });
    page.drawText(fmtPrice(order.shippingCents), { x: totalsValX, y, font, size: 9, color: black });
    y -= 15;
  }

  if (order.discountCents > 0) {
    page.drawText('Rabatt', { x: totalsX, y, font, size: 9, color: gray });
    page.drawText(`-${fmtPrice(order.discountCents)}`, { x: totalsValX, y, font, size: 9, color: black });
    y -= 15;
  }

  const taxCents = order.taxCents;
  // Determine tax label from order items
    const taxRates = [...new Set((order.items as any[]).map((i: any) => i.taxRate || 19))];
    const taxLabel = taxRates.length === 1 ? `inkl. ${taxRates[0]}% MwSt.` : 'inkl. MwSt. (gemischt)';
    page.drawText(taxLabel, { x: totalsX, y, font, size: 8, color: gray });
  page.drawText(fmtPrice(taxCents), { x: totalsValX, y, font, size: 8, color: gray });
  y -= 18;

  // Total line
  page.drawLine({ start: { x: totalsX - 5, y: y + 14 }, end: { x: marginRight, y: y + 14 }, thickness: 1, color: accentColor });
  y -= 2;
  page.drawText('Gesamtbetrag', { x: totalsX, y, font: fontBold, size: 11, color: black });
  page.drawText(fmtPrice(order.totalCents), { x: totalsValX, y, font: fontBold, size: 11, color: black });
  y -= 35;

  // ─── Bank details (for Vorkasse) ───────────────────
  if (order.paymentMethod === 'prepayment' && settings?.bankDetails) {
    const bd = settings.bankDetails as { iban: string; bic: string; bankName: string; accountHolder: string };
    page.drawText('Bankverbindung', { x: marginLeft, y, font: fontBold, size: 9, color: black });
    y -= 14;
    page.drawText(`Kontoinhaber: ${bd.accountHolder}`, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
    page.drawText(`IBAN: ${bd.iban}`, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
    page.drawText(`BIC: ${bd.bic}`, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
    page.drawText(`Bank: ${bd.bankName}`, { x: marginLeft, y, font, size: 9, color: black }); y -= 13;
    page.drawText(`Verwendungszweck: ${order.orderNumber}`, { x: marginLeft, y, font: fontBold, size: 9, color: black }); y -= 25;
  }

  // ─── Footer ────────────────────────────────────────
  const footerY = 50;
  page.drawLine({ start: { x: marginLeft, y: footerY + 15 }, end: { x: marginRight, y: footerY + 15 }, thickness: 0.5, color: lightGray });

  // Footer columns with company legal info
  const footerParts: string[] = [];
  if (company?.name) footerParts.push(company.name);
  if (company?.ceo) footerParts.push(`GF: ${company.ceo}`);
  if (company?.taxId) footerParts.push(`St.-Nr.: ${company.taxId}`);
  if (company?.vatId) footerParts.push(`USt-IdNr.: ${company.vatId}`);
  if (company?.registerCourt && company?.registerNumber) footerParts.push(`${company.registerCourt} ${company.registerNumber}`);

  const footerText = footerParts.join(' · ');
  page.drawText(footerText.slice(0, 100), { x: marginLeft, y: footerY, font, size: 7, color: gray });
  if (footerText.length > 100) {
    page.drawText(footerText.slice(100), { x: marginLeft, y: footerY - 10, font, size: 7, color: gray });
  }

  const pdfBytes = await doc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Rechnung-${invoiceNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

function fmtPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}
