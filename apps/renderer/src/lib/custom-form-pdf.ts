import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib';
import { customFormValueToText, type CustomFormConfig, type CustomFormValue } from './custom-form';

export type CustomFormPdfInput = {
  config: CustomFormConfig;
  values: Record<string, CustomFormValue>;
  practiceName: string;
  createdAt?: Date;
};

function encodableText(font: PDFFont, value: string) {
  return [...value.normalize('NFC')].map(character => {
    try { font.encodeText(character); return character; } catch { return '?'; }
  }).join('');
}

function wrapText(font: PDFFont, input: string, fontSize: number, maximumWidth: number) {
  const paragraphs = input.replace(/\r/g, '').split('\n');
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = encodableText(font, paragraph).split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(''); continue; }
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maximumWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      let remainder = word;
      while (font.widthOfTextAtSize(remainder, fontSize) > maximumWidth && remainder.length > 1) {
        let splitAt = 1;
        while (splitAt < remainder.length && font.widthOfTextAtSize(`${remainder.slice(0, splitAt + 1)}-`, fontSize) <= maximumWidth) splitAt += 1;
        lines.push(`${remainder.slice(0, splitAt)}-`);
        remainder = remainder.slice(splitAt);
      }
      line = remainder;
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function renderCustomFormPdf(input: CustomFormPdfInput) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const ink = rgb(0.10, 0.14, 0.17);
  const muted = rgb(0.37, 0.42, 0.45);
  const line = rgb(0.84, 0.86, 0.87);
  const accent = rgb(0.10, 0.36, 0.43);
  const createdAt = input.createdAt ?? new Date();
  let page!: PDFPage;
  let y = 0;

  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    page.drawText(encodableText(bold, input.practiceName), { x: margin, y, size: 10, font: bold, color: accent });
    y -= 18;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.8, color: line });
    y -= 26;
  };
  const ensureSpace = (height: number) => { if (y - height < 58) addPage(); };
  const drawWrapped = (text: string, x: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>, width: number, leading = size * 1.4) => {
    const lines = wrapText(font, text, size, width);
    for (const textLine of lines) {
      ensureSpace(leading);
      if (textLine) page.drawText(textLine, { x, y, size, font, color });
      y -= leading;
    }
  };

  addPage();
  drawWrapped(input.config.pdfTitle, margin, 22, bold, ink, contentWidth, 28);
  y -= 2;
  drawWrapped(`Erstellt am ${new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(createdAt)}`, margin, 8.5, regular, muted, contentWidth, 12);
  y -= 16;

  for (const group of input.config.groups) {
    ensureSpace(54);
    page.drawText(encodableText(bold, group.title), { x: margin, y, size: 13, font: bold, color: accent });
    y -= 10;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: accent });
    y -= 18;
    if (group.description) {
      drawWrapped(group.description, margin, 8.5, regular, muted, contentWidth, 12);
      y -= 6;
    }
    for (const field of group.fields) {
      const value = customFormValueToText(input.values[field.id]);
      const labelLines = wrapText(bold, field.label, 8.5, 156);
      const valueLines = wrapText(regular, value, 9, contentWidth - 174);
      const rowHeight = Math.max(labelLines.length * 12, valueLines.length * 13, 18) + 10;
      ensureSpace(rowHeight);
      let rowY = y;
      for (const labelLine of labelLines) {
        page.drawText(labelLine, { x: margin, y: rowY, size: 8.5, font: bold, color: muted });
        rowY -= 12;
      }
      rowY = y;
      for (const valueLine of valueLines) {
        page.drawText(valueLine || ' ', { x: margin + 174, y: rowY, size: 9, font: regular, color: ink });
        rowY -= 13;
      }
      y -= rowHeight;
      page.drawLine({ start: { x: margin, y: y + 5 }, end: { x: pageWidth - margin, y: y + 5 }, thickness: 0.45, color: line });
    }
    y -= 13;
  }

  const pages = pdf.getPages();
  pages.forEach((item, index) => {
    item.drawLine({ start: { x: margin, y: 42 }, end: { x: pageWidth - margin, y: 42 }, thickness: 0.5, color: line });
    item.drawText(encodableText(regular, `${input.config.pdfTitle} · Seite ${index + 1} von ${pages.length}`), { x: margin, y: 27, size: 7, font: regular, color: muted });
  });
  pdf.setTitle(input.config.pdfTitle);
  pdf.setAuthor(input.practiceName);
  pdf.setCreationDate(createdAt);
  return Buffer.from(await pdf.save());
}

export function buildCustomFormPdfFilename(config: CustomFormConfig, values: Record<string, CustomFormValue>, createdAt = new Date()) {
  const parts = [config.pdfFilename, config.firstNameField ? values[config.firstNameField] : '', config.lastNameField ? values[config.lastNameField] : '', createdAt.toISOString().slice(0, 10)]
    .map(value => typeof value === 'string' ? value : '')
    .map(value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(Boolean);
  return `${parts.join('-').slice(0, 150) || 'formular'}.pdf`;
}
