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

// PAT registry — keep in sync with STATUS.md.
const PATS = {
  handwerk:    '978b230504b8d123234c44375606f28172ee9e2d96146dcbf0892f77c3d2f7d8',
  restaurant:  '910915ec2186b9d044b5ea5f67becabead7291f28c9ef61c384a3d376043a1d1',
  hotel:       '1521c5d84ea52527aa60b2f9bd2c2ccbca0b6c30c6f20e7555d98dc3c7a15eb4',
  salon:       'de5a3d8ac1447d879e680d74218b8266a0e47144191913d0a6ee20d08c7988c5',
  tourismus:   '331b42a823e26b34b0ec72193fb3d5aff040cc4159028f35381719ac7f96b96b',
  medical:     '32a67a176cba5748b9d20d6f86dbf620ae04d9eda10093e0efec433ae1b8ac09',
  wedding:     'a8a4079b1415c23ee6e7ec484438a8a780452b6a6a86fc0acf3025c8d24c3904',
  photography: '83a79df5fa9e34d0a33268e5939881da066f38c5b350422ec44707eaf0864d2c',
  consulting:  'f43f44bceb2abd37fb28aa1e5352cca1778cd4036bfff33dd0b0e44e2ea750a6',
  realestate:  '6ef04ab718a41192d1eac3b1c3b4d523a2561463927a77861f85a745e251c485',
  cafe:        'eb8a830226779565248605c2fd832aeffd338a50fdc85475393fd2117aafcb93',
  tattoo:      '91e6ae60a80cd9385a65671bbef0c12971446d416a403a76f38139ce26eabc70',
  ecommerce:   '57b5659857d5ca5ef9eb11f0f8190c68c35f7f4ae041286f84818aa3bc51c30f',
  retail:      'c29a426d1a1c833d67b0a3086479cc42db14f8e3ac0b30b323422e99cca58016',
  florist:     '2f9b1dd5604a5ef01034c557d69ecba7b4e2025dfdefc96ee594853f66c17120',
  fitness:     'c85fb8f728e462ada22299c918b92496c906e7dfe428ef9c44873e2b28ff3aba',
  location:    'b05da04689835ce9a5f08a57580131667ac7263921f181208b876e90a8a829c8',
};

async function main() {
  const tenant = process.argv[2];
  const outArg = process.argv[3];
  if (!tenant || !PATS[tenant]) {
    console.error('Usage: node fetch-instructions.cjs <tenant> [outFile]');
    console.error('Known tenants:', Object.keys(PATS).join(', '));
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
