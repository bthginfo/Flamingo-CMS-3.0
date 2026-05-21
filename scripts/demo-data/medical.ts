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
            { title: 'Hausärztliche Versorgung', text: 'Ihr erster Ansprechpartner: Akutbehandlung, Dauermedikation, Überweisungen und Koordination.', icon: 'stethoscope', category: 'Grundversorgung', cta: { label: 'Details', href: '/c/services/hausaerztliche-versorgung' } },
            { title: 'Vorsorge & Check-up', text: 'Gesundheitscheck ab 35, Hautkrebs-Screening, Impfberatung und Krebsvorsorge.', icon: 'shield', category: 'Prävention', cta: { label: 'Details', href: '/c/services/vorsorge-checkup' } },
            { title: 'Innere Medizin', text: 'EKG, Langzeit-Blutdruck, Ultraschall (Abdomen, Schilddrüse) und Lungenfunktion.', icon: 'heart-pulse', category: 'Diagnostik', cta: { label: 'Details', href: '/c/services/innere-medizin' } },
            { title: 'Reisemedizin', text: 'Individuelle Reiseberatung, Impfungen und Malaria-Prophylaxe.', icon: 'plane', category: 'Beratung', cta: { label: 'Details', href: '/c/services/reisemedizin' } },
            { title: 'Psychosomatik', text: 'Psychosomatische Grundversorgung: Gesprächstherapie, Stressbewältigung, Burnout-Prävention.', icon: 'brain', category: 'Beratung', cta: { label: 'Details', href: '/c/services/psychosomatik' } },
            { title: 'Sportmedizin', text: 'Sporttauglichkeitsuntersuchung, Trainingsberatung und Belastungs-EKG.', icon: 'activity', category: 'Spezial', cta: { label: 'Details', href: '/c/services/sportmedizin' } },
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
        { type: 'newsPreview', sortOrder: 4, data: {
          headline: 'Praxis-News',
          subline: 'Aktuelles aus unserer Praxis',
          collectionKey: 'news',
          linkLabel: 'Alle Beiträge',
          linkHref: '/neuigkeiten',
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
            { title: 'Hausärztliche Versorgung', text: 'Akutbehandlung, Dauermedikation, Disease-Management-Programme (DMP) für Diabetes und Asthma.', icon: 'stethoscope', category: 'Grundversorgung', cta: { label: 'Details', href: '/c/services/hausaerztliche-versorgung' } },
            { title: 'Vorsorge & Check-up', text: 'Gesundheits-Check ab 35, Hautkrebsscreening, Jugenduntersuchungen J1/J2, Impfberatung.', icon: 'shield', category: 'Prävention', cta: { label: 'Details', href: '/c/services/vorsorge-checkup' } },
            { title: 'EKG & Langzeit-EKG', text: 'Ruhe-EKG, Belastungs-EKG auf dem Ergometer und 24-Stunden-Langzeit-EKG.', icon: 'heart-pulse', category: 'Diagnostik', cta: { label: 'Details', href: '/c/services/kardiologie' } },
            { title: 'Ultraschall', text: 'Sonographie von Abdomen, Schilddrüse, Halsschlagadern und Gelenken.', icon: 'scan', category: 'Diagnostik', cta: { label: 'Details', href: '/c/services/innere-medizin' } },
            { title: 'Lungenfunktionstest', text: 'Spirometrie zur Diagnostik von Asthma, COPD und Allergien.', icon: 'wind', category: 'Diagnostik', cta: { label: 'Details', href: '/c/services/innere-medizin' } },
            { title: 'Labordiagnostik', text: 'Umfangreiches hauseigenes Labor: Blutbild, Blutzucker, Cholesterin, Schilddrüse, CRP.', icon: 'flask', category: 'Diagnostik', cta: { label: 'Details', href: '/c/services/innere-medizin' } },
            { title: 'Reisemedizin & Impfungen', text: 'Impfberatung, Reiseprophylaxe, Malaria-Beratung, Gelbfieber-Impfstelle.', icon: 'plane', category: 'Beratung', cta: { label: 'Details', href: '/c/services/reisemedizin' } },
            { title: 'Psychosomatische Grundversorgung', text: 'Gesprächstherapie, Stressbewältigung, Burnout-Prävention, Schlafstörungen.', icon: 'brain', category: 'Beratung', cta: { label: 'Details', href: '/c/services/psychosomatik' } },
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
  collections: [
    {
      key: 'news', label: 'Praxis-News', items: [
        { slug: 'neue-videosprechstunde', title: 'Neu: Videosprechstunde für alle Patienten verfügbar', priority: 0, data: { excerpt: 'Ab sofort bieten wir Videosprechstunden für Folgeberatungen, Befundbesprechungen und leichte Beschwerden an.', content: '<p>Die digitale Medizin hält Einzug in unsere Praxis. Ab sofort können Sie für bestimmte Anliegen eine Videosprechstunde buchen — bequem von zuhause.</p><p>Geeignet für: Befundbesprechungen, Folgerezepte, leichte Beschwerden, Ernährungsberatung. Buchbar über unser Online-Portal.</p>', image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80', date: '2025-09-01' } },
        { slug: 'grippeschutzimpfung-2025', title: 'Grippeschutzimpfung 2025: Jetzt Termin sichern', priority: 1, data: { excerpt: 'Die Grippesaison steht vor der Tür. Wir haben den neuen angepassten Impfstoff vorrätig.', content: '<p>Die STIKO empfiehlt die jährliche Grippeschutzimpfung besonders für Risikogruppen, medizinisches Personal und alle ab 60 Jahren. Der neue tetravalente Impfstoff für 2025/26 ist ab sofort in unserer Praxis verfügbar.</p><p>Impfung ohne Termin: Montag–Freitag während der Akutsprechstunde (8:00–9:00 Uhr).</p>', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80', date: '2025-10-01' } },
        { slug: 'dr-weber-facharzt', title: 'Willkommen Dr. Weber: Neuer Facharzt für Kardiologie', priority: 2, data: { excerpt: 'Wir freuen uns, Dr. Maximilian Weber als neuen Kardiologen in unserem Team begrüßen zu dürfen.', content: '<p>Ab November verstärkt Dr. Maximilian Weber unser Team. Als Facharzt für Innere Medizin und Kardiologie bringt er 15 Jahre Erfahrung aus der Charité mit.</p><p>Schwerpunkte: Präventive Kardiologie, Echokardiografie, Belastungs-EKG, Herzrhythmusstörungen. Terminbuchung ab sofort möglich.</p>', image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80', date: '2025-11-01' } },
      ],
    },
    {
      key: 'services', label: 'Leistungen', items: [
        { slug: 'innere-medizin', title: 'Innere Medizin & Vorsorge', priority: 0, data: { excerpt: 'Ganzheitliche internistische Diagnostik und Vorsorge auf höchstem Niveau.', description: 'Unsere internistische Abteilung bietet umfassende Vorsorgeuntersuchungen, Check-ups und Diagnostik. Von der Blutuntersuchung über Ultraschall bis zur Lungenfunktion — alles unter einem Dach.', features: ['Gesundheits-Check-up', 'Labordiagnostik', 'Ultraschall (Abdomen, Schilddrüse)', 'Lungenfunktionstest', 'EKG & Belastungs-EKG', 'Ernährungsberatung'], image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', content: '<h3>Ganzheitliche Innere Medizin</h3><p>Als Internisten betrachten wir den Menschen als Ganzes. Unsere Diagnostik umfasst modernste Ultraschallgeräte, ein hauseigenes Labor mit Sofort-Ergebnissen und digitale Befundübermittlung.</p><p>Der Gesundheits-Check-up ab 35: In 90 Minuten erhalten Sie ein umfassendes Bild Ihrer Gesundheit — Blutbild, Ultraschall, EKG und ärztliches Gespräch inklusive.</p>', gallery: ['https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=80'], price: 'Kassenleistung / IGeL ab 85 €', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
        { slug: 'kardiologie', title: 'Kardiologie', priority: 1, data: { excerpt: 'Moderne Herzdiagnostik mit Echokardiografie und Langzeit-EKG.', description: 'Dr. Weber bietet das gesamte Spektrum der nicht-invasiven Kardiologie. Von der Vorsorge bis zur Nachsorge nach Herz-Kreislauf-Erkrankungen begleiten wir Sie kompetent.', features: ['Echokardiografie', 'Belastungs-EKG', 'Langzeit-EKG (24h)', 'Langzeit-Blutdruck', 'Herzrhythmus-Analyse', 'Kardiovaskuläre Prävention'], image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80', content: '<h3>Ihr Herz in besten Händen</h3><p>Dr. Weber bringt 15 Jahre kardiologische Erfahrung aus der Charité mit. Mit modernster Echokardiografie und Belastungsdiagnostik erkennen wir Herzerkrankungen frühzeitig — oft bevor Symptome auftreten.</p><p>Besonders wichtig: Die kardiovaskuläre Risikoanalyse für Männer ab 40 und Frauen ab 50. In 60 Minuten verschaffen wir Klarheit über Ihr persönliches Herzrisiko.</p>', gallery: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&q=80'], price: 'Herz-Check ab 180 €', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
        { slug: 'sportmedizin', title: 'Sportmedizin', priority: 2, data: { excerpt: 'Sportärztliche Untersuchung, Leistungsdiagnostik und Trainingsberatung.', description: 'Ob Leistungssportler oder Wiedereinsteiger: Unsere sportmedizinische Abteilung bietet professionelle Leistungsdiagnostik, Bewegungsanalyse und individuelle Trainingsempfehlungen.', features: ['Sportärztliche Vorsorge', 'Laktatstufentest', 'Spiroergometrie', 'Bewegungsanalyse', 'Trainingsberatung', 'Sportler-Check-up'], image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=80', content: '<h3>Leistung messen, Potenzial entfalten</h3><p>Unsere Spiroergometrie misst exakt Ihre maximale Sauerstoffaufnahme (VO2max), anaerobe Schwelle und optimale Trainingszonen. Ideal für Marathonläufer, Radfahrer und ambitionierte Hobbysportler.</p><p>Nach der Diagnostik erhalten Sie einen individuellen Trainingsplan mit Herzfrequenz-Zonen und Periodisierungs-Empfehlungen.</p>', gallery: ['https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=80', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80'], price: 'Leistungsdiagnostik ab 220 €', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
        { slug: 'hausaerztliche-versorgung', title: 'Hausärztliche Versorgung', priority: 3, data: { excerpt: 'Ihr erster Ansprechpartner für alle gesundheitlichen Fragen.', description: 'Als Hausärzte sind wir Ihre erste Anlaufstelle: Von der Akutbehandlung über Dauermedikation bis zur Koordination mit Fachärzten. Wir begleiten Sie langfristig und kennen Ihre Krankengeschichte.', features: ['Akutbehandlung', 'Dauermedikation', 'Überweisungsmanagement', 'Chroniker-Programme (DMP)', 'Hausbesuche', 'Familienmedizin'], image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80', content: '<h3>Ihr Hausarzt — ein Leben lang</h3><p>Wir kennen Sie, Ihre Familie und Ihre Krankengeschichte. Als Hausärzte koordinieren wir Ihre gesamte medizinische Versorgung und sind Ihr erster Ansprechpartner bei allen Beschwerden.</p><p>Unser DMP-Programm für chronisch Erkrankte (Diabetes, KHK, Asthma, COPD) bietet strukturierte Betreuung mit regelmäßigen Kontrollen und enger Facharzt-Vernetzung.</p>', price: 'Kassenleistung', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
        { slug: 'vorsorge-checkup', title: 'Vorsorge & Check-up', priority: 4, data: { excerpt: 'Gesundheitscheck ab 35, Hautkrebs-Screening und Impfberatung.', description: 'Prävention ist die beste Medizin. Unsere umfassenden Vorsorgeprogramme erkennen Risiken frühzeitig: Vom Gesundheits-Check-up über Hautkrebs-Screening bis zur individuellen Impfberatung.', features: ['Gesundheits-Check ab 35', 'Hautkrebs-Screening', 'Impfberatung & Impfungen', 'Krebsvorsorge', 'Schilddrüsen-Screening', 'PSA-Test'], image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=80', content: '<h3>Vorsorge rettet Leben</h3><p>Der Gesundheits-Check ab 35 ist eine Kassenleistung, die alle 3 Jahre in Anspruch genommen werden kann. Wir ergänzen ihn auf Wunsch durch sinnvolle IGeL-Leistungen wie Schilddrüsen-Ultraschall oder großes Blutbild.</p><p>Unser Hautkrebs-Screening mit Dermatoskop erkennt verdächtige Veränderungen frühzeitig. Ab 35 alle 2 Jahre Kassenleistung.</p>', price: 'Kassenleistung / Erweiterter Check ab 120 €', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
        { slug: 'reisemedizin', title: 'Reisemedizin', priority: 5, data: { excerpt: 'Individuelle Reiseberatung, Impfungen und Malaria-Prophylaxe.', description: 'Ob Fernreise oder Europa-Trip: Wir beraten Sie individuell zu Impfungen, Malaria-Prophylaxe und gesundheitlichen Risiken Ihres Reiseziels. Mit aktuellem WHO- und CRM-Wissen.', features: ['Reise-Impfberatung', 'Gelbfieber-Impfung', 'Malaria-Prophylaxe', 'Reiseapotheke', 'Höhenmedizin', 'Tropenmedizinische Beratung'], image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80', content: '<h3>Gesund reisen</h3><p>Wir sind zertifizierte Gelbfieber-Impfstelle und beraten nach aktuellen WHO- und CRM-Empfehlungen. Idealerweise kommen Sie 6–8 Wochen vor Reiseantritt zur Beratung.</p><p>Unser Service: Individueller Impfplan, Malaria-Risikoeinschätzung, Reiseapotheke-Empfehlung und Höhenmedizin-Beratung für Trekking-Reisen.</p>', price: 'Beratung 25 € / Impfungen nach GOÄ', cta: { label: 'Reiseberatung buchen', href: '/kontakt' } } },
        { slug: 'psychosomatik', title: 'Psychosomatische Grundversorgung', priority: 6, data: { excerpt: 'Gesprächstherapie, Stressbewältigung und Burnout-Prävention.', description: 'Körper und Seele gehören zusammen. In der psychosomatischen Grundversorgung unterstützen wir Sie bei stressbedingten Beschwerden, Burnout-Prävention und psychosomatischen Symptomen — vertraulich und einfühlsam.', features: ['Ärztliche Gesprächstherapie', 'Stressbewältigung', 'Burnout-Prävention', 'Schlafstörungen', 'Angstberatung', 'Entspannungstechniken'], image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=900&q=80', content: '<h3>Körper & Seele im Gleichgewicht</h3><p>Viele körperliche Beschwerden haben psychische Ursachen: Rückenschmerzen durch Stress, Magenbeschwerden durch Sorgen, Schlafstörungen durch Überlastung. In der psychosomatischen Grundversorgung gehen wir diesen Zusammenhängen nach.</p><p>Wir bieten 5–10 Sitzungen ärztliche Gesprächstherapie als Kassenleistung. Bei Bedarf vermitteln wir zeitnah an kooperierende Psychotherapeuten.</p>', price: 'Kassenleistung', cta: { label: 'Termin vereinbaren', href: '/kontakt' } } },
      ],
    },
  ],
};
