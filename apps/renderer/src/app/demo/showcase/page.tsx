import type { Metadata } from 'next';
import { getSectionTypesForIndustry, type SectionTypeDefinition } from '@/app/admin/pages/[id]/section-types';
import { getIndustryTemplates } from '@/templates';
import {
  SectionShowcaseClient,
  type ShowcaseContext,
  type ShowcaseSection,
} from './section-showcase-client';

export const metadata: Metadata = {
  title: 'Section Showroom — Flamingo CMS',
  description: 'Kuratierte Flamingo-Sections und das vollständige Section Lab mit echten Branchen- und Gerätekontexten.',
};

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
  { key: 'verein', label: 'Verein & Sport' },
] as const;

const CURATED_DEFINITIONS = [
  ['hotel:hero', 'Positioniert eine hochwertige Marke in wenigen Sekunden.'],
  ['restaurant:reservation', 'Verkürzt den Weg von Appetit zu Reservierung.'],
  ['hotel:roomShowcase', 'Macht Unterschiede, Preise und Buchungswege sofort vergleichbar.'],
  ['tourism:placesMap', 'Verbindet Inspiration mit konkreter Orientierung.'],
  ['salon:beforeAfter', 'Beweist Qualität visuell statt sie nur zu behaupten.'],
  ['medical:appointmentCta', 'Führt Patienten sicher zum passenden Kontaktweg.'],
  ['wedding:rsvp', 'Sammelt Zusagen und Gästeinformationen ohne Reibung.'],
  ['photography:portfolioGallery', 'Lässt Arbeiten für die Positionierung sprechen.'],
  ['consulting:caseResults', 'Verdichtet komplexe Expertise zu belastbarem Proof.'],
  ['realestate:propertySearch', 'Bringt Interessenten direkt zum relevanten Bestand.'],
  ['cafe:menu', 'Übersetzt Angebot und Atmosphäre in einen klaren Besuchsimpuls.'],
  ['tattoo:artistGrid', 'Verbindet Stil, Künstler und konkrete Anfrage.'],
  ['ecommerce:shopProductGrid', 'Macht Sortiment, Filter und Kaufweg unmittelbar verständlich.'],
  ['retail:brandShowroom', 'Inszeniert Produkte wie eine redaktionelle Markenstrecke.'],
  ['florist:occasionMosaic', 'Sortiert ein emotionales Angebot nach echten Kaufanlässen.'],
  ['fitness:courseSchedule', 'Macht Zeiten, Level und Trainer schnell erfassbar.'],
  ['location:spaceShowcase', 'Übersetzt Flächen in Kapazität, Anlass und Anfrage.'],
  ['verein:nextMatchHero', 'Bündelt Spieltermin, Gegner und Ticketaktion im wichtigsten Moment.'],
  ['tradesman:priceCalculator', 'Verwandelt Preisunsicherheit in qualifizierte Leads.'],
  ['tradesman:smartInquiry', 'Verwandelt vages Interesse in einen klaren Projektbrief und eine qualifizierte Anfrage.'],
  ['tradesman:bookingWidget', 'Zeigt den vollständigen Buchungsweg in einer Section.'],
  ['tradesman:availabilityCalendar', 'Kommuniziert Verfügbarkeit noch vor der Anfrage.'],
  ['tradesman:proofWall', 'Baut Vertrauen mit Zahlen, Stimmen und Zertifikaten auf.'],
  ['tradesman:galleryPro', 'Macht Bildmaterial filterbar und fokussiert betrachtbar.'],
  ['tradesman:serviceTabs', 'Erklärt mehrere Leistungen ohne eine lange Seite zu erzeugen.'],
  ['tradesman:editorialHero', 'Erzeugt einen ruhigen, magazinartigen Einstieg.'],
  ['tradesman:beforeAfterStoryPro', 'Erzählt Transformation als nachvollziehbaren Business Case.'],
  ['tradesman:comparisonCardsPro', 'Hilft bei der Entscheidung zwischen Paketen.'],
  ['tradesman:openingStatus', 'Beantwortet die häufigste lokale Frage sofort.'],
  ['tradesman:teamSpotlight', 'Macht Kompetenz persönlich und ansprechbar.'],
] as const;

const CURATED_BY_CONTEXT = new Map<string, { rank: number; outcome: string }>(
  CURATED_DEFINITIONS.map(([key, outcome], index) => [key, { rank: index, outcome }]),
);

type MutableShowcaseSection = Omit<ShowcaseSection, 'contextLabel'> & {
  contextLabel?: string;
};

function isNativeDefinition(section: SectionTypeDefinition) {
  return !section.category?.startsWith('Andere:');
}

