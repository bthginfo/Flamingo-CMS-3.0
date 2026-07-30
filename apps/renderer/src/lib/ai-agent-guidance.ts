import { CONTENT_FIELD_BUDGETS, CONTENT_GOOD_BAD_EXAMPLES, type SiteProfile } from './content-quality';
import { profilePassesExistingValidation } from './business-profile';
import { getSitePagePolicy } from './site-page-policy';
import { SECTION_PREVIEW_DATA } from './section-preview-data';

type SectionCatalogEntry = { type?: string; id?: string; label?: string };
type ExistingPage = { id: string; slug: string; title: string };

type SiteProfileSeed = {
  businessName?: string;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
};

const ADVANCED_SECTION_TYPES = [
  'dualWave',
  'cinematicChapters',
  'transformationSequence',
  'xrayReveal',
  'sceneLab',
  'infiniteCanvas',
  'kineticIdentity',
  'signaturePath',
  'layeredAnatomy',
  'guidedChoice',
  'dayToNight',
  'livingBlueprint',
  'editorialCardMorph',
  'verticalReelShowcase',
  'aiWorkflowReel',
  'cameraExplodeScroll',
] as const;

const SECTION_EXAMPLES: Record<string, Record<string, unknown>> = {
  hero: {
    headline: 'Klarer Kundennutzen in einem Satz',
    subline: 'Konkrete Leistung, Region und Vertrauenssignal in maximal zwei Sätzen.',
    primaryCta: { label: 'Unverbindlich anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' },
    trustItems: ['Persönliche Beratung', 'Transparente Abläufe', 'Verlässlich vor Ort'],
  },
  collectionHero: { headline: 'Aussagekräftiger Seitentitel', subline: 'Nutzen und Zielgruppe dieser Seite in einem Satz.' },
  uspStrip: { items: [
    { icon: 'shield-check', title: 'Verlässlich', text: 'Konkreter Beleg statt Werbefloskel.' },
    { icon: 'sparkles', title: 'Hochwertig', text: 'Was die Qualität für Kunden sichtbar macht.' },
    { icon: 'map-pin', title: 'Regional', text: 'Ort oder Einzugsgebiet konkret nennen.' },
  ] },
  servicesGrid: {
    headline: 'Leistungen mit klarem Ergebnis',
    subline: 'Jede Karte beschreibt ein Kundenproblem und das erreichbare Ergebnis.',
    manualCards: [
      { title: 'Leistung Eins', text: 'Konkreter Nutzen in zwei Sätzen.', icon: 'sparkles', href: '/leistungen' },
      { title: 'Leistung Zwei', text: 'Konkreter Nutzen in zwei Sätzen.', icon: 'badge-check', href: '/leistungen' },
      { title: 'Leistung Drei', text: 'Konkreter Nutzen in zwei Sätzen.', icon: 'heart-handshake', href: '/leistungen' },
    ],
  },
  processSteps: { headline: 'So läuft die Zusammenarbeit ab', steps: [
    { icon: 'message-circle', title: 'Kennenlernen', text: 'Bedarf und Ziel werden konkret geklärt.' },
    { icon: 'clipboard-check', title: 'Planung', text: 'Leistung, Timing und Kosten werden transparent.' },
    { icon: 'circle-check', title: 'Umsetzung', text: 'Das vereinbarte Ergebnis wird verlässlich geliefert.' },
  ] },
  textImage: {
    headline: 'Warum Kunden diesem Unternehmen vertrauen',
    text: '<p>Eine glaubwürdige, spezifische Geschichte mit Erfahrung, Haltung und Arbeitsweise.</p>',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    imageAlt: 'Authentischer Einblick in das Unternehmen',
    layout: 'image-right',
  },
  testimonials: { headline: 'Was Kunden über die Zusammenarbeit sagen', items: [
    { quote: 'Konkretes Ergebnis und glaubwürdiges Detail der Erfahrung.', name: 'Vorname N.', context: 'Kundin aus der Region', rating: 5 },
    { quote: 'Konkretes Ergebnis und glaubwürdiges Detail der Erfahrung.', name: 'Vorname N.', context: 'Kunde aus der Region', rating: 5 },
    { quote: 'Konkretes Ergebnis und glaubwürdiges Detail der Erfahrung.', name: 'Vorname N.', context: 'Stammkundin', rating: 5 },
  ] },
  faq: { headline: 'Häufige Fragen – klar beantwortet', expandFirst: true, items: [
    { question: 'Wie beginnt die Zusammenarbeit?', answer: 'Den tatsächlichen Ablauf konkret und ohne Floskeln beschreiben.' },
    { question: 'Mit welchen Kosten ist zu rechnen?', answer: 'Preismodell oder Angebotsprozess transparent erklären.' },
    { question: 'Wie schnell ist ein Termin möglich?', answer: 'Einen realistischen Zeitraum oder Kontaktweg nennen.' },
  ] },
  ctaBand: { headline: 'Bereit für den nächsten Schritt?', subline: 'Niedrige Hürde und klare Erwartung nach dem Klick.', ctaPrimary: { label: 'Jetzt Kontakt aufnehmen', href: '/kontakt' } },
  team: { headline: 'Menschen, die Verantwortung übernehmen', members: [
    { name: 'Vorname Nachname', role: 'Rolle im Unternehmen', bio: 'Relevante Erfahrung und persönliche Stärke.' },
    { name: 'Vorname Nachname', role: 'Rolle im Unternehmen', bio: 'Relevante Erfahrung und persönliche Stärke.' },
  ] },
  contact: { headline: 'Persönlich erreichbar', introText: 'Erkläre, wann und wie schnell das Unternehmen antwortet.', formEnabled: true, submitLabel: 'Anfrage senden' },
};

