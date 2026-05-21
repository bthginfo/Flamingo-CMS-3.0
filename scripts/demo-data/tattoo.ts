/**
 * Rich demo seed: Tattoo (INK DISTRICT)
 */
export const TATTOO_CONFIG = {
  slug: 'demo-tattoo',
  name: 'INK DISTRICT',
  industry: 'tattoo' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'INK DISTRICT',
    tagline: 'Custom Tattoos & Flash Art in Berlin-Kreuzberg',
    primaryColor: '#1a1a1a',
    secondaryColor: '#dc2626',
    accentColor: '#f5f5f4',
  },
  contact: { phone: '+49 30 123 456 78', email: 'info@ink-district.de', address: 'Oranienstraße 42, 10999 Berlin' },
  socialLinks: { instagram: 'https://instagram.com/inkdistrict', facebook: 'https://facebook.com/inkdistrict' },
  openingHours: [
    { day: 'Di–Fr', hours: '11:00–19:00' },
    { day: 'Sa', hours: '12:00–18:00' },
    { day: 'So–Mo', hours: 'Geschlossen' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Künstler', href: '/kuenstler', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Pflege', href: '/pflege', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Termin anfragen', href: '/kontakt' },
  footerColumns: [
    { title: 'Studio', items: [{ text: 'Künstler', href: '/kuenstler' }, { text: 'Galerie', href: '/galerie' }, { text: 'Leistungen', href: '/leistungen' }] },
    { title: 'Info', items: [{ text: 'Pflege-Guide', href: '/pflege' }, { text: 'FAQ', href: '/' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: '+49 30 123 456 78' }, { text: 'info@ink-district.de' }, { text: 'Oranienstraße 42, Berlin' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Termin anfragen', href: '/kontakt' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'INK DISTRICT',
          subline: 'Custom Tattoos & Flash Art in Berlin-Kreuzberg. Vier Artists, ein Studio — Dein Motiv.',
          bgImage: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1600&q=80',
          badgeText: 'Walk-ins willkommen',
          overlayOpacity: 0.65,
          primaryCta: { label: 'Termin anfragen', href: '/kontakt' },
          secondaryCta: { label: 'Galerie ansehen', href: '/galerie' },
        }},
        { type: 'styleGallery', sortOrder: 1, data: {
          headline: 'Unsere Stile',
          subline: 'Von Fineline bis Blackwork — wir decken ein breites Spektrum ab.',
          styles: [
            { name: 'Fineline', image: 'https://images.unsplash.com/photo-1590246814883-57c511e9682d?w=600&q=80', description: 'Feine Linien, minimalistische Motive' },
            { name: 'Blackwork', image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&q=80', description: 'Großflächige schwarze Flächen und Muster' },
            { name: 'Neo-Traditional', image: 'https://images.unsplash.com/photo-1598371839696-5c5bb1c1781a?w=600&q=80', description: 'Farbe, Kontrast und moderne Interpretationen' },
            { name: 'Geometric', image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&q=80', description: 'Symmetrie, Dotwork und Mandala-Patterns' },
            { name: 'Script', image: 'https://images.unsplash.com/photo-1612875926365-1a078b4ea5c7?w=600&q=80', description: 'Script und botanische Elemente' },
            { name: 'Japanese', image: 'https://images.unsplash.com/photo-1581783898382-80f51ef77f73?w=600&q=80', description: 'Traditionelle japanische Motive und Irezumi' },
            { name: 'Ornamental', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80', description: 'Ornamental und Tribal-Einflüsse' },
            { name: 'Illustrative', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80', description: 'Illustrative Portraits und Blumen' },
          ],
        }},
        { type: 'artistGrid', sortOrder: 2, data: {
          headline: 'Unsere Künstler',
          subline: 'Vier Artists mit eigenem Stil — finde Deinen Match.',
          artists: [
            { name: 'Lena Mauer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', styles: ['Fineline', 'Botanical', 'Minimalist'], bio: 'Spezialisiert auf filigrane Linienarbeit und botanische Motive.', instagram: 'lena.ink', href: '/kuenstler' },
            { name: 'Marco Di Salvo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', styles: ['Blackwork', 'Geometric', 'Dotwork'], bio: 'Große schwarze Flächen und geometrische Präzision.', instagram: 'marco.nero', href: '/kuenstler' },
            { name: 'Yuki Tanaka', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', styles: ['Japanese', 'Irezumi', 'Traditional'], bio: 'Japanische Tradition trifft moderne Interpretation.', instagram: 'yuki.irezumi', href: '/kuenstler' },
            { name: 'Sarah Krebs', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', styles: ['Neo-Traditional', 'Color', 'Illustrative'], bio: 'Farbenfrohe Illustrationen und Neo-Traditional.', instagram: 'sarah.ink.art', href: '/kuenstler' },
          ],
        }},
        { type: 'flashDayBanner', sortOrder: 3, data: {
          headline: 'Summer Flash Day',
          date: '28. Juni 2026',
          description: 'Über 50 Flash-Motive ab 80 € — First come, first served. Kein Termin nötig.',
          ctaLabel: 'Motive ansehen',
          ctaHref: '/galerie',
          bgColor: '#dc2626',
        }},
        { type: 'testimonials', sortOrder: 4, data: {
          headline: 'Was unsere Kunden sagen',
          items: [
            { text: 'Lena hat mein botanisches Sleeve perfekt umgesetzt. Jede Linie sitzt, jedes Detail stimmt. Absolute Empfehlung!', name: 'Anna K.', context: 'Fineline Sleeve', rating: 5 },
            { text: 'Studio ist super sauber, Atmosphäre entspannt und Marco hat das Geometric-Piece in einer Session durchgezogen. Krass.', name: 'Tim R.', context: 'Blackwork Chest', rating: 5 },
            { text: 'Yuki hat meinen Koi-Fisch Entwurf noch besser gemacht als ich mir vorgestellt habe. Traditionelle Kunst auf höchstem Niveau.', name: 'Lisa M.', context: 'Japanese Half-Sleeve', rating: 5 },
            { text: 'Walk-in Flash Day war großartig! Spontan ein Motiv genommen und nach 30 Min fertig. Fair, schnell, perfekt.', name: 'Max B.', context: 'Flash Tattoo', rating: 5 },
          ],
        }},
        { type: 'faq', sortOrder: 5, data: {
          headline: 'Häufige Fragen',
          items: [
            { question: 'Wie läuft eine Terminanfrage ab?', answer: 'Du schickst uns Deine Idee über das Formular (Motiv, Größe, Stelle, ggf. Referenzbilder). Wir antworten innerhalb von 48h mit einem Kostenvoranschlag und Terminvorschlägen.' },
            { question: 'Was kostet ein Tattoo?', answer: 'Unser Stundensatz liegt bei 120–150 € je nach Artist. Minimum sind 80 €. Flash-Motive haben Festpreise ab 80 €.' },
            { question: 'Wie pflege ich mein frisches Tattoo?', answer: 'Folie 3–4 Stunden drauf lassen, dann vorsichtig waschen und dünn eincremen. Kein Pool, keine Sonne für 2 Wochen.' },
            { question: 'Kann ich Walk-in kommen?', answer: 'Für Flash-Motive und kleine Pieces: ja, je nach Verfügbarkeit. Für Custom-Arbeiten immer mit Termin.' },
            { question: 'Was muss ich zum Termin mitbringen?', answer: 'Personalausweis (Mindestalter 18), bequeme Kleidung und etwas gegessen haben. Kein Alkohol 24h vorher.' },
          ],
        }},
        { type: 'tattooBookingCta', sortOrder: 6, data: {
          headline: 'Bereit für Dein nächstes Tattoo?',
          subline: 'Beschreib uns Dein Motiv — wir kümmern uns um den Rest.',
          ctaLabel: 'Terminanfrage starten',
          ctaHref: '/kontakt',
          hints: ['Antwort innerhalb 48h', 'Kostenvoranschlag gratis', 'Individuelle Beratung'],
        }},
      ],
    },
    /* ─── Künstler ─── */
    {
      slug: 'kuenstler', title: 'Künstler', sections: [
        { type: 'artistHero', sortOrder: 0, data: {
          name: 'Lena "Fineline" Mauer',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
          bio: 'Seit 8 Jahren steche ich feine Linien, botanische Motive und minimalistische Designs. Meine Arbeit lebt von Präzision und Reduktion — weniger ist mehr.',
          styles: ['Fineline', 'Botanical', 'Minimalist', 'Script'],
          instagram: 'lena.ink',
          experience: '8 Jahre Erfahrung · Über 2.000 Tattoos',
        }},
        { type: 'galleryGrid', sortOrder: 1, data: {
          headline: 'Lenas Arbeiten',
          images: [
            { src: 'https://images.unsplash.com/photo-1590246814883-57c511e9682d?w=600&q=80', alt: 'Fineline Botanical' },
            { src: 'https://images.unsplash.com/photo-1612875926365-1a078b4ea5c7?w=600&q=80', alt: 'Script Tattoo' },
            { src: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&q=80', alt: 'Geometric Fineline' },
            { src: 'https://images.unsplash.com/photo-1598371839696-5c5bb1c1781a?w=600&q=80', alt: 'Floral Piece' },
          ],
        }},
        { type: 'processSteps', sortOrder: 2, data: {
          headline: 'So arbeite ich',
          steps: [
            { title: 'Beratung', description: 'Wir besprechen Dein Motiv, Stil, Größe und Platzierung.' },
            { title: 'Entwurf', description: 'Ich erstelle eine Zeichnung — Änderungen inklusive.' },
            { title: 'Session', description: 'Stencil aufbringen, letzte Anpassungen, dann geht\'s los.' },
            { title: 'Nachsorge', description: 'Pflege-Guide und Touch-up bei Bedarf kostenlos.' },
          ],
        }},
        { type: 'testimonials', sortOrder: 3, data: {
          headline: 'Kundenstimmen zu Lena',
          items: [
            { text: 'Mein Wildblumen-Sleeve ist ein Traum. Jede Linie perfekt!', name: 'Sophie A.', context: 'Botanical Sleeve', rating: 5 },
            { text: 'Lena hat sich so viel Zeit für den Entwurf genommen. Ergebnis besser als erhofft.', name: 'Nina K.', context: 'Fineline Script', rating: 5 },
          ],
        }},
        { type: 'socialProofBar', sortOrder: 4, data: {
          items: [
            { value: '8', label: 'Jahre Erfahrung' },
            { value: '2.000+', label: 'Tattoos gestochen' },
            { value: '4.9 ★', label: 'Bewertung' },
            { value: '3-4', label: 'Wochen Wartezeit' },
          ],
        }},
        { type: 'tattooBookingCta', sortOrder: 5, data: {
          headline: 'Termin bei Lena anfragen',
          subline: 'Schick mir Deine Idee — ich entwerfe Dein individuelles Motiv.',
          ctaLabel: 'Anfrage an Lena',
          ctaHref: '/kontakt',
          hints: ['Wartezeit ca. 3–4 Wochen', 'Custom-Entwurf inklusive'],
        }},
      ],
    },
    /* ─── Galerie ─── */
    {
      slug: 'galerie', title: 'Galerie', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Arbeiten',
          subline: 'Über 500 gestochene Motive — hier eine Auswahl.',
          bgImage: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=1600&q=80',
          overlayOpacity: 0.7,
        }},
        { type: 'styleGallery', sortOrder: 1, data: {
          headline: 'Portfolio',
          styles: [
            { name: 'Fineline', image: 'https://images.unsplash.com/photo-1590246814883-57c511e9682d?w=600&q=80' },
            { name: 'Blackwork', image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&q=80' },
            { name: 'Japanese', image: 'https://images.unsplash.com/photo-1581783898382-80f51ef77f73?w=600&q=80' },
            { name: 'Neo-Traditional', image: 'https://images.unsplash.com/photo-1598371839696-5c5bb1c1781a?w=600&q=80' },
            { name: 'Geometric', image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&q=80' },
            { name: 'Script', image: 'https://images.unsplash.com/photo-1612875926365-1a078b4ea5c7?w=600&q=80' },
            { name: 'Ornamental', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80' },
            { name: 'Illustrative', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80' },
          ],
        }},
        { type: 'logoMarquee', sortOrder: 2, data: {
          headline: 'Conventions & Auszeichnungen',
          logos: [
            { alt: 'Berlin Tattoo Convention 2025' },
            { alt: 'Hamburg Ink Days' },
            { alt: 'Best of Fineline Award 2024' },
            { alt: 'Vienna Ink Festival' },
          ],
        }},
        { type: 'statsCounter', sortOrder: 3, data: {
          headline: 'INK DISTRICT in Zahlen',
          stats: [
            { value: 3000, suffix: '+', label: 'Gestochene Tattoos' },
            { value: 4, suffix: '', label: 'Artists' },
            { value: 8, suffix: '+', label: 'Tattoo-Stile' },
            { value: 50, suffix: '+', label: 'Flash-Motive' },
          ],
        }},
        { type: 'testimonials', sortOrder: 4, data: {
          headline: 'Unsere Kunden',
          items: [
            { text: 'Am besten Studio in Berlin! Super sauber, Artists mega talentiert.', name: 'Leon M.', context: 'Google Review', rating: 5 },
            { text: 'Yuki hat meinen Drachen vom Entwurf zur Realität gebracht. Wahnsinn.', name: 'Mia S.', context: 'Japanese Half-Sleeve', rating: 5 },
            { text: 'Walk-in Flash Day war perfekt organisiert. In 30 Min fertig, super Ergebnis.', name: 'Felix T.', context: 'Flash Tattoo', rating: 5 },
          ],
        }},
        { type: 'tattooBookingCta', sortOrder: 5, data: {
          headline: 'Gefällt Dir was Du siehst?',
          subline: 'Lass uns Dein Motiv besprechen.',
          ctaLabel: 'Termin anfragen',
          ctaHref: '/kontakt',
        }},
      ],
    },
    /* ─── Leistungen & Preise ─── */
    {
      slug: 'leistungen', title: 'Leistungen & Preise', sections: [
        { type: 'servicesGrid', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          services: [
            { title: 'Custom Tattoo', description: 'Individuell entworfenes Motiv nach Deinen Wünschen.', icon: 'pen' },
            { title: 'Cover-up', description: 'Alte Tattoos überarbeiten und in neue Kunstwerke verwandeln.', icon: 'layers' },
            { title: 'Flash Tattoo', description: 'Fertige Motive aus unserer Sammlung — sofort stechbar.', icon: 'zap' },
            { title: 'Beratung', description: 'Unverbindliches Erstgespräch zu Motiv und Machbarkeit.', icon: 'messageCircle' },
            { title: 'Touch-up', description: 'Kostenlose Nacharbeit innerhalb 3 Monaten.', icon: 'refreshCw' },
            { title: 'Piercing', description: 'Professionelles Piercing mit hochwertigen Materialien.', icon: 'circle' },
          ],
        }},
        { type: 'pricingInfo', sortOrder: 1, data: {
          headline: 'Preise & Konditionen',
          subline: 'Transparent und fair — keine versteckten Kosten.',
          items: [
            { label: 'Stundensatz', value: '120–150 €', note: 'je nach Artist' },
            { label: 'Minimum', value: '80 €', note: 'für kleine Motive' },
            { label: 'Flash ab', value: '80 €', note: 'Festpreis je Motiv' },
            { label: 'Anzahlung', value: '50 €', note: 'wird verrechnet' },
            { label: 'Beratung', value: 'Gratis', note: '15 Min vor Ort' },
            { label: 'Touch-up', value: 'Gratis', note: 'innerhalb 3 Monate' },
          ],
          notes: [
            'Alle Preise inkl. MwSt.',
            'Anzahlung von 50 € bei Terminbuchung (wird verrechnet).',
            'Bei Absage < 48h vor Termin verfällt die Anzahlung.',
          ],
        }},
        { type: 'processSteps', sortOrder: 2, data: {
          headline: 'Dein Weg zum Tattoo',
          steps: [
            { title: 'Anfrage', description: 'Beschreib uns Dein Wunschmotiv über das Formular.' },
            { title: 'Beratung & Entwurf', description: 'Details besprechen, individuelle Zeichnung erstellen.' },
            { title: 'Session', description: 'Stencil, letzte Änderungen, dann gehts los.' },
            { title: 'Nachsorge', description: 'Pflege-Guide und kostenloser Touch-up.' },
          ],
        }},
        { type: 'faq', sortOrder: 3, data: {
          headline: 'Fragen zu Preisen',
          items: [
            { question: 'Wieso kein fixer Preis vorab?', answer: 'Jedes Tattoo ist individuell. Nach der Beratung geben wir einen realistischen Kostenrahmen.' },
            { question: 'Ratenzahlung möglich?', answer: 'Für Projekte ab 500 € bieten wir Ratenzahlung an.' },
            { question: 'Kartenzahlung?', answer: 'Ja — EC, Visa, Mastercard und Apple/Google Pay.' },
          ],
        }},
        { type: 'socialProofBar', sortOrder: 4, data: {
          items: [
            { value: '120–150 €', label: 'Stundensatz' },
            { value: 'ab 80 €', label: 'Flash-Motive' },
            { value: 'Gratis', label: 'Beratung' },
            { value: 'Gratis', label: 'Touch-up (3 Mo.)' },
          ],
        }},
        { type: 'textImage', sortOrder: 5, data: {
          headline: 'Qualität hat ihren Preis',
          text: '<p>Wir verwenden ausschließlich vegane, EU-zertifizierte Farben und arbeiten nach höchsten Hygienestandards. Jede Nadel ist steril verpackt und wird nach einmaliger Verwendung entsorgt.</p><p>Unsere Preise spiegeln die Qualität der Materialien, die Erfahrung unserer Artists und die individuelle Beratung wider.</p>',
          image: 'https://images.unsplash.com/photo-1598371839696-5c5bb1c1781a?w=800&q=80',
        }},
        { type: 'ctaBand', sortOrder: 6, data: {
          headline: 'Bereit für Dein Tattoo?',
          subline: 'Schick uns Deine Idee — Kostenvoranschlag innerhalb 48h.',
          ctaPrimary: { label: 'Terminanfrage', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Pflege-Guide ─── */
    {
      slug: 'pflege', title: 'Pflege-Guide', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Tattoo-Pflege',
          subline: 'Damit Dein neues Tattoo perfekt abheilt.',
          bgImage: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1600&q=80',
          overlayOpacity: 0.75,
        }},
        { type: 'aftercareSteps', sortOrder: 1, data: {
          headline: 'Die ersten 14 Tage',
          subline: 'Befolge diese Schritte für ein perfektes Ergebnis.',
          steps: [
            { title: 'Folie entfernen (nach 3-4h)', description: 'Vorsichtig abziehen, Hände vorher gründlich waschen.' },
            { title: 'Sanft reinigen', description: 'Lauwarm mit pH-neutraler Seife abtupfen. Nicht rubbeln!' },
            { title: 'Dünn eincremen', description: 'Bepanthen oder Tattoo-Creme. Weniger ist mehr.' },
            { title: '3x täglich wiederholen', description: 'Waschen und eincremen für 10-14 Tage.' },
            { title: 'Nicht kratzen!', description: 'Jucken ist normal. Niemals Schorf abziehen.' },
            { title: 'Sonne & Wasser meiden', description: 'Kein Pool, keine Sauna, keine direkte Sonne für 2 Wochen.' },
          ],
        }},
        { type: 'faq', sortOrder: 2, data: {
          headline: 'Pflege-FAQ',
          items: [
            { question: 'Wann wieder Sport?', answer: 'Leichten Sport nach 3-4 Tagen, intensiv nach 2 Wochen.' },
            { question: 'Tattoo in die Sonne?', answer: 'Frisch: nein. Nach Heilung immer SPF 50+.' },
            { question: 'Tattoo schält sich — normal?', answer: 'Ja! Teil der Heilung. Weiter eincremen, nicht abziehen.' },
            { question: 'Wann Touch-up?', answer: 'Falls nach 4-6 Wochen Linien blass sind. Bei uns 3 Monate kostenlos.' },
          ],
        }},
        { type: 'textImage', sortOrder: 3, data: {
          headline: 'Empfohlene Pflegeprodukte',
          text: '<p><strong>Bepanthen Wund- und Heilsalbe</strong> — der Klassiker für Tattoo-Pflege.</p><p><strong>TattooMed After Tattoo</strong> — speziell für frische Tattoos entwickelt.</p><p><strong>Ab der 3. Woche:</strong> SPF 50+ Sonnencreme auf geheilte Tattoos für langfristige Farbbrillanz.</p><p>Vermeide Vaseline und parfümierte Cremes in den ersten 2 Wochen!</p>',
          image: 'https://images.unsplash.com/photo-1612875926365-1a078b4ea5c7?w=800&q=80',
        }},
        { type: 'testimonials', sortOrder: 4, data: {
          headline: 'Heilungs-Erfahrungen',
          items: [
            { text: 'Hab mich genau an den Guide gehalten — nach 2 Wochen war alles perfekt verheilt.', name: 'Laura B.', context: 'Fineline Arm', rating: 5 },
            { text: 'Der kostenlose Touch-up hat den kleinen blassen Spot perfekt korrigiert.', name: 'Jan P.', context: 'Blackwork Rücken', rating: 5 },
          ],
        }},
        { type: 'tattooBookingCta', sortOrder: 5, data: {
          headline: 'Fragen zur Pflege?',
          subline: 'Schreib uns jederzeit.',
          ctaLabel: 'Nachricht senden',
          ctaHref: '/kontakt',
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'tattooBooking', sortOrder: 0, data: {
          headline: 'Terminanfrage',
          subline: 'Beschreib uns Dein Wunschmotiv — wir melden uns innerhalb von 48h.',
          artists: ['Lena Mauer', 'Marco Di Salvo', 'Yuki Tanaka', 'Sarah Krebs'],
        }},
        { type: 'map', sortOrder: 1, data: {
          headline: 'Hier findest Du uns',
          address: 'Oranienstraße 42, 10999 Berlin',
        }},
        { type: 'textImage', sortOrder: 2, data: {
          headline: 'Öffnungszeiten & Walk-ins',
          text: '<p><strong>Di–Fr:</strong> 11:00–19:00<br><strong>Sa:</strong> 12:00–18:00<br><strong>So–Mo:</strong> Geschlossen</p><p>Walk-ins für Flash-Motive je nach Verfügbarkeit. Für Custom immer vorab anfragen.</p><p><strong>Mindestalter:</strong> 18 Jahre (Ausweis mitbringen)</p>',
          image: 'https://images.unsplash.com/photo-1598371839696-5c5bb1c1781a?w=800&q=80',
        }},
        { type: 'socialProofBar', sortOrder: 3, data: {
          items: [
            { value: '12.4k', label: 'Instagram Follower' },
            { value: '4.9 ★', label: 'Google Bewertung' },
            { value: '3.000+', label: 'Gestochene Tattoos' },
            { value: '4', label: 'Artists' },
          ],
        }},
        { type: 'faq', sortOrder: 4, data: {
          headline: 'Fragen zum Termin',
          items: [
            { question: 'Wie lange dauert die Antwort?', answer: 'Wir antworten innerhalb von 48 Stunden mit einem Kostenvoranschlag und Terminvorschlägen.' },
            { question: 'Was passiert bei der Beratung?', answer: 'Wir besprechen Motiv, Größe, Platzierung und Stil. Dauer ca. 15 Minuten, kostenlos.' },
            { question: 'Kann ich mein eigenes Motiv mitbringen?', answer: 'Klar! Referenzbilder helfen uns, Deine Vorstellung optimal umzusetzen.' },
            { question: 'Was kostet eine Stornierung?', answer: 'Absagen bis 48h vorher sind kostenlos. Danach verfällt die Anzahlung (50 €).' },
          ],
        }},
        { type: 'testimonials', sortOrder: 5, data: {
          headline: 'Das sagen unsere Kunden',
          items: [
            { text: 'Schnelle Antwort, fairer Preis, mega Ergebnis. Komme definitiv wieder!', name: 'Marie K.', context: 'Custom Piece', rating: 5 },
            { text: 'Die Beratung war super entspannt und Marco hat sofort verstanden was ich will.', name: 'David L.', context: 'Geometric Back', rating: 5 },
          ],
        }},
      ],
    },
  ],
};
