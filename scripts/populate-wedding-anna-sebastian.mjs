const token = process.env.FLM_WEDDING_TOKEN || 'flm_pat_a8a4079b1415c23ee6e7ec484438a8a780452b6a6a86fc0acf3025c8d24c3904';
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
const section = (type, data, styleOverrides = {}) => ({ id: uid(), type, data, styleOverrides });

const img = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2200&q=85',
  table: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1800&q=85',
  venue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85',
  couple: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1800&q=85',
  garden: 'https://images.unsplash.com/photo-1509610973147-232dfea52a97?w=1800&q=85',
  flowers: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1600&q=85',
  dinner: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85',
  party: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=85',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
  rings: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=85',
  stationery: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=1600&q=85',
  dance: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1800&q=85',
};

const colors = {
  ink: '#241814',
  soft: '#6F5C53',
  muted: '#8B766E',
  cream: '#FAF6EF',
  alt: '#F5E8E3',
  card: '#FFFDFC',
  border: '#E8D8D0',
  rose: '#C88478',
  roseDeep: '#8F4E45',
  terracotta: '#B66A55',
  espresso: '#2B1713',
  sage: '#8A7F69',
  onDark: '#FFF9F0',
  onDarkBody: '#F7EDE6',
  onDarkMuted: '#DCC9BF',
};

const light = {
  sectionBg: colors.cream,
  cardBg: colors.card,
  cardBorder: colors.border,
  heading: colors.ink,
  subheading: colors.soft,
  body: colors.soft,
  muted: colors.muted,
  icon: colors.roseDeep,
  accentColor: colors.terracotta,
  btnBg: colors.espresso,
  btnText: colors.onDark,
  badgeBg: '#F4E3DC',
  badgeText: colors.roseDeep,
  badgeBorder: colors.border,
  borderColor: colors.border,
  eyebrow: colors.roseDeep,
  statValue: colors.roseDeep,
  quote: colors.ink,
  check: colors.roseDeep,
};

const alt = {
  ...light,
  sectionBg: colors.alt,
  cardBg: '#FFF9F5',
};

