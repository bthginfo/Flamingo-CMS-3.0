/**
 * Demo tenant: HANDWERK
 *
 * Identität: "Brüggemann Bäder & Wärme" — SHK-Meisterbetrieb in Düsseldorf-Bilk,
 *            spezialisiert auf Premium-Bäder und Wärmepumpen. Gegründet 1974,
 *            heute in zweiter Generation von Lena Brüggemann geführt.
 *
 * Run:  PAT_HANDWERK=flm_pat_… node scripts/demo-tenants/run-all.cjs handwerk
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');

const PAT = 'set-via-PAT_HANDWERK-env';

// ── helpers ───────────────────────────────────────────────────────────────────
const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Brand palette — Graphit + warmes Messing (Premium-Bad-Anmutung).
const C = {
  brand:   '#22303A', // tiefes Graphit-Petrol — primary
  accent:  '#C0922E', // warmes Messing — eyebrows, icons, badges
  ink:     '#141A1F', // body on light
  cream:   '#F4F1EA', // warm-heller Section-/Card-Grund
  steel:   '#34505C', // hover/secondary
};

// Dark-Section-Tokens: kompletter hell-auf-dunkel-Satz. Mit dem vereinheitlichten
// Renderer überlebt --token-heading nun im Contract jeder Section.
const darkSectionTokens = {
  '--token-heading':         '#FFFFFF',
  '--token-subheading':      'rgba(255,255,255,0.92)',
  '--token-body':            'rgba(255,255,255,0.92)',
  '--token-muted':           'rgba(255,255,255,0.7)',
  '--token-eyebrow':         '#E2C181',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body':    'rgba(255,255,255,0.92)',
  '--token-on-dark-muted':   'rgba(255,255,255,0.7)',
  '--token-icon':            '#E2C181',
  '--token-accent':          '#E2C181',
  '--token-stat-value':      '#FFFFFF',
  '--token-rating-star':     '#E2C181',
  '--token-quote':           '#E2C181',
  '--token-check':           '#E2C181',
  '--token-link':            '#E2C181',
  '--token-link-hover':      '#FFFFFF',
  '--token-divider':         'rgba(255,255,255,0.16)',
  '--token-card-border':     'rgba(255,255,255,0.16)',
  '--token-card-bg':         'rgba(255,255,255,0.06)',
  '--token-card-heading':    '#FFFFFF',
  '--token-card-body':       'rgba(255,255,255,0.92)',
  '--token-card-muted':      'rgba(255,255,255,0.7)',
  '--token-card-icon':       '#E2C181',
  '--token-card-badge-bg':   'rgba(255,255,255,0.14)',
  '--token-card-badge-text': '#FFFFFF',
  '--token-btn-bg':          C.cream,
  '--token-btn-text':        C.brand,
  '--token-btn-secondary-bg':     'rgba(0,0,0,0)',
  '--token-btn-secondary-text':   '#FFFFFF',
  '--token-btn-secondary-border': 'rgba(255,255,255,0.3)',
  '--token-badge-bg':        'rgba(255,255,255,0.14)',
  '--token-badge-text':      '#FFFFFF',
  '--token-badge-border':    'rgba(255,255,255,0.28)',
};

const OVERLAY = C.brand;

// ── tenant spec ───────────────────────────────────────────────────────────────
const tenant = {
  slug: 'handwerk',
  pat: PAT,
  wipe: true,
  publish: true,

  style: { style: 'classic' },

  brand: {
    companyName: 'Brüggemann Bäder & Wärme',
    tagline: 'Bäder · Wärmepumpen · Heizung — meisterlich aus Düsseldorf',
    primaryColor: C.brand,
    secondaryColor: C.steel,
    accentColor: C.accent,
    logoDisplay: 'name',
    headingFont: 'Fraunces',
    bodyFont: 'Inter',
    topBarColor: C.brand,
    footerColor: '#161F26',
  },

  contact: {
    phone: '+49 211 4790360',
    email: 'service@brueggemann-duesseldorf.de',
    address: 'Aachener Straße 64, 40223 Düsseldorf',
    whatsapp: '+49 170 4790360',
    whatsappEnabled: true,
    whatsappColor: '#25D366',
  },

  design: {
    sectionBg: '#FFFFFF',
    sectionBgAlt: C.cream,
    cardBg: '#FFFFFF',
    cardBorder: '#E7E1D4',
    heading: C.brand,
    subheading: C.steel,
    body: '#2B333A',
    muted: '#697681',
    brand: C.brand,
    accent: C.accent,
    icon: C.accent,
    btnBg: C.brand,
    btnText: '#FFFFFF',
    badgeBg: C.cream,
    badgeText: C.brand,
    badgeBorder: '#E6D6B4',
    dividerColor: '#E7E1D4',
    eyebrow: C.accent,
    statValue: C.brand,
    quote: C.steel,
    ratingStar: '#D9A441',
    check: C.accent,
    onDarkHeading: '#FFFFFF',
    onDarkBody:    'rgba(255,255,255,0.92)',
    onDarkMuted:   'rgba(255,255,255,0.7)',
  },

  socialLinks: {
    google: 'https://g.page/brueggemann-duesseldorf',
    instagram: 'https://www.instagram.com/brueggemann.baeder/',
    houzz: 'https://www.houzz.de/pro/brueggemann-baeder',
  },

  openingHours: {
    hours: [
      { type: 'regular', day: 'Montag',     hours: '07:00 – 17:00' },
      { type: 'regular', day: 'Dienstag',   hours: '07:00 – 17:00' },
      { type: 'regular', day: 'Mittwoch',   hours: '07:00 – 17:00' },
      { type: 'regular', day: 'Donnerstag', hours: '07:00 – 17:00' },
      { type: 'regular', day: 'Freitag',    hours: '07:00 – 15:00' },
      { type: 'regular', day: 'Samstag',    hours: 'Nur Notdienst', note: '24/7 Notdienst unter 0170 4790360' },
      { type: 'regular', day: 'Sonntag',    closed: true, note: '24/7 Notdienst unter 0170 4790360' },
    ],
  },

  formFields: {
    fields: [
      { name: 'firstName', label: 'Vorname',  type: 'text', required: true, halfWidth: true },
      { name: 'lastName',  label: 'Nachname', type: 'text', required: true, halfWidth: true },
      { name: 'email',     label: 'E-Mail',   type: 'email',required: true, halfWidth: true },
      { name: 'phone',     label: 'Telefon',  type: 'tel',  required: false,halfWidth: true },
      { name: 'topic',     label: 'Anliegen', type: 'select', required: true,
        options: ['Neues Bad', 'Wärmepumpe', 'Heizung erneuern', 'Wartung', 'Notdienst', 'Sonstiges'] },
      { name: 'message',   label: 'Ihre Nachricht', type: 'textarea', required: true,
        placeholder: 'Beschreiben Sie kurz Ihr Vorhaben — wir melden uns innerhalb von 24 h.' },
    ],
  },

  seoGlobal: {
    titleTemplate: '%s | Brüggemann Bäder & Wärme Düsseldorf',
    defaultTitle: 'Brüggemann — Bäder & Wärmepumpen Meisterbetrieb Düsseldorf',
    defaultDescription:
      'SHK-Meisterbetrieb in Düsseldorf seit 1974. Premium-Bäder, Wärmepumpen, Heizung und 24/7-Notdienst — geplant, gebaut und gewartet aus einer Hand.',
    defaultOgImage: img('1552321554-5fefe8c9ef14', 1200),
    locale: 'de_DE',
  },

  navigation: {
    items: [
      { label: 'Startseite', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Referenzen', href: '/referenzen' },
      { label: 'Über uns',   href: '/ueber-uns' },
      { label: 'Magazin',    href: '/news' },
      { label: 'Kontakt',    href: '/kontakt' },
    ],
    cta: { label: '24/7 Notdienst', href: '/kontakt' },
  },

  footer: {
    columns: [
      { title: 'Leistungen', items: [
        { text: 'Premium-Bäder',     href: '/c/leistungen/premium-baeder' },
        { text: 'Wärmepumpen',       href: '/c/leistungen/waermepumpe' },
        { text: 'Heizung & Brennwert', href: '/c/leistungen/heizung' },
        { text: 'Wartung & Service', href: '/c/leistungen/wartung-service' },
      ]},
      { title: 'Unternehmen', items: [
        { text: 'Über uns',   href: '/ueber-uns' },
        { text: 'Referenzen', href: '/referenzen' },
        { text: 'Magazin',    href: '/news' },
        { text: 'Karriere',   href: '/ueber-uns' },
      ]},
      { title: 'Service', items: [
        { text: '24/7 Notdienst',     href: '/kontakt' },
        { text: 'Termin vereinbaren', href: '/kontakt' },
        { text: 'WhatsApp',           href: 'https://wa.me/491704790360' },
      ]},
    ],
    legalLinks: [
      { label: 'Impressum',   href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Termin vereinbaren', href: '/kontakt' },
  },

  collections: [
    {
      key: 'leistungen', label: 'Leistungen',
      items: [
        buildServiceItem({
          slug: 'premium-baeder',
          title: 'Premium-Bäder',
          excerpt: 'Komplettbäder aus einer Hand — vom 3D-Entwurf über die Naturstein-Auswahl bis zur bodengleichen Dusche. Ein Vertrag, ein Termin, ein Ansprechpartner.',
          heroImage: '1552321554-5fefe8c9ef14',
          intro: 'Wir planen Ihr Bad in 3D, beraten Sie in unserer Ausstellung in Bilk und koordinieren Fliesenleger, Elektriker und Trockenbauer selbst. Sie schließen einen Vertrag, bekommen einen verbindlichen Übergabetermin und am Ende eine Rechnung — meist vier bis sieben Wochen nach Baubeginn.',
          highlights: [
            { icon: 'PenTool',       title: '3D-Planung & Ausstellung', text: 'Sie erleben Ihr Bad vor dem ersten Hammerschlag — mit Lichtkonzept, Materialprobe und Wunsch-Armatur in unserer Ausstellung.' },
            { icon: 'Accessibility', title: 'Barrierearm geplant',      text: 'Bodengleiche Duschen, KfW-förderfähige Umbauten und rutschhemmende Beläge nach DIN 51097 — von Anfang an mitgedacht.' },
            { icon: 'Handshake',     title: 'Alles aus einer Hand',     text: 'Sie schließen einen Vertrag, wir koordinieren jedes Gewerk. Keine Termin­abstimmung, kein Schwarzer-Peter-Spiel.' },
          ],
        }),
        buildServiceItem({
          slug: 'waermepumpe',
          title: 'Wärmepumpen-Installation',
          excerpt: 'Luft-Wasser- und Sole-Wärmepumpen, geplant nach hydraulischem Abgleich und installiert von Monteur:innen mit Kältekreis-Schein. JAZ über 4,0 im Schnitt.',
          heroImage: '1604328698692-f76ea9498e76',
          intro: 'Eine Wärmepumpe ist nur so gut wie ihre Planung. Wir messen jeden Raum, rechnen die Heizlast einzeln durch und dimensionieren danach — nicht nach Daumenregel. Den BEG-Förderantrag übernehmen wir komplett. Bei unseren Projekten liegt die Jahresarbeitszahl im Schnitt über 4,0.',
          highlights: [
            { icon: 'Gauge',     title: 'Hydraulischer Abgleich', text: 'Raumweise gerechnet, nicht überschlagen — die Grundlage für niedrige Vorlauftemperaturen und echte Effizienz.' },
            { icon: 'Snowflake', title: 'Kältekreis-Schein',      text: 'Den sensibelsten Teil der Anlage macht kein Subunternehmer — sondern unsere eigenen zertifizierten Monteur:innen.' },
            { icon: 'BadgeEuro', title: 'BEG-Förderung inklusive', text: 'Bis zu 70 % Zuschuss. Wir prüfen Ihre Konstellation kostenfrei vorab und stellen den Antrag.' },
          ],
        }),
        buildServiceItem({
          slug: 'heizung',
          title: 'Heizung & Brennwert',
          excerpt: 'Vom Brennwertkessel bis zur Hybridanlage — fördergeprüft, sauber installiert und auf einen späteren Wärmepumpen­betrieb vorbereitet.',
          heroImage: '1621905251189-08b45d6a269e',
          intro: 'Nicht jedes Haus ist heute schon wärmepumpen­bereit. Wir prüfen ehrlich, ob eine Hybridlösung oder ein Brennwertkessel der sinnvollere Schritt ist — und legen die Anlage so aus, dass der Umstieg auf die Wärmepumpe später ohne Komplettumbau gelingt.',
          highlights: [
            { icon: 'Flame',     title: 'Brennwert & Hybrid',   text: 'Marken wie Viessmann, Vaillant und Buderus — installiert vom eigenen Meisterbetrieb, nicht durchgereicht.' },
            { icon: 'Leaf',      title: 'Wärmepumpen-ready',     text: 'Wir prüfen Heizkörperauslegung und Hydraulik so, dass Ihre Anlage für den späteren WP-Betrieb vorbereitet ist.' },
            { icon: 'FileCheck', title: 'Förderung erledigt',    text: 'BAFA-Antrag und Kommunikation mit dem Energieberater übernehmen wir aus dem Büro.' },
          ],
        }),
        buildServiceItem({
          slug: 'wartung-service',
          title: 'Wartung & Service',
          excerpt: 'Jahreswartung mit festem Termin im Frühjahr — damit Ihre Anlage im Winter läuft und Sie im Notfall nicht in der Warteschlange stehen.',
          heroImage: '1567789884554-0b844b597180',
          intro: 'Die meisten Heizungs-Ausfälle im Januar wären bei einer Frühjahrs-Wartung aufgefallen. Mit unserem Wartungsvertrag bekommen Sie einen festen Wunschtermin, eine schriftliche Anlagendokumentation und garantierten Vorrang im Notdienst.',
          highlights: [
            { icon: 'CalendarClock', title: 'Fester Wunschtermin', text: 'Sie wählen den Monat — wir terminieren ein Jahr im Voraus, ganz ohne Erinnern.' },
            { icon: 'ShieldCheck',   title: 'Notdienst-Vorrang',   text: 'Wartungskund:innen kommen im Notfall zuerst dran. Ohne Ausnahme.' },
            { icon: 'ClipboardList', title: 'Anlagen-Protokoll',   text: 'Schriftliche Dokumentation jeder Wartung — wichtig für Versicherung und späteren Eigentümerwechsel.' },
          ],
        }),
      ],
    },
    {
      key: 'referenzen', label: 'Referenzen',
      items: [
        buildProjectItem({
          slug: 'altbau-spa-bad-oberkassel',
          title: 'Spa-Bad im Altbau, Düsseldorf-Oberkassel',
          excerpt: 'Aus zwei kleinen Bädern wurde ein 18 m² Spa mit freistehender Wanne, Regendusche und Naturstein — bei laufendem Wohnbetrieb.',
          heroImage: '1620626011761-996317b8d101',
          summary: 'In einer Gründerzeitwohnung am Rheinufer haben wir zwei verwinkelte Bäder zu einem großzügigen Spa-Bad zusammengelegt. Freistehende Wanne, bodengleiche Regendusche, Travertin an Wand und Boden, eine Fußbodenheizung im Estrich und eine wandhängende Vorwand mit indirekter Beleuchtung. Die Familie konnte während der gesamten fünf Wochen Bauzeit in der Wohnung bleiben — das zweite Gäste-WC haben wir bewusst zuerst fertiggestellt.',
          facts: [
            { label: 'Bauzeit',   value: '5 Wochen' },
            { label: 'Fläche',    value: '18 m²' },
            { label: 'Gewerke',   value: '6 koordiniert' },
            { label: 'Material',  value: 'Travertin' },
          ],
        }),
        buildProjectItem({
          slug: 'mehrfamilienhaus-waermepumpe-flingern',
          title: 'Wärmepumpen-Kaskade, Mehrfamilienhaus Flingern',
          excerpt: 'Umstieg von zwei Gasthermen auf eine Luft-Wärmepumpen-Kaskade mit Pufferspeicher — für acht Wohneinheiten, ohne Heizkörpertausch.',
          heroImage: '1591955506264-3f5a6834570a',
          summary: 'Ein Mehrfamilienhaus in Flingern sollte raus aus dem Gas. Wir haben die bestehenden Heizkörper raumweise nachgerechnet, an drei Stellen größere Flächen ergänzt und so die nötige Vorlauftemperatur auf 50 °C gedrückt. Zwei kaskadierte Luft-Wärmepumpen mit 32 kW Gesamtleistung und ein 800-Liter-Pufferspeicher versorgen jetzt alle acht Wohnungen. Die gemessene Jahresarbeitszahl liegt nach dem ersten Winter bei 3,9.',
          facts: [
            { label: 'Wohneinheiten', value: '8' },
            { label: 'Leistung',      value: '32 kW Kaskade' },
            { label: 'Jahresarbeitszahl', value: 'gemessen 3,9' },
            { label: 'Förderung',     value: '55 % BEG' },
          ],
        }),
        buildProjectItem({
          slug: 'zahnarztpraxis-bilk',
          title: 'Zahnarztpraxis, Düsseldorf-Bilk',
          excerpt: 'Komplette Sanitär- und Lüftungstechnik für eine Praxis-Neueröffnung — inklusive Trinkwasser-Hygienekonzept und Nacht-Installation.',
          heroImage: '1629909613654-28e377c37b09',
          summary: 'Eine Zahnarztpraxis in Bilk zog in neue Räume und brauchte vom Behandlungsstuhl-Anschluss bis zur Lüftung alles neu. Wir haben Frisch- und Abwasser nach DIN 1988 verlegt, ein Trinkwasser-Hygienekonzept mit Zirkulation und Spülstation erstellt und eine Lüftungsanlage mit Wärmerückgewinnung installiert. Die geräuschintensiven Arbeiten liefen über zwei Nächte, damit der Praxisbetrieb im selben Gebäude nicht stoppen musste.',
          facts: [
            { label: 'Bauzeit',  value: '6 Wochen' },
            { label: 'Behandlungsplätze', value: '5' },
            { label: 'Hygiene',  value: 'DIN 1988' },
            { label: 'Lüftung',  value: 'mit WRG' },
          ],
        }),
      ],
    },
    {
      key: 'news', label: 'Magazin',
      items: [
        buildNewsItem({
          slug: 'foerderung-2025-baeder-waermepumpe',
          title: 'Förderung 2025: Wärmepumpe und barrierefreies Bad clever kombinieren',
          excerpt: 'BEG-Zuschuss für die Wärmepumpe, KfW-Zuschuss fürs altersgerechte Bad — wer beides zusammen plant, holt deutlich mehr heraus.',
          heroImage: '1581244277943-fe4a9c777189',
          body: '<p>2025 lohnt sich der Blick auf zwei Fördertöpfe gleichzeitig: Die BEG-Förderung bezuschusst den Heizungstausch mit bis zu 70 %, der KfW-Zuschuss „Altersgerecht Umbauen" greift bei bodengleichen Duschen und Haltegriffen. Wer eine Sanierung ohnehin plant, sollte beides in einem Aufwasch denken — der Gerüstaufbau, die Anfahrt und die Staubschutzwände fallen schließlich nur einmal an.</p><p>Wir zeigen an zwei realen Beispielen aus Oberkassel und Flingern, wie sich die Anträge sinnvoll staffeln lassen und welche Unterlagen Sie vor dem ersten Termin bereithalten sollten. Den Antrag selbst übernehmen wir — Sie bekommen den Bescheid direkt von der Behörde.</p>',
        }),
        buildNewsItem({
          slug: 'kleines-bad-grosse-wirkung',
          title: 'Kleines Bad, große Wirkung: 5 Kniffe aus der Werkstatt',
          excerpt: 'Wie aus 4 m² ein Bad wird, das größer wirkt, als es ist — ganz ohne Wand einreißen.',
          heroImage: '1507652313519-d4e9174996dd',
          body: '<p>Nicht jedes Bad lässt sich vergrößern — aber fast jedes lässt sich besser planen. Die häufigste Fehleinschätzung: Große Fliesen wirken in kleinen Räumen unruhig. Tatsächlich beruhigt ein durchgehendes Format Boden und Wand und lässt den Raum größer erscheinen. Eine bodengleiche Dusche ohne sichtbare Duschtasse tut den Rest.</p><p>Wir teilen fünf Kniffe, die wir in unserer Ausstellung am liebsten direkt am Modell zeigen: durchgehende Bodenfliese, wandhängendes WC, Spiegelschrank mit indirektem Licht, schmale Vorwand statt klobiger Unterschrank — und eine Nische statt Ablage­körbchen.</p>',
        }),
        buildNewsItem({
          slug: 'wir-bilden-aus-2025',
          title: 'Wir bilden aus: zwei Plätze für Anlagenmechaniker:innen SHK',
          excerpt: 'Zwei Ausbildungsplätze für 2025, ein eigenes Schulungsbad und ein Team, das erklärt statt durchreicht. Warum sich das lohnt.',
          heroImage: '1581092580497-e0d23cbdf1dc',
          body: '<p>Seit 1974 bilden wir aus — und viele unserer Meister:innen haben hier gelernt. 2025 haben wir zwei Plätze für die Ausbildung zur Anlagenmechanikerin bzw. zum Anlagenmechaniker SHK. Was wir bieten: ein eigenes Schulungsbad, jeden Monat einen Übungstag mit den Meister:innen, geregelte Arbeitszeiten und vom ersten Tag an die ehrliche Ansage, was an diesem Beruf anstrengend ist — und was richtig schön.</p><p>Bewerbungen gerne formlos per E-Mail oder WhatsApp. Ein Praktikumstag zum Reinschnuppern ist jederzeit möglich.</p>',
        }),
      ],
    },
  ],

  pages: [
    // ── Startseite ────────────────────────────────────────────────────────────
    {
      slug: 'startseite', title: 'Startseite',
      seo: {
        metaTitle: 'Brüggemann Bäder & Wärme — Meisterbetrieb Düsseldorf seit 1974',
        metaDescription: 'Premium-Bäder, Wärmepumpen, Heizung und 24/7-Notdienst aus Düsseldorf-Bilk. Zweite Generation Meisterbetrieb, ein Ansprechpartner, festes Wort.',
      },
      sections: [
        {
          type: 'hero',
          data: {
            badgeText: 'Meisterbetrieb seit 1974',
            badgeIcon: 'Award',
            headline: 'Bäder und Wärme, die ein Leben lang halten.',
            subline: 'Wir planen, bauen und warten Premium-Bäder, Wärmepumpen und Heizungen für Düsseldorf und Umgebung. Ein Ansprechpartner, ein Festpreis, ein festes Wort.',
            bgImage: img('1620626011761-996317b8d101'),
            bgMode: 'image',
            overlayColor: OVERLAY,
            overlayOpacity: 0.6,
            imageEffect: 'kenBurns',
            primaryCta:   { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
            secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen', icon: 'ArrowRight' },
            trustItems: [
              'Meisterbetrieb der HwK Düsseldorf',
              '24/7 Notdienst im Stadtgebiet',
              '4,9 / 5 bei Google (286 Bewertungen)',
            ],
            trustStripColor: 'rgba(18,26,32,0.55)',
          },
        },
        {
          type: 'socialProofBar',
          data: {
            bgStyle: 'light',
            items: [
              { icon: 'Star',        value: '4,9 / 5',  label: '286 Bewertungen bei Google' },
              { icon: 'Award',       value: 'Meister',  label: 'Eingetragen bei der HwK Düsseldorf' },
              { icon: 'ShieldCheck', value: '50 Jahre', label: 'Familienbetrieb seit 1974' },
              { icon: 'Clock',       value: '< 60 Min', label: 'Notdienst-Reaktionszeit Düsseldorf' },
              { icon: 'BadgeCheck',  value: '3.100+',   label: 'Anlagen unter Wartungsvertrag' },
            ],
          },
        },
        {
          type: 'uspStrip',
          data: {
            items: [
              { icon: 'Bath',      title: 'Bad aus einer Hand', text: '3D-Planung, eigene Ausstellung, ein Vertrag.' },
              { icon: 'Clock',     title: '24/7 Notdienst',     text: 'In Düsseldorf in der Regel < 60 Min vor Ort.' },
              { icon: 'BadgeEuro', title: 'Festpreisgarantie',  text: 'Kein Aufschlag nach Auftrag.' },
              { icon: 'Recycle',   title: 'Förderprofi',        text: 'BEG, BAFA & KfW — wir machen den Antrag.' },
            ],
          },
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Leistungen',
            headline: 'Vier Disziplinen, eine Handschrift',
            subline: 'Wir bündeln Planung, Ausführung und Wartung in einer Hand — keine Subunternehmer für sensible Gewerke, keine Schnittstellenverluste.',
            ctaLabel: 'Alle Leistungen ansehen', ctaHref: '/leistungen',
            manualCards: [
              { icon: 'Bath',     title: 'Premium-Bäder',     text: '3D-Planung, Ausstellung, Festpreis, Festtermin.',          href: '/c/leistungen/premium-baeder',  mediaType: 'icon' },
              { icon: 'Leaf',     title: 'Wärmepumpen',       text: 'Sole und Luft, Kältekreis-Schein, JAZ > 4,0.',            href: '/c/leistungen/waermepumpe',     mediaType: 'icon' },
              { icon: 'Flame',    title: 'Heizung & Brennwert', text: 'Brennwert, Hybrid — fördergeprüft, WP-ready.',           href: '/c/leistungen/heizung',         mediaType: 'icon' },
              { icon: 'Settings', title: 'Wartung & Service', text: 'Jahreswartung mit Notdienst-Vorrang.',                    href: '/c/leistungen/wartung-service', mediaType: 'icon' },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'Eine eigene Bad-Ausstellung — damit Sie nicht im Katalog raten müssen',
            subline: 'In unserer Ausstellung in Düsseldorf-Bilk erleben Sie Armaturen, Fliesen und Lichtkonzepte in echt. Sie fassen an, vergleichen und entscheiden — bevor irgendetwas bestellt wird.',
            image: img('1556228453-efd6c1ff04f6'),
            features: [
              { icon: 'PenTool',       title: '3D-Planung vor Auftrag',  text: 'Sie sehen Ihr Bad mit Lichtkonzept und Materialprobe — bevor der erste Fliesenkleber angerührt wird.' },
              { icon: 'Palette',       title: 'Material zum Anfassen',   text: 'Naturstein, Feinsteinzeug, Armaturen und Beleuchtung — in der Ausstellung in echt, nicht als Foto.' },
              { icon: 'ShieldCheck',   title: 'Druck- & Dichtheitsprüfung', text: 'Jede Leitung läuft 24 Stunden auf Druck, bevor verputzt wird. Kein Werkstück ohne Prüfprotokoll.' },
              { icon: 'GraduationCap', title: 'Eigene Lehrwerkstatt',    text: 'Wir bilden seit 1974 aus. Unsere Monteur:innen sind hier gelernt — nicht angelernt.' },
            ],
            ctaPrimary: { label: 'Ausstellung besuchen', href: '/kontakt' },
          },
          styleOverrides: { '--token-section-bg-alt': C.cream },
        },
        {
          type: 'processSteps',
          data: {
            badgeText: 'So arbeiten wir',
            headline: 'Vier Schritte vom ersten Anruf bis zum fertigen Bad',
            steps: [
              { icon: 'Phone',          title: 'Anruf & Aufmaß',    text: 'Wir kommen kostenfrei vorbei, messen, hören zu und prüfen die Förderfähigkeit.' },
              { icon: 'PenTool',        title: 'Entwurf & Festpreis', text: 'Sie erhalten einen 3D-Entwurf und ein verbindliches Festpreis-Angebot mit Termin.' },
              { icon: 'Wrench',         title: 'Ausführung',        text: 'Eigene Monteur:innen, koordinierte Gewerke, täglich sauberer Bauplatz.' },
              { icon: 'ClipboardCheck', title: 'Übergabe & Wartung', text: 'Schriftliches Protokoll, Einweisung und optional Wartungsvertrag.' },
            ],
          },
        },
        {
          type: 'bentoGrid',
          data: {
            headline: 'Woran man einen guten Meisterbetrieb erkennt',
            subline: 'Fünf Dinge, an denen Sie Qualität erkennen — lange bevor die Anlage läuft oder die erste Fliese klebt.',
            items: [
              { icon: 'FileSignature', title: 'Festpreis, schwarz auf weiß', text: 'Keine Überraschungen nach Auftrag. Was im Angebot steht, gilt — inklusive Übergabetermin.', span: '2' },
              { icon: 'Microscope',    title: 'Vorab-Bestandsaufnahme',    text: 'Wir messen Heizlast, Hydraulik und Untergrund — bevor Bauteile bestellt werden.' },
              { icon: 'Wallet',        title: 'Förderung mitgedacht',      text: 'BEG-Antrag, KfW-Brief, Energieberater-Kontakt — erledigt aus dem Büro.' },
              { icon: 'BookOpenCheck', title: 'Anlagen-Tagebuch',          text: 'Jede Wartung dokumentiert. Sie erhalten ein PDF-Protokoll für Versicherung und Notar.' },
              { icon: 'PhoneCall',     title: 'Direkt mit dem Meister',    text: 'Im Notfall kein Callcenter — Sie sprechen mit einer unserer fünf Meister:innen.', span: '2' },
            ],
          },
        },
        {
          type: 'stats',
          data: {
            headline: 'Zwei Generationen in Zahlen',
            stats: [
              { icon: 'Calendar', value: '50',   suffix: ' Jahre', label: 'Meisterbetrieb' },
              { icon: 'Users',    value: '16',                     label: 'Monteur:innen & Meister' },
              { icon: 'Bath',     value: '900',  suffix: '+',      label: 'Bäder gebaut' },
              { icon: 'Star',     value: '4,9',                    label: '★ bei Google' },
            ],
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Zwei Generationen',
            headline: 'Fünf Jahrzehnte Düsseldorfer Handwerk',
            subline: 'Was 1974 als Ein-Mann-Installateurbetrieb in Bilk begann, ist heute ein 16-köpfiger Meisterbetrieb — mit derselben Handschrift.',
            entries: [
              { year: '1974', title: 'Gründung in Düsseldorf-Bilk', text: 'Heinz Brüggemann, Installateurmeister, eröffnet einen Ein-Mann-Betrieb in einer Hofwerkstatt an der Aachener Straße.' },
              { year: '1989', title: 'Erste eigene Bad-Ausstellung', text: 'Aus dem reinen Installationsbetrieb wird ein Bad-Spezialist. Die erste kleine Ausstellung zeigt sechs Komplettbäder.' },
              { year: '2003', title: 'Lena Brüggemann steigt ein',   text: 'Tochter Lena beginnt nach Meisterschule und Innenarchitektur-Studium im Betrieb — und prägt die Planungs-Handschrift bis heute.' },
              { year: '2014', title: 'Wärmepumpen-Kompetenz',        text: 'Eigene Kältekreis-Zertifizierung. Seitdem über 220 Wärmepumpen im Bestand installiert.' },
              { year: '2019', title: 'Zweite Generation übernimmt',  text: 'Lena Brüggemann übernimmt die Geschäftsführung. Heinz bleibt als Senior-Berater in jedem Bad-Erstgespräch dabei.' },
              { year: '2024', title: '50 Jahre, 16 Menschen, ein Wort', text: 'Fünf Meister:innen, sieben Gesell:innen, zwei Auszubildende, eine Bad-Ausstellung — und ein Werkstatthund namens Nelli.' },
            ],
          },
        },
        {
          type: 'statsCounter',
          data: {
            headline: 'Was wir messen',
            subline: 'Kennzahlen, die wir verfolgen — weil sie etwas über Qualität aussagen.',
            stats: [
              { value: 96,    suffix: ' %',   label: 'Termintreue in 2024' },
              { value: 4.1,                  label: 'JAZ unserer Wärmepumpen' },
              { value: 60,    suffix: ' Min', label: 'Notdienst-Reaktionszeit' },
              { value: 220,   suffix: '+',    label: 'Wärmepumpen installiert' },
            ],
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Kundenstimmen',
            headline: 'Was Auftraggeber:innen über uns sagen',
            items: [
              { name: 'Familie Vahsen',   context: 'Spa-Bad, Oberkassel',      quote: 'Aus zwei winzigen Bädern wurde ein Traum. Festpreis auf den Cent eingehalten, und wir konnten die ganze Zeit in der Wohnung bleiben.', rating: 5 },
              { name: 'Dr. Petra Sahin',  context: 'Zahnarztpraxis, Bilk',      quote: 'Die geräuschintensiven Arbeiten liefen nachts, damit unser Praxisbetrieb nicht stoppt. So eine Rücksicht erlebt man selten.', rating: 5 },
              { name: 'WEG Flingern-Nord', context: '8 Wohneinheiten',          quote: 'Raus aus dem Gas ohne Heizkörpertausch — viele hielten das für unmöglich. Brüggemann hat es durchgerechnet und gebaut. JAZ 3,9.', rating: 5 },
            ],
          },
        },
        {
          type: 'faq',
          data: {
            badgeText: 'Häufige Fragen',
            headline: 'Was uns Kund:innen vor dem ersten Termin fragen',
            items: [
              { question: 'Wie schnell sind Sie im Notfall vor Ort?', answer: 'In Düsseldorf und Umgebung in der Regel innerhalb von 60 Minuten — rund um die Uhr, 365 Tage im Jahr. Wartungskund:innen erhalten Vorrang.' },
              { question: 'Kann ich Ihre Bäder vorher ansehen?',       answer: 'Ja. In unserer Ausstellung in Bilk zeigen wir komplette Bäder, Armaturen und Materialien in echt. Termine gerne auch abends nach Vereinbarung.' },
              { question: 'Übernehmen Sie die Förderanträge?',         answer: 'Vollständig. Wir prüfen Ihre Förderfähigkeit kostenfrei vorab und stellen BEG-, BAFA- oder KfW-Antrag. Den Bescheid erhalten Sie direkt von der Behörde.' },
              { question: 'Bekomme ich einen Festpreis?',              answer: 'Für jede planbare Maßnahme ja. Bei Bad und Heizungstausch erhalten Sie einen schriftlichen Festpreis — verbindlich, mit Übergabetermin.' },
              { question: 'Wie lange dauert ein Komplettbad?',         answer: 'Im Schnitt vier bis sieben Wochen ab Baubeginn. Den verbindlichen Übergabetermin nennen wir Ihnen mit dem Angebot.' },
              { question: 'Wann lohnt sich eine Wärmepumpe wirklich?', answer: 'Wenn Ihre Heizkörper für Vorlauftemperaturen unter 55 °C ausgelegt sind oder werden können — und die Dämmung mindestens Effizienzklasse D erreicht. Wir prüfen das in zwei Stunden vor Ort und sagen ehrlich, ob Hybrid oder Wärmepumpe sinnvoller ist.' },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            badgeText: 'Termin gesucht?',
            headline: 'Sprechen wir über Ihr Projekt.',
            subline: 'Aufmaß und Erstberatung sind kostenfrei. Im Notfall sind wir 24/7 erreichbar — auch über WhatsApp.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Leistungen-Übersicht ─────────────────────────────────────────────────
    {
      slug: 'leistungen', title: 'Leistungen',
      seo: {
        metaTitle: 'Leistungen — Bäder, Wärmepumpen, Heizung in Düsseldorf',
        metaDescription: 'Unser Leistungsspektrum als SHK-Meisterbetrieb in Düsseldorf: Premium-Bäder, Wärmepumpen, Heizung & Brennwert, Wartung und 24/7-Notdienst.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Vier Disziplinen, ein Meisterbetrieb',
            subline: 'Wir behalten gerne den ganzen Bauablauf in der Hand — von Aufmaß und Förderantrag über die Ausstellung bis zur jährlichen Wartung.',
            bgImage: img('1616594039964-ae9021a400a0'),
            overlayColor: OVERLAY, overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'servicesGrid',
          data: {
            badgeText: 'Unser Portfolio',
            headline: 'Alle Leistungen im Überblick',
            manualCards: [
              { icon: 'Bath',     title: 'Premium-Bäder',       text: 'Komplettbad mit 3D-Plan, Ausstellung und festem Übergabetermin.', href: '/c/leistungen/premium-baeder',  mediaType: 'icon' },
              { icon: 'Leaf',     title: 'Wärmepumpen',         text: 'Sole und Luft — installiert mit Kältekreis-Schein.',              href: '/c/leistungen/waermepumpe',     mediaType: 'icon' },
              { icon: 'Flame',    title: 'Heizung & Brennwert', text: 'Brennwert und Hybrid — fördergeprüft und WP-ready.',               href: '/c/leistungen/heizung',         mediaType: 'icon' },
              { icon: 'Settings', title: 'Wartung & Service',   text: 'Jahreswartung, Notdienst-Vorrang, Protokoll.',                    href: '/c/leistungen/wartung-service', mediaType: 'icon' },
            ],
          },
        },
        {
          type: 'comparisonTable',
          data: {
            badge: 'Wartungspakete',
            headline: 'Welches Wartungspaket passt zu Ihrer Anlage?',
            text: 'Alle Pakete enthalten festen Wartungstermin im Wunschmonat, Vorrang im Notdienst und schriftliches Anlagenprotokoll. Preise pro Jahr inkl. MwSt.',
            columns: [
              { label: 'Leistung' },
              { label: 'Basis — 199 €' },
              { label: 'Komfort — 299 €' },
              { label: 'Komplett — 469 €' },
            ],
            highlightCol: 2,
            rows: [
              { feature: 'Jahreswartung Heizung/Wärmepumpe', values: ['✓', '✓', '✓'] },
              { feature: 'Schriftliches Anlagenprotokoll',   values: ['✓', '✓', '✓'] },
              { feature: 'Notdienst-Vorrang',                values: ['—', '✓', '✓'] },
              { feature: 'Trinkwasser-Hygieneprüfung',       values: ['—', '✓', '✓'] },
              { feature: 'Anfahrt Stadtgebiet Düsseldorf',   values: ['Aufpreis', 'inkl.', 'inkl.'] },
              { feature: 'Material bei Notdienst',           values: ['nach Aufwand', 'nach Aufwand', '20 % Rabatt'] },
              { feature: 'Effizienz-Check Wärmepumpe',       values: ['—', '—', '✓'] },
              { feature: 'Förder-Check alle 2 Jahre',        values: ['—', '—', '✓'] },
            ],
          },
        },
        {
          type: 'featureShowcase',
          data: {
            headline: 'Warum Ihr Komplettbad bei uns reibungslos läuft',
            subline: 'Ein Vertrag, ein Ansprechpartner, ein Termin — weil wir jedes Gewerk selbst koordinieren, statt zu hoffen, dass der Subunternehmer pünktlich kommt.',
            image: img('1507652313519-d4e9174996dd'),
            features: [
              { icon: 'PenTool',     title: '3D-Planung vor Auftrag',       text: 'Sie sehen Ihr Bad mit Lichtkonzept und Materialprobe — bevor irgendetwas bestellt wird.' },
              { icon: 'Handshake',   title: 'Alle Gewerke unter einem Dach', text: 'Fliesenleger, Elektriker, Trockenbauer aus festem Partnerkreis. Wir koordinieren — Sie rufen niemanden an.' },
              { icon: 'Calendar',    title: 'Übergabetermin garantiert',    text: 'Vier bis sieben Wochen ab Baubeginn. Verbindlich, mit Vertragsstrafe bei Verzug aus unserem Verschulden.' },
              { icon: 'Accessibility', title: 'KfW-förderfähig',            text: 'Bodengleiche Duschen und Haltegriffe werden über „Altersgerecht Umbauen" bezuschusst — Antrag inklusive.' },
            ],
            ctaPrimary: { label: 'Badtermin anfragen', href: '/kontakt' },
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Kundenstimmen',
            headline: 'Was Auftraggeber:innen zu unseren Leistungen sagen',
            items: [
              { name: 'Familie Conrad',  context: 'Komplettbad, Düsseldorf-Gerresheim', quote: 'Fertig vier Tage vor dem zugesagten Termin, auf den Cent Festpreis. Die Ausstellung hat uns die Entscheidung enorm erleichtert.', rating: 5 },
              { name: 'M. Terhoeven',    context: 'Wärmepumpe, Meerbusch',               quote: 'Sehr saubere Planung mit raumweisem Abgleich. Die Jahresarbeitszahl liegt nach einem Jahr bei 4,2 — genau wie versprochen.',  rating: 5 },
              { name: 'Praxis Dr. Sahin', context: 'Sanitär & Lüftung, Bilk',            quote: 'Hygienekonzept, Lüftung, Nacht-Installation — alles durchdacht. Pünktlich zur Eröffnung fertig.',                          rating: 5 },
            ],
          },
        },
        {
          type: 'priceCalculator',
          data: {
            badge: 'Kostenrechner',
            headline: 'Was kostet Ihr neues Bad?',
            subline: 'Stellen Sie Ihr Projekt zusammen und bekommen Sie sofort eine realistische Preisspanne — das verbindliche Festpreis-Angebot folgt nach dem kostenlosen Aufmaß.',
            currency: '€',
            basePrice: 12900,
            baseLabel: 'Komplettbad bis 6 m² (Demontage, Rohinstallation, Standard-Ausstattung)',
            priceNote: 'Unverbindliche Schätzung auf Basis unserer Projekte 2024/25. Festpreis nach kostenlosem Aufmaß vor Ort.',
            options: [
              { label: 'Badgröße', description: 'Grundfläche Ihres Bades', type: 'select', choices: [{ label: 'bis 6 m²', price: 0 }, { label: '6–10 m²', price: 4900 }, { label: 'über 10 m²', price: 9800 }] },
              { label: 'Bodengleiche Dusche', description: 'Inklusive Abdichtung und Entwässerungsrinne.', type: 'toggle', price: 2400 },
              { label: 'Fußbodenheizung', description: 'Elektrisch, inkl. Regler — spürbar komfortabler.', type: 'toggle', price: 1600 },
              { label: 'Premium-Ausstattung', description: 'Markenkeramik, Unterputz-Armaturen, Glasabtrennung.', type: 'toggle', price: 3900 },
            ],
            cta: { label: 'Kostenloses Aufmaß anfragen', href: '/kontakt' },
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Sie wissen noch nicht, welche Leistung passt?',
            subline: 'Rufen Sie an oder schreiben Sie auf WhatsApp — wir hören zu und sagen Ihnen ehrlich, was sinnvoll ist.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'PhoneCall' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Über uns ─────────────────────────────────────────────────────────────
    {
      slug: 'ueber-uns', title: 'Über uns',
      seo: {
        metaTitle: 'Über uns — Familienbetrieb in zweiter Generation',
        metaDescription: 'Brüggemann Bäder & Wärme ist ein familiengeführter SHK-Meisterbetrieb in Düsseldorf. Zwei Generationen, 16 Mitarbeitende, eigene Ausstellung — und ein klares Wort.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Zwei Generationen Handwerk in Düsseldorf',
            subline: 'Was 1974 mit einer Hofwerkstatt in Bilk begann, ist heute ein Meisterbetrieb mit 16 Mitarbeitenden — und derselben Handschrift.',
            bgImage: img('1521791136064-7986c2920216'),
            overlayColor: OVERLAY, overlayOpacity: 0.55,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'textImage',
          data: {
            badge: 'Unsere Geschichte',
            headline: 'Vom Installationsbetrieb zum Bad-Spezialisten',
            text:
              '<p>1974 hat Heinz Brüggemann in einer Hofwerkstatt an der Aachener Straße den ersten Schraubstock festgezogen. In den 80ern wurde aus dem reinen Installationsbetrieb ein Bad-Spezialist — mit eigener Ausstellung. Heute führt Tochter Lena Brüggemann das Unternehmen in zweiter Generation, mit Meisterbrief und Innenarchitektur-Studium im Gepäck und denselben Grundsätzen: gutes Wort, festes Material, sauberer Bauplatz.</p>' +
              '<p>Was uns wichtig ist: dass das Bad in 20 Jahren noch genauso schön ist. Dass unsere Azubis Meister:innen werden. Und dass im Briefkasten keine Mahnung landet, weil wir das Fördergeld rechtzeitig beantragt haben.</p>',
            image: img('1581092580497-e0d23cbdf1dc'),
            imageAlt: 'Werkstatt von Brüggemann in Düsseldorf',
            layout: 'image-right',
            primaryCta: { label: 'Team kennenlernen', href: '/ueber-uns', icon: 'Users' },
          },
        },
        {
          type: 'timeline',
          data: {
            badge: 'Meilensteine',
            headline: 'Fünf Jahrzehnte Düsseldorfer Familienbetrieb',
            subline: 'Ein Strich auf der Zeitleiste pro Jahrzehnt — und ein paar Erinnerungen dazwischen.',
            entries: [
              { year: '1974', title: 'Gründung in Düsseldorf-Bilk',  text: 'Heinz Brüggemann, Installateurmeister, eröffnet einen Ein-Mann-Betrieb in einer Hofwerkstatt.' },
              { year: '1982', title: 'Erste Mitarbeitende',          text: 'Der Betrieb wächst auf fünf Köpfe. Komplettbäder werden zum Schwerpunkt.' },
              { year: '1989', title: 'Eigene Bad-Ausstellung',       text: 'Die erste Ausstellung zeigt sechs komplette Bäder — Kund:innen sollen anfassen, nicht raten.' },
              { year: '2003', title: 'Lena Brüggemann steigt ein',   text: 'Nach Meisterschule und Innenarchitektur-Studium prägt sie die Planungs-Handschrift bis heute.' },
              { year: '2014', title: 'Wärmepumpen-Kompetenz',        text: 'Kältekreis-Zertifizierung. Bis heute über 220 Wärmepumpen im Bestand installiert.' },
              { year: '2019', title: 'Zweite Generation übernimmt',  text: 'Lena übernimmt die Geschäftsführung. Heinz bleibt Senior-Berater für jedes Bad-Erstgespräch.' },
              { year: '2024', title: 'Frischluft im Familienbetrieb', text: 'Zwei Ausbildungsplätze für 2025 ausgeschrieben, eigenes Schulungsbad eingerichtet.' },
            ],
          },
        },
        {
          type: 'stats',
          data: {
            headline: 'Was uns ausmacht — in Zahlen',
            stats: [
              { icon: 'Calendar', value: '1974', label: 'Gründungsjahr' },
              { icon: 'Users',    value: '16',   label: 'Mitarbeitende' },
              { icon: 'Layers',   value: '2',    label: 'Generationen' },
              { icon: 'Award',    value: '5',    label: 'Meister:innen im Team' },
            ],
          },
        },
        {
          type: 'team',
          data: {
            badgeText: 'Team',
            headline: 'Die Menschen hinter dem Meisterbetrieb',
            subline: 'Fünf Meister:innen, sieben Gesell:innen, zwei Auszubildende — und ein Werkstatthund namens Nelli.',
            members: [
              { name: 'Lena Brüggemann',  role: 'Geschäftsführerin / Meisterin SHK',  image: img('1580489944761-15a19d654956', 600), bio: 'Übernahm den Betrieb 2019. Meisterin SHK mit Innenarchitektur-Studium — verantwortet die Bad-Planung.' },
              { name: 'Heinz Brüggemann', role: 'Gründer / Senior-Berater',           image: img('1500648767791-00dcc994a43e', 600), bio: 'Gründete den Betrieb 1974. Heute in jedem Bad-Erstgespräch dabei — die Erfahrung von fünf Jahrzehnten.' },
              { name: 'Marek Possiwan',   role: 'Technischer Leiter / Meister',        image: img('1507003211169-0a1dd7228f2d', 600), bio: 'Verantwortet Wärmepumpen und Großprojekte. Eigene Kältekreis-Zertifizierung.' },
              { name: 'Sophie Reinartz',  role: 'Büroleitung / Förder-Spezialistin',   image: img('1573496359142-b8d87734a5a2', 600), bio: 'Kennt BEG- und KfW-Richtlinien auswendig und wickelt jährlich über 70 Anträge ab.' },
            ],
            valuesHeadline: 'Was uns wichtig ist',
            values: [
              { icon: 'Handshake',     title: 'Wort halten',       text: 'Was im Angebot steht, gilt. Wenn wir uns verkalkulieren, zahlen wir die Differenz — nicht Sie.' },
              { icon: 'GraduationCap', title: 'Ausbilden',         text: 'Eigenes Schulungsbad, bezahlte Berufsschule, Übungstag mit dem Meister jeden Monat.' },
              { icon: 'Recycle',       title: 'Sauberer Bauplatz', text: 'Staubschutz, Schmutzfangmatten und tägliche Endreinigung sind im Festpreis enthalten — keine Position extra.' },
              { icon: 'Heart',         title: 'Lange Beziehungen', text: 'Wir warten Anlagen und Bäder, die wir selbst gebaut haben. Service ist kein Cross-Selling.' },
            ],
          },
        },
        {
          type: 'jobListings',
          data: {
            badge: 'Karriere',
            headline: 'Wir suchen Verstärkung.',
            subline: 'Meisterbetrieb in zweiter Generation, moderne Ausstattung, ehrliche Planung — auch bei den Arbeitszeiten.',
            benefits: ['Übertariflich + Weihnachtsgeld', '4-Tage-Woche möglich', 'Eigenes Servicefahrzeug', 'Weiterbildung zum Meister gefördert'],
            jobs: [
              { title: 'Anlagenmechaniker:in SHK', location: 'Düsseldorf', type: 'Vollzeit', schedule: 'ab sofort', text: 'Bäder, Wärmepumpen und Heizungsanlagen — abwechslungsreiche Projekte statt Fließband-Wartung.', tags: ['Geselle/Meisterin', 'Führerschein B'], href: '/kontakt' },
              { title: 'Auszubildende:r Anlagenmechanik SHK', location: 'Düsseldorf', type: 'Ausbildung', schedule: 'ab August', text: 'Drei Gesellen, ein Meister und echte Baustellen ab Woche eins — Übernahmegarantie bei bestandener Prüfung.', tags: ['Ausbildung', 'Übernahmegarantie'], href: '/kontakt' },
            ],
            contactCta: { label: 'Initiativ bewerben', href: '/kontakt' },
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Lust auf gutes Handwerk mit gutem Wort?',
            subline: 'Wir freuen uns über Anfragen — und über Bewerbungen.',
            ctaPrimary: { label: 'Projekt anfragen', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Referenzen ───────────────────────────────────────────────────────────
    {
      slug: 'referenzen', title: 'Referenzen',
      seo: {
        metaTitle: 'Referenzen — Ausgewählte Projekte aus Düsseldorf',
        metaDescription: 'Vom Spa-Bad im Altbau bis zur Wärmepumpen-Kaskade im Mehrfamilienhaus: ausgewählte Projekte aus Düsseldorf und Umgebung.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Projekte, an denen wir hängen',
            subline: 'Eine kleine Auswahl aus dem letzten Jahr — vom Spa-Bad im Altbau bis zur Wärmepumpen-Kaskade.',
            bgImage: img('1565182999561-18d7dc61c393'),
            overlayColor: OVERLAY, overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'collectionList',
          data: {
            collectionKey: 'referenzen',
            headline: 'Ausgewählte Projekte',
            subline: 'Klicken Sie auf ein Projekt für Details, Eckdaten und Bilder.',
            columns: 3,
          },
        },
        {
          type: 'portfolio',
          data: {
            badgeText: 'Auszug aus fünf Jahrzehnten',
            headline: 'Was wir gerne in Erinnerung behalten',
            subline: 'Drei Projekte, an die wir uns gerne erinnern — weil sie zeigen, was Handwerk leisten kann, wenn alle mitziehen.',
            projects: [
              { title: 'Boutique-Hotel Carlstadt', category: 'Hotel-Sanierung',     image: img('1564501049412-61c2a3083791'), icon: 'Building2',  description: '24 Bäder in 9 Wochen komplett saniert — bei laufendem Hotelbetrieb, Etage für Etage. Naturstein, Regenduschen, leise Spültechnik.', stats: [{label:'Bäder',value:'24'},{label:'Bauzeit',value:'9 Wo.'}] },
              { title: 'Stadtvilla Meerbusch',     category: 'Wärmepumpe & Bad',     image: img('1600585154340-be6161a56a0c'), icon: 'Home',       description: 'Sole-Wärmepumpe mit Erdsonden plus zwei Spa-Bäder in einem Zug — Gerüst und Anfahrt nur einmal, doppelte Förderung genutzt.', stats: [{label:'Erdsonden',value:'4 × 95 m'},{label:'JAZ',value:'4,4'}] },
              { title: 'Wohnanlage Oberbilk',      category: 'Heizungsumstellung',   image: img('1486325212027-8081e485255e'), icon: 'Building',   description: '32 Wohneinheiten von Gas auf Luft-Wärmepumpen-Kaskaden umgestellt — im laufenden Betrieb, ohne dass jemand kalt duschen musste.', stats: [{label:'Einheiten',value:'32'},{label:'CO₂',value:'−68 %'}] },
            ],
            ctaLabel: 'Alle Projekte ansehen', ctaHref: '/referenzen',
          },
        },
        {
          type: 'galleryPro',
          data: {
            badge: 'Einblicke',
            headline: 'Baustellen, die man zeigen kann.',
            subline: 'Nach Gewerk filterbar — jedes Bild öffnet sich in der Großansicht.',
            images: [
              { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=82', alt: 'Bad mit Naturstein', category: 'Bäder', caption: 'Naturstein-Bad, Oberkassel' },
              { src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=82', alt: 'Walk-in-Dusche', category: 'Bäder', caption: 'Walk-in-Dusche mit Rinne' },
              { src: 'https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?auto=format&fit=crop&w=900&q=82', alt: 'Waschtisch', category: 'Bäder', caption: 'Doppelwaschtisch, Eiche' },
              { src: 'https://images.unsplash.com/photo-1613274554329-70f997f5789f?auto=format&fit=crop&w=900&q=82', alt: 'Wärmepumpe außen', category: 'Wärmepumpe', caption: 'Kaskade, Mehrfamilienhaus' },
              { src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=82', alt: 'Heizungsraum', category: 'Heizung', caption: 'Technikraum nach Sanierung' },
              { src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=82', alt: 'Montagearbeit', category: 'Heizung', caption: 'Hydraulischer Abgleich' },
            ],
          },
        },
        {
          type: 'testimonials',
          data: {
            badgeText: 'Auftraggeber:innen',
            headline: 'Was Bauherren über unsere Projekte sagen',
            items: [
              { name: 'Hausverwaltung Rheinblick', context: '180 Wohneinheiten in Düsseldorf', quote: 'Seit 2018 vergeben wir alle SHK-Aufträge an Brüggemann. Termintreue, saubere Dokumentation, eine Rechnung — das spart uns Verwaltung.', rating: 5 },
              { name: 'Boutique-Hotel Carlstadt',  context: '24 Bäder, Altstadt',             quote: 'Etage für Etage, ohne dass ein Gast es gemerkt hätte. Diese Planung war große Klasse.',                                          rating: 5 },
              { name: 'Architekturbüro Lindgens',  context: 'Düsseldorf',                      quote: 'Endlich ein SHK-Partner, der Pläne lesen kann und mitdenkt. Wir spezifizieren grob — Marek Possiwan liefert den Abgleich dazu.',     rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          data: {
            headline: 'Ihr Projekt könnte das nächste sein.',
            subline: 'Sprechen Sie uns an — wir besprechen Ihr Vorhaben unverbindlich.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },

    // ── Magazin (News) ───────────────────────────────────────────────────────
    {
      slug: 'news', title: 'Magazin',
      seo: {
        metaTitle: 'Magazin — Aus Werkstatt und Bad-Ausstellung',
        metaDescription: 'Aktuelle Beiträge aus Werkstatt und Ausstellung: Fördertipps, Bad-Ideen, Wartungs-Checks und Geschichten aus einem Düsseldorfer Familienbetrieb.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Aus Werkstatt und Ausstellung',
            subline: 'Was uns gerade beschäftigt — von Förderänderungen bis zu Bad-Ideen.',
            bgImage: img('1556228720-195a672e8a03'),
            overlayColor: OVERLAY, overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'newsGrid',
          data: {
            collectionKey: 'news',
            headline: 'Alle Beiträge',
            subline: 'Tipps, Ideen und Geschichten aus dem Alltag eines SHK-Meisterbetriebs.',
          },
        },
      ],
    },

    // ── Kontakt ──────────────────────────────────────────────────────────────
    {
      slug: 'kontakt', title: 'Kontakt',
      seo: {
        metaTitle: 'Kontakt — Termin, Notdienst, WhatsApp',
        metaDescription: 'Direkter Draht zum Meisterbetrieb: Telefon, E-Mail, WhatsApp und Kontaktformular. 24/7 Notdienst für Düsseldorf und Umgebung.',
      },
      sections: [
        {
          type: 'collectionHero',
          data: {
            headline: 'Direkt zum Meisterbetrieb',
            subline: 'Werktags zwischen 7 und 17 Uhr persönlich am Telefon. Notfälle 24/7. WhatsApp ganztägig.',
            bgImage: img('1423666639041-f56000c27a9a'),
            overlayColor: OVERLAY, overlayOpacity: 0.6,
          },
          styleOverrides: darkSectionTokens,
        },
        {
          type: 'contact',
          data: {
            headline: 'Schreiben Sie uns',
            introText: 'Beschreiben Sie kurz Ihr Anliegen — wir melden uns innerhalb von 24 h, in der Regel deutlich schneller.',
            formEnabled: true,
            submitLabel: 'Anfrage senden',
            infoCards: [
              { icon: 'Phone',  label: 'Telefon',        value: '+49 211 4790360' },
              { icon: 'Mail',   label: 'E-Mail',         value: 'service@brueggemann-duesseldorf.de' },
              { icon: 'MapPin', label: 'Adresse',        value: 'Aachener Straße 64, 40223 Düsseldorf' },
              { icon: 'Clock',  label: 'Öffnungszeiten', value: 'Mo–Do 7–17 · Fr 7–15 · 24/7 Notdienst' },
            ],
          },
        },
        {
          type: 'map',
          data: {
            headline: 'So finden Sie uns',
            embedUrl: 'https://www.google.com/maps?q=Aachener%20Stra%C3%9Fe%2064%2C%2040223%20D%C3%BCsseldorf&output=embed',
            height: 'm',
          },
        },
      ],
    },

    // ── Impressum ────────────────────────────────────────────────────────────
    {
      slug: 'impressum', title: 'Impressum',
      seo: { metaTitle: 'Impressum', metaDescription: 'Anbieterkennzeichnung gemäß § 5 TMG.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Impressum',
            blocks: [
              { headline: 'Anbieter', text: '<p>Brüggemann Bäder & Wärme GmbH<br>Aachener Straße 64<br>40223 Düsseldorf<br>Deutschland</p>' },
              { headline: 'Vertretungsberechtigte Geschäftsführung', text: '<p>Lena Brüggemann</p>' },
              { headline: 'Kontakt', text: '<p>Telefon: +49 211 4790360<br>E-Mail: service@brueggemann-duesseldorf.de</p>' },
              { headline: 'Registereintrag', text: '<p>Amtsgericht Düsseldorf, HRB 61240<br>Handwerkskammer Düsseldorf, Eintragungsnummer 24817</p>' },
              { headline: 'Umsatzsteuer-Identifikationsnummer', text: '<p>USt-IdNr. gemäß § 27 a UStG: DE 312 488 760</p>' },
              { headline: 'Aufsichtsbehörde', text: '<p>Handwerkskammer Düsseldorf, Georg-Schulhoff-Platz 1, 40221 Düsseldorf</p>' },
              { headline: 'Berufsbezeichnung & berufsrechtliche Regelungen', text: '<p>Installateur- und Heizungsbauermeisterin (verliehen in der Bundesrepublik Deutschland). Es gelten die Regelungen der Handwerksordnung (HwO).</p>' },
              { headline: 'Haftungshinweis', text: '<p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>' },
            ],
          },
        },
      ],
    },

    // ── Datenschutz ──────────────────────────────────────────────────────────
    {
      slug: 'datenschutz', title: 'Datenschutz',
      seo: { metaTitle: 'Datenschutzerklärung', metaDescription: 'Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' },
      sections: [
        {
          type: 'legalContent',
          data: {
            headline: 'Datenschutzerklärung',
            blocks: [
              { headline: '1. Verantwortlicher', text: '<p>Brüggemann Bäder & Wärme GmbH, Aachener Straße 64, 40223 Düsseldorf, vertreten durch die Geschäftsführung Lena Brüggemann.</p>' },
              { headline: '2. Hosting', text: '<p>Diese Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Es gilt das EU-US Data Privacy Framework. Mit Vercel besteht ein Auftragsverarbeitungsvertrag.</p>' },
              { headline: '3. Erhebung allgemeiner Daten', text: '<p>Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, Browsertyp) verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Diese Daten werden nach 14 Tagen gelöscht.</p>' },
              { headline: '4. Cookies', text: '<p>Wir setzen ausschließlich technisch notwendige Cookies ein. Tracking- oder Marketing-Cookies werden nicht verwendet.</p>' },
              { headline: '5. Kontaktformular', text: '<p>Die im Kontaktformular eingegebenen Daten verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO) und löschen sie spätestens 24 Monate nach Abschluss des Vorgangs.</p>' },
              { headline: '6. Rechte der betroffenen Personen', text: '<p>Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Beschwerden richten Sie an die Landesbeauftragte für Datenschutz und Informationsfreiheit NRW.</p>' },
            ],
          },
        },
      ],
    },
  ],
};

// ── builders for collection items ─────────────────────────────────────────────
function buildServiceItem({ slug, title, excerpt, heroImage, intro, highlights }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: OVERLAY, overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'textImage',
          data: {
            headline: 'Was Sie bekommen',
            text: `<p>${intro}</p>`,
            image: img(heroImage),
            imageAlt: title,
            layout: 'image-right',
            primaryCta: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
        },
        {
          id: uuid(), type: 'servicesGrid',
          data: {
            headline: 'Was wir konkret leisten',
            manualCards: highlights.map((h) => ({ ...h, mediaType: 'icon' })),
          },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: `${title} anfragen`,
            subline: 'Wir hören zu, messen auf und nennen Ihnen einen verbindlichen Festpreis.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

function buildProjectItem({ slug, title, excerpt, heroImage, summary, facts }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: OVERLAY, overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'textImage',
          data: { headline: 'Projekt im Detail', text: `<p>${summary}</p>`, image: img(heroImage), imageAlt: title, layout: 'image-left' },
        },
        {
          id: uuid(), type: 'stats',
          data: { headline: 'Eckdaten', stats: facts.map((f) => ({ icon: 'Check', value: f.value, label: f.label })) },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: 'Ähnliches Projekt geplant?',
            subline: 'Wir besprechen Ihr Vorhaben unverbindlich — gerne auch vor Ort.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarCheck' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

function buildNewsItem({ slug, title, excerpt, heroImage, body }) {
  return {
    title, slug,
    data: {
      excerpt,
      sections: [
        {
          id: uuid(), type: 'collectionHero',
          data: { headline: title, subline: excerpt, bgImage: img(heroImage), backgroundImage: img(heroImage), overlayColor: OVERLAY, overlayOpacity: 0.6 },
          styleOverrides: darkSectionTokens,
        },
        {
          id: uuid(), type: 'freeText',
          data: { content: body },
        },
        {
          id: uuid(), type: 'ctaBand',
          data: {
            headline: 'Fragen zum Thema?',
            subline: 'Rufen Sie an oder schreiben Sie eine kurze Nachricht — wir antworten persönlich.',
            ctaPrimary: { label: 'Beratung anfragen', href: '/kontakt', icon: 'PhoneCall' },
          },
          styleOverrides: { '--token-section-bg': C.brand, ...darkSectionTokens },
        },
      ],
    },
  };
}

// ── run ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  run(tenant).catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = tenant;
