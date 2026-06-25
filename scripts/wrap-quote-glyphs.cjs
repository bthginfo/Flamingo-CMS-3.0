/**
 * Wrap decorative quotation glyphs (&ldquo; / &rdquo;) in a span bound to the
 * dedicated --token-quote slot, so the quote mark becomes independently
 * colourable. Idempotent: skips glyphs already inside a quote-token span.
 *
 *   node scripts/wrap-quote-glyphs.cjs --dry
 *   node scripts/wrap-quote-glyphs.cjs
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');
const SPAN_OPEN = '<span className="text-[color:var(--token-quote)]">';

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

let files = 0, wraps = 0;
for (const file of walk(TEMPLATES)) {
  let src = fs.readFileSync(file, 'utf8');
  if (!/&ldquo;|&rdquo;/.test(src)) continue;
  let n = 0;
  src = src.replace(/&ldquo;|&rdquo;/g, (g, idx, str) => {
    // skip if the glyph is already the sole child of a quote-token span
    const before = str.slice(Math.max(0, idx - SPAN_OPEN.length - 2), idx);
    if (before.includes('--token-quote')) return g;
    n++;
    return `${SPAN_OPEN}${g}</span>`;
  });
  if (n > 0) {
    files++; wraps += n;
    if (!DRY) fs.writeFileSync(file, src);
    console.log(`  ${String(n).padStart(2)}  ${path.relative(ROOT, file)}`);
  }
}
console.log(`${DRY ? '[DRY] ' : ''}Quote glyphs wrapped: ${wraps} in ${files} files`);
