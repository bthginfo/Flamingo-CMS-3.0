import { PDFDocument, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { z } from 'zod';
import type { BillingSellerSnapshot } from './billing-core';

export const FREE_TEXT_FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30] as const;

const textMarkSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('bold') }).strict(),
  z.object({ type: z.literal('italic') }).strict(),
  z.object({ type: z.literal('underline') }).strict(),
  z.object({ type: z.literal('link'), attrs: z.object({ href: z.string().trim().min(1).max(2_000) }).strict() }).strict(),
  z.object({ type: z.literal('fontSize'), attrs: z.object({ size: z.number().int() }).strict() }).strict(),
]).superRefine((mark, context) => {
  if (mark.type === 'link') {
    const href = mark.attrs.href;
    if (!isSafeLink(href)) context.addIssue({ code: 'custom', message: 'Nur sichere HTTPS-, HTTP- und E-Mail-Links sind erlaubt.' });
  }
  if (mark.type === 'fontSize' && !FREE_TEXT_FONT_SIZES.includes(mark.attrs.size as typeof FREE_TEXT_FONT_SIZES[number])) {
    context.addIssue({ code: 'custom', message: 'Diese Schriftgr\u00f6\u00dfe ist nicht erlaubt.' });
  }
});

export type FreeTextMark = z.infer<typeof textMarkSchema>;
export type FreeTextNode = {
  type: 'doc' | 'paragraph' | 'heading' | 'bulletList' | 'orderedList' | 'listItem' | 'text' | 'hardBreak';
  attrs?: { level?: number; start?: number };
  marks?: FreeTextMark[];
  text?: string;
  content?: FreeTextNode[];
};

