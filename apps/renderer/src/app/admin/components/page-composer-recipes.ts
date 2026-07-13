import type { SectionTypeDefinition } from '../pages/[id]/section-types';

export type ComposerGoalId =
  | 'enquiries'
  | 'trust'
  | 'sell'
  | 'portfolio'
  | 'bookings'
  | 'community';

export type ExperienceFamilyId =
  | 'expertise'
  | 'local'
  | 'transformation'
  | 'hospitality'
  | 'planning'
  | 'products';

export type ArtDirectionId =
  | 'editorial'
  | 'cinematic'
  | 'studio'
  | 'precision'
  | 'organic';

export type ComposerStageId = 'opening' | 'offer' | 'proof' | 'story' | 'conversion';

export type ComposerGoal = {
  id: ComposerGoalId;
  label: string;
  description: string;
};

export type ExperienceFamily = {
  id: ExperienceFamilyId;
  label: string;
  description: string;
};

export type ArtDirection = {
  id: ArtDirectionId;
  label: string;
  description: string;
  /** Three small swatches used to communicate the direction without a full preview. */
  swatches: readonly [string, string, string];
};

export type ComposerPlanCandidate = {
  type: string;
  label: string;
  locked: boolean;
  lockReason?: string;
};

export type ComposerPlanStep = {
  stage: ComposerStageId;
  stageLabel: string;
  stageNumber: number;
  type: string;
  label: string;
  description: string;
  rationale: string;
  status: 'existing' | 'available' | 'blocked' | 'blockedExisting';
  lockReason?: string;
  candidates: ComposerPlanCandidate[];
};

/** Existing semantic openers are singletons until the editor supports replace. */
export function canOverrideComposerStepCandidate(
  step: Pick<ComposerPlanStep, 'stage' | 'status'>,
): boolean {
  return step.stage !== 'opening'
    || (step.status !== 'existing' && step.status !== 'blockedExisting');
}

export const COMPOSER_GOALS: readonly ComposerGoal[] = [
  { id: 'enquiries', label: 'Anfragen gewinnen', description: 'Besucher gezielt in qualifizierte Kontakte führen.' },
  { id: 'trust', label: 'Vertrauen aufbauen', description: 'Kompetenz, Belege und echte Nähe sichtbar machen.' },
  { id: 'sell', label: 'Leistungen verkaufen', description: 'Angebote verständlich vergleichen und entscheiden lassen.' },
  { id: 'portfolio', label: 'Arbeiten zeigen', description: 'Ergebnisse, Stil und Qualität überzeugend inszenieren.' },
  { id: 'bookings', label: 'Termine & Buchungen', description: 'Vom Interesse ohne Umweg zum passenden Termin führen.' },
  { id: 'community', label: 'Community & Events', description: 'Aktuelles, Termine und Beteiligung in den Mittelpunkt stellen.' },
] as const;

export const EXPERIENCE_FAMILIES: readonly ExperienceFamily[] = [
  { id: 'expertise', label: 'Expertise & Vertrauen', description: 'Für Beratung, Medizin und Angebote, bei denen Autorität die Entscheidung trägt.' },
  { id: 'local', label: 'Handwerk & lokale Nähe', description: 'Praktische Leistungen, echte Referenzen und schnelle Erreichbarkeit für die Region.' },
  { id: 'transformation', label: 'Transformation & Portfolio', description: 'Visuelle Ergebnisse, Vorher/Nachher-Geschichten und persönliche Handschrift.' },
  { id: 'hospitality', label: 'Gastlichkeit & Anlass', description: 'Atmosphäre, Vorfreude und ein klarer Weg von der Entdeckung zur Anfrage.' },
  { id: 'planning', label: 'Planung & Buchung', description: 'Verfügbarkeit, Ressourcen und nächste Schritte ohne unnötige Reibung.' },
  { id: 'products', label: 'Produkte & Entdeckung', description: 'Sortiment, Vergleich und Inspiration für eine sichere Kaufentscheidung.' },
] as const;

