import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

type RegistryEntry = {
  type: string;
  adminSelectable: boolean;
  rendererRegistered: boolean;
  apiSchema: boolean;
  dataEditor: boolean;
  colorMapping: boolean;
  notes: string[];
};

const ROOT = process.cwd();

function read(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function extractQuotedTypes(source: string): string[] {
  const matches = source.matchAll(/\btype:\s*['"]([a-zA-Z0-9_-]+)['"]/g);
  return unique(Array.from(matches, (match) => match[1]));
}

function extractObjectKeysAfter(source: string, marker: string): string[] {
  const start = source.indexOf(marker);
  if (start === -1) return [];
  const open = source.indexOf('{', start);
  if (open === -1) return [];

  let depth = 0;
  let end = source.length;
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const slice = source.slice(open, end);
  const keys = Array.from(slice.matchAll(/^\s{2,}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), (match) => match[1]);
  return unique(keys);
}

function extractTemplates(source: string): string[] {
  const declarations = Array.from(source.matchAll(/(?:export\s+)?const\s+([A-Z_]+TEMPLATES)\s*:/g));
  const keys: string[] = [];
  for (const declaration of declarations) {
    const constName = declaration[1];
    if (constName === 'INDUSTRY_TEMPLATES' || constName === 'ALL_TEMPLATES') continue;
    keys.push(...extractObjectKeysAfter(source, `const ${constName}`));
  }
  const industryBlock = extractObjectBlock(source, 'export const INDUSTRY_TEMPLATES');
  keys.push(...Array.from(industryBlock.matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), (match) => match[1]));
  return unique(keys);
}

function extractObjectBlock(source: string, marker: string): string {
  const start = source.indexOf(marker);
  if (start === -1) return '';
  const open = source.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open, i);
    }
  }
  return source.slice(open);
}

function extractApiSchemas(source: string): string[] {
  const start = source.indexOf('const schemas: Record<string, object> = {');
  const end = source.indexOf('if (industry ===', start);
  if (start === -1) return [];
  const baseSchemas = source.slice(start, end > start ? end : undefined);
  const baseKeys = Array.from(baseSchemas.matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), (match) => match[1]);

  const assignSchemas = Array.from(source.matchAll(/Object\.assign\(schemas,\s*\{([\s\S]*?)\n\s{4}\}\);/g))
    .flatMap((match) => Array.from(match[1].matchAll(/^\s{6}([a-zA-Z][a-zA-Z0-9_]*)\s*:/gm), (keyMatch) => keyMatch[1]));

  return unique([...baseKeys, ...assignSchemas]);
}

function buildAudit(): RegistryEntry[] {
  const sectionTypesSource = read('apps/renderer/src/app/admin/pages/[id]/section-types.ts');
  const templatesSource = read('apps/renderer/src/templates/index.ts');
  const dataEditorSource = read('apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx');
  const colorEditorSource = read('apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx');
  const instructionsSource = read('apps/renderer/src/app/api/v1/instructions/route.ts');

  const adminTypes = extractQuotedTypes(sectionTypesSource);
  const rendererTypes = extractTemplates(templatesSource);
  const dataEditorTypes = extractObjectKeysAfter(dataEditorSource, 'const EDITORS');
  const colorTypes = extractObjectKeysAfter(colorEditorSource, 'const SECTION_FIELDS');
  const apiSchemaTypes = extractApiSchemas(instructionsSource);

  const allTypes = unique([...adminTypes, ...rendererTypes, ...dataEditorTypes, ...colorTypes, ...apiSchemaTypes]);

  return allTypes.map((type) => {
    const entry: RegistryEntry = {
      type,
      adminSelectable: adminTypes.includes(type),
      rendererRegistered: rendererTypes.includes(type),
      apiSchema: apiSchemaTypes.includes(type),
      dataEditor: dataEditorTypes.includes(type),
      colorMapping: colorTypes.includes(type),
      notes: [],
    };

    if (entry.adminSelectable && !entry.rendererRegistered) entry.notes.push('Selectable in admin but not registered in renderer');
    if (entry.rendererRegistered && !entry.adminSelectable) entry.notes.push('Renderer exists but section is not selectable in admin');
    if (entry.adminSelectable && !entry.apiSchema) entry.notes.push('Admin section has no API schema');
    if (entry.adminSelectable && !entry.dataEditor) entry.notes.push('Falls back to generic JSON editor');
    if (entry.adminSelectable && !entry.colorMapping) entry.notes.push('Uses generic color fields');

    return entry;
  });
}

function main() {
  const audit = buildAudit();
  const issues = audit.filter((entry) => entry.notes.length > 0);
  const premiumTypes = [
    'bentoGrid',
    'testimonialMarquee',
    'featureShowcase',
    'logoMarquee',
    'verticalTimeline',
    'beforeAfterSlider',
    'horizontalScrollShowcase',
    'socialProofBar',
    'statsCounter',
    'productShowcase',
    'categoryMosaic',
    'brandShowroom',
    'consultationBooking',
    'materialGallery',
    'deliveryTimeline',
    'inspirationGrid',
  ];

  const result = {
    generatedAt: new Date().toISOString(),
    totals: {
      allTypes: audit.length,
      withIssues: issues.length,
      adminSelectable: audit.filter((entry) => entry.adminSelectable).length,
      rendererRegistered: audit.filter((entry) => entry.rendererRegistered).length,
      apiSchema: audit.filter((entry) => entry.apiSchema).length,
      dataEditor: audit.filter((entry) => entry.dataEditor).length,
      colorMapping: audit.filter((entry) => entry.colorMapping).length,
    },
    premium: audit.filter((entry) => premiumTypes.includes(entry.type)),
    issues,
  };

  const output = JSON.stringify(result, null, 2);
  const outIndex = process.argv.indexOf('--out');
  if (outIndex >= 0) {
    const outPath = process.argv[outIndex + 1];
    if (!outPath) throw new Error('--out requires a file path');
    const resolved = resolve(outPath);
    mkdirSync(dirname(resolved), { recursive: true });
    writeFileSync(resolved, `${output}\n`, 'utf8');
    console.log(`Wrote section registry audit to ${resolved}`);
  } else {
    console.log(output);
  }

  if (process.argv.includes('--fail-on-issues') && issues.length > 0) {
    process.exit(1);
  }
}

main();
