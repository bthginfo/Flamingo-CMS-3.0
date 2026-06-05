// Codemod: add data-edit-image and data-edit-link annotations to templates so
// the EditOverlays component (live-preview) renders image / link pencil icons
// on the right elements.
//
// data-edit-image="<path>"   → image-picker modal, writes URL at path.
// data-edit-link="<path>"    → link/icon modal, writes { label, href, icon } at path.
//
// Heuristics:
//
//   <Image src={data.bgImage} ...>                  → data-edit-image="bgImage"
//   <Image src={data.image} ...>                    → data-edit-image="image"
//   <Image src={item.image} ...>                    → data-edit-image="image"  (inside .map item)
//   <Image src={X.src} ... data-edit-collection=…>  → data-edit-image="src"
//   <a href={primaryCta.href} ...>                  → data-edit-link="primaryCta"
//   <a href={secondaryCta.href} ...>                → data-edit-link="secondaryCta"
//   <a href={ctaPrimary.href} ...>                  → data-edit-link="ctaPrimary"
//
// Only injects on the OPENING tag of the matched element. Idempotent — never
// adds the same attribute twice.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'apps', 'renderer', 'src', 'templates');

let touched = 0;
let edits = 0;
const log = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.tsx')) annotate(p);
  }
}

// Injects ` data-edit-<kind>="<path>"` right after the tag name if the
// element has not been annotated yet. `tagStartAbs` is the index of the
// `<` and `tagEndAbs` of the closing `>` or `/>` of the OPENING tag.
function injectAttr(src, tagStartAbs, tagEndAbs, kind, value) {
  const tag = src.slice(tagStartAbs, tagEndAbs + 1);
  if (new RegExp(`data-edit-${kind}\\s*=`).test(tag)) return src; // already there
  // Insert after the tag name (first whitespace).
  const nameEnd = tag.search(/[\s/>]/);
  if (nameEnd === -1) return src;
  const insert = ` data-edit-${kind}="${value}"`;
  return src.slice(0, tagStartAbs + nameEnd) + insert + src.slice(tagStartAbs + nameEnd);
}

// Find the opening tag (and its closing `>`/'/>') that contains the given
// substring offset. Returns [startAbs, endAbs] or null.
function tagBoundsContaining(src, offset) {
  let start = src.lastIndexOf('<', offset);
  while (start !== -1) {
    const next = src[start + 1];
    if (next && /[A-Za-z]/.test(next)) break;
    start = src.lastIndexOf('<', start - 1);
  }
  if (start === -1) return null;
  // Walk forward respecting nested braces to find the matching closing >
  let depth = 0;
  for (let i = start + 1; i < src.length; i += 1) {
    const c = src[i];
    if (c === '{') depth += 1;
    else if (c === '}') depth -= 1;
    else if (c === '>' && depth === 0) return [start, i];
  }
  return null;
}

function annotate(file) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  let changed = 0;

  // 1) Images: `<Image src={X.Y}` or `<img src={X.Y}`. We treat the LAST
  //    segment of Y as the editable path (consistent with collection-aware
  //    overlay buildPath, which prepends `data-edit-collection`/index).
  const imgRe = /<(?:Image|img)[^<>]{0,200}\bsrc=\{([A-Za-z_$][\w$.?]*)\}/g;
  let m;
  while ((m = imgRe.exec(src)) !== null) {
    const expr = m[1];
    const last = expr.replace(/\?$/, '').split('.').filter(Boolean).pop();
    if (!last || last === 'src' && expr.indexOf('.') === -1) {
      // bare variable, skip
      continue;
    }
    const bounds = tagBoundsContaining(src, m.index);
    if (!bounds) continue;
    const updated = injectAttr(src, bounds[0], bounds[1], 'image', last);
    if (updated !== src) { src = updated; changed += 1; imgRe.lastIndex = m.index + 1; }
  }

  // 2) Links: `<a href={X.href}` or `<Link href={X.href}` where X is a CTA-ish
  //    identifier (primaryCta, secondaryCta, ctaPrimary, ctaSecondary, cta).
  const linkRe = /<(?:a|Link)[^<>]{0,400}\bhref=\{([A-Za-z_$][\w$]*)\.href[^}]*\}/g;
  while ((m = linkRe.exec(src)) !== null) {
    const v = m[1];
    if (!/cta|button|link|primary|secondary/i.test(v)) continue;
    const bounds = tagBoundsContaining(src, m.index);
    if (!bounds) continue;
    const updated = injectAttr(src, bounds[0], bounds[1], 'link', v);
    if (updated !== src) { src = updated; changed += 1; linkRe.lastIndex = m.index + 1; }
  }

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    touched += 1;
    edits += changed;
    log.push({ file: path.relative(process.cwd(), file), edits: changed });
  }
}

walk(ROOT);

console.log(`Files touched : ${touched}`);
console.log(`Annotations   : ${edits}`);
for (const e of log.slice(0, 40)) console.log(`  ${e.edits.toString().padStart(3)}× ${e.file}`);
if (log.length > 40) console.log(`  ... +${log.length - 40} more`);
