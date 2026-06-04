const token = process.env.FLM_TOURISM_TOKEN || 'flm_pat_331b42a823e26b34b0ec72193fb3d5aff040cc4159028f35381719ac7f96b96b';
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
  hero: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=2200&q=85',
  valley: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
  lake: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85',
  village: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&q=85',
  family: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=85',
  route: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
  bike: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=85',
  culture: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=85',
  rain: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=85',
  winter: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1600&q=85',
  autumn: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=1600&q=85',
  spring: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85',
  event: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85',
  stay: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d5?w=1600&q=85',
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=85',
};

const colors = {
  ink: '#10202A',
  soft: '#52636B',
  muted: '#718078',
  cream: '#F8F5EC',
  alt: '#E8EEE5',
  card: '#FFFFFF',
  border: '#DCE3DA',
  forest: '#2F6F5E',
  forestDeep: '#0C211B',
  sage: '#8EA697',
  gold: '#D99A3D',
  goldSoft: '#F2C777',
  onDark: '#FFFFFF',
  onDarkBody: '#EAF0ED',
  onDarkMuted: '#C7D4CD',
};

const light = {
  sectionBg: colors.cream,
  cardBg: colors.card,
  cardBorder: colors.border,
  heading: colors.ink,
  subheading: colors.soft,
  body: colors.soft,
  muted: colors.muted,
  icon: colors.forest,
  accentColor: colors.gold,
  btnBg: colors.forest,
  btnText: colors.onDark,
  badgeBg: '#EDF2E7',
  badgeText: colors.forest,
  badgeBorder: colors.border,
  borderColor: colors.border,
};

const alt = { ...light, sectionBg: colors.alt, cardBg: '#FCFFF8' };

