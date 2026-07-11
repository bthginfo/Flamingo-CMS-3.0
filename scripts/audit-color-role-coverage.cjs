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

// Roles enforced by --strict. `input` / `label` are reported but NOT yet gated:
// form fields are theme-dependent (dark forms need light inputs), so binding
// them to the flat input slots requires per-form visual verification first.
const SOFT_ROLES = new Set(['input', 'label']);

// role -> dedicated tokens + signals that prove the role is rendered.
//   paths:  data-edit-path / data-edit-rich field names (content roles)
//   tags:   JSX element / lucide-icon names rendered for the role (visual roles)
//   glyphs: literal characters/entities that denote the role
//   cssClass: a class the renderer already wires to the role's tokens
const ROLES = {
  badge: {
    tokens: ['--token-badge-bg', '--token-badge-text', '--token-badge-border', '--token-card-badge-bg', '--token-card-badge-text'],
    // 'tag'/'pill' excluded: filter/category UI, not content badges.
    paths: ['badgeText', 'badge', 'badgeLabel'],
    cssClass: 'section-badge',
  },
  eyebrow: {
    tokens: ['--token-eyebrow'],
    paths: ['eyebrow', 'kicker', 'overline'],
  },
  price: {
    tokens: ['--token-price', '--token-price-strikethrough'],
    paths: ['price', 'priceLabel', 'priceValue', 'priceFrom', 'priceStrike', 'comparePrice'],
  },
  statValue: {
    tokens: ['--token-stat-value'],
    paths: ['statValue', 'statNumber', 'metricValue'],
  },
  check: {
    tokens: ['--token-check'],
    tags: ['Check', 'CheckCircle', 'CheckCircle2', 'BadgeCheck', 'CircleCheck', 'CheckCheck'],
  },
  ratingStar: {
    tokens: ['--token-rating-star'],
    // Star icons in review/rating contexts. Binding a star to the star slot is
    // correct even when a star is decorative, so this is safe to flag.
    tags: ['Star', 'StarHalf'],
  },
  quoteMark: {
    tokens: ['--token-quote'],
    tags: ['Quote', 'QuoteIcon'],
    glyphs: ['&ldquo;', '&rdquo;', '&#8220;', '“', '”'],
  },
  input: {
    tokens: ['--token-input-bg', '--token-input-border', '--token-input-text'],
    tags: ['input', 'textarea', 'select'],
  },
  label: {
    tokens: ['--token-label'],
    tags: ['label'],
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

// Does the template RENDER this role?
function rendersRole(src, roleName, role) {
  for (const p of role.paths || []) {
    const pathPattern = new RegExp(`data-edit-(?:path|rich)=["']${p}["']`);
    const matchingTags = Array.from(src.matchAll(/<[A-Za-z][^<>]{0,1800}>/gs), (match) => match[0])
      .filter((tag) => pathPattern.test(tag));
    if (matchingTags.some((tag) => !(roleName === 'eyebrow' && /data-color-role=["']badge["']/.test(tag)))) return p;
  }
  for (const t of role.tags || []) {
    if (new RegExp(`<${t}\\b`).test(src)) return `<${t}>`;
  }
  for (const g of role.glyphs || []) {
    if (src.includes(g)) return g;
  }
  return null;
}

function boundToRole(src, role) {
  // A class the renderer already wires to the role's tokens counts as bound.
  if (role.cssClass && new RegExp(`className=["'][^"']*\\b${role.cssClass}\\b`).test(src)) return true;
  return role.tokens.some((t) => src.includes(`var(${t}`) || src.includes(t));
}

const files = walk(TEMPLATES);
const gaps = [];
const counts = {};
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const [roleName, role] of Object.entries(ROLES)) {
    if (roleFilter && roleName !== roleFilter) continue;
    const signal = rendersRole(src, roleName, role);
    if (!signal) continue;
    counts[roleName] = counts[roleName] || { rendered: 0, bound: 0, gap: 0 };
    counts[roleName].rendered++;
    if (boundToRole(src, role)) { counts[roleName].bound++; continue; }
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

if (STRICT && gaps.some((g) => !SOFT_ROLES.has(g.role))) process.exit(1);
