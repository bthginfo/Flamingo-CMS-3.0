import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
  SECTION_COLOR_CONTRACTS_ANY,
} from './section-color-contracts-generated';
import { FIELD_DEFS, sortColorFields, type ColorFieldKey } from './section-color-fields';

type SectionColorContractSource = 'industry' | 'generic' | 'any' | 'none';

// Industry-string aliases. MUST stay consistent with how the renderer's
// getIndustryTemplates() resolves the same string, otherwise the editor and the
// rendered page disagree about which template (and thus which colour fields)
// apply. `handwerk` maps to `tradesman` because the renderer also serves
// tradesman templates for handwerk tenants. (A former `realstate -> realestate`
// alias was removed: that spelling exists nowhere else, and the renderer would
// fall back to tradesman for it — the alias silently pointed the editor at a
// different template than the one painted.)
const INDUSTRY_CONTRACT_ALIASES: Record<string, string> = {
  handwerk: 'tradesman',
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
  // Cross-industry union. Mirrors the renderer's ALL_TEMPLATES fallback in
  // getIndustryTemplates(): when a section is borrowed into an industry that
  // does not define it, the renderer still paints a full template, so the
  // editor must expose that template's fields instead of collapsing to
  // background-only. Without this stage ~1300 (industry, type) pairs showed a
  // single "Hintergrund" picker while the FE rendered a dozen colour roles.
  const any = SECTION_COLOR_CONTRACTS_ANY[sectionType];

  let source: SectionColorContractSource;
  let fields: ColorFieldKey[] | null;
  if (Array.isArray(industrySpecific) && industrySpecific.length > 0) {
    source = 'industry';
    fields = industrySpecific;
  } else if (Array.isArray(generic) && generic.length > 0) {
    source = 'generic';
    fields = generic;
  } else if (Array.isArray(any) && any.length > 0) {
    source = 'any';
    fields = any;
  } else {
    source = 'none';
    fields = null;
  }

  if (!fields) {
    return { source: 'none', fields: ['sectionBg'] };
  }

  return {
    source,
    fields: sortColorFields(
      Array.from(new Set<ColorFieldKey>([...fields, 'sectionBg']))
        .filter((field) => Boolean(FIELD_DEFS[field])),
    ),
  };
}

export function getFieldsForSection(sectionType: string, industry?: string): ColorFieldKey[] {
  return resolveColorContractForSection(sectionType, industry).fields;
}
