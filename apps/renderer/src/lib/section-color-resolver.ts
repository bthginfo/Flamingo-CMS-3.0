import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
} from './section-color-contracts-generated';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from './section-color-fields';

type SectionColorContractSource = 'industry' | 'generic' | 'none';

const INDUSTRY_CONTRACT_ALIASES: Record<string, string> = {
  handwerk: 'tradesman',
  realstate: 'realestate',
};

function normalizeIndustryForContract(industry?: string) {
  if (!industry) return undefined;
  const normalized = industry.trim().toLowerCase();
  return INDUSTRY_CONTRACT_ALIASES[normalized] ?? normalized;
}

function industryContractKey(sectionType: string, industry?: string) {
  const normalizedIndustry = normalizeIndustryForContract(industry);
  if (!normalizedIndustry) return null;
  return `${sectionType}${normalizedIndustry.charAt(0).toUpperCase()}${normalizedIndustry.slice(1)}`;
}

export function resolveColorContractForSection(
  sectionType: string,
  industry?: string,
): { fields: ColorFieldKey[]; source: SectionColorContractSource } {
  const industryKey = industryContractKey(sectionType, industry);
  const industrySpecific = industryKey ? SECTION_COLOR_CONTRACTS_GENERATED[industryKey] : undefined;
  const generic = SECTION_COLOR_CONTRACTS_GENERIC[sectionType];
  const fields = Array.isArray(industrySpecific) && industrySpecific.length > 0
    ? industrySpecific
    : Array.isArray(generic) && generic.length > 0
      ? generic
      : null;

  if (!fields) {
    return { source: 'none', fields: ['sectionBg'] };
  }

  return {
    source: Array.isArray(industrySpecific) && industrySpecific.length > 0 ? 'industry' : 'generic',
    fields: sortColorFields(
      Array.from(new Set<ColorFieldKey>([...fields, 'sectionBg']))
        .filter((field) => Boolean(FIELD_DEFS[field])),
    ),
  };
}

export function getFieldsForSection(sectionType: string, industry?: string): ColorFieldKey[] {
  return resolveColorContractForSection(sectionType, industry).fields;
}