export const ART_DIRECTIONS: readonly ArtDirection[] = [
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Große Typografie, klare Bildmomente und ein ruhiger Lesefluss.',
    swatches: ['#18181b', '#faf7f2', '#b45309'],
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Immersive Medien, starke Kontraste und inszenierte Übergänge.',
    swatches: ['#09090b', '#27272a', '#f59e0b'],
  },
  {
    id: 'studio',
    label: 'Studio',
    description: 'Prägnante Module, visuelle Vielfalt und ein digitaler Premium-Look.',
    swatches: ['#172554', '#eff6ff', '#2563eb'],
  },
  {
    id: 'precision',
    label: 'Precision',
    description: 'Struktur, Vergleichbarkeit und eine besonders klare Entscheidungskette.',
    swatches: ['#0f172a', '#f8fafc', '#0f766e'],
  },
  {
    id: 'organic',
    label: 'Organic',
    description: 'Warme Nähe, natürliche Bildwechsel und bewusst gesetzte Ruhepunkte.',
    swatches: ['#283618', '#fefae0', '#bc6c25'],
  },
] as const;

export const COMPOSER_STAGES: readonly { id: ComposerStageId; label: string }[] = [
  { id: 'opening', label: 'Einstieg' },
  { id: 'offer', label: 'Angebot' },
  { id: 'proof', label: 'Belege' },
  { id: 'story', label: 'Story & Prozess' },
  { id: 'conversion', label: 'Abschluss' },
] as const;

const SHARED_OPENERS = ['hero', 'editorialHero', 'cinematicHero', 'glowHero'] as const;

const BASE_CANDIDATES: Record<ComposerStageId, readonly string[]> = {
  opening: SHARED_OPENERS,
  offer: ['serviceTabs', 'servicesGrid', 'featureShowcase', 'comparisonCardsPro', 'productShowcase', 'servicePackages'],
  proof: ['proofWall', 'testimonials', 'testimonialMarquee', 'socialProofBar', 'statsCounter', 'stats'],
  story: ['beforeAfterStoryPro', 'processSteps', 'timeline', 'scrollStory', 'zigzagShowcase', 'galleryPro'],
  conversion: ['smartInquiry', 'faqContactSplit', 'consultationBooking', 'ctaSplit', 'contact', 'ctaBand'],
};

/**
 * Art directions describe page rhythm, not a tenant or industry. Their order is
 * intentionally explicit so a recipe stays reproducible even if the section
 * catalog itself is returned in a different order.
 */
const ART_DIRECTION_CANDIDATES: Record<ArtDirectionId, Record<ComposerStageId, readonly string[]>> = {
  editorial: {
    opening: ['editorialHero', 'hero', 'cinematicHero', 'glowHero'],
    offer: ['serviceTabs', 'zigzagShowcase', 'featureShowcase', 'servicesGrid'],
    proof: ['proofWall', 'testimonials', 'logoCloud', 'socialProofBar'],
    story: ['editorialFeatureRail', 'zigzagShowcase', 'timeline', 'galleryPro'],
    conversion: ['faqContactSplit', 'ctaSplit', 'smartInquiry', 'contact'],
  },
  cinematic: {
    opening: ['cinematicHero', 'glowHero', 'editorialHero', 'hero'],
    offer: ['featureShowcase', 'serviceTabs', 'brandShowroom', 'productShowcase'],
    proof: ['testimonialMarquee', 'proofWall', 'statsCounter', 'testimonials'],
    story: ['scrollStory', 'beforeAfterStoryPro', 'galleryPro', 'editorialFeatureRail'],
    conversion: ['immersiveCtaBanner', 'ctaSplit', 'smartInquiry', 'faqContactSplit'],
  },
  studio: {
    opening: ['glowHero', 'editorialHero', 'hero', 'cinematicHero'],
    offer: ['signatureGrid', 'serviceTabs', 'bentoGrid', 'featureShowcase'],
    proof: ['socialProofBar', 'proofWall', 'logoMarquee', 'testimonials'],
    story: ['galleryPro', 'zigzagShowcase', 'teamSpotlight', 'editorialFeatureRail'],
    conversion: ['smartInquiry', 'ctaSplit', 'faqContactSplit', 'contact'],
  },
  precision: {
    opening: ['hero', 'editorialHero', 'glowHero', 'cinematicHero'],
    offer: ['comparisonCardsPro', 'servicePackages', 'serviceTabs', 'servicesGrid'],
    proof: ['caseResults', 'statsCounter', 'proofWall', 'socialProofBar'],
    story: ['processSteps', 'verticalTimeline', 'timeline', 'zigzagShowcase'],
    conversion: ['consultationBooking', 'faqContactSplit', 'smartInquiry', 'contact'],
  },
  organic: {
    opening: ['editorialHero', 'hero', 'cinematicHero', 'glowHero'],
    offer: ['principlesGrid', 'servicesGrid', 'serviceTabs', 'zigzagShowcase'],
    proof: ['socialProofBar', 'testimonials', 'proofWall', 'logoCloud'],
    story: ['zigzagShowcase', 'timeline', 'galleryPro', 'teamSpotlight'],
    conversion: ['contact', 'ctaSplit', 'faqContactSplit', 'smartInquiry'],
  },
};

