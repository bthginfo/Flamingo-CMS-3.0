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
const VOCAB_AUDIT = path.join(ROOT, 'scripts/audit-token-vocabulary.cjs');
const REGISTRY_CHECK = path.join(ROOT, 'scripts/check-section-color-field-registry.cjs');
const CROSSTALK_AUDIT = path.join(ROOT, 'scripts/audit-token-crosstalk.cjs');
const DOM_AUDIT = path.join(ROOT, 'scripts/audit-section-color-dom.ts');

// First gate: the canonical field registry must be internally consistent.
try {
  execSync('node ' + JSON.stringify(REGISTRY_CHECK), {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
} catch {
  console.error('');
  console.error('Registry check failed — see output above.');
  process.exit(1);
}

// Second gate: vocabulary. Any var(--token-X) used in a template must have
// a matching FIELD_DEFS entry, otherwise the codegen drops it silently.
try {
  execSync('node ' + JSON.stringify(VOCAB_AUDIT) + ' ' + JSON.stringify(ROOT) + ' --strict', {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
} catch {
  console.error('');
  console.error('Vocabulary check failed — see output above.');
  process.exit(1);
}

// Third gate: semantic token usage. The generator can only see that a token is
// present; this check blocks text tokens being wired into paint-surface slots
// such as backgrounds, borders, shadows, and gradient stops.
try {
  execSync('node ' + JSON.stringify(CROSSTALK_AUDIT), {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
} catch {
  console.error('');
  console.error('Token crosstalk check failed — see output above.');
  process.exit(1);
}

// Optional browser-level semantic guard. Static checks prove that token names
// exist and are not obviously wired into wrong CSS properties. This DOM audit
// proves actual field ownership by rendering section previews, mutating one
// field at a time, and reading computed styles on data-color-slot targets.
// It is opt-in because it requires Playwright and a browser runtime.
if (process.env.SECTION_COLOR_DOM_AUDIT === '1') {
  try {
    execSync('pnpm exec tsx ' + JSON.stringify(DOM_AUDIT) + ' --start-server --strict', {
      stdio: ['ignore', 'inherit', 'inherit'],
      cwd: ROOT,
    });
  } catch {
    console.error('');
    console.error('Section color DOM audit failed â€” see output above.');
    process.exit(1);
  }
}

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

const INTERNAL_PUBLIC_FIELD_RE = /['"]onDark(?:Heading|Body|Muted)['"]/;
function assertNoInternalPublicFields(source, label) {
  if (!INTERNAL_PUBLIC_FIELD_RE.test(source)) return;
  console.error('');
  console.error('INTERNAL FIELD LEAK DETECTED in ' + label + '.');
  console.error('Generated public section color contracts must not expose onDark* aliases.');
  console.error('Use headingColor/bodyColor/mutedColor as public fields; onDark* is internal compatibility only.');
  process.exit(1);
}

assertNoInternalPublicFields(before, path.relative(ROOT, GENERATED));

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
assertNoInternalPublicFields(after, 'fresh generator output');

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
