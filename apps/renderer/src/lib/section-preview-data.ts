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
  collectionHero: {
    headline: 'Neuer Blogbeitrag',
    subline: 'Alles was Sie über unser neuestes Projekt wissen müssen.',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    category: 'Neuigkeiten',
    date: '2026-05-20',
    overlayOpacity: 0.5,
  },
  newsGrid: {
    headline: 'Aktuelle Beiträge',
    items: [
      { title: 'Neuer Service verfügbar', excerpt: 'Ab sofort bieten wir auch...', date: '2026-05-15', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', href: '#' },
      { title: 'Auszeichnung erhalten', excerpt: 'Wir freuen uns über...', date: '2026-04-20', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', href: '#' },
      { title: 'Teamzuwachs', excerpt: 'Unser Team wächst weiter...', date: '2026-03-10', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80', href: '#' },
    ],
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
  noticeBanner: {
    headline: 'Betriebsurlaub',
    text: 'Vom 24.12. bis 02.01. sind wir im Betriebsurlaub. Ab dem 03.01. sind wir wieder für Sie da!',
    variant: 'info',
  },
  styleGallery: {
    headline: 'Unsere Stile',
    subline: 'Entdecken Sie unsere Vielfalt.',
    styles: [
      { name: 'Stil 1', image: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&q=80', description: 'Beschreibung Stil 1' },
      { name: 'Stil 2', image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&q=80', description: 'Beschreibung Stil 2' },
      { name: 'Stil 3', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80', description: 'Beschreibung Stil 3' },
    ],
  },
  artistGrid: {
    headline: 'Unsere Künstler',
    subline: 'Finde Deinen Match.',
    artists: [
      { name: 'Artist 1', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', styles: ['Stil A', 'Stil B'], bio: 'Spezialisiert auf ...', instagram: 'artist1' },
      { name: 'Artist 2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', styles: ['Stil C', 'Stil D'], bio: 'Bekannt für ...', instagram: 'artist2' },
    ],
  },
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
};
