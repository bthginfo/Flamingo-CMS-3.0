/**
 * SIMPLE CODEGEN � single source of truth for editor field lists.
 *
 * For every (industry, sectionType) pair registered in templates/index.ts:
 *   1. Resolve the EXACT template component file
 *   2. Recursively follow same-dir + ../shared imports (3 levels deep)
 *   3. Extract every var(--token-NAME) reference
 *   4. Reverse-map each --token-NAME to the ColorFieldKey whose cssVar
 *      matches it (using the FIELD_DEFS table parsed from
 *      section-color-editor.tsx).
 *   5. Sort by canonical editor order, dedupe, emit two maps:
 *        SECTION_COLOR_CONTRACTS_GENERATED         // per-industry key
 *        SECTION_COLOR_CONTRACTS_GENERIC           // by type alone (union)
 *
 * No slot aliases, no curated overrides, no legacy fallbacks. What the
 * template literally renders is what the editor shows. Period.
 *
 * Re-run after ANY template change:
 *   node scripts/generate-section-color-contracts.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');
const TEMPLATES_INDEX = path.join(TEMPLATES_DIR, 'index.ts');
const EDITOR_FILE = path.join(ROOT, 'apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
const OUTPUT_FILE = path.join(ROOT, 'apps/renderer/src/lib/section-color-contracts-generated.ts');

// ----------------------------------------------------------------------
// 1. Parse FIELD_DEFS from the editor so we get a precise
//    cssVar ? ColorFieldKey mapping. No drift possible � the editor
//    file is the registry.
// ----------------------------------------------------------------------
function loadFieldDefs() {
  const src = fs.readFileSync(EDITOR_FILE, 'utf8');
  const m = src.match(/const FIELD_DEFS:[^=]*=\s*{([\s\S]*?)\n};/);
  if (!m) throw new Error('Could not parse FIELD_DEFS');
  const body = m[1];
  const cssVarToField = new Map();
  const entryRe = /^\s*([a-zA-Z][\w]*)\s*:\s*\{\s*cssVar:\s*'(--[a-z0-9-]+)'/gm;
  let em;
  while ((em = entryRe.exec(body)) !== null) {
    cssVarToField.set(em[2], em[1]);
  }
  return cssVarToField;
}

// ----------------------------------------------------------------------
// 2. Resolve every Component ? file from templates/index.ts.
// ----------------------------------------------------------------------
function resolveImport(rel, fromDir) {
  const abs = path.resolve(fromDir, rel);
  for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const c = abs + ext;
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function parseImportNames(raw) {
  // Each entry may be `Foo` or `Foo as Bar` � we want the alias if present
  // because that's the name used in the INDUSTRY_TEMPLATES object.
  return raw.split(',').map((s) => {
    const t = s.trim();
    const asMatch = t.match(/^\s*\w+\s+as\s+(\w+)\s*$/);
    return asMatch ? asMatch[1] : t;
  }).filter(Boolean);
}

function loadTemplateRegistry() {
  const src = fs.readFileSync(TEMPLATES_INDEX, 'utf8');
  const componentToFile = new Map();

  // Direct imports from templates/index.ts (top of file)
  const directRe = /import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"](\.[^'"]+)['"]/g;
  let m;
  while ((m = directRe.exec(src)) !== null) {
    const names = parseImportNames(m[1]);
    const resolved = resolveImport(m[2], TEMPLATES_DIR);
    if (!resolved) continue;
    for (const n of names) componentToFile.set(n, resolved);
  }

  // Re-resolve any name that landed in an industry-level index.ts (e.g. ./salon)
  // by walking that index for its named re-exports.
  const indexFollow = new Set();
  for (const [, file] of componentToFile) {
    if (/[\/\\]index\.tsx?$/.test(file)) indexFollow.add(file);
  }
  for (const indexFile of indexFollow) {
    const sub = fs.readFileSync(indexFile, 'utf8');
    const namedRe = /export\s+(?:type\s+)?{([^}]+)}\s+from\s+['"](\.[^'"]+)['"]/g;
    let sm;
    while ((sm = namedRe.exec(sub)) !== null) {
      const names = parseImportNames(sm[1]);
      const resolved = resolveImport(sm[2], path.dirname(indexFile));
      if (!resolved) continue;
      for (const n of names) {
        const existing = componentToFile.get(n);
        if (!existing || /[\/\\]index\.tsx?$/.test(existing)) {
          componentToFile.set(n, resolved);
        }
      }
    }
  }

  // sectionType ? Set<{ industry, componentName }>, parsed from the
  // INDUSTRY_TEMPLATES literal (an industry-keyed object of {type:Component}).
  const industryTypeComponent = []; // { industry, type, componentName }

  // Top-level industry blocks live as `industryKey: { type: Component, ... },`
  // We match every `<word>: { ... },` block whose body has the shape `type: Component,`.
  // Use a manual brace-walker to avoid regex pitfalls.
  let cursor = 0;
  const industryNameRe = /^\s{2}([a-zA-Z][a-zA-Z0-9]*):\s*\{$/gm;
  let im;
  while ((im = industryNameRe.exec(src)) !== null) {
    const industry = im[1];
    let depth = 1;
    let i = im.index + im[0].length;
    const start = i;
    while (depth > 0 && i < src.length) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    const body = src.slice(start, i - 1);
    const entryRe = /^\s*([a-zA-Z][\w]*)\s*:\s*([A-Z][A-Za-z0-9]+),?\s*$/gm;
    let em;
    while ((em = entryRe.exec(body)) !== null) {
      industryTypeComponent.push({ industry, type: em[1], componentName: em[2] });
    }
  }

  return { componentToFile, industryTypeComponent };
}

// ----------------------------------------------------------------------
// 3. Extract --token-* references from a template + local imports
//    (3 levels deep). Stops at any import outside src/templates.
// ----------------------------------------------------------------------
const TOKEN_REF_RE = /var\(\s*(--(?:token|style|brand)-[a-z0-9-]+)/gi;

function extractTokenVars(filePath, depth = 0, seen = new Set()) {
  if (seen.has(filePath) || depth > 3) return new Set();
  seen.add(filePath);
  if (!fs.existsSync(filePath)) return new Set();
  const src = fs.readFileSync(filePath, 'utf8');
  const vars = new Set();
  let m;
  const re = new RegExp(TOKEN_REF_RE.source, 'gi');
  while ((m = re.exec(src)) !== null) { const canonical = LEGACY_ALIASES.get(m[1]) || m[1]; vars.add(canonical); }
  // Follow relative imports inside src/templates only
  const importRe = /import[\s\S]*?from\s+['"](\.[^'"]+)['"]/g;
  while ((m = importRe.exec(src)) !== null) {
    const resolved = resolveImport(m[1], path.dirname(filePath));
    if (!resolved) continue;
    if (!resolved.startsWith(TEMPLATES_DIR)) continue;
    for (const v of extractTokenVars(resolved, depth + 1, seen)) vars.add(v);
  }
  return vars;
}

// ----------------------------------------------------------------------
// 4. Build the contracts.
// ----------------------------------------------------------------------
const FIELD_ORDER = [
  'sectionBg', 'sectionBgAlt', 'cardBg',
  'headingColor', 'cardHeadingColor', 'subheadingColor', 'bodyColor', 'cardBodyColor', 'mutedColor', 'cardMutedColor',
  'iconColor', 'cardIconColor', 'accentColor',
  'linkColor', 'linkHoverColor',
  'onDarkHeading', 'onDarkBody', 'onDarkMuted',
  'imageOverlay',
  'eyebrow', 'statValue', 'quoteMark', 'ratingStar', 'check',
  'priceColor', 'priceStrikeColor',
  'btnBg', 'btnText',
  'btnSecondaryBg', 'btnSecondaryText', 'btnSecondaryBorder',
  'badgeBg', 'badgeText', 'badgeBorder',
  'cardBadgeBg', 'cardBadgeText',
  'inputBg', 'inputBorder', 'inputText', 'labelColor',
  'borderColor', 'dividerColor',
  'cardRadius', 'buttonRadius',
  'cardShadow', 'headingWeight', 'headingTracking',
  'successColor', 'successBg', 'dangerColor', 'dangerBg',
];
const orderIdx = (f) => { const i = FIELD_ORDER.indexOf(f); return i < 0 ? 999 : i; };


// Legacy CSS var aliases ? canonical --token-* name
const LEGACY_ALIASES = new Map([
  ['--style-section-bg', '--token-section-bg'],
  ['--style-card-bg', '--token-card-bg'],
  ['--style-heading-color', '--token-heading'],
  ['--style-heading', '--token-heading'],
  ['--style-subheading-color', '--token-subheading'],
  ['--style-subheading', '--token-subheading'],
  ['--style-body-color', '--token-body'],
  ['--style-body', '--token-body'],
  ['--style-text-muted', '--token-muted'],
  ['--style-muted', '--token-muted'],
  ['--style-icon-color', '--token-icon'],
  ['--style-accent-color', '--token-accent'],
  ['--style-eyebrow', '--token-eyebrow'],
  ['--style-stat-value', '--token-stat-value'],
  ['--style-quote', '--token-quote'],
  ['--style-rating-star', '--token-rating-star'],
  ['--style-check', '--token-check'],
  ['--brand-btn-bg', '--token-btn-bg'],
  ['--style-button-bg', '--token-btn-bg'],
  ['--brand-btn-text', '--token-btn-text'],
  ['--style-button-text', '--token-btn-text'],
  ['--style-badge-bg', '--token-badge-bg'],
  ['--style-badge-text', '--token-badge-text'],
  ['--style-card-border', '--token-card-border'],
  ['--style-border', '--token-card-border'],
  ['--style-divider', '--token-divider'],
  ['--brand-primary', '--token-accent'],
]);

function build() {
  const cssVarToField = loadFieldDefs();
  const { componentToFile, industryTypeComponent } = loadTemplateRegistry();

  const perIndustry = {};   // 'heroSalon' ? ColorFieldKey[]
  const perType = {};       // 'hero' ? ColorFieldKey[] (union)
  const stats = { entries: 0, resolved: 0, missing: [] };

  for (const { industry, type, componentName } of industryTypeComponent) {
    stats.entries++;
    const file = componentToFile.get(componentName);
    if (!file) { stats.missing.push(`${industry}.${type} (${componentName})`); continue; }
    stats.resolved++;

    const tokens = extractTokenVars(file);
    const fieldSet = new Set();
    for (const t of tokens) {
      const field = cssVarToField.get(t);
      if (field) fieldSet.add(field);
    }
    const fields = [...fieldSet].sort((a, b) => orderIdx(a) - orderIdx(b));

    const industryKey = type + industry.charAt(0).toUpperCase() + industry.slice(1);
    perIndustry[industryKey] = fields;

    if (!perType[type]) perType[type] = new Set();
    for (const f of fields) perType[type].add(f);
  }
  // Materialize unions in canonical order
  const perTypeArr = {};
  for (const [t, set] of Object.entries(perType)) {
    perTypeArr[t] = [...set].sort((a, b) => orderIdx(a) - orderIdx(b));
  }

  return { perIndustry, perType: perTypeArr, stats };
}

// ----------------------------------------------------------------------
// 5. Emit.
// ----------------------------------------------------------------------
function render(perIndustry, perType) {
  const lines = [];
  lines.push(`// AUTO-GENERATED by scripts/generate-section-color-contracts.cjs � DO NOT EDIT BY HAND.`);
  lines.push(`// Regenerate after ANY template change with:`);
  lines.push(`//   node scripts/generate-section-color-contracts.cjs`);
  lines.push(`//`);
  lines.push(`// Each entry is the EXACT list of color fields the corresponding template`);
  lines.push(`// reads via var(--token-*). Reverse-mapped from FIELD_DEFS in`);
  lines.push(`// section-color-editor.tsx. No heuristics, no fallbacks.`);
  lines.push(``);
  lines.push(`import type { ColorFieldKey } from '@/app/admin/pages/[id]/section-color-editor';`);
  lines.push(``);

  const emit = (name, doc, map) => {
    lines.push(`// ${doc}`);
    lines.push(`export const ${name}: Partial<Record<string, ColorFieldKey[]>> = {`);
    const keys = Object.keys(map).sort();
    for (const k of keys) {
      const arr = map[k];
      const literal = arr.length === 0 ? '[]' : '[' + arr.map((s) => `'${s}'`).join(', ') + ']';
      lines.push(`  ${k}: ${literal},`);
    }
    lines.push(`};`);
    lines.push(``);
  };
  emit(
    'SECTION_COLOR_CONTRACTS_GENERATED',
    'Per-industry contracts (keyed as `${type}${IndustryPascal}` � e.g. heroSalon).',
    perIndustry,
  );
  emit(
    'SECTION_COLOR_CONTRACTS_GENERIC',
    'Generic per-type contracts (union across all industries, fallback only).',
    perType,
  );
  return lines.join('\n');
}

function main() {
  const { perIndustry, perType, stats } = build();
  const out = render(perIndustry, perType);
  fs.writeFileSync(OUTPUT_FILE, out);

  console.log(`Industry entries scanned:  ${stats.entries}`);
  console.log(`Resolved (template found): ${stats.resolved}`);
  console.log(`Missing:                   ${stats.missing.length}`);
  if (stats.missing.length) stats.missing.slice(0, 10).forEach((m) => console.log('  - ' + m));
  console.log(`Per-industry keys written: ${Object.keys(perIndustry).length}`);
  console.log(`Per-type keys written:     ${Object.keys(perType).length}`);
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();
