/**
 * Smart codegen for SECTION_COLOR_CONTRACTS.
 *
 * For every sectionType registered in apps/renderer/src/templates/index.ts:
 *   1. Resolve the template component file via the import map
 *   2. Read the file + recursively follow same-dir / shared imports (1 level)
 *   3. Extract every CSS-var reference (var(--something) or '--something':)
 *   4. Map each CSS var to a SectionColorSlot via SECTION_COLOR_SLOT_ALIASES
 *      (re-read from apps/renderer/src/lib/section-contracts.ts at build time)
 *   5. Map slots to ColorFieldKey via the contract editor's
 *      CONTRACT_FIELD_BY_SLOT map
 *   6. Aggregate across all industries that use the sectionType, dedupe by
 *      slot — if both --token-X and --style-Y point to the same slot, the
 *      slot appears exactly once (no legacy duplicates).
 *
 * Writes apps/renderer/src/lib/section-color-contracts-generated.ts which
 * exports SECTION_COLOR_CONTRACTS_GENERATED. The editor then prefers this
 * generated map over the hand-curated map (which is kept for manual
 * overrides when codegen mis-detects).
 *
 * Run:
 *   node scripts/generate-section-color-contracts.cjs
 *   node scripts/generate-section-color-contracts.cjs --check  (CI mode)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');
const TEMPLATES_INDEX = path.join(TEMPLATES_DIR, 'index.ts');
const SECTION_CONTRACTS_FILE = path.join(ROOT, 'apps/renderer/src/lib/section-contracts.ts');
const EDITOR_FILE = path.join(ROOT, 'apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
const OUTPUT_FILE = path.join(ROOT, 'apps/renderer/src/lib/section-color-contracts-generated.ts');

const CHECK_MODE = process.argv.includes('--check');

// ─── Parse SECTION_COLOR_SLOT_ALIASES from section-contracts.ts ─────────────
function loadVarToSlot() {
  const src = fs.readFileSync(SECTION_CONTRACTS_FILE, 'utf8');
  const block = src.match(/SECTION_COLOR_SLOT_ALIASES[\s\S]*?=\s*{([\s\S]*?)};\s*\n/);
  if (!block) throw new Error('Could not parse SECTION_COLOR_SLOT_ALIASES');
  const map = new Map();
  const lineRe = /^\s*([a-zA-Z]+):\s*\[([^\]]+)\]/gm;
  let m;
  while ((m = lineRe.exec(block[1])) !== null) {
    const slot = m[1];
    const vars = m[2].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    for (const v of vars) {
      if (!map.has(v)) map.set(v, slot);
    }
  }
  return map;
}

// ─── Parse CONTRACT_FIELD_BY_SLOT from section-color-editor.tsx ─────────────
function loadSlotToField() {
  const src = fs.readFileSync(EDITOR_FILE, 'utf8');
  const block = src.match(/CONTRACT_FIELD_BY_SLOT[\s\S]*?=\s*{([\s\S]*?)};\s*\n/);
  if (!block) throw new Error('Could not parse CONTRACT_FIELD_BY_SLOT');
  const map = new Map();
  const lineRe = /^\s*([a-zA-Z]+):\s*['"]([a-zA-Z]+)['"]/gm;
  let m;
  while ((m = lineRe.exec(block[1])) !== null) {
    map.set(m[1], m[2]);
  }
  return map;
}

// ─── Parse INDUSTRY_TEMPLATES + ComponentName→FilePath from templates/index.ts
function loadTemplateRegistry() {
  const src = fs.readFileSync(TEMPLATES_INDEX, 'utf8');
  // ComponentName → file path
  const componentToFile = new Map();
  const importRe = /import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"](\.[^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    const names = m[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/g, ''));
    const rel = m[2];
    // Resolve rel path relative to TEMPLATES_DIR
    const abs = path.resolve(TEMPLATES_DIR, rel);
    const candidates = [abs + '.tsx', abs + '.ts', path.join(abs, 'index.tsx'), path.join(abs, 'index.ts')];
    let resolved = null;
    for (const c of candidates) { if (fs.existsSync(c)) { resolved = c; break; } }
    if (!resolved) continue;
    for (const n of names) componentToFile.set(n, resolved);
  }
  // Re-exports like `export * from './shared'` AND `export { Foo } from './foo'`
  // — recurse to map ComponentName → underlying file path.
  const followIndexFile = (indexFile) => {
    if (!fs.existsSync(indexFile)) return;
    const sub = fs.readFileSync(indexFile, 'utf8');
    // export * from './x'
    const starRe = /export\s+\*\s+from\s+['"](\.[^'"]+)['"]/g;
    let sm;
    while ((sm = starRe.exec(sub)) !== null) {
      const subAbs = path.resolve(path.dirname(indexFile), sm[1]);
      const subCands = [subAbs + '.tsx', subAbs + '.ts', path.join(subAbs, 'index.tsx'), path.join(subAbs, 'index.ts')];
      let subResolved = null;
      for (const sc of subCands) { if (fs.existsSync(sc)) { subResolved = sc; break; } }
      if (!subResolved) continue;
      const subSrc = fs.readFileSync(subResolved, 'utf8');
      const namedExportRe = /export\s+(?:function|const|class)\s+([A-Z][A-Za-z0-9]+)/g;
      let nm;
      while ((nm = namedExportRe.exec(subSrc)) !== null) {
        if (!componentToFile.has(nm[1])) componentToFile.set(nm[1], subResolved);
      }
    }
    // export { Foo, Bar } from './baz'
    const namedRe = /export\s+(?:type\s+)?{([^}]+)}\s+from\s+['"](\.[^'"]+)['"]/g;
    while ((sm = namedRe.exec(sub)) !== null) {
      const names = sm[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/g, '')).filter(Boolean);
      const subAbs = path.resolve(path.dirname(indexFile), sm[2]);
      const subCands = [subAbs + '.tsx', subAbs + '.ts', path.join(subAbs, 'index.tsx'), path.join(subAbs, 'index.ts')];
      let subResolved = null;
      for (const sc of subCands) { if (fs.existsSync(sc)) { subResolved = sc; break; } }
      if (!subResolved) continue;
      for (const n of names) {
        const existing = componentToFile.get(n);
        // Override if the existing entry is itself an index file (intermediate)
        // — we want the final leaf template file. Handle both / and \ separators.
        if (!existing || /[\/\\]index\.tsx?$/.test(existing)) {
          componentToFile.set(n, subResolved);
        }
      }
      // Recurse if the target is itself an index file
      if (/[\/\\]index\.tsx?$/.test(subResolved)) followIndexFile(subResolved);
    }
  };
  // Any path the top-level imports resolved to that ends with /index.ts(x):
  for (const file of new Set(componentToFile.values())) {
    if (/[\/\\]index\.tsx?$/.test(file)) followIndexFile(file);
  }

  // sectionType → ComponentName, aggregated across all INDUSTRY_TEMPLATES blocks
  const typeToComponents = new Map();
  // Match every `const XYZ_TEMPLATES: Record<string, TemplateComponent> = { ... }` block
  // AND every inline industry block inside the INDUSTRY_TEMPLATES map.
  const blockRe = /:\s*Record<string,\s*TemplateComponent>\s*=\s*{([\s\S]*?)\n\s*}/g;
  const inlineRe = /[a-zA-Z]+:\s*{([\s\S]*?)\n\s{2,4}}/g;
  const collect = (blockBody) => {
    const entryRe = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][A-Za-z0-9]+),?\s*$/gm;
    let em;
    while ((em = entryRe.exec(blockBody)) !== null) {
      const type = em[1]; const comp = em[2];
      if (!typeToComponents.has(type)) typeToComponents.set(type, new Set());
      typeToComponents.get(type).add(comp);
    }
  };
  while ((m = blockRe.exec(src)) !== null) collect(m[1]);
  while ((m = inlineRe.exec(src)) !== null) collect(m[1]);

  return { componentToFile, typeToComponents };
}

// ─── Extract CSS vars from a template file + 1 level of local imports ───────
const CSS_VAR_RE = /--[a-z][a-z0-9-]+/gi;

function extractVarsFromFile(filePath, depth = 0, seen = new Set()) {
  if (seen.has(filePath)) return new Set();
  seen.add(filePath);
  if (!fs.existsSync(filePath)) return new Set();
  const src = fs.readFileSync(filePath, 'utf8');
  const vars = new Set();
  let m;
  const re = new RegExp(CSS_VAR_RE.source, 'gi');
  while ((m = re.exec(src)) !== null) vars.add(m[0]);
  // Follow up to 2 levels of local imports (other template files in shared/
  // or same dir). Deeper than that quickly drags in unrelated UI components.
  if (depth < 2) {
    const importRe = /import[\s\S]*?from\s+['"](\.[^'"]+)['"]/g;
    while ((m = importRe.exec(src)) !== null) {
      const rel = m[1];
      const abs = path.resolve(path.dirname(filePath), rel);
      const candidates = [abs + '.tsx', abs + '.ts', path.join(abs, 'index.tsx'), path.join(abs, 'index.ts')];
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          for (const v of extractVarsFromFile(c, depth + 1, seen)) vars.add(v);
          break;
        }
      }
    }
  }
  return vars;
}

// ─── Build the contract map ─────────────────────────────────────────────────
// Many templates use a namespaced CSS-var prefix (e.g. --booking-section-bg,
// --shop-card-bg) instead of the canonical --style-* / --token-* form.
// We strip well-known prefixes and re-match against the canonical aliases so
// the generator doesn't miss those sections.
const NAMESPACE_PREFIXES = ['--booking-', '--shop-', '--cart-', '--card-', '--product-'];

function resolveSlot(cssVar, varToSlot) {
  const direct = varToSlot.get(cssVar);
  if (direct) return direct;
  for (const prefix of NAMESPACE_PREFIXES) {
    if (cssVar.startsWith(prefix)) {
      const tail = cssVar.slice(prefix.length);
      const candidates = [
        '--token-' + tail,
        '--style-' + tail,
        // some templates use `--booking-heading-color` ↔ `--style-heading-color`
        // and that suffix matches; also try without -color suffix
        '--token-' + tail.replace(/-color$/, ''),
        '--style-' + tail.replace(/-color$/, ''),
      ];
      for (const c of candidates) {
        const s = varToSlot.get(c);
        if (s) return s;
      }
    }
  }
  return null;
}

function buildContracts() {
  const varToSlot = loadVarToSlot();
  const slotToField = loadSlotToField();
  const { componentToFile, typeToComponents } = loadTemplateRegistry();

  const stats = {
    types: 0, resolved: 0, unresolved: [], avgFields: 0, totalFields: 0,
    confidence: { high: 0, medium: 0, low: 0 },
  };
  const contracts = {};

  // Stable ordering of fields (matches the visual grouping in the editor)
  const fieldOrder = [
    'sectionBg', 'sectionBgAlt', 'cardBg',
    'headingColor', 'subheadingColor', 'bodyColor', 'mutedColor',
    'iconColor', 'accentColor',
    'onDarkHeading', 'onDarkBody', 'onDarkMuted',
    'imageOverlay',
    'eyebrow', 'statValue', 'quoteMark', 'ratingStar', 'check',
    'btnBg', 'btnText', 'btnSecondaryBg', 'btnSecondaryText',
    'badgeBg', 'badgeText', 'badgeBorder',
    'borderColor', 'dividerColor', 'cardBorderColor',
    'cardRadius', 'cardShadow', 'buttonRadius',
    'headingWeight', 'headingTracking',
    // Legacy fields kept at the end if they sneak through
    'textPrimary', 'textSecondary', 'imageTextColor',
    'styleBrand', 'brandPrimary', 'brandAccent', 'colorPrimary',
  ];
  const orderIdx = (f) => { const i = fieldOrder.indexOf(f); return i < 0 ? 999 : i; };

  for (const [type, componentSet] of typeToComponents) {
    stats.types++;
    const slots = new Set();
    let anyResolved = false;
    let totalVarCount = 0;
    for (const compName of componentSet) {
      const file = componentToFile.get(compName);
      if (!file) continue;
      anyResolved = true;
      const vars = extractVarsFromFile(file);
      totalVarCount += vars.size;
      for (const v of vars) {
        const slot = resolveSlot(v, varToSlot);
        if (slot) slots.add(slot);
      }
    }
    if (!anyResolved) {
      stats.unresolved.push(type);
      continue;
    }
    stats.resolved++;
    // Map slots → ColorFieldKey, deduped by slot (key collisions naturally merge)
    const fieldsSet = new Set();
    for (const slot of slots) {
      const field = slotToField.get(slot);
      if (field) fieldsSet.add(field);
    }
    // Sort by canonical order
    const fields = [...fieldsSet].sort((a, b) => orderIdx(a) - orderIdx(b));
    contracts[type] = fields;
    stats.totalFields += fields.length;
    // Confidence heuristic
    if (fields.length >= 6 && fields.length <= 20 && totalVarCount >= 3) stats.confidence.high++;
    else if (fields.length >= 3 && fields.length <= 25) stats.confidence.medium++;
    else stats.confidence.low++;
  }
  stats.avgFields = stats.resolved ? (stats.totalFields / stats.resolved).toFixed(1) : 0;
  return { contracts, stats };
}

// ─── Render the output file ─────────────────────────────────────────────────
function renderOutput(contracts) {
  const header = `// AUTO-GENERATED by scripts/generate-section-color-contracts.cjs — DO NOT EDIT BY HAND.
// Regenerate with: node scripts/generate-section-color-contracts.cjs
//
// Source of truth: actual CSS-var references in each template file (and one
// level of local imports), mapped to SectionColorSlots via the existing
// SECTION_COLOR_SLOT_ALIASES, then to ColorFieldKey via CONTRACT_FIELD_BY_SLOT.
//
// Manual overrides for sections this codegen mis-detects belong in
// section-color-contracts.ts (the hand-curated file). That file wins.

import type { ColorFieldKey } from '@/app/admin/pages/[id]/section-color-editor';

export const SECTION_COLOR_CONTRACTS_GENERATED: Partial<Record<string, ColorFieldKey[]>> = {
`;
  const lines = [];
  for (const type of Object.keys(contracts).sort()) {
    const arr = contracts[type].map((f) => `'${f}'`).join(', ');
    lines.push(`  ${type}: [${arr}],`);
  }
  return header + lines.join('\n') + '\n};\n';
}

// ─── Main ───────────────────────────────────────────────────────────────────
const { contracts, stats } = buildContracts();
const output = renderOutput(contracts);

console.log(`Generator stats:
  section types found:        ${stats.types}
  resolved (template found):  ${stats.resolved}
  unresolved (no template):   ${stats.unresolved.length}${stats.unresolved.length ? ' → ' + stats.unresolved.slice(0,20).join(', ') + (stats.unresolved.length>20?'…':'') : ''}
  avg fields per section:     ${stats.avgFields}
  confidence high (6-20 f):   ${stats.confidence.high}
  confidence medium:          ${stats.confidence.medium}
  confidence low (<3 / >25):  ${stats.confidence.low}
`);

if (CHECK_MODE) {
  const existing = fs.existsSync(OUTPUT_FILE) ? fs.readFileSync(OUTPUT_FILE, 'utf8') : '';
  if (existing !== output) {
    console.error('[check] section-color-contracts-generated.ts is OUT OF DATE — run without --check to regenerate.');
    process.exit(1);
  }
  console.log('[check] section-color-contracts-generated.ts is up to date.');
} else {
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`Wrote ${OUTPUT_FILE} (${Object.keys(contracts).length} sections)`);
}
