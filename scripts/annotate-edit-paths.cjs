/**
 * Codegen: inject data-edit-path="<key>" on JSX text elements across every
 * template file so the in-place text editor (page-editor.tsx click listener)
 * works everywhere — not just in bento-grid.tsx (the POC).
 *
 * Strategy: for each .tsx in apps/renderer/src/templates/, find JSX patterns
 * like:
 *
 *   <h1>{headline}</h1>
 *   <p>{plain(subline)}</p>
 *   <span>{data.badge}</span>
 *   <h2>{(item.title as string)}</h2>
 *
 * …and inject a data-edit-path attribute when the inner expression resolves
 * to a known text-field name. Conservative — only matches single-expression
 * children, never touches elements that already have data-edit-path.
 *
 *   node scripts/annotate-edit-paths.cjs           → write changes
 *   node scripts/annotate-edit-paths.cjs --dry     → print diff stats only
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');

// Text fields we recognise. Keep this list explicit — if a key is here, we
// assume the user wants to be able to click-and-edit it.
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

// JSX tags we'll annotate. Keep it to actual text containers.
const TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'blockquote', 'figcaption', 'label', 'li', 'strong', 'em'];

// Pull a known field name out of a JSX expression body.
function fieldFromExpression(exprRaw) {
  let expr = exprRaw.trim();
  // Strip wrapping parens
  while (expr.startsWith('(') && expr.endsWith(')')) expr = expr.slice(1, -1).trim();
  // Strip `as Type` cast
  expr = expr.replace(/\s+as\s+[A-Za-z_$][\w.<>[\]|& '"]*$/, '').trim();
  // Strip wrapping calls like plain(...), String(...), formatX(...)
  const callMatch = expr.match(/^(?:plain|String|trim|stripHtml|toString|html|md|markdown)\s*\(\s*([\s\S]+?)\s*\)$/);
  if (callMatch) return fieldFromExpression(callMatch[1]);
  // Member access: take last segment
  const segments = expr.split('.').map((s) => s.trim());
  const last = segments[segments.length - 1];
  // Identifier match
  const idMatch = last.match(/^([A-Za-z_$][\w$]*)$/);
  if (!idMatch) return null;
  const name = idMatch[1];
  if (TEXT_FIELDS.has(name)) return name;
  return null;
}

// Inject data-edit-path attribute into an opening tag string.
// openTag is the full opening tag including the trailing '>' (e.g.
// '<h1 className="foo">'). Returns the modified opening tag, OR null if it
// already has data-edit-path.
function injectAttribute(openTag, field) {
  if (/\bdata-edit-path\s*=/.test(openTag)) return null;
  // Insert right before the closing '>' (or '/>' for self-closing — though
  // text-tag matches always have content, so '/>' shouldn't apply).
  return openTag.replace(/(\s*\/?>)$/, ` data-edit-path="${field}"$1`);
}

function processFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  let out = '';
  let i = 0;
  let changes = 0;
  // Find each `<tag ...>{...}</tag>` pattern; only matches when the body
  // is exactly one JSX expression (no surrounding text or siblings).
  // We scan character-by-character so we can correctly skip nested braces.
  const re = new RegExp(
    `<(${TEXT_TAGS.join('|')})((?:\\s+[^<>{}]*(?:\\{[^{}]*\\}[^<>{}]*)*)?)>\\s*\\{`,
    'g',
  );
  let m;
  while ((m = re.exec(src)) !== null) {
    const tag = m[1];
    const attrs = m[2];
    const openStart = m.index;
    const exprStart = re.lastIndex;
    // Find matching closing brace
    let depth = 1;
    let j = exprStart;
    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      j++;
    }
    if (depth !== 0) continue;
    const exprEnd = j - 1; // points at the closing }
    const exprBody = src.slice(exprStart, exprEnd);
    // After the }, expect whitespace then </tag>
    const closeRe = new RegExp(`^\\s*<\\/${tag}>`);
    const tail = src.slice(j);
    const closeMatch = tail.match(closeRe);
    if (!closeMatch) continue;
    // Derive field
    const field = fieldFromExpression(exprBody);
    if (!field) continue;
    // openTag includes the trailing '>' so attribute injection lands
    // correctly inside the tag. exprStart points just past '{', so
    // exprStart-2 is the '>'.
    const openTagOriginal = src.slice(openStart, exprStart - 1); // '<tag ...>'
    const injected = injectAttribute(openTagOriginal, field);
    if (!injected) continue;
    // Emit unchanged text up to openStart, the modified open tag, then
    // the inner expression as-is wrapped in braces, then the close tag.
    out += src.slice(i, openStart);
    out += injected + '{' + exprBody + '}' + closeMatch[0];
    i = j + closeMatch[0].length;
    changes++;
    re.lastIndex = i;
  }
  out += src.slice(i);
  return { content: out, changes };
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

const files = walk(TEMPLATES_DIR);
let totalChanges = 0;
let changedFiles = 0;
for (const file of files) {
  const { content, changes } = processFile(file);
  if (changes === 0) continue;
  changedFiles++;
  totalChanges += changes;
  if (!DRY) fs.writeFileSync(file, content);
  if (DRY || process.env.VERBOSE) console.log(`${path.relative(ROOT, file)}: +${changes}`);
}
console.log(`\nFiles scanned:  ${files.length}`);
console.log(`Files changed:  ${changedFiles}`);
console.log(`Total injects:  ${totalChanges}`);
if (DRY) console.log('(dry run — no files written)');
