/**
 * Rich demo seed: Tourism (Ötztal Tourismus)
 * ALL section types incl. gallery, faq, tourismContact
 */
export const TOURISM_CONFIG = {
  slug: 'demo-tourism',
  name: 'Ötztal Tourismus',
  industry: 'tourism' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Ötztal Tourismus',
    tagline: 'Erleben Sie die Ötztaler Alpen — Sommer & Winter',
    primaryColor: '#065f46',
    secondaryColor: '#059669',
    accentColor: '#34d399',
  },
  contact: { phone: '+43 5254 500 00', email: 'info@oetztal-tourismus.at', address: 'Gemeindestraße 4, 6450 Sölden, Tirol' },
  socialLinks: { instagram: 'https://instagram.com/oetztal', facebook: 'https://facebook.com/oetztal', youtube: 'https://youtube.com/oetztal' },
  openingHours: [{ day: 'Mo–Fr', hours: '08:00–18:00' }, { day: 'Sa', hours: '09:00–17:00' }, { day: 'So & Feiertage', hours: '09:00–12:00' }],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
    { label: 'Unterkünfte', href: '/unterkuenfte', type: 'link' },
    { label: 'Veranstaltungen', href: '/veranstaltungen', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Urlaub planen', href: '/kontakt' },
  footerColumns: [
    { title: 'Erleben', items: [{ text: 'Wandern & Klettern', href: '/erlebnisse' }, { text: 'Skifahren & Winter', href: '/erlebnisse' }, { text: 'Veranstaltungen', href: '/veranstaltungen' }] },
    { title: 'Planen', items: [{ text: 'Unterkünfte', href: '/unterkuenfte' }, { text: 'Anreise & Mobilität', href: '/kontakt' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Info-Büro', items: [{ text: 'Mo–Fr: 08:00–18:00' }, { text: 'Sa: 09:00–17:00' }, { text: 'So: 09:00–12:00' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt Urlaub planen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Ötztal — Wo Berge Geschichten erzählen',
          subline: 'Entdecken Sie eines der vielseitigsten Alpentäler Tirols: Über 300 km Wanderwege, Europas höchster Wasserfall und Weltklasse-Skigebiete auf über 3.000 m.',
          badgeText: 'Tirol, Österreich',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
          trustItems: ['UNESCO Biosphärenpark', '250+ km Wanderwege', '2 Gletscherskigebiete'],
          primaryCta: { label: 'Erlebnisse entdecken', href: '/erlebnisse' },
          secondaryCta: { label: 'Unterkunft finden', href: '/unterkuenfte' },
        }},
        { type: 'tourismHighlights', sortOrder: 1, data: {
          headline: 'Highlights im Ötztal',
          subline: 'Die Top-Erlebnisse für Ihren Aufenthalt',
          badgeText: 'Ganzjährig',
          highlights: [
            { title: 'Stuibenfall — Tirols höchster Wasserfall', text: '159 Meter stürzt das Wasser in die Tiefe. Der gesicherte Klettersteig und die neue Aussichtsplattform bieten spektakuläre Perspektiven. Für Familien gibt es den leichten Wanderweg (45 Min.).', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', icon: 'waterfall', cta: { label: 'Mehr erfahren', href: '/erlebnisse' } },
            { title: 'Sölden — Ski-Weltcup-Ort', text: 'Drei Dreitausender, 144 Pistenkilometer, schneesicher von Oktober bis Mai. Sölden ist Austragungsort des jährlichen FIS Ski-Weltcups und Drehort von James Bond "Spectre".', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', icon: 'skiing', cta: { label: 'Skigebiet erkunden', href: '/erlebnisse' } },
            { title: 'Ötzi-Fundstelle & Museum', text: 'Am Tisenjoch wurde 1991 die berühmteste Gletschermumie der Welt entdeckt. Das archäologische Freilichtmuseum in Umhausen erzählt die Geschichte des "Mannes aus dem Eis".', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', icon: 'museum', cta: { label: 'Geschichte erleben', href: '/erlebnisse' } },
            { title: 'AREA 47 — Outdoor-Playground', text: 'Europas größter Outdoor-Freizeitpark: Rafting, Canyoning, Wakeboarding, Hochseilgarten und vieles mehr. Adrenalin pur für Abenteuerlustige jeden Alters.', image: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=900&q=80', icon: 'adventure', cta: { label: 'Abenteuer buchen', href: '/erlebnisse' } },
          ],
        }},
        { type: 'tourismSeasons', sortOrder: 2, data: {
          headline: 'Ganzjährig einzigartig',
          subline: 'Jede Jahreszeit hat ihren eigenen Zauber',
          seasons: [
            { title: 'Sommer', subtitle: 'Mai bis Oktober', description: 'Wandern, Klettern, Mountainbiken, Rafting und Baden — im Sommer zeigt sich das Ötztal von seiner vielfältigsten Seite. Über 250 km markierte Wanderwege, 16 Almen und der schönste Wasserfall Tirols warten.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', activities: ['Wandern & Bergsteigen', 'Mountainbike & E-Bike', 'Klettern & Via Ferrata', 'Rafting & Canyoning', 'Baden im Piburger See'] },
            { title: 'Winter', subtitle: 'November bis April', description: 'Zwei Weltklasse-Skigebiete, Langlaufloipen, Winterwanderwege und Rodelbahnen. Sölden und Obergurgl-Hochgurgl garantieren Schneesicherheit dank Gletscherlage.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', activities: ['Skifahren & Snowboard', 'Langlauf & Skating', 'Winterwandern', 'Rodeln', 'Skitourengehen'] },
          ],
        }},
        { type: 'testimonials', sortOrder: 3, data: {
          headline: 'Stimmen unserer Gäste',
          subline: 'Was Besucher über das Ötztal sagen',
          testimonials: [
            { name: 'Familie Schneider', location: 'Stuttgart', rating: 5, text: 'Zum vierten Mal im Ötztal und jedes Jahr entdecken wir Neues. Die Wanderwege sind perfekt markiert, die Hütten gemütlich und die Bergkulisse unschlagbar.' },
            { name: 'Marco B.', location: 'Mailand', rating: 5, text: 'Sölden ist nicht nur ein Skigebiet — es ist ein Erlebnis. Die Qualität der Pisten, die Gastfreundschaft und das Panorama sind erstklassig.' },
            { name: 'Sarah & Tim', location: 'Berlin', rating: 5, text: 'AREA 47 war der absolute Wahnsinn! Canyoning im Ötztal hat unser Adrenalin-Level auf ein neues Level gebracht. Nächstes Jahr kommen wir zum Klettern wieder.' },
          ],
        }},
      ],
    },
    {
      slug: 'erlebnisse', title: 'Erlebnisse', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Erlebnisse im Ötztal',
          subline: 'Von gemütlichen Almwanderungen bis zu adrenalingeladenen Outdoor-Abenteuern',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
          primaryCta: { label: 'Erlebnis buchen', href: '/kontakt' },
        }},
        { type: 'tourismActivities', sortOrder: 1, data: {
          headline: 'Aktivitäten',
          subline: 'Für jeden Geschmack das richtige Abenteuer',
          activities: [
            { title: 'Wandern & Bergsteigen', description: 'Über 250 km markierte Wege — von leichten Familienwanderungen entlang des Ötztaler Ache bis zu anspruchsvollen Hochtouren auf die Wildspitze (3.774 m).', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80', difficultyLabel: 'Leicht bis Schwer', durationLabel: '1–8 Stunden', seasonLabel: 'Mai–Oktober', cta: { label: 'Touren entdecken', href: '/erlebnisse' } },
            { title: 'Mountainbike & E-Bike', description: '800+ Höhenmeter, Singletrails und Forstwege: Das Ötztal ist ein Paradies für Biker. E-Bike-Ladestationen an jeder Alm. Bike-Verleih direkt im Tal.', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=900&q=80', difficultyLabel: 'Mittel bis Schwer', durationLabel: '2–6 Stunden', seasonLabel: 'Mai–Oktober', cta: { label: 'Trails ansehen', href: '/erlebnisse' } },
            { title: 'Skifahren in Sölden', description: '144 Pistenkilometer, 31 Lifte, 3 Dreitausender: BIG 3 Rallye, Gletscherskifahren auf dem Rettenbachferner und die legendäre Gaislachkogelbahn.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', difficultyLabel: 'Alle Schwierigkeitsgrade', durationLabel: 'Ganzer Tag', seasonLabel: 'Oktober–Mai', cta: { label: 'Skipass buchen', href: '/kontakt' } },
            { title: 'Rafting & Canyoning', description: 'Die Ötztaler Ache gehört zu den besten Wildwasserflüssen Europas. Professionelle Guides für Anfänger und Fortgeschrittene. Ab 12 Jahren.', image: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=900&q=80', difficultyLabel: 'Mittel', durationLabel: '2–4 Stunden', seasonLabel: 'Juni–September', cta: { label: 'Tour buchen', href: '/kontakt' } },
            { title: 'Klettern & Klettersteige', description: '12 Klettersteige von A (leicht) bis D (sehr schwer), darunter der spektakuläre Stuibenfall-Klettersteig direkt am höchsten Wasserfall Tirols.', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=900&q=80', difficultyLabel: 'A bis D', durationLabel: '2–6 Stunden', seasonLabel: 'Juni–Oktober', cta: { label: 'Klettersteige ansehen', href: '/erlebnisse' } },
            { title: 'Wellness & Therme', description: 'Aqua Dome in Längenfeld: Spektakuläre Thermenwelt mit Innen- und Außenbecken, Saunawelt und Spa-Treatments — eingebettet in die Berglandschaft.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', difficultyLabel: 'Entspannt', durationLabel: 'Halber/Ganzer Tag', seasonLabel: 'Ganzjährig', cta: { label: 'Therme besuchen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'unterkuenfte', title: 'Unterkünfte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unterkünfte im Ötztal',
          subline: 'Von der gemütlichen Ferienwohnung bis zum Luxushotel — finden Sie Ihre perfekte Basis',
          bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
        }},
        { type: 'tourismAccommodation', sortOrder: 1, data: {
          headline: 'Übernachten im Ötztal',
          subline: 'Über 500 Betriebe für jeden Geschmack und jedes Budget',
          categories: [
            { title: 'Hotels & Resorts', description: 'Von familiär bis 5-Sterne-Superior: Wellnesshotels, Sporthotels und Boutiquehotels mit Tiroler Charme.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', priceLabel: 'Ab 80 € / Nacht', features: ['Frühstück/Halbpension', 'Wellnessbereiche', 'Ski-Depot', 'Kinderbetreuung'], cta: { label: 'Hotels entdecken', href: '/unterkuenfte' } },
            { title: 'Ferienwohnungen', description: 'Ideal für Familien und längere Aufenthalte: Voll ausgestattete Apartments mit Küche und Bergblick.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80', priceLabel: 'Ab 60 € / Nacht', features: ['Eigene Küche', 'Wohnbereich', 'Parkplatz', 'Flexible Buchung'], cta: { label: 'Wohnungen ansehen', href: '/unterkuenfte' } },
            { title: 'Berghütten & Almen', description: 'Authentisches Bergerlebnis: Übernachten auf einer der 16 bewirtschafteten Almen im Ötztal. Einfach, ursprünglich, unvergesslich.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', priceLabel: 'Ab 35 € / Nacht', features: ['Hüttenübernachtung', 'Halbpension', 'Tiroler Küche', 'Naturerlebnis'], cta: { label: 'Hütten finden', href: '/unterkuenfte' } },
            { title: 'Camping', description: 'Zwei moderne Campingplätze mit Komfortstellplätzen, Sanitärgebäuden und Brötchenservice — direkt am Fluss.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80', priceLabel: 'Ab 25 € / Stellplatz', features: ['Stromanschluss', 'Sanitär', 'WLAN', 'Grillplätze'], cta: { label: 'Camping buchen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'veranstaltungen', title: 'Veranstaltungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Veranstaltungen',
          subline: 'Events, Feste und Highlights rund ums Jahr',
          bgImage: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=1800&q=85',
        }},
        { type: 'tourismEvents', sortOrder: 1, data: {
          headline: 'Eventkalender',
          subline: 'Die wichtigsten Termine im Überblick',
          events: [
            { title: 'FIS Ski-Weltcup Sölden', dateLabel: 'Oktober 2026', description: 'Der traditionelle Saisonauftakt im Ski-Weltcup am Rettenbachferner. Riesenslalom der Damen und Herren mit Rahmenprogramm und Live-Konzerten.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', locationLabel: 'Rettenbachferner, Sölden', cta: { label: 'Tickets sichern', href: '/kontakt' } },
            { title: 'Ötztaler Radmarathon', dateLabel: 'August 2026', description: 'Einer der härtesten und beliebtesten Radmarathons Europas: 238 km, 5.500 Höhenmeter über 4 Alpenpässe. Limitiert auf 4.000 Starter.', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=900&q=80', locationLabel: 'Start & Ziel: Sölden', cta: { label: 'Anmeldung', href: '/kontakt' } },
            { title: 'Ötztaler Almfest', dateLabel: 'Juli 2026', description: 'Traditionelles Tiroler Almfest mit Schuhplattler, Blasmusik, Handwerksvorführungen und Tiroler Kulinarik. Familienfreundlich mit Kinderprogramm.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', locationLabel: 'Verschiedene Almen', cta: { label: 'Programm ansehen', href: '/veranstaltungen' } },
            { title: 'Electric Mountain Festival', dateLabel: 'April 2026', description: 'Das legendäre Après-Ski-Festival in Sölden mit internationalen DJs. Drei Tage Elektro, House und Techno auf der Giggijoch-Hütte.', image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80', locationLabel: 'Giggijoch, Sölden', cta: { label: 'Line-up & Tickets', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'galerie', title: 'Galerie', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Galerie',
          subline: 'Das Ötztal in Bildern — lassen Sie sich inspirieren',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'gallery', sortOrder: 1, data: {
          headline: 'Bildergalerie',
          subline: 'Impressionen aus dem Ötztal',
          images: [
            { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', alt: 'Ötztaler Alpen Panorama', caption: 'Blick auf die Ötztaler Alpen bei Sonnenaufgang', category: 'Landschaft' },
            { src: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', alt: 'Skifahren in Sölden', caption: 'Pistenvergnügen am Gaislachkogl', category: 'Winter' },
            { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80', alt: 'Wandern im Ötztal', caption: 'Auf dem Weg zur Breslauer Hütte', category: 'Sommer' },
            { src: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&q=80', alt: 'Stuibenfall', caption: 'Tirols höchster Wasserfall — 159 Meter', category: 'Natur' },
            { src: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=900&q=80', alt: 'Rafting auf der Ötztaler Ache', caption: 'Wildwasser-Abenteuer auf der Ache', category: 'Abenteuer' },
            { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80', alt: 'Berghütte', caption: 'Gemütliche Einkehr auf der Alm', category: 'Kulinarik' },
            { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=80', alt: 'Aqua Dome Therme', caption: 'Entspannung im Aqua Dome Längenfeld', category: 'Wellness' },
            { src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80', alt: 'Camping im Ötztal', caption: 'Naturnahes Camping am Fluss', category: 'Unterkunft' },
            { src: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=900&q=80', alt: 'Klettersteig', caption: 'Klettersteig am Stuibenfall', category: 'Abenteuer' },
            { src: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=900&q=80', alt: 'Radfahren', caption: 'Route des Ötztaler Radmarathons', category: 'Sommer' },
          ],
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt & Anreise', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Anreise',
          subline: 'Wir helfen Ihnen bei der Planung Ihres Ötztal-Urlaubs',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85',
        }},
        { type: 'tourismContact', sortOrder: 1, data: {
          headline: 'Informationsbüro Ötztal Tourismus',
          subline: 'Persönliche Beratung, Prospekte und Buchungsservice',
          introText: 'Unser Team berät Sie gerne bei der Planung Ihres Aufenthalts — ob Unterkunft, Aktivitäten oder Veranstaltungen. Besuchen Sie uns im Info-Büro oder kontaktieren Sie uns telefonisch oder per E-Mail.',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 5254 500 00' },
            { icon: 'mail', label: 'E-Mail', value: 'info@oetztal-tourismus.at' },
            { icon: 'map', label: 'Adresse', value: 'Gemeindestraße 4, 6450 Sölden' },
            { icon: 'clock', label: 'Öffnungszeiten', value: 'Mo–Fr 08–18, Sa 09–17, So 09–12' },
          ],
          primaryCta: { label: 'Nachricht senden', href: '/kontakt' },
          secondaryCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Gemeindestraße+4,+6450+Sölden' },
        }},
        { type: 'faq', sortOrder: 2, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Das Wichtigste für Ihre Urlaubsplanung',
          items: [
            { question: 'Wie erreiche ich das Ötztal?', answer: 'Mit dem Auto über die A12 Inntalautobahn (Ausfahrt Ötztal). Mit der Bahn bis Ötztal Bahnhof, von dort verkehren regelmäßig Busse ins Tal. Von Innsbruck Flughafen ca. 60 Minuten Fahrtzeit.' },
            { question: 'Wann ist die beste Reisezeit?', answer: 'Sommer (Juni–September): Ideal zum Wandern, Radfahren, Klettern. Winter (Dezember–April): Perfekt für Ski, Langlauf, Winterwandern. Gletscherskifahren ist sogar ab Oktober möglich.' },
            { question: 'Gibt es eine Gästekarte?', answer: 'Ja! Die Ötztal Card ist Ihre All-inclusive-Karte: Bergbahnen, öffentlicher Nahverkehr, Freibäder, Museen und viele Partnerbetriebe inklusive. Erhältlich bei teilnehmenden Unterkünften.' },
            { question: 'Ist das Ötztal familienfreundlich?', answer: 'Absolut! Zahlreiche Familienwanderwege, Spielplätze, der Erlebnispark WIDIVERSUM, Kinderbetreuung in vielen Hotels und spezielle Familien-Packages machen das Ötztal zum idealen Familienreiseziel.' },
            { question: 'Brauche ich ein Auto vor Ort?', answer: 'Nicht unbedingt. Der Ötztal-Bus verkehrt regelmäßig zwischen allen Orten. Im Winter gibt es kostenlose Skibusse. Die Ötztal Card beinhaltet die Nutzung aller öffentlichen Verkehrsmittel im Tal.' },
            { question: 'Kann ich im Sommer auf dem Gletscher Ski fahren?', answer: 'Nein, Sommer-Skifahren am Rettenbachferner wurde eingestellt. Die Gletscherskisaison startet im Oktober und endet im Mai. Im Sommer laden die Gletscher zum Wandern und Staunen ein.' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Kontaktieren Sie uns', href: '/kontakt' },
        }},
      ],
    },
  ],
};
