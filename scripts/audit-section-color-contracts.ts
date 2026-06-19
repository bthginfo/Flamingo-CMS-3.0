import fs from 'node:fs';
import path from 'node:path';
import {
  getAllSectionContracts,
  getSectionColorSlotForCssVar,
  getSectionColorSlotForField,
  type SectionColorSlot,
} from '../apps/renderer/src/lib/section-contracts';

const root = process.cwd();
const templatesIndexPath = path.join(root, 'apps/renderer/src/templates/index.ts');
const reportsDir = path.join(root, 'reports');
const reportPath = path.join(reportsDir, 'section-color-contract-audit.json');

type SectionColorReport = {
  type: string;
  component: string | null;
  file: string | null;
  feSlots: SectionColorSlot[];
  contractSlots: SectionColorSlot[];
  adminSlots: SectionColorSlot[];
  missingContractSlots: SectionColorSlot[];
  missingAdminSlots: SectionColorSlot[];
  unknownCssVars: string[];
};

const read = (file: string) => fs.readFileSync(file, 'utf8');
const unique = <T extends string>(values: Iterable<T>) => [...new Set([...values].filter(Boolean))].sort((a, b) => a.localeCompare(b)) as T[];

function extractBalanced(source: string, startIndex: number, open = '{', close = '}') {
  let depth = 0;
  let start = -1;
  for (let i = Math.max(0, startIndex); i < source.length; i++) {
    const ch = source[i];
    if (ch === open) {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0 && start >= 0) return source.slice(start, i + 1);
    }
  }
  return '';
}

function parseImports(indexSource: string) {
  const imports = new Map<string, string>();
  const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+'([^']+)'/g;
  for (const match of indexSource.matchAll(importRegex)) {
    for (const specifier of match[1].split(',').map((part) => part.trim()).filter(Boolean)) {
      const [imported, alias] = specifier.split(/\s+as\s+/).map((part) => part.trim());
      imports.set(alias || imported, match[2]);
    }
  }
  return imports;
}

function parseSectionComponents(indexSource: string) {
  const mappings = new Map<string, string>();
  const mappingRegex = /^\s{2,}([a-zA-Z][\w]*)\s*:\s*([A-Z][\w]*)\s*,/gm;
  for (const match of indexSource.matchAll(mappingRegex)) {
    if (!match[2].endsWith('_TEMPLATES')) mappings.set(match[1], match[2]);
  }
  return mappings;
}

function resolveTemplateFile(importPath: string | undefined, componentName?: string | null) {
  if (!importPath) return null;
  const base = path.join(root, 'apps/renderer/src/templates', importPath);
  const candidates = [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  const resolved = candidates.find((candidate) => fs.existsSync(candidate)) || null;
  if (!resolved || !componentName || !/index\.tsx?$/.test(resolved)) return resolved;

  const index = read(resolved);
  const exportRegex = /export\s+\{([\s\S]*?)\}\s+from\s+'([^']+)'/g;
  for (const match of index.matchAll(exportRegex)) {
    const exportsComponent = match[1].split(',').map((part) => part.trim()).filter(Boolean).some((specifier) => {
      const [imported, alias] = specifier.split(/\s+as\s+/).map((part) => part.trim());
      return (alias || imported) === componentName;
    });
    if (!exportsComponent) continue;
    const nestedBase = path.join(path.dirname(resolved), match[2]);
    const nestedCandidates = [`${nestedBase}.tsx`, `${nestedBase}.ts`, path.join(nestedBase, 'index.tsx'), path.join(nestedBase, 'index.ts')];
    return nestedCandidates.find((candidate) => fs.existsSync(candidate)) || resolved;
  }
  return resolved;
}

function parseCssVars(source: string) {
  return unique([...source.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)].map((match) => match[1]));
}

