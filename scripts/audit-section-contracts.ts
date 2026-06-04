import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAllSectionContracts } from '../apps/renderer/src/lib/section-contracts';

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

function extractApiSchemas(source: string) {
  const start = source.indexOf('const schemas: Record<string, object> = {');
  const end = source.indexOf('if (industry ===', start);
  if (start === -1) return [];
  const baseSchemas = source.slice(start, end > start ? end : undefined);
  const baseKeys = Array.from(baseSchemas.matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), match => match[1]);
  const assignedKeys = Array.from(source.matchAll(/Object\.assign\(schemas,\s*\{([\s\S]*?)\n\s{4}\}\);/g))
    .flatMap(match => Array.from(match[1].matchAll(/^\s{6}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), keyMatch => keyMatch[1]));
  return unique([...baseKeys, ...assignedKeys]);
}

function main() {
  const sectionTypesSource = read('apps/renderer/src/app/admin/pages/[id]/section-types.ts');
  const templatesSource = read('apps/renderer/src/templates/index.ts');
  const dataEditorSource = read('apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx');
  const colorEditorSource = read('apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
  const instructionsSource = read('apps/renderer/src/app/api/v1/instructions/route.ts');

  const adminTypes = extractQuotedTypes(sectionTypesSource);
  const rendererTypes = extractTemplates(templatesSource);
  const dataEditorTypes = extractObjectKeysAfter(dataEditorSource, 'const EDITORS');
  const colorTypes = extractObjectKeysAfter(colorEditorSource, 'const SECTION_FIELDS');
  const hasDefaultColorEditorFields = colorEditorSource.includes('const DEFAULT_SECTION_FIELDS');
  const apiSchemaTypes = extractApiSchemas(instructionsSource);

  const contracts = getAllSectionContracts().map(contract => {
    const issues: string[] = [];
    const isInternalAlias = INTERNAL_RENDERER_ALIASES.has(contract.type);
    if (!isInternalAlias && !adminTypes.includes(contract.type)) issues.push('Contract section is not selectable in admin');
    if (!rendererTypes.includes(contract.type)) issues.push('Contract section is not registered in renderer');
    if (!isInternalAlias && !apiSchemaTypes.includes(contract.type)) issues.push('Contract section is missing from AI/API schema');
    if (!isInternalAlias && !dataEditorTypes.includes(contract.type)) issues.push('Contract section has no curated data editor');
    if (contract.colorSlots.length > 0 && !colorTypes.includes(contract.type) && !hasDefaultColorEditorFields) issues.push('Contract defines color slots but no section color mapping exists');

    return {
      type: contract.type,
      label: contract.label,
      maturity: contract.maturity || 'formal',
      internalAlias: isInternalAlias,
      fields: contract.fields.length,
      requiredFields: contract.fields.filter(field => field.required).map(field => field.key),
      colorSlots: contract.colorSlots,
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
