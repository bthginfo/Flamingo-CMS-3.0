import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAllSectionContracts } from '../apps/renderer/src/lib/section-contracts';
import { getSectionSchemas } from '../apps/renderer/src/lib/section-data-schemas';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '../apps/renderer/src/lib/section-editor-field-defaults';

const ROOT = process.cwd();
const INTERNAL_RENDERER_ALIASES = new Set([
  'heroCafe',
  'heroConsulting',
  'heroEcommerce',
  'heroHandwerk',
  'heroHotel',
  'heroMedical',
  'heroRealestate',
  'heroRestaurant',
  'heroSalon',
  'heroTattoo',
  'heroTourism',
  'heroWedding',
  'eventCalendar',
  'faqGallery',
  'story',
  'contactForm',
  'contactLocation',
  'textBlock',
]);

function read(relativePath: string) {
  return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort();
}

function extractQuotedTypes(source: string) {
  return unique(Array.from(source.matchAll(/\btype:\s*['"]([a-zA-Z0-9_-]+)['"]/g), match => match[1]));
}

function extractObjectBlock(source: string, marker: string) {
  const start = source.indexOf(marker);
  if (start === -1) return '';
  const open = source.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  return source.slice(open);
}

function extractObjectKeysAfter(source: string, marker: string) {
  const block = extractObjectBlock(source, marker);
  return unique(Array.from(block.matchAll(/^\s{2,}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), match => match[1]));
}

function extractTemplates(source: string) {
  const declarations = Array.from(source.matchAll(/(?:export\s+)?const\s+([A-Z_]+TEMPLATES)\s*:/g));
  const keys: string[] = [];
  for (const declaration of declarations) {
    const constName = declaration[1];
    if (constName === 'INDUSTRY_TEMPLATES' || constName === 'ALL_TEMPLATES') continue;
    keys.push(...extractObjectKeysAfter(source, `const ${constName}`));
  }
  keys.push(...Array.from(extractObjectBlock(source, 'export const INDUSTRY_TEMPLATES').matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), match => match[1]));
  return unique(keys);
}

const CONTRACT_INDUSTRIES = [
  'tradesman', 'restaurant', 'salon', 'hotel', 'tourism', 'medical',
  'wedding', 'photography', 'consulting', 'realestate', 'cafe', 'tattoo',
  'ecommerce', 'retail', 'florist', 'fitness', 'location', 'verein',
];

function main() {
  const sectionTypesSource = read('apps/renderer/src/app/admin/pages/[id]/section-types.ts');
  const templatesSource = read('apps/renderer/src/templates/index.ts');
  const dataEditorSource = read('apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx');

  const adminTypes = extractQuotedTypes(sectionTypesSource);
  const rendererTypes = extractTemplates(templatesSource);
  const dataEditorTypes = extractObjectKeysAfter(dataEditorSource, 'const EDITORS');
  const apiSchemaTypes = unique(CONTRACT_INDUSTRIES.flatMap(industry => Object.keys(getSectionSchemas(industry))));

  const contracts = getAllSectionContracts().map(contract => {
    const issues: string[] = [];
    const isInternalAlias = INTERNAL_RENDERER_ALIASES.has(contract.type);
    if (!isInternalAlias && !adminTypes.includes(contract.type)) issues.push('Contract section is not selectable in admin');
    if (!rendererTypes.includes(contract.type)) issues.push('Contract section is not registered in renderer');
    if (!isInternalAlias && !apiSchemaTypes.includes(contract.type)) issues.push('Contract section is missing from AI/API schema');
    const hasStructuredEditor = dataEditorTypes.includes(contract.type)
      || apiSchemaTypes.includes(contract.type)
      || contract.type in SECTION_EDITOR_FIELD_DEFAULTS;
    if (!isInternalAlias && !hasStructuredEditor) issues.push('Contract section has no structured or curated data editor');
    if (contract.colorFields.length === 0) issues.push('Contract has no color fields from the central color registry');

    return {
      type: contract.type,
      label: contract.label,
      maturity: contract.maturity || 'formal',
      internalAlias: isInternalAlias,
      fields: contract.fields.length,
      requiredFields: contract.fields.filter(field => field.required).map(field => field.key),
      colorFields: contract.colorFields,
      issues,
    };
  });

  const result = {
    generatedAt: new Date().toISOString(),
    totals: {
      contracts: contracts.length,
      withIssues: contracts.filter(contract => contract.issues.length > 0).length,
    },
    contracts,
  };

  console.log(JSON.stringify(result, null, 2));

  if (process.argv.includes('--fail-on-issues') && result.totals.withIssues > 0) {
    process.exit(1);
  }
}

main();
