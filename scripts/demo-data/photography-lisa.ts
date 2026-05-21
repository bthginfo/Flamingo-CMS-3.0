export const PHOTOGRAPHY_LISA_CONFIG = {
  slug: 'demo-photography',
  name: 'Lisa Morgenthaler Fotografie',
  industry: 'photography' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Lisa Morgenthaler Fotografie',
    tagline: 'Emotionale Momentaufnahmen',
    primaryColor: '#2c2c2c',
    secondaryColor: '#f5f0eb',
    accentColor: '#c9a96e',
  },
  contact: {
    phone: '+49 6131 1234567',
    email: 'hello@lisa-morgenthaler.de',
    address: 'Mainz-Bretzenheim, Rheinhessen',
  },
  socialLinks: {
    instagram: 'https://instagram.com/lisamorgenthaler',
  },
  navItems: [
    { label: 'Portfolio', href: '/portfolio', type: 'link' as const },
    { label: 'Leistungen', href: '/leistungen', type: 'link' as const },
    { label: 'Über mich', href: '/ueber-mich', type: 'link' as const },
    { label: 'FAQ', href: '/faq', type: 'link' as const },
    { label: 'Kontakt', href: '/kontakt', type: 'link' as const },
  ],
  navCta: { label: 'Jetzt anfragen', href: '/kontakt' },
  footerColumns: [
    {
      title: 'Leistungen',
      items: [
        { text: 'Hochzeitsreportage', href: '/leistungen' },
        { text: 'Paarshooting', href: '/leistungen' },
        { text: 'Babybauch', href: '/leistungen' },
        { text: 'Portrait', href: '/leistungen' },
      ],
    },
    {
      title: 'Infos',
      items: [
        { text: 'Über mich', href: '/ueber-mich' },
        { text: 'FAQ', href: '/faq' },
        { text: 'Portfolio', href: '/portfolio' },
        { text: 'Kontakt', href: '/kontakt' },
      ],
    },
  ],
  footerLegalLinks: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
  footerCta: { label: 'Jetzt anfragen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Emotionale Momentaufnahmen',
            subline: 'Hochzeitsfotografie, Portraits & Paarshootings im Rhein-Main-Gebiet. Authentisch, natürlich, voller Gefühl.',
            badgeText: 'Fotografin seit 2016',
            bgImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=85',
            trustItems: ['Über 200 Hochzeiten', 'Rhein-Main-Gebiet', 'LGBTQ+ friendly'],
            primaryCta: { label: 'Jetzt anfragen', href: '/kontakt' },
            secondaryCta: { label: 'Portfolio ansehen', href: '/portfolio' },
          },
        },
        {
          type: 'uspStrip',
          sortOrder: 1,
          data: {
            items: [
              { icon: 'camera', title: 'Natürlicher Stil', text: 'Keine gestellten Posen – echte Emotionen.' },
              { icon: 'heart', title: 'Mit Leidenschaft', text: 'Jede Hochzeit ist einzigartig, so wie meine Fotos.' },
              { icon: 'clock', title: 'Flexible Pakete', text: 'Von 3 bis 10 Stunden, individuell auf euch abgestimmt.' },
              { icon: 'image', title: 'Schnelle Lieferung', text: 'Eure Galerie innerhalb von 8 Wochen.' },
            ],
          },
        },
        {
          type: 'portfolioGallery',
          sortOrder: 2,
          data: {
            badge: 'Portfolio',
            headline: 'Einblicke in meine Arbeit',
            subline: 'Eine Auswahl meiner liebsten Hochzeits- und Paarfotos.',
            categories: ['Hochzeiten', 'Paare', 'Portraits'],
            images: [
              { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'First Look', category: 'Hochzeiten' },
              { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', alt: 'Brautpaar im Weinberg', category: 'Hochzeiten' },
              { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', alt: 'Hochzeitstanz', category: 'Hochzeiten' },
              { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', alt: 'Paar am See', category: 'Paare' },
              { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80', alt: 'Golden Hour', category: 'Paare' },
              { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', alt: 'Portrait', category: 'Portraits' },
            ],
          },
        },
        {
          type: 'photographerAbout',
          sortOrder: 3,
          data: {
            badge: 'Über mich',
            headline: 'Hi, ich bin Lisa!',
            intro: 'Fotografin aus Leidenschaft, basiert im Rhein-Main-Gebiet. Seit 2016 begleite ich Paare an ihrem großen Tag und halte die Momente fest, die man sonst vergessen würde.',
            story: 'Meine Kamera ist mein ständiger Begleiter. Was mich antreibt: echte Emotionen, natürliches Licht und die Geschichten, die hinter jedem Lächeln stecken.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
            values: [
              { title: 'Authentisch', text: 'Keine steifen Posen – ihr seid ihr selbst.' },
              { title: 'Emotional', text: 'Die großen Gefühle und kleinen Details.' },
              { title: 'Persönlich', text: 'Vom Kennenlernen bis zur Galerie an eurer Seite.' },
              { title: 'Professionell', text: 'Zuverlässig, erfahren, gut organisiert.' },
            ],
            ctaLabel: 'Mehr über mich',
            ctaHref: '/ueber-mich',
          },
        },
        {
          type: 'shootingProcess',
          sortOrder: 4,
          data: {
            badge: 'So läuft es ab',
            headline: 'Euer Weg zu perfekten Fotos',
            steps: [
              { icon: 'message', title: 'Anfrage & Kennenlernen', text: 'Ihr schreibt mir und wir verabreden ein unverbindliches Kennenlerngespräch – persönlich oder per Video.' },
              { icon: 'calendar', title: 'Planung & Buchung', text: 'Wir besprechen eure Wünsche, den Ablauf und ich reserviere euren Termin.' },
              { icon: 'camera', title: 'Der große Tag', text: 'Ich begleite euch diskret und halte die magischen Momente fest – von Getting Ready bis Partystimmung.' },
              { icon: 'image', title: 'Bildbearbeitung', text: 'Innerhalb von 8 Wochen bearbeite ich alle Fotos in meinem Stil.' },
              { icon: 'send', title: 'Eure Galerie', text: 'Ihr erhaltet eure Online-Galerie zum Teilen und einen USB-Stick in einer schönen Box.' },
            ],
          },
        },
        {
          type: 'testimonials',
          sortOrder: 5,
          data: {
            headline: 'Was meine Paare sagen',
            badgeText: 'Bewertungen',
            ratingValue: '5.0 von 5',
            ratingCount: '89 Bewertungen',
            items: [
              { quote: 'Lisa hat unseren Tag perfekt eingefangen. Die Fotos sind unglaublich natürlich und emotional – genau wie wir es uns gewünscht haben.', name: 'Julia & Marco', context: 'Hochzeit in Eltville', rating: 5 },
              { quote: 'Wir haben uns vom ersten Moment an wohlgefühlt. Lisa hat ein unglaubliches Gespür für besondere Augenblicke.', name: 'Sarah & Tim', context: 'Hochzeit in Mainz', rating: 5 },
              { quote: 'Die Bilder haben uns zu Tränen gerührt. Jedes einzelne erzählt eine Geschichte.', name: 'Anna & David', context: 'Hochzeit in Frankfurt', rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 6,
          data: {
            headline: 'Bereit für unvergessliche Fotos?',
            subline: 'Sichert euch jetzt euren Wunschtermin – beliebte Daten sind schnell vergeben.',
            badgeText: 'Jetzt anfragen',
            ctaPrimary: { label: 'Termin sichern', href: '/kontakt' },
          },
        },
        {
          type: 'statsCounter',
          sortOrder: 7,
          data: {
            headline: 'Meine Arbeit in Zahlen',
            stats: [
              { value: 200, suffix: '+', label: 'Hochzeiten begleitet', icon: 'heart' },
              { value: 9, label: 'Jahre Erfahrung', icon: 'calendar' },
              { value: 50000, suffix: '+', label: 'Bearbeitete Fotos', icon: 'image' },
              { value: 5.0, label: 'Sterne Bewertung', icon: 'star' },
            ],
          },
        },
        {
          type: 'logoMarquee',
          sortOrder: 8,
          data: {
            headline: 'Veröffentlicht in',
            logos: [
              { name: 'Hochzeitsguide', src: '/logos/hochzeitsguide.svg' },
              { name: 'Braut & Bräutigam', src: '/logos/braut-braeutigam.svg' },
              { name: 'Junebug Weddings', src: '/logos/junebug.svg' },
              { name: 'The Knot', src: '/logos/the-knot.svg' },
              { name: 'Hochzeitswahn', src: '/logos/hochzeitswahn.svg' },
            ],
          },
        },
      ],
    },
    {
      slug: 'portfolio',
      title: 'Portfolio',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Portfolio',
            subline: 'Eine Auswahl meiner schönsten Arbeiten aus Hochzeiten, Paarshootings und Portraits.',
            bgImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=85',
          },
        },
        {
          type: 'portfolioGallery',
          sortOrder: 1,
          data: {
            badge: 'Galerie',
            headline: 'Meine Arbeiten',
            categories: ['Hochzeiten', 'Paare', 'Babybauch', 'Portraits', 'JGA'],
            images: [
              { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'First Look am Schloss', category: 'Hochzeiten', location: 'Eltville' },
              { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', alt: 'Weinberg-Shooting', category: 'Hochzeiten', location: 'Ingelheim' },
              { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', alt: 'Eröffnungstanz', category: 'Hochzeiten', location: 'Frankfurt' },
              { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', alt: 'Braut am Fenster', category: 'Hochzeiten', location: 'Wiesbaden' },
              { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', alt: 'Brautpaar unter Blüten', category: 'Hochzeiten', location: 'Mainz' },
              { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', alt: 'Am See', category: 'Paare', location: 'Mainz' },
              { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80', alt: 'Golden Hour', category: 'Paare', location: 'Wiesbaden' },
              { src: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80', alt: 'Händehalten im Wald', category: 'Paare', location: 'Rheingau' },
              { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80', alt: 'Outdoor Portrait', category: 'Portraits' },
              { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', alt: 'Studio Portrait', category: 'Portraits' },
              { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80', alt: 'Natürliches Licht', category: 'Portraits' },
              { src: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&q=80', alt: 'Babybauch im Park', category: 'Babybauch' },
              { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', alt: 'Babybauch Silhouette', category: 'Babybauch' },
              { src: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80', alt: 'JGA im Weinberg', category: 'JGA', location: 'Rheingau' },
              { src: 'https://images.unsplash.com/photo-1529543544440-a5506a3e5b8e?w=600&q=80', alt: 'JGA Mädelsgruppe', category: 'JGA', location: 'Frankfurt' },
            ],
          },
        },
        {
          type: 'testimonials',
          sortOrder: 2,
          data: {
            headline: 'Was meine Paare sagen',
            badgeText: 'Feedback',
            items: [
              { quote: 'Die Fotos sind unglaublich! Lisa hat jeden Moment perfekt eingefangen.', name: 'Nina & Tobias', context: 'Hochzeit Schloss Johannisberg', rating: 5 },
              { quote: 'Unser Paarshooting war so entspannt — die Bilder spiegeln das total wider.', name: 'Leonie & Max', context: 'Paarshooting Frankfurt', rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 3,
          data: {
            headline: 'Euer Termin ist noch frei?',
            subline: 'Sichert euch jetzt euren Wunschtermin — beliebte Monate sind schnell ausgebucht.',
            ctaPrimary: { label: 'Jetzt anfragen', href: '/kontakt' },
          },
        },
        {
          type: 'testimonials',
          sortOrder: 4,
          data: {
            headline: 'Kundenstimmen zu meinen Fotos',
            badgeText: 'Kundenfeedback',
            items: [
              { quote: 'Die Bilder sind so viel schöner als wir es uns erträumt haben! Jedes Detail wurde eingefangen.', name: 'Katrin & Florian', context: 'Hochzeit Rheingau', rating: 5 },
              { quote: 'Lisa hat eine besondere Gabe, die richtigen Momente festzuhalten. Wir schauen uns die Fotos jeden Tag an.', name: 'Melanie & Jan', context: 'Paarshooting Mainz', rating: 5 },
            ],
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 5,
          data: {
            headline: 'Euer Shooting wartet!',
            subline: 'Bucht jetzt euer individuelles Fotoshooting und erhaltet einzigartige Erinnerungen.',
            ctaPrimary: { label: 'Shooting buchen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Leistungen & Pakete',
            subline: 'Flexible Pakete für Hochzeiten, Paarshootings und mehr.',
            bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=85',
          },
        },
        {
          type: 'servicesGrid',
          sortOrder: 1,
          data: {
            headline: 'Meine Leistungen',
            subline: 'Von der Hochzeitsreportage bis zum Einzelportrait – ich biete verschiedene Shooting-Formate, individuell auf euch zugeschnitten.',
            badgeText: 'Übersicht',
            manualCards: [
              { title: 'Hochzeitsreportage', text: 'Eure komplette Hochzeit in authentischen Bildern.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', mediaType: 'image', href: '/leistungen/hochzeitsreportage' },
              { title: 'Babybauch-Shooting', text: 'Die wunderschöne Vorfreude festgehalten.', image: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&q=80', mediaType: 'image', href: '/leistungen/babybauch' },
              { title: 'Paarshooting', text: 'Zeit zu zweit in wunderschönen Bildern.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', mediaType: 'image', href: '/leistungen/paarshooting' },
              { title: 'JGA Shooting', text: 'Feiert den JGA mit unvergesslichen Gruppenfotos.', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80', mediaType: 'image', href: '/leistungen/jga-shooting' },
              { title: 'Portrait-Shooting', text: 'Eure Persönlichkeit aufs Bild.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', mediaType: 'image', href: '/leistungen/portrait' },
              { title: 'After-Wedding', text: 'Entspannte Fotos nach der Hochzeit.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', mediaType: 'image', href: '/leistungen/after-wedding' },
            ],
          },
        },
        {
          type: 'servicePackages',
          sortOrder: 2,
          data: {
            badge: 'Pakete',
            headline: 'Hochzeitsfotografie',
            subline: 'Individuell abgestimmte Pakete für euren großen Tag.',
            packages: [
              {
                name: 'Standesamt',
                price: 'ab 490€',
                description: 'Perfekt für kleine, intime Trauungen.',
                features: ['3 Stunden Begleitung', 'Ca. 150-200 bearbeitete Fotos', 'Online-Galerie für 4 Wochen', 'USB-Stick in Holzbox', '10 hochwertige Prints'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
              {
                name: 'Hochzeitsreportage',
                price: 'ab 1.490€',
                highlighted: true,
                description: 'Die volle Begleitung eures Tages.',
                features: ['6-8 Stunden Begleitung', 'Ca. 400-600 bearbeitete Fotos', 'Getting Ready bis Hochzeitstorte', 'Brautpaar-Shooting', 'Online-Galerie & USB-Stick', '25 Prints', 'Persönliches Vorgespräch'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
              {
                name: 'Premium',
                price: 'ab 2.290€',
                description: 'Für alle, die das volle Programm wollen.',
                features: ['Bis zu 10 Stunden Begleitung', 'Ca. 600-900 bearbeitete Fotos', 'Getting Ready bis Party', 'Engagement-Shooting vorab', 'Hochwertiges Fotobuch', '50 Prints', 'Second Shooter möglich'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
            ],
            note: 'Alle Preise verstehen sich als Startpreise. Gerne erstelle ich euch ein individuelles Angebot.',
          },
        },
        {
          type: 'servicePackages',
          sortOrder: 3,
          data: {
            badge: 'Weitere Shootings',
            headline: 'Paar, Portrait & mehr',
            packages: [
              {
                name: 'Paarshooting',
                price: 'ab 290€',
                features: ['1-2 Stunden', '50-80 bearbeitete Fotos', 'Location-Beratung', 'Online-Galerie'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
              {
                name: 'Babybauch',
                price: 'ab 250€',
                features: ['1 Stunde', '30-50 bearbeitete Fotos', 'Indoor oder Outdoor', 'Kleider-Auswahl'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
              {
                name: 'JGA Shooting',
                price: 'ab 350€',
                features: ['1-2 Stunden', '80-120 bearbeitete Fotos', 'Gruppen & Einzelportraits', 'Spaß garantiert'],
                ctaLabel: 'Anfragen',
                ctaHref: '/kontakt',
              },
            ],
          },
        },
        {
          type: 'faq',
          sortOrder: 4,
          data: {
            headline: 'Häufige Fragen zu Shootings & Preisen',
            badgeText: 'FAQ',
            items: [
              { question: 'Kann ich das Paket individuell anpassen?', answer: 'Selbstverständlich! Alle Pakete sind flexibel anpassbar. Schreibt mir einfach eure Wünsche.' },
              { question: 'Wann ist die Bezahlung fällig?', answer: 'Bei Buchung wird eine Anzahlung von 30% fällig, der Rest 2 Wochen vor dem Termin.' },
              { question: 'Sind Anfahrtskosten enthalten?', answer: 'Im Rhein-Main-Gebiet (30km) ist die Anfahrt inklusive. Darüber hinaus berechne ich 0,35€/km.' },
            ],
          },
        },
        {
          type: 'richText',
          sortOrder: 5,
          data: {
            headline: 'Vorbereitung auf euer Shooting',
            badgeText: 'Tipps',
            content: 'Damit euer Shooting perfekt wird: Tragt Kleidung, in der ihr euch wohlfühlt. Vermeidet große Logos und sehr grelle Muster. Bringt gerne ein zweites Outfit mit. Bei Outdoor-Shootings empfehle ich bequeme Schuhe für den Weg zur Location. Und das Wichtigste: Seid einfach ihr selbst – den Rest mache ich!',
          },
        },
      ],
    },
    {
      slug: 'ueber-mich',
      title: 'Über mich',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Über mich',
            subline: 'Die Person hinter der Kamera.',
            bgImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1800&q=85',
          },
        },
        {
          type: 'photographerAbout',
          sortOrder: 1,
          data: {
            badge: 'Über mich',
            headline: 'Hi, ich bin Lisa!',
            intro: 'Fotografin aus Leidenschaft, basiert im wunderschönen Rheinhessen. Seit 2016 widme ich mich der Hochzeits- und Portraitfotografie und habe seitdem über 200 Paare an ihrem großen Tag begleitet.',
            story: 'Die Fotografie begleitet mich schon mein ganzes Leben. Inspiriert von meinem Opa, der mir mit 14 meine erste Kamera schenkte, habe ich früh gelernt, die Schönheit im Alltäglichen zu sehen. Heute ist es mein größtes Glück, echte Emotionen in Bildern festzuhalten – vom nervösen Lächeln beim First Look bis zu den Freudentränen der Eltern.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
            facts: [
              'Seit 2016 selbstständig als Fotografin',
              'Über 200 Hochzeiten fotografiert',
              'Basiert in Rheinhessen, verfügbar in ganz Deutschland',
              'Shooting-Equipment: Sony Alpha 7 IV',
              'Liebt: Reisen, guten Kaffee & die goldene Stunde',
              'LGBTQ+ friendly – Liebe ist Liebe',
            ],
            values: [
              { title: 'Natürlichkeit', text: 'Keine steifen Posen. Ihr seid ihr selbst und ich halte die echten Momente fest.' },
              { title: 'Emotionen', text: 'Die großen Highlights und die kleinen Gesten – alles gehört zu eurer Geschichte.' },
              { title: 'Vertrauen', text: 'Vom Erstgespräch bis zur Bildübergabe bin ich transparent und zuverlässig.' },
              { title: 'Qualität', text: 'Jedes Bild wird sorgfältig bearbeitet. Keine Massenabfertigung.' },
            ],
            ctaLabel: 'Schreibt mir',
            ctaHref: '/kontakt',
          },
        },
        {
          type: 'statsCounter',
          sortOrder: 2,
          data: {
            headline: 'Meine Karriere in Zahlen',
            badgeText: 'Statistiken',
            items: [
              { value: '8+', label: 'Jahre Erfahrung' },
              { value: '200+', label: 'Hochzeiten fotografiert' },
              { value: '50.000+', label: 'Bearbeitete Fotos' },
              { value: '100%', label: 'Weiterempfehlungsrate' },
            ],
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 3,
          data: {
            headline: 'Lass uns zusammenarbeiten!',
            subline: 'Ich freue mich darauf, eure Geschichte in Bildern zu erzählen.',
            ctaPrimary: { label: 'Jetzt Kontakt aufnehmen', href: '/kontakt' },
          },
        },
        {
          type: 'testimonials',
          sortOrder: 4,
          data: {
            headline: 'Was meine Kunden sagen',
            items: [
              { quote: 'Lisa hat unsere Hochzeit so wunderschön festgehalten — wir schauen uns die Fotos täglich an!', name: 'Anna & Max', context: 'Hochzeit 2024', rating: 5 },
              { quote: 'Professionell, empathisch und unglaublich talentiert. Absolute Empfehlung!', name: 'Sarah K.', context: 'Portraitshooting', rating: 5 },
            ],
          },
        },
      ],
    },
    {
      slug: 'faq',
      title: 'FAQ',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Häufige Fragen',
            subline: 'Alles was ihr vor der Buchung wissen solltet.',
            bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=85',
          },
        },
        {
          type: 'faq',
          sortOrder: 1,
          data: {
            headline: 'FAQ',
            badgeText: 'Häufige Fragen',
            items: [
              { question: 'Wie früh sollten wir buchen?', answer: 'Bei Hochzeiten empfehle ich 6-12 Monate Vorlauf, beliebte Termine (Mai-September) sind oft 1-2 Jahre vorher vergeben.' },
              { question: 'Wie viele Fotos erhalten wir?', answer: 'Das hängt von der Stundenanzahl ab. Bei einer 8h-Reportage sind es ca. 400-600 fertig bearbeitete Bilder.' },
              { question: 'Wie lange dauert die Bearbeitung?', answer: 'Ihr erhaltet eure fertigen Fotos innerhalb von 8 Wochen nach der Hochzeit.' },
              { question: 'Bietest du auch Verlobungsshootings an?', answer: 'Ja! Ein Engagement-Shooting ist eine wunderbare Möglichkeit, sich vor der Kamera wohl zu fühlen und Bilder für die Einladungskarten zu bekommen.' },
              { question: 'Was ist bei schlechtem Wetter?', answer: 'Regen und Wolken können unglaublich stimmungsvolle Fotos erzeugen! Wir machen das Beste aus jeder Situation.' },
              { question: 'Fotografierst du auch außerhalb der Region?', answer: 'Grundsätzlich bundesweit. Längere Anfahrten und ggf. Unterkunft werden zusätzlich berechnet.' },
              { question: 'Bietest du auch Videos an?', answer: 'Ich konzentriere mich auf Fotografie. Für Hochzeitsvideos arbeite ich mit einer Kollegin zusammen, die ich gerne empfehle.' },
              { question: 'In welchem Format erhalte ich die Bilder?', answer: 'Als hochaufgelöste JPEGs ohne Wasserzeichen – perfekt zum Drucken und für Social Media.' },
            ],
          },
        },
        {
          type: 'richText',
          sortOrder: 2,
          data: {
            headline: 'Bearbeitung & Lieferung',
            badgeText: 'Gut zu wissen',
            content: 'Nach eurem Shooting wähle ich die besten Aufnahmen aus und bearbeite sie sorgfältig in meinem Stil – natürliche Farben, sanfte Hauttöne und stimmungsvolles Licht. Ihr erhaltet eure Galerie als Online-Link zum Teilen mit Familie und Freunden sowie einen hochwertigen USB-Stick in einer handgefertigten Holzbox.',
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 3,
          data: {
            headline: 'Noch Fragen offen?',
            subline: 'Schreibt mir gerne eine Nachricht – ich beantworte alle eure Fragen persönlich.',
            ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          type: 'hero',
          sortOrder: 0,
          data: {
            headline: 'Kontakt',
            subline: 'Erzählt mir von euren Plänen!',
            bgImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1800&q=85',
          },
        },
        {
          type: 'contact',
          sortOrder: 1,
          data: {
            headline: 'Schreibt mir',
            subline: 'Ich freue mich auf eure Nachricht und melde mich innerhalb von 24 Stunden.',
            badgeText: 'Kontakt',
            infoCards: [
              { icon: 'phone', label: 'Telefon', value: '+49 611 234 5678' },
              { icon: 'mail', label: 'E-Mail', value: 'hello@lisa-berg.de' },
              { icon: 'mapPin', label: 'Studio', value: 'Marktplatz 7, 65183 Wiesbaden' },
            ],
            formEnabled: true,
            submitLabel: 'Nachricht senden',
          },
        },
        {
          type: 'testimonials',
          sortOrder: 2,
          data: {
            headline: 'Warum Paare mich lieben',
            badgeText: 'Kundenstimmen',
            items: [
              { quote: 'Von der ersten Nachricht bis zur fertigen Galerie war alles perfekt organisiert. Lisa ist nicht nur talentiert, sondern auch unglaublich herzlich.', name: 'Sophie & Erik', context: 'Hochzeit Wiesbaden', rating: 5 },
              { quote: 'Wir haben uns sofort wohlgefühlt und das sieht man den Bildern an. Absolute Empfehlung!', name: 'Carla & Ben', context: 'Paarshooting Rheingau', rating: 5 },
            ],
          },
        },
        {
          type: 'richText',
          sortOrder: 3,
          data: {
            headline: 'Studio & Anfahrt',
            badgeText: 'Location',
            content: 'Mein Studio befindet sich in Mainz-Bretzenheim, nur 5 Minuten von der A60 entfernt. Kostenlose Parkplätze sind direkt vor der Tür verfügbar. Für Kennenlerngespräche könnt ihr gerne vorbeikommen – oder wir treffen uns gemütlich im Café eurer Wahl.',
          },
        },
        {
          type: 'ctaBand',
          sortOrder: 4,
          data: {
            headline: 'Bereit für unvergessliche Bilder?',
            subline: 'Schreibt mir und erzählt von euren Plänen — ich freu mich auf euch!',
            ctaPrimary: { label: 'Unverbindlich anfragen', href: '#kontakt-form' },
          },
        },
      ],
    },
  ],
};
