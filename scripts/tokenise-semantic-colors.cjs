/**
 * Semantic colour tokeniser (Phase 8).
 *
 * Rewrites hardcoded Tailwind colour utilities in templates to
 * `<prop>-[var(--token-X, <originalAsTheme>)]` so every colour becomes a
 * CMS-editable slot WITHOUT losing its current value as a fallback.
 *
 * Mapping is SEMANTIC, not mechanical, so we don't reintroduce crosstalk:
 *   text-{gray}-900/950/800   -> heading
 *   text-{gray}-600/700       -> body
 *   text-{gray}-300/400/500   -> muted
 *   text-white                -> on-dark-heading      (text on dark surfaces)
 *   text-black                -> heading
 *   text-red/rose-*           -> danger               (errors, emergency)
 *   text-green/emerald/teal/lime-* -> success
 *   text-{other colour}-*     -> accent
 *   bg-white                  -> card-bg
 *   bg-{gray}-50/100/200      -> section-bg-alt
 *   bg-{gray}-darker          -> section-bg
 *   bg-red/rose-*             -> danger-bg
 *   bg-green/emerald/teal-*   -> success-bg
 *   bg-{other colour}-*       -> accent
 *   border/ring/outline/decoration-red-*   -> danger
 *   border/ring/outline/decoration-green-* -> success
 *   border/ring/outline/decoration-{gray}  -> card-border
 *   border/ring/outline/decoration-{other} -> accent
 *
 * EXCLUDED (reported, never auto-rewritten — visually risky / not cleanly
 * expressible as a single var):
 *   - gradient stops: from-/to-/via-
 *   - alpha utilities: any class with a /NN opacity suffix
 *   - shadow-/ colours
 *
 * Usage:
 *   node scripts/tokenise-semantic-colors.cjs --dry [dir-substr]   # plan only
 *   node scripts/tokenise-semantic-colors.cjs       [dir-substr]   # apply
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');
const filter = process.argv.slice(2).find((a) => !a.startsWith('--'));

const GRAYS = ['gray', 'slate', 'zinc', 'neutral', 'stone'];
const COLOR_FAMILIES = [
  'white', 'black', ...GRAYS,
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];
const PROPS = ['bg', 'text', 'border', 'ring', 'outline', 'decoration'];

// token cssVar by role (kept in sync with FIELD_DEFS)
const T = {
  heading: '--token-heading', body: '--token-body', muted: '--token-muted',
  onDarkHeading: '--token-on-dark-heading',
  accent: '--token-accent', cardBg: '--token-card-bg',
  sectionBg: '--token-section-bg', sectionBgAlt: '--token-section-bg-alt',
  cardBorder: '--token-card-border',
  danger: '--token-danger', dangerBg: '--token-danger-bg',
  success: '--token-success', successBg: '--token-success-bg',
};

function shade(cls) {
  const m = cls.match(/-(\d{2,3})$/);
  return m ? Number(m[1]) : null;
}
function family(cls) {
  for (const f of COLOR_FAMILIES) {
    if (new RegExp(`-(${f})(-\\d|$)`).test(cls) || cls.endsWith(`-${f}`)) return f;
  }
  return null;
}

// Returns { token } or null (skip). cls has NO alpha suffix and NO prefix beyond prop.
function mapToken(prop, cls) {
  const fam = family(cls);
  if (!fam) return null;
  const isGray = GRAYS.includes(fam);
  const sh = shade(cls);
  if (prop === 'text') {
    if (fam === 'white') return T.onDarkHeading;
    if (fam === 'black') return T.heading;
    if (fam === 'red' || fam === 'rose') return T.danger;
    if (['green', 'emerald', 'teal', 'lime'].includes(fam)) return T.success;
    if (isGray) {
      if (sh != null && sh >= 800) return T.heading;
      if (sh != null && sh >= 600) return T.body;
      return T.muted;
    }
    return T.accent;
  }
  if (prop === 'bg') {
    if (fam === 'white') return T.cardBg;
    if (fam === 'red' || fam === 'rose') return T.dangerBg;
    if (['green', 'emerald', 'teal'].includes(fam)) return T.successBg;
    if (isGray) return (sh != null && sh <= 200) ? T.sectionBgAlt : T.sectionBg;
    return T.accent;
  }
  // border / ring / outline / decoration
  if (fam === 'red' || fam === 'rose') return T.danger;
  if (['green', 'emerald', 'teal', 'lime'].includes(fam)) return T.success;
  if (isGray || fam === 'white' || fam === 'black') return T.cardBorder;
  return T.accent;
}

// theme() fallback string for arbitrary value, e.g. slate-900 -> theme(colors.slate.900)
function themeFallback(prop, cls) {
  const fam = family(cls);
  const sh = shade(cls);
  if (fam === 'white') return 'white';
  if (fam === 'black') return 'black';
  if (fam && sh != null) return `theme(colors.${fam}.${sh})`;
  return null;
}

// Optional Tailwind variant chain (hover:, focus:, dark:, group-hover:,
// data-[open]:, sm:, …) — preserved verbatim so the state still applies.
const VARIANT = `(?:[a-z][a-z0-9-]*(?:\\[[^\\]]*\\])?:)*`;
const CLASS_RE = new RegExp(
  `(^|[\\s"'\`])(${VARIANT})(${PROPS.join('|')})-(${COLOR_FAMILIES.join('|')})(-\\d{2,3})?(/\\d{1,3})?(?=[\\s"'\`]|$)`,
  'g',
);

let filesTouched = 0, rewrites = 0;
const skipped = { alpha: 0, gradient: 0, unmapped: 0 };
const plan = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx')) processFile(p);
  }
}

function processFile(file) {
  if (filter && !file.includes(filter)) return;
  let src = fs.readFileSync(file, 'utf8');
  let fileRewrites = 0;
  const localPlan = [];
  src = src.replace(CLASS_RE, (full, pre, variants, prop, fam, shadePart, alphaPart) => {
    const cls = `${prop}-${fam}${shadePart || ''}`;
    if (alphaPart) { skipped.alpha++; return full; }            // glass / overlay
    const token = mapToken(prop, cls);
    if (!token) { skipped.unmapped++; return full; }
    const fb = themeFallback(prop, cls);
    const replacement = `${variants || ''}${prop}-[var(${token}${fb ? `,${fb}` : ''})]`;
    fileRewrites++; rewrites++;
    localPlan.push(`${cls} -> ${replacement}`);
    return `${pre}${replacement}`;
  });
  // gradient stops (report only)
  const grad = src.match(new RegExp(`(from|to|via)-(${COLOR_FAMILIES.join('|')})(-\\d{2,3})?(/\\d{1,3})?`, 'g'));
  if (grad) skipped.gradient += grad.length;
  if (fileRewrites > 0) {
    filesTouched++;
    plan.push({ file: path.relative(ROOT, file), n: fileRewrites, samples: localPlan.slice(0, 6) });
    if (!DRY) fs.writeFileSync(file, src);
  }
}

walk(TEMPLATES);

plan.sort((a, b) => b.n - a.n);
console.log(`${DRY ? '[DRY RUN] ' : ''}Semantic tokeniser${filter ? ` (filter: ${filter})` : ''}`);
console.log(`Files ${DRY ? 'to touch' : 'touched'}: ${filesTouched} | rewrites: ${rewrites}`);
console.log(`Skipped — alpha/glass: ${skipped.alpha}, gradient stops: ${skipped.gradient}, unmapped: ${skipped.unmapped}`);
console.log('');
for (const p of plan.slice(0, 20)) {
  console.log(`  ${String(p.n).padStart(3)}  ${p.file}`);
  for (const s of p.samples) console.log(`         ${s}`);
}
if (plan.length > 20) console.log(`  … ${plan.length - 20} more files`);