const dark = {
  sectionBg: colors.forestDeep,
  cardBg: 'rgba(255,255,255,0.10)',
  cardBorder: 'rgba(255,255,255,0.22)',
  heading: colors.onDark,
  subheading: colors.onDarkBody,
  body: colors.onDarkBody,
  muted: colors.onDarkMuted,
  icon: colors.goldSoft,
  accentColor: colors.goldSoft,
  btnBg: colors.goldSoft,
  btnText: colors.forestDeep,
  badgeBg: 'rgba(255,255,255,0.13)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,255,255,0.24)',
  borderColor: 'rgba(255,255,255,0.22)',
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const heroStyle = {
  heroHeading: colors.onDark,
  heroBody: colors.onDarkBody,
  badgeBg: 'rgba(255,255,255,0.14)',
  badgeText: colors.onDark,
  badgeBorder: 'rgba(255,255,255,0.28)',
  btnBg: colors.goldSoft,
  btnText: colors.forestDeep,
  onDarkHeading: colors.onDark,
  onDarkBody: colors.onDarkBody,
  onDarkMuted: colors.onDarkMuted,
};

const phone = '+43 512 804 72';
const email = 'servus@berg-tal-erlebnisse.at';
const address = 'Dorfplatz 4, 6167 Neustift im Stubaital, Österreich';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2668.0!2d11.316!3d47.115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTmV1c3RpZnQgaW0gU3R1YmFpdGFs!5e0!3m2!1sde!2sat!4v1710000000000';

const navItems = [
  { label: 'Startseite', href: '/', type: 'link' },
  { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
  { label: 'Routen', href: '/routen', type: 'link' },
  { label: 'Orte', href: '/orte', type: 'link' },
  { label: 'Saison', href: '/saison', type: 'link' },
  { label: 'Kontakt', href: '/kontakt', type: 'link' },
];

const highlights = [
  { title: 'Sonnenplateau', text: 'Leichte Wege, viel Blick und genug Bänke für Pausen. Ideal für den ersten Tag im Tal.', image: img.valley, category: 'Panorama', cta: { label: 'Route ansehen', href: '/c/routen/sonnenplateau-runde' } },
  { title: 'Badesee & Uferweg', text: 'Kurzer Spaziergang, klares Wasser und Plätze, an denen Familien nicht ständig weiterziehen müssen.', image: img.lake, category: 'Familie', cta: { label: 'Erlebnis lesen', href: '/c/erlebnisse/badesee-uferweg' } },
  { title: 'Almdorf Mitterrast', text: 'Holz, Käse, Aussicht und ein Weg, der sich auch ohne Gipfeldruck gut anfühlt.', image: img.village, category: 'Genuss', cta: { label: 'Ort entdecken', href: '/orte' } },
];

const routes = [
  { slug: 'sonnenplateau-runde', title: 'Sonnenplateau-Runde', excerpt: 'Eine ruhige Halbtagesroute mit Blick ins Tal, weichen Wegen und guter Einkehr.', image: img.route, category: 'Wandern', lengthLabel: '8,4 km', durationLabel: 'ca. 3 h', difficultyLabel: 'leicht bis mittel', startLabel: 'Start: Dorfplatz', highlights: ['Panorama', 'Einkehr', 'familientauglich'] },
  { slug: 'almweg-mitterrast', title: 'Almweg Mitterrast', excerpt: 'Ein Weg für Menschen, die lieber klar gehen als Kilometer sammeln.', image: img.village, category: 'Alm', lengthLabel: '6,1 km', durationLabel: 'ca. 2 h', difficultyLabel: 'leicht', startLabel: 'Start: Waldparkplatz', highlights: ['Alm', 'Käse', 'Schatten'] },
  { slug: 'talradweg-nord', title: 'Talradweg Nord', excerpt: 'Die gute E-Bike-Strecke für Gäste, die Orte verbinden wollen statt nur Höhenmeter zu zählen.', image: img.bike, category: 'Rad', lengthLabel: '22 km', durationLabel: '2-3 h', difficultyLabel: 'leicht', startLabel: 'Start: Infopoint', highlights: ['E-Bike', 'Orte', 'Badesee'] },
  { slug: 'kulturweg-altes-dorf', title: 'Kulturweg Altes Dorf', excerpt: 'Kurzer Rundgang mit Kapelle, Bauernhöfen, Werkstätten und Geschichten, die nicht im Prospekt stehen.', image: img.culture, category: 'Kultur', lengthLabel: '3,2 km', durationLabel: '60-90 min', difficultyLabel: 'leicht', startLabel: 'Start: Museum', highlights: ['Kultur', 'Regenoption', 'kurz'] },
];

const experiences = [
  { slug: 'badesee-uferweg', title: 'Badesee & Uferweg', excerpt: 'Ein unkomplizierter Nachmittag mit Wasser, Schatten und kurzem Weg zurück ins Dorf.', image: img.lake, category: 'Familie', durationLabel: '2-4 h', priceLabel: 'frei zugänglich' },
  { slug: 'almfruehstueck', title: 'Almfrühstück mit Blick', excerpt: 'Früh starten, langsam essen, danach entscheiden: weiterwandern oder einfach bleiben.', image: img.village, category: 'Genuss', durationLabel: 'Vormittag', priceLabel: 'nach Hütte' },
  { slug: 'regenprogramm', title: 'Regenprogramm ohne Notlösung', excerpt: 'Museum, Werkstattbesuch, Kaffee und kurze Wege. Auch graue Tage können gut geplant sein.', image: img.rain, category: 'Schlechtwetter', durationLabel: 'halber Tag', priceLabel: 'variabel' },
  { slug: 'abendrunde', title: 'Abendrunde am Hang', excerpt: 'Wenn das Licht weicher wird: kurze Runde, ruhiger Blick und kein voller Parkplatz.', image: img.autumn, category: 'Ruhe', durationLabel: '45-75 min', priceLabel: 'frei' },
];

const seasons = [
  { title: 'Frühling', text: 'Klare Luft, erste Hütten, weniger Betrieb. Gut für Spaziergänge, Kultur und ruhige Gastgeber.', image: img.spring, periodLabel: 'April-Juni', cta: { label: 'Frühling planen', href: '/saison' } },
  { title: 'Sommer', text: 'Badesee, Almen, Familienwege und Routen mit Schatten. Wir empfehlen Startzeiten statt nur Ziele.', image: img.lake, periodLabel: 'Juli-August', cta: { label: 'Sommer ansehen', href: '/saison' } },
  { title: 'Herbst', text: 'Warme Farben, stabile Tage und weniger Hektik. Ideal für Genussrouten und lange Wochenenden.', image: img.autumn, periodLabel: 'September-Oktober', cta: { label: 'Herbst entdecken', href: '/saison' } },
  { title: 'Winter', text: 'Schnee, Spazierwege, Hütten und stille Vormittage. Gut, wenn man nicht jeden Tag Programm braucht.', image: img.winter, periodLabel: 'Dezember-März', cta: { label: 'Winter planen', href: '/saison' } },
];

const events = [
  { title: 'Almabend am Mitterrast-Hof', text: 'Kleine Runde, regionale Küche und Geschichten vom Sommer auf der Alm.', image: img.village, dateLabel: 'jeden Freitag im Juli', locationLabel: 'Mitterrast', category: 'Genuss', priceLabel: 'ab 38 €', cta: { label: 'Anfragen', href: '/kontakt' } },
  { title: 'Geführte Sonnenaufgangsrunde', text: 'Früh los, langsam gehen, pünktlich zum Frühstück zurück.', image: img.route, dateLabel: 'samstags', locationLabel: 'Sonnenplateau', category: 'Wandern', priceLabel: 'mit Gästekarte reduziert', cta: { label: 'Platz anfragen', href: '/kontakt' } },
  { title: 'Werkstatt & Dorfgeschichten', text: 'Ein kurzer Abend für Gäste, die wissen möchten, wie das Tal wirklich arbeitet.', image: img.culture, dateLabel: 'monatlich', locationLabel: 'Altes Dorf', category: 'Kultur', priceLabel: 'freiwilliger Beitrag', cta: { label: 'Mehr erfahren', href: '/events' } },
];

const accommodations = [
  { title: 'Familienpensionen', text: 'Kurze Wege, echte Frühstückstipps und Gastgeber, die wissen, wo Kinder gut ankommen.', image: img.stay, typeLabel: 'Familie', priceLabel: 'ab 92 € p. P.', amenities: ['Frühstück', 'Gästekarte', 'Parken'], cta: { label: 'Anfrage senden', href: '/kontakt' } },
  { title: 'Ferienwohnungen', text: 'Gut für längere Aufenthalte, flexible Tage und Gäste, die selbst kochen möchten.', image: img.village, typeLabel: 'Apartment', priceLabel: 'ab 140 € / Nacht', amenities: ['Küche', 'Balkon', 'Waschraum'], cta: { label: 'Verfügbarkeit fragen', href: '/kontakt' } },
  { title: 'Hütten & Almlodges', text: 'Mehr Ruhe, mehr Natur, etwas mehr Planung. Wir sagen ehrlich, was erreichbar ist.', image: img.route, typeLabel: 'Alm', priceLabel: 'auf Anfrage', amenities: ['Aussicht', 'Holzofen', 'Transfer klären'], cta: { label: 'Beratung anfragen', href: '/kontakt' } },
];

const places = [
  { title: 'Infopoint Dorfplatz', text: 'Karten, ehrliche Tagesempfehlungen und schnelle Hilfe, wenn Wetter oder Zeitplan kippen.', category: 'Service', distanceLabel: 'zentral', address, image: img.office, cta: { label: 'Kontakt', href: '/kontakt' } },
  { title: 'Badesee Neustift', text: 'Flaches Ufer, kurze Wege und genug Platz für Familienpausen.', category: 'Wasser', distanceLabel: '10 Min.', address: 'Seestraße 2', image: img.lake, cta: { label: 'Details', href: '/c/erlebnisse/badesee-uferweg' } },
  { title: 'Altes Dorf', text: 'Kapelle, Werkstätten und Häuser, die zeigen, wie das Tal gewachsen ist.', category: 'Kultur', distanceLabel: '5 Min.', address: 'Kirchgasse', image: img.culture, cta: { label: 'Kulturweg', href: '/c/routen/kulturweg-altes-dorf' } },
];

const newsItems = [
  { slug: 'samstag-im-tal', title: 'Was man im Tal an einem freien Samstag wirklich machen kann', excerpt: 'Drei Vorschläge für Gäste, die nicht den ganzen Tag im Auto sitzen wollen.', image: img.valley, content: '<p>Ein guter Samstag braucht nicht zwingend den höchsten Gipfel. Oft reicht eine klare Reihenfolge: vormittags eine kurze Route, mittags Einkehr, nachmittags Badesee oder Dorf.</p><p>Unser Tipp: Sonnenplateau-Runde früh starten, danach Mitterrast oder See. Wer mit Kindern reist, plant bewusst weniger und kommt entspannter zurück.</p>' },
  { slug: 'herbst-ohne-stress', title: 'Drei Wege, den Herbst ohne Stress zu erleben', excerpt: 'Warum September und Oktober oft die besten Reisemonate für ruhige Tage sind.', image: img.autumn, content: '<p>Der Herbst ist nicht nur Nebensaison. Er ist die Zeit, in der Wege leerer werden, Gastgeber mehr Luft haben und die Farben klarer wirken.</p><p>Besonders gut funktionieren Genussrouten, Kulturwege und Wochenenden mit nur einem festen Programmpunkt pro Tag.</p>' },
  { slug: 'gute-gaesteinfo', title: 'Warum gute Gästeinformation vor der Anreise beginnt', excerpt: 'Eine Destination wirkt besser, wenn Gäste nicht erst vor Ort sortieren müssen.', image: img.office, content: '<p>Gäste brauchen keine endlosen Listen. Sie brauchen eine ehrliche Einordnung: Was passt bei Regen? Was geht mit Kindern? Welche Route ist wirklich leicht?</p><p>Deshalb schreiben wir unsere Empfehlungen so, dass man direkt entscheiden kann.</p>' },
];

function hero(headline, subline, image, extra = {}) {
  return section('hero', {
    badgeText: extra.badgeText || 'Berg & Tal Erlebnisse',
    headline,
    subline,
    bgMode: 'image',
    bgImage: image,
    bgPosition: extra.bgPosition || 'center',
    overlayColor: extra.overlayColor || colors.forestDeep,
    overlayOpacity: extra.overlayOpacity ?? 0.58,
    imageEffect: extra.imageEffect || 'kenBurns',
    imageEffectIntensity: extra.imageEffectIntensity || 'subtle',
    locationLabel: extra.locationLabel || 'Stubaital · Tirol',
    seasonLabel: extra.seasonLabel || 'Ganzjährig planbar',
    trustItems: extra.trustItems || ['ehrliche Empfehlungen', 'Routen mit Kontext', 'Gästekarte & Mobilität'],
    primaryCta: extra.primaryCta || { label: 'Reise planen', href: '/kontakt', icon: 'Send' },
    secondaryCta: extra.secondaryCta || { label: 'Erlebnisse ansehen', href: '/erlebnisse', icon: 'Compass' },
  }, heroStyle);
}

function cta(headline, subline) {
  return section('immersiveCtaBanner', {
    badge: 'Direkt fragen',
    headline,
    subline,
    image: img.valley,
    overlay: 'rgba(12,33,27,0.68)',
    primaryCta: { label: 'Gästeberatung kontaktieren', href: '/kontakt' },
    secondaryCta: { label: 'Routen ansehen', href: '/routen' },
    metrics: [{ value: '4', label: 'Jahreszeiten' }, { value: '12+', label: 'konkrete Tipps' }],
  }, dark);
}

const visitorBlocks = [
  { icon: 'CloudSun', title: 'Wetter realistisch planen', text: 'Wir empfehlen Routen nach Tagesform, Wetterfenster und Rückweg, nicht nur nach Foto.', items: ['Morgenfenster', 'Schattenwege', 'Regenoptionen'] },
  { icon: 'Bus', title: 'Mobilität im Tal', text: 'Viele Ziele funktionieren mit Bus, Rad oder kurzer Autofahrt. Wir sagen, wo es sinnvoll ist.', items: ['Gästekarte', 'Parkplätze', 'Shuttle klären'] },
  { icon: 'Backpack', title: 'Ausrüstung ohne Drama', text: 'Gutes Schuhwerk, Wasser, Schichtkleidung. Für leichte Wege reicht oft weniger, als man denkt.', items: ['Schuhe', 'Wasser', 'Sonnenschutz'] },
  { icon: 'Users', title: 'Für Familien denken', text: 'Kurze Wege, Pausenorte und ein klares Ziel sind wichtiger als ein langer Plan.', items: ['Kinderwagen prüfen', 'Pausen', 'kurze Varianten'] },
];

const pages = [
  { slug: '', title: 'Startseite', sections: [
    hero('Ein Tal, das nicht bespielt werden muss.', 'Wir zeigen Wege, Orte und Tage, die wirklich zu Ihrer Reise passen: ruhig, klar beschrieben und ohne unnötige Umwege.', img.hero),
    section('destinationHighlights', { badgeText: 'Highlights', headline: 'Drei Einstiege, die das Tal gut erklären.', subline: 'Nicht alles muss auf einmal passieren. Diese Orte funktionieren als erster, zweiter oder ruhiger Reisetag.', items: highlights, ctaPrimary: { label: 'Alle Orte ansehen', href: '/orte' } }, light),
    section('experienceGrid', { badgeText: 'Erlebnisse', headline: 'Für Tage, die nicht gleich aussehen sollen.', subline: 'Familie, Genuss, Regenwetter oder Abendlicht: Wir sortieren Erlebnisse nach echtem Nutzen.', items: experiences.map((item) => ({ ...item, cta: { label: 'Mehr lesen', href: `/c/erlebnisse/${item.slug}` } })) }, alt),
    section('tourRoutes', { badgeText: 'Routen', headline: 'Wege mit klarer Einordnung.', subline: 'Länge, Dauer, Schwierigkeit und Startpunkt stehen direkt dabei, damit die Entscheidung leichter wird.', routes: routes.slice(0, 3).map((route) => ({ ...route, cta: { label: 'Route ansehen', href: `/c/routen/${route.slug}` } })), ctaPrimary: { label: 'Alle Routen ansehen', href: '/routen' } }, light),
    section('seasonTeaser', { badgeText: 'Saison', headline: 'Jede Jahreszeit hat ihren eigenen Rhythmus.', subline: 'Wir zeigen nicht nur, wann es schön ist, sondern was dann wirklich gut funktioniert.', seasons }, alt),
    section('eventsCalendar', { badgeText: 'Kalender', headline: 'Kleine Formate statt lauter Programme.', subline: 'Geführte Runden, Almabende und Kulturmomente mit begrenzten Plätzen.', events }, light),
    section('newsPreview', { headline: 'Notizen aus Berg & Tal', subline: 'Kurze Beiträge zu Routen, Saison und guter Reiseplanung.', linkLabel: 'Alle Beiträge lesen', linkIcon: 'ArrowRight', collectionKey: 'news' }, alt),
    cta('Sie möchten keinen Standardplan?', 'Schreiben Sie uns Zeitraum, Gäste und Interessen. Wir antworten mit einer klaren Empfehlung.'),
  ] },
  { slug: 'erlebnisse', title: 'Erlebnisse', sections: [
    hero('Erlebnisse, die zum Tag passen.', 'Nicht jedes Wetter, jede Gruppe und jede Reise braucht dasselbe Programm. Wir ordnen ehrlich ein.', img.lake, { badgeText: 'Erlebnisse' }),
    section('experienceGrid', { badgeText: 'Auswahl', headline: 'Vom Badesee bis zur Regenoption.', subline: 'Jedes Erlebnis bekommt Kontext: Dauer, Zielgruppe, Kostenrahmen und gute Tageszeit.', items: experiences.map((item) => ({ ...item, cta: { label: 'Details lesen', href: `/c/erlebnisse/${item.slug}` } })) }, light),
    section('sightseeingList', { badgeText: 'Sehenswert', headline: 'Orte, die man nicht abhaken muss.', subline: 'Kurze Wege, gute Erklärungen und Plätze, an denen man wirklich bleibt.', items: places.map((place) => ({ ...place, openingText: 'Details und Zeiten bitte saisonal prüfen.' })) }, alt),
    section('editorialFeatureRail', { badge: 'Tagesideen', headline: 'Drei gute Arten, den Tag zu bauen.', subline: 'Je nach Wetter, Energie und Reisegruppe.', slides: [
      { eyebrow: 'Familie', title: 'Kurz gehen, lang bleiben.', text: 'Badesee, Uferweg, Eis und ein Rückweg ohne Diskussion.', image: img.lake, cta: { label: 'Familienidee ansehen', href: '/c/erlebnisse/badesee-uferweg' } },
      { eyebrow: 'Ruhe', title: 'Ein Gipfel ist kein Muss.', text: 'Abendrunde, Bank, Aussicht. Manchmal reicht weniger für mehr Urlaub.', image: img.autumn, cta: { label: 'Routen prüfen', href: '/routen' } },
      { eyebrow: 'Regen', title: 'Kein verlorener Tag.', text: 'Kulturweg, Museum, Werkstatt und Kaffee statt Notlösung.', image: img.rain, cta: { label: 'Regenprogramm', href: '/c/erlebnisse/regenprogramm' } },
    ] }, light),
    section('faq', { headline: 'Häufige Fragen zu Erlebnissen', items: [{ question: 'Muss ich Aktivitäten vorab buchen?', answer: 'Für geführte Formate ja. Freie Routen und Orte können Sie flexibel planen.' }, { question: 'Gibt es Empfehlungen für Kinder?', answer: 'Ja. Wir markieren kurze Wege, Pausenorte und Ziele mit guter Erreichbarkeit.' }, { question: 'Was passiert bei schlechtem Wetter?', answer: 'Wir schlagen Alternativen vor, die nicht nach Notlösung wirken.' }] }, alt),
  ] },
  { slug: 'routen', title: 'Routen', sections: [
    hero('Routen, die vorab verständlich sind.', 'Wir beschreiben Wege so, dass man nicht erst unterwegs merkt, ob sie passen.', img.route, { badgeText: 'Routen' }),
    section('tourRoutes', { badgeText: 'Wandern & Rad', headline: 'Vier Wege mit klaren Eckdaten.', subline: 'Startpunkt, Dauer, Schwierigkeit und Highlights auf einen Blick.', routes: routes.map((route) => ({ ...route, cta: { label: 'Route ansehen', href: `/c/routen/${route.slug}` } })) }, light),
    section('visitorInfo', { badgeText: 'Vorbereitung', headline: 'Gut vorbereitet heißt nicht kompliziert.', subline: 'Ein paar klare Hinweise reichen oft, damit der Tag ruhiger wird.', introText: 'Wir achten besonders auf Wetter, Rückweg, Einkehr und Mobilität. Wer das vorher klärt, muss unterwegs weniger improvisieren.', blocks: visitorBlocks }, alt),
    section('downloadGuides', { badgeText: 'Downloads', headline: 'Karten & Guides für unterwegs.', subline: 'Praktische Unterlagen als Platzhalter für echte PDFs im CMS.', items: [
      { title: 'Wanderkarte Sommer', text: 'Routen, Einkehr, Varianten und Hinweise zu Startpunkten.', metaLabel: 'PDF', fileLabel: 'Karte herunterladen', fileHref: '#' },
      { title: 'Familienguide', text: 'Kurze Wege, Wasser, Spielplätze und Pausenorte.', metaLabel: 'Guide', fileLabel: 'Guide öffnen', fileHref: '#' },
      { title: 'Regenprogramm', text: 'Museen, Werkstätten, Cafés und kurze Kulturwege.', metaLabel: 'Checkliste', fileLabel: 'Checkliste ansehen', fileHref: '#' },
    ] }, light),
  ] },
  { slug: 'orte', title: 'Orte & Ausflüge', sections: [
    hero('Orte, die man wiederfindet.', 'Vom Infopoint bis zum See: Wir zeigen, was nah liegt, gut erreichbar ist und wirklich lohnt.', img.village, { badgeText: 'Orte' }),
    section('placesMap', { badgeText: 'Karte', headline: 'Schnell orientieren, besser entscheiden.', subline: 'Die wichtigsten Orte mit kurzer Einordnung und Link zum nächsten sinnvollen Schritt.', mapEmbedUrl: mapsEmbed, places, ctaPrimary: { label: 'Frage zum Ort stellen', href: '/kontakt' } }, light),
    section('destinationHighlights', { badgeText: 'Ausflüge', headline: 'Orte mit eigenem Charakter.', subline: 'Nicht jeder Ort muss viel können. Entscheidend ist, wofür er gut ist.', items: highlights }, alt),
    section('additionalLocations', { badge: 'Infopoints', headline: 'Weitere Anlaufstellen im Tal.', subline: 'Optionale Kontakte und Orte, wenn Gäste unterwegs schnelle Hilfe brauchen.', locations: [
      { name: 'Infopoint Dorfplatz', address, phone, email, description: 'Karten, Empfehlungen und Gästekarte.' },
      { name: 'Infopoint Badesee', address: 'Seestraße 2, 6167 Neustift', phone, description: 'Sommer, Familienwege und Wasserqualität.' },
      { name: 'Infopoint Altes Dorf', address: 'Kirchgasse 8, 6167 Neustift', email, description: 'Kulturwege, Führungen und Regenprogramm.' },
    ] }, light),
  ] },
  { slug: 'saison', title: 'Saison', sections: [
    hero('Vier Jahreszeiten, vier gute Gründe.', 'Wir helfen, den Reisezeitraum nicht nur nach Kalender, sondern nach Wunschgefühl zu wählen.', img.autumn, { badgeText: 'Saison' }),
    section('seasonTeaser', { badgeText: 'Jahreszeiten', headline: 'Wann passt welche Reise?', subline: 'Frühling für Ruhe, Sommer für Familien, Herbst für Genuss, Winter für klare Tage.', seasons }, light),
    section('comparisonCardsPro', { badge: 'Entscheidungshilfe', headline: 'Welche Saison passt zu Ihnen?', subline: 'Eine einfache Einordnung für die häufigsten Reisearten.', cards: [
      { title: 'Familie', text: 'Sommer oder früher Herbst: Wasser, kurze Wege, längere Tage.', items: ['Badesee', 'leichte Routen', 'viel draußen'], cta: { label: 'Familienideen', href: '/erlebnisse' } },
      { title: 'Ruhe', text: 'Frühling und Herbst: weniger Betrieb, klare Luft, gute Gastgeberzeit.', items: ['kurze Wege', 'Genuss', 'Kultur'], cta: { label: 'Saison fragen', href: '/kontakt' }, highlighted: true },
      { title: 'Aktiv', text: 'Sommer und Winter: Routen, Bergbahnen, Schnee oder Höhenwege.', items: ['Touren', 'Bergbahnen', 'Ausrüstung klären'], cta: { label: 'Routen ansehen', href: '/routen' } },
    ] }, alt),
    section('eventsCalendar', { badgeText: 'Kalender', headline: 'Was saisonal passiert.', subline: 'Kleine Formate, die zum Rhythmus des Tals passen.', events }, light),
  ] },
  { slug: 'unterkuenfte', title: 'Unterkünfte', sections: [
    hero('Gut schlafen beginnt mit ehrlicher Beratung.', 'Wir vermitteln keine Beliebigkeit, sondern passende Gastgeber für Reiseart, Zeitraum und Budget.', img.stay, { badgeText: 'Unterkünfte' }),
    section('accommodationGrid', { badgeText: 'Gastgeber', headline: 'Unterkünfte nach Reiseart sortiert.', subline: 'Familienpension, Ferienwohnung oder Hütte: Jede Option hat einen anderen Rhythmus.', items: accommodations }, light),
    section('visitorInfo', { badgeText: 'Buchung', headline: 'Was vor der Anfrage hilft.', subline: 'Je klarer Zeitraum, Personen und Wunschgefühl sind, desto besser finden wir passende Gastgeber.', introText: 'Bitte nennen Sie Reisedaten, Anzahl der Gäste, Alter der Kinder und ob Frühstück, Küche oder ruhige Lage wichtiger ist.', blocks: [
      { icon: 'CalendarDays', title: 'Zeitraum', text: 'Anreise, Abreise und flexible Alternativen helfen bei der Verfügbarkeit.', items: ['Datum', 'Nächte', 'Flexibilität'] },
      { icon: 'Users', title: 'Reisegruppe', text: 'Personenzahl, Kinderalter und gewünschte Zimmeraufteilung.', items: ['Erwachsene', 'Kinder', 'Zimmer'] },
      { icon: 'Heart', title: 'Wunschgefühl', text: 'Ruhig, zentral, familiennah, mit Küche oder nah am Wasser.', items: ['ruhig', 'zentral', 'familiennah'] },
    ] }, alt),
    cta('Suchen Sie nicht länger in zehn Portalen.', 'Schreiben Sie uns, was wichtig ist. Wir sortieren vor.'),
  ] },
  { slug: 'events', title: 'Events', sections: [
    hero('Kleine Events mit echtem Bezug zum Tal.', 'Almabend, Sonnenaufgangsrunde oder Kulturmoment: gut vorbereitet, begrenzt und persönlich.', img.event, { badgeText: 'Events' }),
    section('eventsCalendar', { badgeText: 'Kalender', headline: 'Aktuelle Formate.', subline: 'Termine ändern sich saisonal. Anfragen werden direkt geprüft.', events }, light),
    section('resourceBookingShowcase', { badge: 'Anfrage', headline: 'Plätze prüfen statt ins Blaue buchen.', subline: 'Für geführte Runden und kleine Formate fragen Gäste einfach Zeitraum und Personen an.', steps: [{ label: 'Format wählen' }, { label: 'Datum nennen' }, { label: 'Bestätigung erhalten' }], cta: { label: 'Event anfragen', href: '/kontakt' } }, alt),
    section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Was gerade im Tal passiert.', collectionKey: 'news' }, light),
  ] },
  { slug: 'ueber-uns', title: 'Über uns', sections: [
    hero('Wir erklären das Tal, statt es lauter zu machen.', 'Gute Gästeinformation ist ruhig, konkret und ehrlich. Genau so arbeiten wir.', img.office, { badgeText: 'Über uns' }),
    section('story', { badgeText: 'Haltung', headline: 'Ein guter Tipp spart mehr Zeit als eine lange Liste.', subline: 'Wir kennen die Orte, Wege und Gastgeber aus dem Alltag.', text: '<p>Berg & Tal Erlebnisse ist ein Demo-Tourismusbüro für eine Region, die nicht künstlich größer wirken muss. Unsere Aufgabe ist Orientierung: Was passt zum Wetter, zur Gruppe, zum Zeitraum und zur Energie?</p><p>Wir schreiben Empfehlungen so, dass Gäste sofort entscheiden können. Keine austauschbaren Superlative, sondern konkrete Hinweise, ehrliche Einschränkungen und gute nächste Schritte.</p>', image: img.office, ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' } }, light),
    section('principlesGrid', { badge: 'Was uns wichtig ist', headline: 'Orientierung ist Gastfreundschaft.', subline: 'Wer gut informiert ist, reist ruhiger.', principles: [
      { eyebrow: '01', title: 'Ehrlich vor spektakulär', text: 'Nicht jede Route passt zu jedem Tag. Wir sagen das.' },
      { eyebrow: '02', title: 'Kürzer kann besser sein', text: 'Ein stimmiger halber Tag schlägt ein überfülltes Programm.' },
      { eyebrow: '03', title: 'Wetter ist Teil der Planung', text: 'Gute Alternativen gehören von Anfang an dazu.' },
      { eyebrow: '04', title: 'Region statt Kulisse', text: 'Wir zeigen Orte mit Geschichte, Arbeit und Alltag.' },
    ], cta: { label: 'Mehr erfahren', href: '/kontakt' } }, alt),
    section('proofWall', { badge: 'Vertrauen', headline: 'Gäste merken, wenn Information hilft.', subline: 'Die häufigsten Rückmeldungen: klare Empfehlungen, gute Erreichbarkeit und weniger Planungsstress.', stats: [{ value: '12+', label: 'konkrete Tagesideen' }, { value: '4', label: 'Jahreszeiten' }, { value: '1', label: 'klarer Infopoint' }], testimonials: [
      { quote: 'Wir hatten nur drei Tage und trotzdem nie das Gefühl, etwas Falsches zu machen.', author: 'Familie Berger', meta: 'Sommerreise', rating: 5 },
      { quote: 'Die Regenempfehlung war am Ende der beste Tag der Reise.', author: 'M. Huber', meta: 'Herbstwochenende', rating: 5 },
    ] }, light),
  ] },
  { slug: 'kontakt', title: 'Kontakt', sections: [
    hero('Fragen Sie direkt nach dem passenden Tag.', 'Zeitraum, Gäste, Interessen und Wettergefühl reichen oft für eine gute Empfehlung.', img.office, { badgeText: 'Kontakt' }),
    section('tourismContact', { badgeText: 'Gästeberatung', headline: 'Wir antworten mit einer konkreten Empfehlung.', subline: 'Schreiben Sie, wer reist, wann Sie da sind und was sich gut anfühlen soll.', introText: 'Besonders hilfreich: Alter der Kinder, gewünschte Aktivität, Mobilität, Wettertoleranz und ob Sie lieber ruhig oder aktiv planen.', image: img.valley, formEnabled: true, submitLabel: 'Anfrage senden', infoCards: [{ icon: 'Phone', label: 'Telefon', value: phone }, { icon: 'Mail', label: 'E-Mail', value: email }, { icon: 'MapPin', label: 'Adresse', value: address }], primaryCta: { label: 'Anrufen', href: `tel:${phone.replaceAll(' ', '')}` }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } }, light),
    section('visitorInfo', { badgeText: 'Schnell klären', headline: 'Drei Angaben reichen für den Start.', subline: 'Wir brauchen keine perfekte Anfrage. Nur einen guten Rahmen.', introText: 'Wenn Sie uns Zeitraum, Gruppe und Wunsch nennen, schlagen wir den nächsten sinnvollen Schritt vor.', blocks: visitorBlocks.slice(0, 3) }, alt),
    section('faq', { headline: 'Fragen vor der Anfrage', items: [{ question: 'Kann ich auch ohne feste Idee schreiben?', answer: 'Ja. Genau dafür ist die Gästeberatung gedacht.' }, { question: 'Sind die Empfehlungen verbindlich buchbar?', answer: 'Freie Routen sind flexibel. Geführte Formate und Unterkünfte prüfen wir separat.' }, { question: 'Antworten Sie auch bei kurzfristigen Fragen?', answer: 'Ja, besonders bei Wetter, Mobilität und Tagesplanung.' }] }, light),
  ] },
  { slug: 'news', title: 'Journal', sections: [
    hero('Notizen aus Berg & Tal.', 'Kurze Beiträge zu Routen, Saison, Wetter und der Frage, wie Reisen leichter wird.', img.autumn, { badgeText: 'Journal' }),
    section('newsGrid', { headline: 'Aktuelle Beiträge', subline: 'Gute Hinweise statt langer Prospekte.', collectionKey: 'news' }, light),
    cta('Noch eine konkrete Frage?', 'Dann schreiben Sie uns direkt.'),
  ] },
  { slug: 'impressum', title: 'Impressum', sections: [section('legalContent', { headline: 'Impressum', blocks: [{ title: 'Angaben gemäß Mediengesetz', content: 'Berg & Tal Erlebnisse GmbH, Dorfplatz 4, 6167 Neustift im Stubaital, Österreich' }, { title: 'Kontakt', content: `${phone} · ${email}` }, { title: 'Vertretungsberechtigt', content: 'Geschäftsführung: Demo Tourismus GmbH' }, { title: 'Hinweis', content: 'Dies ist ein Demo-Tenant von Flamingo Media. Inhalte und Angaben dienen ausschließlich der Demonstration.' }] }, light)] },
  { slug: 'datenschutz', title: 'Datenschutz', sections: [section('legalContent', { headline: 'Datenschutzerklärung', blocks: [{ title: 'Verantwortlicher', content: 'Berg & Tal Erlebnisse GmbH, Dorfplatz 4, 6167 Neustift im Stubaital, Österreich' }, { title: 'Kontaktformular', content: 'Formulardaten werden ausschließlich zur Bearbeitung der Anfrage genutzt.' }, { title: 'Hosting', content: 'Diese Demo wird technisch über Flamingo Media bereitgestellt.' }, { title: 'Rechte', content: 'Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen.' }] }, light)] },
];

function prefixDemoLinks(value) {
  if (Array.isArray(value)) return value.map(prefixDemoLinks);
  if (!value || typeof value !== 'object') return value;
  const copy = { ...value };
  for (const [key, child] of Object.entries(copy)) {
    if (key === 'href' && typeof child === 'string' && child.startsWith('/') && !child.startsWith('/demo/tourism')) {
      copy[key] = `/demo/tourism${child === '/' ? '' : child}`;
    } else {
      copy[key] = prefixDemoLinks(child);
    }
  }
  return copy;
}

function detailHero(title, excerpt, image, badgeText) {
  return section('collectionHero', { headline: title, subline: excerpt, badgeText, backgroundImage: image, bgImage: image, overlayColor: colors.forestDeep, overlayOpacity: 0.58, imageEffect: 'kenBurns', imageEffectIntensity: 'subtle' }, heroStyle);
}

function routeItemSections(item) {
  return prefixDemoLinks([
    detailHero(item.title, item.excerpt, item.image, 'Route'),
    section('tourRoutes', { badgeText: item.category, headline: item.title, subline: item.excerpt, routes: [{ ...item, cta: { label: 'Gästeberatung fragen', href: '/kontakt' } }] }, light),
    section('visitorInfo', { badgeText: 'Gut zu wissen', headline: 'Vor dem Start kurz prüfen.', subline: 'Wetter, Rückweg und Einkehr machen den Unterschied.', introText: 'Diese Route funktioniert besonders gut, wenn Startzeit und Rückweg vorab klar sind.', blocks: visitorBlocks }, alt),
    cta('Passt diese Route zu Ihrem Tag?', 'Schreiben Sie uns Datum, Gruppe und gewünschtes Tempo.'),
  ]);
}

function experienceItemSections(item) {
  return prefixDemoLinks([
    detailHero(item.title, item.excerpt, item.image, 'Erlebnis'),
    section('experienceGrid', { badgeText: item.category, headline: item.title, subline: item.excerpt, items: [{ ...item, cta: { label: 'Anfrage senden', href: '/kontakt' } }] }, light),
    section('freeText', { content: `<p>${item.excerpt}</p><p>Wir empfehlen dieses Erlebnis, wenn der Tag leicht bleiben soll und trotzdem ein klares Ziel braucht. Je nach Wetter und Reisegruppe nennen wir gern eine passende Variante.</p>` }, light),
    cta('Möchten Sie dieses Erlebnis einplanen?', 'Wir helfen bei Uhrzeit, Route und sinnvoller Kombination.'),
  ]);
}

function newsItemSections(item) {
  return prefixDemoLinks([detailHero(item.title, item.excerpt, item.image, 'Journal'), section('freeText', { content: item.content }, light), cta('Noch eine Frage zur Reiseplanung?', 'Wir antworten direkt und konkret.')]);
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
      data: { image: item.image, author: 'Berg & Tal Erlebnisse', date: '2026-06-04', sections: makeSections(item) },
    });
  }
}

