export type PagePolicyRule = {
  slug: string;
  acceptedSlugs: string[];
  label: string;
  reason: string;
};

export type SitePagePolicy = {
  required: PagePolicyRule[];
  recommended: PagePolicyRule[];
};

export type SitePagePolicyContext = {
  industry?: string | null;
  capabilities?: string[];
};

const rule = (slug: string, label: string, reason: string, alternatives: string[] = []): PagePolicyRule => ({
  slug,
  acceptedSlugs: [slug, ...alternatives],
  label,
  reason,
});

/** Universal minimum. Vertical sales/content pages never belong here. */
export const CORE_REQUIRED_PAGE_RULES: PagePolicyRule[] = [
  rule('startseite', 'Startseite', 'Primary public entry point.', ['', 'home']),
  rule('kontakt', 'Kontakt', 'A clear contact path is required for every tenant.'),
  rule('impressum', 'Impressum', 'Legal provider information.'),
  rule('datenschutz', 'Datenschutz', 'Privacy information for visitors and forms.'),
];

type VerticalPolicy = { required?: PagePolicyRule[]; recommended?: PagePolicyRule[] };

/**
 * Content/sitemap policy only. It has no renderer or section-registry imports.
 * Alternatives let legitimate vertical vocabularies pass without forcing one
 * agency-wide slug convention.
 */
const VERTICAL_PAGE_POLICIES: Record<string, VerticalPolicy> = {
  tradesman: {
    recommended: [
      rule('leistungen', 'Leistungen', 'Primary overview of the trade services.', ['services']),
      rule('ueber-uns', 'Über uns', 'Trust, team and operating model.', ['betrieb', 'unternehmen']),
    ],
  },
  verein: {
    recommended: [
      rule('spielplan', 'Spielplan', 'Fans need a direct route to fixtures and results.', ['spiele', 'termine']),
      rule('verein', 'Verein', 'Club identity, membership and history need a stable home.', ['club', 'ueber-uns']),
    ],
  },
  ecommerce: {
    recommended: [
      rule('shop', 'Shop', 'Primary product discovery route.', ['produkte', 'sortiment']),
      rule('warenkorb', 'Warenkorb', 'Visible continuation of the shopping flow.', ['cart']),
    ],
  },
  restaurant: {
    recommended: [
      rule('speisekarte', 'Speisekarte', 'Guests need the current food and drink offer.', ['karte', 'menu']),
      rule('reservierung', 'Reservierung', 'Primary reservation route.', ['reservieren', 'kontakt']),
    ],
  },
  hotel: {
    recommended: [
      rule('zimmer', 'Zimmer', 'Accommodation options need a dedicated overview.', ['suiten', 'unterkuenfte']),
    ],
  },
  salon: {
    recommended: [rule('leistungen', 'Leistungen & Preise', 'Treatments and prices need a clear overview.', ['services', 'preise'])],
  },
  tourism: {
    recommended: [
      rule('erlebnisse', 'Erlebnisse', 'Primary discovery route for the destination.', ['leistungen', 'entdecken']),
      rule('routen', 'Routen', 'Practical route planning and orientation.', ['touren']),
    ],
  },
  consulting: {
    recommended: [rule('leistungen', 'Leistungen', 'Consulting offers and outcomes need a clear overview.', ['beratung', 'rechtsgebiete'])],
  },
  medical: {
    recommended: [
      rule('leistungen', 'Leistungen', 'Patients need a clear treatment/service overview.', ['behandlungen']),
      rule('termine', 'Termine', 'Patients need a clear appointment path.', ['termin', 'kontakt']),
    ],
  },
  wedding: {
    recommended: [
      rule('rsvp', 'RSVP', 'Guests need an explicit response route.', ['zusage']),
      rule('ablauf', 'Ablauf', 'Guests need the event schedule.', ['tagesablauf', 'programm']),
    ],
  },
  realestate: {
    recommended: [
      rule('immobilien', 'Immobilien', 'Primary property discovery route.', ['kaufen', 'objekte']),
      rule('bewertung', 'Bewertung', 'Primary seller conversion route.', ['immobilienbewertung']),
    ],
  },
  photography: {
    recommended: [
      rule('portfolio', 'Portfolio', 'Visual proof is the primary evaluation route.'),
      rule('leistungen', 'Leistungen', 'Packages and process need a clear overview.', ['pakete']),
    ],
  },
  cafe: {
    recommended: [rule('karte', 'Karte', 'Guests need the current food and drink offer.', ['menu', 'speisekarte'])],
  },
  tattoo: {
    recommended: [
      rule('kuenstler', 'Künstler', 'Artist selection is central to the booking decision.', ['artists']),
      rule('galerie', 'Galerie', 'Style and workmanship need visual proof.', ['portfolio']),
    ],
  },
  florist: {
    recommended: [rule('straeusse', 'Sträuße', 'Primary product and inspiration route.', ['sortiment', 'blumen'])],
  },
  fitness: {
    recommended: [
      rule('programme', 'Programme', 'Training offers need a clear overview.', ['kurse', 'training']),
      rule('kursplan', 'Kursplan', 'Members need current course times.', ['zeiten']),
    ],
  },
  location: {
    recommended: [rule('raeume', 'Räume', 'Capacity, setup and room choice drive enquiries.', ['flaechen', 'spaces'])],
  },
};

const INDUSTRY_ALIASES: Record<string, string> = {
  eishockey: 'verein',
  shop: 'ecommerce',
  handwerk: 'tradesman',
};

const SHOP_CAPABILITY_RULES = VERTICAL_PAGE_POLICIES.ecommerce.recommended || [];

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
}

function normalizeIndustry(industry?: string | null): string {
  const value = (industry || '').trim().toLowerCase();
  return INDUSTRY_ALIASES[value] || value;
}

function uniqueRules(rules: PagePolicyRule[]): PagePolicyRule[] {
  const seen = new Set<string>();
  return rules.filter(entry => {
    if (seen.has(entry.slug)) return false;
    seen.add(entry.slug);
    return true;
  });
}

export function getSitePagePolicy(context: SitePagePolicyContext = {}): SitePagePolicy {
  const industry = normalizeIndustry(context.industry);
  const vertical = VERTICAL_PAGE_POLICIES[industry] || {};
  const capabilityRecommendations = (context.capabilities || []).includes('shop')
    ? SHOP_CAPABILITY_RULES
    : [];
  return {
    required: uniqueRules([...CORE_REQUIRED_PAGE_RULES, ...(vertical.required || [])]),
    recommended: uniqueRules([...(vertical.recommended || []), ...capabilityRecommendations]),
  };
}

export function evaluateSitePagePolicy(
  existingSlugs: string[],
  context: SitePagePolicyContext = {},
): SitePagePolicy & { missingRequired: PagePolicyRule[]; missingRecommended: PagePolicyRule[] } {
  const existing = new Set(existingSlugs.map(normalizeSlug));
  const policy = getSitePagePolicy(context);
  const missing = (rules: PagePolicyRule[]) => rules.filter(entry => (
    !entry.acceptedSlugs.some(slug => existing.has(normalizeSlug(slug)))
  ));
  return {
    ...policy,
    missingRequired: missing(policy.required),
    missingRecommended: missing(policy.recommended),
  };
}