function parseSectionFields(colorSource: string) {
  const fields = new Map<string, string[]>();
  const start = colorSource.indexOf('const SECTION_FIELDS');
  const block = extractBalanced(colorSource, start);
  const regex = /^\s*([a-zA-Z]\w*)\s*:\s*\[([^\]]*)\]/gm;
  for (const match of block.matchAll(regex)) {
    fields.set(match[1], [...match[2].matchAll(/'([^']+)'/g)].map((item) => item[1]));
  }
  return fields;
}

function parseDefaultSectionFields(colorSource: string) {
  const start = colorSource.indexOf('const DEFAULT_SECTION_FIELDS');
  if (start < 0) return [];
  const block = extractBalanced(colorSource, colorSource.indexOf('=', start), '[', ']');
  return [...block.matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function slotsForFields(fields: string[]) {
  return unique(fields.map((field) => getSectionColorSlotForField(field)).filter(Boolean) as SectionColorSlot[]);
}

function isStyleRelevantVar(cssVar: string) {
  if (!/^--(?:style|brand|token|color)-/.test(cssVar)) return false;
  return !/(radius|shadow|weight|tracking|spacing|size|width|height|gap|padding|margin|duration|offset|scale|font|z-index)$/i.test(cssVar);
}

const indexSource = read(templatesIndexPath);
const imports = parseImports(indexSource);
const mappings = parseSectionComponents(indexSource);
const contractsByType = new Map(getAllSectionContracts().map((contract) => [contract.type, contract]));

const reports: SectionColorReport[] = unique([...mappings.keys(), ...contractsByType.keys()]).map((type) => {
  const component = mappings.get(type) || null;
  const file = resolveTemplateFile(component ? imports.get(component) : undefined, component);
  const source = file ? read(file) : '';
  const cssVars = parseCssVars(source).filter(isStyleRelevantVar);
  const feSlots = unique(cssVars.map((cssVar) => getSectionColorSlotForCssVar(cssVar)).filter(Boolean) as SectionColorSlot[]);
  const unknownCssVars = cssVars.filter((cssVar) => !getSectionColorSlotForCssVar(cssVar));
  const contractSlots = unique(contractsByType.get(type)?.colorFields || contractsByType.get(type)?.colorSlots || []);
  // Admin, live preview and AI API all resolve section fields through the same
  // generated contract resolver now. There is no separate SECTION_FIELDS table
  // in the editor anymore; adminSlots intentionally mirror the contract.
  const adminSlots = contractSlots;
  const missingContractSlots = feSlots.filter((slot) => !contractSlots.includes(slot));
  const missingAdminSlots = feSlots.filter((slot) => !adminSlots.includes(slot));

  return {
    type,
    component,
    file: file ? path.relative(root, file).replaceAll('\\', '/') : null,
    feSlots,
    contractSlots,
    adminSlots,
    missingContractSlots,
    missingAdminSlots,
    unknownCssVars,
  };
});

const failing = reports.filter((report) => report.missingContractSlots.length || report.missingAdminSlots.length || report.unknownCssVars.length);
const summary = {
  generatedAt: new Date().toISOString(),
  totals: {
    sections: reports.length,
    sectionsWithMissingContractSlots: reports.filter((report) => report.missingContractSlots.length).length,
    sectionsWithMissingAdminSlots: reports.filter((report) => report.missingAdminSlots.length).length,
    sectionsWithUnknownCssVars: reports.filter((report) => report.unknownCssVars.length).length,
  },
  failing: failing.slice(0, 80).map((report) => ({
    type: report.type,
    component: report.component,
    file: report.file,
    missingContractSlots: report.missingContractSlots,
    missingAdminSlots: report.missingAdminSlots,
    unknownCssVars: report.unknownCssVars,
  })),
};

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({ summary, sections: reports }, null, 2));
console.log(JSON.stringify(summary, null, 2));

if (failing.length > 0 && process.env.STRICT_SECTION_COLOR_AUDIT === '1') {
  process.exitCode = 1;
}
