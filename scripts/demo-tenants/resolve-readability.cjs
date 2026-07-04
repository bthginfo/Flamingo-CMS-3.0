#!/usr/bin/env node
/**
 * resolve-readability.cjs — EMPIRICAL readability check against the live render.
 *
 * Fetches each /demo/<key> page and resolves the CSS custom-property cascade the
 * renderer actually emitted (page-level brand defaults ⊕ per-section overrides ⊕
 * the per-section theme-aware --_card-h / --_card-b definitions). For every
 * section it then composites and contrasts the section background against the
 * heading / body / card-heading / card-body colours that the templates use, and
 * flags anything genuinely unreadable. Unlike the static analyzer this also
 * catches problems created by page-level defaults, not just explicit overrides.
 *
 *   node scripts/demo-tenants/resolve-readability.cjs [key…]
 *
 * Sections whose background is an image / translucent / non-static colour are
 * skipped (their real backdrop can't be judged from CSS alone).
 */
const { execFileSync } = require('child_process');

const KEYS = process.argv.slice(2).length ? process.argv.slice(2) : [
  'handwerk', 'restaurant', 'hotel', 'salon', 'tourismus', 'medical', 'wedding',
  'photography', 'consulting', 'realestate', 'cafe', 'tattoo', 'shop', 'retail',
  'florist', 'fitness', 'location',
];
const BASE = 'https://www.demo.flamingomedia.online/demo/';
const FLOOR = 3.0; // AA-large floor; headings/body should clear this comfortably

function fetchHtml(url) {
  try { return execFileSync('curl', ['-sS', '--max-time', '40', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8'); }
  catch { return ''; }
}

function parseColor(c) {
  if (typeof c !== 'string') return null;
  c = c.trim();
  let m = c.match(/^#([0-9a-fA-F]{6})$/);
  if (m) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1];
  m = c.match(/^#([0-9a-fA-F]{3})$/);
  if (m) return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16), 1];
  m = c.match(/^rgba?\(([^)]+)\)$/i);
  if (m) { const p = m[1].split(',').map(s => parseFloat(s.trim())); if (p.length >= 3 && p.slice(0, 3).every(Number.isFinite)) return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  return null;
}
const over = (fg, bg) => { const a = fg[3]; return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1]; };
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (a, b) => { const L1 = Math.max(lum(a), lum(b)), L2 = Math.min(lum(a), lum(b)); return (L1 + 0.05) / (L2 + 0.05); };

// Resolve a var() chain against a flat property map. Returns a static colour or null.
function resolveVar(expr, map, depth = 0) {
  if (depth > 12 || typeof expr !== 'string') return null;
  expr = expr.trim();
  const direct = parseColor(expr);
  if (direct) return direct;
  const m = expr.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([\s\S]+))?\)$/i);
  if (m) {
    const [, name, fallback] = m;
    if (map[name] != null) { const r = resolveVar(map[name], map, depth + 1); if (r) return r; }
    if (fallback) return resolveVar(fallback, map, depth + 1);
  }
  return null;
}

// Extract `--prop: value;` pairs from a style string (handles nested var/parens).
function extractProps(style) {
  const out = {};
  const re = /(--[a-z0-9-]+)\s*:\s*((?:[^;()]|\([^)]*\))*)/gi;
  let m; while ((m = re.exec(style))) out[m[1]] = m[2].trim();
  return out;
}