const FAMILY_CANDIDATES: Record<ExperienceFamilyId, Partial<Record<ComposerStageId, readonly string[]>>> = {
  expertise: {
    opening: ['hero', 'editorialHero', 'cinematicHero', 'glowHero'],
    offer: ['serviceTabs', 'principlesGrid', 'servicesGrid', 'serviceOverview'],
    proof: ['proofWall', 'caseResults', 'testimonials', 'statsCounter'],
    story: ['principlesGrid', 'timeline', 'teamSpotlight', 'zigzagShowcase'],
  },
  local: {
    opening: ['hero', 'editorialHero', 'cinematicHero', 'glowHero'],
    offer: ['servicesGrid', 'serviceTabs', 'beforeAfterStoryPro', 'serviceDetail'],
    proof: ['proofWall', 'portfolio', 'testimonials', 'socialProofBar'],
    story: ['beforeAfterStoryPro', 'processSteps', 'timeline', 'portfolio'],
  },
  transformation: {
    opening: ['hero', 'cinematicHero', 'editorialHero', 'glowHero'],
    offer: ['signatureGrid', 'serviceTabs', 'beforeAfterStoryPro', 'galleryPro'],
    proof: ['proofWall', 'testimonials', 'socialProofBar', 'statsCounter'],
    story: ['transformationStories', 'beforeAfterStoryPro', 'galleryPro', 'scrollStory'],
  },
  hospitality: {
    opening: ['hero', 'cinematicHero', 'editorialHero', 'glowHero'],
    offer: ['featureShowcase', 'serviceTabs', 'spaceShowcase', 'productShowcase'],
    proof: ['proofWall', 'testimonialMarquee', 'testimonials', 'socialProofBar'],
    story: ['scrollStory', 'galleryPro', 'timeline', 'featureShowcase'],
  },
  planning: {
    opening: ['hero', 'editorialHero', 'cinematicHero', 'glowHero'],
    offer: ['consultationBooking', 'resourceBookingShowcase', 'serviceTabs', 'availabilityCalendar'],
    proof: ['proofWall', 'testimonials', 'statsCounter', 'socialProofBar'],
    story: ['processSteps', 'timeline', 'resourceBookingShowcase', 'verticalTimeline'],
  },
  products: {
    opening: ['hero', 'editorialHero', 'cinematicHero', 'glowHero'],
    offer: ['shopFeaturedProducts', 'productShowcase', 'categoryMosaic', 'comparisonCardsPro'],
    proof: ['testimonialMarquee', 'proofWall', 'testimonials', 'logoCloud'],
    story: ['categoryMosaic', 'editorialFeatureRail', 'scrollStory', 'productShowcase'],
  },
};

