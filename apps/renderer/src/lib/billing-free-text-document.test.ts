import assert from 'node:assert/strict';
import test from 'node:test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { EMPTY_FREE_TEXT_DOCUMENT, FREE_TEXT_FONT_SIZES, freeTextDocumentSchema, freeTextRecipientFromCustomer, freeTextRecipientSchema, layoutFreeTextDocument, layoutFreeTextHeader, normalizeFreeTextPdfText, renderFreeTextDocumentPdf, resolveFreeTextPreviewParties, type FreeTextMark, type FreeTextNode } from './billing-free-text-document';

test('rejects executable or unsupported rich-text nodes', () => {
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [{ type: 'script', text: 'alert(1)' }] }).success, false);
  assert.equal(freeTextDocumentSchema.safeParse(EMPTY_FREE_TEXT_DOCUMENT).success, true);
});

test('rejects invalid AST nesting and marks on block nodes', () => {
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [{ type: 'text', text: 'orphan' }] }).success, false);
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [{ type: 'bulletList', content: [{ type: 'paragraph' }] }] }).success, false);
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [{ type: 'paragraph', marks: [{ type: 'bold' }] }] }).success, false);
});

function nestedList(levels: number): FreeTextNode {
  let child: FreeTextNode = { type: 'paragraph', content: [{ type: 'text', text: 'Listeneintrag' }] };
  for (let index = 0; index < levels; index += 1) child = { type: 'bulletList', content: [{ type: 'listItem', content: [child] }] };
  return child;
}

test('accepts three list levels and rejects excessive nesting before rendering', () => {
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [nestedList(3)] }).success, true);
  assert.equal(freeTextDocumentSchema.safeParse({ type: 'doc', content: [nestedList(4)] }).success, false);
});

test('customer recipients preserve contact, address line two and normalized country', () => {
  assert.deepEqual(freeTextRecipientFromCustomer({
    name: 'Erika Muster', companyName: 'Muster GmbH', email: 'erika@example.de',
    defaultBillingAddress: { street: 'Hauptstra\u00dfe 1', addressLine2: 'Haus B', zip: '10115', city: 'Berlin', country: 'Deutschland' },
  }), {
    displayName: 'Muster GmbH', contactLine: 'Erika Muster', email: 'erika@example.de',
    street: 'Hauptstra\u00dfe 1', addressLine2: 'Haus B', postalCode: '10115', city: 'Berlin', countryCode: 'DE',
  });
  assert.equal(freeTextRecipientFromCustomer({
    name: 'Marie Curie', email: 'marie@example.fr', defaultBillingAddress: { street: '1 rue Test', zip: '75001', city: 'Paris', country: 'France' },
  }).countryCode, 'FR');
  assert.equal(freeTextRecipientFromCustomer({
    name: 'Marie Curie', email: 'marie@example.fr', defaultBillingAddress: { street: '1 rue Test', zip: '75001', city: 'Paris', country: 'Frankreich' },
  }).countryCode, 'FR');
  assert.throws(() => freeTextRecipientFromCustomer({
    name: 'Unbekannt', defaultBillingAddress: { street: 'Test', zip: '1', city: 'Test', country: 'Nichtland' },
  }), /ISO-L\u00e4ndercode/);
});

test('finalized preview parties come only from immutable snapshots', () => {
  const result = resolveFreeTextPreviewParties({
    status: 'finalized', liveSeller: { companyName: 'Ge\u00e4ndert' }, liveRecipient: { displayName: 'Ge\u00e4ndert' },
    sellerSnapshot: { companyName: 'Snapshot GmbH' }, recipientSnapshot: { displayName: 'Snapshot Kunde' },
  });
  assert.deepEqual(result, { seller: { companyName: 'Snapshot GmbH' }, recipient: { displayName: 'Snapshot Kunde' } });
});

test('a long free-text document automatically spans multiple PDF pages', async () => {
  const content = { type: 'doc' as const, content: Array.from({ length: 85 }, (_, index) => ({ type: 'paragraph' as const, content: [{ type: 'text' as const, text: `Absatz ${index + 1}: Dieses Schreiben pr\u00fcft die verl\u00e4ssliche automatische Seitennummerierung und den Umbruch langer Gesch\u00e4ftskorrespondenz.` }] })) };
  const result = await renderFreeTextDocumentPdf({
    title: 'Langes Schreiben', subject: 'Paginationstest', issueDate: new Date('2026-08-05T12:00:00Z'), content,
    recipient: { displayName: 'Muster GmbH', street: 'Hauptstra\u00dfe 1', postalCode: '10115', city: 'Berlin', countryCode: 'DE' },
    seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', smallBusiness: false },
  });
  const parsed = await PDFDocument.load(result.bytes);
  assert.ok(parsed.getPageCount() >= 2);
  assert.equal(result.pageCount, parsed.getPageCount());
  assert.equal(result.pageCount, layoutFreeTextDocument(content).pages.length);
});

