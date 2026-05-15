/**
 * Rich demo seed: Hotel (Alpenglow Resort & Spa)
 * ALL section types, ALL fields populated with realistic content.
 */
export const HOTEL_CONFIG = {
  slug: 'demo-hotel',
  name: 'Alpenglow Resort & Spa',
  industry: 'hotel' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Alpenglow Resort & Spa',
    tagline: 'Luxus und Natur vereint — Ihr Rückzugsort in den Tiroler Alpen',
    primaryColor: '#1e3a5f',
    secondaryColor: '#2563eb',
    accentColor: '#d4a574',
  },
  contact: { phone: '+43 5264 890 00', email: 'info@alpenglow-resort.at', address: 'Bergstraße 42, 6450 Sölden, Tirol' },
  socialLinks: { instagram: 'https://instagram.com/alpenglow-resort', facebook: 'https://facebook.com/alpenglow-resort' },
  openingHours: [{ day: 'Rezeption', hours: '24/7' }, { day: 'Restaurant', hours: '07:00–22:00' }, { day: 'Spa', hours: '08:00–21:00' }],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Zimmer & Suiten', href: '/zimmer', type: 'link' },
    { label: 'Wellness & Spa', href: '/wellness', type: 'link' },
    { label: 'Kulinarik', href: '/kulinarik', type: 'link' },
    { label: 'Erlebnisse', href: '/erlebnisse', type: 'link' },
    { label: 'Veranstaltungen', href: '/veranstaltungen', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Zimmer buchen', href: '/zimmer' },
  footerColumns: [
    { title: 'Hotel', items: [{ text: 'Zimmer & Suiten', href: '/zimmer' }, { text: 'Wellness & Spa', href: '/wellness' }, { text: 'Kulinarik', href: '/kulinarik' }] },
    { title: 'Erlebnisse', items: [{ text: 'Sommer & Winter', href: '/erlebnisse' }, { text: 'Veranstaltungen', href: '/veranstaltungen' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Kontakt', items: [{ text: 'Tel: +43 5264 890 00' }, { text: 'info@alpenglow-resort.at' }, { text: 'Bergstraße 42, 6450 Sölden' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt buchen', href: '/zimmer' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Alpenglow Resort & Spa',
          subline: 'Ihr exklusiver Rückzugsort auf 1.350 m — umgeben von der majestätischen Kulisse der Ötztaler Alpen. Luxuriöse Zimmer, preisgekröntes Spa und alpine Kulinarik.',
          badgeText: '5-Sterne Superior',
          bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85',
          trustItems: ['5-Sterne Superior', 'Direkt an der Skipiste', 'Infinity-Pool mit Bergpanorama'],
          primaryCta: { label: 'Verfügbarkeit prüfen', href: '/zimmer' },
          secondaryCta: { label: 'Hotel entdecken', href: '/wellness' },
        }},
        { type: 'hotelRooms', sortOrder: 1, data: {
          headline: 'Zimmer & Suiten',
          subline: 'Luxuriöser Rückzug mit alpinem Charakter',
          badgeText: '6 Zimmerkategorien',
          rooms: [
            { name: 'Deluxe Doppelzimmer', description: 'Geräumiges Zimmer mit Panoramabalkon, Regendusche und hochwertigsten Naturmaterialien. 35 m².', priceLabel: 'Ab 280 € / Nacht', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', features: ['Bergpanorama', 'Balkon', 'Regendusche', 'Minibar', 'Safe', 'WLAN'], sizeLabel: '35 m²', guestLabel: '2 Gäste', cta: { label: 'Details & Buchen', href: '/zimmer' } },
            { name: 'Panorama Suite', description: 'Großzügige Suite mit separatem Wohnbereich, freistehender Badewanne und 180°-Alpenpanorama. 65 m².', priceLabel: 'Ab 520 € / Nacht', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80', features: ['180° Panorama', 'Freistehende Badewanne', 'Wohnbereich', 'Nespresso', 'Smart-TV', 'WLAN'], sizeLabel: '65 m²', guestLabel: '2–3 Gäste', cta: { label: 'Details & Buchen', href: '/zimmer' } },
            { name: 'Penthouse Suite', description: 'Unsere exklusivste Suite: privater Whirlpool auf der Dachterrasse, offener Kamin und Butler-Service. 120 m².', priceLabel: 'Ab 1.200 € / Nacht', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80', features: ['Privater Whirlpool', 'Dachterrasse', 'Kamin', 'Butler-Service', '2 Bäder', 'Champagner-Willkommen'], sizeLabel: '120 m²', guestLabel: '2–4 Gäste', cta: { label: 'Details & Buchen', href: '/zimmer' } },
          ],
        }},
        { type: 'hotelAmenities', sortOrder: 2, data: {
          headline: 'Ausstattung & Services',
          subline: 'Alles für einen sorglosen Aufenthalt',
          badgeText: 'Premium',
          categories: [
            { title: 'Wellness & Fitness', items: ['2.000 m² Spa-Bereich', 'Infinity-Außenpool (32°C)', 'Finnische Sauna & Dampfbad', 'Fitnessraum 24/7', 'Yoga-Raum', 'Massagen & Treatments'] },
            { title: 'Kulinarik', items: ['Gourmetrestaurant (1 Hauben)', 'Panorama-Frühstücksbuffet', 'Weinbar mit 400 Positionen', 'Cocktailbar', 'Nachmittags-Patisserie', 'Room Service'] },
            { title: 'Aktivitäten', items: ['Ski-in / Ski-out', 'Hauseigener Ski-Verleih', 'Geführte Wanderungen', 'E-Bike-Verleih', 'Golfplatz (5 Min.)', 'Kinderbetreuung'] },
          ],
          ctaPrimary: { label: 'Alle Annehmlichkeiten', href: '/wellness' },
        }},
        { type: 'testimonials', sortOrder: 3, data: {
          headline: 'Was unsere Gäste sagen',
          subline: 'Aus über 2.000 Bewertungen',
          ratingValue: '4.9',
          ratingSource: 'TripAdvisor',
          testimonials: [
            { name: 'Familie Berger', location: 'München', rating: 5, text: 'Ein unvergesslicher Familienurlaub! Die Kinder waren begeistert vom Kinderclub, wir vom Spa. Das Frühstücksbuffet ist das beste, das wir je gesehen haben.' },
            { name: 'Dr. Christine Auer', location: 'Wien', rating: 5, text: 'Perfekte Auszeit vom Alltag. Der Infinity-Pool mit Blick auf die Berge ist atemberaubend. Das Personal ist aufmerksam und dezent — genau richtig.' },
            { name: 'Thomas & Maria K.', location: 'Zürich', rating: 5, text: 'Zum dritten Mal hier und es wird jedes Mal besser. Die Penthouse Suite ist ein Traum. Das 7-Gänge-Menü im Gourmetrestaurant war ein Highlight.' },
          ],
        }},
      ],
    },
    {
      slug: 'zimmer', title: 'Zimmer & Suiten', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Zimmer & Suiten',
          subline: 'Sechs Kategorien — von gemütlich-alpin bis exklusiv-luxuriös. Jedes Zimmer mit Bergblick.',
          bgImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&q=85',
          primaryCta: { label: 'Verfügbarkeit prüfen', href: '/zimmer' },
        }},
        { type: 'hotelRooms', sortOrder: 1, data: {
          headline: 'Wählen Sie Ihr Refugium',
          subline: 'Jedes Zimmer ist ein Unikat — gestaltet mit lokalen Materialien und modernem Luxus',
          rooms: [
            { name: 'Komfort Doppelzimmer', description: 'Gemütliches Zimmer mit alpinem Charme: Massivholzmöbel, kuschelige Decken aus Tiroler Wolle und Blick ins Tal.', priceLabel: 'Ab 220 € / Nacht', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', features: ['Talblick', 'Balkon', 'Dusche', 'WLAN', 'Minibar', 'Safe'], sizeLabel: '28 m²', guestLabel: '2 Gäste', cta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Deluxe Doppelzimmer', description: 'Geräumiges Zimmer mit Panoramabalkon, Regendusche und hochwertigsten Naturmaterialien.', priceLabel: 'Ab 280 € / Nacht', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', features: ['Bergpanorama', 'Balkon', 'Regendusche', 'Minibar', 'Safe', 'WLAN'], sizeLabel: '35 m²', guestLabel: '2 Gäste', cta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Junior Suite', description: 'Großzügig geschnittene Suite mit Sitzecke, Schreibtisch und luxuriösem Bad mit Badewanne & Regendusche.', priceLabel: 'Ab 380 € / Nacht', image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80', features: ['Bergpanorama', 'Sitzecke', 'Badewanne', 'Regendusche', 'Nespresso', 'Smart-TV'], sizeLabel: '48 m²', guestLabel: '2–3 Gäste', cta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Panorama Suite', description: 'Separate Wohn- und Schlafbereiche mit 180°-Bergpanorama, freistehender Badewanne und Lounge-Balkon.', priceLabel: 'Ab 520 € / Nacht', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80', features: ['180° Panorama', 'Freistehende Badewanne', 'Wohnbereich', 'Lounge-Balkon', 'Nespresso', 'WLAN'], sizeLabel: '65 m²', guestLabel: '2–3 Gäste', cta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Familien Suite', description: 'Zwei verbundene Zimmer für die perfekte Familienzeit: Elternschlafzimmer mit Kinderzimmer, zwei Bäder.', priceLabel: 'Ab 450 € / Nacht', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80', features: ['2 Schlafzimmer', '2 Bäder', 'Verbindungstür', 'Kinderbetten', 'Spielecke', 'Babyfon'], sizeLabel: '72 m²', guestLabel: '2 Erw. + 2 Kinder', cta: { label: 'Buchen', href: '/zimmer' } },
            { name: 'Penthouse Suite', description: 'Unsere exklusivste Suite: privater Whirlpool auf der Dachterrasse, offener Kamin und Butler-Service.', priceLabel: 'Ab 1.200 € / Nacht', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80', features: ['Privater Whirlpool', 'Dachterrasse', 'Kamin', 'Butler-Service', '2 Bäder', 'Champagner'], sizeLabel: '120 m²', guestLabel: '2–4 Gäste', cta: { label: 'Buchen', href: '/zimmer' } },
          ],
        }},
      ],
    },
    {
      slug: 'wellness', title: 'Wellness & Spa', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Wellness & Spa',
          subline: '2.000 m² alpines Wohlgefühl — Infinity-Pool, Saunawelt und erstklassige Treatments',
          bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1800&q=85',
          primaryCta: { label: 'Treatment buchen', href: '/kontakt' },
        }},
        { type: 'hotelAmenities', sortOrder: 1, data: {
          headline: 'Unser Spa-Bereich',
          subline: 'Verwöhnung auf höchstem Niveau',
          categories: [
            { title: 'Wasserwelt', items: ['Infinity-Außenpool (32°C, ganzjährig)', 'Innenpool (28°C)', 'Sole-Whirlpool', 'Erlebnisduschen', 'Eisgrotte', 'Kneipp-Parcours'] },
            { title: 'Saunawelt', items: ['Finnische Sauna (90°C)', 'Bio-Kräutersauna (60°C)', 'Dampfbad mit Salz', 'Infrarot-Kabine', 'Tepidarium', 'Ruheräume mit Bergblick'] },
            { title: 'Treatments', items: ['Alpenkräuter-Massage', 'Hot-Stone-Massage', 'Arvenöl-Ganzkörperwickel', 'Gesichtsbehandlungen', 'Paarbehandlungen', 'Ayurveda-Rituale'] },
          ],
          ctaPrimary: { label: 'Treatment-Menü ansehen', href: '/kontakt' },
        }},
        { type: 'hotelSpecialOffers', sortOrder: 2, data: {
          headline: 'Wellness-Packages',
          subline: 'Unsere beliebtesten Spa-Arrangements',
          offers: [
            { title: 'Alpine Balance — 3 Nächte', description: 'Ankommen, durchatmen, aufleben: 3 Übernachtungen mit Verwöhnpension, täglichem Spa-Zugang, einer Alpenkräuter-Massage und einer Beauty-Gesichtsbehandlung.', priceLabel: 'Ab 990 € p.P.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80', includes: ['3 Übernachtungen', 'Verwöhnpension', '1x Alpenkräuter-Massage', '1x Gesichtsbehandlung', 'Spa-Nutzung', 'Bademantel & Slipper'], cta: { label: 'Package anfragen', href: '/kontakt' } },
            { title: 'Romantik-Auszeit — 2 Nächte', description: 'Candle-Light-Dinner, Paarmassage und Champagner-Frühstück auf dem Zimmer — perfekt für besondere Anlässe.', priceLabel: 'Ab 780 € p.P.', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&q=80', includes: ['2 Übernachtungen', 'Candle-Light-Dinner', '1x Paarmassage', 'Champagner-Frühstück', 'Rosenblätter-Dekoration', 'Spa-Zugang'], cta: { label: 'Package anfragen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'kulinarik', title: 'Kulinarik', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kulinarik',
          subline: 'Regionale Produkte, alpine Kochkunst und internationale Raffinesse',
          bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
        }},
        { type: 'richText', sortOrder: 1, data: {
          headline: 'Gastronomie im Alpenglow',
          subline: 'Drei Restaurants, eine Bar — für jeden Moment das passende Ambiente',
          blocks: [
            { type: 'text', content: 'Unser Küchenteam unter der Leitung von Küchenchef Stefan Walser setzt auf höchste Qualität regionaler Produkte. Fleisch aus Tiroler Berglandwirtschaft, Fisch aus heimischen Gewässern und Kräuter aus dem hauseigenen Garten bilden die Basis unserer Gerichte.' },
            { type: 'text', content: '**Gourmetrestaurant „Gipfelblick"** (1 Hauben) — Feine alpine Küche mit internationalen Akzenten. 7-Gänge-Menü Di–Sa ab 19:00 Uhr. Reservierung erforderlich.' },
            { type: 'text', content: '**Stüberl „Zum Hirsch"** — Tiroler Klassiker in gemütlicher Atmosphäre: Kaspressknödel, Tiroler Gröstl, Kaiserschmarrn. Täglich 12:00–21:00 Uhr.' },
            { type: 'text', content: '**Panorama-Bar** — Cocktails, regionale Edelbrände und hausgemachte Patisserie mit Blick auf die Gletscherwelt. Täglich 16:00–01:00 Uhr.' },
          ],
          ctaPrimary: { label: 'Tisch reservieren', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'erlebnisse', title: 'Erlebnisse', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Erlebnisse',
          subline: 'Ob Sommer oder Winter — die Ötztaler Alpen bieten unvergessliche Momente',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'hotelSpecialOffers', sortOrder: 1, data: {
          headline: 'Saisonale Erlebnispakete',
          subline: 'Abenteuer und Erholung perfekt kombiniert',
          offers: [
            { title: 'Ski & Spa — 5 Nächte', description: 'Ski-in / Ski-out im größten Gletscherskigebiet Österreichs, täglich Spa-Zugang und unser Après-Ski-Paket.', priceLabel: 'Ab 1.650 € p.P.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', includes: ['5 Übernachtungen', 'Verwöhnpension', '5-Tages-Skipass', 'Ski-Depot & Express-Service', 'Spa-Nutzung', 'Après-Ski-Paket'], cta: { label: 'Anfragen', href: '/kontakt' } },
            { title: 'Wander & Wellness — 4 Nächte', description: 'Geführte Bergtour mit staatlich geprüftem Bergführer, E-Bike-Tour durchs Ötztal und Massage zum Ausklang.', priceLabel: 'Ab 1.180 € p.P.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', includes: ['4 Übernachtungen', 'Verwöhnpension', '2x Geführte Wanderung', '1x E-Bike-Tour', '1x Massage', 'Spa-Nutzung'], cta: { label: 'Anfragen', href: '/kontakt' } },
            { title: 'Golf & Genuss — 3 Nächte', description: 'Green Fee für 3 Runden auf dem Championship-Platz, Gourmetabend im „Gipfelblick" und Relaxen im Spa.', priceLabel: 'Ab 1.050 € p.P.', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=80', includes: ['3 Übernachtungen', 'Verwöhnpension', '3x Green Fee', '1x Gourmet-Dinner', 'Spa-Nutzung', 'Leih-Equipment'], cta: { label: 'Anfragen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'veranstaltungen', title: 'Veranstaltungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Veranstaltungen & Events',
          subline: 'Von der intimen Feier bis zur großen Konferenz — in spektakulärer Bergkulisse',
          bgImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
          primaryCta: { label: 'Event anfragen', href: '/kontakt' },
        }},
        { type: 'eventSpaces', sortOrder: 1, data: {
          headline: 'Unsere Veranstaltungsräume',
          subline: 'Vier individuell gestaltbare Räumlichkeiten mit modernster Technik',
          badgeText: 'Bis 200 Personen',
          spaces: [
            { name: 'Saal „Wildspitze"', description: 'Unser größter Veranstaltungsraum mit Panoramaverglasung, flexiblem Bestuhlung und Bühne. Ideal für Konferenzen, Gala-Dinner und Firmenfeiern.', image: 'https://images.unsplash.com/photo-1431540015159-0f9641f13f06?w=900&q=80', capacityLabel: 'Bis 200 Personen', sizeLabel: '350 m²', seatingOptions: ['Bankett (200)', 'Parlamentarisch (150)', 'Theater (250)', 'U-Form (80)'], features: ['Panoramaverglasung', 'Bühne', 'Beamer & Leinwand', 'Soundsystem', 'Verdunkelung', 'Klimaanlage'], inquiryCta: { label: 'Anfrage senden', href: '/kontakt' } },
            { name: 'Stube „Edelweiß"', description: 'Gemütlicher Raum in traditionellem Tiroler Stil mit Holzvertäfelung und Kachelofen. Perfekt für Meetings, Workshops oder private Feiern.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80', capacityLabel: 'Bis 30 Personen', sizeLabel: '65 m²', seatingOptions: ['Boardroom (20)', 'U-Form (18)', 'Bankett (30)'], features: ['Kachelofen', 'Holzvertäfelung', 'Flipchart', 'TV-Bildschirm', 'WLAN', 'Direkter Terrassenzugang'], inquiryCta: { label: 'Anfrage senden', href: '/kontakt' } },
            { name: 'Weingewölbe', description: 'Historisches Gewölbe mit Natursteinwänden, umgeben von über 400 Weinpositionen. Ein einzigartiger Rahmen für exklusive Dinner und Weinverkostungen.', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80', capacityLabel: 'Bis 16 Personen', sizeLabel: '40 m²', seatingOptions: ['Tafel (16)', 'Stehtisch (25)'], features: ['Natursteingewölbe', 'Weinsammlung', 'Dimmbares Licht', 'Privateingang', 'Sommelier-Service'], inquiryCta: { label: 'Anfrage senden', href: '/kontakt' } },
            { name: 'Panorama-Terrasse', description: 'Open-Air-Location mit 360°-Bergpanorama für Empfänge, Hochzeiten und Sommerevents. Überdachbar bei Bedarf.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', capacityLabel: 'Bis 120 Personen', sizeLabel: '280 m²', seatingOptions: ['Empfang (120)', 'Bankett (80)', 'Zeremonie (100)'], features: ['360° Bergpanorama', 'Überdachbar', 'Außenbar', 'Lichterketten', 'Heizstrahler', 'DJ-Pult'], inquiryCta: { label: 'Anfrage senden', href: '/kontakt' } },
          ],
          processHeadline: 'So planen wir Ihr Event',
          processSteps: [
            { title: 'Erstgespräch', text: 'Wir besprechen Ihre Wünsche, den Rahmen und die Möglichkeiten — persönlich, telefonisch oder per Video.', icon: 'phone' },
            { title: 'Individuelles Konzept', text: 'Unser Event-Team erstellt ein maßgeschneidertes Angebot mit Raumplanung, Menüvorschlag und Technik-Setup.', icon: 'clipboard' },
            { title: 'Feinplanung', text: 'Wir stimmen alle Details ab: Tischdekoration, musikalische Begleitung, Technik und Sonderwünsche.', icon: 'settings' },
            { title: 'Ihr Event', text: 'Am großen Tag kümmern wir uns um alles — Sie genießen und Ihre Gäste staunen.', icon: 'star' },
          ],
          ctaPrimary: { label: 'Event anfragen', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Antworten auf die wichtigsten Fragen rund um Ihren Aufenthalt im Alpenglow Resort',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          subline: 'Wir beantworten Ihre Fragen',
          items: [
            { question: 'Wann kann ich einchecken und auschecken?', answer: 'Check-in ist ab 15:00 Uhr, Check-out bis 11:00 Uhr. Ein Early Check-in (ab 12:00 Uhr) oder Late Check-out (bis 14:00 Uhr) ist nach Verfügbarkeit gegen Aufpreis möglich. Am Abreisetag können Sie den Spa-Bereich bis 16:00 Uhr nutzen.' },
            { question: 'Ist das Hotel für Kinder geeignet?', answer: 'Absolut! Wir bieten eine Familien Suite, professionelle Kinderbetreuung (3–12 Jahre, täglich 09:00–17:00 Uhr), einen Indoor-Spielbereich und altersgerechte Menüs. Babybetten, Hochstühle und Babyfone stellen wir kostenlos bereit.' },
            { question: 'Gibt es Parkmöglichkeiten?', answer: 'Ja, wir verfügen über eine Tiefgarage mit 80 Stellplätzen (kostenlos für Hausgäste). E-Ladestationen sind ebenfalls vorhanden. Ein Valet-Parking-Service steht täglich von 16:00–24:00 Uhr zur Verfügung.' },
            { question: 'Wie erreiche ich das Hotel mit öffentlichen Verkehrsmitteln?', answer: 'Ab Innsbruck Hbf fahren Sie mit dem Bus 4166 der ÖBB Postbus direkt nach Sölden (Fahrzeit ca. 90 Minuten). Vom Busbahnhof Sölden sind es nur 5 Gehminuten. Gerne organisieren wir auch einen Flughafentransfer ab Innsbruck (ca. 75 Min.).' },
            { question: 'Ist der Spa-Bereich im Zimmerpreis enthalten?', answer: 'Ja, die Nutzung des gesamten Spa-Bereichs (Pool, Saunawelt, Ruheräume, Fitnessraum) ist für alle Hausgäste inklusive. Treatments und Massagen sind separat buchbar — wir empfehlen eine Vorreservierung.' },
            { question: 'Kann ich meinen Hund mitbringen?', answer: 'In unserem „Pet-Friendly"-Zimmer auf Anfrage möglich. Aufpreis: 30 € / Nacht inkl. Hundebett, Näpfe und Leckerli. Im Restaurant und Spa-Bereich sind Hunde nicht gestattet.' },
            { question: 'Bieten Sie vegetarische oder vegane Menüs an?', answer: 'Ja, alle unsere Restaurants bieten umfangreiche vegetarische und vegane Optionen. Unser Küchenchef erstellt auf Wunsch auch individuelle Menüs für Gäste mit Allergien oder speziellen Ernährungsanforderungen. Bitte informieren Sie uns vorab.' },
          ],
          ctaPrimary: { label: 'Noch Fragen? Kontaktieren Sie uns', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt & Anreise', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Anreise',
          subline: 'Wir freuen uns auf Ihre Nachricht und Ihren Besuch',
          bgImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
        }},
        { type: 'location', sortOrder: 1, data: {
          headline: 'So finden Sie uns',
          subline: 'Mitten in den Ötztaler Alpen',
          badgeText: 'Bergstraße 42, 6450 Sölden',
          addressText: 'Alpenglow Resort & Spa\nBergstraße 42\n6450 Sölden, Tirol\nÖsterreich',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2726.9!2d10.84!3d46.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbwsDU4JzEyLjAiTiAxMMKwNTAnMjQuMCJF!5e0!3m2!1sde!2sat!4v1700000000000',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80',
          transportItems: [
            { icon: 'car', label: 'Mit dem Auto', value: 'A13 Brenner → Ausfahrt Ötztal → B186 nach Sölden (ca. 35 Min.)', text: 'Kostenlose Tiefgarage mit 80 Stellplätzen und E-Ladestationen.' },
            { icon: 'train', label: 'Mit der Bahn', value: 'Innsbruck Hbf → Bus 4166 nach Sölden (ca. 90 Min.)', text: 'Vom Busbahnhof Sölden nur 5 Gehminuten. Flughafentransfer auf Anfrage.' },
            { icon: 'plane', label: 'Mit dem Flugzeug', value: 'Flughafen Innsbruck (INN) — ca. 75 Min. Fahrzeit', text: 'Privater Flughafentransfer ab 150 € (bis 4 Personen). Bitte vorab buchen.' },
          ],
          nearbyItems: [
            { title: 'Gaislachkoglbahn', distanceLabel: '200 m', text: 'Direkte Gondelbahn ins Skigebiet und Wandergebiet. Ski-in/Ski-out möglich.', image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&q=80' },
            { title: 'Aqua Dome Therme', distanceLabel: '15 Min.', text: 'Spektakuläre Thermenlandschaft in Längenfeld — perfekt für einen Tagesausflug.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=400&q=80' },
            { title: 'Ötzi-Dorf', distanceLabel: '20 Min.', text: 'Archäologisches Freilichtmuseum in Umhausen — spannend für die ganze Familie.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
          ],
          routeCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Bergstra%C3%9Fe+42,+6450+S%C3%B6lden' },
        }},
        { type: 'contact', sortOrder: 2, data: {
          headline: 'Kontaktieren Sie uns',
          subline: 'Wir helfen Ihnen gerne bei Fragen, Buchungen und Sonderwünschen',
          introText: 'Ob telefonisch, per E-Mail oder über unser Kontaktformular — unser Team ist für Sie da. Für Buchungsanfragen empfehlen wir die direkte Kontaktaufnahme per Telefon für die schnellste Rückmeldung.',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 5264 890 00' },
            { icon: 'mail', label: 'E-Mail', value: 'info@alpenglow-resort.at' },
            { icon: 'clock', label: 'Rezeption', value: '24/7 erreichbar' },
            { icon: 'map', label: 'Adresse', value: 'Bergstraße 42, 6450 Sölden' },
          ],
          contactCta: { label: 'Nachricht senden', href: '/kontakt' },
          routeCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Bergstra%C3%9Fe+42,+6450+S%C3%B6lden' },
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
        }},
      ],
    },
  ],
};
