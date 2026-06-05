// Phase 1 inventory: scan every template for `var(--…)` usages, count
// frequency, group by prefix. Also dumps fallback-chain depth distribution.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');

function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(f));
    else if (e.isFile() && e.name.endsWith('.tsx')) out.push(f);
  }
  return out;
}

const files = walk(TEMPLATES_DIR);
const varCounts = new Map();
const prefixCounts = new Map();
const fallbackDepths = new Map();
let totalRefs = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  // Naive but effective: find every var(--name…). We care about the name.
  const re = /var\(\s*(--[A-Za-z0-9_-]+)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    totalRefs++;
    const name = m[1];
    varCounts.set(name, (varCounts.get(name) || 0) + 1);
    const prefix = name.split('-').slice(0, 3).join('-'); // --token-X or --brand-X
    prefixCounts.set(prefix, (prefixCounts.get(prefix) || 0) + 1);
  }
  // Fallback-chain depth: count commas inside each var(…) call.
  const depthRe = /var\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g;
  let dm;
  while ((dm = depthRe.exec(src)) !== null) {
    // Approximate: count top-level commas
    const body = dm[1];
    let depth = 0, commas = 0;
    for (const ch of body) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) commas++;
    }
    fallbackDepths.set(commas, (fallbackDepths.get(commas) || 0) + 1);
  }
}

console.log('=== CSS-VAR INVENTORY (across', files.length, 'templates) ===\n');
console.log('Total var(...) references:', totalRefs);
console.log('Distinct var names:       ', varCounts.size);
console.log('');
console.log('--- Prefix distribution ---');
const sortedPrefixes = [...prefixCounts.entries()].sort((a, b) => b[1] - a[1]);
for (const [p, n] of sortedPrefixes) console.log(`  ${p.padEnd(28)} ${n}`);
console.log('');
console.log('--- Fallback-chain depth (commas inside var()) ---');
const sortedDepths = [...fallbackDepths.entries()].sort((a, b) => a[0] - b[0]);
for (const [d, n] of sortedDepths) console.log(`  depth=${d}: ${n} occurrences`);
console.log('');
console.log('--- Top 60 most-used vars ---');
const sorted = [...varCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60);
for (const [name, n] of sorted) console.log(`  ${String(n).padStart(4)}  ${name}`);
console.log('');
console.log('--- All distinct vars (alphabetical) ---');
const all = [...varCounts.keys()].sort();
for (const name of all) console.log(`  ${name}`);