test('shared layout plan matches PDF pages for a long 30pt unbroken paragraph', async () => {
  const content = { type: 'doc' as const, content: [{ type: 'paragraph' as const, content: [{ type: 'text' as const, text: 'W'.repeat(10_001), marks: [{ type: 'fontSize' as const, attrs: { size: 30 } }] }] }] };
  const layout = layoutFreeTextDocument(content);
  const result = await renderFreeTextDocumentPdf({
    title: 'Breitentest', subject: 'Langer Betreff', issueDate: new Date('2026-08-05T12:00:00Z'), content,
    recipient: { displayName: 'Muster GmbH', street: 'Hauptstra\u00dfe 1', addressLine2: 'Geb\u00e4ude B', postalCode: '10115', city: 'Berlin', countryCode: 'DE' },
    seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', smallBusiness: false },
  });
  assert.equal(result.pageCount, layout.pages.length);
  assert.ok(result.pageCount > 4);
  const metricsDocument = await PDFDocument.create();
  const font = await metricsDocument.embedFont(StandardFonts.Helvetica);
  for (const page of layout.pages) for (const line of page.lines) {
    const actualWidth = line.segments.reduce((sum, segment) => sum + font.widthOfTextAtSize(segment.text, segment.size), 0);
    assert.ok(actualWidth <= 483.28 - line.xOffset - (line.prefix ? 18 : 0) + 0.01);
  }
});

test('every normalized printable glyph stays inside A4 lines at every size and Helvetica variant', async () => {
  const metricsDocument = await PDFDocument.create();
  const variants = [
    { name: 'regular', font: await metricsDocument.embedFont(StandardFonts.Helvetica), marks: [] as FreeTextMark[] },
    { name: 'bold', font: await metricsDocument.embedFont(StandardFonts.HelveticaBold), marks: [{ type: 'bold' }] as FreeTextMark[] },
    { name: 'italic', font: await metricsDocument.embedFont(StandardFonts.HelveticaOblique), marks: [{ type: 'italic' }] as FreeTextMark[] },
    { name: 'boldItalic', font: await metricsDocument.embedFont(StandardFonts.HelveticaBoldOblique), marks: [{ type: 'bold' }, { type: 'italic' }] as FreeTextMark[] },
  ];
  const glyphs = [
    ...Array.from({ length: 0x7f - 0x20 }, (_, index) => String.fromCodePoint(0x20 + index)),
    ...Array.from({ length: 0x100 - 0xa0 }, (_, index) => String.fromCodePoint(0xa0 + index)),
    ...'\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122',
  ];
  for (const glyph of glyphs) for (const variant of variants) for (const size of FREE_TEXT_FONT_SIZES) {
    const marks = [...variant.marks, { type: 'fontSize' as const, attrs: { size } }];
    const content = { type: 'doc' as const, content: [{ type: 'paragraph' as const, content: [{ type: 'text' as const, text: glyph.repeat(180), marks }] }] };
    const layout = layoutFreeTextDocument(content);
    for (const page of layout.pages) for (const line of page.lines) {
      const width = line.segments.reduce((sum, segment) => sum + variant.font.widthOfTextAtSize(segment.text, segment.size), 0);
      assert.ok(width <= 483.28 - line.xOffset - (line.prefix ? 18 : 0) + 0.01, `U+${glyph.codePointAt(0)!.toString(16).padStart(4, '0')}/${variant.name}/${size}pt overflowed at ${width}`);
    }
  }
  assert.equal(normalizeFreeTextPdfText('\u00e6 \u0153 \u00c6 \u0152 \u2014'), '\u00e6 \u0153 \u00c6 \u0152 \u2014');
  assert.equal(normalizeFreeTextPdfText('Emoji \ud83d\ude00'), 'Emoji ?');
});

test('long digit runs wrap safely in body and first-page header', async () => {
  const metricsDocument = await PDFDocument.create();
  const fonts = {
    regular: await metricsDocument.embedFont(StandardFonts.Helvetica), bold: await metricsDocument.embedFont(StandardFonts.HelveticaBold),
    italic: await metricsDocument.embedFont(StandardFonts.HelveticaOblique), boldItalic: await metricsDocument.embedFont(StandardFonts.HelveticaBoldOblique),
  };
  for (const [variant, font] of Object.entries(fonts)) {
    const marks = [variant.toLowerCase().includes('bold') ? { type: 'bold' as const } : null, variant.toLowerCase().includes('italic') ? { type: 'italic' as const } : null].filter(Boolean) as FreeTextMark[];
    const layout = layoutFreeTextDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1'.repeat(1_000), marks }] }] });
    for (const page of layout.pages) for (const line of page.lines) {
      assert.ok(font.widthOfTextAtSize(line.segments.map(segment => segment.text).join(''), 10.5) <= 483.29, `numeric ${variant} body line overflowed`);
    }
  }
  const recipient = { displayName: '1'.repeat(255), street: '1'.repeat(255), postalCode: '1'.repeat(30), city: '1'.repeat(120), countryCode: 'DE' };
  const header = layoutFreeTextHeader(recipient, '1'.repeat(500), 'Zifferntest');
  assert.equal(header.fits, false, 'an oversized numeric header must be rejected explicitly');
  for (const line of header.recipientLines) assert.ok((line.bold ? fonts.bold : fonts.regular).widthOfTextAtSize(line.text, 10) <= 280.01);
  for (const line of header.subjectLines) assert.ok(fonts.bold.widthOfTextAtSize(line, 15) <= 483.29);
});

