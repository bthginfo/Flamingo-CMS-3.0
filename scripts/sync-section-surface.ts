import fs from 'node:fs';
import path from 'node:path';
import { SECTION_PREVIEW_DATA } from '../apps/renderer/src/lib/section-preview-data';

const root = process.cwd();
const templatesIndexPath = path.join(root, 'apps/renderer/src/templates/index.ts');
const defaultsPath = path.join(root, 'apps/renderer/src/lib/section-editor-field-defaults.ts');

const VAR_TO_FIELD: Record<string, string> = {
  '--style-section-bg': 'sectionBg',
  '--style-section-bg-alt': 'sectionBgAlt',
  '--style-card-bg': 'cardBg',
  '--style-heading-color': 'headingColor',
  '--style-subheading-color': 'subheadingColor',
  '--style-body-color': 'bodyColor',
  '--style-text-muted': 'mutedColor',
  '--style-icon-color': 'iconColor',
  '--style-accent-color': 'accentColor',
  '--brand-btn-bg': 'btnBg',
  '--brand-btn-text': 'btnText',
  '--brand-btn-secondary-bg': 'btnSecondaryBg',
  '--brand-btn-secondary-text': 'btnSecondaryText',
  '--style-badge-bg': 'badgeBg',
  '--style-badge-text': 'badgeText',
  '--style-badge-border': 'badgeBorder',
  '--style-border-color': 'borderColor',
  '--style-divider-color': 'dividerColor',
  '--style-card-radius': 'cardRadius',
  '--style-card-shadow': 'cardShadow',
  '--style-button-radius': 'buttonRadius',
  '--style-text-primary': 'textPrimary',
  '--style-text-secondary': 'textSecondary',
  '--style-brand': 'styleBrand',
  '--brand-primary': 'brandPrimary',
  '--brand-accent': 'brandAccent',
  '--style-card-border': 'cardBorder',
  '--style-card-border-color': 'cardBorderColor',
  '--style-heading-weight': 'headingWeight',
  '--style-heading-tracking': 'headingTracking',
  '--color-primary': 'colorPrimary',
};

const FIELD_ORDER = Object.values(VAR_TO_FIELD);

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
    for (const specifier of match[1].split(',').map((part) => part.trim()).filter(Boolean)) {
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
  return unique(fields).filter((field) => field !== 'id' && field !== 'type');
}

function parseCssVars(source: string) {
  const vars = new Set<string>();
  for (const match of source.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)) vars.add(match[1]);
  return unique(vars);
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

function flattenTopLevel(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
}

function defaultForField(field: string): unknown {
  if (/^(primaryCta|secondaryCta|cta|ctaPrimary|ctaSecondary|link|primaryButton|secondaryButton)$/i.test(field)) return { label: '', href: '' };
  if (/columns/i.test(field)) return 3;
  if (/opacity|count|limit|delay|height|width|intensity|duration|rating|price|number/i.test(field)) return 0;
  if (/headline|subline|title|label|text|href|image|icon|badge|eyebrow|slug|url|mode|align|overlay/i.test(field)) return '';
  if (/items|cards|steps|facts|values|stats|services|features|links|images|logos|rows|members|projects|packages|entries|slides|panels|highlights|trustItems|formFields|categories/i.test(field)) return [];
  if (/show|enabled|disabled|reversed|highlighted|expandFirst|valid|success|error/i.test(field)) return false;
  return '';
}

function generateDefaults(sectionFields: Map<string, string[]>) {
  const defaults: Record<string, Record<string, unknown>> = {};
  for (const [type, fields] of sectionFields) {
    const previewKeys = new Set(flattenTopLevel(SECTION_PREVIEW_DATA[type]));
    const missing = fields.filter((field) => !previewKeys.has(field));
    if (missing.length) {
      defaults[type] = Object.fromEntries(missing.map((field) => [field, defaultForField(field)]));
    }
  }
  return defaults;
}

const indexSource = read(templatesIndexPath);
const imports = parseImports(indexSource);
const mappings = parseSectionComponents(indexSource);
const sectionDataFields = new Map<string, string[]>();
const sectionColorFields = new Map<string, string[]>();

for (const [type, component] of mappings) {
  const file = resolveTemplateFile(imports.get(component));
  if (!file) continue;
  const source = read(file);
  sectionDataFields.set(type, parseFeDataFields(source));
  const fields = [
    ...parseCssVars(source)
    .map((cssVar) => VAR_TO_FIELD[cssVar])
    .filter(Boolean),
    ...fieldsForHardcodedColorClasses(source),
  ];
  sectionColorFields.set(type, unique(fields).sort((a, b) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b)));
}

const defaults = generateDefaults(sectionDataFields);
const defaultsSource = `// Generated by scripts/sync-section-surface.ts.\n// Fallback defaults ensure newly added/reused sections expose every top-level FE data field in the CMS editor.\nexport const SECTION_EDITOR_FIELD_DEFAULTS: Record<string, Record<string, unknown>> = ${JSON.stringify(defaults, null, 2)};\n`;

// --check: fail when the committed defaults drifted from what the templates
// actually read — CI gate so template changes can't silently lose their
// admin editor fields.
if (process.argv.includes('--check')) {
  if (read(defaultsPath) !== defaultsSource) {
    console.error('section-editor-field-defaults.ts is out of sync with the templates.');
    console.error('Run: npm run sync:section-surface  (and commit the result)');
    process.exit(1);
  }
  console.log('section surface in sync');
  process.exit(0);
}

fs.writeFileSync(defaultsPath, defaultsSource);

console.log(JSON.stringify({
  colorMappings: sectionColorFields.size,
  colorMappingsSource: 'section-color-contracts-generated.ts via scripts/generate-section-color-contracts.cjs',
  defaults: Object.keys(defaults).length,
  defaultsPath: path.relative(root, defaultsPath),
}, null, 2));
