/**
 * Auto-annotate <DynamicIcon name={X.Y}> usages with an editPath prop so the
 * live-preview overlay can attach a pencil/wand icon for swapping icons.
 *
 * Strategy:
 *   1. Find every <DynamicIcon name={EXPR} ...> in apps/renderer/src/templates.
 *   2. Skip if editPath= already present.
 *   3. If EXPR is a single identifier + property access (e.g. `cta.icon`,
 *      `item.icon`, `step.icon`), decide whether the leading identifier is
 *      a `.map((X, i) =>`-style iteration variable somewhere in the same
 *      file:
 *        a. If yes → emit editPath="<PROP>"     (relative; overlay's buildPath
 *                                                will prepend collection/index)
 *        b. If no  → emit editPath="<IDENT.PROP>" (absolute path from data root)
 *   4. EXPR forms we don't touch:
 *        - String literals: name="Coffee" / name={'minus'}
 *        - Ternaries: name={open === i ? 'minus' : 'plus'}
 *        - Function calls: name={resolveIcon(x)}
 *        - Bare identifier: name={badgeIcon}  ← can't infer path
 *
 * Idempotent: re-runs leave files unchanged.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && /\.tsx$/.test(e.name)) out.push(p);
  }
}

// Identify which simple identifiers act as .map callback parameters in this
// file. Matches `.map((foo, ...) =>`, `.map(foo =>`, `.map((foo) =>`.
function collectMapVars(src) {
  const vars = new Set();
  const re = /\.map\s*\(\s*(?:\(\s*([A-Za-z_$][\w$]*)\b|([A-Za-z_$][\w$]*)\s*=>)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const v = m[1] || m[2];
    if (v) vars.add(v);
  }
  return vars;
}

// Locate <DynamicIcon...> opening tags. Returns array of {start, end, content}
// where content is the inside of the tag (without `<DynamicIcon` and `/>`).
function findDynamicIconTags(src) {
  const out = [];
  const open = /<DynamicIcon\b/g;
  let m;
  while ((m = open.exec(src)) !== null) {
    const tagStart = m.index;
    // Find the matching `/>` or `>` at depth 0 (skip over braces and quotes).
    let i = m.index + m[0].length;
    let depth = 0;
    let inStr = null;
    while (i < src.length) {
      const ch = src[i];
      if (inStr) {
        if (ch === inStr && src[i - 1] !== '\\') inStr = null;
      } else if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
      } else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 0 && ch === '/' && src[i + 1] === '>') {
        out.push({ tagStart, tagEnd: i + 2, content: src.slice(m.index + m[0].length, i) });
        break;
      } else if (depth === 0 && ch === '>') {
        // Non-self-closing — not the typical Lucide form but handle it.
        out.push({ tagStart, tagEnd: i + 1, content: src.slice(m.index + m[0].length, i) });
        break;
      }
      i++;
    }
  }
  return out;
}

// Extract `name={...}` value from the content of a tag. Returns the raw
// JS expression text inside the braces, or null if `name` is a string
// literal or absent.
function extractNameExpr(content) {
  const m = content.match(/\bname\s*=\s*\{/);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  let inStr = null;
  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (inStr) {
      if (ch === inStr && content[i - 1] !== '\\') inStr = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
    } else if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth > 0) i++;
  }
  return content.slice(start, i).trim();
}

let totalAnnotated = 0;
let totalSkipped = 0;
const filesChanged = new Set();

const files = [];
walk(TEMPLATES, files);

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('<DynamicIcon')) continue;

  const mapVars = collectMapVars(src);
  const tags = findDynamicIconTags(src);
  if (tags.length === 0) continue;

  // Apply edits back-to-front so offsets stay valid.
  let modified = false;
  for (let t = tags.length - 1; t >= 0; t--) {
    const { tagStart, tagEnd, content } = tags[t];
    if (/\beditPath\s*=/.test(content)) { totalSkipped++; continue; }

    const expr = extractNameExpr(content);
    if (!expr) { totalSkipped++; continue; }

    // Only handle `IDENT.PROP` or `IDENT.PROP || 'literal'` shapes.
    const propMatch = expr.match(/^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*(?:\|\|.*)?$/);
    if (!propMatch) { totalSkipped++; continue; }
    const ident = propMatch[1];
    const prop = propMatch[2];

    // Determine relative vs absolute path:
    //   - If `ident` is a .map iteration variable in this file, the icon
    //     lives under a collection-iterated row. Overlay's buildPath will
    //     prepend the collection.index automatically, so we only need the
    //     leaf prop.
    //   - Otherwise the icon lives at a top-level data path; emit the full
    //     `ident.prop` so the overlay reaches it without ancestor markers.
    const editPath = mapVars.has(ident) ? prop : `${ident}.${prop}`;

    // Inject ` editPath="..."` immediately after the tag-opening `<DynamicIcon`.
    const insertAt = tagStart + '<DynamicIcon'.length;
    const insert = ` editPath="${editPath}"`;
    src = src.slice(0, insertAt) + insert + src.slice(insertAt);
    modified = true;
    totalAnnotated++;
  }

  if (modified) {
    fs.writeFileSync(file, src);
    filesChanged.add(file);
  }
}

console.log(`Annotated: ${totalAnnotated}`);
console.log(`Skipped:   ${totalSkipped}`);
console.log(`Files changed: ${filesChanged.size}`);
