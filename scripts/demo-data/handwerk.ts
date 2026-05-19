/**
 * Rich demo seed: Handwerk / Tradesman (Müller & Söhne Sanitär)
 */
export const HANDWERK_CONFIG = {
  slug: 'demo-handwerk',
  name: 'Müller & Söhne Sanitär',
  industry: 'tradesman' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Müller & Söhne',
    tagline: 'Meisterbetrieb für Sanitär, Heizung & Bäder seit 1978',
    primaryColor: '#1d4ed8',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b',
  },
  contact: { phone: '+49 221 987 654', email: 'info@mueller-soehne.de', address: 'Handwerkerstraße 12, 50667 Köln' },
  socialLinks: { instagram: 'https://instagram.com/muellersoehne', facebook: 'https://facebook.com/muellersoehne' },
  openingHours: [
    { day: 'Mo – Fr', hours: '07:30 – 17:00' },
    { day: 'Sa', hours: '09:00 – 13:00' },
    { day: 'Notdienst', hours: '24/7 erreichbar' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Projekte', href: '/projekte', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Anfrage senden', href: '/kontakt' },
  footerColumns: [
    { title: 'Leistungen', items: [{ text: 'Sanitärinstallation', href: '/leistungen' }, { text: 'Heizungsbau', href: '/leistungen' }, { text: 'Badsanierung', href: '/leistungen' }, { text: 'Notdienst 24/7', href: '/leistungen' }] },
    { title: 'Unternehmen', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Projekte', href: '/projekte' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: '+49 221 987 654' }, { text: 'info@mueller-soehne.de' }, { text: 'Handwerkerstraße 12, 50667 Köln' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Notdienst anrufen', href: 'tel:+49221987654' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Müller & Söhne – Ihr Meisterbetrieb in Köln',
          subline: 'Sanitär, Heizung & Badsanierung aus einer Hand. Seit über 45 Jahren die erste Adresse für Handwerk mit Herz und Verstand.',
          badgeText: 'Meisterbetrieb seit 1978',
          bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
          trustItems: ['24/7 Notdienst', '45+ Jahre Erfahrung', '5.000+ Projekte'],
          primaryCta: { label: 'Kostenlose Beratung', href: '/kontakt' },
          secondaryCta: { label: 'Unsere Leistungen', href: '/leistungen' },
        }},
        { type: 'uspStrip', sortOrder: 1, data: {
          items: [
            { icon: 'shield', title: 'Meisterbetrieb', text: 'Zertifizierte Qualität mit Garantie' },
            { icon: 'clock', title: '24/7 Notdienst', text: 'Rund um die Uhr erreichbar' },
            { icon: 'star', title: '4.9 / 5 Sterne', text: 'Über 500 Google-Bewertungen' },
            { icon: 'award', title: 'Festpreisgarantie', text: 'Keine versteckten Kosten' },
          ],
        }},
        { type: 'servicesGrid', sortOrder: 2, data: {
          headline: 'Unsere Leistungen',
          subline: 'Kompetenz in allen Bereichen der Haustechnik',
          badgeText: 'Leistungsspektrum',
          items: [
            { icon: 'droplets', title: 'Sanitärinstallation', text: 'Neuinstallation, Reparatur und Wartung sämtlicher Sanitäranlagen – vom Waschbecken bis zur kompletten Verrohrung.', href: '/leistungen' },
            { icon: 'flame', title: 'Heizungsbau', text: 'Einbau und Wartung moderner Heizsysteme – Gas, Wärmepumpe, Pellets oder Solarthermie.', href: '/leistungen' },
            { icon: 'bath', title: 'Badsanierung', text: 'Komplettumbauten und Teilmodernisierungen. Von barrierearm bis Luxusbad – alles aus einer Hand.', href: '/leistungen' },
            { icon: 'wrench', title: 'Notdienst 24/7', text: 'Rohrbruch? Heizungsausfall? Wir sind innerhalb von 60 Minuten bei Ihnen.', href: '/kontakt' },
            { icon: 'leaf', title: 'Energieberatung', text: 'Förderoptimierte Planung für maximale Einsparung. KfW- und BAFA-zertifiziert.', href: '/leistungen' },
            { icon: 'home', title: 'Smart Home', text: 'Intelligente Steuerung Ihrer Heizung, Lüftung und Wasserversorgung per App.', href: '/leistungen' },
          ],
        }},
        { type: 'stats', sortOrder: 3, data: {
          headline: 'Zahlen, die überzeugen',
          items: [
            { value: '45+', label: 'Jahre Erfahrung' },
            { value: '5.200', label: 'Abgeschlossene Projekte' },
            { value: '12', label: 'Mitarbeiter' },
            { value: '98%', label: 'Zufriedene Kunden' },
          ],
        }},
        { type: 'portfolio', sortOrder: 4, data: {
          headline: 'Aktuelle Projekte',
          subline: 'Einblicke in unsere Arbeit',
          badgeText: 'Referenzen',
          items: [
            { title: 'Luxusbad Ehrenfeld', category: 'Badsanierung', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', description: 'Komplettumbau auf 18 m² mit freistehender Badewanne und Rainshower.' },
            { title: 'Wärmepumpe Porz', category: 'Heizung', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', description: 'Effiziente Luft-Wasser-Wärmepumpe für ein Einfamilienhaus.' },
            { title: 'Sanitär Bürokomplex', category: 'Sanitär', image: 'https://images.unsplash.com/photo-1585058178215-33108215e3c8?w=800&q=80', description: 'Neuverlegung für 3 Etagen inkl. barrierefreier WC-Anlagen.' },
          ],
          ctaPrimary: { label: 'Alle Projekte ansehen', href: '/projekte' },
        }},
        { type: 'testimonials', sortOrder: 5, data: {
          headline: 'Das sagen unsere Kunden',
          badgeText: 'Kundenstimmen',
          ratingValue: '4.9',
          ratingCount: '512',
          items: [
            { name: 'Thomas K.', context: 'Köln-Ehrenfeld', rating: 5, quote: 'Unser Bad wurde in nur 3 Wochen komplett saniert. Perfekte Arbeit, sauber und pünktlich. Absolute Empfehlung!' },
            { name: 'Sandra M.', context: 'Köln-Nippes', rating: 5, quote: 'Notdienst am Sonntagabend – innerhalb von 40 Minuten war der Techniker da. Rohrbruch war in einer Stunde behoben.' },
            { name: 'Familie Weber', context: 'Köln-Lindenthal', rating: 5, quote: 'Die neue Wärmepumpe spart uns 40% Heizkosten. Beratung und Einbau waren erstklassig.' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 6, data: {
          headline: 'Bereit für Ihr nächstes Projekt?',
          subline: 'Kostenlose Erstberatung – unverbindlich und vor Ort.',
          badgeText: 'Jetzt starten',
          ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Leistungen ─── */
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          subline: 'Von der kleinen Reparatur bis zum Großprojekt – wir sind Ihr Partner für alle Fragen rund um Sanitär, Heizung und Bad.',
          badgeText: 'Meisterqualität',
          bgImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=85',
          primaryCta: { label: 'Angebot anfordern', href: '/kontakt' },
        }},
        { type: 'serviceDetail', sortOrder: 1, data: {
          headline: 'Sanitärinstallation',
          text: 'Wir planen und realisieren komplette Sanitäranlagen für Neubauten und Bestandsgebäude. Von der Trinkwasserleitung bis zur Abwasserentsorgung – normgerecht, langlebig und effizient.',
          image: 'https://images.unsplash.com/photo-1585058178215-33108215e3c8?w=900&q=80',
          features: ['Trinkwasserinstallation nach DIN', 'Abwassertechnik', 'Regenwassernutzung', 'Leckerkennung & Ortung'],
        }},
        { type: 'serviceDetail', sortOrder: 2, data: {
          headline: 'Heizungsbau & Energie',
          text: 'Moderne Heiztechnik spart Geld und schont die Umwelt. Wir beraten herstellerunabhängig und installieren Systeme, die perfekt zu Ihrem Gebäude passen.',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&q=80',
          features: ['Wärmepumpen (Luft/Wasser)', 'Gas-Brennwert', 'Solarthermie', 'Fußbodenheizung', 'KfW-/BAFA-Förderung'],
          imagePosition: 'right',
        }},
        { type: 'serviceDetail', sortOrder: 3, data: {
          headline: 'Badsanierung',
          text: 'Ihr Traumbad in 2–4 Wochen: Wir übernehmen Planung, Demontage, Fliesen, Installation und Montage. Ein Ansprechpartner für alles.',
          image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80',
          features: ['3D-Badplanung', 'Barrierefreie Lösungen', 'Bodengleiche Duschen', 'Naturstein & Großformatfliesen'],
        }},
        { type: 'processSteps', sortOrder: 4, data: {
          headline: 'So arbeiten wir',
          badgeText: 'Unser Ablauf',
          steps: [
            { title: 'Erstberatung', text: 'Kostenloser Vor-Ort-Termin mit Bestandsaufnahme und Bedarfsanalyse.' },
            { title: 'Planung & Angebot', text: 'Detailliertes Festpreisangebot mit 3D-Visualisierung bei Badprojekten.' },
            { title: 'Umsetzung', text: 'Termingerechte Ausführung durch unser eigenes Team – kein Subunternehmer.' },
            { title: 'Abnahme & Garantie', text: 'Gemeinsame Abnahme, Übergabe der Dokumentation und 5 Jahre Gewährleistung.' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 5, data: {
          headline: 'Individuelle Beratung gewünscht?',
          subline: 'Wir kommen kostenlos zu Ihnen – innerhalb von 48 Stunden.',
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Projekte ─── */
    {
      slug: 'projekte', title: 'Projekte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Referenzprojekte',
          subline: 'Ausgewählte Arbeiten aus über 45 Jahren Handwerkskunst.',
          badgeText: 'Portfolio',
          bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
        }},
        { type: 'portfolio', sortOrder: 1, data: {
          headline: 'Ausgewählte Projekte',
          items: [
            { title: 'Designbad Marienburg', category: 'Badsanierung', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', description: 'Luxusbad mit Dampfdusche, freistehender Wanne und intelligenter Lichtsteuerung.' },
            { title: 'Heizungstausch MFH Sülz', category: 'Heizung', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', description: 'Austausch alter Ölheizung gegen Luft-Wasser-Wärmepumpe für 8 Parteien.' },
            { title: 'Rohrsanierung Altbau', category: 'Sanitär', image: 'https://images.unsplash.com/photo-1585058178215-33108215e3c8?w=800&q=80', description: 'Kompletterneuerung der Steigleitungen ohne Aufbrechen – minimalinvasiv.' },
            { title: 'Smart-Home-Bad Deutz', category: 'Smart Home', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80', description: 'App-gesteuerte Temperierung, LED-Ambiente und Musiksystem.' },
            { title: 'Fußbodenheizung Neubau', category: 'Heizung', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', description: '240 m² Fußbodenheizung mit Raumregelung und Wärmepumpe.' },
            { title: 'Barrierefreies Bad Rodenkirchen', category: 'Badsanierung', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80', description: 'Seniorengerechter Umbau mit bodengleicher Dusche und Haltelementen.' },
          ],
        }},
        { type: 'logoCloud', sortOrder: 2, data: {
          headline: 'Partner & Zertifikate',
          items: [
            { name: 'Handwerkskammer Köln', logo: '' },
            { name: 'Viessmann Partner', logo: '' },
            { name: 'Grohe Professional', logo: '' },
            { name: 'Buderus Systempartner', logo: '' },
          ],
        }},
      ],
    },
    /* ─── Über uns ─── */
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Familie. Handwerk. Leidenschaft.',
          subline: 'Seit drei Generationen stehen wir für zuverlässige Handwerkskunst in Köln und Umgebung.',
          badgeText: 'Über uns',
          bgImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=85',
        }},
        { type: 'textImage', sortOrder: 1, data: {
          headline: 'Unsere Geschichte',
          text: 'Gegründet 1978 von Heinrich Müller als Ein-Mann-Betrieb, ist unser Unternehmen heute ein 12-köpfiges Team mit zwei Meistern und vier Gesellen. Die dritte Generation – Max und Jonas Müller – führen den Betrieb mit der gleichen Hingabe wie ihr Großvater.',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
        }},
        { type: 'team', sortOrder: 2, data: {
          headline: 'Unser Team',
          badgeText: 'Menschen',
          members: [
            { name: 'Max Müller', role: 'Geschäftsführer & Meister', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
            { name: 'Jonas Müller', role: 'Technischer Leiter & Meister', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
            { name: 'Sarah Klein', role: 'Büro & Kundenservice', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
            { name: 'Marco Schulte', role: 'Geselle Sanitär', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
          ],
        }},
        { type: 'timeline', sortOrder: 3, data: {
          headline: 'Meilensteine',
          badge: 'Geschichte',
          entries: [
            { year: '1978', title: 'Gründung', text: 'Heinrich Müller gründet den Betrieb als Sanitär-Installateur.' },
            { year: '1992', title: 'Erweiterung Heizung', text: 'Aufnahme des Heizungsbaus, erste Mitarbeiter.' },
            { year: '2005', title: 'Übernahme 2. Generation', text: 'Sohn Peter Müller übernimmt die Geschäftsführung.' },
            { year: '2018', title: 'Digitalisierung', text: '3D-Badplanung, Smart-Home-Integration und digitale Auftragssteuerung.' },
            { year: '2022', title: '3. Generation', text: 'Max und Jonas Müller steigen ein. Fokus auf nachhaltige Heiztechnik.' },
          ],
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontaktieren Sie uns',
          subline: 'Wir sind für Sie da – persönlich, telefonisch oder per E-Mail.',
          badgeText: 'Kontakt',
          bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
        }},
        { type: 'contact', sortOrder: 1, data: {
          headline: 'Schreiben Sie uns',
          subline: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
          showPhone: true,
          showEmail: true,
          showAddress: true,
        }},
        { type: 'map', sortOrder: 2, data: {
          headline: 'So finden Sie uns',
          lat: 50.9375,
          lng: 6.9603,
          zoom: 15,
        }},
        { type: 'faq', sortOrder: 3, data: {
          headline: 'Häufige Fragen',
          items: [
            { question: 'Wie schnell können Sie bei einem Notfall kommen?', answer: 'Unser Notdienst ist 24/7 erreichbar. In der Regel sind wir innerhalb von 30–60 Minuten bei Ihnen.' },
            { question: 'Bieten Sie kostenlose Beratungstermine an?', answer: 'Ja, die Erstberatung inklusive Vor-Ort-Begehung ist bei uns immer kostenlos und unverbindlich.' },
            { question: 'Wie lange dauert eine Badsanierung?', answer: 'Je nach Umfang 2–4 Wochen. Bei der Erstberatung erhalten Sie einen verbindlichen Zeitplan.' },
            { question: 'Welche Zahlungsmöglichkeiten gibt es?', answer: 'Rechnung (14 Tage Ziel), Ratenzahlung bei größeren Projekten oder direkte Überweisung.' },
          ],
        }},
      ],
    },
  ],
};
