const token = process.env.FLM_CONSULTING_TOKEN || 'flm_pat_f43f44bceb2abd37fb28aa1e5352cca1778cd4036bfff33dd0b0e44e2ea750a6';
const baseUrl = 'https://flamingo-renderer.vercel.app';

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}\n${text}`);
  return text ? JSON.parse(text) : null;
}

const uid = () => crypto.randomUUID();

const STYLE_KEY_TO_VARS = {
  sectionBg: ['--style-section-bg', '--token-section-bg'],
  sectionBgAlt: ['--style-section-bg-alt', '--token-section-bg-alt'],
  cardBg: ['--style-card-bg', '--token-card-bg'],
  cardBorder: ['--style-card-border-color', '--style-border-color', '--token-card-border'],
  borderColor: ['--style-border-color', '--token-card-border'],
  dividerColor: ['--style-divider-color', '--token-divider'],
  heading: ['--style-heading-color', '--style-text-primary', '--token-heading'],
  heroHeading: ['--style-image-text-color', '--token-on-dark-heading', '--style-heading-color', '--style-text-primary', '--token-heading'],
  subheading: ['--style-subheading-color', '--style-text-secondary', '--token-subheading'],
  body: ['--style-body-color', '--style-text-secondary', '--token-body'],
  heroBody: ['--style-image-body-color', '--token-on-dark-body', '--style-body-color', '--style-text-secondary', '--token-body'],
  muted: ['--style-text-muted', '--token-muted'],
  icon: ['--style-icon-color', '--token-icon'],
  accentColor: ['--style-accent-color', '--style-accent', '--token-eyebrow', '--token-stat-value', '--token-quote', '--token-rating-star', '--token-check'],
  eyebrow: ['--style-accent-color', '--token-eyebrow'],
  statValue: ['--token-stat-value'],
  quote: ['--token-quote'],
  ratingStar: ['--token-rating-star'],
  check: ['--token-check'],
  badgeBg: ['--style-badge-bg', '--token-badge-bg'],
  badgeText: ['--style-badge-text', '--token-badge-text'],
  badgeBorder: ['--style-badge-border', '--token-badge-border'],
  btnBg: ['--style-button-bg', '--brand-btn-bg', '--token-btn-bg'],
  btnText: ['--style-button-text', '--brand-btn-text', '--token-btn-text'],
  onDarkHeading: ['--style-image-text-color', '--token-on-dark-heading'],
  onDarkBody: ['--style-image-body-color', '--token-on-dark-body'],
  onDarkMuted: ['--style-image-muted-color', '--token-on-dark-muted'],
};

function styleVars(overrides = {}) {
  const vars = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === null || value === '') continue;
    const targets = key.startsWith('--') ? [key] : STYLE_KEY_TO_VARS[key];
    if (!targets?.length) continue;
    for (const target of targets) vars[target] = String(value);
  }
  return vars;
}

const section = (type, data, styleOverrides = {}) => ({ id: uid(), type, data, styleOverrides: styleVars(styleOverrides) });

const img = {
  hero: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200&q=85',
  boardroom: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&q=85',
  workshop: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&q=85',
  strategy: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1800&q=85',
  process: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1800&q=85',
  leadership: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1800&q=85',
  succession: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1800&q=85',
  systems: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=85',
  finance: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=85',
  teamA: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=85',
  teamB: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85',
  teamC: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=85',
  city: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1800&q=85',
};

const colors = {
  ink: '#151A1E',
  body: '#5E6468',
  muted: '#5F676C',
  cream: '#F7F4ED',
  alt: '#ECE5D8',
  card: '#FFFDF8',
  border: '#DDD2C1',
  gold: '#A6763E',
  goldDeep: '#76512B',
  slate: '#172027',
  slateSoft: '#26323A',
  onDark: '#FFF8EA',
  onDarkBody: '#ECE3D4',
  onDarkMuted: '#CDBFAE',
};

const light = {
  sectionBg: colors.cream,
  sectionBgAlt: colors.alt,
  cardBg: colors.card,
  cardBorder: colors.border,
  borderColor: colors.border,
  heading: colors.ink,
  subheading: colors.body,
  body: colors.body,
  muted: colors.muted,
  icon: colors.goldDeep,
  accentColor: colors.gold,
  eyebrow: colors.goldDeep,
  statValue: colors.goldDeep,
  quote: colors.ink,
  ratingStar: colors.gold,
  check: colors.goldDeep,
  badgeBg: '#EDE0CC',
  badgeText: colors.goldDeep,
  badgeBorder: colors.border,
  btnBg: colors.slate,
  btnText: colors.onDark,
};
const alt = { ...light, sectionBg: colors.alt, cardBg: '#FFFCF5' };
const dark = {
  sectionBg: colors.slate,
  sectionBgAlt: colors.slate,
  cardBg: colors.slateSoft,
  cardBorder: 'rgba(255,248,234,0.24)',
  borderColor: 'rgba(255,248,234,0.22)',
  heading: colors.onDark,
  subheading: colors.onDarkBody,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  icon: '#D5B071',
  accentColor: '#D5B071',
  eyebrow: '#D5B071',
  statValue: '#D5B071',
  quote: colors.onDark,
  ratingStar: '#D5B071',
  check: '#D5B071',
  badgeBg: 'rgba(255,248,234,0.16)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,234,0.32)',
  btnBg: colors.onDark,
  btnText: colors.slate,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
  heroHeading: colors.onDark,
  heroBody: colors.onDarkBody,
};
const heroStyle = { ...dark };

const phone = '+49 89 215 47 30';
const email = 'kontakt@bergmann-partner.de';
const address = 'Brienner Straße 45, 80333 München';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Leistungen', href: '/leistungen', type: 'link' },
  { label: 'Cases', href: '/referenzen', type: 'link' },
  { label: 'Über uns', href: '/ueber-uns', type: 'link' },
  { label: 'Insights', href: '/news', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

function prefixHref(href) {
  if (!href || typeof href !== 'string') return href;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.startsWith('#')) return href;
  if (href === '/') return '/demo/consulting';
  if (href.startsWith('/demo/consulting')) return href;
  if (href.startsWith('/')) return `/demo/consulting${href}`;
  return href;
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (value && typeof value === 'object') {
    const copy = {};
    for (const [key, val] of Object.entries(value)) copy[key] = key === 'href' || key.endsWith('Href') ? prefixHref(val) : prefixDemoLinks(val);
    return copy;
  }
  return value;
}

function hero(headline, subline, bgImage, overrides = {}) {
  return section('hero', {
    headline,
    subline,
    bgImage,
    overlayOpacity: overrides.overlayOpacity ?? 0.64,
    imageEffect: overrides.imageEffect || 'kenBurns',
    primaryCta: overrides.primaryCta || { label: 'Erstgespräch anfragen', href: '/kontakt' },
    secondaryCta: overrides.secondaryCta || { label: 'Leistungen ansehen', href: '/leistungen' },
    trustItems: overrides.trustItems || ['Mittelstand', 'Umsetzung statt Folien', 'klare Prioritäten', 'diskrete Begleitung'],
  }, heroStyle);
}

function cinematic(headline, subline, bgImage) {
  return section('cinematicHero', {
    eyebrow: 'Bergmann & Partner Beratung',
    headline,
    subline,
    image: bgImage,
    bgImage,
    overlayColor: '#11191F',
    overlayOpacity: 0.58,
    align: 'left',
    primaryCta: { label: 'Erstgespräch anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Cases ansehen', href: '/referenzen' },
    stats: [
      { value: '18+', label: 'Jahre Beratung' },
      { value: '120+', label: 'begleitete Mandate' },
      { value: '4', label: 'Fokusfelder' },
    ],
  }, heroStyle);
}

function collectionHero(headline, subline, image, category = 'Beratung') {
  return section('collectionHero', {
    category,
    headline,
    subline,
    image,
    bgImage: image,
    overlayColor: '#11191F',
    overlayOpacity: 0.58,
    date: 'Mittelstand · Strategie · Umsetzung',
    primaryCta: { label: 'Gespräch anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Leistungen', href: '/leistungen' },
  }, heroStyle);
}

function cta(headline, subline) {
  return section('immersiveCtaBanner', {
    badge: 'Nächster Schritt',
    headline,
    subline,
    bgImage: img.boardroom,
    image: img.boardroom,
    overlayColor: '#11191F',
    overlayOpacity: 0.66,
    primaryCta: { label: 'Erstgespräch anfragen', href: '/kontakt' },
    secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' },
  }, dark);
}

const services = [
  { slug: 'strategie-wachstum', title: 'Strategie & Wachstum', text: 'Wachstum sortieren, Märkte bewerten und Entscheidungen so zuspitzen, dass Führungsteams handeln können.', excerpt: 'Strategische Klarheit für Unternehmen, die wachsen wollen, ohne Komplexität mitzuschleppen.', icon: 'TrendingUp', image: img.strategy, category: 'Strategie' },
  { slug: 'prozessoptimierung', title: 'Prozessoptimierung', text: 'Abläufe sichtbar machen, Reibung reduzieren und Verantwortlichkeiten so klären, dass Alltag leichter wird.', excerpt: 'Prozesse, Rollen und Übergaben, die nicht nur im Workshop funktionieren.', icon: 'Workflow', image: img.process, category: 'Prozesse' },
  { slug: 'fuehrung-organisation', title: 'Führung & Organisation', text: 'Führungssysteme, Meeting-Strukturen und Entscheidungswege für Teams, die schneller, klarer und ruhiger arbeiten sollen.', excerpt: 'Organisationen, die Verantwortung sauber verteilen und Führung entlasten.', icon: 'Users', image: img.leadership, category: 'Organisation' },
  { slug: 'nachfolge-uebergabe', title: 'Nachfolge & Übergabe', text: 'Übergaben vorbereiten, Rollen schärfen und Familienunternehmen durch sensible Veränderungsphasen begleiten.', excerpt: 'Nachfolge, die nicht erst am Übergabetag beginnt.', icon: 'Handshake', image: img.succession, category: 'Nachfolge' },
  { slug: 'digitalisierung-systeme', title: 'Digitalisierung & Systeme', text: 'Tools, Daten und Prozesse so verbinden, dass Digitalisierung echte Steuerbarkeit bringt statt neue Inseln.', excerpt: 'Digitale Systeme, die zum Betrieb passen und nicht nur modern aussehen.', icon: 'PanelsTopLeft', image: img.systems, category: 'Systeme' },
  { slug: 'geschaeftsfuehrung-sparring', title: 'Sparring für Geschäftsführung', text: 'Vertrauliches Sparring für Entscheidungen, Konflikte, Prioritäten und die nächsten 90 Tage.', excerpt: 'Ein klarer Blick von außen, wenn intern zu viele Perspektiven gleichzeitig ziehen.', icon: 'Compass', image: img.boardroom, category: 'Sparring' },
];

const serviceCards = services.map((s) => ({
  icon: s.icon,
  title: s.title,
  text: s.text,
  href: `/c/leistungen/${s.slug}`,
  mediaType: 'icon',
}));

const cases = [
  { slug: 'produktionsbetrieb-prozesse', title: 'Produktionsbetrieb mit klaren Übergaben', excerpt: 'Ein gewachsenes Unternehmen reduziert Reibung zwischen Vertrieb, Planung und Fertigung.', image: img.process, category: 'Prozesse' },
  { slug: 'agentur-wachstumsschmerzen', title: 'Agentur mit Wachstumsschmerzen', excerpt: 'Aus Gründerlogik wird eine Organisation mit Rollen, Prioritäten und sauberem Forecast.', image: img.workshop, category: 'Organisation' },
  { slug: 'familienunternehmen-nachfolge', title: 'Familienunternehmen vor Übergabe', excerpt: 'Nachfolge wird planbar, ohne Erfahrung der alten Führung zu entwerten.', image: img.succession, category: 'Nachfolge' },
  { slug: 'handel-digitale-steuerung', title: 'Handelsbetrieb mit digitaler Steuerung', excerpt: 'Reporting, Lagerlogik und Prozesse werden verbunden, damit Entscheidungen schneller werden.', image: img.finance, category: 'Systeme' },
];

const newsItems = [
  { slug: 'wachstum-ohne-struktur-wird-teuer', title: 'Warum Wachstum ohne Struktur teuer wird', excerpt: 'Mehr Umsatz löst keine Führungs- und Prozessprobleme. Oft macht er sie sichtbarer.', image: img.strategy, content: '<p>Wachstum fühlt sich zunächst gut an. Mehr Kunden, mehr Projekte, mehr Chancen. Kritisch wird es, wenn dieselben informellen Wege plötzlich zu langsam werden.</p><p>Dann braucht es keine große Reorganisation, sondern klare Prioritäten: Wer entscheidet was? Wo entstehen Übergaben? Welche Kennzahlen zeigen früh, dass etwas kippt?</p>' },
  { slug: 'nachfolge-beginnt-vor-dem-uebergabetermin', title: 'Nachfolge beginnt nicht mit dem Übergabetermin', excerpt: 'Warum gute Übergaben Rollen, Wissen und Verantwortung früh sortieren.', image: img.succession, content: '<p>Nachfolge scheitert selten am guten Willen. Häufig fehlen klare Rollen, ein gemeinsames Bild vom Ziel und ein Weg, wie Erfahrung übergeben wird, ohne Kontrolle festzuhalten.</p><p>Gute Nachfolge macht implizites Wissen sichtbar und schafft Räume, in denen neue Verantwortung wachsen kann.</p>' },
  { slug: 'prozessoptimierung-ohne-excel-friedhof', title: 'Prozessoptimierung ohne Excel-Friedhof', excerpt: 'Warum Prozesse nicht besser werden, nur weil sie dokumentiert sind.', image: img.process, content: '<p>Viele Prozessprojekte enden in Dateien, die niemand öffnet. Wirkung entsteht erst, wenn Prozesse im Alltag einfacher werden.</p><p>Dafür braucht es klare Eigentümer, messbare Übergaben und wenige Regeln, die wirklich eingehalten werden.</p>' },
  { slug: 'wann-beratung-wirklich-wirkung-hat', title: 'Wann Beratung wirklich Wirkung hat', excerpt: 'Beratung wird nützlich, wenn sie Entscheidungen erleichtert und Umsetzung begleitet.', image: img.boardroom, content: '<p>Gute Beratung liefert nicht nur Antworten. Sie schafft eine gemeinsame Sprache für Entscheidungen.</p><p>Der Unterschied zeigt sich nach dem Workshop: Gibt es Verantwortliche, Termine und eine kleine nächste Bewegung, oder nur ein gutes Gefühl?</p>' },
];

const processSteps = [
  { title: 'Lagebild', text: 'Wir sortieren Ziele, Engpässe, Kennzahlen und die Themen, die intern bereits bekannt sind, aber nicht sauber bearbeitet werden.', icon: 'Search' },
  { title: 'Prioritäten', text: 'Aus vielen Baustellen werden wenige Entscheidungen. Was zahlt auf Wirkung ein, was ist nur Aktivität?', icon: 'ListChecks' },
  { title: 'Umsetzung', text: 'Wir begleiten Führung, Meetings, Verantwortlichkeiten und erste Routinen, damit Veränderung nicht im Konzept endet.', icon: 'MoveRight' },
  { title: 'Verankerung', text: 'Zum Abschluss sind Rollen, nächste Schritte und Messpunkte so klar, dass das Team weiterarbeiten kann.', icon: 'CheckCircle' },
];

const testimonials = [
  { quote: 'Zum ersten Mal hatten wir nicht noch ein Konzept, sondern drei Entscheidungen, die sofort Wirkung hatten.', name: 'Geschäftsführer Maschinenbau', context: 'Prozesse & Führung', rating: 5 },
  { quote: 'Die Nachfolgegespräche wurden sachlicher, weil Rollen und Erwartungen endlich getrennt waren.', name: 'Familienunternehmen Süddeutschland', context: 'Nachfolge', rating: 5 },
  { quote: 'Bergmann & Partner hat unser Wachstum nicht romantisiert, sondern steuerbar gemacht.', name: 'Agenturinhaberin München', context: 'Organisation', rating: 5 },
];

const faqItems = [
  { question: 'Arbeiten Sie eher strategisch oder operativ?', answer: 'Beides, aber nie getrennt. Strategie muss in Entscheidungen, Rollen und Routinen übersetzt werden, sonst bleibt sie Theorie.' },
  { question: 'Für welche Unternehmen passt die Beratung?', answer: 'Vor allem für mittelständische Unternehmen, Familienunternehmen und wachsende Teams mit 20 bis 500 Mitarbeitenden.' },
  { question: 'Wie startet ein Projekt?', answer: 'Mit einem Erstgespräch und einem kompakten Lagebild. Danach empfehlen wir Umfang, Format und sinnvolle nächste Schritte.' },
  { question: 'Müssen wir uns langfristig binden?', answer: 'Nein. Wir starten lieber mit einem klaren Mandat und messbarer Zielsetzung als mit offenen Dauerprojekten.' },
];

function faqSection(headline) {
  return section('faq', { badgeText: 'FAQ', headline, subline: 'Kurze Antworten auf Fragen, die vor der Zusammenarbeit fast immer auftauchen.', items: faqItems }, light);
}

const teamMembers = [
  { name: 'Dr. Maren Bergmann', role: 'Partnerin', specialization: 'Strategie, Wachstum und Nachfolge', image: img.teamB, phone, email },
  { name: 'Jonas Reiter', role: 'Partner', specialization: 'Prozesse, Organisation und operative Umsetzung', image: img.teamA, phone, email },
  { name: 'Clara Vogt', role: 'Senior Consultant', specialization: 'Führungssysteme, Workshops und Steuerungslogik', image: img.teamC, phone, email },
];

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      cinematic('Klarheit für Unternehmen, die nicht auf Bauchgefühl wachsen wollen.', 'Wir helfen mittelständischen Unternehmen, Entscheidungen, Prozesse und Führung so zu sortieren, dass Wachstum nicht lauter, sondern steuerbarer wird.', img.hero),
      section('uspStrip', { items: [
        { icon: 'Compass', title: 'klare Prioritäten', text: 'weniger Projekte, mehr Wirkung' },
        { icon: 'Workflow', title: 'bessere Übergaben', text: 'Prozesse, die im Alltag tragen' },
        { icon: 'Users', title: 'entlastete Führung', text: 'Rollen und Entscheidungen sortiert' },
        { icon: 'LineChart', title: 'steuerbares Wachstum', text: 'Kennzahlen statt Bauchgefühl' },
      ] }, light),
      section('practiceAreas', { badgeText: 'Beratungsfelder', headline: 'Wo Klarheit meistens den größten Hebel hat.', subline: 'Wir starten nicht mit Methoden, sondern mit den Engpässen, die Ihr Unternehmen gerade wirklich bremsen.', areas: serviceCards.map(({ title, text, icon, href }) => ({ title, text, icon, href })) }, alt),
      section('editorialFeatureRail', { badge: 'Ausgangslagen', headline: 'Typische Situationen, in denen wir helfen.', subline: 'Wenn vieles gleichzeitig zieht, braucht es keinen Aktionismus, sondern eine saubere Reihenfolge.', slides: [
        { eyebrow: '01', title: 'Wachstum wird unübersichtlich', text: 'Mehr Umsatz, mehr Abstimmung, mehr Reibung. Wir sortieren, was skaliert und was bremst.', image: img.strategy, cta: { label: 'Strategie ansehen', href: '/c/leistungen/strategie-wachstum' } },
        { eyebrow: '02', title: 'Prozesse hängen an Personen', text: 'Wissen liegt in Köpfen. Wir machen Übergaben, Verantwortlichkeiten und Standards sichtbar.', image: img.process, cta: { label: 'Prozesse ansehen', href: '/c/leistungen/prozessoptimierung' } },
        { eyebrow: '03', title: 'Führung ist zu operativ', text: 'Wenn Führung alles hält, wird das System langsam. Wir bauen klare Rollen und Entscheidungswege.', image: img.leadership, cta: { label: 'Organisation ansehen', href: '/c/leistungen/fuehrung-organisation' } },
      ] }, light),
      section('processSteps', { badgeText: 'Ablauf', headline: 'Vom Lagebild zur Umsetzung.', subline: 'Kein Beratungsnebel. Ein klarer Prozess mit Entscheidungen, Verantwortlichen und Folgebewegung.', steps: processSteps }, alt),
      section('caseResults', { headline: 'Wirkung, die im Alltag messbar wird.', subline: 'Unsere Mandate enden nicht bei Workshops, sondern bei besseren Entscheidungen, klareren Routinen und weniger Reibung.', stats: [
        { value: 120, suffix: '+', label: 'begleitete Mandate', icon: 'Briefcase' },
        { value: 18, suffix: '+', label: 'Jahre Erfahrung', icon: 'Award' },
        { value: 90, suffix: ' Tage', label: 'bis zu erster Wirkung', icon: 'Clock' },
        { value: 4.9, label: 'Mandantenzufriedenheit', icon: 'Star' },
      ] }, dark),
      section('testimonials', { badgeText: 'Stimmen', headline: 'Ruhig im Ton, klar in der Wirkung.', subline: 'Was Mandanten besonders oft nennen: klare Priorisierung, ehrliche Einschätzung und echte Begleitung.', items: testimonials }, light),
      section('newsPreview', { badge: 'Insights', headline: 'Gedanken zu Wachstum, Prozessen und Führung.', subline: 'Keine Buzzwords, sondern praktische Einordnung für Unternehmen, die besser entscheiden wollen.', collectionKey: 'news', limit: 3, cta: { label: 'Alle Insights lesen', href: '/news' } }, alt),
      cta('Sollen wir Ihr wichtigstes Thema sortieren?', 'Ein erstes Gespräch reicht oft, um zu erkennen, ob Strategie, Prozess oder Führung gerade der eigentliche Hebel ist.'),
    ],
  },
  {
    slug: 'leistungen',
    title: 'Leistungen',
    sections: [
      hero('Beratung für Themen, die zu wichtig für Nebenbei sind.', 'Wir arbeiten an den Stellen, an denen Wachstum, Prozesse, Führung und Nachfolge konkret werden.', img.strategy, { trustItems: ['Strategie', 'Prozesse', 'Organisation', 'Nachfolge'] }),
      section('practiceAreas', { badgeText: 'Leistungen', headline: 'Sechs Beratungsfelder, ein Ziel: bessere Steuerbarkeit.', subline: 'Jedes Mandat bekommt einen klaren Umfang, aber keine Schablone.', areas: serviceCards.map(({ title, text, icon, href }) => ({ title, text, icon, href })) }, light),
      section('comparisonCardsPro', { badge: 'Formate', headline: 'Welches Format passt?', subline: 'Nicht jedes Thema braucht ein Großprojekt. Wir wählen den Umfang nach Wirkung, Dringlichkeit und Teamkapazität.', plans: [
        { name: 'Sparring', price: 'ab 1.200 €', note: 'für konkrete Entscheidungen', features: ['90-Minuten-Session', 'Vorbereitung anhand Ihrer Unterlagen', 'klare Optionen und nächste Schritte'], ctaLabel: 'Sparring anfragen', ctaHref: '/kontakt' },
        { name: 'Lagebild', price: 'ab 6.500 €', note: 'für Engpässe und Prioritäten', highlighted: true, features: ['Interviews und Kennzahlenblick', 'Engpasslandkarte', '90-Tage-Fahrplan'], ctaLabel: 'Lagebild planen', ctaHref: '/kontakt' },
        { name: 'Umsetzungsmandat', price: 'auf Anfrage', note: 'für Veränderung mit Begleitung', features: ['Workshops und Steuerung', 'Rollen und Routinen', 'Review nach 90 Tagen'], ctaLabel: 'Mandat besprechen', ctaHref: '/kontakt' },
      ] }, alt),
      section('feeTable', { badgeText: 'Orientierung', headline: 'Honorar transparent besprechen.', subline: 'Wir nennen früh einen realistischen Rahmen, damit Beratung keine Blackbox wird.', fees: [
        { title: 'Geschäftsführungs-Sparring', price: 'ab 1.200 €', description: 'Kompakte Entscheidungshilfe für ein konkretes Thema.', icon: 'Compass' },
        { title: 'Lagebild & Prioritäten', price: 'ab 6.500 €', description: 'Analyse, Interviews, Engpassbild und 90-Tage-Fahrplan.', icon: 'Search', highlighted: true },
        { title: 'Umsetzungsbegleitung', price: 'individuell', description: 'Begleitung über mehrere Wochen oder Monate mit klarer Zielsetzung.', icon: 'MoveRight' },
      ], footnote: 'Alle Preise verstehen sich als Orientierungswerte. Umfang, Reisezeiten und interne Vorbereitung klären wir vor Angebotserstellung.' }, light),
      faqSection('Fragen zu Leistungen und Zusammenarbeit'),
      cta('Nicht sicher, welches Format passt?', 'Schicken Sie uns kurz die Ausgangslage. Wir empfehlen ehrlich, was sinnvoll ist.'),
    ],
  },
  {
    slug: 'referenzen',
    title: 'Cases',
    sections: [
      hero('Cases, die nicht nach Beratungsfolien klingen.', 'Vier Situationen aus Mittelstand, Agentur, Nachfolge und Handel. Unterschiedliche Ausgangslagen, gleiche Logik: Klarheit vor Aktionismus.', img.workshop, { secondaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } }),
      section('collectionList', { badge: 'Cases', headline: 'Ausgewählte Mandate', subline: 'Was wir zeigen können, bleibt anonymisiert. Die Muster dahinter sind trotzdem konkret.', collectionKey: 'referenzen', layout: 'cards' }, light),
      section('beforeAfterStoryPro', { badge: 'Beispiel', headline: 'Vom operativen Dauerstress zu klaren Übergaben.', beforeTitle: 'Vorher', beforeText: 'Führungskräfte waren in jede Eskalation involviert. Entscheidungen hingen an wenigen Personen.', afterTitle: 'Nachher', afterText: 'Rollen, Übergaben und Eskalationslogik sind geklärt. Führung entscheidet weniger, aber besser.', metrics: [{ value: '30%', label: 'weniger Abstimmungsaufwand' }, { value: '6 Wochen', label: 'bis zum ersten Rollout' }], cta: { label: 'Ähnliches Thema besprechen', href: '/kontakt' } }, alt),
      section('testimonials', { badgeText: 'Mandanten', headline: 'Veränderung muss im Betrieb ankommen.', items: testimonials }, light),
      cta('Sie erkennen Ihr Thema wieder?', 'Dann sprechen wir über Ausgangslage, Ziel und den kleinsten sinnvollen nächsten Schritt.'),
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    sections: [
      hero('Beratung ohne Theater, aber mit Haltung.', 'Wir arbeiten strukturiert, direkt und nah genug an der Umsetzung, damit Empfehlungen nicht im System hängen bleiben.', img.boardroom, { trustItems: ['diskret', 'mittelstandserfahren', 'umsetzungsnah', 'klar im Ton'] }),
      section('textImage', { badge: 'Haltung', headline: 'Wir verkaufen keine Transformationsromantik.', text: '<p>Unternehmen brauchen nicht immer mehr Ideen. Oft brauchen sie weniger Nebel: klare Entscheidungen, echte Prioritäten und eine Umsetzung, die zu den Menschen und Kapazitäten passt.</p><p>Deshalb arbeiten wir mit Geschäftsführungen, Führungsteams und Schlüsselpersonen. Nicht neben dem Unternehmen, sondern dort, wo Entscheidungen wirklich entstehen.</p>', image: img.workshop, imagePosition: 'right', cta: { label: 'Leistungen ansehen', href: '/leistungen' } }, light),
      section('team', { badgeText: 'Team', headline: 'Senior genug für schwierige Gespräche.', subline: 'Kleine Teams, klare Verantwortliche und keine wechselnde Junior-Besetzung im Hintergrund.', members: teamMembers }, alt),
      section('principlesGrid', { badge: 'Prinzipien', headline: 'Worauf wir bestehen.', subline: 'Gute Beratung muss Komplexität reduzieren, nicht beeindrucken.', principles: [
        { eyebrow: '01', title: 'Erst Diagnose, dann Methode', text: 'Wir starten nicht mit Frameworks, sondern mit Ihrer konkreten Lage.' },
        { eyebrow: '02', title: 'Keine Folien ohne Entscheidung', text: 'Jede Analyse muss eine Konsequenz haben.' },
        { eyebrow: '03', title: 'Umsetzung ist Teil des Mandats', text: 'Wir begleiten die ersten Schritte, damit es nicht bei Zustimmung bleibt.' },
        { eyebrow: '04', title: 'Ehrlichkeit vor Komfort', text: 'Wir sagen auch, wenn ein Thema noch nicht entscheidungsreif ist.' },
      ], cta: { label: 'Arbeitsweise besprechen', href: '/kontakt' } }, light),
      section('stats', { headline: 'Erfahrung mit gewachsenen Strukturen.', stats: [{ value: '18+', label: 'Jahre Erfahrung' }, { value: '120+', label: 'Mandate' }, { value: '3', label: 'Senior-Berater' }, { value: '90', suffix: ' Tage', label: 'Umsetzungsfokus' }] }, alt),
      cta('Passt diese Haltung zu Ihrem Unternehmen?', 'Dann lohnt sich ein erstes Gespräch.'),
    ],
  },
  {
    slug: 'news',
    title: 'Insights',
    sections: [
      hero('Insights für bessere Entscheidungen.', 'Gedanken zu Wachstum, Nachfolge, Prozessen und Führung. Direkt genug für die Praxis, ruhig genug für gute Entscheidungen.', img.finance, { secondaryCta: { label: 'Kontakt', href: '/kontakt' } }),
      section('publications', { badgeText: 'Beiträge', headline: 'Einordnung ohne Buzzword-Show.', subline: 'Kurze Beiträge für Unternehmen, die nicht noch mehr Schlagworte brauchen, sondern bessere Entscheidungen.', articles: newsItems.map((item) => ({ title: item.title, excerpt: item.excerpt, date: '4. Juni 2026', category: 'Insight', href: `/c/news/${item.slug}`, image: item.image })), ctaLabel: 'Gespräch anfragen', ctaHref: '/kontakt' }, light),
      section('newsGrid', { badge: 'Archiv', headline: 'Alle Beiträge', subline: 'Alle aktuellen Gedanken und Einordnungen.', collectionKey: 'news', limit: 12 }, alt),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    sections: [
      hero('Sagen Sie uns, wo es gerade hakt.', 'Ein gutes Erstgespräch braucht keine perfekte Vorbereitung. Ausgangslage, Ziel und ein paar Zahlen reichen für den Start.', img.city, { trustItems: ['Antwort meist binnen 24h', 'vertraulich', 'klarer nächster Schritt'] }),
      section('contact', { badgeText: 'Kontakt', headline: 'Kurze Anfrage, klare Rückmeldung.', subline: 'Beschreiben Sie knapp, worum es geht. Wir melden uns mit Rückfragen und einer ehrlichen Einschätzung.', introText: '<p>Am hilfreichsten sind Branche, Unternehmensgröße, aktueller Engpass und was sich in den nächsten 90 Tagen verändern soll.</p>', phone, email, address, formEnabled: true, submitLabel: 'Erstgespräch anfragen', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Büro', value: address }, { icon: 'Clock', label: 'Rückmeldung', value: 'meist innerhalb von 24 Stunden' }], formFields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'company', label: 'Unternehmen', type: 'text', halfWidth: true }, { name: 'topic', label: 'Thema', type: 'select', options: ['Strategie & Wachstum', 'Prozesse', 'Führung & Organisation', 'Nachfolge', 'Digitalisierung', 'Sparring'] }, { name: 'message', label: 'Ausgangslage', type: 'textarea', required: true }] }, light),
      section('map', { badge: 'Standort', headline: 'München als Basis, Mandate im DACH-Raum.', subline: 'Viele Mandate starten remote und werden durch gezielte Vor-Ort-Termine ergänzt.', address, mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.0!2d11.575!3d48.137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sM%C3%BCnchen!5e0!3m2!1sde!2sde!4v1710000000000' }, alt),
      faqSection('Fragen vor dem Erstgespräch'),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben', content: 'Bergmann & Partner Beratung GmbH, Brienner Straße 45, 80333 München' }, { title: 'Kontakt', content: `${email} · ${phone}` }, { title: 'Vertreten durch', content: 'Dr. Maren Bergmann und Jonas Reiter' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte dienen der Demonstration.' }] }, light)],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortliche', content: 'Bergmann & Partner Beratung GmbH' }, { title: 'Kontaktformular', content: 'Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }, { title: 'Ihre Rechte', content: 'Sie haben Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.' }] }, light)],
  },
];

function serviceItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, item.category),
    section('textImage', { badge: item.category, headline: `${item.title}, aber ohne Beratungsnebel.`, text: `<p>${item.excerpt}</p><p>Wir verbinden Analyse mit konkreten Entscheidungen: Was ist der Engpass, welche Rolle spielt Führung, und welcher nächste Schritt erzeugt echte Entlastung?</p>`, image: item.image, imagePosition: 'right', cta: { label: 'Mandat besprechen', href: '/kontakt' } }, light),
    section('processSteps', { badgeText: 'Vorgehen', headline: 'So wird aus Analyse Umsetzung.', steps: processSteps }, alt),
    section('caseResults', { headline: 'Woran wir Wirkung messen.', subline: 'Die Kennzahlen unterscheiden sich je Mandat. Entscheidend ist, dass Wirkung im Alltag sichtbar wird.', stats: [{ value: 90, suffix: ' Tage', label: 'erster Umsetzungszyklus', icon: 'Clock' }, { value: 3, label: 'klare Prioritäten', icon: 'ListChecks' }, { value: 1, label: 'verantwortliches Führungsteam', icon: 'Users' }] }, dark),
    faqSection('Fragen zu diesem Beratungsfeld'),
    cta('Sollen wir dieses Thema einordnen?', 'Schreiben Sie kurz, was gerade unklar ist.'),
  ]);
}

function caseItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, item.category),
    section('freeText', { content: `<p>${item.excerpt}</p><p>Das Mandat startete mit einem klaren Lagebild: Welche Entscheidungen hängen fest, wo entstehen Übergaben, und welche Routinen produzieren unnötige Abstimmung?</p><p>Nach der Analyse wurden Rollen, Entscheidungswege und ein 90-Tage-Plan definiert. Entscheidend war nicht die perfekte Zielstruktur, sondern eine erste belastbare Bewegung.</p>` }, light),
    section('beforeAfterStoryPro', { badge: item.category, headline: 'Vorher und nachher.', beforeTitle: 'Vorher', beforeText: 'Viele Themen waren bekannt, aber nicht priorisiert. Entscheidungen wurden vertagt oder informell gelöst.', afterTitle: 'Nachher', afterText: 'Die wichtigsten Engpässe sind benannt, Verantwortlichkeiten geklärt und die ersten Routinen laufen.', metrics: [{ value: '90 Tage', label: 'Umsetzungsfenster' }, { value: '3', label: 'Prioritäten' }] }, alt),
    section('testimonials', { badgeText: 'Stimme', headline: 'Was im Mandat geholfen hat.', items: testimonials.slice(0, 2) }, light),
    cta('Ähnliche Ausgangslage?', 'Dann sprechen wir über Ihr Lagebild.'),
  ]);
}

function newsItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, 'Insight'),
    section('freeText', { content: item.content }, light),
    section('publications', { badgeText: 'Weitere Insights', headline: 'Weiterlesen', articles: newsItems.filter((n) => n.slug !== item.slug).slice(0, 3).map((n) => ({ title: n.title, excerpt: n.excerpt, date: '4. Juni 2026', category: 'Insight', href: `/c/news/${n.slug}`, image: n.image })) }, alt),
    cta('Möchten Sie das auf Ihr Unternehmen übertragen?', 'Ein Erstgespräch macht schnell sichtbar, welcher Hebel wirklich zählt.'),
  ]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: prefixDemoLinks(page.sections), visible: true, status: 'published' };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, collections) {
  const found = collections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function replaceCollectionItems(key, label, items, makeSections, collections) {
  const collection = await ensureCollection(key, label, collections);
  const existingBySlug = new Map((collection.items || []).map((item) => [item.slug, item]));
  for (const [index, item] of items.entries()) {
    const payload = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      published: true,
      priority: index,
      data: {
        image: item.image,
        category: item.category,
        author: 'Bergmann & Partner',
        date: '2026-06-04',
        description: item.excerpt,
        features: item.features || item.tags || [],
        cta: { label: 'Gespräch anfragen', href: '/kontakt' },
      },
    };
    const existing = existingBySlug.get(item.slug);
    if (existing?.id) {
      await api('PUT', `/api/v1/content/collections/${key}/items/${existing.id}`, payload);
    } else {
      await api('POST', `/api/v1/content/collections/${key}/items`, payload);
    }
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];
  const existingCollections = Array.isArray(collectionsBefore)
    ? collectionsBefore
    : (collectionsBefore.collections || []);

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', {
    companyName: 'Bergmann & Partner Beratung',
    tagline: 'Strategie, Prozesse und Führung für den Mittelstand',
    primaryColor: colors.slate,
    secondaryColor: colors.slateSoft,
    accentColor: colors.gold,
    logo: '',
    logoDisplay: 'name',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    topBarColor: colors.slate,
    footerColor: colors.slate,
  });
  await api('PUT', '/api/v1/content/design', {
    textPrimary: colors.ink,
    textSecondary: colors.body,
    sectionBg: colors.cream,
    sectionBgAlt: colors.alt,
    cardBg: colors.card,
    cardBorder: colors.border,
    badgeBg: '#EDE0CC',
    badgeText: colors.goldDeep,
    badgeBorder: colors.border,
    brand: colors.slate,
    accent: colors.gold,
    heading: colors.ink,
    subheading: colors.body,
    body: colors.body,
    muted: colors.muted,
    icon: colors.goldDeep,
    btnBg: colors.slate,
    btnText: colors.onDark,
    dividerColor: colors.border,
    eyebrow: colors.goldDeep,
    statValue: colors.goldDeep,
    quote: colors.ink,
    ratingStar: colors.gold,
    check: colors.goldDeep,
    onDarkHeading: colors.onDark,
    onDarkBody: colors.onDarkBody,
    onDarkMuted: colors.onDarkMuted,
  });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: false, whatsapp: '', whatsappColor: colors.goldDeep });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Erstgespräch', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', {
    columns: [
      { title: 'Leistungen', items: services.slice(0, 4).map((s) => ({ text: s.title, href: `/c/leistungen/${s.slug}` })) },
      { title: 'Unternehmen', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Cases', href: '/referenzen' }, { text: 'Insights', href: '/news' }] },
      { title: 'Kontakt', items: [{ text: email }, { text: phone }, { text: address }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Erstgespräch anfragen', href: '/kontakt' },
  });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'Montag-Freitag', hours: '09:00-18:00' }, { type: 'regular', day: 'Erstgespräche', hours: 'nach Vereinbarung' }, { type: 'regular', day: 'Mandate', hours: 'remote und vor Ort' }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'company', label: 'Unternehmen', type: 'text', halfWidth: true }, { name: 'topic', label: 'Thema', type: 'select', options: ['Strategie', 'Prozesse', 'Führung', 'Nachfolge', 'Digitalisierung', 'Sparring'], halfWidth: true }, { name: 'message', label: 'Ausgangslage', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { linkedin: 'https://www.linkedin.com', google: 'https://maps.google.com', instagram: '' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Bergmann & Partner Beratung', defaultTitle: 'Bergmann & Partner Beratung · Strategie, Prozesse und Führung', defaultDescription: 'Unternehmensberatung in München für Mittelstand, Familienunternehmen, Wachstum, Prozesse, Führung und Nachfolge.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/consulting', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);
  await replaceCollectionItems('leistungen', 'Leistungen', services, serviceItemSections, existingCollections);
  await replaceCollectionItems('referenzen', 'Cases', cases, caseItemSections, existingCollections);
  await replaceCollectionItems('news', 'Insights', newsItems, newsItemSections, existingCollections);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Bergmann & Partner Beratung', 'Unternehmensberatung in München für Strategie, Prozesse, Führung, Digitalisierung und Nachfolge im Mittelstand.'],
    leistungen: ['Leistungen', 'Beratungsfelder für Mittelstand: Strategie, Prozessoptimierung, Organisation, Nachfolge, Digitalisierung und Sparring.'],
    referenzen: ['Cases', 'Anonymisierte Beratungs-Cases aus Mittelstand, Agentur, Familienunternehmen und Handel.'],
    'ueber-uns': ['Über Bergmann & Partner', 'Arbeitsweise, Haltung und Team der Bergmann & Partner Beratung in München.'],
    news: ['Insights', 'Beiträge zu Wachstum, Prozessen, Führung, Nachfolge und Unternehmenssteuerung.'],
    kontakt: ['Kontakt', 'Erstgespräch mit Bergmann & Partner Beratung für Strategie, Prozesse und Führung anfragen.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Bergmann & Partner Beratung`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
