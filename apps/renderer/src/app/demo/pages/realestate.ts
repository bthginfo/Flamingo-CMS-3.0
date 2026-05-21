import type { DemoSite } from '.';

const HERO = { visible: true, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, variant: null };
const SECTION = { visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, variant: null };

export const realestateSite: DemoSite = {
  industry: 'realestate',
  industryKey: 'realestate',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 're-hero', type: 'hero',
          data: {
            headline: 'Ihre Immobilie in besten Händen',
            subline: 'Rheinblick Immobilien — seit 2005 Ihr Premiumpartner für Kauf, Verkauf und Bewertung von Wohn- und Gewerbeimmobilien in Köln und Umgebung.',
            bgImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
            overlayOpacity: 0.6,
            primaryCta: { label: 'Immobilien entdecken', href: '/demo/realestate/kaufen' },
            secondaryCta: { label: 'Kostenlose Bewertung', href: '/demo/realestate/bewertung' },
            trustItems: ['Seit 2005', '1.200+ vermittelte Objekte', 'Ø 21 Tage Vermarktungszeit', 'IVD-Mitglied'],
          },
        },
        {
          ...SECTION, id: 're-showcase', type: 'propertyShowcase',
          data: {
            headline: 'Aktuelle Immobilienangebote',
            subline: 'Ausgewählte Objekte aus unserem aktuellen Portfolio',
            properties: [
              { title: 'Penthouse-Wohnung mit Rheinblick', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', price: '895.000 €', size: '142 m²', rooms: '4', location: 'Köln-Bayenthal', badge: 'Exklusiv' },
              { title: 'Altbau-Juwel im Belgischen Viertel', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', price: '549.000 €', size: '98 m²', rooms: '3', location: 'Köln-Belgisches Viertel' },
              { title: 'Familienhaus mit Garten', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', price: '785.000 €', size: '185 m²', rooms: '5', location: 'Köln-Rodenkirchen', badge: 'Neu' },
              { title: 'Loft-Wohnung im Mediapark', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', price: '425.000 €', size: '87 m²', rooms: '2', location: 'Köln-Neustadt-Nord' },
              { title: 'Stadthaus Lindenthal', image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', price: '1.290.000 €', size: '220 m²', rooms: '6', location: 'Köln-Lindenthal', badge: 'Premium' },
              { title: 'Maisonette am Volksgarten', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', price: '620.000 €', size: '115 m²', rooms: '4', location: 'Köln-Südstadt' },
            ],
          },
        },
        {
          ...SECTION, id: 're-valuation', type: 'valuationCta',
          data: {
            headline: 'Was ist Ihre Immobilie wert?',
            subline: 'Erhalten Sie innerhalb von 48 Stunden eine fundierte Marktwerteinschätzung — kostenlos und unverbindlich.',
            ctaLabel: 'Kostenlose Bewertung anfordern',
            ctaHref: '/demo/realestate/bewertung',
            stats: [
              { label: 'Bewertungen pro Jahr', value: '350+' },
              { label: 'Ø Abweichung', value: '< 3%' },
              { label: 'Tage bis Ergebnis', value: '2' },
            ],
          },
        },
        {
          ...SECTION, id: 're-sold', type: 'referencesSold',
          data: {
            headline: 'Erfolgreich vermittelt',
            subline: 'Einige unserer zuletzt erfolgreich abgeschlossenen Transaktionen',
            totalSold: 'Über 1.200 Objekte seit 2005',
            properties: [
              { title: 'Villa am Rheinufer', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', location: 'Köln-Marienburg', soldIn: '18 Tagen' },
              { title: 'Altbau-Etage', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', location: 'Köln-Ehrenfeld', soldIn: '12 Tagen' },
              { title: 'Neubauprojekt 12 WE', image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80', location: 'Köln-Sülz', soldIn: '8 Wochen' },
              { title: 'Büroetage Rheinauhafen', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', location: 'Köln-Rheinauhafen', soldIn: '24 Tagen' },
              { title: 'Doppelhaushälfte', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80', location: 'Bergisch Gladbach', soldIn: '14 Tagen' },
              { title: 'Penthouse Agnesviertel', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', location: 'Köln-Agnesviertel', soldIn: '9 Tagen' },
              { title: 'Stadtwohnung', image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80', location: 'Köln-Deutz', soldIn: '21 Tagen' },
              { title: 'Reihenhaus mit Garten', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', location: 'Hürth', soldIn: '16 Tagen' },
            ],
          },
        },
        {
          ...SECTION, id: 're-team', type: 'agentTeam',
          data: {
            headline: 'Unser Team',
            subline: 'Persönliche Betreuung durch erfahrene Immobilienexperten',
            agents: [
              { name: 'Thomas Rheinberg', role: 'Geschäftsführer & Gründer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', specialization: 'Premium-Immobilien & Investment', soldCount: '450+', phone: '+49 221 9876 100', email: 'rheinberg@rheinblick-immobilien.de' },
              { name: 'Julia Steinfeld', role: 'Senior Maklerin', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', specialization: 'Eigentumswohnungen & Erstbezug', soldCount: '380+', phone: '+49 221 9876 101' },
              { name: 'Markus Brandt', role: 'Makler & Bewertung', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', specialization: 'Einfamilienhäuser & Grundstücke', soldCount: '290+', phone: '+49 221 9876 102' },
            ],
          },
        },
        {
          ...SECTION, id: 're-testimonials', type: 'testimonials',
          data: {
            headline: 'Das sagen unsere Kunden',
            testimonials: [
              { text: 'Herr Rheinberg hat unser Haus in nur 12 Tagen über dem Angebotspreis verkauft. Die Vermarktungsstrategie war perfekt.', name: 'Familie Schneider', role: 'Verkäufer, Rodenkirchen', stars: 5 },
              { text: 'Von der Suche bis zum Notar wurden wir erstklassig betreut. Die Expertise für den Kölner Markt ist einzigartig.', name: 'Dr. Michael Weber', role: 'Käufer, Belgisches Viertel', stars: 5 },
              { text: 'Professionelle Bewertung, ehrliche Beratung und ein tadelloser Verkaufsprozess. Absolute Empfehlung!', name: 'Ingrid & Hans Müller', role: 'Verkäufer, Lindenthal', stars: 5 },
            ],
          },
        },
      ],
    },
    {
      slug: 'kaufen',
      title: 'Kaufen',
      sections: [
        {
          ...HERO, id: 're-buy-hero', type: 'hero',
          data: {
            headline: 'Immobilien kaufen in Köln',
            subline: 'Finden Sie Ihr neues Zuhause — von der Stadtwohnung bis zur Villa am Rhein.',
            bgImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
            primaryCta: { label: 'Alle Objekte ansehen', href: '#objekte' },
          },
        },
        {
          ...SECTION, id: 're-search', type: 'propertySearch',
          data: {
            headline: 'Ihre Suchkriterien',
            categories: ['Kaufen', 'Mieten', 'Gewerbe'],
          },
        },
        {
          ...SECTION, id: 're-buy-showcase', type: 'propertyShowcase',
          data: {
            headline: 'Aktuelle Kaufangebote',
            properties: [
              { title: 'Penthouse mit Domblick', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', price: '1.450.000 €', size: '195 m²', rooms: '5', location: 'Köln-Altstadt', badge: 'Exklusiv' },
              { title: 'Neubau-ETW Sülz', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', price: '489.000 €', size: '92 m²', rooms: '3', location: 'Köln-Sülz', badge: 'Erstbezug' },
              { title: 'Einfamilienhaus Porz', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', price: '598.000 €', size: '155 m²', rooms: '5', location: 'Köln-Porz' },
            ],
          },
        },
      ],
    },
    {
      slug: 'bewertung',
      title: 'Bewertung',
      sections: [
        {
          ...HERO, id: 're-val-hero', type: 'hero',
          data: {
            headline: 'Immobilienbewertung',
            subline: 'Fundiert. Marktgerecht. Kostenlos.',
            bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 're-val-cta', type: 'valuationCta',
          data: {
            headline: 'Ihre kostenlose Marktwertanalyse',
            subline: 'Unsere zertifizierten Gutachter analysieren Lage, Zustand und Marktumfeld Ihrer Immobilie. Sie erhalten eine detaillierte Bewertung mit konkreter Preisempfehlung.',
            ctaLabel: 'Jetzt Bewertung anfordern',
            ctaHref: '/demo/realestate/kontakt',
            stats: [
              { label: 'Bewertungen/Jahr', value: '350+' },
              { label: 'davon verkauft', value: '89%' },
              { label: 'Ø über Marktwert', value: '+4,2%' },
            ],
          },
        },
        {
          ...SECTION, id: 're-val-faq', type: 'faq',
          data: {
            headline: 'Fragen zur Bewertung',
            items: [
              { question: 'Ist die Bewertung wirklich kostenlos?', answer: 'Ja, unsere Erstbewertung ist für Sie völlig kostenlos und unverbindlich. Sie dient als Grundlage für ein mögliches Vermarktungsmandat.' },
              { question: 'Wie genau ist die Bewertung?', answer: 'Unsere Bewertungen weichen im Schnitt weniger als 3% vom späteren Verkaufspreis ab. Wir nutzen aktuelle Vergleichsdaten, Bodenrichtwerte und unsere 20-jährige Marktexpertise.' },
              { question: 'Wie lange dauert die Bewertung?', answer: 'Nach der Besichtigung erhalten Sie innerhalb von 48 Stunden eine ausführliche schriftliche Bewertung mit Preisspanne und Empfehlung.' },
            ],
          },
        },
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        {
          ...HERO, id: 're-about-hero', type: 'hero',
          data: {
            headline: 'Über Rheinblick Immobilien',
            subline: 'Seit 2005 verbinden wir Menschen mit ihren Traumimmobilien.',
            bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 're-about-text', type: 'textImage',
          data: {
            headline: 'Premium-Makler aus Überzeugung',
            text: 'Thomas Rheinberg gründete Rheinblick Immobilien 2005 mit einer klaren Vision: Immobilienvermittlung auf höchstem Niveau — persönlich, transparent und erfolgsorientiert. Was als Ein-Mann-Büro begann, ist heute ein Team von 8 Spezialisten, die den Kölner Immobilienmarkt wie ihre Westentasche kennen.\n\nUnser Erfolgsrezept? Wir behandeln jede Immobilie, als wäre es unsere eigene. Das bedeutet: professionelle Fotografie, zielgruppengerechtes Marketing, qualifizierte Käuferauswahl und persönliche Begleitung bis zum Notartermin.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...SECTION, id: 're-about-market', type: 'marketReport',
          data: {
            headline: 'Kölner Immobilienmarkt 2025',
            region: 'Köln & Rheinland',
            subline: 'Aktuelle Marktdaten aus unserem Quartalsreport',
            stats: [
              { label: 'Ø Kaufpreis/m² Wohnung', value: '4.850 €', trend: '+3,2% zum Vorjahr' },
              { label: 'Ø Kaufpreis/m² Haus', value: '5.200 €', trend: '+2,8% zum Vorjahr' },
              { label: 'Ø Vermarktungsdauer', value: '32 Tage', trend: '-8 Tage' },
              { label: 'Unsere Vermarktungsdauer', value: '21 Tage', trend: '34% schneller' },
            ],
            description: 'Der Kölner Immobilienmarkt zeigt sich 2025 stabil mit leichtem Aufwärtstrend. Besonders gefragt sind sanierte Altbauten im linksrheinischen Bereich und Neubauprojekte mit energieeffizientem Standard.',
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 're-contact-hero', type: 'hero',
          data: {
            headline: 'Kontakt aufnehmen',
            subline: 'Wir freuen uns auf Ihr Anliegen.',
            bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 're-contact', type: 'contact',
          data: {
            headline: 'Sprechen Sie uns an',
            subline: 'Ob Kauf, Verkauf oder Bewertung — wir beraten Sie gerne persönlich.',
            phone: '+49 221 9876 100',
            email: 'info@rheinblick-immobilien.de',
            address: 'Rheinuferstraße 12, 50676 Köln',
            hours: 'Mo–Fr: 09:00–18:00 · Sa: nach Vereinbarung',
          },
        },
      ],
    },
  ],
};
