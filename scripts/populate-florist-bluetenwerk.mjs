const token = process.env.FLM_FLORIST_TOKEN || 'flm_pat_935438f29f41f72caeb3b16e252769bd67e91a599c369b06a4e8b1514432d923';
const baseUrl = 'https://flamingo-renderer.vercel.app';

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}\n${text}`);
  return text ? JSON.parse(text) : null;
}

const id = () => crypto.randomUUID();
const section = (type, data, styleOverrides = {}) => ({ id: id(), type, data, styleOverrides });

const img = {
  hero: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=2200&q=85',
  atelier: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1800&q=85',
  bouquetBride: 'https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=85',
  bouquetSpring: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=85',
  bouquetGreen: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=1600&q=85',
  bouquetWinter: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1600&q=85',
  wreath: 'https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=1600&q=85',
  plants: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1600&q=85',
  workshop: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=85',
  event: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
  table: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85',
  bride: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=85',
  team1: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=85',
  team2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85',
  team3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&q=85',
  rose: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1400&q=85',
  peony: 'https://images.unsplash.com/photo-1525772764200-be829a350797?w=1400&q=85',
  ranunculus: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=1400&q=85',
  eucalyptus: 'https://images.unsplash.com/photo-1469259943454-aa100abba749?w=1400&q=85',
};

const colors = {
  ink: '#241420',
  soft: '#5C3B4D',
  muted: '#8B6E81',
  cream: '#FBF6F2',
  blush: '#F2DCE3',
  card: '#FFFCF8',
  border: '#E5CDD4',
  burgundy: '#7A1F3D',
  rose: '#BE185D',
  pink: '#F9A8D4',
  onDark: '#FFF1EE',
  onDarkSoft: '#F0CFD6',
};

const light = { sectionBg: colors.cream, cardBg: colors.card, cardBorder: colors.border, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.rose, accentColor: colors.rose, btnBg: colors.burgundy, btnText: colors.onDark, badgeBg: colors.blush, badgeText: colors.burgundy, badgeBorder: colors.border, borderColor: colors.border };
const alt = { ...light, sectionBg: colors.blush, cardBg: colors.cream };
const dark = { sectionBg: colors.burgundy, cardBg: 'rgba(255,241,238,0.10)', cardBorder: 'rgba(255,241,238,0.24)', heading: colors.onDark, body: colors.onDarkSoft, muted: '#E5BDC4', icon: colors.pink, accentColor: colors.pink, btnBg: colors.pink, btnText: colors.burgundy, badgeBg: 'rgba(255,241,238,0.14)', badgeText: colors.onDark, borderColor: 'rgba(255,241,238,0.22)', onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#E5BDC4' };
const heroStyle = { heroHeading: colors.onDark, heroBody: colors.onDarkSoft, badgeBg: 'rgba(255,241,238,0.16)', badgeText: colors.onDark, badgeBorder: 'rgba(255,241,238,0.32)', btnBg: colors.pink, btnText: colors.burgundy, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#E5BDC4' };

const phone = '+49 89 4455 2211';
const email = 'hello@bluetenwerk-atelier.de';
const address = 'Gärtnerplatz 8, 80469 München';
const mapsEmbed = 'https://www.google.com/maps?q=G%C3%A4rtnerplatz%208%2C%2080469%20M%C3%BCnchen&output=embed';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Sträuße', href: '/straeusse', type: 'link' },
  { label: 'Hochzeiten', href: '/hochzeiten', type: 'link' },
  { label: 'Workshops', href: '/workshops', type: 'link' },
  { label: 'Saison', href: '/saison', type: 'link' },
  { label: 'Über uns', href: '/ueber-uns', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const bouquets = [
  { title: 'Brautstrauß Soft Romance', slug: 'brautstrauss-soft-romance', excerpt: 'Pfingstrosen, Ranunkeln und Eukalyptus in weichen Cremetönen für den Tag, der zählt.', image: img.bouquetBride, category: 'Hochzeit', priceLabel: 'ab 220 €' },
  { title: 'Saisonstrauß Frühling', slug: 'saisonstrauss-fruehling', excerpt: 'Tulpen, Anemonen und Narzissen direkt vom Hofgärtner in pastelliger Wildform.', image: img.bouquetSpring, category: 'Saison', priceLabel: 'ab 58 €' },
  { title: 'Green & Wild', slug: 'green-wild', excerpt: 'Grüne Komposition mit Olivenzweigen, wilden Gräsern und einzelnen Akzenten.', image: img.bouquetGreen, category: 'Lifestyle', priceLabel: 'ab 65 €' },
  { title: 'Winterzauber', slug: 'winterzauber', excerpt: 'Tannengrün, weiße Rosen und Beeren für die ruhige Jahreszeit.', image: img.bouquetWinter, category: 'Winter', priceLabel: 'ab 72 €' },
];

const workshops = [
  { title: 'Workshop "Frühlingskranz"', slug: 'workshop-fruehlingskranz', excerpt: 'Wir binden gemeinsam einen lockeren Kranz aus Saisonblumen und Grün.', image: img.workshop, durationLabel: '3 Std.', priceLabel: 'ab 89 €' },
  { title: 'Workshop "Brautstrauß"', slug: 'workshop-brautstrauss', excerpt: 'Für Bräute & Trauzeuginnen: einen kleinen Strauß selbst binden lernen.', image: img.bouquetBride, durationLabel: '4 Std.', priceLabel: 'ab 149 €' },
  { title: 'Workshop "Adventskranz"', slug: 'workshop-adventskranz', excerpt: 'Ein moderner Adventskranz, der das Wohnzimmer nicht überstilisiert.', image: img.wreath, durationLabel: '2,5 Std.', priceLabel: 'ab 79 €' },
];

const newsItems = [
  { title: 'Warum saisonal binden den Unterschied macht', slug: 'saisonal-binden', excerpt: 'Was Saisonblumen pflegeleichter, schöner und nachhaltiger macht.', image: img.bouquetSpring, content: '<p>Saisonblumen sind nicht nur ein Trend, sondern eine Haltung. Sie reisen kürzer, halten länger und passen optisch besser zum Moment, in dem sie blühen.</p><p>Bei uns kommen 80 Prozent der Schnittblumen direkt aus dem Münchner Umland. Das bedeutet kürzere Wege, frischeres Material und realistische Preise.</p>' },
  { title: 'Was eine gute Hochzeitsfloristik kostet — und warum', slug: 'hochzeitsfloristik-preise', excerpt: 'Transparente Einblicke in Material, Aufbau und Zeit.', image: img.bouquetBride, content: '<p>Hochzeitsfloristik ist nicht teuer, weil "Hochzeit" draufsteht, sondern weil sie Zeit, Logistik und Material verbindet.</p><p>Wir kalkulieren immer offen: Material, Aufbau, Anfahrt, Auf- und Abbau. So weißt du genau, wofür dein Budget arbeitet.</p>' },
  { title: 'Pflegetipps für deinen Strauß', slug: 'pflegetipps-strauss', excerpt: 'Kleine Routinen, die deinen Strauß doppelt so lange halten lassen.', image: img.atelier, content: '<p>Wasser täglich wechseln, Stiele schräg anschneiden, Vase sauber halten — das sind die drei wichtigsten Punkte.</p><p>Vermeide direktes Sonnenlicht und stelle den Strauß nicht neben Obst. Ethylen lässt Blumen schneller welken.</p>' },
];

function hero(headline, subline, image, extra = {}) {
  return section('floristHero', {
    eyebrow: extra.eyebrow || 'Blütenwerk Atelier',
    headline, subline, image,
    bgImage: image,
    glowColor: 'rgba(190,24,93,0.42)',
    overlay: 'rgba(36,20,32,0.55)',
    primaryCta: extra.primaryCta || { label: 'Beratung anfragen', href: '/kontakt' },
    secondaryCta: extra.secondaryCta || { label: 'Sträuße ansehen', href: '/straeusse' },
    facts: extra.facts || [
      { value: 'Saison', label: 'Material direkt aus dem Umland' },
      { value: 'Handwerk', label: 'Jeder Strauß einzeln gebunden' },
      { value: 'Hochzeit', label: 'Komplette florale Begleitung' },
    ],
  }, heroStyle);
}

function bouquetShowcase() {
  return section('bouquetShowcase', {
    headline: 'Sträuße aus dem Atelier.',
    subline: 'Vier aktuelle Lieblinge — saisonal, locker und immer von Hand gebunden.',
    columns: 4,
    items: bouquets.map(b => ({ title: b.title, description: b.excerpt, image: b.image, price: b.priceLabel, badge: b.category, href: `/c/straeusse/${b.slug}` })),
  }, light);
}

function occasionMosaic() {
  return section('occasionMosaic', {
    headline: 'Anlässe, die Blumen verdienen.',
    subline: 'Von kleinen Gesten bis zum großen Tag.',
    items: [
      { title: 'Hochzeit', image: img.bouquetBride, href: '/hochzeiten' },
      { title: 'Geburtstag', image: img.bouquetSpring, href: '/c/straeusse/saisonstrauss-fruehling' },
      { title: 'Trauer', image: img.wreath, href: '/kontakt' },
      { title: 'Eventfloristik', image: img.event, href: '/hochzeiten' },
      { title: 'Saison & Advent', image: img.bouquetWinter, href: '/saison' },
      { title: 'Workshops', image: img.workshop, href: '/workshops' },
    ],
  }, alt);
}

function weddingShowroom() {
  return section('weddingFloristry', {
    headline: 'Hochzeitsfloristik mit Plan, nicht nur mit Pinterest.',
    subline: 'Wir begleiten von der ersten Idee bis zum letzten Tischlauf — Brautstrauß, Anstecker, Trauung, Tische und Deko.',
    image: img.bride,
    overlayOpacity: 0.55,
    highlights: [
      { title: 'Beratung mit Moodboard', text: 'Wir nehmen uns Zeit, Farben und Formen ehrlich auf eure Location abzustimmen.' },
      { title: 'Komplette Planung', text: 'Brautstrauß, Anstecker, Trauungsbogen, Tische und Sweet Table aus einer Hand.' },
      { title: 'Aufbau am Tag', text: 'Wir sind selbst vor Ort, bauen auf und ab, damit ihr nichts organisieren müsst.' },
    ],
    cta: { label: 'Hochzeitsanfrage senden', href: '/kontakt' },
  }, dark);
}

function workshopBooking() {
  return section('workshopBooking', {
    headline: 'Workshops, die wirklich Spaß machen.',
    subline: 'Kleine Gruppen, gutes Material, ehrliche Einführung. Du gehst mit einem fertigen Werk und neuen Skills nach Hause.',
    image: img.workshop,
    services: [
      { title: 'Saisonkränze', description: 'Wir binden Kränze aus aktuellen Materialien — locker, modern, nicht steif.', icon: 'Leaf' },
      { title: 'Brautstrauß-Workshop', description: 'Für Bräute, die ihren Strauß selbst binden möchten — mit Begleitung.', icon: 'Heart' },
      { title: 'Adventskranz Modern', description: 'Ein Kranz, der nicht nach 80er Wohnzimmer aussieht.', icon: 'Snowflake' },
      { title: 'Private Group', description: 'Geburtstag, JGA, Teamevent — wir planen Workshops für deine Runde.', icon: 'Users' },
    ],
    cta: { label: 'Workshop anfragen', href: '/kontakt' },
  }, light);
}

function seasonalCampaign() {
  return section('seasonalCampaign', {
    badge: 'Saison-Special',
    headline: 'Muttertag — diesmal mit echtem Brief, nicht nur Karte.',
    subline: 'Wir binden einen Saisonstrauß deiner Wahl und schreiben deine Nachricht von Hand auf Büttenpapier dazu.',
    image: img.bouquetSpring,
    offerLabel: 'Vorbestellung bis 8. Mai',
    deadline: '12. Mai 2026',
    benefits: ['Saisonblumen direkt vom Hof', 'Handschriftliche Karte inklusive', 'Liefergebiet München & Umland', 'Auch als Abholung'],
    cta: { label: 'Jetzt vorbestellen', href: '/kontakt' },
  }, alt);
}

function materialGallery() {
  return section('floristMaterials', {
    headline: 'Mit welchen Blumen wir am liebsten arbeiten.',
    subline: 'Eine kleine Sammlung unserer Lieblinge — was bei uns gerade in der Vase steht.',
    categories: ['Sorten', 'Saison', 'Hochzeit', 'Grün'],
    items: [
      { name: 'Pfingstrosen', category: 'Hochzeit', image: img.peony },
      { name: 'Rosen Vintage', category: 'Sorten', image: img.rose },
      { name: 'Ranunkeln', category: 'Saison', image: img.ranunculus },
      { name: 'Eukalyptus', category: 'Grün', image: img.eucalyptus },
      { name: 'Anemonen', category: 'Saison', image: img.bouquetSpring },
      { name: 'Olivenzweige', category: 'Grün', image: img.bouquetGreen },
    ],
  }, light);
}

function deliveryTimeline() {
  return section('deliveryTimeline', {
    headline: 'So läuft eine Bestellung.',
    subline: 'Klar, persönlich, ohne Überraschungen.',
    steps: [
      { number: 1, title: 'Anfrage', text: 'Per Formular, WhatsApp oder Telefon — gerne mit Foto oder Anlass.', icon: 'MessageCircle' },
      { number: 2, title: 'Beratung', text: 'Wir antworten innerhalb eines Tages mit konkretem Vorschlag.', icon: 'Sparkles' },
      { number: 3, title: 'Binden', text: 'Wir binden frisch am Liefer- oder Abholtag.', icon: 'Flower2' },
      { number: 4, title: 'Lieferung', text: 'Abholung am Atelier oder Lieferung im Großraum München.', icon: 'Truck' },
    ],
  }, alt);
}

function inspirationGrid() {
  return section('inspirationGrid', {
    headline: 'Lass dich inspirieren.',
    subline: 'Ein kleiner Einblick in vergangene Projekte und Atelier-Momente.',
    items: [
      { title: 'Hochzeit am See', image: img.event, href: '/hochzeiten' },
      { title: 'Saisontisch Frühling', image: img.table, href: '/saison' },
      { title: 'Atelierblick', image: img.atelier, href: '/ueber-uns' },
      { title: 'Adventskranz Modern', image: img.wreath, href: '/saison' },
      { title: 'Workshop Atmosphäre', image: img.workshop, href: '/workshops' },
      { title: 'Wildbouquet', image: img.bouquetGreen, href: '/c/straeusse/green-wild' },
    ],
  }, light);
}

function teamSection() {
  return section('team', {
    badgeText: 'Atelier',
    headline: 'Drei Hände, ein Stil.',
    subline: 'Unterschiedliche Hintergründe, gemeinsame Liebe zu Saisonblumen.',
    members: [
      { name: 'Vivian', role: 'Inhaberin · Hochzeitsfloristik', bio: 'Vivian hat das Atelier 2018 gegründet und plant alle Hochzeiten persönlich.', image: img.team1 },
      { name: 'Mara', role: 'Saison & Workshops', bio: 'Mara liebt wilde, lockere Sträuße und leitet unsere Workshops.', image: img.team2 },
      { name: 'Lena', role: 'Eventfloristik', bio: 'Lena übernimmt Eventaufbauten und kümmert sich um Logistik vor Ort.', image: img.team3 },
    ],
  }, light);
}

function membershipPlans() {
  return section('comparisonCardsPro', {
    badge: 'Abo',
    headline: 'Blumen-Abo für Büro oder Zuhause.',
    subline: 'Frische Sträuße in Frequenz und Stil, die wirklich zu dir passen.',
    plans: [
      { name: 'Klein', price: 'ab 38 € / Lieferung', features: ['1 Strauß pro Lieferung', 'Saison-Sortiment', 'Kein Wunschtermin'], missing: ['Eigene Stilauswahl', 'Wunschvase'], ctaLabel: 'Klein wählen', ctaHref: '/kontakt' },
      { name: 'Mittel', price: 'ab 78 € / Lieferung', features: ['1-2 Sträuße pro Lieferung', 'Stilrichtung wählbar', 'Termin im 2-Wochen-Rhythmus'], missing: ['Wunschvase'], ctaLabel: 'Mittel wählen', ctaHref: '/kontakt', highlighted: true, note: 'Beliebteste Option' },
      { name: 'Office', price: 'ab 145 € / Lieferung', features: ['Empfang & Meetingraum', 'Stil & Farben festgelegt', 'Wöchentlicher Termin', 'Vasen inklusive'], missing: [], ctaLabel: 'Office anfragen', ctaHref: '/kontakt' },
    ],
  }, light);
}

function ctaBanner(headline, subline, primaryLabel = 'Anfrage senden') {
  return section('immersiveCtaBanner', {
    badge: 'Beratung anfragen',
    headline, subline,
    image: img.atelier,
    overlay: 'rgba(36,20,32,0.55)',
    metrics: [{ value: '300+', label: 'gebundene Sträuße' }, { value: '45+', label: 'Hochzeiten' }, { value: '4,9/5', label: 'Bewertungen' }],
    primaryCta: { label: primaryLabel, href: '/kontakt', icon: 'Send' },
    secondaryCta: { label: 'Sortiment ansehen', href: '/straeusse', icon: 'Flower2' },
  }, dark);
}

const pages = [
  { slug: '', title: 'Startseite', sections: [
    hero('Blumen, die zu echten Momenten passen.', 'Blütenwerk Atelier in München bindet Sträuße und plant Hochzeiten mit dem, was die Saison gerade gibt.', img.hero),
    bouquetShowcase(),
    occasionMosaic(),
    section('uspStrip', { items: [
      { icon: 'Leaf', title: 'Saisonal', text: '80 % regionales Material' },
      { icon: 'Heart', title: 'Persönlich', text: 'Jeder Strauß individuell' },
      { icon: 'Truck', title: 'Lieferung', text: 'München & Umland' },
      { icon: 'Sparkles', title: 'Hochzeit', text: 'Komplette Begleitung' },
    ] }, light),
    weddingShowroom(),
    seasonalCampaign(),
    section('newsPreview', { headline: 'Atelierjournal', subline: 'Notizen zu Saison, Pflege und Floristik.', linkLabel: 'Alle Beiträge lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
    ctaBanner('Soll dein Anlass blühen?', 'Schreib uns Anlass, Datum und Stil — wir antworten persönlich mit einem konkreten Vorschlag.'),
  ] },
  { slug: 'straeusse', title: 'Sträuße', sections: [
    hero('Sträuße — locker, saisonal, gut gebunden.', 'Vier Kategorien, viele Varianten. Wir binden gerne nach deinen Farben und deinem Anlass.', img.atelier, { eyebrow: 'Sortiment', primaryCta: { label: 'Strauß anfragen', href: '/kontakt' }, secondaryCta: { label: 'Material ansehen', href: '#material' } }),
    bouquetShowcase(),
    materialGallery(),
    deliveryTimeline(),
    section('collectionList', { headline: 'Alle Sträuße', subline: 'Stöbere durch unsere Sortimentskarten.', collectionKey: 'straeusse', ctaLabel: 'Anfrage senden' }, alt),
    ctaBanner('Du hast einen Farbwunsch?', 'Nenn uns die Töne, den Anlass und das Budget — wir gestalten passend.'),
  ] },
  { slug: 'hochzeiten', title: 'Hochzeiten', sections: [
    hero('Hochzeitsfloristik aus einer Hand.', 'Von der ersten Beratung bis zum letzten Tischlauf — wir begleiten euch durch jede florale Entscheidung.', img.bride, { eyebrow: 'Hochzeit', primaryCta: { label: 'Hochzeitsanfrage', href: '/kontakt' }, secondaryCta: { label: 'Inspiration', href: '#inspiration' } }),
    weddingShowroom(),
    section('processSteps', { badgeText: 'Ablauf', headline: 'Wie wir eure Hochzeit planen.', subline: 'Vier Schritte vom Erstgespräch bis zum Tag selbst.', steps: [
      { title: 'Beratung', text: 'Wir hören zu — Location, Stil, Farben, Budget. Erst dann schlagen wir vor.' },
      { title: 'Moodboard', text: 'Visualisierung mit echten Materialbeispielen, nicht nur Pinterest.' },
      { title: 'Probe', text: 'Optional: kleine Probebinde, damit ihr seht wie der Brautstrauß wirkt.' },
      { title: 'Aufbau', text: 'Wir sind am Tag vor Ort, bauen auf, dekorieren Tische und räumen ab.' },
    ] }, light),
    inspirationGrid(),
    section('testimonials', { headline: 'Was Brautpaare sagen.', items: [
      { quote: 'Vivian hat unsere Idee verstanden, bevor wir sie selbst klar hatten.', author: 'Anna & Felix', meta: 'Hochzeit Mai 2026', rating: 5 },
      { quote: 'Tischfloristik war noch besser als auf den Moodboards. Komplett entspannt am Tag.', author: 'Marie & Jan', meta: 'Hochzeit August 2025', rating: 5 },
      { quote: 'Brautstrauß war traumhaft — und auch nach 24 Stunden noch perfekt.', author: 'Lara & Tom', meta: 'Hochzeit Juni 2025', rating: 5 },
    ] }, alt),
    ctaBanner('Eure Hochzeit verdient gute Blumen.', 'Sendet uns Datum, Location und ungefähre Vorstellung — wir antworten mit einem ersten Konzept.', 'Hochzeitsanfrage senden'),
  ] },
  { slug: 'workshops', title: 'Workshops', sections: [
    hero('Workshops im Atelier.', 'Kleine Runden, gutes Material und genug Zeit — keine Akkord-Veranstaltung.', img.workshop, { eyebrow: 'Workshops', primaryCta: { label: 'Workshop buchen', href: '/kontakt' }, secondaryCta: { label: 'Termine', href: '#termine' } }),
    workshopBooking(),
    section('collectionList', { headline: 'Aktuelle Workshops', subline: 'Hier findest du alle laufenden Termine.', collectionKey: 'workshops', ctaLabel: 'Platz reservieren' }, alt),
    section('faq', { headline: 'Häufige Fragen', items: [
      { q: 'Wie viele Teilnehmer pro Workshop?', a: 'Maximal 8 — damit Beratung wirklich persönlich bleibt.' },
      { q: 'Brauche ich Vorkenntnisse?', a: 'Nein. Wir starten bei Material und Technik bei null.' },
      { q: 'Was ist im Preis enthalten?', a: 'Komplettes Material, Werkzeug, Getränke und ein kleiner Imbiss.' },
      { q: 'Kann ich einen Workshop verschenken?', a: 'Ja, auf Anfrage stellen wir gerne einen Gutschein aus.' },
    ] }, light),
    ctaBanner('Möchtest du einen Workshop verschenken?', 'Wir stellen dir gerne einen personalisierten Gutschein aus.', 'Gutschein anfragen'),
  ] },
  { slug: 'saison', title: 'Saison', sections: [
    hero('Was die Saison gerade gibt.', 'Wir arbeiten mit dem, was wirklich blüht — keine Importe um jeden Preis.', img.bouquetSpring, { eyebrow: 'Saison', primaryCta: { label: 'Saisonstrauß bestellen', href: '/kontakt' }, secondaryCta: { label: 'Material', href: '#material' } }),
    seasonalCampaign(),
    materialGallery(),
    membershipPlans(),
    section('newsGrid', { headline: 'Aus dem Atelierjournal', subline: 'Notizen zur Saison.', collectionKey: 'news' }, alt),
  ] },
  { slug: 'ueber-uns', title: 'Über uns', sections: [
    hero('Ein Atelier für Saison, Stil und ehrliche Beratung.', 'Blütenwerk Atelier wurde 2018 von Vivian gegründet — aus dem Wunsch, anders zu binden.', img.atelier, { eyebrow: 'Atelier', primaryCta: { label: 'Beratung anfragen', href: '/kontakt' }, secondaryCta: { label: 'Sortiment', href: '/straeusse' } }),
    section('textImage', { badgeText: 'Geschichte', headline: 'Warum wir lieber saisonal binden.', subline: 'Aus der Überzeugung, dass Blumen mehr sind als Deko.', text: '<p>Blütenwerk Atelier entstand aus dem Wunsch, ehrlicher mit Material umzugehen. Wir wollten weg von glatten Importen und hin zu echten Saisonkompositionen, die nach der Jahreszeit aussehen, in der sie geschnitten wurden.</p><p>Heute arbeiten wir mit einem festen Netzwerk regionaler Hofgärtner, leiten Workshops und planen Hochzeiten mit klarem Konzept statt Trend-Kopie.</p>', image: img.atelier, primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' } }, light),
    teamSection(),
    section('stats', { items: [{ value: '8 Jahre', label: 'Atelier' }, { value: '300+', label: 'Sträuße / Jahr' }, { value: '45+', label: 'Hochzeiten' }, { value: '80 %', label: 'Regionale Blumen' }] }, alt),
  ] },
  { slug: 'kontakt', title: 'Kontakt', sections: [
    hero('Schreib uns, was blühen soll.', 'Anlass, Datum, Stil — je konkreter du wirst, desto besser können wir planen.', img.atelier, { eyebrow: 'Kontakt', primaryCta: { label: 'Anfrage starten', href: '#form' }, secondaryCta: { label: 'WhatsApp', href: 'https://wa.me/498944552211' } }),
    section('contact', { badgeText: 'Kontaktformular', headline: 'Beratung anfragen.', subline: 'Wir antworten meist innerhalb eines Werktags.', namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', phonePlaceholder: 'Telefon (optional)', messagePlaceholder: 'Anlass, Datum, Stil, Budget', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }] }, light),
    section('map', { headline: 'Atelier am Gärtnerplatz', subline: 'Sichtbar, klein, immer mit Werkstattgeruch.', mapEmbedUrl: mapsEmbed }, alt),
    section('openingHours', { headline: 'Öffnungszeiten', days: [{ label: 'Dienstag bis Freitag', hours: '10:00-18:30' }, { label: 'Samstag', hours: '9:00-15:00' }, { label: 'Sonntag/Montag', hours: 'geschlossen' }], bookingNote: 'Hochzeiten und Workshops nach Termin.' }, light),
  ] },
  { slug: 'news', title: 'Atelierjournal', sections: [
    hero('Notizen aus dem Atelier.', 'Über Saison, Pflege, Hochzeitsplanung und das, was uns beim Binden gerade beschäftigt.', img.atelier, { eyebrow: 'Journal', primaryCta: { label: 'Alle Beiträge', href: '#beitraege' }, secondaryCta: { label: 'Beratung', href: '/kontakt' } }),
    section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Floristik zum Mitlesen.', collectionKey: 'news' }, light),
    ctaBanner('Lust auf ein eigenes Floristik-Erlebnis?', 'Wir freuen uns auf deine Anfrage.'),
  ] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß § 5 TMG', content: 'Blütenwerk Atelier GmbH, Gärtnerplatz 8, 80469 München' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Geschäftsführung', content: 'Vivian Brandt' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Blütenwerk Atelier GmbH, Gärtnerplatz 8, 80469 München' }, { title: 'Kontaktformular', content: 'Formulardaten dienen nur der Bearbeitung deiner Anfrage.' }, { title: 'Hosting', content: 'Diese Demo läuft technisch auf Flamingo Media.' }, { title: 'Rechte', content: 'Du kannst Auskunft, Berichtigung oder Löschung verlangen.' }] }, light)] },
];

function detailHero(item, badgeText) {
  return section('collectionHero', { headline: item.title, subline: item.excerpt, badgeText, backgroundImage: item.image, bgImage: item.image, overlayColor: '#241420', overlayOpacity: 0.55, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/florist') && !child.startsWith('http')) {
      copy[key] = `/demo/florist${child === '/' ? '' : child}`;
    } else copy[key] = prefixDemoLinks(child);
  }
  return copy;
}

function bouquetSections(item) {
  return prefixDemoLinks([
    detailHero(item, item.category),
    section('textImage', { headline: item.title, subline: item.excerpt, text: `<p>${item.excerpt}</p><p>Wir binden jeden Strauß frisch zum Liefer- oder Abholtag. Größe, Farben und Materialien lassen sich nach Wunsch anpassen.</p>`, image: item.image, primaryCta: { label: 'Strauß bestellen', href: '/kontakt' } }, light),
    section('uspStrip', { items: [
      { icon: 'Leaf', title: 'Saisonblumen', text: 'frisch aus dem Umland' },
      { icon: 'Sparkles', title: 'Individuell', text: 'Farben & Größe anpassbar' },
      { icon: 'Truck', title: 'Lieferung', text: 'in München & Umland' },
    ] }, alt),
    section('immersiveCtaBanner', { badge: 'Strauß bestellen', headline: 'Diesen Strauß für dich oder als Geschenk?', subline: 'Schreib uns Wunschtermin und Adresse — wir kümmern uns.', image: item.image, overlay: 'rgba(36,20,32,0.55)', primaryCta: { label: 'Bestellung anfragen', href: '/kontakt', icon: 'Send' } }, dark),
  ]);
}

function workshopSections(item) {
  return prefixDemoLinks([
    detailHero(item, 'Workshop'),
    section('textImage', { headline: item.title, subline: item.excerpt, text: `<p>${item.excerpt}</p><p>Dauer: ${item.durationLabel}. Preis: ${item.priceLabel}. Material und kleiner Imbiss inklusive.</p>`, image: item.image, primaryCta: { label: 'Platz reservieren', href: '/kontakt' } }, light),
    section('faq', { headline: 'Gut zu wissen', items: [
      { q: 'Wie viele Plätze?', a: 'Maximal 8 — das ist uns wichtig.' },
      { q: 'Was muss ich mitbringen?', a: 'Nur dich. Material, Werkzeug und Getränke stellen wir.' },
      { q: 'Kann ich umbuchen?', a: 'Bis 5 Tage vor Termin ohne Gebühr.' },
    ] }, alt),
  ]);
}

function newsSections(item) {
  return prefixDemoLinks([detailHero(item, 'Atelierjournal'), section('freeText', { content: item.content }, light)]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: page.sections, visible: true, status: 'published' };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, existingCollections) {
  const found = existingCollections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function replaceCollectionItems(key, label, items, makeSections, collections) {
  const collection = await ensureCollection(key, label, collections);
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  for (const [index, item] of items.entries()) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title, slug: item.slug, excerpt: item.excerpt, published: true, priority: index,
      data: { image: item.image, author: 'Blütenwerk Atelier', date: '2026-05-12', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Blütenwerk Atelier', tagline: 'Floristik, Hochzeiten & saisonale Blumenwelten', primaryColor: colors.burgundy, secondaryColor: colors.rose, accentColor: colors.pink, logoDisplay: 'name', headingFont: 'Playfair Display', bodyFont: 'Inter', topBarColor: colors.burgundy, footerColor: colors.burgundy });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: colors.blush, cardBg: colors.card, cardBorder: colors.border, badgeBg: colors.blush, badgeText: colors.burgundy, brand: colors.burgundy, accent: colors.rose, heading: colors.ink, body: colors.soft, muted: colors.muted, icon: colors.rose, btnBg: colors.burgundy, btnText: colors.onDark, eyebrow: colors.rose, statValue: colors.burgundy, quote: colors.ink, ratingStar: colors.pink, check: colors.rose, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkSoft, onDarkMuted: '#E5BDC4' });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: true, whatsapp: '+498944552211', whatsappColor: colors.rose });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Beratung anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [
    { title: 'Floristik', items: [{ text: 'Sträuße', href: '/straeusse' }, { text: 'Hochzeiten', href: '/hochzeiten' }, { text: 'Workshops', href: '/workshops' }, { text: 'Saison', href: '/saison' }] },
    { title: 'Atelier', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Journal', href: '/news' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] },
  ], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Beratung anfragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [
    { type: 'regular', day: 'Dienstag bis Freitag', hours: '10:00-18:30' },
    { type: 'regular', day: 'Samstag', hours: '9:00-15:00' },
    { type: 'regular', day: 'Sonntag', closed: true },
    { type: 'regular', day: 'Montag', closed: true },
  ] });

  for (const page of pages) {
    await upsertPage(page, existingPages);
    console.log('Page:', page.slug || '(home)');
  }

  await replaceCollectionItems('straeusse', 'Sträuße', bouquets, bouquetSections, collectionsBefore.collections || []);
  await replaceCollectionItems('workshops', 'Workshops', workshops, workshopSections, collectionsBefore.collections || []);
  await replaceCollectionItems('news', 'Atelierjournal', newsItems, newsSections, collectionsBefore.collections || []);

  await api('POST', '/api/v1/content/publish', {});
  console.log('Done. Published.');
}

main().catch((err) => { console.error(err); process.exit(1); });
