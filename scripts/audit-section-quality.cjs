/**
 * SECTION AUDIT — duplication, size, and shared-helper adoption across templates.
 * Read-only report; no rendering impact.
 *
 *   node scripts/audit-section-quality.cjs
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TPL = path.join(ROOT, 'apps/renderer/src/templates');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}
const files = walk(TPL);
const rel = (f) => f.slice(TPL.length + 1);
const loc = (f) => fs.readFileSync(f, 'utf8').split('\n').length;

// 1. Duplication: same filename across industry dirs.
const byName = {};
for (const f of files) {
  const r = rel(f);
  const parts = r.split('/');
  if (parts.length < 2) continue;            // skip shared/* (single level handled below)
  const name = parts[parts.length - 1];
  (byName[name] = byName[name] || []).push(r);
}
const dup = Object.entries(byName).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);

// 2. Size hotspots.
const sized = files.map((f) => ({ f: rel(f), loc: loc(f) })).sort((a, b) => b.loc - a.loc);

// 3. Shared-helper adoption + duplicated-logic signals.
let anyFiles = 0, useInView = 0, useScroll = 0, accordion = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (/:\s*any\b|as any/.test(s)) anyFiles++;
  if (/useInView/.test(s)) useInView++;
  if (/useScroll|useTransform/.test(s)) useScroll++;
  if (/faq/i.test(rel(f)) && /(useState|<details|aria-expanded|openIndex)/.test(s)) accordion++;
}

// Rough overlap metric for a duplicated set (avg pairwise shared unique non-blank lines).
function overlap(paths) {
  const sets = paths.map((p) => new Set(fs.readFileSync(path.join(TPL, p), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)));
  let tot = 0, n = 0;
  for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) {
    const a = sets[i], b = sets[j];
    let inter = 0; for (const l of a) if (b.has(l)) inter++;
    tot += inter / Math.min(a.size, b.size); n++;
  }
  return n ? Math.round((tot / n) * 100) : 0;
}

console.log(`Templates: ${files.length}\n`);
console.log('=== Duplicated section types (same file across industries) ===');
for (const [name, paths] of dup) {
  console.log(`  ${String(paths.length).padStart(2)}×  ${name.padEnd(22)} ~${overlap(paths)}% line overlap`);
}
console.log('\n=== Largest files (split/refactor candidates) ===');
for (const { f, loc } of sized.slice(0, 10)) console.log(`  ${String(loc).padStart(4)}  ${f}`);
console.log('\n=== Code-quality signals ===');
console.log(`  files using any:          ${anyFiles}`);
console.log(`  files w/ useInView:       ${useInView}  (reveal boilerplate — shared hook candidate)`);
console.log(`  files w/ useScroll/Transform: ${useScroll}`);
console.log(`  faq files w/ own accordion: ${accordion}  (shared <FaqAccordion> candidate)`);