async function main() {
  const pagesBefore = await api('GET', '/api/v1/content/pages');
  const collectionsBefore = await api('GET', '/api/v1/content/collections');
  const existingPages = pagesBefore.pages || [];

  await api('PUT', '/api/v1/content/style', { style: 'classic' });
  await api('PUT', '/api/v1/content/brand', { companyName: 'Berg & Tal Erlebnisse', tagline: 'Gästeberatung, Routen und echte Tipps im Stubaital', primaryColor: colors.forest, secondaryColor: colors.sage, accentColor: colors.gold, logo: '', logoDisplay: 'name', headingFont: 'Inter', bodyFont: 'Inter', topBarColor: colors.forestDeep, footerColor: colors.forestDeep });
  await api('PUT', '/api/v1/content/design', { textPrimary: colors.ink, textSecondary: colors.soft, sectionBg: colors.cream, sectionBgAlt: colors.alt, cardBg: colors.card, cardBorder: colors.border, badgeBg: '#EDF2E7', badgeText: colors.forest, badgeBorder: colors.border, brand: colors.forest, accent: colors.gold, heading: colors.ink, subheading: colors.soft, body: colors.soft, muted: colors.muted, icon: colors.forest, btnBg: colors.forest, btnText: colors.onDark, dividerColor: colors.border, eyebrow: colors.forest, statValue: colors.forest, quote: colors.ink, ratingStar: colors.gold, check: colors.forest, onDarkHeading: colors.onDark, onDarkBody: colors.onDarkBody, onDarkMuted: colors.onDarkMuted });
  await api('PUT', '/api/v1/content/contact', { phone, email, address, whatsappEnabled: true, whatsapp: '+4351280472', whatsappColor: colors.forest });
  await api('PUT', '/api/v1/content/navigation', { items: navItems, cta: { label: 'Reise planen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/footer', { columns: [{ title: 'Planen', items: [{ text: 'Erlebnisse', href: '/erlebnisse' }, { text: 'Routen', href: '/routen' }, { text: 'Saison', href: '/saison' }] }, { title: 'Region', items: [{ text: 'Orte', href: '/orte' }, { text: 'Unterkünfte', href: '/unterkuenfte' }, { text: 'Events', href: '/events' }] }, { title: 'Kontakt', items: [{ text: phone }, { text: email }, { text: address }] }], legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }], cta: { label: 'Gästeberatung fragen', href: '/kontakt' } });
  await api('PUT', '/api/v1/content/opening-hours', { hours: [{ type: 'regular', day: 'Infopoint', hours: 'täglich 9:00-17:00 Uhr' }, { type: 'regular', day: 'Telefon', hours: 'Mo-Sa 9:00-18:00 Uhr' }, { type: 'regular', day: 'Geführte Touren', hours: 'nach Saisonplan' }] });
  await api('PUT', '/api/v1/content/form-fields', { fields: [{ name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true }, { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true }, { name: 'phone', label: 'Telefon', type: 'tel', halfWidth: true }, { name: 'topic', label: 'Anliegen', type: 'select', options: ['Tagesplanung', 'Route', 'Unterkunft', 'Event', 'Saisonfrage'], halfWidth: true }, { name: 'date', label: 'Reisezeitraum', type: 'text', halfWidth: true }, { name: 'guests', label: 'Personen', type: 'number', halfWidth: true }, { name: 'message', label: 'Nachricht', type: 'textarea', required: true }] });
  await api('PUT', '/api/v1/content/social-links', { instagram: 'https://instagram.com/bergundtal', facebook: 'https://facebook.com/bergundtal', google: 'https://maps.google.com' });
  await api('PUT', '/api/v1/content/seo', { titleTemplate: '%s · Berg & Tal Erlebnisse', defaultTitle: 'Berg & Tal Erlebnisse · Tourismus im Stubaital', defaultDescription: 'Berg & Tal Erlebnisse: Gästeberatung, Routen, Orte, Saisonideen, Events und Unterkünfte im Stubaital klar und persönlich erklärt.', defaultOgImage: img.hero, canonicalBase: 'https://flamingo-renderer.vercel.app/demo/tourism', locale: 'de_DE' });

  for (const page of pages) await upsertPage(page, existingPages);

  await clearCollectionItems('leistungen', collectionsBefore);
  await clearCollectionItems('referenzen', collectionsBefore);
  await clearCollectionItems('zimmer', collectionsBefore);
  await clearCollectionItems('angebote', collectionsBefore);
  await replaceCollectionItems('erlebnisse', 'Erlebnisse', experiences, experienceItemSections, collectionsBefore);
  await replaceCollectionItems('routen', 'Routen', routes, routeItemSections, collectionsBefore);
  await replaceCollectionItems('news', 'Journal', newsItems, newsItemSections, collectionsBefore);

  const pagesAfter = await api('GET', '/api/v1/content/pages');
  const meta = {
    '': ['Berg & Tal Erlebnisse Stubaital', 'Gästeberatung, Routen, Orte, Saisonideen und ehrliche Tourismus-Tipps im Stubaital.'],
    erlebnisse: ['Erlebnisse im Stubaital', 'Badesee, Almfrühstück, Regenprogramm und ruhige Tagesideen für Gäste im Stubaital.'],
    routen: ['Routen & Touren', 'Wander- und Radroute mit Dauer, Schwierigkeit, Startpunkt und ehrlicher Einordnung.'],
    orte: ['Orte & Ausflüge', 'Infopoints, Badesee, Altes Dorf und regionale Highlights im Stubaital.'],
    saison: ['Saison im Stubaital', 'Frühling, Sommer, Herbst und Winter im Stubaital passend zur Reiseart planen.'],
    unterkuenfte: ['Unterkünfte im Stubaital', 'Familienpensionen, Ferienwohnungen und Hütten mit persönlicher Gästeberatung.'],
    events: ['Events im Stubaital', 'Almabende, geführte Runden und kleine Kulturformate im Stubaital.'],
    'ueber-uns': ['Über Berg & Tal Erlebnisse', 'Wie gute Gästeinformation im Stubaital Orientierung schafft.'],
    kontakt: ['Kontakt & Gästeberatung', 'Direkt anfragen für Route, Erlebnis, Unterkunft, Saison oder Tagesplanung.'],
    news: ['Journal', 'Beiträge zu Routen, Saison, Wetter und Reiseplanung im Stubaital.'],
  };
  for (const page of pagesAfter.pages || []) {
    if (!meta[page.slug]) continue;
    await api('PUT', `/api/v1/content/seo/${page.id}`, { metaTitle: `${meta[page.slug][0]} · Berg & Tal Erlebnisse`, metaDescription: meta[page.slug][1], ogImage: img.hero, noindex: false });
  }

  const publishResult = await api('POST', '/api/v1/content/publish', {});
  console.log(JSON.stringify({ ok: true, publishResult }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
