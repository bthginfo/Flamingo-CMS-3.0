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

if (violations.length) {
  console.error(`crosstalk gate FAILED: ${violations.length} theme-independent role token(s) used with a fallback.\n`);
  for (const v of violations.slice(0, 40)) console.error('  ' + v);
  if (violations.length > 40) console.error(`  … ${violations.length - 40} more`);
  console.error('\nFix: drop the fallback (node scripts/strip-borrowed-fallbacks.cjs).');
  console.error('These slots have independent page-level defaults in brand-colors.ts.');
  process.exit(1);
}
console.log(`crosstalk gate OK: ${SAFE.length} role tokens are read without borrowed fallbacks.`);
