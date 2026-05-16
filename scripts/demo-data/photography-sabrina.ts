/**
 * Standalone tenant seed: Sabrina Feist Photography
 * Real client content from sabrinafeistphotography.de
 * Industry: photography | Deployment: standalone
 */
export const SABRINA_CONFIG = {
  slug: 'sabrina-feist',
  name: 'Sabrina Feist Photography',
  industry: 'photography' as const,
  activeStyle: 'classic',
  deploymentMode: 'standalone' as const,
  isDemo: false,

  brand: {
    companyName: 'Sabrina Feist Photography',
    tagline: 'Hochzeitsfotografie & Portraits in Mainz und Umgebung',
    primaryColor: '#9c7c5c',
    secondaryColor: '#6b4f3b',
    accentColor: '#d4b896',
    logo: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/Logo-Sabrina-Feist-Photography-2-1920w.png',
  },

  contact: {
    phone: '+49 160 2583248',
    email: 'mail@sabrinafeistphotography.de',
    address: 'Mainz, Deutschland',
  },

  socialLinks: {
    instagram: 'https://instagram.com/sabrinafeistphotography',
  },

  openingHours: [
    { day: 'Mo–Fr', hours: 'Nach Vereinbarung' },
    { day: 'Sa–So', hours: 'Shootings & Hochzeiten' },
  ],

  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Portfolio', href: '/portfolio', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Über mich', href: '/ueber-mich', type: 'link' },
    { label: 'FAQ', href: '/faq', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Anfragen', href: '/kontakt' },

  footerColumns: [
    { title: 'Fotografie', items: [{ text: 'Hochzeitsreportage', href: '/leistungen' }, { text: 'Babybauch', href: '/leistungen' }, { text: 'Portrait', href: '/leistungen' }, { text: 'JGA', href: '/leistungen' }] },
    { title: 'Mehr', items: [{ text: 'Portfolio', href: '/portfolio' }, { text: 'FAQ', href: '/faq' }, { text: 'Über mich', href: '/ueber-mich' }] },
    { title: 'Kontakt', items: [{ text: '+49 160 2583248' }, { text: 'mail@sabrinafeistphotography.de' }, { text: 'Mainz, Deutschland' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt anfragen', href: '/kontakt' },

  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Sabrina Feist Photography',
          subline: 'Authentische Hochzeitsreportagen, Babybauch- und Portraitfotografie in Mainz und Umgebung. Emotionale Bilder, die eure Geschichte erzählen.',
          badgeText: 'Fotografin seit 2016',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/IMG_3959-1920w.jpg',
          trustItems: ['Über 150 Hochzeiten', 'Mainz & Rhein-Main', 'Authentisch & emotional'],
          primaryCta: { label: 'Jetzt anfragen', href: '/kontakt' },
          secondaryCta: { label: 'Portfolio entdecken', href: '/portfolio' },
        }},
        { type: 'uspStrip', sortOrder: 1, data: {
          items: [
            { icon: 'camera', title: 'Authentisch', text: 'Natürliche, ungestellte Momentaufnahmen voller Emotion.' },
            { icon: 'heart', title: 'Mit Herz', text: 'Jede Hochzeit ist einzigartig – eure Fotos auch.' },
            { icon: 'clock', title: 'Zuverlässig', text: 'Von der Anfrage bis zur Galerie an eurer Seite.' },
            { icon: 'image', title: 'Hochwertig', text: 'Professionelle Bearbeitung in meinem Signatur-Stil.' },
          ],
        }},
        { type: 'portfolioGallery', sortOrder: 2, data: {
          badge: 'Portfolio',
          headline: 'Einblicke in meine Arbeit',
          subline: 'Echte Momente, echte Emotionen – eine Auswahl meiner liebsten Aufnahmen.',
          categories: ['Hochzeiten', 'Paare', 'Babybauch'],
          images: [
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01854-1920w.jpg', alt: 'Brautpaar im Weinberg', category: 'Hochzeiten' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC03736-1920w.jpg', alt: 'First Look', category: 'Hochzeiten' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/IMG_3959-1920w.jpg', alt: 'Hochzeitstanz', category: 'Hochzeiten' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC09597-1920w.jpg', alt: 'Paar am Rhein', category: 'Paare' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01670-1920w.jpg', alt: 'Babybauch Outdoor', category: 'Babybauch' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC02467-1920w.jpg', alt: 'Brautstrauss Detail', category: 'Hochzeiten' },
          ],
        }},
        { type: 'photographerAbout', sortOrder: 3, data: {
          badge: 'Über mich',
          headline: 'Hi, ich bin Sabrina!',
          intro: 'Fotografin aus Leidenschaft, geboren in Mainz, halb Französin. Seit 2016 halte ich die schönsten Momente im Leben fest – mit Herz, Gefühl und einem Auge für das Besondere.',
          story: 'Die Liebe zur Fotografie habe ich von meinem Großvater geerbt, der mir als Kind seine alte Kamera in die Hand drückte. Heute ist es meine größte Freude, Paare an ihrem besonderen Tag zu begleiten und die Emotionen einzufangen, die man sonst vergessen würde.',
          image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
          values: [
            { title: 'Authentisch', text: 'Keine gestellten Posen – echte Momente, echte Gefühle.' },
            { title: 'Emotional', text: 'Die großen Highlights und die leisen Zwischentöne.' },
            { title: 'Persönlich', text: 'Vom Kennenlernen bis zur fertigen Galerie immer nahbar.' },
            { title: 'Kreativ', text: 'Ein Blick für besonderes Licht und einzigartige Perspektiven.' },
          ],
          ctaLabel: 'Mehr über mich',
          ctaHref: '/ueber-mich',
        }},
        { type: 'shootingProcess', sortOrder: 4, data: {
          badge: 'So läuft es ab',
          headline: 'Von der Anfrage bis zu euren Fotos',
          steps: [
            { icon: 'message', title: 'Anfrage', text: 'Schreibt mir über das Kontaktformular oder per Mail. Ich melde mich innerhalb von 24 Stunden.' },
            { icon: 'calendar', title: 'Kennenlernen', text: 'Wir treffen uns persönlich oder per Video-Call und besprechen eure Wünsche und Vorstellungen.' },
            { icon: 'heart', title: 'Buchung', text: 'Wenn die Chemie stimmt, reserviere ich euren Termin und wir planen gemeinsam den Ablauf.' },
            { icon: 'camera', title: 'Euer Shooting', text: 'Am großen Tag bin ich diskret an eurer Seite und halte alle magischen Momente fest.' },
            { icon: 'image', title: 'Bearbeitung', text: 'Innerhalb von 6-8 Wochen bearbeite ich eure Bilder liebevoll in meinem Signatur-Stil.' },
            { icon: 'send', title: 'Galerie', text: 'Ihr erhaltet eine passwortgeschützte Online-Galerie zum Teilen, Herunterladen und Bestellen.' },
          ],
        }},
        { type: 'testimonials', sortOrder: 5, data: {
          headline: 'Was meine Paare sagen',
          badgeText: 'Bewertungen',
          ratingValue: '5.0',
          ratingCount: '67 Bewertungen',
          items: [
            { quote: 'Sabrina hat unsere Hochzeit so wunderschön eingefangen. Jedes Bild erzählt eine Geschichte und wir sind überglücklich mit dem Ergebnis!', name: 'Laura & Philipp', context: 'Hochzeit Schloss Johannisberg', rating: 5 },
            { quote: 'Von Anfang an haben wir uns bei Sabrina wohlgefühlt. Sie ist unglaublich einfühlsam und hat ein Auge für die kleinen, besonderen Momente.', name: 'Marie & Jonas', context: 'Hochzeit Weingut Mainz', rating: 5 },
            { quote: 'Die Babybauch-Fotos sind so viel schöner geworden als wir uns je hätten vorstellen können. Sabrina hat eine wunderbare, ruhige Art.', name: 'Katharina', context: 'Babybauch-Shooting', rating: 5 },
          ],
        }},
        { type: 'ctaBand', sortOrder: 6, data: {
          headline: 'Bereit für unvergessliche Fotos?',
          subline: 'Sichert euch jetzt euren Wunschtermin – beliebte Hochzeitsdaten sind schnell vergeben!',
          badgeText: 'Jetzt anfragen',
          ctaPrimary: { label: 'Termin anfragen', href: '/kontakt' },
        }},
      ],
    },

    /* ─── Portfolio ─── */
    {
      slug: 'portfolio', title: 'Portfolio', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Portfolio',
          subline: 'Eine Auswahl meiner schönsten Hochzeits-, Paar- und Portraitaufnahmen.',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01854-1920w.jpg',
        }},
        { type: 'portfolioGallery', sortOrder: 1, data: {
          badge: 'Meine Arbeiten',
          headline: 'Galerie',
          categories: ['Hochzeiten', 'Paare', 'Babybauch', 'JGA', 'Portraits'],
          images: [
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01854-1920w.jpg', alt: 'Brautpaar in den Weinbergen', category: 'Hochzeiten', location: 'Rheinhessen' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC03736-1920w.jpg', alt: 'First Look am Schloss', category: 'Hochzeiten', location: 'Eltville' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/IMG_3959-1920w.jpg', alt: 'Hochzeitstanz', category: 'Hochzeiten', location: 'Mainz' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC02467-1920w.jpg', alt: 'Ring-Detail', category: 'Hochzeiten', location: 'Wiesbaden' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC09597-1920w.jpg', alt: 'Paarshooting am Rhein', category: 'Paare', location: 'Mainz' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01670-1920w.jpg', alt: 'Babybauch im Abendlicht', category: 'Babybauch', location: 'Mainz' },
            { src: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg', alt: 'Portrait', category: 'Portraits' },
          ],
        }},
      ],
    },

    /* ─── Leistungen ─── */
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Leistungen & Preise',
          subline: 'Individuelle Pakete für Hochzeiten, Paar- und Portraitshootings.',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC03736-1920w.jpg',
        }},
        { type: 'servicePackages', sortOrder: 1, data: {
          badge: 'Hochzeitsfotografie',
          headline: 'Hochzeitsreportage',
          subline: 'Euer großer Tag verdient besondere Bilder.',
          packages: [
            {
              name: 'Standesamt',
              price: 'ab 550€',
              description: 'Für kleine, intime Trauungen.',
              features: ['3 Stunden Begleitung', 'Ca. 150-200 bearbeitete Fotos', 'Online-Galerie', 'USB-Stick', 'Getting Ready oder Sektempfang'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
            {
              name: 'Hochzeitsreportage',
              price: 'ab 1.690€',
              highlighted: true,
              description: 'Die volle Begleitung von Getting Ready bis Hochzeitstorte.',
              features: ['6-8 Stunden Begleitung', 'Ca. 400-600 bearbeitete Fotos', 'Getting Ready bis Hochzeitstorte', 'Brautpaar-Shooting', 'Online-Galerie & USB-Stick', 'Persönliches Vorgespräch', '30 Fine-Art Prints'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
            {
              name: 'Ganzer Tag',
              price: 'ab 2.490€',
              description: 'Von morgens bis zum letzten Tanz.',
              features: ['Bis zu 12 Stunden Begleitung', 'Ca. 700-1000 bearbeitete Fotos', 'Kompletter Tag', 'Engagement-Shooting vorab', 'Premium Fotobuch (30x30)', '50 Fine-Art Prints', 'Second Shooter inklusive'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
          ],
          note: 'Alle Preise sind Startpreise. Individuelle Pakete auf Anfrage.',
        }},
        { type: 'servicePackages', sortOrder: 2, data: {
          badge: 'Weitere Shootings',
          headline: 'Portraits, Paare & mehr',
          packages: [
            {
              name: 'Paarshooting',
              price: 'ab 320€',
              features: ['1-2 Stunden', '50-80 bearbeitete Fotos', 'Location-Beratung', 'Online-Galerie', '10 Prints'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
            {
              name: 'Babybauch',
              price: 'ab 280€',
              features: ['1 Stunde', '30-50 bearbeitete Fotos', 'Indoor oder Outdoor', 'Styling-Tipps', 'Online-Galerie'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
            {
              name: 'JGA Shooting',
              price: 'ab 390€',
              features: ['1-2 Stunden', '80-120 bearbeitete Fotos', 'Gruppen- & Einzelportraits', 'Sofortbilder vor Ort', 'Online-Galerie'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
            {
              name: 'Portrait',
              price: 'ab 220€',
              features: ['45-60 Minuten', '20-30 bearbeitete Fotos', 'Business oder Privat', 'Online-Galerie'],
              ctaLabel: 'Anfragen', ctaHref: '/kontakt',
            },
          ],
        }},
        { type: 'textImage', sortOrder: 3, data: {
          badge: 'Mein Versprechen',
          headline: 'Was euch bei mir erwartet',
          text: 'Bei mir bekommt ihr keine 08/15-Fotos von der Stange. Jede Reportage ist individuell, jedes Bild mit Liebe bearbeitet. Ich nehme mir Zeit für euch – vor, während und nach dem Shooting. Mein Ziel: Bilder, die euch beim Anschauen genauso berühren wie der Moment selbst.',
          image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
          imageAlt: 'Sabrina Feist bei der Arbeit',
          imagePosition: 'right',
        }},
      ],
    },

    /* ─── Über mich ─── */
    {
      slug: 'ueber-mich', title: 'Über mich', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Über mich',
          subline: 'Die Person hinter der Kamera.',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
        }},
        { type: 'photographerAbout', sortOrder: 1, data: {
          badge: 'Über mich',
          headline: 'Hi, ich bin Sabrina!',
          intro: 'Geboren in Mainz, halb Französin, ganz verliebt in die Fotografie. Seit 2016 bin ich als Hochzeits- und Portraitfotografin selbstständig und habe seitdem über 150 Paare an ihrem großen Tag begleitet.',
          story: 'Die Fotografie begleitet mich seit meiner Kindheit. Mein Großvater war es, der mir mit seiner analogen Kamera die Magie des Bildermachens näherbrachte. Heute verbinde ich diese Leidenschaft mit meinem deutsch-französischen Temperament: Ich liebe es, das Leben zu feiern, die leisen Momente genauso wie die ausgelassenen. Mein Stil ist natürlich, emotional und ehrlich – genau wie ich selbst. Wenn ich nicht fotografiere, findet ihr mich beim Kochen französischer Rezepte, auf Reisen oder mit einer guten Tasse Kaffee in der Hand.',
          image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
          facts: [
            'Seit 2016 selbstständige Fotografin',
            'Über 150 Hochzeiten begleitet',
            'In Mainz geboren, halb Französin',
            'Inspiriert von Großvater – analog gelernt',
            'Basiert in Mainz, verfügbar im ganzen Rhein-Main-Gebiet',
            'Equipment: Sony Alpha 7 IV & 7 III',
            'Liebt: Reisen, französische Küche, guten Kaffee',
          ],
          values: [
            { title: 'Authentizität', text: 'Keine steifen Posen, keine falsche Perfektion. Eure Bilder zeigen, wer ihr wirklich seid.' },
            { title: 'Emotion', text: 'Die Freudenträne, das Lachen, der verstohlene Blick – ich fange ein, was das Herz berührt.' },
            { title: 'Vertrauen', text: 'Vom ersten Gespräch bis zur letzten Bildübergabe bin ich ehrlich, transparent und zuverlässig.' },
            { title: 'Qualität', text: 'Jedes Foto wird sorgfältig bearbeitet. Ich liefere keine Masse, sondern Klasse.' },
          ],
          ctaLabel: 'Schreibt mir',
          ctaHref: '/kontakt',
        }},
        { type: 'richText', sortOrder: 2, data: {
          headline: 'Meine Philosophie',
          content: '<p>Fotografie bedeutet für mich mehr als nur schöne Bilder zu machen. Es geht darum, echte Geschichten festzuhalten – Geschichten von Liebe, Familie und den kleinen Momenten, die das Leben besonders machen.</p><p>Mein Ansatz ist dokumentarisch mit einem feinen Gespür für Ästhetik. Ich dirigiere nicht, ich begleite. Ich inszeniere nicht, ich beobachte. Und genau das macht meine Bilder so besonders: Sie sind echt.</p><p>Wenn ihr euch in meinen Bildern wiederfindet und eine Fotografin sucht, die mit euch lacht, euch beruhigt wenn ihr nervös seid und die besonderen Momente eures Tages festhält – dann lasst uns kennenlernen.</p>',
        }},
      ],
    },

    /* ─── FAQ ─── */
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufige Fragen',
          subline: 'Alles, was ihr vor der Buchung wissen solltet.',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01854-1920w.jpg',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          badgeText: 'Häufige Fragen',
          items: [
            { question: 'Wie früh sollten wir für unsere Hochzeit buchen?', answer: 'Ich empfehle 8-12 Monate vor eurem Wunschtermin anzufragen. Beliebte Samstage im Sommer sind oft 1-2 Jahre im Voraus vergeben.' },
            { question: 'Wie viele Bilder erhalten wir?', answer: 'Bei einer 8-stündigen Hochzeitsreportage könnt ihr mit 400-600 fertig bearbeiteten Bildern rechnen. Die genaue Anzahl hängt vom Ablauf und den Momenten des Tages ab.' },
            { question: 'Wie lange dauert die Bearbeitung?', answer: 'Eure fertige Galerie erhaltet ihr innerhalb von 6-8 Wochen nach der Hochzeit. Einzelne Sneak-Peeks gibt es oft schon nach 2-3 Tagen.' },
            { question: 'Bietest du auch Verlobungsshootings an?', answer: 'Ja! Ein Engagement-Shooting ist eine wunderbare Möglichkeit, sich vor der Kamera einzugrooven. So seid ihr am Hochzeitstag schon ganz entspannt vor meiner Linse.' },
            { question: 'Was passiert bei schlechtem Wetter?', answer: 'Regen kann wunderschöne, stimmungsvolle Bilder erzeugen! Ich habe immer durchsichtige Schirme und Indoor-Backup-Locations in petto. Die besten Fotos entstehen oft unter unerwarteten Bedingungen.' },
            { question: 'Fotografierst du auch außerhalb von Mainz?', answer: 'Auf jeden Fall! Ich bin im ganzen Rhein-Main-Gebiet unterwegs und liebe auch Destination-Hochzeiten. Für längere Anfahrten oder Übernachtungen besprechen wir die Konditionen individuell.' },
            { question: 'In welchem Format erhalte ich die Bilder?', answer: 'Als hochaufgelöste JPEGs ohne Wasserzeichen – perfekt zum Drucken in jedem Format und zum Teilen auf Social Media.' },
            { question: 'Bietest du auch Hochzeitsvideos an?', answer: 'Ich konzentriere mich voll auf die Fotografie. Für Videos arbeite ich aber mit großartigen Videografen zusammen, die ich euch gerne empfehle.' },
            { question: 'Können wir die Bilder auf Social Media teilen?', answer: 'Na klar! Ich freue mich sogar darüber. Taggt mich gerne @sabrinafeistphotography.' },
            { question: 'Wie läuft die Bezahlung ab?', answer: 'Nach der Buchung wird eine Anzahlung von 30% fällig, die euren Termin sichert. Der Restbetrag ist 2 Wochen vor dem Shooting-Termin fällig.' },
            { question: 'Was sollen wir zum Shooting anziehen?', answer: 'Tragt, worin ihr euch wohl fühlt! Generell empfehle ich aufeinander abgestimmte (nicht gleiche!) Farben, keine großen Logos und Stoffe, die schön fallen. Gerne berate ich euch auch persönlich.' },
            { question: 'Gibst du die RAW-Dateien heraus?', answer: 'Die RAW-Dateien sind wie mein digitales Negativ und Teil meines künstlerischen Prozesses. Ihr erhaltet ausschließlich die fertig bearbeiteten Bilder in Druckqualität.' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 2, data: {
          headline: 'Noch Fragen? Einfach schreiben!',
          subline: 'Ich freue mich auf eure Nachricht und beantworte alle weiteren Fragen persönlich.',
          ctaPrimary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
        }},
      ],
    },

    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt',
          subline: 'Erzählt mir von euren Plänen – ich freue mich auf eure Nachricht!',
          bgImage: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC09597-1920w.jpg',
        }},
        { type: 'contact', sortOrder: 1, data: {
          headline: 'Schreibt mir',
          subline: 'Füllt das Formular aus und ich melde mich innerhalb von 24 Stunden bei euch. Alternativ erreicht ihr mich auch per Mail oder Telefon.',
          badgeText: 'Kontakt',
          showMap: true,
        }},
        { type: 'textImage', sortOrder: 2, data: {
          headline: 'So erreicht ihr mich',
          text: '<ul><li><strong>E-Mail:</strong> mail@sabrinafeistphotography.de</li><li><strong>Telefon:</strong> +49 160 2583248</li><li><strong>Instagram:</strong> @sabrinafeistphotography</li><li><strong>Standort:</strong> Mainz, Rhein-Main-Gebiet</li></ul><p>Ich antworte in der Regel innerhalb von 24 Stunden. Am Wochenende kann es etwas länger dauern – dann bin ich auf Hochzeiten unterwegs!</p>',
          image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
          imageAlt: 'Sabrina Feist Photography',
          imagePosition: 'right',
        }},
      ],
    },
  ],

  /* ─── Collections ─── */
  collections: [
    {
      key: 'leistungen',
      label: 'Leistungen',
      items: [
        {
          slug: 'hochzeitsreportage',
          title: 'Hochzeitsreportage',
          priority: 1,
          data: {
            title: 'Hochzeitsreportage',
            description: 'Eure komplette Hochzeit in authentischen Bildern – von den Vorbereitungen bis zum letzten Tanz. Natürlich, emotional und voller Liebe zum Detail.',
            image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01854-1920w.jpg',
            features: ['6-12 Stunden Begleitung', 'Getting Ready bis Party', 'Brautpaar-Shooting', '400-1000 bearbeitete Fotos', 'Online-Galerie & USB-Stick'],
            price: 'ab 1.690€',
          },
        },
        {
          slug: 'babybauch',
          title: 'Babybauch-Shooting',
          priority: 2,
          data: {
            title: 'Babybauch-Shooting',
            description: 'Haltet die wunderschöne Vorfreude auf euer Baby in stimmungsvollen Bildern fest. Indoor oder Outdoor, ganz nach euren Wünschen.',
            image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC01670-1920w.jpg',
            features: ['1 Stunde', '30-50 bearbeitete Fotos', 'Indoor oder Outdoor', 'Styling-Tipps vorab', 'Online-Galerie'],
            price: 'ab 280€',
          },
        },
        {
          slug: 'jga-shooting',
          title: 'JGA Shooting',
          priority: 3,
          data: {
            title: 'JGA Shooting',
            description: 'Der Junggesellinnenabschied verdient genauso tolle Fotos! Spaß, Freundschaft und unvergessliche Erinnerungen.',
            image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC03736-1920w.jpg',
            features: ['1-2 Stunden', '80-120 bearbeitete Fotos', 'Gruppen- & Einzelportraits', 'Sofortbilder vor Ort', 'Online-Galerie'],
            price: 'ab 390€',
          },
        },
        {
          slug: 'portrait',
          title: 'Portrait-Shooting',
          priority: 4,
          data: {
            title: 'Portrait-Shooting',
            description: 'Ob Business-Portraits oder persönliche Fotos – ich bringe eure Persönlichkeit aufs Bild. Natürlich, modern und authentisch.',
            image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC00552-Edit-1920w.jpg',
            features: ['45-60 Minuten', '20-30 bearbeitete Fotos', 'Location-Beratung', 'Business oder Privat', 'Online-Galerie'],
            price: 'ab 220€',
          },
        },
        {
          slug: 'paarshooting',
          title: 'Paarshooting',
          priority: 5,
          data: {
            title: 'Paarshooting',
            description: 'Zeit zu zweit, festgehalten in wunderschönen Bildern. Perfekt als Engagement-Shooting, Geschenk oder einfach so.',
            image: 'https://lirp.cdn-website.com/85d0b5f0/dms3rep/multi/opt/DSC09597-1920w.jpg',
            features: ['1-2 Stunden', '50-80 bearbeitete Fotos', 'Location-Beratung', 'Online-Galerie', '10 Fine-Art Prints'],
            price: 'ab 320€',
          },
        },
      ],
    },
  ],
};
