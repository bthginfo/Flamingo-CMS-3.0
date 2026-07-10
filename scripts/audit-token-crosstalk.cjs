const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'apps/renderer/src/templates');

const TEXT_TOKEN_PART = [
  'on-dark-heading',
  'on-dark-body',
  'on-dark-muted',
  'heading',
  'body',
  'muted',
  'subheading',
  'eyebrow',
  'card-heading',
  'card-body',
  'card-muted',
  'card-badge-text',
  'btn-text',
  'btn-secondary-text',
  'badge-text',
  'link',
  'link-hover',
  'input-text',
  'label',
  'price',
  'price-strikethrough',
].join('|');

const TEXT_TOKEN_RE = `(?:${TEXT_TOKEN_PART})`;
const BACKGROUND_TOKEN_CONTEXT = '(?:background|backgroundColor|backgroundImage|fill)';
const BACKGROUND_CONST_CONTEXT = '(?:BG|Bg|BACKGROUND|Background|OVERLAY|Overlay)';
const RULES = [
  {
    id: 'background-text-token-coupling',
    re: new RegExp(`${BACKGROUND_TOKEN_CONTEXT}\\s*:\\s*['"\`][^'"\`]*token-${TEXT_TOKEN_RE}`, 'i'),
    message: 'Background/fill uses a text token; use a bg/card/badge/button/overlay token for paint surfaces.',
  },
  {
    id: 'background-constant-text-token-coupling',
    re: new RegExp(`const\\s+[A-Za-z0-9_$]*${BACKGROUND_CONST_CONTEXT}[A-Za-z0-9_$]*\\s*=\\s*['"\`][^'"\`]*token-${TEXT_TOKEN_RE}`, 'i'),
    message: 'A background-like constant uses a text token; split this into the correct visual slot.',
  },
  {
    id: 'tailwind-bg-text-token-coupling',
    re: new RegExp(`bg-\\[[^\\]]*token-${TEXT_TOKEN_RE}[^\\]]*\\]`, 'i'),
    message: 'Tailwind bg[...] uses a text token; use --token-card-bg/section-bg/badge-bg/btn-bg instead.',
  },
  {
    id: 'gradient-stop-text-token-coupling',
    re: new RegExp(`(?:from|via|to)-\\[[^\\]]*token-${TEXT_TOKEN_RE}[^\\]]*\\]`, 'i'),
    message: 'Gradient stop uses a text token; use an actual surface/accent/overlay token.',
  },
  {
    id: 'border-text-token-coupling',
    re: new RegExp(`border-\\[[^\\]]*token-${TEXT_TOKEN_RE}[^\\]]*\\]`, 'i'),
    message: 'Border uses a text token; use --token-card-border or --token-divider.',
  },
  {
    id: 'shadow-text-token-coupling',
    re: new RegExp(`shadow-\\[[^\\]]*token-${TEXT_TOKEN_RE}[^\\]]*\\]`, 'i'),
    message: 'Shadow uses a text token; use --token-shadow (or fallback to card-border).',
  },
  {
    id: 'border-color-style-text-token',
    re: new RegExp(`(?:borderColor|border)\\s*:\\s*['"\`][^'"\`]*token-${TEXT_TOKEN_RE}`, 'i'),
    message: 'Inline borderColor uses a text token; use --token-card-border or --token-divider.',
  },
  {
    id: 'shadow-style-text-token',
    re: new RegExp(`boxShadow\\s*:\\s*['"\`][^'"\`]*token-${TEXT_TOKEN_RE}`, 'i'),
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
    console.log('token-crosstalk-audit: OK (no risky text-token couplings found)');
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
