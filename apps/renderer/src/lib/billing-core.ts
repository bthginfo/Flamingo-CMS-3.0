import { createHash } from 'node:crypto';
import type { Invoice } from '@e-invoice-eu/core';
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib';
export { BILLING_ADDON_KEY } from './billing-constants';

export type BillingAddress = {
  street: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  countryCode: string;
};

export type BillingSellerSnapshot = BillingAddress & {
  companyName: string;
  legalForm?: string;
  email: string;
  phone?: string;
  website?: string;
  taxNumber?: string;
  vatId?: string;
  registerCourt?: string;
  registerNumber?: string;
  managingDirector?: string;
  logoUrl?: string;
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  bic?: string;
  footer?: string;
  smallBusiness: boolean;
  smallBusinessNotice?: string;
};

export type BillingCustomerSnapshot = BillingAddress & {
  customerNumber?: string;
  customerType: 'company' | 'person';
  displayName: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  vatId?: string;
  eInvoiceRoutingId?: string;
  buyerReference?: string;
};

export type BillingLine = {
  id?: string;
  position: number;
  name: string;
  description?: string;
  quantity: number;
  unitCode: string;
  unitLabel: string;
  unitPriceNetCents: number;
  discountBasisPoints: number;
  taxRateBasisPoints: number;
  lineNetCents?: number;
};

export type BillingDocumentSnapshot = {
  id?: string;
  documentNumber: string;
  documentType: 'invoice' | 'cancellation';
  issueDate: Date;
  serviceDateFrom: Date;
  serviceDateTo?: Date;
  dueDate: Date;
  currency: 'EUR';
  buyerReference?: string;
  purchaseOrderReference?: string;
  introText?: string;
  closingText?: string;
  notes?: string;
  originalDocumentNumber?: string;
};

export type BillingTaxBreakdown = { rateBasisPoints: number; netCents: number; taxCents: number };

export function calculateBillingLineNetCents(line: Pick<BillingLine, 'quantity' | 'unitPriceNetCents' | 'discountBasisPoints'>) {
  const beforeDiscount = line.quantity * line.unitPriceNetCents;
  return Math.round(beforeDiscount * (1 - line.discountBasisPoints / 10_000));
}

export function calculateBillingTotals(lines: BillingLine[], smallBusiness = false) {
  const taxGroups = new Map<number, { netCents: number; taxCents: number }>();
  const normalizedLines = lines.map(line => {
    const lineNetCents = calculateBillingLineNetCents(line);
    const rate = smallBusiness ? 0 : line.taxRateBasisPoints;
    const group = taxGroups.get(rate) || { netCents: 0, taxCents: 0 };
    group.netCents += lineNetCents;
    taxGroups.set(rate, group);
    return { ...line, taxRateBasisPoints: rate, lineNetCents };
  });
  const taxBreakdown = [...taxGroups].sort(([a], [b]) => a - b).map(([rateBasisPoints, group]) => ({
    rateBasisPoints,
    netCents: group.netCents,
    taxCents: Math.round(group.netCents * rateBasisPoints / 10_000),
  }));
  const subtotalNetCents = normalizedLines.reduce((sum, line) => sum + line.lineNetCents, 0);
  const taxCents = taxBreakdown.reduce((sum, group) => sum + group.taxCents, 0);
  return { normalizedLines, taxBreakdown, subtotalNetCents, taxCents, totalGrossCents: subtotalNetCents + taxCents };
}

