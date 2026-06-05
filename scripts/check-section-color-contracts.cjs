/**
 * CI GUARD — fails if section-color-contracts-generated.ts is out of sync
 * with the live template sources.
 *
 * Architecture invariant we are protecting:
 *
 *   Every section.type's editable color fields in the CMS = exactly the set
 *   of var(--token-*) references that this section's template renders.
 *
 * If a developer edits a template (adds/removes a var(--token-*) ref) but
 * forgets to re-run `node scripts/generate-section-color-contracts.cjs`,
 * the editor's contract drifts away from what the template actually paints.
 * This check, run in CI / on pre-push, makes that impossible.
 *
 * Exit code: 0 if in sync, 1 if drift detected (prints diff hints).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GENERATED = path.join(ROOT, 'apps/renderer/src/lib/section-color-contracts-generated.ts');
const GENERATOR = path.join(ROOT, 'scripts/generate-section-color-contracts.cjs');

if (!fs.existsSync(GENERATED)) {
  console.error('ERROR: ' + path.relative(ROOT, GENERATED) + ' is missing.');
  console.error('Run: node scripts/generate-section-color-contracts.cjs');
  process.exit(1);
}
if (!fs.existsSync(GENERATOR)) {
  console.error('ERROR: codegen script missing: ' + path.relative(ROOT, GENERATOR));
  process.exit(1);
}

const before = fs.readFileSync(GENERATED, 'utf8');
// Run the generator, capture the new output, then restore the file so the
// check is non-destructive.
try {
  execSync('node ' + JSON.stringify(GENERATOR), { stdio: ['ignore', 'ignore', 'inherit'] });
} catch (e) {
  console.error('Codegen script failed:', e.message);
  fs.writeFileSync(GENERATED, before);
  process.exit(1);
}
const after = fs.readFileSync(GENERATED, 'utf8');

if (before === after) {
  console.log('section-color-contracts-generated.ts is in sync.');
  process.exit(0);
}

// Drift detected — surface a summary and restore the committed file.
fs.writeFileSync(GENERATED, before);

const KEY_RE = /^  ([a-zA-Z][\w]+):\s*(\[[^\]]*\])/gm;
function parse(s) {
  const map = {};
  let m;
  const re = new RegExp(KEY_RE.source, 'gm');
  while ((m = re.exec(s)) !== null) map[m[1]] = m[2];
  return map;
}
const A = parse(before);
const B = parse(after);
const keys = new Set([...Object.keys(A), ...Object.keys(B)]);
const samples = [];
let added = 0, removed = 0, changed = 0;
for (const k of keys) {
  if (!A[k]) { added++; if (samples.length < 10) samples.push('+ ' + k + ': ' + B[k]); }
  else if (!B[k]) { removed++; if (samples.length < 10) samples.push('- ' + k); }
  else if (A[k] !== B[k]) {
    changed++;
    if (samples.length < 10) samples.push('~ ' + k + '\n    was: ' + A[k] + '\n    now: ' + B[k]);
  }
}

console.error('');
console.error('DRIFT DETECTED — section-color-contracts-generated.ts is stale.');
console.error('');
console.error('  Added (new template type):     ' + added);
console.error('  Removed (template gone):       ' + removed);
console.error('  Changed (slots drifted):       ' + changed);
console.error('');
samples.forEach((s) => console.error('  ' + s));
console.error('');
console.error('Fix it locally with:');
console.error('  node scripts/generate-section-color-contracts.cjs');
console.error('then commit the regenerated file.');
process.exit(1);
