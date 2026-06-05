// Audit: find color-impacting hardcoded values per template file.
// Reports anything that paints pixels but is NOT wired to a --token-* var.
//
// Categories scanned:
//   - bg-[#hex] / text-[#hex] / border-[#hex] / from-[#hex] / via-[#hex] / to-[#hex]
//   - bg-white|black/X, text-white|black/X, border-white|black/X (alpha utilities)
//   - bg-gray-N, bg-zinc-N, bg-slate-N, bg-pink-N etc. (Tailwind palette)
//   - inline style={{ background[Color]?: '#hex' }} / color: '#hex'
//
// Each finding includes a `tokenSibling` flag: true if the same element
// also has a var(--token-*) reference — then it's already styled by token,
// the hardcoded value is just a fallback or decoration → not blocking.
//
// Usage:  node scripts/audit-template-colors.cjs [--all]
//
// Without --all: prints per-file summary + top 20 worst offenders.
// With --all: prints every finding.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'apps', 'renderer', 'src', 'templates');
const SHOW_ALL = process.argv.includes('--all');

const HEX_UTIL = /(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|outline|decoration)-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?/g;
const ALPHA_UTIL = /(?:bg|text|border)-(?:white|black)\/\d+/g;
const PALETTE_UTIL = /(?:bg|text|border|from|via|to)-(?:gray|zinc|slate|stone|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d+)?/g;
const INLINE_HEX = /(?:background(?:Color)?|color|borderColor|outlineColor|fill|stroke):\s*['"`]#[0-9a-fA-F]{3,8}['"`]/g;
const INLINE_RGB = /(?:background(?:Color)?|color|borderColor|outlineColor|fill|stroke):\s*['"`]rgb/g;

const stats = [];

function audit(file) {
  const src = fs.readFileSync(file, 'utf8');
  const findings = {
    hexUtils: (src.match(HEX_UTIL) || []),
    alphaUtils: (src.match(ALPHA_UTIL) || []),
    paletteUtils: (src.match(PALETTE_UTIL) || []),
    inlineHex: (src.match(INLINE_HEX) || []),
    inlineRgb: (src.match(INLINE_RGB) || []),
    tokenRefs: (src.match(/var\(--token-[\w-]+\)/g) || []).length,
  };
  const total =
    findings.hexUtils.length +
    findings.alphaUtils.length +
    findings.paletteUtils.length +
    findings.inlineHex.length +
    findings.inlineRgb.length;
  if (total > 0 || findings.tokenRefs === 0) {
    stats.push({
      file: path.relative(ROOT, file),
      total,
      tokens: findings.tokenRefs,
      hex: findings.hexUtils.length,
      alpha: findings.alphaUtils.length,
      palette: findings.paletteUtils.length,
      inlineHex: findings.inlineHex.length,
      inlineRgb: findings.inlineRgb.length,
      findings,
    });
  }
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.tsx')) audit(p);
  }
}

walk(ROOT);

// Aggregate
const totals = stats.reduce(
  (a, s) => {
    a.files += 1;
    a.total += s.total;
    a.hex += s.hex;
    a.alpha += s.alpha;
    a.palette += s.palette;
    a.inlineHex += s.inlineHex;
    a.inlineRgb += s.inlineRgb;
    if (s.tokens === 0 && s.total > 0) a.zeroTokenFiles += 1;
    return a;
  },
  { files: 0, total: 0, hex: 0, alpha: 0, palette: 0, inlineHex: 0, inlineRgb: 0, zeroTokenFiles: 0 },
);

console.log('TEMPLATE COLOR AUDIT');
console.log('====================');
console.log(`Files with hardcoded colours : ${totals.files}`);
console.log(`Total hardcoded refs         : ${totals.total}`);
console.log(`  hex-utility    bg-[#abc]   : ${totals.hex}`);
console.log(`  alpha-utility  bg-white/15 : ${totals.alpha}`);
console.log(`  palette-utility bg-zinc-100: ${totals.palette}`);
console.log(`  inline-style   color:'#…'  : ${totals.inlineHex}`);
console.log(`  inline-style   color:'rgb…': ${totals.inlineRgb}`);
console.log(`Files with ZERO token refs   : ${totals.zeroTokenFiles}`);
console.log();

stats.sort((a, b) => b.total - a.total);
const top = SHOW_ALL ? stats : stats.slice(0, 25);
console.log(`Top ${top.length} offenders (${SHOW_ALL ? 'all' : 'pass --all for full list'}):`);
console.log('  HEX ALPHA PALT IN# RGB TOK  FILE');
for (const s of top) {
  console.log(
    `  ${pad(s.hex, 3)} ${pad(s.alpha, 5)} ${pad(s.palette, 4)} ${pad(s.inlineHex, 3)} ${pad(s.inlineRgb, 3)} ${pad(s.tokens, 3)}  ${s.file}`,
  );
}

function pad(n, w) { return String(n).padStart(w); }
