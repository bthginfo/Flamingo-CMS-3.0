/**
 * Demo tenant: RETAIL
 *
 * Identität: "Möbelhaus Lichtblick" - inhabergeführtes Einrichtungshaus in
 * Regensburg mit kuratierten Möbeln, Stoffen, Leuchten und persönlicher
 * Wohnberatung.
 *
 * Brand:
 * - Stadt: Regensburg, Altstadt / Prüfeninger Straße.
 * - Story: Kein austauschbares Möbelhaus, sondern ein ruhiger Showroom für
 *   Menschen, die Räume bewusst einrichten wollen: anschauen, anfassen,
 *   kombinieren, liefern lassen.
 * - Tonalität: warm, präzise, beratend, nicht verkäuferisch.
 * - Bildwelt: helle Wohnräume, Holz, Textilien, Showroom-Details, Beratung.
 * - Farben: Tinte, Sandstein, Terrakotta, Leinen, warmes Holz. Classic only.
 *
 * Run:
 *   node scripts/demo-tenants/retail.cjs
 */

const crypto = require('crypto');
const { run } = require('./_lib/runner.cjs');

const PAT = 'c29a426d1a1c833d67b0a3086479cc42db14f8e3ac0b30b323422e99cca58016';

const uuid = () => crypto.randomUUID();
const img = (id, w = 1920) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const C = {
  ink: '#18212A',
  clay: '#A85F3F',
  rust: '#C77546',
  linen: '#FBF5EB',
  sand: '#EFE2D0',
  card: '#FFFFFF',
  sage: '#5F7468',
  muted: '#5E6670',
  border: '#E3D4C2',
};

const lightTokens = {
  '--token-section-bg': C.linen,
  '--token-section-bg-alt': C.sand,
  '--token-card-bg': C.card,
  '--token-card-border': C.border,
  '--token-heading': C.ink,
  '--token-subheading': '#4C4037',
  '--token-body': '#3F4750',
  '--token-muted': C.muted,
  '--token-icon': C.clay,
  '--token-eyebrow': C.clay,
  '--token-stat-value': C.clay,
  '--token-quote': C.ink,
  '--token-rating-star': C.rust,
  '--token-check': C.sage,
  '--token-btn-bg': C.ink,
  '--token-btn-text': '#FFFFFF',
  '--token-btn-secondary-bg': '#FFFFFF',
  '--token-btn-secondary-text': C.ink,
  '--token-badge-bg': '#F1E1D2',
  '--token-badge-text': C.ink,
  '--token-badge-border': '#D9BEA6',
};

const paperTokens = {
  ...lightTokens,
  '--token-section-bg': '#FFFDF8',
  '--token-section-bg-alt': C.linen,
  '--token-card-bg': '#FFFFFF',
};

const warmTokens = {
  ...lightTokens,
  '--token-section-bg': C.sand,
  '--token-section-bg-alt': '#F6EBDD',
  '--token-card-bg': '#FFFDF8',
};

const darkTokens = {
  '--token-section-bg': C.ink,
  '--token-section-bg-alt': '#24313A',
  '--token-card-bg': '#24313A',
  '--token-card-border': '#43515A',
  '--token-heading': '#FFFFFF',
  '--token-subheading': 'rgba(255,255,255,0.9)',
  '--token-body': 'rgba(255,255,255,0.86)',
  '--token-muted': 'rgba(255,255,255,0.68)',
  '--token-eyebrow': '#F0C29D',
  '--token-icon': '#F0C29D',
  '--token-stat-value': '#F0C29D',
  '--token-quote': '#FFFFFF',
  '--token-rating-star': '#F0C29D',
  '--token-check': '#F0C29D',
  '--token-on-dark-heading': '#FFFFFF',
  '--token-on-dark-body': 'rgba(255,255,255,0.86)',
  '--token-on-dark-muted': 'rgba(255,255,255,0.68)',
  '--token-btn-bg': '#FFFFFF',
  '--token-btn-text': C.ink,
  '--token-btn-secondary-bg': 'rgba(255,255,255,0.12)',
  '--token-btn-secondary-text': '#FFFFFF',
  '--token-badge-bg': 'rgba(255,255,255,0.16)',
  '--token-badge-text': '#FFFFFF',
  '--token-badge-border': 'rgba(255,255,255,0.25)',
};

const heroTokens = {
  ...darkTokens,
  '--token-badge-bg': 'rgba(255,255,255,0.92)',
  '--token-badge-text': C.ink,
  '--token-badge-border': 'rgba(255,255,255,0.5)',
};

const ctaTokens = {
  ...darkTokens,
  '--token-section-bg': C.ink,
  '--token-section-bg-alt': '#30414A',
  '--token-card-bg': '#24313A',
  '--token-card-border': '#475761',
};

const accentCtaTokens = {
  ...lightTokens,
  '--token-section-bg': '#F3E1D1',
  '--token-section-bg-alt': '#FAEFE4',
  '--token-card-bg': '#FFEFE1',
  '--token-card-border': '#DDB895',
  '--token-heading': C.ink,
  '--token-body': '#4D3D34',
  '--token-muted': '#695449',
  '--token-btn-bg': C.ink,
  '--token-btn-text': '#FFFFFF',
};

const section = (type, data, styleOverrides = lightTokens, variant = 'classic') => ({
  id: uuid(),
  type,
  variant,
  data,
  styleOverrides,
});

function serviceItem({ title, slug, excerpt, imageId, headline, text, cards }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      image: img(imageId, 1600),
      sections: [
        section('collectionHero', {
          category: 'Leistung',
          headline,
          subline: excerpt,
          bgImage: img(imageId),
          backgroundImage: img(imageId),
          overlayColor: '#111820',
          overlayOpacity: 0.58,
          bgPosition: 'center 45%',
        }, heroTokens),
        section('textImage', {
          badge: 'So arbeiten wir',
          headline: title,
          text,
          image: img(imageId, 1400),
          imageAlt: title,
          layout: 'image-right',
          items: cards,
          primaryCta: { label: 'Beratung anfragen', href: '/kontakt', icon: 'Send' },
        }, paperTokens),
        section('processSteps', {
          badgeText: 'Ablauf',
          headline: 'Erst verstehen, dann einrichten.',
          steps: [
            { icon: 'Search', title: 'Raum ansehen', text: 'Wir klären Maße, Licht, Alltag und vorhandene Möbel.' },
            { icon: 'Layers', title: 'Kombination bauen', text: 'Materialien, Formen und Budget werden sichtbar sortiert.' },
            { icon: 'Truck', title: 'Liefern lassen', text: 'Montage, Altteil-Mitnahme und Terminfenster werden sauber geplant.' },
            { icon: 'HeartHandshake', title: 'Nachjustieren', text: 'Wenn etwas nicht passt, sprechen Sie mit echten Ansprechpartnern.' },
          ],
        }, warmTokens),
        section('ctaBand', {
          badgeText: 'Showroom-Termin',
          headline: 'Bringen Sie Fotos mit. Wir bringen Ordnung hinein.',
          subline: 'Ein kurzes Gespräch reicht oft, um Fehlkäufe zu vermeiden.',
          ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarDays' },
        }, ctaTokens),
      ],
    },
  };
}

function newsItem({ title, slug, excerpt, imageId, body }) {
  return {
    title,
    slug,
    excerpt,
    data: {
      excerpt,
      image: img(imageId, 1600),
      sections: [
        section('collectionHero', {
          category: 'Journal',
          headline: title,
          subline: excerpt,
          bgImage: img(imageId),
          backgroundImage: img(imageId),
          overlayColor: '#111820',
          overlayOpacity: 0.55,
        }, heroTokens),
        section('freeText', { content: body }, paperTokens),
        section('ctaBand', {
          badgeText: 'Frage zum Thema?',
          headline: 'Wir zeigen Ihnen Materialien lieber live als theoretisch.',
          subline: 'Kommen Sie in den Showroom oder schicken Sie uns ein Foto Ihrer Raumsituation.',
          ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' },
        }, accentCtaTokens),
      ],
    },
  };
}