const GOAL_CANDIDATES: Record<ComposerGoalId, Partial<Record<ComposerStageId, readonly string[]>>> = {
  enquiries: {
    offer: ['serviceTabs', 'servicesGrid', 'featureShowcase'],
    conversion: ['smartInquiry', 'faqContactSplit', 'contact', 'ctaSplit'],
  },
  trust: {
    proof: ['proofWall', 'testimonials', 'testimonialMarquee', 'socialProofBar', 'statsCounter'],
    conversion: ['faqContactSplit', 'smartInquiry', 'contact', 'ctaSplit'],
  },
  sell: {
    offer: ['serviceTabs', 'comparisonCardsPro', 'servicePackages', 'productShowcase', 'shopFeaturedProducts'],
    conversion: ['ctaSplit', 'smartInquiry', 'offerCampaignStrip', 'contact'],
  },
  portfolio: {
    offer: ['galleryPro', 'portfolio', 'beforeAfterStoryPro', 'featureShowcase'],
    story: ['beforeAfterStoryPro', 'scrollStory', 'zigzagShowcase', 'galleryPro'],
    conversion: ['smartInquiry', 'ctaSplit', 'faqContactSplit', 'contact'],
  },
  bookings: {
    offer: ['resourceBookingShowcase', 'consultationBooking', 'serviceTabs', 'availabilityCalendar'],
    conversion: ['bookingSlotPicker', 'bookingWidget', 'bookingDateRange', 'consultationBooking', 'bookingCtaPro', 'smartInquiry'],
  },
  community: {
    offer: ['eventSchedule', 'matchSchedule', 'newsPreview', 'newsGrid', 'timeline'],
    story: ['newsGrid', 'timeline', 'teamSpotlight', 'editorialFeatureRail'],
    conversion: ['rsvp', 'bookingCtaPro', 'contact', 'ctaBand', 'smartInquiry'],
  },
};

const STAGE_RATIONALES: Record<ComposerGoalId, Record<ComposerStageId, string>> = {
  enquiries: {
    opening: 'Macht Nutzen und nächsten Schritt in wenigen Sekunden verständlich.',
    offer: 'Ordnet die wichtigsten Leistungen nach dem Problem Ihrer Kundschaft.',
    proof: 'Nimmt Zweifel mit konkreten Ergebnissen und glaubwürdigen Stimmen.',
    story: 'Zeigt, wie aus einer ersten Anfrage ein verlässliches Ergebnis wird.',
    conversion: 'Fragt nur Informationen ab, die für eine gute Antwort nötig sind.',
  },
  trust: {
    opening: 'Positioniert Haltung und Expertise klar, ohne laut zu wirken.',
    offer: 'Übersetzt Fachwissen in verständliche Leistungen und Entscheidungen.',
    proof: 'Belegt Kompetenz mit Stimmen, Zahlen oder dokumentierten Ergebnissen.',
    story: 'Macht Arbeitsweise, Erfahrung und Verantwortlichkeit nachvollziehbar.',
    conversion: 'Bietet einen risikoarmen nächsten Schritt für offene Fragen.',
  },
  sell: {
    opening: 'Bringt den zentralen Wert des Angebots sofort auf den Punkt.',
    offer: 'Macht Umfang, Unterschiede und passende Optionen schnell vergleichbar.',
    proof: 'Bestätigt die Kaufentscheidung mit Ergebnissen und Erfahrungen.',
    story: 'Erklärt den Weg vom Bedarf bis zum gelieferten Ergebnis.',
    conversion: 'Führt mit einem eindeutigen Angebot in Anfrage oder Kauf.',
  },
  portfolio: {
    opening: 'Setzt Stil und Qualitätsanspruch als visuelles Versprechen.',
    offer: 'Zeigt repräsentative Arbeiten statt austauschbarer Leistungslisten.',
    proof: 'Ergänzt Bilder um Resultate, Kontext und Stimmen echter Kundschaft.',
    story: 'Erzählt ausgewählte Projekte als nachvollziehbare Transformation.',
    conversion: 'Überträgt die Inspiration in eine konkrete Projektanfrage.',
  },
  bookings: {
    opening: 'Verbindet das gewünschte Ergebnis direkt mit dem Buchungsversprechen.',
    offer: 'Erklärt Leistungen, Ressourcen und Verfügbarkeit vor der Auswahl.',
    proof: 'Gibt Sicherheit, bevor persönliche Daten oder Termine gewählt werden.',
    story: 'Zeigt transparent, was vor und nach der Buchung passiert.',
    conversion: 'Führt ohne Umweg zu einem passenden freien Termin.',
  },
  community: {
    opening: 'Zeigt sofort, wofür die Gemeinschaft steht und was gerade wichtig ist.',
    offer: 'Bündelt Termine, Neuigkeiten und Möglichkeiten zum Mitmachen.',
    proof: 'Macht Aktivität, Reichweite und echte Beteiligung sichtbar.',
    story: 'Erzählt Entwicklung, Menschen und gemeinsame Meilensteine.',
    conversion: 'Führt klar zu Anmeldung, Teilnahme oder Kontakt.',
  },
};

