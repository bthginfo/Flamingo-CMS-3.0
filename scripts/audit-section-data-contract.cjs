/**
 * Section data-contract audit.
 *
 * For every section a demo tenant writes, compare the data keys (top level +
 * one level into array items) against what the rendering template (and its
 * followed imports) actually reads. A key that is written but never appears
 * as a word in any candidate template source is a suspected contract
 * mismatch — the classic "template reads item.description, data has
 * item.text" bug that silently drops content.
 *
 * Usage: node scripts/audit-section-data-contract.cjs [--all-keys]
 */
const fs = require('fs');
const path = require('path');
const { loadTemplateRegistry, resolveImport, TEMPLATES_DIR } = require('./generate-section-color-contracts.cjs');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'apps/renderer/src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// tenant slug -> INDUSTRY_TEMPLATES key
const INDUSTRY_BY_SLUG = {
  handwerk: 'tradesman', restaurant: 'restaurant', hotel: 'hotel', salon: 'salon',
  tourismus: 'tourism', medical: 'medical', wedding: 'wedding', photography: 'photography',
  realestate: 'realestate', cafe: 'cafe', tattoo: 'tattoo', ecommerce: 'shop', retail: 'retail',
};

// Keys the renderer/editor layer consumes, not the template itself.
const RENDERER_KEYS = new Set([
  'sectionBg', 'sectionBgAlt', 'cardBg', 'headingColor', 'cardHeadingColor', 'subheadingColor',
  'bodyColor', 'cardBodyColor', 'mutedColor', 'iconColor', 'cardIconColor', 'eyebrowColor',
  'accentColor', 'statValue', 'onDarkHeading', 'onDarkBody', 'onDarkMuted', 'btnBg', 'btnText',
  'badgeBg', 'borderColor', 'dividerColor', 'lineColor', 'bgColor', 'textColor', 'overlay',
  // consumed by the renderer wrapper itself (collection hydration):
  'collectionKey',
]);

function gatherSource(filePath, depth = 0, seen = new Set()) {
  if (!filePath || seen.has(filePath) || depth > 3 || !fs.existsSync(filePath)) return '';
  seen.add(filePath);
  const src = fs.readFileSync(filePath, 'utf8');
  let out = src;
  const importRe = /import[\s\S]*?from\s+['"]((?:\.|@\/)[^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    const spec = m[1];
    const resolved = spec.startsWith('@/')
      ? resolveImport('./' + spec.slice(2), SRC_DIR)
      : resolveImport(spec, path.dirname(filePath));
    if (!resolved) continue;
    if (!resolved.startsWith(TEMPLATES_DIR) && !resolved.startsWith(COMPONENTS_DIR)) continue;
    out += '\n' + gatherSource(resolved, depth + 1, seen);
  }
  return out;
}

function collectKeys(data, prefix, into) {
  for (const [k, v] of Object.entries(data || {})) {
    if (RENDERER_KEYS.has(k)) continue;
    into.add(prefix ? `${prefix}.${k}` : k);
    if (Array.isArray(v) && v.length && typeof v[0] === 'object' && v[0] && !Array.isArray(v[0])) {
      for (const item of v.slice(0, 6)) {
        for (const ik of Object.keys(item || {})) {
          if (RENDERER_KEYS.has(ik)) continue;
          into.add(`${prefix ? prefix + '.' : ''}${k}[].${ik}`);
        }
      }
    } else if (v && typeof v === 'object' && !Array.isArray(v) && !prefix) {
      // one level into plain objects (e.g. primaryCta.{label,href})
      for (const ik of Object.keys(v)) into.add(`${k}.${ik}`);
    }
  }
}

function main() {
  const { componentToFile, industryTypeComponent, sharedTypeComponent } = loadTemplateRegistry();
  const sharedByType = new Map(sharedTypeComponent.map((e) => [e.type, e.componentName]));
  const industryByKey = new Map(); // `${industry}.${type}` -> componentName
  for (const e of industryTypeComponent) industryByKey.set(`${e.industry}.${e.type}`, e.componentName);

  // type(+industry) -> written keys
  const written = new Map(); // key: `${industry}|${type}` -> Set(paths)
  const tenantsDir = path.join(ROOT, 'scripts/demo-tenants');
  for (const f of fs.readdirSync(tenantsDir)) {
    // Only the declarative tenant modules — everything else in the dir is tooling
    // that may run (and exit) at require time.
    if (!Object.keys(INDUSTRY_BY_SLUG).map((s) => `${s}.cjs`).includes(f)) continue;
    let tenant;
    try { tenant = require(path.join(tenantsDir, f)); } catch { continue; }
    if (!tenant || !tenant.slug || !Array.isArray(tenant.pages)) continue;
    const industry = INDUSTRY_BY_SLUG[tenant.slug] || tenant.slug;
    const walkSections = (sections) => {
      for (const s of sections || []) {
        if (!s || !s.type || !s.data) continue;
        const key = `${industry}|${s.type}`;
        if (!written.has(key)) written.set(key, new Set());
        collectKeys(s.data, '', written.get(key));
        // nested item sections (collection items)
      }
    };
    for (const p of tenant.pages) walkSections(p.sections);
    for (const c of tenant.collections || []) {
      for (const item of c.items || []) walkSections(item?.data?.sections);
    }
  }

  const srcCache = new Map();
  const sourceFor = (componentName) => {
    if (!srcCache.has(componentName)) {
      srcCache.set(componentName, gatherSource(componentToFile.get(componentName)));
    }
    return srcCache.get(componentName);
  };

  const findings = [];
  for (const [key, keys] of [...written.entries()].sort()) {
    const [industry, type] = key.split('|');
    // Borrowing mirrors getIndustryTemplates: {...ALL_TEMPLATES, ...SHARED, ...specific}
    // — ALL_TEMPLATES is a reduce over all industries, so the LAST industry that
    // defines the type wins, and SHARED overrides ALL.
    const borrowed = [...industryTypeComponent].reverse().find((e) => e.type === type)?.componentName;
    const compName = industryByKey.get(`${industry}.${type}`) || sharedByType.get(type) || borrowed;
    if (!compName) { findings.push({ key, missing: ['<NO TEMPLATE RESOLVED>'] }); continue; }
    const src = sourceFor(compName);
    if (!src) { findings.push({ key, missing: ['<NO SOURCE>'] }); continue; }
    const missing = [];
    for (const p of keys) {
      const leaf = p.split('.').pop().replace('[]', '');
      if (leaf === 'id') continue;
      const re = new RegExp(`[.'"\\[{ ]${leaf}['"\\]:?, )]`);
      if (!re.test(src)) missing.push(p);
    }
    if (missing.length) findings.push({ key: `${key} -> ${compName}`, missing });
  }

  if (!findings.length) { console.log('No data-contract mismatches found.'); return; }
  for (const f of findings) {
    console.log(`\n${f.key}`);
    for (const p of f.missing) console.log(`  - ${p}`);
  }
  console.log(`\n${findings.length} (industry,type) pairs with unread keys.`);
}

main();
