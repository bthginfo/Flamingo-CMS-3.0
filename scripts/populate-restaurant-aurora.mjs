const token = process.env.FLM_RESTAURANT_TOKEN || 'flm_pat_910915ec2186b9d044b5ea5f67becabead7291f28c9ef61c384a3d376043a1d1';
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

const id = () => crypto.randomUUID();
const section = (type, data, styleOverrides = {}) => ({ id: id(), type, data, styleOverrides });

const img = {
  hero: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2200&q=85',
  table: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85',
  plate: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600&q=85',
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=85',
  kitchen: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1600&q=85',
  terrace: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=85',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1600&q=85',
  seafood: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1600&q=85',
  antipasti: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=1600&q=85',
  team: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1600&q=85',
  privateDining: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=85',
  espresso: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=85',
};

const colors = {
  text: '#24130E',
  textSoft: '#6E5145',
  cream: '#FFF8EF',
  creamAlt: '#F3E6D5',
  card: '#FFFFFF',
  border: '#E7D1BC',
  brown: '#4B2016',
  brownDeep: '#21100B',
  copper: '#C96F35',
  gold: '#E5A84D',
  green: '#264339',
  onDark: '#FFF7EA',
  onDarkSoft: '#F3D9BF',
};

const lightSection = {
  sectionBg: colors.cream,
  cardBg: colors.card,
  heading: colors.text,
  body: colors.textSoft,
  subheading: colors.textSoft,
  accentColor: colors.copper,
  btnBg: colors.brown,
  btnText: colors.onDark,
  badgeBg: '#F7E2C7',
  badgeText: colors.brown,
  badgeBorder: colors.border,
  icon: colors.brown,
  borderColor: colors.border,
};

const altSection = {
  ...lightSection,
  sectionBg: colors.creamAlt,
  cardBg: '#FFFDF8',
};

const darkSection = {
  sectionBg: colors.brownDeep,
  heading: colors.onDark,
  body: colors.onDarkSoft,
  subheading: colors.onDarkSoft,
  accentColor: colors.gold,
  btnBg: colors.gold,
  btnText: colors.brownDeep,
  badgeBg: 'rgba(255,248,239,0.12)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,239,0.24)',
  cardBg: 'rgba(255,248,239,0.08)',
  borderColor: 'rgba(255,248,239,0.18)',
  icon: colors.gold,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#D9BFA8',
};

const heroStyle = {
  heroHeading: colors.onDark,
  heroBody: colors.onDarkSoft,
  badgeBg: 'rgba(255,248,239,0.15)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,248,239,0.28)',
  btnBg: colors.gold,
  btnText: colors.brownDeep,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkSoft,
  onDarkMuted: '#E7CDB4',
};

