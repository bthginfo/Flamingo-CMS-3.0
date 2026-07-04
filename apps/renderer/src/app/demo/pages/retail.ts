import type { DemoSite } from '.';

const HERO = { visible: true, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, variant: null };
const SECTION = { visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, variant: null };

export const retailSite: DemoSite = {
  industry: 'retail',
  industryKey: 'retail',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'rt-hero', type: 'hero',
          data: {
            headline: 'Einrichten mit Persönlichkeit',
            subline: 'Möbelhaus Lichtblick – Design-Möbel, Büroplanung & individuelle Beratung für Privat- und Firmenkunden seit 1998.',
            bgImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
            overlayOpacity: 0.55,
            primaryCta: { label: 'Sortiment entdecken', href: '/demo/retail#produkte' },
            secondaryCta: { label: 'Beratung buchen', href: '/demo/retail#beratung' },
            trustItems: ['500+ eingerichtete Büros', '25 Jahre Erfahrung', 'Kostenlose Erstberatung'],
          },
        },
        {
          ...SECTION, id: 'rt-categories', type: 'categoryMosaic',
          data: {
            headline: 'Unsere Welten',
            subline: 'Finden Sie Ihren Bereich.',
            items: [
              { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', title: 'Wohnzimmer', href: '#', size: 'large' },
              { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', title: 'Büro & Office', href: '#', size: 'small' },
              { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', title: 'Schlafzimmer', href: '#', size: 'small' },
              { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', title: 'Küche & Essen', href: '#', size: 'large' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-products', type: 'productShowcase', anchorId: 'produkte',
          data: {
            headline: 'Unsere Bestseller',
            subline: 'Entdecken Sie die beliebtesten Stücke unserer Kunden.',
            columns: '3',
            items: [
              { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', title: 'Design-Sofa „Oslo"', price: 'ab 1.299 €', badge: 'Bestseller', href: '#', description: 'Skandinavisches Design mit höchstem Komfort.' },
              { image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80', title: 'Esstisch „Natur"', price: 'ab 899 €', badge: 'Neu', href: '#', description: 'Massivholz aus nachhaltiger Forstwirtschaft.' },
              { image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80', title: 'Stehleuchte „Arc"', price: '349 €', href: '#', description: 'Eleganter Bogen mit dimmbarem LED-Licht.' },
              { image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80', title: 'Bürostuhl „Ergo Pro"', price: 'ab 649 €', badge: 'Firmen-Tipp', href: '#', description: 'Ergonomisch zertifiziert für 8+ Stunden.' },
              { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', title: 'Regal „Modular"', price: 'ab 429 €', href: '#', description: 'Flexibles Wandsystem — beliebig erweiterbar.' },
              { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', title: 'Sideboard „Milano"', price: '1.199 €', href: '#', description: 'Italienisches Design, deutsche Fertigung.' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-showroom', type: 'brandShowroom',
          data: {
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
            headline: 'Die neue Kollektion 2025',
            subline: 'Zeitloses Design, nachhaltige Materialien, kompromisslose Qualität.',
            overlayOpacity: 0.45,
            highlights: [
              { title: 'Handgefertigt', text: 'Jedes Stück ein Unikat aus Meisterhand.' },
              { title: 'Nachhaltig', text: '100 % zertifizierte Materialien.' },
              { title: '10 Jahre Garantie', text: 'Weil Qualität keine Kompromisse kennt.' },
            ],
            cta: { label: 'Kollektion entdecken', href: '#' },
          },
        },
        {
          ...SECTION, id: 'rt-timeline', type: 'deliveryTimeline',
          data: {
            headline: 'So läuft Ihre Bestellung ab',
            subline: 'Von der Beratung bis zur Lieferung — transparent und planbar.',
            steps: [
              { number: '1', icon: 'MessageSquare', title: 'Beratung', text: 'Persönliches Gespräch vor Ort oder online.' },
              { number: '2', icon: 'ClipboardList', title: 'Planung', text: 'Wir erstellen Ihr individuelles Angebot.' },
              { number: '3', icon: 'Hammer', title: 'Fertigung', text: 'Maßgefertigte Produktion in Deutschland.' },
              { number: '4', icon: 'Truck', title: 'Lieferung & Montage', text: 'Fachgerechte Anlieferung und Aufbau.' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-booking', type: 'consultationBooking', anchorId: 'beratung',
          data: {
            headline: 'Persönliche Beratung',
            subline: 'Wählen Sie Ihren Service und buchen Sie Ihren Termin.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            services: [
              { icon: 'Ruler', title: 'Aufmaß vor Ort', description: 'Wir kommen zu Ihnen und vermessen den Raum.' },
              { icon: 'Palette', title: 'Farbberatung', description: 'Individuelle Farbkonzepte für Ihr Zuhause.' },
              { icon: 'Building2', title: 'Büroplanung', description: 'Komplette Raumkonzepte für Firmenkunden.' },
              { icon: 'Truck', title: 'Lieferung & Montage', description: 'Alles aus einer Hand — bis zur letzten Schraube.' },
            ],
            cta: { label: 'Termin vereinbaren', href: '#' },
          },
        },
        {
          ...SECTION, id: 'rt-materials', type: 'materialGallery',
          data: {
            headline: 'Materialien & Oberflächen',
            subline: 'Filtern Sie nach Kategorie.',
            categories: ['Holz', 'Stoff', 'Leder', 'Metall'],
            items: [
              { image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&q=80', name: 'Eiche Natur', category: 'Holz' },
              { image: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&q=80', name: 'Walnuss Dunkel', category: 'Holz' },
              { image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80', name: 'Leinen Sand', category: 'Stoff' },
              { image: 'https://images.unsplash.com/photo-1585264550248-1778be3b6368?w=400&q=80', name: 'Leder Cognac', category: 'Leder' },
              { image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80', name: 'Messing gebürstet', category: 'Metall' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-inspiration', type: 'inspirationGrid',
          data: {
            headline: 'Lassen Sie sich inspirieren',
            subline: 'Einblicke in realisierte Projekte unserer Kunden.',
            items: [
              { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', title: 'Loft Berlin', href: '#' },
              { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', title: 'Villa am See', href: '#' },
              { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', title: 'Office Hamburg', href: '#' },
              { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', title: 'Küche Köln', href: '#' },
              { image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', title: 'Penthouse München', href: '#' },
              { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', title: 'Bad Frankfurt', href: '#' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-beforeafter', type: 'beforeAfter',
          data: {
            headline: 'Vorher & Nachher',
            description: 'Büroumbau eines Firmenkunden — komplette Neugestaltung in 6 Wochen.',
            imageBefore: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
            imageAfter: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
            labelBefore: 'Vorher',
            labelAfter: 'Nachher',
          },
        },
        {
          ...SECTION, id: 'rt-testimonials', type: 'testimonials',
          data: {
            headline: 'Was unsere Kunden sagen',
            items: [
              { quote: 'Die Büroplanung war perfekt – unsere Mitarbeiter sind begeistert!', name: 'Stefan Berger', context: 'Geschäftsführer, TechStart GmbH', rating: 5 },
              { quote: 'Vom ersten Gespräch bis zur Montage alles aus einem Guss. Sehr empfehlenswert.', name: 'Maria Huber', context: 'Privatkundin', rating: 5 },
              { quote: 'Endlich ein Möbelhaus, das auch professionelle Büroplanung versteht.', name: 'Thomas Lang', context: 'Office Manager, Kreativagentur', rating: 5 },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-faq', type: 'faq',
          data: {
            headline: 'Häufig gestellte Fragen',
            items: [
              { question: 'Bieten Sie auch Planung für Firmenkunden an?', answer: 'Ja! Wir planen komplette Büros, Empfangsbereiche und Meetingräume. Kontaktieren Sie uns für ein unverbindliches Erstgespräch.' },
              { question: 'Wie lange dauert eine Lieferung?', answer: 'Standardmöbel liefern wir in 2-4 Wochen. Maßanfertigungen dauern je nach Umfang 6-10 Wochen.' },
              { question: 'Kann ich Möbel auch online bestellen?', answer: 'Aktuell beraten wir bevorzugt persönlich, damit alles perfekt passt. Telefonische Bestellung ist natürlich möglich.' },
              { question: 'Gibt es einen Montageservice?', answer: 'Selbstverständlich – unsere Monteure liefern und bauen alles fachgerecht auf.' },
            ],
          },
        },
        {
          ...SECTION, id: 'rt-contact', type: 'contact',
          data: {
            headline: 'Kontakt & Anfahrt',
            subline: 'Besuchen Sie unseren Showroom oder kontaktieren Sie uns direkt.',
            phone: '+49 89 123 456 78',
            email: 'info@moebelhaus-lichtblick.de',
            address: 'Leopoldstraße 42, 80802 München',
            hours: 'Mo–Fr 10–19 Uhr · Sa 10–18 Uhr',
            formEnabled: true,
            submitLabel: 'Nachricht senden',
          },
        },
      ],
    },
  ],
};
