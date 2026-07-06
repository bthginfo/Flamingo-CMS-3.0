const { randomUUID } = require('node:crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

/**
 * Tenant: salon
 * Marke: Atelier Isabelle, München-Gärtnerplatz
 * Story: Ein ruhiges Hair Studio für präzise Schnitte, natürlich wirkende Farbe
 *        und Beratung ohne Verkaufsdruck. Die Website soll hochwertig, warm und
 *        vertrauensvoll wirken, nicht laut oder beauty-klischeehaft.
 * Palette: Aubergine, Roséholz, Creme, Tinte, Champagner.
 * Typografie: Cormorant Garamond für Editorial-Headlines, Inter für UI/Text.
 * Bildwelt: helle Studios, natürliche Haare, ruhige Details, echte Hände.
 * Tonalität: persönlich, klar, beratend, stilvoll.
 */

const PAT = 'flm_pat_de5a3d8ac1447d879e680d74218b8266a0e47144191913d0a6ee20d08c7988c5';

const C = {
  aubergine: '#3A1830',
  plum: '#5B2A46',
  rose: '#B06A78',
  blush: '#F4DDE3',
  cream: '#FFF7F3',
  paper: '#FFFFFF',
  champagne: '#D9A36A',
  ink: '#1C1420',
  body: '#5E5360',
  muted: '#756A75',
  line: 'rgba(58,24,48,0.14)',
  white: '#FFFFFF',
};

function uuid() { return randomUUID(); }
function img(id, w = 1600) { return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`; }
function p(text) { return `<p>${text}</p>`; }

const lightTokens = {
  '--token-section-bg': C.cream,
  '--token-section-bg-alt': '#FFFDFB',
  '--token-card-bg': C.paper,
  '--token-card-border': C.line,
  '--token-heading': C.ink,
  '--token-subheading': C.plum,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-icon': C.rose,
  '--token-accent': C.rose,
  '--token-eyebrow': C.rose,
  '--token-badge-bg': 'rgba(176,106,120,0.12)',
  '--token-badge-text': C.aubergine,
  '--token-btn-bg': C.aubergine,
  '--token-btn-text': C.white,
  '--token-btn-secondary-bg': C.paper,
  '--token-btn-secondary-text': C.aubergine,
};

const blushTokens = {
  ...lightTokens,
  '--token-section-bg': '#F8E8ED',
  '--token-section-bg-alt': C.cream,
  '--token-card-bg': 'rgba(255,255,255,0.88)',
  '--token-icon': C.plum,
  '--token-accent': C.plum,
};

function darkSectionTokens(bg = C.aubergine) {
  return {
    ...darkTokens({ accent: C.blush, btnBg: C.blush, btnText: C.aubergine }),
    '--token-section-bg': bg,
    '--token-section-bg-alt': bg,
    '--token-card-bg': '#4A263E',
    '--token-card-border': 'rgba(255,255,255,0.24)',
    '--token-heading': C.white,
    '--token-subheading': 'rgba(255,255,255,0.88)',
    '--token-body': 'rgba(255,255,255,0.86)',
    '--token-muted': 'rgba(255,255,255,0.68)',
    '--token-icon': C.blush,
    '--token-accent': C.blush,
    '--token-eyebrow': C.blush,
    '--token-badge-bg': C.blush,
    '--token-badge-text': C.aubergine,
    '--token-btn-bg': C.blush,
    '--token-btn-text': C.aubergine,
    '--token-btn-secondary-bg': C.blush,
    '--token-btn-secondary-text': C.aubergine,
    '--token-on-dark-heading': C.white,
    '--token-on-dark-body': 'rgba(255,255,255,0.88)',
    '--token-on-dark-muted': 'rgba(255,255,255,0.70)',
  };
}

function heroData({ headline, subline, bgImage, badgeText = 'Hair Studio München' }) {
  return {
    headline,
    subline,
    badgeText,
    badgeIcon: 'Sparkles',
    bgMode: 'image',
    bgImage,
    bgPosition: 'center 42%',
    overlayColor: '#2C1627',
    overlayOpacity: 0.52,
    primaryCta: { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarDays' },
    secondaryCta: { label: 'Behandlungen ansehen', href: '/leistungen', icon: 'Scissors' },
    trustItems: ['München-Gärtnerplatz', 'Farbe mit Plan', 'Schnitt für den Alltag', 'WhatsApp-Anfrage möglich'],
    trustStripColor: 'rgba(58,24,48,0.54)',
    imageEffect: 'kenBurns',
    imageEffectIntensity: 'subtle',
  };
}

function collectionHeroData({ headline, subline, bgImage, category }) {
  return {
    headline,
    subline,
    category,
    bgImage,
    backgroundImage: bgImage,
    bgPosition: 'center 45%',
    overlayColor: '#2C1627',
    overlayOpacity: 0.55,
    imageEffect: 'parallax',
    imageEffectIntensity: 'subtle',
  };
}

function services() {
  return [
    {
      title: 'Signature Cut',
      slug: 'signature-cut',
      excerpt: 'Ein Schnitt, der morgens nicht neu verhandelt werden muss.',
      image: img('1522337360788-8b13dee7a37e'),
      icon: 'Scissors',
      cardText: 'Beratung, Schnitt, Styling und klare Pflegeempfehlung für Haare, die in Ihren Alltag passen.',
      detail: 'Wir schauen zuerst auf Struktur, Wuchsrichtung, Styling-Zeit und Gesichtslinie. Danach entsteht ein Schnitt, der nicht nur frisch im Salon gut aussieht, sondern auch nach zwei Wochen noch funktioniert.',
      includes: ['Haaranalyse und Beratung', 'präziser Schnitt', 'Styling-Anleitung', 'Pflegeempfehlung ohne Produktdruck'],
      price: 'ab 78 €',
      duration: '75 Min.',
    },
    {
      title: 'Natural Colour',
      slug: 'natural-colour',
      excerpt: 'Farbe, die wirkt, als wäre sie schon immer genau so gemeint gewesen.',
      image: img('1562322140-8baeececf3df'),
      icon: 'Palette',
      cardText: 'Glossing, Ansatz, Balayage oder sanfte Nuancen mit sauberer Planung statt Schnellschuss.',
      detail: 'Wir arbeiten mit Farbtönen, die Haut, Augen und Alltag berücksichtigen. Wichtig ist nicht maximaler Effekt, sondern eine Farbe, die weich herauswächst und nicht nach Dauertermin schreit.',
      includes: ['Farbberatung', 'Nuancierung oder Balayage', 'Glossing bei Bedarf', 'Pflegeplan für zuhause'],
      price: 'ab 118 €',
      duration: '120 Min.',
    },
    {
      title: 'Colour Correction',
      slug: 'colour-correction',
      excerpt: 'Wenn Farbe wieder ruhiger, klarer und tragbarer werden soll.',
      image: img('1516975080664-ed2fc6a32937'),
      icon: 'WandSparkles',
      cardText: 'Korrekturen mit ehrlicher Einschätzung, realistischen Etappen und Schutz für die Haarqualität.',
      detail: 'Nicht jede Korrektur ist in einem Termin sinnvoll. Wir erklären transparent, was möglich ist, was warten sollte und wie wir Struktur und Glanz erhalten.',
      includes: ['Bestandsanalyse', 'Etappenplan', 'Farbkorrektur', 'Bonding/Pflege nach Bedarf'],
      price: 'nach Beratung',
      duration: 'ab 150 Min.',
    },
    {
      title: 'Bridal & Event Styling',
      slug: 'bridal-event-styling',
      excerpt: 'Ruhiges Styling für Tage, an denen nichts zufällig sitzen sollte.',
      image: img('1524504388940-b1c1722653e1'),
      icon: 'Flower2',
      cardText: 'Probe, Ablaufplanung, Steckfrisur, Wellen oder dezentes Make-up für Hochzeit und besondere Termine.',
      detail: 'Wir planen Styling nicht isoliert, sondern mit Kleid, Wetter, Zeitplan und Foto-Situation. So bleibt der Look über Stunden stabil und trotzdem natürlich.',
      includes: ['Probetermin', 'Look-Konzept', 'Styling am Tag', 'Touch-up-Kit auf Wunsch'],
      price: 'ab 240 €',
      duration: 'nach Ablauf',
    },
  ];
}

const serviceCards = services().map((s) => ({
  title: s.title,
  text: s.cardText,
  icon: s.icon,
  mediaType: 'icon',
  href: `/c/leistungen/${s.slug}`,
}));

const teamMembers = [
  {
    name: 'Isabelle König',
    role: 'Inhaberin · Schnitt & Farbberatung',
    image: img('1494790108377-be9c29b29330'),
    bio: 'Isabelle denkt Haare zuerst über Alltag, nicht über Trends. Ihre Stärke ist ruhige Beratung mit einem sehr genauen Blick für Proportionen.',
    specialties: ['Signature Cuts', 'natürliche Farbverläufe', 'Beratung für feines Haar'],
    bookingCta: { label: 'Termin bei Isabelle anfragen', href: '/kontakt' },
  },
  {
    name: 'Mara Stein',
    role: 'Colour Specialist',
    image: img('1524504388940-b1c1722653e1'),
    bio: 'Mara liebt weiche Übergänge, Glossings und Korrekturen, die nicht nach Korrektur aussehen.',
    specialties: ['Balayage', 'Glossing', 'Colour Correction'],
    bookingCta: { label: 'Farbtermin anfragen', href: '/kontakt' },
  },
  {
    name: 'Leonie Weber',
    role: 'Styling · Bridal · Pflege',
    image: img('1544005313-94ddf0286df2'),
    bio: 'Leonie begleitet Hochzeiten und Events mit ruhiger Hand, sicherer Planung und Looks, die auf Fotos nicht steif wirken.',
    specialties: ['Bridal Styling', 'Wellen', 'Pflegeberatung'],
    bookingCta: { label: 'Styling anfragen', href: '/kontakt' },
  },
];

const faqs = [
  { question: 'Kann ich online direkt buchen?', answer: 'Wir arbeiten bewusst mit Anfrage statt anonymer Sofortbuchung. So können wir Terminlänge, Haarzustand und Ziel besser einschätzen.' },
  { question: 'Wie lange dauert ein Farbtermin?', answer: 'Je nach Technik zwischen zwei und vier Stunden. Bei größeren Veränderungen planen wir lieber ehrlich als zu knapp.' },
  { question: 'Muss ich zum ersten Termin etwas mitbringen?', answer: 'Ein bis drei Referenzbilder helfen. Noch wichtiger sind Bilder von dem, was Sie nicht möchten.' },
  { question: 'Arbeitet ihr auch mit Naturtönen?', answer: 'Ja. Unser Schwerpunkt liegt auf tragbaren Farben, weichen Übergängen und gesundem Glanz.' },
  { question: 'Macht ihr Brautstyling?', answer: 'Ja, mit Probetermin und Ablaufplanung. Für Samstage empfehlen wir eine frühe Anfrage.' },
];

function legalBlocks(kind) {
  if (kind === 'impressum') {
    return [
      { headline: 'Verantwortlich', text: p('Atelier Isabelle, Isabelle König, Müllerstraße 42, 80469 München.') },
      { headline: 'Kontakt', text: p('Telefon: +49 89 2488 1740 · E-Mail: hello@atelier-isabelle.de') },
      { headline: 'Umsatzsteuer', text: p('USt-IdNr. gemäß § 27a Umsatzsteuergesetz: DE123456789.') },
      { headline: 'Handwerkskammer', text: p('Zuständige Kammer: Handwerkskammer für München und Oberbayern.') },
      { headline: 'Haftung für Inhalte', text: p('Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für externe Links übernehmen wir keine Haftung, da deren Inhalte außerhalb unseres Einflussbereichs liegen.') },
      { headline: 'Urheberrecht', text: p('Texte, Bilder und Gestaltung dieser Website dürfen ohne Zustimmung nicht weiterverwendet werden.') },
    ];
  }
  return [
    { headline: 'Verantwortliche Stelle', text: p('Atelier Isabelle verarbeitet personenbezogene Daten nur, soweit dies für Kontaktanfragen, Terminabstimmung und den Betrieb dieser Website notwendig ist.') },
    { headline: 'Hosting', text: p('Diese Website wird bei einem europäischen Hosting-Anbieter betrieben. Server-Logdaten können technisch erforderlich verarbeitet werden.') },
    { headline: 'Kontaktformular', text: p('Wenn Sie uns über das Formular schreiben, nutzen wir Ihre Angaben zur Bearbeitung der Anfrage. Eine Weitergabe an Dritte erfolgt nicht ohne Rechtsgrundlage.') },
    { headline: 'WhatsApp und Telefon', text: p('Wenn Sie WhatsApp oder Telefon nutzen, gelten zusätzlich die Bedingungen des jeweiligen Kommunikationsdienstes.') },
    { headline: 'Cookies und Analyse', text: p('Soweit Analyse- oder Marketingdienste eingesetzt werden, erfolgt dies nur auf Grundlage Ihrer Einwilligung.') },
    { headline: 'Ihre Rechte', text: p('Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch im Rahmen der gesetzlichen Vorgaben.') },
  ];
}

function pageSeo(title, description) {
  return {
    metaTitle: `${title} | Atelier Isabelle München`,
    metaDescription: description,
    ogImage: img('1522337360788-8b13dee7a37e'),
  };
}

function serviceItem(s) {
  return {
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    data: {
      image: s.image,
      sections: [
        { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Behandlung', headline: s.title, subline: s.excerpt, bgImage: s.image }), styleOverrides: darkSectionTokens() },
        { id: uuid(), type: 'textImage', data: { badge: 'Beratung zuerst', headline: `Was bei ${s.title} wichtig ist.`, text: p(s.detail), image: s.image, imageAlt: s.title, layout: 'image-right', items: s.includes.map((title) => ({ icon: 'Check', title, text: 'Wird im Termin konkret auf Ihr Haar und Ihren Alltag abgestimmt.' })), primaryCta: { label: 'Termin anfragen', href: '/kontakt', icon: 'CalendarDays' } }, styleOverrides: lightTokens },
        { id: uuid(), type: 'priceList', data: { headline: 'Orientierung für den Termin', subline: 'Der finale Umfang hängt von Haarlänge, Ausgangslage und Ziel ab.', categories: [{ title: s.title, items: [{ name: s.title, description: s.excerpt, durationLabel: s.duration, priceLabel: s.price }, { name: 'Beratung', description: 'Saubere Einschätzung vor größeren Veränderungen.', durationLabel: '15-30 Min.', priceLabel: 'inklusive bei Termin' }] }], footnote: 'Bei Korrekturen nennen wir den Preis erst nach Sichtung der Ausgangslage.' }, styleOverrides: blushTokens },
        { id: uuid(), type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'Ruhig geplant, sauber umgesetzt.', steps: [
          { icon: 'MessageCircle', title: 'Ziel verstehen', text: 'Wir klären Wunsch, Aufwand, Pflege und Styling-Zeit.' },
          { icon: 'Search', title: 'Haar einschätzen', text: 'Struktur, Farbe, Zustand und Wuchsrichtung entscheiden mit.' },
          { icon: 'Scissors', title: 'Umsetzen', text: 'Der Termin bleibt konzentriert und transparent.' },
          { icon: 'Sparkles', title: 'Alltag sichern', text: 'Sie gehen mit klarer Pflege- und Stylingempfehlung.' },
        ] }, styleOverrides: lightTokens },
        { id: uuid(), type: 'ctaBand', data: { badgeText: 'Nächster Schritt', headline: 'Passt das zu Ihrem Haar?', subline: 'Schreiben Sie uns kurz, was Sie sich wünschen. Wir sagen ehrlich, welcher Termin sinnvoll ist.', ctaPrimary: { label: 'Termin anfragen', href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens(C.plum) },
      ],
    },
  };
}

const pages = [
  {
    slug: 'startseite',
    title: 'Startseite',
    seo: pageSeo('Hair Studio für Schnitt, Farbe und Styling', 'Atelier Isabelle in München-Gärtnerplatz: präzise Schnitte, natürliche Farbe und ruhige Beratung ohne Verkaufsdruck.'),
    sections: [
      { type: 'hero', data: heroData({ headline: 'Haare, die zu Ihrem Alltag passen.', subline: 'Atelier Isabelle ist ein ruhiges Hair Studio in München für präzise Schnitte, natürliche Farben und Beratung ohne Verkaufsdruck.', bgImage: img('1560066984-138dadb4c035') }), styleOverrides: darkSectionTokens() },
      { type: 'socialProofBar', data: { bgStyle: 'light', items: [
        { value: '4,9/5', label: 'Kundinnenstimmen', icon: 'Star' },
        { value: 'seit 2016', label: 'in München', icon: 'MapPin' },
        { value: '3', label: 'Spezialistinnen', icon: 'Users' },
        { value: '1:1', label: 'Beratung', icon: 'MessageCircle' },
      ] }, styleOverrides: lightTokens },
      { type: 'serviceMenu', data: { badgeText: 'Behandlungen', headline: 'Nicht alles, aber alles mit Plan.', subline: 'Wir konzentrieren uns auf Leistungen, bei denen Beratung, Technik und Alltag wirklich zusammengehören.', ctaPrimary: { label: 'Alle Leistungen ansehen', href: '/leistungen' }, categories: [
        { title: 'Schnitt', text: 'Form, Proportion und Styling-Zeit sauber gedacht.', image: img('1522337360788-8b13dee7a37e'), category: 'Cut', services: ['Signature Cut', 'Long Hair Shape', 'Curly Check', 'Pony & Kontur'], cta: { label: 'Schnitt anfragen', href: '/c/leistungen/signature-cut' } },
        { title: 'Farbe', text: 'Natürliche Nuancen, Glossings und Korrekturen.', image: img('1562322140-8baeececf3df'), category: 'Colour', services: ['Natural Colour', 'Balayage', 'Glossing', 'Colour Correction'], cta: { label: 'Farbe planen', href: '/c/leistungen/natural-colour' } },
        { title: 'Styling', text: 'Ruhige Looks für Hochzeit, Event und Business.', image: img('1524504388940-b1c1722653e1'), category: 'Styling', services: ['Bridal Styling', 'Event Hair', 'Waves', 'Touch-up'], cta: { label: 'Styling anfragen', href: '/c/leistungen/bridal-event-styling' } },
      ] }, styleOverrides: lightTokens },
      { type: 'servicesGrid', data: { badgeText: 'Kernleistungen', headline: 'Vier Einstiege, ein Anspruch.', subline: 'Jede Leistung ist so angelegt, dass Sie vorher wissen, was passiert.', ctaLabel: 'Leistungen ansehen', ctaHref: '/leistungen', manualCards: serviceCards }, styleOverrides: blushTokens },
      { type: 'featureShowcase', data: { badge: 'Beratung', headline: 'Wir schneiden nicht am Gespräch vorbei.', subline: 'Viele Haarprobleme sind eigentlich Kommunikationsprobleme. Deshalb starten wir mit Alltag, Wunsch und Aufwand.', text: p('Ein guter Termin beginnt nicht am Waschbecken. Er beginnt mit der Frage, wie Sie morgens mit Ihrem Haar umgehen, was Sie stört und was realistisch bleiben soll.'), image: img('1519415510236-718bdfcd89c8'), features: ['ehrliche Einschätzung vor Farbe und Schnitt', 'keine unnötigen Produktversprechen', 'klare Empfehlung für Pflege und Styling', 'realistische Etappen bei Farbkorrekturen'], ctaLabel: 'Beratung anfragen', ctaHref: '/kontakt', reversed: true }, styleOverrides: lightTokens },
      { type: 'beforeAfter', data: { headline: 'Veränderung darf weich aussehen.', subline: 'Keine harten Vorher-Nachher-Versprechen, sondern nachvollziehbare Entwicklung.', items: [
        { title: 'Weicher Blondverlauf', text: 'Ansatz beruhigt, Längen veredelt, Pflegeplan angepasst.', beforeImage: img('1521590832167-7bcbfaa6381f'), afterImage: img('1516975080664-ed2fc6a32937'), category: 'Farbe' },
        { title: 'Mehr Form bei feinem Haar', text: 'Kontur und Bewegung, ohne die Länge unnötig zu opfern.', beforeImage: img('1522337360788-8b13dee7a37e'), afterImage: img('1508214751196-bcfd4ca60f91'), category: 'Schnitt' },
        { title: 'Event-Wellen', text: 'Natürlich, haltbar und fotografisch ruhig.', beforeImage: img('1494790108377-be9c29b29330'), afterImage: img('1524504388940-b1c1722653e1'), category: 'Styling' },
      ] }, styleOverrides: lightTokens },
      { type: 'bentoGrid', data: { headline: 'Ein Salon für Menschen, die es klar mögen.', subline: 'Wenig Drama, viel Sorgfalt.', items: [
        { title: 'Ruhige Termine', text: 'Wir planen Puffer, damit Beratung nicht zwischen zwei Kundinnen gequetscht wird.', icon: 'Clock', span: '2' },
        { title: 'Farbe mit Herkunft', text: 'Wir erklären, warum ein Ton funktioniert und wie er herauswächst.', icon: 'Palette' },
        { title: 'Alltag vor Trend', text: 'Ein Look ist erst gut, wenn Sie ihn zuhause tragen können.', icon: 'Home' },
        { title: 'Keine Hektik', text: 'Auch bei Korrekturen lieber ehrlich in Etappen.', icon: 'ShieldCheck' },
      ] }, styleOverrides: blushTokens },
      { type: 'processSteps', data: { badgeText: 'Ablauf', headline: 'So läuft ein erster Termin.', steps: [
        { icon: 'MessageCircle', title: 'Anfrage senden', text: 'Sie schreiben kurz Wunsch, Haarlänge und bisherige Farbe.' },
        { icon: 'Image', title: 'Bilder helfen', text: 'Ein Foto von heute und ein Wunschbild reichen oft für die Einschätzung.' },
        { icon: 'CalendarDays', title: 'Termin planen', text: 'Wir wählen die passende Dauer statt einen Standard-Slot.' },
        { icon: 'Sparkles', title: 'Mit Plan gehen', text: 'Sie bekommen Pflege- und Stylinghinweise, die wirklich zum Alltag passen.' },
      ] }, styleOverrides: lightTokens },
      { type: 'priceList', data: { headline: 'Preise als Orientierung.', subline: 'Wir nennen lieber klare Spannen als falsche Fixpreise.', categories: [
        { title: 'Schnitt & Pflege', items: [
          { name: 'Signature Cut', description: 'Beratung, Waschen, Schnitt und Styling.', durationLabel: '75 Min.', priceLabel: 'ab 78 €' },
          { name: 'Curly / Struktur-Check', description: 'Schnitt und Pflegeberatung für Bewegung im Haar.', durationLabel: '90 Min.', priceLabel: 'ab 92 €' },
        ] },
        { title: 'Farbe', items: [
          { name: 'Glossing', description: 'Glanz, Ton und Frische.', durationLabel: '60 Min.', priceLabel: 'ab 58 €' },
          { name: 'Natural Colour', description: 'Ansatz, Längen oder sanfter Verlauf.', durationLabel: '120 Min.', priceLabel: 'ab 118 €' },
          { name: 'Colour Correction', description: 'Nach Sichtung und Aufwand.', durationLabel: 'ab 150 Min.', priceLabel: 'nach Beratung' },
        ] },
      ], footnote: 'Lange oder sehr dichte Haare können mehr Zeit brauchen. Wir sagen das vorher.' }, styleOverrides: lightTokens },
      { type: 'teamShowcase', data: { badgeText: 'Team', headline: 'Drei Spezialistinnen, ein ruhiger Ton.', subline: 'Sie landen nicht zufällig bei irgendwem. Wir ordnen Ihre Anfrage passend zu.', members: teamMembers }, styleOverrides: blushTokens },
      { type: 'statsCounter', data: { headline: 'Was Kundinnen oft nennen.', subline: 'Nicht lauter, sondern verlässlicher.', stats: [
        { value: '4,9', suffix: '/5', label: 'Bewertung' },
        { value: 8, suffix: '+', label: 'Jahre Studio' },
        { value: 3, label: 'Spezialistinnen' },
        { value: 1, label: 'fester Plan' },
      ] }, styleOverrides: lightTokens },
      { type: 'testimonials', data: { headline: 'Ruhige Stimmen, klare Ergebnisse.', items: [
        { quote: 'Ich hatte zum ersten Mal das Gefühl, dass wirklich verstanden wurde, wie wenig Zeit ich morgens habe.', name: 'Nina M.', context: 'Signature Cut', rating: 5 },
        { quote: 'Die Farbe ist weich rausgewachsen. Genau das war mir wichtig.', name: 'Carla S.', context: 'Natural Colour', rating: 5 },
        { quote: 'Keine Überredung, keine Hektik. Einfach ein guter Plan.', name: 'Theresa L.', context: 'Colour Correction', rating: 5 },
        { quote: 'Mein Brautstyling hat den ganzen Tag gehalten und sah trotzdem leicht aus.', name: 'Miriam K.', context: 'Bridal Styling', rating: 5 },
      ] }, styleOverrides: lightTokens },
      { type: 'faq', data: { headline: 'Fragen vor dem ersten Termin.', items: faqs }, styleOverrides: blushTokens },
      { type: 'ctaBand', data: { badgeText: 'Termin', headline: 'Erzählen Sie uns kurz von Ihrem Haar.', subline: 'Dann sagen wir ehrlich, welcher Termin sinnvoll ist und wie viel Zeit wir einplanen sollten.', ctaPrimary: { label: 'Termin anfragen', href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens() },
    ],
  },
  {
    slug: 'leistungen',
    title: 'Leistungen',
    seo: pageSeo('Leistungen für Schnitt, Farbe und Styling', 'Schnitt, Farbe, Colour Correction und Bridal Styling im Atelier Isabelle München. Ruhige Beratung und klare Terminplanung.'),
    sections: [
      { type: 'editorialHero', data: { eyebrow: 'Leistungen', headline: 'Haare brauchen keinen Druck, sondern Richtung.', text: '<p>Unsere Leistungen sind bewusst kuratiert: Schnitt, Farbe, Korrektur und Styling mit sauberer Beratung.</p>', imagePrimary: img('1519415510236-718bdfcd89c8'), primaryCta: { label: 'Termin anfragen', href: '/kontakt' }, secondaryCta: { label: 'Preise ansehen', href: '#preise' } } },
      { type: 'servicesGrid', data: { badgeText: 'Übersicht', headline: 'Wählen Sie den passenden Einstieg.', subline: 'Jede Detailseite erklärt, was sinnvoll ist, wie der Termin abläuft und wann wir vorher Rückfragen stellen.', manualCards: serviceCards }, styleOverrides: lightTokens },
      { type: 'serviceMenu', data: { headline: 'Leistungen nach Bedarf.', subline: 'Nicht jede Anfrage braucht denselben Termin. Wir sortieren vorab.', ctaPrimary: { label: 'Termin anfragen', href: '/kontakt' }, categories: [
        { title: 'Schnitt', text: 'Form, Kontur, Bewegung.', image: img('1522337360788-8b13dee7a37e'), category: 'Cut', services: ['Signature Cut', 'Curly Check', 'Pony & Kontur', 'Pflegeberatung'] },
        { title: 'Farbe', text: 'Ton, Glanz, Verlauf.', image: img('1562322140-8baeececf3df'), category: 'Colour', services: ['Glossing', 'Natural Colour', 'Balayage', 'Correction'] },
        { title: 'Styling', text: 'Event, Hochzeit, Business.', image: img('1524504388940-b1c1722653e1'), category: 'Styling', services: ['Waves', 'Updo', 'Bridal', 'Touch-up'] },
      ] }, styleOverrides: blushTokens },
      { type: 'packages', data: { headline: 'Pakete für besondere Momente.', subline: 'Für Termine, bei denen Ablauf und Timing genauso wichtig sind wie der Look.', packages: [
        { title: 'Bridal Calm', text: 'Probetermin, Look-Plan, Styling am Hochzeitstag und kleine Notfall-Mappe.', image: img('1524504388940-b1c1722653e1'), priceLabel: 'ab 420 €', includes: ['Probetermin', 'Styling am Tag', 'Zeitplan', 'Touch-up Tipps'], cta: { label: 'Hochzeit anfragen', href: '/c/leistungen/bridal-event-styling' } },
        { title: 'Colour Reset', text: 'Für Haare, die wieder ruhiger, weicher und hochwertiger wirken sollen.', image: img('1516975080664-ed2fc6a32937'), priceLabel: 'nach Beratung', includes: ['Analyse', 'Etappenplan', 'Korrektur', 'Pflege'], cta: { label: 'Korrektur planen', href: '/c/leistungen/colour-correction' } },
        { title: 'Everyday Shape', text: 'Schnitt, Pflege und Styling-Routine für weniger Aufwand morgens.', image: img('1522337360788-8b13dee7a37e'), priceLabel: 'ab 98 €', includes: ['Beratung', 'Schnitt', 'Styling', 'Routine'], cta: { label: 'Schnitt anfragen', href: '/c/leistungen/signature-cut' } },
      ] }, styleOverrides: lightTokens },
      { type: 'comparisonTable', data: { badge: 'Orientierung', headline: 'Welcher Termin passt?', text: 'Wenn Sie unsicher sind, hilft diese grobe Einordnung.', columns: [{ label: 'Schnitt' }, { label: 'Farbe' }, { label: 'Korrektur' }], rows: [
        { feature: 'sichtbare Veränderung', values: ['mittel', 'hoch', 'sehr hoch'] },
        { feature: 'Dauer', values: ['75-90 Min.', '2-3 Std.', 'nach Analyse'] },
        { feature: 'Vorab-Foto sinnvoll', values: ['optional', 'ja', 'unbedingt'] },
        { feature: 'Preis fix planbar', values: ['meist ja', 'teilweise', 'erst nach Sichtung'] },
      ], highlightCol: 1 }, styleOverrides: lightTokens },
      { type: 'serviceTabs', data: {
        badge: 'Auf einen Blick',
        headline: 'Drei Wege zu Ihrem Look.',
        subline: 'Schnitt, Farbe oder Pflege — jede Behandlung beginnt mit ehrlicher Beratung.',
        tabs: [
          { label: 'Schnitt', icon: 'scissors', title: 'Präzisionsschnitt', text: '<p>Ein Schnitt, der zu Haarstruktur, Alltag und Stylingaufwand passt — und auch nach sechs Wochen noch eine Form hat.</p>', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=82', features: ['Beratung & Analyse inklusive', 'Wasch-, Schneide- & Stylingzeit 75–90 Min.', 'Nachschnitt-Empfehlung schriftlich'], cta: { label: 'Schnitt anfragen', href: '/kontakt' } },
          { label: 'Farbe', icon: 'palette', title: 'Farbe & Balayage', text: '<p>Farbkonzepte, die mit Ihrem Naturton arbeiten statt gegen ihn — inklusive ehrlicher Aussage, was in einer Sitzung erreichbar ist.</p>', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=82', features: ['Strähnentechnik nach Gesichtsform', 'Olaplex-Schutz inklusive', 'Pflegeplan für zuhause'], cta: { label: 'Farbberatung buchen', href: '/kontakt' } },
          { label: 'Pflege', icon: 'sparkles', title: 'Treatments & Kopfhaut', text: '<p>Aufbau-Treatments und Kopfhautanalyse für Haar, das nicht nur heute glänzt — abgestimmt auf Ihre Haarhistorie.</p>', image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=82', features: ['Analyse vor jeder Behandlung', 'Produkte ohne Verkaufsdruck', 'Wirkung nach 3 Anwendungen sichtbar'], cta: { label: 'Pflege anfragen', href: '/kontakt' } },
        ],
      }, styleOverrides: lightTokens },
      { type: 'immersiveCtaBanner', data: { badge: 'Unsicher?', headline: 'Schicken Sie lieber einmal zu viel ein Foto.', subline: 'Wir sagen Ihnen, ob Schnitt, Farbe oder Beratung zuerst sinnvoll ist.', image: img('1562322140-8baeececf3df'), overlay: 'rgba(43,26,42,0.6)', primaryCta: { label: 'Anfrage senden', href: '/kontakt' }, secondaryCta: { label: 'Jetzt anrufen', href: 'tel:+498924881740' } } },
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    seo: pageSeo('Über Atelier Isabelle', 'Ein ruhiges Hair Studio am Gärtnerplatz in München: Team, Haltung und Arbeitsweise des Atelier Isabelle.'),
    sections: [
      { type: 'editorialHero', data: { eyebrow: 'Über uns', headline: 'Ein Salon darf leise sein und trotzdem präzise.', text: '<p>Atelier Isabelle steht für Beratung, Handwerk und Looks, die nicht nach Verkaufsdruck aussehen.</p>', imagePrimary: img('1519415510236-718bdfcd89c8'), imageSecondary: img('1562322140-8baeececf3df'), primaryCta: { label: 'Kennenlernen', href: '/kontakt' } } },
      { type: 'textImage', data: { badge: 'Haltung', headline: 'Wir mögen Haare, die nicht jeden Morgen diskutiert werden müssen.', text: p('Unser Studio ist klein, ruhig und bewusst organisiert. Wir nehmen weniger Termine an, damit Beratung nicht untergeht und Ergebnisse nachvollziehbar bleiben.'), image: img('1522337360788-8b13dee7a37e'), imageAlt: 'Ruhiger Salonarbeitsplatz', layout: 'image-left', items: [
        { icon: 'MessageCircle', title: 'Beratung ohne Druck', text: 'Wir empfehlen nur, was fachlich und alltagstauglich Sinn ergibt.' },
        { icon: 'Scissors', title: 'Handwerk vor Hype', text: 'Trends sind gut, wenn sie zu Gesicht, Haar und Zeitbudget passen.' },
        { icon: 'Sparkles', title: 'Glanz ohne Show', text: 'Farbe soll hochwertig wirken, nicht nach Daueraufwand.' },
      ], primaryCta: { label: 'Team kennenlernen', href: '/ueber-uns#team', icon: 'Users' } }, styleOverrides: lightTokens },
      { type: 'timeline', data: { badge: 'Geschichte', headline: 'Langsam gewachsen, bewusst klein geblieben.', subline: 'Nicht jedes Wachstum ist gut für Qualität.', entries: [
        { year: '2016', title: 'Start am Gärtnerplatz', text: 'Isabelle übernimmt einen kleinen Salon und baut ihn als Beratungsstudio neu auf.' },
        { year: '2019', title: 'Farbe wird Schwerpunkt', text: 'Natural Colour und Korrekturen werden zum sichtbarsten Profil des Studios.' },
        { year: '2022', title: 'Drei Spezialistinnen', text: 'Das Team wächst gezielt, nicht beliebig.' },
        { year: 'Heute', title: 'Ruhige Termine', text: 'Weniger Slots, bessere Vorbereitung, klarere Ergebnisse.' },
      ] }, styleOverrides: blushTokens },
      { type: 'teamSpotlight', data: { badge: 'Team', headline: 'Menschen, die zuhören können.', subline: 'Jede im Team hat einen eigenen Fokus — beim Überfahren der Karten zeigen sich Haltung und Schwerpunkte.', members: teamMembers.map((m) => ({ name: m.name, role: m.role, image: m.image, quote: m.bio, focus: m.specialties })) }, styleOverrides: lightTokens },
      { type: 'expertiseGrid', data: { headline: 'Woran wir arbeiten.', subline: 'Unsere Qualität steckt in vielen kleinen Entscheidungen.', items: [
        { icon: 'Palette', title: 'Farblehre', text: 'Hautunterton, Ausgangsfarbe und Pflegeaufwand werden gemeinsam betrachtet.' },
        { icon: 'Scissors', title: 'Schnitttechnik', text: 'Form wird so gesetzt, dass sie herauswachsen darf.' },
        { icon: 'ShieldCheck', title: 'Haargesundheit', text: 'Bei Korrekturen ist Struktur wichtiger als ein schneller Wow-Effekt.' },
        { icon: 'Camera', title: 'Fototauglichkeit', text: 'Event-Styling muss in Bewegung und auf Bildern funktionieren.' },
      ] }, styleOverrides: blushTokens },
      { type: 'stats', data: { headline: 'Klein, aber sehr bewusst.', stats: [
        { icon: 'CalendarDays', value: 'seit 2016', label: 'am Gärtnerplatz' },
        { icon: 'Users', value: '3', label: 'Spezialistinnen' },
        { icon: 'Star', value: '4,9/5', label: 'Bewertung' },
        { icon: 'Clock', value: 'Puffer', label: 'zwischen Terminen' },
      ] }, styleOverrides: lightTokens },
      { type: 'immersiveCtaBanner', data: { badge: 'Erster Kontakt', headline: 'Sagen Sie uns, was Ihr Haar können soll.', subline: 'Wir melden uns mit einer ehrlichen Einschätzung zum passenden Termin.', image: img('1519415510236-718bdfcd89c8'), overlay: 'rgba(43,26,42,0.6)', primaryCta: { label: 'Termin anfragen', href: '/kontakt' } } },
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    seo: pageSeo('Kontakt und Termin anfragen', 'Atelier Isabelle München: Termin für Schnitt, Farbe, Styling oder Beratung anfragen. Mit Adresse, Öffnungszeiten und Kontaktformular.'),
    sections: [
      { type: 'cinematicHero', data: { eyebrow: 'Kontakt', headline: 'Schreiben Sie uns kurz, worum es geht.', subline: 'Mit ein paar Angaben können wir besser einschätzen, welcher Termin wirklich passt.', image: img('1519415510236-718bdfcd89c8'), overlay: 'rgba(43,26,42,0.56)', align: 'left', primaryCta: { label: 'Jetzt anrufen', href: 'tel:+498924881740' } } },
      { type: 'bookingCta', data: { headline: 'So kommen wir am schnellsten zum passenden Termin.', subline: 'Wir melden uns persönlich zurück und schlagen die passende Terminlänge vor.', introText: 'Für Farbe oder Korrektur helfen aktuelle Haarbilder und ein Wunschbild.', onlineCta: { label: 'Formular nutzen', href: '#kontaktformular' }, phoneCta: { label: 'Anrufen', href: 'tel:+498924881740' }, whatsappCta: { label: 'WhatsApp schreiben', href: 'https://wa.me/498924881740' }, notes: ['Farbtermine bitte mit Foto anfragen', 'Samstage frühzeitig planen', 'Korrekturen nur nach Einschätzung'] }, styleOverrides: blushTokens },
      { type: 'locationContact', data: { headline: 'Atelier Isabelle am Gärtnerplatz.', subline: 'Zentral, ruhig im ersten Obergeschoss und gut erreichbar mit U-Bahn und Tram.', image: img('1519415510236-718bdfcd89c8'), mapEmbedUrl: 'https://www.google.com/maps?q=M%C3%BCllerstra%C3%9Fe%2042%2C%2080469%20M%C3%BCnchen&output=embed', formEnabled: true, infoCards: [
        { icon: 'Phone', label: 'Telefon', value: '+49 89 2488 1740' },
        { icon: 'Mail', label: 'E-Mail', value: 'hello@atelier-isabelle.de' },
        { icon: 'MapPin', label: 'Adresse', value: 'Müllerstraße 42, 80469 München' },
        { icon: 'Clock', label: 'Öffnungszeiten', value: 'Di-Fr 10-19 Uhr · Sa 9-15 Uhr' },
      ] }, styleOverrides: lightTokens },
      { type: 'openingHours', data: { headline: 'Öffnungszeiten', days: [
        { label: 'Montag', hours: 'geschlossen' },
        { label: 'Dienstag', hours: '10:00-19:00' },
        { label: 'Mittwoch', hours: '10:00-19:00' },
        { label: 'Donnerstag', hours: '10:00-20:00' },
        { label: 'Freitag', hours: '10:00-19:00' },
        { label: 'Samstag', hours: '09:00-15:00' },
      ] }, styleOverrides: blushTokens },
      { type: 'map', data: { headline: 'So finden Sie uns.', embedUrl: 'https://www.google.com/maps?q=M%C3%BCllerstra%C3%9Fe%2042%2C%2080469%20M%C3%BCnchen&output=embed', height: 'm' }, styleOverrides: lightTokens },
      { type: 'faq', data: { headline: 'Vor der Anfrage.', items: faqs.slice(0, 4) }, styleOverrides: lightTokens },
    ],
  },
  {
    slug: 'news',
    title: 'Journal',
    seo: pageSeo('Journal für Haare, Farbe und Pflege', 'Notizen aus dem Atelier Isabelle: Farberhaltung, Schnittpflege, Styling und ruhige Entscheidungen rund ums Haar.'),
    sections: [
      { type: 'collectionHero', data: collectionHeroData({ category: 'Journal', headline: 'Notizen für Haare, die länger gut bleiben.', subline: 'Kleine Texte über Farbe, Pflege, Styling und Entscheidungen im Salon.', bgImage: img('1562322140-8baeececf3df') }), styleOverrides: darkSectionTokens() },
      { type: 'featureShowcase', data: { badge: 'Warum wir schreiben', headline: 'Gute Haare enden nicht am Salonausgang.', subline: 'Viele Ergebnisse bleiben besser, wenn Pflege, Styling und Erwartung klar sind.', image: img('1522337360788-8b13dee7a37e'), features: ['kurze Pflegehinweise', 'ehrliche Einschätzungen', 'keine Produktpredigten', 'konkrete Alltagstipps'], ctaLabel: 'Termin anfragen', ctaHref: '/kontakt' }, styleOverrides: lightTokens },
      { type: 'collectionList', data: { headline: 'Aktuelle Beiträge', subline: 'Direkt aus dem Studioalltag.', collectionKey: 'news', columns: 3, showImage: true, showDate: true, showExcerpt: true, showSortControls: false }, styleOverrides: blushTokens },
      { type: 'ctaBand', data: { badgeText: 'Frage offen?', headline: 'Lieber konkret fragen als lange suchen.', subline: 'Wenn ein Thema Ihr Haar betrifft, schreiben Sie uns direkt.', ctaPrimary: { label: 'Frage stellen', href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens(C.plum) },
    ],
  },
  { slug: 'impressum', title: 'Impressum', seo: pageSeo('Impressum', 'Impressum des Atelier Isabelle in München.'), sections: [{ type: 'legalContent', data: { headline: 'Impressum', blocks: legalBlocks('impressum') }, styleOverrides: lightTokens }] },
  { slug: 'datenschutz', title: 'Datenschutz', seo: pageSeo('Datenschutz', 'Datenschutzerklärung des Atelier Isabelle in München.'), sections: [{ type: 'legalContent', data: { headline: 'Datenschutzerklärung', blocks: legalBlocks('datenschutz') }, styleOverrides: lightTokens }] },
];

const collections = [
  { key: 'leistungen', label: 'Leistungen', items: services().map(serviceItem) },
  {
    key: 'news',
    label: 'Journal',
    items: [
      {
        title: 'Warum eine gute Farbe leise herauswachsen darf',
        slug: 'farbe-leise-herauswachsen',
        excerpt: 'Was Balayage, Glossing und Pflege miteinander zu tun haben.',
        data: { image: img('1562322140-8baeececf3df'), date: '2026-06-03', sections: [
          { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Farbe', headline: 'Warum eine gute Farbe leise herauswachsen darf', subline: 'Der schönste Farbtermin ist oft der, der nach acht Wochen nicht nach Pflichttermin aussieht.', bgImage: img('1562322140-8baeececf3df') }), styleOverrides: darkSectionTokens() },
          { id: uuid(), type: 'richText', data: { headline: 'Farbe ist Planung.', content: '<p>Weiche Übergänge, Glossing und realistische Pflege entscheiden darüber, ob Farbe hochwertig bleibt. Wir planen deshalb nicht nur den Termin, sondern auch das Herauswachsen.</p><p>Besonders bei Blond, warmen Brauntönen und Korrekturen hilft eine ehrliche Einschätzung vorab.</p>' }, styleOverrides: lightTokens },
          { id: uuid(), type: 'ctaBand', data: { badgeText: 'Farbberatung', headline: 'Unsicher bei der Farbe?', subline: 'Schicken Sie uns ein aktuelles Foto und ein Wunschbild.', ctaPrimary: { label: 'Farbe anfragen', href: '/kontakt', icon: 'Send' } }, styleOverrides: darkSectionTokens(C.plum) },
        ] },
      },
      {
        title: 'Der Schnitt, der morgens Zeit spart',
        slug: 'schnitt-der-zeit-spart',
        excerpt: 'Warum Styling-Zeit schon in der Beratung auf den Tisch gehört.',
        data: { image: img('1522337360788-8b13dee7a37e'), date: '2026-05-22', sections: [
          { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Schnitt', headline: 'Der Schnitt, der morgens Zeit spart', subline: 'Ein guter Schnitt kennt Ihren Alltag.', bgImage: img('1522337360788-8b13dee7a37e') }), styleOverrides: darkSectionTokens() },
          { id: uuid(), type: 'richText', data: { headline: 'Nicht jedes Haar will dasselbe.', content: '<p>Ein Schnitt darf nicht nur auf dem Salonstuhl funktionieren. Wir sprechen deshalb über Föhnzeit, Produkte, Wuchsrichtung und die Frage, wie viel Form Sie wirklich täglich herstellen möchten.</p>' }, styleOverrides: lightTokens },
          { id: uuid(), type: 'ctaBand', data: { badgeText: 'Schnitt', headline: 'Mehr Form, weniger Aufwand?', subline: 'Dann ist ein Signature Cut ein guter Einstieg.', ctaPrimary: { label: 'Schnitt anfragen', href: '/c/leistungen/signature-cut', icon: 'Scissors' } }, styleOverrides: darkSectionTokens() },
        ] },
      },
      {
        title: 'Brautstyling ohne steife Frisur',
        slug: 'brautstyling-ohne-steife-frisur',
        excerpt: 'Wie ein Look hält und trotzdem leicht bleibt.',
        data: { image: img('1524504388940-b1c1722653e1'), date: '2026-05-08', sections: [
          { id: uuid(), type: 'collectionHero', data: collectionHeroData({ category: 'Styling', headline: 'Brautstyling ohne steife Frisur', subline: 'Guter Halt muss nicht hart aussehen.', bgImage: img('1524504388940-b1c1722653e1') }), styleOverrides: darkSectionTokens() },
          { id: uuid(), type: 'richText', data: { headline: 'Der Tagesplan entscheidet mit.', content: '<p>Wir fragen nach Kleid, Wetter, Fotos, Trauzeit und der Frage, wann Sie sich wieder bewegen möchten. Daraus entsteht ein Styling, das schön bleibt, ohne die Person dahinter zu verdecken.</p>' }, styleOverrides: lightTokens },
          { id: uuid(), type: 'ctaBand', data: { badgeText: 'Hochzeit', headline: 'Planen wir den Look früh genug.', subline: 'Für Samstage und Hochzeiten empfehlen wir eine rechtzeitige Anfrage.', ctaPrimary: { label: 'Bridal anfragen', href: '/c/leistungen/bridal-event-styling', icon: 'Flower2' } }, styleOverrides: darkSectionTokens(C.plum) },
        ] },
      },
    ],
  },
];

module.exports = {
  slug: 'salon',
  pat: PAT,
  wipe: true,
  brand: {
    companyName: 'Atelier Isabelle',
    tagline: 'Schnitt, Farbe und Styling mit Ruhe',
    primaryColor: C.aubergine,
    secondaryColor: C.plum,
    accentColor: C.rose,
    logoDisplay: 'name',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter',
    topBarColor: C.aubergine,
    footerColor: C.aubergine,
  },
  contact: {
    phone: '+49 89 2488 1740',
    email: 'hello@atelier-isabelle.de',
    address: 'Müllerstraße 42, 80469 München',
    whatsapp: '+498924881740',
    whatsappEnabled: true,
  },
  design: {
    sectionBg: C.cream,
    sectionBgAlt: '#FFFDFB',
    cardBg: C.paper,
    cardBorder: C.line,
    heading: C.ink,
    subheading: C.plum,
    body: C.body,
    muted: C.muted,
    brand: C.aubergine,
    accent: C.rose,
    icon: C.rose,
    btnBg: C.aubergine,
    btnText: C.white,
    btnSecondaryBg: C.paper,
    btnSecondaryText: C.aubergine,
    badgeBg: C.blush,
    badgeText: C.aubergine,
    onDarkHeading: C.white,
    onDarkBody: 'rgba(255,255,255,0.88)',
    onDarkMuted: 'rgba(255,255,255,0.70)',
  },
  style: { style: 'classic' },
  socialLinks: {
    instagram: 'https://instagram.com/atelier.isabelle',
    facebook: 'https://facebook.com/atelierisabelle',
    google: 'https://www.google.com/search?q=Atelier+Isabelle+M%C3%BCnchen',
  },
  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag', closed: true, note: 'Ruhetag' },
      { type: 'regular', day: 'Dienstag', hours: '10:00-19:00' },
      { type: 'regular', day: 'Mittwoch', hours: '10:00-19:00' },
      { type: 'regular', day: 'Donnerstag', hours: '10:00-20:00' },
      { type: 'regular', day: 'Freitag', hours: '10:00-19:00' },
      { type: 'regular', day: 'Samstag', hours: '09:00-15:00', note: 'nach Vereinbarung' },
    ],
  },
  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, halfWidth: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, halfWidth: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false, halfWidth: true },
      { name: 'service', label: 'Wunschleistung', type: 'select', required: true, options: ['Schnitt', 'Farbe', 'Colour Correction', 'Bridal Styling', 'Beratung'] },
      { name: 'message', label: 'Was wünschen Sie sich?', type: 'textarea', required: true },
    ],
  },
  seoGlobal: {
    titleTemplate: '%s | Atelier Isabelle',
    defaultTitle: 'Atelier Isabelle · Hair Studio München',
    defaultDescription: 'Ruhiges Hair Studio in München-Gärtnerplatz für präzise Schnitte, natürliche Farbe, Bridal Styling und ehrliche Beratung.',
    defaultOgImage: img('1560066984-138dadb4c035'),
    canonicalBase: 'https://demo.flamingomedia.online/demo/salon',
    locale: 'de_DE',
  },
  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Journal', href: '/news' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    cta: { label: 'Termin anfragen', href: '/kontakt' },
  },
  footer: {
    columns: [
      { title: 'Leistungen', items: services().map((s) => ({ text: s.title, href: `/c/leistungen/${s.slug}` })) },
      { title: 'Atelier', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Journal', href: '/news' }, { text: 'Kontakt', href: '/kontakt' }] },
      { title: 'Kontakt', items: [{ text: 'hello@atelier-isabelle.de', href: 'mailto:hello@atelier-isabelle.de' }, { text: '+49 89 2488 1740', href: 'tel:+498924881740' }, { text: 'Müllerstraße 42, München', href: '/kontakt' }] },
    ],
    legalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    cta: { label: 'Termin anfragen', href: '/kontakt' },
  },
  collections,
  pages,
  publish: true,
};

if (require.main === module) {
  run(module.exports).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
