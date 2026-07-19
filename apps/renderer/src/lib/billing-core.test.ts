import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateBillingTotals,
  formatDocumentNumber,
  generateXRechnung,
  renderBillingPdf,
  sequencePeriod,
  validateNumberFormat,
  type BillingCustomerSnapshot,
  type BillingDocumentSnapshot,
  type BillingLine,
  type BillingSellerSnapshot,
} from './billing-core';

const seller: BillingSellerSnapshot = {
  companyName: 'Musterbetrieb GmbH', street: 'Werkstraße 4', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE',
  email: 'rechnung@example.com', vatId: 'DE123456789', iban: 'DE02120300000000202051', bic: 'BYLADEM1ING',
  accountHolder: 'Musterbetrieb GmbH', smallBusiness: false,
};

const customer: BillingCustomerSnapshot = {
  customerType: 'company', displayName: 'Beispielkunde AG', customerNumber: 'KD-00042', email: 'einkauf@example.org',
  street: 'Markt 12', postalCode: '80331', city: 'München', countryCode: 'DE', buyerReference: 'KD-00042',
};

const document: BillingDocumentSnapshot = {
  documentNumber: 'RE-2026-0042', documentType: 'invoice', issueDate: new Date('2026-07-18T00:00:00.000Z'),
  serviceDateFrom: new Date('2026-07-17T00:00:00.000Z'), dueDate: new Date('2026-08-01T00:00:00.000Z'), currency: 'EUR',
};

const lines: BillingLine[] = [
  { position: 1, name: 'Konzeption', quantity: 2.5, unitCode: 'HUR', unitLabel: 'Stunde', unitPriceNetCents: 10_000, discountBasisPoints: 0, taxRateBasisPoints: 1900 },
  { position: 2, name: 'Umsetzung', quantity: 1, unitCode: 'C62', unitLabel: 'Pauschale', unitPriceNetCents: 50_000, discountBasisPoints: 1000, taxRateBasisPoints: 1900 },
];

test('number formats support presets and custom placeholders', () => {
  const date = new Date('2026-07-18T00:00:00.000Z');
  assert.equal(validateNumberFormat('{PREFIX}-{YYYY}-{NNNN}'), null);
  assert.equal(formatDocumentNumber('{PREFIX}-{YYYY}-{NNNN}', 'RE', 42, date), 'RE-2026-0042');
  assert.equal(formatDocumentNumber('{YYYY}/{MM}/{NNNNN}', 'RE', 42, date), '2026/07/00042');
  assert.match(validateNumberFormat('{PREFIX}-{YYYY}') || '', /Zähler/);
  assert.match(validateNumberFormat('{PREFIX}-{YYYY}-{NNNN') || '', /unvollständig/);
  assert.match(validateNumberFormat('{PREFIX}-{FOO}-{NNNN}') || '', /unbekannt/);
  assert.equal(sequencePeriod(date, 'never'), 'all');
  assert.equal(sequencePeriod(date, 'year'), '2026');
  assert.equal(sequencePeriod(date, 'month'), '2026-07');
});

test('billing totals use line rounding and grouped VAT', () => {
  const totals = calculateBillingTotals(lines);
  assert.equal(totals.subtotalNetCents, 70_000);
  assert.equal(totals.taxCents, 13_300);
  assert.equal(totals.totalGrossCents, 83_300);
  assert.deepEqual(totals.taxBreakdown, [{ rateBasisPoints: 1900, netCents: 70_000, taxCents: 13_300 }]);
});

test('XRechnung generator emits UBL with invoice identity and parties', async () => {
  const totals = calculateBillingTotals(lines);
  const xml = await generateXRechnung({ document, seller, customer, lines, totals });
  assert.match(xml, /<Invoice/);
  assert.match(xml, /RE-2026-0042/);
  assert.match(xml, /Musterbetrieb GmbH/);
  assert.match(xml, /Beispielkunde AG/);
  assert.match(xml, /urn:xeinkauf\.de:kosit:xrechnung_3\.0/);
});

test('cancellation generates a linked electronic credit note', async () => {
  const totals = calculateBillingTotals(lines);
  const xml = await generateXRechnung({
    document: { ...document, documentNumber: 'ST-2026-0001', documentType: 'cancellation', originalDocumentNumber: document.documentNumber },
    seller, customer, lines, totals,
  });
  assert.match(xml, /<CreditNote/);
  assert.match(xml, /RE-2026-0042/);
  assert.match(xml, /ST-2026-0001/);
});

test('PDF renderer creates a private-storable A4 document', async () => {
  const totals = calculateBillingTotals(lines);
  const pdf = await renderBillingPdf({ document, seller, customer, lines, totals });
  assert.ok(pdf.byteLength > 2_000);
  assert.equal(Buffer.from(pdf).subarray(0, 4).toString(), '%PDF');
});
