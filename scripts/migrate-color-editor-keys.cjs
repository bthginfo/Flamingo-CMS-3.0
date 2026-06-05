/**
 * Phase 3a: collapse legacy ColorFieldKey aliases in the section-color editor.
 *
 * The editor's SECTION_FIELDS map mixes modern token keys
 * (headingColor / bodyColor / iconColor / …) with legacy duplicates that
 * referenced --style-* / --brand-* vars (textPrimary / textSecondary /
 * brandPrimary / brandAccent / colorPrimary / styleBrand / imageTextColor /
 * cardBorder / cardBorderColor / cardShadow / headingWeight / headingTracking /
 * imageOverlay / btnSecondaryBg / btnSecondaryText).
 *
 * Templates have been migrated to canonical var(--token-*) in Phase 2, so
 * the legacy editor fields are now dead controls — they write a CSS var
 * that no template reads. We map every legacy key to its modern equivalent
 * (or drop it entirely if no modern equivalent exists).
 *
 *   - textPrimary       → bodyColor
 *   - textSecondary     → bodyColor
 *   - brandPrimary      → accentColor
 *   - brandAccent       → accentColor
 *   - colorPrimary      → accentColor
 *   - styleBrand        → accentColor
 *   - imageTextColor    → onDarkHeading
 *   - cardBorderColor   → borderColor
 *   - cardBorder        → (dropped — type:size, no modern token)
 *   - cardShadow        → (dropped — type:size, no modern token)
 *   - headingWeight     → (dropped — typography utility, kept inline in CSS)
 *   - headingTracking   → (dropped — typography utility, kept inline in CSS)
 *   - imageOverlay      → (dropped — gradient overlay, no modern token)
 *   - btnSecondaryBg    → (dropped — site-header level, not per-section)
 *   - btnSecondaryText  → (dropped — site-header level, not per-section)
 *
 * Run modes:
 *   node scripts/migrate-color-editor-keys.cjs            # write
 *   node scripts/migrate-color-editor-keys.cjs --dry      # preview
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(ROOT, 'apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
const DRY = process.argv.includes('--dry');

const ALIAS_TO_MODERN = {
  textPrimary:     'bodyColor',
  textSecondary:   'bodyColor',
  brandPrimary:    'accentColor',
  brandAccent:     'accentColor',
  colorPrimary:    'accentColor',
  styleBrand:      'accentColor',
  imageTextColor:  'onDarkHeading',
  cardBorderColor: 'borderColor',
};
const DROP = new Set([
  'cardBorder', 'cardShadow', 'headingWeight', 'headingTracking',
  'imageOverlay', 'btnSecondaryBg', 'btnSecondaryText',
]);

const src = fs.readFileSync(TARGET, 'utf8');

// Find the SECTION_FIELDS block (multi-line object literal).
const blockMatch = src.match(/const SECTION_FIELDS:[^=]*=\s*\{([\s\S]*?)\n\};\n/);
if (!blockMatch) { console.error('SECTION_FIELDS block not found'); process.exit(1); }
const blockBody = blockMatch[1];

// Per-line regex: capture sectionType and array contents.
const lineRe = /^(\s*)([a-zA-Z_$][\w$]*)\s*:\s*\[([^\]]*)\],\s*$/gm;
const newLines = blockBody.replace(lineRe, (_full, indent, key, list) => {
  const items = list.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  const migrated = [];
  const seen = new Set();
  for (const item of items) {
    if (DROP.has(item)) continue;
    const next = ALIAS_TO_MODERN[item] || item;
    if (seen.has(next)) continue;
    seen.add(next);
    migrated.push(next);
  }
  const formatted = migrated.map((k) => `'${k}'`).join(', ');
  return `${indent}${key}: [${formatted}],`;
});

const newSrc = src.replace(blockBody, newLines);

if (newSrc === src) { console.log('No changes.'); process.exit(0); }

if (!DRY) fs.writeFileSync(TARGET, newSrc);
const diffLines = newSrc.split('\n').filter((l, i) => l !== src.split('\n')[i]).length;
console.log(`${diffLines} lines changed in ${path.relative(ROOT, TARGET)}`);
if (DRY) console.log('(dry — not written)');
