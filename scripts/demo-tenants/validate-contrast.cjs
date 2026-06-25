/**
 * Contrast validator for demo tenants — runs WITHOUT touching the API.
 *
 * Requires each tenant module (which only builds the tenant object thanks to the
 * `if (require.main === module)` guard), walks every section's styleOverrides,
 * and flags any section whose background is DARK but whose text / icon / card
 * tokens are missing or also dark (→ dark-on-dark). Unset tokens inherit the
 * page-level brand default, which is dark, so on a dark section the visible
 * slots MUST be explicitly overridden to a light value.
 *
 *   node scripts/demo-tenants/validate-contrast.cjs            # all tenants
 *   node scripts/demo-tenants/validate-contrast.cjs handwerk   # one
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const only = process.argv[2];

function lum(c) {
  if (!c) return null;
  c = String(c).trim();
  let m = c.match(/^#([0-9a-fA-F]{6})$/);
  if (m) { const h = m[1]; const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16); return 0.299*r+0.587*g+0.114*b; }
  m = c.match(/^#([0-9a-fA-F]{3})$/);
  if (m) { const h = m[1].split('').map(x=>x+x).join(''); const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16); return 0.299*r+0.587*g+0.114*b; }
  m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) { const r=+m[1],g=+m[2],b=+m[3]; return 0.299*r+0.587*g+0.114*b; }
  return null;
}
const isDark = (c) => { const l = lum(c); return l !== null && l < 110; };
const isLight = (c) => { const l = lum(c); return l !== null && l >= 130; };

// Tokens that paint text/icons and MUST be light on a dark section.
const REQUIRED_LIGHT = [
  '--token-heading', '--token-body', '--token-icon', '--token-accent',
  '--token-card-heading', '--token-card-body', '--token-card-icon',
];

function sectionsOf(tenant) {
  const out = [];
  for (const p of tenant.pages || []) for (const s of p.sections || []) out.push({ page: p.slug || '(home)', s });
  return out;
}

const files = (only ? [only + '.cjs'] : fs.readdirSync(DIR).filter((f) => f.endsWith('.cjs')))
  .filter((f) => !['validate-contrast.cjs', 'fetch-instructions.cjs'].includes(f));

let totalIssues = 0;
for (const file of files) {
  const full = path.join(DIR, file);
  let tenant;
  try { tenant = require(full); }
  catch (e) { console.log(`✗ ${file}: FAILED to load — ${e.message}`); totalIssues++; continue; }
  if (!tenant || !tenant.pages) { continue; }
  const issues = [];
  for (const { page, s } of sectionsOf(tenant)) {
    const so = s.styleOverrides || {};
    const bg = so['--token-section-bg'] || so['--token-card-bg'];
    if (!bg || !isDark(bg)) continue;            // only dark sections matter
    const missing = [];
    for (const tok of REQUIRED_LIGHT) {
      const v = so[tok];
      if (v === undefined) missing.push(tok + '(unset→dark)');
      else if (!isLight(v) && isDark(v)) missing.push(tok + '=' + v);
    }
    if (missing.length) issues.push(`    ${page} / ${s.type}: ${missing.join(', ')}`);
  }
  if (issues.length) {
    console.log(`✗ ${file.replace('.cjs','')}: ${issues.length} dark section(s) with contrast risk`);
    issues.slice(0, 6).forEach((i) => console.log(i));
    if (issues.length > 6) console.log(`    … ${issues.length - 6} more`);
    totalIssues += issues.length;
  } else {
    console.log(`✓ ${file.replace('.cjs','')}: dark sections OK`);
  }
}
console.log(`\nTotal contrast issues: ${totalIssues}`);
process.exit(totalIssues ? 1 : 0);