const services = [
  serviceItem({
    title: 'Wohnberatung',
    slug: 'wohnberatung',
    excerpt: 'Einrichtung, die zu Grundriss, Licht und Alltag passt.',
    imageId: '1618221195710-dd6b41faaea6',
    headline: 'Wohnberatung ohne Showroom-Druck.',
    text: '<p>Wir starten nicht mit einem Produkt, sondern mit Ihrem Raum. Fotos, Maße und ein ehrliches Gespräch reichen oft, um die Richtung zu klären.</p><p>Danach zeigen wir Möbel, Stoffe und Leuchten, die zusammen funktionieren und nicht nur einzeln gut aussehen.</p>',
    cards: [
      { icon: 'Ruler', title: 'Maße zuerst', text: 'Damit Proportionen stimmen.' },
      { icon: 'LampDesk', title: 'Licht mitdenken', text: 'Weil Farben im Raum anders wirken.' },
      { icon: 'Sofa', title: 'Bestand einbeziehen', text: 'Gute Stücke bleiben, wenn sie passen.' },
      { icon: 'Wallet', title: 'Budget klar halten', text: 'Keine Überraschung nach der Auswahl.' },
    ],
  }),
  serviceItem({
    title: 'Sofa & Wohnen',
    slug: 'sofa-wohnen',
    excerpt: 'Sitzmöbel, Teppiche, Beistelltische und Leuchten für echte Wohnzimmer.',
    imageId: '1600210492486-724fe5c67fb0',
    headline: 'Ein Sofa ist kein Einzelstück. Es entscheidet den Raum.',
    text: '<p>Sitztiefe, Stoff, Rücken, Teppich und Licht müssen gemeinsam betrachtet werden. Wir helfen bei Kombinationen, die wohnlich wirken und lange nutzbar bleiben.</p>',
    cards: [
      { icon: 'Sofa', title: 'Sitzprobe', text: 'Mehrere Modelle live vergleichen.' },
      { icon: 'SwatchBook', title: 'Stoffauswahl', text: 'Robustheit, Haptik und Farbe.' },
      { icon: 'Sparkles', title: 'Pflege realistisch', text: 'Für Kinder, Gäste und Alltag.' },
      { icon: 'Truck', title: 'Lieferung', text: 'Mit Montage und Terminfenster.' },
    ],
  }),
  serviceItem({
    title: 'Schlafen & Stauraum',
    slug: 'schlafen-stauraum',
    excerpt: 'Betten, Matratzen, Schränke und ruhige Lösungen für kleine Räume.',
    imageId: '1615874694520-474822394e73',
    headline: 'Schlafzimmer dürfen ruhig wirken und trotzdem praktisch sein.',
    text: '<p>Wir planen Betten, Matratzen, Schränke und Kommoden so, dass Wege frei bleiben und Stauraum nicht wie ein Kompromiss aussieht.</p>',
    cards: [
      { icon: 'BedDouble', title: 'Liegegefühl', text: 'Matratzen und Unterfederung abstimmen.' },
      { icon: 'Archive', title: 'Stauraum', text: 'Schranklösungen ohne optische Schwere.' },
      { icon: 'Moon', title: 'Ruhe', text: 'Farben und Textilien zurücknehmen.' },
      { icon: 'PackageCheck', title: 'Montage', text: 'Sauber aufgebaut, Verpackung mitgenommen.' },
    ],
  }),
  serviceItem({
    title: 'Lieferung & Montage',
    slug: 'lieferung-montage',
    excerpt: 'Geplant geliefert, sauber montiert, ohne Chaos im Treppenhaus.',
    imageId: '1583958203904-cdcb402031fd',
    headline: 'Der Kauf endet nicht an der Kasse.',
    text: '<p>Wir planen Lieferfenster, Etagen, Altteil-Mitnahme und Montage vorab. So wird aus einem schönen Möbelstück kein logistischer Stress.</p>',
    cards: [
      { icon: 'CalendarCheck', title: 'Terminfenster', text: 'Planbar statt irgendwann.' },
      { icon: 'Truck', title: 'Eigene Partner', text: 'Teams, die Möbel wirklich kennen.' },
      { icon: 'ShieldCheck', title: 'Schutz', text: 'Böden und Wände werden mitgedacht.' },
      { icon: 'Recycle', title: 'Altteile', text: 'Auf Wunsch nehmen wir Altmöbel mit.' },
    ],
  }),
];

const news = [
  newsItem({
    title: 'Warum ein Stoff im Showroom anders wirkt als zu Hause',
    slug: 'stoffmuster-licht',
    excerpt: 'Licht, Wandfarbe und Abstand verändern Materialien stärker, als viele erwarten.',
    imageId: '1600607687920-4e2a09cf159d',
    body: '<p>Ein Stoffmuster ist kein Foto. Es reagiert auf Tageslicht, Kunstlicht und die Farben in seiner Umgebung. Deshalb geben wir Muster mit nach Hause und beraten nicht nur am Verkaufstisch.</p><p>Unser Tipp: Legen Sie Stoffe morgens, nachmittags und abends an die gleiche Stelle. Erst dann zeigt sich, ob der Ton wirklich ruhig bleibt.</p>',
  }),
  newsItem({
    title: 'Drei Fehler, die kleine Wohnzimmer enger wirken lassen',
    slug: 'kleines-wohnzimmer',
    excerpt: 'Zu große Einzelstücke, falsche Teppichgrößen und zu wenig Lichtzonen.',
    imageId: '1598928506311-c55ded91a20c',
    body: '<p>Kleine Räume brauchen nicht automatisch kleine Möbel. Wichtiger sind klare Proportionen, sichtbare Bodenflächen und Leuchten auf mehreren Höhen.</p><p>Ein gut gesetzter Teppich kann einen Raum sogar größer wirken lassen, wenn Sofa und Tisch darauf zusammenfinden.</p>',
  }),
  newsItem({
    title: 'Unsere neue Holz- und Lederkollektion ist eingetroffen',
    slug: 'holz-leder-kollektion',
    excerpt: 'Massivholz, weiche Kanten und Leder, das mit der Zeit schöner wird.',
    imageId: '1555041469-a586c61ea9bc',
    body: '<p>Die neue Kollektion setzt auf geöltes Holz, ruhige Linien und Materialien, die nicht nach einer Saison müde aussehen. Besonders schön: Esstische mit sanften Radien und Lederstühle mit angenehmer Rückenlinie.</p>',
  }),
];