const INDUSTRY_FAMILY: Record<string, ExperienceFamilyId> = {
  tradesman: 'local',
  handwerk: 'local',
  medical: 'expertise',
  consulting: 'expertise',
  realestate: 'expertise',
  salon: 'transformation',
  tattoo: 'transformation',
  fitness: 'transformation',
  photography: 'transformation',
  florist: 'transformation',
  hotel: 'hospitality',
  restaurant: 'hospitality',
  cafe: 'hospitality',
  tourism: 'hospitality',
  wedding: 'hospitality',
  location: 'planning',
  ecommerce: 'products',
  retail: 'products',
  verein: 'expertise',
  bar: 'hospitality',
};

/**
 * Equivalents are used only to recognize progress already present on a page.
 * They never make a foreign owner-specific implementation addable. This keeps
 * owner heroes and transformation stories from being suggested twice under a
 * different technical type name.
 */
const SEMANTIC_EXISTING_INTENTS: readonly { stage: ComposerStageId; types: readonly string[] }[] = [
  {
    stage: 'opening',
    types: [
      'hero', 'cinematicHero', 'editorialHero', 'glowHero', 'collectionHero',
      'fitnessHero', 'floristHero', 'locationHero', 'artistHero', 'nextMatchHero',
      'heroConsulting',
    ],
  },
  {
    stage: 'story',
    types: ['transformationStories', 'beforeAfterStoryPro', 'beforeAfter', 'beforeAfterSlider'],
  },
] as const;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function candidatePriority(
  goal: ComposerGoalId,
  family: ExperienceFamilyId,
  artDirection: ArtDirectionId,
  stage: ComposerStageId,
): string[] {
  const goalCandidates = GOAL_CANDIDATES[goal][stage] || [];
  const familyCandidates = FAMILY_CANDIDATES[family][stage] || [];
  const artDirectionCandidates = ART_DIRECTION_CANDIDATES[artDirection][stage];

  if (stage === 'opening') {
    return unique([...artDirectionCandidates, ...SHARED_OPENERS, ...familyCandidates]);
  }

  // Conversion and capability-led offer stages must retain their functional
  // objective. The remaining stages lead with visual direction so changing the
  // art direction produces a meaningfully different, but still useful, page.
  const functionFirst = stage === 'conversion'
    || (stage === 'offer' && ['sell', 'bookings', 'community'].includes(goal))
    || (stage === 'offer' && family === 'products');

  return functionFirst
    ? unique([...goalCandidates, ...familyCandidates, ...artDirectionCandidates, ...BASE_CANDIDATES[stage]])
    : unique([...artDirectionCandidates, ...goalCandidates, ...familyCandidates, ...BASE_CANDIDATES[stage]]);
}

export function inferExperienceFamily(industry?: string | null): ExperienceFamilyId {
  return INDUSTRY_FAMILY[(industry || '').trim().toLowerCase()] || 'expertise';
}

export function getExperienceFamily(id: ExperienceFamilyId): ExperienceFamily {
  return EXPERIENCE_FAMILIES.find((family) => family.id === id) || EXPERIENCE_FAMILIES[0];
}

export function inferArtDirection(family: ExperienceFamilyId): ArtDirectionId {
  const defaults: Record<ExperienceFamilyId, ArtDirectionId> = {
    expertise: 'precision',
    local: 'studio',
    transformation: 'cinematic',
    hospitality: 'organic',
    planning: 'precision',
    products: 'studio',
  };
  return defaults[family];
}

