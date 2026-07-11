'use strict';

const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const ENV_FILE = /(?:^|\/)\.env(?:\.|$)/i;
const SAFE_ENV_EXAMPLE = /(?:^|\/)\.env\.(?:example|sample|template)$/i;

const patterns = [
  {
    kind: 'credential-bearing service URL',
    regex: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s/:@'"`]+:[^\s/@'"`]+@/gi,
  },
  { kind: 'Vercel token literal', regex: /\bvcp_[A-Za-z0-9]{20,}\b/g },
  { kind: 'GitHub token literal', regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { kind: 'OpenAI-style token literal', regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g },
  { kind: 'Flamingo PAT literal', regex: /\bflm_pat_[A-Za-z0-9_-]{20,}\b/g },
  { kind: 'private key literal', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

const findings = [];
for (const file of files) {
  if (ENV_FILE.test(file) && !SAFE_ENV_EXAMPLE.test(file)) {
    findings.push({ file, line: 1, kind: 'tracked environment file' });
  }

  let source;
  try {
    source = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (source.includes('\0')) continue;

  for (const { kind, regex } of patterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(source))) {
      const line = source.slice(0, match.index).split('\n').length;
      findings.push({ file, line, kind });
    }
  }
}

if (findings.length) {
  console.error(`Credential literal audit failed (${findings.length} finding${findings.length === 1 ? '' : 's'}):`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} — ${finding.kind}`);
  }
  console.error('Secret values are intentionally omitted. Rotate exposed credentials before release.');
  process.exit(1);
}

console.log(`Credential literal audit passed (${files.length} tracked files scanned).`);
