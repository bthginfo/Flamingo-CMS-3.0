/**
 * Example preview data for each section type.
 * Used by the section-preview route to render isolated section previews.
 */
export const SECTION_PREVIEW_DATA: Record<string, Record<string, unknown>> = {
  hero: {
    headline: 'Willkommen bei uns',
    subline: 'Professionell, zuverlässig und mit Leidenschaft für unsere Kunden.',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    overlayOpacity: 0.6,
    badgeText: 'Seit 2010',
    primaryCta: { label: 'Jetzt anfragen', href: '#' },
    secondaryCta: { label: 'Mehr erfahren', href: '#' },
  },
  testimonials: {
    headline: 'Was unsere Kunden sagen',
    badgeText: 'Kundenstimmen',
    items: [
      { quote: 'Absolut professionelle Arbeit! Schnell, sauber und fair. Jederzeit wieder.', name: 'Maria S.', context: 'Stammkundin seit 2022', rating: 5 },
      { quote: 'Von der Beratung bis zur Umsetzung alles top. Kann ich nur weiterempfehlen.', name: 'Thomas K.', context: 'Neukunde', rating: 5 },
      { quote: 'Endlich ein Anbieter, der hält was er verspricht. Sehr zufrieden!', name: 'Julia M.', context: 'Empfehlung von Freunden', rating: 5 },
    ],
  },
  faq: {
    headline: 'Häufige Fragen',
    items: [
      { question: 'Wie lange dauert die Bearbeitung?', answer: 'In der Regel 2-3 Werktage. Bei dringenden Anfragen bieten wir Express-Service an.' },
      { question: 'Was kostet eine Erstberatung?', answer: 'Die Erstberatung ist kostenfrei und unverbindlich. Vereinbaren Sie einfach einen Termin.' },
      { question: 'Gibt es eine Garantie?', answer: 'Ja, auf alle unsere Leistungen erhalten Sie mindestens 2 Jahre Garantie.' },
    ],
  },
  ctaBand: {
    headline: 'Bereit loszulegen?',
    subline: 'Kontaktieren Sie uns für ein unverbindliches Angebot.',
    ctaPrimary: { label: 'Jetzt anfragen', href: '#', icon: 'arrowRight' },
  },
  uspStrip: {
    items: [
      { icon: 'shield', text: '10 Jahre Erfahrung' },
      { icon: 'clock', text: 'Schnelle Reaktionszeit' },
      { icon: 'star', text: 'Top-Bewertungen' },
      { icon: 'award', text: 'Zertifiziert' },
    ],
  },
  servicesGrid: {
    headline: 'Unsere Leistungen',
    subline: 'Alles aus einer Hand — professionell und zuverlässig.',
    services: [
      { title: 'Beratung', description: 'Individuelle Beratung für Ihr Projekt.', icon: 'messageCircle' },
      { title: 'Planung', description: 'Detaillierte Projektplanung und Kostenvoranschlag.', icon: 'clipboard' },
      { title: 'Umsetzung', description: 'Fachgerechte Ausführung mit Qualitätsgarantie.', icon: 'wrench' },
      { title: 'Service', description: 'Wartung und Support auch nach Projektabschluss.', icon: 'headphones' },
    ],
  },
  processSteps: {
    headline: 'So arbeiten wir',
    steps: [
      { title: 'Anfrage', description: 'Sie kontaktieren uns mit Ihrem Anliegen.' },
      { title: 'Beratung', description: 'Wir besprechen Ihre Wünsche und Möglichkeiten.' },
      { title: 'Angebot', description: 'Sie erhalten ein transparentes Festpreisangebot.' },
      { title: 'Umsetzung', description: 'Wir setzen Ihr Projekt termingerecht um.' },
    ],
  },
  contact: {
    headline: 'Kontakt aufnehmen',
    subline: 'Wir freuen uns auf Ihre Nachricht.',
    infoCards: [
      { icon: 'phone', label: 'Telefon', value: '+49 123 456 7890' },
      { icon: 'mail', label: 'E-Mail', value: 'info@beispiel.de' },
      { icon: 'mapPin', label: 'Adresse', value: 'Musterstraße 1, 12345 Berlin' },
    ],
    formEnabled: true,
    submitLabel: 'Absenden',
  },
  team: {
    headline: 'Unser Team',
    subline: 'Die Menschen hinter dem Unternehmen.',
    members: [
      { name: 'Max Mustermann', role: 'Geschäftsführer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: '15 Jahre Branchenerfahrung.' },
      { name: 'Anna Schmidt', role: 'Projektleiterin', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', bio: 'Spezialistin für komplexe Projekte.' },
      { name: 'Tom Weber', role: 'Techniker', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Meister seines Fachs.' },
    ],
  },
  textImage: {
    headline: 'Über uns',
    text: '<p>Seit über 10 Jahren stehen wir für Qualität und Zuverlässigkeit. Unser erfahrenes Team arbeitet mit modernsten Methoden und legt größten Wert auf Kundenzufriedenheit.</p><p>Wir freuen uns, Sie kennenzulernen!</p>',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    imageAlt: 'Unser Team bei der Arbeit',
  },
  galleryGrid: {
    headline: 'Unsere Arbeiten',
    images: [
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', alt: 'Projekt 1' },
      { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80', alt: 'Projekt 2' },
      { src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&q=80', alt: 'Projekt 3' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', alt: 'Projekt 4' },
    ],
  },
  portfolio: {
    headline: 'Referenzen',
    ctaLabel: 'Alle Projekte',
    ctaHref: '#',
    projects: [
      { title: 'Projekt Alpha', category: 'Neubau', description: 'Komplette Sanierung eines Altbaus.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
      { title: 'Projekt Beta', category: 'Renovierung', description: 'Moderne Bürogestaltung.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80' },
    ],
  },
  map: {
    headline: 'So finden Sie uns',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.404954!3d52.520008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
    height: 'm',
  },
  statsCounter: {
    headline: 'In Zahlen',
    stats: [
      { value: 500, suffix: '+', label: 'Projekte' },
      { value: 15, suffix: ' Jahre', label: 'Erfahrung' },
      { value: 98, suffix: '%', label: 'Zufriedenheit' },
      { value: 24, suffix: 'h', label: 'Erreichbarkeit' },
    ],
  },
  socialProofBar: {
    items: [
      { value: '4.9 ★', label: 'Google Bewertung' },
      { value: '500+', label: 'Projekte' },
      { value: '15+', label: 'Jahre Erfahrung' },
    ],
  },
  logoMarquee: {
    logos: [
      { name: 'Partner 1', image: 'https://via.placeholder.com/120x40?text=Partner+1' },
      { name: 'Partner 2', image: 'https://via.placeholder.com/120x40?text=Partner+2' },
      { name: 'Partner 3', image: 'https://via.placeholder.com/120x40?text=Partner+3' },
    ],
  },
  richText: {
    content: '<h2>Beispiel-Überschrift</h2><p>Dies ist ein Beispieltext. Er zeigt wie formatierter Inhalt dargestellt wird.</p><ul><li>Punkt eins</li><li>Punkt zwei</li><li>Punkt drei</li></ul>',
  },
  videoEmbed: {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Beispiel-Video',
  },
  servicePackages: {
    headline: 'Unsere Pakete',
    packages: [
      { title: 'Basis', price: '49 €/Monat', features: ['Feature A', 'Feature B', 'Feature C'], cta: { label: 'Wählen', href: '#' } },
      { title: 'Premium', price: '99 €/Monat', features: ['Alles aus Basis', 'Feature D', 'Feature E', 'Prioritäts-Support'], highlighted: true, cta: { label: 'Wählen', href: '#' } },
      { title: 'Enterprise', price: 'Auf Anfrage', features: ['Alles aus Premium', 'Dedizierter Ansprechpartner', 'Custom Features'], cta: { label: 'Kontakt', href: '#' } },
    ],
  },
  newsPreview: {
    headline: 'Aktuelles',
    items: [
      { title: 'Neuer Service verfügbar', excerpt: 'Ab sofort bieten wir auch...', date: '2026-05-15', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', href: '#' },
      { title: 'Auszeichnung erhalten', excerpt: 'Wir freuen uns über...', date: '2026-04-20', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', href: '#' },
    ],
  },
  newsGrid: {
    headline: 'Aktuelle Beiträge',
    items: [
      { title: 'Neuer Service verfügbar', excerpt: 'Ab sofort bieten wir auch...', date: '2026-05-15', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', href: '#' },
      { title: 'Auszeichnung erhalten', excerpt: 'Wir freuen uns über...', date: '2026-04-20', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', href: '#' },
      { title: 'Teamzuwachs', excerpt: 'Unser Team wächst weiter...', date: '2026-03-10', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80', href: '#' },
    ],
  },
  noticeBanner: {
    headline: 'Betriebsurlaub',
    text: 'Vom 24.12. bis 02.01. sind wir im Betriebsurlaub. Ab dem 03.01. sind wir wieder für Sie da!',
    variant: 'info',
  },
  collectionHero: {
    headline: 'Neuer Blogbeitrag',
    subline: 'Alles was Sie über unser neuestes Projekt wissen müssen.',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    category: 'Neuigkeiten',
    date: '2026-05-20',
    overlayOpacity: 0.5,
  },

  // === SHARED SECTIONS ===
  stats: {
    headline: 'Zahlen & Fakten',
    stats: [
      { value: 500, suffix: '+', label: 'Projekte abgeschlossen' },
      { value: 15, label: 'Jahre Erfahrung' },
      { value: 98, suffix: '%', label: 'Kundenzufriedenheit' },
    ],
  },
  logoCloud: {
    headline: 'Unsere Partner',
    subline: 'Vertrauen führender Unternehmen.',
    logos: [
      { src: 'https://via.placeholder.com/140x50?text=Logo+1', alt: 'Partner 1' },
      { src: 'https://via.placeholder.com/140x50?text=Logo+2', alt: 'Partner 2' },
      { src: 'https://via.placeholder.com/140x50?text=Logo+3', alt: 'Partner 3' },
    ],
  },
  ctaLinks: {
    headline: 'Unsere Services',
    subline: 'Wählen Sie den passenden Bereich.',
    links: [
      { label: 'Beratung', href: '#', icon: 'messageCircle' },
      { label: 'Projekte', href: '#', icon: 'briefcase' },
      { label: 'Kontakt', href: '#', icon: 'mail' },
    ],
  },
  serviceDetail: {
    headline: 'Leistung im Detail',
    subline: 'Was wir für Sie tun können.',
    badgeText: 'Top-Service',
    items: [
      { title: 'Erstberatung', description: 'Kostenlose Analyse Ihrer Situation.', icon: 'messageCircle' },
      { title: 'Planung', description: 'Detaillierter Plan mit Zeitrahmen.', icon: 'clipboard' },
      { title: 'Umsetzung', description: 'Professionelle Ausführung.', icon: 'wrench' },
    ],
  },
  headerBanner: {
    items: [
      { text: '🔥 Jetzt 10% Rabatt sichern!' },
      { text: '📞 Kostenlose Beratung: 0800 123 456' },
    ],
    style: 'accent',
  },
  embed: {
    headline: 'Einbettung',
    subline: 'Externe Integration',
    mode: 'code',
    embedCode: '<div style="padding:2rem;background:#f3f4f6;border-radius:8px;text-align:center;color:#6b7280;">Embed-Vorschau (z.B. Buchungstool, Bewertungen)</div>',
    height: 300,
  },
  freeText: {
    content: '<h2>Freitext-Abschnitt</h2><p>Hier können Sie beliebigen formatierten Text eingeben.</p>',
  },
  legalContent: {
    headline: 'Impressum',
    blocks: [
      { heading: 'Angaben gemäß § 5 TMG', content: 'Musterfirma GmbH\nMusterstraße 1\n12345 Berlin' },
      { heading: 'Kontakt', content: 'Telefon: +49 123 456 7890\nE-Mail: info@beispiel.de' },
    ],
  },
  bentoGrid: {
    headline: 'Unsere Stärken',
    subline: 'Was uns besonders macht.',
    badge: 'Highlights',
    items: [
      { title: 'Innovation', description: 'Modernste Technik und Verfahren.', icon: 'zap', size: 'lg' },
      { title: 'Qualität', description: 'Höchste Standards.', icon: 'award', size: 'sm' },
      { title: 'Service', description: '24/7 erreichbar.', icon: 'headphones', size: 'sm' },
      { title: 'Nachhaltigkeit', description: 'Umweltbewusst handeln.', icon: 'leaf', size: 'md' },
    ],
  },
  testimonialMarquee: {
    headline: 'Das sagen unsere Kunden',
    subline: 'Über 500 zufriedene Kunden.',
    badge: 'Bewertungen',
    items: [
      { quote: 'Fantastischer Service!', name: 'Lisa M.', rating: 5 },
      { quote: 'Sehr professionell und schnell.', name: 'Peter R.', rating: 5 },
      { quote: 'Top Qualität zum fairen Preis.', name: 'Sarah K.', rating: 5 },
      { quote: 'Kann ich nur weiterempfehlen!', name: 'Michael B.', rating: 5 },
    ],
  },
  featureShowcase: {
    headline: 'Warum wir?',
    subline: 'Die Vorteile auf einen Blick.',
    badge: 'Features',
    text: 'Wir vereinen Erfahrung, Innovation und Leidenschaft.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    features: ['10+ Jahre Erfahrung', 'Modernste Ausstattung', 'Persönliche Betreuung', 'Faire Preise'],
    ctaLabel: 'Mehr erfahren',
    ctaHref: '#',
  },
  comparisonTable: {
    badge: 'Vergleich',
    headline: 'Unsere Pakete im Überblick',
    text: 'Finden Sie das passende Paket.',
    columns: [{ title: 'Basis' }, { title: 'Premium' }, { title: 'Enterprise' }],
    rows: [
      { label: 'Support', values: ['E-Mail', 'Telefon + E-Mail', 'Dediziert'] },
      { label: 'Projekte', values: ['5', '20', 'Unbegrenzt'] },
      { label: 'SLA', values: ['—', '24h', '4h'] },
    ],
    highlightCol: 1,
  },
  timeline: {
    badge: 'Geschichte',
    headline: 'Unsere Meilensteine',
    subline: 'Der Weg zu dem, was wir heute sind.',
    entries: [
      { year: '2010', title: 'Gründung', text: 'Start des Unternehmens in Berlin.' },
      { year: '2015', title: 'Expansion', text: 'Eröffnung des zweiten Standorts.' },
      { year: '2020', title: 'Digitalisierung', text: 'Vollständig digitale Prozesse.' },
      { year: '2025', title: 'Jubiläum', text: '15 Jahre Innovation und Wachstum.' },
    ],
  },

  // === TATTOO ===
  styleGallery: {
    headline: 'Unsere Stile',
    subline: 'Entdecken Sie unsere Vielfalt.',
    styles: [
      { name: 'Blackwork', image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&q=80', description: 'Kräftige schwarze Linien und Flächen' },
      { name: 'Fineline', image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&q=80', description: 'Filigrane, detaillierte Linien' },
      { name: 'Watercolor', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80', description: 'Aquarell-artige Farben und Verläufe' },
    ],
  },
  artistGrid: {
    headline: 'Unsere Künstler',
    subline: 'Finde Deinen Match.',
    artists: [
      { name: 'Artist 1', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', styles: ['Blackwork', 'Dotwork'], bio: 'Spezialisiert auf geometrische Muster.', instagram: 'artist1' },
      { name: 'Artist 2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', styles: ['Fineline', 'Watercolor'], bio: 'Bekannt für filigrane Designs.', instagram: 'artist2' },
    ],
  },
  artistHero: {
    name: 'Julia Ink',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    bio: 'Spezialisiert auf Fineline und botanische Motive. Seit 8 Jahren im Studio.',
    styles: ['Fineline', 'Botanical', 'Minimalist'],
    instagram: 'julia_ink',
    experience: '8 Jahre',
  },
  tattooBookingCta: {
    headline: 'Termin anfragen',
    subline: 'Schick uns Deine Idee und wir melden uns innerhalb von 48h.',
    ctaLabel: 'Terminanfrage starten',
    ctaHref: '#kontakt',
    hints: ['Mindestgröße: 5cm', 'Anzahlung: 50€', 'Mindestalter: 18 Jahre'],
  },
  pricingInfo: {
    headline: 'Preise & Konditionen',
    subline: 'Transparent und fair.',
    items: [
      { label: 'Stundensatz', value: '120 €/h', description: 'Für alle Stile' },
      { label: 'Mindestpreis', value: '80 €', description: 'Auch für kleine Motive' },
      { label: 'Beratung', value: 'Kostenlos', description: 'Unverbindliches Erstgespräch' },
    ],
    notes: ['Anzahlung von 50€ bei Terminbuchung', 'Preise inkl. MwSt.'],
  },
  tattooBooking: {
    headline: 'Terminanfrage',
    subline: 'Beschreib uns Dein Wunschmotiv – wir melden uns innerhalb von 48h.',
    artists: ['Julia Ink', 'Max Shadow', 'Egal / Offen'],
  },
  flashDayBanner: {
    headline: 'Flash Day',
    date: '15. Juni 2026',
    description: 'Über 50 exklusive Motive zum Sonderpreis – first come, first served!',
    ctaLabel: 'Motiv sichern',
    ctaHref: '#kontakt',
    bgColor: '#dc2626',
  },
  aftercareSteps: {
    headline: 'Nachsorge',
    subline: 'So heilt Dein Tattoo perfekt.',
    steps: [
      { title: 'Tag 1-3', description: 'Folie tragen, nicht kratzen.' },
      { title: 'Tag 4-14', description: 'Dünn eincremen, Sonne meiden.' },
      { title: 'Ab Tag 15', description: 'Normal pflegen, weiterhin Sonnenschutz.' },
    ],
  },

  // === CAFÉ ===
  drinkMenu: {
    headline: 'Getränkekarte',
    categories: [
      { name: 'Kaffee', items: [{ name: 'Espresso', price: '2,80 €', description: 'Klassisch italienisch' }, { name: 'Cappuccino', price: '3,90 €', description: 'Mit cremigem Milchschaum' }] },
      { name: 'Tee', items: [{ name: 'Earl Grey', price: '3,20 €', description: 'Schwarztee mit Bergamotte' }] },
    ],
  },
  foodMenu: {
    headline: 'Speisekarte',
    categories: [
      { name: 'Frühstück', items: [{ name: 'Granola Bowl', price: '8,90 €', description: 'Mit frischem Obst und Joghurt' }, { name: 'Avocado Toast', price: '9,50 €', description: 'Auf Sauerteigbrot' }] },
    ],
  },
  dailySpecials: {
    headline: 'Diese Woche bei uns',
    subline: 'Frisch zubereitet und saisonal.',
    specials: [
      { day: 'Mo', title: 'Matcha Monday', description: 'Alle Matcha-Drinks 20% reduziert', price: 'ab 3,60 €' },
      { day: 'Mi', title: 'Wine & Cheese', description: 'Ausgewählte Naturweine mit Käseplatte', price: '18,50 €' },
    ],
  },
  atmosphereGallery: {
    headline: 'Atmosphäre',
    images: [
      { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', alt: 'Café Innenraum' },
      { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', alt: 'Kaffee Latte Art' },
      { src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80', alt: 'Gemütliche Ecke' },
      { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', alt: 'Terrasse' },
    ],
  },
  cafeEventCalendar: {
    headline: 'Events',
    subline: 'Was bei uns los ist.',
    events: [
      { title: 'Jazz Evening', date: '2026-06-01', time: '19:00', description: 'Live-Jazz mit lokalem Trio' },
      { title: 'Latte Art Workshop', date: '2026-06-08', time: '14:00', description: 'Lerne die Kunst der Milchschaum-Muster' },
    ],
  },
  locationVibe: {
    headline: 'Komm vorbei',
    address: 'Musterstraße 42, 10115 Berlin',
    description: 'Mitten im Kiez, mit Sonnenterrasse und WLAN.',
    hours: [
      { day: 'Mo–Fr', time: '08:00 – 20:00' },
      { day: 'Sa–So', time: '09:00 – 18:00' },
    ],
    vibeText: 'Dein Wohnzimmer in der Stadt.',
  },

  // === RESTAURANT ===
  menu: {
    headline: 'Speisekarte',
    subline: 'Saisonale Gerichte aus frischen Zutaten',
    badgeText: 'Aus der Küche',
    categories: [
      { name: 'Vorspeisen', items: [{ name: 'Carpaccio', price: '14,50 €', description: 'Rindercarpaccio mit Rucola und Parmesan' }] },
      { name: 'Hauptgänge', items: [{ name: 'Risotto', price: '19,90 €', description: 'Steinpilzrisotto mit Trüffelöl' }, { name: 'Dorade', price: '24,90 €', description: 'Gegrillte Dorade mit Gemüse' }] },
    ],
  },
  signatureDishes: {
    headline: 'Empfehlungen des Hauses',
    badgeText: 'Signature Dishes',
    dishes: [
      { name: 'Wagyu Burger', price: '28,90 €', description: 'Mit Trüffelmayo und Brioche-Bun', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { name: 'Tuna Tataki', price: '22,50 €', description: 'Mit Sesam und Ponzu-Sauce', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
    ],
  },
  reservation: {
    headline: 'Tisch reservieren',
    badgeText: 'Reservierung',
    subline: 'Sichern Sie sich einen Platz.',
    formEnabled: true,
    submitLabel: 'Anfrage senden',
    timeHint: 'Küche: 12:00–14:30 & 18:00–22:00',
  },
  openingHours: {
    headline: 'Öffnungszeiten',
    badgeText: 'Besuchen Sie uns',
    days: [
      { day: 'Montag – Freitag', time: '11:30 – 23:00' },
      { day: 'Samstag', time: '17:00 – 24:00' },
      { day: 'Sonntag', time: 'Ruhetag' },
    ],
    kitchenHoursHeadline: 'Küchenzeiten',
    kitchenHoursText: 'Warme Küche bis 22:00 Uhr',
  },
  ambience: {
    headline: 'Atmosphäre',
    badgeText: 'Restaurant',
    imagePrimary: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    highlights: [
      { title: 'Sonnenterrasse', description: '50 Plätze mit Blick ins Grüne' },
      { title: 'Private Dining', description: 'Separater Raum für bis zu 12 Gäste' },
    ],
  },
  events: {
    headline: 'Events',
    badgeText: 'Kalender',
    events: [
      { title: 'Weinprobe', date: '2026-06-15', description: 'Italienische Weine mit 5-Gänge-Menü', price: '79 €' },
      { title: 'Sonntagsbrunch', date: '2026-06-22', description: 'All-you-can-eat Brunch-Buffet', price: '39 €' },
    ],
  },

  // === HOTEL ===
  bookingStrip: {
    headline: 'Verfügbarkeit prüfen',
    badgeText: 'Direkt buchen',
    submitCta: { label: 'Suchen', href: '#' },
    bookingNote: 'Bestpreis-Garantie bei Direktbuchung',
  },
  roomShowcase: {
    headline: 'Zimmer & Suiten',
    subline: 'Ihr Zuhause auf Zeit.',
    badgeText: 'Aufenthalt',
    rooms: [
      { name: 'Deluxe Doppelzimmer', price: 'ab 149 €/Nacht', size: '32 m²', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', features: ['Kingsize-Bett', 'Balkon', 'Regendusche'] },
      { name: 'Junior Suite', price: 'ab 229 €/Nacht', size: '48 m²', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', features: ['Wohnbereich', 'Whirlpool', 'Minibar'] },
    ],
  },
  offers: {
    headline: 'Angebote',
    badgeText: 'Arrangements',
    offers: [
      { title: 'Romantik-Paket', description: 'Champagner, Spa & Candlelight-Dinner', price: 'ab 349 €', duration: '2 Nächte' },
      { title: 'Wellness-Woche', description: 'Yoga, Massagen & Detox-Menü', price: 'ab 899 €', duration: '5 Nächte' },
    ],
  },
  amenities: {
    headline: 'Ausstattung & Service',
    badgeText: 'Service',
    items: [
      { title: 'Kostenfreies WLAN', icon: 'wifi', description: 'Highspeed im gesamten Hotel' },
      { title: 'Tiefgarage', icon: 'car', description: 'Stellplatz 15 €/Tag' },
      { title: '24h Rezeption', icon: 'clock', description: 'Jederzeit für Sie da' },
      { title: 'Frühstücksbuffet', icon: 'coffee', description: 'Täglich 7:00–10:30' },
    ],
  },
  wellness: {
    headline: 'Wellness & Spa',
    badgeText: 'Spa',
    introText: 'Entspannen Sie Körper und Geist in unserem 500m² Spa-Bereich.',
    imagePrimary: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80',
    treatments: [
      { name: 'Hot-Stone-Massage', duration: '60 Min.', price: '89 €' },
      { name: 'Gesichtsbehandlung', duration: '45 Min.', price: '69 €' },
    ],
    features: [{ title: 'Finnische Sauna' }, { title: 'Infinity-Pool' }, { title: 'Dampfbad' }],
  },
  location: {
    headline: 'Lage & Anreise',
    badgeText: 'Standort',
    addressText: 'Seestraße 1, 83700 Rottach-Egern',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.404954!3d52.520008',
    transportItems: [
      { mode: 'Auto', text: 'A8 Ausfahrt Holzkirchen, dann 20 Min.' },
      { mode: 'Bahn', text: 'München Hbf → Rottach-Egern (1h)' },
    ],
  },
  hotelDining: {
    headline: 'Restaurant & Bar',
    badgeText: 'Genuss',
    introText: 'Kulinarische Highlights aus regionalen Zutaten.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    openingText: 'Frühstück 7–10:30 | Restaurant 18–22 | Bar 16–01',
    menus: [{ title: '3-Gänge-Menü', price: '59 €' }, { title: '5-Gänge-Menü', price: '89 €' }],
    highlights: [{ title: 'Regionale Küche' }, { title: 'Weinbar mit 200+ Positionen' }],
  },
  eventSpaces: {
    headline: 'Events & Tagungen',
    badgeText: 'Räume',
    spaces: [
      { name: 'Konferenzraum', capacity: '50 Personen', features: ['Beamer', 'WLAN', 'Catering'] },
      { name: 'Festsaal', capacity: '120 Personen', features: ['Bühne', 'Tanzfläche', 'Bar'] },
    ],
    ctaPrimary: { label: 'Anfrage senden', href: '#' },
  },
  gallery: {
    headline: 'Galerie',
    badgeText: 'Einblicke',
    images: [
      { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', alt: 'Lobby', category: 'Hotel' },
      { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', alt: 'Suite', category: 'Zimmer' },
      { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=600&q=80', alt: 'Spa', category: 'Wellness' },
    ],
  },

  // === TOURISM ===
  destinationHighlights: {
    items: [
      { title: 'Schloss Neuschwanstein', description: 'Das Märchenschloss König Ludwigs II.', image: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?w=600&q=80', category: 'Kultur' },
      { title: 'Partnachklamm', description: 'Spektakuläre Schlucht bei Garmisch.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', category: 'Natur' },
    ],
  },
  experienceGrid: {
    items: [
      { title: 'Bergwandern', description: 'Über 200 km markierte Wege.', duration: '2–6h', level: 'Mittel', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80' },
      { title: 'Radtouren', description: 'E-Bike-Verleih vor Ort.', duration: '3–5h', level: 'Leicht', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80' },
    ],
  },
  seasonTeaser: {
    seasons: [
      { title: 'Sommer', description: 'Wandern, Baden, Radfahren', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', months: 'Jun–Sep' },
      { title: 'Winter', description: 'Skifahren, Langlauf, Wellness', image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=600&q=80', months: 'Dez–Mär' },
    ],
  },
  eventsCalendar: {
    events: [
      { title: 'Almabtrieb', date: '2026-09-15', location: 'Marktplatz', description: 'Traditioneller Almabtrieb mit Fest' },
      { title: 'Weihnachtsmarkt', date: '2026-12-01', location: 'Altstadt', description: 'Adventszauber mit 50 Ständen' },
    ],
  },
  placesMap: {
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.404954!3d52.520008',
    places: [
      { name: 'Tourist-Info', address: 'Hauptstraße 1', category: 'Service' },
      { name: 'Bergbahn', address: 'Talstation 5', category: 'Aktivität' },
    ],
  },
  sightseeingList: {
    items: [
      { title: 'Stadtmuseum', description: 'Geschichte der Region.', category: 'Kultur', distance: '500m' },
      { title: 'Aussichtsturm', description: '360° Panoramablick.', category: 'Natur', distance: '2 km' },
    ],
  },
  tourRoutes: {
    routes: [
      { title: 'Panoramaweg', length: '12 km', duration: '4h', difficulty: 'Mittel', description: 'Aussichtsreiche Rundwanderung.' },
      { title: 'Seerundweg', length: '5 km', duration: '1,5h', difficulty: 'Leicht', description: 'Gemütlich um den See.' },
    ],
  },
  accommodationGrid: {
    items: [
      { name: 'Hotel Alpenblick', type: 'Hotel', stars: 4, priceFrom: '89 €', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80' },
      { name: 'Pension Waldruhe', type: 'Pension', stars: 3, priceFrom: '59 €', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80' },
    ],
  },
  visitorInfo: {
    introText: 'Alles Wichtige für Ihren Besuch.',
    blocks: [
      { title: 'Anreise', icon: 'car', text: 'A8 Ausfahrt Holzkirchen, Parkplätze vorhanden.' },
      { title: 'ÖPNV', icon: 'bus', text: 'Busverbindung ab Bahnhof alle 30 Min.' },
      { title: 'Barrierefreiheit', icon: 'accessibility', text: 'Alle Hauptwege rollstuhlgerecht.' },
    ],
  },
  downloadGuides: {
    items: [
      { title: 'Wanderkarte (PDF)', fileUrl: '#', fileSize: '2,4 MB', icon: 'map' },
      { title: 'Veranstaltungskalender', fileUrl: '#', fileSize: '1,1 MB', icon: 'calendar' },
    ],
  },
  tourismContact: {
    introText: 'Haben Sie Fragen? Wir helfen gerne!',
    formEnabled: true,
    submitLabel: 'Anfrage senden',
    infoCards: [
      { icon: 'phone', label: 'Telefon', value: '+49 8022 123 456' },
      { icon: 'mail', label: 'E-Mail', value: 'info@tourismus-beispiel.de' },
    ],
  },

  // === SALON ===
  serviceMenu: {
    headline: 'Unsere Leistungen',
    badgeText: 'Services',
    categories: [
      { name: 'Haare', items: [{ name: 'Waschen & Schneiden', price: 'ab 45 €', duration: '45 Min.' }, { name: 'Färben', price: 'ab 65 €', duration: '90 Min.' }] },
      { name: 'Nägel', items: [{ name: 'Maniküre', price: '35 €', duration: '30 Min.' }] },
    ],
  },
  priceList: {
    headline: 'Preisliste',
    badgeText: 'Preise',
    categories: [
      { name: 'Damen', items: [{ name: 'Schneiden', price: '45 €' }, { name: 'Waschen & Föhnen', price: '25 €' }] },
      { name: 'Herren', items: [{ name: 'Schneiden', price: '30 €' }] },
    ],
  },
  treatmentDetail: {
    headline: 'Behandlungen im Detail',
    badgeText: 'Details',
    treatments: [
      { name: 'Keratin-Glättung', duration: '120 Min.', description: 'Glättet und pflegt das Haar für bis zu 3 Monate.', steps: ['Waschen', 'Auftragen', 'Einwirken', 'Styling'] },
    ],
  },
  packages: {
    headline: 'Pakete & Specials',
    badgeText: 'Specials',
    packages: [
      { name: 'Braut-Paket', price: '189 €', features: ['Probetermin', 'Styling am Tag', 'Make-up'] },
      { name: 'Wellness-Paket', price: '99 €', features: ['Kopfmassage', 'Pflege', 'Styling'] },
    ],
  },
  teamShowcase: {
    headline: 'Unser Team',
    badgeText: 'Menschen',
    members: [
      { name: 'Lisa', role: 'Friseurmeisterin', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', specialties: ['Balayage', 'Hochsteckfrisuren'] },
      { name: 'Marc', role: 'Stylist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', specialties: ['Barber-Cuts', 'Colorierung'] },
    ],
  },
  expertiseGrid: {
    headline: 'Expertise',
    badgeText: 'Skills',
    items: [
      { title: 'Olaplex Certified', description: 'Zertifizierter Olaplex-Salon.' },
      { title: 'Kerastase Expert', description: 'Offizieller Kerastase Partner.' },
    ],
  },
  beforeAfter: {
    headline: 'Vorher & Nachher',
    badgeText: 'Transformation',
    items: [
      { before: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', after: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80', title: 'Balayage Transformation' },
    ],
  },
  bookingCta: {
    headline: 'Termin buchen',
    badgeText: 'Buchung',
    subline: 'Einfach online oder telefonisch.',
    onlineCta: { label: 'Online buchen', href: '#' },
    phoneCta: { label: 'Anrufen', href: 'tel:+491234567890' },
    notes: ['Terminabsage mindestens 24h vorher', 'Neue Kunden bitte 10 Min. früher da sein'],
  },
  locationContact: {
    headline: 'Kontakt & Standort',
    badgeText: 'Salon',
    introText: 'Wir freuen uns auf Ihren Besuch.',
    formEnabled: true,
    submitLabel: 'Nachricht senden',
    infoCards: [
      { icon: 'phone', label: 'Telefon', value: '+49 30 123 456' },
      { icon: 'mapPin', label: 'Adresse', value: 'Schönhauser Allee 12, Berlin' },
    ],
  },

  // === MEDICAL ===
  serviceOverview: {
    items: [
      { title: 'Vorsorgeuntersuchung', description: 'Altersgerechte Check-ups und Prävention.', icon: 'heart' },
      { title: 'Labordiagnostik', description: 'Blutbild, Hormone, Allergietests.', icon: 'flask' },
      { title: 'Impfungen', description: 'Reise- und Standardimpfungen.', icon: 'shield' },
    ],
  },
  diagnostics: {
    items: [
      { title: 'Ultraschall', description: 'Bildgebende Diagnostik für Organe und Gewebe.', icon: 'scan' },
      { title: 'EKG', description: 'Herzrhythmus und Herzfunktion prüfen.', icon: 'activity' },
    ],
  },
  doctorTeam: {
    doctors: [
      { name: 'Dr. med. Sarah Fischer', specialty: 'Allgemeinmedizin', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', languages: ['Deutsch', 'Englisch'] },
      { name: 'Dr. med. Michael Lang', specialty: 'Innere Medizin', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', languages: ['Deutsch'] },
    ],
  },
  practiceTeam: {
    members: [
      { name: 'Maria Bauer', role: 'MFA / Empfang', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { name: 'Tim Schuster', role: 'MFA / Labor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    ],
  },
  certifications: {
    items: [
      { title: 'DMP Diabetes', description: 'Teilnahme am Disease-Management-Programm' },
      { title: 'QM-Zertifikat', description: 'Qualitätsmanagement nach DIN EN ISO 9001' },
    ],
  },
  patientInfo: {
    introText: 'Wichtige Informationen für Ihren Besuch.',
    cards: [
      { title: 'Erstbesuch', icon: 'clipboard', text: 'Bitte bringen Sie Ihre Versichertenkarte und Überweisungsschein mit.' },
      { title: 'Wartezeit', icon: 'clock', text: 'Termine werden pünktlich eingehalten – Wartezeit meist unter 15 Min.' },
    ],
  },
  insuranceInfo: {
    items: [
      { title: 'Gesetzlich versichert', description: 'Alle Kassenleistungen + IGeL-Angebote' },
      { title: 'Privat versichert', description: 'Erweiterte Diagnostik und Beratung' },
    ],
  },
  downloadForms: {
    items: [
      { title: 'Anamnesebogen', fileUrl: '#', fileSize: '240 KB', icon: 'file' },
      { title: 'Datenschutzerklärung', fileUrl: '#', fileSize: '120 KB', icon: 'file' },
    ],
  },
  appointmentCta: {
    introText: 'Vereinbaren Sie jetzt Ihren Termin.',
    onlineCta: { label: 'Online-Termin', href: '#' },
    phoneCta: { label: 'Anrufen', href: 'tel:+491234567890' },
    notes: ['Akutsprechstunde: Mo–Fr 8:00–9:00', 'Terminabsage bitte 24h vorher'],
  },
  emergencyInfo: {
    introText: 'Im Notfall wählen Sie bitte 112.',
    items: [
      { title: 'Ärztlicher Bereitschaftsdienst', phone: '116 117', description: 'Außerhalb der Sprechzeiten' },
      { title: 'Giftnotruf', phone: '030 19240', description: 'Bei Vergiftungen' },
    ],
  },
  practiceGallery: {
    images: [
      { src: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80', alt: 'Empfang', category: 'Praxis' },
      { src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80', alt: 'Behandlungsraum', category: 'Praxis' },
    ],
  },
  equipmentHighlights: {
    items: [
      { title: 'Digitales Röntgen', description: 'Niedrigste Strahlenbelastung.', icon: 'scan' },
      { title: 'Labor vor Ort', description: 'Sofortergebnisse für wichtige Werte.', icon: 'flask' },
    ],
  },
  valuesGrid: {
    items: [
      { title: 'Empathie', description: 'Wir hören zu und nehmen uns Zeit.', icon: 'heart' },
      { title: 'Evidenz', description: 'Behandlung nach aktuellen Leitlinien.', icon: 'book' },
      { title: 'Transparenz', description: 'Offene Kommunikation über Befunde.', icon: 'eye' },
    ],
  },

  // === WEDDING ===
  coupleStory: {
    badge: 'Unsere Geschichte',
    headline: 'Wie alles begann',
    story: 'Es war ein sonniger Tag im Park, als wir uns zum ersten Mal trafen...',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    milestones: [
      { date: 'Mai 2019', text: 'Erstes Date' },
      { date: 'Dez 2023', text: 'Der Antrag' },
      { date: 'Sep 2026', text: 'Die Hochzeit' },
    ],
  },
  eventSchedule: {
    badge: 'Tagesablauf',
    headline: 'Der schönste Tag',
    events: [
      { time: '14:00', title: 'Trauung', description: 'In der Schlosskapelle', icon: 'heart' },
      { time: '15:30', title: 'Sektempfang', description: 'Im Rosengarten', icon: 'glass' },
      { time: '18:00', title: 'Dinner', description: 'Im Festsaal', icon: 'utensils' },
      { time: '21:00', title: 'Party', description: 'Bis in die Nacht!', icon: 'music' },
    ],
  },
  venueInfo: {
    badge: 'Location',
    headline: 'Die Location',
    description: 'Unser Fest findet im wunderschönen Schloss Hohenstein statt.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    address: 'Schlossweg 1, 83700 Rottach-Egern',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.404954!3d52.520008',
  },
  travelInfo: {
    badge: 'Anreise',
    headline: 'Anreise & Unterkunft',
    directions: [
      { mode: 'Auto', text: 'A8 Ausfahrt Holzkirchen, dann 20 Min. Richtung Rottach-Egern' },
      { mode: 'Bahn', text: 'München Hbf → Rottach-Egern (ca. 1h)' },
    ],
    accommodations: [
      { name: 'Hotel Seeblick', distance: '500m', link: '#' },
      { name: 'Pension Waldruhe', distance: '1 km', link: '#' },
    ],
  },
  weddingParty: {
    badge: 'Unsere Crew',
    headline: 'Trauzeugen & Begleitung',
    members: [
      { name: 'Lisa', role: 'Trauzeugin', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', text: 'Beste Freundin seit der Schulzeit.' },
      { name: 'Tom', role: 'Trauzeuge', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', text: 'Kindheitsfreund und Abenteuerpartner.' },
    ],
  },
  giftRegistry: {
    badge: 'Geschenke',
    headline: 'Geschenkideen',
    text: 'Der größte Wunsch ist Eure Anwesenheit! Wer uns trotzdem etwas schenken möchte:',
    items: [
      { name: 'Reisekasse', description: 'Für unsere Flitterwochen auf Bali' },
      { name: 'Küchenmaschine', description: 'KitchenAid Artisan in Creme' },
    ],
  },
  dresscode: {
    badge: 'Dresscode',
    headline: 'Was ziehe ich an?',
    text: 'Festlich-elegant. Bitte vermeidet Weiß und Creme.',
    colors: ['#4A6741', '#C9A96E', '#2C3E50'],
    hints: ['Herren: Anzug oder festlicher Zweireiher', 'Damen: Langes oder midi-Kleid', 'Bequeme Schuhe für die Tanzfläche!'],
  },
  rsvp: {
    badge: 'RSVP',
    headline: 'Sagt uns Bescheid',
    subline: 'Bitte gebt uns bis zum 1. August 2026 Bescheid.',
    deadline: '2026-08-01',
  },
  weddingMenu: {
    badge: 'Menü',
    headline: 'Unser Hochzeitsmenü',
    courses: [
      { title: 'Vorspeise', items: [{ name: 'Wildkräutersalat', description: 'mit Ziegenkäse-Praline' }] },
      { title: 'Hauptgang', items: [{ name: 'Rosa gebratenes Filet', description: 'mit Trüffelkartoffel' }, { name: 'Steinpilzrisotto', description: 'Vegane Alternative', tags: ['vegan'] }] },
      { title: 'Dessert', items: [{ name: 'Crème brûlée', description: 'mit Vanille aus Madagaskar' }] },
    ],
    note: 'Allergien und Unverträglichkeiten bitte bei der Zusage angeben.',
  },

  // === PHOTOGRAPHY ===
  portfolioGallery: {
    badge: 'Portfolio',
    headline: 'Meine Arbeiten',
    images: [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'Hochzeit', category: 'Wedding' },
      { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', alt: 'Portrait', category: 'Portrait' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Landschaft', category: 'Landscape' },
    ],
    categories: ['Wedding', 'Portrait', 'Landscape'],
  },
  photographerAbout: {
    badge: 'Über mich',
    headline: 'Hi, ich bin Julia!',
    intro: 'Fotografin aus Leidenschaft, seit 2015 selbstständig.',
    story: 'Ich liebe echte Momente, natürliches Licht und entspannte Shootings.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    facts: ['500+ Shootings', '10 Jahre Erfahrung', 'Deutsch & Englisch'],
    values: [{ title: 'Natürlich', text: 'Keine gestellten Posen.' }, { title: 'Emotional', text: 'Die echten Momente zählen.' }],
    ctaLabel: 'Kontakt aufnehmen',
    ctaHref: '#',
  },
  shootingProcess: {
    badge: 'So läuft es ab',
    headline: 'Euer Weg zu perfekten Fotos',
    steps: [
      { title: 'Kennenlernen', description: 'Wir besprechen eure Wünsche bei einem Kaffee oder Videocall.' },
      { title: 'Shooting', description: 'Entspannte Atmosphäre, natürliches Licht, echte Momente.' },
      { title: 'Bearbeitung', description: 'In 2–3 Wochen bekommt ihr eure fertige Galerie.' },
      { title: 'Übergabe', description: 'Download-Link + optional Prints und Alben.' },
    ],
  },

  // === CONSULTING ===
  practiceAreas: {
    headline: 'Rechtsgebiete',
    badgeText: 'Expertise',
    areas: [
      { title: 'Arbeitsrecht', description: 'Kündigungsschutz, Verträge, Abfindungen', icon: 'briefcase' },
      { title: 'Familienrecht', description: 'Scheidung, Sorgerecht, Unterhalt', icon: 'users' },
      { title: 'Mietrecht', description: 'Mieterhöhung, Kündigung, Mängel', icon: 'home' },
    ],
  },
  caseResults: {
    headline: 'Unsere Erfolgsbilanz',
    subline: 'Zahlen, die für sich sprechen.',
    stats: [
      { value: 2500, suffix: '+', label: 'Mandanten beraten' },
      { value: 95, suffix: '%', label: 'Erfolgsquote' },
      { value: 30, label: 'Jahre Erfahrung' },
    ],
  },
  feeTable: {
    headline: 'Honorar & Kosten',
    badgeText: 'Transparent',
    fees: [
      { service: 'Erstberatung', price: '190 €', note: '60 Min., pauschal' },
      { service: 'Außergerichtliche Vertretung', price: 'nach RVG', note: 'Gesetzliche Gebühren' },
      { service: 'Gerichtliche Vertretung', price: 'nach RVG', note: 'Zzgl. Gerichtskosten' },
    ],
    footnote: 'Rechtsschutzversicherung wird akzeptiert.',
  },
  publications: {
    headline: 'Fachbeiträge & Aktuelles',
    badgeText: 'Blog',
    articles: [
      { title: 'Neue Regelungen im Mietrecht 2026', date: '2026-05-01', excerpt: 'Was Mieter und Vermieter jetzt wissen müssen.' },
      { title: 'Abfindung richtig verhandeln', date: '2026-04-15', excerpt: '5 Tipps für eine höhere Abfindung.' },
    ],
  },

  // === REALESTATE ===
  propertyShowcase: {
    headline: 'Aktuelle Immobilien',
    subline: 'Ausgewählte Objekte aus unserem Portfolio.',
    properties: [
      { title: '3-Zi.-Wohnung Berlin-Mitte', price: '450.000 €', area: '85 m²', rooms: 3, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', type: 'Kauf' },
      { title: 'Einfamilienhaus Potsdam', price: '890.000 €', area: '180 m²', rooms: 5, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80', type: 'Kauf' },
    ],
  },
  propertySearch: {
    headline: 'Ihre Traumimmobilie finden',
    categories: ['Kaufen', 'Mieten'],
  },
  marketReport: {
    headline: 'Marktbericht',
    subline: 'Aktuelle Marktdaten für Ihre Region.',
    region: 'Berlin & Brandenburg',
    stats: [
      { label: 'Ø Kaufpreis/m²', value: '4.850 €' },
      { label: 'Ø Mietpreis/m²', value: '14,20 €' },
      { label: 'Vermarktungszeit', value: '45 Tage' },
    ],
    description: 'Der Markt zeigt stabile Preise mit leicht steigender Nachfrage im Speckgürtel.',
  },
  agentTeam: {
    headline: 'Unsere Makler',
    subline: 'Persönliche Beratung von Experten.',
    agents: [
      { name: 'Stefan Meyer', specialty: 'Wohnimmobilien', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', phone: '+49 30 123 456' },
      { name: 'Claudia Richter', specialty: 'Gewerbeimmobilien', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', phone: '+49 30 123 457' },
    ],
  },
  valuationCta: {
    headline: 'Was ist Ihre Immobilie wert?',
    subline: 'Erhalten Sie eine kostenlose und unverbindliche Bewertung.',
    ctaLabel: 'Kostenlose Bewertung anfordern',
    ctaHref: '#',
    stats: [
      { label: 'Bewertungen durchgeführt', value: '1.200+' },
      { label: 'Zufriedene Eigentümer', value: '98%' },
    ],
  },
  referencesSold: {
    headline: 'Erfolgreich vermittelt',
    subline: 'Auszug aus unseren Referenzen.',
    properties: [
      { title: 'Altbauwohnung Charlottenburg', soldPrice: '520.000 €', area: '95 m²', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80' },
      { title: 'Villa Grunewald', soldPrice: '1.850.000 €', area: '280 m²', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
    ],
    totalSold: '230+ Objekte seit 2015',
  },
  locationHighlight: {
    headline: 'Lage & Umgebung',
    description: 'Zentral und doch im Grünen – die perfekte Lage.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    pois: [
      { title: 'S-Bahn', distance: '300m', category: 'ÖPNV' },
      { title: 'Grundschule', distance: '500m', category: 'Bildung' },
      { title: 'Supermarkt', distance: '200m', category: 'Einkaufen' },
    ],
  },
};
