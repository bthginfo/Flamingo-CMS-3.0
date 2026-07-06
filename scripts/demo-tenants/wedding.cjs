/**
 * Demo tenant: WEDDING
 *
 * Identität: "Mara & Elias" — eine ruhige, warme Hochzeitsseite für eine Feier
 *             am Gut Sonnenhof bei Starnberg. Nicht kitschig, sondern persönlich,
 *             gut organisiert und für Gäste sofort verständlich.
 *
 * Run:
 *   node scripts/demo-tenants/wedding.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');
const { darkTokens } = require('./_lib/theme.cjs');

const PAT = 'a8a4079b1415c23ee6e7ec484438a8a780452b6a6a86fc0acf3025c8d24c3904';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  ink: '#2A1714',
  body: '#5D443C',
  muted: '#7B645C',
  paper: '#FFF9F3',
  soft: '#F5E8DC',
  card: '#FFFFFF',
  rose: '#B77772',
  copper: '#8D4B27',
  plum: '#4A252B',
  sage: '#5D6F58',
};

const darkSectionTokens = {
  ...darkTokens({ accent: '#F4D6C8' }),
  '--token-heading': '#FFFFFF',
  '--token-body': 'rgba(255,255,255,0.92)',
  '--token-muted': 'rgba(255,255,255,0.76)',
  '--token-eyebrow': '#F4D6C8',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.92)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.76)',
  '--token-btn-bg': '#FFFFFF',
  '--token-btn-text': C.plum,
  '--token-btn-secondary-bg': 'rgba(255,255,255,0.18)',
  '--token-btn-secondary-text': '#FFFFFF',
  '--token-badge-bg': 'rgba(255,255,255,0.18)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.34)',
  '--token-card-bg': 'rgba(42,23,20,0.72)',
  '--token-card-border': 'rgba(255,255,255,0.28)',
  '--token-card-heading': '#FFFFFF',
  '--token-card-body': 'rgba(255,255,255,0.88)',
  '--token-icon': '#F4D6C8',
};

const lightSection = {
  '--token-section-bg': C.paper,
  '--token-heading': C.ink,
  '--token-body': C.body,
  '--token-muted': C.muted,
  '--token-card-bg': '#FFFFFF',
  '--token-card-border': '#E8D6CA',
  '--token-icon': C.copper,
  '--token-accent': C.rose,
  '--token-btn-bg': C.plum,
  '--token-btn-text': '#FFFFFF',
  '--token-btn-secondary-bg': '#FFFFFF',
  '--token-btn-secondary-text': C.plum,
  '--token-badge-bg': '#F2DED4',
  '--token-badge-text': C.plum,
  '--token-badge-border': '#E5C3B7',
};

const softRose = {
  ...lightSection,
  '--token-section-bg': C.soft,
  '--token-card-bg': '#FFFDF9',
  '--token-accent': C.copper,
  '--token-btn-bg': C.plum,
  '--token-btn-text': '#FFFFFF',
};

const sageSection = {
  ...lightSection,
  '--token-section-bg': '#EEF1EA',
  '--token-card-border': '#CFD9CA',
  '--token-accent': C.sage,
  '--token-icon': C.sage,
  '--token-btn-bg': C.plum,
  '--token-btn-text': '#FFFFFF',
  '--token-badge-bg': '#FFFFFF',
  '--token-badge-text': '#53634F',
};

const heroImage = img('1519741497674-611481863552');
const venueImage = img('1519225421980-715cb0215aed');
const dinnerImage = img('1520854221256-17451cc331bf');
const gardenImage = img('1504196606672-aef5c9cefc92');
const ringsImage = img('1606216794074-735e91aa2c92');
const travelImage = img('1500530855697-b586d89ba3ee');
const danceImage = img('1529634597503-139d3726fed5');
const flowersImage = img('1526045478516-99145907023c');

function weddingHero(image = heroImage) {
  return {
    type: 'hero',
    data: {
      coupleName: 'Mara & Elias',
      headline: 'Mara & Elias',
      date: '2026-09-12',
      venue: 'Gut Sonnenhof · Starnberg',
      tagline: 'Wir feiern einen Tag mit Familie, Freundinnen, Freunden, gutem Essen und genug Zeit füreinander.',
      subline: 'Wir feiern einen Tag mit Familie, Freundinnen, Freunden, gutem Essen und genug Zeit füreinander.',
      bgImage: image,
      overlayColor: '#2A1714',
      overlayOpacity: 0.58,
    },
    styleOverrides: darkSectionTokens,
  };
}

function collectionHero(headline, subline, image, category = 'Mara & Elias') {
  return {
    type: 'collectionHero',
    data: {
      headline,
      subline,
      category,
      bgImage: image,
      backgroundImage: image,
      bgPosition: 'center 45%',
      overlayColor: '#2A1714',
      overlayOpacity: 0.58,
      imageEffect: 'kenBurns',
      imageEffectIntensity: 'subtle',
    },
    styleOverrides: darkSectionTokens,
  };
}

function cta(headline = 'Sagt uns bitte, ob Ihr dabei seid.', subline = 'Die Rückmeldung hilft uns bei Sitzplan, Menü und allem, was den Tag entspannt macht.') {
  return {
    type: 'ctaBand',
    data: {
      badgeText: 'Rückmeldung',
      headline,
      subline,
      ctaPrimary: { label: 'Zur RSVP', href: '/rsvp', icon: 'Send' },
    },
    styleOverrides: softRose,
  };
}

function edHero(eyebrow, headline, text, image, opts = {}) {
  return {
    type: 'editorialHero',
    data: {
      eyebrow,
      headline,
      text: `<p>${text}</p>`,
      imagePrimary: image,
      ...(opts.imageSecondary ? { imageSecondary: opts.imageSecondary } : {}),
      primaryCta: opts.primaryCta || { label: 'Zur RSVP', href: '/rsvp' },
      ...(opts.secondaryCta ? { secondaryCta: opts.secondaryCta } : {}),
      ...(opts.hint ? { hint: opts.hint } : {}),
    },
  };
}

function cineHero(eyebrow, headline, subline, image, facts) {
  return {
    type: 'cinematicHero',
    data: {
      eyebrow,
      headline,
      subline,
      image,
      overlay: 'rgba(42,23,20,0.56)',
      align: 'left',
      primaryCta: { label: 'Zur RSVP', href: '/rsvp' },
      ...(facts ? { facts } : {}),
    },
  };
}

function imCta(headline, subline, image) {
  return {
    type: 'immersiveCtaBanner',
    data: {
      badge: 'Rückmeldung',
      headline,
      subline,
      image,
      overlay: 'rgba(42,23,20,0.6)',
      primaryCta: { label: 'Jetzt zusagen', href: '/rsvp' },
      secondaryCta: { label: 'Fragen? Schreibt uns', href: '/kontakt' },
    },
  };
}

function faqSection() {
  return {
    type: 'faq',
    data: {
      headline: 'Häufige Fragen unserer Gäste',
      items: [
        { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Bitte schaut in Eure Einladung. Wenn dort eine Begleitung genannt ist, plant sie gerne mit ein. Wenn etwas unklar ist, schreibt uns kurz.' },
        { question: 'Gibt es vegetarisches oder veganes Essen?', answer: 'Ja. In der RSVP könnt Ihr vegetarisch, vegan, Allergien und Unverträglichkeiten angeben. Wir geben das gesammelt an die Küche weiter.' },
        { question: 'Sind Kinder willkommen?', answer: 'Ja, sehr. Wir planen eine ruhige Spielecke und frühe Essensoptionen. Bitte tragt Kinder bei der Rückmeldung mit ein.' },
        { question: 'Müssen wir etwas ausdrucken?', answer: 'Nein. Alle wichtigen Infos stehen hier. Für die Anfahrt reicht die Adresse oder der Link zur Karte.' },
      ],
    },
  };
}

function updateItem({ slug, title, excerpt, image, body }) {
  return {
    title,
    slug,
    excerpt,
    image,
    data: {
      excerpt,
      image,
      sections: [
        { id: uuid(), ...collectionHero(title, excerpt, image, 'Update') },
        {
          id: uuid(),
          type: 'textImage',
          data: {
            badge: 'Kurz notiert',
            headline: title,
            text: `<p>${body}</p>`,
            image,
            imageAlt: title,
            layout: 'image-right',
            primaryCta: { label: 'Zur RSVP', href: '/rsvp', icon: 'Send' },
          },
          styleOverrides: lightSection,
        },
        faqSection(),
        { id: uuid(), ...cta('Noch eine Frage?', 'Wenn etwas für Euch offen ist, schreibt uns. Wir halten die Seite aktuell.') },
      ],
    },
  };
}

const updates = [
  updateItem({
    slug: 'hotelkontingent-ist-offen',
    title: 'Hotelkontingent ist offen',
    excerpt: 'Im Seehotel Starnberg sind Zimmer bis Ende Juni unter unserem Namen reserviert.',
    image: travelImage,
    body: 'Für Gäste von außerhalb gibt es ein kleines Kontingent im Seehotel Starnberg. Nennt bei der Buchung einfach „Mara & Elias“. Wer lieber in München schläft, findet auf der Anreise-Seite ebenfalls ruhige Optionen mit guter Verbindung.',
  }),
  updateItem({
    slug: 'menue-und-unvertraeglichkeiten',
    title: 'Menü, Allergien und Wünsche',
    excerpt: 'Bitte tragt besondere Ernährung, Allergien oder Kinderessen direkt in der RSVP ein.',
    image: dinnerImage,
    body: 'Die Küche plant ein gemeinsames Abendessen mit vegetarischer und veganer Option. Damit niemand improvisieren muss, sammeln wir Eure Hinweise frühzeitig und geben sie gebündelt weiter.',
  }),
  updateItem({
    slug: 'shuttle-nach-mitternacht',
    title: 'Shuttle nach Mitternacht',
    excerpt: 'Für den Heimweg fährt ein Shuttle zwischen Gut Sonnenhof, Seehotel und S-Bahn.',
    image: danceImage,
    body: 'Ab 00:30 Uhr fährt ungefähr stündlich ein kleiner Shuttle. Die genauen Zeiten hängen wir am Abend aus. Wer früher los möchte, findet Taxinummern auf der Anreise-Seite.',
  }),
];

const pages = [
  {
    slug: '',
    title: 'Startseite',
    seo: {
      metaTitle: 'Mara & Elias heiraten am Gut Sonnenhof',
      metaDescription: 'Alle Informationen zur Hochzeit von Mara & Elias am 12. September 2026 bei Starnberg: Ablauf, Location, Anreise, RSVP, Dresscode und Updates.',
      ogImage: heroImage,
    },
    sections: [
      { id: uuid(), ...weddingHero(heroImage) },
      {
        id: uuid(),
        type: 'socialProofBar',
        data: {
          bgStyle: 'light',
          items: [
            { value: '12.09.2026', label: 'Hochzeitstag', icon: 'CalendarHeart' },
            { value: 'Gut Sonnenhof', label: 'bei Starnberg', icon: 'MapPin' },
            { value: 'RSVP bis 30.06.', label: 'bitte eintragen', icon: 'Send' },
            { value: 'Shuttle', label: 'ab Mitternacht', icon: 'Bus' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'coupleStory',
        data: {
          headline: 'Was als kurzer Kaffee begann, wurde unser Zuhause.',
          subline: 'Wir mögen es ruhig, ehrlich und nicht perfekt choreografiert. Genau so soll auch unser Tag werden.',
          milestones: [
            { year: '2018', title: 'Erstes Treffen', text: 'Ein Kaffee in München, der eigentlich nur eine Stunde dauern sollte.', image: img('1498654200943-1088dd4438ae', 1200) },
            { year: '2020', title: 'Erste Wohnung', text: 'Zu viele Pflanzen, zu wenig Stauraum und sehr schnell das Gefühl: passt.', image: img('1522708323590-d24dbb6b0267', 1200) },
            { year: '2025', title: 'Die Frage', text: 'Am See, ohne große Bühne, aber mit genau dem richtigen Moment.', image: ringsImage },
            { year: '2026', title: 'Unser Fest', text: 'Ein Tag für Menschen, die uns begleitet haben und mit uns weitergehen.', image: heroImage },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'featureShowcase',
        data: {
          badge: 'Der Rahmen',
          headline: 'Ein Tag, der nicht überplant wirkt.',
          subline: 'Wir haben die wichtigsten Dinge sortiert, damit Ihr ankommen, essen, tanzen und wieder gut nach Hause kommen könnt.',
          text: '<p>Auf dieser Seite findet Ihr alles, was wir selbst als Gäste gerne vorab wissen würden: Zeiten, Wege, Dresscode, Geschenkewunsch und Rückmeldung.</p>',
          image: venueImage,
          features: ['Trauung im Garten', 'Dinner im alten Saal', 'Shuttle zur S-Bahn', 'Kinder willkommen'],
          ctaLabel: 'Ablauf ansehen',
          ctaHref: '/hochzeitstag',
          reversed: true,
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'eventSchedule',
        data: {
          headline: 'Der Hochzeitstag in kurzen Stationen',
          subline: 'Die Zeiten sind bewusst klar, aber nicht steif. Dazwischen bleibt Raum zum Ankommen.',
          events: [
            { time: '14:30', title: 'Ankommen', description: 'Getränke im Innenhof, kurze Begrüßung und Zeit, alle wiederzusehen.', icon: 'GlassWater', location: 'Innenhof' },
            { time: '15:30', title: 'Freie Trauung', description: 'Im Garten hinter dem Gutshaus. Bei Regen ziehen wir in den kleinen Saal.', icon: 'Heart', location: 'Garten' },
            { time: '17:00', title: 'Aperitif & Fotos', description: 'Keine lange Foto-Pause, sondern kurze Gruppenbilder und viel Gespräch.', icon: 'Camera', location: 'Terrasse' },
            { time: '19:00', title: 'Dinner', description: 'Gemeinsames Menü, Reden nur kurz und danach offen für Tanz und Nachtisch.', icon: 'Utensils', location: 'Alter Saal' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'bentoGrid',
        data: {
          headline: 'Was Ihr vorher wissen solltet.',
          subline: 'Die wichtigsten Entscheidungen ohne lange Suche.',
          items: [
            { title: 'RSVP', text: 'Bitte bis 30. Juni zurückmelden, auch wenn Ihr leider nicht kommen könnt.', icon: 'Send', span: '2' },
            { title: 'Dresscode', text: 'Sommerlich festlich, eher warme Farben als Schwarz-Weiß-Kontrast.', icon: 'Sparkles' },
            { title: 'Anreise', text: 'Parkplätze vor Ort, Shuttle später zur S-Bahn Starnberg Nord.', icon: 'MapPinned' },
            { title: 'Geschenke', text: 'Wir freuen uns über einen Beitrag zur Reise statt Dinge für Regale.', icon: 'Gift' },
          ],
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'statsCounter',
        data: {
          headline: 'Ein paar Eckdaten',
          subline: 'Kurz genug, damit man sie behält.',
          stats: [
            { value: 120, label: 'Gäste' },
            { value: 1, label: 'Tag' },
            { value: 4, label: 'Stationen' },
            { value: 0, label: 'Kleiderzwang' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'timeline',
        data: {
          badge: 'Planung',
          headline: 'Bis zum Fest passiert noch das.',
          subline: 'Wir halten Euch hier aktuell, wenn sich etwas ändert.',
          entries: [
            { year: 'Juni', title: 'RSVP abschließen', text: 'Bis 30. Juni sammeln wir Zu- und Absagen, Ernährung und Begleitungen.' },
            { year: 'Juli', title: 'Sitzplan & Menü', text: 'Danach gehen Details an Location und Küche.' },
            { year: 'August', title: 'Letzte Infos', text: 'Shuttlezeiten, Telefonnummern und Plan B bei Wetter werden ergänzt.' },
            { year: 'September', title: 'Feiern', text: 'Dann geht es nur noch ums Ankommen, Essen, Tanzen und Beisammensein.' },
          ],
        },
        styleOverrides: sageSection,
      },
      {
        id: uuid(),
        type: 'comparisonTable',
        data: {
          badge: 'Schnell entscheiden',
          headline: 'Welche Seite hilft wobei?',
          text: 'Wenn Ihr nur eine Sache sucht, findet Ihr sie hier.',
          columns: [{ label: 'Info' }, { label: 'Wofür' }, { label: 'Link' }],
          rows: [
            { feature: 'Ablauf', values: ['Zeiten', 'Wann passiert was?', 'Hochzeitstag'] },
            { feature: 'Anreise', values: ['Wege', 'Auto, Bahn, Hotels', 'Anreise'] },
            { feature: 'RSVP', values: ['Antwort', 'Zu- oder Absage', 'RSVP'] },
            { feature: 'Dresscode', values: ['Outfit', 'Farben und Hinweise', 'Dresscode'] },
          ],
          highlightCol: 1,
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'venueInfo',
        data: {
          headline: 'Gut Sonnenhof ist unser Mittelpunkt.',
          subline: 'Trauung, Dinner und Party sind an einem Ort. Keine Ortswechsel, keine hektischen Fahrten.',
          venues: [
            { name: 'Garten', image: gardenImage, address: 'Sonnenhof 7, 82319 Starnberg', description: 'Hier planen wir die freie Trauung. Bei Regen bleibt der Ablauf gleich, nur der Ort wechselt nach innen.', parkingInfo: 'Parkplätze direkt vor dem Gut.' },
            { name: 'Alter Saal', image: dinnerImage, address: 'Sonnenhof 7, 82319 Starnberg', description: 'Dinner, Reden und später Tanzfläche. Der Saal ist warm, schlicht und nah am Innenhof.', parkingInfo: 'Shuttle ab Mitternacht zur S-Bahn.' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'newsPreview',
        data: {
          headline: 'Aktuelle Hinweise',
          subline: 'Wenn sich etwas ändert, schreiben wir es hier zuerst.',
          collectionKey: 'news',
          linkLabel: 'Alle Updates lesen',
          linkHref: '/news',
        },
        styleOverrides: softRose,
      },
      { id: uuid(), ...cta() },
    ],
  },
  {
    slug: 'leistungen',
    title: 'Gästeinfos',
    seo: {
      metaTitle: 'Gästeinfos | Mara & Elias',
      metaDescription: 'Die wichtigsten Gästeinfos zur Hochzeit von Mara und Elias: RSVP, Ablauf, Location, Anreise, Dresscode und Geschenke.',
      ogImage: venueImage,
    },
    sections: [
      { id: uuid(), ...collectionHero('Alles Wichtige auf einen Blick.', 'Die schnelle Übersicht für alle, die nicht jede Seite einzeln lesen möchten.', venueImage, 'Gästeinfos') },
      {
        id: uuid(),
        type: 'servicesGrid',
        data: {
          badgeText: 'Orientierung',
          headline: 'Was Ihr wo findet.',
          subline: 'Kurze Wege durch die Website, so wie später auch durch die Location.',
          ctaLabel: 'Zur RSVP',
          ctaHref: '/rsvp',
          manualCards: [
            { title: 'Hochzeitstag', text: 'Zeiten, Stationen, Menü und Shuttle am Abend.', icon: 'CalendarHeart', href: '/hochzeitstag' },
            { title: 'Location', text: 'Garten, Saal, Parkplätze und Orientierung am Gut Sonnenhof.', icon: 'MapPinned', href: '/location' },
            { title: 'Anreise & Hotels', text: 'Auto, Bahn, Shuttle und empfohlene Unterkünfte.', icon: 'Bus', href: '/anreise-hotels' },
            { title: 'RSVP', text: 'Zu- oder Absage, Begleitung, Kinder und Essenshinweise.', icon: 'Send', href: '/rsvp' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'comparisonTable',
        data: {
          badge: 'Schnell gefunden',
          headline: 'Wenn Ihr nur eine Frage habt',
          text: 'Diese Tabelle ist bewusst praktisch, nicht poetisch.',
          columns: [{ label: 'Frage' }, { label: 'Antwort' }, { label: 'Seite' }],
          rows: [
            { feature: 'Bis wann zusagen?', values: ['30. Juni 2026', 'RSVP hilft bei Menü und Sitzplan', 'RSVP'] },
            { feature: 'Was anziehen?', values: ['sommerlich festlich', 'warme Farben, bequeme Schuhe', 'Dresscode'] },
            { feature: 'Wo schlafen?', values: ['Seehotel oder München', 'Kontingent rechtzeitig buchen', 'Anreise'] },
            { feature: 'Was schenken?', values: ['nichts Pflicht', 'optional Reisebeitrag', 'Geschenke'] },
          ],
          highlightCol: 1,
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'processSteps',
        data: {
          badgeText: 'Vorbereitung',
          headline: 'Vier Dinge reichen vorab.',
          steps: [
            { icon: 'Send', title: 'Antwort senden', text: 'Bitte auch dann, wenn Ihr leider nicht kommen könnt.' },
            { icon: 'Utensils', title: 'Essen angeben', text: 'Allergien, vegetarisch, vegan und Kinderessen direkt eintragen.' },
            { icon: 'Hotel', title: 'Hotel buchen', text: 'Das Kontingent ist nicht unbegrenzt, deshalb lieber früh reservieren.' },
            { icon: 'Sparkles', title: 'Outfit wählen', text: 'Festlich, bequem und passend zu Garten und Abend.' },
          ],
        },
        styleOverrides: sageSection,
      },
      faqSection(),
      { id: uuid(), ...imCta('Alles gefunden?', 'Wenn nicht, schreibt uns kurz. Wir ergänzen lieber eine Info, als dass Ihr suchen müsst.', flowersImage) },
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    seo: {
      metaTitle: 'Über uns | Mara & Elias',
      metaDescription: 'Ein persönlicher Blick auf Mara und Elias und die Menschen, die die Hochzeit begleiten.',
      ogImage: ringsImage,
    },
    sections: [
      { id: uuid(), ...edHero('Über uns', 'Warum dieser Tag zu uns passen soll.', 'Wir mögen klare Worte, gutes Essen und Menschen, die bleiben, wenn es nicht perfekt läuft.', ringsImage, { secondaryCta: { label: 'Unsere Geschichte', href: '/geschichte' } }) },
      {
        id: uuid(),
        type: 'textImage',
        data: {
          badge: 'Mara & Elias',
          headline: 'Wir feiern nicht, um eine Show zu bauen.',
          text: '<p>Wir feiern, weil viele Menschen unseren Weg leichter, wärmer und lustiger gemacht haben. Deshalb soll der Tag persönlich bleiben: gutes Essen, genug Zeit, keine unnötige Hektik.</p>',
          image: heroImage,
          imageAlt: 'Mara und Elias im warmen Abendlicht',
          layout: 'image-left',
          items: [
            { icon: 'Heart', title: 'ruhig', text: 'lieber gute Gespräche als zu viele Programmpunkte' },
            { icon: 'Utensils', title: 'gemeinsam', text: 'Dinner und Tischzeit sind uns wichtig' },
            { icon: 'Music', title: 'leicht', text: 'später darf getanzt werden, aber niemand muss' },
          ],
          primaryCta: { label: 'Unsere Geschichte', href: '/unsere-geschichte', icon: 'BookOpen' },
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'weddingParty',
        data: {
          headline: 'Diese Menschen helfen am Tag selbst.',
          subline: 'Sie wissen, wo was liegt und wen man fragt, wenn wir gerade nicht erreichbar sind.',
          members: [
            { name: 'Lena', role: 'Trauzeugin', relationship: 'Maras Schwester', text: 'Sitzplan, Kinder, Essen und ruhige Ansagen.', image: img('1494790108377-be9c29b29330', 900) },
            { name: 'Jonas', role: 'Trauzeuge', relationship: 'Elias bester Freund', text: 'Shuttle, Technik und alles mit Kabeln.', image: img('1500648767791-00dcc994a43e', 900) },
            { name: 'Nora', role: 'Gästekoordination', relationship: 'Freundin', text: 'Hilft bei Fragen zwischen Trauung und Dinner.', image: img('1544005313-94ddf0286df2', 900) },
            { name: 'Paul', role: 'Musik & Heimweg', relationship: 'Cousin', text: 'Findet Playlists, Taxinummern und verlorene Jacken.', image: img('1506794778202-cad84cf45f1d', 900) },
          ],
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'timeline',
        data: {
          badge: 'Kurzfassung',
          headline: 'Was uns geprägt hat',
          entries: [
            { year: '2018', title: 'Kaffee', text: 'Ein erstes Treffen, das deutlich länger dauerte als geplant.' },
            { year: '2020', title: 'Alltag', text: 'Gemeinsame Routinen, Pflanzen und sehr unterschiedliche Ordnungssysteme.' },
            { year: '2025', title: 'Antrag', text: 'Ein ruhiger Moment am See und eine sehr klare Antwort.' },
            { year: '2026', title: 'Feier', text: 'Ein Tag für alle, die ein Stück dieses Wegs mitgegangen sind.' },
          ],
        },
        styleOverrides: sageSection,
      },
      faqSection(),
      { id: uuid(), ...cta('Ihr seid der Grund für diese Seite.', 'Danke, dass Ihr mit uns feiert oder an uns denkt.') },
    ],
  },
  {
    slug: 'hochzeitstag',
    title: 'Hochzeitstag',
    seo: {
      metaTitle: 'Ablauf am Hochzeitstag | Mara & Elias',
      metaDescription: 'Der Ablauf der Hochzeit von Mara & Elias: Ankommen, Trauung, Aperitif, Dinner, Tanz und Shuttle.',
      ogImage: gardenImage,
    },
    sections: [
      { id: uuid(), ...cineHero('12. September 2026', 'Unser Hochzeitstag', 'Ein Ablauf mit klaren Zeiten, aber ohne steifes Programm.', gardenImage, [ { value: '15:00', label: 'Freie Trauung' }, { value: '18:30', label: 'Dinner' }, { value: '21:30', label: 'Party' } ]) },
      {
        id: uuid(),
        type: 'eventSchedule',
        data: {
          headline: 'Der Ablauf im Detail',
          subline: 'Bitte plant ein paar Minuten Puffer ein. Wir starten lieber entspannt als gehetzt.',
          events: [
            { time: '14:30', title: 'Ankommen', description: 'Getränke, Begrüßung und erste Gespräche im Innenhof.', icon: 'GlassWater', location: 'Innenhof' },
            { time: '15:30', title: 'Freie Trauung', description: 'Etwa 45 Minuten im Garten. Sonnenbrillen sind erlaubt.', icon: 'Heart', location: 'Garten' },
            { time: '16:30', title: 'Aperitif', description: 'Kurze Gruppenbilder, kleine Snacks und Musik.', icon: 'Camera', location: 'Terrasse' },
            { time: '19:00', title: 'Dinner', description: 'Gemeinsames Menü im Saal. Hinweise zu Allergien bitte in der RSVP.', icon: 'Utensils', location: 'Alter Saal' },
            { time: '21:30', title: 'Tanz & Nachtisch', description: 'Ab hier darf der Plan lockerer werden.', icon: 'Music', location: 'Saal & Innenhof' },
            { time: '00:30', title: 'Shuttle', description: 'Erste Fahrt Richtung Seehotel und S-Bahn Starnberg Nord.', icon: 'Bus', location: 'Eingang' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'processSteps',
        data: {
          badgeText: 'Für Gäste',
          headline: 'So bleibt der Tag für alle leicht.',
          steps: [
            { icon: 'Send', title: 'RSVP ausfüllen', text: 'Bitte tragt Begleitung, Kinder und Essenshinweise rechtzeitig ein.' },
            { icon: 'MapPinned', title: 'Anreise planen', text: 'Auto, Bahn und Hotels stehen gesammelt auf der Anreise-Seite.' },
            { icon: 'Sparkles', title: 'Outfit wählen', text: 'Sommerlich festlich, bequem genug für Garten und Tanzfläche.' },
            { icon: 'Heart', title: 'Mitfeiern', text: 'Alles Weitere erklären wir vor Ort. Ihr müsst nichts mitbringen außer Euch.' },
          ],
        },
        styleOverrides: sageSection,
      },
      {
        id: uuid(),
        type: 'weddingMenu',
        data: {
          headline: 'Essen, das gemeinsam funktioniert.',
          subline: 'Wir planen kein steifes Menü, sondern einen Abend, bei dem alle gut durchkommen.',
          note: 'Vegetarisch, vegan, Allergien und Kinderessen bitte in der RSVP angeben.',
          courses: [
            { title: 'Aperitif', items: [{ name: 'Kleine Brote', description: 'mit Kräuterbutter, Tomate und Bergkäse' }, { name: 'Sommerliche Suppe', description: 'kalt serviert, auch vegan möglich' }] },
            { title: 'Dinner', items: [{ name: 'Rind, Ofengemüse, Kräuterjus' }, { name: 'Gefüllte Zucchini', description: 'vegetarisch, auf Wunsch vegan' }] },
            { title: 'Später', items: [{ name: 'Kuchen & Dessertbar' }, { name: 'Mitternachtssnack', description: 'klein, salzig, hilfreich' }] },
          ],
        },
        styleOverrides: lightSection,
      },
      faqSection(),
      { id: uuid(), ...imCta('Fehlt Euch eine Info zum Tag?', 'Schreibt uns lieber einmal zu früh als am Samstag mit Stress.', gardenImage) },
    ],
  },
  {
    slug: 'location',
    title: 'Location',
    seo: {
      metaTitle: 'Location am Gut Sonnenhof | Mara & Elias',
      metaDescription: 'Informationen zur Hochzeitslocation Gut Sonnenhof bei Starnberg: Garten, Saal, Parkplätze und Orientierung vor Ort.',
      ogImage: venueImage,
    },
    sections: [
      { id: uuid(), ...cineHero('Location', 'Ein Ort für alles.', 'Trauung, Dinner und Party bleiben am Gut Sonnenhof. Das macht den Tag ruhiger.', venueImage) },
      {
        id: uuid(),
        type: 'venueInfo',
        data: {
          headline: 'Drei Bereiche, ein kurzer Weg.',
          subline: 'Ihr müsst nicht zwischen Orten wechseln. Alles liegt wenige Schritte auseinander.',
          venues: [
            { name: 'Innenhof', image: img('1519167758481-83f550bb49b3'), address: 'Sonnenhof 7, 82319 Starnberg', description: 'Hier kommt Ihr an, findet Getränke und später auch den Shuttle-Hinweis.', parkingInfo: 'Parken direkt am Eingang.' },
            { name: 'Garten', image: gardenImage, address: 'Sonnenhof 7, 82319 Starnberg', description: 'Geplant für die Trauung. Bei Regen ziehen wir in den kleinen Saal um.', parkingInfo: 'Bitte keine Absätze, die im Rasen stecken bleiben.' },
            { name: 'Alter Saal', image: dinnerImage, address: 'Sonnenhof 7, 82319 Starnberg', description: 'Dinner, Tanz und späterer Abend. Warmes Licht, genug Platz und kurze Wege nach draußen.', parkingInfo: 'Barrierearmer Zugang möglich.' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'portfolio',
        data: {
          badgeText: 'Atmosphäre',
          headline: 'So fühlt sich der Sonnenhof an.',
          subline: 'Ein paar Bilder, damit Ihr den Rahmen besser einordnen könnt.',
          projects: [
            { title: 'Garten', category: 'Trauung', description: 'Draußen, ruhig, mit Blick ins Grüne.', image: gardenImage },
            { title: 'Alter Saal', category: 'Dinner', description: 'Warmes Licht und genug Raum für lange Tische.', image: dinnerImage },
            { title: 'Innenhof', category: 'Aperitif', description: 'Der Ort zum Ankommen, Wiedersehen und später Luft holen.', image: img('1507504031003-b417219a0fde') },
          ],
          ctaLabel: 'Anreise ansehen',
          ctaHref: '/anreise-hotels',
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'map',
        data: {
          headline: 'Gut Sonnenhof · Starnberg',
          embedUrl: 'https://www.google.com/maps?q=Sonnenhof%207%2C%2082319%20Starnberg&output=embed',
          height: 'm',
        },
      },
      {
        id: uuid(),
        type: 'servicesGrid',
        data: {
          badgeText: 'Vor Ort',
          headline: 'Was am Sonnenhof praktisch ist.',
          subline: 'Kleine Details, die den Tag für Gäste einfacher machen.',
          ctaLabel: 'Alle Gästeinfos',
          ctaHref: '/anreise-hotels',
          manualCards: [
            { title: 'Parken direkt am Gut', text: 'Es gibt ausgeschilderte Flächen am Eingang.', icon: 'Car' },
            { title: 'Plan B bei Regen', text: 'Die Trauung wandert nach innen, der Ablauf bleibt gleich.', icon: 'CloudRain' },
            { title: 'Kurze Wege', text: 'Garten, Saal, Innenhof und Shuttlepunkt liegen nah beieinander.', icon: 'Route' },
            { title: 'Ruhiger Rückzug', text: 'Für Kinder und kurze Pausen gibt es einen Nebenraum.', icon: 'Sofa' },
          ],
        },
        styleOverrides: lightSection,
      },
      { id: uuid(), ...cta('Ihr wollt wissen, wo Ihr hinmüsst?', 'Auf der Anreise-Seite findet Ihr Auto, Bahn, Hotels und Shuttle gesammelt.') },
    ],
  },
  {
    slug: 'anreise-hotels',
    title: 'Anreise & Hotels',
    seo: {
      metaTitle: 'Anreise und Hotels | Mara & Elias',
      metaDescription: 'Anreise zur Hochzeit am Gut Sonnenhof bei Starnberg: Auto, Bahn, Shuttle, Hotelkontingent und Tipps für Gäste.',
      ogImage: travelImage,
    },
    sections: [
      { id: uuid(), ...edHero('Anreise', 'Gut ankommen, gut heimkommen.', 'Auto, Bahn, Hotel und Shuttle in einem Überblick.', travelImage, { primaryCta: { label: 'Route planen', href: 'https://maps.google.com/?q=Gut+Sonnenhof' }, secondaryCta: { label: 'Hotels ansehen', href: '#hotels' } }) },
      {
        id: uuid(),
        type: 'travelInfo',
        data: {
          headline: 'So kommt Ihr entspannt zum Sonnenhof.',
          subline: 'Bitte plant am Nachmittag etwas Puffer ein. Am See kann der Verkehr überraschend kreativ werden.',
          sections: [
            { title: 'Mit dem Auto', icon: 'Car', content: 'Über die A95 Richtung Starnberg, Ausfahrt Starnberg. Parkplätze sind am Gut ausgeschildert.' },
            { title: 'Mit der Bahn', icon: 'Train', content: 'S-Bahn bis Starnberg Nord. Von dort Taxi oder Shuttle nach Anmeldung.' },
            { title: 'Shuttle nachts', icon: 'Bus', content: 'Ab 00:30 Uhr fährt ein Shuttle zum Seehotel und zur S-Bahn. Zeiten hängen am Abend aus.' },
            { title: 'Taxi', icon: 'Phone', content: 'Wir legen lokale Taxi-Kontakte am Eingang aus. Bitte teilt Fahrten, wenn es passt.' },
          ],
          hotels: [
            { name: 'Seehotel Starnberg', image: img('1566073771259-6a8506099945'), link: 'https://www.seehotel-starnberg.de', distance: '8 Min. mit dem Shuttle', specialRate: 'Kontingent bis 30. Juni unter Mara & Elias', stars: '4' },
            { name: 'Hotel Vier Jahreszeiten Starnberg', image: img('1551882547-ff40c63fe5fa'), link: 'https://www.vier-jahreszeiten-starnberg.de', distance: '10 Min. mit Taxi', specialRate: 'gute Option für Gäste mit Auto', stars: '4' },
            { name: 'München Süd', image: img('1520250497591-112f2f40a3f4'), distance: 'ca. 35 Min. mit S-Bahn', specialRate: 'praktisch, wenn Ihr länger in München bleibt', stars: '3-4' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'comparisonTable',
        data: {
          badge: 'Entscheidungshilfe',
          headline: 'Welche Anreise passt?',
          text: 'Kurz sortiert, damit Ihr nicht lange vergleichen müsst.',
          columns: [{ label: 'Variante' }, { label: 'Gut für' }, { label: 'Hinweis' }],
          rows: [
            { feature: 'Auto', values: ['Direkt', 'Familien, Gepäck, Kinder', 'Parken am Gut'] },
            { feature: 'S-Bahn', values: ['Flexibel', 'München-Gäste', 'Taxi/Shuttle einplanen'] },
            { feature: 'Seehotel', values: ['Nah', 'Späte Heimfahrt vermeiden', 'Kontingent beachten'] },
            { feature: 'München', values: ['Wochenende', 'Städtetrip verlängern', 'Rückweg planen'] },
          ],
          highlightCol: 1,
        },
        styleOverrides: sageSection,
      },
      {
        id: uuid(),
        type: 'additionalLocations',
        data: {
          badge: 'Hotels',
          headline: 'Empfehlungen in der Nähe',
          subline: 'Bitte bucht früh, weil im September am See viel los ist.',
          locations: [
            { name: 'Seehotel Starnberg', address: 'Bahnhofplatz 6, 82319 Starnberg', phone: '+49 8151 4470', openingHours: 'Kontingent: Mara & Elias bis 30. Juni', ctaLabel: 'Hotel öffnen', ctaHref: 'https://www.seehotel-starnberg.de' },
            { name: 'Vier Jahreszeiten Starnberg', address: 'Münchner Straße 17, 82319 Starnberg', phone: '+49 8151 44700', openingHours: 'Gute Alternative mit Auto oder Taxi', ctaLabel: 'Hotel öffnen', ctaHref: 'https://www.vier-jahreszeiten-starnberg.de' },
            { name: 'München Süd', address: 'S-Bahn-Bereich Richtung Starnberg', openingHours: 'Für alle, die das Wochenende verlängern', ctaLabel: 'S-Bahn prüfen', ctaHref: 'https://www.mvv-muenchen.de' },
          ],
        },
        styleOverrides: lightSection,
      },
      faqSection(),
      { id: uuid(), ...imCta('Braucht Ihr Hilfe bei der Anreise?', 'Schreibt uns kurz, wenn Ihr unsicher seid. Wir verbinden Euch auch gern mit anderen Gästen.', travelImage) },
    ],
  },
  {
    slug: 'rsvp',
    title: 'RSVP',
    seo: {
      metaTitle: 'RSVP zur Hochzeit | Mara & Elias',
      metaDescription: 'Rückmeldung zur Hochzeit von Mara & Elias: Zusage, Begleitung, Essenswünsche, Allergien und Songwunsch.',
      ogImage: flowersImage,
    },
    sections: [
      { id: uuid(), ...edHero('RSVP', 'Seid Ihr dabei?', 'Bitte gebt uns bis 30. Juni Bescheid. Auch Absagen helfen uns beim Planen.', flowersImage, { primaryCta: { label: 'Jetzt antworten', href: '#rsvp' }, hint: 'Antwortfrist: 30. Juni — auch Absagen helfen uns.' }) },
      {
        id: uuid(),
        type: 'rsvp',
        data: {
          headline: 'Rückmeldung bis 30. Juni',
          subline: 'Tragt bitte auch Begleitung, Kinder, Ernährung und Allergien ein. So können wir Sitzplan und Menü sauber vorbereiten.',
          deadline: '30. Juni 2026',
          maxGuests: 2,
          showSongWish: true,
          showDietary: true,
          showAllergies: true,
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'featureShowcase',
        data: {
          badge: 'Warum so früh?',
          headline: 'Je klarer die Rückmeldungen, desto entspannter der Tag.',
          subline: 'Location, Küche und Shuttle brauchen echte Zahlen. Eure Angaben helfen uns, ohne Ratespiel zu planen.',
          image: dinnerImage,
          features: ['Sitzplan', 'Kinderessen', 'Allergien', 'Shuttlebedarf'],
          ctaLabel: 'Ablauf ansehen',
          ctaHref: '/hochzeitstag',
          reversed: false,
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'processSteps',
        data: {
          badgeText: 'Drei Minuten',
          headline: 'So funktioniert die Rückmeldung.',
          steps: [
            { icon: 'UserCheck', title: 'Namen eintragen', text: 'Bitte so, wie wir Euch auf dem Sitzplan finden sollen.' },
            { icon: 'Users', title: 'Begleitung prüfen', text: 'Wenn eine Begleitung eingeladen ist, könnt Ihr sie direkt angeben.' },
            { icon: 'Utensils', title: 'Essen nennen', text: 'Vegetarisch, vegan, Allergien und Kinderessen bitte nicht vergessen.' },
            { icon: 'Music', title: 'Song wünschen', text: 'Kein Versprechen, aber wir freuen uns über Hinweise für die Tanzfläche.' },
          ],
        },
        styleOverrides: sageSection,
      },
      faqSection(),
      { id: uuid(), ...cta('Noch nicht sicher?', 'Wenn Ihr erst später verbindlich antworten könnt, schreibt uns bitte kurz.') },
    ],
  },
  {
    slug: 'dresscode',
    title: 'Dresscode',
    seo: {
      metaTitle: 'Dresscode | Mara & Elias',
      metaDescription: 'Dresscode zur Hochzeit von Mara & Elias: sommerlich festlich, warme Farben, bequeme Schuhe für Garten und Tanzfläche.',
      ogImage: flowersImage,
    },
    sections: [
      { id: uuid(), ...edHero('Dresscode', 'Sommerlich festlich, aber bitte tragbar.', 'Wir wünschen uns warme Farben, Bewegung und Outfits, in denen Ihr Euch wohlfühlt.', flowersImage) },
      {
        id: uuid(),
        type: 'dresscode',
        data: {
          headline: 'Warme Farben, leichte Stoffe, bequeme Schuhe.',
          description: 'Die Trauung ist im Garten geplant, danach geht es in den Saal. Es muss nicht streng sein, nur festlich und nicht komplett schwarz oder weiß.',
          colors: ['#B77772', '#D7A36C', '#70816C', '#E9C9B5', '#4A252B'],
          dos: ['Sommerliche Kleider, Anzüge oder Kombinationen', 'Schuhe, die Rasen und Tanzfläche schaffen', 'Tücher oder Jacken für den Abend', 'Warme Naturtöne, Rosé, Salbei, Terracotta, Bordeaux'],
          donts: ['Komplett Weiß', 'Reines Schwarz von Kopf bis Fuß', 'Sehr hohe Absätze für den Garten', 'Alles, worin Ihr den ganzen Tag nicht atmen könnt'],
          note: 'Wenn Ihr unsicher seid: lieber bequem und schön als perfekt und genervt.',
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'bentoGrid',
        data: {
          headline: 'Outfit-Fragen kurz beantwortet.',
          subline: 'Damit niemand vor dem Kleiderschrank verzweifelt.',
          items: [
            { title: 'Garten', text: 'Die Trauung findet draußen statt. Blockabsätze, flache Schuhe oder Wechselpaar sind sinnvoll.', icon: 'Flower2', span: '2' },
            { title: 'Abend', text: 'Am See kann es frisch werden. Eine leichte Jacke hilft.', icon: 'Moon' },
            { title: 'Kinder', text: 'Festlich, aber spielbar. Wir werden keine Kinderkleidung beurteilen.', icon: 'Smile' },
            { title: 'Farben', text: 'Warme Töne passen gut zur Location. Hauptsache, Ihr fühlt Euch nach Euch an.', icon: 'Palette' },
          ],
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'galleryGrid',
        data: {
          headline: 'Farbgefühl statt Uniform',
          subline: 'Das ist keine Pflichtpalette, sondern ein Gefühl für den Tag.',
          columns: 4,
          images: [
            { src: img('1508214751196-bcfd4ca60f91', 900), alt: 'Warme Stoffe in Rosé und Terracotta', caption: 'Rosé & Terracotta' },
            { src: img('1496747611176-843222e1e57c', 900), alt: 'Salbeigrüne Pflanzen und Stoffe', caption: 'Salbei' },
            { src: img('1478146896981-b80fe463b330', 900), alt: 'Bordeauxfarbene Details', caption: 'Bordeaux' },
            { src: img('1500530855697-b586d89ba3ee', 900), alt: 'Sommerliches Licht am See', caption: 'Naturtöne' },
          ],
        },
        styleOverrides: lightSection,
      },
      faqSection(),
      { id: uuid(), ...cta('Unsicher beim Outfit?', 'Schickt uns ein Foto oder fragt einfach. Wir sind da entspannt.') },
    ],
  },
  {
    slug: 'geschenke',
    title: 'Geschenke',
    seo: {
      metaTitle: 'Geschenke | Mara & Elias',
      metaDescription: 'Geschenkewunsch zur Hochzeit von Mara & Elias: Reisebeitrag statt Hausrat, freiwillig und ohne Druck.',
      ogImage: ringsImage,
    },
    sections: [
      { id: uuid(), ...collectionHero('Das schönste Geschenk ist, dass Ihr kommt.', 'Wer trotzdem etwas geben möchte, darf uns bei unserer Reise unterstützen.', ringsImage, 'Geschenke') },
      {
        id: uuid(),
        type: 'giftRegistry',
        data: {
          headline: 'Wir wünschen uns Zeit statt Dinge.',
          subline: 'Unser Zuhause ist voll genug. Wenn Ihr uns etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Reise.',
          freeText: 'Bitte fühlt Euch zu nichts verpflichtet. Eure Anwesenheit ist wirklich genug.',
          gifts: [
            { title: 'Reisebeitrag', description: 'Für ein paar Tage Meer, gutes Essen und keinen Kalender.', price: 'frei wählbar', claimed: false },
            { title: 'Dinner auf der Reise', description: 'Ein Abend, an dem wir auf Euch anstoßen.', price: '80 €', claimed: false },
            { title: 'Ausflug', description: 'Etwas, das wir sonst vielleicht zu vernünftig finden würden.', price: '120 €', claimed: false },
          ],
          bankInfo: { holder: 'Mara Weber & Elias König', iban: 'DE00 0000 0000 0000 0000 00', bic: 'DEMOXXXX', note: 'Verwendungszweck: Hochzeit Mara & Elias' },
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'featureShowcase',
        data: {
          badge: 'Warum Reise?',
          headline: 'Wir sammeln Erinnerungen, keine Dinge.',
          subline: 'Nach dem Fest wollen wir ein paar Tage raus: Meer, gutes Essen, lange Spaziergänge und keine To-do-Liste.',
          image: img('1507525428034-b723cf961d3e'),
          features: ['kein Geschenketisch', 'kein Muss', 'freie Beiträge', 'Danke von Herzen'],
          ctaLabel: 'Zur RSVP',
          ctaHref: '/rsvp',
          reversed: true,
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'statsCounter',
        data: {
          headline: 'Was wirklich zählt',
          subline: 'Kleine Zahlen, großer Kontext.',
          stats: [
            { value: 2, label: 'Menschen' },
            { value: 1, label: 'gemeinsamer Weg' },
            { value: 0, label: 'Pflichtgeschenke' },
            { value: 100, suffix: '%', label: 'Dankbarkeit' },
          ],
        },
        styleOverrides: sageSection,
      },
      faqSection(),
      { id: uuid(), ...imCta('Ihr bringt Euch selbst mit.', 'Alles Weitere ist schön, aber nicht nötig.', ringsImage) },
    ],
  },
  {
    slug: 'unsere-geschichte',
    title: 'Unsere Geschichte',
    seo: {
      metaTitle: 'Unsere Geschichte | Mara & Elias',
      metaDescription: 'Wie Mara und Elias sich kennengelernt haben und warum ihre Hochzeit am Gut Sonnenhof gefeiert wird.',
      ogImage: ringsImage,
    },
    sections: [
      { id: uuid(), ...edHero('Unsere Geschichte', 'Unsere Geschichte ist eher leise gewachsen.', 'Kein großer Knall, sondern viele kleine Entscheidungen füreinander.', ringsImage) },
      {
        id: uuid(),
        type: 'coupleStory',
        data: {
          headline: 'Von Kaffee zu Kalenderteilen.',
          subline: 'Wir sind kein Paar, das alles gleich macht. Aber wir finden ziemlich gut zusammen, was wichtig ist.',
          milestones: [
            { year: '2018', title: 'Der Kaffee', text: 'Mara kam zu spät, Elias hatte schon bestellt. Es wurde trotzdem gut.', image: img('1495474472287-4d71bcdd2085') },
            { year: '2019', title: 'Der erste Urlaub', text: 'Zu wenig Schlaf, zu viele Fotos und die Erkenntnis: Wir reisen ähnlich langsam.', image: img('1500530855697-b586d89ba3ee') },
            { year: '2022', title: 'Zusammen wohnen', text: 'Viele Pflanzen, zwei Schreibtische und eine Küche, in der immer jemand Tee kocht.', image: img('1522708323590-d24dbb6b0267') },
            { year: '2025', title: 'Der Antrag', text: 'Kein Publikum, kein Plan B, aber die richtige Antwort.', image: ringsImage },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'principlesGrid',
        data: {
          badge: 'Was uns wichtig ist',
          headline: 'Ein Fest, das nach uns klingt.',
          subline: 'Nicht perfekt, aber aufmerksam. Nicht laut, aber warm.',
          principles: [
            { eyebrow: '01', title: 'Zeit miteinander', text: 'Wir wollen nicht durch den Tag rennen, sondern Euch wirklich sehen.' },
            { eyebrow: '02', title: 'Gutes Essen', text: 'Ein gemeinsames Dinner ist für uns mehr wert als viele Programmpunkte.' },
            { eyebrow: '03', title: 'Kein Druck', text: 'Dresscode, Geschenke, Fotos: alles soll leicht bleiben.' },
            { eyebrow: '04', title: 'Dankbarkeit', text: 'Dass Ihr da seid, bedeutet uns mehr als jedes perfekte Detail.' },
          ],
          cta: { label: 'Zum Hochzeitstag', href: '/hochzeitstag' },
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'weddingParty',
        data: {
          headline: 'Menschen, die uns durch den Tag tragen.',
          subline: 'Wenn Ihr nicht wisst, wen Ihr fragen sollt: diese vier wissen fast alles.',
          members: [
            { name: 'Lena', role: 'Trauzeugin', relationship: 'Maras Schwester', text: 'Kennt jeden Plan, auch die, die noch nicht öffentlich sind.', image: img('1494790108377-be9c29b29330', 900) },
            { name: 'Jonas', role: 'Trauzeuge', relationship: 'Elias bester Freund', text: 'Zuständig für Ruhe, Technik und späte Taxifragen.', image: img('1500648767791-00dcc994a43e', 900) },
            { name: 'Nora', role: 'Gästekoordination', relationship: 'Freundin aus München', text: 'Hilft bei Kindern, Sitzplan und spontanen Fragen.', image: img('1544005313-94ddf0286df2', 900) },
            { name: 'Paul', role: 'Shuttle & Musik', relationship: 'Cousin', text: 'Findet Kabel, Fahrer und wahrscheinlich auch verlorene Jacken.', image: img('1506794778202-cad84cf45f1d', 900) },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'galleryGrid',
        data: {
          headline: 'Ein paar Bilder von unterwegs',
          subline: 'Nicht perfekt sortiert, aber sehr wir.',
          columns: 3,
          images: [
            { src: img('1516589178581-6cd7833ae3b2', 900), alt: 'Paar spaziert im Abendlicht', caption: 'Spaziergänge' },
            { src: img('1519741497674-611481863552', 900), alt: 'Hochzeitsblumen im warmen Licht', caption: 'Vorfreude' },
            { src: img('1606216794074-735e91aa2c92', 900), alt: 'Ringe auf hellem Stoff', caption: 'Der Antrag' },
            { src: img('1526045478516-99145907023c', 900), alt: 'Blumenstrauß', caption: 'Lieblingsfarben' },
          ],
        },
        styleOverrides: sageSection,
      },
      { id: uuid(), ...imCta('Jetzt seid Ihr Teil davon.', 'Danke, dass Ihr diesen Tag mit uns teilt.', ringsImage) },
    ],
  },
  {
    slug: 'referenzen',
    title: 'Momente',
    seo: {
      metaTitle: 'Momente | Mara & Elias',
      metaDescription: 'Bilder und Stimmungen zur Hochzeit von Mara und Elias am Gut Sonnenhof bei Starnberg.',
      ogImage: heroImage,
    },
    sections: [
      { id: uuid(), ...cineHero('Galerie', 'Momente, die den Tag tragen.', 'Ein paar Bilder für Stimmung, Farben und Vorfreude.', heroImage) },
      {
        id: uuid(),
        type: 'gallery',
        data: {
          headline: 'Unsere Bildwelt',
          images: [
            { src: heroImage, alt: 'Brautpaar im warmen Abendlicht' },
            { src: venueImage, alt: 'Festlich gedeckter Saal' },
            { src: gardenImage, alt: 'Garten mit Hochzeitsbestuhlung' },
            { src: ringsImage, alt: 'Eheringe auf hellem Stoff' },
            { src: flowersImage, alt: 'Blumen in warmen Farben' },
            { src: danceImage, alt: 'Tanzfläche am Abend' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'portfolio',
        data: {
          badgeText: 'Lieblingsdetails',
          headline: 'Nicht alles muss groß sein.',
          subline: 'Oft sind die kleinen Dinge die, an die man sich erinnert.',
          projects: [
            { title: 'Blumen', category: 'Farben', description: 'Rosé, Salbei, Kupfer und ein bisschen Wildheit.', image: flowersImage },
            { title: 'Tafel', category: 'Dinner', description: 'Lange Gespräche statt schneller Programmpunkte.', image: dinnerImage },
            { title: 'Garten', category: 'Trauung', description: 'Draußen, wenn das Wetter mitspielt.', image: gardenImage },
          ],
        },
        styleOverrides: softRose,
      },
      {
        id: uuid(),
        type: 'testimonials',
        data: {
          badgeText: 'Von uns',
          headline: 'Was wir uns für den Tag wünschen',
          items: [
            { quote: 'Dass niemand nur auf die Uhr schaut, sondern wirklich ankommt.', name: 'Mara', context: 'über den Nachmittag', rating: 5 },
            { quote: 'Dass das Essen gut ist, die Musik passt und am Ende alle sicher heimkommen.', name: 'Elias', context: 'über den Abend', rating: 5 },
            { quote: 'Dass Kinder lachen dürfen und Erwachsene nicht ständig Programmpunkte suchen.', name: 'Mara & Elias', context: 'über die Stimmung', rating: 5 },
          ],
        },
        styleOverrides: lightSection,
      },
      faqSection(),
      { id: uuid(), ...imCta('Ihr habt ein Foto von uns?', 'Bringt es gern mit oder schickt es vorher. Wir sammeln ein kleines Gästebuch.', heroImage) },
    ],
  },
  {
    slug: 'news',
    title: 'Updates',
    seo: {
      metaTitle: 'Updates zur Hochzeit | Mara & Elias',
      metaDescription: 'Aktuelle Hinweise zur Hochzeit von Mara und Elias: Hotelkontingent, Menü, Shuttle und organisatorische Details.',
      ogImage: travelImage,
    },
    sections: [
      { id: uuid(), ...collectionHero('Updates für unsere Gäste', 'Alles, was sich nach der Einladung noch konkretisiert.', travelImage, 'News') },
      {
        id: uuid(),
        type: 'collectionList',
        data: {
          headline: 'Neueste Hinweise',
          subline: 'Wir schreiben hier nur Dinge, die für Euch wirklich nützlich sind.',
          collectionKey: 'news',
          sortBy: 'date-desc',
          columns: 3,
          showImage: true,
          showDate: true,
          showExcerpt: true,
          showSortControls: false,
        },
        styleOverrides: lightSection,
      },
      faqSection(),
      {
        id: uuid(),
        type: 'contact',
        data: {
          badgeText: 'Kontakt',
          headline: 'Wenn etwas offen bleibt',
          introText: 'Schreibt uns oder den Trauzeug:innen. Bitte keine Scheu bei Allergien, Kindern oder Anreisefragen.',
          formEnabled: true,
          submitLabel: 'Nachricht senden',
          formFields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'message', type: 'textarea', required: true },
          ],
          infoCards: [
            { icon: 'Mail', label: 'E-Mail', value: 'hochzeit@mara-elias.de' },
            { icon: 'Phone', label: 'Trauzeuge Jonas', value: '+49 151 23456780' },
            { icon: 'MapPin', label: 'Location', value: 'Gut Sonnenhof, Starnberg' },
          ],
        },
        styleOverrides: softRose,
      },
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    seo: {
      metaTitle: 'Kontakt | Mara & Elias',
      metaDescription: 'Kontakt für Fragen zur Hochzeit von Mara und Elias: RSVP, Anreise, Allergien, Kinder und Organisation.',
      ogImage: flowersImage,
    },
    sections: [
      { id: uuid(), ...edHero('Kontakt', 'Fragt lieber kurz nach.', 'Wenn etwas unklar ist, ist eine Nachricht besser als Rätselraten.', flowersImage, { primaryCta: { label: 'Nachricht schreiben', href: '#kontakt' } }) },
      {
        id: uuid(),
        type: 'contact',
        data: {
          badgeText: 'Kontakt',
          headline: 'Eine Nachricht reicht.',
          introText: 'Für Zu- und Absagen nutzt bitte die RSVP. Für alles andere könnt Ihr uns oder die Trauzeug:innen schreiben.',
          formEnabled: true,
          submitLabel: 'Nachricht senden',
          formFields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'phone', type: 'tel', required: false },
            { name: 'message', type: 'textarea', required: true },
          ],
          infoCards: [
            { icon: 'Mail', label: 'E-Mail', value: 'hochzeit@mara-elias.de' },
            { icon: 'Phone', label: 'Jonas', value: '+49 151 23456780' },
            { icon: 'Phone', label: 'Lena', value: '+49 151 98765430' },
            { icon: 'MapPin', label: 'Location', value: 'Gut Sonnenhof · Starnberg' },
          ],
        },
        styleOverrides: lightSection,
      },
      {
        id: uuid(),
        type: 'additionalLocations',
        data: {
          badge: 'Ansprechpartner',
          headline: 'Wer hilft wobei?',
          locations: [
            { name: 'Mara & Elias', email: 'hochzeit@mara-elias.de', openingHours: 'RSVP, allgemeine Fragen, persönliche Nachrichten' },
            { name: 'Lena', phone: '+49 151 98765430', openingHours: 'Sitzplan, Kinder, Essen, Allergien' },
            { name: 'Jonas', phone: '+49 151 23456780', openingHours: 'Anreise, Shuttle, Technik und späte Fragen' },
          ],
        },
        styleOverrides: sageSection,
      },
      faqSection(),
      { id: uuid(), ...cta('Noch nicht zurückgemeldet?', 'Dann ist die RSVP der wichtigste nächste Schritt.') },
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    seo: {
      metaTitle: 'Impressum | Mara & Elias',
      metaDescription: 'Impressum der privaten Hochzeitswebsite von Mara & Elias.',
    },
    sections: [
      {
        id: uuid(),
        type: 'legalContent',
        data: {
          headline: 'Impressum',
          blocks: [
            { headline: 'Angaben gemäß § 5 TMG', text: '<p>Mara Weber und Elias König<br>Private Hochzeitswebsite<br>Sonnenstraße 12<br>80331 München</p>' },
            { headline: 'Kontakt', text: '<p>E-Mail: hochzeit@mara-elias.de<br>Telefon: +49 151 23456780</p>' },
            { headline: 'Verantwortlich für den Inhalt', text: '<p>Mara Weber und Elias König. Diese Website dient ausschließlich der privaten Information eingeladener Gäste.</p>' },
            { headline: 'Haftung für Inhalte', text: '<p>Wir erstellen die Inhalte dieser privaten Website sorgfältig. Für die Vollständigkeit und Aktualität übernehmen wir dennoch keine Gewähr.</p>' },
          ],
        },
      },
      { id: uuid(), ...cta('Zurück zur Startseite', 'Alle wichtigen Gästeinfos findet Ihr auf der Startseite.',) },
    ],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    seo: {
      metaTitle: 'Datenschutz | Mara & Elias',
      metaDescription: 'Datenschutzhinweise der privaten Hochzeitswebsite von Mara & Elias.',
    },
    sections: [
      {
        id: uuid(),
        type: 'legalContent',
        data: {
          headline: 'Datenschutz',
          blocks: [
            { headline: 'Zweck dieser Website', text: '<p>Diese Website informiert eingeladene Gäste über unsere Hochzeit. Personenbezogene Daten werden nur verarbeitet, wenn Ihr sie uns freiwillig mitteilt, etwa über RSVP oder Kontaktformular.</p>' },
            { headline: 'RSVP-Daten', text: '<p>Wir nutzen Namen, Zu- oder Absage, Begleitungen, Essenswünsche und Allergiehinweise ausschließlich zur Planung der Hochzeit, des Menüs und der Sitzordnung.</p>' },
            { headline: 'Kontaktformular', text: '<p>Nachrichten werden genutzt, um Eure Anfrage zu beantworten. Eine Weitergabe erfolgt nur, wenn sie für die Hochzeitsorganisation erforderlich ist, etwa an Location oder Catering bei Essenshinweisen.</p>' },
            { headline: 'Löschung', text: '<p>Nach Abschluss der Hochzeitsorganisation löschen wir nicht mehr benötigte Daten. Erinnerungsfotos und Gästebuchbeiträge werden nur privat genutzt.</p>' },
          ],
        },
      },
      { id: uuid(), ...cta('Fragen zum Datenschutz?', 'Schreibt uns direkt, wenn Ihr wissen möchtet, welche Angaben wir von Euch gespeichert haben.') },
    ],
  },
];

const tenant = {
  slug: 'wedding',
  pat: PAT,
  host: 'www.demo.flamingomedia.online',
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Mara & Elias',
    tagline: 'Hochzeit am Gut Sonnenhof · Starnberg · 12. September 2026',
    primaryColor: C.plum,
    secondaryColor: C.rose,
    accentColor: C.copper,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Inter',
    topBarColor: C.plum,
    footerColor: C.plum,
  },

  contact: {
    phone: '+49 151 23456780',
    email: 'hochzeit@mara-elias.de',
    address: 'Gut Sonnenhof, Sonnenhof 7, 82319 Starnberg',
    city: 'Starnberg',
    country: 'Deutschland',
  },

  design: {
    sectionBg: C.paper,
    sectionBgAlt: C.soft,
    cardBg: '#FFFFFF',
    cardBorder: '#E8D6CA',
    heading: C.ink,
    subheading: C.plum,
    body: C.body,
    muted: C.muted,
    brand: C.plum,
    accent: C.copper,
    icon: C.copper,
    btnBg: C.plum,
    btnText: '#FFFFFF',
    btnSecondaryBg: '#FFFFFF',
    btnSecondaryText: C.plum,
    badgeBg: '#F2DED4',
    badgeText: C.plum,
    badgeBorder: '#E5C3B7',
    dividerColor: '#E8D6CA',
    eyebrow: C.copper,
    statValue: C.plum,
    quote: C.body,
    ratingStar: C.copper,
    check: C.sage,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.92)',
    onDarkMuted: 'rgba(255,255,255,0.76)',
  },

  seoGlobal: {
    titleTemplate: '%s | Mara & Elias',
    defaultTitle: 'Mara & Elias heiraten am Gut Sonnenhof',
    defaultDescription: 'Private Hochzeitswebsite von Mara & Elias mit Ablauf, Location, Anreise, RSVP, Dresscode, Geschenken und Updates für Gäste.',
    defaultOgImage: heroImage,
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Hochzeitstag', href: '/hochzeitstag' },
      { label: 'Location', href: '/location' },
      { label: 'Anreise', href: '/anreise-hotels' },
      { label: 'RSVP', href: '/rsvp' },
      { label: 'Dresscode', href: '/dresscode' },
      { label: 'Geschenke', href: '/geschenke' },
      { label: 'Updates', href: '/news' },
    ],
    ctaLabel: 'Zusage senden',
    ctaHref: '/rsvp',
  },

  footer: {
    columns: [
      { title: 'Gästeinfos', items: [
        { text: 'Hochzeitstag', href: '/hochzeitstag' },
        { text: 'Location', href: '/location' },
        { text: 'Anreise & Hotels', href: '/anreise-hotels' },
      ] },
      { title: 'Organisatorisch', items: [
        { text: 'RSVP', href: '/rsvp' },
        { text: 'Dresscode', href: '/dresscode' },
        { text: 'Geschenke', href: '/geschenke' },
      ] },
      { title: 'Kontakt', items: [
        { text: 'Kontakt', href: '/kontakt' },
        { text: 'Updates', href: '/news' },
        { text: 'Unsere Geschichte', href: '/unsere-geschichte' },
      ] },
    ],
    legalLinks: [
      { text: 'Impressum', href: '/impressum' },
      { text: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Zur RSVP', href: '/rsvp' },
  },

  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
  },

  collections: [
    { key: 'news', label: 'Updates', items: updates },
  ],

  pages,
};

module.exports = tenant;
if (require.main === module) {
  run(tenant).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
