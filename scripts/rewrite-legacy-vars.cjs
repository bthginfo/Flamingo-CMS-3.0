/**
 * Phase 2: REWRITE LEGACY CSS VARS TO CANONICAL TOKENS
 * ────────────────────────────────────────────────────────────────────────
 *
 * Replaces every `var(--brand-X[, fallback])` / `var(--style-Y[, fallback])`
 * occurrence in template files with the canonical `var(--token-Z)` form
 * (no fallback chain). The mapping is hand-curated below and represents
 * the agreed-on semantic translation between legacy variable names and
 * the new TokenKey enum in packages/design-tokens/src/tokens.ts.
 *
 * Patterns handled:
 *
 *   1) Bare:                 var(--brand-primary)
 *                            → var(--token-accent)
 *
 *   2) With fallback:        var(--brand-primary, #ff0000)
 *                            → var(--token-accent)
 *
 *   3) Nested fallback:      var(--token-X, var(--brand-Y, #fff))
 *                            → var(--token-X)
 *                            (legacy chain is fully collapsed)
 *
 *   4) Nested chain w/o token: var(--style-X, var(--brand-Y, #fff))
 *                            → var(--token-Z)  where mapping(X) === Z
 *                            (first mappable name in the chain wins)
 *
 * Tokens this codegen will NOT introduce / cannot decide automatically:
 *
 *   - `--brand-dark`            (37×) — semantic ambiguity (dark surface
 *                                       vs. inverted text). Leave for
 *                                       Phase 3 manual review.
 *   - `--brand-primary-rgb`     (1×)  — rgb-split variant. Skip.
 *   - `--brand-accent-15`       (1×)  — 15% tint. Skip.
 *   - `--color-primary`         (16×) — used in only one component; map
 *                                       to accent via mapping table.
 *   - `--booking-*`             (97×) — module-specific subset, fold into
 *                                       Phase 2b after main run.
 *   - `--style-heading-tracking` /
 *     `--style-heading-weight`        — typography utility values, keep
 *                                       as-is (not colors).
 *   - `--style-card-shadow`           — no canonical shadow token yet.
 *   - `--style-image-overlay`         — gradient overlay, no token yet.
 *
 *   Run modes:
 *     node scripts/rewrite-legacy-vars.cjs          # write changes
 *     node scripts/rewrite-legacy-vars.cjs --dry    # report only
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');

// ─────────────────────────────────────────────────────────────────────────
// LEGACY → CANONICAL MAPPING
// LHS = legacy CSS var name. RHS = canonical TokenKey cssVar.
// Every key here MUST exist as a TokenKey cssVar in tokens.ts (Gate D will
// catch us otherwise).
// ─────────────────────────────────────────────────────────────────────────
const MAP = {
  // Brand
  '--brand-primary':           '--token-accent',
  '--brand-accent':            '--token-accent',
  '--brand-btn-bg':            '--token-btn-bg',
  '--brand-btn-text':          '--token-btn-text',
  '--brand-secondary':         '--token-subheading',
  '--color-primary':           '--token-accent',
  // Style — typography
  '--style-text-primary':      '--token-body',
  '--style-text-secondary':    '--token-body',
  '--style-text-muted':        '--token-muted',
  '--style-muted':             '--token-muted',
  '--style-heading-color':     '--token-heading',
  '--style-subheading-color':  '--token-subheading',
  '--style-body-color':        '--token-body',
  // Style — accents
  '--style-accent':            '--token-accent',
  '--style-accent-color':      '--token-accent',
  '--style-brand':             '--token-accent',
  '--style-icon-color':        '--token-icon',
  // Style — surfaces
  '--style-section-bg':        '--token-section-bg',
  '--style-section-bg-alt':    '--token-section-bg-alt',
  '--style-card-bg':           '--token-card-bg',
  '--style-card-border':       '--token-card-border',
  '--style-border':            '--token-card-border',
  '--style-border-color':      '--token-card-border',
  '--style-divider-color':     '--token-divider',
  // Style — badges / buttons
  '--style-badge-bg':          '--token-badge-bg',
  '--style-badge-text':        '--token-badge-text',
  '--style-badge-border':      '--token-badge-border',
  '--style-button-bg':         '--token-btn-bg',
  '--style-button-text':       '--token-btn-text',
  // Style — radii
  '--style-card-radius':       '--token-card-radius',
  '--style-button-radius':     '--token-button-radius',
  // Style — inverted (on-dark) typography
  '--style-on-dark-heading':   '--token-on-dark-heading',
  '--style-on-dark-body':      '--token-on-dark-body',
  '--style-on-dark-muted':     '--token-on-dark-muted',
  '--style-image-text-color':  '--token-on-dark-heading',
  '--style-image-body-color':  '--token-on-dark-body',
  '--style-image-muted-color': '--token-on-dark-muted',
};

function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(f));
    else if (e.isFile() && e.name.endsWith('.tsx')) out.push(f);
  }
  return out;
}

// Parse one `var(...)` invocation starting at `start` (must point at the
// opening '('). Returns { end, name, args[] } where args are the
// comma-separated fallback values (each one a trimmed string). Args are
// raw — they may themselves contain nested `var(...)`. Returns null on
// malformed input.
function parseVarCall(src, start) {
  if (src[start] !== '(') return null;
  let depth = 1;
  let i = start + 1;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0) break;
    i++;
  }
  if (depth !== 0) return null;
  const body = src.slice(start + 1, i);
  // Top-level comma split (respect nested parens).
  const parts = [];
  let cur = '';
  let d = 0;
  for (const ch of body) {
    if (ch === '(') { d++; cur += ch; }
    else if (ch === ')') { d--; cur += ch; }
    else if (ch === ',' && d === 0) { parts.push(cur.trim()); cur = ''; }
    else { cur += ch; }
  }
  if (cur.trim()) parts.push(cur.trim());
  const nameMatch = parts[0].match(/^(--[a-z0-9-]+)\s*$/);
  if (!nameMatch) return null;
  return { end: i, name: nameMatch[1], args: parts };
}

// Pick the first var name in this call (or any nested fallback call) that
// has a mapping. Returns the canonical token cssVar, or null if no name in
// the chain is mappable.
function resolveCanonical(src, callStart) {
  const call = parseVarCall(src, callStart);
  if (!call) return null;
  // Self?
  if (MAP[call.name]) return MAP[call.name];
  if (call.name.startsWith('--token-')) return call.name; // already canonical
  // Walk fallback args looking for nested var(--…).
  for (let i = 1; i < call.args.length; i++) {
    const arg = call.args[i];
    const m = arg.match(/var\s*\(/);
    if (!m) continue;
    const offset = arg.indexOf('(', m.index);
    // Re-resolve using original src positions for accurate nested handling.
    const argStartInSrc = src.indexOf(arg, callStart);
    if (argStartInSrc < 0) continue;
    const nested = resolveCanonical(src, argStartInSrc + offset);
    if (nested) return nested;
  }
  return null;
}

// Walk source, find every `var(` and replace the whole call with a
// canonical `var(--token-X)` if any name in the chain maps. Returns the
// rewritten source plus a count of replacements made.
function rewrite(src) {
  let out = '';
  let i = 0;
  let replaced = 0;
  // Match any `var(` regardless of surrounding word boundaries — needed
  // for Tailwind arbitrary-value patterns like `shadow-[4px_4px_0_var(...)]`
  // where the underscore-to-v transition is inside two word characters and
  // would defeat a `\b` anchor.
  const re = /var\s*\(/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const callOpen = src.indexOf('(', m.index);
    if (callOpen < 0) continue;
    const call = parseVarCall(src, callOpen);
    if (!call) continue;
    const canonical = resolveCanonical(src, callOpen);
    if (!canonical) continue;
    // If the call is already exactly `var(--token-X)` with no fallback,
    // don't rewrite (idempotent).
    if (call.name === canonical && call.args.length === 1) continue;
    out += src.slice(i, m.index);
    out += `var(${canonical})`;
    i = call.end + 1;
    re.lastIndex = i;
    replaced++;
  }
  out += src.slice(i);
  return { out, replaced };
}

const files = walk(TEMPLATES_DIR);
let totalReplaced = 0;
let changedFiles = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const { out, replaced } = rewrite(before);
  if (replaced === 0 || out === before) continue;
  changedFiles++;
  totalReplaced += replaced;
  if (!DRY) fs.writeFileSync(f, out);
  if (DRY || process.env.VERBOSE) console.log(`${path.relative(ROOT, f)}: ${replaced} replacements`);
}
console.log(`\nFiles scanned:    ${files.length}`);
console.log(`Files changed:    ${changedFiles}`);
console.log(`Total rewrites:   ${totalReplaced}`);
if (DRY) console.log('(dry run — no files written)');
