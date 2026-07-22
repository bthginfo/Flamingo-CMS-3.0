import fs from 'node:fs';
import path from 'node:path';
import { SECTION_PREVIEW_DATA } from '../apps/renderer/src/lib/section-preview-data';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '../apps/renderer/src/lib/section-editor-field-defaults';
import { getSectionColorSlotForCssVar } from '../apps/renderer/src/lib/section-contracts';
import { FIELD_DEFS } from '../apps/renderer/src/lib/section-color-fields';
import { resolveColorContractForSection } from '../apps/renderer/src/lib/section-color-resolver';
import { getSectionSchemas } from '../apps/renderer/src/lib/section-data-schemas';

const root = process.cwd();
const templatesIndexPath = path.join(root, 'apps/renderer/src/templates/index.ts');
const templatesDir = path.join(root, 'apps/renderer/src/templates');
const dataEditorPath = path.join(root, 'apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx');
const reportsDir = path.join(root, 'reports');
const reportPath = path.join(reportsDir, 'section-surface-audit.json');
const csvPath = path.join(reportsDir, 'section-surface-audit.csv');
const mdPath = path.join(reportsDir, 'section-surface-audit.md');

type SectionReport = {
  type: string;
  industry: string | null;
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
  const dynamicRegex = /const\s+([A-Z][A-Za-z0-9]+)\s*=\s*dynamic\(\s*\(\)\s*=>\s*import\('([^']+)'\)/g;
  for (const match of indexSource.matchAll(dynamicRegex)) {
    imports.set(match[1], match[2]);
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

function extractConstObjectBody(source: string, constName: string) {
  const header = new RegExp(`(?:export\\s+)?const\\s+${constName}\\b[\\s\\S]*?=\\s*\\{`, 'm');
  const match = header.exec(source);
  if (!match) return '';
  const openBraceIndex = match.index + match[0].length - 1;
  return extractBalanced(source, openBraceIndex).slice(1, -1);
}

function parseFlatTemplateEntries(indexSource: string, constName: string) {
  const body = extractConstObjectBody(indexSource, constName);
  const entries: Array<{ type: string; component: string }> = [];
  for (const match of body.matchAll(/^\s*([a-zA-Z][\w]*)\s*:\s*([A-Z][A-Za-z0-9]+),?\s*$/gm)) {
    entries.push({ type: match[1], component: match[2] });
  }
  return entries;
}

function parseTemplateEntries(indexSource: string) {
  const entries: Array<{ type: string; component: string | null; industry: string | null }> = [];
  const seen = new Set<string>();
  const push = (industry: string | null, type: string, component: string | null) => {
    const key = `${industry || 'shared'}:${type}:${component || 'none'}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ industry, type, component });
  };

  for (const entry of parseFlatTemplateEntries(indexSource, 'SHARED_TEMPLATES')) {
    push(null, entry.type, entry.component);
  }

  const industryBody = extractConstObjectBody(indexSource, 'INDUSTRY_TEMPLATES');
  for (const match of industryBody.matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][A-Z0-9_]+),?\s*$/gm)) {
    for (const entry of parseFlatTemplateEntries(indexSource, match[2])) {
      push(match[1], entry.type, entry.component);
    }
  }

  for (const match of industryBody.matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{/gm)) {
    const industry = match[1];
    const start = match.index + match[0].length - 1;
    const body = extractBalanced(industryBody, start).slice(1, -1);
    for (const entryMatch of body.matchAll(/^\s*([a-zA-Z][\w]*)\s*:\s*([A-Z][A-Za-z0-9]+),?\s*$/gm)) {
      push(industry, entryMatch[1], entryMatch[2]);
    }
  }

  return entries;
}

function resolveTemplateFile(importPath: string | undefined, componentName?: string | null) {
  if (!importPath) return null;
  const base = path.join(root, 'apps/renderer/src/templates', importPath);
  const candidates = [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  const resolved = candidates.find((candidate) => fs.existsSync(candidate)) || null;
  if (!resolved || !componentName || !/index\.tsx?$/.test(resolved)) return resolved;

  const index = read(resolved);
  const exportRegex = /export\s+\{([\s\S]*?)\}\s+from\s+'([^']+)'/g;
  for (const match of index.matchAll(exportRegex)) {
    const specifiers = match[1].split(',').map((part) => part.trim()).filter(Boolean);
    const exportsComponent = specifiers.some((specifier) => {
      const [imported, alias] = specifier.split(/\s+as\s+/).map((part) => part.trim());
      return (alias || imported) === componentName;
    });
    if (!exportsComponent) continue;
    const nestedBase = path.join(path.dirname(resolved), match[2]);
    const nestedCandidates = [`${nestedBase}.tsx`, `${nestedBase}.ts`, path.join(nestedBase, 'index.tsx'), path.join(nestedBase, 'index.ts')];
    return nestedCandidates.find((candidate) => fs.existsSync(candidate)) || resolved;
  }
  return resolved;
}

function resolveTemplateImport(importPath: string, fromFile: string) {
  const base = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  const resolved = candidates.find((candidate) => fs.existsSync(candidate)) || null;
  return resolved && resolved.startsWith(templatesDir) ? resolved : null;
}

function collectTemplateSource(file: string | null, depth = 0, seen = new Set<string>()): string {
  if (!file || seen.has(file) || depth > 3) return '';
  seen.add(file);
  const source = read(file);
  const imports = [...source.matchAll(/import[\s\S]*?from\s+['"](\.[^'"]+)['"]/g)]
    .map((match) => resolveTemplateImport(match[1], file))
    .filter(Boolean) as string[];
  return [source, ...imports.map((child) => collectTemplateSource(child, depth + 1, seen))].join('\n');
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

function inferIndustryFromFile(file: string | null) {
  if (!file) return undefined;
  const normalized = file.replaceAll('\\', '/');
  const match = normalized.match(/apps\/renderer\/src\/templates\/([^/]+)\//);
  const industry = match?.[1];
  return CONTRACT_INDUSTRIES.includes(industry as never) ? industry : undefined;
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

const indexSource = read(templatesIndexPath);
const dataEditorSource = read(dataEditorPath);
const imports = parseImports(indexSource);
const mappings = parseSectionComponents(indexSource);
const templateEntries = parseTemplateEntries(indexSource);
const fieldDefs = new Map(Object.entries(FIELD_DEFS).map(([field, def]) => [field, def.cssVar]));
const cssVarByField = fieldDefs;

const SECTION_RENDERER_EFFECTIVE_VARS = [
  '--style-section-bg',
  '--token-section-bg',
  '--style-heading-color',
  '--style-text-primary',
  '--token-heading',
  '--style-body-color',
  '--style-text-secondary',
  '--token-body',
  '--style-badge-bg',
  '--style-badge-text',
  '--style-accent-color',
  '--brand-btn-bg',
  '--brand-btn-text',
  '--token-btn-bg',
  '--token-btn-text',
];

function hasEquivalent(cssVar: string, candidates: string[]) {
  if (candidates.includes(cssVar)) return true;
  const slot = getSectionColorSlotForCssVar(cssVar);
  return Boolean(slot && candidates.some((candidate) => getSectionColorSlotForCssVar(candidate) === slot));
}

const editorBlockStart = dataEditorSource.indexOf('const EDITORS');
const editorBlock = extractBalanced(dataEditorSource, editorBlockStart);
const dataEditorTypes = new Set([...editorBlock.matchAll(/^\s*([a-zA-Z]\w*)\s*:/gm)].map((match) => match[1]));

const CONTRACT_INDUSTRIES = [
  'tradesman',
  'restaurant',
  'salon',
  'hotel',
  'tourism',
  'medical',
  'wedding',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
  'bar',
  'verein',
] as const;

function getAuditedColorContract(type: string, file: string | null, explicitIndustry?: string | null) {
  const industry = explicitIndustry || inferIndustryFromFile(file);
  if (industry) {
    const specific = resolveColorContractForSection(type, industry);
    if (specific.source !== 'none') {
      return {
        fields: specific.fields,
        hasContract: true,
      };
    }
  }

  const direct = resolveColorContractForSection(type);
  const effective = direct.source !== 'none'
    ? [direct]
    : CONTRACT_INDUSTRIES
        .map((industry) => resolveColorContractForSection(type, industry))
        .filter((contract) => contract.source !== 'none');
  return {
    fields: unique(effective.flatMap((contract) => contract.fields)),
    hasContract: effective.length > 0,
  };
}

function getSchemaFieldsByType() {
  const fieldsByType = new Map<string, Record<string, unknown>>();
  for (const industry of CONTRACT_INDUSTRIES) {
    const schemas = getSectionSchemas(industry);
    for (const [type, schema] of Object.entries(schemas)) {
      const fields = (schema as { fields?: Record<string, unknown> }).fields || {};
      fieldsByType.set(type, { ...(fieldsByType.get(type) || {}), ...fields });
    }
  }
  return fieldsByType;
}

const schemaFieldsByType = getSchemaFieldsByType();
const entryTypes = new Set(templateEntries.map((entry) => entry.type));
const standaloneTypes = unique([...Object.keys(SECTION_PREVIEW_DATA), ...dataEditorTypes, ...schemaFieldsByType.keys()])
  .filter((type) => !entryTypes.has(type));
const auditEntries = [
  ...templateEntries,
  ...standaloneTypes.map((type) => ({ type, component: mappings.get(type) || null, industry: null })),
];
const SYSTEM_INJECTED_FIELDS = new Set([
  'error',
  'tenantId',
  'tenant',
  'tenantSlug',
  'sectionId',
  'industry',
  'locale',
  'preview',
]);

const FIELD_COVERAGE_GROUPS = [
  ['headline', 'heading', 'title'],
  ['subline', 'subtitle', 'subheadline', 'description', 'text', 'body', 'copy'],
  ['eyebrow', 'kicker', 'badge', 'badgeText', 'label'],
  ['image', 'bgImage', 'backgroundImage', 'imageSrc', 'imageUrl', 'media', 'photo', 'avatar', 'logo', 'logoUrl', 'storyImage'],
  ['primaryCta', 'cta', 'ctaPrimary', 'primaryButton', 'button'],
  ['secondaryCta', 'ctaSecondary', 'secondaryButton'],
  ['items', 'cards', 'manualCards', 'services', 'entries', 'features', 'benefits', 'highlights', 'steps', 'list'],
  ['facts', 'stats', 'metrics', 'numbers'],
  ['testimonials', 'reviews', 'quotes'],
] as const;

function isFieldCoveredByCms(field: string, cmsFields: string[]) {
  if (cmsFields.includes(field)) return true;
  const group = FIELD_COVERAGE_GROUPS.find((aliases) => aliases.includes(field as never));
  return Boolean(group && group.some((alias) => cmsFields.includes(alias)));
}

const reports: SectionReport[] = auditEntries.map(({ type, component, industry }) => {
  const file = resolveTemplateFile(component ? imports.get(component) : undefined, component);
  const source = file ? read(file) : '';
  const templateSource = collectTemplateSource(file);
  const feDataFields = parseFeDataFields(source).filter((field) => field !== 'id' && field !== 'type');
  const cmsRelevantFeDataFields = feDataFields.filter((field) => !SYSTEM_INJECTED_FIELDS.has(field));
  const cmsPreviewFields = unique([
    ...Object.keys(schemaFieldsByType.get(type) || {}),
    ...flattenFields(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}).map(topLevel),
    ...flattenFields(SECTION_PREVIEW_DATA[type] || {}).map(topLevel),
  ]);
  const missingCmsFields = cmsRelevantFeDataFields.filter((field) => !isFieldCoveredByCms(field, cmsPreviewFields));
  const feCssVars = unique([
    ...parseCssVars(templateSource),
    ...fieldsForHardcodedColorClasses(templateSource).map((field) => cssVarByField.get(field) || ''),
  ]);
  const colorContract = getAuditedColorContract(type, file ? path.relative(root, file).replaceAll('\\', '/') : null, industry);
  const adminColorFields = colorContract.fields.filter((field) => field !== 'sectionBgAlt');
  const adminColorCssVars = unique(adminColorFields.map((field) => fieldDefs.get(field) || ''));
  const missingColorCssVars = feCssVars
    .filter((cssVar) => cssVar.startsWith('--style-') || cssVar.startsWith('--brand-btn-'))
    .filter((cssVar) => !hasEquivalent(cssVar, adminColorCssVars));
  const effectiveFeCssVarsForAdminControls = unique([...feCssVars, ...SECTION_RENDERER_EFFECTIVE_VARS]);
  const phantomColorCssVars = adminColorCssVars.filter((cssVar) => !hasEquivalent(cssVar, effectiveFeCssVarsForAdminControls));
  const dataColorFields = feDataFields.filter((field) => /color|colour|farbe|overlay/i.test(field));
  const notes: string[] = [];
  if (!component) notes.push('Kein Template-Mapping gefunden');
  if (!file) notes.push('Template-Datei nicht auflösbar');
  if (missingCmsFields.length) notes.push('FE-Datenfelder fehlen im Preview-/Schema-Editor-Seed');
  if (missingColorCssVars.length) notes.push('FE-CSS-Variablen fehlen im Section-Color-Mapping');
  if (phantomColorCssVars.length) notes.push('Admin zeigt Color-Variablen, die dieses Template nicht verwendet');
  return {
    type,
    industry,
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
    genericColorFallback: !colorContract.hasContract,
    dataColorFields,
    hardcodedColorClassCount: parseHardcodedColorClasses(templateSource),
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
      industry: report.industry,
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
  ['type', 'industry', 'component', 'file', 'missingCmsFields', 'missingColorCssVars', 'phantomColorCssVars', 'genericColorFallback', 'hardcodedColorClassCount', 'notes'],
  ...reports.map((report) => [
    report.type,
    report.industry || '',
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
  .map((report) => `| \`${report.type}\` | ${report.industry || '-'} | ${report.component || '-'} | ${report.missingCmsFields.length} | ${report.missingColorCssVars.length} | ${report.phantomColorCssVars.length} | ${report.genericColorFallback ? 'ja' : 'nein'} | ${report.hardcodedColorClassCount} | ${report.notes.join('<br>')} |`);

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

| Section | Branche | Component | FE-Felder fehlen | Color-Mappings fehlen | Phantom-Controls | Generisch | Hardcoded Colors | Hinweise |
| --- | --- | --- | ---: | ---: | ---: | --- | ---: | --- |
${issueLines.join('\n')}
`;
fs.writeFileSync(mdPath, md);
console.log(JSON.stringify(summary, null, 2));
