/**
 * Rich demo seed: Wedding (Hochzeit von Anna & Sebastian)
 */
export const WEDDING_CONFIG = {
  slug: 'demo-wedding',
  name: 'Anna & Sebastian',
  industry: 'wedding' as const,
  activeStyle: 'elegant',
  brand: {
    companyName: 'Anna & Sebastian',
    tagline: '14. September 2025 – Schloss Mirabell, Salzburg',
    primaryColor: '#9f7048',
    secondaryColor: '#7c5e3c',
    accentColor: '#e8d5c4',
  },
  contact: { phone: '+43 664 123 4567', email: 'hochzeit@anna-sebastian.at', address: 'Schloss Mirabell, Mirabellplatz 4, 5020 Salzburg' },
  socialLinks: { instagram: 'https://instagram.com/anna.sebastian.2025' },
  openingHours: [],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Unsere Geschichte', href: '/unsere-geschichte', type: 'link' },
    { label: 'Ablauf', href: '/ablauf', type: 'link' },
    { label: 'Location', href: '/location', type: 'link' },
    { label: 'Anreise', href: '/anreise', type: 'link' },
    { label: 'RSVP', href: '/rsvp', type: 'link' },
  ],
  navCta: { label: 'Zusagen', href: '/rsvp' },
  footerColumns: [
    { title: 'Infos', items: [{ text: 'Unsere Geschichte', href: '/unsere-geschichte' }, { text: 'Ablauf', href: '/ablauf' }, { text: 'Location', href: '/location' }] },
    { title: 'Gäste', items: [{ text: 'Anreise & Hotel', href: '/anreise' }, { text: 'Dresscode', href: '/ablauf' }, { text: 'RSVP', href: '/rsvp' }] },
    { title: 'Kontakt', items: [{ text: 'hochzeit@anna-sebastian.at' }, { text: '14.09.2025 – Salzburg' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: null,
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Anna & Sebastian',
          subline: 'Wir heiraten! Feiert mit uns den schönsten Tag unseres Lebens am 14. September 2025 in Salzburg.',
          badgeText: 'Save the Date',
          bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
          primaryCta: { label: 'Jetzt zusagen', href: '/rsvp' },
          secondaryCta: { label: 'Unsere Geschichte', href: '/unsere-geschichte' },
        }},
        { type: 'coupleStory', sortOrder: 1, data: {
          headline: 'Wie alles begann',
          badgeText: 'Unsere Geschichte',
          intro: 'Ein zufälliges Treffen in einem Wiener Kaffeehaus im Herbst 2019 wurde zum Anfang von allem.',
          milestones: [
            { date: 'Oktober 2019', title: 'Das erste Treffen', text: 'Ein verregneter Sonntagnachmittag im Café Central. Anna las, Sebastian suchte einen Platz – und fand viel mehr.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
            { date: 'Silvester 2019', title: 'Das erste „Ich liebe dich"', text: 'Auf einer Dachterrasse mit Blick über Wien, um Punkt Mitternacht.', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80' },
            { date: 'März 2023', title: 'Der Antrag', text: 'Auf dem Gipfel des Untersberg, 1.853 m über dem Alltag. Sie sagte Ja – noch bevor die Frage zu Ende war.', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80' },
          ],
        }},
        { type: 'eventSchedule', sortOrder: 2, data: {
          headline: 'Der Tag im Überblick',
          badgeText: 'Ablauf',
          events: [
            { time: '14:00', title: 'Trauung', description: 'Standesamtliche Trauung im Marmorsaal, Schloss Mirabell.', icon: 'heart' },
            { time: '15:30', title: 'Sektempfang', description: 'Im Mirabellgarten mit Live-Quartett und Canapés.', icon: 'wine' },
            { time: '18:00', title: 'Dinner', description: '4-Gänge-Menü im Festsaal mit Weinbegleitung.', icon: 'utensils' },
            { time: '21:00', title: 'Eröffnungstanz & Party', description: 'DJ, Fotobox und Mitternachtssnack bis in die Morgenstunden.', icon: 'music' },
          ],
        }},
        { type: 'venueInfo', sortOrder: 3, data: {
          headline: 'Die Location',
          subline: 'Schloss Mirabell – Salzburg',
          badgeText: 'Location',
          description: 'Eines der schönsten Barockschlösser Europas, berühmt durch den Marmorsaal und den weltberühmten Mirabellgarten.',
          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
          features: ['Marmorsaal für die Trauung', 'Mirabellgarten für den Empfang', 'Festsaal für Dinner & Party', 'Historisches Ambiente'],
        }},
        { type: 'ctaBand', sortOrder: 4, data: {
          headline: 'Wir freuen uns auf Euch!',
          subline: 'Bitte gebt bis zum 1. Juli 2025 Bescheid, ob Ihr dabei sein könnt.',
          badgeText: '♥',
          ctaPrimary: { label: 'Zur Zusage', href: '/rsvp' },
        }},
      ],
    },
    /* ─── Unsere Geschichte ─── */
    {
      slug: 'unsere-geschichte', title: 'Unsere Geschichte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Geschichte',
          subline: 'Von einem zufälligen Kaffee zu dem Tag, an dem wir „Ja" sagen.',
          badgeText: 'Love Story',
          bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1800&q=85',
        }},
        { type: 'coupleStory', sortOrder: 1, data: {
          headline: 'Die ganze Geschichte',
          milestones: [
            { date: 'Oktober 2019', title: 'Café Central, Wien', text: 'Ein Tisch, zwei Fremde, ein langer Nachmittag. Was als höfliche Konversation begann, wurde ein dreistündiges Gespräch über Bücher, Reisen und Lebenspläne.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
            { date: 'Dezember 2019', title: 'Das offizielle erste Date', text: 'Christkindlmarkt am Rathausplatz. Glühwein, Schneefall und das Gefühl, dass jemand wirklich zuhört.', image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600&q=80' },
            { date: 'März 2020', title: 'Lockdown-Zusammenzug', text: 'Was als „Übergangs-WG" begann, wurde unser erstes gemeinsames Zuhause. Kochen, Netflix, und die Gewissheit, den richtigen Menschen gefunden zu haben.', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80' },
            { date: 'Sommer 2021', title: 'Roadtrip durch Portugal', text: 'Drei Wochen, ein Van, unzählige Sonnenuntergänge. In Lagos am Strand flüsterte Anna zum ersten Mal „Ich will das für immer."', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80' },
            { date: 'März 2023', title: 'Der Antrag', text: 'Sebastian überraschte Anna auf dem Untersberg bei Salzburg mit einem Ring und der wichtigsten Frage seines Lebens.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80' },
            { date: '14. Sep 2025', title: 'Der große Tag', text: 'Und hier sind wir nun – bereit für das nächste Kapitel. Mit Euch.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
          ],
        }},
      ],
    },
    /* ─── Ablauf ─── */
    {
      slug: 'ablauf', title: 'Ablauf', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Der Tagesablauf',
          subline: 'Alles, was Ihr über den 14. September wissen müsst.',
          badgeText: 'Programm',
          bgImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85',
        }},
        { type: 'eventSchedule', sortOrder: 1, data: {
          headline: 'Zeitplan',
          events: [
            { time: '13:30', title: 'Ankunft der Gäste', description: 'Bitte seid pünktlich im Schloss Mirabell. Platzierung im Marmorsaal.', icon: 'clock' },
            { time: '14:00', title: 'Standesamtliche Trauung', description: 'Im historischen Marmorsaal – ein Ort, an dem schon Mozart spielte.', icon: 'heart' },
            { time: '15:00', title: 'Sektempfang im Garten', description: 'Bei Schönwetter im Mirabellgarten, Alternativ: Orangerie.', icon: 'wine' },
            { time: '15:30', title: 'Gruppenfoto', description: 'Bitte alle am Pegasusbrunnen versammeln!', icon: 'camera' },
            { time: '18:00', title: 'Abendessen im Festsaal', description: '4-Gänge-Menü. Bitte gebt bei der Zusage Eure Unverträglichkeiten an.', icon: 'utensils' },
            { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar – danach gehört die Tanzfläche Euch!', icon: 'music' },
            { time: '23:00', title: 'Mitternachtssnack', description: 'Deftige Jause und Süßes gegen den kleinen Hunger.', icon: 'cake' },
            { time: '02:00', title: 'Ende der Feier', description: 'Shuttle-Service zu den Hotels ab 23:30 und 01:30.', icon: 'bus' },
          ],
        }},
        { type: 'dresscode', sortOrder: 2, data: {
          headline: 'Dresscode',
          description: 'Festlich elegant. Wir freuen uns über gedeckte, warme Erdtöne – passend zum herbstlichen Ambiente. Bitte kein Weiß oder Creme.',
          menSuggestion: 'Dunkler Anzug, Krawatte optional',
          womenSuggestion: 'Langes oder knielanges Kleid, festlicher Jumpsuit',
        }},
        { type: 'faq', sortOrder: 3, data: {
          headline: 'Häufige Fragen',
          items: [
            { question: 'Darf ich jemanden mitbringen?', answer: 'Bitte nur die Personen, die namentlich eingeladen sind. Bei Fragen meldet Euch gerne.' },
            { question: 'Sind Kinder willkommen?', answer: 'Wir lieben Eure Kinder! Für die Kleinen gibt es eine betreute Spielecke ab 18 Uhr.' },
            { question: 'Gibt es einen Parkplatz?', answer: 'Das Schloss hat keine eigenen Parkplätze. Nutzt das Parkhaus Mirabell (5 Gehminuten) oder den Shuttle.' },
            { question: 'Welche Geschenke wünscht Ihr Euch?', answer: 'Eure Anwesenheit ist das größte Geschenk! Wer möchte, darf gern einen Umschlag mitbringen – wir sparen für die Flitterwochen.' },
          ],
        }},
      ],
    },
    /* ─── Location ─── */
    {
      slug: 'location', title: 'Location', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Schloss Mirabell',
          subline: 'Einer der schönsten Orte Salzburgs – und bald der Ort unserer Trauung.',
          badgeText: 'Location',
          bgImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85',
        }},
        { type: 'venueInfo', sortOrder: 1, data: {
          headline: 'Der Marmorsaal',
          description: 'Einer der schönsten Trauungssäle der Welt. Barockfresken, vergoldete Stuckaturen und die Akustik, die schon Mozart begeisterte.',
          image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
          features: ['Kapazität: 80 Personen', 'Historisches Barock-Interieur', 'Natürliches Licht', 'Flügel vorhanden'],
        }},
        { type: 'galleryGrid', sortOrder: 2, data: {
          headline: 'Impressionen',
          images: [
            { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', alt: 'Schloss Mirabell' },
            { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', alt: 'Marmorsaal' },
            { src: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80', alt: 'Mirabellgarten' },
            { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Festsaal' },
          ],
        }},
        { type: 'map', sortOrder: 3, data: {
          headline: 'Anfahrt',
          lat: 47.8054,
          lng: 13.0427,
          zoom: 15,
        }},
      ],
    },
    /* ─── Anreise ─── */
    {
      slug: 'anreise', title: 'Anreise & Hotels', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Anreise & Übernachtung',
          subline: 'Tipps für Eure Anreise und unsere Hotelempfehlungen.',
          badgeText: 'Praktisch',
          bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
        }},
        { type: 'travelInfo', sortOrder: 1, data: {
          headline: 'So kommt Ihr zu uns',
          sections: [
            { icon: 'car', title: 'Mit dem Auto', text: 'A1 Richtung Salzburg, Abfahrt Salzburg-Mitte. Parkhaus Mirabell (5 min Fußweg). Kosten: ca. 15 € / Tag.' },
            { icon: 'train', title: 'Mit der Bahn', text: 'Salzburg Hbf, dann O-Bus Linie 1 bis Mirabellplatz (8 min) oder 15 min zu Fuß.' },
            { icon: 'plane', title: 'Mit dem Flugzeug', text: 'Flughafen Salzburg (W.A. Mozart), dann Taxi (10 min) oder Bus Linie 2 zum Zentrum.' },
          ],
          shuttleInfo: 'Wir organisieren einen Shuttle-Service von den Hotels zum Schloss und zurück (18:00, 23:30, 01:30).',
        }},
        { type: 'textImage', sortOrder: 2, data: {
          headline: 'Hotelempfehlungen',
          text: '<p><strong>Hotel Sacher Salzburg</strong> ★★★★★<br>Schwarzstraße 5–7 (3 min zum Schloss)<br>Kontingent „Hochzeit A&S" bis 01.07.2025</p><p><strong>Hotel Bristol</strong> ★★★★<br>Makartplatz 4 (2 min zum Schloss)<br>Gruppenpreis ab 159 €/Nacht</p><p><strong>Star Inn Hotel Zentrum</strong> ★★★<br>Hildmannplatz 5 (10 min)<br>Budget-Option ab 89 €/Nacht</p>',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        }},
      ],
    },
    /* ─── RSVP ─── */
    {
      slug: 'rsvp', title: 'RSVP', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Sagt uns Bescheid!',
          subline: 'Bitte antwortet bis zum 1. Juli 2025.',
          badgeText: 'RSVP',
          bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
        }},
        { type: 'rsvp', sortOrder: 1, data: {
          headline: 'Eure Zusage',
          subline: 'Wir können es kaum erwarten, mit Euch zu feiern!',
          deadline: '2025-07-01',
          fields: ['name', 'email', 'guests', 'dietary', 'song', 'message'],
          songWishLabel: 'Euer Tanzflächen-Hit?',
          dietaryLabel: 'Unverträglichkeiten / Allergien',
        }},
      ],
    },
  ],
};
