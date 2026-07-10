type SectionCatalogEntry = { type?: string; id?: string; label?: string };
type ExistingPage = { id: string; slug: string; title: string };

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

function sectionType(entry: SectionCatalogEntry): string | null {
  return entry.type || entry.id || null;
}

export function buildAiAgentContract(input: {
  tenantName: string;
  industry: string;
  allowedSections: SectionCatalogEntry[];
  existingPages: ExistingPage[];
  sectionSchemas: Record<string, object>;
  hasShop: boolean;
  hasBooking: boolean;
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
  const recommendedPages = [
    page('startseite', 'Startseite', [hero, 'uspStrip', 'servicesGrid', 'processSteps', 'testimonials', 'faq', 'ctaBand']),
    page('leistungen', 'Leistungen', ['collectionHero', 'servicesGrid', 'processSteps', 'faq', 'ctaBand']),
    page('ueber-uns', 'Über uns', ['collectionHero', 'textImage', 'stats', 'team', 'ctaBand']),
    page('kontakt', 'Kontakt', ['collectionHero', 'contact', 'map', 'faq']),
  ].filter(candidate => candidate.sections.length > 0);

  return {
    protocolVersion: '1.1',
    objective: `Build a complete, credible ${input.industry} website for ${input.tenantName}. Replace every sample value with verified business-specific content.`,
    currentState: { existingPages: input.existingPages, shopEnabled: input.hasShop, bookingEnabled: input.hasBooking },
    stateMachine: [
      { state: 'DISCOVER', action: 'Read this response completely. Reuse existing page IDs/slugs. Never guess section fields.' },
      { state: 'FOUNDATION', action: 'Write brand, contact, design, navigation, footer, opening hours and global SEO.' },
      { state: 'CONTENT', action: 'POST every page with upsert=true. This operation is safe to repeat after corrections.' },
      { state: 'VERIFY', action: 'GET /api/v1/content/validate. Repair every error and color warning, then repeat validation.' },
      { state: 'PUBLISH', action: 'POST /api/v1/content/publish only when readyToPublish=true.' },
    ],
    requestRules: {
      authorization: 'Authorization: Bearer <PAT>',
      contentType: 'application/json; charset=utf-8',
      pageEnvelope: { slug: 'lowercase slug without leading slash', title: 'page title', upsert: true, sections: [{ type: 'from availableSectionTypes', data: {}, styleOverrides: {} }] },
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
      'Headlines communicate a customer outcome, not generic welcome copy.',
      'Every CTA points to an existing route and describes the next action.',
      'Every image is relevant and has meaningful alt text.',
      'Use at least three substantive array items unless reality provides fewer.',
      'Avoid duplicated paragraphs and repeated headlines across sections.',
      'Do not publish while validation reports any error or color warning.',
    ],
    recommendedPages,
    schemaLookup: 'sectionDataSchemas is authoritative. Examples demonstrate shape, not facts.',
    schemaCoverage: Object.keys(input.sectionSchemas).filter(type => allowed.has(type)).length,
  };
}

export function buildAiAgentPrompt(tenantName: string, industry: string): string {
  return `Create a complete ${industry} website for ${tenantName}. Follow agentContract.stateMachine in order. Treat sectionDataSchemas and sectionStyleContracts as authoritative. Use page upsert=true. Replace examples with verified German business content. Validate repeatedly and publish only with readyToPublish=true and no color warnings.`;
}
