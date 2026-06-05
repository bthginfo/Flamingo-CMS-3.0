// Audit: for every template .tsx, count text-bearing JSX expressions that
// reference a known content field (headline / subline / title / …) and
// report how many got data-edit-path annotated by the codegen.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');

const TEXT_FIELDS = new Set([
  'headline', 'subline', 'title', 'subtitle', 'heading', 'subheading',
  'description', 'content', 'body', 'text', 'intro', 'outro', 'caption',
  'badge', 'eyebrow', 'kicker', 'label', 'name', 'role', 'position',
  'quote', 'author', 'company', 'tagline',
  'ctaLabel', 'ctaPrimaryLabel', 'ctaSecondaryLabel', 'buttonLabel',
  'primaryLabel', 'secondaryLabel', 'linkLabel',
  'statValue', 'statLabel', 'statSuffix',
  'price', 'priceLabel', 'priceSuffix',
  'phone', 'email', 'address',
  'question', 'answer',
]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile() && e.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

// Count "potential text expressions": occurrences of `{<expr>}` whose
// last identifier is a known TEXT_FIELDS name. We rely on a simple regex
// because we don't need 100% accuracy here — we just want order-of-mag
// coverage so we can flag templates with edit-paths < potentials.
function findPotentials(src) {
  // {headline}, {plain(headline)}, {item.title}, {data.cards[i].name as string}
  const re = /\{([^{}]{1,200})\}/g;
  const hits = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    let expr = m[1].trim();
    // strip wrappers
    expr = expr.replace(/\s+as\s+[A-Za-z_$][\w.<>[\]|& '"]*$/, '').trim();
    const callMatch = expr.match(/^(?:plain|String|trim|stripHtml|toString|html|md|markdown)\s*\(\s*([\s\S]+?)\s*\)$/);
    if (callMatch) expr = callMatch[1].trim();
    const segs = expr.split('.').map((s) => s.trim());
    const last = segs[segs.length - 1];
    const id = (last || '').match(/^([A-Za-z_$][\w$]*)$/);
    if (!id) continue;
    if (!TEXT_FIELDS.has(id[1])) continue;
    hits.push({ name: id[1], offset: m.index });
  }
  return hits;
}

const files = walk(TEMPLATES_DIR);
const rows = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const editPaths = (src.match(/data-edit-path=/g) || []).length;
  const collections = (src.match(/data-edit-collection=/g) || []).length;
  const potentials = findPotentials(src);
  // Filter potentials that appear inside an attribute value like
  // dangerouslySetInnerHTML={{ __html: text }} or `style={{ color: x }}`.
  // Heuristic: ignore matches that sit inside an opening tag.
  const usable = potentials.filter(({ offset }) => {
    // Walk backward to find the nearest '>' or '<'; if '<' comes first we're inside a tag
    for (let k = offset - 1; k >= 0; k--) {
      if (src[k] === '>') return true;
      if (src[k] === '<') return false;
    }
    return true;
  });
  rows.push({
    file: path.relative(ROOT, f).replace(/\\/g, '/'),
    potentials: usable.length,
    editPaths,
    collections,
    gap: Math.max(0, usable.length - editPaths),
  });
}

const totalPot = rows.reduce((a, r) => a + r.potentials, 0);
const totalEdit = rows.reduce((a, r) => a + r.editPaths, 0);
const totalGap = rows.reduce((a, r) => a + r.gap, 0);
const fullyCovered = rows.filter((r) => r.potentials > 0 && r.gap === 0).length;
const partial = rows.filter((r) => r.potentials > 0 && r.editPaths > 0 && r.gap > 0).length;
const zeroCoverage = rows.filter((r) => r.potentials > 0 && r.editPaths === 0).length;
const noText = rows.filter((r) => r.potentials === 0).length;

console.log('=== TEXT-EDITOR COVERAGE AUDIT ===\n');
console.log(`Templates scanned:                 ${rows.length}`);
console.log(`  fully covered (gap=0):           ${fullyCovered}`);
console.log(`  partially covered:               ${partial}`);
console.log(`  zero coverage (≥1 potential):    ${zeroCoverage}`);
console.log(`  no editable text at all:         ${noText}`);
console.log('');
console.log(`Total potential text fields:       ${totalPot}`);
console.log(`Total data-edit-path attributes:   ${totalEdit}`);
console.log(`Coverage:                          ${((totalEdit / totalPot) * 100).toFixed(1)}%`);
console.log(`Estimated unannotated fields:      ${totalGap}`);
console.log('');

const worst = [...rows].filter((r) => r.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 25);
if (worst.length) {
  console.log('--- Top templates with missing annotations ---');
  for (const r of worst) {
    console.log(`  ${r.gap.toString().padStart(3)} missing / ${r.potentials.toString().padStart(3)} potential   ${r.file}`);
  }
}

const zero = rows.filter((r) => r.potentials > 0 && r.editPaths === 0);
if (zero.length) {
  console.log('\n--- Templates with ZERO annotations but ≥1 potential ---');
  for (const r of zero) console.log(`  ${r.potentials.toString().padStart(3)} potential   ${r.file}`);
}
