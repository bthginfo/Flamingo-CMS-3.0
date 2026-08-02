import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['apps', 'packages'];
const IGNORE = new Set(['node_modules', '.next', 'dist', '.turbo', 'storybook-static']);

// This guard verifies environment variables consumed by the build graph. The
// per-project `scripts/` directories contain one-off operational tooling; their
// inputs are not Turbo build inputs and must not make this check fail. Keep the
// exclusion narrow so a source directory such as `src/scripts/` is still
// scanned when it is part of an application or package.
function isProjectScriptDirectory(dir: string): boolean {
  const parts = path.relative(ROOT, dir).split(path.sep);
  return parts.length === 3 && parts[2] === 'scripts' && (parts[0] === 'apps' || parts[0] === 'packages');
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!isProjectScriptDirectory(full)) out.push(...walk(full));
    }
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) out.push(full);
  }
  return out;
}

const envNames = new Set<string>();
for (const dir of SCAN_DIRS) {
  const abs = path.join(ROOT, dir);
  for (const file of walk(abs)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      envNames.add(match[1]);
    }
  }
}

const turbo = JSON.parse(readFileSync(path.join(ROOT, 'turbo.json'), 'utf8'));
const buildEnv = new Set<string>(turbo.tasks?.build?.env || []);
// Values that are read only while handling a request or executing an external
// provisioning call. They must not affect a compiled artifact and therefore
// must not be part of Turbo's build-cache key (especially secret tokens).
const intentionallyRuntimeOnly = new Set([
  'NODE_ENV',
  'VERCEL_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'NEXT_PUBLIC_ADMIN_URL',
  'NEXT_PUBLIC_RENDERER_URL',
  'ALLOW_PAID_NEON_PROVISIONING',
  'VERCEL_PROVISION_TOKEN',
]);
const missing = [...envNames].filter((name) => !buildEnv.has(name) && !intentionallyRuntimeOnly.has(name)).sort();

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  envVarsUsed: envNames.size,
  turboBuildEnv: buildEnv.size,
  missingFromTurboBuildEnv: missing,
}, null, 2));

if (missing.length > 0) process.exit(1);
