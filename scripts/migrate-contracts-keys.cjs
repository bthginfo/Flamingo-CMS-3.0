/**
 * Phase 4 hotfix: migrate legacy ColorFieldKey strings in the two
 * section-color-contracts files. Phase 3 already removed the legacy keys
 * from the ColorFieldKey union, so any 'textPrimary'/'imageTextColor'/…
 * literal in these data files breaks `tsc`.
 *
 * Same alias + drop rules as scripts/migrate-color-editor-keys.cjs.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const ALIAS = {
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
  'btnSecondaryBg', 'btnSecondaryText',
]);

const FILES = [
  'apps/renderer/src/lib/section-color-contracts.ts',
  'apps/renderer/src/lib/section-color-contracts-generated.ts',
];

const arrRe = /\[([^\[\]]*)\]/g;
let totalLines = 0;
for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  const out = src.replace(arrRe, (full, body) => {
    // Only touch arrays that look like ColorFieldKey lists (string-literal members).
    if (!/^[\s,'"\w]+$/.test(body)) return full;
    const items = [...body.matchAll(/['"]([\w]+)['"]/g)].map((m) => m[1]);
    if (items.length === 0) return full;
    const migrated = [];
    const seen = new Set();
    for (const it of items) {
      if (DROP.has(it)) continue;
      const next = ALIAS[it] || it;
      if (seen.has(next)) continue;
      seen.add(next);
      migrated.push(next);
    }
    return `[${migrated.map((k) => `'${k}'`).join(', ')}]`;
  });
  if (out !== src) {
    fs.writeFileSync(abs, out);
    const changed = out.split('\n').filter((l, i) => l !== src.split('\n')[i]).length;
    totalLines += changed;
    console.log(`${changed} lines changed in ${rel}`);
  } else {
    console.log(`no changes: ${rel}`);
  }
}
console.log(`total: ${totalLines} lines`);
