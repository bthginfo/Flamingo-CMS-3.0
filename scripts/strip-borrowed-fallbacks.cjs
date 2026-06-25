/**
 * Strip fallbacks from theme-INDEPENDENT role tokens so each role is driven
 * ONLY by its own slot (which now has an independent page-level default in
 * brand-colors.ts). This kills the crosstalk where, e.g., a badge painted with
 * `var(--token-badge-bg, var(--token-on-dark-body, …))` was actually steered by
 * the body-text field whenever the badge slot was unset.
 *
 *   var(--token-price, var(--token-muted))                 → var(--token-price)
 *   var(--token-badge-bg, color-mix(…on-dark-body… ))      → var(--token-badge-bg)
 *
 * Theme-AWARE text slots (heading/body/muted, card-heading/body/muted,
 * on-dark-*, section-bg*) are left untouched — their light/dark default is
 * resolved per section by section-renderer.tsx.
 *
 *   node scripts/strip-borrowed-fallbacks.cjs --dry
 *   node scripts/strip-borrowed-fallbacks.cjs
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');

const SAFE = new Set([
  '--token-badge-bg', '--token-badge-text', '--token-badge-border',
  '--token-eyebrow', '--token-icon', '--token-accent',
  '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check',
  '--token-btn-bg', '--token-btn-text', '--token-divider', '--token-card-border',
  '--token-price', '--token-price-strikethrough', '--token-link', '--token-link-hover',
  '--token-label', '--token-input-bg', '--token-input-border', '--token-input-text',
  '--token-success', '--token-success-bg', '--token-danger', '--token-danger-bg',
  '--token-glow-color', '--token-shadow',
  '--token-card-badge-bg', '--token-card-badge-text', '--token-card-icon',
  '--token-btn-secondary-bg', '--token-btn-secondary-text', '--token-btn-secondary-border',
]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Replace every `var(--token-<safe>, …)` with `var(--token-<safe>)`, honouring
// balanced parentheses in the fallback.
function strip(src) {
  let out = '';
  let i = 0;
  let n = 0;
  while (i < src.length) {
    const m = /var\(\s*(--token-[a-z0-9-]+)/y;
    m.lastIndex = i;
    const hit = m.exec(src);
    if (!hit || hit.index !== i) { out += src[i]; i++; continue; }
    const token = hit[1];
    // walk to the matching close paren
    let depth = 1;
    let j = m.lastIndex;
    let sawComma = false;
    while (j < src.length && depth > 0) {
      const c = src[j];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      else if (c === ',' && depth === 1) sawComma = true;
      if (depth === 0) break;
      j++;
    }
    // j points at the closing ')'
    if (SAFE.has(token) && sawComma) {
      out += `var(${token})`;
      n++;
      i = j + 1;
    } else {
      out += src.slice(i, j + 1);
      i = j + 1;
    }
  }
  return { out, n };
}

let files = 0, total = 0;
const plan = [];
for (const file of walk(TEMPLATES)) {
  const src = fs.readFileSync(file, 'utf8');
  const { out, n } = strip(src);
  if (n > 0) {
    files++; total += n;
    plan.push({ file: path.relative(ROOT, file), n });
    if (!DRY) fs.writeFileSync(file, out);
  }
}
plan.sort((a, b) => b.n - a.n);
console.log(`${DRY ? '[DRY] ' : ''}Stripped fallbacks from theme-independent role tokens: ${total} in ${files} files`);
for (const p of plan.slice(0, 18)) console.log(`  ${String(p.n).padStart(3)}  ${p.file}`);
if (plan.length > 18) console.log(`  … ${plan.length - 18} more`);
