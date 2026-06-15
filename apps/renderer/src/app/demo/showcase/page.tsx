import { getSectionTypesForIndustry, type SectionTypeDefinition } from '@/app/admin/pages/[id]/section-types';
import { SectionShowcaseClient, type ShowcaseSection } from './section-showcase-client';

const INDUSTRIES = [
  { key: 'tradesman', label: 'Handwerk' },
  { key: 'photography', label: 'Fotografie' },
  { key: 'consulting', label: 'Kanzlei & Beratung' },
  { key: 'wedding', label: 'Hochzeit' },
  { key: 'medical', label: 'Medizin' },
  { key: 'salon', label: 'Salon' },
  { key: 'tourism', label: 'Tourismus' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'realestate', label: 'Immobilien' },
  { key: 'cafe', label: 'Café & Bar' },
  { key: 'tattoo', label: 'Tattoo Studio' },
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'retail', label: 'Retail' },
  { key: 'florist', label: 'Floristik' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'location', label: 'Location' },
] as const;

function toShowcaseSection(section: SectionTypeDefinition, industry: string, industryLabel: string): ShowcaseSection {
  return {
    type: section.type,
    label: section.label,
    description: section.description,
    category: section.category || 'Allgemein',
    industry,
    industryLabel,
  };
}

function buildSectionCatalog(): ShowcaseSection[] {
  const byType = new Map<string, ShowcaseSection>();

  for (const industry of INDUSTRIES) {
    const sections = getSectionTypesForIndustry(industry.key, { hasShop: true });
    for (const section of sections) {
      if (!byType.has(section.type)) {
        byType.set(section.type, toShowcaseSection(section, industry.key, industry.label));
      }
    }
  }

  return Array.from(byType.values()).sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category, 'de');
    if (categoryCompare !== 0) return categoryCompare;
    return a.label.localeCompare(b.label, 'de');
  });
}

export default function DemoShowcasePage() {
  const sections = buildSectionCatalog();
  const categories = Array.from(new Set(sections.map(section => section.category))).sort((a, b) => a.localeCompare(b, 'de'));

  return <SectionShowcaseClient sections={sections} categories={categories} />;
}
