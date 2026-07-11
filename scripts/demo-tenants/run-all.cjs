#!/usr/bin/env node
'use strict';

/**
 * Populate the declarative demo tenants, or validate their exports without
 * touching the API.
 *
 *   node scripts/demo-tenants/run-all.cjs --list
 *   node scripts/demo-tenants/run-all.cjs --dry-run
 *   node scripts/demo-tenants/run-all.cjs handwerk cafe
 *   node scripts/demo-tenants/run-all.cjs all
 *
 * Population requires an explicit PAT_<KEY> (or DEMO_PAT_<KEY>) environment
 * variable for every selected tenant. Module-local fallback credentials are
 * deliberately ignored. The runner never prints token values or fragments.
 */
const path = require('node:path');
const { run } = require('./_lib/runner.cjs');

// Keep this allow-list explicit. Requiring arbitrary sibling .cjs files can
// execute maintenance helpers with destructive or network side effects.
const TENANT_MODULES = Object.freeze([
  { key: 'cafe', file: 'cafe.cjs', env: 'CAFE' },
  { key: 'ecommerce', file: 'ecommerce.cjs', env: 'ECOMMERCE', aliases: ['shop'] },
  { key: 'eishockey', file: 'eishockey.cjs', env: 'EISHOCKEY' },
  { key: 'handwerk', file: 'handwerk.cjs', env: 'HANDWERK' },
  { key: 'hotel', file: 'hotel.cjs', env: 'HOTEL' },
  { key: 'medical', file: 'medical.cjs', env: 'MEDICAL' },
  { key: 'photography', file: 'photography.cjs', env: 'PHOTOGRAPHY' },
  { key: 'realestate', file: 'realestate.cjs', env: 'REALESTATE' },
  { key: 'restaurant', file: 'restaurant.cjs', env: 'RESTAURANT' },
  { key: 'retail', file: 'retail.cjs', env: 'RETAIL' },
  { key: 'salon', file: 'salon.cjs', env: 'SALON' },
  { key: 'tattoo', file: 'tattoo.cjs', env: 'TATTOO' },
  { key: 'tourism', file: 'tourismus.cjs', env: 'TOURISM', aliases: ['tourismus'] },
  { key: 'wedding', file: 'wedding.cjs', env: 'WEDDING' },
]);

function usage() {
  console.log([
    'Usage: node scripts/demo-tenants/run-all.cjs [options] [all|tenant ...]',
    '',
    'Options:',
    '  --list       Show the explicit declarative tenant list.',
    '  --dry-run    Load and validate sources without API or DB writes.',
    '  --help       Show this help.',
    '',
    `Tenants: ${TENANT_MODULES.map((entry) => entry.key).join(', ')}`,
    'Legacy MJS tenants (consulting, florist, fitness, location) use run-legacy.cjs.',
  ].join('\n'));
}

function parseArgs(argv) {
  const options = { dryRun: false, list: false, all: false, selectors: [] };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') return { ...options, help: true };
    if (arg === '--list') options.list = true;
    else if (arg === '--dry-run' || arg === '--audit') options.dryRun = true;
    else if (arg === 'all' || arg === '--all') options.all = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.selectors.push(arg.toLowerCase());
  }
  if (options.all && options.selectors.length) {
    throw new Error('Use either "all" or an explicit tenant list, not both.');
  }
  return options;
}

function selectEntries(options) {
  if (options.all || options.selectors.length === 0) return [...TENANT_MODULES];

  const byName = new Map();
  for (const entry of TENANT_MODULES) {
    byName.set(entry.key, entry);
    for (const alias of entry.aliases || []) byName.set(alias, entry);
  }

  const selected = [];
  const seen = new Set();
  for (const selector of options.selectors) {
    const entry = byName.get(selector);
    if (!entry) throw new Error(`Unknown tenant "${selector}". Use --list to see valid names.`);
    if (!seen.has(entry.key)) {
      selected.push(entry);
      seen.add(entry.key);
    }
  }
  return selected;
}

function validateTenantExport(entry, tenant) {
  if (!tenant || typeof tenant !== 'object' || Array.isArray(tenant)) {
    throw new Error(`${entry.file} must export a tenant object.`);
  }
  if (typeof tenant.slug !== 'string' || !tenant.slug.trim()) {
    throw new Error(`${entry.file}: tenant.slug is required.`);
  }
  if (!Array.isArray(tenant.pages) || tenant.pages.length === 0) {
    throw new Error(`${entry.file}: tenant.pages must be a non-empty array.`);
  }

  const slugs = new Set();
  for (const [index, page] of tenant.pages.entries()) {
    if (!page || typeof page !== 'object') throw new Error(`${entry.file}: page ${index} is invalid.`);
    if (typeof page.slug !== 'string') throw new Error(`${entry.file}: page ${index} has no string slug.`);
    if (slugs.has(page.slug)) throw new Error(`${entry.file}: duplicate page slug "${page.slug}".`);
    slugs.add(page.slug);
    if (typeof page.title !== 'string' || !page.title.trim()) throw new Error(`${entry.file}: page "${page.slug}" has no title.`);
    if (!Array.isArray(page.sections) || page.sections.length === 0) throw new Error(`${entry.file}: page "${page.slug}" has no sections.`);
  }

  for (const legalSlug of ['impressum', 'datenschutz']) {
    if (!slugs.has(legalSlug)) throw new Error(`${entry.file}: missing legal page "${legalSlug}".`);
  }

  return {
    pages: tenant.pages.length,
    collections: Array.isArray(tenant.collections) ? tenant.collections.length : 0,
  };
}

function tokenFor(entry) {
  const names = [
    `PAT_${entry.env}`,
    `DEMO_PAT_${entry.env}`,
    ...(entry.key === 'tourism' ? ['PAT_TOURISMUS', 'PAT_DEMO_TOURISM'] : []),
  ];
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }
  if (options.list) {
    for (const entry of TENANT_MODULES) {
      const aliases = entry.aliases?.length ? ` (aliases: ${entry.aliases.join(', ')})` : '';
      console.log(`${entry.key}${aliases} -> ${entry.file} [PAT_${entry.env}]`);
    }
    return;
  }

  const entries = selectEntries(options);
  let succeeded = 0;
  let failed = 0;

  for (const entry of entries) {
    try {
      const tenant = require(path.join(__dirname, entry.file));
      const summary = validateTenantExport(entry, tenant);

      if (options.dryRun) {
        console.log(`✓ ${entry.key}: ${summary.pages} pages, ${summary.collections} collections`);
        succeeded += 1;
        continue;
      }

      const token = tokenFor(entry);
      if (!token) throw new Error(`Missing PAT_${entry.env} (DEMO_PAT_${entry.env} is also accepted).`);
      tenant.pat = token;

      console.log(`\n=== POPULATE ${entry.key} ===`);
      await run(tenant);
      succeeded += 1;
    } catch (error) {
      failed += 1;
      console.error(`✗ ${entry.key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const action = options.dryRun ? 'validated' : 'populated';
  console.log(`\nDone: ${succeeded} ${action}, ${failed} failed.`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
