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

// Mirror of resolver.ts INDUSTRY_CONTRACT_ALIASES (keep in sync).
const INDUSTRY_ALIASES = { handwerk: 'tradesman' };
const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
  const { perIndustry, perType, perAny } = gen.build();

  // Reconstruct the renderer's three maps.
  const industryMap = {};          // industry -> { type -> componentName }
  for (const { industry, type, componentName } of industryTypeComponent) {
    (industryMap[industry] = industryMap[industry] || {})[type] = componentName;
  }
  const sharedMap = {};            // type -> componentName
  for (const { type, componentName } of sharedTypeComponent) sharedMap[type] = componentName;
  const allMap = {};               // type -> componentName (last industry wins, mirrors reduce)
  for (const { type, componentName } of industryTypeComponent) allMap[type] = componentName;

  // Mirror of resolveColorContractForSection().
  const resolve = (type, industry) => {
    const norm = INDUSTRY_ALIASES[industry] || industry;
    const key = type + pascal(norm);
    if (perIndustry[key] && perIndustry[key].length) return new Set(perIndustry[key]);
    if (perType[type] && perType[type].length) return new Set(perType[type]);
    if (perAny[type] && perAny[type].length) return new Set(perAny[type]);
    return new Set(['sectionBg']);
  };

  // The renderer's component pick for (industry, type): specific ?? shared ?? all.
  const renderComponent = (type, industry) => {
    const specific = industryMap[industry] || industryMap.tradesman || {};
    return specific[type] || sharedMap[type] || allMap[type] || null;
  };

  const violations = [];
  const industries = [...new Set([...Object.keys(industryMap), 'handwerk', 'realstate'])];
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
