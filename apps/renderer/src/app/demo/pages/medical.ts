import type { DemoSite } from './types';
import { B, HERO } from './types';

export const medicalSite: DemoSite = {
  industry: 'medical',
  industryKey: 'medical',
  defaultStyle: 'classic',
  pages: [
    // ─── 1. HOME ───────────────────────────────────────────────
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-home-hero',
          data: {
            headline: 'Praxis am Stadtpark – Ihre Hausarztpraxis in Koeln',
            subline:
              'Modern, persoenlich, kompetent. Wir begleiten Sie und Ihre Familie in allen Fragen der Gesundheit – mit evidenzbasierter Medizin und einem offenen Ohr fuer Ihre Anliegen.',
            badgeText: 'Hausarztpraxis',
            bgImage:
              'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85',
            ratingText: '4.8 / 5 – ueber 340 Patientenbewertungen auf Jameda',
            availabilityHint: 'Akutsprechstunde taeglich 8–9 Uhr ohne Termin',
            trustItems: [
              'Online-Terminbuchung',
              'Kassen- & Privatpatienten',
              'Barrierefreie Praxis',
            ],
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
            secondaryCta: { label: 'Unsere Leistungen', href: '/demo/medical/leistungen' },
          },
        },
        {
          ...B, type: 'serviceOverview', id: 'md-home-services',
          data: {
            headline: 'Unsere Leistungen im Ueberblick',
            subline: 'Ganzheitliche medizinische Versorgung aus einer Hand',
            services: [
              {
                title: 'Allgemeinmedizin',
                text: 'Umfassende hausaerztliche Betreuung fuer die ganze Familie – von der Akutversorgung bis zur Langzeitbegleitung chronischer Erkrankungen.',
                icon: 'stethoscope',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Vorsorge & Check-up',
                text: 'Individuelle Gesundheitsvorsorge mit modernster Diagnostik. Wir erkennen Risiken fruehzeitig und beraten Sie kompetent.',
                icon: 'shield-check',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Impfungen',
                text: 'Umfassende Impfberatung und -durchfuehrung gemaess STIKO-Empfehlungen. Reiseimpfungen und betriebliche Impfungen.',
                icon: 'syringe',
                image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Psychosomatik',
                text: 'Psychosomatische Grundversorgung bei stressbedingten Beschwerden, Erschoepfungszustaenden und psychischen Belastungen.',
                icon: 'brain',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Reisemedizin',
                text: 'Individuelle reisemedizinische Beratung mit Impfplan, Malariaprophylaxe und laenderspezifischen Empfehlungen.',
                icon: 'plane',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Labordiagnostik',
                text: 'Hauseigenes Labor fuer Sofortdiagnostik und umfassende Blutuntersuchungen. Ergebnisse oft noch am selben Tag.',
                icon: 'flask',
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
            ],
            cta: { label: 'Alle Leistungen entdecken', href: '/demo/medical/leistungen' },
          },
        },
        {
          ...B, type: 'valuesGrid', id: 'md-home-values',
          data: {
            headline: 'Wofuer wir stehen',
            subline: 'Unsere Grundsaetze fuer Ihre bestmoegliche Versorgung',
            values: [
              {
                title: 'Patientenzentriert',
                text: 'Sie stehen im Mittelpunkt. Wir nehmen uns Zeit, hoeren zu und entwickeln gemeinsam mit Ihnen individuelle Behandlungskonzepte.',
                icon: 'heart',
              },
              {
                title: 'Evidenzbasiert',
                text: 'Unsere Therapien basieren auf aktuellen wissenschaftlichen Erkenntnissen und Leitlinien der medizinischen Fachgesellschaften.',
                icon: 'book-open',
              },
              {
                title: 'Digital & Modern',
                text: 'Online-Terminbuchung, elektronische Patientenakte, Videosprechstunde – wir nutzen moderne Technologie fuer Ihre Gesundheit.',
                icon: 'monitor',
              },
              {
                title: 'Interdisziplinaer',
                text: 'Durch unser Netzwerk aus Fachaerzten, Therapeuten und Kliniken gewaehrleisten wir eine umfassende Versorgung ueber Fachgrenzen hinweg.',
                icon: 'users',
              },
            ],
          },
        },
        {
          ...B, type: 'appointmentCta', id: 'md-home-appointment',
          data: {
            headline: 'Jetzt Termin vereinbaren',
            subline: 'Wir sind fuer Sie da – waehlen Sie Ihren bevorzugten Weg zu uns',
            options: [
              {
                title: 'Online buchen',
                text: 'Buchen Sie Ihren Wunschtermin bequem online – rund um die Uhr, auch am Wochenende.',
                icon: 'calendar',
                cta: { label: 'Zur Online-Buchung', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Telefonisch',
                text: 'Rufen Sie uns an – unser Empfangsteam hilft Ihnen gerne persoenlich weiter.',
                icon: 'phone',
                cta: { label: '0221 – 123 456 0', href: 'tel:+492211234560' },
              },
              {
                title: 'Rueckruf anfordern',
                text: 'Hinterlassen Sie Ihre Nummer und wir rufen Sie zeitnah zurueck.',
                icon: 'phone-callback',
                cta: { label: 'Rueckruf anfordern', href: '/demo/medical/kontakt#rueckruf' },
              },
            ],
          },
        },
        {
          ...B, type: 'faq', id: 'md-home-testimonials',
          data: {
            headline: 'Patientenstimmen',
            subline: 'Was unsere Patientinnen und Patienten ueber uns sagen',
            items: [
              {
                question: 'Maria K., 52 Jahre',
                answer:
                  'Ich fuehle mich in der Praxis am Stadtpark bestens aufgehoben. Dr. Lindmann nimmt sich immer Zeit und erklaert alles verstaendlich. Die Online-Terminbuchung ist super praktisch.',
              },
              {
                question: 'Thomas R., 38 Jahre',
                answer:
                  'Endlich eine Praxis, die modern arbeitet! Kurze Wartezeiten, freundliches Team und die Akutsprechstunde hat mir schon mehrfach geholfen.',
              },
              {
                question: 'Fatima A., 45 Jahre',
                answer:
                  'Besonders schaetze ich die ausfuehrliche Beratung und dass das Team mehrere Sprachen spricht. Meine ganze Familie ist hier Patient.',
              },
            ],
          },
        },
      ],
    },

    // ─── 2. LEISTUNGEN ─────────────────────────────────────────
    {
      slug: 'leistungen',
      title: 'Leistungen',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-leist-hero',
          data: {
            headline: 'Unsere medizinischen Leistungen',
            subline:
              'Von der Vorsorge bis zur Behandlung chronischer Erkrankungen – wir bieten Ihnen ein breites Spektrum moderner Allgemeinmedizin.',
            bgImage:
              'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1800&q=85',
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
            secondaryCta: { label: 'Unser Team', href: '/demo/medical/team' },
          },
        },
        {
          ...B, type: 'serviceOverview', id: 'md-leist-services',
          data: {
            headline: 'Unser Leistungsspektrum',
            subline: 'Umfassende hausaerztliche Versorgung fuer jedes Alter',
            services: [
              {
                title: 'Allgemeinmedizin',
                text: 'Hausaerztliche Grundversorgung, Akutbehandlung, Langzeitbetreuung und Ueberweisungsmanagement.',
                icon: 'stethoscope',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
              },
              {
                title: 'Vorsorge & Check-up',
                text: 'Gesundheits-Check-up ab 35, Hautkrebsscreening, Krebsvorsorge Maenner, Jugendvorsorge J1/J2.',
                icon: 'shield-check',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=80',
              },
              {
                title: 'Impfungen',
                text: 'Alle STIKO-Impfungen, Grippeimpfung, Reiseimpfungen, COVID-19, FSME und betriebliche Impfaktionen.',
                icon: 'syringe',
                image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=900&q=80',
              },
              {
                title: 'Psychosomatik',
                text: 'Psychosomatische Grundversorgung, Gespraechstherapie, Stressbewaeltigung und Burnout-Praevention.',
                icon: 'brain',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
              },
              {
                title: 'Reisemedizin',
                text: 'Individuelle Reiseberatung, Impfplan, Malariaprophylaxe, Hoehenkrankheit, reisemedizinisches Attest.',
                icon: 'plane',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
              },
              {
                title: 'Labordiagnostik',
                text: 'Hauseigenes Labor: Blutbild, Entzuendungswerte, Schilddruese, Diabetes-Monitoring, Tumormarker.',
                icon: 'flask',
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80',
              },
              {
                title: 'Chronische Erkrankungen',
                text: 'DMP-Programme fuer Diabetes, Asthma, COPD und KHK. Strukturierte Langzeitbetreuung mit regelmaessigen Kontrollen.',
                icon: 'activity',
                image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&q=80',
              },
              {
                title: 'Sportmedizin',
                text: 'Sporttauglichkeitsuntersuchungen, Belastungs-EKG, Trainingsberatung und Verletzungspraevention.',
                icon: 'dumbbell',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80',
              },
            ],
          },
        },
        {
          ...B, type: 'treatmentDetail', id: 'md-leist-treatments',
          data: {
            headline: 'Behandlungen im Detail',
            subline: 'So laufen unsere haeufigsten Behandlungen ab',
            treatments: [
              {
                title: 'Gesundheits-Check-up',
                text: 'Der Gesundheits-Check-up ist eine umfassende Vorsorgeuntersuchung, die ab dem 35. Lebensjahr alle drei Jahre von den gesetzlichen Krankenkassen uebernommen wird. Wir pruefen Herz-Kreislauf, Stoffwechsel und Organfunktionen.',
                image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80',
                durationLabel: 'ca. 45–60 Minuten',
                requirementLabel: 'Nuechtern erscheinen (12 Stunden)',
                noticeText: 'Bitte bringen Sie Ihren Impfpass und eine aktuelle Medikamentenliste mit.',
                steps: [
                  { title: 'Anamnese', text: 'Ausfuehrliches Gespraech zu Vorerkrankungen, Lebensstil und familiaerer Vorgeschichte.' },
                  { title: 'Koerperliche Untersuchung', text: 'Abhoeren, Blutdruckmessung, Abtasten der Lymphknoten, Hautinspektion.' },
                  { title: 'Labordiagnostik', text: 'Blutentnahme fuer Blutbild, Cholesterin, Blutzucker, Leber- und Nierenwerte.' },
                  { title: 'Besprechung & Beratung', text: 'Auswertung der Ergebnisse, individuelle Gesundheitsberatung und ggf. Therapieempfehlungen.' },
                ],
                cta: { label: 'Check-up Termin buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Reisemedizinische Beratung',
                text: 'Eine gruendliche reisemedizinische Beratung schuetzt Sie vor gesundheitlichen Risiken im Ausland. Wir erstellen einen individuellen Impf- und Prophylaxeplan abgestimmt auf Ihr Reiseziel.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
                durationLabel: 'ca. 30 Minuten',
                requirementLabel: 'Impfpass mitbringen',
                noticeText: 'Bitte kommen Sie mindestens 6 Wochen vor Reiseantritt zur Beratung.',
                steps: [
                  { title: 'Reiseanamnese', text: 'Erfassung von Reiseziel, Reiseart, Dauer und individuellen Risikofaktoren.' },
                  { title: 'Impfplan erstellen', text: 'Abgleich des Impfstatus mit laenderspezifischen Empfehlungen und WHO-Richtlinien.' },
                  { title: 'Prophylaxe & Beratung', text: 'Malariaprophylaxe, Reiseapotheke, Verhaltenstipps fuer Hygiene und Ernaehrung.' },
                ],
                cta: { label: 'Reiseberatung buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Psychosomatische Grundversorgung',
                text: 'Die psychosomatische Grundversorgung bietet Ihnen einen geschuetzten Rahmen, um koerperliche Beschwerden mit seelischen Ursachen ganzheitlich zu behandeln. Wir kombinieren Gespraechstherapie mit praktischen Bewaeltigungsstrategien.',
                image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=900&q=80',
                durationLabel: 'ca. 50 Minuten pro Sitzung',
                requirementLabel: 'Keine besonderen Voraussetzungen',
                noticeText: 'Die Kosten werden von gesetzlichen und privaten Krankenkassen uebernommen.',
                steps: [
                  { title: 'Erstgespraech', text: 'Ausfuehrliche Anamnese, Erfassung der Beschwerden und Lebensumstaende.' },
                  { title: 'Diagnostik', text: 'Abklaerung koerperlicher Ursachen, ggf. Labordiagnostik und Fragebogenverfahren.' },
                  { title: 'Therapieplanung', text: 'Gemeinsame Entwicklung eines individuellen Behandlungsplans mit realistischen Zielen.' },
                  { title: 'Begleitende Sitzungen', text: 'Regelmaessige Gespraeche, Vermittlung von Entspannungstechniken und Stressbewaeltigung.' },
                ],
                cta: { label: 'Erstgespraech vereinbaren', href: '/demo/medical/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'diagnostics', id: 'md-leist-diagnostics',
          data: {
            headline: 'Unsere Diagnostik',
            subline: 'Moderne Geraete fuer praezise Ergebnisse',
            methods: [
              {
                title: 'Labordiagnostik',
                text: 'Unser hauseigenes Labor ermoeglicht Sofortanalysen fuer Entzuendungswerte, Blutzucker und Gerinnungsstatus. Umfassende Laborprofile werden in Kooperation mit einem zertifizierten Grosslabor ausgewertet.',
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80',
                benefitLabel: 'Sofortergebnisse fuer CRP, Blutzucker, Troponin',
                methodLabel: 'Point-of-Care-Testing & Grosslabor',
                cta: { label: 'Mehr erfahren', href: '/demo/medical/leistungen#labor' },
              },
              {
                title: 'EKG & Belastungs-EKG',
                text: 'Ruhe-EKG zur Erkennung von Herzrhythmusstoerungen und Belastungs-EKG (Ergometrie) zur Beurteilung der kardialen Leistungsfaehigkeit unter koerperlicher Anstrengung.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80',
                benefitLabel: 'Fruehzeitige Erkennung kardialer Risiken',
                methodLabel: '12-Kanal-EKG & Fahrradergometrie',
                cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Ultraschall / Sonographie',
                text: 'Strahlungsfreie Bildgebung fuer Schilddruese, Bauchorgane und Gefaesse. Sofortige Befundung durch unsere erfahrenen Aerzte direkt in der Praxis.',
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80',
                benefitLabel: 'Schmerzfrei, strahlungsfrei, sofortige Ergebnisse',
                methodLabel: 'Hochaufloesendes Ultraschallgeraet',
                cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Lungenfunktion',
                text: 'Spirometrie zur Diagnostik und Verlaufskontrolle von Asthma, COPD und anderen Atemwegserkrankungen. Wichtig fuer DMP-Programme und Sporttauglichkeit.',
                image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&q=80',
                benefitLabel: 'Praezise Messung der Atemkapazitaet',
                methodLabel: 'Digitale Spirometrie mit Fluss-Volumen-Kurve',
                cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
              },
            ],
          },
        },
      ],
    },

    // ─── 3. TEAM ───────────────────────────────────────────────
    {
      slug: 'team',
      title: 'Unser Team',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-team-hero',
          data: {
            headline: 'Unser Team – Kompetenz mit Herz',
            subline:
              'Lernen Sie die Menschen kennen, die sich taeglich fuer Ihre Gesundheit einsetzen. Unser eingespieltes Team aus Aerztinnen, Aerzten und medizinischen Fachangestellten freut sich auf Sie.',
            bgImage:
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1800&q=85',
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'doctorTeam', id: 'md-team-docs',
          data: {
            headline: 'Unsere Aerztinnen und Aerzte',
            subline: 'Fachliche Expertise und menschliche Naehe',
            doctors: [
              {
                name: 'Dr. med. Sarah Lindmann',
                title: 'Fachaerztin fuer Allgemeinmedizin',
                specialty: 'Praxisinhaberin',
                bio: 'Dr. Lindmann gruendete die Praxis am Stadtpark 2015 mit der Vision einer modernen, patientenzentrierten Hausarztmedizin. Ihre Schwerpunkte liegen in der Vorsorgemedizin und psychosomatischen Grundversorgung. Sie engagiert sich aktiv in der aerztlichen Fortbildung und ist Dozentin an der Universitaet Koeln.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80',
                languages: ['Deutsch', 'Englisch', 'Franzoesisch'],
                appointmentCta: { label: 'Termin bei Dr. Lindmann', href: '/demo/medical/kontakt' },
              },
              {
                name: 'Dr. med. Tobias Krueger',
                title: 'Facharzt fuer Innere Medizin',
                specialty: 'Angestellter Arzt',
                bio: 'Dr. Krueger verstaerkt unser Team seit 2019 mit seiner Expertise in der internistischen Diagnostik. Seine Schwerpunkte sind Kardiologie, Diabetes und Sportmedizin. Vor seiner Taetigkeit bei uns war er mehrere Jahre an der Uniklinik Koeln taetig.',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80',
                languages: ['Deutsch', 'Englisch', 'Tuerkisch'],
                appointmentCta: { label: 'Termin bei Dr. Krueger', href: '/demo/medical/kontakt' },
              },
              {
                name: 'Lisa Bergmann',
                title: 'Aerztin in Weiterbildung',
                specialty: 'Allgemeinmedizin',
                bio: 'Frau Bergmann befindet sich in der letzten Phase ihrer Facharztweiterbildung fuer Allgemeinmedizin. Sie bringt frisches Wissen von der Universitaet mit und bereichert unser Team durch aktuelle wissenschaftliche Perspektiven.',
                image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=900&q=80',
                languages: ['Deutsch', 'Englisch', 'Arabisch'],
                appointmentCta: { label: 'Termin bei Frau Bergmann', href: '/demo/medical/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'practiceTeam', id: 'md-team-staff',
          data: {
            headline: 'Unser Praxisteam',
            subline: 'Herzlich, organisiert und immer fuer Sie da',
            members: [
              {
                name: 'Marina Petrov',
                role: 'Leitende MFA & Praxismanagerin',
                bio: 'Marina koordiniert den Praxisalltag und sorgt dafuer, dass alles reibungslos laeuft. Sie ist Ihre erste Ansprechpartnerin am Empfang.',
                image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80',
              },
              {
                name: 'Julia Wendt',
                role: 'MFA – Labor & Diagnostik',
                bio: 'Julia ist spezialisiert auf Blutentnahmen und Labordiagnostik. Mit ruhiger Hand und viel Erfahrung macht sie jede Untersuchung angenehm.',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=80',
              },
              {
                name: 'Ayse Demir',
                role: 'MFA – Empfang & Organisation',
                bio: 'Ayse kuemmert sich um Terminvergabe, Rezepte und Ueberweisungen. Sie spricht fliessend Deutsch und Tuerkisch und hilft gerne weiter.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80',
              },
              {
                name: 'Tim Schaefer',
                role: 'MFA – EKG & Funktionsdiagnostik',
                bio: 'Tim ist zustaendig fuer EKG-Ableitungen, Lungenfunktionstests und Ergometrie. Er erklaert jeden Untersuchungsschritt verstaendlich.',
                image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=900&q=80',
              },
            ],
          },
        },
        {
          ...B, type: 'certifications', id: 'md-team-certs',
          data: {
            headline: 'Qualifikationen & Zertifizierungen',
            subline: 'Kontinuierliche Weiterbildung fuer hoechste Behandlungsqualitaet',
            certifications: [
              {
                title: 'DMP Diabetes mellitus',
                text: 'Strukturierte Behandlungsprogramme fuer Patienten mit Diabetes Typ 1 und Typ 2 gemaess den aktuellen Leitlinien.',
              },
              {
                title: 'Psychosomatische Grundversorgung',
                text: 'Zertifizierte Zusatzqualifikation fuer die Behandlung psychosomatischer Erkrankungen in der hausaerztlichen Praxis.',
              },
              {
                title: 'Reisemedizin (DTG)',
                text: 'Zertifikat der Deutschen Gesellschaft fuer Tropenmedizin und Internationale Gesundheit fuer reisemedizinische Beratung.',
              },
              {
                title: 'Sportmedizin',
                text: 'Zusatzbezeichnung Sportmedizin fuer Sporttauglichkeitsuntersuchungen und leistungsmedizinische Betreuung.',
              },
              {
                title: 'Palliativmedizin',
                text: 'Zusatzweiterbildung Palliativmedizin fuer die einfuehlsame Begleitung von Patienten in der letzten Lebensphase.',
              },
            ],
          },
        },
      ],
    },

    // ─── 4. PATIENTEN ──────────────────────────────────────────
    {
      slug: 'patienten',
      title: 'Fuer Patienten',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-pat-hero',
          data: {
            headline: 'Praktische Informationen fuer Ihren Besuch',
            subline:
              'Alles Wichtige rund um Ihren Praxisbesuch – von der Anmeldung ueber Sprechzeiten bis zu Downloads. Wir moechten, dass Sie sich bei uns gut aufgehoben fuehlen.',
            bgImage:
              'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1800&q=85',
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'patientInfo', id: 'md-pat-info',
          data: {
            headline: 'Gut vorbereitet in die Praxis',
            subline: 'Wichtige Hinweise fuer Ihren Besuch',
            cards: [
              {
                title: 'Erstbesuch',
                text: 'Bitte bringen Sie Ihre Versichertenkarte, einen Lichtbildausweis, Ihren Impfpass und eine aktuelle Medikamentenliste mit. Planen Sie ca. 30 Minuten fuer die Erstaufnahme ein. Den Anamnesebogen koennen Sie vorab herunterladen und ausgefuellt mitbringen.',
                icon: 'clipboard',
              },
              {
                title: 'Rezepte & Ueberweisungen',
                text: 'Folgerezepte und Ueberweisungen koennen Sie telefonisch oder ueber unser Online-Portal bestellen. In der Regel liegen diese innerhalb von 24 Stunden zur Abholung bereit. Bitte beachten Sie, dass Erstrezepte einen Arzttermin erfordern.',
                icon: 'file-text',
              },
              {
                title: 'Hausbesuche',
                text: 'Fuer Patienten, die unsere Praxis nicht aufsuchen koennen, bieten wir Hausbesuche im Stadtgebiet Koeln an. Bitte melden Sie Hausbesuche moeglichst bis 10 Uhr vormittags an. In dringenden Faellen kommen wir auch kurzfristig.',
                icon: 'home',
              },
              {
                title: 'Videosprechstunde',
                text: 'Fuer Kontrolltermine, Beratungen und Befundbesprechungen bieten wir Ihnen eine sichere Videosprechstunde an. Sie benoetigen lediglich ein Smartphone oder einen Computer mit Kamera. Den Zugangslink erhalten Sie per E-Mail.',
                icon: 'video',
              },
            ],
          },
        },
        {
          ...B, type: 'insuranceInfo', id: 'md-pat-insurance',
          data: {
            headline: 'Abrechnung & Versicherung',
            subline: 'Transparente Informationen zu Kosten und Abrechnung',
            entries: [
              {
                title: 'Gesetzlich Versicherte',
                text: 'Wir sind als Hausarztpraxis zugelassen und rechnen direkt mit Ihrer Krankenkasse ab. Bitte bringen Sie Ihre elektronische Gesundheitskarte zu jedem Quartalswechsel mit. Die meisten Leistungen sind fuer Sie kostenfrei.',
                icon: 'shield',
              },
              {
                title: 'Privat Versicherte',
                text: 'Die Abrechnung erfolgt nach der Gebuehrenordnung fuer Aerzte (GOAe). Sie erhalten eine detaillierte Rechnung, die Sie bei Ihrer Versicherung einreichen koennen. Wir beraten Sie vorab transparent ueber anfallende Kosten.',
                icon: 'credit-card',
              },
              {
                title: 'Selbstzahler / IGeL',
                text: 'Individuelle Gesundheitsleistungen (IGeL) wie erweiterte Vorsorge, Reisemedizin oder sportmedizinische Untersuchungen bieten wir zu fairen, transparenten Preisen an. Sie erhalten vorab einen Kostenvoranschlag.',
                icon: 'wallet',
              },
            ],
          },
        },
        {
          ...B, type: 'downloadForms', id: 'md-pat-downloads',
          data: {
            headline: 'Formulare & Downloads',
            subline: 'Laden Sie wichtige Dokumente vorab herunter und sparen Sie Zeit',
            forms: [
              {
                title: 'Anamnesebogen',
                text: 'Fragebogen zu Ihrer Krankengeschichte fuer den Erstbesuch.',
                icon: 'download',
                href: '/demo/medical/downloads/anamnesebogen.pdf',
              },
              {
                title: 'DSGVO-Einwilligung',
                text: 'Einwilligungserklaerung zur Verarbeitung Ihrer Gesundheitsdaten.',
                icon: 'download',
                href: '/demo/medical/downloads/dsgvo-einwilligung.pdf',
              },
              {
                title: 'Patientenverfuegung',
                text: 'Vorlage fuer Ihre persoenliche Patientenverfuegung. Wir beraten Sie gerne dazu.',
                icon: 'download',
                href: '/demo/medical/downloads/patientenverfuegung.pdf',
              },
              {
                title: 'Impfpass-Vorlage',
                text: 'Uebersicht Ihrer bisherigen Impfungen zum Selbstausfuellen.',
                icon: 'download',
                href: '/demo/medical/downloads/impfpass-vorlage.pdf',
              },
            ],
          },
        },
        {
          ...B, type: 'openingHours', id: 'md-pat-hours',
          data: {
            headline: 'Sprechzeiten',
            subline: 'Wir freuen uns auf Ihren Besuch',
            hours: [
              { day: 'Montag', time: '08:00 – 12:00 Uhr und 15:00 – 18:00 Uhr' },
              { day: 'Dienstag', time: '08:00 – 12:00 Uhr und 15:00 – 18:00 Uhr' },
              { day: 'Mittwoch', time: '08:00 – 12:00 Uhr, nachmittags geschlossen' },
              { day: 'Donnerstag', time: '08:00 – 12:00 Uhr und 15:00 – 18:00 Uhr' },
              { day: 'Freitag', time: '08:00 – 12:00 Uhr, nachmittags geschlossen' },
            ],
            noticeText: 'Akutsprechstunde: taeglich 08:00 – 09:00 Uhr ohne Termin',
            holidayText: 'An gesetzlichen Feiertagen geschlossen. Vertretung siehe Aushang.',
          },
        },
      ],
    },

    // ─── 5. NOTFALL ────────────────────────────────────────────
    {
      slug: 'notfall',
      title: 'Notfall & Akut',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-notfall-hero',
          data: {
            headline: 'Notfall & Akutversorgung',
            subline:
              'Im Notfall zaehlt jede Minute. Hier finden Sie alle wichtigen Nummern und Anlaufstellen fuer akute medizinische Situationen.',
            bgImage:
              'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1800&q=85',
            primaryCta: { label: 'Termin Akutsprechstunde', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'emergencyInfo', id: 'md-notfall-info',
          data: {
            headline: 'Wichtige Notfallnummern & Anlaufstellen',
            subline: 'Bewahren Sie Ruhe und waehlen Sie die passende Anlaufstelle',
            entries: [
              {
                title: 'Akutsprechstunde',
                text: 'Bei akuten Beschwerden koennen Sie taeglich von 08:00 bis 09:00 Uhr ohne vorherige Terminvereinbarung in unsere Praxis kommen. Sie werden in der Reihenfolge Ihres Eintreffens behandelt.',
                phoneLabel: 'Praxistelefon: 0221 – 123 456 0',
                phoneHref: 'tel:+492211234560',
                icon: 'clock',
              },
              {
                title: 'Aerztlicher Bereitschaftsdienst',
                text: 'Ausserhalb unserer Sprechzeiten erreichen Sie den aerztlichen Bereitschaftsdienst der Kassenaerztlichen Vereinigung. Dieser ist fuer nicht lebensbedrohliche Beschwerden zustaendig, die nicht bis zur naechsten Sprechstunde warten koennen.',
                phoneLabel: 'Telefon: 116 117 (kostenfrei)',
                phoneHref: 'tel:116117',
                icon: 'phone',
              },
              {
                title: 'Rettungsdienst',
                text: 'Bei lebensbedrohlichen Notfaellen – Bewusstlosigkeit, starke Brustschmerzen, Atemnot, schwere Verletzungen, Schlaganfall-Verdacht – waehlen Sie sofort den Notruf. Jede Sekunde zaehlt.',
                phoneLabel: 'Notruf: 112',
                phoneHref: 'tel:112',
                icon: 'alert-triangle',
              },
              {
                title: 'Giftnotruf NRW',
                text: 'Bei Verdacht auf Vergiftungen – durch Medikamente, Reinigungsmittel, Pflanzen oder Chemikalien – wenden Sie sich an die Giftnotrufzentrale Bonn. Halten Sie wenn moeglich die Verpackung bereit.',
                phoneLabel: 'Telefon: 0228 – 19 240',
                phoneHref: 'tel:+4922819240',
                icon: 'alert-circle',
              },
            ],
          },
        },
      ],
    },

    // ─── 6. PRAXIS ─────────────────────────────────────────────
    {
      slug: 'praxis',
      title: 'Unsere Praxis',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-praxis-hero',
          data: {
            headline: 'Unsere Praxis – Modern & Barrierefrei',
            subline:
              'Helle Raeume, moderne Ausstattung und eine angenehme Atmosphaere. Unsere Praxis am Stadtpark wurde 2020 komplett renoviert und bietet Ihnen medizinische Versorgung auf hoechstem Niveau.',
            bgImage:
              'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1800&q=85',
            primaryCta: { label: 'Virtueller Rundgang', href: '#galerie' },
            secondaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'practiceGallery', id: 'md-praxis-gallery',
          data: {
            headline: 'Praxisrundgang',
            subline: 'Verschaffen Sie sich einen Eindruck von unseren Raeumlichkeiten',
            images: [
              { src: 'https://images.unsplash.com/photo-1629909615957-be38d6c1c5c5?w=900&q=80', alt: 'Empfangsbereich mit freundlichem Team', caption: 'Empfang' },
              { src: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', alt: 'Helles Wartezimmer mit bequemer Bestuhlung', caption: 'Wartezimmer' },
              { src: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=80', alt: 'Moderner Behandlungsraum mit Untersuchungsliege', caption: 'Behandlungsraum 1' },
              { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80', alt: 'Behandlungsraum mit Ultraschallgeraet', caption: 'Behandlungsraum 2' },
              { src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=900&q=80', alt: 'Behandlungsraum fuer kleinere Eingriffe', caption: 'Behandlungsraum 3' },
              { src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80', alt: 'Hauseigenes Labor mit Analysegeraeten', caption: 'Labor' },
              { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80', alt: 'EKG-Raum mit Ergometrie-Arbeitsplatz', caption: 'EKG-Raum' },
              { src: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=900&q=80', alt: 'Aussenansicht der Praxis am Stadtpark', caption: 'Aussenansicht' },
            ],
          },
        },
        {
          ...B, type: 'equipmentHighlights', id: 'md-praxis-equipment',
          data: {
            headline: 'Unsere Ausstattung',
            subline: 'Investition in modernste Medizintechnik fuer Ihre Gesundheit',
            items: [
              {
                title: 'Digitales Roentgen',
                text: 'In Kooperation mit der radiologischen Praxis im selben Gebaeude bieten wir Ihnen digitale Roentgendiagnostik mit minimaler Strahlenbelastung. Termine werden direkt fuer Sie vereinbart.',
                image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&q=80',
                icon: 'x-ray',
              },
              {
                title: 'Modernes Ultraschallgeraet',
                text: 'Hochaufloesendes Sonographiegeraet fuer Schilddruese, Bauchorgane und Gefaessdiagnostik. Sofortige Befundung und Besprechung in der Sprechstunde.',
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80',
                icon: 'monitor',
              },
              {
                title: 'EKG-System 12-Kanal',
                text: 'Digitales 12-Kanal-EKG fuer Ruhe- und Belastungsuntersuchungen mit automatischer Auswertung und Langzeitarchivierung.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80',
                icon: 'activity',
              },
              {
                title: 'Spirometrie',
                text: 'Digitales Spirometer fuer praezise Lungenfunktionsmessungen. Fluss-Volumen-Kurven und Trendanalysen fuer die Verlaufskontrolle bei Asthma und COPD.',
                image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80',
                icon: 'wind',
              },
            ],
          },
        },
      ],
    },

    // ─── 7. KONTAKT ────────────────────────────────────────────
    {
      slug: 'kontakt',
      title: 'Kontakt & Termin',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-kontakt-hero',
          data: {
            headline: 'Kontakt & Terminvereinbarung',
            subline:
              'Wir freuen uns auf Ihren Besuch. Vereinbaren Sie jetzt Ihren Termin – online, telefonisch oder persoenlich.',
            bgImage:
              'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&q=85',
            primaryCta: { label: 'Online-Termin buchen', href: '#termin' },
            secondaryCta: { label: 'Anfahrt & Karte', href: '#anfahrt' },
          },
        },
        {
          ...B, type: 'appointmentCta', id: 'md-kontakt-appointment',
          data: {
            headline: 'Termin vereinbaren',
            subline: 'Waehlen Sie Ihren bevorzugten Weg zu einem Termin',
            options: [
              {
                title: 'Online buchen',
                text: 'Rund um die Uhr verfuegbar. Waehlen Sie Arzt, Anlass und Ihren Wunschtermin bequem online.',
                icon: 'calendar',
                cta: { label: 'Zur Online-Terminbuchung', href: '/demo/medical/kontakt#termin' },
              },
              {
                title: 'Telefonisch',
                text: 'Montag bis Freitag waehrend der Sprechzeiten erreichen Sie uns telefonisch.',
                icon: 'phone',
                cta: { label: '0221 – 123 456 0', href: 'tel:+492211234560' },
              },
              {
                title: 'Rueckruf anfordern',
                text: 'Hinterlassen Sie Ihre Telefonnummer und wir melden uns schnellstmoeglich bei Ihnen.',
                icon: 'phone-callback',
                cta: { label: 'Rueckruf anfordern', href: '/demo/medical/kontakt#rueckruf' },
              },
            ],
          },
        },
        {
          ...B, type: 'locationContact', id: 'md-kontakt-location',
          data: {
            headline: 'So finden Sie uns',
            subline: 'Zentral gelegen am Koelner Stadtpark mit guter Anbindung',
            address: {
              name: 'Praxis am Stadtpark',
              street: 'Stadtparkweg 12',
              zip: '50735',
              city: 'Koeln',
              mapLat: 50.9612,
              mapLng: 6.9578,
              mapZoom: 15,
            },
            contactCards: [
              {
                title: 'Telefon',
                text: '0221 – 123 456 0',
                icon: 'phone',
                href: 'tel:+492211234560',
              },
              {
                title: 'E-Mail',
                text: 'praxis@stadtpark-medizin.de',
                icon: 'mail',
                href: 'mailto:praxis@stadtpark-medizin.de',
              },
              {
                title: 'Adresse',
                text: 'Stadtparkweg 12, 50735 Koeln',
                icon: 'map-pin',
              },
            ],
            directions: 'Barrierefreier Zugang im Erdgeschoss. Parkplaetze direkt vor dem Haus. Haltestelle Linie 15 „Am Stadtpark" in 2 Minuten Fussweg.',
            formHeadline: 'Schreiben Sie uns',
            formFields: [
              { name: 'name', label: 'Ihr Name', type: 'text', required: true },
              { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true },
              { name: 'phone', label: 'Telefonnummer', type: 'tel', required: false },
              { name: 'subject', label: 'Betreff', type: 'select', options: ['Terminanfrage', 'Rezeptbestellung', 'Ueberweisung', 'Allgemeine Frage', 'Feedback'], required: true },
              { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
            ],
            formCta: 'Nachricht senden',
          },
        },
        {
          ...B, type: 'faq', id: 'md-kontakt-faq',
          data: {
            headline: 'Haeufig gestellte Fragen',
            subline: 'Antworten auf die wichtigsten Fragen unserer Patienten',
            items: [
              {
                question: 'Wie kann ich einen Termin vereinbaren?',
                answer:
                  'Sie koennen Termine bequem ueber unser Online-Buchungssystem, telefonisch unter 0221 – 123 456 0 oder persoenlich an unserem Empfang vereinbaren. Fuer akute Beschwerden steht Ihnen taeglich von 08:00 bis 09:00 Uhr unsere offene Akutsprechstunde zur Verfuegung.',
              },
              {
                question: 'Wie lange muss ich auf einen Termin warten?',
                answer:
                  'Routinetermine sind in der Regel innerhalb von 3–5 Werktagen verfuegbar. Vorsorgeuntersuchungen und Check-ups planen wir mit ca. 2 Wochen Vorlauf. Bei akuten Beschwerden kommen Sie einfach in unsere taegliche Akutsprechstunde – ohne Wartezeit auf einen Termin.',
              },
              {
                question: 'Wie bestelle ich Folgerezepte oder Ueberweisungen?',
                answer:
                  'Folgerezepte und Ueberweisungen koennen Sie telefonisch, per E-Mail oder ueber unser Online-Portal bestellen. Bitte geben Sie Ihren Namen, Ihr Geburtsdatum und das gewuenschte Medikament bzw. den Facharzt an. Die Dokumente liegen in der Regel am naechsten Werktag zur Abholung bereit.',
              },
              {
                question: 'Nehmen Sie neue Patienten auf?',
                answer:
                  'Ja, wir nehmen gerne neue Patientinnen und Patienten auf – sowohl gesetzlich als auch privat Versicherte. Bitte bringen Sie zum Ersttermin Ihre Versichertenkarte, einen Lichtbildausweis und Ihren Impfpass mit. Den Anamnesebogen koennen Sie vorab auf unserer Website herunterladen.',
              },
              {
                question: 'Welche Sprachen werden in der Praxis gesprochen?',
                answer:
                  'Unser Team spricht Deutsch, Englisch, Tuerkisch, Franzoesisch und Arabisch. So koennen wir viele Patientinnen und Patienten in ihrer Muttersprache betreuen und Missverstaendnisse bei medizinischen Themen vermeiden.',
              },
              {
                question: 'Ist die Praxis barrierefrei?',
                answer:
                  'Ja, unsere Praxis befindet sich im Erdgeschoss und ist vollstaendig barrierefrei zugaenglich. Es gibt eine automatische Eingangstuer, breite Flure und eine barrierefreie Toilette. Parkplaetze fuer Menschen mit Behinderung sind direkt vor dem Eingang vorhanden.',
              },
            ],
          },
        },
      ],
    },
  ],
};