const dark = {
  sectionBg: colors.espresso,
  cardBg: 'rgba(255,249,240,0.11)',
  cardBorder: 'rgba(255,249,240,0.24)',
  heading: colors.onDark,
  subheading: colors.onDarkBody,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  icon: '#F2CFC5',
  accentColor: '#F2CFC5',
  btnBg: colors.onDark,
  btnText: colors.espresso,
  badgeBg: 'rgba(255,249,240,0.15)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,249,240,0.30)',
  borderColor: 'rgba(255,249,240,0.22)',
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const heroStyle = {
  heroHeading: colors.onDark,
  heroBody: colors.onDarkBody,
  badgeBg: 'rgba(255,249,240,0.18)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,249,240,0.35)',
  btnBg: colors.onDark,
  btnText: colors.espresso,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const phone = '+49 176 421 80 914';
const email = 'hochzeit@anna-sebastian.de';
const address = 'Gut Sonnenhof, Am Lindenhain 7, 82319 Starnberg';
const weddingDate = '2026-09-14';
const mapEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.0!2d11.35!3d47.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3Rhcm5iZXJn!5e0!3m2!1sde!2sde!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Hochzeitstag', href: '/hochzeitstag', type: 'link' },
  { label: 'Location', href: '/location', type: 'link' },
  { label: 'Anreise', href: '/anreise-hotels', type: 'link' },
  { label: 'RSVP', href: '/rsvp', type: 'link' },
  { label: 'Dresscode', href: '/dresscode', type: 'link' },
  { label: 'Geschenke', href: '/geschenke', type: 'link' },
  { label: 'Updates', href: '/news', type: 'link' },
];

const scheduleEvents = [
  { time: '13:30', title: 'Ankommen im Garten', description: 'Bitte plant ein paar Minuten für Begrüßung, Mantel, Getränke und Orientierung ein.', icon: 'heart', location: 'Gut Sonnenhof' },
  { time: '14:30', title: 'Freie Trauung', description: 'Unter alten Linden, draußen bei gutem Wetter und im Saal, falls der Himmel anderes vorhat.', icon: 'heart', location: 'Lindengarten' },
  { time: '15:30', title: 'Gratulation & Aperitif', description: 'Stoßt mit uns an, holt euch etwas Kleines zu essen und lernt die Menschen kennen, die uns wichtig sind.', icon: 'utensils', location: 'Innenhof' },
  { time: '17:00', title: 'Fotos und Zeit für euch', description: 'Während wir kurz verschwinden, gibt es Musik, Getränke und genug Platz zum Durchatmen.', icon: 'camera', location: 'Garten & Hof' },
  { time: '18:30', title: 'Dinner', description: 'Ein langes Abendessen mit italienisch inspiriertem Menü, vegetarischen Optionen und Raum für Reden.', icon: 'utensils', location: 'Festsaal' },
  { time: '21:30', title: 'Eröffnungstanz & Party', description: 'Ab hier wird es weniger geplant. Wer tanzen will, tanzt. Wer reden will, findet ruhige Ecken.', icon: 'music', location: 'Scheune' },
];

const faqs = [
  { question: 'Bis wann sollen wir zusagen?', answer: 'Bitte gebt uns bis zum 30. Juni 2026 über die RSVP-Seite Bescheid. Das hilft uns bei Menü, Sitzplan und Hotelkontingenten.' },
  { question: 'Dürfen Kinder mitkommen?', answer: 'Ja. Bitte gebt sie bei der Zusage mit an, damit wir Plätze, Essen und eine ruhige Ecke gut planen können.' },
  { question: 'Gibt es Parkplätze?', answer: 'Direkt am Gut gibt es begrenzte Parkplätze. Wir empfehlen Fahrgemeinschaften oder den Shuttle vom Bahnhof Starnberg.' },
  { question: 'Was passiert bei Regen?', answer: 'Die Trauung zieht dann in den hellen Saal. Der Ablauf bleibt gleich, nur die Schuhe werden entspannter.' },
  { question: 'Kann ich Unverträglichkeiten angeben?', answer: 'Ja, bitte direkt in der RSVP. Wir geben alles gesammelt an Küche und Service weiter.' },
];

const galleryImages = [
  { src: img.hero, alt: 'Sommerliche Hochzeit im Freien' },
  { src: img.table, alt: 'Festlich gedeckte Hochzeitstafel' },
  { src: img.venue, alt: 'Hochzeitslocation mit Garten' },
  { src: img.flowers, alt: 'Blumen und Hochzeitsdetails' },
  { src: img.dinner, alt: 'Dinner im warmen Licht' },
  { src: img.party, alt: 'Tanzfläche am Abend' },
];

const newsItems = [
  {
    slug: 'zusage-und-begleitung',
    title: 'Zusage, Begleitung und Kinder: so planen wir sauber',
    excerpt: 'Warum wir eure Rückmeldung früh brauchen und welche Angaben uns wirklich helfen.',
    image: img.stationery,
    content: '<p>Bitte tragt bei der RSVP alle Personen ein, die mit euch kommen. Das gilt auch für Kinder, Partnerinnen und Partner, die nicht auf der ursprünglichen Einladung standen.</p><p>Wenn sich später etwas ändert, schreibt uns bitte direkt. Wir planen Sitzplätze, Menü und Shuttle lieber sauber als knapp.</p>',
  },
  {
    slug: 'anreise-parken-shuttle',
    title: 'Anreise, Parken und Shuttle am Hochzeitstag',
    excerpt: 'Alle Wege zum Gut Sonnenhof, ohne dass ihr vor Ort lange suchen müsst.',
    image: img.venue,
    content: '<p>Am Gut gibt es Parkplätze, aber nicht endlos viele. Wer mit dem Zug kommt, nutzt am besten den Shuttle vom Bahnhof Starnberg. Die genauen Zeiten veröffentlichen wir hier rechtzeitig.</p><p>Wenn ihr ein Taxi braucht, bucht es für die Rückfahrt bitte früh. Rund um Mitternacht ist die Nachfrage hoch.</p>',
  },
  {
    slug: 'dresscode-ohne-stress',
    title: 'Dresscode ohne Stress',
    excerpt: 'Festlich, sommerlich, bequem genug für Garten, Dinner und Tanzfläche.',
    image: img.flowers,
    content: '<p>Wir wünschen uns einen festlichen Sommerabend, aber keine Uniform. Warme Naturtöne, Rosé, Salbei, Champagner, Terracotta oder dunkle Anzüge passen wunderbar.</p><p>Der Garten ist schön, aber nicht immer High-Heel-freundlich. Nehmt gern Schuhe mit, in denen ihr auch später noch gerne steht.</p>',
  },
  {
    slug: 'menue-und-unvertraeglichkeiten',
    title: 'Menü, Getränke und Unverträglichkeiten',
    excerpt: 'Wie wir Dinner, vegetarische Optionen und Allergien vorab sammeln.',
    image: img.dinner,
    content: '<p>Das Menü wird italienisch inspiriert, saisonal und nicht steif. Vegetarische Optionen sind eingeplant. Vegane Wünsche oder Unverträglichkeiten gebt bitte direkt bei der RSVP an.</p><p>Wer unsicher ist, schreibt uns lieber einmal zu viel. Wir sammeln alles und geben es gebündelt an die Küche.</p>',
  },
];

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/wedding')) {
      copy[key] = `/demo/wedding${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

function hero(names, subline, image, extra = {}) {
  return section('hero', {
    names,
    date: extra.date || weddingDate,
    venue: extra.venue || 'Gut Sonnenhof · Starnberg',
    subline,
    bgImage: image,
    bgPosition: extra.bgPosition || 'center 42%',
    overlayColor: colors.espresso,
    overlayOpacity: extra.overlayOpacity ?? 0.48,
    showCountdown: extra.showCountdown ?? true,
    imageEffect: extra.imageEffect || 'kenBurns',
    imageEffectIntensity: extra.imageEffectIntensity || 'subtle',
  }, heroStyle);
}

function cta(headline, subline, primary = { label: 'Jetzt zusagen', href: '/rsvp' }) {
  return section('immersiveCtaBanner', {
    badge: 'Gästeinfo',
    headline,
    subline,
    image: img.table,
    overlay: 'rgba(43,23,19,0.64)',
    primaryCta: primary,
    secondaryCta: { label: 'Hochzeitstag ansehen', href: '/hochzeitstag' },
    metrics: [{ value: '14.09.', label: 'Trauung' }, { value: '13:30', label: 'Ankommen' }, { value: 'Starnberg', label: 'Location' }],
  }, dark);
}

function collectionHero(title, excerpt, image, badgeText) {
  return section('collectionHero', {
    headline: title,
    subline: excerpt,
    badgeText,
    backgroundImage: image,
    bgImage: image,
    overlayColor: colors.espresso,
    overlayOpacity: 0.50,
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
  }, heroStyle);
}

function storySection() {
  return section('coupleStory', {
    badge: 'Unsere Geschichte',
    headline: 'Aus einem Kaffee wurde ein Leben.',
    story: 'Wir haben uns nicht gesucht, aber ziemlich schnell gemerkt, dass es leicht wird, wenn wir zusammen sind. Diese Seite soll euch helfen, unseren Tag genauso entspannt zu erleben: mit allen Infos an einem Ort und genug Raum für Vorfreude.',
    image: img.couple,
    milestones: [
      { date: '2018', text: 'Erster Kaffee nach einem gemeinsamen Projekt. Eigentlich kurz geplant, am Ende drei Stunden geblieben.' },
      { date: '2020', text: 'Die erste Wohnung, zu viele Pflanzen und die Erkenntnis, dass Sebastian wirklich jedes Regal gerade ausrichtet.' },
      { date: '2024', text: 'Antrag am See, sehr früh am Morgen, mit Thermoskanne, nassen Schuhen und genau der richtigen Ruhe.' },
      { date: '2026', text: 'Jetzt feiern wir mit euch: nicht perfekt durchchoreografiert, sondern warm, persönlich und voller guter Menschen.' },
    ],
  }, light);
}

function scheduleSection(headline = 'Ein Tag mit genug Plan und genug Luft.') {
  return section('eventSchedule', {
    badge: 'Ablauf',
    headline,
    events: scheduleEvents,
  }, alt);
}

function venueSection() {
  return section('venueInfo', {
    badge: 'Location',
    headline: 'Gut Sonnenhof: Garten, Saal und kurze Wege.',
    subline: 'Die Location liegt ruhig bei Starnberg, mit Platz für Trauung, Dinner und Party auf einem Gelände.',
    description: '<p>Wir feiern auf Gut Sonnenhof, weil sich der Ort festlich anfühlt, ohne steif zu sein. Der Garten ist nah am Saal, der Innenhof funktioniert für Aperitif und Gespräche, und abends kann die Party in die Scheune ziehen.</p><p>Bitte plant für die Anreise genug Zeit ein. Vor Ort ist alles ausgeschildert, und unsere Trauzeugen helfen euch gern weiter.</p>',
    image: img.venue,
    address,
    mapUrl: 'https://maps.google.com',
    contact: 'Vor Ort helfen euch Lea und Moritz aus unserem Hochzeitsteam.',
    venues: [{ name: 'Gut Sonnenhof', image: img.venue, address, description: 'Garten, Saal und Scheune auf einem Gelände.', mapEmbed: mapEmbed, parkingInfo: 'Parkplätze am Gut, Shuttle ab Bahnhof Starnberg.' }],
  }, light);
}

function travelSection() {
  return section('travelInfo', {
    badge: 'Anreise & Hotels',
    headline: 'Kommt gut an und nachts gut zurück.',
    subline: 'Wir haben die wichtigsten Wege, Hotels und Hinweise gesammelt, damit ihr nicht selbst suchen müsst.',
    sections: [
      { icon: 'train', title: 'Mit der Bahn', content: 'Bis Bahnhof Starnberg, danach Shuttle oder Taxi. Die Shuttlezeiten veröffentlichen wir im Sommer 2026.' },
      { icon: 'car', title: 'Mit dem Auto', content: 'Parkplätze gibt es direkt am Gut. Bitte bildet Fahrgemeinschaften, wenn es für euch passt.' },
      { icon: 'plane', title: 'Von weiter weg', content: 'Ab München Flughafen ist Starnberg mit S-Bahn und Regionalverkehr erreichbar. Für späte Rückfahrten bitte Hotel oder Taxi einplanen.' },
    ],
    hotels: [
      { name: 'Hotel Vier Jahreszeiten Starnberg', image: img.hotel, distance: 'ca. 12 Minuten mit dem Taxi', specialRate: 'Kontingent unter Anna & Sebastian bis 30. Juni', link: 'https://example.com' },
      { name: 'Seehaus Pension', image: img.garden, distance: 'ca. 8 Minuten mit dem Auto', specialRate: 'kleines Kontingent, früh anfragen', link: 'https://example.com' },
      { name: 'München Süd', image: img.table, distance: 'gut mit S-Bahn erreichbar', specialRate: 'praktisch für Gäste mit Weiterreise', link: 'https://example.com' },
    ],
  }, alt);
}

function dresscodeSection() {
  return section('dresscode', {
    badge: 'Dresscode',
    headline: 'Festlich, sommerlich, beweglich.',
    text: '<p>Wir wünschen uns einen warmen Sommerabend: festlich genug für Fotos, bequem genug für Garten, Dinner und Tanzfläche. Naturtöne, Salbei, Champagner, Terracotta, Rosé oder dunkle Anzüge passen sehr gut.</p>',
    colors: ['#F5E8E3', '#C88478', '#8A7F69', '#D8C3A5', '#2B1713'],
    hints: ['Der Garten ist nicht immer High-Heel-freundlich.', 'Für abends lohnt sich eine leichte Jacke.', 'Bitte kein komplett weißes Outfit.', 'Wenn ihr unsicher seid: lieber elegant als streng.'],
  }, light);
}

function menuSection() {
  return section('weddingMenu', {
    badge: 'Dinner',
    headline: 'Ein Menü, das nach langem Abend schmeckt.',
    note: 'Unverträglichkeiten und vegetarische Wünsche bitte in der RSVP eintragen.',
    courses: [
      { title: 'Aperitif', items: [{ name: 'Focaccia, Oliven & Kräuteröl', description: 'zum Ankommen im Hof' }, { name: 'Bergamotte Spritz', description: 'alkoholisch und alkoholfrei' }] },
      { title: 'Dinner', items: [{ name: 'Burrata, Tomate & Basilikum', description: 'leicht, sommerlich, vegetarisch', tags: ['vegetarisch'] }, { name: 'Ravioli mit Salbei oder Zitronenhuhn', description: 'zwei Hauptgänge zur Auswahl' }] },
      { title: 'Später', items: [{ name: 'Tiramisu & Beeren', description: 'am Tisch serviert' }, { name: 'Mitternachtssnack', description: 'kleine Panini, wenn die Tanzfläche länger offen bleibt' }] },
    ],
  }, light);
}

function partySection() {
  return section('weddingParty', {
    badge: 'Unsere Crew',
    headline: 'Die Menschen, die euch vor Ort helfen.',
    members: [
      { name: 'Lea', role: 'Trauzeugin von Anna', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=85', text: 'Kennt Annas Ruhe und Annas Excel-Listen. Erste Ansprechperson für Ablauf, Fragen und kleine Notfälle.' },
      { name: 'Moritz', role: 'Trauzeuge von Sebastian', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=85', text: 'Organisiert Shuttle, Technik und alles, was kurz vor knapp plötzlich sehr wichtig wirkt.' },
      { name: 'Mara', role: 'Gäste & Familien', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85', text: 'Hilft Eltern, Kindern und allen, die lieber einmal fragen als lange suchen.' },
    ],
  }, alt);
}

function giftSection() {
  return section('giftRegistry', {
    badge: 'Geschenke',
    headline: 'Am meisten freuen wir uns, wenn ihr da seid.',
    subline: 'Wer trotzdem etwas schenken möchte, findet hier eine einfache Orientierung.',
    text: '<p>Wir haben keinen großen Wunschzettel. Wenn ihr uns etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Reise nach der Hochzeit oder über etwas Persönliches, das zu euch passt.</p>',
    gifts: [
      { title: 'Beitrag zur Hochzeitsreise', description: 'Für ein paar ruhige Tage nach dem Fest.' },
      { title: 'Lieblingsrezept oder Foto', description: 'Persönliche Beiträge sammeln wir in einer Box am Abend.' },
      { title: 'Zeit statt Dinge', description: 'Ein gemeinsames Essen nach der Hochzeit ist uns genauso lieb.' },
    ],
    bankInfo: { holder: 'Anna Weber & Sebastian König', iban: 'DE00 0000 0000 0000 0000 00', bic: 'DEMODExx', note: 'Bitte als Verwendungszweck euren Namen angeben.' },
  }, light);
}

function faqSection(headline = 'Fragen, die ihr nicht einzeln stellen müsst.') {
  return section('faq', {
    badge: 'FAQ',
    headline,
    items: faqs,
  }, alt);
}

const pages = [
  {
    slug: '',
    title: 'Startseite',
    sections: [
      hero('Anna & Sebastian', 'Wir heiraten am 14. September 2026 und freuen uns auf einen Tag mit Familie, Freundinnen, Freunden, gutem Essen und genug Zeit füreinander.', img.hero),
      storySection(),
      section('signatureGrid', { badge: 'Kurz & wichtig', headline: 'Alles, was ihr zuerst wissen müsst.', subline: 'Datum, Ort, Zusage und ein paar Hinweise, damit ihr direkt planen könnt.', items: [
        { eyebrow: 'Wann', title: '14. September 2026', text: 'Ankommen ab 13:30 Uhr, freie Trauung um 14:30 Uhr.' },
        { eyebrow: 'Wo', title: 'Gut Sonnenhof', text: 'Garten, Saal und Scheune bei Starnberg.' },
        { eyebrow: 'RSVP', title: 'Bis 30. Juni', text: 'Bitte tragt Zusage, Personen und Essen direkt online ein.' },
        { eyebrow: 'Gefühl', title: 'Festlich, warm, locker', text: 'Ein Sommerabend, der schön aussieht und sich entspannt anfühlt.' },
      ], cta: { label: 'Jetzt zusagen', href: '/rsvp' } }, light),
      scheduleSection(),
      venueSection(),
      section('editorialFeatureRail', { badge: 'Gäste-Guide', headline: 'Drei Dinge, die den Tag leichter machen.', subline: 'Die wichtigsten Infos liegen auch auf eigenen Seiten, hier der schnelle Einstieg.', slides: [
        { eyebrow: 'Anreise', title: 'Parken, Shuttle, Hotel.', text: 'Alles zur Anreise und zu Unterkünften gesammelt an einem Ort.', image: img.venue, cta: { label: 'Anreise ansehen', href: '/anreise-hotels' } },
        { eyebrow: 'Outfit', title: 'Festlich ohne Stress.', text: 'Farben, Schuhe, Wetter und ein paar klare Hinweise.', image: img.flowers, cta: { label: 'Dresscode lesen', href: '/dresscode' } },
        { eyebrow: 'Abend', title: 'Dinner, Musik, Tanz.', text: 'Was wann passiert und wo ihr euch zwischendurch zurückziehen könnt.', image: img.dance, cta: { label: 'Ablauf ansehen', href: '/hochzeitstag' } },
      ] }, alt),
      section('newsPreview', { headline: 'Updates für Gäste', subline: 'Wenn sich Shuttle, Menü oder Details ändern, findet ihr es hier zuerst.', linkLabel: 'Alle Updates lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, light),
      cta('Bitte sagt uns bis Ende Juni Bescheid.', 'Mit eurer Rückmeldung planen wir Sitzplätze, Menü, Shuttle und alles, was den Tag entspannt macht.'),
    ],
  },
  {
    slug: 'hochzeitstag',
    title: 'Hochzeitstag',
    sections: [
      hero('Unser Hochzeitstag', 'Ein Ablauf mit klaren Zeiten, aber ohne steifes Programm. Ihr sollt wissen, wann ihr wo sein solltet und dazwischen einfach ankommen.', img.table, { showCountdown: false, bgPosition: 'center 48%' }),
      scheduleSection('Der Ablauf vom Ankommen bis zur Tanzfläche.'),
      menuSection(),
      partySection(),
      faqSection('Was am Hochzeitstag wichtig ist.'),
      cta('Habt ihr noch eine Frage zum Tag?', 'Schreibt uns oder meldet euch bei Lea und Moritz. Lieber einmal gefragt als vor Ort gesucht.'),
    ],
  },
  {
    slug: 'location',
    title: 'Location',
    sections: [
      hero('Gut Sonnenhof', 'Unser Ort für Trauung, Aperitif, Dinner und Party. Draußen, drinnen und alles nah beieinander.', img.venue, { showCountdown: false }),
      venueSection(),
      section('gallery', { badge: 'Eindruck', headline: 'So fühlt sich der Ort an.', images: galleryImages }, light),
      travelSection(),
      cta('Plant die Anreise lieber mit etwas Luft.', 'Der Garten ist schöner, wenn man nicht direkt aus dem Auto zur Trauung sprintet.'),
    ],
  },
  {
    slug: 'anreise-hotels',
    title: 'Anreise & Hotels',
    sections: [
      hero('Anreise ohne Rätselraten', 'Bahn, Auto, Shuttle und Hotels: alles, was ihr für die Planung braucht.', img.hotel, { showCountdown: false, bgPosition: 'center 45%' }),
      travelSection(),
      section('additionalLocations', { badge: 'Hotel-Tipps', headline: 'Drei sinnvolle Optionen in der Nähe.', subline: 'Bitte bucht früh, weil im September rund um den See viel los ist.', locations: [
        { name: 'Hotel Vier Jahreszeiten Starnberg', address: 'Münchner Straße 17, Starnberg', phone: '+49 8151 4470', email: 'reservierung@example.com', note: 'Kontingent unter Anna & Sebastian', cta: { label: 'Anfragen', href: 'https://example.com' } },
        { name: 'Seehaus Pension', address: 'Seestraße 12, Starnberg', phone: '+49 8151 0000', email: 'info@example.com', note: 'klein, nah am Shuttlepunkt', cta: { label: 'Anfragen', href: 'https://example.com' } },
        { name: 'München Süd', address: 'S-Bahn-Nähe Richtung Starnberg', phone: '', email: '', note: 'praktisch bei Weiterreise', cta: { label: 'Route prüfen', href: 'https://maps.google.com' } },
      ] }, light),
      faqSection('Fragen zu Anreise und Übernachtung.'),
    ],
  },
  {
    slug: 'rsvp',
    title: 'RSVP',
    sections: [
      hero('Sagt uns bitte Bescheid', 'Kommt ihr? Mit wem? Gibt es Unverträglichkeiten? Hier sammeln wir alles, was wir für eine saubere Planung brauchen.', img.stationery, { showCountdown: false }),
      section('rsvp', { badge: 'RSVP', headline: 'Zusage senden', subline: 'Bitte tragt euch bis zum 30. Juni 2026 ein. Wenn sich später etwas ändert, schreibt uns direkt.', deadline: '2026-06-30', maxGuests: 8, showSongWish: true, showDietary: true, showAllergies: true }, light),
      menuSection(),
      faqSection('Fragen zur Zusage.'),
    ],
  },
  {
    slug: 'dresscode',
    title: 'Dresscode',
    sections: [
      hero('Dresscode ohne Kopfzerbrechen', 'Ein paar Farben, ein paar Hinweise und viel Freiheit. Ihr sollt euch schön fühlen, nicht verkleidet.', img.flowers, { showCountdown: false }),
      dresscodeSection(),
      section('principlesGrid', { badge: 'Orientierung', headline: 'Was gut funktioniert.', subline: 'Nicht als Regelbuch, sondern als Hilfe.', principles: [
        { eyebrow: '01', title: 'Sommerlich festlich', text: 'Leichte Stoffe, gute Schuhe und Farben, die zum Garten passen.' },
        { eyebrow: '02', title: 'Wetter mitdenken', text: 'Abends kann es am See frisch werden. Eine Jacke ist klug.' },
        { eyebrow: '03', title: 'Bequem genug zum Tanzen', text: 'Wir planen keinen steifen Abend. Ihr sollt euch bewegen können.' },
        { eyebrow: '04', title: 'Kein Weiß', text: 'Alles andere bitte entspannt sehen. Schwarz ist erlaubt, wenn es sich für euch gut anfühlt.' },
      ], cta: { label: 'Bei Unsicherheit fragen', href: '/kontakt' } }, alt),
      section('gallery', { badge: 'Farben', headline: 'Warme Töne, weiches Licht.', images: [
        { src: img.flowers, alt: 'Blumen in warmen Farben' },
        { src: img.table, alt: 'Tafel mit Creme- und Rosétönen' },
        { src: img.garden, alt: 'Gartenstimmung' },
      ] }, light),
    ],
  },
  {
    slug: 'geschenke',
    title: 'Geschenke',
    sections: [
      hero('Geschenke sind schön, eure Zeit ist schöner', 'Wenn ihr kommen könnt, ist das schon das Wichtigste. Für alle, die trotzdem etwas schenken möchten, haben wir ein paar Hinweise gesammelt.', img.rings, { showCountdown: false }),
      giftSection(),
      section('freeText', { content: '<p>Bitte fühlt euch zu nichts verpflichtet. Wir wissen, dass Anreise, Hotel und Zeit schon viel sind. Wenn ihr uns etwas Persönliches schreiben möchtet, bedeutet uns das mindestens genauso viel wie jedes Geschenk.</p>' }, light),
      cta('Noch unsicher?', 'Fragt gern unsere Trauzeugen. Sie wissen, was praktisch ist und was eher nicht.'),
    ],
  },
  {
    slug: 'unsere-geschichte',
    title: 'Unsere Geschichte',
    sections: [
      hero('Warum wir feiern', 'Nicht, weil alles perfekt war. Sondern weil es mit uns beiden immer wieder leicht wurde.', img.couple, { showCountdown: false }),
      storySection(),
      section('scrollStory', { badge: 'Kapitel', headline: 'Kleine Momente, die geblieben sind.', subline: 'Kein Märchen, sondern viele echte Szenen.', chapters: [
        { title: 'Der erste Kaffee', text: 'Eigentlich ging es um ein Projekt. Am Ende wussten wir mehr übereinander als über die Aufgabe.', image: img.stationery },
        { title: 'Der erste Umzug', text: 'Kartons, Pflanzen, ein viel zu schweres Sofa und die Erkenntnis, dass wir auch Chaos zusammen gut können.', image: img.garden },
        { title: 'Der Antrag', text: 'Still, früh, am See. Kein Publikum, keine große Inszenierung. Genau richtig für uns.', image: img.rings },
      ] }, alt),
      section('gallery', { badge: 'Momente', headline: 'Ein paar Bilder für die Stimmung.', images: galleryImages }, light),
      cta('Jetzt wird aus Geschichte ein Fest.', 'Wir freuen uns, wenn ihr diesen nächsten Teil mit uns feiert.'),
    ],
  },
  {
    slug: 'news',
    title: 'Updates',
    sections: [
      hero('Updates für unsere Gäste', 'Alles, was sich bis zur Hochzeit noch konkretisiert: Shuttle, Menü, Hotelkontingente und kleine Hinweise.', img.stationery, { showCountdown: false }),
      section('newsGrid', { headline: 'Aktuelle Hinweise', subline: 'Wir halten diese Seite aktuell, damit nicht alles in Chatverläufen verschwindet.', collectionKey: 'news' }, light),
      cta('Fehlt euch eine Info?', 'Schreibt uns kurz. Wenn es mehrere betrifft, ergänzen wir sie hier.'),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    sections: [
      hero('Fragt lieber einmal zu viel', 'Für Zusagen nutzt bitte RSVP. Für alles andere erreicht ihr uns oder unsere Trauzeugen direkt.', img.garden, { showCountdown: false }),
      section('locationContact', { badgeText: 'Kontakt', headline: 'So erreicht ihr uns.', subline: 'Bitte keine wichtigen RSVP-Infos nur per Chat schicken, damit nichts verloren geht.', introText: 'Für Ablauf, Shuttle und Location helfen euch Lea und Moritz. Für persönliche Fragen schreibt uns direkt.', image: img.garden, mapEmbedUrl: mapEmbed, formEnabled: true, submitLabel: 'Nachricht senden', infoCards: [{ icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'MapPin', label: 'Location', value: address }], primaryCta: { label: 'E-Mail schreiben', href: `mailto:${email}` }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } }, light),
      faqSection('Häufige Fragen vor der Nachricht.'),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben', content: 'Anna Weber & Sebastian König, Demo-Hochzeitsseite' }, { title: 'Kontakt', content: `${email} · ${phone}` }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte und Angaben dienen ausschließlich der Demonstration.' }] }, light)],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortliche', content: 'Anna Weber & Sebastian König' }, { title: 'RSVP', content: 'RSVP-Daten werden zur Planung der Hochzeit genutzt, insbesondere Personenanzahl, Essenswünsche und Rückfragen.' }, { title: 'Kontaktformular', content: 'Nachrichten werden ausschließlich zur Bearbeitung der Anfrage verwendet.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }] }, light)],
  },
];

function newsItemSections(item) {
  return prefixDemoLinks([
    collectionHero(item.title, item.excerpt, item.image, 'Update'),
    section('freeText', { content: item.content }, light),
    cta('Habt ihr dazu noch eine Frage?', 'Schreibt uns kurz, dann ergänzen wir die Info, falls sie auch für andere wichtig ist.', { label: 'Kontakt aufnehmen', href: '/kontakt' }),
  ]);
}

async function upsertPage(page, existingPages) {
  const existing = existingPages.find((p) => p.slug === page.slug);
  const payload = { slug: page.slug, title: page.title, sections: prefixDemoLinks(page.sections), visible: true, status: 'published' };
  if (existing) return api('PUT', `/api/v1/content/pages/${existing.id}`, payload);
  return api('POST', '/api/v1/content/pages', payload);
}

async function ensureCollection(key, label, existingCollections) {
  const found = existingCollections.find((c) => c.key === key);
  if (found) return found;
  return api('POST', '/api/v1/content/collections', { key, label });
}

async function clearCollectionItems(key, collections) {
  const collection = collections.find((c) => c.key === key);
  if (!collection) return;
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
}

async function replaceCollectionItems(key, label, items, makeSections, collections) {
  const collection = await ensureCollection(key, label, collections);
  for (const item of collection.items || []) await api('DELETE', `/api/v1/content/collections/${key}/items/${item.id}`);
  for (const item of items) {
    await api('POST', `/api/v1/content/collections/${key}/items`, {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      published: true,
      data: { image: item.image, author: 'Anna & Sebastian', date: '2026-06-04', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', {
    companyName: 'Anna & Sebastian',
    tagline: 'Wir heiraten am 14. September 2026',
    primaryColor: colors.roseDeep,
    secondaryColor: colors.espresso,
    accentColor: colors.terracotta,
    logo: '',
    logoDisplay: 'name',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    topBarColor: colors.espresso,
    footerColor: colors.espresso,
  });
  await api('PUT', '/api/v1/content/design', {
    textPrimary: colors.ink,
    textSecondary: colors.soft,
    sectionBg: colors.cream,
    sectionBgAlt: colors.alt,
    cardBg: colors.card,
    cardBorder: colors.border,
    badgeBg: '#F4E3DC',
    badgeText: colors.roseDeep,
    badgeBorder: colors.border,
    brand: colors.roseDeep,
    accent: colors.terracotta,
    heading: colors.ink,
    subheading: colors.soft,
    body: colors.soft,
    muted: colors.muted,
    icon: colors.roseDeep,
    btnBg: colors.espresso,
    btnText: colors.onDark,
    dividerColor: colors.border,
    eyebrow: colors.roseDeep,
    statValue: colors.roseDeep,
    quote: colors.ink,
    ratingStar: colors.terracotta,
    check: colors.roseDeep,
    onDarkHeading: colors.onDark,
    onDarkBody: colors.onDarkBody,
    onDarkMuted: colors.onDarkMuted,
  });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: false, whatsapp: '', whatsappColor: colors.roseDeep });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Zusage senden', href: '/rsvp' } });
  await api('PUT', '/api/v1/content/footer', {
    columns: [
      { title: 'Unser Tag', items: [{ text: 'Hochzeitstag', href: '/hochzeitstag' }, { text: 'Location', href: '/location' }, { text: 'RSVP', href: '/rsvp' }] },
      { title: 'Für Gäste', items: [{ text: 'Anreise & Hotels', href: '/anreise-hotels' }, { text: 'Dresscode', href: '/dresscode' }, { text: 'Geschenke', href: '/geschenke' }] },
      { title: 'Kontakt', items: [{ text: email }, { text: phone }, { text: address }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Zusage senden', href: '/rsvp' },
  });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'RSVP-Frist', hours: 'bis 30. Juni 2026' }, { type: 'regular', day: 'Trauung', hours: '14. September 2026 · 14:30 Uhr' }, { type: 'regular', day: 'Ankommen', hours: 'ab 13:30 Uhr' }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'topic', label: 'Thema', type: 'select', options: ['RSVP-Frage', 'Anreise', 'Hotel', 'Dresscode', 'Sonstiges'], halfWidth: true }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { instagram: 'https://instagram.com', facebook: '', google: 'https://maps.google.com' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Anna & Sebastian', defaultTitle: 'Anna & Sebastian heiraten am 14. September 2026', defaultDescription: 'Alle Informationen zur Hochzeit von Anna & Sebastian: Ablauf, Location, RSVP, Anreise, Hotels, Dresscode, Geschenke und Updates.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/wedding', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);

  await clearCollectionItems('leistungen', collectionsBefore);
  await clearCollectionItems('referenzen', collectionsBefore);
  await clearCollectionItems('zimmer', collectionsBefore);
  await clearCollectionItems('angebote', collectionsBefore);
  await replaceCollectionItems('news', 'Updates', newsItems, newsItemSections, collectionsBefore);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Anna & Sebastian Hochzeit', 'Alle Informationen zur Hochzeit von Anna & Sebastian am 14. September 2026 am Gut Sonnenhof bei Starnberg.'],
    hochzeitstag: ['Hochzeitstag', 'Ablauf, Dinner, Party, Trauzeugen und wichtige Hinweise für den Hochzeitstag von Anna & Sebastian.'],
    location: ['Location', 'Gut Sonnenhof bei Starnberg: Garten, Saal, Scheune, Adresse, Karte und Hinweise zur Hochzeit.'],
    'anreise-hotels': ['Anreise & Hotels', 'Anreise, Parken, Shuttle und Hotelempfehlungen für die Hochzeit von Anna & Sebastian.'],
    rsvp: ['RSVP', 'Online-Zusage zur Hochzeit von Anna & Sebastian mit Personenanzahl und Essenshinweisen.'],
    dresscode: ['Dresscode', 'Dresscode, Farben und Outfit-Hinweise für die Sommerhochzeit von Anna & Sebastian.'],
    geschenke: ['Geschenke', 'Geschenkhinweise, Hochzeitsreise und Bankverbindung für Anna & Sebastian.'],
    'unsere-geschichte': ['Unsere Geschichte', 'Die Geschichte von Anna & Sebastian und warum sie ihre Hochzeit feiern.'],
    news: ['Updates', 'Aktuelle Hinweise zu Shuttle, Menü, Anreise, RSVP und Dresscode für die Hochzeit.'],
    kontakt: ['Kontakt', 'Kontakt zu Anna & Sebastian und den Trauzeugen für Fragen zur Hochzeit.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Anna & Sebastian`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
