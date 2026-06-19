#!/usr/bin/env node
/**
 * Deprecated safety stub.
 *
 * This DB-cleanup script used the old SECTION_FIELDS editor map and is not safe
 * for the canonical section color registry. Do not trim tenant style overrides
 * with this script. A replacement must resolve fields through
 * apps/renderer/src/lib/section-color-resolver.ts and run tenant-level
 * validation before applying DB changes.
 */
console.error('Deprecated: scrub-orphan-style-overrides.cjs is disabled for the new color registry.');
console.error('Use API validation and a registry-aware cleanup script before touching tenant DB data.');
process.exit(1);
