const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_ROOT = path.join(ROOT, 'apps', 'renderer', 'src', 'templates');
const BASELINE_PATH = path.join(__dirname, 'hardcoded-colors-baseline.json');

const WRITE_BASELINE = process.argv.includes('--write-baseline');

const HEX_UTIL = /(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|outline|decoration)-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?/g;
const ALPHA_UTIL = /(?:bg|text|border)-(?:white|black)\/\d+/g;
const PALETTE_UTIL = /(?:bg|text|border|from|via|to)-(?:gray|zinc|slate|stone|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d+)?/g;
const INLINE_HEX = /(?:background(?:Color)?|color|borderColor|outlineColor|fill|stroke):\s*['"`]#[0-9a-fA-F]{3,8}['"`]/g;
const INLINE_RGB = /(?:background(?:Color)?|color|borderColor|outlineColor|fill|stroke):\s*['"`]rgb/gi;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, out);
    else if (e.isFile() && /\.tsx?$/.test(e.name)) out.push(abs);
  }
  return out;
}

function scanFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const counts = {
    hexUtils: (src.match(HEX_UTIL) || []).length,
    alphaUtils: (src.match(ALPHA_UTIL) || []).length,
    paletteUtils: (src.match(PALETTE_UTIL) || []).length,
    inlineHex: (src.match(INLINE_HEX) || []).length,
    inlineRgb: (src.match(INLINE_RGB) || []).length,
  };
  const total = counts.hexUtils + counts.alphaUtils + counts.paletteUtils + counts.inlineHex + counts.inlineRgb;
  return { counts, total };
}

function collect() {
  const files = walk(TEMPLATES_ROOT);
  const perFile = {};
  const totals = { files: 0, total: 0, hexUtils: 0, alphaUtils: 0, paletteUtils: 0, inlineHex: 0, inlineRgb: 0 };

  for (const abs of files) {
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const { counts, total } = scanFile(abs);
    if (total > 0) {
      perFile[rel] = { ...counts, total };
      totals.files += 1;
      totals.total += total;
      totals.hexUtils += counts.hexUtils;
      totals.alphaUtils += counts.alphaUtils;
      totals.paletteUtils += counts.paletteUtils;
      totals.inlineHex += counts.inlineHex;
      totals.inlineRgb += counts.inlineRgb;
    }
  }

  return { generatedAt: new Date().toISOString(), perFile, totals };
}

function main() {
  const current = collect();

  if (WRITE_BASELINE) {
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + '\n', 'utf8');
    console.log('Wrote baseline:', path.relative(ROOT, BASELINE_PATH));
    console.log('Files:', current.totals.files, 'Total refs:', current.totals.total);
    return;
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error('Missing baseline:', path.relative(ROOT, BASELINE_PATH));
    console.error('Run: node scripts/check-hardcoded-colors-regression.cjs --write-baseline');
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  const regressions = [];

  const files = new Set([...Object.keys(baseline.perFile || {}), ...Object.keys(current.perFile || {})]);
  for (const file of files) {
    const before = baseline.perFile?.[file]?.total || 0;
    const now = current.perFile?.[file]?.total || 0;
    if (now > before) regressions.push({ file, before, now, delta: now - before });
  }

  const totalBefore = baseline.totals?.total || 0;
  const totalNow = current.totals?.total || 0;

  if (regressions.length === 0 && totalNow <= totalBefore) {
    console.log('hardcoded-color-regression: OK');
    console.log(`Total refs: ${totalNow} (baseline ${totalBefore})`);
    return;
  }

  regressions.sort((a, b) => b.delta - a.delta);
  console.error('hardcoded-color-regression: FAILED');
  console.error(`Total refs: ${totalNow} (baseline ${totalBefore})`);
  if (regressions.length) {
    console.error('Files with increased hardcoded refs:');
    for (const r of regressions.slice(0, 80)) {
      console.error(`- ${r.file}: ${r.before} -> ${r.now} (+${r.delta})`);
    }
    if (regressions.length > 80) console.error(`... ${regressions.length - 80} more`);
  }
  process.exit(1);
}

main();
