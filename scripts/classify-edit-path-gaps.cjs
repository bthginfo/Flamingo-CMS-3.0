// Categorise the gap between potentials and annotations into reasons.
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

const files = walk(TEMPLATES_DIR);
const buckets = {
  mixedContent: 0,        // <tag>{icon}{text}</tag> — needs wrapping
  customComponent: 0,     // <CustomComp text={x} /> — prop, not child
  dangerousHTML: 0,       // dangerouslySetInnerHTML
  whitelistMiss: 0,       // identifier like badgeText, ctaText — not in TEXT_FIELDS
  alreadyAnnotated: 0,
  unknown: 0,
};

// Iterate every `{expression}` occurrence and classify
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const re = /\{([^{}]{1,200})\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const exprRaw = m[1].trim();
    if (!exprRaw) continue;
    // Strip wrappers
    let expr = exprRaw.replace(/\s+as\s+[A-Za-z_$][\w.<>[\]|& '"]*$/, '').trim();
    const callMatch = expr.match(/^(?:plain|String|trim|stripHtml|toString|html|md|markdown)\s*\(\s*([\s\S]+?)\s*\)$/);
    if (callMatch) expr = callMatch[1].trim();
    const segs = expr.split('.').map((s) => s.trim());
    const last = segs[segs.length - 1];
    const id = (last || '').match(/^([A-Za-z_$][\w$]*)$/);
    if (!id) continue;
    const name = id[1];
    const lowName = name.toLowerCase();
    // Skip if doesn't even *look* like text (icon names, sizes, deltas)
    if (!/(headline|subline|title|subtitle|heading|subheading|description|content|body|text|intro|outro|caption|badge|eyebrow|kicker|label|name|role|position|quote|author|company|tagline|cta|button|stat|price|phone|email|address|question|answer|note)/i.test(lowName)) {
      continue;
    }
    // Where does this expression live?
    // Walk backward to find nearest '<' or '>'
    let insideTag = false;
    for (let k = m.index - 1; k >= 0; k--) {
      if (src[k] === '>') break;
      if (src[k] === '<') { insideTag = true; break; }
    }
    if (insideTag) {
      // It's inside a tag — either a custom-component prop or attribute value
      const before200 = src.slice(Math.max(0, m.index - 200), m.index);
      if (/dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:?\s*$/.test(before200)) {
        buckets.dangerousHTML++;
      } else if (/<[A-Z][\w.]*[^<>]*$/.test(before200)) {
        buckets.customComponent++;
      } else {
        buckets.unknown++;
      }
      continue;
    }
    // Outside a tag (child position). Check the parent tag for existing data-edit-path
    // and check whether siblings exist.
    const after = src.slice(m.index + m[0].length, m.index + m[0].length + 80);
    const before = src.slice(Math.max(0, m.index - 200), m.index);
    if (/data-edit-path\s*=/.test(before.slice(-200))) {
      buckets.alreadyAnnotated++;
      continue;
    }
    // Mixed content: there's text/JSX between '>' and this '{', OR between '}' and the closing '<'.
    const lastGt = before.lastIndexOf('>');
    const textBefore = lastGt >= 0 ? before.slice(lastGt + 1) : before;
    const firstLt = after.indexOf('<');
    const textAfter = firstLt >= 0 ? after.slice(0, firstLt) : after;
    const hasSiblingsBefore = /\S/.test(textBefore.replace(/[\s{]+/g, '')) || /<[A-Za-z]/.test(before.slice(lastGt));
    const hasSiblingsAfter = /\S/.test(textAfter);
    // Sibling check: does the parent tag also contain a JSX element (icon/span) right before/after?
    const siblingJsxBefore = /<[A-Z][\w.]*[^<>]*\/>\s*$/.test(before) || /<[a-z][\w]*[^<>]*\/?>(?:[^<]*)?$/.test(before.slice(lastGt));
    if (siblingJsxBefore || hasSiblingsBefore || hasSiblingsAfter) {
      buckets.mixedContent++;
    } else if (!TEXT_FIELDS.has(name)) {
      buckets.whitelistMiss++;
    } else {
      buckets.unknown++;
    }
  }
}

console.log('=== Gap classification (across all 202 templates) ===\n');
for (const [k, v] of Object.entries(buckets)) {
  console.log(`  ${k.padEnd(20)} ${v}`);
}
console.log('\nLegend:');
console.log('  mixedContent     — <tag>{icon}{text}</tag>, would need JSX restructuring (codegen intentionally skips)');
console.log('  customComponent  — <CustomComp text={x} />, value passed as prop, not editable in place');
console.log('  dangerousHTML    — dangerouslySetInnerHTML for rich text (separate WYSIWYG concern)');
console.log('  whitelistMiss    — identifier like badgeText / ctaText not in our TEXT_FIELDS set');
console.log('  alreadyAnnotated — parent tag is already wired (false positive in earlier audit)');
console.log('  unknown          — needs manual review');
