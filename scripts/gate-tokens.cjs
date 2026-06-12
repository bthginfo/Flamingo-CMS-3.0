/**
 * DESIGN-TOKEN DRIFT REPORT (Phase 1 — read-only, non-failing)
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Runs four gates over every template file and prints a single summary
 * report. NO files are modified, NO exit code is set on warnings —
 * By default this is report-only. With --strict it exits with code 1 when
 * any gate fails and is safe to use in CI.
 *
 *   Gate A — VOLLSTÄNDIGKEIT
 *     Every TokenKey declared in packages/design-tokens MUST appear at
 *     least once in templates as `var(--token-NAME)`. Tokens that aren't
 *     used anywhere are dead weight and should be removed.
 *
 *   Gate B — KORREKTHEIT
 *     Every `var(--token-NAME)` reference in templates MUST resolve to a
 *     declared TokenKey. References to unknown tokens are typos or
 *     stragglers from a half-finished refactor.
 *
 *   Gate C — VERBOTENE VARS
 *     Templates must NOT reference `var(--brand-*)`, `var(--style-*)`,
 *     or `var(--booking-*)` directly. These are legacy variables that
 *     should be folded into the canonical token layer.
 *
 *   Gate D — TOKEN-DEF EINDEUTIG
 *     Each TokenKey must declare a unique cssVar, a sensible default,
 *     and a non-empty description. Catches copy-paste mistakes in the
 *     token registry itself.
 *
 * Usage:
 *   node scripts/gate-tokens.cjs            # human-readable report
 *   node scripts/gate-tokens.cjs --json     # machine-readable
 *   node scripts/gate-tokens.cjs --strict   # exit 1 if any gate fails
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');
const TOKENS_FILE = path.join(ROOT, 'packages/design-tokens/src/tokens.ts');

const JSON_MODE = process.argv.includes('--json');
const STRICT = process.argv.includes('--strict');

// ──────────────────────────────────────────────────────────────────────
// Parse DESIGN_TOKENS from tokens.ts (avoid a full TS parser dependency
// — the file is hand-curated and follows a strict shape, so a regex over
// the object literal is fine and won't drift unnoticed because Gate D
// catches malformed entries).
// ──────────────────────────────────────────────────────────────────────
function loadDesignTokens() {
  const src = fs.readFileSync(TOKENS_FILE, 'utf8');
  const objMatch = src.match(/export const DESIGN_TOKENS\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!objMatch) throw new Error('Could not locate DESIGN_TOKENS in ' + TOKENS_FILE);
  const body = objMatch[1];
  const entryRe = /([A-Za-z_$][\w$]*)\s*:\s*\{\s*cssVar:\s*'(--[a-z0-9-]+)'\s*,\s*kind:\s*'([a-z]+)'\s*,\s*default:\s*'([^']*)'\s*,\s*description:\s*'([^']*)'\s*\}/g;
  const tokens = {};
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    tokens[m[1]] = { cssVar: m[2], kind: m[3], default: m[4], description: m[5] };
  }
  return tokens;
}

function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(f));
    else if (e.isFile() && e.name.endsWith('.tsx')) out.push(f);
  }
  return out;
}

const tokens = loadDesignTokens();
const tokenCssVars = new Set(Object.values(tokens).map((t) => t.cssVar));
const files = walk(TEMPLATES_DIR);

// Collect all var(--…) references with file:line context for B / C gates.
const refs = []; // { file, line, name }
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, idx) => {
    const re = /var\(\s*(--[a-z0-9-]+)/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      refs.push({ file: path.relative(ROOT, f), line: idx + 1, name: m[1] });
    }
  });
}

// ──────────────────────────────────────────────────────────────────────
// Gate A — every declared token used somewhere?
// ──────────────────────────────────────────────────────────────────────
const usedCssVars = new Set(refs.map((r) => r.name));
const unusedTokens = Object.entries(tokens)
  .filter(([, def]) => !usedCssVars.has(def.cssVar))
  .map(([key, def]) => ({ key, cssVar: def.cssVar }));

// ──────────────────────────────────────────────────────────────────────
// Gate B — every var(--token-*) resolves to a declared token?
// ──────────────────────────────────────────────────────────────────────
const unknownTokenRefs = refs
  .filter((r) => r.name.startsWith('--token-') && !tokenCssVars.has(r.name));

// ──────────────────────────────────────────────────────────────────────
// Gate C — forbidden legacy var references?
// ──────────────────────────────────────────────────────────────────────
const FORBIDDEN_PREFIXES = ['--brand-', '--style-', '--booking-'];
const forbiddenRefs = refs.filter((r) =>
  FORBIDDEN_PREFIXES.some((p) => r.name.startsWith(p)),
);
// Group by var name for the summary table.
const forbiddenByName = new Map();
for (const r of forbiddenRefs) {
  if (!forbiddenByName.has(r.name)) forbiddenByName.set(r.name, []);
  forbiddenByName.get(r.name).push(r);
}

// ──────────────────────────────────────────────────────────────────────
// Gate D — token registry integrity
// ──────────────────────────────────────────────────────────────────────
const dupCssVars = new Map();
const malformedTokens = [];
for (const [key, def] of Object.entries(tokens)) {
  if (!def.cssVar || !/^--token-[a-z0-9-]+$/.test(def.cssVar)) malformedTokens.push({ key, reason: 'bad cssVar', value: def.cssVar });
  if (!def.default) malformedTokens.push({ key, reason: 'missing default' });
  if (!def.description || def.description.length < 8) malformedTokens.push({ key, reason: 'description too short' });
  if (!dupCssVars.has(def.cssVar)) dupCssVars.set(def.cssVar, []);
  dupCssVars.get(def.cssVar).push(key);
}
const duplicateCssVars = [...dupCssVars.entries()].filter(([, keys]) => keys.length > 1);

// ──────────────────────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────────────────────
const report = {
  meta: {
    templatesScanned: files.length,
    declaredTokens: Object.keys(tokens).length,
    totalVarRefs: refs.length,
  },
  gateA: {
    name: 'VOLLSTÄNDIGKEIT — every declared token used at least once',
    pass: unusedTokens.length === 0,
    unused: unusedTokens,
  },
  gateB: {
    name: 'KORREKTHEIT — every var(--token-*) is declared',
    pass: unknownTokenRefs.length === 0,
    unknownRefs: groupRefs(unknownTokenRefs),
  },
  gateC: {
    name: 'VERBOTENE VARS — no legacy --brand/--style/--booking refs',
    pass: forbiddenRefs.length === 0,
    countsByName: [...forbiddenByName.entries()]
      .map(([name, list]) => ({ name, count: list.length, samples: list.slice(0, 3).map((r) => `${r.file}:${r.line}`) }))
      .sort((a, b) => b.count - a.count),
  },
  gateD: {
    name: 'TOKEN-DEF EINDEUTIG — unique cssVar + non-empty default + description',
    pass: malformedTokens.length === 0 && duplicateCssVars.length === 0,
    malformed: malformedTokens,
    duplicates: duplicateCssVars.map(([cssVar, keys]) => ({ cssVar, keys })),
  },
};

function groupRefs(list) {
  const m = new Map();
  for (const r of list) {
    if (!m.has(r.name)) m.set(r.name, []);
    m.get(r.name).push(`${r.file}:${r.line}`);
  }
  return [...m.entries()].map(([name, occurrences]) => ({ name, count: occurrences.length, samples: occurrences.slice(0, 3) }));
}

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const line = (s = '') => console.log(s);
  line('═════════════════════════════════════════════════════════════════');
  line('   DESIGN-TOKEN DRIFT REPORT (Phase 1)');
  line('═════════════════════════════════════════════════════════════════');
  line('');
  line(`  Templates scanned:           ${report.meta.templatesScanned}`);
  line(`  Declared tokens:             ${report.meta.declaredTokens}`);
  line(`  Total var(--*) references:   ${report.meta.totalVarRefs}`);
  line('');
  // Gate A
  line(`  ${report.gateA.pass ? '✅' : '⚠️ '} Gate A: ${report.gateA.name}`);
  if (report.gateA.unused.length) {
    line(`     ${report.gateA.unused.length} unused token(s) — should be removed from registry:`);
    for (const u of report.gateA.unused) line(`       · ${u.key.padEnd(20)} ${u.cssVar}`);
  } else {
    line('     all declared tokens are used in templates');
  }
  line('');
  // Gate B
  line(`  ${report.gateB.pass ? '✅' : '⚠️ '} Gate B: ${report.gateB.name}`);
  if (report.gateB.unknownRefs.length) {
    line(`     ${report.gateB.unknownRefs.length} unknown --token-* reference(s):`);
    for (const u of report.gateB.unknownRefs.slice(0, 20)) line(`       · ${u.name.padEnd(30)} ${u.count}× e.g. ${u.samples[0]}`);
    if (report.gateB.unknownRefs.length > 20) line(`       … +${report.gateB.unknownRefs.length - 20} more`);
  }
  line('');
  // Gate C — the big one
  line(`  ${report.gateC.pass ? '✅' : '⚠️ '} Gate C: ${report.gateC.name}`);
  if (report.gateC.countsByName.length) {
    const total = report.gateC.countsByName.reduce((a, b) => a + b.count, 0);
    line(`     ${total} forbidden var reference(s) across ${report.gateC.countsByName.length} distinct names:`);
    for (const c of report.gateC.countsByName.slice(0, 25)) line(`       ${String(c.count).padStart(5)}×  ${c.name}`);
    if (report.gateC.countsByName.length > 25) line(`       … +${report.gateC.countsByName.length - 25} more names`);
  }
  line('');
  // Gate D
  line(`  ${report.gateD.pass ? '✅' : '⚠️ '} Gate D: ${report.gateD.name}`);
  if (report.gateD.malformed.length) {
    line(`     ${report.gateD.malformed.length} malformed entry(ies):`);
    for (const m of report.gateD.malformed) line(`       · ${m.key} — ${m.reason}${m.value ? ' (' + m.value + ')' : ''}`);
  }
  if (report.gateD.duplicates.length) {
    line(`     ${report.gateD.duplicates.length} duplicate cssVar(s):`);
    for (const d of report.gateD.duplicates) line(`       · ${d.cssVar} → ${d.keys.join(', ')}`);
  }
  if (report.gateD.pass) line('     registry is internally consistent');
  line('');
  line('─────────────────────────────────────────────────────────────────');
  const passed = [report.gateA.pass, report.gateB.pass, report.gateC.pass, report.gateD.pass].filter(Boolean).length;
  line(`  Summary: ${passed}/4 gates pass`);
  line('─────────────────────────────────────────────────────────────────');
}

if (STRICT && !(report.gateA.pass && report.gateB.pass && report.gateC.pass && report.gateD.pass)) {
  process.exit(1);
}
