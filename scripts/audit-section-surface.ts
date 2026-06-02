import fs from 'node:fs';
import path from 'node:path';
import { SECTION_PREVIEW_DATA } from '../apps/renderer/src/lib/section-preview-data';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '../apps/renderer/src/lib/section-editor-field-defaults';

const root = process.cwd();
const templatesIndexPath = path.join(root, 'apps/renderer/src/templates/index.ts');
const colorEditorPath = path.join(root, 'apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
const dataEditorPath = path.join(root, 'apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx');
const reportsDir = path.join(root, 'reports');
const reportPath = path.join(reportsDir, 'section-surface-audit.json');
const csvPath = path.join(reportsDir, 'section-surface-audit.csv');
const mdPath = path.join(reportsDir, 'section-surface-audit.md');

type SectionReport = {
  type: string;
  component: string | null;
  file: string | null;
  feDataFields: string[];
  cmsPreviewFields: string[];
  missingCmsFields: string[];
  adminColorFields: string[];
  adminColorCssVars: string[];
  feCssVars: string[];
  missingColorCssVars: string[];
  phantomColorCssVars: string[];
  genericColorFallback: boolean;
  dataColorFields: string[];
  hardcodedColorClassCount: number;
  notes: string[];
};

const read = (file: string) => fs.readFileSync(file, 'utf8');

function unique(values: Iterable<string>) {
  return [...new Set([...values].filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function stripComments(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function extractBalanced(source: string, startIndex: number, open = '{', close = '}') {
  let depth = 0;
  let start = -1;
  for (let i = startIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === open) {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0 && start >= 0) return source.slice(start, i + 1);
    }
  }
  return '';
}

function parseImports(indexSource: string) {
  const imports = new Map<string, string>();
  const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+'([^']+)'/g;
  for (const match of indexSource.matchAll(importRegex)) {
    const specifiers = match[1].split(',').map((part) => part.trim()).filter(Boolean);
    for (const specifier of specifiers) {
      const [imported, alias] = specifier.split(/\s+as\s+/).map((part) => part.trim());
      imports.set(alias || imported, match[2]);
    }
  }
  return imports;
}

function parseSectionComponents(indexSource: string) {
  const mappings = new Map<string, string>();
  const mappingRegex = /^\s{2,}([a-zA-Z][\w]*)\s*:\s*([A-Z][\w]*)\s*,/gm;
  for (const match of indexSource.matchAll(mappingRegex)) {
    if (match[2].endsWith('_TEMPLATES')) continue;
    mappings.set(match[1], match[2]);
  }
  return mappings;
}

function resolveTemplateFile(importPath: string | undefined) {
  if (!importPath) return null;
  const base = path.join(root, 'apps/renderer/src/templates', importPath);
  const candidates = [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function flattenFields(value: unknown, prefix = ''): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    const sample = value[0];
    return sample && typeof sample === 'object'
      ? flattenFields(sample, `${prefix}[]`)
      : prefix ? [prefix] : [];
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return prefix ? [prefix] : [];
    return entries.flatMap(([key, child]) => flattenFields(child, prefix ? `${prefix}.${key}` : key));
  }
  return prefix ? [prefix] : [];
}

function topLevel(field: string) {
  return field.split(/[.[\]]/)[0];
}

function parseFeDataFields(source: string) {
  const clean = stripComments(source);
  const fields = new Set<string>();
  for (const match of clean.matchAll(/\bdata\.([a-zA-Z_]\w*)/g)) fields.add(match[1]);
  for (const match of clean.matchAll(/\bdata\[['"]([^'"\]]+)['"]\]/g)) fields.add(match[1]);
  for (const match of clean.matchAll(/const\s+\{([^}]+)\}\s*=\s*data\b/g)) {
    for (const part of match[1].split(',')) {
      const raw = part.trim().split(':')[0]?.trim();
      if (raw && /^[a-zA-Z_]\w*$/.test(raw)) fields.add(raw);
    }
  }
  return unique(fields);
}

function parseCssVars(source: string) {
  const vars = new Set<string>();
  for (const match of source.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) vars.add(match[1]);
  return unique(vars);
}

function parseHardcodedColorClasses(source: string) {
  const matches = source.match(/\b(?:bg|text|border|from|to|via|ring|shadow|decoration|outline)-(?:white|black|zinc|slate|neutral|stone|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}(?:\/[0-9]{1,3})?/g);
  return matches?.length ?? 0;
}

