import type { DemoSite } from './types';
import { B, HERO } from './types';

export const tourismSite: DemoSite = {
  industry: 'tourism',
  industryKey: 'tourism',
  defaultStyle: 'classic',
  pages: [
    // ─── HOME ───────────────────────────────────────────────────────────
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'tr-home-hero', type: 'hero',
          data: {
            headline: 'Tiroler Bergwelt',
            subline: 'Natur erleben, Berge entdecken. Kirchberg in Tirol.',
            bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
            trustItems: [
              '300+ km Wanderwege',
              '170 km Pisten',
              'Ganzjahres-Destination',
            ],
            seasonLabel: 'Sommer & Winter',
            locationLabel: 'Kirchberg / Kitzbühel, Tirol',
            primaryCta: { label: 'Erlebnisse entdecken', href: '/demo/tourism/erlebnisse' },
            secondaryCta: { label: 'Reise planen', href: '/demo/tourism/planung' },
          },
        },
        {
          ...B, id: 'tr-home-highlights', type: 'destinationHighlights',
          data: {
            title: 'Highlights der Region',
            text: 'Entdecken Sie die schönsten Orte rund um Kirchberg und Kitzbühel.',
            highlights: [
              {
                title: 'Kitzbüheler Horn (1996 m)',
                text: 'Der Hausberg von Kitzbühel bietet ein 360-Grad-Panorama über die Tiroler Alpen. Im Sommer Wanderparadies, im Winter Skigebiet.',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
                category: 'Bergerlebnis',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Schwarzsee Naturbad',
                text: 'Einer der wärmsten Badeseen Tirols, eingebettet in eine idyllische Moorlandschaft. Perfekt für Familien und Naturliebhaber.',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80',
                category: 'Natur & Wasser',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Brixental Tal-Panorama',
                text: 'Das malerische Brixental verbindet Kirchberg mit Westendorf und Brixen. Sanfte Almwiesen, traditionelle Bauernhöfe und weitläufige Radwege.',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80',
                category: 'Tal & Panorama',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Gaisberg Almwanderung',
                text: 'Eine der beliebtesten Wanderungen der Region führt über saftige Almwiesen zu urigen Hütten mit hausgemachten Tiroler Spezialitäten.',
                image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
                category: 'Wandern & Almen',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/erlebnisse' },
              },
            ],
          },
        },
        {
          ...B, id: 'tr-home-seasons', type: 'seasonTeaser',
          data: {
            title: 'Jede Jahreszeit ein Erlebnis',
            text: 'Kirchberg begeistert das ganze Jahr — von der Skipiste bis zum Bergsee.',
            seasons: [
              {
                title: 'Winter — November bis April',
                text: 'Erstklassiges Skifahren im Skigebiet Kitzbühel-Kirchberg, romantische Winterwanderungen durch verschneite Wälder und bestens gespurte Langlaufloipen.',
                image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=900&q=80',
                activities: ['Ski & Snowboard', 'Langlauf', 'Winterwandern', 'Rodeln'],
                periodLabel: 'November – April',
                cta: { label: 'Wintererlebnisse', href: '/demo/tourism/erlebnisse' },
              },
              {
                title: 'Sommer — Mai bis Oktober',
                text: 'über 300 Kilometer markierte Wanderwege, kristallklare Bergseen und ein weitläufiges E-Bike-Netz machen den Sommer unvergesslich.',
                image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80',
                activities: ['Wandern', 'Mountainbiken', 'Schwimmen', 'Klettern'],
                periodLabel: 'Mai – Oktober',
                cta: { label: 'Sommererlebnisse', href: '/demo/tourism/erlebnisse' },
              },
            ],
          },
        },
        {
          ...B, id: 'tr-home-events', type: 'eventsCalendar',
          data: {
            title: 'Veranstaltungen & Highlights',
            text: 'Tradition und Brauchtum erleben — das ganze Jahr über.',
            events: [
              {
                title: 'Hahnenkammrennen',
                text: 'Das legendäre Ski-Abfahrtsrennen auf der Streif in Kitzbühel — eines der prestigeträchtigsten Sportevents der Welt.',
                image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80',
                dateLabel: '23. – 26. Januar 2026',
                timeLabel: 'Ganztägig',
                locationLabel: 'Hahnenkamm, Kitzbühel',
                category: 'Sport',
                priceLabel: 'Tribüne ab 85 €, Stehplatz frei',
                cta: { label: 'Zum Event', href: '/demo/tourism/erlebnisse' },
              },
              {
                title: 'Almabtrieb Kirchberg',
                text: 'Festlich geschmückte Kühe kehren von den Almen ins Tal zurück — begleitet von Musik, MarktStänden und Tiroler Schmankerln.',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
                dateLabel: '19. September 2026',
                timeLabel: '10:00 – 18:00 Uhr',
                locationLabel: 'Ortszentrum Kirchberg',
                category: 'Tradition',
                priceLabel: 'Eintritt frei',
                cta: { label: 'Zum Event', href: '/demo/tourism/erlebnisse' },
              },
              {
                title: 'Kirchberger Advent',
                text: 'Stimmungsvoller Adventmarkt im Dorfzentrum mit handgemachtem Kunsthandwerk, Glühwein und besinnlicher Atmosphäre.',
                image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=900&q=80',
                dateLabel: '4. – 24. Dezember 2026',
                timeLabel: 'Fr–So, 15:00 – 21:00 Uhr',
                locationLabel: 'Dorfplatz Kirchberg',
                category: 'Advent & Brauchtum',
                priceLabel: 'Eintritt frei',
                cta: { label: 'Zum Event', href: '/demo/tourism/erlebnisse' },
              },
            ],
          },
        },
      ],
    },

    // ─── ERLEBNISSE ─────────────────────────────────────────────────────
    {
      slug: 'erlebnisse',
      title: 'Erlebnisse & Touren',
      sections: [
        {
          ...HERO, id: 'tr-exp-hero', type: 'hero',
          data: {
            headline: 'Erlebnisse & Touren',
            subline: 'Abenteuer zwischen Gipfeln und Tälern — für jedes Level und jede Jahreszeit.',
            bgImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1800&q=85',
            primaryCta: { label: 'Alle Erlebnisse', href: '#tr-exp-grid' },
            secondaryCta: { label: 'Touren ansehen', href: '#tr-exp-routes' },
          },
        },
        {
          ...B, id: 'tr-exp-grid', type: 'experienceGrid',
          data: {
            title: 'Unsere Top-Erlebnisse',
            text: 'Handverlesene Aktivitäten für unvergessliche Momente in der Tiroler Bergwelt.',
            items: [
              {
                title: 'Sonnenaufgangs-Wanderung',
                text: 'Erleben Sie den magischen Sonnenaufgang am Kitzbüheler Horn. Frühmorgens starten, oben ankommen und den Moment Genießen, wenn die ersten Strahlen die Gipfel berühren.',
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
                durationLabel: 'ca. 4 Stunden',
                audienceLabel: 'Erwachsene & Jugendliche',
                difficultyLabel: 'Mittel',
                priceLabel: 'geführte Tour ab 35 €/Person',
                cta: { label: 'Tour buchen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'E-Bike Almenrunde',
                text: 'Auf zwei Rädern von Alm zu Alm — vorbei an blühenden Wiesen, urigen Hütten und atemberaubenden Aussichtspunkten. E-Bikes vor Ort Verfügbar.',
                image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=900&q=80',
                durationLabel: 'ca. 3–4 Stunden',
                audienceLabel: 'Familien & Paare',
                difficultyLabel: 'Leicht',
                priceLabel: 'E-Bike Verleih ab 45 €/Tag',
                cta: { label: 'Jetzt reservieren', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Klettersteig für Einsteiger',
                text: 'Sicher am Fels unterwegs: Unser Einsteiger-Klettersteig bietet Nervenkitzel mit professioneller Begleitung und bester Aussicht.',
                image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=900&q=80',
                durationLabel: 'ca. 3 Stunden',
                audienceLabel: 'Einsteiger ab 14 Jahren',
                difficultyLabel: 'Leicht bis Mittel',
                priceLabel: 'geführte Tour ab 55 €/Person',
                cta: { label: 'Tour buchen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Wildwasser Rafting',
                text: 'Rasante Fahrt auf der Tiroler Ache — Adrenalin pur inmitten spektakulärer Schluchten. Neoprenanzug und Ausrüstung inklusive.',
                image: 'https://images.unsplash.com/photo-1530866828091-5e11e0bcbf5e?w=900&q=80',
                durationLabel: 'ca. 2,5 Stunden',
                audienceLabel: 'Abenteurer ab 12 Jahren',
                difficultyLabel: 'Mittel',
                priceLabel: 'Ab 65 €/Person',
                cta: { label: 'Jetzt buchen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Paragliding Tandemflug',
                text: 'Schweben Sie über das Brixental und Genießen Sie die Vogelperspektive auf die Tiroler Alpen. Keine Vorkenntnisse nötig.',
                image: 'https://images.unsplash.com/photo-1503220317033-d4b4bf8e2cc8?w=900&q=80',
                durationLabel: 'ca. 15–20 Minuten Flug',
                audienceLabel: 'Alle ab 16 Jahren',
                difficultyLabel: 'Keine Vorkenntnisse nötig',
                priceLabel: 'Ab 130 €/Person',
                cta: { label: 'Flug buchen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Schneeschuh-Tour',
                text: 'Abseits der Pisten durch unberührte Winterlandschaften stapfen. Stille Genießen, Tierspuren entdecken und die Magie des Winters spüren.',
                image: 'https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=900&q=80',
                durationLabel: 'ca. 3 Stunden',
                audienceLabel: 'Familien & Naturliebhaber',
                difficultyLabel: 'Leicht',
                priceLabel: 'geführte Tour ab 30 €/Person',
                cta: { label: 'Tour buchen', href: '/demo/tourism/kontakt' },
              },
            ],
          },
        },
        {
          ...B, id: 'tr-exp-routes', type: 'tourRoutes',
          data: {
            title: 'Beliebte Touren & Wege',
            text: 'Gut markierte Routen für Wanderer und Radfahrer aller könnerstufen.',
            routes: [
              {
                title: 'Panoramaweg Kitzbüheler Horn',
                text: 'Der Klassiker unter den Wanderungen — vom Tal hinauf zum Gipfel mit grandiosem Rundblick auf über 60 Dreitausender.',
                image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
                lengthLabel: '14 km',
                durationLabel: 'ca. 5 Stunden',
                difficultyLabel: 'Mittel',
                startLabel: 'Talstation Hornbahn, Kitzbühel',
                highlights: ['360-Grad-Gipfelpanorama', 'Alpenblumengarten', 'Einkehr Hornköpfl-Huette', 'Gipfelkreuz 1996 m'],
                cta: { label: 'Route ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Brixental Radweg',
                text: 'Gemütliche Radtour entlang des Flusses durch das Brixental. Flache Strecke, ideal für Familien und Genussradler.',
                image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=900&q=80',
                lengthLabel: '28 km',
                durationLabel: 'ca. 3 Stunden',
                difficultyLabel: 'Leicht',
                startLabel: 'Bahnhof Kirchberg',
                highlights: ['Flussbegleitender Weg', 'Bademöglichkeit Schwarzsee', 'Einkehr Gasthof Brixental', 'Kinderspielplätze am Weg'],
                cta: { label: 'Route ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Almen-Rundweg',
                text: 'Von Alm zu Alm wandern und die Tiroler Almkultur hautnah erleben. Käsereien, Almtiere und hausgemachte Jause.',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
                lengthLabel: '9 km',
                durationLabel: 'ca. 3,5 Stunden',
                difficultyLabel: 'Leicht',
                startLabel: 'Bergstation Fleckalmbahn',
                highlights: ['3 bewirtschaftete Almen', 'Sennerei-Besichtigung', 'Panoramablick Brixental'],
                cta: { label: 'Route ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Gipfeltour Hahnenkamm',
                text: 'Anspruchsvolle Tour auf den legendären Hahnenkamm. Im Winter Rennstrecke, im Sommer Wandergebiet mit grandioser Aussicht.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
                lengthLabel: '12 km',
                durationLabel: 'ca. 6 Stunden',
                difficultyLabel: 'Schwer',
                startLabel: 'Hahnenkamm-Bergbahn Talstation',
                highlights: ['Streif-Starthaus', 'EhrenbachHöhe', 'Seidlalmsee', 'Alpenpanorama Wilder Kaiser'],
                cta: { label: 'Route ansehen', href: '/demo/tourism/kontakt' },
              },
            ],
          },
        },
      ],
    },

    // ─── ORTE ───────────────────────────────────────────────────────────
    {
      slug: 'orte',
      title: 'Orte & Sehenswertes',
      sections: [
        {
          ...HERO, id: 'tr-places-hero', type: 'hero',
          data: {
            headline: 'Orte & Sehenswertes',
            subline: 'Charmante Dörfer, historische Stätten und Naturwunder in und um Kirchberg.',
            bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&q=85',
            primaryCta: { label: 'Orte entdecken', href: '#tr-places-map' },
            secondaryCta: { label: 'Sehenswürdigkeiten', href: '#tr-places-sights' },
          },
        },
        {
          ...B, id: 'tr-places-map', type: 'placesMap',
          data: {
            title: 'Unsere Region auf einen Blick',
            text: 'Die schönsten Orte rund um Kirchberg in Tirol — alle auf der Karte.',
            mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43548.1!2d12.31!3d47.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4776a1b8c5d1e7d1%3A0x1!2sKirchberg+in+Tirol!5e0!3m2!1sde!2sat',
            places: [
              {
                title: 'Kirchberg Zentrum',
                text: 'Gemütliches Dorfzentrum mit FussGängerzone, Cafes, Restaurants und traditionellen Geschäften. Ausgangspunkt für viele Wanderungen.',
                image: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=900&q=80',
                distanceLabel: 'Zentrum',
                address: 'HauptStraße, 6365 Kirchberg in Tirol',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
              {
                title: 'Kitzbühel Altstadt',
                text: 'Die mittelalterliche Altstadt von Kitzbühel mit bunten Fassaden, exklusiven Boutiquen und erstklassiger Gastronomie.',
                image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80',
                distanceLabel: '6 km von Kirchberg',
                address: 'Vorderstadt, 6370 Kitzbühel',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
              {
                title: 'Schwarzsee',
                text: 'Idyllischer Moorsee mit Strandbad, Liegewiesen und Bootsverleih. Im Sommer bis 25 Grad Wassertemperatur.',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80',
                distanceLabel: '4 km von Kirchberg',
                address: 'Schwarzsee, 6370 Kitzbühel',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
              {
                title: 'Aschauer Klamm',
                text: 'spektakuläre Schlucht mit tosenden Wasserfällen und gut gesicherten Steigen. Ein Naturerlebnis für die ganze Familie.',
                image: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba1ae3?w=900&q=80',
                distanceLabel: '8 km von Kirchberg',
                address: 'Aschau, 6365 Kirchberg in Tirol',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
              {
                title: 'Spertentaler Wasserfälle',
                text: 'Beeindruckende Wasserfall-Kaskaden im Spertental. Der Wanderweg führt direkt an den tosenden Felsen vorbei.',
                image: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba1ae3?w=900&q=80',
                distanceLabel: '10 km von Kirchberg',
                address: 'Spertental, 6365 Kirchberg in Tirol',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
              {
                title: 'Hahnenkamm-Bergbahn',
                text: 'Die legendäre Bergbahn bringt Sie hinauf auf den Hahnenkamm — Startpunkt für Wanderungen und im Winter Zugang zur Streif.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
                distanceLabel: '7 km von Kirchberg',
                address: 'HahnenkammStraße, 6370 Kitzbühel',
                cta: { label: 'Details ansehen', href: '/demo/tourism/orte' },
              },
            ],
          },
        },
        {
          ...B, id: 'tr-places-sights', type: 'sightseeingList',
          data: {
            title: 'Sehenswürdigkeiten',
            text: 'Kultur, Geschichte und Architektur in der Region Kitzbühel.',
            sights: [
              {
                title: 'Museum Kitzbühel',
                text: 'Stadtgeschichte, Wintersport-Legenden und zeitgenössische Kunst vereint in einem historischen Gebäude im Herzen der Altstadt.',
                image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=900&q=80',
                openingText: 'Di–So, 10:00–17:00 Uhr',
                category: 'Museum & Kultur',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Pfarrkirche Kirchberg',
                text: 'Barocke Dorfkirche aus dem 15. Jahrhundert mit prachtvollen Fresken und einem weithin sichtbaren Kirchturm.',
                image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=900&q=80',
                openingText: 'Täglich geöffnet',
                category: 'Kirche & Architektur',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Schloss Lebenberg',
                text: 'Imposantes Schloss oberhalb von Kitzbühel mit bewegter Geschichte. Heute als Hotel genutzt, Parkanlage frei zugänglich.',
                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
                openingText: 'Park Täglich zugänglich',
                category: 'Schloss & Geschichte',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Auracher Löchl',
                text: 'Historisches Gasthaus aus dem 14. Jahrhundert in der Kitzbüheler Altstadt — eines der Ältesten Wirtshäuser Tirols.',
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
                openingText: 'Di–So, 11:00–23:00 Uhr',
                category: 'Gasthaus & Tradition',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/orte' },
              },
              {
                title: 'Jochberger Wildalm',
                text: 'Hochgelegene Alm mit traditioneller Käseerzeugung und weitem Blick über das Jochberger Tal. Nur zu Fuss erreichbar.',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
                openingText: 'Juni – September, Täglich',
                category: 'Alm & Genuss',
                cta: { label: 'Mehr erfahren', href: '/demo/tourism/erlebnisse' },
              },
            ],
          },
        },
      ],
    },

    // ─── PLANUNG ────────────────────────────────────────────────────────
    {
      slug: 'planung',
      title: 'Reiseplanung',
      sections: [
        {
          ...HERO, id: 'tr-plan-hero', type: 'hero',
          data: {
            headline: 'Reiseplanung',
            subline: 'Alles für Ihren perfekten Aufenthalt in Kirchberg und der Region Kitzbühel.',
            bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1800&q=85',
            primaryCta: { label: 'Unterkünfte ansehen', href: '#tr-plan-accommodation' },
            secondaryCta: { label: 'Downloads', href: '#tr-plan-downloads' },
          },
        },
        {
          ...B, id: 'tr-plan-info', type: 'visitorInfo',
          data: {
            title: 'Gut zu wissen',
            text: 'Praktische Informationen für Ihren Aufenthalt in der Region.',
            infoBlocks: [
              {
                title: 'Anreise & Mobilität',
                text: 'Kirchberg ist per Bahn (Bahnhof Kirchberg), Auto (A12 Inntalautobahn, Ausfahrt Wörgl) oder Flugzeug (Flughafen Innsbruck 80 km, Salzburg 90 km) erreichbar. Vor Ort verkehren kostenlose Skibusse und Wanderbusse.',
                icon: 'transport',
              },
              {
                title: 'Wetter & beste Reisezeit',
                text: 'Sommer (Juni–September): 18–28 °C, ideal für Wandern und Baden. Winter (Dezember–März): -5 bis 5 °C, beste Schneeverhältnisse. Frühling und Herbst bieten ruhigere Tage und besonderes Licht.',
                icon: 'weather',
              },
              {
                title: 'Gästekarte & Vorteile',
                text: 'Mit der Kirchberg Card erhalten Sie kostenlosen Eintritt ins Schwimmbad, freie Nutzung der Wanderbusse, Ermäßigungen bei Bergbahnen und viele weitere Vorteile. erhältlich ab der ersten Übernachtung.',
                icon: 'card',
              },
              {
                title: 'Barrierefreiheit',
                text: 'Viele Wanderwege, Bergbahnen und Unterkünfte sind barrierefrei zugänglich. Das Tourismus-Büro berät gerne individuell zu barrierefreien Angeboten.',
                icon: 'accessibility',
              },
            ],
          },
        },
        {
          ...B, id: 'tr-plan-accommodation', type: 'accommodationGrid',
          data: {
            title: 'Unterkünfte für jeden Geschmack',
            text: 'Von Gemütlich bis luxuriös — finden Sie Ihre ideale Unterkunft.',
            accommodations: [
              {
                title: 'Hotel 4-Sterne',
                text: 'Komfortable Hotels mit Wellness-Bereich, Halbpension und bester Lage nahe Bergbahnen und Ortszentrum.',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
                typeLabel: 'Hotel',
                priceLabel: 'ab 120 €/Nacht',
                amenities: ['Wellness & Spa', 'Halbpension', 'Skiroom', 'Parkplatz'],
                cta: { label: 'Hotels ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Ferienwohnung',
                text: 'Gemütliche Apartments mit Küche, Balkon und viel Platz — ideal für Familien und Längere Aufenthalte.',
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
                typeLabel: 'Ferienwohnung',
                priceLabel: 'ab 80 €/Nacht',
                amenities: ['Eigene Küche', 'Balkon/Terrasse', 'WLAN', 'Waschmaschine'],
                cta: { label: 'Wohnungen ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Pension & B&B',
                text: 'persönliche Gastfreundschaft und reichhaltiges Frühstück in familiengeführten Pensionen.',
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80',
                typeLabel: 'Pension',
                priceLabel: 'ab 60 €/Nacht',
                amenities: ['Frühstück inklusive', 'Familienbetrieb', 'Garten', 'WLAN'],
                cta: { label: 'Pensionen ansehen', href: '/demo/tourism/kontakt' },
              },
              {
                title: 'Bauernhof & Almhütte',
                text: 'Urlaub am Bauernhof oder in einer urigen Almhütte — Natur pur, Tiere erleben und Tiroler Landleben Genießen.',
                image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&q=80',
                typeLabel: 'Bauernhof / Almhütte',
                priceLabel: 'ab 90 €/Nacht',
                amenities: ['Natur & Tiere', 'Hofeigene Produkte', 'Spielplatz', 'Ruhige Lage'],
                cta: { label: 'Höfe ansehen', href: '/demo/tourism/kontakt' },
              },
            ],
          },
        },
        {
          ...B, id: 'tr-plan-downloads', type: 'downloadGuides',
          data: {
            title: 'Downloads & Broschüren',
            text: 'Praktische Karten und Pläne für unterwegs — kostenlos herunterladen.',
            downloads: [
              {
                title: 'Wanderkarte Sommer',
                text: 'Detaillierte Wanderkarte mit allen markierten Wegen, Hütten und Gipfeln der Region Kirchberg-Kitzbühel.',
                formatLabel: 'PDF, 8 MB',
                cta: { label: 'Herunterladen', href: '/demo/tourism/planung' },
              },
              {
                title: 'Pistenplan Winter',
                text: 'Übersichtlicher Pistenplan des Skigebiets Kitzbühel-Kirchberg mit allen Liften und Pisten.',
                formatLabel: 'PDF, 5 MB',
                cta: { label: 'Herunterladen', href: '/demo/tourism/planung' },
              },
              {
                title: 'Eventkalender 2026',
                text: 'Alle Veranstaltungen, Feste und Highlights des Jahres 2026 auf einen Blick.',
                formatLabel: 'PDF, 3 MB',
                cta: { label: 'Herunterladen', href: '/demo/tourism/planung' },
              },
            ],
          },
        },
      ],
    },

    // ─── GALERIE ────────────────────────────────────────────────────────
    {
      slug: 'galerie',
      title: 'Galerie',
      sections: [
        {
          ...HERO, id: 'tr-gallery-hero', type: 'hero',
          data: {
            headline: 'Galerie',
            subline: 'Impressionen aus der Tiroler Bergwelt — Berge, Seen, Winter und charmante Orte.',
            bgImage: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1800&q=85',
            primaryCta: { label: 'Bilder ansehen', href: '#tr-gallery-images' },
          },
        },
        {
          ...B, id: 'tr-gallery-images', type: 'gallery',
          data: {
            title: 'Bildergalerie',
            text: 'Lassen Sie sich inspirieren von der Schönheit unserer Region.',
            images: [
              { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', alt: 'Alpenpanorama bei Sonnenaufgang', category: 'Berge' },
              { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', alt: 'Kitzbüheler Horn im Frühling', category: 'Berge' },
              { src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=900&q=80', alt: 'Gipfelkreuz im Morgenlicht', category: 'Berge' },
              { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80', alt: 'Schwarzsee mit Bergkulisse', category: 'Seen' },
              { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80', alt: 'Bergsee im Brixental', category: 'Seen' },
              { src: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba1ae3?w=900&q=80', alt: 'Wasserfall im Spertental', category: 'Seen' },
              { src: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=900&q=80', alt: 'Verschneite Pisten Kirchberg', category: 'Winter' },
              { src: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=900&q=80', alt: 'Hahnenkammrennen Atmosphäre', category: 'Winter' },
              { src: 'https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=900&q=80', alt: 'Schneeschuhwandern im Wald', category: 'Winter' },
              { src: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=900&q=80', alt: 'Kirchberg Ortszentrum', category: 'Orte' },
              { src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80', alt: 'Kitzbühel Altstadt', category: 'Orte' },
              { src: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=900&q=80', alt: 'Adventmarkt Kirchberg', category: 'Orte' },
            ],
          },
        },
      ],
    },

    // ─── KONTAKT ────────────────────────────────────────────────────────
    {
      slug: 'kontakt',
      title: 'Kontakt & Info',
      sections: [
        {
          ...HERO, id: 'tr-contact-hero', type: 'hero',
          data: {
            headline: 'Kontakt & Info',
            subline: 'Wir sind für Sie da — persönlich, telefonisch oder per E-Mail.',
            bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&q=85',
            primaryCta: { label: 'Kontakt aufnehmen', href: '#tr-contact-form' },
            secondaryCta: { label: 'Häufige Fragen', href: '#tr-contact-faq' },
          },
        },
        {
          ...B, id: 'tr-contact-form', type: 'tourismContact',
          data: {
            title: 'TourismusBüro Kirchberg',
            text: 'Haben Sie Fragen zu Ihrem Aufenthalt? Unser Team berät Sie gerne.',
            form: {
              fields: [
                { name: 'name', label: 'Ihr Name', type: 'text', required: true },
                { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true },
                { name: 'phone', label: 'Telefonnummer', type: 'tel', required: false },
                { name: 'arrivalDate', label: 'Anreisedatum', type: 'date', required: false },
                { name: 'guests', label: 'Anzahl Gäste', type: 'number', required: false },
                { name: 'subject', label: 'Betreff', type: 'select', required: true, options: ['Allgemeine Anfrage', 'Unterkunft', 'Aktivitäten & Touren', 'Veranstaltungen', 'Gruppenanfrage'] },
                { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
              ],
            },
            infoCards: [
              { icon: 'phone', label: 'Telefon', value: '+43 5357 2309', text: 'Mo–Fr 08:00–18:00, Sa 09:00–12:00' },
              { icon: 'email', label: 'E-Mail', value: 'info@kirchberg-tirol.at', text: 'Antwort innerhalb von 24 Stunden' },
              { icon: 'location', label: 'Adresse', value: 'HauptStraße 8, 6365 Kirchberg in Tirol', text: 'TourismusBüro im Ortszentrum' },
            ],
            primaryCta: { label: 'Nachricht senden', href: '/demo/tourism/kontakt' },
            secondaryCta: { label: 'Anrufen', href: 'tel:+4353572309' },
          },
        },
        {
          ...B, id: 'tr-contact-faq', type: 'faq',
          data: {
            title: 'Häufig gestellte Fragen',
            text: 'Antworten auf die wichtigsten Fragen rund um Ihren Aufenthalt.',
            items: [
              {
                question: 'Wie reise ich am besten nach Kirchberg an?',
                answer: 'Per Bahn bis Bahnhof Kirchberg in Tirol oder per Auto über die A12 Inntalautobahn (Ausfahrt Wörgl-Ost). Die Nächsten Flughäfen sind Innsbruck (80 km) und Salzburg (90 km). Transfer-Shuttles sind buchbar.',
              },
              {
                question: 'Was ist die Gästekarte und wo bekomme ich sie?',
                answer: 'Die Kirchberg Card erhalten Sie kostenlos bei Ihrer Unterkunft ab der ersten Übernachtung. Sie bietet freien Eintritt ins Schwimmbad, kostenlose Busfahrten und Ermäßigungen bei Bergbahnen und Ausflugszielen.',
              },
              {
                question: 'Kann man mit Kindern gut wandern?',
                answer: 'Ja, die Region bietet zahlreiche familienfreundliche Wanderwege. Der Almen-Rundweg und der Brixental Radweg sind besonders geeignet. Viele Wege sind auch kinderwagentauglich.',
              },
              {
                question: 'Welchen Skipass brauche ich?',
                answer: 'Der Skipass Kitzbühel-Kirchberg gilt für das gesamte Skigebiet mit über 170 km Pisten. Tages-, Mehrtages- und Saisonkarten sind Verfügbar. Kinder bis 6 Jahre fahren kostenlos.',
              },
              {
                question: 'Sind Hunde in der Region willkommen?',
                answer: 'Ja, viele Unterkünfte und Restaurants sind hundefreundlich. Auf Wanderwegen gilt Leinenpflicht in der Nähe von Almtieren. Das Tourismus-Büro hat eine Liste hundefreundlicher Betriebe.',
              },
              {
                question: 'Wie ist das Wetter in Kirchberg?',
                answer: 'Im Sommer liegen die Temperaturen zwischen 18 und 28 °C, im Winter zwischen -5 und 5 °C. Die beste Wanderzeit ist Juni bis September, die Skisaison dauert von Dezember bis April. Aktuelle Wetterdaten finden Sie auf unserer Website.',
              },
            ],
          },
        },
      ],
    },
  ],
};