export function getArtDirection(id: ArtDirectionId): ArtDirection {
  return ART_DIRECTIONS.find((direction) => direction.id === id) || ART_DIRECTIONS[0];
}

export function buildComposerPlan({
  goal,
  family,
  artDirection = inferArtDirection(family),
  sectionTypes,
  existingSectionTypes = [],
  candidateOverrides = {},
}: {
  goal: ComposerGoalId;
  family: ExperienceFamilyId;
  artDirection?: ArtDirectionId;
  sectionTypes: readonly SectionTypeDefinition[];
  existingSectionTypes?: readonly string[];
  candidateOverrides?: Partial<Record<ComposerStageId, string>>;
}): ComposerPlanStep[] {
  const definitions = new Map<string, SectionTypeDefinition>();
  for (const definition of sectionTypes) {
    if (!definitions.has(definition.type)) definitions.set(definition.type, definition);
  }

  const existing = new Set(existingSectionTypes);
  const used = new Set<string>();
  const plan: ComposerPlanStep[] = [];
  const candidatePools = new Map<ComposerStageId, SectionTypeDefinition[]>();

  for (const [stageIndex, stage] of COMPOSER_STAGES.entries()) {
    const preferred = candidatePriority(goal, family, artDirection, stage.id)
      .map((type) => definitions.get(type))
      .filter((definition): definition is SectionTypeDefinition => Boolean(definition));
    const candidates = [...preferred];
    const semanticIntent = SEMANTIC_EXISTING_INTENTS.find((intent) => intent.stage === stage.id);
    const semanticExisting = semanticIntent?.types
      .map((type) => definitions.get(type))
      .find((definition): definition is SectionTypeDefinition => Boolean(definition && existing.has(definition.type) && !used.has(definition.type)));
    if (semanticExisting && !candidates.some((candidate) => candidate.type === semanticExisting.type)) {
      candidates.unshift(semanticExisting);
    }
    candidatePools.set(stage.id, candidates);

    const unused = candidates.filter((candidate) => !used.has(candidate.type));
    const override = candidateOverrides[stage.id];
    const overridden = override ? unused.find((candidate) => candidate.type === override) : undefined;
    const alreadyPresent = unused.find((candidate) => existing.has(candidate.type));
    const surfacePrimaryCapability = (
      (goal === 'bookings' && stage.id === 'conversion')
      || (family === 'products' && stage.id === 'offer')
    );
    const protectedExistingOpener = stage.id === 'opening' ? semanticExisting : undefined;
    const selected = protectedExistingOpener
      || overridden
      || alreadyPresent
      || (surfacePrimaryCapability ? unused[0] : unused.find((candidate) => !candidate.locked))
      || unused[0];

    if (!selected) continue;
    used.add(selected.type);
    const isExisting = existing.has(selected.type);
    const status: ComposerPlanStep['status'] = selected.locked
      ? (isExisting ? 'blockedExisting' : 'blocked')
      : isExisting
        ? 'existing'
        : 'available';

    plan.push({
      stage: stage.id,
      stageLabel: stage.label,
      stageNumber: stageIndex + 1,
      type: selected.type,
      label: selected.label,
      description: selected.description,
      rationale: STAGE_RATIONALES[goal][stage.id],
      status,
      lockReason: selected.lockReason,
      candidates: [],
    });
  }

  return plan.map((step) => {
    const selectedByOtherSteps = new Set(plan.filter((item) => item.stage !== step.stage).map((item) => item.type));
    const visibleCandidates = [
      definitions.get(step.type)!,
      ...(candidatePools.get(step.stage) || []),
    ]
      .filter(Boolean)
      .filter((candidate, index, all) => all.findIndex((item) => item.type === candidate.type) === index)
      .filter((candidate) => candidate.type === step.type || !selectedByOtherSteps.has(candidate.type))
      .slice(0, 6);

    return {
      ...step,
      candidates: visibleCandidates.map((candidate) => ({
        type: candidate.type,
        label: candidate.label,
        locked: Boolean(candidate.locked),
        lockReason: candidate.lockReason,
      })),
    };
  });
}