function fieldsForHardcodedColorClasses(source: string) {
  const fields = new Set<string>();
  const classes = source.match(/\b(?:bg|text|border|from|to|via|ring|shadow|decoration|outline)-(?:white|black|brand|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)[a-zA-Z0-9/-]*/g) || [];
  for (const className of classes) {
    if (className.startsWith('text-')) {
      if (/(gray|slate|zinc|neutral|stone)-(200|300|400)/.test(className)) fields.add('mutedColor');
      else if (/(gray|slate|zinc|neutral|stone)-(500|600)/.test(className)) fields.add('textSecondary');
      else if (/(white|black|gray|slate|zinc|neutral|stone)-?/.test(className)) fields.add('textPrimary');
      else fields.add('accentColor');
    }
    if (className.startsWith('bg-')) {
      if (/bg-white/.test(className)) fields.add('cardBg');
      else if (/(gray|slate|zinc|neutral|stone)-(50|100|200)/.test(className)) fields.add('sectionBgAlt');
      else if (/brand-accent|orange|amber|yellow|green|emerald|teal|blue|pink|rose|purple|violet/.test(className)) fields.add('accentColor');
      else fields.add('sectionBg');
    }
    if (/^(border|ring|outline|decoration)-/.test(className)) fields.add('borderColor');
    if (/^(from|to|via)-/.test(className)) fields.add('sectionBgAlt');
  }
  return [...fields];
}

function parseFieldDefs(colorSource: string) {
  const defs = new Map<string, string>();
  const regex = /([a-zA-Z]\w*)\s*:\s*\{\s*cssVar:\s*'([^']+)'/g;
  for (const match of colorSource.matchAll(regex)) defs.set(match[1], match[2]);
  return defs;
}

function parseSectionFields(colorSource: string) {
  const fields = new Map<string, string[]>();
  const start = colorSource.indexOf('const SECTION_FIELDS');
  const block = extractBalanced(colorSource, start);
  const regex = /^\s*([a-zA-Z]\w*)\s*:\s*\[([^\]]*)\]/gm;
  for (const match of block.matchAll(regex)) {
    const values = [...match[2].matchAll(/'([^']+)'/g)].map((item) => item[1]);
    fields.set(match[1], values);
  }
  return fields;
}

const indexSource = read(templatesIndexPath);
const colorSource = read(colorEditorPath);
const dataEditorSource = read(dataEditorPath);
const imports = parseImports(indexSource);
const mappings = parseSectionComponents(indexSource);
const fieldDefs = parseFieldDefs(colorSource);
const sectionFields = parseSectionFields(colorSource);
const cssVarByField = new Map([...fieldDefs.entries()].map(([field, cssVar]) => [field, cssVar]));

const editorBlockStart = dataEditorSource.indexOf('const EDITORS');
const editorBlock = extractBalanced(dataEditorSource, editorBlockStart);
const dataEditorTypes = new Set([...editorBlock.matchAll(/^\s*([a-zA-Z]\w*)\s*:/gm)].map((match) => match[1]));

const allTypes = unique([...mappings.keys(), ...Object.keys(SECTION_PREVIEW_DATA), ...sectionFields.keys(), ...dataEditorTypes]);
const SYSTEM_INJECTED_FIELDS = new Set(['tenantId']);

const reports: SectionReport[] = allTypes.map((type) => {
  const component = mappings.get(type) || null;
  const file = resolveTemplateFile(component ? imports.get(component) : undefined);
  const source = file ? read(file) : '';
  const feDataFields = parseFeDataFields(source).filter((field) => field !== 'id' && field !== 'type');
  const cmsRelevantFeDataFields = feDataFields.filter((field) => !SYSTEM_INJECTED_FIELDS.has(field));
  const cmsPreviewFields = unique([
    ...flattenFields(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}).map(topLevel),
    ...flattenFields(SECTION_PREVIEW_DATA[type] || {}).map(topLevel),
  ]);
  const missingCmsFields = cmsRelevantFeDataFields.filter((field) => !cmsPreviewFields.includes(field));
  const feCssVars = unique([
    ...parseCssVars(source),
    ...fieldsForHardcodedColorClasses(source).map((field) => cssVarByField.get(field) || ''),
  ]);
  const adminColorFields = sectionFields.get(type) || [];
  const adminColorCssVars = unique(adminColorFields.map((field) => fieldDefs.get(field) || ''));
  const missingColorCssVars = feCssVars.filter((cssVar) => cssVar.startsWith('--style-') || cssVar.startsWith('--brand-btn-')).filter((cssVar) => !adminColorCssVars.includes(cssVar));
  const phantomColorCssVars = adminColorCssVars.filter((cssVar) => !feCssVars.includes(cssVar));
  const dataColorFields = feDataFields.filter((field) => /color|colour|farbe|overlay/i.test(field));
  const notes: string[] = [];
  if (!component) notes.push('Kein Template-Mapping gefunden');
  if (!file) notes.push('Template-Datei nicht auflösbar');
  if (missingCmsFields.length) notes.push('FE-Datenfelder fehlen im Preview-/Schema-Editor-Seed');
  if (missingColorCssVars.length) notes.push('FE-CSS-Variablen fehlen im Section-Color-Mapping');
  if (phantomColorCssVars.length) notes.push('Admin zeigt Color-Variablen, die dieses Template nicht verwendet');
  return {
    type,
    component,
    file: file ? path.relative(root, file).replaceAll('\\', '/') : null,
    feDataFields,
    cmsPreviewFields,
    missingCmsFields,
    adminColorFields,
    adminColorCssVars,
    feCssVars,
    missingColorCssVars,
    phantomColorCssVars,
    genericColorFallback: false,
    dataColorFields,
    hardcodedColorClassCount: parseHardcodedColorClasses(source),
    notes,
  };
});

