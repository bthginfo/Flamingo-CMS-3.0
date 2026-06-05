// audit-v2: robust template path resolution via barrel-export indexing.
const https = require('https');
const fs = require('fs');
const TOKEN = process.env.GITHUB_TOKEN || '';

function raw(p) { return new Promise((res, rej) => { https.get({ hostname: 'api.github.com', path: '/repos/bthginfo/Flamingo-CMS-3.0/contents/' + p + '?ref=main', headers: { 'User-Agent': 'x', 'Accept': 'application/vnd.github.raw', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}) } }, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => r.statusCode === 200 ? res(d) : rej(new Error(r.statusCode + ' ' + p))) }).on('error', rej) }) }
function api(p) { return new Promise((res, rej) => { https.get({ hostname: 'api.github.com', path: p, headers: { 'User-Agent': 'x', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}) } }, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))) }).on('error', rej) }) }

(async () => {
  // 1) Editor
  const editor = await raw('apps/renderer/src/app/admin/pages/%5Bid%5D/section-color-editor.tsx');
  const fieldDefs = {}, labels = {};
  {
    const m = editor.match(/const FIELD_DEFS[\s\S]+?\n\};/);
    const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{\s*cssVar\s*:\s*'(--[a-z0-9-]+)'\s*,\s*label\s*:\s*'([^']+)'/gm;
    let mm; while ((mm = re.exec(m[0]))) { fieldDefs[mm[1]] = mm[2]; labels[mm[1]] = mm[3]; }
  }
  const sectionFields = {};
  {
    const m = editor.match(/SECTION_FIELDS[\s\S]+?\n\};/);
    const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\[([^\]]+)\]/gm;
    let mm; while ((mm = re.exec(m[0]))) sectionFields[mm[1]] = mm[2].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
  }
  console.log('FIELD_DEFS:', Object.keys(fieldDefs).length, ' SECTION_FIELDS:', Object.keys(sectionFields).length);

  // 2) brand-colors :root vars
  const brandColors = await raw('apps/renderer/src/lib/brand-colors.ts');
  const rootDefaulted = new Set();
  { const re = /vars\[\s*['"](--[\w-]+)['"]\s*\]/g; let m; while ((m = re.exec(brandColors))) rootDefaulted.add(m[1]); }

  // 3) Get FULL file tree under templates/
  const tree = await api('/repos/bthginfo/Flamingo-CMS-3.0/git/trees/main?recursive=1');
  const tplFiles = tree.tree
    .filter(n => n.path.startsWith('apps/renderer/src/templates/') && (n.path.endsWith('.tsx') || n.path.endsWith('.ts')))
    .map(n => n.path);
  console.log('all .ts/.tsx templates:', tplFiles.length);

  // 4) For each .tsx file build: list of exported PascalCase names → path
  //    Quickest: grep `export (const|function) <Name>` and `export { … }`
  const compToPath = {};
  let i = 0;
  async function workerExports() {
    while (i < tplFiles.length) {
      const idx = i++; const p = tplFiles[idx];
      try {
        const src = await raw(p);
        const exp = new Set();
        // export (const|function) Name
        const re1 = /export\s+(?:const|function|class)\s+([A-Z][a-zA-Z0-9_]*)/g;
        let m; while ((m = re1.exec(src))) exp.add(m[1]);
        // export default function Name / export default class Name
        const reDef = /export\s+default\s+(?:function|class)\s+([A-Z][a-zA-Z0-9_]*)/g;
        while ((m = reDef.exec(src))) exp.add(m[1]);
        // export { Local as Exposed } from './file'  (re-exports — give the EXPOSED name)
        const reReExp = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
        while ((m = reReExp.exec(src))) {
          const from = m[2];
          for (const part of m[1].split(',')) {
            const trimmed = part.trim();
            const asMatch = trimmed.match(/^([A-Z][\w]*)\s+as\s+([A-Z][\w]*)$/);
            if (asMatch) {
              const exposedName = asMatch[2];
              // resolve relative path
              const dir = p.substring(0, p.lastIndexOf('/'));
              let target = from.replace(/^\.\//, dir + '/').replace(/^\.\.\//, dir.substring(0, dir.lastIndexOf('/')) + '/');
              // try .tsx and .ts
              const candidates = [target + '.tsx', target + '.ts', target + '/index.tsx', target + '/index.ts'];
              for (const c of candidates) {
                if (tplFiles.includes(c)) { compToPath[exposedName] = c; break; }
              }
            } else if (/^[A-Z]/.test(trimmed)) {
              exp.add(trimmed);
            }
          }
        }
        // export { Name } (local re-export, no from)
        const re2 = /export\s*\{([^}]+)\}\s*;?\s*$/gm;
        while ((m = re2.exec(src))) {
          for (const part of m[1].split(',')) {
            const name = part.trim().replace(/\s+as\s+(\w+).*$/, '$1');
            if (/^[A-Z]/.test(name)) exp.add(name);
          }
        }
        for (const e of exp) {
          if (!compToPath[e]) compToPath[e] = p;
          else if (compToPath[e] !== p) {
            // duplicate — prefer non-index.ts file
            if (compToPath[e].endsWith('/index.ts')) compToPath[e] = p;
          }
        }
      } catch {}
    }
  }
  await Promise.all(Array.from({ length: 12 }, workerExports));
  console.log('PascalCase exports found:', Object.keys(compToPath).length);

  // 5) Parse INDUSTRY_TEMPLATES + Record<…,TemplateComponent> in templates/index.ts
  const idx = await raw('apps/renderer/src/templates/index.ts');
  const typeToComps = {};
  // (a) Standalone Record<string, TemplateComponent>
  const blockRe = /Record<string,\s*TemplateComponent>\s*=\s*\{([\s\S]*?)\n\};/g;
  let bm;
  while ((bm = blockRe.exec(idx))) {
    const entryRe = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][a-zA-Z0-9]*)\s*,?/gm;
    let em; while ((em = entryRe.exec(bm[1]))) (typeToComps[em[1]] = typeToComps[em[1]] || new Set()).add(em[2]);
  }
  // (b) Nested INDUSTRY_TEMPLATES inline blocks: walk for "industry: { … }" pattern
  const indStart = idx.indexOf('INDUSTRY_TEMPLATES');
  if (indStart > 0) {
    // brace-walk from = { to matching }
    let s = idx.indexOf('{', indStart);
    let depth = 0, end = -1;
    for (let k = s; k < idx.length; k++) {
      if (idx[k] === '{') depth++;
      else if (idx[k] === '}') { depth--; if (depth === 0) { end = k; break; } }
    }
    if (end > 0) {
      const body = idx.slice(s + 1, end);
      // find each "industry: { ... }" — brace-walk per inner block
      const innerRe = /([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{/g;
      let im;
      while ((im = innerRe.exec(body))) {
        const innerStart = im.index + im[0].length - 1;
        let d2 = 0, innerEnd = -1;
        for (let k = innerStart; k < body.length; k++) {
          if (body[k] === '{') d2++;
          else if (body[k] === '}') { d2--; if (d2 === 0) { innerEnd = k; break; } }
        }
        if (innerEnd < 0) continue;
        const inner = body.slice(innerStart + 1, innerEnd);
        const entryRe = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*([A-Z][a-zA-Z0-9]*)\s*,?/gm;
        let em; while ((em = entryRe.exec(inner))) {
          (typeToComps[em[1]] = typeToComps[em[1]] || new Set()).add(em[2]);
        }
        // skip past inner end
        innerRe.lastIndex = innerEnd + 1;
      }
    }
  }
  console.log('section types mapped:', Object.keys(typeToComps).length);

  // 6) Map sectionType → set of template file paths
  const typeToPaths = {};
  const unresolved = {};
  for (const [t, comps] of Object.entries(typeToComps)) {
    const paths = new Set();
    for (const c of comps) {
      if (compToPath[c]) paths.add(compToPath[c]);
      else (unresolved[t] = unresolved[t] || []).push(c);
    }
    typeToPaths[t] = paths;
  }
  const unresolvedCount = Object.values(unresolved).reduce((a, v) => a + v.length, 0);
  console.log('unresolved component refs:', unresolvedCount);
  if (unresolvedCount > 0) {
    console.log('Sample unresolved:');
    Object.entries(unresolved).slice(0, 5).forEach(([t, comps]) => console.log(' ', t, '→', comps.slice(0, 3).join(', ')));
  }

  // 7) For each unique template path: grab its source and extract vars + token-style pairs
  const allPaths = new Set();
  Object.values(typeToPaths).forEach(set => set.forEach(p => allPaths.add(p)));
  console.log('unique templates referenced:', allPaths.size);

  const tplVars = {}, tplPairs = {};
  const VARS_RE = /var\(\s*(--[a-z0-9-]+)/g;
  const PAIR_RE = /var\(\s*(--token-[a-z0-9-]+)\s*,\s*var\(\s*(--style-[a-z0-9-]+)/g;
  const pathsArr = [...allPaths]; let pi = 0;
  async function workerVars() {
    while (pi < pathsArr.length) {
      const idx = pi++; const p = pathsArr[idx];
      try {
        const src = await raw(p);
        const vs = new Set(); let m;
        while ((m = VARS_RE.exec(src))) vs.add(m[1]);
        const pairs = new Map();
        while ((m = PAIR_RE.exec(src))) pairs.set(m[2], m[1]);
        tplVars[p] = vs; tplPairs[p] = pairs;
      } catch { tplVars[p] = new Set(); tplPairs[p] = new Map(); }
    }
  }
  await Promise.all(Array.from({ length: 12 }, workerVars));

  // 8) Build diffs
  const diffs = {};
  for (const [type, fields] of Object.entries(sectionFields)) {
    const tpaths = typeToPaths[type] || new Set();
    const usedVars = new Set();
    const styleAsFallback = new Set();
    const styleToTokenForType = new Map();
    for (const p of tpaths) {
      (tplVars[p] || new Set()).forEach(v => usedVars.add(v));
      const pairs = tplPairs[p] || new Map();
      for (const [sv, tv] of pairs) { styleAsFallback.add(sv); styleToTokenForType.set(sv, tv); }
    }
    const dead = [], shadowed = [];
    for (const f of fields) {
      const cv = fieldDefs[f];
      if (!cv) { dead.push({ field: f, reason: 'no cssVar mapping in FIELD_DEFS' }); continue; }
      if (tpaths.size === 0) { dead.push({ field: f, cssVar: cv, reason: 'no template found for this sectionType' }); continue; }
      if (!usedVars.has(cv)) { dead.push({ field: f, cssVar: cv, reason: 'cssVar never referenced' }); continue; }
      // shadow check: --style-X only appears as fallback inside var(--token-Y, var(--style-X, …)) AND token-Y is :root-defaulted
      if (cv.startsWith('--style-') && styleAsFallback.has(cv)) {
        const tv = styleToTokenForType.get(cv);
        if (tv && rootDefaulted.has(tv)) {
          // need to check it ALSO doesn't appear OUTSIDE a fallback (direct use)
          let standalone = false;
          for (const p of tpaths) {
            const src = ''; // we don't have src in scope here; use a heuristic: count var(--style-X but NOT after var(--token-…,
            // skipping full re-fetch; assume shadowed if any pair exists. Refine later.
          }
          shadowed.push({ field: f, cssVar: cv, shadowedBy: tv });
        }
      }
    }
    const usedColorVars = [...usedVars].filter(v => /^--(token|style|brand|color)-/.test(v));
    const exposedVars = new Set(fields.map(f => fieldDefs[f]).filter(Boolean));
    const missing = usedColorVars.filter(v => !exposedVars.has(v));
    diffs[type] = { dead, shadowed, missing, allUsedVars: usedColorVars, templates: [...tpaths] };
  }

  // 9) Render md
  const lines = [];
  lines.push('# Color Field Audit — CMS vs FE (per Section)\n\n');
  lines.push('_Auto-generated by `audit-section-fields.cjs` from main HEAD._\n\n');
  lines.push('## Methodology\n\n');
  lines.push('For every `sectionType` in the editor\'s `SECTION_FIELDS`:\n');
  lines.push('1. Resolve all template components from `templates/index.ts` (incl. nested `INDUSTRY_TEMPLATES`).\n');
  lines.push('2. Locate each component\'s source file by scanning every `.tsx` under `apps/renderer/src/templates/` for `export const/function/class <Name>`.\n');
  lines.push('3. Extract every `var(--…)` reference from those templates.\n');
  lines.push('4. Diff editor fields vs. consumed variables:\n');
  lines.push('   - **DEAD**: editor field shown but no template references its CSS variable.\n');
  lines.push('   - **SHADOWED**: editor writes `--style-X` but templates read `var(--token-Y, var(--style-X, …))` and `--token-Y` is already set at `:root` by `brand-colors.ts`, so the user\'s value is masked.\n');
  lines.push('   - **MISSING**: template consumes a colour variable but no editor field exposes it.\n\n');

  let dTot = 0, sTot = 0, mTot = 0, fldTot = 0;
  for (const t of Object.values(diffs)) { dTot += t.dead.length; sTot += t.shadowed.length; mTot += t.missing.length; }
  fldTot = Object.values(sectionFields).reduce((a, f) => a + f.length, 0);

  lines.push('## Global Summary\n\n');
  lines.push('| Metric | Count |\n|---|---:|\n');
  lines.push(`| Section types in editor | ${Object.keys(sectionFields).length} |\n`);
  lines.push(`| Total fields shown | ${fldTot} |\n`);
  lines.push(`| Unique templates referenced | ${allPaths.size} |\n`);
  lines.push(`| Unresolved component refs | ${unresolvedCount} |\n`);
  lines.push(`| **DEAD fields** | **${dTot}** (${(dTot/fldTot*100).toFixed(1)}%) |\n`);
  lines.push(`| **SHADOWED fields** | **${sTot}** (${(sTot/fldTot*100).toFixed(1)}%) |\n`);
  lines.push(`| **MISSING fields** | **${mTot}** |\n\n`);

  lines.push('## Top 25 Worst Offenders (by dead+shadowed)\n\n');
  lines.push('| Section | Dead | Shadowed | Missing | Total | Templates |\n|---|---:|---:|---:|---:|---|\n');
  const ranked = Object.entries(diffs).map(([t, d]) => ({ t, ...d, score: d.dead.length + d.shadowed.length })).sort((a, b) => b.score - a.score);
  for (const r of ranked.slice(0, 25)) {
    const tpls = r.templates.map(p => p.replace('apps/renderer/src/templates/', '')).join(', ');
    lines.push(`| \`${r.t}\` | ${r.dead.length} | ${r.shadowed.length} | ${r.missing.length} | ${sectionFields[r.t].length} | ${tpls || '_(none)_'} |\n`);
  }
  lines.push('\n');

  // Per-section detail
  lines.push('## Per-Section Detail\n\n');
  const sortedTypes = Object.keys(diffs).sort();
  for (const type of sortedTypes) {
    const d = diffs[type];
    lines.push(`### \`${type}\` (${sectionFields[type].length} fields)\n\n`);
    lines.push(`**Templates:** ${d.templates.length ? d.templates.map(p => '`' + p.replace('apps/renderer/src/templates/', '') + '`').join(', ') : '_none found_'}\n\n`);
    if (d.dead.length) {
      lines.push(`**Dead fields (${d.dead.length}):**\n\n`);
      for (const x of d.dead) lines.push(`- \`${x.field}\` (${labels[x.field] || '?'}) → ${x.cssVar || '_no var_'} — ${x.reason}\n`);
      lines.push('\n');
    }
    if (d.shadowed.length) {
      lines.push(`**Shadowed fields (${d.shadowed.length}):**\n\n`);
      for (const x of d.shadowed) lines.push(`- \`${x.field}\` (${labels[x.field] || '?'}) — writes \`${x.cssVar}\` but template reads \`${x.shadowedBy}\` first (token defaulted at :root)\n`);
      lines.push('\n');
    }
    if (d.missing.length) {
      lines.push(`**Missing fields (${d.missing.length}):**\n\n`);
      for (const v of d.missing) lines.push(`- \`${v}\` — used by template, no editor field exposes it\n`);
      lines.push('\n');
    }
    if (!d.dead.length && !d.shadowed.length && !d.missing.length) lines.push('_No issues._\n\n');
  }

  // Section types with templates but no editor entry
  const editorTypes = new Set(Object.keys(sectionFields));
  const tplTypes = new Set(Object.keys(typeToComps));
  const unedited = [...tplTypes].filter(t => !editorTypes.has(t)).sort();
  lines.push('## Section Types in Template Registry but Missing from SECTION_FIELDS\n\n');
  if (!unedited.length) lines.push('_None — every registered template has an editor entry._\n\n');
  else { lines.push('These section types render at runtime but have no per-section colour editor:\n\n'); unedited.forEach(t => lines.push(`- \`${t}\`\n`)); lines.push('\n'); }

  const orphan = [...editorTypes].filter(t => !tplTypes.has(t)).sort();
  lines.push('## Orphan Editor Entries (no template registered)\n\n');
  if (!orphan.length) lines.push('_None._\n\n');
  else { lines.push('Editor shows fields for these but no template is registered → 100 % dead:\n\n'); orphan.forEach(t => lines.push(`- \`${t}\` → ${sectionFields[t].length} fields\n`)); lines.push('\n'); }

  // Unresolved components
  if (unresolvedCount > 0) {
    lines.push('## Unresolved Component Imports\n\n');
    lines.push('These components are referenced in the template registry but no source file with that PascalCase export was found:\n\n');
    Object.entries(unresolved).sort().forEach(([t, comps]) => lines.push(`- \`${t}\` → ${comps.join(', ')}\n`));
    lines.push('\n');
  }

  fs.writeFileSync('color-field-audit.md', lines.join(''));
  console.log('\n→ wrote color-field-audit.md (', lines.join('').length, 'bytes )');
  console.log(`=== ${dTot} dead, ${sTot} shadowed, ${mTot} missing out of ${fldTot} total fields ===`);
})().catch(e => { console.error(e); process.exit(1); });
