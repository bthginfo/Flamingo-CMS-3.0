#!/usr/bin/env node
/**
 * Deprecated compatibility wrapper.
 *
 * The section color system no longer writes SECTION_FIELDS into the page editor.
 * The canonical sources are:
 *   - apps/renderer/src/lib/section-color-fields.ts
 *   - apps/renderer/src/lib/section-color-contracts-generated.ts
 *
 * Keep this script only so old local/CI commands do not recreate the legacy
 * model. New work should call pnpm generate:section-colors or
 * pnpm check:section-colors directly.
 */
const { spawnSync } = require('child_process');

const target = process.argv.includes('--check')
  ? ['node', 'scripts/check-section-color-contracts.cjs']
  : ['node', 'scripts/generate-section-color-contracts.cjs'];

const result = spawnSync(target[0], target.slice(1), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