test('normalizer handles every C0, DEL and C1 control before PDF encoding', async () => {
  for (let code = 0; code <= 0x1f; code += 1) {
    const character = String.fromCodePoint(code);
    const expected = code === 0x09 ? '    ' : code === 0x0a || code === 0x0d ? '\n' : '?';
    assert.equal(normalizeFreeTextPdfText(character), expected, `unexpected normalization for U+${code.toString(16).padStart(4, '0')}`);
  }
  for (let code = 0x7f; code <= 0x9f; code += 1) assert.equal(normalizeFreeTextPdfText(String.fromCodePoint(code)), '?');
  const controls = `${String.fromCodePoint(0x7f)}${String.fromCodePoint(0x85)}\tEnd`;
  const content = { type: 'doc' as const, content: [{ type: 'paragraph' as const, content: [{ type: 'text' as const, text: controls }] }] };
  assert.equal(freeTextDocumentSchema.safeParse(content).success, true);
  const result = await renderFreeTextDocumentPdf({
    title: 'Kontrollzeichen', subject: 'Sicherer Export', issueDate: new Date('2026-08-05T12:00:00Z'), content,
    recipient: { displayName: 'Muster GmbH', street: 'Hauptstra\u00dfe 1', postalCode: '10115', city: 'Berlin', countryCode: 'DE' },
    seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', smallBusiness: false },
  });
  assert.ok(result.bytes.byteLength > 500);
});

test('recipient and subject are never silently truncated', async () => {
  const recipient = freeTextRecipientSchema.parse({
    displayName: 'A'.repeat(255), contactLine: 'B'.repeat(255), street: 'C'.repeat(255), addressLine2: 'D'.repeat(255),
    postalCode: '1'.repeat(30), city: 'E'.repeat(120), countryCode: 'DE', email: '',
  });
  const subject = 'S'.repeat(500);
  const header = layoutFreeTextHeader(recipient, subject, 'Titel');
  assert.equal(header.fits, false);
  assert.equal(header.recipientLines.map(line => line.text).join('').length, 255 * 4 + 30 + 1 + 120 + 'Deutschland'.length);
  assert.equal(header.subjectLines.join('').length, subject.length);
  await assert.rejects(() => renderFreeTextDocumentPdf({
    title: 'Titel', subject, issueDate: new Date('2026-08-05T12:00:00Z'), recipient, content: EMPTY_FREE_TEXT_DOCUMENT,
    seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', smallBusiness: false },
  }), /zu lang/);
});

test('safe link marks create PDF link annotations', async () => {
  const content = { type: 'doc' as const, content: [{ type: 'paragraph' as const, content: [{ type: 'text' as const, text: 'Flamingo', marks: [{ type: 'link' as const, attrs: { href: 'https://flamingo.de/hilfe' } }] }] }] };
  const result = await renderFreeTextDocumentPdf({
    title: 'Linktest', subject: 'Link', issueDate: new Date('2026-08-05T12:00:00Z'), content,
    recipient: { displayName: 'Muster GmbH', street: 'Hauptstra\u00dfe 1', postalCode: '10115', city: 'Berlin', countryCode: 'DE' },
    seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', smallBusiness: false },
  });
  const parsed = await PDFDocument.load(result.bytes);
  assert.ok((parsed.getPage(0).node.Annots()?.size() || 0) >= 1);
});

test('embeds the trusted tenant logo into the first-page letterhead', async () => {
  const previousFetch = globalThis.fetch;
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
  globalThis.fetch = async () => new Response(png, { status: 200, headers: { 'content-type': 'image/png', 'content-length': String(png.byteLength) } });
  try {
    const result = await renderFreeTextDocumentPdf({
      title: 'Logo-Test', subject: 'Briefkopf', issueDate: new Date('2026-08-05T12:00:00Z'), content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Inhalt' }] }] },
      recipient: { displayName: 'Muster GmbH', street: 'Hauptstra\u00dfe 1', postalCode: '10115', city: 'Berlin', countryCode: 'DE' },
      seller: { companyName: 'Flamingo GmbH', street: 'Testweg 2', postalCode: '85049', city: 'Ingolstadt', countryCode: 'DE', email: 'hallo@example.de', logoUrl: 'https://tenant.public.blob.vercel-storage.com/logo.png', smallBusiness: false },
    });
    assert.ok(result.bytes.byteLength > 1_000);
    assert.equal(result.pageCount, 1);
  } finally { globalThis.fetch = previousFetch; }
});