export function sequencePeriod(date: Date, reset: 'never' | 'year' | 'month') {
  if (reset === 'never') return 'all';
  const year = String(date.getUTCFullYear());
  return reset === 'year' ? year : `${year}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function validateNumberFormat(format: string) {
  if (format.length < 3 || format.length > 120) return 'Das Format muss zwischen 3 und 120 Zeichen lang sein.';
  const withoutKnownTokens = format.replace(/\{PREFIX\}|\{YYYY\}|\{YY\}|\{MM\}|\{N+\}/g, '');
  if (/[{}]/.test(withoutKnownTokens)) return 'Ein Platzhalter ist unbekannt oder unvollständig.';
  if (!/\{N+\}/.test(format)) return 'Das Format braucht einen Zähler wie {NNNN}.';
  const unknown = [...format.matchAll(/\{([^}]+)\}/g)].map(match => match[1]).filter(token => !['PREFIX', 'YYYY', 'YY', 'MM'].includes(token) && !/^N+$/.test(token));
  if (unknown.length) return `Unbekannter Platzhalter: {${unknown[0]}}`;
  if (/[/\\:*?"<>|]/.test(format.replaceAll('/', ''))) return 'Das Format enthält ein nicht erlaubtes Zeichen.';
  return null;
}

export function formatDocumentNumber(format: string, prefix: string, number: number, date: Date) {
  const error = validateNumberFormat(format);
  if (error) throw new Error(error);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return format
    .replaceAll('{PREFIX}', prefix)
    .replaceAll('{YYYY}', year)
    .replaceAll('{YY}', year.slice(-2))
    .replaceAll('{MM}', month)
    .replace(/\{(N+)\}/g, (_, digits: string) => String(number).padStart(digits.length, '0'));
}

export function sha256(value: string | Uint8Array) {
  return createHash('sha256').update(value).digest('hex');
}

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function amount(cents: number) {
  return (cents / 100).toFixed(2);
}

export async function generateXRechnung(input: {
  document: BillingDocumentSnapshot;
  seller: BillingSellerSnapshot;
  customer: BillingCustomerSnapshot;
  lines: BillingLine[];
  totals: ReturnType<typeof calculateBillingTotals>;
}) {
  const { document, seller, customer, totals } = input;
  const currency = 'EUR' as const;
  const customerEndpoint = customer.eInvoiceRoutingId || customer.email;
  const customerScheme = customer.eInvoiceRoutingId ? '0204' : 'EM';
  const sellerTaxes = [
    seller.vatId ? { 'cbc:CompanyID': seller.vatId, 'cac:TaxScheme': { 'cbc:ID': 'VAT' } } : null,
    seller.taxNumber ? { 'cbc:CompanyID': seller.taxNumber, 'cac:TaxScheme': { 'cbc:ID': 'FC' } } : null,
  ].filter(Boolean);
  const invoice: Invoice = {
    'ubl:Invoice': {
      'cbc:ID': document.documentNumber,
      'cbc:IssueDate': isoDate(document.issueDate),
      'cbc:DueDate': isoDate(document.dueDate),
      'cbc:InvoiceTypeCode': document.documentType === 'cancellation' ? '381' : '380',
      'cbc:Note': [document.notes, seller.smallBusiness ? seller.smallBusinessNotice : undefined].filter(Boolean) as string[],
      'cbc:DocumentCurrencyCode': currency,
      'cbc:BuyerReference': document.buyerReference || customer.buyerReference || customer.customerNumber || 'Direktauftrag',
      'cac:InvoicePeriod': {
        'cbc:StartDate': isoDate(document.serviceDateFrom),
        'cbc:EndDate': isoDate(document.serviceDateTo || document.serviceDateFrom),
      },
      ...(document.purchaseOrderReference ? { 'cac:OrderReference': { 'cbc:ID': document.purchaseOrderReference } } : {}),
      ...(document.originalDocumentNumber ? { 'cac:BillingReference': [{ 'cac:InvoiceDocumentReference': { 'cbc:ID': document.originalDocumentNumber } }] } : {}),
      'cac:AccountingSupplierParty': {
        'cac:Party': {
          'cbc:EndpointID': seller.email,
          'cbc:EndpointID@schemeID': 'EM',
          'cac:PartyName': { 'cbc:Name': seller.companyName },
          'cac:PostalAddress': {
            'cbc:StreetName': seller.street,
            ...(seller.addressLine2 ? { 'cbc:AdditionalStreetName': seller.addressLine2 } : {}),
            'cbc:CityName': seller.city,
            'cbc:PostalZone': seller.postalCode,
            'cac:Country': { 'cbc:IdentificationCode': seller.countryCode as 'DE' },
          },
          ...(sellerTaxes.length ? { 'cac:PartyTaxScheme': sellerTaxes as never } : {}),
          'cac:PartyLegalEntity': {
            'cbc:RegistrationName': seller.companyName,
            ...(seller.registerNumber ? { 'cbc:CompanyID': seller.registerNumber } : {}),
            ...(seller.legalForm ? { 'cbc:CompanyLegalForm': seller.legalForm } : {}),
          },
          'cac:Contact': { 'cbc:Name': seller.companyName, 'cbc:ElectronicMail': seller.email, ...(seller.phone ? { 'cbc:Telephone': seller.phone } : {}) },
        },
      },
      'cac:AccountingCustomerParty': {
        'cac:Party': {
          'cbc:EndpointID': customerEndpoint,
          'cbc:EndpointID@schemeID': customerScheme as never,
          'cac:PartyName': { 'cbc:Name': customer.displayName },
          'cac:PostalAddress': {
            'cbc:StreetName': customer.street,
            ...(customer.addressLine2 ? { 'cbc:AdditionalStreetName': customer.addressLine2 } : {}),
            'cbc:CityName': customer.city,
            'cbc:PostalZone': customer.postalCode,
            'cac:Country': { 'cbc:IdentificationCode': customer.countryCode as 'DE' },
          },
          ...(customer.vatId ? { 'cac:PartyTaxScheme': { 'cbc:CompanyID': customer.vatId, 'cac:TaxScheme': { 'cbc:ID': 'VAT' } } } : {}),
          'cac:PartyLegalEntity': { 'cbc:RegistrationName': customer.displayName },
          'cac:Contact': { 'cbc:Name': customer.displayName, 'cbc:ElectronicMail': customer.email, ...(customer.phone ? { 'cbc:Telephone': customer.phone } : {}) },
        },
      },
      ...(seller.iban ? {
        'cac:PaymentMeans': [{
          'cbc:PaymentMeansCode': '58',
          'cbc:PaymentID': document.documentNumber,
          'cac:PayeeFinancialAccount': {
            'cbc:ID': seller.iban.replace(/\s/g, ''),
            ...(seller.accountHolder ? { 'cbc:Name': seller.accountHolder } : {}),
            ...(seller.bic ? { 'cac:FinancialInstitutionBranch': { 'cbc:ID': seller.bic.replace(/\s/g, '') } } : {}),
          },
        }],
      } : {}),
      'cac:PaymentTerms': { 'cbc:Note': `Zahlbar bis ${new Intl.DateTimeFormat('de-DE').format(document.dueDate)} ohne Abzug.` },
      'cac:TaxTotal': [{
        'cbc:TaxAmount': amount(totals.taxCents),
        'cbc:TaxAmount@currencyID': currency,
        'cac:TaxSubtotal': totals.taxBreakdown.map(group => ({
          'cbc:TaxableAmount': amount(group.netCents),
          'cbc:TaxableAmount@currencyID': currency,
          'cbc:TaxAmount': amount(group.taxCents),
          'cbc:TaxAmount@currencyID': currency,
          'cac:TaxCategory': {
            'cbc:ID': seller.smallBusiness ? 'E' : 'S',
            'cbc:Percent': String(group.rateBasisPoints / 100),
            ...(seller.smallBusiness ? { 'cbc:TaxExemptionReason': seller.smallBusinessNotice || 'Steuerbefreiung nach § 19 UStG' } : {}),
            'cac:TaxScheme': { 'cbc:ID': 'VAT' },
          },
        })),
      }],
      'cac:LegalMonetaryTotal': {
        'cbc:LineExtensionAmount': amount(totals.subtotalNetCents),
        'cbc:LineExtensionAmount@currencyID': currency,
        'cbc:TaxExclusiveAmount': amount(totals.subtotalNetCents),
        'cbc:TaxExclusiveAmount@currencyID': currency,
        'cbc:TaxInclusiveAmount': amount(totals.totalGrossCents),
        'cbc:TaxInclusiveAmount@currencyID': currency,
        'cbc:PayableAmount': amount(totals.totalGrossCents),
        'cbc:PayableAmount@currencyID': currency,
      },
      'cac:InvoiceLine': totals.normalizedLines.map((line, index) => ({
        'cbc:ID': String(index + 1),
        ...(line.description ? { 'cbc:Note': line.description } : {}),
        'cbc:InvoicedQuantity': String(line.quantity),
        'cbc:InvoicedQuantity@unitCode': line.unitCode as never,
        'cbc:LineExtensionAmount': amount(line.lineNetCents),
        'cbc:LineExtensionAmount@currencyID': currency,
        'cac:Item': {
          ...(line.description ? { 'cbc:Description': line.description } : {}),
          'cbc:Name': line.name,
          'cac:ClassifiedTaxCategory': {
            'cbc:ID': seller.smallBusiness ? 'E' : 'S',
            'cbc:Percent': String(line.taxRateBasisPoints / 100),
            'cac:TaxScheme': { 'cbc:ID': 'VAT' },
          },
        },
        'cac:Price': { 'cbc:PriceAmount': amount(line.unitPriceNetCents), 'cbc:PriceAmount@currencyID': currency },
      })) as unknown as Invoice['ubl:Invoice']['cac:InvoiceLine'],
    },
  };
  // Keep the comparatively large e-invoice implementation out of normal admin
  // reads and PDF previews; it is loaded only for finalization/export.
  const { InvoiceService } = await import('@e-invoice-eu/core');
  const service = new InvoiceService(console);
  const generated = await service.generate(invoice, { format: 'XRECHNUNG-UBL', lang: 'de-de', noWarnings: true });
  return typeof generated === 'string' ? generated : new TextDecoder().decode(generated);
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE').format(date);
}

function wrap(font: PDFFont, text: string, size: number, maxWidth: number) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) current = candidate;
    else { if (current) lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines;
}

async function embedLogo(doc: PDFDocument, url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !(parsed.hostname.endsWith('.public.blob.vercel-storage.com') || parsed.hostname.endsWith('.blob.vercel-storage.com'))) return null;
    const response = await fetch(parsed, { signal: AbortSignal.timeout(5_000), cache: 'no-store' });
    if (!response.ok || Number(response.headers.get('content-length') || 0) > 2_000_000) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > 2_000_000) return null;
    const mime = response.headers.get('content-type') || '';
    return mime.includes('png') ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  } catch { return null; }
}

export async function renderBillingPdf(input: {
  document: BillingDocumentSnapshot;
  seller: BillingSellerSnapshot;
  customer: BillingCustomerSnapshot;
  lines: BillingLine[];
  totals: ReturnType<typeof calculateBillingTotals>;
}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${input.document.documentType === 'cancellation' ? 'Stornorechnung' : 'Rechnung'} ${input.document.documentNumber}`);
  pdf.setAuthor(input.seller.companyName);
  pdf.setCreationDate(input.document.issueDate);
  pdf.setModificationDate(input.document.issueDate);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await embedLogo(pdf, input.seller.logoUrl);
  const ink = rgb(0.055, 0.075, 0.13);
  const muted = rgb(0.38, 0.42, 0.5);
  const accent = rgb(0.12, 0.31, 0.92);
  const pale = rgb(0.95, 0.96, 0.98);
  const margin = 48;
  let page: PDFPage;
  let y: number;
  const newPage = () => {
    page = pdf.addPage([595.28, 841.89]);
    y = 794;
    page.drawText(input.seller.companyName, { x: margin, y: 28, font: regular, size: 7, color: muted });
    page.drawText(input.document.documentNumber, { x: 452, y: 28, font: regular, size: 7, color: muted });
  };
  newPage();
  if (logo) {
    const scale = Math.min(130 / logo.width, 48 / logo.height);
    page!.drawImage(logo, { x: margin, y: 748, width: logo.width * scale, height: logo.height * scale });
  } else page!.drawText(input.seller.companyName, { x: margin, y: 770, font: bold, size: 17, color: ink });
  page!.drawText(input.document.documentType === 'cancellation' ? 'STORNORECHNUNG' : 'RECHNUNG', { x: 360, y: 770, font: bold, size: 19, color: ink });
  page!.drawText(input.document.documentNumber, { x: 360, y: 750, font: regular, size: 10, color: accent });
  page!.drawLine({ start: { x: margin, y: 722 }, end: { x: 547, y: 722 }, thickness: 1, color: pale });

  y = 690;
  const sender = `${input.seller.companyName} · ${input.seller.street} · ${input.seller.postalCode} ${input.seller.city}`;
  page!.drawText(sender.slice(0, 90), { x: margin, y, font: regular, size: 7, color: muted });
  y -= 24;
  page!.drawText(input.customer.displayName, { x: margin, y, font: bold, size: 11, color: ink }); y -= 15;
  page!.drawText(input.customer.street, { x: margin, y, font: regular, size: 10, color: ink }); y -= 14;
  page!.drawText(`${input.customer.postalCode} ${input.customer.city}`, { x: margin, y, font: regular, size: 10, color: ink });

  const metaX = 358;
  let metaY = 690;
  const meta = [
    ['Rechnungsdatum', formatDate(input.document.issueDate)],
    ['Leistungsdatum', input.document.serviceDateTo ? `${formatDate(input.document.serviceDateFrom)} – ${formatDate(input.document.serviceDateTo)}` : formatDate(input.document.serviceDateFrom)],
    ['Fällig am', formatDate(input.document.dueDate)],
    ['Kundennummer', input.customer.customerNumber || '—'],
  ];
  for (const [label, value] of meta) {
    page!.drawText(label, { x: metaX, y: metaY, font: regular, size: 8, color: muted });
    page!.drawText(value, { x: metaX + 78, y: metaY, font: bold, size: 8, color: ink });
    metaY -= 17;
  }
  y = 565;
  if (input.document.introText) {
    for (const line of wrap(regular, input.document.introText, 9, 499)) { page!.drawText(line, { x: margin, y, font: regular, size: 9, color: ink }); y -= 13; }
    y -= 12;
  }

  const drawTableHeader = () => {
    page!.drawRectangle({ x: margin, y: y - 5, width: 499, height: 24, color: pale });
    page!.drawText('Pos.', { x: 56, y: y + 3, font: bold, size: 8, color: muted });
    page!.drawText('Leistung', { x: 92, y: y + 3, font: bold, size: 8, color: muted });
    page!.drawText('Menge', { x: 340, y: y + 3, font: bold, size: 8, color: muted });
    page!.drawText('Einzel', { x: 400, y: y + 3, font: bold, size: 8, color: muted });
    page!.drawText('Gesamt', { x: 486, y: y + 3, font: bold, size: 8, color: muted });
    y -= 25;
  };
  drawTableHeader();
  for (const line of input.totals.normalizedLines) {
    const descriptions = line.description ? wrap(regular, line.description, 7.5, 225).slice(0, 2) : [];
    const rowHeight = Math.max(30, 20 + descriptions.length * 10);
    if (y - rowHeight < 155) { newPage(); y = 770; drawTableHeader(); }
    page!.drawText(String(line.position), { x: 58, y, font: regular, size: 8.5, color: ink });
    page!.drawText(line.name.slice(0, 46), { x: 92, y, font: bold, size: 8.5, color: ink });
    descriptions.forEach((description, index) => page!.drawText(description, { x: 92, y: y - 12 - index * 9, font: regular, size: 7.5, color: muted }));
    page!.drawText(`${line.quantity} ${line.unitLabel}`, { x: 340, y, font: regular, size: 8, color: ink });
    page!.drawText(formatMoney(line.unitPriceNetCents), { x: 400, y, font: regular, size: 8, color: ink });
    page!.drawText(formatMoney(line.lineNetCents), { x: 486, y, font: bold, size: 8, color: ink });
    y -= rowHeight;
    page!.drawLine({ start: { x: margin, y: y + 7 }, end: { x: 547, y: y + 7 }, thickness: 0.5, color: pale });
  }
  if (y < 205) { newPage(); y = 770; }
  y -= 8;
  const totalX = 390;
  const drawTotal = (label: string, value: string, strong = false) => {
    page!.drawText(label, { x: totalX, y, font: strong ? bold : regular, size: strong ? 10 : 8.5, color: strong ? ink : muted });
    page!.drawText(value, { x: 490, y, font: strong ? bold : regular, size: strong ? 10 : 8.5, color: ink });
    y -= strong ? 22 : 15;
  };
  drawTotal('Netto', formatMoney(input.totals.subtotalNetCents));
  input.totals.taxBreakdown.forEach(group => drawTotal(`${group.rateBasisPoints / 100} % USt.`, formatMoney(group.taxCents)));
  page!.drawLine({ start: { x: totalX, y: y + 8 }, end: { x: 547, y: y + 8 }, thickness: 1.5, color: accent });
  drawTotal('Gesamt', formatMoney(input.totals.totalGrossCents), true);

  y = Math.min(y - 8, 125);
  const notes = [input.document.closingText, input.seller.smallBusiness ? input.seller.smallBusinessNotice : undefined].filter(Boolean) as string[];
  for (const note of notes) for (const line of wrap(regular, note, 8, 499)) { page!.drawText(line, { x: margin, y, font: regular, size: 8, color: muted }); y -= 11; }
  const footer = [input.seller.footer, input.seller.iban ? `IBAN ${input.seller.iban}${input.seller.bic ? ` · BIC ${input.seller.bic}` : ''}` : undefined, input.seller.vatId ? `USt-IdNr. ${input.seller.vatId}` : input.seller.taxNumber ? `Steuernummer ${input.seller.taxNumber}` : undefined].filter(Boolean).join(' · ');
  for (const line of wrap(regular, footer, 7, 499).slice(0, 2)) { y -= 9; page!.drawText(line, { x: margin, y, font: regular, size: 7, color: muted }); }
  return new Uint8Array(await pdf.save({ useObjectStreams: false }));
}

export function validateBillingReadiness(seller: Partial<BillingSellerSnapshot>, customer: Partial<BillingCustomerSnapshot>, lines: BillingLine[]) {
  const missing: string[] = [];
  if (!seller.companyName) missing.push('Firmenname');
  if (!seller.street || !seller.postalCode || !seller.city || !seller.countryCode) missing.push('vollständige Absenderadresse');
  if (!seller.taxNumber && !seller.vatId) missing.push('Steuernummer oder USt-IdNr.');
  if (!seller.email) missing.push('Absender-E-Mail');
  if (!customer.displayName) missing.push('Kundenname');
  if (!customer.street || !customer.postalCode || !customer.city || !customer.countryCode) missing.push('vollständige Kundenadresse');
  if (!customer.email) missing.push('Kunden-E-Mail');
  if (!lines.length) missing.push('mindestens eine Position');
  if (lines.some(line => !line.name.trim() || line.quantity <= 0 || line.unitPriceNetCents < 0)) missing.push('vollständige, gültige Positionen');
  return missing;
}