function scanTenant(key, flagged) {
  const html = fetchHtml(BASE + key);
  if (!html || html.length < 5000) { console.log(`  ${key.padEnd(12)} fetch failed`); return; }

  // Page-level defaults: the outermost [data-style] wrapper's inline style.
  const rootStyle = (html.match(/data-style[^>]*style="([^"]*--token[^"]*)"/) || [])[1] || '';
  const rootMap = extractProps(rootStyle);

  // Per-section --_card-h / --_card-b come from <style> rules keyed by section id.
  const cardVars = {}; // sectionId -> { '--_card-h':expr, '--_card-b':expr }
  const styleRe = /data-section-id="([0-9a-f-]+)"\]\[data-style\]\s*\{([^}]*)\}/gi;
  let sm; while ((sm = styleRe.exec(html))) { cardVars[sm[1]] = extractProps(sm[2]); }

  // Media-overlay sections (photo heroes) are identifiable by their injected
  // heading rule: it either carries the light literal default (#ffffff /
  // rgba(255…)) or the section's own literal override — never the page-token
  // var() chain (that chain would resolve to the page's dark ink there).
  const mediaSections = new Set();
  const mediaHeadExpr = {}; // sectionId -> the colour expression the rule paints
  const headRuleRe = /data-section-id="([0-9a-f-]+)"\]\[data-style\]\s*:is\(h1[^{]*\{\s*color:\s*([^;}]*?)\s*!important/gi;
  let hm; while ((hm = headRuleRe.exec(html))) {
    const expr = hm[2].trim();
    // A media rule is one whose expression is NOT the page-token chain.
    if (!expr.startsWith('var(--token-heading')) { mediaSections.add(hm[1]); mediaHeadExpr[hm[1]] = expr; }
    else if (expr.includes('#ffffff')) { mediaSections.add(hm[1]); mediaHeadExpr[hm[1]] = expr; }
  }

  // Each section wrapper opening tag. Attribute ORDER is not guaranteed —
  // `style` may come before `data-section-id` — so match the whole tag and
  // pull the attributes out separately. The `\s` before style=" keeps the
  // data-style="" attribute from matching as a substring.
  const tagRe = /<[a-z]+[^>]*\bdata-section-id="([0-9a-f-]+)"[^>]*>/gi;
  let s; const seen = new Set();
  while ((s = tagRe.exec(html))) {
    const id = s[1];
    if (seen.has(id)) continue; seen.add(id);
    const styleAttr = (s[0].match(/\sstyle="([^"]*)"/) || [])[1] || '';
    const map = { ...rootMap, ...extractProps(styleAttr), ...(cardVars[id] || {}) };

    const bgRaw = map['--token-section-bg'];
    const bg0 = resolveVar(bgRaw, map);

    // Media-overlay sections (photo behind text, dark overlay in practice):
    // the section bg cannot be judged, but the PAINTED heading colour can —
    // resolve exactly the expression the injected rule paints. A dark result
    // is the "dark headline on a dark photo" bug.
    if (mediaSections.has(id)) {
      const fg0 = resolveVar(mediaHeadExpr[id], map);
      if (fg0 && fg0[3] > 0.5 && lum(over(fg0, [0, 0, 0, 1])) < 0.25) {
        flagged.push({ key, id: id.slice(0, 8), fgVar: 'heading(painted)', fg: rgb(fg0), bg: 'photo+overlay', ratio: 'dark-on-media' });
      }
      continue;
    }

    if (!bg0 || (parseColor(bgRaw) && parseColor(bgRaw)[3] < 1)) continue; // skip translucent/unknown bg
    const bg = bg0[3] < 1 ? over(bg0, [255, 255, 255, 1]) : bg0;

    // Card backdrop: card text renders on the CARD bg, not the section bg.
    // Composite translucent card fills over the section bg first.
    const cardBg0 = resolveVar(map['--token-card-bg'] || 'var(--token-card-bg)', map);
    const cardBg = cardBg0 ? (cardBg0[3] < 1 ? over(cardBg0, bg) : cardBg0) : bg;

    for (const [fgVar, base] of [
      ['--token-heading', bg], ['--token-body', bg],
      ['--_card-h', cardBg], ['--_card-b', cardBg],
    ]) {
      const fg0 = resolveVar(map[fgVar] || `var(${fgVar})`, map);
      if (!fg0) continue;
      const fg = fg0[3] < 1 ? over(fg0, base) : fg0;
      const ratio = contrast(fg, base);
      if (ratio < FLOOR) flagged.push({ key, id: id.slice(0, 8), fgVar, fg: rgb(fg), bg: rgb(base), ratio: ratio.toFixed(2) });
    }
  }
}
const rgb = c => `rgb(${c.slice(0, 3).map(Math.round).join(',')})`;

const flagged = [];
console.log(`Resolving readability on ${KEYS.length} live page(s)…`);
for (const k of KEYS) scanTenant(k, flagged);

if (!flagged.length) {
  console.log('\nAll sections with a static background resolve to readable text (≥ 3.0:1). ✔');
} else {
  console.log(`\nFound ${flagged.length} unreadable section text(s):\n`);
  let cur = '';
  for (const f of flagged.sort((a, b) => a.key.localeCompare(b.key))) {
    if (f.key !== cur) { console.log(`### ${f.key}`); cur = f.key; }
    console.log(`  [${f.id}] ${f.fgVar.padEnd(16)} ${f.fg} on ${f.bg}  ratio=${f.ratio}`);
  }
}
