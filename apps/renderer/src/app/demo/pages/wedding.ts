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
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            venue: 'Schloss Ehrenfels, Rheingau',
            subline: 'Wir heiraten!',
            bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
            showCountdown: true,
          },
        },
        {
          ...B, id: 'w-story', type: 'coupleStory',
          data: {
            badge: 'Unsere Geschichte',
            headline: 'Wie alles begann',
            story: 'Es war ein regnerischer Novemberabend 2019 in einer kleinen Bar in München. Anna suchte Schutz vor dem Regen, Max bestellte gerade seinen zweiten Espresso Martini. Ein verschüttetes Getränk, eine Serviette und ein Lächeln später war klar: Das hier ist der Beginn von etwas Besonderem.',
            image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
            milestones: [
              { date: 'November 2019', text: 'Erstes Date in München' },
              { date: 'März 2020', text: 'Zusammengezogen (perfektes Lockdown-Timing)' },
              { date: 'Sommer 2022', text: 'Roadtrip durch Portugal' },
              { date: 'Dezember 2025', text: 'Der Antrag auf dem Christkindlmarkt' },
              { date: 'September 2026', text: 'Der große Tag! 🎉' },
            ],
          },
        },
        {
          ...B, id: 'w-schedule', type: 'eventSchedule',
          data: {
            badge: 'Tagesablauf',
            headline: 'Unser Tag',
            events: [
              { time: '13:30', title: 'Empfang', description: 'Sektempfang im Schlossgarten', icon: 'heart', location: 'Schlossgarten' },
              { time: '14:00', title: 'Trauung', description: 'Freie Trauung unter der alten Eiche', icon: 'heart', location: 'Schlossparkwiese' },
              { time: '15:30', title: 'Kaffee & Kuchen', description: 'Kuchenbuffet und Hochzeitstorte', icon: 'utensils', location: 'Orangerie' },
              { time: '17:00', title: 'Paarshooting', description: 'Wir sind kurz weg – genießt die Musik!', icon: 'camera', location: 'Weinberge' },
              { time: '18:30', title: 'Dinner', description: '4-Gänge-Menü', icon: 'utensils', location: 'Großer Saal' },
              { time: '21:00', title: 'Eröffnungstanz & Party', description: 'Tanzt mit uns in die Nacht', icon: 'music', location: 'Festsaal' },
            ],
          },
        },
        {
          ...B, id: 'w-venue', type: 'venueInfo',
          data: {
            badge: 'Location',
            headline: 'Schloss Ehrenfels',
            subline: 'Ein traumhafter Ort für unseren besonderen Tag',
            description: 'Das Schloss liegt inmitten der Weinberge des Rheingaus mit atemberaubendem Blick auf den Rhein. Die historischen Räumlichkeiten und der weitläufige Schlosspark bieten den perfekten Rahmen für unsere Feier.',
            image: 'https://images.unsplash.com/photo-1464808322410-1a934aab61e5?w=800&q=80',
            address: 'Schloss Ehrenfels, Schlossweg 5, 65346 Eltville am Rhein',
            mapUrl: 'https://maps.google.com/?q=Schloss+Ehrenfels+Rheingau',
          },
        },
        {
          ...B, id: 'w-dresscode', type: 'dresscode',
          data: {
            badge: 'Dresscode',
            headline: 'Was ziehe ich an?',
            text: 'Wir freuen uns über festliche Garderobe in gedeckten, warmen Tönen. Bitte beachtet, dass die Trauung im Freien stattfindet – bringt ggf. etwas zum Überwerfen mit.',
            colors: ['#2C3E50', '#8E6F47', '#D4A574', '#F5E6D3', '#748C70'],
            hints: ['Festlich / Semi-formal', 'Gedeckte, warme Farbtöne', 'Kein reines Weiß oder Schwarz', 'Bequeme Schuhe für den Garten'],
          },
        },
        {
          ...B, id: 'w-rsvp', type: 'rsvp',
          data: {
            badge: 'RSVP',
            headline: 'Sagt uns Bescheid!',
            subline: 'Wir freuen uns auf eure Rückmeldung.',
            deadline: '2026-07-15',
          },
        },
      ],
    },
    {
      slug: 'anreise',
      title: 'Anreise & Unterkunft',
      sections: [
        {
          ...HERO, id: 'w-travel-hero', type: 'hero',
          data: {
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            subline: 'Anreise & Unterkunft',
            bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
            showCountdown: false,
          },
        },
        {
          ...B, id: 'w-travel', type: 'travelInfo',
          data: {
            badge: 'Anreise',
            headline: 'So kommt ihr zu uns',
            subline: 'Egal ob mit Auto, Bahn oder Flugzeug – wir haben alles für euch zusammengestellt.',
            directions: [
              { icon: 'car', title: 'Mit dem Auto', text: 'A66 Richtung Wiesbaden, Ausfahrt Eltville. Parkplätze am Schloss vorhanden.' },
              { icon: 'train', title: 'Mit der Bahn', text: 'IC bis Wiesbaden Hbf, dann RB25 bis Eltville (15 Min). Shuttle ab Bahnhof.' },
              { icon: 'plane', title: 'Mit dem Flugzeug', text: 'Flughafen Frankfurt (FRA), 45 Min mit dem Auto oder der Bahn.' },
            ],
            accommodations: [
              { name: 'Hotel Kronenschlösschen', description: '5 Min entfernt, Abrufkontingent unter "Hochzeit Anna & Max"', link: 'https://example.com', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' },
              { name: 'Weingut Zum Krug', description: 'Charmante Zimmer im Weingut, 10 Min Fußweg', link: 'https://example.com', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
              { name: 'Ferienwohnungen Rheingau', description: 'Für Familien und längere Aufenthalte', link: 'https://example.com', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80' },
            ],
          },
        },
      ],
    },
    {
      slug: 'menue',
      title: 'Menü',
      sections: [
        {
          ...HERO, id: 'w-menu-hero', type: 'hero',
          data: {
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            subline: 'Unser Hochzeitsmenü',
            bgImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
            showCountdown: false,
          },
        },
        {
          ...B, id: 'w-menu', type: 'weddingMenu',
          data: {
            badge: 'Menü',
            headline: 'Unser 4-Gänge-Menü',
            courses: [
              { title: 'Amuse Bouche', items: [{ name: 'Trüffel-Crème-Brûlée', description: 'Mit Parmesan-Chip und Microgreens' }] },
              { title: 'Vorspeise', items: [{ name: 'Wildkräutersalat', description: 'Mit karamellisiertem Ziegenkäse und Walnuss-Vinaigrette' }, { name: 'Kürbissuppe', description: 'Mit Ingwerschaum und Kürbiskernöl', tags: ['Vegan'] }] },
              { title: 'Hauptgang', items: [{ name: 'Rosa gebratenes Rinderfilet', description: 'Mit Trüffeljus, Süßkartoffelpüree und glasiertem Wurzelgemüse' }, { name: 'Safran-Risotto', description: 'Mit gegrilltem Spargel und Parmesan', tags: ['Vegetarisch'] }] },
              { title: 'Dessert', items: [{ name: 'Schokoladen-Fondant', description: 'Mit Himbeersorbet und frischen Beeren' }, { name: 'Panna Cotta', description: 'Mit Passionsfrucht und Kokos', tags: ['Vegetarisch'] }] },
            ],
            note: 'Allergien und Unverträglichkeiten bitte im RSVP-Formular angeben.',
          },
        },
      ],
    },
    {
      slug: 'team',
      title: 'Brautpaar & Trauzeugen',
      sections: [
        {
          ...HERO, id: 'w-team-hero', type: 'hero',
          data: {
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            subline: 'Unsere Crew',
            bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=85',
            showCountdown: false,
          },
        },
        {
          ...B, id: 'w-party', type: 'weddingParty',
          data: {
            badge: 'Unsere Crew',
            headline: 'Trauzeugen & Begleitung',
            members: [
              { name: 'Lisa Bergmann', role: 'Trauzeugin (Anna)', text: 'Beste Freundin seit dem Studium – hält die Rede, die alle zum Weinen bringt.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
              { name: 'Tobias Schulz', role: 'Trauzeuge (Max)', text: 'Bruder und bester Freund. Organisiert den Junggesellenabschied.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
              { name: 'Sophie & Klara', role: 'Blumenmädchen', text: 'Unsere Nichten (5 & 7) streuen die Blumen.', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&q=80' },
              { name: 'Ralf Meier', role: 'Zeremonienmeister', text: 'Hält den Laden zusammen und sorgt für den reibungslosen Ablauf.' },
            ],
          },
        },
      ],
    },
    {
      slug: 'geschenke',
      title: 'Geschenke',
      sections: [
        {
          ...HERO, id: 'w-gifts-hero', type: 'hero',
          data: {
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            subline: 'Geschenkideen',
            bgImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1800&q=85',
            showCountdown: false,
          },
        },
        {
          ...B, id: 'w-gifts', type: 'giftRegistry',
          data: {
            badge: 'Geschenke',
            headline: 'Das schönste Geschenk ist eure Anwesenheit',
            subline: 'Falls ihr uns trotzdem etwas schenken möchtet…',
            text: 'Wir wünschen uns keine klassische Geschenkliste. Stattdessen freuen wir uns über einen Beitrag zu unseren Flitterwochen oder etwas für unser neues Zuhause.',
            items: [
              { title: 'Flitterwochen-Kasse', description: '2 Wochen Japan stehen auf dem Plan 🇯🇵' },
              { title: 'Küchenmaschine', description: 'Für gemeinsame Koch-Abende', link: 'https://example.com' },
              { title: 'Beistelltisch', description: 'Unser Wohnzimmer ist fast fertig', link: 'https://example.com' },
              { title: 'Spende an die Tafel', description: 'Wer lieber Gutes tun möchte', link: 'https://example.com' },
            ],
            bankDetails: {
              holder: 'Anna Bergmann & Maximilian Schulz',
              iban: 'DE89 3704 0044 0532 0130 00',
              bic: 'COBADEFFXXX',
              note: 'Verwendungszweck: Hochzeitsgeschenk',
            },
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
            names: 'Anna & Maximilian',
            date: '2026-09-12',
            subline: 'Häufige Fragen',
            bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=85',
            showCountdown: false,
          },
        },
        {
          ...B, id: 'w-faq', type: 'faq',
          data: {
            badge: 'FAQ',
            headline: 'Häufige Fragen',
            items: [
              { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Bitte haltet euch an die namentliche Einladung. Bei Fragen meldet euch gerne direkt bei uns.' },
              { question: 'Darf ich Fotos machen?', answer: 'Während der Trauung bitten wir euch, die Handys wegzulegen (Unplugged Ceremony). Danach gerne drauflosknipsen!' },
              { question: 'Gibt es einen Shuttle-Service?', answer: 'Ja! Shuttles fahren ab Eltville Bahnhof um 13:00 und 13:15. Rückfahrten ab 0:00 und 2:00 Uhr.' },
              { question: 'Sind Kinder willkommen?', answer: 'Ja, es gibt eine Kinderbetreuung ab 14:00 Uhr im Nebenraum mit Spielen und Bastelstation.' },
              { question: 'Was ist bei Regen?', answer: 'Kein Problem – die Trauung findet dann im verglasten Wintergarten statt. Ebenso schön!' },
              { question: 'Wo kann ich parken?', answer: 'Direkt am Schloss gibt es 80 kostenfreie Parkplätze.' },
            ],
          },
        },
      ],
    },
  ],
};