const EXPERIENCE_FAMILIES = {
  'local-service-premium': {
    useWhen: 'Local company, trade, practice, studio or service business with lead generation as primary goal.',
    voice: 'Usually "wir"; write as the company, not about the company.',
    homepageFormula: [
      'premium hero with exact offer + location + next action',
      'proof/trust section with verified facts',
      'service/offer section with customer outcomes',
      'one rich narrative or Advanced section when assets exist',
      'process or guided choice',
      'faq/contact conversion',
    ],
    recommendedSections: ['cinematicHero', 'glowHero', 'proofWall', 'serviceTabs', 'guidedChoice', 'cinematicChapters', 'materialAtelier', 'smartInquiry', 'immersiveCtaBanner'],
  },
  'visual-portfolio': {
    useWhen: 'Photography, film, design, creator, artist, architecture or other visual work.',
    voice: 'Usually "ich" for solo experts, "wir" for studios. Never biography-style third person unless explicitly requested.',
    homepageFormula: [
      'visual hero with strong point of view',
      'curated portfolio or reel showcase',
      'one Advanced visual experience',
      'services/process explained through outcomes',
      'selected proof/projects',
      'direct contact conversion',
    ],
    recommendedSections: ['cinematicHero', 'editorialHero', 'verticalReelShowcase', 'infiniteCanvas', 'editorialCardMorph', 'cameraExplodeScroll', 'aiWorkflowReel', 'proofWall', 'ctaSplit'],
  },
  'political-news': {
    useWhen: 'Party, association, public initiative, club or organization with news, people and issues.',
    voice: 'Usually "wir"; factual, direct, public-facing.',
    homepageFormula: [
      'full-width identity or campaign hero',
      'latest news with search/archive route',
      'issues/program grouped clearly',
      'people/team with correct portraits',
      'participation/contact CTA',
      'footer with complete organization links',
    ],
    recommendedSections: ['editorialHero', 'cinematicHero', 'newsGrid', 'timeline', 'teamShowcase', 'proofWall', 'spotlightCards', 'ctaSplit', 'faq'],
  },
  'booking-service': {
    useWhen: 'Appointments, courses, reservations, rooms, practices or scheduled services.',
    voice: 'Usually "wir"; reduce uncertainty and explain booking expectations.',
    homepageFormula: [
      'benefit hero with booking CTA',
      'offer/course/room overview',
      'availability or booking section',
      'trust/process',
      'faq about booking and cancellation',
      'contact fallback',
    ],
    recommendedSections: ['glowHero', 'bookingSlotPicker', 'courseSchedule', 'roomGrid', 'guidedChoice', 'proofWall', 'faq', 'contact'],
  },
  'commerce-product': {
    useWhen: 'Shop, products, menus, packages or purchasable offers.',
    voice: 'Usually "wir"; emphasize fit, value, proof and next buying step.',
    homepageFormula: [
      'product/value hero',
      'curated offer/product grid',
      'proof/comparison',
      'process/shipping/payment clarity',
      'faq',
      'conversion CTA',
    ],
    recommendedSections: ['cinematicHero', 'shopProductGrid', 'premiumComparison', 'priceCalculator', 'proofWall', 'offerMatcher', 'faq', 'ctaBand'],
  },
} as const;

