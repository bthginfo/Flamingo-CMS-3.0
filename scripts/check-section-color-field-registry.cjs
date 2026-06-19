/**
 * Guard for the canonical section color field registry.
 *
 * Invariant:
 * - FIELD_DEFS is the only source of editable section style fields.
 * - Every field maps to exactly one --token-* variable.
 * - Every mapped token exists in packages/design-tokens.
 * - Generated section contracts may only reference fields from FIELD_DEFS.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'apps/renderer/src/lib/section-color-fields.ts');
const TOKENS = path.join(ROOT, 'packages/design-tokens/src/tokens.ts');
const GENERATED = path.join(ROOT, 'apps/renderer/src/lib/section-color-contracts-generated.ts');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function fail(messages) {
  console.error('');
  console.error('Section color field registry check failed:');
  for (const message of messages) console.error('  - ' + message);
  process.exit(1);
}

function unique(values) {
  return [...new Set(values)];
}

const registry = read(REGISTRY);
const tokens = read(TOKENS);
const generated = read(GENERATED);

const fieldDefsBlock = registry.match(/export const FIELD_DEFS:[^=]*=\s*{([\s\S]*?)\n};/);
const orderBlock = registry.match(/export const FIELD_RENDER_ORDER:[^=]*=\s*\[([\s\S]*?)\];/);

if (!fieldDefsBlock) fail(['Could not parse FIELD_DEFS from section-color-fields.ts']);
if (!orderBlock) fail(['Could not parse FIELD_RENDER_ORDER from section-color-fields.ts']);

const fieldDefs = [];
const fieldCssVars = new Map();
for (const match of fieldDefsBlock[1].matchAll(/^\s{2}([a-zA-Z]\w*)\s*:\s*\{[\s\S]*?cssVar:\s*'([^']+)'/gm)) {
  fieldDefs.push(match[1]);
  fieldCssVars.set(match[1], match[2]);
}

const fieldOrder = [...orderBlock[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
const designTokenVars = new Set([...tokens.matchAll(/cssVar:\s*'([^']+)'/g)].map((match) => match[1]));
const generatedFields = unique([...generated.matchAll(/'([a-zA-Z]\w*)'/g)].map((match) => match[1]))
  .filter((field) => field !== 'section-color-fields');

const errors = [];
const defSet = new Set(fieldDefs);
const orderSet = new Set(fieldOrder);
const cssVars = [...fieldCssVars.values()];
const duplicateCssVars = cssVars.filter((cssVar, index) => cssVars.indexOf(cssVar) !== index);

for (const field of fieldDefs) {
  const cssVar = fieldCssVars.get(field);
  if (!orderSet.has(field)) errors.push(`FIELD_DEFS.${field} is missing from FIELD_RENDER_ORDER`);
  if (!cssVar.startsWith('--token-')) errors.push(`FIELD_DEFS.${field} maps to non-token variable ${cssVar}`);
  if (!designTokenVars.has(cssVar)) errors.push(`FIELD_DEFS.${field} maps to ${cssVar}, but that token is missing in packages/design-tokens`);
}

for (const field of fieldOrder) {
  if (!defSet.has(field)) errors.push(`FIELD_RENDER_ORDER contains ${field}, but FIELD_DEFS does not`);
}

for (const cssVar of unique(duplicateCssVars)) {
  const fields = [...fieldCssVars.entries()].filter(([, value]) => value === cssVar).map(([field]) => field).join(', ');
  errors.push(`Duplicate cssVar ${cssVar} is assigned to: ${fields}`);
}

for (const field of generatedFields) {
  if (!defSet.has(field)) errors.push(`Generated section color contract references unknown field ${field}`);
}

if (!generated.includes("import type { ColorFieldKey } from '@/lib/section-color-fields'")) {
  errors.push('Generated section-color-contracts file must import ColorFieldKey from section-color-fields');
}

if (errors.length) fail(errors);

console.log(`section-color-fields registry OK (${fieldDefs.length} fields, ${designTokenVars.size} design tokens).`);
