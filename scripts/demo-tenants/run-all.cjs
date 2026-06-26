/**
 * Populate every demo tenant (or a subset) with one command.
 * Needs network egress to the content API host — run it where that's allowed.
 *
 *   node scripts/demo-tenants/run-all.cjs                 # all tenants
 *   node scripts/demo-tenants/run-all.cjs handwerk salon  # only these
 *
 * PATs: provide the live token per tenant via an env var `PAT_<SLUG>` (slug
 * upper-cased, non-alnum → '_'), e.g. PAT_HANDWERK=flm_pat_xxx. When set it
 * overrides whatever placeholder the tenant module hardcodes, so real secrets
 * never have to be committed. Tenants without an override fall back to their
 * module's own `pat`.
 */
const fs = require('fs');
const path = require('path');
const { run } = require('./_lib/runner.cjs');

const only = process.argv.slice(2);
const SKIP = new Set(['validate-contrast.cjs', 'fetch-instructions.cjs', 'run-all.cjs']);
const files = fs.readdirSync(__dirname)
  .filter((f) => f.endsWith('.cjs') && !f.startsWith('_') && !SKIP.has(f))
  .sort();

const patFor = (slug) => process.env['PAT_' + String(slug).toUpperCase().replace(/[^A-Z0-9]+/g, '_')];

(async () => {
  let ok = 0, fail = 0;
  for (const f of files) {
    const name = f.replace('.cjs', '');
    if (only.length && !only.includes(name)) continue;
    let tenant;
    try { tenant = require(path.join(__dirname, f)); }
    catch (e) { console.error(`\n✗ ${name}: load failed — ${e.message}`); fail++; continue; }
    if (!tenant || !tenant.pages) { console.log(`· ${name}: no tenant export, skipped`); continue; }
    const override = patFor(tenant.slug || name);
    if (override) tenant.pat = override;
    console.log(`\n=== POPULATE ${name} ===`);
    try { await run(tenant); ok++; }
    catch (e) { console.error(`✗ ${name} FAILED: ${e.message}`); fail++; }
  }
  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
})();
