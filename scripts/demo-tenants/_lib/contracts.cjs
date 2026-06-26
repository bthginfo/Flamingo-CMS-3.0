/**
 * Mirrors apps/renderer/src/lib/section-color-resolver.ts (getFieldsForSection)
 * so the populate can pre-trim each section's styleOverrides to EXACTLY the
 * --token-* vars the API will accept for that (sectionType, industry) pair.
 *
 * Why not just use /api/v1/instructions sectionStyleContracts? That list only
 * covers a tenant's availableSectionTypes and silently omits borrowed types
 * (e.g. `story`, `contactLocation`) that pages still use — yet the API STILL
 * validates them. And because the backend driver has no transactions, a single
 * 400 on createPage leaves a half-inserted page row behind, so the next attempt
 * collides on the unique slug with a 500. The only safe path is a correct
 * first POST, which means resolving the full contract ourselves.
 *
 * The two source files are codegen/data with plain object literals (no TS types
 * inside the literal bodies), so we slice the literal out and eval it.
 */
const fs = require('fs');
const path = require('path');

const LIB = path.resolve(__dirname, '../../../apps/renderer/src/lib');
const CONTRACTS_TS = path.join(LIB, 'section-color-contracts-generated.ts');
const FIELDS_TS = path.join(LIB, 'section-color-fields.ts');

// Keep in sync with INDUSTRY_CONTRACT_ALIASES in section-color-resolver.ts.
const INDUSTRY_ALIASES = { handwerk: 'tradesman' };

function evalLiteral(body) {
  // body is the inside of an object literal: `key: [...], key2: [...]`.
  // No function calls, no identifiers on the value side — safe to eval.
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return ({${body}});`)();
}

function sliceMap(src, name) {
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`contract map ${name} not found`);
  const open = src.indexOf('{', start);
  const close = src.indexOf('\n};', open);
  if (open < 0 || close < 0) throw new Error(`could not bound ${name}`);
  return evalLiteral(src.slice(open + 1, close));
}

function loadFieldCssVars(src) {
  // FIELD_DEFS entries look like:  sectionBg: { cssVar: '--token-section-bg', ... }
  const map = {};
  const re = /(\w+):\s*\{\s*cssVar:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = m[2];
  return map;
}

function normIndustry(industry) {
  if (!industry) return undefined;
  const n = String(industry).trim().toLowerCase();
  return INDUSTRY_ALIASES[n] || n;
}

function pascal(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Builds a resolver bound to the repo's current contracts.
 * @returns {(sectionType: string, industry?: string) => Set<string>} allowed cssVars
 */
function makeResolver() {
  const contractsSrc = fs.readFileSync(CONTRACTS_TS, 'utf8');
  const fieldsSrc = fs.readFileSync(FIELDS_TS, 'utf8');
  const GENERATED = sliceMap(contractsSrc, 'SECTION_COLOR_CONTRACTS_GENERATED');
  const GENERIC = sliceMap(contractsSrc, 'SECTION_COLOR_CONTRACTS_GENERIC');
  const ANY = sliceMap(contractsSrc, 'SECTION_COLOR_CONTRACTS_ANY');
  const FIELD_CSS = loadFieldCssVars(fieldsSrc);

  return function allowedCssVars(sectionType, industry) {
    const ind = normIndustry(industry);
    const industryKey = ind ? `${sectionType}${pascal(ind)}` : null;
    const industrySpecific = industryKey ? GENERATED[industryKey] : undefined;
    const generic = GENERIC[sectionType];
    const any = ANY[sectionType];

    let fields;
    if (Array.isArray(industrySpecific) && industrySpecific.length) fields = industrySpecific;
    else if (Array.isArray(generic) && generic.length) fields = generic;
    else if (Array.isArray(any) && any.length) fields = any;
    else fields = ['sectionBg'];

    const out = new Set();
    for (const f of new Set(['sectionBg', ...fields])) {
      if (FIELD_CSS[f]) out.add(FIELD_CSS[f]);
    }
    return out;
  };
}

/** @returns {Record<string,string>} ColorFieldKey -> cssVar (e.g. headingColor -> --token-heading) */
function fieldCssVars() {
  return loadFieldCssVars(fs.readFileSync(FIELDS_TS, 'utf8'));
}

module.exports = { makeResolver, fieldCssVars };
