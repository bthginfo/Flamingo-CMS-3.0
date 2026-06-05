/**
 * Codegen: inject data-edit-path (+ data-edit-collection / data-edit-index)
 * on JSX text elements across every template file so the in-place text
 * editor (page-editor.tsx click listener) works everywhere — including for
 * elements rendered inside .map() loops where the path must include the
 * item index.
 *
 * Two passes per file:
 *
 *   PASS A — item-loop wrappers:
 *     Find `<receiver>.map((<item>, <i>) => <Tag …>` patterns and inject
 *     `data-edit-collection="<receiver>" data-edit-index={<i>}` on the
 *     root JSX element returned by the callback.
 *
 *   PASS B — text expressions:
 *     Find `<tag>{expr}</tag>` patterns where the inner expression
 *     resolves to a known text-field name and inject
 *     `data-edit-path="<key>"` on the opening tag.
 *
 * At runtime the live-preview client walks ancestor elements collecting
 * `data-edit-collection` / `data-edit-index` and builds a compound path
 * like `items.0.title`, which the editor then applies via a nested
 * immutable set.
 *
 *   node scripts/annotate-edit-paths.cjs           → write changes
 *   node scripts/annotate-edit-paths.cjs --dry     → print stats only
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
  const original = fs.readFileSync(filePath, 'utf8');
  const afterPassA = annotateMapWrappers(original);
  const afterPassB = annotateTextFields(afterPassA);
  const wrapperChanges = countOccurrences(afterPassA, 'data-edit-collection=') - countOccurrences(original, 'data-edit-collection=');
  const textChanges = countOccurrences(afterPassB, 'data-edit-path=') - countOccurrences(afterPassA, 'data-edit-path=');
  return { content: afterPassB, wrapperChanges, textChanges };
}

function countOccurrences(s, needle) {
  let n = 0; let idx = 0;
  while ((idx = s.indexOf(needle, idx)) !== -1) { n++; idx += needle.length; }
  return n;
}

// PASS A: annotate the root JSX element of each `.map((item, i) => ...)`
// callback with `data-edit-collection` and `data-edit-index`.
function annotateMapWrappers(src) {
  let out = '';
  let i = 0;
  const re = /\.map\s*\(\s*\(\s*([A-Za-z_$][\w$]*)\s*,\s*([A-Za-z_$][\w$]*)\s*\)\s*=>\s*\(?\s*<([A-Za-z][A-Za-z0-9.]*)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const idxVar = m[2];
    const matchStart = m.index;
    const matchEnd = matchStart + m[0].length;
    // Walk forward from matchEnd to find the closing '>' of the opening
    // tag we just matched, honouring nested `{…}` JSX expression children
    // inside attribute values (e.g. `className={`foo ${x}`}`).
    let j = matchEnd;
    let braceDepth = 0;
    while (j < src.length) {
      const ch = src[j];
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
      else if (ch === '>' && braceDepth === 0) break;
      j++;
    }
    if (j >= src.length) continue;
    // Skip if this tag already has data-edit-collection (idempotent).
    const tagBody = src.slice(matchStart, j);
    if (/\bdata-edit-collection\s*=/.test(tagBody)) continue;
    // Resolve the collection name from the receiver text directly before
    // `.map`. Covers `items.map`, `items?.map`, `(items||[]).map`, and the
    // common `((data.items as Item[]) || []).map` pattern.
    const before = src.slice(Math.max(0, matchStart - 240), matchStart);
    const collection = deriveCollectionName(before);
    if (!collection) continue;
    // If the previous character before '>' is '/', this is a self-closing
    // tag; insert before the '/' so the attribute doesn't break the slash.
    const isSelfClose = src[j - 1] === '/';
    const insertAt = isSelfClose ? j - 1 : j;
    out += src.slice(i, insertAt) + ` data-edit-collection="${collection}" data-edit-index={${idxVar}}`;
    i = insertAt;
  }
  out += src.slice(i);
  return out;
}

// Words to ignore when scanning the receiver expression for a collection
// name — these are JS keywords / typescript noise that show up before
// `.map` in patterns like `(items as Item[]).map`.
const COLLECTION_NAME_BLACKLIST = new Set([
  'as', 'const', 'let', 'var', 'return', 'true', 'false', 'null',
  'undefined', 'data', 'map', 'filter', 'forEach', 'reduce', 'find',
  'some', 'every', 'sort', 'slice', 'splice', 'concat', 'flat',
  'flatMap', 'Array', 'Object', 'String', 'Number', 'Boolean',
  'JSON', 'Math', 'in', 'of', 'new', 'typeof', 'instanceof',
]);

function deriveCollectionName(before) {
  // 1) Identifier sitting directly before .map (handles items.map / items?.map).
  const trail = before.match(/([A-Za-z_$][\w$]*)\s*\??\s*$/);
  if (trail && !COLLECTION_NAME_BLACKLIST.has(trail[1])) return trail[1];
  // 2) Last `data.<name>` reference in the receiver expression
  //    (handles `((data.cards as Card[]) || []).map` and friends).
  const dataMatches = [...before.matchAll(/data\.([A-Za-z_$][\w$]*)/g)];
  if (dataMatches.length) return dataMatches[dataMatches.length - 1][1];
  // 3) Last bare identifier in the receiver that isn't a keyword/type.
  const idMatches = [...before.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)]
    .map((mm) => mm[1])
    .filter((name) => !COLLECTION_NAME_BLACKLIST.has(name) && !/^[A-Z]/.test(name));
  if (idMatches.length) return idMatches[idMatches.length - 1];
  return '';
}

// PASS B: annotate text containers (h1..h6, p, span, a, button, etc.) whose
// body is a single JSX expression resolving to a known text-field name.
function annotateTextFields(src) {
  let out = '';
  let i = 0;
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
    re.lastIndex = i;
  }
  out += src.slice(i);
  return out;
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
let totalText = 0;
let totalWrap = 0;
let changedFiles = 0;
for (const file of files) {
  const { content, wrapperChanges, textChanges } = processFile(file);
  const before = fs.readFileSync(file, 'utf8');
  if (content === before) continue;
  changedFiles++;
  totalText += textChanges;
  totalWrap += wrapperChanges;
  if (!DRY) fs.writeFileSync(file, content);
  if (DRY || process.env.VERBOSE) console.log(`${path.relative(ROOT, file)}: +${textChanges} text / +${wrapperChanges} loop-wrappers`);
}
console.log(`\nFiles scanned:        ${files.length}`);
console.log(`Files changed:        ${changedFiles}`);
console.log(`Total text injects:   ${totalText}`);
console.log(`Total loop wrappers:  ${totalWrap}`);
if (DRY) console.log('(dry run — no files written)');
