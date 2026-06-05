// Fix duplicate JSX style={} attributes introduced by tokenise-template-colors.cjs
// when it ran against elements that already had a style attribute.
//
// Merges two adjacent style={{...}} occurrences into one. Keeps both objects'
// keys; later keys win on collision (matches React's runtime behavior for the
// last `style` attribute when duplicates are illegal in JSX).

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'apps', 'renderer', 'src', 'templates');

let edits = 0;
const touched = [];

function fix(file) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0;
  // Match `style={{A}} style={{B}}` and merge into `style={{A, B}}`.
  // A and B contain no nested braces — that's the case for every
  // single-line style attribute. Run repeatedly until stable.
  const re = /style=\{\{([^{}]*)\}\}\s+style=\{\{([^{}]*)\}\}/g;
  let next = src;
  do {
    src = next;
    next = src.replace(re, (_, a, b) => {
      changed += 1;
      const left = a.trim().replace(/,\s*$/, '');
      const right = b.trim().replace(/,\s*$/, '');
      const body = [left, right].filter(Boolean).join(', ');
      return `style={{ ${body} }}`;
    });
  } while (next !== src);
  if (changed > 0) {
    fs.writeFileSync(file, next, 'utf8');
    edits += changed;
    touched.push({ file: path.relative(process.cwd(), file), edits: changed });
  }
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.tsx')) fix(p);
  }
}

walk(ROOT);

console.log(`Edits: ${edits}`);
for (const t of touched) console.log(`  ${t.edits}× ${t.file}`);