const nodeSchema: z.ZodType<FreeTextNode> = z.lazy(() => z.object({
  type: z.enum(['doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'text', 'hardBreak']),
  attrs: z.object({ level: z.number().int().min(1).max(4).optional(), start: z.number().int().min(1).max(9999).optional() }).strict().optional(),
  marks: z.array(textMarkSchema).max(8).optional(),
  text: z.string().max(20_000).optional(),
  content: z.array(nodeSchema).max(2_000).optional(),
}).strict().superRefine((node, context) => {
  if (node.type === 'text' && typeof node.text !== 'string') context.addIssue({ code: 'custom', message: 'Textknoten ben\u00f6tigt Text.' });
  if (node.type === 'heading' && !node.attrs?.level) context.addIssue({ code: 'custom', message: '\u00dcberschrift ben\u00f6tigt eine Ebene.' });
  if (node.type !== 'text' && node.marks?.length) context.addIssue({ code: 'custom', message: 'Formatierungen sind nur auf Text erlaubt.' });
  const allowedChildren: Partial<Record<FreeTextNode['type'], FreeTextNode['type'][]>> = {
    doc: ['paragraph', 'heading', 'bulletList', 'orderedList'],
    paragraph: ['text', 'hardBreak'],
    heading: ['text', 'hardBreak'],
    bulletList: ['listItem'],
    orderedList: ['listItem'],
    listItem: ['paragraph', 'bulletList', 'orderedList'],
  };
  const allowed = allowedChildren[node.type];
  if (allowed && (node.content || []).some(child => !allowed.includes(child.type))) {
    context.addIssue({ code: 'custom', message: `Ung\u00fcltige Verschachtelung in ${node.type}.` });
  }
  if (['text', 'hardBreak'].includes(node.type) && node.content?.length) context.addIssue({ code: 'custom', message: `${node.type} darf keine Unterknoten enthalten.` });
}));

const MAX_AST_DEPTH = 12;
export const MAX_LIST_NESTING = 3;

function rejectUnsafeAstLimits(value: unknown) {
  if (!value || typeof value !== 'object') return value;
  const stack: Array<{ node: unknown; depth: number; listDepth: number }> = [{ node: value, depth: 1, listDepth: 0 }];
  let nodes = 0;
  let textLength = 0;
  while (stack.length) {
    const current = stack.pop()!;
    if (!current.node || typeof current.node !== 'object' || current.depth > MAX_AST_DEPTH) return null;
    const record = current.node as { type?: unknown; text?: unknown; content?: unknown };
    const listDepth = current.listDepth + (record.type === 'bulletList' || record.type === 'orderedList' ? 1 : 0);
    if (listDepth > MAX_LIST_NESTING || ++nodes > 2_000) return null;
    if (typeof record.text === 'string') textLength += record.text.length;
    if (textLength > 200_000) return null;
    if (Array.isArray(record.content)) for (const child of record.content) stack.push({ node: child, depth: current.depth + 1, listDepth });
  }
  return value;
}

export const freeTextDocumentSchema = z.preprocess(rejectUnsafeAstLimits, nodeSchema).superRefine((node, context) => {
  if (node.type !== 'doc') context.addIssue({ code: 'custom', message: 'Das Dokument braucht einen Wurzelknoten.' });
});

export type FreeTextDocument = z.infer<typeof freeTextDocumentSchema>;

export type FreeTextRecipient = {
  displayName: string;
  contactLine?: string;
  street: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email?: string;
};

export function resolveFreeTextPreviewParties<TSeller, TRecipient>(input: {
  status: string;
  liveSeller: TSeller;
  liveRecipient: TRecipient;
  sellerSnapshot?: TSeller | null;
  recipientSnapshot?: TRecipient | null;
}) {
  if (input.status === 'finalized') {
    if (!input.sellerSnapshot || !input.recipientSnapshot) throw new Error('Finalisierte Vorschau-Snapshots fehlen.');
    return { seller: input.sellerSnapshot, recipient: input.recipientSnapshot };
  }
  return { seller: input.liveSeller, recipient: input.liveRecipient };
}

export const freeTextRecipientSchema = z.object({
  displayName: z.string().trim().min(1, 'Empf\u00e4ngername fehlt.').max(255),
  contactLine: z.string().trim().max(255).optional().nullable().transform(value => value || undefined),
  street: z.string().trim().min(1, 'Stra\u00dfe fehlt.').max(255),
  addressLine2: z.string().trim().max(255).optional().nullable().transform(value => value || undefined),
  postalCode: z.string().trim().min(1, 'Postleitzahl fehlt.').max(30),
  city: z.string().trim().min(1, 'Ort fehlt.').max(120),
  countryCode: z.string().trim().regex(/^[A-Z]{2}$/, 'L\u00e4ndercode muss zweistellig sein.'),
  email: z.union([z.literal(''), z.string().trim().email().max(255)]).optional().transform(value => value || undefined),
});

let countryNames: Map<string, string> | undefined;

function normalizedCountryName(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('de');
}

export function normalizeFreeTextCountryCode(value: string): string | null {
  const input = value.trim();
  if (/^[a-z]{2}$/i.test(input)) return input.toUpperCase();
  if (!countryNames) {
    countryNames = new Map<string, string>();
    for (const locale of ['de', 'en', 'fr']) {
      const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
      for (let first = 65; first <= 90; first += 1) for (let second = 65; second <= 90; second += 1) {
        const code = String.fromCharCode(first, second);
        const name = displayNames.of(code);
        if (name && name !== code) {
          const normalized = normalizedCountryName(name);
          if (!countryNames.has(normalized)) countryNames.set(normalized, code);
        }
      }
    }
    for (const name of ['france', 'frankreich']) countryNames.set(name, 'FR');
    for (const name of ['deutschland', 'germany', 'allemagne']) countryNames.set(name, 'DE');
    for (const name of ['austria', '\u00f6sterreich']) countryNames.set(normalizedCountryName(name), 'AT');
    countryNames.set('oesterreich', 'AT');
  }
  return countryNames.get(normalizedCountryName(input)) || null;
}

export function freeTextRecipientFromCustomer(customer: { name: string; companyName?: string | null; email?: string | null; defaultBillingAddress?: unknown }): FreeTextRecipient {
  const address = (customer.defaultBillingAddress || {}) as { street?: string; addressLine2?: string; zip?: string; city?: string; country?: string };
  const countryInput = String(address.country || 'DE').trim();
  const countryCode = normalizeFreeTextCountryCode(countryInput);
  if (!countryCode) throw new Error(`Land "${countryInput}" konnte keinem ISO-L\u00e4ndercode zugeordnet werden.`);
  return freeTextRecipientSchema.parse({
    displayName: customer.companyName || customer.name,
    contactLine: customer.companyName && customer.name !== customer.companyName ? customer.name : undefined,
    street: address.street || '', addressLine2: address.addressLine2, postalCode: address.zip || '', city: address.city || '', countryCode,
    email: customer.email || undefined,
  });
}

export const EMPTY_FREE_TEXT_DOCUMENT: FreeTextDocument = { type: 'doc', content: [{ type: 'paragraph' }] };

export function isSafeLink(href: string) {
  try {
    const url = new URL(href);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function normalizeFreeTextDocument(value: unknown): FreeTextDocument {
  return freeTextDocumentSchema.parse(value);
}

export function freeTextPlainText(node: FreeTextNode): string {
  if (node.type === 'text') return node.text || '';
  if (node.type === 'hardBreak') return '\n';
  const own = (node.content || []).map(freeTextPlainText).join('');
  return ['paragraph', 'heading', 'listItem'].includes(node.type) ? `${own}\n` : own;
}

export type FreeTextLayoutSegment = { text: string; size: number; bold: boolean; italic: boolean; underline: boolean; link?: string };
type Segment = FreeTextLayoutSegment;
type Block = { segments: Segment[]; before: number; after: number; indent: number; prefix?: string };

const WIN_ANSI_EXTRA = new Set('\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122');

function isWinAnsiPrintable(character: string) {
  const code = character.codePointAt(0)!;
  return (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WIN_ANSI_EXTRA.has(character);
}

/** Normalizes arbitrary editor input to glyphs supported by PDF standard fonts. */
export function normalizeFreeTextPdfText(value: string) {
  let result = '';
  for (const character of value) {
    if (character === '\n' || character === '\r') { result += '\n'; continue; }
    if (character === '\t') { result += '    '; continue; }
    if (isWinAnsiPrintable(character)) { result += character; continue; }
    const fallback = character.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    result += [...fallback].filter(isWinAnsiPrintable).join('') || '?';
  }
  return result;
}

function segmentFor(node: FreeTextNode, defaultSize: number): Segment {
  const marks = node.marks || [];
  const sizeMark = marks.find(mark => mark.type === 'fontSize');
  const linkMark = marks.find(mark => mark.type === 'link');
  return {
    text: normalizeFreeTextPdfText(node.text || ''),
    size: sizeMark ? Number(sizeMark.attrs?.size) : defaultSize,
    bold: marks.some(mark => mark.type === 'bold'),
    italic: marks.some(mark => mark.type === 'italic'),
    underline: marks.some(mark => mark.type === 'underline'),
    link: linkMark?.type === 'link' && isSafeLink(linkMark.attrs.href) ? linkMark.attrs.href : undefined,
  };
}

function inlineSegments(node: FreeTextNode, defaultSize: number): Segment[] {
  const result: Segment[] = [];
  for (const child of node.content || []) {
    if (child.type === 'text') result.push(segmentFor(child, defaultSize));
    else if (child.type === 'hardBreak') result.push({ text: '\n', size: defaultSize, bold: false, italic: false, underline: false });
    else result.push(...inlineSegments(child, defaultSize));
  }
  return result.length ? result : [{ text: '', size: defaultSize, bold: false, italic: false, underline: false }];
}

function toBlocks(document: FreeTextDocument): Block[] {
  const blocks: Block[] = [];
  const visit = (node: FreeTextNode, indent = 0, prefix?: string) => {
    if (node.type === 'paragraph') blocks.push({ segments: inlineSegments(node, 10.5), before: 0, after: 8, indent, prefix });
    else if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      const size = ({ 1: 24, 2: 18, 3: 14, 4: 12 } as Record<number, number>)[level];
      blocks.push({ segments: inlineSegments(node, size).map(segment => ({ ...segment, bold: true })), before: level < 3 ? 10 : 5, after: 7, indent, prefix });
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      let index = node.attrs?.start || 1;
      for (const child of node.content || []) visit(child, indent + 18, node.type === 'bulletList' ? '\u2022' : `${index++}.`);
    } else if (node.type === 'listItem') {
      const children = node.content || [];
      children.forEach((child, index) => visit(child, indent, index === 0 ? prefix : undefined));
    } else (node.content || []).forEach(child => visit(child, indent, prefix));
  };
  visit(document);
  return blocks;
}

export function freeTextPreviewBlocks(document: FreeTextDocument) {
  return toBlocks(document);
}

export type FreeTextLayoutLine = { segments: FreeTextLayoutSegment[]; prefix?: string; xOffset: number; y: number; height: number };
export type FreeTextLayoutPage = { lines: FreeTextLayoutLine[] };

function estimatedCharacterWidth(segment: Segment, character: string) {
  // Conservative Helvetica metrics keep PDF glyphs inside the same line box
  // used by the preview, including wide uppercase/non-ASCII characters.
  const units = /\s/.test(character) ? 0.35
    : /[ilI.,'|!:;]/.test(character) ? 0.45
      : /[MWmw@%&]/.test(character) ? 1.1
        : character.codePointAt(0)! > 0x7f ? 1.1
          : /[A-Z]/.test(character) ? 0.9
            : /[0-9]/.test(character) ? 0.7 : 0.82;
  return units * segment.size * (segment.bold ? 1.06 : 1);
}

function wrapLayoutSegments(segments: Segment[], requestedWidth: number) {
  const width = Math.max(96, requestedWidth);
  const lines: Segment[][] = [[]];
  let lineWidth = 0;
  const append = (segment: Segment, token: string) => {
    if (token === '\n') { lines.push([]); lineWidth = 0; return; }
    let chunk = '';
    let chunkWidth = 0;
    const flush = () => { if (!chunk) return; lines[lines.length - 1].push({ ...segment, text: chunk }); lineWidth += chunkWidth; chunk = ''; chunkWidth = 0; };
    for (const character of token) {
      const characterWidth = estimatedCharacterWidth(segment, character);
      if (lineWidth + chunkWidth + characterWidth > width && lineWidth + chunkWidth > 0) {
        flush();
        lines.push([]);
        lineWidth = 0;
      }
      chunk += character;
      chunkWidth += characterWidth;
    }
    flush();
  };
  for (const segment of segments) for (const part of segment.text.split(/(\n|\s+)/)) if (part) append(segment, part);
  return lines;
}

/** One deterministic page-break plan powers both the browser preview and PDF. */
export function layoutFreeTextDocument(document: FreeTextDocument, options?: { firstPageStartY?: number }): { pages: FreeTextLayoutPage[] } {
  const pages: FreeTextLayoutPage[] = [{ lines: [] }];
  let pageIndex = 0;
  let y = options?.firstPageStartY ?? 570;
  for (const block of toBlocks(document)) {
    y -= block.before;
    const lines = wrapLayoutSegments(block.segments, 483.28 - block.indent - (block.prefix ? 18 : 0));
    lines.forEach((segments, lineIndex) => {
      const height = Math.max(13, ...segments.map(segment => segment.size * 1.35));
      if (y - height < 70) { pages.push({ lines: [] }); pageIndex += 1; y = 748; }
      pages[pageIndex].lines.push({ segments, prefix: lineIndex === 0 ? block.prefix : undefined, xOffset: block.indent, y, height });
      y -= height;
    });
    y -= block.after;
  }
  return { pages };
}

export type FreeTextHeaderLayout = {
  recipientLines: Array<{ text: string; bold: boolean }>;
  subjectLines: string[];
  recipientY: number;
  subjectLabelY: number;
  subjectY: number;
  contentStartY: number;
  fits: boolean;
};

/** Shared, non-truncating first-page plan for PDF and browser preview. */
export function layoutFreeTextHeader(recipient: FreeTextRecipient, subject: string, title: string): FreeTextHeaderLayout {
  let country = recipient.countryCode;
  try { country = new Intl.DisplayNames(['de'], { type: 'region' }).of(recipient.countryCode) || recipient.countryCode; } catch { /* retain ISO code */ }
  const recipientValues = [recipient.displayName, recipient.contactLine, recipient.street, recipient.addressLine2, `${recipient.postalCode} ${recipient.city}`, country].filter(Boolean) as string[];
  const recipientLines = recipientValues.flatMap((value, index) => wrapLayoutSegments([{
    text: normalizeFreeTextPdfText(value), size: 10, bold: index === 0, italic: false, underline: false,
  }], 280).map(line => ({ text: line.map(segment => segment.text).join(''), bold: index === 0 })));
  const subjectLines = wrapLayoutSegments([{
    text: normalizeFreeTextPdfText(subject || title), size: 15, bold: true, italic: false, underline: false,
  }], 483.28).map(line => line.map(segment => segment.text).join(''));
  const recipientY = 696;
  const subjectLabelY = Math.min(646, recipientY - recipientLines.length * 14 - 18);
  const subjectY = subjectLabelY - 22;
  const contentStartY = Math.min(550, subjectY - subjectLines.length * 19 - 34);
  return { recipientLines, subjectLines, recipientY, subjectLabelY, subjectY, contentStartY, fits: contentStartY >= 420 };
}
async function embedFreeTextLogo(doc: PDFDocument, url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !(parsed.hostname.endsWith('.public.blob.vercel-storage.com') || parsed.hostname.endsWith('.blob.vercel-storage.com'))) return null;
    const response = await fetch(parsed, { signal: AbortSignal.timeout(5_000), cache: 'no-store' });
    if (!response.ok || Number(response.headers.get('content-length') || 0) > 2_000_000) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.byteLength || bytes.byteLength > 2_000_000) return null;
    return (response.headers.get('content-type') || '').includes('png') ? doc.embedPng(bytes) : doc.embedJpg(bytes);
  } catch { return null; }
}

function wrapPdfText(font: PDFFont, text: string, size: number, maxWidth: number, maxLines: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of normalizeFreeTextPdfText(text).trim().split(/\s+/)) {
    let remaining = word;
    while (remaining) {
      let take = remaining.length;
      while (take > 1 && font.widthOfTextAtSize(remaining.slice(0, take), size) > maxWidth) take -= 1;
      const part = remaining.slice(0, take);
      const candidate = line ? `${line} ${part}` : part;
      if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) { lines.push(line); line = part; }
      else line = candidate;
      remaining = remaining.slice(take);
      if (remaining) { lines.push(line); line = ''; }
      if (lines.length >= maxLines) return lines;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

export async function renderFreeTextDocumentPdf(input: {
  title: string;
  subject: string;
  issueDate: Date;
  seller: BillingSellerSnapshot;
  recipient: FreeTextRecipient;
  content: FreeTextDocument;
}) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const boldItalic = await pdf.embedFont(StandardFonts.HelveticaBoldOblique);
  const logo = await embedFreeTextLogo(pdf, input.seller.logoUrl);
  const ink = rgb(0.09, 0.11, 0.15);
  const muted = rgb(0.39, 0.42, 0.48);
  const accent = rgb(0.12, 0.39, 0.82);
  const margin = 56;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const contentWidth = pageWidth - margin * 2;
  const fontFor = (segment: Segment) => segment.bold && segment.italic ? boldItalic : segment.bold ? bold : segment.italic ? italic : regular;
  const pages: PDFPage[] = [];
  let page: PDFPage;
  const header = layoutFreeTextHeader(input.recipient, input.subject, input.title);
  if (!header.fits) throw new Error('Empf\u00e4nger oder Betreff sind zu lang f\u00fcr den Briefkopf. Bitte k\u00fcrzen Sie die Angaben.');
  const layout = layoutFreeTextDocument(input.content, { firstPageStartY: header.contentStartY });

  const addPage = (first = false) => {
    page = pdf.addPage([pageWidth, pageHeight]);
    pages.push(page);
    if (first && logo) {
      const scale = Math.min(136 / logo.width, 44 / logo.height);
      const width = logo.width * scale;
      const height = logo.height * scale;
      page.drawImage(logo, { x: margin, y: 800 - height, width, height });
    }
    if (first) {
      const companyLines = wrapPdfText(bold, input.seller.companyName || '', 9, 210, 2);
      companyLines.forEach((line, index) => page.drawText(line, { x: pageWidth - margin - bold.widthOfTextAtSize(line, 9), y: 800 - index * 11, font: bold, size: 9, color: ink }));
      const address = [input.seller.street, `${input.seller.postalCode} ${input.seller.city}`.trim()].filter(Boolean).join(' \u00b7 ');
      wrapPdfText(regular, address, 7, 210, 2).forEach((line, index) => page.drawText(line, { x: pageWidth - margin - regular.widthOfTextAtSize(line, 7), y: 777 - index * 9, font: regular, size: 7, color: muted }));
      page.drawLine({ start: { x: margin, y: 752 }, end: { x: pageWidth - margin, y: 752 }, thickness: 0.8, color: rgb(0.88, 0.9, 0.93) });
      page.drawLine({ start: { x: margin, y: 752 }, end: { x: margin + 54, y: 752 }, thickness: 2.2, color: accent });
    } else {
      const safeTitle = normalizeFreeTextPdfText(input.title).slice(0, 60);
      page.drawText(safeTitle, { x: margin, y: 800, font: regular, size: 8, color: muted });
      const safeCompany = normalizeFreeTextPdfText(input.seller.companyName || '');
      page.drawText(safeCompany, { x: pageWidth - margin - regular.widthOfTextAtSize(safeCompany, 8), y: 800, font: regular, size: 8, color: muted });
      page.drawLine({ start: { x: margin, y: 785 }, end: { x: pageWidth - margin, y: 785 }, thickness: 0.8, color: rgb(0.88, 0.9, 0.93) });
    }
    return page;
  };

  layout.pages.forEach((_, index) => addPage(index === 0));
  page = pages[0];
  const senderLine = [input.seller.companyName, input.seller.street, `${input.seller.postalCode} ${input.seller.city}`].filter(Boolean).join(' \u00b7 ');
  wrapPdfText(regular, senderLine, 6.8, contentWidth, 1).forEach(line => page!.drawText(line, { x: margin, y: 736, font: regular, size: 6.8, color: muted }));
  page!.drawText('EMPF\u00c4NGER', { x: margin, y: 714, font: bold, size: 6, color: accent });
  page!.drawText('DATUM', { x: pageWidth - margin - bold.widthOfTextAtSize('DATUM', 6), y: 714, font: bold, size: 6, color: accent });
  header.recipientLines.forEach((line, index) => page!.drawText(line.text, { x: margin, y: header.recipientY - index * 14, font: line.bold ? bold : regular, size: 10, color: ink }));
  const dateText = new Intl.DateTimeFormat('de-DE').format(input.issueDate);
  page!.drawText(dateText, { x: pageWidth - margin - regular.widthOfTextAtSize(dateText, 9), y: header.recipientY, font: regular, size: 9, color: muted });
  page!.drawText('BETREFF', { x: margin, y: header.subjectLabelY, font: bold, size: 6, color: accent });
  header.subjectLines.forEach((line, index) => page!.drawText(line, { x: margin, y: header.subjectY - index * 19, font: bold, size: 15, color: ink }));

  layout.pages.forEach((layoutPage, pageIndex) => {
    page = pages[pageIndex];
    for (const line of layoutPage.lines) {
      let x = margin + line.xOffset;
      if (line.prefix) {
        page.drawText(line.prefix, { x, y: line.y, font: regular, size: 10.5, color: ink });
        x += 18;
      }
      for (const segment of line.segments) {
        const font = fontFor(segment);
        const color = segment.link ? accent : ink;
        page.drawText(segment.text, { x, y: line.y, font, size: segment.size, color });
        const segmentWidth = font.widthOfTextAtSize(segment.text, segment.size);
        if (segment.underline || segment.link) page.drawLine({ start: { x, y: line.y - 1.5 }, end: { x: x + segmentWidth, y: line.y - 1.5 }, thickness: 0.55, color });
        if (segment.link && segmentWidth > 0) {
          const annotation = pdf.context.register(pdf.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: [x, line.y - 2, x + segmentWidth, line.y + segment.size], Border: [0, 0, 0], A: { Type: 'Action', S: 'URI', URI: PDFString.of(segment.link) } }));
          page.node.addAnnot(annotation);
        }
        x += segmentWidth;
      }
    }
  });

  pages.forEach((current, index) => {
    current.drawLine({ start: { x: margin, y: 49 }, end: { x: pageWidth - margin, y: 49 }, thickness: 0.6, color: rgb(0.86, 0.88, 0.91) });
    const footer = [input.seller.email, input.seller.phone, input.seller.website].filter(Boolean).join(' \u00b7 ');
    current.drawText(normalizeFreeTextPdfText(footer).slice(0, 105), { x: margin, y: 34, font: regular, size: 6.5, color: muted });
    const pageLabel = `Seite ${index + 1} von ${pages.length}`;
    current.drawText(pageLabel, { x: pageWidth - margin - regular.widthOfTextAtSize(pageLabel, 6.5), y: 34, font: regular, size: 6.5, color: muted });
  });

  return { bytes: await pdf.save(), pageCount: pages.length };
}