const AI_COPY_RULES = [
  'Write final public website copy only. Never write stage directions, section descriptions, design notes or media notes.',
  'Write from the business perspective. Use "ich" for solo creator/expert brands when fitting, "wir" for teams/companies/organizations.',
  'Do not write "Business X ist/arbeitet/bietet..." on public pages unless the field is explicitly an external press bio.',
  'Every sentence must do at least one useful job: name audience, offer, outcome, proof, process, location, decision help or next action.',
  'Never use placeholder labels like "Hero Reel", "Brand Asset", "visueller Anker", repeated "Mehr erfahren", "Lorem" or "Hier klicken".',
  'If a fact is unknown, omit it or put it into siteProfile.facts.unknowns; never fill gaps with plausible-sounding claims.',
] as const;

function sectionType(entry: SectionCatalogEntry): string | null {
  return entry.type || entry.id || null;
}

const AGENT_REQUEST_BODIES = {
  brand: {
    method: 'PUT',
    path: '/api/v1/content/brand',
    body: {
      companyName: '<verified business name>',
      tagline: '<specific outcome, not a slogan>',
      primaryColor: '#123456',
      accentColor: '#D8A24A',
      logoUrl: '<uploaded-or-existing-url, optional>',
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
  },
  contact: {
    method: 'PUT',
    path: '/api/v1/content/contact',
    body: {
      email: '<verified email>',
      phone: '<verified phone>',
      address: '<verified street, postal code, city>',
      whatsappEnabled: false,
    },
  },
  design: {
    method: 'PUT',
    path: '/api/v1/content/design',
    body: {
      sectionBg: '#FFFFFF',
      cardBg: '#FFFFFF',
      heading: '#111827',
      body: '#374151',
      muted: '#6B7280',
      btnBg: '#111827',
      btnText: '#FFFFFF',
      badgeBg: '#F3F4F6',
      badgeText: '#111827',
      radius: '1rem',
    },
  },
  navigation: {
    method: 'PUT',
    path: '/api/v1/content/navigation',
    body: {
      items: [{ label: 'Startseite', href: '/' }, { label: 'Kontakt', href: '/kontakt' }],
      cta: { label: '<specific action>', href: '/kontakt' },
    },
  },
  footer: {
    method: 'PUT',
    path: '/api/v1/content/footer',
    body: {
      columns: [
        { title: 'Angebot', items: [{ text: '<real page label>', href: '/leistungen' }] },
        { title: 'Kontakt', items: [{ text: 'Kontakt', href: '/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
      cta: { label: '<specific action>', href: '/kontakt' },
    },
  },
  seoGlobal: {
    method: 'PUT',
    path: '/api/v1/content/seo',
    body: {
      titleTemplate: '%s | <Brand>',
      defaultTitle: '<Brand + city/region>',
      defaultDescription: '<70-170 chars; concrete offer and region>',
      locale: 'de_DE',
    },
  },
  collection: {
    method: 'POST',
    path: '/api/v1/content/collections',
    body: {
      key: 'projekte',
      label: 'Projekte',
      overviewPage: {
        slug: 'projekte',
        title: 'Projekte',
        sections: '<tailored 4-6 section composition including collectionList with collectionKey "projekte">',
      },
    },
    invariant: 'Creates or repairs the editable /projekte overview by default. Existing overview pages are never overwritten. Use createOverviewPage=false only for intentionally private collections.',
  },
  page: {
    method: 'POST',
    path: '/api/v1/content/pages',
    body: {
      slug: 'startseite',
      title: 'Startseite',
      upsert: true,
      sections: [{
        type: '<availableSectionTypes only>',
        data: '<exact sectionDataSchemas[type] shape>',
        styleOverrides: '<optional exact sectionStyleContracts[type].colorFields keys>',
      }],
    },
  },
  pageSeo: {
    method: 'PUT',
    path: '/api/v1/content/seo/:pageId',
    body: { metaTitle: '<20-70 chars>', metaDescription: '<70-170 chars; unique>' },
  },
  validatePlan: {
    method: 'POST',
    path: '/api/v1/content/validate',
    body: { mode: 'plan', siteProfile: '<approved profile>', pages: '<complete planned pages>', navigation: '<planned nav>', footer: '<planned footer>' },
  },
  validateStored: { method: 'GET', path: '/api/v1/content/validate' },
  publish: { method: 'POST', path: '/api/v1/content/publish', body: {} },
} as const;

const AGENT_AUTOPILOT_RUNBOOK = {
  persona: 'Senior website strategist and CMS writer. Produce distinct, premium, verified websites; never template-stamp pages.',
  firstMove: 'Read agentContract completely, then POST /api/v1/content/validate with mode="profile" or mode="plan" before any content write.',
  writeOrder: [
    'profile-preflight',
    'plan-preflight',
    'brand',
    'contact',
    'design',
    'seoGlobal',
    'collections',
    'collectionItems',
    'pages',
    'pageSeo',
    'navigation',
    'footer',
    'stored-validate',
    'repair',
    'publish',
  ],
  hardStops: [
    'If a fact is unknown, put it in siteProfile.facts.unknowns and do not state it publicly.',
    'If POST /validate returns valid=false, do not write pages yet.',
    'Treat GET /validate as an advisory quality report. It never blocks publishing.',
    'If any copy sounds like a section note, media note, prompt note or third-person biography, rewrite it when possible.',
    'If a page has low contrast or missing foreground tokens on a custom background, repair colors when possible.',
    'If an endpoint returns 400, change only the named location; never retry the same body.',
  ],
  repairLoop: {
    maxUnchangedRetries: 0,
    rule: 'Sort issues by severity, group by location, patch the smallest field/object that satisfies repair.acceptance.',
    afterPatch: 'Run GET /api/v1/content/validate again to confirm the repair. Remaining findings are advisory and do not block publishing.',
  },
  pageWriting: {
    batchSize: 1,
    rule: 'Write one page per request with upsert=true. Inspect the response id before writing page SEO or links to that page. Keep each page sequence distinct.',
    fallback: 'If a premium/advanced section cannot be filled with real assets, replace it with a simpler available section instead of inventing media.',
  },
  commonFieldAliasesHandledByApi: {
    headline: ['title', 'heading'],
    subline: ['subtitle', 'description'],
    primaryCta: ['cta', 'button', 'primaryButton'],
    manualCards: ['cards', 'items', 'services'],
    steps: ['items'],
    faqItems: ['faqs', 'questions'],
    images: ['items'],
  },
} as const;

export function buildAiAgentContract(input: {
  tenantName: string;
  industry: string;
  allowedSections: SectionCatalogEntry[];
  existingPages: ExistingPage[];
  sectionSchemas: Record<string, object>;
  hasShop: boolean;
  hasBooking: boolean;
  siteProfileSeed?: SiteProfileSeed;
  approvedSiteProfile?: SiteProfile | null;
}) {
  const allowed = new Set(input.allowedSections.map(sectionType).filter((type): type is string => Boolean(type)));
  const page = (slug: string, title: string, candidates: string[]) => ({
    slug,
    title,
    write: { method: 'POST', path: '/api/v1/content/pages', upsert: true },
    sections: candidates.filter(type => allowed.has(type)).map(type => ({
      type,
      data: SECTION_EXAMPLES[type] || { _instruction: `Fill only fields documented in sectionDataSchemas.${type}` },
    })),
  });
  const industryHero = `hero${input.industry.charAt(0).toUpperCase()}${input.industry.slice(1)}`;
  const hero = allowed.has('hero') ? 'hero' : industryHero;
  const sitemapPolicy = getSitePagePolicy({
    industry: input.industry,
    capabilities: [input.hasShop ? 'shop' : '', input.hasBooking ? 'booking' : ''].filter(Boolean),
  });
  const pageBlueprints: Record<string, string[]> = {
    startseite: [hero, 'uspStrip', 'servicesGrid', 'processSteps', 'testimonials', 'faq', 'ctaBand'],
    kontakt: ['collectionHero', 'contact', 'map', 'faq'],
    impressum: ['legalContent'],
    datenschutz: ['legalContent'],
    leistungen: ['collectionHero', 'servicesGrid', 'processSteps', 'faq', 'ctaBand'],
    'ueber-uns': ['collectionHero', 'textImage', 'stats', 'team', 'ctaBand'],
    spielplan: ['nextMatchHero', 'matchSchedule', 'leagueTable', 'ctaBand'],
    verein: ['editorialHero', 'statsCounter', 'timeline', 'team', 'faq', 'ctaSplit'],
    shop: ['collectionHero', 'shopProductGrid'],
    warenkorb: ['shopCart'],
    speisekarte: ['collectionHero', 'menuCard', 'faq', 'ctaBand'],
    reservierung: ['collectionHero', 'bookingSlotPicker', 'contact'],
    zimmer: ['collectionHero', 'roomGrid', 'bookingDateRange', 'faq'],
    rsvp: ['collectionHero', 'rsvp', 'faq'],
    ablauf: ['collectionHero', 'eventSchedule', 'venueInfo'],
    immobilien: ['collectionHero', 'propertyGrid', 'ctaBand'],
    bewertung: ['collectionHero', 'valuationForm', 'contact'],
    erlebnisse: ['collectionHero', 'experienceGrid', 'tourRoutes', 'ctaBand'],
    routen: ['collectionHero', 'tourRoutes', 'visitorInfo', 'ctaBand'],
    portfolio: ['collectionHero', 'portfolioGallery', 'galleryGrid', 'ctaBand'],
    karte: ['collectionHero', 'menuCard', 'openingStatus'],
    kuenstler: ['collectionHero', 'artistGrid', 'tattooBookingCta'],
    galerie: ['collectionHero', 'galleryGrid', 'ctaBand'],
    straeusse: ['collectionHero', 'bouquetShowcase', 'seasonalCampaign'],
    programme: ['collectionHero', 'programGrid', 'trialSessionCta'],
    kursplan: ['collectionHero', 'courseSchedule', 'trialSessionCta'],
    raeume: ['collectionHero', 'spaceShowcase', 'floorPlanOverview', 'ctaBand'],
  };
  const recommendedPages = [...sitemapPolicy.required, ...sitemapPolicy.recommended]
    .map(entry => page(entry.slug, entry.label, pageBlueprints[entry.slug] || ['collectionHero', 'richText', 'ctaBand']))
    .filter(candidate => candidate.sections.length > 0);
  const approvedSiteProfile = input.approvedSiteProfile
    && profilePassesExistingValidation(input.approvedSiteProfile)
    ? input.approvedSiteProfile
    : null;

  return {
    protocolVersion: '1.2',
    objective: `Build a complete, credible ${input.industry} website for ${input.tenantName}. Replace every sample value with verified business-specific content.`,
    missionBrief: {
      goal: 'Generate a premium, non-generic website that feels tailored to this tenant, its assets and its audience.',
      copyRules: AI_COPY_RULES,
      compositionRules: [
        'Pick one experienceFamily before planning pages and follow its homepageFormula.',
        'If Premium/Advanced sections are available and real media/assets exist, the homepage must use at least one fitting Premium/Advanced section.',
        'Do not reuse the default hero → uspStrip → servicesGrid → processSteps → testimonials → faq → ctaBand sequence.',
        'No two non-legal pages may share the exact same section sequence.',
        'Use fewer, stronger sections on subpages; do not repeat homepage content with different headlines.',
      ],
      colorRules: [
        'Manual color overrides are allowed, but every text/background pair must pass WCAG AA.',
        'When setting a local section/card/button/badge background, also set readable foreground tokens unless the inherited tokens are already readable.',
        'Use /validate before publish; color warnings are blockers.',
      ],
    },
    experienceFamilies: Object.fromEntries(
      Object.entries(EXPERIENCE_FAMILIES).map(([key, family]) => [
        key,
        {
          ...family,
          recommendedSections: family.recommendedSections.filter(type => allowed.has(type)),
        },
      ]),
    ),
    currentState: { existingPages: input.existingPages, shopEnabled: input.hasShop, bookingEnabled: input.hasBooking },
    agentRunbook: AGENT_AUTOPILOT_RUNBOOK,
    requestBodies: AGENT_REQUEST_BODIES,
    stateMachine: [
      { state: 'DISCOVER', action: 'Read this response completely. Reuse existing page IDs/slugs. Never guess section fields.' },
      { state: 'FOUNDATION', action: 'Write brand, contact, design, navigation, footer, opening hours and global SEO.' },
      { state: 'CONTENT', action: 'POST every page with upsert=true. This operation is safe to repeat after corrections.' },
      { state: 'VERIFY', action: 'Optionally call GET /api/v1/content/validate and repair useful findings. This report is advisory.' },
      { state: 'PUBLISH', action: 'POST /api/v1/content/publish. Publishing does not require a readiness result.' },
    ],
    requestRules: {
      authorization: 'Authorization: Bearer <PAT>',
      contentType: 'application/json; charset=utf-8',
      pageEnvelope: { slug: 'lowercase slug without leading slash', title: 'page title', upsert: true, sections: [{ type: 'from availableSectionTypes', definitionKey: 'omit to let the server derive it, or copy availableSectionTypes[type].definitionKey exactly', schemaVersion: 'omit to derive, or copy availableSectionTypes[type].schemaVersion exactly', data: {}, styleOverrides: {} }] },
      safeDefaults: { visible: true, container: 'default', spacingTop: 'm', spacingBottom: 'm' },
      colors: 'Prefer global design tokens. Use only sectionStyleContracts[type].colorFields for local overrides.',
    },
    recovery: {
      '400': 'Do not retry unchanged. Correct the named field using code/error/hint.',
      '401': 'Stop and request a valid PAT.',
      '404': 'Refresh GET /content/pages or GET /instructions; an ID is stale.',
      '409': 'For pages, resend POST /content/pages with upsert=true.',
      '429': 'Wait for Retry-After, then retry once.',
      '500': 'Retry once only. If repeated, report requestId and endpoint.',
    },
    qualityBar: [
      'Never invent awards, reviews, people, prices, addresses or opening hours.',
      'Write as the business/person, not from an outside narrator perspective.',
      'No public field may contain stage directions, section labels, design notes or media-production notes.',
      'Headlines communicate a customer outcome, not generic welcome copy.',
      'Every CTA points to an existing route and describes the next action.',
      'Every public collection has a reachable editable overview page plus reachable /c/<collectionKey>/<itemSlug> detail routes.',
      'Every image is relevant and has meaningful alt text.',
      'Use at least three substantive array items unless reality provides fewer.',
      'Avoid duplicated paragraphs and repeated headlines across sections.',
      'Homepage must include at least one Premium/Advanced section when available assets make it feasible.',
      'Do not publish while validation reports any error or color warning.',
    ],
    sitemapPolicy,
    weakModelWorkflow: {
      version: '1.0',
      rule: approvedSiteProfile
        ? 'Use approvedSiteProfile verbatim as siteProfile. Do not repeat intake or add facts. Then validate the PLAN before writing one page at a time.'
        : 'Do not write tenant content until PROFILE and PLAN pass POST /api/v1/content/validate. Work one page at a time; repair only named issue locations.',
      approvedSiteProfile,
      profileSource: approvedSiteProfile ? 'persisted-approved' : 'intake-required',
      steps: [
        {
          state: 'PROFILE',
          output: 'siteProfile',
          skipIntake: Boolean(approvedSiteProfile),
          action: approvedSiteProfile
            ? 'Copy approvedSiteProfile exactly into siteProfile. Preserve facts.unknowns and prohibitedClaims; never infer or enrich missing values.'
            : 'Copy verified facts into the exact siteProfile schema. Never turn an unknown into a claim; list it in facts.unknowns.',
          gate: approvedSiteProfile
            ? 'The persisted profile already passed the existing profile validator. Continue with PLAN without asking the same intake questions again.'
            : 'POST /api/v1/content/validate with { mode: "profile", siteProfile, brand, contact, seoGlobal }. Continue only when valid=true.',
        },
        {
          state: 'PLAN',
          output: 'pages[] without API writes',
          action: 'Plan each page purpose, primaryAction, SEO and section sequence. Every section has one job and data shaped by sectionDataSchemas.',
          gate: 'POST /api/v1/content/validate with the complete plan. Continue only when valid=true.',
        },
        {
          state: 'WRITE',
          output: 'stored content',
          action: 'Write foundation first, then one page per request with upsert=true. Use only values from the approved profile and plan.',
          gate: 'After each page, inspect the API response before sending the next page.',
        },
        {
          state: 'REPAIR',
          output: 'targeted patches',
          action: 'For each validation issue, edit only issue.location. Follow repair.instruction and confirm repair.acceptance.',
          gate: 'Use GET /api/v1/content/validate as an advisory repair list; unresolved findings do not prevent publishing.',
        },
        {
          state: 'PUBLISH',
          output: 'published tenant',
          action: 'Publish once the requested content changes are saved.',
          gate: 'The publish endpoint is available without a readiness gate.',
        },
      ],
      siteProfileIntake: {
        schemaVersion: '1.0',
        seed: {
          businessName: input.siteProfileSeed?.businessName || input.tenantName,
          industry: input.siteProfileSeed?.industry || input.industry,
          address: input.siteProfileSeed?.address || null,
          phone: input.siteProfileSeed?.phone || null,
          email: input.siteProfileSeed?.email || null,
        },
        schema: {
          schemaVersion: '1.0',
          identity: {
            businessName: 'verified public name',
            legalName: 'verified legal name or omit',
            locations: [{ city: 'required', region: 'optional', country: 'optional', address: 'verified or omit' }],
            serviceAreas: ['verified areas only'],
          },
          audience: {
            primary: 'one concrete audience',
            needs: ['at least two specific needs'],
            objections: ['at least one real objection'],
          },
          goals: {
            primary: 'one primary site outcome',
            conversions: ['specific measurable actions'],
          },
          offers: [{ name: 'offer', outcome: 'customer outcome', proof: 'verified proof or omit', ctaLabel: 'specific action', ctaHref: '/existing-route' }],
          voice: { attributes: ['at least two'], avoid: ['phrases/tones to avoid'], perspective: 'ich|wir|neutral; choose ich for solo expert/creator brands, wir for companies/teams/organizations' },
          facts: { approvedClaims: ['verified only'], prohibitedClaims: ['must never be stated'], unknowns: ['requires user/source verification'] },
        },
        rules: [
          'Preserve exact spelling of business, people, street, city and region across every endpoint.',
          'Choose voice.perspective before writing: "ich" for solo creator/expert brands, "wir" for companies/teams/organizations, "neutral" only for legal/archive pages.',
          'Never invent awards, ratings, years, prices, medical/legal claims or opening hours.',
          'If location/identity sources disagree, stop content generation and return the conflict in facts.unknowns.',
        ],
      },
      pagePlanContract: {
        shape: {
          slug: 'lowercase kebab-case, no leading slash',
          title: 'human-readable title',
          purpose: 'audience need + page job + desired next action',
          primaryAction: 'one conversion action',
          seo: { metaTitle: '20-70 chars; brand omitted if template adds it', metaDescription: '70-170 chars; unique' },
          sections: [{ type: 'availableSectionTypes only', definitionKey: 'omit or copy the exact availableSectionTypes entry', schemaVersion: 'omit or copy the exact availableSectionTypes entry', purpose: 'one job', data: 'exact sectionDataSchemas[type] shape', styleOverrides: 'optional exact sectionStyleContracts[type] keys' }],
        },
        rules: [
          'Select one experienceFamily and state it in the plan before page sections.',
          'Use 7-10 sections on a homepage only when every section has a distinct job; use fewer on subpages.',
          'When Premium/Advanced sections are available and usable assets exist, the homepage must include at least one fitting Premium/Advanced section.',
          'Do not use the generic homepage sequence hero, uspStrip, servicesGrid, processSteps, testimonials, faq, ctaBand.',
          'No page may share the exact same opener-middle-closer sequence with another page.',
          'Every CTA resolves to a planned page, collection item, anchor, phone, email or verified external URL.',
          'For every public collection, plan a tailored 4-6 section overviewPage. The collection POST auto-creates /<collectionKey> as a safety net, but generic fallback composition is not the quality target.',
          'Do not add navigation/footer links to a collection overview until its POST response reports overviewPage.status "created" or "existing".',
          'Final QA checks HTTP 200 for every collection overview URL and at least one collection detail URL.',
          'Every page has unique SEO before any write starts.',
        ],
      },
      fieldBudgets: CONTENT_FIELD_BUDGETS,
      examples: CONTENT_GOOD_BAD_EXAMPLES,
      validationContract: {
        preflight: { method: 'POST', path: '/api/v1/content/validate', body: { mode: 'plan', siteProfile: '<siteProfile>', pages: '<planned pages>', brand: '<planned brand>', contact: '<planned contact>', seoGlobal: '<planned global SEO>', navigation: '<planned navigation>', footer: '<planned footer>' } },
        storedContent: { method: 'GET', path: '/api/v1/content/validate' },
        issueShape: { code: 'stable machine code', severity: 'error|warning', location: 'exact JSON path', message: 'what failed', repair: { operation: 'add|replace|remove|review', instruction: 'single repair action', acceptance: 'deterministic pass condition' } },
        repairRule: 'Group issues by location. Apply the smallest valid patch. Never regenerate unrelated pages after a local failure.',
      },
    },
    advancedExperienceGuide: {
      available: ADVANCED_SECTION_TYPES.filter(type => allowed.has(type)),
      selectionRule: 'Use Advanced sections deliberately, not rarely. Homepage: use one fitting Advanced/Premium experience when the tenant has real assets or a visual/storytelling need. Subpages: use Advanced only when it adds clarity. A standard section is the fallback only when required assets are missing.',
      assetRules: {
        dualWave: '6–12 concise titled entries; one list powers both waves. Prefer at least 4 relevant images.',
        cinematicChapters: '3–6 coherent chapters with one strong landscape image each and short copy.',
        transformationSequence: '3–6 chronological states with comparable imagery. Metrics must be verified facts.',
        xrayReveal: 'Exactly two images with identical pixel dimensions, camera angle, crop and focal point.',
        sceneLab: 'One base image plus at least 2 option groups. Every choice is a transparent pixel-aligned layer matching the base dimensions.',
        infiniteCanvas: '10–40 optimized images. Every image needs a meaningful alt text; the visitor opens the explorer explicitly.',
        kineticIdentity: '3–6 concise statements. Each needs a highlight; optional images should share one coherent visual language.',
        signaturePath: '3–7 ordered stations. Choose a curated path preset; never generate SVG path data or coordinates.',
        layeredAnatomy: 'Hotspots: one base image plus 2–8 positioned details. Pro layers: one base plus 2–8 transparent pixel-aligned assets; use hotspots when specialist layers are unavailable.',
        guidedChoice: '2–6 questions, 2–4 answers each and 2–6 results. Prefer score mode; every score or branch target must reference a stable existing id. No cycles or dead ends.',
        dayToNight: '2–4 chronological scenes with time, label, title and image. Reusing one image with sanitized tints is valid.',
        livingBlueprint: '3–8 stable ordered nodes. Choose a layout preset; never provide SVG connections or coordinates.',
        editorialCardMorph: '3–8 image-led cases with concise copy and at most 4 facts each. Existing collection injection may supply items.',
        verticalReelShowcase: '2–5 vertical reels. Preserve 9:16 unless source assets are another known aspect. Use direct HTTPS video URLs or poster fallbacks; every reel needs a title and short context.',
        aiWorkflowReel: 'One vertical workflow video or poster plus 3–6 concrete production phases. Explain the real workflow plainly; do not invent automation claims, awards or unverifiable AI capabilities.',
        cameraExplodeScroll: '4–7 tenant-specific production/value-chain layers with concise labels and safe offsets between -260 and 260. Do not use random literal camera mechanics like Body/Lens/Sensor unless the tenant actually sells camera hardware. For creative/photography tenants prefer layers like Briefing, Bildsprache, Produktion, AI Workflow, Postproduktion, Übergabe/Assets. Optional: provide a public HTTPS .glb/.gltf modelUrl. Never provide scripts, raw HTML or custom JS.',
      },
      examples: Object.fromEntries(
        ADVANCED_SECTION_TYPES
          .filter(type => allowed.has(type))
          .map(type => [type, SECTION_PREVIEW_DATA[type]]),
      ),
      validation: 'Treat these examples as shape references only. Replace all sample copy, URLs and claims. GET /api/v1/content/validate is an optional advisory audit.',
    },
    recommendedPages,
    schemaLookup: 'sectionDataSchemas is authoritative. Examples demonstrate shape, not facts.',
    schemaCoverage: Object.keys(input.sectionSchemas).filter(type => allowed.has(type)).length,
  };
}

export function buildAiAgentPrompt(tenantName: string, industry: string): string {
  return `Create a complete premium ${industry} website for ${tenantName}. Follow agentContract.stateMachine, agentContract.agentRunbook.writeOrder, agentContract.requestBodies and agentContract.missionBrief exactly. Choose one agentContract.experienceFamilies entry before planning. Write final public German copy from the business perspective (ich/wir), never stage directions or section/media notes. Plan distinct pages with at least one fitting Premium/Advanced homepage section when available, then preflight via POST /api/v1/content/validate before writing. Treat sectionDataSchemas and sectionStyleContracts as authoritative. Use page upsert=true. Keep manual color overrides valid and repair named issue locations when possible. GET /api/v1/content/validate is advisory; publish does not require readyToPublish=true.`;
}
