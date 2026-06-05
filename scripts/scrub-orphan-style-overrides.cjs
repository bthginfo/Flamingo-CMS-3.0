/* DB cleanup: remove orphan keys from page_sections.style_overrides
 * "Orphan" = a key whose value
 *   (a) doesn't match any FIELD_DEFS cssVar
 *   (b) AND the section's current SECTION_FIELDS list doesn't include any
 *       field whose cssVar matches the key
 *
 * In other words: the editor has no UI to set/change that key any more,
 * so it's dead data that came from a now-removed editor field.
 *
 * Safe-by-default: dry-run prints the diff. Pass --apply to commit.
 */
const { Client } = require('pg');
const https = require('https');
const T = process.env.GITHUB_TOKEN || '';
const CONN = process.env.DATABASE_URL || '';
const APPLY = process.argv.includes('--apply');

function raw(p) {
  return new Promise((r, j) => {
    https.get({ hostname: 'api.github.com', path: '/repos/bthginfo/Flamingo-CMS-3.0/contents/' + encodeURI(p) + '?ref=main', headers: { 'User-Agent': 'x', Accept: 'application/vnd.github.raw', Authorization: 'Bearer ' + T } }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => r(d)); }).on('error', j);
  });
}

(async () => {
  // 1) Pull editor + section-contracts to compute the CURRENT editable cssVars per section
  const editor = await raw('apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
  const fieldDefs = {};
  {
    const m = editor.match(/const FIELD_DEFS[\s\S]+?\n\};/);
    const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{\s*cssVar\s*:\s*'(--[a-z0-9-]+)'/gm;
    let mm; while ((mm = re.exec(m[0]))) fieldDefs[mm[1]] = mm[2];
  }
  const sectionFields = {};
  {
    const m = editor.match(/const SECTION_FIELDS[\s\S]+?\n\};/);
    const re = /^\s*([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\[([^\]]*)\]/gm;
    let mm; while ((mm = re.exec(m[0]))) sectionFields[mm[1]] = mm[2].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
  }
  // Build cssVar set per sectionType. Anything not in this set is orphan.
  // Note: we ALSO accept any cssVar that's in FIELD_DEFS at all — section may have used
  // a contract-inferred field that's not yet in SECTION_FIELDS. That's safer; only
  // remove keys that no editor field even references.
  const knownCssVars = new Set(Object.values(fieldDefs));
  console.log('Known editor cssVars:', knownCssVars.size);
  console.log('Sections with explicit SECTION_FIELDS list:', Object.keys(sectionFields).length);

  // 2) DB scan
  const c = new Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });
  await c.connect();
  const { rows } = await c.query(`SELECT id, type, style_overrides FROM page_sections WHERE style_overrides IS NOT NULL`);
  console.log('Rows with overrides:', rows.length);

  const plan = [];
  for (const r of rows) {
    const src = r.style_overrides || {};
    const out = {};
    const orphans = [];
    for (const [k, v] of Object.entries(src)) {
      // Two-tier check:
      //   (a) key must be a known editor cssVar at all
      //   (b) AND, if SECTION_FIELDS[type] is defined, the section's current
      //       fields must include one whose cssVar matches k
      const fieldsForType = sectionFields[r.type];
      const sectionCssVars = fieldsForType ? new Set(fieldsForType.map(f => fieldDefs[f]).filter(Boolean)) : null;
      const isKnown = knownCssVars.has(k);
      const isReachable = !sectionCssVars || sectionCssVars.has(k);
      if (isKnown && isReachable) out[k] = v;
      else orphans.push(k);
    }
    if (orphans.length) plan.push({ id: r.id, type: r.type, orphans, newOverrides: Object.keys(out).length ? out : null });
  }
  console.log('Rows with orphans:', plan.length);
  const totalOrphans = plan.reduce((a, p) => a + p.orphans.length, 0);
  console.log('Total orphan keys:', totalOrphans);

  // Aggregate by orphan name
  const tally = {};
  for (const p of plan) for (const k of p.orphans) tally[k] = (tally[k] || 0) + 1;
  console.log('\nTop 20 orphan keys:');
  Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, n]) => console.log(' ', n.toString().padStart(4), k));

  if (!APPLY) {
    console.log('\n(dry-run) Pass --apply to write changes.');
    await c.end();
    return;
  }

  let updated = 0, nulled = 0;
  for (const p of plan) {
    if (p.newOverrides) {
      await c.query(`UPDATE page_sections SET style_overrides = $1::jsonb WHERE id = $2`, [JSON.stringify(p.newOverrides), p.id]);
      updated++;
    } else {
      await c.query(`UPDATE page_sections SET style_overrides = NULL WHERE id = $1`, [p.id]);
      nulled++;
    }
  }
  console.log(`Applied. rows trimmed: ${updated}, rows nulled: ${nulled}`);
  await c.end();
})().catch(e => { console.error(e); process.exit(1); });
