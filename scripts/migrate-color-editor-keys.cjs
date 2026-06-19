#!/usr/bin/env node
/**
 * Deprecated.
 *
 * Legacy editor aliases are handled read-time in section-color-editor.tsx so
 * existing tenant data keeps rendering. New writes are validated against the
 * canonical registry in apps/renderer/src/lib/section-color-fields.ts.
 */
console.log('Deprecated: section color aliases are migrated read-time; no file rewrite is required.');
