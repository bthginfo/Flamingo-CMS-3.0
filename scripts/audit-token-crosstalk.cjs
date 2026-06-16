const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');

const RISKY_TOKEN_PART = '(?:on-dark-heading|on-dark-body|on-dark-muted|heading|body|muted)';
const RULES = [
  {
    id: 'border-text-token-coupling',
    re: new RegExp(`border-\\[[^\\]]*token-${RISKY_TOKEN_PART}[^\\]]*\\]`, 'i'),
    message: 'Border uses a text token; use --token-card-border or --token-divider.',
  },
  {
    id: 'shadow-text-token-coupling',
    re: new RegExp(`shadow-\\[[^\\]]*token-${RISKY_TOKEN_PART}[^\\]]*\\]`, 'i'),
    message: 'Shadow uses a text token; use --token-shadow (or fallback to card-border).',
  },
  {
    id: 'border-color-style-text-token',
    re: new RegExp(`(?:borderColor|border)\\s*:\\s*['\"][^'\"]*token-${RISKY_TOKEN_PART}`, 'i'),
    message: 'Inline borderColor uses a text token; use --token-card-border or --token-divider.',
  },
  {
    id: 'shadow-style-text-token',
    re: new RegExp(`boxShadow\\s*:\\s*['\"][^'\"]*token-${RISKY_TOKEN_PART}`, 'i'),
    message: 'Inline boxShadow uses a text token; use --token-shadow.',
  },
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(abs);
  }
  return out;
}

function main() {
  const files = walk(TEMPLATES_DIR);
  const findings = [];

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    const lines = source.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const rule of RULES) {
        if (rule.re.test(line)) {
          findings.push({
            file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
            line: i + 1,
            rule: rule.id,
            message: rule.message,
            snippet: line.trim(),
          });
        }
      }
    }
  }

  if (findings.length === 0) {
    console.log('token-crosstalk-audit: OK (no risky border/shadow text-token couplings found)');
    return;
  }

  console.error(`token-crosstalk-audit: FAILED (${findings.length} findings)`);
  for (const finding of findings.slice(0, 120)) {
    console.error(`- ${finding.file}:${finding.line} [${finding.rule}] ${finding.message}`);
    console.error(`  ${finding.snippet}`);
  }
  if (findings.length > 120) {
    console.error(`... ${findings.length - 120} additional findings omitted`);
  }
  process.exit(1);
}

main();
