/**
 * Rich demo seed: Salon (Salon Isabelle)
 * ALL section types incl. beforeAfter, gallery, openingHours, locationContact, faq
 */
export const SALON_CONFIG = {
  slug: 'demo-salon',
  name: 'Salon Isabelle',
  industry: 'salon' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Salon Isabelle',
    tagline: 'Ihr Wohlfühl-Salon in Salzburg — Haare, Beauty & Wellness',
    primaryColor: '#9f1239',
    secondaryColor: '#be185d',
    accentColor: '#f9a8d4',
  },
  contact: { phone: '+43 662 874 512', email: 'info@salon-isabelle.at', address: 'Linzer Gasse 17, 5020 Salzburg' },
  socialLinks: { instagram: 'https://instagram.com/salon.isabelle', facebook: 'https://facebook.com/salon.isabelle' },
  openingHours: [
    { day: 'Di–Fr', hours: '09:00–19:00' },
    { day: 'Sa', hours: '09:00–16:00' },
    { day: 'So–Mo', hours: 'Geschlossen' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Preise', href: '/preise', type: 'link' },
    { label: 'Vorher & Nachher', href: '/vorher-nachher', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Team', href: '/team', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Termin buchen', href: '/kontakt' },
  footerColumns: [
    { title: 'Leistungen', items: [{ text: 'Schnitt & Styling', href: '/leistungen' }, { text: 'Coloration', href: '/leistungen' }, { text: 'Beauty & Wellness', href: '/leistungen' }] },
    { title: 'Salon', items: [{ text: 'Team', href: '/team' }, { text: 'Galerie', href: '/galerie' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Öffnungszeiten', items: [{ text: 'Di–Fr: 09:00–19:00' }, { text: 'Sa: 09:00–16:00' }, { text: 'So–Mo: Geschlossen' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Termin buchen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Salon Isabelle',
          subline: 'Ihr Wohlfühl-Salon in der Salzburger Altstadt — seit über 20 Jahren. Schnitt, Farbe, Beauty und Wohlbefinden aus einer Hand.',
          badgeText: 'Seit 2003',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
          trustItems: ['Seit 20 Jahren in Salzburg', 'Zertifizierte Farbexpertinnen', 'Nachhaltige Produkte'],
          primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
          secondaryCta: { label: 'Leistungen entdecken', href: '/leistungen' },
        }},
        { type: 'services', sortOrder: 1, data: {
          headline: 'Unsere Leistungen',
          subline: 'Von klassisch bis kreativ — wir finden den perfekten Look für Sie',
          badgeText: 'Für Sie & Ihn',
          services: [
            { title: 'Schnitt & Styling', text: 'Präzisionsschnitt mit individueller Beratung, Waschen, Pflege und Finish. Für Damen und Herren.', image: 'https://images.unsplash.com/photo-1562322140-8baeababf5df?w=900&q=80', icon: 'scissors', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Coloration & Balayage', text: 'Von sanften Highlights bis zur kompletten Verwandlung — mit schonenden Farbtechniken namhafter Hersteller.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', icon: 'palette', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Braut & Festfrisuren', text: 'Ihr perfekter Look für den großen Tag — inkl. Probe-Styling, Haarschmuck-Beratung und Make-up.', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', icon: 'crown', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Beauty Treatments', text: 'Wimpernverlängerung, Augenbrauen-Styling, Gesichtsbehandlungen und Maniküre — alles unter einem Dach.', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80', icon: 'sparkles', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
          ],
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Was unsere Kundinnen sagen',
          subline: 'Über 500 Bewertungen auf Google',
          ratingValue: '4.9',
          ratingSource: 'Google',
          testimonials: [
            { name: 'Julia M.', location: 'Salzburg', rating: 5, text: 'Isabelle und ihr Team sind einfach großartig. Mein Balayage sieht jedes Mal perfekt aus und hält ewig. Der Salon ist wunderschön und die Atmosphäre einladend.' },
            { name: 'Katharina S.', location: 'Hallein', rating: 5, text: 'Endlich ein Salon, in dem man sich wirklich wohlfühlt. Die Beratung ist ehrlich, die Ergebnisse top. Meine Brautfrisur war ein Traum!' },
            { name: 'Anna L.', location: 'Salzburg', rating: 5, text: 'Komme seit 8 Jahren hierher und war noch nie enttäuscht. Das Team nimmt sich immer viel Zeit und geht auf meine Wünsche ein.' },
          ],
        }},
      ],
    },
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          subline: 'Vom klassischen Schnitt bis zum kompletten Makeover — finden Sie die perfekte Behandlung',
          bgImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1800&q=85',
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'services', sortOrder: 1, data: {
          headline: 'Haar-Leistungen',
          subline: 'Für jeden Haartyp und jeden Anlass',
          services: [
            { title: 'Damen Schnitt & Styling', text: 'Individuelle Beratung, Waschen, Pflege, Präzisionsschnitt und professionelles Styling. Ca. 60 Min.', icon: 'scissors', priceLabel: 'Ab 65 €' },
            { title: 'Herren Schnitt', text: 'Waschen, Schnitt, Styling und bei Wunsch Bartpflege. Ca. 30 Min.', icon: 'scissors', priceLabel: 'Ab 35 €' },
            { title: 'Kinder Schnitt', text: 'Geduldig und liebevoll — für Kinder bis 14 Jahre. Ca. 20 Min.', icon: 'heart', priceLabel: 'Ab 22 €' },
            { title: 'Coloration', text: 'Komplettfärbung mit Premium-Produkten von Wella und Kérastase. Inkl. Pflege.', icon: 'palette', priceLabel: 'Ab 85 €' },
            { title: 'Strähnchen & Highlights', text: 'Foliensträhnen, Painting oder Balayage — für natürliche oder Statement-Looks.', icon: 'sun', priceLabel: 'Ab 95 €' },
            { title: 'Balayage', text: 'Die natürlichste Farbtechnik: frei Hand gemalt für sonnenverwöhnte, graduelle Farbverläufe.', icon: 'palette', priceLabel: 'Ab 140 €' },
            { title: 'Hochsteckfrisur & Braut', text: 'Ihre Traumfrisur für den großen Tag. Inkl. Probe-Termin (empfohlen).', icon: 'crown', priceLabel: 'Ab 120 €' },
            { title: 'Keratinbehandlung', text: 'Permanente Glättung und Pflege für widerspenstiges Haar. Hält 3–4 Monate.', icon: 'sparkles', priceLabel: 'Ab 180 €' },
          ],
        }},
        { type: 'services', sortOrder: 2, data: {
          headline: 'Beauty & Wellness',
          subline: 'Weil Schönheit mehr als nur Haare ist',
          services: [
            { title: 'Wimpernverlängerung', text: 'Classic, Volume oder Hybrid — für den perfekten Augenaufschlag. Haltbar 3–4 Wochen.', icon: 'eye', priceLabel: 'Ab 120 €' },
            { title: 'Augenbrauen-Styling', text: 'Waxing, Zupfen, Färben oder Lamination — definierte Brauen nach Ihren Wünschen.', icon: 'eye', priceLabel: 'Ab 25 €' },
            { title: 'Gesichtsbehandlung', text: 'Tiefenreinigung, Peeling, Maske und Massage — abgestimmt auf Ihren Hauttyp. Ca. 60 Min.', icon: 'sparkles', priceLabel: 'Ab 85 €' },
            { title: 'Maniküre & Gellack', text: 'Klassische Maniküre oder langanhaltender Gellack. Optional mit Nail-Art.', icon: 'hand', priceLabel: 'Ab 40 €' },
          ],
        }},
      ],
    },
    {
      slug: 'preise', title: 'Preise', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Preise',
          subline: 'Transparente Preise für alle Leistungen — faire Qualität für jedes Budget',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'pricing', sortOrder: 1, data: {
          headline: 'Preisübersicht',
          subline: 'Alle Preise inkl. Beratung, Waschen und Pflege',
          categories: [
            { title: 'Damen', items: [
              { name: 'Waschen, Schnitt & Föhnen', price: '65 €' },
              { name: 'Waschen & Föhnen', price: '35 €' },
              { name: 'Ansatzfarbe', price: '85 €' },
              { name: 'Komplettfarbe', price: '95 €' },
              { name: 'Strähnchen (Folie)', price: '95 €' },
              { name: 'Balayage', price: '140–180 €' },
              { name: 'Hochsteckfrisur', price: '120 €' },
              { name: 'Braut-Paket (Probe + Tag)', price: '250 €' },
              { name: 'Keratinbehandlung', price: '180–250 €' },
            ]},
            { title: 'Herren', items: [
              { name: 'Waschen, Schnitt & Styling', price: '35 €' },
              { name: 'Maschinenschnitt', price: '22 €' },
              { name: 'Bart-Trimm & Pflege', price: '18 €' },
              { name: 'Schnitt + Bart-Paket', price: '48 €' },
            ]},
            { title: 'Kinder (bis 14 J.)', items: [
              { name: 'Mädchen', price: '22–32 €' },
              { name: 'Jungen', price: '18–25 €' },
            ]},
            { title: 'Beauty', items: [
              { name: 'Wimpernverlängerung Classic', price: '120 €' },
              { name: 'Wimpern-Auffüllung', price: '65 €' },
              { name: 'Augenbrauen Waxing & Styling', price: '25 €' },
              { name: 'Augenbrauen Lamination', price: '45 €' },
              { name: 'Gesichtsbehandlung (60 Min.)', price: '85 €' },
              { name: 'Maniküre klassisch', price: '40 €' },
              { name: 'Maniküre + Gellack', price: '55 €' },
            ]},
          ],
          footnote: 'Alle Preise sind Richtwerte. Der finale Preis wird nach individueller Beratung festgelegt. Besonders lange oder dichte Haare können einen Aufpreis erfordern.',
          ctaPrimary: { label: 'Termin vereinbaren', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'vorher-nachher', title: 'Vorher & Nachher', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Vorher & Nachher',
          subline: 'Echte Ergebnisse, echte Verwandlungen — überzeugen Sie sich selbst',
          bgImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1800&q=85',
        }},
        { type: 'beforeAfter', sortOrder: 1, data: {
          headline: 'Unsere Transformationen',
          subline: 'Jede Verwandlung beginnt mit einem guten Gespräch',
          badgeText: 'Echte Kundinnen',
          items: [
            { title: 'Balayage-Verwandlung', text: 'Von eintönigem Braun zu sonnenverwöhntem Balayage in warmen Karamell- und Honig-Tönen. Bearbeitung: 3,5 Stunden.', beforeImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80', category: 'Coloration', caption: 'Kundin Lisa, Oktober 2024', cta: { label: 'Auch Lust auf Veränderung?', href: '/kontakt' } },
            { title: 'Bob-Transformation', text: 'Von langen, strapazierten Haaren zum modernen French Bob — frisch, pflegeleicht und voller Textur.', beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1562322140-8baeababf5df?w=900&q=80', category: 'Schnitt', caption: 'Kundin Sophia, November 2024', cta: { label: 'Beratung buchen', href: '/kontakt' } },
            { title: 'Farb-Korrektur', text: 'Misslungene Heimfärbung professionell korrigiert: Von fleckigem Orange zu gleichmäßigem, kühlem Brond.', beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Farbkorrektur', caption: 'Kundin Marie, September 2024', cta: { label: 'Farbberatung buchen', href: '/kontakt' } },
            { title: 'Braut-Styling', text: 'Romantische Hochsteckfrisur mit eingearbeitetem Haarschmuck und natürliches Braut-Make-up für den perfekten Tag.', beforeImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', category: 'Braut', caption: 'Braut Anna, August 2024', cta: { label: 'Braut-Paket anfragen', href: '/kontakt' } },
          ],
        }},
      ],
    },
    {
      slug: 'galerie', title: 'Galerie', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Galerie',
          subline: 'Einblicke in unseren Salon, unser Team und unsere Arbeit',
          bgImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1800&q=85',
        }},
        { type: 'gallery', sortOrder: 1, data: {
          headline: 'Impressionen',
          subline: 'Unser Salon in Bildern',
          images: [
            { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', alt: 'Salon Empfangsbereich', caption: 'Unser heller, einladender Empfangsbereich', category: 'Salon' },
            { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', alt: 'Waschplatz', caption: 'Entspannung beginnt am Waschplatz', category: 'Salon' },
            { src: 'https://images.unsplash.com/photo-1562322140-8baeababf5df?w=900&q=80', alt: 'Schnitt in Aktion', caption: 'Präzision und Leidenschaft bei jedem Schnitt', category: 'Arbeit' },
            { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', alt: 'Balayage Ergebnis', caption: 'Perfektes Balayage in warmen Tönen', category: 'Arbeit' },
            { src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80', alt: 'Styling Ergebnis', caption: 'Glänzendes Finish nach der Behandlung', category: 'Arbeit' },
            { src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', alt: 'Braut-Styling', caption: 'Romantische Brautfrisur', category: 'Braut' },
            { src: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80', alt: 'Beauty Treatment', caption: 'Entspannung bei unseren Beauty Treatments', category: 'Beauty' },
            { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', alt: 'Produkte', caption: 'Hochwertige Produkte von Premium-Marken', category: 'Produkte' },
          ],
        }},
      ],
    },
    {
      slug: 'team', title: 'Team', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unser Team',
          subline: 'Leidenschaft, Expertise und ein offenes Ohr — lernen Sie uns kennen',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'team', sortOrder: 1, data: {
          headline: 'Die Menschen hinter Salon Isabelle',
          subline: 'Ein Team aus sechs Expertinnen, das Ihr Vertrauen verdient',
          members: [
            { name: 'Isabelle Weber', role: 'Inhaberin & Meisterfriseurin', description: 'Über 25 Jahre Erfahrung, Spezialistin für Coloration und kreatives Farbdesign. Isabelle gründete den Salon 2003 und bildet seitdem die nächste Generation aus.', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80', specialties: ['Coloration', 'Farbkorrektur', 'Kreatives Design'] },
            { name: 'Lisa Hartmann', role: 'Senior Stylistin', description: 'Balayage-Expertin mit Weiterbildungen in Paris und London. Lisa hat ein untrügliches Gespür für natürliche, harmonische Farbtöne.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', specialties: ['Balayage', 'Highlights', 'Braut'] },
            { name: 'Maria Koller', role: 'Stylistin & Beauty-Expertin', description: 'Spezialisiert auf Schnitt-Techniken und Wimpernverlängerungen. Marias ruhige Art und Präzision machen jeden Besuch zum Erlebnis.', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80', specialties: ['Schnitt', 'Wimpern', 'Gesichtsbehandlung'] },
            { name: 'Sophie Brandstätter', role: 'Stylistin', description: 'Frisch aus der Meisterschule mit aktuellsten Trend-Kenntnissen. Sophie bringt kreative Ideen und innovative Techniken ein.', image: 'https://images.unsplash.com/photo-1562322140-8baeababf5df?w=400&q=80', specialties: ['Trendschnitte', 'Keratin', 'Herren'] },
          ],
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Terminbuchung',
          subline: 'Wir freuen uns auf Ihren Besuch in der Linzer Gasse',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'openingHours', sortOrder: 1, data: {
          headline: 'Unsere Öffnungszeiten',
          subline: 'Wann Sie uns besuchen können',
          days: [
            { label: 'Dienstag', hours: '09:00 — 19:00 Uhr' },
            { label: 'Mittwoch', hours: '09:00 — 19:00 Uhr' },
            { label: 'Donnerstag', hours: '09:00 — 20:00 Uhr', note: 'Langer Donnerstag' },
            { label: 'Freitag', hours: '09:00 — 19:00 Uhr' },
            { label: 'Samstag', hours: '09:00 — 16:00 Uhr' },
            { label: 'Sonntag', hours: '', closed: true, note: 'Geschlossen' },
            { label: 'Montag', hours: '', closed: true, note: 'Geschlossen' },
          ],
          bookingNote: 'Termine sollten nach Möglichkeit vorab vereinbart werden. Walk-ins gerne nach Verfügbarkeit.',
          ctaPrimary: { label: 'Jetzt Termin buchen', href: '/kontakt' },
        }},
        { type: 'locationContact', sortOrder: 2, data: {
          headline: 'So finden Sie uns',
          subline: 'Mitten in der Salzburger Altstadt',
          introText: 'Unser Salon befindet sich in der beliebten Linzer Gasse — nur 2 Gehminuten vom Platzl. Parkplätze finden Sie in der Mönchsberg-Garage (5 Min. Fußweg).',
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2677.4!2d13.05!3d47.80!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDQ4JzAwLjAiTiAxM8KwMDMnMDAuMCJF!5e0!3m2!1sde!2sat!4v1700000000000',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 662 874 512' },
            { icon: 'mail', label: 'E-Mail', value: 'info@salon-isabelle.at' },
            { icon: 'map', label: 'Adresse', value: 'Linzer Gasse 17, 5020 Salzburg' },
            { icon: 'instagram', label: 'Instagram', value: '@salon.isabelle' },
          ],
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          secondaryCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Linzer+Gasse+17,+5020+Salzburg' },
        }},
        { type: 'faq', sortOrder: 3, data: {
          headline: 'Häufige Fragen',
          subline: 'Antworten auf die wichtigsten Fragen vor Ihrem Besuch',
          items: [
            { question: 'Brauche ich einen Termin?', answer: 'Wir empfehlen grundsätzlich eine Terminvereinbarung, damit wir genügend Zeit für Sie einplanen können. Spontane Besuche sind nach Verfügbarkeit möglich — am besten kurz anrufen.' },
            { question: 'Wie lange dauert eine Balayage?', answer: 'Rechnen Sie mit ca. 2,5–3,5 Stunden je nach Haarlänge und gewünschtem Ergebnis. Darin enthalten sind Beratung, Auftrag, Einwirkzeit, Toning, Pflege und Styling.' },
            { question: 'Welche Produkte verwenden Sie?', answer: 'Wir arbeiten ausschließlich mit Premium-Marken: Wella Professionals für Coloration, Kérastase Paris für Pflege und Olaplex für Repair-Treatments. Alle Produkte sind auch im Salon erhältlich.' },
            { question: 'Bieten Sie auch Kinderbehandlungen an?', answer: 'Ja! Kinderhaarschnitte für Mädchen und Jungen bis 14 Jahre ab 18–32 €. Wir sind geduldig und sorgen für eine entspannte Atmosphäre, damit auch die Kleinsten Spaß haben.' },
            { question: 'Kann ich meinen Termin online stornieren?', answer: 'Ja, Sie können Ihren Termin bis 24 Stunden vorher kostenlos per Telefon oder E-Mail stornieren. Bei kurzfristigen Absagen (unter 24h) fällt eine Ausfallgebühr von 50% an.' },
            { question: 'Gibt es Parkmöglichkeiten?', answer: 'Die nächste Parkgarage ist die Mönchsberg-Garage (ca. 5 Min. zu Fuß). Direkt am Salon gibt es leider keine Parkplätze, aber der Standort ist öffentlich sehr gut erreichbar (Bus 1, 4 — Haltestelle Platzl).' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Rufen Sie uns an', href: 'tel:+43662874512' },
        }},
      ],
    },
  ],
};
