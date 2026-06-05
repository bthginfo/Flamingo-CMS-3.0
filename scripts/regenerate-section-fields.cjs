#!/usr/bin/env node
/**
 * scripts/regenerate-section-fields.cjs
 *
 * Drift-prevention codegen: derives the canonical SECTION_FIELDS map
 * from real template source and rewrites it in
 *   apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx
 *
 * For each sectionType (resolved from templates/index.ts + INDUSTRY_TEMPLATES),
 * the desired field list is the union of:
 *   - fields whose cssVar appears directly in any of the section's templates
 *   - fields whose cssVar is the --token-Y of a wrap pair var(--token-Y, var(--style-X | --brand-X, …)) where --style-X/--brand-X is used
 * Field order follows the FIELD_DEFS declaration order so the editor UI stays stable.
 *
 * DB-safety: any field already used by a tenant (page_sections.style_overrides
 * has its cssVar) is kept even if the current templates don't reference it,
 * preventing data loss. Requires DATABASE_URL env var.
 *
 * Usage:
 *   node scripts/regenerate-section-fields.cjs           # write changes
 *   node scripts/regenerate-section-fields.cjs --check   # exit 1 if changes needed
 *
 * Run automatically in CI via .github/workflows/color-audit.yml.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const EDITOR_PATH = path.join(REPO_ROOT, 'apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
const TEMPLATES_INDEX = path.join(REPO_ROOT, 'apps/renderer/src/templates/index.ts');
const TEMPLATES_DIR = path.join(REPO_ROOT, 'apps/renderer/src/templates');

const CHECK_ONLY = process.argv.includes('--check');

function readFile(p) { return fs.readFileSync(p, 'utf8'); }

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(f.name) && f.name !== 'index.ts') out.push(full);
  }
  return out;
}

// 1) Parse FIELD_DEFS + SECTION_FIELDS from the editor
const editor = readFile(EDITOR_PATH);
const fieldDefs = {};
const fieldOrder = [];
{
  const m = editor.match(/const FIELD_DEFS[\s\S]+?\n\};/);
  if (!m) { console.error('FIELD_DEFS not found in editor'); process.exit(2); }
  const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{\s*cssVar\s*:\s*'(--[a-z0-9-]+)'/gm;
  let mm;
  while ((mm = re.exec(m[0]))) { fieldDefs[mm[1]] = mm[2]; fieldOrder.push(mm[1]); }
}
const cssVarToField = {};
for (const [k, v] of Object.entries(fieldDefs)) if (!(v in cssVarToField)) cssVarToField[v] = k;

const currentSectionFields = {};
let sectionFieldsBlock;
{
  const m = editor.match(/(SECTION_FIELDS[^=]*=\s*\{)([\s\S]+?)(\n\};)/);
  if (!m) { console.error('SECTION_FIELDS block not found'); process.exit(2); }
  sectionFieldsBlock = m;
  const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\[([^\]]*)\]/gm;
  let mm;
  while ((mm = re.exec(m[2]))) currentSectionFields[mm[1]] = mm[2].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
}

// 2) Build PascalCase export → file map for all templates
const tplFiles = walk(TEMPLATES_DIR);
const compToPath = {};
for (const p of tplFiles) {
  const src = readFile(p);
  const exp = new Set();
  for (const m of src.matchAll(/export\s+(?:default\s+)?(?:function|class|const|let|var)\s+([A-Z][a-zA-Z0-9]*)/g)) exp.add(m[1]);
  for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().replace(/\s+as\s+(\w+).*$/, '$1');
      if (/^[A-Z]/.test(name)) exp.add(name);
    }
  }
  for (const e of exp) {
    if (!compToPath[e]) compToPath[e] = p;
    else if (compToPath[e] !== p && compToPath[e].endsWith('/index.ts')) compToPath[e] = p;
  }
}

// 3) sectionType → component(s)
const idx = readFile(TEMPLATES_INDEX);
const typeToComps = {};
for (const bm of idx.matchAll(/Record<string,\s*TemplateComponent>\s*=\s*\{([\s\S]*?)\n\};/g)) {
  for (const em of bm[1].matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][a-zA-Z0-9]*)\s*,?/gm)) {
    (typeToComps[em[1]] = typeToComps[em[1]] || new Set()).add(em[2]);
  }
}
const indStart = idx.indexOf('INDUSTRY_TEMPLATES');
if (indStart > 0) {
  let s = idx.indexOf('{', indStart);
  let depth = 0, end = -1;
  for (let k = s; k < idx.length; k++) { if (idx[k] === '{') depth++; else if (idx[k] === '}') { depth--; if (!depth) { end = k; break; } } }
  if (end > 0) {
    const body = idx.slice(s + 1, end);
    const innerRe = /([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{/g;
    let im;
    while ((im = innerRe.exec(body))) {
      const innerStart = im.index + im[0].length - 1;
      let d2 = 0, innerEnd = -1;
      for (let k = innerStart; k < body.length; k++) { if (body[k] === '{') d2++; else if (body[k] === '}') { d2--; if (!d2) { innerEnd = k; break; } } }
      if (innerEnd < 0) continue;
      const inner = body.slice(innerStart + 1, innerEnd);
      for (const em of inner.matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][a-zA-Z0-9]*)\s*,?/gm)) {
        (typeToComps[em[1]] = typeToComps[em[1]] || new Set()).add(em[2]);
      }
      innerRe.lastIndex = innerEnd + 1;
    }
  }
}

// 4) sectionType → template paths
const typeToPaths = {};
for (const [t, comps] of Object.entries(typeToComps)) {
  const paths = new Set();
  for (const c of comps) if (compToPath[c]) paths.add(compToPath[c]);
  typeToPaths[t] = paths;
}

// 5) Extract vars + wrap pairs per template
const VARS_RE = /var\(\s*(--[a-z0-9-]+)/g;
const PAIR_RE = /var\(\s*(--token-[a-z0-9-]+)\s*,\s*var\(\s*(--(?:style|brand)-[a-z0-9-]+)/g;
const tplVars = {}, tplWraps = {};
const allPaths = new Set();
for (const set of Object.values(typeToPaths)) for (const p of set) allPaths.add(p);
for (const p of allPaths) {
  const src = readFile(p);
  const vs = new Set();
  for (const m of src.matchAll(VARS_RE)) vs.add(m[1]);
  const wraps = new Map();
  for (const m of src.matchAll(PAIR_RE)) wraps.set(m[2], m[1]);
  tplVars[p] = vs; tplWraps[p] = wraps;
}

// 6) Optional DB safety: load active styleOverrides keys per sectionType
let dbInUse = {};
async function loadDbUsage() {
  if (!process.env.DATABASE_URL) return;
  let Client;
  try { ({ Client } = require('pg')); } catch { console.warn('pg not installed — skipping DB-usage safety check'); return; }
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    await c.connect();
    const { rows } = await c.query(`
      SELECT type, jsonb_object_keys(style_overrides) AS cssvar
        FROM page_sections
       WHERE style_overrides IS NOT NULL
    `);
    for (const r of rows) (dbInUse[r.type] = dbInUse[r.type] || new Set()).add(r.cssvar);
  } finally { await c.end().catch(() => {}); }
}

(async () => {
  await loadDbUsage();

  // 7) Compute desired SECTION_FIELDS for every sectionType found in templates/index.ts
  //    (not just types already present in the editor — adds missing ones too).
  const allTypes = new Set([...Object.keys(currentSectionFields), ...Object.keys(typeToPaths)]);
  const desired = {};
  for (const type of allTypes) {
    const tpaths = typeToPaths[type] || new Set();
    const used = new Set();
    const wraps = new Map();
    for (const p of tpaths) {
      for (const v of (tplVars[p] || new Set())) used.add(v);
      for (const [k, v] of (tplWraps[p] || new Map())) wraps.set(k, v);
    }
    const want = new Set();
    // Direct: cssVar used as-is
    for (const [field, cssVar] of Object.entries(fieldDefs)) if (used.has(cssVar)) want.add(field);
    // Wrapped: cssVar is the --token-* part of an active wrap pair
    for (const [styleVar, tokenVar] of wraps) {
      if (!used.has(styleVar)) continue;
      const fld = cssVarToField[tokenVar];
      if (fld) want.add(fld);
    }
    // Preserve DB-active fields (keep tenant data working). Only relevant for
    // sections that already exist in SECTION_FIELDS.
    const inUse = dbInUse[type] || new Set();
    for (const field of (currentSectionFields[type] || [])) {
      const cv = fieldDefs[field];
      if (cv && inUse.has(cv)) want.add(field);
    }
    // Order by canonical FIELD_DEFS order
    desired[type] = fieldOrder.filter(f => want.has(f));
  }

  // 8) Diff vs current
  const changes = [];
  const inserts = [];
  for (const type of Object.keys(desired)) {
    const cur = currentSectionFields[type];
    const next = desired[type];
    if (!cur) {
      if (next.length) inserts.push({ type, next });
      continue;
    }
    const added = next.filter(f => !cur.includes(f));
    const removed = cur.filter(f => !next.includes(f));
    if (added.length || removed.length) changes.push({ type, added, removed, next });
  }

  if (!changes.length && !inserts.length) { console.log('SECTION_FIELDS already canonical — no changes.'); return; }

  console.log(`Codegen wants ${changes.length} updated, ${inserts.length} new section(s):`);
  for (const c of changes.slice(0, 20)) {
    const a = c.added.length ? ' +' + c.added.join(',') : '';
    const r = c.removed.length ? ' -' + c.removed.join(',') : '';
    console.log(' ~', c.type + a + r);
  }
  for (const i of inserts.slice(0, 20)) {
    console.log(' +', i.type, '=', i.next.join(','));
  }
  if (changes.length + inserts.length > 40) console.log('  …more truncated');

  if (CHECK_ONLY) {
    console.error('\nSECTION_FIELDS is out of sync with templates. Run: node scripts/regenerate-section-fields.cjs');
    process.exit(1);
  }

  // 9) Splice each existing entry in editor source
  let patched = editor;
  for (const c of changes) {
    const re = new RegExp('(^\\s*' + c.type + '\\s*:\\s*\\[)([^\\]]*?)(\\])', 'm');
    const m = patched.match(re);
    if (!m) { console.warn('  ! cannot locate', c.type, '— skipped'); continue; }
    const arr = c.next.map(f => `'${f}'`).join(', ');
    patched = patched.slice(0, m.index) + m[1] + arr + m[3] + patched.slice(m.index + m[0].length);
  }

  // 10) Insert new entries before SECTION_FIELDS closing brace
  if (inserts.length) {
    // Find SECTION_FIELDS: Record<...> = { ... };  — match the closing `};` of that object.
    const startRe = /const\s+SECTION_FIELDS\s*:\s*Record<[^>]+>\s*=\s*\{/;
    const startMatch = patched.match(startRe);
    if (!startMatch) {
      console.warn('  ! cannot find SECTION_FIELDS opening — skipping inserts');
    } else {
      // Walk braces from start to find matching close.
      let depth = 0;
      let i = startMatch.index + startMatch[0].length - 1; // position of opening '{'
      let closeIdx = -1;
      for (; i < patched.length; i++) {
        const ch = patched[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) { closeIdx = i; break; }
        }
      }
      if (closeIdx === -1) {
        console.warn('  ! cannot find SECTION_FIELDS closing brace — skipping inserts');
      } else {
        const block = inserts
          .map(ins => `  ${ins.type}: [${ins.next.map(f => `'${f}'`).join(', ')}],`)
          .join('\n') + '\n';
        patched = patched.slice(0, closeIdx) + block + patched.slice(closeIdx);
      }
    }
  }

  fs.writeFileSync(EDITOR_PATH, patched);
  console.log('\nWrote', EDITOR_PATH);
})().catch(e => { console.error(e); process.exit(1); });
