#!/usr/bin/env node
/**
 * analyze-contrast.cjs — scan exported snapshots for low-contrast colour pairs
 * that a section's OWN styleOverrides create (alpha composited over the section
 * background). Offline, deterministic; prints tenant / page / sectionId / type
 * so the offending sections can be patched in place via the content API.
 *
 *   node scripts/demo-tenants/analyze-contrast.cjs [slug…]
 *
 * Only pairs where BOTH the background and the foreground are explicitly set in
 * styleOverrides are evaluated — those are the ones the filling AI got wrong and
 * that no page-level default can rescue. Tokens left to page defaults are not
 * flagged here (the live render handles them; see the HTML scan for those).
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '_snapshots');
const PAGE_BG_FALLBACK = '#ffffff'; // for compositing a translucent section bg

// Foreground tokens and the contrast floor we expect against their background.
// Headings/large text: 3.0 (WCAG AA large). Body/muted: 4.5 (AA normal) but we
// report at 3.0 to stay focused on genuinely unreadable cases.
const FOREGROUNDS = ['--token-heading', '--token-body', '--token-muted', '--token-price',
  '--token-card-body', '--token-subheading', '--token-eyebrow', '--token-stat-value',
  '--token-on-dark-heading', '--token-on-dark-body'];
const FLOOR = 2.5;

function parseColor(c) {
  if (typeof c !== 'string') return null;
  c = c.trim();
  let m = c.match(/^#([0-9a-fA-F]{6})$/);
  if (m) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1];
  m = c.match(/^#([0-9a-fA-F]{3})$/);
  if (m) return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16), 1];
  m = c.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    if (p.length >= 3 && p.slice(0, 3).every(Number.isFinite)) return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  return null; // var(), color-mix(), keywords → not statically evaluable
}

function over(fg, bg) { // composite fg (with alpha) over opaque bg
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}

function lum([r, g, b]) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const L1 = Math.max(lum(a), lum(b)), L2 = Math.min(lum(a), lum(b));
  return (L1 + 0.05) / (L2 + 0.05);
}

function bgOf(so) {
  // Only judge against an OPAQUE section background that the section explicitly
  // sets. Translucent backgrounds (glassy cards on a hero image) and card-bg
  // fallbacks can't be evaluated statically — the real backdrop (image / page
  // bg / dark hero) isn't in the overrides, so we'd produce false positives.
  const c = parseColor(so['--token-section-bg']);
  return c && c[3] >= 1 ? c : null;
}

function analyzeSlug(slug, flagged) {
  const snap = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), 'utf8'));
  for (const page of snap.content.pages || []) {
    for (const sec of page.sections || []) {
      const so = sec.styleOverrides || {};
      const bg = bgOf(so);
      if (!bg) continue;
      for (const fgKey of FOREGROUNDS) {
        const fgRaw = so[fgKey];
        const fg0 = parseColor(fgRaw);
        if (!fg0) continue;
        const fg = fg0[3] < 1 ? over(fg0, bg) : fg0;
        const ratio = contrast(fg, bg);
        if (ratio < FLOOR) {
          flagged.push({ slug, page: page.slug, sectionId: sec.id, type: sec.type, fg: fgKey, fgRaw, bgRaw: so['--token-section-bg'] || so['--token-card-bg'], ratio: ratio.toFixed(2) });
        }
      }
    }
  }
}

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));

const flagged = [];
for (const slug of slugs) analyzeSlug(slug, flagged);

if (!flagged.length) {
  console.log('No statically-detectable low-contrast pairs in explicit styleOverrides. ✔');
} else {
  console.log(`Found ${flagged.length} low-contrast pair(s):\n`);
  let cur = '';
  for (const f of flagged.sort((a, b) => a.slug.localeCompare(b.slug) || a.page.localeCompare(b.page))) {
    if (f.slug !== cur) { console.log(`\n### ${f.slug}`); cur = f.slug; }
    console.log(`  ${f.type.padEnd(18)} ${f.fg.replace('--token-', '').padEnd(16)} ${String(f.fgRaw).padEnd(22)} on bg ${String(f.bgRaw)}  ratio=${f.ratio}  [${f.page || '(home)'} ${f.sectionId.slice(0, 8)}]`);
  }
}
