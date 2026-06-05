#!/usr/bin/env node
/* CI guard: ensures color audit numbers do not regress.
 * Fails (exit 1) if DEAD/SHADOWED/MISSING totals exceed the baseline.
 * Update baseline only after intentional improvements (phase commits).
 */
const { execSync } = require('child_process');

// Baseline after Phases A→E (final). NEVER increase without explicit approval.
const BASELINE = { dead: 56, shadowed: 20, missing: 15 };

const out = execSync('node scripts/audit-color-fields.cjs', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
const m = out.match(/=== (\d+) dead, (\d+) shadowed, (\d+) missing/);
if (!m) { console.error('audit output unparseable'); process.exit(2); }
const cur = { dead: +m[1], shadowed: +m[2], missing: +m[3] };
console.log('current :', cur);
console.log('baseline:', BASELINE);

let regressed = false;
for (const k of Object.keys(BASELINE)) {
  if (cur[k] > BASELINE[k]) {
    console.error(`REGRESSION in ${k}: ${BASELINE[k]} → ${cur[k]}`);
    regressed = true;
  }
}
if (regressed) {
  console.error('\nColor audit regressed. Either fix the regression or, if intentional, update the BASELINE in scripts/audit-colors-strict.cjs.');
  process.exit(1);
}
console.log('\nOK — no color-audit regressions.');
