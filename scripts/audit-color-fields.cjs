#!/usr/bin/env node
/**
 * Deprecated compatibility wrapper for the old remote-GitHub audit.
 * The local registry/contract audit is now authoritative.
 */
const { spawnSync } = require('child_process');

const result = spawnSync('npx', ['tsx', 'scripts/audit-section-color-contracts.ts'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
