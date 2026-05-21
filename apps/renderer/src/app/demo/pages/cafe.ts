import type { DemoSite } from '.';

const HERO = { visible: true, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, variant: null };
const SECTION = { visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null, variant: null };

export const cafeSite: DemoSite = {
  industry: 'cafe',
  industryKey: 'cafe',
  defaultStyle: 'modern',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'cf-hero', type: 'hero',
          data: {
            headline: 'Kaffee, Kuchen & gute Vibes',
            subline: 'Röstwerk — Third-Wave-Coffee tagsüber, Craft-Cocktails am Abend. Dein Wohnzimmer in München-Haidhausen.',
            bgImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80',
            openingHint: 'Mo–Fr 7:30 · Sa–So 9:00 · Bar ab 18:00',
            primaryCta: { label: 'Karte ansehen', href: '/demo/cafe/karte' },
            secondaryCta: { label: 'Events', href: '/demo/cafe/events' },
          },
        },
        {
          ...SECTION, id: 'cf-specials', type: 'dailySpecials',
          data: {
            headline: 'Diese Woche bei uns',
            subline: 'Frisch zubereitet, saisonal und mit Liebe gemacht',
            specials: [
              { day: 'Mo', title: 'Matcha Monday', description: 'Alle Matcha-Drinks 20% reduziert', price: 'ab 3,60 €' },
              { day: 'Mi', title: 'Wine & Cheese', description: 'Ausgewählte Naturweine mit Käseplatte', price: '18,50 €' },
              { day: 'Fr', title: 'Live-Musik', description: 'Akustik-Sessions ab 20 Uhr — Eintritt frei', price: '' },
              { day: 'Sa', title: 'Brunch-Buffet', description: 'Großes Brunch-Buffet bis 14 Uhr (Reservierung empfohlen)', price: '24,90 €' },
              { day: 'So', title: 'Sonntagskuchen', description: 'Frische Torten & Kuchen aus eigener Backstube', price: 'ab 4,50 €' },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-drinks', type: 'drinkMenu',
          data: {
            headline: 'Unsere Karte',
            subline: 'Eigene Röstung · Craft-Cocktails · Naturweine',
            categories: [
              {
                title: '☕ Kaffee',
                items: [
                  { name: 'Espresso', description: 'Single Origin, wechselnd', price: '2,80 €' },
                  { name: 'Flat White', description: 'Doppelter Espresso, samtige Milch', price: '4,20 €' },
                  { name: 'Pour Over', description: 'Handgebrüht, V60', price: '4,80 €' },
                  { name: 'Cold Brew', description: '24h kalt extrahiert', price: '4,50 €' },
                  { name: 'Matcha Latte', description: 'Bio-Matcha aus Kyoto, Hafermilch', price: '4,90 €' },
                ],
              },
              {
                title: '🍸 Cocktails (ab 18 Uhr)',
                items: [
                  { name: 'Espresso Martini', description: 'Vodka, Kaffeelikör, frischer Espresso', price: '12,50 €' },
                  { name: 'Aperol Spritz', description: 'Aperol, Prosecco, Soda', price: '9,50 €' },
                  { name: 'Negroni', description: 'Gin, Campari, süßer Wermut', price: '11,00 €' },
                  { name: 'Moscow Mule', description: 'Vodka, Ginger Beer, Limette', price: '10,50 €' },
                ],
              },
              {
                title: '🍷 Wein & Bier',
                items: [
                  { name: 'Hauswein Weiß', description: 'Grüner Veltliner, Niederösterreich', price: '5,50 €' },
                  { name: 'Hauswein Rot', description: 'Zweigelt, Burgenland', price: '5,50 €' },
                  { name: 'Craft Bier', description: 'Wechselnde Auswahl, 0,33l', price: '4,80 €' },
                ],
              },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-food', type: 'foodMenu',
          data: {
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
          },
        },
        {
          ...SECTION, id: 'cf-atmosphere', type: 'atmosphereGallery',
          data: {
            headline: 'Unser Space',
            images: [
              { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', caption: 'Der Tresen' },
              { src: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80', caption: 'Gemütliche Ecke' },
              { src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', caption: 'Terrasse' },
              { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', caption: 'Latte Art' },
              { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', caption: 'Abendstimmung' },
              { src: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80', caption: 'Unsere Röstung' },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-testimonials', type: 'testimonials',
          data: {
            headline: 'Was unsere Gäste sagen',
            testimonials: [
              { text: 'Bester Flat White der Stadt. Die eigene Röstung schmeckt man — und die Atmosphäre ist unschlagbar.', name: 'Laura M.', source: 'Google', stars: 5 },
              { text: 'Perfekt zum Arbeiten tagsüber, perfekt zum Ausgehen abends. Die Espresso Martinis sind ein Traum!', name: 'Felix K.', source: 'Google', stars: 5 },
              { text: 'Das Brunch-Buffet am Samstag ist ein Muss. Kommt früh, es wird voll! Qualität top.', name: 'Sophie & Tim', source: 'TripAdvisor', stars: 5 },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-location', type: 'locationVibe',
          data: {
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
            mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
          },
        },
      ],
    },
    {
      slug: 'karte',
      title: 'Karte',
      sections: [
        {
          ...HERO, id: 'cf-menu-hero', type: 'hero',
          data: {
            headline: 'Unsere Karte',
            subline: 'Eigene Röstung. Saisonale Küche. Craft-Cocktails.',
            bgImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 'cf-menu-drinks', type: 'drinkMenu',
          data: {
            headline: 'Getränke',
            categories: [
              {
                title: 'Kaffee-Spezialitäten',
                items: [
                  { name: 'Espresso', price: '2,80 €' },
                  { name: 'Doppio', price: '3,40 €' },
                  { name: 'Americano', price: '3,50 €' },
                  { name: 'Cappuccino', price: '3,90 €' },
                  { name: 'Flat White', price: '4,20 €' },
                  { name: 'Latte Macchiato', price: '4,20 €' },
                  { name: 'Pour Over (V60)', price: '4,80 €' },
                  { name: 'Cold Brew', price: '4,50 €' },
                  { name: 'Affogato', price: '5,20 €' },
                ],
              },
              {
                title: 'Tee & Sonstiges',
                items: [
                  { name: 'Bio-Tee (diverse)', price: '3,50 €' },
                  { name: 'Matcha Latte', price: '4,90 €' },
                  { name: 'Golden Milk', price: '4,50 €' },
                  { name: 'Heiße Schokolade', price: '4,20 €' },
                  { name: 'Hausgemachte Limo', price: '4,00 €' },
                ],
              },
              {
                title: 'Cocktails (ab 18 Uhr)',
                items: [
                  { name: 'Espresso Martini', price: '12,50 €' },
                  { name: 'Aperol Spritz', price: '9,50 €' },
                  { name: 'Negroni', price: '11,00 €' },
                  { name: 'Old Fashioned', price: '12,00 €' },
                  { name: 'Gin Tonic', description: 'Wechselnde Gin-Auswahl', price: '10,50 €' },
                  { name: 'Alkoholfreier Cocktail', description: 'Tageswechselnd', price: '7,50 €' },
                ],
              },
              {
                title: 'Wein & Bier',
                items: [
                  { name: 'Prosecco (0,1l)', price: '4,50 €' },
                  { name: 'Weißwein (0,2l)', description: 'Wechselnde Auswahl', price: '5,50 €' },
                  { name: 'Rotwein (0,2l)', description: 'Wechselnde Auswahl', price: '5,50 €' },
                  { name: 'Craft Bier (0,33l)', description: 'Von lokalen Brauereien', price: '4,80 €' },
                ],
              },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-menu-food', type: 'foodMenu',
          data: {
            headline: 'Essen',
            subline: 'Frühstück bis 14 Uhr · Snacks ganztags · warme Küche bis 21 Uhr',
            items: [
              { name: 'Avocado Toast', description: 'Sourdough, pochiertes Ei, Chili, Microgreens', price: '11,90 €', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80' },
              { name: 'Granola Bowl', description: 'Joghurt, Granola, frische Früchte, Honig', price: '9,50 €', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80' },
              { name: 'Eggs Benedict', description: 'Pochierte Eier, Hollandaise, Schinken, English Muffin', price: '13,90 €', image: 'https://images.unsplash.com/photo-1608039829572-9b1234ef1406?w=500&q=80' },
              { name: 'Buddha Bowl', description: 'Quinoa, Avocado, Edamame, Sesam-Dressing', price: '14,50 €', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
              { name: 'Flammkuchen', description: 'Crème fraîche, Speck, Zwiebeln', price: '10,90 €', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
              { name: 'Tartines', description: 'Belegtes Sauerteigbrot, tageswechselnd', price: '8,90 €', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80' },
            ],
          },
        },
      ],
    },
    {
      slug: 'events',
      title: 'Events',
      sections: [
        {
          ...HERO, id: 'cf-events-hero', type: 'hero',
          data: {
            headline: 'Events & Programm',
            subline: 'Live-Musik, Tastings, Quiz-Nights und mehr.',
            bgImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 'cf-events', type: 'cafeEventCalendar',
          data: {
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
          },
        },
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        {
          ...HERO, id: 'cf-about-hero', type: 'hero',
          data: {
            headline: 'Unsere Story',
            subline: 'Von der Idee zum Lieblingsort.',
            bgImage: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=80',
          },
        },
        {
          ...SECTION, id: 'cf-about-text', type: 'textImage',
          data: {
            headline: 'Mehr als nur Kaffee',
            text: 'Das Röstwerk entstand 2019 aus der Leidenschaft für perfekten Kaffee und dem Wunsch nach einem Ort, der tagsüber produktiv macht und abends zusammenbringt. Wir rösten unsere Bohnen selbst — kleine Chargen, direkt gehandelt, mit Fokus auf Geschmack statt Masse.\n\nAb 18 Uhr verwandelt sich das Röstwerk in eine entspannte Bar mit handgemachten Cocktails, Naturweinen und DJs am Wochenende. Weil wir finden: guter Geschmack kennt keine Uhrzeit.',
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...SECTION, id: 'cf-about-team', type: 'team',
          data: {
            headline: 'Das Team',
            subline: 'Die Menschen hinter dem Tresen — mit Leidenschaft für Kaffee, gutes Essen und lange Abende.',
            members: [
              { name: 'Max Röstner', role: 'Gründer & Head Barista', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: 'SCA-zertifiziert, 10 Jahre Erfahrung. Hat die eigene Röstung aufgebaut und reist jedes Jahr zu den Plantagen.' },
              { name: 'Lena Kaffee', role: 'Bar-Managerin & Mixologin', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: 'Entwickelt unsere saisonale Cocktailkarte und hat die Espresso-Martini-Rezeptur perfektioniert.' },
              { name: 'Tom Brauer', role: 'Küche & Patisserie', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Gelernt im Tantris, dann Streetfood in Melbourne. Jetzt macht er die besten Sandwiches der Stadt.' },
              { name: 'Mia Chen', role: 'Barista & Latte-Art-Champion', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', bio: 'München Latte Art Champion 2024. Ihre Rosetta hat es auf Instagram viral geschafft.' },
              { name: 'Jonas Feld', role: 'Röstmeister', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', bio: 'Unsere Bohnen werden von Jonas in Kleinchargen im Hinterhof geröstet — jeden Dienstag frisch.' },
            ],
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'cf-contact-hero', type: 'hero',
          data: {
            headline: 'Besuch uns',
            subline: 'Fragen, Reservierungen oder Event-Anfragen? Wir freuen uns auf dich.',
            bgImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600&q=80',
            primaryCta: { label: 'Route planen', href: 'https://maps.google.com/?q=Wörthstraße+23+München' },
          },
        },
        {
          ...SECTION, id: 'cf-hours', type: 'openingHours',
          data: {
            headline: 'Öffnungszeiten',
            subline: 'Café tagsüber, Bar am Abend',
            hours: [
              { days: 'Montag – Freitag', time: '7:30 – 23:00' },
              { days: 'Samstag', time: '9:00 – 01:00' },
              { days: 'Sonntag', time: '9:00 – 22:00' },
            ],
            note: 'Bar & Cocktails täglich ab 18 Uhr · Küche bis 21:30',
          },
        },
        {
          ...SECTION, id: 'cf-contact', type: 'contact',
          data: {
            headline: 'Schreib uns',
            subline: 'Für Reservierungen (Brunch & Events) am besten per Mail.',
            phone: '+49 89 2345 6789',
            email: 'hello@roestwerk-muenchen.de',
            address: 'Wörthstraße 23, 81667 München-Haidhausen',
            mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.5!2d11.59!3d48.13',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com/roestwerk_muc', label: '@roestwerk_muc' },
              { platform: 'Facebook', url: 'https://facebook.com/roestwerk', label: 'Röstwerk München' },
            ],
          },
        },
        {
          ...SECTION, id: 'cf-contact-cta', type: 'ctaBand',
          data: {
            headline: 'Event bei uns feiern?',
            text: 'Wir vermieten den Raum für private Events — Geburtstage, Firmen-Offsite oder Barista-Workshops. Sonntags ab 22 Uhr oder montags ganztags.',
            ctaLabel: 'Anfrage senden',
            ctaHref: 'mailto:events@roestwerk-muenchen.de',
          },
        },
        {
          ...SECTION, id: 'cf-faq', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            items: [
              { question: 'Kann man bei euch reservieren?', answer: 'Für das Brunch-Buffet am Samstag empfehlen wir eine Reservierung per E-Mail. Unter der Woche gilt: first come, first served.' },
              { question: 'Habt ihr WLAN?', answer: 'Klar! Frag an der Bar nach dem aktuellen Passwort. Wir haben auch Steckdosen an fast jedem Tisch.' },
              { question: 'Sind Hunde erlaubt?', answer: 'Ja! Wasser steht bereit. Wir bitten nur darum, dass es bei einem Hund pro Tisch bleibt.' },
              { question: 'Gibt es vegane Optionen?', answer: 'Etwa die Hälfte unserer Speisen ist vegan oder kann vegan zubereitet werden. Hafermilch und andere Pflanzendrinks berechnen wir nicht extra.' },
              { question: 'Kann man den Raum für private Events mieten?', answer: 'Ja, sonntags ab 22 Uhr oder montags ganztags. Schreib uns für ein individuelles Angebot.' },
              { question: 'Woher kommen eure Bohnen?', answer: 'Wir importieren direkt von Farmen in Äthiopien, Kolumbien und Guatemala. Jonas röstet jede Woche frisch in unserer Mikrorösterei im Hinterhof.' },
            ],
          },
        },
      ],
    },
  ],
};
