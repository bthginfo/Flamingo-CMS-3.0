/**
 * Rebind text-coloured semantic roles (price, eyebrow) to their DEDICATED
 * token, keeping the previously-borrowed token as a fallback.
 *
 * For every JSX opening tag carrying data-edit-path="<role-path>", rewrite its
 * text colour binding:
 *   text-[color:var(--token-X)]  →  text-[color:var(--token-<role>,var(--token-X))]
 * and likewise the `text-[var(--token-X)]` form. Only the tag bearing the
 * role's data-edit-path is touched, so neighbouring elements are unaffected.
 *
 *   node scripts/rebind-text-roles.cjs --dry
 *   node scripts/rebind-text-roles.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'apps/renderer/src/templates');
const DRY = process.argv.includes('--dry');

const ROLES = [
  { token: '--token-price', paths: ['price', 'priceLabel', 'priceValue', 'priceFrom'] },
  { token: '--token-eyebrow', paths: ['eyebrow', 'kicker', 'overline'] },
  // Icon roles: a Check icon is always a checkmark, a Star always a rating
  // star — so binding their colour to the dedicated slot is always correct.
  { token: '--token-check', tags: ['Check', 'CheckCircle', 'CheckCircle2', 'BadgeCheck', 'CircleCheck', 'CheckCheck'] },
  { token: '--token-rating-star', tags: ['Star', 'StarHalf'] },
  { token: '--token-quote', tags: ['Quote'] },
  // Text-only badges (coloured uppercase labels) bind to the dedicated badge
  // TEXT slot. Pill badges that carry a background use `.section-badge`, which
  // is already wired to --token-badge-* by the renderer — so those tags are
  // skipped (excludeIfTagHas). Restricted to files the role-coverage audit
  // flags as genuinely unbound (badgeFiles) to avoid collateral rewrites.
  {
    token: '--token-badge-text',
    paths: ['badgeText', 'badge', 'badgeLabel'],
    excludeIfTagHas: 'section-badge',
    onlyFiles: badgeGapFiles(),
  },
];

// Files where the badge role is rendered but NOT bound to a badge token
// (mirrors scripts/audit-color-role-coverage.cjs --role badge).
function badgeGapFiles() {
  const TOK = ['--token-badge-bg', '--token-badge-text', '--token-badge-border'];
  const PATHS = ['badgeText', 'badge', 'badgeLabel'];
  const out = new Set();
  for (const f of walk(TEMPLATES)) {
    const s = fs.readFileSync(f, 'utf8');
    const renders = PATHS.some((p) => new RegExp(`data-edit-(?:path|rich)=["']${p}["']`).test(s));
    if (!renders) continue;
    if (/className=["'][^"']*\bsection-badge\b/.test(s)) continue;     // bound via CSS
    if (TOK.some((t) => s.includes(t))) continue;                      // already bound
    out.add(f);
  }
  return out;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Rewrite text-colour token bindings inside a single opening-tag string.
function rebindTag(tag, roleToken) {
  let n = 0;
  // Matches both bare and fallback forms (one nested theme()/var() level):
  //   text-[color:var(--token-X)]
  //   text-[var(--token-X,theme(colors.red.700))]
  const re = /text-\[(color:)?var\(\s*(--token-[a-z0-9-]+)\s*(,[^\]]*?)?\)\]/g;
  const out = tag.replace(re, (full, colorPrefix, tok, fallback) => {
    if (tok === roleToken) return full;               // already bound
    n++;
    return `text-[${colorPrefix || ''}var(${roleToken},var(${tok}${fallback || ''}))]`;
  });
  return { out, n };
}

let filesTouched = 0, rewrites = 0, noColorTags = 0;
const plan = [];

for (const file of walk(TEMPLATES)) {
  let src = fs.readFileSync(file, 'utf8');
  let fileN = 0;
  for (const role of ROLES) {
    if (role.onlyFiles && !role.onlyFiles.has(file)) continue;
    // Match the element that carries the role: either a JSX tag with the role's
    // data-edit-path, or a specific element/icon tag name.
    const tagRe = role.tags
      ? new RegExp(`<(?:${role.tags.join('|')})\\b[^>]*?/?>`, 'g')
      : new RegExp(`<[a-zA-Z][^>]*data-edit-(?:path|rich)=["'](?:${role.paths.join('|')})["'][^>]*>`, 'g');
    src = src.replace(tagRe, (tag) => {
      if (role.excludeIfTagHas && tag.includes(role.excludeIfTagHas)) return tag;
      let { out, n } = rebindTag(tag, role.token);
      // Icons that carry no own colour class (they inherit the parent text
      // colour, with or without fill="currentColor") get one injected so the
      // role becomes editable — falls back to inherit when the slot is unset.
      // Check/Star icons are semantically unambiguous, so this is always right.
      const hasOwnColour = /text-\[(?:color:)?var\(/.test(tag) || /style=\{\{[^}]*color/.test(tag);
      if (n === 0 && role.tags && !hasOwnColour) {
        const cls = `text-[color:var(${role.token})]`;
        if (/className=["']/.test(out)) out = out.replace(/className=["']/, (m) => `${m}${cls} `);
        else out = out.replace(/<(\w+)\b/, (m, t) => `<${t} className="${cls}"`);
        n = 1; fileN += 1; rewrites += 1;
        return out;
      }
      if (n > 0) { fileN += n; rewrites += n; }
      else if (!/text-\[(?:color:)?var\(/.test(tag)) noColorTags++;
      return out;
    });
  }
  if (fileN > 0) {
    filesTouched++;
    plan.push({ file: path.relative(ROOT, file), n: fileN });
    if (!DRY) fs.writeFileSync(file, src);
  }
}

plan.sort((a, b) => b.n - a.n);
console.log(`${DRY ? '[DRY] ' : ''}Rebind text roles — files: ${filesTouched}, rewrites: ${rewrites}, role-tags w/o text-colour: ${noColorTags}`);
for (const p of plan) console.log(`  ${String(p.n).padStart(2)}  ${p.file}`);
