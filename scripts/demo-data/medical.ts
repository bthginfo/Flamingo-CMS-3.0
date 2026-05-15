/**
 * Rich demo seed: Medical (Praxis Dr. Helena Berger)
 * Section types match template keys in templates/index.ts:
 * hero, serviceOverview, treatmentDetail, diagnostics, doctorTeam, practiceTeam,
 * certifications, patientInfo, insuranceInfo, downloadForms, appointmentCta,
 * openingHours, emergencyInfo, practiceGallery, equipmentHighlights, valuesGrid,
 * locationContact, faq, richText
 */
export const MEDICAL_CONFIG = {
  slug: 'demo-medical',
  name: 'Praxis Dr. Helena Berger',
  industry: 'medical' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Praxis Dr. Helena Berger',
    tagline: 'Ihre Hausarztpraxis in Berlin-Mitte — kompetent, einfühlsam, modern',
    primaryColor: '#1a4d6e',
    secondaryColor: '#2a7ab5',
    accentColor: '#4ecdc4',
  },
  contact: { phone: '+49 30 234 567 89', email: 'praxis@dr-berger.de', address: 'Friedrichstraße 118, 10117 Berlin' },
  socialLinks: { },
  openingHours: [
    { day: 'Mo, Di, Do', hours: '08:00–13:00, 14:30–18:00' },
    { day: 'Mi, Fr', hours: '08:00–13:00' },
    { day: 'Sa & So', hours: 'Geschlossen' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Team', href: '/team', type: 'link' },
    { label: 'Patienten-Info', href: '/patienten', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Termin buchen', href: '/kontakt' },
  footerColumns: [
    { title: 'Praxis', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Team', href: '/team' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Patienten', items: [{ text: 'Patienten-Info', href: '/patienten' }, { text: 'Sprechzeiten', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: '+49 30 234 567 89' }, { text: 'praxis@dr-berger.de' }, { text: 'Friedrichstraße 118, Berlin-Mitte' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Termin buchen', href: '/kontakt' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Praxis Dr. Helena Berger',
          subline: 'Ihre Hausarztpraxis in Berlin-Mitte. Hausärztliche Versorgung, Vorsorge und Diagnostik — für die ganze Familie.',
          badgeText: 'Kassenärztliche Praxis',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
          specialtyLabel: 'Allgemeinmedizin & Innere Medizin',
          trustItems: ['Alle Kassen', 'Kurze Wartezeiten', 'Online-Terminbuchung'],
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          emergencyCta: { label: 'Notfall: 112', href: 'tel:112' },
          secondaryCta: { label: 'Leistungen ansehen', href: '/leistungen' },
        }},
        { type: 'serviceOverview', sortOrder: 1, data: {
          headline: 'Unsere Leistungen',
          subline: 'Ganzheitliche medizinische Versorgung',
          badgeText: 'Kassenleistung & Privat',
          items: [
            { title: 'Hausärztliche Versorgung', text: 'Ihr erster Ansprechpartner: Akutbehandlung, Dauermedikation, Überweisungen und Koordination.', icon: 'stethoscope', category: 'Grundversorgung', cta: { label: 'Details', href: '/leistungen' } },
            { title: 'Vorsorge & Check-up', text: 'Gesundheitscheck ab 35, Hautkrebs-Screening, Impfberatung und Krebsvorsorge.', icon: 'shield', category: 'Prävention', cta: { label: 'Details', href: '/leistungen' } },
            { title: 'Innere Medizin', text: 'EKG, Langzeit-Blutdruck, Ultraschall (Abdomen, Schilddrüse) und Lungenfunktion.', icon: 'heart-pulse', category: 'Diagnostik', cta: { label: 'Details', href: '/leistungen' } },
            { title: 'Reisemedizin', text: 'Individuelle Reiseberatung, Impfungen und Malaria-Prophylaxe.', icon: 'plane', category: 'Beratung', cta: { label: 'Details', href: '/leistungen' } },
            { title: 'Psychosomatik', text: 'Psychosomatische Grundversorgung: Gesprächstherapie, Stressbewältigung, Burnout-Prävention.', icon: 'brain', category: 'Beratung', cta: { label: 'Details', href: '/leistungen' } },
            { title: 'Sportmedizin', text: 'Sporttauglichkeitsuntersuchung, Trainingsberatung und Belastungs-EKG.', icon: 'activity', category: 'Spezial', cta: { label: 'Details', href: '/leistungen' } },
          ],
          ctaPrimary: { label: 'Alle Leistungen', href: '/leistungen' },
        }},
        { type: 'valuesGrid', sortOrder: 2, data: {
          headline: 'Unsere Werte',
          subline: 'Was uns auszeichnet',
          items: [
            { icon: 'heart', title: 'Einfühlsam', text: 'Wir nehmen uns Zeit für Sie und hören zu.' },
            { icon: 'clock', title: 'Kurze Wartezeiten', text: 'Strukturierte Terminvergabe für minimale Wartezeit.' },
            { icon: 'shield', title: 'Evidenzbasiert', text: 'Medizin nach aktuellem wissenschaftlichen Stand.' },
            { icon: 'users', title: 'Familiär', text: 'Wir behandeln die ganze Familie — vom Kind bis zu den Großeltern.' },
          ],
        }},
        { type: 'appointmentCta', sortOrder: 3, data: {
          headline: 'Jetzt Termin vereinbaren',
          subline: 'Online oder telefonisch',
          introText: 'Buchen Sie Ihren Wunschtermin bequem über unsere Online-Terminvergabe oder rufen Sie uns an.',
          notes: ['Akut-Termine oft am selben Tag', 'Videosprechstunde möglich', 'Neupatienten jederzeit willkommen'],
          onlineCta: { label: 'Online buchen', href: '/kontakt' },
          phoneCta: { label: 'Anrufen: 030 234 567 89', href: 'tel:+493023456789' },
        }},
      ],
    },
    /* ─── Leistungen ─── */
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          subline: 'Umfassende hausärztliche Versorgung und moderne Diagnostik',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'serviceOverview', sortOrder: 1, data: {
          headline: 'Leistungsspektrum',
          subline: 'Diagnostik, Prävention und Therapie',
          items: [
            { title: 'Hausärztliche Versorgung', text: 'Akutbehandlung, Dauermedikation, Disease-Management-Programme (DMP) für Diabetes und Asthma.', icon: 'stethoscope', category: 'Grundversorgung', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Vorsorge & Check-up', text: 'Gesundheits-Check ab 35, Hautkrebsscreening, Jugenduntersuchungen J1/J2, Impfberatung.', icon: 'shield', category: 'Prävention', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'EKG & Langzeit-EKG', text: 'Ruhe-EKG, Belastungs-EKG auf dem Ergometer und 24-Stunden-Langzeit-EKG.', icon: 'heart-pulse', category: 'Diagnostik', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Ultraschall', text: 'Sonographie von Abdomen, Schilddrüse, Halsschlagadern und Gelenken.', icon: 'scan', category: 'Diagnostik', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Lungenfunktionstest', text: 'Spirometrie zur Diagnostik von Asthma, COPD und Allergien.', icon: 'wind', category: 'Diagnostik', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Labordiagnostik', text: 'Umfangreiches hauseigenes Labor: Blutbild, Blutzucker, Cholesterin, Schilddrüse, CRP.', icon: 'flask', category: 'Diagnostik', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Reisemedizin & Impfungen', text: 'Impfberatung, Reiseprophylaxe, Malaria-Beratung, Gelbfieber-Impfstelle.', icon: 'plane', category: 'Beratung', cta: { label: 'Termin buchen', href: '/kontakt' } },
            { title: 'Psychosomatische Grundversorgung', text: 'Gesprächstherapie, Stressbewältigung, Burnout-Prävention, Schlafstörungen.', icon: 'brain', category: 'Beratung', cta: { label: 'Termin buchen', href: '/kontakt' } },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'equipmentHighlights', sortOrder: 2, data: {
          headline: 'Moderne Ausstattung',
          subline: 'Diagnosetechnik auf aktuellem Stand',
          items: [
            { title: 'Digitale Sonographie', text: 'Hochauflösendes Ultraschallgerät für Abdomen, Schilddrüse und Gefäße.', category: 'Diagnostik', benefitLabel: 'Sofortige Bildgebung' },
            { title: 'Belastungs-EKG', text: 'Ergometrie zur Belastungsdiagnostik des Herzens.', category: 'Kardiologie', benefitLabel: 'Herzleistung unter Last' },
            { title: 'Hauseigenes Labor', text: 'Ergebnisse für wichtige Parameter innerhalb von 15 Minuten.', category: 'Labor', benefitLabel: '15 Min. Ergebnisse' },
          ],
        }},
      ],
    },
    /* ─── Team ─── */
    {
      slug: 'team', title: 'Team', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unser Team',
          subline: 'Kompetent, einfühlsam und immer für Sie da',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'doctorTeam', sortOrder: 1, data: {
          headline: 'Ärztliches Team',
          subline: 'Erfahrung und Spezialisierung',
          doctors: [
            { name: 'Dr. med. Helena Berger', title: 'Fachärztin für Allgemeinmedizin', specialty: 'Innere Medizin, Reisemedizin, Psychosomatik', bio: 'Dr. Berger führt die Praxis seit 2015. Studium an der Charité Berlin, Facharztausbildung am Vivantes-Klinikum. Zusatzqualifikation Reisemedizin und psychosomatische Grundversorgung.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80', languages: ['Deutsch', 'Englisch', 'Französisch'], appointmentCta: { label: 'Termin bei Dr. Berger', href: '/kontakt' } },
            { name: 'Dr. med. Thomas Richter', title: 'Facharzt für Innere Medizin', specialty: 'Kardiologie, Sportmedizin', bio: 'Dr. Richter ist seit 2019 in der Praxis. Schwerpunkt Herz-Kreislauf-Diagnostik, Sportmedizin und Belastungs-EKG. Betreut u. a. lokale Sportvereine.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80', languages: ['Deutsch', 'Englisch'], appointmentCta: { label: 'Termin bei Dr. Richter', href: '/kontakt' } },
          ],
        }},
        { type: 'practiceTeam', sortOrder: 2, data: {
          headline: 'Praxisteam',
          subline: 'Die guten Seelen unserer Praxis',
          members: [
            { name: 'Sandra Müller', role: 'Medizinische Fachangestellte (MFA)', bio: 'Sandra ist Ihre erste Ansprechpartnerin am Empfang. Terminkoordination und Laborassistenz.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80' },
            { name: 'Katharina Schmidt', role: 'Medizinische Fachangestellte (MFA)', bio: 'Katharina unterstützt bei EKG, Ultraschall und Blutentnahmen.', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80' },
            { name: 'Lisa Weber', role: 'Praxismanagerin', bio: 'Lisa kümmert sich um Organisation, Abrechnung und die Koordination mit Fachärzten.', image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e2b?w=900&q=80' },
          ],
        }},
        { type: 'certifications', sortOrder: 3, data: {
          headline: 'Qualifikationen & Zertifizierungen',
          subline: 'Unser Qualitätsanspruch',
          items: [
            { icon: 'award', title: 'Kassenärztliche Zulassung', text: 'Zugelassen für alle gesetzlichen und privaten Krankenkassen.', metaLabel: 'KV Berlin' },
            { icon: 'globe', title: 'Gelbfieber-Impfstelle', text: 'Offizielle WHO-gelistete Gelbfieber-Impfstelle.', metaLabel: 'WHO-zertifiziert' },
            { icon: 'heart', title: 'DMP-Praxis', text: 'Zertifiziert für Disease-Management-Programme: Diabetes Typ 2, Asthma, KHK.', metaLabel: 'KV-geprüft' },
            { icon: 'shield', title: 'QM nach QEP', text: 'Qualitätsmanagement nach dem QEP-System der KBV.', metaLabel: 'QEP-zertifiziert' },
          ],
        }},
      ],
    },
    /* ─── Patienten-Info ─── */
    {
      slug: 'patienten', title: 'Patienten-Info', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Informationen für Patienten',
          subline: 'Alles Wichtige rund um Ihren Praxisbesuch',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'patientInfo', sortOrder: 1, data: {
          headline: 'Gut vorbereitet zum Arzt',
          subline: 'Was Sie mitbringen und wissen sollten',
          introText: 'Damit Ihr Besuch reibungslos verläuft, haben wir die wichtigsten Informationen zusammengestellt.',
          cards: [
            { icon: 'clipboard', title: 'Erstbesuch', text: 'Was Sie beim ersten Besuch mitbringen sollten:', items: ['Versichertenkarte', 'Impfpass', 'Aktuelle Medikamentenliste', 'Befunde / Arztbriefe'] },
            { icon: 'clock', title: 'Wartezeiten', text: 'So minimieren Sie Ihre Wartezeit:', items: ['Online-Termin buchen', 'Sprechstunde am Vormittag bevorzugen', 'Pünktlich erscheinen (5 Min. vorher)'] },
            { icon: 'file-text', title: 'Rezepte & Überweisungen', text: 'So erhalten Sie Folgerezepte:', items: ['Online über E-Mail bestellen', 'Telefonisch anfragen', 'Abholung ab nächstem Werktag'] },
          ],
        }},
        { type: 'insuranceInfo', sortOrder: 2, data: {
          headline: 'Kassen & Versicherungen',
          subline: 'Wir behandeln gesetzlich und privat Versicherte',
          items: [
            { title: 'Gesetzliche Krankenversicherung', text: 'Wir behandeln Patienten aller gesetzlichen Krankenkassen. Versichertenkarte bitte mitbringen.', typeLabel: 'GKV', notice: 'IGeL-Leistungen (z. B. Reiseimpfungen) werden separat berechnet.' },
            { title: 'Private Krankenversicherung', text: 'Privat Versicherte und Beihilfeberechtigte nach GOÄ.', typeLabel: 'PKV' },
            { title: 'Selbstzahler', text: 'Individuelle Gesundheitsleistungen auch ohne Versicherungsschutz möglich.', typeLabel: 'Selbstzahler', notice: 'Preisliste auf Anfrage.' },
          ],
        }},
        { type: 'downloadForms', sortOrder: 3, data: {
          headline: 'Downloads & Formulare',
          subline: 'Formulare vorab ausfüllen spart Zeit',
          items: [
            { title: 'Anamnesebogen', text: 'Bitte vor dem Erstbesuch ausfüllen.', fileLabel: 'PDF herunterladen', fileHref: '/downloads/anamnesebogen.pdf', metaLabel: 'PDF, 120 KB' },
            { title: 'Datenschutzerklärung', text: 'Einwilligung zur Datenverarbeitung nach DSGVO.', fileLabel: 'PDF herunterladen', fileHref: '/downloads/datenschutz.pdf', metaLabel: 'PDF, 85 KB' },
            { title: 'Einverständnis Impfung', text: 'Aufklärungsbogen und Einwilligung für Impfungen.', fileLabel: 'PDF herunterladen', fileHref: '/downloads/impf-einwilligung.pdf', metaLabel: 'PDF, 95 KB' },
          ],
        }},
        { type: 'emergencyInfo', sortOrder: 4, data: {
          headline: 'Notfall & Bereitschaft',
          subline: 'Außerhalb der Sprechzeiten',
          introText: 'Bei lebensbedrohlichen Notfällen rufen Sie bitte sofort den Rettungsdienst.',
          items: [
            { title: 'Rettungsdienst', text: 'Bei akuter Lebensgefahr', phoneLabel: '112', phoneHref: 'tel:112' },
            { title: 'Ärztlicher Bereitschaftsdienst', text: 'Außerhalb der Sprechzeiten (abends, Wochenende, Feiertage)', phoneLabel: '116 117', phoneHref: 'tel:116117' },
            { title: 'Giftnotruf Berlin', text: 'Vergiftungsverdacht — 24/7 Beratung', phoneLabel: '030 192 40', phoneHref: 'tel:+493019240' },
          ],
          ctaPrimary: { label: 'Praxis-Telefon: 030 234 567 89', href: 'tel:+493023456789' },
        }},
      ],
    },
    /* ─── FAQ ─── */
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Antworten rund um Ihren Praxisbesuch',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          subline: 'Wir beantworten Ihre Fragen',
          items: [
            { question: 'Nehmen Sie neue Patienten auf?', answer: 'Ja, wir nehmen jederzeit neue Patienten auf. Bitte bringen Sie zum Ersttermin Ihre Versichertenkarte, Impfpass und ggf. aktuelle Befunde mit.' },
            { question: 'Bieten Sie Videosprechstunden an?', answer: 'Ja, für Folgetermine und bestimmte Beratungen bieten wir Videosprechstunden an. Bitte bei der Terminbuchung angeben.' },
            { question: 'Wie bekomme ich ein Folgerezept?', answer: 'Folgerezepte können Sie telefonisch oder per E-Mail bestellen. Abholung ab dem nächsten Werktag.' },
            { question: 'Bekomme ich kurzfristig einen Termin?', answer: 'Akut-Termine sind in der Regel am selben oder nächsten Tag verfügbar. Rufen Sie morgens an.' },
            { question: 'Welche Impfungen bieten Sie an?', answer: 'Alle STIKO-empfohlenen Impfungen, Reiseimpfungen inkl. Gelbfieber, Grippeimpfung und COVID-19.' },
            { question: 'Gibt es Parkplätze?', answer: 'Parkmöglichkeiten im Parkhaus Friedrichstraße (5 Min.). U-Bahn: Friedrichstraße (U6, S-Bahn).' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Kontakt', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Über uns ─── */
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Über unsere Praxis',
          subline: 'Moderne Medizin mit persönlicher Betreuung',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'story', sortOrder: 1, data: {
          headline: 'Unsere Geschichte',
          subline: 'Von der Einzelpraxis zum Gesundheitszentrum',
          badgeText: 'Seit 2008',
          storyText: 'Dr. Laura Berger gründete die Praxis 2008 mit einer klaren Vision: moderne, evidenzbasierte Medizin, die den Menschen in den Mittelpunkt stellt. Was als Einzelpraxis begann, ist heute ein Gesundheitszentrum mit vier Fachärztinnen und Ärzten.\n\nUnsere Philosophie verbindet Schulmedizin auf höchstem Niveau mit ganzheitlicher Patientenbetreuung — weil Gesundheit mehr ist als die Abwesenheit von Krankheit.',
          imagePrimary: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80',
          imageSecondary: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=80',
          founderName: 'Dr. Laura Berger',
          founderRole: 'Praxisgründerin & Fachärztin für Innere Medizin',
          founderQuote: 'Jeder Patient verdient Zeit, Zuwendung und die bestmögliche Behandlung.',
          values: [
            { icon: 'heart', title: 'Patientennähe', text: 'Wir nehmen uns Zeit für jeden Patienten — ohne Massenabfertigung.' },
            { icon: 'shield', title: 'Evidenzbasiert', text: 'Behandlungen nach aktuellem Stand der Wissenschaft.' },
            { icon: 'users', title: 'Teamarbeit', text: 'Vier Fachrichtungen unter einem Dach für ganzheitliche Versorgung.' },
          ],
          milestones: [
            { year: '2008', title: 'Praxisgründung', text: 'Dr. Berger eröffnet die Praxis in der Friedrichstraße.' },
            { year: '2014', title: 'Erweiterung', text: 'Dr. Schneider und Dr. Weber stoßen zum Team.' },
            { year: '2019', title: 'Digitalisierung', text: 'Online-Terminbuchung und digitale Patientenakte.' },
            { year: '2023', title: 'Gesundheitszentrum', text: 'Erweiterung auf 4 Färzte, neue Räumlichkeiten mit Diagnostikzentrum.' },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Das sagen unsere Patienten',
          subline: 'Erfahrungen aus erster Hand',
          badgeText: 'Patientenstimmen',
          ratingValue: '4.9',
          ratingCount: '420+',
          items: [
            { name: 'Maria S.', location: 'Berlin-Mitte', text: 'Endlich eine Praxis, die sich wirklich Zeit nimmt. Dr. Berger hat mein chronisches Problem erkannt, wo andere aufgegeben hatten.', rating: 5, avatarUrl: '' },
            { name: 'Peter H.', location: 'Prenzlauer Berg', text: 'Kurze Wartezeiten, freundliches Team, modernste Diagnostik — besser geht es nicht.', rating: 5, avatarUrl: '' },
            { name: 'Anna L.', location: 'Charlottenburg', text: 'Die Online-Terminbuchung ist super praktisch und das Team ist immer hilfsbereit und empathisch.', rating: 4, avatarUrl: '' },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Sprechzeiten',
          subline: 'So erreichen Sie uns',
          bgImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1800&q=85',
        }},
        { type: 'openingHours', sortOrder: 1, data: {
          headline: 'Sprechzeiten',
          subline: 'Unsere Öffnungszeiten',
          acuteCareText: 'Akutsprechstunde: Täglich 08:00–09:00 ohne Termin.',
          holidayNote: 'An Feiertagen geschlossen. Bereitschaftsdienst: 116 117.',
          days: [
            { label: 'Montag', hours: '08:00–13:00, 14:30–18:00' },
            { label: 'Dienstag', hours: '08:00–13:00, 14:30–18:00' },
            { label: 'Mittwoch', hours: '08:00–13:00', note: 'Nachmittag: OP / Hausbesuche' },
            { label: 'Donnerstag', hours: '08:00–13:00, 14:30–18:00' },
            { label: 'Freitag', hours: '08:00–13:00' },
            { label: 'Samstag & Sonntag', hours: 'Geschlossen', closed: true },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'locationContact', sortOrder: 2, data: {
          headline: 'Anfahrt & Kontakt',
          subline: 'Zentral in Berlin-Mitte',
          introText: 'Unsere Praxis befindet sich in der Friedrichstraße, nur 2 Minuten vom U-Bahnhof Friedrichstraße.',
          image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.5!2d13.39!3d52.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMxJzEyLjAiTiAxM8KwMjMnMjQuMCJF!5e0!3m2!1sde!2sde!4v1700000000000',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+49 30 234 567 89' },
            { icon: 'mail', label: 'E-Mail', value: 'praxis@dr-berger.de' },
            { icon: 'map-pin', label: 'Adresse', value: 'Friedrichstraße 118, 10117 Berlin' },
            { icon: 'train', label: 'ÖPNV', value: 'U6 / S-Bahn Friedrichstraße (2 Min.)' },
          ],
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          secondaryCta: { label: 'Anrufen', href: 'tel:+493023456789' },
        }},
      ],
    },
  ],
};
