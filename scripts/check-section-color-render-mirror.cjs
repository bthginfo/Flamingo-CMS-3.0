/**
 * RENDER-MIRROR GUARD
 *
 * Invariant: for every (industry, sectionType) the renderer can paint, the
 * colour-contract resolver must expose AT LEAST every field that the actually
 * rendered template reads. If the renderer borrows a component from another
 * industry (ALL_TEMPLATES fallback in getIndustryTemplates), the resolver must
 * borrow the matching fields too — otherwise the editor shows fewer controls
 * than the FE renders ("missing fields" bug).
 *
 * This guard re-derives both sides from the live registry + templates (via the
 * generator internals) and fails if the resolver is ever a strict subset of
 * what the renderer paints. Wire into CI next to check:section-colors.
 *
 *   node scripts/check-section-color-render-mirror.cjs
 */
const path = require('path');
const gen = require('./generate-section-color-contracts.cjs');

// Exercise production resolution, not a second implementation of its bugs.
require('tsx/cjs');
const { getFieldsForSection } = require('../apps/renderer/src/lib/section-color-resolver.ts');
const { LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER, SECTION_INDUSTRY_ALIASES } = require('../apps/renderer/src/lib/section-industry-config.ts');

const componentFieldCache = new Map();

function fieldsForComponent(componentName, componentToFile, cssVarToField) {
  if (componentFieldCache.has(componentName)) return componentFieldCache.get(componentName);
  const file = componentToFile.get(componentName);
  if (!file) {
    componentFieldCache.set(componentName, null);
    return null;
  }
  const out = new Set(['sectionBg']);
  for (const t of gen.extractTokenVars(file)) {
    const f = cssVarToField.get(t);
    if (f) out.add(f);
  }
  componentFieldCache.set(componentName, out);
  return out;
}

function main() {
  const { cssVarToField } = gen.loadFieldRegistry();
  const { componentToFile, industryTypeComponent, sharedTypeComponent } = gen.loadTemplateRegistry();

  // Reconstruct the renderer's three maps.
  const industryMap = {};          // industry -> { type -> componentName }
  for (const { industry, type, componentName } of industryTypeComponent) {
    (industryMap[industry] = industryMap[industry] || {})[type] = componentName;
  }
  const sharedMap = {};            // type -> componentName
  for (const { type, componentName } of sharedTypeComponent) sharedMap[type] = componentName;
  const allMap = {};               // type -> componentName (last industry wins, mirrors reduce)
  for (const industry of LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER) {
    Object.assign(allMap, industryMap[industry]);
  }
  const resolve = (type, industry) => new Set(getFieldsForSection(type, industry));

  // The renderer's component pick for (industry, type): specific ?? shared ?? all.
  const renderComponent = (type, industry) => {
    const normalized = SECTION_INDUSTRY_ALIASES[industry?.trim().toLowerCase()] || industry?.trim().toLowerCase();
    const specific = industryMap[normalized] || industryMap.tradesman || {};
    return specific[type] || sharedMap[type] || allMap[type] || null;
  };

  const violations = [];
  const industries = [...new Set([...Object.keys(industryMap), ...Object.keys(SECTION_INDUSTRY_ALIASES), 'realstate', '', ' HOTEL '])];
  const allTypes = new Set([...Object.keys(allMap), ...Object.keys(sharedMap)]);

  for (const industry of industries) {
    for (const type of allTypes) {
      const comp = renderComponent(type, industry);
      if (!comp) continue;
      const rendered = fieldsForComponent(comp, componentToFile, cssVarToField);
      if (!rendered) continue;
      const exposed = resolve(type, industry);
      const missing = [...rendered].filter((f) => !exposed.has(f));
      if (missing.length) {
        violations.push({ industry, type, component: comp, missing });
      }
    }
  }

  if (violations.length) {
    console.error(`Render-mirror FAILED: ${violations.length} (industry, type) pairs expose fewer colour fields than the renderer paints.\n`);
    for (const v of violations.slice(0, 40)) {
      console.error(`  ${v.industry}.${v.type} (${v.component}) — editor misses: ${v.missing.join(', ')}`);
    }
    if (violations.length > 40) console.error(`  ... ${violations.length - 40} more`);
    console.error('\nFix: regenerate contracts (node scripts/generate-section-color-contracts.cjs).');
    console.error('If a template reads tokens through an import the codegen does not follow,');
    console.error('move that markup inside apps/renderer/src/templates/ or inline the token.');
    process.exit(1);
  }

  console.log(`Render-mirror OK: ${industries.length} industries × ${allTypes.size} types — resolver covers every rendered field.`);
}

main();
