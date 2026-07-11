/**
 * CROSSTALK GUARD.
 *
 * Theme-independent role tokens must be read as a plain `var(--token-<role>)`
 * with NO fallback. A fallback like `var(--token-badge-bg, var(--token-body))`
 * means that whenever the badge slot is unset the BODY field secretly controls
 * the badge — exactly the "editing body recolours my badge" bug.
 *
 * Each of these roles has an independent page-level default in brand-colors.ts,
 * so the fallback is both unnecessary and harmful. This gate fails if any of
 * them is used with a fallback inside a template.
 *
 * Theme-AWARE text slots (heading/body/muted, card-heading/body/muted,
 * on-dark-*, section-bg*) are exempt — their light/dark default is resolved per
 * section by section-renderer.tsx and is allowed to layer.
 *
 *   node scripts/check-section-color-crosstalk.cjs
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const COMPONENTS = path.join(ROOT, 'apps/renderer/src/components');

const SAFE = [
  'badge-bg', 'badge-text', 'badge-border', 'eyebrow', 'icon', 'accent',
  'stat-value', 'quote', 'rating-star', 'check', 'btn-bg', 'btn-text',
  'divider', 'card-border', 'price', 'price-strikethrough', 'link', 'link-hover',
  'label', 'input-bg', 'input-border', 'input-text', 'success', 'success-bg',
  'danger', 'danger-bg', 'glow-color', 'shadow', 'card-badge-bg',
  'card-badge-text', 'card-icon', 'btn-secondary-bg', 'btn-secondary-text',
  'btn-secondary-border',
].map((r) => `--token-${r}`);
const SAFE_SET = new Set(SAFE);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const violations = [];
for (const file of walk(TEMPLATES)) {
  const src = fs.readFileSync(file, 'utf8');
  // `var(--token-<role>` immediately followed (after optional ws) by a comma.
  const re = /var\(\s*(--token-[a-z0-9-]+)\s*,/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (SAFE_SET.has(m[1])) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${path.relative(ROOT, file)}:${line}  ${m[1]} has a fallback`);
    }
  }
}

// PAIR GUARD. Foreground/background roles are contracts, not a colour buffet:
// a badge background must travel with badge text, a button background with
// button text, etc. Mixing accent/icon fills with an unrelated foreground was
// the source of several tenant-only WCAG regressions. Limit this to concrete
// background declarations; gradients and decorative fills without text remain
// valid uses of --token-accent/--token-icon.
const PAIR_RULES = [
  { name: 'button', markers: ['bg-[var(--token-btn-bg)]', "background: 'var(--token-btn-bg)'", "backgroundColor: 'var(--token-btn-bg)'"], foreground: '--token-btn-text' },
  { name: 'secondary button', markers: ['bg-[var(--token-btn-secondary-bg)]', "background: 'var(--token-btn-secondary-bg)'", "backgroundColor: 'var(--token-btn-secondary-bg)'"], foreground: '--token-btn-secondary-text' },
  { name: 'badge', markers: ['bg-[var(--token-badge-bg)]', "background: 'var(--token-badge-bg)'", "backgroundColor: 'var(--token-badge-bg)'"], foreground: '--token-badge-text' },
  { name: 'card badge', markers: ['bg-[var(--token-card-badge-bg)]', "background: 'var(--token-card-badge-bg)'", "backgroundColor: 'var(--token-card-badge-bg)'"], foreground: '--token-card-badge-text' },
  { name: 'danger notice', markers: ['bg-[var(--token-danger-bg)]', "background: 'var(--token-danger-bg)'"], foreground: '--token-danger' },
  { name: 'success notice', markers: ['bg-[var(--token-success-bg)]', "background: 'var(--token-success-bg)'"], foreground: '--token-success' },
  { name: 'raw accent background', markers: ['bg-[var(--token-accent)]', "background: 'var(--token-accent)'", "backgroundColor: 'var(--token-accent)'"], foreground: null },
  { name: 'raw icon background', markers: ['bg-[var(--token-icon)]', "background: 'var(--token-icon)'", "backgroundColor: 'var(--token-icon)'"], foreground: null },
];
const EXPLICIT_FOREGROUND_RE = /(?:text-\[[^\]]*var\(--token-|(?:^|[,{\s])color\s*:\s*['"]var\(--token-)/;
const openingTagRe = /<[A-Za-z][^<>]{0,1800}>/gs;
for (const file of [...walk(TEMPLATES), ...walk(COMPONENTS)]) {
  const src = fs.readFileSync(file, 'utf8');
  for (const match of src.matchAll(openingTagRe)) {
    const tag = match[0];
    if (!EXPLICIT_FOREGROUND_RE.test(tag)) continue;
    for (const rule of PAIR_RULES) {
      if (!rule.markers.some((marker) => tag.includes(marker))) continue;
      if (rule.foreground && tag.includes(rule.foreground)) continue;
      const line = src.slice(0, match.index).split('\n').length;
      const expectation = rule.foreground ? `must pair with ${rule.foreground}` : 'must use a semantic background/text pair';
      violations.push(`${path.relative(ROOT, file)}:${line}  ${rule.name} ${expectation}`);
    }
  }
}

if (violations.length) {
  console.error(`crosstalk gate FAILED: ${violations.length} theme-independent role token(s) used with a fallback.\n`);
  for (const v of violations.slice(0, 40)) console.error('  ' + v);
  if (violations.length > 40) console.error(`  … ${violations.length - 40} more`);
  console.error('\nFix: drop the fallback (node scripts/strip-borrowed-fallbacks.cjs).');
  console.error('These slots have independent page-level defaults in brand-colors.ts.');
  process.exit(1);
}
console.log(`crosstalk gate OK: ${SAFE.length} role tokens have no borrowed fallbacks; ${PAIR_RULES.length} foreground/background pair rules pass.`);
