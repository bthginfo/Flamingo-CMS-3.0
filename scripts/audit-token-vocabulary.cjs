const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const STRICT = process.argv.includes('--strict');

// Tokens used internally by templates (e.g. as rgba(var(--token-X), 0.5))
// that are derived from other tokens and not directly user-editable.
const WHITELIST = new Set([
  '--token-accent-rgb', // computed RGB triplet of --token-accent for rgba() usage
]);

const registry = fs.readFileSync(path.join(ROOT, 'apps/renderer/src/lib/section-color-fields.ts'), 'utf8');
const fieldDefVars = new Set();
const re = /cssVar:\s*'(--token-[a-z0-9-]+)'/g;
let m;
while ((m = re.exec(registry)) !== null) fieldDefVars.add(m[1]);

function walk(d, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && /\.tsx?$/.test(e.name)) out.push(p);
  }
}
const files = [];
walk(path.join(ROOT, 'apps/renderer/src/templates'), files);

const usedTokens = new Map();
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const tr = /var\(\s*(--token-[a-z0-9-]+)/g;
  let mm;
  while ((mm = tr.exec(s)) !== null) {
    if (!usedTokens.has(mm[1])) usedTokens.set(mm[1], new Set());
    usedTokens.get(mm[1]).add(path.relative(path.join(ROOT, 'apps/renderer/src/templates'), f).replace(/\\/g, '/'));
  }
}

console.log('Files scanned:', files.length);
console.log('FIELD_DEFS vars:', fieldDefVars.size);
console.log('Distinct tokens used in templates:', usedTokens.size);

const orphans = [...usedTokens.keys()].filter((t) => !fieldDefVars.has(t) && !WHITELIST.has(t)).sort();
console.log('');
console.log('Tokens used in templates but NOT in FIELD_DEFS');
console.log('(= silently dropped by codegen, no editor field exposed):');
if (orphans.length === 0) console.log('  (none)');
for (const t of orphans) {
  const sample = [...usedTokens.get(t)].slice(0, 3).join(', ');
  console.log('  ' + t + '  (' + usedTokens.get(t).size + ' files, e.g. ' + sample + ')');
}

const phantoms = [...fieldDefVars].filter((t) => !usedTokens.has(t)).sort();
console.log('');
console.log('Tokens in FIELD_DEFS but used by zero templates');
console.log('(= phantom field that could be offered but never paints):');
if (phantoms.length === 0) console.log('  (none)');
for (const t of phantoms) console.log('  ' + t);

if (STRICT && orphans.length > 0) {
  console.error('');
  console.error('FAIL: ' + orphans.length + ' orphan token(s). Add to FIELD_DEFS in section-color-fields.ts');
  console.error('      or to the WHITELIST in this script if intentionally not user-editable.');
  process.exit(1);
}
