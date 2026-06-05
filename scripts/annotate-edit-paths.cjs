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
  'badge', 'badgeText', 'eyebrow', 'kicker', 'label',
  'name', 'role', 'position',
  'quote', 'author', 'company', 'tagline', 'note',
  'ctaLabel', 'ctaPrimaryLabel', 'ctaSecondaryLabel', 'ctaText',
  'buttonLabel', 'buttonText', 'submitLabel', 'actionLabel', 'linkText',
  'primaryLabel', 'secondaryLabel', 'linkLabel', 'menuLabel',
  'statValue', 'statLabel', 'statSuffix', 'statPrefix',
  'price', 'priceLabel', 'priceSuffix', 'priceFrom', 'priceTo', 'cost', 'amount',
  'phone', 'phoneNumber', 'email', 'address', 'addressLine',
  'question', 'answer', 'prompt', 'hint', 'tip',
  'date', 'time', 'duration', 'location', 'venue', 'venueName',
  'category', 'tag', 'value', 'unit', 'detail', 'summary',
]);

// JSX tags we'll annotate. Keep it to actual text containers.
const TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'blockquote', 'figcaption', 'label', 'li', 'strong', 'em'];

// Pull a known field name out of a JSX expression body. Handles the
// following shapes (the LHS wins when fallback operators are involved):
//   {headline}
//   {data.headline}
//   {data.headline as string}
//   {(data.headline as string)}
//   {(data.headline as string) || 'default'}
//   {data.headline ?? 'default'}
//   {data?.headline}
//   {plain(data.headline)}
function fieldFromExpression(exprRaw) {
  let expr = exprRaw.trim();
  // Strip wrapping parens (repeatedly)
  while (expr.startsWith('(') && expr.endsWith(')') && balancedParenSpan(expr) === expr.length) {
    expr = expr.slice(1, -1).trim();
  }
  // If the expression is `LHS || RHS` or `LHS ?? RHS`, only the LHS
  // determines the field — RHS is the default literal.
  const fallbackSplit = splitOnTopLevelFallback(expr);
  if (fallbackSplit) return fieldFromExpression(fallbackSplit);
  // Strip `as Type` cast
  expr = expr.replace(/\s+as\s+[A-Za-z_$][\w.<>[\]|& '"]*$/, '').trim();
  // Strip wrapping calls like plain(...), String(...), formatX(...)
  const callMatch = expr.match(/^(?:plain|String|trim|stripHtml|toString|html|md|markdown)\s*\(\s*([\s\S]+?)\s*\)$/);
  if (callMatch) return fieldFromExpression(callMatch[1]);
  // Member access: take last segment (handles a?.b and a.b)
  const segments = expr.split(/\??\./).map((s) => s.trim());
  const last = segments[segments.length - 1];
  // Identifier match
  const idMatch = last.match(/^([A-Za-z_$][\w$]*)$/);
  if (!idMatch) return null;
  const name = idMatch[1];
  if (TEXT_FIELDS.has(name)) return name;
  return null;
}

// Return how far `(...)` extends from position 0 (i.e. the index AFTER the
// matching closing paren) — used to detect whether the whole expression is
// wrapped in a single paren-pair vs. being two side-by-side groups.
function balancedParenSpan(s) {
  if (s[0] !== '(') return 0;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') { depth--; if (depth === 0) return i + 1; }
  }
  return 0;
}

// If the expression top-level is `LHS || RHS` or `LHS ?? RHS`, return LHS.
// Otherwise null. Top-level means outside any paren / brace / string.
function splitOnTopLevelFallback(expr) {
  let depth = 0;
  let inSingle = false, inDouble = false, inBack = false;
  for (let i = 0; i < expr.length - 1; i++) {
    const ch = expr[i];
    if (inSingle) { if (ch === '\\') { i++; continue; } if (ch === "'") inSingle = false; continue; }
    if (inDouble) { if (ch === '\\') { i++; continue; } if (ch === '"') inDouble = false; continue; }
    if (inBack) { if (ch === '\\') { i++; continue; } if (ch === '`') inBack = false; continue; }
    if (ch === "'") { inSingle = true; continue; }
    if (ch === '"') { inDouble = true; continue; }
    if (ch === '`') { inBack = true; continue; }
    if (ch === '(' || ch === '[' || ch === '{') { depth++; continue; }
    if (ch === ')' || ch === ']' || ch === '}') { depth--; continue; }
    if (depth !== 0) continue;
    const two = expr.slice(i, i + 2);
    if (two === '||' || two === '??') return expr.slice(0, i).trim();
  }
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
  const afterPassC = wrapMixedContentText(afterPassB);
  const wrapperChanges = countOccurrences(afterPassA, 'data-edit-collection=') - countOccurrences(original, 'data-edit-collection=');
  const textChanges = countOccurrences(afterPassC, 'data-edit-path=') - countOccurrences(afterPassA, 'data-edit-path=');
  return { content: afterPassC, wrapperChanges, textChanges };
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

// PASS B: annotate text containers (h1..h6, p, span, a, button, etc. plus
// their framer-motion equivalents `motion.h1` … `motion.em`) whose body is
// a single JSX expression resolving to a known text-field name.
//
// Uses a brace-aware scanner instead of a regex for the opening tag so
// attributes with nested braces (e.g. `style={{ color: x }}`) don't break
// the match. The previous regex form silently skipped any text container
// that used `style={{…}}`, which is why ~30% of templates went un-annotated.
function annotateTextFields(src) {
  const textTagSet = new Set([...TEXT_TAGS, ...TEXT_TAGS.map((t) => `motion.${t}`)]);
  let out = '';
  let i = 0;
  // Scan for "<tag" tokens. For each, do brace-aware tag-end search, then
  // check the body is exactly one JSX expression.
  const tagStartRe = /<([A-Za-z][A-Za-z0-9.]*)/g;
  let m;
  while ((m = tagStartRe.exec(src)) !== null) {
    const tag = m[1];
    if (!textTagSet.has(tag)) continue;
    const openStart = m.index;
    const afterTagName = openStart + 1 + tag.length;
    // Find the closing '>' of the opening tag, honouring nested '{}',
    // '{{}}', backticks, and string literals.
    let j = afterTagName;
    let braceDepth = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;
    while (j < src.length) {
      const ch = src[j];
      if (inSingle) { if (ch === '\\') { j += 2; continue; } if (ch === "'") inSingle = false; }
      else if (inDouble) { if (ch === '\\') { j += 2; continue; } if (ch === '"') inDouble = false; }
      else if (inBacktick) { if (ch === '\\') { j += 2; continue; } if (ch === '`') inBacktick = false; }
      else if (ch === "'") inSingle = true;
      else if (ch === '"') inDouble = true;
      else if (ch === '`') inBacktick = true;
      else if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
      else if (ch === '>' && braceDepth === 0) break;
      else if (ch === '<' && braceDepth === 0) { j = -1; break; }
      j++;
    }
    if (j < 0 || j >= src.length) continue;
    // Self-closing tags can't carry a text expression
    if (src[j - 1] === '/') { tagStartRe.lastIndex = j + 1; continue; }
    // Expect `{ … }` body right after '>'
    const bodyStart = j + 1;
    // Allow whitespace
    let bs = bodyStart;
    while (bs < src.length && /\s/.test(src[bs])) bs++;
    if (src[bs] !== '{') { tagStartRe.lastIndex = j + 1; continue; }
    // Find matching closing brace
    let depth = 1;
    let k = bs + 1;
    while (k < src.length && depth > 0) {
      const ch = src[k];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      k++;
    }
    if (depth !== 0) { tagStartRe.lastIndex = j + 1; continue; }
    const exprBody = src.slice(bs + 1, k - 1);
    // After the }, expect optional whitespace then `</tag>` — the close
    // tag matches the OPENING tag verbatim (so `<motion.h2>` is closed by
    // `</motion.h2>`). The previous code stripped the `motion.` prefix
    // and only looked for `</h2>`, which never matched and silently
    // dropped the annotation for every framer-motion text container.
    const closeRe = new RegExp(`^\\s*<\\/${tag.replace(/\./g, '\\.')}>`);
    const tail = src.slice(k);
    const closeMatch = tail.match(closeRe);
    if (!closeMatch) { tagStartRe.lastIndex = j + 1; continue; }
    const field = fieldFromExpression(exprBody);
    if (!field) { tagStartRe.lastIndex = j + 1; continue; }
    const openTagOriginal = src.slice(openStart, j + 1);
    const injected = injectAttribute(openTagOriginal, field);
    if (!injected) { tagStartRe.lastIndex = j + 1; continue; }
    out += src.slice(i, openStart);
    out += injected + src.slice(j + 1, k) + closeMatch[0];
    i = k + closeMatch[0].length;
    tagStartRe.lastIndex = i;
  }
  out += src.slice(i);
  return out;
}

// PASS C: handle "mixed content" text expressions — `<a><Icon />{label}</a>`
// or `<p>… {expression}</p>`. Pass B intentionally skipped these because
// the body isn't a single expression. We wrap just the expression in a
// `<span data-edit-path="…">{expression}</span>` so the user can click and
// edit the text portion without restructuring the surrounding JSX.
function wrapMixedContentText(src) {
  const textTagSet = new Set([...TEXT_TAGS, ...TEXT_TAGS.map((t) => `motion.${t}`)]);
  let out = '';
  let i = 0;
  const re = /\{([^{}]{1,200})\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const exprBody = m[1];
    const field = fieldFromExpression(exprBody);
    if (!field) continue;
    const openIdx = m.index;
    // Skip if expression sits inside an opening tag (it's an attribute).
    let insideTag = false;
    for (let k = openIdx - 1; k >= 0; k--) {
      if (src[k] === '>') break;
      if (src[k] === '<') { insideTag = true; break; }
    }
    if (insideTag) continue;
    // Re-run safety: don't wrap if already wrapped by a previous Pass C.
    const before30 = src.slice(Math.max(0, openIdx - 30), openIdx);
    if (/data-edit-path\s*=[^>]*>\s*$/.test(before30)) continue;
    // Heuristic enclosing-tag check: walk backward through balanced JSX
    // until we hit an unmatched `<tag …>`. Skip entirely if the parent is
    // not a known text container (we don't want to inject spans into
    // arbitrary structural divs).
    const parent = findEnclosingTextTag(src, openIdx, textTagSet);
    if (!parent) continue;
    // Skip if parent already carries data-edit-path (Pass B winner).
    if (/\bdata-edit-path\s*=/.test(parent.openTag)) continue;
    out += src.slice(i, openIdx);
    out += `<span data-edit-path="${field}">{${exprBody}}</span>`;
    i = openIdx + m[0].length;
    re.lastIndex = i;
  }
  out += src.slice(i);
  return out;
}

function findEnclosingTextTag(src, position, textTagSet) {
  let depth = 0;
  let k = position - 1;
  while (k >= 0) {
    const ch = src[k];
    if (ch === '>') {
      let lt = k - 1;
      let strDepth = 0;
      while (lt >= 0) {
        if (src[lt] === '<' && strDepth === 0) break;
        if (src[lt] === '{') strDepth++;
        else if (src[lt] === '}') strDepth--;
        lt--;
      }
      if (lt < 0) return null;
      const inner = src.slice(lt, k + 1);
      if (inner.endsWith('/>')) { k = lt - 1; continue; }
      if (inner.startsWith('</')) { depth++; k = lt - 1; continue; }
      if (depth === 0) {
        const tagNameMatch = inner.match(/^<([A-Za-z][A-Za-z0-9.]*)/);
        if (!tagNameMatch) return null;
        const tag = tagNameMatch[1];
        if (!textTagSet.has(tag)) return null;
        return { tag, openTag: inner, openStart: lt };
      }
      depth--;
      k = lt - 1;
      continue;
    }
    k--;
  }
  return null;
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
