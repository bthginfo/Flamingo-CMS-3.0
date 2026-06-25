/**
 * COLOUR-ROLE COVERAGE AUDIT (the honest one).
 *
 * The existing audits only ask "does the template reference some --token-*?".
 * That misses the real bug: a section RENDERS a semantic element (a badge, an
 * eyebrow, a price, a stat value) but colours it through a BORROWED token
 * (e.g. a badge painted with color-mix(var(--token-on-dark-body))), so:
 *   - the editor never exposes the dedicated "Badge" field, and
 *   - the borrowed token controls two roles at once (crosstalk).
 *
 * This audit pairs each rendered role with its DEDICATED token and reports
 * every (template, role) where the role is rendered but not bound to its own
 * token. Those are the "I can't colour the badge" cases.
 *
 *   node scripts/audit-color-role-coverage.cjs            # report
 *   node scripts/audit-color-role-coverage.cjs --role badge
 *   node scripts/audit-color-role-coverage.cjs --strict   # exit 1 if any gap
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const STRICT = process.argv.includes('--strict');
const roleFilter = (() => { const i = process.argv.indexOf('--role'); return i >= 0 ? process.argv[i + 1] : null; })();

// role -> { dedicated tokens, signals that prove the role is rendered }
const ROLES = {
  badge: {
    tokens: ['--token-badge-bg', '--token-badge-text', '--token-badge-border'],
    // 'tag'/'pill' deliberately excluded: those are filter/category UI controls,
    // not content badges, and are correctly bound to card/heading tokens.
    paths: ['badgeText', 'badge', 'badgeLabel'],
  },
  eyebrow: {
    tokens: ['--token-eyebrow'],
    paths: ['eyebrow', 'kicker', 'overline'],
  },
  price: {
    tokens: ['--token-price'],
    paths: ['price', 'priceLabel', 'priceValue', 'priceFrom'],
  },
  statValue: {
    tokens: ['--token-stat-value'],
    paths: ['statValue', 'statNumber', 'metricValue'],
  },
};

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Does the template RENDER this role? Strong signal: data-edit-path="<path>".
// Weaker signal: a JSX element clearly tied to the role variable.
function rendersRole(src, role) {
  for (const p of role.paths) {
    if (new RegExp(`data-edit-path=["']${p}["']`).test(src)) return p;
    if (new RegExp(`data-edit-rich=["']${p}["']`).test(src)) return p;
  }
  return null;
}

function boundToRole(src, roleName, role) {
  // The canonical `.section-badge` element is bound to --token-badge-* via the
  // per-section CSS rule injected by section-renderer.tsx (with !important), so
  // it counts as bound even though the .tsx never names the token directly.
  if (roleName === 'badge' && /className=["'][^"']*\bsection-badge\b/.test(src)) return true;
  return role.tokens.some((t) => src.includes(`var(${t}`) || src.includes(t));
}

const files = walk(TEMPLATES);
const gaps = [];
const counts = {};
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const [roleName, role] of Object.entries(ROLES)) {
    if (roleFilter && roleName !== roleFilter) continue;
    const signal = rendersRole(src, role);
    if (!signal) continue;
    counts[roleName] = counts[roleName] || { rendered: 0, bound: 0, gap: 0 };
    counts[roleName].rendered++;
    if (boundToRole(src, roleName, role)) { counts[roleName].bound++; continue; }
    counts[roleName].gap++;
    gaps.push({ role: roleName, signal, file: path.relative(ROOT, file) });
  }
}

console.log('=== COLOUR-ROLE COVERAGE ===\n');
console.log('Role        Rendered  Bound  GAP');
for (const [r, c] of Object.entries(counts)) {
  console.log(`${r.padEnd(11)} ${String(c.rendered).padStart(8)} ${String(c.bound).padStart(6)} ${String(c.gap).padStart(4)}`);
}
console.log(`\nTotal gaps: ${gaps.length}\n`);
gaps.sort((a, b) => a.role.localeCompare(b.role) || a.file.localeCompare(b.file));
let lastRole = '';
for (const g of gaps) {
  if (g.role !== lastRole) { console.log(`\n--- ${g.role} (rendered via "${g.signal}"…) ---`); lastRole = g.role; }
  console.log(`  ${g.file}`);
}

if (STRICT && gaps.length) process.exit(1);
