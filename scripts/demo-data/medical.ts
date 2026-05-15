/**
 * Rich demo seed: Medical (Praxis Dr. Helena Berger)
 * ALL section types incl. insuranceInfo, downloadForms, emergencyInfo,
 * practiceGallery, equipmentHighlights, openingHours, locationContact
 */
export const MEDICAL_CONFIG = {
  slug: 'demo-medical',
  name: 'Praxis Dr. Helena Berger',
  industry: 'medical' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Praxis Dr. Helena Berger',
    tagline: 'Ihre Hausarztpraxis in Graz — ganzheitlich, modern, menschlich',
    primaryColor: '#0e7490',
    secondaryColor: '#0891b2',
    accentColor: '#22d3ee',
  },
  contact: { phone: '+43 316 812 300', email: 'ordination@dr-berger.at', address: 'Herrengasse 12, 8010 Graz' },
  socialLinks: { facebook: 'https://facebook.com/praxis.dr.berger' },
  openingHours: [
    { day: 'Mo, Di, Do', hours: '08:00–12:00 & 14:00–18:00' },
    { day: 'Mi', hours: '08:00–12:00' },
    { day: 'Fr', hours: '08:00–14:00' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Team', href: '/team', type: 'link' },
    { label: 'Praxis', href: '/praxis', type: 'link' },
    { label: 'Für Patienten', href: '/patienten', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Termin vereinbaren', href: '/kontakt' },
  footerColumns: [
    { title: 'Praxis', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Team', href: '/team' }, { text: 'Praxisrundgang', href: '/praxis' }] },
    { title: 'Patienten', items: [{ text: 'Kasseninfo', href: '/patienten' }, { text: 'Downloads', href: '/patienten' }, { text: 'Notfälle', href: '/patienten' }] },
    { title: 'Ordinationszeiten', items: [{ text: 'Mo, Di, Do: 08–12 & 14–18' }, { text: 'Mi: 08–12' }, { text: 'Fr: 08–14' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Termin buchen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Praxis Dr. Helena Berger',
          subline: 'Ihre Hausarztpraxis in der Grazer Innenstadt — ganzheitliche Medizin mit modernster Diagnostik. Wir nehmen uns Zeit für Sie.',
          badgeText: 'Kassenpraxis',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
          trustItems: ['Alle Kassen & Privat', 'Online-Terminbuchung', 'Modernste Diagnostik'],
          primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
          secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' },
        }},
        { type: 'medicalServices', sortOrder: 1, data: {
          headline: 'Unsere Leistungen',
          subline: 'Umfassende medizinische Versorgung aus einer Hand',
          services: [
            { title: 'Allgemeinmedizin', text: 'Ganzheitliche hausärztliche Versorgung: Vorsorge, Diagnostik, Therapie und Nachsorge. Wir begleiten Sie in allen Lebensphasen.', icon: 'stethoscope', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Innere Medizin', text: 'Erweiterte Diagnostik mit EKG, Langzeit-Blutdruck, Lungenfunktion und Labordiagnostik — direkt in der Praxis.', icon: 'heart', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Vorsorgeuntersuchung', text: 'Ihr jährlicher Gesundheits-Check: Blutbild, Organscreening, Impfstatus und individuelle Beratung. Für alle Kassen kostenlos.', icon: 'shield', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
            { title: 'Reisemedizin', text: 'Individuelle Reiseberatung, Impfungen und Prophylaxe — maßgeschneidert für Ihr Reiseziel und Ihre Gesundheitsgeschichte.', icon: 'globe', cta: { label: 'Mehr erfahren', href: '/leistungen' } },
          ],
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Patientenstimmen',
          subline: 'Was unsere Patientinnen und Patienten sagen',
          ratingValue: '4.8',
          ratingSource: 'Google',
          testimonials: [
            { name: 'Maria K.', location: 'Graz', rating: 5, text: 'Dr. Berger nimmt sich wirklich Zeit und hört zu. Ich fühle mich hier bestens aufgehoben — von der Vorsorge bis zur akuten Behandlung.' },
            { name: 'Peter S.', location: 'Graz-Umgebung', rating: 5, text: 'Moderne Praxis, freundliches Team, kurze Wartezeiten. Die Online-Terminbuchung ist super praktisch. Kann ich nur empfehlen!' },
            { name: 'Elisabeth W.', location: 'Graz', rating: 5, text: 'Endlich eine Ärztin, die ganzheitlich denkt. Die Beratung ist ausführlich und man fühlt sich nie gehetzt.' },
          ],
        }},
      ],
    },
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          subline: 'Von der Vorsorge bis zur Akutversorgung — medizinische Kompetenz für Ihre Gesundheit',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
          primaryCta: { label: 'Termin vereinbaren', href: '/kontakt' },
        }},
        { type: 'medicalServices', sortOrder: 1, data: {
          headline: 'Kassenleistungen',
          subline: 'Alle Leistungen mit e-Card — ohne Zuzahlung',
          services: [
            { title: 'Allgemeinmedizinische Betreuung', text: 'Umfassende hausärztliche Versorgung: Anamnese, Untersuchung, Diagnose, Therapie und Überweisungen. Chronische Erkrankungen, Infekte, Verletzungen.', icon: 'stethoscope' },
            { title: 'Vorsorgeuntersuchung', text: 'Jährliche Gesundheitsuntersuchung ab 18 Jahren: Großes Blutbild, Blutzucker, Cholesterin, Leber- und Nierenwerte, Harnanalyse, BMI, Blutdruck, Beratungsgespräch.', icon: 'shield' },
            { title: 'EKG & Langzeit-EKG', text: 'Ruhe-EKG direkt in der Praxis. 24-Stunden-Langzeit-EKG bei Verdacht auf Herzrhythmusstörungen. Befund innerhalb von 48 Stunden.', icon: 'heart' },
            { title: 'Langzeit-Blutdruckmessung', text: '24-Stunden-Blutdruckmonitoring zur Abklärung von Hypertonie. Anlegen in der Praxis, Auswertung am Folgetag.', icon: 'activity' },
            { title: 'Lungenfunktionstest', text: 'Spirometrie zur Beurteilung der Lungenfunktion bei Asthma, COPD, Belastungsbeschwerden oder Rauchervorsorge.', icon: 'wind' },
            { title: 'Labordiagnostik', text: 'Blutabnahme direkt in der Praxis: großes Blutbild, Schilddrüse, Vitamine, Entzündungsmarker, Allergiescreening und mehr. Ergebnisse meist innerhalb von 2 Werktagen.', icon: 'microscope' },
            { title: 'Impfungen', text: 'Alle empfohlenen Impfungen laut österreichischem Impfplan: FSME, Grippe, COVID, Tetanus, Hepatitis, Pneumokokken u.v.m. Impfpassdigitalisierung inklusive.', icon: 'syringe' },
            { title: 'Wundversorgung', text: 'Erstversorgung von Schnitt-, Schürf- und Risswunden. Nahtversorgung, sterile Wundauflagen, Nachkontrolle und Fadenzug.', icon: 'bandage' },
          ],
        }},
        { type: 'medicalServices', sortOrder: 2, data: {
          headline: 'Privatleistungen',
          subline: 'Erweiterte Diagnostik und individuelle Gesundheitsvorsorge',
          services: [
            { title: 'Erweiterte Blutanalyse', text: 'Umfangreiches Blutbild inkl. Mikronährstoffe, Aminosäuren, Hormonstatus und oxidativem Stress. Für eine gezielte Gesundheitsoptimierung.', icon: 'microscope', priceLabel: 'Ab 120 €' },
            { title: 'Reisemedizinische Beratung', text: 'Individuelle Beratung und Impfungen für Ihr Reiseziel. Malaria-Prophylaxe, Gelbfieber, Japanische Enzephalitis, Tollwut.', icon: 'globe', priceLabel: 'Ab 45 €' },
            { title: 'Führerscheinuntersuchung', text: 'Ärztliche Untersuchung für den Führerscheinerwerb oder die Verlängerung. Sehtest, Reaktionstest und allgemeine Tauglichkeitsprüfung.', icon: 'car', priceLabel: '35 €' },
            { title: 'Sporttauglichkeitsuntersuchung', text: 'Belastungs-EKG, Lungenfunktion und Blutanalyse für Vereins- und Wettkampfsportler. Ärztliches Attest inklusive.', icon: 'activity', priceLabel: 'Ab 85 €' },
          ],
        }},
      ],
    },
    {
      slug: 'team', title: 'Team', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unser Team',
          subline: 'Kompetenz und Empathie — die Menschen hinter Ihrer Praxis',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'team', sortOrder: 1, data: {
          headline: 'Das Praxisteam',
          subline: 'Wir freuen uns auf Sie',
          members: [
            { name: 'Dr. Helena Berger', role: 'Fachärztin für Allgemeinmedizin', description: 'Studium an der Med Uni Graz, Facharztausbildung am LKH Graz. Schwerpunkte: Innere Medizin, Vorsorge, Reisemedizin. Kassenärztin seit 2015.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', specialties: ['Allgemeinmedizin', 'Innere Medizin', 'Reisemedizin'] },
            { name: 'Mag. Thomas Maier', role: 'Arzt in Ausbildung', description: 'Turnusarzt im letzten Ausbildungsjahr. Engagiert, einfühlsam und immer bereit, die extra Meile für Patienten zu gehen.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', specialties: ['Allgemeinmedizin', 'Notfallmedizin'] },
            { name: 'Sandra Kovacs', role: 'Ordinationsassistentin', description: 'Seit 8 Jahren in der Praxis und Ihre erste Ansprechpartnerin. Zuständig für Terminmanagement, Blutabnahmen und EKG-Durchführung.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80', specialties: ['Terminmanagement', 'Labor', 'EKG'] },
            { name: 'Lisa Pichler', role: 'Ordinationsassistentin', description: 'Spezialisiert auf Wundversorgung und Impfmanagement. Lisa sorgt dafür, dass Ihr Besuch reibungslos und angenehm verläuft.', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964dc31?w=400&q=80', specialties: ['Wundversorgung', 'Impfungen', 'Patientenbetreuung'] },
          ],
        }},
      ],
    },
    {
      slug: 'praxis', title: 'Praxis', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Praxis',
          subline: 'Moderne Räumlichkeiten, hochwertige Ausstattung und eine Atmosphäre zum Wohlfühlen',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'practiceGallery', sortOrder: 1, data: {
          headline: 'Praxisrundgang',
          subline: 'Werfen Sie einen Blick in unsere Räumlichkeiten',
          images: [
            { src: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', alt: 'Empfangsbereich', caption: 'Heller, einladender Empfangsbereich mit Wartelounge', category: 'Empfang' },
            { src: 'https://images.unsplash.com/photo-1666214280557-091f08a30b01?w=900&q=80', alt: 'Behandlungsraum', caption: 'Modern ausgestatteter Behandlungsraum', category: 'Behandlung' },
            { src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80', alt: 'EKG-Raum', caption: 'Separater Raum für EKG und Diagnostik', category: 'Diagnostik' },
            { src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=900&q=80', alt: 'Laborbereich', caption: 'Eigener Laborbereich für Blutabnahmen', category: 'Labor' },
            { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80', alt: 'Wartebereich', caption: 'Gemütlicher Wartebereich mit Lesestoff und WLAN', category: 'Empfang' },
          ],
        }},
        { type: 'equipmentHighlights', sortOrder: 2, data: {
          headline: 'Unsere Ausstattung',
          subline: 'Modernste Technik für eine präzise Diagnostik',
          badgeText: 'State of the Art',
          items: [
            { title: 'Digitales EKG-System', text: 'Ruhe-EKG und Langzeit-EKG mit digitaler Auswertung. Sofortige Befundübermittlung an Kardiologen bei Auffälligkeiten.', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80', category: 'Diagnostik', benefitLabel: 'Ergebnis in 5 Minuten' },
            { title: 'Spirometrie', text: 'Moderne Lungenfunktionsmessung mit grafischer Echtzeit-Darstellung. Für Asthma-Screening, COPD-Kontrolle und Sporttauglichkeit.', image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', category: 'Diagnostik', benefitLabel: 'Sofortiges Ergebnis' },
            { title: 'Point-of-Care-Labor', text: 'CRP, Blutzucker, HbA1c, Troponin und Streptokokken-Schnelltest direkt in der Praxis. Ergebnis innerhalb von 15 Minuten.', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=900&q=80', category: 'Labor', benefitLabel: 'Schnelltest in 15 Min.' },
            { title: 'Digitale Patientenakte', text: 'Papierlose Praxis mit verschlüsselter elektronischer Patientenakte. Befunde, Impfpass und Medikamentenplan jederzeit digital verfügbar.', image: 'https://images.unsplash.com/photo-1666214280557-091f08a30b01?w=900&q=80', category: 'IT', benefitLabel: 'ELGA-kompatibel' },
          ],
        }},
      ],
    },
    {
      slug: 'patienten', title: 'Für Patienten', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Informationen für Patienten',
          subline: 'Kassen, Formulare, Notfall-Infos und alles, was Sie vor Ihrem Besuch wissen sollten',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'insuranceInfo', sortOrder: 1, data: {
          headline: 'Kasseninformation',
          subline: 'Mit welchen Kassen wir arbeiten',
          badgeText: 'Alle Kassen',
          items: [
            { title: 'Österreichische Gesundheitskasse (ÖGK)', text: 'Wir sind Vertragsärztin der ÖGK. Alle Kassenleistungen direkt über die e-Card — ohne Zuzahlung für Sie.', typeLabel: 'Vertragskasse', notice: 'Bitte bringen Sie Ihre e-Card und einen Lichtbildausweis mit.' },
            { title: 'BVA / BVAEB', text: 'Wir sind auch Vertragsärztin der Versicherungsanstalt öffentlich Bediensteter, Eisenbahnen und Bergbau.', typeLabel: 'Vertragskasse' },
            { title: 'SVS (Selbstständige)', text: 'Vertragspartnerin der Sozialversicherungsanstalt der Selbstständigen.', typeLabel: 'Vertragskasse' },
            { title: 'KFA / Andere Kassen', text: 'Für KFA und andere Versicherungsträger stellen wir eine Honorarnote aus. Reichen Sie diese bei Ihrer Kasse ein — Sie erhalten in der Regel 80% rückerstattet.', typeLabel: 'Wahlarztkasse', notice: 'Honorarnote wird direkt nach dem Besuch ausgestellt.' },
            { title: 'Privat / Ohne Versicherung', text: 'Selbstzahler sind jederzeit willkommen. Transparente Preisliste erhalten Sie an der Rezeption oder vorab per E-Mail.', typeLabel: 'Privat', cta: { label: 'Preisliste anfordern', href: '/kontakt' } },
          ],
        }},
        { type: 'downloadForms', sortOrder: 2, data: {
          headline: 'Formulare & Downloads',
          subline: 'Laden Sie wichtige Formulare vorab herunter, um Zeit in der Ordination zu sparen',
          items: [
            { title: 'Anamnesebogen', text: 'Bitte füllen Sie den Anamnesebogen vor Ihrem Erstbesuch aus. Er enthält wichtige Fragen zu Ihrer Krankengeschichte, Medikamenten und Allergien.', fileLabel: 'PDF, 2 Seiten', fileHref: '/downloads/anamnesebogen.pdf', metaLabel: 'Erstbesuch' },
            { title: 'Einwilligungserklärung Labordiagnostik', text: 'Datenschutzrechtliche Einwilligung zur Weitergabe von Laborbefunden an kooperierende Labore.', fileLabel: 'PDF, 1 Seite', fileHref: '/downloads/einwilligung-labor.pdf', metaLabel: 'Laborbesuch' },
            { title: 'Medikamentenplan (Vorlage)', text: 'Tragen Sie Ihre aktuellen Medikamente mit Dosierung und Einnahmezeiten ein. Bringen Sie den ausgefüllten Plan zum Termin mit.', fileLabel: 'PDF, 1 Seite', fileHref: '/downloads/medikamentenplan.pdf', metaLabel: 'Jeder Besuch' },
            { title: 'Impfpass-Formular', text: 'Falls Sie keinen Impfpass haben: Füllen Sie dieses Formular mit allen bekannten Impfungen aus, damit wir Ihren digitalen Impfpass erstellen können.', fileLabel: 'PDF, 1 Seite', fileHref: '/downloads/impfpass-formular.pdf', metaLabel: 'Impftermin' },
          ],
        }},
        { type: 'emergencyInfo', sortOrder: 3, data: {
          headline: 'Notfälle & Akutversorgung',
          subline: 'Wichtige Nummern und Anlaufstellen außerhalb unserer Ordinationszeiten',
          badgeText: 'Wichtig',
          introText: 'Bei lebensbedrohlichen Notfällen rufen Sie immer die 144 (Rettung) oder 112 (Euro-Notruf). Für nicht lebensbedrohliche Beschwerden außerhalb unserer Ordinationszeiten stehen Ihnen diese Anlaufstellen zur Verfügung:',
          items: [
            { title: 'Ärztlicher Bereitschaftsdienst Graz', text: 'Abends, nachts und an Wochenenden/Feiertagen für akute, nicht lebensbedrohliche Erkrankungen.', phoneLabel: '141', phoneHref: 'tel:141' },
            { title: 'LKH Graz — Notaufnahme', text: 'Universitätsklinikum Graz, Auenbruggerplatz 1. 24/7 Notfallambulanz für akute Erkrankungen und Verletzungen.', phoneLabel: '+43 316 385 0', phoneHref: 'tel:+433163850' },
            { title: 'Vergiftungszentrale', text: 'Bei Verdacht auf Vergiftung (Medikamente, Chemikalien, Pflanzen, Pilze etc.)  —  24/7 erreichbar.', phoneLabel: '+43 1 406 43 43', phoneHref: 'tel:+4314064343' },
            { title: 'Telefonseelsorge', text: 'Kostenlose, anonyme Krisenberatung — 24 Stunden, 7 Tage.', phoneLabel: '142', phoneHref: 'tel:142' },
          ],
          ctaPrimary: { label: 'Unsere Ordinationszeiten', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Ordinationszeiten',
          subline: 'Wir sind für Sie da — vereinbaren Sie Ihren Termin',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'openingHours', sortOrder: 1, data: {
          headline: 'Ordinationszeiten',
          subline: 'Wann Sie uns besuchen können',
          days: [
            { label: 'Montag', hours: '08:00 — 12:00 Uhr & 14:00 — 18:00 Uhr' },
            { label: 'Dienstag', hours: '08:00 — 12:00 Uhr & 14:00 — 18:00 Uhr' },
            { label: 'Mittwoch', hours: '08:00 — 12:00 Uhr', note: 'Nur Vormittag' },
            { label: 'Donnerstag', hours: '08:00 — 12:00 Uhr & 14:00 — 18:00 Uhr' },
            { label: 'Freitag', hours: '08:00 — 14:00 Uhr', note: 'Durchgehend' },
            { label: 'Samstag', hours: '', closed: true, note: 'Geschlossen' },
            { label: 'Sonntag', hours: '', closed: true, note: 'Geschlossen' },
          ],
          acuteCareText: 'Akutsprechstunde ohne Termin: Täglich 08:00–09:00 Uhr für akute Beschwerden.',
          holidayNote: 'An Feiertagen und während des Sommerurlaubs informieren wir Sie auf unserer Website und am Anrufbeantworter über die Vertretung.',
          ctaPrimary: { label: 'Online Termin buchen', href: '/kontakt' },
        }},
        { type: 'locationContact', sortOrder: 2, data: {
          headline: 'Anfahrt & Kontakt',
          subline: 'Zentral in der Grazer Innenstadt',
          introText: 'Unsere Praxis befindet sich im 1. OG des Ärztehauses Herrengasse 12, direkt gegenüber dem Landhaus. Barrierefreier Zugang über den Aufzug im Hauseingang.',
          image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.5!2d15.44!3d47.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDA0JzEyLjAiTiAxNcKwMjYnMjQuMCJF!5e0!3m2!1sde!2sat!4v1700000000000',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+43 316 812 300' },
            { icon: 'mail', label: 'E-Mail', value: 'ordination@dr-berger.at' },
            { icon: 'map', label: 'Adresse', value: 'Herrengasse 12, 1. OG, 8010 Graz' },
            { icon: 'bus', label: 'Öffentlich', value: 'Straßenbahn Linie 1, 3, 6, 7 — Haltestelle Hauptplatz' },
          ],
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          secondaryCta: { label: 'Route planen', href: 'https://www.google.com/maps/dir//Herrengasse+12,+8010+Graz' },
        }},
      ],
    },
  ],
};