const summary = {
  generatedAt: new Date().toISOString(),
  totals: {
    sections: reports.length,
    missingCmsFields: reports.filter((report) => report.missingCmsFields.length > 0).length,
    missingColorMappings: reports.filter((report) => report.missingColorCssVars.length > 0).length,
    phantomColorControls: reports.filter((report) => report.phantomColorCssVars.length > 0).length,
    genericColorFallback: reports.filter((report) => report.genericColorFallback).length,
    hardcodedColorClasses: reports.filter((report) => report.hardcodedColorClassCount > 0).length,
  },
  highRisk: reports
    .filter((report) => report.notes.length > 0)
    .sort((a, b) => {
      const score = (report: SectionReport) => report.missingCmsFields.length * 3 + report.missingColorCssVars.length * 2 + report.phantomColorCssVars.length + (report.genericColorFallback ? 2 : 0);
      return score(b) - score(a);
    })
    .slice(0, 40)
    .map((report) => ({
      type: report.type,
      component: report.component,
      missingCmsFields: report.missingCmsFields,
      missingColorCssVars: report.missingColorCssVars,
      phantomColorCssVars: report.phantomColorCssVars,
      genericColorFallback: report.genericColorFallback,
      hardcodedColorClassCount: report.hardcodedColorClassCount,
      notes: report.notes,
    })),
};

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({ summary, sections: reports }, null, 2));

const csvEscape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csvRows = [
  ['type', 'component', 'file', 'missingCmsFields', 'missingColorCssVars', 'phantomColorCssVars', 'genericColorFallback', 'hardcodedColorClassCount', 'notes'],
  ...reports.map((report) => [
    report.type,
    report.component || '',
    report.file || '',
    report.missingCmsFields.join('; '),
    report.missingColorCssVars.join('; '),
    report.phantomColorCssVars.join('; '),
    report.genericColorFallback ? 'yes' : 'no',
    String(report.hardcodedColorClassCount),
    report.notes.join('; '),
  ]),
];
fs.writeFileSync(csvPath, csvRows.map((row) => row.map(csvEscape).join(',')).join('\n'));

const issueLines = reports
  .filter((report) => report.notes.length > 0)
  .slice(0, 120)
  .map((report) => `| \`${report.type}\` | ${report.component || '-'} | ${report.missingCmsFields.length} | ${report.missingColorCssVars.length} | ${report.phantomColorCssVars.length} | ${report.genericColorFallback ? 'ja' : 'nein'} | ${report.hardcodedColorClassCount} | ${report.notes.join('<br>')} |`);

const md = `# Section Surface Audit

Generiert: ${summary.generatedAt}

Dieser Report vergleicht statisch Renderer-Templates, CMS-Preview-/Schema-Daten und Section-Color-Mapping.
Er ist bewusst streng: Wenn ein Admin-Farbfeld auf eine CSS-Variable zeigt, die das konkrete Template nicht verwendet, wird es als Phantom-Control markiert.

## Ergebnis

- Sections geprüft: ${summary.totals.sections}
- Sections mit fehlenden CMS-Datenfeldern: ${summary.totals.missingCmsFields}
- Sections mit fehlenden Color-Mappings für genutzte FE-CSS-Variablen: ${summary.totals.missingColorMappings}
- Sections mit Admin-Farbfeldern ohne nachweisbare FE-Nutzung: ${summary.totals.phantomColorControls}
- Sections mit generischem Color-Fallback: ${summary.totals.genericColorFallback}
- Sections mit hart codierten Tailwind-Farbklassen im Template: ${summary.totals.hardcodedColorClasses}

## Saubere Sections nach strengem Audit

${reports.filter((report) => report.notes.length === 0).map((report) => `- \`${report.type}\``).join('\n') || '- keine'}

## Auffällige Sections

Vollständige Details stehen in \`reports/section-surface-audit.json\` und \`reports/section-surface-audit.csv\`.

| Section | Component | FE-Felder fehlen | Color-Mappings fehlen | Phantom-Controls | Generisch | Hardcoded Colors | Hinweise |
| --- | --- | ---: | ---: | ---: | --- | ---: | --- |
${issueLines.join('\n')}
`;
fs.writeFileSync(mdPath, md);
console.log(JSON.stringify(summary, null, 2));
