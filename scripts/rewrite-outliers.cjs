/**
 * Phase 4 outlier sweep: rewrite the remaining 5 distinct forbidden vars
 * in templates to their new --token-* equivalents. Plus drop the 2
 * single-file outliers that have no token equivalent.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');

// Plain string→string substitutions (substring match, brace/paren-agnostic).
const SUBS = [
  ['--style-heading-weight',   '--token-heading-weight'],
  ['--style-heading-tracking', '--token-heading-tracking'],
  ['--style-card-shadow',      '--token-card-shadow'],
  ['--style-image-overlay',    '--token-image-overlay'],
  ['--brand-primary-rgb',      '--token-accent-rgb'],
];

function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(f));
    else if (e.isFile() && e.name.endsWith('.tsx')) out.push(f);
  }
  return out;
}

let totalFiles = 0;
let totalReplacements = 0;
for (const f of walk(TEMPLATES)) {
  let src = fs.readFileSync(f, 'utf8');
  const before = src;
  for (const [from, to] of SUBS) {
    const parts = src.split(from);
    if (parts.length > 1) {
      totalReplacements += parts.length - 1;
      src = parts.join(to);
    }
  }
  // Single-file outlier: --brand-accent-15 fallback in handwerk/cta-band.tsx
  // The runtime path uses colors?.accentColor when set, so the fallback only
  // matters when no override is present. Drop the var() wrapper and keep the
  // literal rgba (still tenant-overridable via the inline style above).
  if (f.endsWith('cta-band.tsx')) {
    const next = src.replace(/'var\(--brand-accent-15,\s*rgba\(243,156,18,0\.15\)\)'/g, "'rgba(243,156,18,0.15)'");
    if (next !== src) { totalReplacements++; src = next; }
  }
  if (src !== before) {
    fs.writeFileSync(f, src);
    totalFiles++;
    console.log('  ' + path.relative(ROOT, f).replace(/\\/g, '/'));
  }
}
console.log(`Rewrote ${totalReplacements} occurrences in ${totalFiles} files.`);
