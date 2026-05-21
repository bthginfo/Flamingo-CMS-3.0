import type { DemoSite } from './types';
import { B, HERO } from './types';

export const hotelSite: DemoSite = {
  industry: 'hotel',
  industryKey: 'hotel',
  defaultStyle: 'classic',
  pages: [
    // ─── 1. HOME ───────────────────────────────────────────────
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-home-hero',
          data: {
            headline: 'Hotel Alpenblick – Ihr Rückzugsort in den Tiroler Alpen',
            subline:
              'Erleben Sie alpinen Luxus auf 1.200 Metern Höhe. Unser 4-Sterne-Boutique-Hotel in Kitzbühel vereint traditionelle Gastfreundschaft mit modernem Komfort – umgeben von der atemberaubenden Kulisse der Kitzbüheler Alpen.',
            badgeText: '4-Sterne Superior',
            bgImage:
              'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85',
            ratingText: '4.9 / 5 – über 1.200 Gästebewertungen',
            availabilityHint: 'Noch wenige Zimmer frei für die Wintersaison',
            trustItems: [
              'Gratis Stornierung bis 48h vorher',
              'Bester-Preis-Garantie',
              'Direkt buchen & sparen',
            ],
            primaryCta: { label: 'Zimmer entdecken', href: '/demo/hotel/zimmer' },
            secondaryCta: { label: 'Verfügbarkeit prüfen', href: '#booking' },
          },
        },
        {
          ...B, type: 'bookingStrip', id: 'ht-home-booking',
          data: {
            headline: 'Verfügbarkeit prüfen',
            badgeText: 'Direkt buchen',
            arrivalLabel: 'Anreise',
            departureLabel: 'Abreise',
            guestsLabel: 'Gäste',
            roomLabel: 'Zimmertyp',
            submitCta: { label: 'Verfügbarkeit prüfen', href: '/demo/hotel/zimmer' },
            secondaryCta: { label: 'Oder telefonisch: +43 5356 123 456', href: 'tel:+4353561234560' },
            bookingNote: 'Bestpreis-Garantie bei Direktbuchung',
          },
        },
        {
          ...B, type: 'roomShowcase', id: 'ht-home-rooms',
          data: {
            headline: 'Unsere beliebtesten Zimmer',
            subline: 'Wählen Sie Ihren persönlichen Rückzugsort',
            rooms: [
              {
                name: 'Superior Doppelzimmer',
                description:
                  'Gemütliches Ambiente mit Blick auf die Kitzbüheler Bergwelt. Hochwertige Materialien und alpiner Stil schaffen eine Atmosphäre zum Wohlfühlen.',
                image:
                  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80',
                priceLabel: 'ab 189 € / Nacht',
                sizeLabel: '32 m²',
                detailCta: { label: 'Details ansehen', href: '/demo/hotel/zimmer#superior' },
              },
              {
                name: 'Junior Suite Alpenblick',
                description:
                  'Großzügige Suite mit separatem Wohnbereich und Panoramabalkon. Der perfekte Ort für unvergessliche Augenblicke zu zweit.',
                image:
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
                priceLabel: 'ab 289 € / Nacht',
                sizeLabel: '48 m²',
                detailCta: { label: 'Details ansehen', href: '/demo/hotel/zimmer#junior-suite' },
              },
              {
                name: 'Panorama Suite',
                description:
                  'Unser Flaggschiff mit freistehender Badewanne, Kamin und 270-Grad-Bergpanorama. Purer Luxus auf höchstem Niveau.',
                image:
                  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
                priceLabel: 'ab 429 € / Nacht',
                sizeLabel: '72 m²',
                detailCta: { label: 'Details ansehen', href: '/demo/hotel/zimmer#panorama-suite' },
              },
            ],
            cta: { label: 'Alle Zimmer & Suiten ansehen', href: '/demo/hotel/zimmer' },
          },
        },
        {
          ...B, type: 'amenities', id: 'ht-home-amenities',
          data: {
            headline: 'Was uns auszeichnet',
            subline: 'Durchdachter Komfort für Ihren perfekten Aufenthalt',
            items: [
              {
                icon: 'wifi',
                title: 'Highspeed-WLAN',
                description: 'Kostenloses WLAN im gesamten Hotel – auch auf der Terrasse und im Spa-Bereich.',
              },
              {
                icon: 'spa',
                title: '800 m² Wellness & Spa',
                description: 'Infinity Pool, Saunalandschaft, Dampfbad und ein breites Angebot an Treatments.',
              },
              {
                icon: 'restaurant',
                title: 'Hauben-Restaurant',
                description: 'Regionale Küche mit alpinem Flair – ausgezeichnet mit 2 Gault-Millau-Hauben.',
              },
              {
                icon: 'shuttle',
                title: 'Gratis Ski-Shuttle',
                description: 'Direkter Shuttle zur Hahnenkamm-Gondel in nur 3 Minuten – Täglich von 8 bis 17 Uhr.',
              },
              {
                icon: 'charging',
                title: 'E-Ladestationen',
                description: '4 Tesla Supercharger und 6 Typ-2-Ladepunkte in unserer Tiefgarage.',
              },
              {
                icon: 'clock',
                title: 'Late Checkout',
                description: 'Genießen Sie Ihren Aufenthalt bis 14 Uhr – kostenlos für Direktbucher.',
              },
            ],
          },
        },
        {
          ...B, type: 'testimonials', id: 'ht-home-testimonials',
          data: {
            headline: 'Das sagen unsere Gäste',
            subline: 'über 1.200 verifizierte Bewertungen mit 4.9 / 5 Sternen',
            items: [
              {
                name: 'Dr. Markus & Petra Lechner',
                context: 'Romantik-Wochenende im Januar 2026',
                rating: 5,
                text: 'Ein absoluter Traumaufenthalt! Die Panorama Suite hat unsere Erwartungen Übertroffen – der Blick auf die verschneiten Gipfel beim Frühstück im Bett war unvergesslich. Das Spa ist hervorragend, besonders die Hot-Stone-Massage. Wir kommen definitiv wieder.',
              },
              {
                name: 'Familie Hofstetter',
                context: 'Familienurlaub im August 2025',
                rating: 5,
                text: 'Endlich ein Berghotel, das Familien wirklich willkommen heißt! Die Kinder waren vom Spielraum und dem Abenteuerprogramm begeistert, während wir die Ruhe am Pool Genießen konnten. Das Familienzimmer ist perfekt durchdacht. Top Service vom gesamten Team!',
              },
              {
                name: 'Christina Bauer',
                context: 'Geschäftsreise im März 2026',
                rating: 5,
                text: 'Ideal für unsere Firmenklausur. Der Boardroom Hahnenkamm war bestens ausgestattet, das Catering erstklassig. Nach dem Workshop konnten wir im Spa perfekt entspannen. Auch die Technik hat einwandfrei funktioniert. Absolut empfehlenswert für Business-Events.',
              },
            ],
          },
        },
        {
          ...B, type: 'statsCounter', id: 'ht-home-stats',
          data: {
            headline: 'Hotel Alpenblick in Zahlen',
            stats: [
              { value: 42, label: 'Zimmer & Suiten', icon: 'bed' },
              { value: 15, suffix: '+', label: 'Auszeichnungen', icon: 'award' },
              { value: 30, suffix: '+', label: 'Jahre Gastfreundschaft', icon: 'calendar' },
              { value: 1200, suffix: '+', label: 'Begeisterte Gäste', icon: 'users' },
            ],
          },
        },
        {
          ...B, type: 'logoMarquee', id: 'ht-home-logos',
          data: {
            headline: 'Ausgezeichnet & zertifiziert',
            logos: [
              { name: 'Superior Hotels', src: '/logos/superior.svg' },
              { name: 'Relais & Châteaux', src: '/logos/relais.svg' },
              { name: 'Gault Millau', src: '/logos/gault-millau.svg' },
              { name: 'Green Globe', src: '/logos/green-globe.svg' },
              { name: 'Booking.com Award', src: '/logos/booking-award.svg' },
            ],
          },
        },
      ],
    },

    // ─── 2. ZIMMER & SUITEN ────────────────────────────────────
    {
      slug: 'zimmer',
      title: 'Zimmer & Suiten',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-rooms-hero',
          data: {
            headline: 'Zimmer & Suiten – Alpiner Luxus zum Wohlfühlen',
            subline:
              'Von der Gemütlichen Doppelstube bis zur exklusiven Chalet Suite – jedes unserer 42 Zimmer verbindet Tiroler Handwerkskunst mit modernem Design. Wählen Sie Ihren persönlichen Lieblingsplatz.',
            badgeText: '42 Zimmer & Suiten',
            bgImage:
              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&q=85',
            primaryCta: { label: 'Direkt buchen', href: '#booking' },
          },
        },
        {
          ...B, type: 'roomShowcase', id: 'ht-rooms-showcase',
          data: {
            headline: 'Alle Zimmer & Suiten im Überblick',
            subline: 'Finden Sie den perfekten Raum für Ihren Aufenthalt',
            rooms: [
              {
                name: 'Superior Doppelzimmer',
                description:
                  'Unser Klassiker für Paare und Alleinreisende. Warme Holztöne, ein Großzügiges Boxspringbett und ein modernes Bad mit Regendusche laden zum Verweilen ein. Der Balkon bietet freien Blick auf die Kitzbüheler Bergwelt.',
                image:
                  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80',
                galleryImages: [
                  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80',
                  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&q=80',
                ],
                priceLabel: 'ab 189 € / Nacht',
                sizeLabel: '32 m²',
                occupancyLabel: 'max. 2 Personen',
                bedLabel: '1 King-Size Boxspringbett (180x200)',
                features: ['Balkon mit Bergblick', 'Regendusche', 'Nespresso-Maschine', 'Smart TV 55"', 'Minibar (gefüllt)'],
                detailCta: { label: 'Zimmerdetails', href: '/demo/hotel/zimmer#superior' },
                bookingCta: { label: 'Jetzt buchen', href: '#booking' },
                highlighted: false,
              },
              {
                name: 'Familienzimmer Bergblick',
                description:
                  'Ideal für Familien mit bis zu zwei Kindern. Der separate Schlafbereich mit Stockbett sorgt für Abenteuerfeeling, während die Eltern im Großzügigen Hauptraum entspannen. Inklusive Spielekiste und KinderAusstattung.',
                image:
                  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',
                galleryImages: [
                  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=900&q=80',
                  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80',
                ],
                priceLabel: 'ab 249 € / Nacht',
                sizeLabel: '45 m²',
                occupancyLabel: 'max. 4 Personen (2 Erw. + 2 Kinder)',
                bedLabel: '1 Doppelbett (180x200) + 1 Stockbett',
                features: ['Separater Kinderbereich', 'Spielekiste & Malbücher', 'Balkon mit Bergblick', 'Babybett auf Anfrage', 'Verdunkelungsvorhänge'],
                detailCta: { label: 'Zimmerdetails', href: '/demo/hotel/zimmer#familienzimmer' },
                bookingCta: { label: 'Jetzt buchen', href: '#booking' },
                highlighted: false,
              },
              {
                name: 'Junior Suite Alpenblick',
                description:
                  'Großzügig geschnittene Suite mit separatem Wohn- und Schlafbereich. Der offene Kamin und der Panoramabalkon machen die Junior Suite zum Lieblingsplatz für romantische Auszeiten. Handgefertigte Möbel aus heimischem Zirbenholz schaffen eine besondere Atmosphäre.',
                image:
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
                galleryImages: [
                  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80',
                  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80',
                ],
                priceLabel: 'ab 289 € / Nacht',
                sizeLabel: '48 m²',
                occupancyLabel: 'max. 2 Personen',
                bedLabel: '1 King-Size Zirbenholzbett (200x200)',
                features: ['Separater Wohnbereich', 'Offener Kamin', 'Panoramabalkon', 'Freistehende Badewanne', 'Bose Soundbar'],
                detailCta: { label: 'Zimmerdetails', href: '/demo/hotel/zimmer#junior-suite' },
                bookingCta: { label: 'Jetzt buchen', href: '#booking' },
                highlighted: true,
              },
              {
                name: 'Panorama Suite',
                description:
                  'Unser Flaggschiff mit atemberaubendem 270-Grad-Bergpanorama. Die freistehende Kupferbadewanne vor dem Fenster, der private Kamin und die handverlesene Kunstsammlung machen jeden Aufenthalt zu etwas Besonderem. Inklusive persönlichem Butler-Service.',
                image:
                  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
                galleryImages: [
                  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
                  'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=900&q=80',
                ],
                priceLabel: 'ab 429 € / Nacht',
                sizeLabel: '72 m²',
                occupancyLabel: 'max. 2 Personen',
                bedLabel: '1 Emperor-Bett (220x220)',
                features: ['270-Grad-Panorama', 'Freistehende Kupferbadewanne', 'Privater Butler-Service', 'Begehbarer Kleiderschrank', 'Dyson Airwrap & Supersonic'],
                detailCta: { label: 'Zimmerdetails', href: '/demo/hotel/zimmer#panorama-suite' },
                bookingCta: { label: 'Jetzt buchen', href: '#booking' },
                highlighted: false,
              },
              {
                name: 'Chalet Suite Deluxe',
                description:
                  'Das ultimative Alpen-Erlebnis auf 95 Quadratmetern. Ihre private Suite über zwei Ebenen mit eigener Sauna, Whirlpool auf der Dachterrasse und voll ausgestatteter Küche. Perfekt für Gäste, die höchsten Anspruch mit alpiner Geborgenheit verbinden möchten.',
                image:
                  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900&q=80',
                galleryImages: [
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
                  'https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=900&q=80',
                ],
                priceLabel: 'ab 599 € / Nacht',
                sizeLabel: '95 m²',
                occupancyLabel: 'max. 4 Personen',
                bedLabel: '1 King-Size Bett + ausziehbare Schlafcouch',
                features: ['Private Sauna', 'Whirlpool auf Dachterrasse', 'Voll ausgestattete Küche', 'Zwei Ebenen', 'Concierge 24/7'],
                detailCta: { label: 'Zimmerdetails', href: '/demo/hotel/zimmer#chalet-suite' },
                bookingCta: { label: 'Jetzt buchen', href: '#booking' },
                highlighted: false,
              },
            ],
          },
        },
        {
          ...B, type: 'offers', id: 'ht-rooms-offers',
          data: {
            headline: 'Unsere Packages & Angebote',
            subline: 'Mehr erleben, clever sparen – unsere saisonalen Arrangements',
            offers: [
              {
                title: 'Romantik-Wochenende',
                description:
                  'Zwei Nächte in der Junior Suite Alpenblick, Candle-Light-Dinner im Restaurant, Paarmassage im Spa und eine Flasche Tiroler Sekt bei Ankunft. Der perfekte Rahmen für unvergessliche Stunden zu zweit.',
                image:
                  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
                priceLabel: 'ab 749 € für 2 Nächte',
                durationLabel: '2 Nächte / 3 Tage',
                includes: [
                  '2 Nächte in der Junior Suite Alpenblick',
                  'Candle-Light-Dinner (4-Gänge-Menü)',
                  'Paarmassage "Alpine Romance" (60 Min.)',
                  '1 Flasche Tiroler Sekt & Pralinenschachtel',
                  'Später Checkout bis 14 Uhr',
                ],
                validUntilLabel: 'Gültig bis 30. Juni 2026',
                cta: { label: 'Romantik-Wochenende buchen', href: '#booking' },
              },
              {
                title: 'Ski & Relax',
                description:
                  'Drei Nächte inklusive 2-Tages-Skipass für die SkiWelt, täglichem Après-Ski-Snack an der Hotelbar und einer wohltuenden Sportmassage nach einem Tag auf der Piste. Skiraum und Shuttle inklusive.',
                image:
                  'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=900&q=80',
                priceLabel: 'ab 659 € für 3 Nächte',
                durationLabel: '3 Nächte / 4 Tage',
                includes: [
                  '3 Nächte im Superior Doppelzimmer',
                  '2-Tages-Skipass SkiWelt Wilder Kaiser',
                  'Sportmassage (45 Min.)',
                  'Täglicher Apres-Ski-Snack & Getränk',
                  'Gratis Ski-Shuttle & Skiraum',
                ],
                validUntilLabel: 'Gültig bis 15. April 2026',
                cta: { label: 'Ski & Relax buchen', href: '#booking' },
              },
              {
                title: 'Langzeit-Vorteil',
                description:
                  'Bleiben Sie Länger und sparen Sie: Ab 5 Nächten erhalten Sie 15 % Rabatt auf den Zimmerpreis, kostenlosen Upgrade (nach Verfügbarkeit) und eine Wellness-Behandlung Ihrer Wahl.',
                image:
                  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
                priceLabel: '15 % Rabatt ab 5 Nächten',
                durationLabel: 'ab 5 Nächte',
                includes: [
                  '15 % Rabatt auf den Zimmerpreis',
                  'Zimmer-Upgrade nach Verfügbarkeit',
                  '1 Wellness-Behandlung nach Wahl',
                  'Tägliches Frühstücksbuffet inklusive',
                  'Kostenloser Parkplatz',
                ],
                validUntilLabel: 'Ganzjährig Gültig',
                cta: { label: 'Langzeitaufenthalt anfragen', href: '/demo/hotel/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'testimonials', id: 'ht-rooms-testimonials',
          data: {
            headline: 'Was unsere Gäste über die Zimmer sagen',
            subline: 'Echte Erfahrungen aus verifizierten Aufenthalten',
            items: [
              {
                name: 'Anna & Stefan Gruber',
                context: 'Junior Suite, Februar 2026',
                rating: 5,
                text: 'Die Zirbenholzmöbel und der Kamin haben eine unglaublich warme Atmosphäre geschaffen. Wir haben uns vom ersten Moment an wie zu Hause gefühlt – nur viel luxuriöser.',
              },
              {
                name: 'Michael Brandstätter',
                context: 'Panorama Suite, Dezember 2025',
                rating: 5,
                text: 'Die freistehende Badewanne mit Blick auf die verschneiten Gipfel war das Highlight unseres Aufenthalts. Butler-Service auf höchstem Niveau – diskret und aufmerksam.',
              },
              {
                name: 'Familie Wieser',
                context: 'Familienzimmer, August 2025',
                rating: 5,
                text: 'Perfekt durchdacht für Familien! Die Kinder liebten das Stockbett und die Spielekiste. Endlich ein Hotel, in dem man sich mit Kindern wirklich willkommen fühlt.',
              },
            ],
          },
        },
        {
          ...B, type: 'richText', id: 'ht-rooms-amenities',
          data: {
            headline: 'Ausstattung & Annehmlichkeiten',
            body: '<p>Jedes Zimmer im Hotel Alpenblick ist mit hochwertigen Materialien und durchdachten Details ausgestattet. Genießen Sie:</p><ul><li><strong>Schlafkomfort:</strong> Premium-Boxspringbetten mit hypoallergenen Daunendecken und Kissenmenü (Hart, Mittel, Weich)</li><li><strong>Badezimmer:</strong> Regendusche, Fußbodenheizung, Naturkosmetik-Produkte aus Tiroler Manufaktur</li><li><strong>Technologie:</strong> Smart TV (55"), Bluetooth-Soundbar, USB-Ladestationen an beiden Bettseiten, Highspeed-WLAN</li><li><strong>Genuss:</strong> Nespresso-Maschine, gefüllte Minibar (Softdrinks & regionale Snacks), täglicher Turndown-Service mit Tiroler Praline</li><li><strong>Extras:</strong> Bademantel & Slipper, Yoga-Matte im Schrank, Safe, Verdunkelungsvorhänge</li></ul>',
          },
        },
      ],
    },

    // ─── 3. WELLNESS & SPA ─────────────────────────────────────
    {
      slug: 'wellness',
      title: 'Wellness & Spa',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-well-hero',
          data: {
            headline: 'Wellness & Spa – 800 m² Alpine Erholung',
            subline:
              'Tauchen Sie ein in unsere Wohlfühloase mit Infinity Pool, Saunalandschaft und handverlesenen Treatments. Lassen Sie die Seele schweben – mit Blick auf die Kitzbüheler Alpen.',
            badgeText: '800 m² Spa-Bereich',
            bgImage:
              'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1800&q=85',
            primaryCta: { label: 'Treatment buchen', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, type: 'wellness', id: 'ht-well-details',
          data: {
            headline: 'Unser Spa-Bereich',
            introText:
              'Auf 800 Quadratmetern erwartet Sie eine Welt der Entspannung: Vom beheizten Infinity Outdoor Pool mit Bergpanorama über die finnische Sauna bis hin zum Kneipp-Parcours im Hotelgarten. Unsere zertifizierten Therapeuten verwenden ausschließlich hochwertige Naturprodukte aus der Region.',
            images: [
              'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80',
              'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
            ],
            treatments: [
              {
                name: 'Alpine Kräuterbad',
                description: 'Entspannendes Vollbad mit heimischen BergKräutern – beruhigt Körper und Geist. Ideal nach einem aktiven Tag in den Bergen.',
                duration: '45 Minuten',
                priceLabel: '79 €',
              },
              {
                name: 'Hot-Stone Massage',
                description: 'Warme Basaltsteine lösen tiefe Verspannungen und Fördern die Durchblutung. Kombiniert mit aromatischem Zirbenöl aus den Tiroler Alpen.',
                duration: '60 Minuten',
                priceLabel: '119 €',
              },
              {
                name: 'Panorama-Sauna Zeremonie',
                description: 'Exklusiver Aufguss in unserer Panorama-Sauna mit Blick auf den Hahnenkamm. Täglich um 16 Uhr mit wechselnden Düften – von Latschenkiefer bis Bergminze.',
                duration: '30 Minuten',
                priceLabel: 'inklusive',
              },
              {
                name: 'Yoga am Berg',
                description: 'Morgendliche Yoga-Session auf unserer Sonnenterrasse (bei Schlechtwetter im Fitnessraum). für alle Level geeignet – Matten und Zubehör stellen wir.',
                duration: '60 Minuten',
                priceLabel: 'inklusive',
              },
            ],
            features: [
              {
                name: 'Infinity Outdoor Pool',
                description: 'Beheizter Pool (32 °C) mit 15-Meter-Schwimmbahn und direktem Bergpanorama – Ganzjährig geöffnet.',
              },
              {
                name: 'Dampfbad & Bio-Sauna',
                description: 'Sanfte Wärme bei 55 °C mit ätherischen Ölen – ideal für empfindliche Kreisläufe und Atemwege.',
              },
              {
                name: 'Ruheraum "Stille Alm"',
                description: 'Beheizte Wasserbetten, gedämpftes Licht und leise NaturkLänge – Ihr persönlicher Ruhepol nach jedem Treatment.',
              },
              {
                name: 'Kneipp-Anlage',
                description: 'Wechselwarmer Kneipp-Parcours im Hotelgarten mit Armbecken, Tretbecken und Barfußpfad über Natursteine.',
              },
            ],
          },
        },
        {
          ...B, type: 'statsCounter', id: 'ht-well-stats',
          data: {
            headline: 'Unser Spa in Zahlen',
            items: [
              { value: '800', suffix: 'm²', label: 'Wellness-Fläche' },
              { value: '12', suffix: '+', label: 'Treatment-Angebote' },
              { value: '32', suffix: '°C', label: 'Pool-Temperatur ganzjährig' },
              { value: '4.9', suffix: '/5', label: 'Gästebewertung Spa' },
            ],
          },
        },
        {
          ...B, type: 'ctaBand', id: 'ht-well-cta',
          data: {
            headline: 'Gönnen Sie sich eine Auszeit',
            subline: 'Buchen Sie jetzt Ihr persönliches Spa-Treatment und starten Sie erholt in den nächsten Tag.',
            primaryCta: { label: 'Treatment buchen', href: '/demo/hotel/kontakt' },
            secondaryCta: { label: 'Spa-Broschüre ansehen', href: '#' },
          },
        },
      ],
    },

    // ─── 4. RESTAURANT & KULINARIK ─────────────────────────────
    {
      slug: 'restaurant',
      title: 'Restaurant & Kulinarik',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-rest-hero',
          data: {
            headline: 'Restaurant Alpenblick – Genuss mit Weitblick',
            subline:
              'Unser Küchenchef Thomas Rainer verbindet regionale Tiroler Tradition mit moderner Leichtigkeit. Genießen Sie 2-Hauben-Küche mit Blick auf die Kitzbüheler Alpen – vom reichhaltigen Frühstück bis zum Gourmet-AbendMenü.',
            badgeText: '2 Gault-Millau-Hauben',
            bgImage:
              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85',
            primaryCta: { label: 'Tisch reservieren', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, type: 'hotelDining', id: 'ht-rest-dining',
          data: {
            headline: 'Kulinarik im Hotel Alpenblick',
            introText:
              'Von der hauseigenen Patisserie über den 200 Positionen umfassenden Weinkeller bis zum Kräutergarten auf der Dachterrasse – bei uns ist Genuss ein Ganzheitliches Erlebnis. Wir beziehen 85 % unserer Zutaten von lokalen Bauern und Produzenten aus dem Umkreis von 50 Kilometern.',
            image:
              'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80',
            openingTimes: [
              { label: 'Frühstück', time: '07:00 – 10:30 Uhr (Täglich)' },
              { label: 'Mittagskarte', time: '12:00 – 14:00 Uhr (Täglich)' },
              { label: 'AbendMenü', time: '18:30 – 21:30 Uhr (Täglich)' },
              { label: 'Bar & Lounge', time: '16:00 – 00:00 Uhr' },
            ],
            menus: [
              {
                name: 'Frühstück',
                description:
                  'Reichhaltiges Buffet mit regionalen Spezialitäten: hausgemachte Marmeladen, Tiroler Bauernbrot, frische Eierspeisen aus dem Live-Cooking, Käseplatte von der Alm und frisch gepresste Säfte. für HausGäste inklusive.',
              },
              {
                name: 'Mittagskarte',
                description:
                  'Leichte Gerichte für die Mittagspause: Tiroler Klassiker wie Kaspressknodel und Schlutzkrapfen neben saisonalen Salaten und einer Täglichen Suppe. Auch als Lunchbox für Wanderungen erhältlich.',
              },
              {
                name: 'AbendMenü',
                description:
                  'Unser 5-Gänge-Gourmet-Menü wechselt wöchentlich und spiegelt die Saison wider. Von der Forellenkreation aus dem Schwarzsee über zartes Tiroler Almrind bis zum Topfensoufflé mit Marillensauce – jeder Gang ein Erlebnis.',
              },
            ],
            highlights: [
              {
                title: 'Hauseigene Patisserie',
                description: 'Täglich frische Torten, Strudel und Pralinés – handgefertigt von unserer Patissière Lisa Winkler.',
              },
              {
                title: 'Weinkeller mit 200+ Positionen',
                description: 'Von Grüner Veltliner bis Südtiroler Lagrein – unser Sommelier berät Sie gerne zu jedem Gang.',
              },
              {
                title: 'AlpenKräuter-Garten',
                description: 'Auf unserer Dachterrasse wachsen über 30 Kräutersorten, die direkt in der Küche Verwendung finden.',
              },
            ],
          },
        },
        {
          ...B, type: 'testimonials', id: 'ht-rest-testimonials',
          data: {
            headline: 'Stimmen unserer Gäste',
            subline: 'Kulinarische Erlebnisse, die in Erinnerung bleiben',
            items: [
              {
                name: 'Elisabeth Moser',
                context: 'Abendmenü im Januar 2026',
                rating: 5,
                text: 'Das 5-Gänge-Menü war ein Gedicht! Besonders das Tiroler Almrind mit Trüffel-Sellerie hat uns sprachlos gemacht. Dazu die perfekte Weinbegleitung vom Sommelier – absolut auf Sterne-Niveau.',
              },
              {
                name: 'Prof. Klaus Hartmann',
                context: 'Geschäftsessen, März 2026',
                rating: 5,
                text: 'Wir haben hier einen wichtigen Kunden zum Dinner eingeladen – die Wahl war perfekt. Diskreter Service, herausragende Küche und der Weinkeller ist beeindruckend. Der Grüne Veltliner Smaragd war eine Offenbarung.',
              },
              {
                name: 'Sophia & Liam Chen',
                context: 'Hochzeitsdinner, September 2025',
                rating: 5,
                text: 'Unser Hochzeitsdinner auf der Terrasse war märchenhaft. Küchenchef Rainer hat ein individuelles Menü kreiert, das unsere Gäste noch Wochen später gelobt haben. Danke für diesen unvergesslichen Abend!',
              },
            ],
          },
        },
        {
          ...B, type: 'richText', id: 'ht-rest-wine',
          data: {
            headline: 'Weinkeller & Saisonale Highlights',
            body: '<p>Unser Weinkeller beherbergt über 200 sorgfältig ausgewählte Positionen – von österreichischen Spitzenweinen über Südtiroler Raritäten bis hin zu internationalen Klassikern. Sommelier Jakob Steiner berät Sie gerne zu jedem Gang.</p><p><strong>Saisonale Highlights:</strong></p><ul><li><strong>Frühling:</strong> Spargelwochen mit Weißburgunder-Begleitung und Bärlauch-Kreationen aus dem Hotelgarten</li><li><strong>Sommer:</strong> BBQ-Abende auf der Panorama-Terrasse mit Gin & Tonic Bar</li><li><strong>Herbst:</strong> Wildwochen mit edlen Rotweinen und hausgemachten Chutneys</li><li><strong>Winter:</strong> Fondue- und Raclette-Abende am offenen Feuer, begleitet von heißem Glühwein nach Hausrezept</li></ul>',
          },
        },
      ],
    },

    // ─── 5. MEETINGS & EVENTS ──────────────────────────────────
    {
      slug: 'veranstaltungen',
      title: 'Meetings & Events',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-event-hero',
          data: {
            headline: 'Meetings & Events – Tagen mit Bergblick',
            subline:
              'Ob Firmenseminar, Hochzeitsfeier oder Teambuilding – unsere drei flexiblen VeranstaltungsRäume bieten den perfekten Rahmen. Modernste Technik trifft auf alpines Ambiente und erstklassiges Catering.',
            badgeText: 'Bis 150 Personen',
            bgImage:
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
            primaryCta: { label: 'Anfrage senden', href: '/demo/hotel/kontakt' },
          },
        },
        {
          ...B, type: 'eventSpaces', id: 'ht-event-spaces',
          data: {
            headline: 'Unsere VeranstaltungsRäume',
            subline: 'Flexibel, modern und mit alpinem Charme',
            processSteps: [
              { label: 'Anfrage', description: 'Senden Sie uns Ihre wünsche – wir melden uns innerhalb von 24 Stunden.' },
              { label: 'Planung', description: 'Ihr persönlicher Event-Manager erstellt ein maßgeschneidertes Konzept.' },
              { label: 'Durchführung', description: 'Wir kümmern uns um jedes Detail – Sie Genießen Ihr Event.' },
            ],
            spaces: [
              {
                name: 'Salon Kitzbühel',
                description:
                  'Unser vielseitigster Raum für Seminare, Bankette und Feiern. Tageslicht von zwei Seiten, modulares Mobiliar und direkter Terrassenzugang machen ihn zum Allrounder.',
                image:
                  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&q=80',
                capacityLabel: 'bis 80 Personen',
                sizeLabel: '120 m²',
                seatingOptions: ['Theater (80)', 'Bankett (60)', 'U-Form (35)', 'Classroom (40)'],
                features: ['4K-Beamer & Leinwand', 'Raumteilbare Wände', 'Klimaanlage', 'Terrassenzugang', 'Integriertes Soundsystem'],
                inquiryCta: { label: 'Salon anfragen', href: '/demo/hotel/kontakt' },
              },
              {
                name: 'Panorama-Terrasse',
                description:
                  'Die Outdoor-Location für besondere Anlässe: Hochzeiten, Sommerfeste und Empfänge unter freiem Himmel mit spektakulärem Bergpanorama. Bei Bedarf mit Zelt oder Pagode erweiterbar.',
                image:
                  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80',
                capacityLabel: 'bis 150 Personen',
                sizeLabel: 'Outdoor, ca. 250 m²',
                seatingOptions: ['Stehempfang (150)', 'Bankett (100)', 'Zeremonie (120 Sitzplätze)'],
                features: ['Bergpanorama', 'Beheizbar mit Infrarot-Strahlern', 'Erweiterbar mit Zelt/Pagode', 'Live-Cooking-Station', 'Lichtinstallation'],
                inquiryCta: { label: 'Terrasse anfragen', href: '/demo/hotel/kontakt' },
              },
              {
                name: 'Boardroom Hahnenkamm',
                description:
                  'Exklusiver Meetingraum für Vorstandssitzungen, Workshops und vertrauliche Gespräche. Edles Zirbenholz, ein großer Konferenztisch und modernste Videokonferenztechnik garantieren produktive Meetings.',
                image:
                  'https://images.unsplash.com/photo-1431540015159-0f9673a4716d?w=900&q=80',
                capacityLabel: 'bis 16 Personen',
                sizeLabel: '45 m²',
                seatingOptions: ['Boardroom (16)', 'Workshop (12)'],
                features: ['75" 4K-Display', 'Videokonferenzsystem (Poly)', 'Akustikdecke', 'Nespresso & Minibar', 'Flipchart & Whiteboard'],
                inquiryCta: { label: 'Boardroom anfragen', href: '/demo/hotel/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'faq', id: 'ht-event-faq',
          data: {
            headline: 'Häufige Fragen zu Events',
            items: [
              {
                question: 'Wie früh sollte ich meinen Veranstaltungsraum reservieren?',
                answer: 'Wir empfehlen eine Buchung mindestens 3 Monate im Voraus, für Hochzeiten und große Events 6–12 Monate. Kurzfristige Anfragen bearbeiten wir natürlich ebenfalls gerne.',
              },
              {
                question: 'Bieten Sie Catering für Events an?',
                answer: 'Ja, unser Küchenteam erstellt maßgeschneiderte Menüs – vom Kaffeepausen-Paket über Flying Buffets bis zum mehrgängigen Gala-Dinner. Alle Menüs sind individuell anpassbar.',
              },
              {
                question: 'Gibt es Sonderkonditionen für Zimmerkontingente?',
                answer: 'Ab 10 Zimmern pro Nacht bieten wir attraktive Gruppentarife. Sprechen Sie uns gerne an – wir erstellen Ihnen ein individuelles Angebot inklusive Rahmenvertrag.',
              },
              {
                question: 'Welche Technik ist in den Räumen vorhanden?',
                answer: 'Alle Räume sind mit WLAN, Beamer/Display, Soundsystem und Flipcharts ausgestattet. Zusätzliches Equipment wie Simultandolmetsch-Anlagen oder Bühnenbeleuchtung organisieren wir gerne über unsere Partner.',
              },
            ],
          },
        },
        {
          ...B, type: 'faq', id: 'ht-event-planning-faq',
          data: {
            headline: 'Event-Planung im Detail',
            items: [
              {
                question: 'Können wir den Raum vorab besichtigen?',
                answer: 'Selbstverständlich! Wir bieten Ihnen gerne eine persönliche Führung durch unsere Veranstaltungsräume an. Vereinbaren Sie einfach einen Termin mit unserem Event-Team – auch virtuelle Besichtigungen per Video sind möglich.',
              },
              {
                question: 'Gibt es Unterstützung bei der Dekoration?',
                answer: 'Ja, unser Event-Team arbeitet mit erstklassigen lokalen Floristen und Dekorateuren zusammen. Von der Tischdeko bis zur Raumgestaltung – wir setzen Ihre Vision um oder inspirieren Sie mit bewährten Konzepten.',
              },
              {
                question: 'Sind Outdoor-Events auch bei schlechtem Wetter möglich?',
                answer: 'Unsere Panorama-Terrasse ist mit Infrarot-Strahlern und einer Überdachungsoption ausgestattet. Zusätzlich halten wir immer einen Indoor-Backup-Plan bereit, damit Ihr Event bei jedem Wetter perfekt wird.',
              },
              {
                question: 'Welche Teambuilding-Aktivitäten bieten Sie an?',
                answer: 'Von geführten Bergwanderungen über Kochkurse mit unserem Küchenchef bis hin zu Bogenschießen und Rafting – wir organisieren maßgeschneiderte Aktivitäten für jede Gruppengröße. Auch Wellness-Teamevents im Spa sind sehr beliebt.',
              },
            ],
          },
        },
        {
          ...B, type: 'ctaBand', id: 'ht-event-cta',
          data: {
            headline: 'Ihr Event in den Alpen – jetzt anfragen',
            subline: 'Unser Event-Team erstellt Ihnen innerhalb von 24 Stunden ein unverbindliches Angebot, maßgeschneidert auf Ihre Wünsche.',
            primaryCta: { label: 'Event-Anfrage senden', href: '/demo/hotel/kontakt' },
            secondaryCta: { label: 'Event-Broschüre herunterladen', href: '#' },
          },
        },
      ],
    },

    // ─── 6. GALERIE ────────────────────────────────────────────
    {
      slug: 'galerie',
      title: 'Galerie',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-gal-hero',
          data: {
            headline: 'Galerie – Eindrücke aus dem Hotel Alpenblick',
            subline:
              'Lassen Sie sich inspirieren: Entdecken Sie unsere Zimmer, den Spa-Bereich, das Restaurant und die einzigartige Berglandschaft rund um Kitzbühel.',
            badgeText: 'Bildergalerie',
            bgImage:
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85',
            primaryCta: { label: 'Zimmer ansehen', href: '/demo/hotel/zimmer' },
          },
        },
        {
          ...B, type: 'gallery', id: 'ht-gal-gallery',
          data: {
            headline: 'Unsere schönsten Eindrücke',
            categories: ['Zimmer', 'Wellness', 'Restaurant', 'Natur'],
            images: [
              { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', alt: 'Superior Doppelzimmer mit Bergblick', category: 'Zimmer' },
              { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80', alt: 'Junior Suite Alpenblick Wohnbereich', category: 'Zimmer' },
              { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80', alt: 'Panorama Suite mit Kupferbadewanne', category: 'Zimmer' },
              { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80', alt: 'Infinity Pool mit Bergpanorama', category: 'Wellness' },
              { src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80', alt: 'Saunalandschaft im Spa-Bereich', category: 'Wellness' },
              { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80', alt: 'Massage-Treatment im Alpenblick Spa', category: 'Wellness' },
              { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80', alt: 'Restaurant mit Panoramafenstern', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', alt: 'Gourmet-Gericht aus der Hauben-Küche', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80', alt: 'Bar & Lounge am Abend', category: 'Restaurant' },
              { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', alt: 'Kitzbüheler Alpen im Winter', category: 'Natur' },
              { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80', alt: 'Wanderwege im Sommer', category: 'Natur' },
              { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', alt: 'Sonnenuntergang über den Gipfeln', category: 'Natur' },
            ],
          },
        },
        {
          ...B, type: 'richText', id: 'ht-gal-about',
          data: {
            headline: 'Die Schönheit der Alpen im Wandel der Jahreszeiten',
            body: '<p>Unsere Galerie zeigt das Hotel Alpenblick und seine Umgebung in allen vier Jahreszeiten. Die Bilder wurden von der renommierten Tiroler Fotografin Magdalena Kirchner eingefangen, die seit über 10 Jahren die Stimmungen rund um Kitzbühel dokumentiert.</p><p><strong>Saisonale Highlights:</strong></p><ul><li><strong>Winter:</strong> Verschneite Gipfel, Pulverschnee auf den Pisten und gemütliche Abende am Kamin</li><li><strong>Frühling:</strong> Blühende Almwiesen, kristallklare Bergbäche und die ersten warmen Sonnenstrahlen auf der Terrasse</li><li><strong>Sommer:</strong> Smaragdgrüne Bergseen, ausgedehnte Wanderungen und laue Abende unter Sternenhimmel</li><li><strong>Herbst:</strong> Goldene Lärchenwälder, Erntedankfeste und die unvergleichliche Fernsicht an klaren Tagen</li></ul>',
          },
        },
        {
          ...B, type: 'ctaBand', id: 'ht-gal-cta',
          data: {
            headline: 'Überzeugt? Erleben Sie es selbst.',
            subline: 'Buchen Sie jetzt Ihren Aufenthalt im Hotel Alpenblick und erleben Sie alpinen Luxus hautnah.',
            primaryCta: { label: 'Zimmer buchen', href: '/demo/hotel/zimmer' },
            secondaryCta: { label: 'Kontakt aufnehmen', href: '/demo/hotel/kontakt' },
          },
        },
      ],
    },

    // ─── 7. KONTAKT & ANREISE ──────────────────────────────────
    {
      slug: 'kontakt',
      title: 'Kontakt & Anreise',
      sections: [
        {
          ...HERO, type: 'hero', id: 'ht-contact-hero',
          data: {
            headline: 'Kontakt & Anreise – Wir freuen uns auf Sie',
            subline:
              'Haben Sie Fragen zu Ihrem Aufenthalt, möchten ein Zimmer buchen oder ein Event planen? Unser Rezeptionsteam ist Täglich von 7 bis 23 Uhr für Sie da.',
            badgeText: '24/7 erreichbar',
            bgImage:
              'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=85',
            primaryCta: { label: 'Jetzt anrufen', href: 'tel:+4353561234567' },
            secondaryCta: { label: 'E-Mail senden', href: 'mailto:info@hotel-alpenblick.at' },
          },
        },
        {
          ...B, type: 'location', id: 'ht-contact-location',
          data: {
            headline: 'So finden Sie uns',
            address: 'Hotel Alpenblick\nBergStraße 12\n6370 Kitzbühel\nÖsterreich',
            mapEmbed: 'https://maps.google.com/maps?q=47.4464,12.3922&z=14&output=embed',
            transport: [
              {
                mode: 'Auto',
                description: 'über die A12 Inntalautobahn, Ausfahrt Wörgl-Ost, dann B170 Richtung Kitzbühel. Kostenlose Tiefgarage mit 30 Stellplätzen.',
              },
              {
                mode: 'Bahn',
                description: 'Bahnhof Kitzbühel (ÖBB) ist 1,5 km entfernt. Wir holen Sie gerne kostenlos ab – bitte melden Sie Ihre Ankunft vorab.',
              },
              {
                mode: 'Flughafen',
                description: 'Flughafen Innsbruck (INN): 95 km / ca. 75 Min. Flughafen Salzburg (SZG): 80 km / ca. 70 Min. Flughafen München (MUC): 165 km / ca. 2 Std.',
              },
              {
                mode: 'Shuttle',
                description: 'Privater Flughafentransfer auf Anfrage (Innsbruck ab 120 €, Salzburg ab 110 €, München ab 280 €). Buchung über die Rezeption.',
              },
            ],
            nearby: [
              { name: 'Hahnenkamm-Gondel', distance: '2 km', description: 'Direkte Anbindung an die SkiWelt – erreichbar mit unserem Gratis-Shuttle in 3 Min.' },
              { name: 'Schwarzsee', distance: '1,5 km', description: 'Einer der wärmsten Badeseen Tirols. Im Sommer perfekt zum Schwimmen und Entspannen.' },
              { name: 'Altstadt Kitzbühel', distance: '500 m', description: 'Boutiquen, Cafés und die berühmte Vorderstadt – bequem zu Fuss erreichbar.' },
            ],
          },
        },
        {
          ...B, type: 'contact', id: 'ht-contact-form',
          data: {
            headline: 'Schreiben Sie uns',
            subline: 'Wir antworten in der Regel innerhalb von 2 Stunden',
            formFields: [
              { name: 'name', label: 'Ihr Name', type: 'text', required: true },
              { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true },
              { name: 'phone', label: 'Telefonnummer', type: 'tel', required: false },
              { name: 'subject', label: 'Betreff', type: 'select', options: ['Zimmer-Anfrage', 'Event-Anfrage', 'Wellness-Buchung', 'Tischreservierung', 'Sonstiges'], required: true },
              { name: 'arrival', label: 'Gewünschte Anreise', type: 'date', required: false },
              { name: 'departure', label: 'Gewünschte Abreise', type: 'date', required: false },
              { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
            ],
            submitLabel: 'Nachricht senden',
            infoCards: [
              {
                icon: 'phone',
                title: 'Telefon',
                lines: ['+43 5356 123 456 7', 'Täglich 07:00 – 23:00 Uhr'],
              },
              {
                icon: 'email',
                title: 'E-Mail',
                lines: ['info@hotel-alpenblick.at', 'Antwort innerhalb von 2 Stunden'],
              },
              {
                icon: 'location',
                title: 'Adresse',
                lines: ['BergStraße 12', '6370 Kitzbühel, Österreich'],
              },
            ],
          },
        },
        {
          ...B, type: 'faq', id: 'ht-contact-faq',
          data: {
            headline: 'Häufig gestellte Fragen',
            items: [
              {
                question: 'Wann ist Check-in und Check-out?',
                answer: 'Check-in ist ab 15:00 Uhr, Check-out bis 11:00 Uhr. Früherer Check-in oder Späterer Check-out ist je nach Verfügbarkeit möglich – für Direktbucher ist Late Checkout bis 14:00 Uhr kostenlos.',
              },
              {
                question: 'Gibt es Parkmöglichkeiten?',
                answer: 'Ja, wir verfügen über eine hauseigene Tiefgarage mit 30 Stellplätzen (kostenlos für HausGäste) sowie 4 Tesla Supercharger und 6 Typ-2-Ladepunkte für Elektrofahrzeuge.',
              },
              {
                question: 'Sind Haustiere erlaubt?',
                answer: 'Hunde sind in ausgewählten Zimmern herzlich willkommen (Aufpreis 25 € / Nacht). Wir stellen Hundebett, Napf und eine Liste tierfreundlicher Wanderrouten bereit. Bitte geben Sie bei der Buchung an, dass Sie mit Hund reisen.',
              },
              {
                question: 'Wie sind die Stornierungsbedingungen?',
                answer: 'Kostenlose Stornierung bis 48 Stunden vor Anreise. Bei Späterer Stornierung oder Nichtanreise berechnen wir die erste Nacht. für Packages und Sondertarife können abweichende Bedingungen gelten.',
              },
              {
                question: 'Ist das Frühstück im Zimmerpreis enthalten?',
                answer: 'Ja, unser reichhaltiges Frühstücksbuffet mit Live-Cooking-Station, regionalen Spezialitäten und frisch gepressten Säften ist für alle HausGäste inklusive (Täglich 07:00 – 10:30 Uhr).',
              },
            ],
          },
        },
        {
          ...B, type: 'textImage', id: 'ht-contact-directions',
          data: {
            headline: 'Anreise & Orientierung',
            body: 'Das Hotel Alpenblick liegt nur 500 Meter vom Zentrum Kitzbühels entfernt, eingebettet in die ruhige Südhanglage mit freiem Blick auf die Kitzbüheler Alpen. Ob mit dem Auto über die A12, per Bahn zum nur 1,5 km entfernten Bahnhof oder per Flughafentransfer – wir sorgen dafür, dass Ihre Anreise so entspannt wie Ihr Aufenthalt wird. Unser kostenloser Abholservice vom Bahnhof ist täglich verfügbar.',
            image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
            imageAlt: 'Panoramastraße nach Kitzbühel mit Blick auf die Alpen',
            imagePosition: 'right',
          },
        },
        {
          ...B, type: 'faq', id: 'ht-contact-booking-faq',
          data: {
            headline: 'Fragen zur Buchung',
            items: [
              {
                question: 'Kann ich meine Buchung ändern oder upgraden?',
                answer: 'Ja, änderungen sind bis 48 Stunden vor Anreise kostenlos möglich. Zimmer-Upgrades bieten wir nach Verfügbarkeit an – kontaktieren Sie einfach unsere Rezeption. Direktbucher erhalten bevorzugt Upgrades.',
              },
              {
                question: 'Welche Zahlungsmethoden werden akzeptiert?',
                answer: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, Amex), EC-Karte, Überweisung und Bar. Bei Direktbuchung über unsere Website ist auch Klarna-Ratenzahlung möglich.',
              },
              {
                question: 'Gibt es Gutscheine oder Geschenkboxen?',
                answer: 'Ja! Unsere Alpenblick-Gutscheine sind das perfekte Geschenk – erhältlich als Wertgutschein oder für spezifische Packages. Online bestellbar mit Versand per Post oder als stilvolle PDF zum Ausdrucken.',
              },
              {
                question: 'Wie buche ich am besten für eine Gruppe?',
                answer: 'Für Gruppen ab 5 Zimmern erstellen wir gerne ein individuelles Angebot mit Sonderkonditionen. Kontaktieren Sie unser Reservierungsteam per E-Mail oder Telefon – wir beraten Sie persönlich.',
              },
            ],
          },
        },
      ],
    },
  ],
};