function defaultOutcome(category: string) {
  const outcomes: Record<string, string> = {
    Booking: 'Reduziert Schritte zwischen Interesse und bestätigter Anfrage.',
    Kontakt: 'Macht den nächsten sinnvollen Schritt eindeutig.',
    Inhalt: 'Strukturiert Informationen für schnelles Erfassen und tiefes Lesen.',
    Leistungen: 'Übersetzt ein Angebot in verständliche Entscheidungskriterien.',
    Marketing: 'Schärft Positionierung und führt zu einer klaren Aktion.',
    Medien: 'Gibt Bildern und Geschichten eine fokussierte Bühne.',
    Premium: 'Inszeniert Marke, Proof und Conversion in einer starken Komposition.',
    Shop: 'Verkürzt Produktsuche und Kaufentscheidung.',
    'Social Proof': 'Senkt wahrgenommenes Risiko mit belastbaren Vertrauenssignalen.',
    'Team & Personen': 'Macht Expertise sichtbar und persönlich.',
    'Verein & Sport': 'Verdichtet sportliche Aktualität zu einer direkten Fan-Aktion.',
  };
  return outcomes[category] || 'Löst eine konkrete Aufgabe innerhalb der Customer Journey.';
}

function addContext(section: MutableShowcaseSection, context: ShowcaseContext) {
  if (!section.contexts.some(item => item.industry === context.industry)) {
    section.contexts.push(context);
  }
}

function buildSectionCatalog(): ShowcaseSection[] {
  const rendererGroupsByType = new Map<string, Map<unknown, MutableShowcaseSection>>();

  for (const industry of INDUSTRIES) {
    const templates = getIndustryTemplates(industry.key);
    const definitions = getSectionTypesForIndustry(industry.key, { hasShop: true, hasBooking: true })
      .filter(isNativeDefinition);

    for (const definition of definitions) {
      const renderer = templates[definition.type];
      if (!renderer) continue;

      let rendererGroups = rendererGroupsByType.get(definition.type);
      if (!rendererGroups) {
        rendererGroups = new Map();
        rendererGroupsByType.set(definition.type, rendererGroups);
      }

      const contextKey = `${industry.key}:${definition.type}`;
      const curated = CURATED_BY_CONTEXT.get(contextKey);
      let grouped = rendererGroups.get(renderer);

      if (!grouped) {
        grouped = {
          id: `${definition.type}:${industry.key}`,
          type: definition.type,
          label: definition.label,
          description: definition.description,
          category: definition.category || 'Branchenspezifisch',
          contexts: [],
          defaultIndustry: industry.key,
          isCurated: Boolean(curated),
          curatedRank: curated?.rank ?? Number.MAX_SAFE_INTEGER,
          outcome: curated?.outcome || defaultOutcome(definition.category || 'Branchenspezifisch'),
        };
        rendererGroups.set(renderer, grouped);
      }

      addContext(grouped, { industry: industry.key, label: industry.label });

      if (curated && curated.rank < grouped.curatedRank) {
        grouped.isCurated = true;
        grouped.curatedRank = curated.rank;
        grouped.outcome = curated.outcome;
        grouped.defaultIndustry = industry.key;
        grouped.label = definition.label;
        grouped.description = definition.description;
        grouped.category = definition.category || 'Branchenspezifisch';
      }
    }
  }

  const catalog = Array.from(rendererGroupsByType.values()).flatMap(groups => Array.from(groups.values()));

  return catalog.map(section => ({
    ...section,
    contextLabel: section.contexts.length === INDUSTRIES.length
      ? 'Branchenneutral'
      : section.contexts.length === 1
        ? section.contexts[0].label
        : `${section.contexts.length} Branchenkontexte`,
  })).sort((a, b) => {
    if (a.curatedRank !== b.curatedRank) return a.curatedRank - b.curatedRank;
    const categoryCompare = a.category.localeCompare(b.category, 'de');
    if (categoryCompare !== 0) return categoryCompare;
    const labelCompare = a.label.localeCompare(b.label, 'de');
    if (labelCompare !== 0) return labelCompare;
    return a.contextLabel.localeCompare(b.contextLabel, 'de');
  });
}

export default function DemoShowcasePage() {
  const sections = buildSectionCatalog();
  const categories = Array.from(new Set(sections.map(section => section.category))).sort((a, b) => a.localeCompare(b, 'de'));

  return (
    <SectionShowcaseClient
      sections={sections}
      categories={categories}
      industries={INDUSTRIES.map(industry => ({ industry: industry.key, label: industry.label }))}
    />
  );
}
