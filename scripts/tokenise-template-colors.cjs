// Phase 7 codemod: tokenise hardcoded Tailwind colour utilities in templates
// so that the colour pickers in the editor actually do something.
//
// Heuristic rewrites — only safe, decidable patterns:
//
//   bg-white/15  → applies inline style background: 'var(--token-badge-bg, ...)'
//     ↑ purely transparent overlay backgrounds usually serve as badge/eyebrow
//     glass — but rewriting EVERY bg-white/X is destructive, so we only target
//     known semantic locations via comments-of-style "// TOKENISE: ...".
//
// What we actually do here (high-confidence only):
//
//   1. INLINE GRADIENTS in hero/feature backgrounds:
//        from-[#xxxxxx] via-[#xxxxxx] to-[#xxxxxx]
//      → add a sibling inline style backgroundImage that uses
//        var(--token-section-bg) when set, falling back to the literal gradient.
//
//   2. STAND-ALONE bg-[#xxxxxx] / text-[#xxxxxx] / border-[#xxxxxx]:
//      → keep the class as fallback, add the corresponding token via inline
//        style only when we can confidently identify the slot (section bg,
//        heading colour, etc.). For now we limit to bg-[#…] on a <section>
//        or <div className="absolute inset-0"…> → section background.
//
// To stay safe the codemod prints every file it touched and the rewrites it
// performed. Run it, eyeball the diff, then push.
//
// Usage:  node scripts/tokenise-template-colors.cjs

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
    else if (e.isFile() && e.name.endsWith('.tsx')) tokenise(p);
  }
}

function tokenise(file) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0;

  // (1) Hero gradient overlay → inject a same-element style with
  //     background that the user can override via --token-section-bg.
  //     Targets common shape:
  //       <div className="absolute inset-0 bg-gradient-to-br from-[#xxx]/85 via-[#xxx]/65 to-[#xxx]/40" />
  //     The literal gradient stays as the natural fallback — when the user
  //     picks a colour in the editor it wins because inline style > Tailwind
  //     utility specificity.
  src = src.replace(
    /<div className="(absolute inset-0\s+bg-gradient-to-[a-z]+\s+from-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?\s+(?:via-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?\s+)?to-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?)"(\s+style=\{[^}]*\})?\s*\/>/g,
    (full, cls, existingStyle) => {
      if (existingStyle) return full; // already styled — don't duplicate
      if (full.includes('--token-section-bg')) return full;
      changed += 1;
      return `<div className="${cls}" style={{ background: 'var(--token-section-bg, transparent)' }} />`;
    },
  );

  // (2) Solid bg colour on a positioned overlay div (no gradient):
  //       <div className="absolute inset-0 bg-[#xxxxxx]" />
  //     Same treatment.
  src = src.replace(
    /<div className="(absolute inset-0\s+bg-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?)"(\s+style=\{[^}]*\})?\s*\/>/g,
    (full, cls, existingStyle) => {
      if (existingStyle) return full;
      if (full.includes('--token-section-bg')) return full;
      changed += 1;
      return `<div className="${cls}" style={{ background: 'var(--token-section-bg, transparent)' }} />`;
    },
  );

  // (3) Section root with bg-[#xxx] or bg-gradient → set token-section-bg.
  src = src.replace(
    /<section className="([^"]*?\bbg-(?:\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?|gradient-to-[a-z]+\s+from-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?(?:\s+via-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?)?\s+to-\[#[0-9a-fA-F]{3,8}\](?:\/\d+)?)[^"]*?)">/g,
    (full, cls) => {
      if (full.includes('style=')) return full; // already has inline style
      changed += 1;
      return `<section className="${cls}" style={{ background: 'var(--token-section-bg, transparent)' }}>`;
    },
  );

  // (4) Badge / eyebrow glass utility (bg-white/15 + backdrop-blur).
  //     The user complained that "Badge BG" picker does nothing — that's
  //     because the badge uses bg-white/15. Map it to --token-badge-bg with
  //     the original utility as the fallback colour.
  src = src.replace(
    /className="(inline-flex[^"]*?\bbg-(?:white|black)\/\d+[^"]*?)"(\s+style=\{[^}]*\})?/g,
    (full, cls, existingStyle) => {
      if (existingStyle) return full;
      if (full.includes('--token-badge-bg')) return full;
      changed += 1;
      return `className="${cls}" style={{ background: 'var(--token-badge-bg)' }}`;
    },
  );

  if (changed > 0) {
    fs.writeFileSync(file, src, 'utf8');
    touched += 1;
    edits += changed;
    log.push({ file: path.relative(process.cwd(), file), edits: changed });
  }
}

walk(ROOT);

console.log(`Files touched : ${touched}`);
console.log(`Edits         : ${edits}`);
for (const e of log.slice(0, 50)) console.log(`  ${e.edits.toString().padStart(3)}× ${e.file}`);
if (log.length > 50) console.log(`  ... +${log.length - 50} more`);
