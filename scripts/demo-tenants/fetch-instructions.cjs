/**
 * Dump the per-tenant /api/v1/instructions payload to disk so it can be read
 * before drafting a tenant module. Each tenant has its own playbook.
 *
 * Usage:
 *   node scripts/demo-tenants/fetch-instructions.cjs handwerk
 *   node scripts/demo-tenants/fetch-instructions.cjs restaurant ./instructions-restaurant.json
 *
 * Output: writes JSON + an "instructions.txt" (plain text of the .instructions
 * field) next to the JSON file.
 */
const fs = require('fs');
const path = require('path');
const Api = require('./_lib/api.cjs');

// Resolve credentials at runtime. Never store demo PATs in source control.
const PATS = new Proxy({}, {
  get(_target, tenant) {
    const key = String(tenant).toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    return process.env['PAT_' + key] || process.env['DEMO_PAT_' + key] || '';
  },
});

async function main() {
  const tenant = process.argv[2];
  const outArg = process.argv[3];
  if (!tenant || !PATS[tenant]) {
    console.error('Usage: node fetch-instructions.cjs <tenant> [outFile]');
    console.error('Set PAT_<TENANT> or DEMO_PAT_<TENANT> in the environment.');
    process.exit(2);
  }
  const api = new Api({ pat: PATS[tenant], host: process.env.FLAMINGO_API_HOST, verbose: false });
  const data = await api.instructions();
  const outFile = outArg || path.join(__dirname, '_cache', `instructions-${tenant}.json`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
  const txtFile = outFile.replace(/\.json$/, '.txt');
  const textDump = [
    data.instructions || '',
    '',
    '---',
    'STRUCTURED_AI_CONTENT_PLAYBOOK',
    JSON.stringify(data.aiContentPlaybook || {}, null, 2),
    '',
    '---',
    'STYLE_SYSTEM',
    JSON.stringify(data.styleSystem || {}, null, 2),
    '',
    '---',
    'SECTION_STYLE_CONTRACTS',
    JSON.stringify(data.sectionStyleContracts || [], null, 2),
  ].join('\n');
  fs.writeFileSync(txtFile, textDump);
  console.log('wrote', outFile, '(' + (JSON.stringify(data).length / 1024).toFixed(1) + ' kB)');
  console.log('wrote', txtFile);
  console.log('endpoints:', Object.keys(data.endpoints || {}).length);
  console.log('availableSectionTypes:', (data.availableSectionTypes || []).length);
  console.log('hasShopAddon:', data.hasShopAddon, '· hasBookingAddon:', data.hasBookingAddon);
}

main().catch((e) => { console.error(e); process.exit(1); });