const navigation = {
  items: [
    { label: 'Startseite', href: '/' },
    { label: 'Sortiment', href: '/sortiment' },
    { label: 'Beratung', href: '/beratung' },
    { label: 'Lieferung', href: '/lieferung-montage' },
    { label: 'Inspiration', href: '/inspiration' },
    { label: 'Über uns', href: '/ueber-uns' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  cta: { label: 'Termin vereinbaren', href: '/kontakt' },
};

const footer = {
  columns: [
    {
      title: 'Sortiment',
      items: [
        { text: 'Wohnberatung', href: '/c/leistungen/wohnberatung' },
        { text: 'Sofa & Wohnen', href: '/c/leistungen/sofa-wohnen' },
        { text: 'Schlafen & Stauraum', href: '/c/leistungen/schlafen-stauraum' },
      ],
    },
    {
      title: 'Service',
      items: [
        { text: 'Beratung', href: '/beratung' },
        { text: 'Lieferung & Montage', href: '/lieferung-montage' },
        { text: 'Inspiration', href: '/inspiration' },
      ],
    },
    {
      title: 'Möbelhaus',
      items: [
        { text: 'Über uns', href: '/ueber-uns' },
        { text: 'Kontakt', href: '/kontakt' },
        { text: 'Journal', href: '/news' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
  cta: { label: 'Showroom-Termin', href: '/kontakt' },
};

const pages = [
  {
    slug: 'startseite',
    title: 'Startseite',
    seo: {
      metaTitle: 'Möbelhaus Lichtblick Regensburg | Möbel, Beratung & Lieferung',
      metaDescription: 'Inhabergeführtes Möbelhaus in Regensburg mit Showroom, Wohnberatung, Sofas, Betten, Stauraum, Lieferung und Montage.',
      ogImage: img('1616486338812-3dadae4b4ace', 1600),
    },
    sections: [
      section('hero', {
        badgeText: 'Möbelhaus in Regensburg',
        badgeIcon: 'Sparkles',
        headline: 'Räume, die nicht nur eingerichtet sind, sondern ankommen.',
        subline: 'Möbelhaus Lichtblick kuratiert Sofas, Tische, Betten, Stoffe und Leuchten für Menschen, die bewusst wohnen wollen.',
        bgImage: img('1616486338812-3dadae4b4ace'),
        bgImageMobile: img('1616486338812-3dadae4b4ace', 1000),
        bgMode: 'image',
        overlayColor: '#101820',
        overlayOpacity: 0.54,
        bgPosition: 'center 52%',
        primaryCta: { label: 'Showroom-Termin', href: '/kontakt', icon: 'CalendarDays' },
        secondaryCta: { label: 'Sortiment ansehen', href: '/sortiment', icon: 'Sofa' },
        trustItems: ['Regensburg Altstadt', 'Beratung ohne Verkaufsdruck', 'Lieferung & Montage', 'Materialmuster zum Mitnehmen'],
        trustStripColor: 'rgba(24,33,42,0.58)',
      }, heroTokens),
      section('socialProofBar', {
        bgStyle: 'light',
        items: [
          { value: '4,8 / 5', label: 'Google-Bewertungen', icon: 'Star' },
          { value: 'seit 1998', label: 'inhabergeführt', icon: 'BadgeCheck' },
          { value: '2.400+', label: 'Wohnräume begleitet', icon: 'Home' },
          { value: '48h', label: 'Rückmeldung auf Anfragen', icon: 'Clock' },
        ],
      }, paperTokens),
      section('categoryMosaic', {
        headline: 'Was Sie bei uns finden.',
        subline: 'Nicht alles. Aber genau die Stücke, die wir selbst empfehlen würden.',
        items: [
          { title: 'Sofas & Sessel', image: img('1600210492486-724fe5c67fb0', 1200), href: '/c/leistungen/sofa-wohnen', size: 'large' },
          { title: 'Esstische & Stühle', image: img('1519710164239-da123dc03ef4', 1200), href: '/sortiment', size: 'small' },
          { title: 'Betten & Stauraum', image: img('1615874694520-474822394e73', 1200), href: '/c/leistungen/schlafen-stauraum', size: 'small' },
          { title: 'Leuchten & Textilien', image: img('1513506003901-1e6a229e2d15', 1200), href: '/inspiration', size: 'large' },
        ],
      }, warmTokens),
      section('servicesGrid', {
        badgeText: 'Beratung & Service',
        headline: 'Vier Wege, wie wir Räume besser machen.',
        subline: 'Vom ersten Gespräch bis zur Montage bleibt alles nachvollziehbar.',
        ctaLabel: 'Alle Leistungen ansehen',
        ctaHref: '/leistungen',
        manualCards: [
          { title: 'Wohnberatung', text: 'Grundriss, Licht, Alltag und Budget zusammenbringen.', icon: 'LayoutPanelTop', href: '/c/leistungen/wohnberatung' },
          { title: 'Sofa & Wohnen', text: 'Sitzprobe, Stoffe, Teppich und Licht stimmig kombinieren.', icon: 'Sofa', href: '/c/leistungen/sofa-wohnen' },
          { title: 'Schlafen & Stauraum', text: 'Ruhige Schlafzimmer mit genug Platz für echte Routinen.', icon: 'BedDouble', href: '/c/leistungen/schlafen-stauraum' },
          { title: 'Lieferung & Montage', text: 'Planbare Lieferung, sauberer Aufbau, kurze Wege.', icon: 'Truck', href: '/c/leistungen/lieferung-montage' },
        ],
      }, paperTokens),
      section('brandShowroom', {
        headline: 'Ein Showroom, in dem man Dinge anfassen darf.',
        subline: 'Stoffe, Holz, Leder und Licht wirken live anders als auf einem Bildschirm. Genau deshalb gibt es unseren Laden.',
        image: img('1598928506311-c55ded91a20c'),
        overlayOpacity: 0.22,
        highlights: [
          { title: 'Materialwand', text: 'Stoffe, Leder, Holz und Teppiche direkt vergleichen.' },
          { title: 'Wohninseln', text: 'Keine Produktreihen, sondern echte Raumsituationen.' },
          { title: 'Beratungstisch', text: 'Fotos, Grundrisse und Muster gemeinsam sortieren.' },
        ],
        cta: { label: 'Showroom besuchen', href: '/kontakt' },
      }, warmTokens),
      section('featureShowcase', {
        badge: 'Material statt Katalog',
        headline: 'Wir planen mit Oberflächen, nicht mit Versprechen.',
        subline: 'Eine gute Entscheidung fühlt sich live richtig an.',
        text: '<p>Im Möbelhaus Lichtblick sehen Sie nicht nur Produktbilder, sondern echte Materialien. Wir legen Muster nebeneinander, prüfen Lichtstimmungen und sprechen offen über Pflege, Lieferzeiten und Budget.</p>',
        image: img('1600607687920-4e2a09cf159d', 1400),
        features: ['Stoffmuster zum Mitnehmen', 'Holz- und Lederberatung', 'Lichtwirkung im Raum', 'Lieferzeiten transparent'],
        ctaLabel: 'Beratung buchen',
        ctaHref: '/kontakt',
        reversed: true,
      }, paperTokens),
      section('bentoGrid', {
        headline: 'Wohnen ist selten eine Einzelentscheidung.',
        subline: 'Darum betrachten wir Möbel, Wege, Stauraum und Licht gemeinsam.',
        items: [
          { title: 'Proportion', text: 'Ein Tisch muss nicht nur schön sein, sondern in den Raum passen.', icon: 'Ruler', span: '2' },
          { title: 'Haptik', text: 'Stoffe, Leder und Holz müssen sich richtig anfühlen.', icon: 'Hand' },
          { title: 'Alltag', text: 'Kinder, Gäste, Haustiere und Homeoffice gehören zur Planung.', icon: 'Users' },
          { title: 'Licht', text: 'Leuchten entscheiden, ob ein Raum abends warm bleibt.', icon: 'LampDesk' },
          { title: 'Montage', text: 'Der beste Kauf bringt wenig, wenn die Lieferung nervt.', icon: 'PackageCheck', span: '2' },
        ],
      }, warmTokens),
      section('deliveryTimeline', {
        headline: 'Vom Gespräch bis zum aufgebauten Möbel.',
        subline: 'Klare Schritte, klare Zuständigkeiten, keine stillen Überraschungen.',
        steps: [
          { number: '01', icon: 'MessagesSquare', title: 'Beratung', text: 'Wir klären Raum, Stil, Budget und Zeithorizont.' },
          { number: '02', icon: 'SwatchBook', title: 'Auswahl', text: 'Materialien und Modelle werden nachvollziehbar eingegrenzt.' },
          { number: '03', icon: 'ClipboardCheck', title: 'Bestellung', text: 'Lieferzeit, Maße und Montage werden schriftlich festgehalten.' },
          { number: '04', icon: 'Truck', title: 'Lieferung', text: 'Aufbau, Verpackung und Altteil-Mitnahme laufen geplant.' },
        ],
      }, paperTokens),
      section('portfolio', {
        badgeText: 'Räume aus der Region',
        headline: 'So kann Lichtblick aussehen.',
        subline: 'Beispiele aus Wohnungen, Häusern und kleinen Büros rund um Regensburg.',
        projects: [
          { title: 'Altbauwohnung Stadtamhof', category: 'Wohnzimmer', description: 'Sofa, Teppich, Leuchten und Stauraum in einem ruhigen Konzept.', image: img('1618221195710-dd6b41faaea6', 1200), href: '/inspiration', stats: [{ label: 'Räume', value: '2' }, { label: 'Dauer', value: '6 Wo.' }] },
          { title: 'Familienhaus Prüfening', category: 'Essen & Wohnen', description: 'Robuster Esstisch, Stühle und pflegeleichte Stoffe für echten Alltag.', image: img('1519710164239-da123dc03ef4', 1200), href: '/inspiration', stats: [{ label: 'Personen', value: '5' }, { label: 'Materialien', value: '7' }] },
          { title: 'Schlafzimmer Kumpfmühl', category: 'Schlafen', description: 'Bett, Licht und Schranklösung mit ruhiger Farbwelt.', image: img('1615874694520-474822394e73', 1200), href: '/inspiration', stats: [{ label: 'Stauraum', value: '4 m' }, { label: 'Lieferung', value: '1 Tag' }] },
        ],
        ctaLabel: 'Inspiration ansehen',
        ctaHref: '/inspiration',
      }, paperTokens),
      section('comparisonTable', {
        badge: 'Orientierung',
        headline: 'Welche Beratung passt zu Ihrem Vorhaben?',
        text: 'Drei Formate, damit Sie nicht mit einem zu großen oder zu kleinen Termin starten.',
        columns: [{ label: 'Kurzcheck' }, { label: 'Wohnberatung' }, { label: 'Raumkonzept' }],
        rows: [
          { feature: 'Ideal für', values: ['Einzelstück', 'Raumgefühl', 'mehrere Räume'] },
          { feature: 'Dauer', values: ['30 Min.', '60-90 Min.', 'nach Umfang'] },
          { feature: 'Vorbereitung', values: ['Fotos', 'Fotos + Maße', 'Grundriss + Budget'] },
          { feature: 'Ergebnis', values: ['Richtung', 'konkrete Auswahl', 'stimmiger Plan'] },
        ],
        highlightCol: 1,
      }, warmTokens),
      section('statsCounter', {
        headline: 'Zahlen, die im Alltag zählen.',
        subline: 'Nicht riesig. Aber verlässlich, persönlich und nah.',
        stats: [
          { value: 26, label: 'Jahre Beratung' },
          { value: 2400, suffix: '+', label: 'begleitete Räume' },
          { value: 4.8, label: 'Google-Rating' },
          { value: 48, suffix: 'h', label: 'Rückmeldung' },
        ],
      }, paperTokens),
      section('testimonials', {
        headline: 'Was Kundinnen und Kunden oft sagen.',
        subline: 'Die schönsten Rückmeldungen sind nicht laut, sondern konkret.',
        items: [
          { quote: 'Wir haben endlich verstanden, warum unser Wohnzimmer nie ruhig wirkte. Zwei Möbel weniger, bessere Leuchten, alles anders.', name: 'Familie Brandl', context: 'Wohnberatung Regensburg', rating: 5 },
          { quote: 'Die Lieferung war so gut geplant, dass unser Treppenhaus danach sauberer war als vorher.', name: 'H. Mayer', context: 'Sofa & Montage', rating: 5 },
          { quote: 'Kein Verkaufsdruck. Wir konnten Stoffe mitnehmen und in Ruhe entscheiden.', name: 'Anja S.', context: 'Esszimmer', rating: 5 },
          { quote: 'Der neue Schrank sieht leicht aus und schluckt trotzdem alles, was vorher herumstand.', name: 'M. Fischer', context: 'Schlafen & Stauraum', rating: 5 },
        ],
      }, warmTokens),
      section('faq', {
        headline: 'Häufige Fragen vor dem ersten Besuch.',
        subline: 'Kurz beantwortet, damit der Termin leichter wird.',
        items: [
          { question: 'Brauche ich einen Termin?', answer: 'Sie können jederzeit vorbeikommen. Für Wohnberatung mit Fotos, Maßen oder größerem Vorhaben empfehlen wir einen Termin.' },
          { question: 'Kann ich Stoffmuster mitnehmen?', answer: 'Ja. Gerade bei Sofas, Vorhängen und Teppichen ist Licht zu Hause entscheidend.' },
          { question: 'Liefert ihr selbst?', answer: 'Wir arbeiten mit festen Montageteams, die unsere Möbel kennen und sauber aufbauen.' },
          { question: 'Plant ihr auch einzelne Räume?', answer: 'Ja. Vom einzelnen Sofa bis zum kompletten Wohn- oder Schlafzimmer ist beides möglich.' },
        ],
      }, paperTokens),
      section('newsPreview', {
        headline: 'Notizen aus dem Showroom.',
        subline: 'Material, Licht, Einrichtungsideen und kleine Entscheidungen, die Räume besser machen.',
        collectionKey: 'news',
        linkLabel: 'Alle Beiträge lesen',
        linkHref: '/news',
      }, warmTokens),
      section('ctaBand', {
        badgeText: 'Showroom in Regensburg',
        headline: 'Bringen Sie Fotos mit. Wir zeigen, was wirklich passt.',
        subline: 'Ein erster Termin ist unverbindlich und hilft, aus vielen Möglichkeiten eine klare Richtung zu machen.',
        ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarDays' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'sortiment',
    title: 'Sortiment',
    seo: {
      metaTitle: 'Sortiment | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Sofas, Sessel, Esstische, Betten, Stauraum, Leuchten, Teppiche und Stoffe im Möbelhaus Lichtblick Regensburg.',
      ogImage: img('1598928506311-c55ded91a20c', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Sortiment',
        headline: 'Kuratiert statt vollgestellt.',
        subline: 'Wir zeigen Möbel, Materialien und Leuchten, die sich sinnvoll kombinieren lassen.',
        bgImage: img('1598928506311-c55ded91a20c'),
        overlayColor: '#111820',
        overlayOpacity: 0.55,
      }, heroTokens),
      section('categoryMosaic', {
        headline: 'Unsere wichtigsten Bereiche.',
        subline: 'Nicht jedes Stück steht immer im Showroom. Aber jede Kategorie ist beratbar.',
        items: [
          { title: 'Wohnen', image: img('1600210492486-724fe5c67fb0', 1200), href: '/c/leistungen/sofa-wohnen', size: 'large' },
          { title: 'Essen', image: img('1519710164239-da123dc03ef4', 1200), href: '/sortiment', size: 'small' },
          { title: 'Schlafen', image: img('1615874694520-474822394e73', 1200), href: '/c/leistungen/schlafen-stauraum', size: 'small' },
          { title: 'Licht & Textil', image: img('1513506003901-1e6a229e2d15', 1200), href: '/inspiration', size: 'large' },
        ],
      }, paperTokens),
      section('productShowcase', {
        headline: 'Ausgewählte Stücke im Showroom.',
        subline: 'Beispiele für die Art von Möbeln, die Sie bei uns finden.',
        columns: '4',
        items: [
          { image: img('1555041469-a586c61ea9bc', 900), title: 'Massivholztisch Leno', price: 'ab 1.890 €', badge: 'geölt', description: 'Ruhige Kante, klare Proportion.' },
          { image: img('1600210492486-724fe5c67fb0', 900), title: 'Sofa Miro', price: 'ab 2.490 €', badge: 'Stoffwahl', description: 'Tiefe Sitzfläche, weicher Rücken.' },
          { image: img('1615874694520-474822394e73', 900), title: 'Bett Alva', price: 'ab 1.320 €', badge: 'Massivholz', description: 'Leise Optik, stabile Konstruktion.' },
          { image: img('1513506003901-1e6a229e2d15', 900), title: 'Leuchte Nuri', price: 'ab 340 €', badge: 'warm', description: 'Lichtinsel für Sofa oder Esstisch.' },
        ],
      }, warmTokens),
      section('materialGallery', {
        headline: 'Materialien zum Vergleichen.',
        subline: 'Wir beraten über Haptik, Pflege und Wirkung im Raum.',
        categories: ['Holz', 'Stoff', 'Leder', 'Licht'],
        items: [
          { image: img('1600607687920-4e2a09cf159d', 900), name: 'Leinenstoff natur', category: 'Stoff' },
          { image: img('1598300042247-d088f8ab3a91', 900), name: 'Eiche geölt', category: 'Holz' },
          { image: img('1524758631624-e2822e304c36', 900), name: 'Leder cognac', category: 'Leder' },
          { image: img('1513506003901-1e6a229e2d15', 900), name: 'warmes Leselicht', category: 'Licht' },
          { image: img('1505693416388-ac5ce068fe85', 900), name: 'Bouclé hell', category: 'Stoff' },
          { image: img('1519710164239-da123dc03ef4', 900), name: 'Nussbaum dunkel', category: 'Holz' },
        ],
      }, paperTokens),
      section('collectionList', {
        headline: 'Beratung passend zum Sortiment.',
        subline: 'Wenn Sie wissen, was Sie suchen, starten Sie hier.',
        collectionKey: 'leistungen',
        columns: '4',
        showImage: true,
        showDate: false,
        showExcerpt: true,
        showSortControls: false,
      }, warmTokens),
      section('ctaBand', {
        badgeText: 'Nicht sicher?',
        headline: 'Lieber einmal live fühlen als zehn Tabs offen lassen.',
        subline: 'Wir legen Materialien zusammen und zeigen Ihnen, was im Raum wirklich funktioniert.',
        ctaPrimary: { label: 'Showroom-Termin', href: '/kontakt', icon: 'CalendarDays' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'beratung',
    title: 'Beratung',
    seo: {
      metaTitle: 'Wohnberatung | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Persönliche Wohnberatung im Möbelhaus Lichtblick: Materialien, Maße, Licht und Budget verständlich planen.',
      ogImage: img('1618221195710-dd6b41faaea6', 1600),
    },
    sections: [
      section('glowHero', {
        eyebrow: 'Wohnberatung',
        headline: 'Aus vielen schönen Dingen wird erst mit Beratung ein guter Raum.',
        subline: 'Wir sortieren Wünsche, Maße, Licht und Budget, bevor Sie sich für Möbel entscheiden.',
        image: img('1618221195710-dd6b41faaea6'),
        glowColor: 'rgba(168,95,63,0.32)',
        primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
        secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' },
        facts: [
          { value: '30 Min.', label: 'Kurzcheck' },
          { value: '90 Min.', label: 'Raumberatung' },
          { value: '0 €', label: 'Erstgespräch' },
        ],
      }, paperTokens),
      section('consultationBooking', {
        headline: 'Was wir im Termin klären.',
        subline: 'Je konkreter der Raum, desto besser die Empfehlung.',
        image: img('1600607687920-4e2a09cf159d', 1400),
        services: [
          { icon: 'Image', title: 'Fotos ansehen', description: 'Raumsituation, Licht und vorhandene Möbel verstehen.' },
          { icon: 'Ruler', title: 'Maße prüfen', description: 'Proportionen und Laufwege realistisch einschätzen.' },
          { icon: 'SwatchBook', title: 'Materialien wählen', description: 'Stoffe, Holz und Teppiche sinnvoll kombinieren.' },
          { icon: 'Truck', title: 'Umsetzung planen', description: 'Lieferzeit, Montage und Budget transparent machen.' },
        ],
        cta: { label: 'Termin sichern', href: '/kontakt' },
      }, warmTokens),
      section('principlesGrid', {
        badge: 'Unsere Haltung',
        headline: 'Gute Beratung macht Entscheidungen leichter.',
        subline: 'Wir wollen, dass Sie verstehen, warum etwas passt.',
        principles: [
          { eyebrow: '01', title: 'Nicht alles zeigen', text: 'Wir filtern vor, statt Sie mit Optionen zu überladen.' },
          { eyebrow: '02', title: 'Material ehrlich erklären', text: 'Pflege, Lieferzeit und Alltagstauglichkeit gehören dazu.' },
          { eyebrow: '03', title: 'Bestand respektieren', text: 'Nicht jeder Raum braucht alles neu.' },
          { eyebrow: '04', title: 'Budget sichtbar halten', text: 'Schöne Räume brauchen keine heimlichen Zusatzkosten.' },
        ],
        cta: { label: 'Beratung anfragen', href: '/kontakt' },
      }, paperTokens),
      section('comparisonTable', {
        badge: 'Formate',
        headline: 'Wie viel Beratung brauchen Sie?',
        text: 'Wenn Sie unsicher sind, starten wir klein und erweitern nur bei Bedarf.',
        columns: [{ label: 'Kurzcheck' }, { label: 'Wohnberatung' }, { label: 'Raumkonzept' }],
        rows: [
          { feature: 'Dauer', values: ['30 Min.', '60-90 Min.', 'nach Absprache'] },
          { feature: 'Mitbringen', values: ['Fotos', 'Fotos + Maße', 'Grundriss + Budget'] },
          { feature: 'Gut für', values: ['Ein Möbelstück', 'ein Raum', 'mehrere Räume'] },
          { feature: 'Ergebnis', values: ['Richtung', 'Auswahl', 'Konzept'] },
        ],
        highlightCol: 1,
      }, warmTokens),
      section('faq', {
        headline: 'Vor dem Beratungstermin.',
        subline: 'So wird der erste Termin direkt produktiv.',
        items: [
          { question: 'Was soll ich mitbringen?', answer: 'Fotos, grobe Maße und wenn möglich ein Bild von Boden, Wandfarbe und Licht.' },
          { question: 'Muss ich danach kaufen?', answer: 'Nein. Gute Beratung soll Druck herausnehmen, nicht erzeugen.' },
          { question: 'Kann ich nur ein Sofa suchen?', answer: 'Ja. Auch Einzelstücke beraten wir im Raumkontext.' },
          { question: 'Plant ihr online?', answer: 'Erste Einschätzungen gehen per Mail oder Telefon. Materialien zeigen wir am liebsten vor Ort.' },
        ],
      }, paperTokens),
      section('ctaBand', {
        badgeText: 'Termin',
        headline: 'Ein Foto vom Raum reicht für den Anfang.',
        subline: 'Schicken Sie uns kurz, worum es geht. Wir melden uns mit einem passenden Vorschlag.',
        ctaPrimary: { label: 'Anfrage senden', href: '/kontakt', icon: 'Send' },
      }, accentCtaTokens),
    ],
  },
  {
    slug: 'lieferung-montage',
    title: 'Lieferung & Montage',
    seo: {
      metaTitle: 'Lieferung & Montage | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Planbare Möbellieferung und Montage in Regensburg: Terminfenster, Aufbau, Schutz und Altteil-Mitnahme.',
      ogImage: img('1583958203904-cdcb402031fd', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Service',
        headline: 'Lieferung, die nicht den halben Tag blockiert.',
        subline: 'Wir planen Aufbau, Etagen, Verpackung und Altteil-Mitnahme vorab.',
        bgImage: img('1583958203904-cdcb402031fd'),
        overlayColor: '#111820',
        overlayOpacity: 0.58,
      }, heroTokens),
      section('deliveryTimeline', {
        headline: 'So kommt Ihr Möbelstück an.',
        subline: 'Verlässlich, sauber und mit einem klaren Ansprechpartner.',
        steps: [
          { number: '01', icon: 'ClipboardList', title: 'Auftrag prüfen', text: 'Maße, Teile, Etage und Besonderheiten werden festgehalten.' },
          { number: '02', icon: 'CalendarDays', title: 'Terminfenster', text: 'Sie bekommen ein realistisches Lieferfenster.' },
          { number: '03', icon: 'ShieldCheck', title: 'Schutz', text: 'Böden, Wände und Treppenhaus werden geschützt.' },
          { number: '04', icon: 'PackageCheck', title: 'Übergabe', text: 'Aufgebaut, kontrolliert und Verpackung mitgenommen.' },
        ],
      }, paperTokens),
      section('textImage', {
        badge: 'Montage',
        headline: 'Gute Möbel verdienen einen guten Aufbau.',
        text: '<p>Unsere Montageteams kennen die Möbel, die sie liefern. Das spart Zeit, vermeidet Schäden und macht die Übergabe deutlich entspannter.</p>',
        image: img('1583958203904-cdcb402031fd', 1400),
        imageAlt: 'Möbellieferung und Montage',
        layout: 'image-left',
        items: [
          { icon: 'Truck', title: 'Regensburg & Umgebung', text: 'Feste Touren statt Zufall.' },
          { icon: 'Recycle', title: 'Altteil-Mitnahme', text: 'Auf Wunsch direkt mitgeplant.' },
          { icon: 'Wrench', title: 'Aufbau', text: 'Sauber montiert und kontrolliert.' },
          { icon: 'BadgeCheck', title: 'Ansprechpartner', text: 'Nicht anonym, sondern Lichtblick.' },
        ],
        primaryCta: { label: 'Lieferung anfragen', href: '/kontakt', icon: 'Send' },
      }, warmTokens),
      section('statsCounter', {
        headline: 'Service, der im Kalender funktioniert.',
        subline: 'Planbarkeit ist Teil der Beratung.',
        stats: [
          { value: 2, label: 'Montagetage pro Woche' },
          { value: 48, suffix: 'h', label: 'Terminbestätigung' },
          { value: 35, suffix: 'km', label: 'Standardgebiet' },
          { value: 1, label: 'Ansprechpartner' },
        ],
      }, paperTokens),
      section('faq', {
        headline: 'Fragen zur Lieferung.',
        subline: 'Damit am Liefertag möglichst wenig offen bleibt.',
        items: [
          { question: 'Nehmt ihr Verpackung mit?', answer: 'Ja, Verpackung nehmen wir nach der Montage wieder mit.' },
          { question: 'Könnt ihr Altmöbel entsorgen?', answer: 'Nach Absprache ja. Bitte sagen Sie uns das vor dem Liefertermin.' },
          { question: 'Was passiert bei engen Treppenhäusern?', answer: 'Wir prüfen Maße vorab und klären, ob Demontage oder Speziallösung nötig ist.' },
          { question: 'Liefert ihr außerhalb Regensburg?', answer: 'Ja, nach Absprache in die Region. Wir nennen die Lieferkosten transparent vorab.' },
        ],
      }, paperTokens),
      section('ctaBand', {
        badgeText: 'Lieferung planen',
        headline: 'Ein gutes Möbelstück soll gut ankommen.',
        subline: 'Wir klären die Details, bevor es eng wird.',
        ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'inspiration',
    title: 'Inspiration',
    seo: {
      metaTitle: 'Inspiration | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Wohnideen, Materialwelten und Raumbeispiele aus dem Möbelhaus Lichtblick in Regensburg.',
      ogImage: img('1618221195710-dd6b41faaea6', 1600),
    },
    sections: [
      section('cinematicHero', {
        eyebrow: 'Inspiration',
        headline: 'Räume werden besser, wenn man sie als Ganzes sieht.',
        subline: 'Wohnideen aus unserem Showroom und aus Projekten rund um Regensburg.',
        image: img('1618221195710-dd6b41faaea6'),
        overlay: 'rgba(17,24,32,0.58)',
        align: 'left',
        primaryCta: { label: 'Beratung anfragen', href: '/kontakt' },
        secondaryCta: { label: 'Sortiment ansehen', href: '/sortiment' },
        facts: [
          { value: '4', label: 'Raumwelten' },
          { value: '26', label: 'Jahre Erfahrung' },
          { value: '1', label: 'ruhiger Plan' },
        ],
      }, heroTokens),
      section('inspirationGrid', {
        headline: 'Ideen aus dem Showroom.',
        subline: 'Für Wohnzimmer, Essbereiche, Schlafzimmer und kleine Ecken.',
        items: [
          { image: img('1600210492486-724fe5c67fb0', 1000), title: 'Sofaecke mit warmem Licht', href: '/c/leistungen/sofa-wohnen' },
          { image: img('1519710164239-da123dc03ef4', 1000), title: 'Esstisch als Mittelpunkt', href: '/sortiment' },
          { image: img('1615874694520-474822394e73', 1000), title: 'Ruhiges Schlafzimmer', href: '/c/leistungen/schlafen-stauraum' },
          { image: img('1513506003901-1e6a229e2d15', 1000), title: 'Leuchten, die abends tragen', href: '/beratung' },
          { image: img('1600607687920-4e2a09cf159d', 1000), title: 'Materialien kombinieren', href: '/beratung' },
          { image: img('1598928506311-c55ded91a20c', 1000), title: 'Showroom-Regale', href: '/kontakt' },
        ],
      }, paperTokens),
      section('beforeAfter', {
        headline: 'Kleine Veränderung, anderer Raum.',
        description: 'Neue Leuchten, passender Teppich und ein Sofa in richtiger Proportion haben mehr Wirkung als ein kompletter Neustart.',
        imageBefore: img('1560184897-ae75f418493e', 1200),
        imageAfter: img('1618221195710-dd6b41faaea6', 1200),
        labelBefore: 'Vorher',
        labelAfter: 'Nachher',
      }, warmTokens),
      section('editorialFeatureRail', {
        badge: 'Drei Entscheidungen',
        headline: 'Worauf wir in fast jedem Raum achten.',
        subline: 'Diese Punkte entscheiden oft mehr als die einzelne Marke.',
        items: [
          { kicker: '01', title: 'Sitzhöhe', text: 'Sie bestimmt, ob ein Sofa einladend oder mühsam wirkt.', image: img('1600210492486-724fe5c67fb0', 900), ctaLabel: 'Sofa-Beratung', ctaHref: '/c/leistungen/sofa-wohnen' },
          { kicker: '02', title: 'Lichtinseln', text: 'Ein Raum braucht mehr als eine Deckenleuchte.', image: img('1513506003901-1e6a229e2d15', 900), ctaLabel: 'Beratung', ctaHref: '/beratung' },
          { kicker: '03', title: 'Materialruhe', text: 'Holz, Stoff und Metall müssen nicht gleich sein, aber zusammen sprechen.', image: img('1600607687920-4e2a09cf159d', 900), ctaLabel: 'Materialien', ctaHref: '/sortiment' },
        ],
      }, warmTokens),
      section('galleryGrid', {
        headline: 'Stimmungen statt Produktlisten.',
        subline: 'Ein paar Einblicke in die Lichtblick-Welt.',
        columns: '3',
        images: [
          { src: img('1616486338812-3dadae4b4ace', 1000), alt: 'Wohnzimmer mit Sofa', caption: 'ruhig und hell' },
          { src: img('1555041469-a586c61ea9bc', 1000), alt: 'Holztisch', caption: 'geöltes Holz' },
          { src: img('1513506003901-1e6a229e2d15', 1000), alt: 'Leuchte', caption: 'warmes Licht' },
          { src: img('1598928506311-c55ded91a20c', 1000), alt: 'Showroom', caption: 'Materialwand' },
          { src: img('1615874694520-474822394e73', 1000), alt: 'Schlafzimmer', caption: 'leichte Linien' },
          { src: img('1600607687920-4e2a09cf159d', 1000), alt: 'Stoffmuster', caption: 'Stoff und Struktur' },
        ],
      }, paperTokens),
      section('newsPreview', {
        headline: 'Mehr Ideen im Journal.',
        subline: 'Kurze Beiträge aus Beratung, Showroom und Materialwelt.',
        collectionKey: 'news',
        linkLabel: 'Journal lesen',
        linkHref: '/news',
      }, warmTokens),
    ],
  },
  {
    slug: 'leistungen',
    title: 'Leistungen',
    seo: {
      metaTitle: 'Leistungen | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Wohnberatung, Sofa-Beratung, Schlafzimmerplanung, Lieferung und Montage bei Möbelhaus Lichtblick Regensburg.',
      ogImage: img('1600210492486-724fe5c67fb0', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Leistungen',
        headline: 'Möbel kaufen ist leicht. Richtig auswählen ist Beratung.',
        subline: 'Unsere Leistungen helfen, aus schönen Einzelstücken einen funktionierenden Raum zu machen.',
        bgImage: img('1600210492486-724fe5c67fb0'),
        overlayColor: '#111820',
        overlayOpacity: 0.58,
      }, heroTokens),
      section('servicesGrid', {
        badgeText: 'Alles im Überblick',
        headline: 'Wobei wir Sie begleiten.',
        subline: 'Jede Leistung kann einzeln starten und später wachsen.',
        manualCards: [
          { title: 'Wohnberatung', text: 'Raum, Licht, Budget und Bestand sortieren.', icon: 'LayoutPanelTop', href: '/c/leistungen/wohnberatung' },
          { title: 'Sofa & Wohnen', text: 'Sitzkomfort, Stoffe, Teppiche und Beisteller abstimmen.', icon: 'Sofa', href: '/c/leistungen/sofa-wohnen' },
          { title: 'Schlafen & Stauraum', text: 'Ruhige Lösungen für Betten, Schränke und Ordnung.', icon: 'BedDouble', href: '/c/leistungen/schlafen-stauraum' },
          { title: 'Lieferung & Montage', text: 'Planbarer Aufbau ohne Lieferstress.', icon: 'Truck', href: '/c/leistungen/lieferung-montage' },
        ],
      }, paperTokens),
      section('collectionList', {
        headline: 'Detailseiten',
        subline: 'Mehr zu Beratung, Sortiment und Service.',
        collectionKey: 'leistungen',
        columns: '4',
        showImage: true,
        showDate: false,
        showExcerpt: true,
        showSortControls: false,
      }, warmTokens),
      section('comparisonTable', {
        badge: 'Vergleich',
        headline: 'Was ist im Termin enthalten?',
        text: 'Damit klar ist, was Sie erwarten können.',
        columns: [{ label: 'Kurzcheck' }, { label: 'Wohnberatung' }, { label: 'Raumkonzept' }],
        rows: [
          { feature: 'Fotos besprechen', values: ['✓', '✓', '✓'] },
          { feature: 'Materialmuster', values: ['—', '✓', '✓'] },
          { feature: 'Lieferplanung', values: ['—', 'bei Bedarf', '✓'] },
          { feature: 'Budgetrahmen', values: ['kurz', 'klar', 'detailliert'] },
        ],
        highlightCol: 1,
      }, paperTokens),
      section('testimonials', {
        headline: 'Beratung, die Entscheidungen erleichtert.',
        subline: 'Rückmeldungen aus Regensburg und Umgebung.',
        items: [
          { quote: 'Wir kamen wegen eines Sofas und gingen mit einem Plan für den ganzen Raum.', name: 'N. Reuter', context: 'Wohnberatung', rating: 5 },
          { quote: 'Die Stoffmuster zu Hause waren entscheidend. Im Showroom hätten wir anders gewählt.', name: 'Familie Schmid', context: 'Sofa-Auswahl', rating: 5 },
          { quote: 'Montage, Lieferung, Kommunikation: alles sauber.', name: 'P. Lenz', context: 'Lieferung', rating: 5 },
          { quote: 'Kein Druck. Einfach gute Fragen und schöne Vorschläge.', name: 'Maria K.', context: 'Esszimmer', rating: 5 },
        ],
      }, warmTokens),
      section('ctaBand', {
        badgeText: 'Starten',
        headline: 'Sie müssen noch nicht wissen, was genau Sie brauchen.',
        subline: 'Dafür ist die Beratung da.',
        ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt', icon: 'CalendarDays' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    seo: {
      metaTitle: 'Über uns | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Möbelhaus Lichtblick ist ein inhabergeführtes Einrichtungshaus in Regensburg mit Showroom, Beratung und Service.',
      ogImage: img('1598928506311-c55ded91a20c', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Über uns',
        headline: 'Ein Möbelhaus, das lieber erklärt als überredet.',
        subline: 'Seit 1998 beraten wir in Regensburg Menschen, die Räume bewusst einrichten wollen.',
        bgImage: img('1598928506311-c55ded91a20c'),
        overlayColor: '#111820',
        overlayOpacity: 0.55,
      }, heroTokens),
      section('textImage', {
        badge: 'Unsere Geschichte',
        headline: 'Lichtblick begann mit einem kleinen Laden und einer klaren Idee.',
        text: '<p>Gute Möbel brauchen Beratung, die Alltag versteht. Aus dieser Idee ist ein Showroom entstanden, in dem Materialien, Möbel und Menschen zusammenkommen.</p><p>Wir suchen Stücke nicht nach Lautstärke aus, sondern danach, ob sie lange funktionieren, gut altern und Räume ruhiger machen.</p>',
        image: img('1598928506311-c55ded91a20c', 1400),
        imageAlt: 'Showroom Möbelhaus Lichtblick',
        layout: 'image-left',
        items: [
          { icon: 'HeartHandshake', title: 'Beratung', text: 'Nah, ehrlich und nachvollziehbar.' },
          { icon: 'SwatchBook', title: 'Material', text: 'Live prüfen statt blind bestellen.' },
          { icon: 'Truck', title: 'Service', text: 'Lieferung ist Teil des Produkts.' },
          { icon: 'MapPin', title: 'Regensburg', text: 'Regional verwurzelt seit 1998.' },
        ],
      }, paperTokens),
      section('timeline', {
        badge: 'Meilensteine',
        headline: 'Gewachsen, aber nicht beliebig geworden.',
        subline: 'Wir haben uns verändert, ohne den Beratungsanspruch zu verlieren.',
        entries: [
          { year: '1998', title: 'Erster Showroom', text: 'Start in Regensburg mit ausgewählten Massivholzmöbeln.' },
          { year: '2007', title: 'Wohnberatung', text: 'Materialwände, Stoffmuster und Beratungstisch werden zum Kern.' },
          { year: '2016', title: 'Montagepartner', text: 'Feste Teams übernehmen Lieferung und Aufbau.' },
          { year: '2025', title: 'Lichtblick heute', text: 'Showroom, Beratung, Materialwelt und regionaler Service.' },
        ],
      }, warmTokens),
      section('team', {
        badgeText: 'Team',
        headline: 'Menschen, die Möbel nicht nur verkaufen.',
        subline: 'Beratung, Einkauf, Showroom und Montage arbeiten eng zusammen.',
        membersHeadline: 'Ihre Ansprechpartner',
        members: [
          { name: 'Katharina Lenz', role: 'Wohnberatung & Einkauf', image: img('1494790108377-be9c29b29330', 900), bio: 'Sortiert Räume schnell und stellt die richtigen Materialfragen.' },
          { name: 'Jonas Reitmeier', role: 'Showroom & Lieferung', image: img('1500648767791-00dcc994a43e', 900), bio: 'Denkt Möbel vom Aufbau her und kennt jedes Treppenhausproblem.' },
          { name: 'Mira Hofmann', role: 'Textil & Licht', image: img('1544005313-94ddf0286df2', 900), bio: 'Verbindet Stoffe, Teppiche und Leuchten zu ruhigen Stimmungen.' },
        ],
        storyHeadline: 'Unser Maßstab',
        storyText: 'Ein Raum ist dann gut, wenn man ihn nicht ständig erklären muss. Er fühlt sich richtig an, funktioniert im Alltag und bleibt lange schön.',
        storyImage: img('1600607687920-4e2a09cf159d', 1200),
        valuesHeadline: 'Was uns wichtig ist',
        values: [
          { icon: 'BadgeCheck', title: 'Ehrlichkeit', text: 'Wir sprechen auch aus, wenn etwas nicht passt.' },
          { icon: 'Sparkles', title: 'Ruhe', text: 'Gute Einrichtung muss nicht laut sein.' },
          { icon: 'PackageCheck', title: 'Verlässlichkeit', text: 'Lieferung und Aufbau gehören zur Qualität.' },
        ],
        stats: [
          { value: '26', label: 'Jahre' },
          { value: '3', label: 'Berater' },
          { value: '1', label: 'Showroom' },
        ],
      }, paperTokens),
      section('principlesGrid', {
        badge: 'Haltung',
        headline: 'Wir verkaufen nicht alles, was möglich wäre.',
        subline: 'Das ist Absicht.',
        principles: [
          { eyebrow: '01', title: 'Kuratiert', text: 'Weniger Auswahl, bessere Entscheidungen.' },
          { eyebrow: '02', title: 'Erklärbar', text: 'Sie sollen wissen, warum etwas passt.' },
          { eyebrow: '03', title: 'Regional', text: 'Wir bleiben ansprechbar, auch nach der Lieferung.' },
          { eyebrow: '04', title: 'Langlebig', text: 'Möbel sollen altern dürfen, nicht schnell ersetzt werden.' },
        ],
        cta: { label: 'Showroom besuchen', href: '/kontakt' },
      }, warmTokens),
      section('ctaBand', {
        badgeText: 'Vorbeikommen',
        headline: 'Der beste Eindruck entsteht im Raum.',
        subline: 'Besuchen Sie uns in Regensburg und bringen Sie gern Fotos Ihres Zuhauses mit.',
        ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'MapPin' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'news',
    title: 'Journal',
    seo: {
      metaTitle: 'Journal | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Einrichtungstipps, Materialwissen und Showroom-Neuigkeiten von Möbelhaus Lichtblick Regensburg.',
      ogImage: img('1600607687920-4e2a09cf159d', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Journal',
        headline: 'Kleine Notizen für bessere Räume.',
        subline: 'Materialien, Licht, Einrichtungsideen und Dinge, die wir in Beratungen oft erklären.',
        bgImage: img('1600607687920-4e2a09cf159d'),
        overlayColor: '#111820',
        overlayOpacity: 0.55,
      }, heroTokens),
      section('newsGrid', {
        headline: 'Alle Beiträge',
        subline: 'Kurz, konkret und aus dem Showroom gedacht.',
        collectionKey: 'news',
        columns: '3',
        showImage: true,
        showDate: true,
        showExcerpt: true,
      }, paperTokens),
      section('ctaBand', {
        badgeText: 'Fragen?',
        headline: 'Sie haben eine konkrete Raumsituation?',
        subline: 'Schicken Sie uns ein Foto oder kommen Sie im Showroom vorbei.',
        ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt', icon: 'Send' },
      }, accentCtaTokens),
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    seo: {
      metaTitle: 'Kontakt | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Kontakt, Öffnungszeiten und Anfahrt zum Möbelhaus Lichtblick in Regensburg.',
      ogImage: img('1598928506311-c55ded91a20c', 1600),
    },
    sections: [
      section('collectionHero', {
        category: 'Kontakt',
        headline: 'Kommen Sie vorbei oder schicken Sie uns ein Foto.',
        subline: 'Wir melden uns mit einer passenden Einschätzung und einem sinnvollen nächsten Schritt.',
        bgImage: img('1598928506311-c55ded91a20c'),
        overlayColor: '#111820',
        overlayOpacity: 0.52,
      }, heroTokens),
      section('contact', {
        badgeText: 'Showroom',
        headline: 'Möbelhaus Lichtblick Regensburg',
        subline: 'Wir freuen uns über Besuch, Anruf oder eine kurze Nachricht mit Fotos Ihres Raums.',
        introText: 'Für Wohnberatung bitte gern vorab einen Termin vereinbaren.',
        phone: '+49 941 307 48 20',
        email: 'hallo@moebelhaus-lichtblick.de',
        address: 'Prüfeninger Straße 42, 93049 Regensburg',
        formEnabled: true,
        submitLabel: 'Anfrage senden',
        infoCards: [
          { icon: 'MapPin', label: 'Adresse', value: 'Prüfeninger Straße 42, 93049 Regensburg' },
          { icon: 'Phone', label: 'Telefon', value: '+49 941 307 48 20' },
          { icon: 'Mail', label: 'E-Mail', value: 'hallo@moebelhaus-lichtblick.de' },
          { icon: 'Clock', label: 'Öffnungszeiten', value: 'Mo-Fr 10-18 Uhr, Sa 10-15 Uhr' },
        ],
      }, paperTokens),
      section('map', {
        headline: 'Mitten in Regensburg.',
        embedUrl: 'https://www.google.com/maps?q=Pr%C3%BCfeninger%20Stra%C3%9Fe%2042%2093049%20Regensburg&output=embed',
        height: 'm',
      }, warmTokens),
      section('textImage', {
        badge: 'Vor dem Termin',
        headline: 'Was Sie mitbringen können.',
        text: '<p>Fotos vom Raum, grobe Maße, ein paar Lieblingsstücke oder auch Dinge, die Sie stören. Daraus entsteht schneller eine gute Richtung.</p>',
        image: img('1600607687920-4e2a09cf159d', 1200),
        imageAlt: 'Materialmuster im Möbelhaus',
        layout: 'image-right',
        items: [
          { icon: 'Image', title: 'Fotos', text: 'Handybilder reichen völlig.' },
          { icon: 'Ruler', title: 'Maße', text: 'Grob ist besser als gar nicht.' },
          { icon: 'Wallet', title: 'Budget', text: 'Damit Vorschläge realistisch bleiben.' },
          { icon: 'Heart', title: 'Lieblingsstücke', text: 'Was bleiben soll, planen wir mit ein.' },
        ],
      }, paperTokens),
      section('ctaBand', {
        badgeText: 'Showroom',
        headline: 'Der erste Schritt ist ein kurzer Kontakt.',
        subline: 'Wir sagen Ihnen ehrlich, ob ein Termin, ein Foto oder ein Besuch im Showroom sinnvoll ist.',
        ctaPrimary: { label: 'Anfrage senden', href: 'mailto:hallo@moebelhaus-lichtblick.de', icon: 'Send' },
      }, ctaTokens),
    ],
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    seo: {
      metaTitle: 'Impressum | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Impressum von Möbelhaus Lichtblick in Regensburg.',
    },
    sections: [
      section('legalContent', {
        headline: 'Impressum',
        blocks: [
          { title: 'Angaben gemäß § 5 TMG', text: 'Möbelhaus Lichtblick GmbH<br>Prüfeninger Straße 42<br>93049 Regensburg' },
          { title: 'Vertreten durch', text: 'Katharina Lenz und Jonas Reitmeier' },
          { title: 'Kontakt', text: 'Telefon: +49 941 307 48 20<br>E-Mail: hallo@moebelhaus-lichtblick.de' },
          { title: 'Handelsregister', text: 'Registergericht: Amtsgericht Regensburg<br>Registernummer: HRB 18420' },
          { title: 'Umsatzsteuer-ID', text: 'DE312456789' },
          { title: 'Haftung und Urheberrecht', text: 'Die Inhalte dieser Website wurden sorgfältig erstellt. Für externe Links übernehmen wir keine Haftung. Texte, Bilder und Gestaltung sind urheberrechtlich geschützt.' },
        ],
      }, paperTokens),
    ],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    seo: {
      metaTitle: 'Datenschutz | Möbelhaus Lichtblick Regensburg',
      metaDescription: 'Datenschutzhinweise von Möbelhaus Lichtblick in Regensburg.',
    },
    sections: [
      section('legalContent', {
        headline: 'Datenschutzerklärung',
        blocks: [
          { title: 'Verantwortlicher', text: 'Möbelhaus Lichtblick GmbH, Prüfeninger Straße 42, 93049 Regensburg, hallo@moebelhaus-lichtblick.de' },
          { title: 'Hosting', text: 'Unsere Website wird bei einem professionellen Hosting-Anbieter betrieben. Dabei werden technische Zugriffsdaten verarbeitet, um die Website sicher auszuliefern.' },
          { title: 'Kontaktformular', text: 'Wenn Sie uns über das Formular kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage.' },
          { title: 'Cookies und Analyse', text: 'Technisch notwendige Cookies können eingesetzt werden. Analyse-Tools werden nur verwendet, wenn sie rechtlich zulässig eingebunden sind.' },
          { title: 'Ihre Rechte', text: 'Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Beschwerde bei einer Aufsichtsbehörde.' },
          { title: 'Speicherdauer', text: 'Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Pflichten bestehen.' },
        ],
      }, paperTokens),
    ],
  },
];

module.exports = {
  slug: 'retail',
  pat: PAT,
  wipe: true,
  style: { style: 'classic' },
  brand: {
    companyName: 'Möbelhaus Lichtblick',
    tagline: 'Möbel, Beratung und Lieferung aus Regensburg',
    primaryColor: C.ink,
    secondaryColor: C.clay,
    accentColor: C.rust,
    logoDisplay: 'name',
    headingFont: 'Nunito Sans',
    bodyFont: 'Inter',
    topBarColor: C.ink,
    footerColor: C.ink,
  },
  contact: {
    phone: '+49 941 307 48 20',
    email: 'hallo@moebelhaus-lichtblick.de',
    address: 'Prüfeninger Straße 42, 93049 Regensburg',
    whatsapp: '+499413074820',
    whatsappEnabled: true,
  },
  design: {
    sectionBg: C.linen,
    sectionBgAlt: C.sand,
    cardBg: '#FFFFFF',
    cardBorder: C.border,
    heading: C.ink,
    subheading: '#4C4037',
    body: '#3F4750',
    muted: C.muted,
    brand: C.ink,
    accent: C.clay,
    icon: C.clay,
    buttonBg: C.ink,
    buttonText: '#FFFFFF',
    buttonSecondaryBg: '#FFFFFF',
    buttonSecondaryText: C.ink,
    badgeBg: '#F1E1D2',
    badgeText: C.ink,
    footerBg: C.ink,
    footerText: '#FFFFFF',
    navBg: 'rgba(24,33,42,0.82)',
    navText: '#FFFFFF',
    navCtaBg: '#FFFFFF',
    navCtaText: C.ink,
    onDarkHeading: '#FFFFFF',
    onDarkBody: 'rgba(255,255,255,0.86)',
    onDarkMuted: 'rgba(255,255,255,0.68)',
  },
  socialLinks: {
    instagram: 'https://instagram.com/moebelhauslichtblick',
    facebook: 'https://facebook.com/moebelhauslichtblick',
    google: 'https://www.google.com/search?q=M%C3%B6belhaus+Lichtblick+Regensburg',
    pinterest: 'https://pinterest.com/moebelhauslichtblick',
  },
  openingHours: {
    monday: { open: '10:00', close: '18:00' },
    tuesday: { open: '10:00', close: '18:00' },
    wednesday: { open: '10:00', close: '18:00' },
    thursday: { open: '10:00', close: '18:00' },
    friday: { open: '10:00', close: '18:00' },
    saturday: { open: '10:00', close: '15:00' },
    sunday: { closed: true },
  },
  formFields: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'E-Mail', type: 'email', required: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false },
      { name: 'topic', label: 'Worum geht es?', type: 'select', required: true, options: ['Wohnberatung', 'Sofa & Wohnen', 'Schlafen & Stauraum', 'Lieferung & Montage', 'Sonstiges'] },
      { name: 'message', label: 'Nachricht', type: 'textarea', required: true },
    ],
  },
  seoGlobal: {
    titleTemplate: '%s | Möbelhaus Lichtblick',
    defaultTitle: 'Möbelhaus Lichtblick Regensburg',
    defaultDescription: 'Inhabergeführtes Möbelhaus in Regensburg mit kuratiertem Sortiment, Wohnberatung, Lieferung und Montage.',
    defaultOgImage: img('1616486338812-3dadae4b4ace', 1600),
    canonicalBase: 'https://demo.flamingomedia.online/demo/retail',
    locale: 'de_DE',
  },
  navigation,
  footer,
  collections: [
    { key: 'leistungen', label: 'Leistungen', items: services },
    { key: 'news', label: 'Journal', items: news },
  ],
  pages,
  publish: true,
};

if (require.main === module) {
  run(module.exports).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
