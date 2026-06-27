#!/usr/bin/env node
/**
 * recolor.cjs — give a tenant a fresh, industry-fitting colour identity while
 * PRESERVING every section's light/dark structure (so readability is kept).
 *
 * Method: every colour in the tenant's section styleOverrides (and brand) is
 * converted to OKLCH; we keep its lightness L (≈ contrast) and rotate hue/chroma
 * to a per-tenant scheme — a `base` hue for dark/neutral structural colours and
 * an `accent` hue for the saturated highlight colour. rgba() alphas are kept;
 * var()/keywords are left untouched. The result is verified with the static
 * contrast check before anything is written.
 *
 *   node scripts/demo-tenants/recolor.cjs --dry  <slug…|all>
 *   node scripts/demo-tenants/recolor.cjs --apply <slug…|all>     (needs PAT_<SLUG>)
 *
 * Dry mode writes a recoloured snapshot to _snapshots/_recolored/<slug>.json and
 * prints the substitution map + any contrast regressions. Apply mode PATCHes
 * every page's sections and PUTs the brand. The original _snapshots/<slug>.json
 * backup is never modified.
 */
const fs = require('fs');
const path = require('path');
const Api = require('./_lib/api.cjs');
const { makeResolver } = require('./_lib/contracts.cjs');
const resolveContract = makeResolver();

const DIR = path.join(__dirname, '_snapshots');
const OUT = path.join(DIR, '_recolored');

// ── per-tenant scheme: OKLCH hue (deg) for structural base & saturated accent ──
// Chosen to fit each industry; base+accent are harmonious pairs.
const SCHEME = {
  handwerk:    { base: 250, accent: 60 },   // steel blue + copper
  restaurant:  { base: 50,  accent: 75 },   // espresso + amber
  hotel:       { base: 155, accent: 85 },   // forest green + gold
  salon:       { base: 330, accent: 5 },    // aubergine + rose
  tourismus:   { base: 195, accent: 80 },   // deep teal + amber
  medical:     { base: 195, accent: 215 },  // teal + calm cyan
  wedding:     { base: 35,  accent: 15 },   // terracotta + dusty rose
  photography: { base: 60,  accent: 45 },   // warm charcoal + terracotta
  consulting:  { base: 255, accent: 75 },   // navy + bronze
  realestate:  { base: 210, accent: 70 },   // deep teal-navy + bronze
  cafe:        { base: 55,  accent: 70 },   // coffee brown + caramel
  tattoo:      { base: 40,  accent: 45 },   // warm ink + rust
  ecommerce:   { base: 330, accent: 28 },   // plum + coral
  retail:      { base: 250, accent: 50 },   // slate + copper
  florist:     { base: 345, accent: 8 },    // plum + rose pink
  fitness:     { base: 300, accent: 205 },  // violet + electric cyan
  location:    { base: 35,  accent: 78 },   // espresso/aubergine + amber
};

// ── colour math: sRGB hex ↔ OKLCH ─────────────────────────────────────────────
const srgbToLin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linToSrgb = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const cbrt = Math.cbrt;

function hexToOklch(hex) {
  const r = srgbToLin(parseInt(hex.slice(1, 3), 16) / 255);
  const g = srgbToLin(parseInt(hex.slice(3, 5), 16) / 255);
  const b = srgbToLin(parseInt(hex.slice(5, 7), 16) / 255);
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return { L, C: Math.hypot(A, B), H: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
}

function oklchToHex({ L, C, H }) {
  const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const ch = x => Math.max(0, Math.min(255, Math.round(linToSrgb(Math.max(0, Math.min(1, x))) * 255)));
  const hx = n => n.toString(16).padStart(2, '0');
  return ('#' + hx(ch(r)) + hx(ch(g)) + hx(ch(bl))).toUpperCase();
}

// Map one colour into the tenant scheme, keeping lightness (→ contrast) intact.
function recolorHex(hex, scheme) {
  const { L, C, H } = hexToOklch(hex);
  if (L > 0.965 && C < 0.02) return hex.toUpperCase();      // white → white
  let newH, newC;
  if (C < 0.03) {                                            // near-neutral (grey/cream/ink)
    newH = scheme.base; newC = Math.min(C, L > 0.8 ? 0.018 : 0.03);
  } else if (L < 0.5) {                                      // dark structural → base hue
    newH = scheme.base; newC = Math.min(Math.max(C, 0.04), 0.12);
  } else {                                                   // saturated mid/light → accent hue
    newH = scheme.accent; newC = Math.min(Math.max(C, 0.07), 0.15);
  }
  return oklchToHex({ L, C: newC, H: newH });
}

// Recolour any style value (hex, rgba(...with hex? no), keep var()/rgba alpha).
function recolorValue(val, scheme, map) {
  if (typeof val !== 'string') return val;
  return val.replace(/#[0-9a-fA-F]{6}\b/g, h => {
    const up = h.toUpperCase();
    if (!map.has(up)) map.set(up, recolorHex(up, scheme));
    return map.get(up);
  });
}

