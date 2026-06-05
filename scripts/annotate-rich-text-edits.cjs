// Codemod: add data-edit-rich="<lastSegment>" to JSX elements that use
// dangerouslySetInnerHTML={{ __html: X }} but do not already declare an
// edit attribute. Operates line by line to avoid catastrophic backtracking
// from full-tag regexes on dense one-liner templates.
//
// Usage:  node scripts/annotate-rich-text-edits.cjs

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'apps', 'renderer', 'src', 'templates');

let touchedFiles = 0;
let totalEdits = 0;
const skipped = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.isFile() && entry.name.endsWith('.tsx')) annotate(p);
  }
}

function lastSegment(expr) {
  const cleaned = expr.split('||')[0].trim();
  const m = cleaned.match(/([A-Za-z_$][\w$]*)\s*$/);
  return m ? m[1] : null;
}

function readHtmlExpr(line, htmlStart) {
  let depth = 0;
  let i = htmlStart;
  while (i < line.length) {
    const c = line[i];
    if (c === '{') depth += 1;
    else if (c === '}') {
      if (depth === 0) break;
      depth -= 1;
    }
    i += 1;
  }
  if (line[i] !== '}' || line[i + 1] !== '}') return null;
  return { exprStart: htmlStart, exprEnd: i, fullEnd: i + 2 };
}

function findTagStart(line, dangerOffset) {
  let depthBraces = 0;
  for (let i = dangerOffset - 1; i >= 0; i -= 1) {
    const c = line[i];
    if (c === '}') depthBraces += 1;
    else if (c === '{') depthBraces -= 1;
    else if (c === '<' && depthBraces === 0) {
      if (/[A-Za-z]/.test(line[i + 1] || '')) return i;
    }
  }
  return -1;
}

function annotate(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  let changed = 0;
  for (let li = 0; li < lines.length; li += 1) {
    let line = lines[li];
    let cursor = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const idx = line.indexOf('dangerouslySetInnerHTML', cursor);
      if (idx === -1) break;
      cursor = idx + 'dangerouslySetInnerHTML'.length;
      const eq = line.indexOf('=', idx + 'dangerouslySetInnerHTML'.length - 1);
      if (eq === -1) continue;
      let p = eq + 1;
      while (p < line.length && /\s/.test(line[p])) p += 1;
      if (line[p] !== '{' || line[p + 1] !== '{') continue;
      let h = p + 2;
      while (h < line.length && /\s/.test(line[h])) h += 1;
      if (!line.startsWith('__html', h)) continue;
      h += '__html'.length;
      while (h < line.length && /\s/.test(line[h])) h += 1;
      if (line[h] !== ':') continue;
      h += 1;
      while (h < line.length && /\s/.test(line[h])) h += 1;
      const span = readHtmlExpr(line, h);
      if (!span) continue;
      const tagStart = findTagStart(line, idx);
      if (tagStart === -1) { skipped.push({ file, li, reason: 'multiline tag' }); continue; }
      const attrsRegion = line.slice(tagStart, idx);
      if (/data-edit-(rich|path)\s*=/.test(attrsRegion)) continue;
      const expr = line.slice(span.exprStart, span.exprEnd).trim();
      const seg = lastSegment(expr);
      if (!seg) { skipped.push({ file, li, expr }); continue; }
      const insert = `data-edit-rich="${seg}" `;
      line = line.slice(0, idx) + insert + line.slice(idx);
      cursor += insert.length;
      changed += 1;
    }
    lines[li] = line;
  }
  if (changed > 0) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    touchedFiles += 1;
    totalEdits += changed;
  }
}

walk(ROOT);

console.log(`Files touched : ${touchedFiles}`);
console.log(`Annotations   : ${totalEdits}`);
console.log(`Skipped       : ${skipped.length}`);
if (skipped.length > 0 && skipped.length <= 30) {
  for (const s of skipped) console.log(`  - ${path.relative(process.cwd(), s.file)}:${s.li + 1}  ${s.reason || s.expr || ''}`);
}
