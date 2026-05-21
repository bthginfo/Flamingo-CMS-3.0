import type { DemoSite } from './types';
import { B, HERO } from './types';

export const weddingSite: DemoSite = {
  industry: 'wedding',
  industryKey: 'wedding',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'w-hero', type: 'hero',
          data: {
            coupleName: 'Anna & Maximilian',
            headline: 'Anna & Maximilian',
            subline: 'Wir heiraten am 12. September 2026 auf Schloss Ambras in Innsbruck.',
            date: '2026-09-12',
            venue: 'Schloss Ambras, Innsbruck',
            tagline: 'Wir heiraten!',
            bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
            overlayColor: '#000000',
            overlayOpacity: '0.35',
            primaryCta: { label: 'Jetzt zusagen', href: '/demo/wedding/rsvp' },
            secondaryCta: { label: 'Unsere Geschichte', href: '/demo/wedding/unsere-geschichte' },
          },
        },
        {
          ...B, id: 'w-usp', type: 'uspStrip',
          data: {
            items: [
              { icon: 'calendar', title: '12. September 2026', text: 'Samstag, ab 14 Uhr' },
              { icon: 'mapPin', title: 'Schloss Ambras', text: 'Innsbruck, Tirol' },
              { icon: 'heart', title: '8 Jahre zusammen', text: 'Endlich wird geheiratet!' },
              { icon: 'users', title: 'Platz für 120 Gäste', text: 'Und ihr seid eingeladen!' },
            ],
          },
        },
        {
          ...B, id: 'w-story', type: 'coupleStory',
          data: {
            headline: 'Unsere Geschichte',
            subline: 'Wie alles begann...',
            milestones: [
              { year: '2018', title: 'Das erste Treffen', text: 'Auf einer Geburtstagsfeier im Sommer trafen sich unsere Blicke zum ersten Mal.', image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80' },
              { year: '2019', title: 'Erster gemeinsamer Urlaub', text: 'Zwei Wochen in Portugal — zwischen Surfbrettern und Sonnenuntergängen.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
              { year: '2022', title: 'Zusammengezogen', text: 'Unsere erste gemeinsame Wohnung in Innsbruck.', image: '' },
              { year: '2025', title: 'Der Antrag', text: 'Am Hafelekar, bei Sonnenuntergang, mit dem schönsten Ja der Welt.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80' },
              { year: '2026', title: 'Die Hochzeit', text: 'Und jetzt feiern wir — mit euch!', image: '' },
            ],
          },
        },
        {
          ...B, id: 'w-schedule', type: 'eventSchedule',
          data: {
            headline: 'Unser Tag',
            subline: 'So haben wir uns den Ablauf vorgestellt',
            events: [
              { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der Schlosskapelle', icon: 'Church', location: 'Schlosskapelle' },
              { time: '15:00', title: 'Sektempfang', description: 'Stoßt mit uns im Schlossgarten an!', icon: 'Wine', location: 'Schlossgarten' },
              { time: '16:00', title: 'Gruppenfotos', description: 'Erinnerungen für die Ewigkeit', icon: 'Camera', location: 'Schlossterrasse' },
              { time: '18:00', title: 'Dinner', description: '4-Gänge-Menü im Spanischen Saal', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
              { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar', icon: 'Music', location: 'Festsaal' },
              { time: '21:30', title: 'Party!', description: 'DJ, Photobooth & Mitternachtssnack', icon: 'PartyPopper', location: 'Festsaal' },
            ],
          },
        },
        {
          ...B, id: 'w-cta', type: 'ctaBand',
          data: {
            headline: 'Seid ihr dabei?',
            subline: 'Bitte gebt uns bis zum 1. Juli 2026 Bescheid!',
            badgeText: 'RSVP',
            ctaPrimary: { label: 'Jetzt zusagen', href: '/demo/wedding/rsvp' },
          },
        },
      ],
    },
    {
      slug: 'unsere-geschichte',
      title: 'Unsere Geschichte',
      sections: [
        {
          ...HERO, id: 'w-story-hero', type: 'hero',
          data: {
            headline: 'Unsere Geschichte',
            subline: '8 Jahre, 1.000 Abenteuer und bald das größte.',
            bgImage: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-story-full', type: 'coupleStory',
          data: {
            headline: 'Vom ersten Blick zum großen Tag',
            subline: 'Eine Liebesgeschichte in Kapiteln',
            milestones: [
              { year: 'Sommer 2018', title: 'Der Funke', text: 'Eine Geburtstagsfeier, ein verschütteter Negroni, ein Lächeln.', image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80' },
              { year: '2019', title: 'Portugal', text: 'Unser erster gemeinsamer Urlaub. Surfen, Sonnenuntergänge, Sehnsucht.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
              { year: '2020', title: 'Lockdown-Liebe', text: '47 Puzzle, 23 gemeinsam gekochte Rezepte und null Streit (na gut, fast).', image: '' },
              { year: '2022', title: 'Zusammenziehen', text: 'Innsbruck, Nordkette-Blick. Max hat den IKEA-Schrank gebaut (nur ein Stück übrig).', image: '' },
              { year: 'Dez 2025', title: 'Der Antrag', text: 'Am Hafelekar, 2.334 Meter hoch. Anna sagte Ja bevor die Frage fertig war.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80' },
            ],
          },
        },
        {
          ...B, id: 'w-schloss', type: 'textImage',
          data: {
            headline: 'Warum Schloss Ambras?',
            text: '<p>Als wir das erste Mal gemeinsam durch den Schlosspark spazierten, wussten wir: Hier wollen wir unseren großen Tag feiern. Die Mischung aus Geschichte, Natur und dem Blick auf die Berge — magisch.</p>',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...B, id: 'w-story-stats', type: 'socialProofBar',
          data: {
            items: [
              { value: '8', label: 'Jahre zusammen' },
              { value: '12', label: 'Länder bereist' },
              { value: '1', label: 'Antrag auf 2.334m' },
              { value: '∞', label: 'Gemeinsame Abenteuer' },
            ],
          },
        },
        {
          ...B, id: 'w-story-cta', type: 'ctaBand',
          data: {
            headline: 'Feiert mit uns!',
            subline: 'Am 12. September 2026 auf Schloss Ambras.',
            ctaPrimary: { label: 'Zur RSVP', href: '/demo/wedding/rsvp' },
          },
        },
      ],
    },
    {
      slug: 'location',
      title: 'Location & Anreise',
      sections: [
        {
          ...HERO, id: 'w-loc-hero', type: 'hero',
          data: {
            headline: 'Location & Anreise',
            subline: 'Schloss Ambras — ein märchenhafter Ort.',
            bgImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
          },
        },
        {
          ...B, id: 'w-venue', type: 'venueInfo',
          data: {
            headline: 'Schloss Ambras',
            subline: 'Eines der schönsten Renaissance-Schlösser Österreichs',
            venues: [{
              name: 'Schloss Ambras',
              image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
              address: 'Schlossstraße 20, 6020 Innsbruck',
              description: 'Trauung in der Schlosskapelle, Sektempfang im Schlossgarten, Dinner im Spanischen Saal.',
              parkingInfo: 'Kostenfreie Parkplätze am Schloss.',
            }],
          },
        },
        {
          ...B, id: 'w-travel', type: 'travelInfo',
          data: {
            headline: 'So kommt ihr zu uns',
            subline: 'Innsbruck ist bestens erreichbar.',
            sections: [
              { title: 'Auto', icon: 'Car', content: 'A13 Inntal-Autobahn, Ausfahrt Innsbruck-Ost → Schloss Ambras.' },
              { title: 'Bahn', icon: 'Train', content: 'Innsbruck Hbf → Bus J (10 Min) oder Taxi (8 Min, ~12 €).' },
              { title: 'Flugzeug', icon: 'Plane', content: 'Flughafen Innsbruck (10 Min Taxi) oder München (2h Zug).' },
            ],
            hotels: [
              { name: 'Hotel Grauer Bär ⭐⭐⭐⭐', distance: '3 km', specialRate: 'Stichwort „Hochzeit Anna & Max"' },
              { name: 'STAGE 12 ⭐⭐⭐⭐', distance: '4 km', specialRate: 'Code ANNAMAX2026 → 15%' },
              { name: 'Nala Individuell Hotel ⭐⭐⭐⭐', distance: '3.5 km', specialRate: '' },
            ],
          },
        },
        {
          ...B, id: 'w-loc-shuttle', type: 'richText',
          data: {
            headline: '🚌 Shuttle-Service',
            text: '<p>Wir organisieren einen kostenlosen Pendelbus zwischen den Hotels und dem Schloss:</p><ul><li><strong>Hinfahrt:</strong> Ab 16:30 Uhr, alle 30 Min.</li><li><strong>Rückfahrt:</strong> Stündlich 22:00–02:00 Uhr.</li></ul><p>Haltestellen: Hotel Grauer Bär → STAGE 12 → Nala → Schloss Ambras</p><p>Wer später bleiben möchte: Taxi-Nummern liegen am Empfang aus.</p>',
          },
        },
        {
          ...B, id: 'w-loc-faq', type: 'faq',
          data: {
            headline: 'Fragen zur Anreise',
            items: [
              { question: 'Wo kann ich parken?', answer: 'Kostenfreie Parkplätze direkt am Schloss (ca. 80 Plätze). Bitte folgt der Beschilderung.' },
              { question: 'Kann ich ein Taxi bestellen?', answer: 'Ja — Taxi Innsbruck: +43 512 5311. Oder nutzt den kostenlosen Shuttle.' },
              { question: 'Gibt es eine Ladestation für E-Autos?', answer: 'Ja, 2 Ladestationen (Typ 2, 22 kW) auf dem Schlossparkplatz.' },
            ],
          },
        },
      ],
    },
    {
      slug: 'ablauf',
      title: 'Ablauf & Menü',
      sections: [
        {
          ...HERO, id: 'w-abl-hero', type: 'hero',
          data: {
            headline: 'Ablauf & Menü',
            subline: 'Was euch am 12. September erwartet.',
            bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-schedule-full', type: 'eventSchedule',
          data: {
            headline: 'Der Tagesablauf',
            subline: 'Von der Trauung bis zum letzten Tanz',
            events: [
              { time: '13:30', title: 'Ankunft', description: 'Willkommensdrink im Schlossgarten.', icon: 'Users', location: 'Schlosseingang' },
              { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der Schlosskapelle.', icon: 'Church', location: 'Schlosskapelle' },
              { time: '15:00', title: 'Sektempfang', description: 'Champagner, Häppchen und Live-Akustik-Duo.', icon: 'Wine', location: 'Schlossgarten' },
              { time: '16:00', title: 'Gruppenfotos & Spiele', description: 'Erinnerungsfotos. Danach: Krocket & Boccia im Park.', icon: 'Camera', location: 'Park' },
              { time: '18:00', title: 'Dinner', description: '4-Gänge-Menü im Spanischen Saal.', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
              { time: '21:00', title: 'Eröffnungstanz', description: 'Erster Tanz als Ehepaar.', icon: 'Music', location: 'Festsaal' },
              { time: '21:30', title: 'Party!', description: 'DJ, Photobooth & Mitternachtssnack.', icon: 'PartyPopper', location: 'Festsaal' },
            ],
          },
        },
        {
          ...B, id: 'w-menu', type: 'weddingMenu',
          data: {
            headline: 'Unser Hochzeitsmenü',
            subline: 'Kreiert von Küchenchef Martin Riedl.',
            note: 'Allergien bitte bei der RSVP angeben.',
            courses: [
              { title: 'Amuse-Bouche', items: [{ name: 'Tiroler Bergkäse-Praline', description: 'mit Walnuss-Feigen-Chutney' }] },
              { title: 'Vorspeise', items: [{ name: 'Rote-Bete-Carpaccio', description: 'mit Ziegenkäse & Honig-Senf' }, { name: 'Kürbiscreme-Suppe', description: 'mit Kürbiskernöl' }] },
              { title: 'Hauptgang', items: [{ name: 'Rinderfilet', description: 'mit Trüffel-Jus & Süßkartoffelpüree' }, { name: 'Safran-Risotto (veg.)', description: 'mit gegrilltem Gemüse' }] },
              { title: 'Dessert', items: [{ name: 'Hochzeitstorte', description: 'Vanille, Himbeere, Schokolade' }, { name: 'Dessert-Buffet', description: 'Panna Cotta, Macarons, Früchte' }] },
            ],
          },
        },
        {
          ...B, id: 'w-dresscode', type: 'dresscode',
          data: {
            headline: 'Dresscode',
            description: 'Festlich & elegant in gedeckten Farben — gemütlich genug zum Tanzen!',
            colors: ['#2c3e50', '#8e6f47', '#c9b99a', '#6b8e6b', '#f4ece1'],
            dos: ['Anzug oder Cocktailkleid', 'Gedeckte Erdtöne', 'Bequeme Tanzschuhe'],
            donts: ['Weiß / Creme', 'Jeans oder Sneaker'],
            note: 'Abends kann es draußen kühl werden — packt gerne einen Schal ein.',
          },
        },
      ],
    },
    {
      slug: 'trauzeugen',
      title: 'Trauzeugen',
      sections: [
        {
          ...HERO, id: 'w-team-hero', type: 'hero',
          data: {
            headline: 'Unser Team',
            subline: 'Die wichtigsten Menschen an unserer Seite.',
            bgImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-party', type: 'weddingParty',
          data: {
            headline: 'Unsere Trauzeugen & Brautjungfern',
            subline: 'Ohne sie wären wir aufgeschmissen.',
            members: [
              { name: 'Lisa Berger', role: 'Trauzeugin', relationship: 'Beste Freundin seit Uni', text: 'Bei jedem Abenteuer dabei.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
              { name: 'Thomas Hofer', role: 'Trauzeuge', relationship: 'Großer Bruder', text: 'Immer an Max\' Seite.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
              { name: 'Sophie Auer', role: 'Brautjungfer', relationship: 'Schwester der Braut', text: 'Die Organisatorin im Hintergrund.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
              { name: 'David Keller', role: 'Groomsman', relationship: 'Schulfreund', text: 'Seit der 5. Klasse unzertrennlich.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
            ],
          },
        },
        {
          ...B, id: 'w-team-text', type: 'richText',
          data: {
            headline: 'Ansprechpartner am großen Tag',
            text: '<p>Falls ihr Fragen habt oder am Hochzeitstag Hilfe braucht, wendet euch an unsere Trauzeugen:</p><p><strong>Lisa:</strong> +43 650 123 4567 (Alles rund um die Braut)<br/><strong>Thomas:</strong> +43 660 987 6543 (Überraschungen & Logistik)</p>',
          },
        },
        {
          ...B, id: 'w-team-cta', type: 'ctaBand',
          data: {
            headline: 'Noch nicht zugesagt?',
            subline: 'Wir freuen uns auf eure RSVP!',
            ctaPrimary: { label: 'Jetzt zusagen', href: '/demo/wedding/rsvp' },
          },
        },
      ],
    },
    {
      slug: 'geschenke',
      title: 'Geschenke',
      sections: [
        {
          ...HERO, id: 'w-gift-hero', type: 'hero',
          data: {
            headline: 'Geschenkewünsche',
            subline: 'Eure Anwesenheit ist unser größtes Geschenk!',
            bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-gifts', type: 'giftRegistry',
          data: {
            headline: 'Für die Flitterwochen',
            subline: 'Wir sparen für Japan!',
            freeText: 'Über einen Beitrag zur Reisekasse freuen wir uns riesig.',
            gifts: [
              { name: '🍣 Sushi-Kurs in Kyoto', price: '80 €', description: 'Gemeinsam lernen wir die Kunst des Sushi.' },
              { name: '🏯 Nacht im Ryokan', price: '150 €', description: 'Tatami, Onsen und Kaiseki-Dinner.' },
              { name: '🚅 Shinkansen-Ticket', price: '120 €', description: 'Tokyo → Kyoto in 2:15h.' },
            ],
            bankInfo: { holder: 'Anna Berger & Maximilian Hofer', iban: 'AT12 3456 7890 1234 5678', bic: 'BKAUATWW', note: 'Verwendungszweck: Hochzeitsgeschenk' },
          },
        },
        {
          ...B, id: 'w-gifts-text', type: 'textImage',
          data: {
            headline: 'Unser Japan-Abenteuer',
            text: '<p>Nach der Hochzeit geht es für 3 Wochen nach Japan: Tokio, Kyoto, Osaka und Hakone. Wir träumen von Tempeln, Onsen, Ramen und dem Blick auf den Fuji.</p><p>Jeder Beitrag hilft uns, diesen Traum wahr werden zu lassen. Wir sind schon wahnsinnig aufgeregt!</p>',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
          },
        },
        {
          ...B, id: 'w-gifts-faq', type: 'faq',
          data: {
            headline: 'Fragen zu Geschenken',
            items: [
              { question: 'Muss ich etwas schenken?', answer: 'Nein! Eure Anwesenheit ist uns das Wichtigste. Wer mag, kann zur Reisekasse beitragen.' },
              { question: 'Kann ich auch nach der Hochzeit überweisen?', answer: 'Klar, das Konto läuft nicht weg. 😊' },
            ],
          },
        },
      ],
    },
    {
      slug: 'rsvp',
      title: 'RSVP',
      sections: [
        {
          ...HERO, id: 'w-rsvp-hero', type: 'hero',
          data: {
            headline: 'Seid ihr dabei?',
            subline: 'Gebt uns bis zum 1. Juli 2026 Bescheid.',
            bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-rsvp', type: 'rsvp',
          data: {
            headline: 'Zusage',
            subline: 'Wir können es kaum erwarten!',
            deadline: '2026-07-01',
            maxGuests: 4,
            showSongWish: true,
            showDietary: true,
            showAllergies: true,
          },
        },
        {
          ...B, id: 'w-rsvp-info', type: 'richText',
          data: {
            headline: 'Wichtige Infos zur Zusage',
            text: '<p><strong>Deadline:</strong> Bitte bis spätestens 1. Juli 2026 zusagen.</p><p><strong>Plus-One:</strong> Wenn auf eurer Einladung ein +1 steht, gebt den Namen bitte im Formular an.</p><p><strong>Kinder:</strong> Herzlich willkommen! Bitte separat anmelden für die Kinderbetreeung.</p><p><strong>Vegetarisch/Vegan:</strong> Bitte bei den Ernährungswünschen angeben — die Küche kann alles!</p>',
          },
        },
        {
          ...B, id: 'w-rsvp-faq', type: 'faq',
          data: {
            headline: 'RSVP-Fragen',
            items: [
              { question: 'Ich kann doch nicht kommen — was tun?', answer: 'Sag uns bitte so früh wie möglich Bescheid. Formular nochmal ausfüllen oder kurze Nachricht an Lisa.' },
              { question: 'Kann ich später noch Gäste hinzufügen?', answer: 'Bitte meldet euch bis 1. Juli — danach sind die Plätze fix vergeben.' },
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
          ...HERO, id: 'w-faq-hero', type: 'hero',
          data: {
            headline: 'Häufige Fragen',
            subline: 'Alles was ihr wissen müsst.',
            bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=85',
          },
        },
        {
          ...B, id: 'w-faq', type: 'faq',
          data: {
            headline: 'FAQ',
            badgeText: 'Häufige Fragen',
            items: [
              { question: 'Gibt es einen Shuttle-Service?', answer: 'Ja! Stündlich zwischen Hotels und Schloss (17–02 Uhr).' },
              { question: 'Dürfen wir Kinder mitbringen?', answer: 'Ja! Spielbereich mit Betreuung ab 18 Uhr.' },
              { question: 'Vegetarisch/vegan?', answer: 'Bitte bei der RSVP angeben — die Küche ist flexibel.' },
              { question: 'Bis wann geht die Feier?', answer: 'Bis 03:00 Uhr. Shuttle bis 02:00, danach Taxis.' },
              { question: 'Fotos während der Trauung?', answer: 'Unplugged Ceremony bitte. Danach: drauflos knipsen!' },
              { question: 'Was bei Regen?', answer: 'Sektempfang im Arkadenhof mit Glasdach — genauso romantisch.' },
              { question: 'Songwunsch?', answer: 'Bei der RSVP eintragen! (Außer Macarena.)' },
              { question: 'Dresscode?', answer: 'Festlich in Erdtönen. Kein Weiß. Details unter Ablauf.' },
              { question: 'Überraschung geplant?', answer: 'Bitte bei Trauzeugin Lisa melden.' },
              { question: 'WLAN?', answer: 'Ja, im Festsaal. Aber tanzen > scrollen.' },
            ],
          },
        },
        {
          ...B, id: 'w-faq-contact', type: 'richText',
          data: {
            headline: 'Noch Fragen?',
            text: '<p>Ihr erreicht uns jederzeit per Nachricht oder Anruf:</p><p><strong>Anna:</strong> +43 650 234 5678<br/><strong>Max:</strong> +43 660 876 5432</p><p>Oder schreibt uns auf WhatsApp — wir antworten schnell! 💌</p>',
          },
        },
        {
          ...B, id: 'w-faq-cta', type: 'ctaBand',
          data: {
            headline: 'Bereit für den 12. September?',
            subline: 'Wir können es kaum erwarten, mit euch zu feiern!',
            ctaPrimary: { label: 'Jetzt zusagen', href: '/demo/wedding/rsvp' },
          },
        },
      ],
    },
  ],
};
