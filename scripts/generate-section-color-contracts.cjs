/**
 * SIMPLE CODEGEN - single source of truth for editor field lists.
 *
 * For every (industry, sectionType) pair registered in templates/index.ts:
 *   1. Resolve the EXACT template component file
 *   2. Recursively follow same-dir + ../shared imports (3 levels deep)
 *   3. Extract every var(--token-NAME) reference
 *   4. Reverse-map each --token-NAME to the ColorFieldKey whose cssVar
 *      matches it (using the FIELD_DEFS table parsed from
 *      section-color-fields.ts).
 *   5. Sort by canonical editor order, dedupe, emit two maps:
 *        SECTION_COLOR_CONTRACTS_GENERATED         // per-industry key
 *        SECTION_COLOR_CONTRACTS_GENERIC           // by type alone (shared templates only)
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
const FIELD_REGISTRY_FILE = path.join(ROOT, 'apps/renderer/src/lib/section-color-fields.ts');
const OUTPUT_FILE = path.join(ROOT, 'apps/renderer/src/lib/section-color-contracts-generated.ts');

// ----------------------------------------------------------------------
// 1. Parse FIELD_DEFS from the editor so we get a precise
//    cssVar -> ColorFieldKey mapping. No drift possible - the editor
//    file is the registry.
// ----------------------------------------------------------------------
function loadFieldRegistry() {
  const src = fs.readFileSync(FIELD_REGISTRY_FILE, 'utf8');
  const m = src.match(/export const FIELD_DEFS:[^=]*=\s*{([\s\S]*?)\n};/);
  if (!m) throw new Error('Could not parse FIELD_DEFS');
  const body = m[1];
  const cssVarToField = new Map();
  const entryRe = /^\s*([a-zA-Z][\w]*)\s*:\s*\{\s*cssVar:\s*'(--[a-z0-9-]+)'/gm;
  let em;
  while ((em = entryRe.exec(body)) !== null) {
    cssVarToField.set(em[2], em[1]);
  }
  const orderMatch = src.match(/export const FIELD_RENDER_ORDER:[^=]*=\s*\[([\s\S]*?)\];/);
  if (!orderMatch) throw new Error('Could not parse FIELD_RENDER_ORDER');
  const fieldOrder = [];
  const orderRe = /'([a-zA-Z][\w]*)'/g;
  let om;
  while ((om = orderRe.exec(orderMatch[1])) !== null) fieldOrder.push(om[1]);

  return { cssVarToField, fieldOrder };
}

// ----------------------------------------------------------------------
// 2. Resolve every Component -> file from templates/index.ts.
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
  // Each entry may be `Foo` or `Foo as Bar` - we want the alias if present
  // because that's the name used in the INDUSTRY_TEMPLATES object.
  return raw.split(',').map((s) => {
    const t = s.trim();
    const asMatch = t.match(/^\s*\w+\s+as\s+(\w+)\s*$/);
    return asMatch ? asMatch[1] : t;
  }).filter(Boolean);
}

function extractConstObjectBody(src, constName) {
  const header = new RegExp(`const\\s+${constName}\\s*:[^=]*=\\s*\\{`, 'm');
  const m = header.exec(src);
  if (!m) return null;

  const openBraceIdx = m.index + m[0].length - 1;
  let depth = 1;
  let i = openBraceIdx + 1;
  while (depth > 0 && i < src.length) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  return src.slice(openBraceIdx + 1, i - 1);
}

function parseFlatTemplateMap(src, constName) {
  const body = extractConstObjectBody(src, constName);
  if (!body) return [];

  const entries = [];
  const entryRe = /^\s*([a-zA-Z][\w]*)\s*:\s*([A-Z][A-Za-z0-9]+),?\s*$/gm;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    entries.push({ type: m[1], componentName: m[2] });
  }
  return entries;
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

  // sectionType -> Set<{ industry, componentName }>, parsed from the
  // INDUSTRY_TEMPLATES literal (an industry-keyed object of {type:Component}).
  const industryTypeComponent = []; // { industry, type, componentName }
  const seenIndustryEntries = new Set();

  const pushIndustryEntries = (industry, entries) => {
    for (const entry of entries) {
      const key = `${industry}.${entry.type}.${entry.componentName}`;
      if (seenIndustryEntries.has(key)) continue;
      seenIndustryEntries.add(key);
      industryTypeComponent.push({ industry, type: entry.type, componentName: entry.componentName });
    }
  };

  const industryTemplatesBody = extractConstObjectBody(src, 'INDUSTRY_TEMPLATES') || '';

  // Some industries are registered through named maps, e.g.
  // `restaurant: RESTAURANT_TEMPLATES`. Resolve those maps before walking
  // inline industry blocks, otherwise these industries silently fall back to
  // generic color contracts.
  const referencedMapRe = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][A-Z0-9_]+),?\s*$/gm;
  let rm;
  while ((rm = referencedMapRe.exec(industryTemplatesBody)) !== null) {
    pushIndustryEntries(rm[1], parseFlatTemplateMap(src, rm[2]));
  }

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
      pushIndustryEntries(industry, [{ type: em[1], componentName: em[2] }]);
    }
  }

  const sharedTypeComponent = parseFlatTemplateMap(src, 'SHARED_TEMPLATES');

  return { componentToFile, industryTypeComponent, sharedTypeComponent };
}

// ----------------------------------------------------------------------
// 3. Extract --token-* references from a template + local imports
//    (3 levels deep). Stops at any import outside src/templates.
// ----------------------------------------------------------------------
const TOKEN_REF_RE = /var\(\s*(--token-[a-z0-9-]+)/gi;

function extractTokenVars(filePath, depth = 0, seen = new Set()) {
  if (seen.has(filePath) || depth > 3) return new Set();
  seen.add(filePath);
  if (!fs.existsSync(filePath)) return new Set();
  const src = fs.readFileSync(filePath, 'utf8');
  const vars = new Set();
  let m;
  const re = new RegExp(TOKEN_REF_RE.source, 'gi');
  while ((m = re.exec(src)) !== null) vars.add(m[1]);
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
function build() {
  const { cssVarToField, fieldOrder } = loadFieldRegistry();
  const orderIdx = (f) => {
    const i = fieldOrder.indexOf(f);
    return i < 0 ? 999 : i;
  };
  const { componentToFile, industryTypeComponent, sharedTypeComponent } = loadTemplateRegistry();

  const perIndustry = {};   // 'heroSalon' -> ColorFieldKey[]
  const perType = {};       // 'hero' -> ColorFieldKey[] (shared templates only)
  const perAnySet = {};     // 'hero' -> Set<ColorFieldKey> (UNION across every industry)
  const stats = {
    industryEntries: 0,
    industryResolved: 0,
    industryMissing: [],
    sharedEntries: sharedTypeComponent.length,
    sharedResolved: 0,
    sharedMissing: [],
    unmappedTokens: [],
  };

  for (const { industry, type, componentName } of industryTypeComponent) {
    stats.industryEntries++;
    const file = componentToFile.get(componentName);
    if (!file) { stats.industryMissing.push(`${industry}.${type} (${componentName})`); continue; }
    stats.industryResolved++;

    const tokens = extractTokenVars(file);
    const fieldSet = new Set();
    // sectionBg is ALWAYS available - every section can have its background changed
    fieldSet.add('sectionBg');
    for (const t of tokens) {
      const field = cssVarToField.get(t);
      if (field) fieldSet.add(field);
      else stats.unmappedTokens.push(`${industry}.${type} (${componentName}): ${t}`);
    }
    const fields = [...fieldSet].sort((a, b) => orderIdx(a) - orderIdx(b));

    const industryKey = type + industry.charAt(0).toUpperCase() + industry.slice(1);
    perIndustry[industryKey] = fields;

    // Cross-industry union per type. The renderer falls back to ALL_TEMPLATES
    // (any industry's component) when a section is borrowed into an industry
    // that does not define it. The contract resolver mirrors that fallback via
    // this union, so a borrowed section never collapses to background-only.
    // A union (not the single reduce-winner) keeps the contract a guaranteed
    // SUPERSET of whatever variant renders; the runtime DOM scan hides any
    // field the actually-rendered variant does not paint.
    if (!perAnySet[type]) perAnySet[type] = new Set();
    for (const f of fieldSet) perAnySet[type].add(f);
  }

  for (const { type, componentName } of sharedTypeComponent) {
    const file = componentToFile.get(componentName);
    if (!file) { stats.sharedMissing.push(`${type} (${componentName})`); continue; }
    stats.sharedResolved++;

    const tokens = extractTokenVars(file);
    if (!perType[type]) perType[type] = new Set();
    perType[type].add('sectionBg');
    for (const t of tokens) {
      const field = cssVarToField.get(t);
      if (field) perType[type].add(field);
      else stats.unmappedTokens.push(`${type} (${componentName}): ${t}`);
    }
  }

  // Materialize shared template contracts in canonical order.
  const perTypeArr = {};
  for (const [t, set] of Object.entries(perType)) {
    perTypeArr[t] = [...set].sort((a, b) => orderIdx(a) - orderIdx(b));
  }

  // Materialize the cross-industry union map in canonical order.
  const perAnyArr = {};
  for (const [t, set] of Object.entries(perAnySet)) {
    perAnyArr[t] = [...set].sort((a, b) => orderIdx(a) - orderIdx(b));
  }

  return { perIndustry, perType: perTypeArr, perAny: perAnyArr, stats };
}

// ----------------------------------------------------------------------
// 5. Emit.
// ----------------------------------------------------------------------
function render(perIndustry, perType, perAny) {
  const lines = [];
  lines.push(`// AUTO-GENERATED by scripts/generate-section-color-contracts.cjs - DO NOT EDIT BY HAND.`);
  lines.push(`// Regenerate after ANY template change with:`);
  lines.push(`//   node scripts/generate-section-color-contracts.cjs`);
  lines.push(`//`);
  lines.push(`// Each entry is the EXACT list of color fields the corresponding template`);
  lines.push(`// reads via var(--token-*). Reverse-mapped from FIELD_DEFS in`);
  lines.push(`// section-color-fields.ts. No heuristics, no fallbacks.`);
  lines.push(``);
  lines.push(`import type { ColorFieldKey } from '@/lib/section-color-fields';`);
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
    'Per-industry contracts (keyed as `${type}${IndustryPascal}` - e.g. heroSalon).',
    perIndustry,
  );
  emit(
    'SECTION_COLOR_CONTRACTS_GENERIC',
    'Generic per-type contracts (shared templates only, never a cross-industry union).',
    perType,
  );
  emit(
    'SECTION_COLOR_CONTRACTS_ANY',
    'Cross-industry UNION per type. Last-resort fallback that mirrors the renderer borrowing a component from ALL_TEMPLATES when a section is used in an industry that does not define it. Superset by design; the runtime DOM scan hides fields the rendered variant does not paint.',
    perAny,
  );
  return lines.join('\n');
}

function main() {
  const { perIndustry, perType, perAny, stats } = build();
  if (stats.unmappedTokens.length) {
    console.error(`Unmapped --token-* references: ${stats.unmappedTokens.length}`);
    for (const entry of stats.unmappedTokens.slice(0, 30)) {
      console.error('  - ' + entry);
    }
    if (stats.unmappedTokens.length > 30) {
      console.error(`  ... ${stats.unmappedTokens.length - 30} more`);
    }
    throw new Error('Color contract generation failed because template tokens are missing from FIELD_DEFS.');
  }

  const out = render(perIndustry, perType, perAny);
  fs.writeFileSync(OUTPUT_FILE, out);

  console.log(`Industry entries scanned:  ${stats.industryEntries}`);
  console.log(`Industry resolved:         ${stats.industryResolved}`);
  console.log(`Industry missing:          ${stats.industryMissing.length}`);
  if (stats.industryMissing.length) stats.industryMissing.slice(0, 10).forEach((m) => console.log('  - ' + m));
  console.log(`Shared entries scanned:    ${stats.sharedEntries}`);
  console.log(`Shared resolved:           ${stats.sharedResolved}`);
  console.log(`Shared missing:            ${stats.sharedMissing.length}`);
  if (stats.sharedMissing.length) stats.sharedMissing.slice(0, 10).forEach((m) => console.log('  - ' + m));
  console.log(`Per-industry keys written: ${Object.keys(perIndustry).length}`);
  console.log(`Per-type keys written:     ${Object.keys(perType).length}`);
  console.log(`Cross-industry keys (ANY): ${Object.keys(perAny).length}`);
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)}`);
}

// Exported so the render-mirror guard can reuse the exact same registry parsing
// and token extraction instead of re-implementing (and drifting from) it.
module.exports = {
  build,
  render,
  loadFieldRegistry,
  loadTemplateRegistry,
  extractTokenVars,
  resolveImport,
  TEMPLATES_DIR,
};

if (require.main === module) main();
