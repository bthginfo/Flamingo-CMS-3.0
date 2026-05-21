/**
 * Rich demo seed: Café (Röstwerk München)
 */
export const CAFE_CONFIG = {
  slug: 'demo-cafe',
  name: 'Röstwerk München',
  industry: 'cafe' as const,
  activeStyle: 'modern',
  brand: {
    companyName: 'Röstwerk München',
    tagline: 'Third-Wave-Coffee tagsüber, Craft-Cocktails am Abend',
    primaryColor: '#92400e',
    secondaryColor: '#d97706',
    accentColor: '#fef3c7',
  },
  contact: { phone: '+49 89 2345 6789', email: 'hello@roestwerk-muenchen.de', address: 'Wörthstraße 23, 81667 München-Haidhausen' },
  socialLinks: { instagram: 'https://instagram.com/roestwerk_muc', facebook: 'https://facebook.com/roestwerk' },
  openingHours: [
    { day: 'Mo–Fr', hours: '7:30–23:00' },
    { day: 'Sa', hours: '9:00–01:00' },
    { day: 'So', hours: '9:00–22:00' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Karte', href: '/karte', type: 'link' },
    { label: 'Events', href: '/events', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Reservieren', href: '/kontakt' },
  footerColumns: [
    { title: 'Café', items: [{ text: 'Karte', href: '/karte' }, { text: 'Events', href: '/events' }, { text: 'Über uns', href: '/ueber-uns' }] },
    { title: 'Info', items: [{ text: 'Kontakt', href: '/kontakt' }, { text: 'Catering', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: '+49 89 2345 6789' }, { text: 'hello@roestwerk-muenchen.de' }, { text: 'Wörthstraße 23, München' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Reservieren', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kaffee, Kuchen & gute Vibes',
          subline: 'Röstwerk — Third-Wave-Coffee tagsüber, Craft-Cocktails am Abend. Dein Wohnzimmer in München-Haidhausen.',
          bgImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80',
          openingHint: 'Mo–Fr 7:30 · Sa–So 9:00 · Bar ab 18:00',
          primaryCta: { label: 'Karte ansehen', href: '/karte' },
          secondaryCta: { label: 'Events', href: '/events' },
        }},
        { type: 'dailySpecials', sortOrder: 1, data: {
          headline: 'Diese Woche bei uns',
          subline: 'Frisch zubereitet, saisonal und mit Liebe gemacht',
          specials: [
            { day: 'Mo', title: 'Matcha Monday', description: 'Alle Matcha-Drinks 20% reduziert', price: 'ab 3,60 €' },
            { day: 'Mi', title: 'Wine & Cheese', description: 'Ausgewählte Naturweine mit Käseplatte', price: '18,50 €' },
            { day: 'Fr', title: 'Live-Musik', description: 'Akustik-Sessions ab 20 Uhr — Eintritt frei', price: '' },
            { day: 'Sa', title: 'Brunch-Buffet', description: 'Großes Brunch-Buffet bis 14 Uhr (Reservierung empfohlen)', price: '24,90 €' },
            { day: 'So', title: 'Sonntagskuchen', description: 'Frische Torten & Kuchen aus eigener Backstube', price: 'ab 4,50 €' },
          ],
        }},
        { type: 'drinkMenu', sortOrder: 2, data: {
          headline: 'Unsere Karte',
          subline: 'Eigene Röstung · Craft-Cocktails · Naturweine',
          categories: [
            { title: '☕ Kaffee', items: [
              { name: 'Espresso', description: 'Single Origin, wechselnd', price: '2,80 €' },
              { name: 'Flat White', description: 'Doppelter Espresso, samtige Milch', price: '4,20 €' },
              { name: 'Pour Over', description: 'Handgebrüht, V60', price: '4,80 €' },
              { name: 'Cold Brew', description: '24h kalt extrahiert', price: '4,50 €' },
              { name: 'Matcha Latte', description: 'Bio-Matcha aus Kyoto, Hafermilch', price: '4,90 €' },
            ]},
            { title: '🍸 Cocktails (ab 18 Uhr)', items: [
              { name: 'Espresso Martini', description: 'Vodka, Kaffeelikör, frischer Espresso', price: '12,50 €' },
              { name: 'Aperol Spritz', description: 'Aperol, Prosecco, Soda', price: '9,50 €' },
              { name: 'Negroni', description: 'Gin, Campari, süßer Wermut', price: '11,00 €' },
              { name: 'Moscow Mule', description: 'Vodka, Ginger Beer, Limette', price: '10,50 €' },
            ]},
          ],
        }},
        { type: 'foodMenu', sortOrder: 3, data: {
          headline: 'Speisen & Snacks',
          subline: 'Frisch zubereitet mit regionalen Zutaten',
          items: [
            { name: 'Avocado Toast', description: 'Sourdough, pochiertes Ei, Chili-Flocken, Microgreens', price: '11,90 €', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80', badge: 'Bestseller' },
            { name: 'Açaí Bowl', description: 'Granola, frische Früchte, Kokoschips, Honig', price: '12,50 €', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80' },
            { name: 'Croissant Combo', description: 'Buttercroissant, Marmelade, Butter & Kaffee', price: '7,90 €', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80' },
            { name: 'Club Sandwich', description: 'Hähnchen, Bacon, Ei, Salat, Pommes', price: '13,90 €', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80' },
            { name: 'Carrot Cake', description: 'Haugemacht, Cream-Cheese-Frosting', price: '5,50 €', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80' },
            { name: 'Cheesecake', description: 'NY-Style, Beerenspiegel', price: '5,90 €', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&q=80', badge: 'Neu' },
          ],
        }},
        { type: 'testimonials', sortOrder: 4, data: {
          headline: 'Was unsere Gäste sagen',
          items: [
            { text: 'Bester Flat White der Stadt. Die eigene Röstung schmeckt man — und die Atmosphäre ist unschlagbar.', name: 'Laura M.', context: 'Google Review', rating: 5 },
            { text: 'Perfekt zum Arbeiten tagsüber, perfekt zum Ausgehen abends. Die Espresso Martinis sind ein Traum!', name: 'Felix K.', context: 'Google Review', rating: 5 },
            { text: 'Das Brunch-Buffet am Samstag ist ein Muss. Kommt früh, es wird voll! Qualität top.', name: 'Sophie & Tim', context: 'TripAdvisor', rating: 5 },
          ],
        }},
        { type: 'locationVibe', sortOrder: 5, data: {
          headline: 'Komm vorbei',
          address: 'Wörthstraße 23, 81667 München-Haidhausen',
          description: 'Direkt am Wiener Platz, 2 Min. vom Max-Weber-Platz. Fahrradständer vor der Tür, U-Bahn um die Ecke.',
          vibeText: '„Dein drittes Wohnzimmer — zwischen Kaffee und Cocktail."',
          hours: [
            { day: 'Mo–Fr', hours: '7:30–0:00' },
            { day: 'Sa', hours: '9:00–1:00' },
            { day: 'So', hours: '9:00–22:00' },
            { day: 'Bar', hours: 'täglich ab 18:00' },
          ],
          mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.5!2d11.5903!3d48.1351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sW%C3%B6rthstra%C3%9Fe+23%2C+81667+M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1',
        }},
        { type: 'statsCounter', sortOrder: 6, data: {
          headline: 'Röstwerk in Zahlen',
          stats: [
            { value: 2019, suffix: '', label: 'Gegründet' },
            { value: 12, suffix: ' Sorten', label: 'Eigene Röstungen' },
            { value: 340, suffix: '+', label: 'kg Kaffee/Monat' },
            { value: 4.9, suffix: '★', label: 'Google-Bewertung' },
          ],
        }},
      ],
    },
    {
      slug: 'karte', title: 'Karte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Karte',
          subline: 'Eigene Röstung. Saisonale Küche. Craft-Cocktails.',
          bgImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80',
        }},
        { type: 'drinkMenu', sortOrder: 1, data: {
          headline: 'Getränke',
          categories: [
            { title: 'Kaffee-Spezialitäten', items: [
              { name: 'Espresso', price: '2,80 €' },
              { name: 'Doppio', price: '3,40 €' },
              { name: 'Americano', price: '3,50 €' },
              { name: 'Cappuccino', price: '3,90 €' },
              { name: 'Flat White', price: '4,20 €' },
              { name: 'Latte Macchiato', price: '4,20 €' },
              { name: 'Pour Over (V60)', price: '4,80 €' },
              { name: 'Cold Brew', price: '4,50 €' },
              { name: 'Affogato', price: '5,20 €' },
            ]},
            { title: 'Tee & Sonstiges', items: [
              { name: 'Bio-Tee (diverse)', price: '3,50 €' },
              { name: 'Matcha Latte', price: '4,90 €' },
              { name: 'Golden Milk', price: '4,50 €' },
              { name: 'Heiße Schokolade', price: '4,20 €' },
              { name: 'Hausgemachte Limo', price: '4,00 €' },
            ]},
            { title: 'Cocktails (ab 18 Uhr)', items: [
              { name: 'Espresso Martini', price: '12,50 €' },
              { name: 'Aperol Spritz', price: '9,50 €' },
              { name: 'Negroni', price: '11,00 €' },
              { name: 'Old Fashioned', price: '12,00 €' },
              { name: 'Gin Tonic', description: 'Wechselnde Gin-Auswahl', price: '10,50 €' },
              { name: 'Alkoholfreier Cocktail', description: 'Tageswechselnd', price: '7,50 €' },
            ]},
            { title: 'Wein & Bier', items: [
              { name: 'Prosecco (0,1l)', price: '4,50 €' },
              { name: 'Weißwein (0,2l)', description: 'Wechselnde Auswahl', price: '5,50 €' },
              { name: 'Rotwein (0,2l)', description: 'Wechselnde Auswahl', price: '5,50 €' },
              { name: 'Craft Bier (0,33l)', description: 'Von lokalen Brauereien', price: '4,80 €' },
            ]},
          ],
        }},
        { type: 'foodMenu', sortOrder: 2, data: {
          headline: 'Essen',
          subline: 'Frühstück bis 14 Uhr · Snacks ganztags · warme Küche bis 21 Uhr',
          items: [
            { name: 'Avocado Toast', description: 'Sourdough, pochiertes Ei, Chili, Microgreens', price: '11,90 €', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80' },
            { name: 'Granola Bowl', description: 'Joghurt, Granola, frische Früchte, Honig', price: '9,50 €', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80' },
            { name: 'Eggs Benedict', description: 'Pochierte Eier, Hollandaise, Schinken, English Muffin', price: '13,90 €', image: 'https://images.unsplash.com/photo-1608039829572-9b1234ef1406?w=500&q=80' },
            { name: 'Buddha Bowl', description: 'Quinoa, Avocado, Edamame, Sesam-Dressing', price: '14,50 €', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
            { name: 'Flammkuchen', description: 'Crème fraîche, Speck, Zwiebeln', price: '10,90 €', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
          ],
        }},
        { type: 'richText', sortOrder: 3, data: {
          content: '<h2>🌱 Gut zu wissen</h2><p>Alle Kaffees auch mit Hafer-, Soja- oder Mandelmilch — ohne Aufpreis. Unsere Kuchen werden täglich frisch im Haus gebacken. Allergene & Inhaltsstoffe gerne auf Nachfrage an der Bar.</p><p><strong>Happy Hour:</strong> Mo–Do 18–19 Uhr alle Cocktails –2 €.</p>',
        }},
        { type: 'ctaBand', sortOrder: 4, data: {
          headline: 'Lust auf Catering?',
          subline: 'Wir liefern Kaffee, Kuchen und Fingerfood für eure Firmenevents, Meetings und Feiern ab 15 Personen.',
          ctaPrimary: { label: 'Catering anfragen', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'events', title: 'Events', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Events & Programm',
          subline: 'Live-Musik, Tastings, Quiz-Nights und mehr.',
          bgImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80',
        }},
        { type: 'cafeEventCalendar', sortOrder: 1, data: {
          headline: 'Kommende Events',
          subline: 'Eintritt frei, sofern nicht anders angegeben',
          events: [
            { title: 'Acoustic Friday: Lena & Band', date: 'Fr, 24. Mai', time: '20:00', description: 'Singer-Songwriter aus München. Indie-Folk mit Seele.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', category: 'music' },
            { title: 'Naturwein-Tasting', date: 'Mi, 28. Mai', time: '19:30', description: '6 Naturweine aus Frankreich & Österreich. Inkl. Käse & Oliven. 35 €/Person.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', category: 'wine' },
            { title: 'Pub Quiz', date: 'Do, 29. Mai', time: '20:00', description: 'Teams bis 6 Personen. Anmeldung erwünscht. Gewinne: Getränkegutscheine.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80', category: 'default' },
            { title: 'Latte Art Workshop', date: 'Sa, 31. Mai', time: '10:00', description: 'Lerne die Kunst der Latte Art von unserem Head Barista. 45 €/Person inkl. Kaffee.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', category: 'default' },
            { title: 'Jazz Night', date: 'Fr, 6. Juni', time: '20:30', description: 'The Munich Jazz Trio — Standards & Eigenkompositionen.', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80', category: 'music' },
            { title: 'Cocktail-Kurs', date: 'Sa, 7. Juni', time: '18:00', description: '3 Cocktails selbst mixen. Rezepte zum Mitnehmen. 49 €/Person.', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80', category: 'wine' },
          ],
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Stimmen von Event-Besuchern',
          items: [
            { text: 'Der Latte-Art-Workshop war mega — ich kann jetzt tatsächlich Herzen gießen!', name: 'Lisa R.', context: 'Google', rating: 5 },
            { text: 'Pub Quiz immer donnerstags ist unser fester Termin. Super Stimmung, faire Fragen.', name: 'Team Nerdfighters', context: 'Google', rating: 5 },
            { text: 'Die Naturwein-Tastings sind absolut auf Sommelierniveau. Und der Käse dazu!', name: 'Marco J.', context: 'Instagram', rating: 5 },
          ],
        }},
        { type: 'ctaBand', sortOrder: 3, data: {
          headline: 'Eigenes Event planen?',
          subline: 'Ob Firmenfeier, Geburtstag oder Workshop — wir stellen euch ein individuelles Programm zusammen.',
          ctaPrimary: { label: 'Event anfragen', href: '/kontakt' },
        }},
        { type: 'socialProofBar', sortOrder: 4, data: {
          items: [
            { value: '200+', label: 'Events veranstaltet' },
            { value: '98%', label: 'zufriedene Gäste' },
            { value: '15+', label: 'Künstler gebucht' },
          ],
        }},
      ],
    },
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Story',
          subline: 'Von der Idee zum Lieblingsort.',
          bgImage: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=80',
        }},
        { type: 'textImage', sortOrder: 1, data: {
          headline: 'Mehr als nur Kaffee',
          text: '<p>Das Röstwerk entstand 2019 aus der Leidenschaft für perfekten Kaffee und dem Wunsch nach einem Ort, der tagsüber produktiv macht und abends zusammenbringt.</p><p>Wir rösten unsere Bohnen selbst — kleine Chargen, direkt gehandelt, mit Fokus auf Geschmack statt Masse.</p><p>Ab 18 Uhr verwandelt sich das Röstwerk in eine entspannte Bar mit handgemachten Cocktails, Naturweinen und DJs am Wochenende.</p>',
          image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
        }},
        { type: 'team', sortOrder: 2, data: {
          headline: 'Das Team',
          subline: 'Die Menschen hinter dem Tresen',
          members: [
            { name: 'Max Röstner', role: 'Gründer & Head Barista', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: 'SCA-zertifiziert, 10 Jahre Erfahrung.' },
            { name: 'Lena Kaffee', role: 'Bar-Managerin & Mixologin', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: 'Entwickelt unsere saisonale Cocktailkarte.' },
            { name: 'Tom Brauer', role: 'Küche & Patisserie', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Gelernt im Tantris, dann Streetfood in Melbourne.' },
            { name: 'Mia Chen', role: 'Barista & Latte-Art-Champion', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', bio: 'München Latte Art Champion 2024.' },
          ],
        }},
        { type: 'textImage', sortOrder: 3, data: {
          headline: 'Unsere Werte',
          text: '<p><strong>Direct Trade:</strong> Wir kennen unsere Farmer persönlich. Jedes Jahr reisen wir nach Äthiopien und Kolumbien.</p><p><strong>Nachhaltigkeit:</strong> Kompostierbare Becher, Pfandsystem für Mehrweg, Milchalternativen ohne Aufpreis, 100% Ökostrom.</p>',
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
        }},
        { type: 'statsCounter', sortOrder: 4, data: {
          headline: 'Röstwerk in Zahlen',
          stats: [
            { value: 2019, suffix: '', label: 'Gegründet' },
            { value: 12, suffix: ' Sorten', label: 'Eigene Röstungen' },
            { value: 340, suffix: '+', label: 'kg Kaffee/Monat' },
            { value: 4.9, suffix: '★', label: 'Google-Bewertung' },
          ],
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Besuch uns',
          subline: 'Fragen, Reservierungen oder Event-Anfragen? Wir freuen uns auf dich.',
          bgImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600&q=80',
          primaryCta: { label: 'Route planen', href: 'https://maps.google.com/?q=Wörthstraße+23+München' },
        }},
        { type: 'openingHours', sortOrder: 1, data: {
          headline: 'Öffnungszeiten',
          subline: 'Café tagsüber, Bar am Abend',
          hours: [
            { days: 'Montag – Freitag', time: '7:30 – 23:00' },
            { days: 'Samstag', time: '9:00 – 01:00' },
            { days: 'Sonntag', time: '9:00 – 22:00' },
          ],
          note: 'Bar & Cocktails täglich ab 18 Uhr · Küche bis 21:30',
        }},
        { type: 'contact', sortOrder: 2, data: {
          headline: 'Schreib uns',
          subline: 'Für Reservierungen am besten per Mail.',
          phone: '+49 89 2345 6789',
          email: 'hello@roestwerk-muenchen.de',
          address: 'Wörthstraße 23, 81667 München-Haidhausen',
          mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.5!2d11.5903!3d48.1351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sW%C3%B6rthstra%C3%9Fe+23%2C+81667+M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1',
        }},
        { type: 'faq', sortOrder: 3, data: {
          headline: 'Häufige Fragen',
          items: [
            { question: 'Kann man bei euch reservieren?', answer: 'Für das Brunch-Buffet am Samstag empfehlen wir eine Reservierung per E-Mail. Unter der Woche gilt: first come, first served.' },
            { question: 'Habt ihr WLAN?', answer: 'Klar! Frag an der Bar nach dem aktuellen Passwort.' },
            { question: 'Sind Hunde erlaubt?', answer: 'Ja! Wasser steht bereit.' },
            { question: 'Gibt es vegane Optionen?', answer: 'Etwa die Hälfte unserer Speisen ist vegan oder kann vegan zubereitet werden.' },
            { question: 'Woher kommen eure Bohnen?', answer: 'Wir importieren direkt von Farmen in Äthiopien, Kolumbien und Guatemala. Jonas röstet jede Woche frisch.' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 4, data: {
          headline: 'Event bei uns feiern?',
          subline: 'Wir vermieten den Raum für private Events — Geburtstage, Firmen-Offsite oder Barista-Workshops.',
          ctaPrimary: { label: 'Anfrage senden', href: 'mailto:events@roestwerk-muenchen.de' },
        }},
      ],
    },
  ],
};
