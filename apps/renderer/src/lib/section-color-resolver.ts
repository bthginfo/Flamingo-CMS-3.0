import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
} from './section-color-contracts-generated';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from './section-color-fields';
import { createSectionDefinitionRegistry } from './section-definition-registry';
import { LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER, SECTION_INDUSTRY_ALIASES } from './section-industry-config';

// Use the same resolution algorithm as the renderer without importing template
// components into the editor bundle. Generated contracts are its component data.
const industryTemplates: Record<string, Record<string, ColorFieldKey[]>> = {};
for (const industry of LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER) {
  const suffix = industry.charAt(0).toUpperCase() + industry.slice(1);
  const contracts: Record<string, ColorFieldKey[]> = {};
  for (const [key, fields] of Object.entries(SECTION_COLOR_CONTRACTS_GENERATED)) {
    if (key.endsWith(suffix) && fields) contracts[key.slice(0, -suffix.length)] = fields;
  }
  industryTemplates[industry] = contracts;
}
const sharedTemplates = Object.fromEntries(
  Object.entries(SECTION_COLOR_CONTRACTS_GENERIC).filter((entry): entry is [string, ColorFieldKey[]] => Boolean(entry[1])),
);
const registry = createSectionDefinitionRegistry({
  industryTemplates,
  sharedTemplates,
  legacyFallbackIndustryOrder: LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER,
  defaultIndustry: 'tradesman',
  industryAliases: SECTION_INDUSTRY_ALIASES,
});

type SectionColorContractSource = 'definition' | 'industry' | 'generic' | 'any' | 'none';
const SOURCES = {
  explicit: 'definition',
  'legacy-industry': 'industry',
  'legacy-shared': 'generic',
  'legacy-cross-industry': 'any',
} as const;

export function resolveColorContractForSection(
  sectionType: string,
  industry?: string,
  definitionKey?: string | null,
): { fields: ColorFieldKey[]; source: SectionColorContractSource } {
  const resolved = registry.resolve({ type: sectionType, industry, definitionKey });
  if (!resolved) return { source: 'none', fields: ['sectionBg'] };
  return {
    source: SOURCES[resolved.resolution],
    fields: sortColorFields(
      Array.from(new Set<ColorFieldKey>([...resolved.component, 'sectionBg']))
        .filter((field) => Boolean(FIELD_DEFS[field])),
    ),
  };
}

export function getFieldsForSection(sectionType: string, industry?: string, definitionKey?: string | null): ColorFieldKey[] {
  return resolveColorContractForSection(sectionType, industry, definitionKey).fields;
}