// Deep-recolour every hex inside any string in an arbitrary value (used for
// collection items, whose data holds nested sections + colour fields).
function recolorDeep(val, scheme, map) {
  if (typeof val === 'string') return recolorValue(val, scheme, map);
  if (Array.isArray(val)) return val.map(v => recolorDeep(v, scheme, map));
  if (val && typeof val === 'object') { const o = {}; for (const k of Object.keys(val)) o[k] = recolorDeep(val[k], scheme, map); return o; }
  return val;
}

// ── static contrast guard (mirror of analyze-contrast.cjs, opaque bg only) ─────
function lumHex(hex) { const f = v => { v = srgbToLin(v / 255); return v; }; const r = f(parseInt(hex.slice(1, 3), 16)), g = f(parseInt(hex.slice(3, 5), 16)), b = f(parseInt(hex.slice(5, 7), 16)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function contrastHex(a, b) { const L1 = Math.max(lumHex(a), lumHex(b)), L2 = Math.min(lumHex(a), lumHex(b)); return (L1 + 0.05) / (L2 + 0.05); }

const FG = ['--token-heading', '--token-body', '--token-price', '--token-card-body', '--token-eyebrow', '--token-on-dark-heading', '--token-on-dark-body'];

// Nudge a foreground hex's lightness (hue/chroma kept) until it clears `target`
// contrast against an opaque background — darken on light bg, lighten on dark bg.
function repairHex(fgHex, bgHex, target = 3.2) {
  if (contrastHex(fgHex, bgHex) >= target) return fgHex;
  const { C, H } = hexToOklch(fgHex);
  const bgLight = lumHex(bgHex) > 0.4;
  let best = fgHex;
  for (let i = 1; i <= 60; i++) {
    const L = hexToOklch(best).L + (bgLight ? -0.012 : 0.012);
    if (L <= 0 || L >= 1) break;
    best = oklchToHex({ L, C, H });
    if (contrastHex(best, bgHex) >= target) break;
  }
  return best;
}

function repair(pages) {
  for (const p of pages) for (const sec of p.sections || []) {
    const so = sec.styleOverrides; if (!so) continue;
    const bg = so['--token-section-bg'];
    if (!/^#[0-9a-fA-F]{6}$/.test(bg || '')) continue;
    for (const k of FG) if (/^#[0-9a-fA-F]{6}$/.test(so[k] || '')) so[k] = repairHex(so[k], bg);
  }
}

function guard(pages) {
  const issues = [];
  for (const p of pages) for (const sec of p.sections || []) {
    const so = sec.styleOverrides || {};
    const bg = so['--token-section-bg'];
    if (!/^#[0-9a-fA-F]{6}$/.test(bg || '')) continue;
    for (const k of FG) { const v = so[k]; if (/^#[0-9a-fA-F]{6}$/.test(v || '')) { const c = contrastHex(v, bg); if (c < 3.0) issues.push(`${p.slug}/${sec.type} ${k} ${v} on ${bg} = ${c.toFixed(2)}`); } }
  }
  return issues;
}

// ── per-tenant recolour ───────────────────────────────────────────────────────
function recolorTenant(slug) {
  const scheme = SCHEME[slug];
  if (!scheme) throw new Error(`no scheme for ${slug}`);
  const snap = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), 'utf8'));
  const map = new Map();
  for (const p of snap.content.pages) for (const sec of p.sections) {
    if (sec.styleOverrides) for (const k of Object.keys(sec.styleOverrides)) sec.styleOverrides[k] = recolorValue(sec.styleOverrides[k], scheme, map);
    if (sec.data) sec.data = recolorDeep(sec.data, scheme, map); // overlayColor, bgColor, trustStripColor, …
  }
  // brand config (best-effort: recolour any hex string field)
  // Collection items: nested sections + colour fields inside data. Also trim
  // each nested section's styleOverrides to its CURRENT contract — the item PUT
  // validates strictly (unlike the page PATCH which trims server-side), so stale
  // keys (e.g. --token-heading on ctaBand after the template fix) would 400.
  const industry = (snap.tenant && snap.tenant.industry) || undefined;
  for (const col of snap.content.collections || []) for (const item of col.items || []) {
    if (!item.data) continue;
    item.data = recolorDeep(item.data, scheme, map);
    if (Array.isArray(item.data.sections)) {
      for (const sec of item.data.sections) {
        if (!sec || !sec.styleOverrides || typeof sec.styleOverrides !== 'object') continue;
        const allowed = resolveContract(sec.type, industry);
        for (const k of Object.keys(sec.styleOverrides)) if (k.startsWith('--') && !allowed.has(k)) delete sec.styleOverrides[k];
      }
    }
  }
  const brand = (snap.config && snap.config.brand) || null;
  if (brand) for (const k of Object.keys(brand)) if (typeof brand[k] === 'string') brand[k] = recolorValue(brand[k], scheme, map);
  repair(snap.content.pages); // nudge any sub-AA explicit pair to clear the floor
  return { snap, map, brand, issues: guard(snap.content.pages) };
}

async function applyTenant(slug, snap, brand) {
  const pat = process.env['PAT_' + slug.toUpperCase()];
  if (!pat) throw new Error(`missing PAT_${slug.toUpperCase()}`);
  const api = new Api({ pat, verbose: false });
  let patched = 0;
  for (const p of snap.content.pages) {
    const patchSections = [];
    for (const s of p.sections || []) {
      const patch = { id: s.id };
      if (s.styleOverrides && Object.keys(s.styleOverrides).length) patch.styleOverrides = s.styleOverrides;
      if (s.data && /#[0-9a-fA-F]{6}\b/.test(JSON.stringify(s.data))) patch.data = s.data; // recoloured overlay/bg fields
      if (patch.styleOverrides || patch.data) patchSections.push(patch);
    }
    if (!patchSections.length) continue;
    await api.patchPage(p.id, { patchSections });
    patched += patchSections.length;
  }
  // Collection items (nested sections / colour fields).
  let items = 0;
  for (const col of snap.content.collections || []) for (const item of col.items || []) {
    if (!item.data) continue;
    try {
      await api.updateItem(col.key, item.id, { data: item.data, title: item.title, slug: item.slug, published: item.published, priority: item.priority });
      items++;
    } catch (e) { console.log(`    item ${col.key}/${item.slug} failed: ${e.message}`); }
  }
  if (brand) { try { await api.brand(brand); } catch (e) { console.log(`    brand PUT failed: ${e.message}`); } }
  // Publish so the recoloured draft becomes the active snapshot the renderer serves.
  try { await api.publish({}); } catch (e) { console.log(`    publish failed: ${e.status || ''} ${e.message}`); }
  return { patched, items };
}

(async () => {
  const args = process.argv.slice(2);
  const mode = args.includes('--apply') ? 'apply' : 'dry';
  let slugs = args.filter(a => !a.startsWith('--'));
  if (slugs.includes('all') || !slugs.length) slugs = Object.keys(SCHEME);

  fs.mkdirSync(OUT, { recursive: true });
  let anyIssue = false;
  for (const slug of slugs) {
    const { snap, map, brand, issues } = recolorTenant(slug);
    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(snap, null, 2) + '\n');
    console.log(`\n### ${slug}  (${map.size} colours → base ${SCHEME[slug].base}° / accent ${SCHEME[slug].accent}°)`);
    const sample = [...map.entries()].slice(0, 8).map(([o, n]) => `${o}→${n}`).join('  ');
    console.log('  ' + sample + (map.size > 8 ? '  …' : ''));
    if (issues.length) { anyIssue = true; console.log('  ⚠ CONTRAST REGRESSIONS:'); issues.forEach(i => console.log('    ' + i)); }
    else console.log('  contrast guard: OK');
    if (mode === 'apply') {
      if (issues.length) { console.log('  ✗ skipping apply (fix scheme first)'); continue; }
      const r = await applyTenant(slug, snap, brand);
      console.log(`  ✓ applied: ${r.patched} sections + ${r.items} items + brand, published`);
    }
  }
  if (mode === 'dry') console.log(`\nDry run complete → ${path.relative(process.cwd(), OUT)}/. ${anyIssue ? 'Fix regressions before --apply.' : 'No regressions; safe to --apply.'}`);
})();