const phone = '+49 89 219 897 40';
const email = 'ciao@trattoria-aurora.de';
const address = 'Schellingstraße 48, 80799 München';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.0!2d11.5755!3d48.1516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU2NoZWxsaW5nc3RyYcOfZSA0OCwgODA3OTkgTcO8bmNoZW4!5e0!3m2!1sde!2sde!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Speisekarte', href: '/speisekarte', type: 'link' },
  { label: 'Über uns', href: '/ueber-uns', type: 'link' },
  { label: 'Events', href: '/events', type: 'link' },
  { label: 'Galerie', href: '/galerie', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const menuCategories = [
  {
    title: 'Antipasti',
    description: 'Kleine Teller für den Anfang oder zum Teilen.',
    items: [
      { name: 'Burrata Pugliese', description: 'Cremige Burrata, lauwarme Datterini-Tomaten, Basilikumöl und geröstete Pinienkerne.', price: '18 €', tags: ['vegetarisch'], allergens: ['Milch', 'Nüsse'] },
      { name: 'Vitello tonnato Aurora', description: 'Rosa Kalb, Thunfischcreme, Kapernäpfel, Zitrone und feiner Kräutersalat.', price: '19 €', allergens: ['Fisch', 'Ei'] },
      { name: 'Carpaccio di manzo', description: 'Hauchdünnes Rinderfilet, Rucola, 36 Monate gereifter Parmigiano und schwarzer Pfeffer.', price: '21 €', allergens: ['Milch'] },
      { name: 'Antipasti della casa', description: 'Warme und kalte Auswahl für zwei Personen: Gemüse, Prosciutto, Pecorino, Oliven und Crostini.', price: '32 €', allergens: ['Gluten', 'Milch'] },
    ],
  },
  {
    title: 'Pasta fatta in casa',
    description: 'Teig, Füllung und Sauce entstehen täglich in unserer Küche.',
    items: [
      { name: 'Tagliolini al tartufo', description: 'Handgeschnittene Tagliolini, Trüffelbutter, Parmigiano und frischer schwarzer Trüffel.', price: '34 €', tags: ['Signature'], allergens: ['Gluten', 'Ei', 'Milch'] },
      { name: 'Pappardelle al ragù di Chianina', description: 'Breite Bandnudeln mit langsam geschmortem Ragù vom Chianina-Rind.', price: '26 €', allergens: ['Gluten', 'Ei', 'Sellerie'] },
      { name: 'Ravioli di ricotta e limone', description: 'Gefüllte Pasta mit Ricotta, Amalfi-Zitrone, Salbeibutter und Mandeln.', price: '24 €', tags: ['vegetarisch'], allergens: ['Gluten', 'Ei', 'Milch', 'Nüsse'] },
      { name: 'Spaghetti alle vongole', description: 'Venusmuscheln, Weißwein, Knoblauch, Petersilie und ein Hauch Peperoncino.', price: '27 €', allergens: ['Gluten', 'Weichtiere'] },
    ],
  },
  {
    title: 'Pesce, carne e verdure',
    description: 'Aus Ofen, Pfanne und Schmortopf.',
    items: [
      { name: 'Branzino al forno', description: 'Wolfsbarsch aus dem Ofen, Zitronen-Kräuterkruste, Fenchel und Ofenkartoffeln.', price: '36 €', allergens: ['Fisch'] },
      { name: 'Ossobuco alla Milanese', description: 'Geschmorte Kalbshaxe, Safranrisotto und Gremolata nach unserem Hausrezept.', price: '39 €', tags: ['Hausklassiker'], allergens: ['Milch', 'Sellerie'] },
      { name: 'Tagliata di manzo', description: 'Rosa gebratenes Rumpsteak, Rucola, Parmigiano, Rosmarinkartoffeln und Jus.', price: '38 €', allergens: ['Milch'] },
      { name: 'Melanzana alla Parmigiana', description: 'Aubergine, San-Marzano-Tomaten, Mozzarella, Basilikum und Parmigiano.', price: '23 €', tags: ['vegetarisch'], allergens: ['Milch'] },
    ],
  },
  {
    title: 'Dolci e caffè',
    description: 'Kleine Abschlüsse, Espresso und hausgemachte Süße.',
    items: [
      { name: 'Tiramisù della Nonna', description: 'Mascarponecreme, Espresso, Savoiardi und Kakao. 24 Stunden gezogen.', price: '12 €', tags: ['Signature'], allergens: ['Gluten', 'Ei', 'Milch'] },
      { name: 'Panna cotta alla vaniglia', description: 'Vanille-Panna-Cotta, Himbeeren, Olivenöl-Crumble und Minze.', price: '11 €', allergens: ['Milch', 'Gluten'] },
      { name: 'Cannoli Siciliani', description: 'Knusprige Cannoli, Ricotta-Orangen-Creme, Pistazien und Zartbitterschokolade.', price: '13 €', allergens: ['Gluten', 'Milch', 'Nüsse'] },
      { name: 'Affogato al caffè', description: 'Fior-di-latte-Eis, heißer Espresso und Amaretti.', price: '9 €', allergens: ['Milch', 'Nüsse'] },
    ],
  },
];

const signatureDishes = [
  { name: 'Tagliolini al tartufo', description: 'Frische Pasta, Trüffelbutter, Parmigiano und schwarzer Trüffel. Wenige Zutaten, viel Präzision.', price: '34 €', image: img.pasta, label: 'Signature', ingredients: ['Tagliolini', 'Trüffel', 'Parmigiano'], cta: { label: 'Zur Speisekarte', href: '/speisekarte' } },
  { name: 'Ossobuco alla Milanese', description: 'Kalbshaxe, langsam geschmort, mit Safranrisotto und Gremolata. Ein Klassiker mit Tiefe.', price: '39 €', image: img.plate, label: 'Hausklassiker', ingredients: ['Kalb', 'Safran', 'Gremolata'], cta: { label: 'Zur Speisekarte', href: '/speisekarte' } },
  { name: 'Branzino al forno', description: 'Ganzer Wolfsbarsch mit Kräutern, Fenchel und Zitrone. Leicht, klar und perfekt zu Weißwein.', price: '36 €', image: img.seafood, label: 'Aus dem Ofen', ingredients: ['Wolfsbarsch', 'Fenchel', 'Zitrone'], cta: { label: 'Zur Speisekarte', href: '/speisekarte' } },
];

const eventItems = [
  { title: 'Toskana-Weinabend', slug: 'toskana-weinabend', dateLabel: 'Jeden ersten Donnerstag', timeLabel: '19:00 Uhr', description: 'Sechs Weine aus der Toskana, kleine Gänge aus der Küche und ein Abend, der Herkunft verständlich macht.', image: img.wine, priceLabel: '79 € p. P.', cta: { label: 'Platz anfragen', href: '/reservierung' } },
  { title: 'Pasta Masterclass', slug: 'pasta-masterclass', dateLabel: 'Ausgewählte Samstage', timeLabel: '11:00 Uhr', description: 'Wir zeigen Teig, Füllungen und Saucen im kleinen Kreis. Danach wird gemeinsam am langen Tisch gegessen.', image: img.kitchen, priceLabel: '145 € p. P.', cta: { label: 'Anfrage senden', href: '/reservierung' } },
  { title: 'Private Dinner', slug: 'private-dinner', dateLabel: 'Nach Vereinbarung', timeLabel: 'ab 18:00 Uhr', description: 'Für Geburtstage, Geschäftsessen oder Familienabende öffnen wir unseren Salon mit abgestimmtem Menü.', image: img.privateDining, priceLabel: 'auf Anfrage', cta: { label: 'Dinner planen', href: '/kontakt' } },
];

const faqItems = [
  { question: 'Sollten Sie reservieren?', answer: 'Ja, besonders abends, am Wochenende und für die Terrasse. Für spontane Gäste halten wir wenige Plätze frei, können sie aber nicht garantieren.' },
  { question: 'Gibt es vegetarische oder vegane Gerichte?', answer: 'Mehrere Gerichte sind vegetarisch. Vegane Anpassungen sind nach Möglichkeit machbar, wenn Sie uns bei der Reservierung kurz informieren.' },
  { question: 'Können Allergien berücksichtigt werden?', answer: 'Unser Serviceteam fragt Allergien aktiv ab. Da wir frisch kochen, können wir viele Gerichte anpassen; bei starken Allergien bitten wir um vorherige Rücksprache.' },
  { question: 'Sind Gruppen und private Feiern möglich?', answer: 'Ja. Für Gruppen ab acht Personen empfehlen wir ein abgestimmtes Menü. Unser Private-Dining-Bereich eignet sich für bis zu 24 Gäste.' },
];

function hero(headline, subline, bgImage, extra = {}) {
  return section('hero', {
    headline,
    subline,
    badgeText: extra.badgeText || 'Cucina italiana',
    badgeIcon: 'Sparkles',
    bgImage,
    bgImageMobile: bgImage,
    bgMode: 'image',
    bgPosition: extra.bgPosition || 'center 45%',
    bgPositionMobile: 'center center',
    overlayColor: '#160B07',
    overlayOpacity: extra.overlayOpacity ?? 0.62,
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
    primaryCta: extra.primaryCta || { label: 'Tisch reservieren', href: '/reservierung', icon: 'CalendarCheck' },
    secondaryCta: extra.secondaryCta || { label: 'Speisekarte ansehen', href: '/speisekarte', icon: 'Utensils' },
    trustItems: extra.trustItems || ['Pasta täglich von Hand', '180 italienische Weine', 'Private Dinner bis 24 Gäste'],
  }, heroStyle);
}

function cta(headline, subline, label = 'Tisch reservieren') {
  return section('immersiveCtaBanner', {
    badge: 'Reservierung',
    headline,
    subline,
    image: img.table,
    imageAlt: 'Gedeckter Tisch in der Trattoria Aurora',
    stats: [{ value: '70', label: 'Plätze' }, { value: '24', label: 'Private-Dinner-Gäste' }, { value: '180', label: 'Weine' }],
    primaryCta: { label, href: '/reservierung', icon: 'CalendarCheck' },
    secondaryCta: { label: 'Kontakt', href: '/kontakt', icon: 'MessageCircle' },
  }, darkSection);
}

function testimonials() {
  return section('testimonials', {
    badgeText: 'Gästestimmen',
    headline: 'Was Gäste an der Aurora schätzen',
    subline: 'Fiktive Stimmen für diesen Restaurant-Showcase, formuliert wie echte Empfehlungen.',
    items: [
      { name: 'Clara B.', quote: 'Wir kommen für die Pasta und bleiben wegen des Services. Jeder Gang fühlt sich persönlich empfohlen an.', rating: 5, context: 'Abendessen mit Freunden' },
      { name: 'Dr. Martin H.', quote: 'Der Weinabend war präzise, großzügig und ohne jede Steifheit. Genau so sollte Genussvermittlung sein.', rating: 5, context: 'Toskana-Weinabend' },
      { name: 'Sophie & Jan', quote: 'Unser Private Dinner war warm, ruhig und perfekt organisiert. Wir mussten uns um nichts kümmern.', rating: 5, context: 'Geburtstagsdinner' },
    ],
  }, lightSection);
}

function faq(headline = 'Häufige Fragen') {
  return section('faq', { headline, subline: 'Damit Ihr Besuch schon vor der Reservierung gut planbar ist.', items: faqItems }, altSection);
}

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      hero('Italienische Küche, die nach Ankommen schmeckt.', 'Trattoria Aurora ist ein warmer Ort für handgemachte Pasta, gute Weine und Abende, die nicht durchgetaktet wirken.', img.hero, { badgeText: 'München · seit 2008' }),
      section('signatureDishes', { badgeText: 'Empfehlungen', headline: 'Gerichte, für die Gäste wiederkommen.', subline: 'Drei Klassiker, die unsere Küche gut erklären: handwerklich, warm und ohne Show.', dishes: signatureDishes }, lightSection),
      section('templateAdvantage', {
        badge: 'Warum Aurora',
        headline: 'Ein Restaurant muss mehr können als satt machen.',
        subline: 'Wir gestalten Abende mit Ruhe: klare Empfehlungen, gute Taktung und eine Küche, die Herkunft nicht nur behauptet.',
        image: img.table,
        imageAlt: 'Warmer Gastraum mit gedeckten Tischen',
        cards: [
          { title: 'Pasta mit Geduld', text: 'Teig, Füllung und Saucen entstehen täglich frisch.' },
          { title: 'Weine mit Herkunft', text: 'Italienische Winzer, glasweise Empfehlungen und ehrliche Beratung.' },
          { title: 'Service ohne Hektik', text: 'Aufmerksam, aber nie aufdringlich. Genau richtig für lange Abende.' },
        ],
        benefits: ['Menüs für Gruppen', 'Terrasse im Sommer', 'Private Dining bis 24 Gäste'],
        cta: { label: 'Tisch reservieren', href: '/reservierung' },
      }, altSection),
      section('ambience', {
        badgeText: 'Ambiente',
        headline: 'Warm, lebendig, aber nie laut.',
        subline: 'Unser Gastraum ist gemacht für Gespräche: Holz, Kerzenlicht, offene Küche und genug Abstand zwischen den Tischen.',
        imagePrimary: img.table,
        imageSecondary: img.wine,
        imageTertiary: img.terrace,
        highlights: [
          { title: 'Salon für private Abende', text: 'Ein separater Bereich für Geburtstage, Firmenessen und Familienfeiern.', icon: 'DoorOpen' },
          { title: 'Terrasse im Sommer', text: 'Ruhige Plätze vor dem Haus, Aperitivo ab 17 Uhr und Abendsonne.', icon: 'Sun' },
          { title: 'Offene Küche', text: 'Pasta, Saucen und Dolci entstehen sichtbar und ohne Inszenierung.', icon: 'ChefHat' },
        ],
        ctaPrimary: { label: 'Galerie ansehen', href: '/galerie' },
      }, lightSection),
      section('events', { badgeText: 'Abende', headline: 'Kulinarische Formate mit Charakter.', subline: 'Weinabende, Masterclasses und private Dinner, die vorbereitet sind, aber locker bleiben.', events: eventItems }, altSection),
      testimonials(),
      section('newsPreview', { headline: 'Neues aus der Küche', subline: 'Saison, Weine, Veranstaltungen und kleine Einblicke hinter die Kulissen.', collectionKey: 'news', linkLabel: 'Alle Beiträge lesen', linkHref: '/news', collectionBasePath: '/c/news' }, lightSection),
      cta('Lust auf einen Tisch in der Aurora?', 'Reservieren Sie direkt oder schreiben Sie uns für Gruppen und besondere Anlässe.'),
    ],
  },
  {
    slug: 'speisekarte',
    title: 'Speisekarte',
    sections: [
      hero('Speisekarte ohne Umwege.', 'Pasta von Hand, saisonale Teller, italienische Weine und Dolci, die den Abend rund machen.', img.plate, { badgeText: 'La carta', bgPosition: 'center 48%' }),
      section('menu', { badgeText: 'Aktuelle Karte', headline: 'La carta.', subline: 'Unsere Karte bleibt bewusst übersichtlich. Was darauf steht, soll frisch, gut erklärbar und sauber gekocht sein.', footnote: 'Alle Preise inkl. MwSt. Allergene nennen wir transparent; bitte sprechen Sie uns vor Ort an.', categories: menuCategories }, lightSection),
      section('collectionList', { collectionKey: 'speisekarte', headline: 'Mehr Kontext zu unseren Bereichen', subline: 'Für Gäste, die vorab genauer wissen möchten, was sie erwartet.', displayMode: 'cards', ctaLabel: 'Mehr lesen' }, altSection),
      section('spotlightCards', {
        badge: 'Wein & Aperitivo',
        headline: 'Nicht jeder Abend braucht ein großes Menü.',
        subline: 'Manchmal reichen ein guter Aperitivo, zwei kleine Teller und ein Wein, der den Tag sortiert.',
        cards: [
          { title: 'Aperitivo ab 17 Uhr', text: 'Kleine Karte, gute Drinks, entspannter Start in den Abend.', icon: 'Wine' },
          { title: 'Glasweise Empfehlungen', text: 'Weine aus Italien, die wir erklären können, ohne zu belehren.', icon: 'Grape' },
          { title: 'Dolci & Espresso', text: 'Tiramisù, Affogato und Cannoli für den Abschluss.', icon: 'Coffee' },
        ],
      }, darkSection),
      faq('Fragen zur Speisekarte'),
      cta('Soll es ein Tisch werden?', 'Wenn Sie Allergien oder Wünsche haben, nennen Sie sie am besten direkt bei der Reservierung.'),
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    sections: [
      hero('Ein italienischer Abend braucht Haltung.', 'Aurora steht für Küche mit Herkunft, Service mit Ruhe und ein Haus, das Menschen gern wiedersehen.', img.kitchen, { badgeText: 'Über uns', bgPosition: 'center 38%' }),
      section('textImage', {
        badge: 'Unsere Geschichte',
        headline: 'Aus einer kleinen Pasta-Bar wurde ein Ort für lange Abende.',
        text: '<p>Die Trattoria Aurora begann als schmale Pasta-Bar in Schwabing. Heute ist sie ein Restaurant mit Salon, Terrasse und einer Karte, die sich nicht größer macht, als sie sein muss.</p><p>Unser Anspruch ist einfach: gute Produkte, saubere Technik, ein wacher Service und ein Abend, bei dem niemand das Gefühl hat, abgefertigt zu werden.</p>',
        image: img.team,
        imageAlt: 'Küchenteam im Restaurant',
        layout: 'image-left',
        primaryCta: { label: 'Tisch reservieren', href: '/reservierung' },
      }, lightSection),
      section('principlesGrid', {
        badge: 'Was uns wichtig ist',
        headline: 'Gute Gastronomie beginnt vor dem ersten Teller.',
        subline: 'Unsere Prinzipien entscheiden, ob ein Abend leicht wirkt oder angestrengt.',
        principles: [
          { eyebrow: '01', title: 'Weniger Karte, mehr Fokus', text: 'Wir kochen lieber weniger Gerichte gut als viele Gerichte beliebig.' },
          { eyebrow: '02', title: 'Service mit Gespür', text: 'Aufmerksamkeit heißt für uns: da sein, bevor es laut werden muss.' },
          { eyebrow: '03', title: 'Wein verständlich machen', text: 'Keine Fachsprache, sondern ehrliche Empfehlungen zum Essen und zur Stimmung.' },
          { eyebrow: '04', title: 'Gruppen sauber planen', text: 'Menüs, Timing und Raum werden vorab geklärt, damit der Abend frei bleibt.' },
        ],
        cta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
      }, altSection),
      section('team', {
        headline: 'Menschen hinter der Aurora',
        subline: 'Küche, Service und Wein arbeiten bei uns nicht nebeneinander, sondern an einem gemeinsamen Abend.',
        members: [
          { name: 'Lucia Romano', role: 'Gastgeberin', bio: 'Lucia führt den Gastraum mit Ruhe, Aufmerksamkeit und dem Blick für den richtigen Moment.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&q=85' },
          { name: 'Matteo Ricci', role: 'Küchenchef', bio: 'Matteo verbindet klassische italienische Technik mit präziser, saisonaler Produktküche.', image: img.kitchen },
          { name: 'Marco Bellini', role: 'Sommelier', bio: 'Marco kuratiert unsere Weinkarte und findet zu jedem Gang die passende Herkunft.', image: img.wine },
        ],
      }, lightSection),
      testimonials(),
      cta('Kommen Sie vorbei.', 'Ob erster Besuch oder Stammplatz: Wir freuen uns auf Ihren Abend.'),
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    sections: [
      hero('Abende, die mehr sind als ein Menü.', 'Weinproben, Pasta-Kurse, Private Dinner und kleine Feiern mit klarem Ablauf und warmer Atmosphäre.', img.privateDining, { badgeText: 'Events & Private Dining' }),
      section('events', { badgeText: 'Kalender', headline: 'Formate, die zu unserem Haus passen.', subline: 'Jedes Format ist klein genug, um persönlich zu bleiben, und gut genug geplant, um entspannt zu wirken.', events: eventItems }, lightSection),
      section('resourceBookingShowcase', {
        badge: 'Private Dining',
        headline: 'Ein eigener Raum für Ihren Abend.',
        subline: 'Unser Salon eignet sich für Geburtstage, Team-Dinner, Familienfeiern und kleine Präsentationen.',
        resources: [
          { name: 'Salon Aurora', type: 'Raum', capacity: 'bis 24 Gäste', description: 'Separater Bereich mit langem Tisch, eigenem Service und Menüabstimmung.' },
          { name: 'Terrasse', type: 'Saison', capacity: 'bis 30 Gäste', description: 'Ideal für Aperitivo, Sommerabende und lockere Gruppen.' },
          { name: 'Großer Tisch', type: 'Tafel', capacity: '8-14 Gäste', description: 'Mitten im Gastraum, nah an Küche und Weinbar.' },
        ],
        steps: [{ title: 'Anfrage senden' }, { title: 'Menü abstimmen' }, { title: 'Abend genießen' }],
        ctaLabel: 'Event anfragen',
        ctaHref: '/kontakt',
      }, altSection),
      section('comparisonCardsPro', {
        badge: 'Optionen',
        headline: 'Drei Wege zu einem guten Abend.',
        subline: 'Wir halten die Pakete bewusst klar, damit Planung und Erwartung zusammenpassen.',
        plans: [
          { name: 'Weinabend', price: 'ab 79 € p. P.', note: 'für kleine Gruppen', highlighted: false, features: ['6 Weine', 'kleine Gänge', 'Moderation'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
          { name: 'Private Dinner', price: 'auf Anfrage', note: 'für 10-24 Gäste', highlighted: true, features: ['eigenes Menü', 'Weinbegleitung optional', 'separater Salon'], ctaLabel: 'Planen', ctaHref: '/kontakt' },
          { name: 'Pasta Class', price: 'ab 145 € p. P.', note: 'Hands-on', highlighted: false, features: ['kleine Gruppe', 'gemeinsames Essen', 'Rezeptkarten'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
        ],
      }, lightSection),
      faq('Fragen zu Events'),
      cta('Planen wir Ihren Abend?', 'Nennen Sie Anlass, Gästezahl und Wunschtermin. Wir melden uns mit einem konkreten Vorschlag.', 'Event anfragen'),
    ],
  },
  {
    slug: 'galerie',
    title: 'Galerie',
    sections: [
      hero('Einblicke in die Aurora.', 'Gastraum, Küche, Weinbar und Terrasse: So fühlt sich ein Abend bei uns an.', img.terrace, { badgeText: 'Galerie' }),
      section('galleryGrid', {
        badgeText: 'Impressionen',
        headline: 'Bilder, die Appetit auf den Abend machen.',
        subline: 'Keine Stock-Perfektion, sondern Räume, Teller und Details, die unser Haus erzählen.',
        images: [
          { src: img.table, alt: 'Warmer Gastraum mit gedeckten Tischen', caption: 'Gastraum', category: 'Ambiente' },
          { src: img.pasta, alt: 'Frische Pasta mit Trüffel', caption: 'Pasta', category: 'Küche' },
          { src: img.wine, alt: 'Weinflaschen und Barlicht', caption: 'Weinbar', category: 'Wein' },
          { src: img.kitchen, alt: 'Küche bei der Vorbereitung', caption: 'Offene Küche', category: 'Küche' },
          { src: img.terrace, alt: 'Restaurantterrasse am Abend', caption: 'Terrasse', category: 'Ambiente' },
          { src: img.dessert, alt: 'Dessert mit Kaffee', caption: 'Dolci', category: 'Küche' },
        ],
      }, lightSection),
      section('atmosphereGallery', {
        badge: 'Stimmung',
        headline: 'Für Aperitivo, Dinner und lange Gespräche.',
        subline: 'Die Aurora ist kein schneller Zwischenstopp. Sie ist ein Ort, der den Abend tragen soll.',
        images: [
          { src: img.espresso, title: 'Espresso am Ende', text: 'Klein, stark und nicht verhandelbar.' },
          { src: img.privateDining, title: 'Salon für Gruppen', text: 'Separat, aber nicht abgetrennt vom Haus.' },
          { src: img.antipasti, title: 'Zum Teilen', text: 'Antipasti, die den Tisch öffnen.' },
        ],
      }, altSection),
      cta('Gefällt Ihnen die Stimmung?', 'Dann reservieren Sie einen Tisch oder fragen Sie den Salon für private Abende an.'),
    ],
  },
  {
    slug: 'reservierung',
    title: 'Reservierung',
    sections: [
      hero('Tisch reservieren.', 'Für zwei Personen, Gruppen oder besondere Anlässe: Wir melden uns mit Bestätigung und Rückfragen.', img.table, { badgeText: 'Reservierung', primaryCta: { label: 'Anfrage senden', href: '#reservierung', icon: 'Send' }, secondaryCta: { label: 'Anrufen', href: `tel:${phone.replaceAll(' ', '')}`, icon: 'Phone' } }),
      section('reservation', {
        headline: 'Ihre Anfrage an die Aurora',
        subline: 'Wir bestätigen Reservierungen persönlich. Für Gruppen ab acht Personen stimmen wir Menü und Ablauf vorab ab.',
        introText: 'Bitte nennen Sie Datum, Uhrzeit, Personenanzahl und besondere Wünsche. Bei Allergien oder Anlass helfen kurze Hinweise.',
        externalBookingCta: { label: 'Anfrage senden', href: '/kontakt' },
        phoneCta: { label: phone, href: `tel:${phone.replaceAll(' ', '')}` },
        timeHint: 'Reservierungen für denselben Tag bitte telefonisch anfragen.',
      }, lightSection),
      section('openingHours', {
        headline: 'Öffnungszeiten',
        subline: 'Warme Küche bis 30 Minuten vor Schluss.',
        kitchenHoursHeadline: 'Küchenzeiten',
        kitchenHoursText: 'Mittags 11:30-14:30 Uhr, abends 17:30-22:00 Uhr.',
        days: [
          { label: 'Montag', hours: 'Ruhetag', closed: true },
          { label: 'Dienstag bis Freitag', hours: '11:30-14:30 und 17:30-23:00 Uhr' },
          { label: 'Samstag', hours: '17:30-23:30 Uhr' },
          { label: 'Sonntag', hours: '11:30-22:00 Uhr' },
        ],
        holidayNote: 'An Feiertagen gelten Sonderzeiten. Bitte kurz anrufen.',
        ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
      }, altSection),
      faq('Fragen zur Reservierung'),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    sections: [
      hero('Kontakt zur Trattoria Aurora.', 'Reservierung, Gruppe, Presse oder Frage zur Karte: Schreiben Sie uns oder rufen Sie direkt an.', img.wine, { badgeText: 'Kontakt' }),
      section('contact', {
        headline: 'Schreiben Sie uns.',
        subline: 'Wir antworten persönlich und möglichst konkret.',
        formEnabled: true,
        mapEmbedUrl: mapsEmbed,
        address,
        phone,
        email,
      }, lightSection),
      section('additionalLocations', {
        badge: 'Standort',
        headline: 'Mitten in Schwabing.',
        subline: 'Gut erreichbar mit U-Bahn, Tram und wenigen Gehminuten aus der Maxvorstadt.',
        locations: [
          { name: 'Trattoria Aurora', address, phone, email, mapEmbedUrl: mapsEmbed, note: 'Gastraum, Terrasse und Salon' },
        ],
      }, altSection),
      cta('Noch Fragen vor dem Besuch?', 'Wir helfen gern, bevor Sie reservieren.'),
    ],
  },
  {
    slug: 'news',
    title: 'Journal',
    sections: [
      hero('Journal aus der Aurora.', 'Saisonale Notizen, neue Formate und kleine Geschichten aus Küche, Weinbar und Gastraum.', img.espresso, { badgeText: 'Journal' }),
      section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Was gerade im Haus passiert.', collectionKey: 'news', collectionBasePath: '/c/news', linkPrefix: '/c/news' }, lightSection),
      cta('Direkt statt nur lesen?', 'Reservieren Sie einen Tisch und erleben Sie die Aurora selbst.'),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    sections: [
      section('legalContent', {
        title: 'Impressum',
        sections: [
          { heading: 'Angaben gemäß § 5 TMG', content: 'Trattoria Aurora GmbH\nSchellingstraße 48\n80799 München' },
          { heading: 'Kontakt', content: `${phone}\n${email}` },
          { heading: 'Vertreten durch', content: 'Lucia Romano' },
        ],
      }, lightSection),
    ],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    sections: [
      section('legalContent', {
        title: 'Datenschutz',
        sections: [
          { heading: 'Datenschutz auf einen Blick', content: 'Diese Demo-Seite zeigt beispielhafte Datenschutzinhalte. In einem echten Projekt werden alle Angaben juristisch geprüft und tenant-spezifisch ergänzt.' },
          { heading: 'Kontaktformular', content: 'Wenn Sie uns über das Formular kontaktieren, verwenden wir Ihre Angaben zur Bearbeitung der Anfrage.' },
        ],
      }, lightSection),
    ],
  },
];

const menuItems = [
  {
    title: 'Antipasti zum Teilen',
    slug: 'antipasti-zum-teilen',
    excerpt: 'Burrata, Vitello, Carpaccio und kleine Teller, die den Abend öffnen.',
    image: img.antipasti,
    sections: [
      hero('Antipasti zum Teilen.', 'Kleine Teller, warme Brote und ein Anfang, der den Tisch sofort zusammenbringt.', img.antipasti, { badgeText: 'Speisekarte' }),
      section('freeText', { content: '<p>Unsere Antipasti sind bewusst zum Teilen gedacht. Sie funktionieren als leichter Start für zwei Personen, als Aperitivo mit Wein oder als Auftakt für Gruppen.</p><p>Wir empfehlen: Burrata Pugliese, Vitello tonnato und Antipasti della casa für zwei.</p>' }, lightSection),
      cta('Antipasti am liebsten am Tisch?', 'Reservieren Sie Ihren Platz und sagen Sie uns, ob Sie teilen möchten.'),
    ],
  },
  {
    title: 'Pasta fatta in casa',
    slug: 'pasta-fatta-in-casa',
    excerpt: 'Frische Pasta, täglich neu angesetzt, gefüllt, geschnitten und abgestimmt.',
    image: img.pasta,
    sections: [
      hero('Pasta fatta in casa.', 'Teig, Füllung und Sauce entstehen bei uns täglich frisch.', img.pasta, { badgeText: 'Pasta' }),
      section('freeText', { content: '<p>Pasta ist für uns kein Beilagenhandwerk, sondern der Kern der Küche. Wir arbeiten mit Ei, Hartweizen, Ricotta, Kräutern und Saucen, die den Teig nicht überdecken.</p><p>Besonders beliebt sind Tagliolini al tartufo und Ravioli mit Ricotta und Amalfi-Zitrone.</p>' }, lightSection),
      cta('Pasta-Abend planen?', 'Für Gruppen stimmen wir Pasta-Gänge auch als Menü ab.'),
    ],
  },
  {
    title: 'Dolci und Espresso',
    slug: 'dolci-und-espresso',
    excerpt: 'Tiramisù, Cannoli, Panna Cotta und Espresso als ruhiger Abschluss.',
    image: img.dessert,
    sections: [
      hero('Dolci und Espresso.', 'Der Abschluss soll klein wirken und lange bleiben.', img.dessert, { badgeText: 'Dolci' }),
      section('freeText', { content: '<p>Unser Tiramisù ruht 24 Stunden, Cannoli werden frisch gefüllt und Affogato ist bei uns kein Dessert zweiter Wahl.</p><p>Für private Dinner bereiten wir Dolci auch als kleine Auswahl für den Tisch vor.</p>' }, lightSection),
      cta('Noch Platz für Dolci?', 'Reservieren Sie einen Tisch und lassen Sie den Abend ruhig ausklingen.'),
    ],
  },
];

const newsItems = [
  {
    title: 'Warum wir die Karte bewusst kleiner halten',
    slug: 'kleinere-karte-mehr-fokus',
    excerpt: 'Eine gute Speisekarte muss nicht alles können. Sie muss klar sein.',
    image: img.plate,
    content: '<p>Eine kleinere Karte ist kein Verzicht, sondern eine Entscheidung. Sie erlaubt uns, Produkte frisch einzukaufen, Pasta täglich neu zu machen und Saucen so zu führen, dass sie nicht beliebig werden.</p><p>Für Gäste bedeutet das: weniger Scrollen, mehr Vertrauen. Unser Service erklärt gern, was heute besonders gut ist.</p>',
  },
  {
    title: 'Toskana-Weinabend: was Sie erwartet',
    slug: 'toskana-weinabend',
    excerpt: 'Sechs Weine, kleine Gänge und ein Abend ohne steife Weinsprache.',
    image: img.wine,
    content: '<p>Unser Toskana-Weinabend ist kein Vortrag, sondern ein gemeinsamer Tisch. Wir probieren sechs Weine, ordnen Herkunft und Stil ein und servieren dazu kleine Gänge aus der Küche.</p><p>Ideal für Gäste, die Wein mögen, aber keine Lust auf Fachchinesisch haben.</p>',
  },
  {
    title: 'Private Dining im Salon Aurora',
    slug: 'private-dining-salon-aurora',
    excerpt: 'Wie wir Gruppenabende planen, damit sie locker bleiben.',
    image: img.privateDining,
    content: '<p>Private Dining funktioniert nur, wenn Ablauf, Menü und Raum vorher geklärt sind. Deshalb sprechen wir vorab über Anlass, Tempo, Unverträglichkeiten und den richtigen Grad an Service.</p><p>Unser Salon passt für bis zu 24 Gäste und bleibt nah am Restaurant, ohne mitten im Gastraum zu liegen.</p>',
  },
];

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug) || (page.slug === 'events' ? existingPages.find((p) => p.slug === 'referenzen') : null);
  const payload = { slug: page.slug, title: page.title, sections: page.sections };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, existingCollections) {
  const found = existingCollections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/restaurant')) {
      copy[key] = `/demo/restaurant${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

async function clearCollectionItems(key, existingCollections) {
  const collection = existingCollections.find((c) => c.key === key);
  if (!collection) return;
  for (const item of collection.items || []) {
    await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  }
}

async function replaceCollectionItems(key, items, existingCollections) {
  const collection = await ensureCollection(key, key === 'news' ? 'Journal' : key === 'events' ? 'Events' : 'Speisekarte', existingCollections);
  for (const item of collection.items || []) {
    await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  }
  for (const item of items) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || item.description || '',
      published: true,
      data: {
        image: item.image,
        date: item.date || '2026-06-04',
        author: 'Trattoria Aurora',
        sections: prefixDemoLinks(item.sections || [
          hero(item.title, item.excerpt || '', item.image, { badgeText: key === 'news' ? 'Journal' : 'Event' }),
          section('freeText', { content: item.content || `<p>${item.excerpt || item.description || ''}</p>` }, lightSection),
          cta('Möchten Sie mehr wissen?', 'Reservieren Sie einen Tisch oder schreiben Sie uns direkt.'),
        ]),
      },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', {
    companyName: 'Trattoria Aurora',
    tagline: 'Cucina italiana in München-Schwabing',
    primaryColor: colors.brown,
    secondaryColor: colors.green,
    accentColor: colors.gold,
    logo: '',
  });
  await api('PUT', '/api/v1/content/design', {
    textPrimary: colors.text,
    textSecondary: colors.textSoft,
    sectionBg: colors.cream,
    sectionBgAlt: colors.creamAlt,
    cardBg: colors.card,
    cardBorder: colors.border,
    badgeBg: '#F7E2C7',
    badgeText: colors.brown,
    badgeBorder: colors.border,
    brand: colors.brown,
    accent: colors.gold,
    heading: colors.text,
    subheading: colors.textSoft,
    body: colors.textSoft,
    muted: '#8B7064',
    icon: colors.brown,
    btnBg: colors.brown,
    btnText: colors.onDark,
    dividerColor: colors.border,
    eyebrow: colors.copper,
    statValue: colors.brown,
    quote: colors.text,
    ratingStar: colors.gold,
    check: colors.green,
    onDarkHeading: colors.onDark,
    onDarkBody: colors.onDarkSoft,
    onDarkMuted: '#D9BFA8',
  });
  await api('PUT', '/api/v1/content/contact', {
    phone,
    email,
    address,
    whatsappEnabled: true,
    whatsapp: '+498921989740',
    whatsappColor: colors.green,
  });
  await api('PUT', '/api/v1/content/navigation', {
    items: navItems,
    cta: { label: 'Tisch anfragen', href: '/reservierung' },
  });
  await api('PUT', '/api/v1/content/footer', {
    columns: [
      { title: 'Restaurant', items: [{ text: 'Speisekarte', href: '/speisekarte' }, { text: 'Über uns', href: '/ueber-uns' }, { text: 'Galerie', href: '/galerie' }] },
      { title: 'Besuch', items: [{ text: 'Reservierung', href: '/reservierung' }, { text: 'Events', href: '/events' }, { text: 'Kontakt', href: '/kontakt' }] },
      { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Tisch reservieren', href: '/reservierung' },
  });
  await api('PUT', '/api/v1/content/opening-hours', {
    hours: [
      { type: 'regular', day: 'Montag', closed: true, note: 'Ruhetag' },
      { type: 'regular', day: 'Dienstag bis Freitag', hours: '11:30-14:30 und 17:30-23:00 Uhr' },
      { type: 'regular', day: 'Samstag', hours: '17:30-23:30 Uhr' },
      { type: 'regular', day: 'Sonntag', hours: '11:30-22:00 Uhr' },
    ],
  });
  await api('PUT', '/api/v1/content/form-fields', {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', halfWidth: true },
      { name: 'topic', label: 'Anliegen', type: 'select', options: ['Tisch reservieren', 'Private Dinner', 'Event', 'Presse / Sonstiges'], halfWidth: true },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
  });
  await api('PUT', '/api/v1/content/social-links', {
    instagram: 'https://instagram.com/trattoriaaurora',
    facebook: 'https://facebook.com/trattoriaaurora',
    google: 'https://maps.google.com',
  });
  await api('PUT', '/api/v1/content/seo', {
    titleTemplate: '%s · Trattoria Aurora München',
    defaultDescription: 'Trattoria Aurora in München-Schwabing: handgemachte Pasta, italienische Weine, warme Atmosphäre, Events und Private Dining.',
    canonicalBase: 'https://flamingo-renderer.vercel.app/demo/restaurant',
    locale: 'de_DE',
  });

  for (const page of pages) await upsertPage(page, pagesBefore.pages || []);

  await clearCollectionItems('leistungen', collectionsBefore);
  await clearCollectionItems('referenzen', collectionsBefore);
  await clearCollectionItems('journal', collectionsBefore);
  await replaceCollectionItems('speisekarte', menuItems, collectionsBefore);
  await replaceCollectionItems('events', eventItems.map((event) => ({
    title: event.title,
    slug: event.slug,
    excerpt: event.description,
    image: event.image,
    sections: [
      hero(event.title, event.description, event.image, { badgeText: event.dateLabel }),
      section('events', { headline: 'Details zum Format', events: [event] }, lightSection),
      section('freeText', { content: `<p>${event.description}</p><p><strong>${event.dateLabel}</strong>${event.timeLabel ? ` · ${event.timeLabel}` : ''}${event.priceLabel ? ` · ${event.priceLabel}` : ''}</p>` }, lightSection),
      cta('Möchten Sie dabei sein?', 'Senden Sie uns Ihre Anfrage. Wir melden uns mit Verfügbarkeit und Details.'),
    ],
  })), collectionsBefore);
  await replaceCollectionItems('news', newsItems, collectionsBefore);

  const refreshedPages = await api('GET', '/api/v1/content/pages');
  for (const page of refreshedPages.pages || []) {
    const metaBySlug = {
      '': ['Trattoria Aurora München', 'Handgemachte italienische Küche, Weinbar, Terrasse und Private Dining in München-Schwabing.'],
      speisekarte: ['Speisekarte', 'Pasta, Antipasti, Fisch, Fleisch, Dolci und italienische Weine in der Trattoria Aurora.'],
      'ueber-uns': ['Über uns', 'Die Geschichte und Haltung der Trattoria Aurora in München-Schwabing.'],
      events: ['Events & Private Dining', 'Weinabende, Pasta Masterclasses und private Dinner in der Trattoria Aurora.'],
      galerie: ['Galerie', 'Einblicke in Gastraum, Küche, Weinbar und Terrasse der Trattoria Aurora.'],
      reservierung: ['Reservierung', 'Tisch, Gruppe oder Private Dinner in der Trattoria Aurora anfragen.'],
      kontakt: ['Kontakt', 'Kontakt, Adresse und Anfrageformular der Trattoria Aurora in München.'],
      news: ['Journal', 'Saisonale Notizen, Events und Neuigkeiten aus der Trattoria Aurora.'],
    }[page.slug];
    if (metaBySlug) {
      await api('PUT', `/api/v1/content/seo/${page.id}`, {
        metaTitle: `${metaBySlug[0]} · Trattoria Aurora`,
        metaDescription: metaBySlug[1],
        ogImage: img.hero,
        noindex: false,
      });
    }
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
