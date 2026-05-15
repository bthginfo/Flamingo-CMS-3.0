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
            headline: 'Praxis am Stadtpark – Ihre Hausarztpraxis in Köln',
            subline:
              'Modern, persönlich, kompetent. Wir begleiten Sie und Ihre Familie in allen Fragen der Gesundheit – mit evidenzbasierter Medizin und einem offenen Ohr für Ihre Anliegen.',
            badgeText: 'Hausarztpraxis',
            bgImage:
              'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85',
            ratingText: '4.8 / 5 – über 340 Patientenbewertungen auf Jameda',
            availabilityHint: 'Akutsprechstunde Täglich 8–9 Uhr ohne Termin',
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
            headline: 'Unsere Leistungen im Überblick',
            subline: 'Ganzheitliche medizinische Versorgung aus einer Hand',
            services: [
              {
                title: 'Allgemeinmedizin',
                text: 'Umfassende hausÄrztliche Betreuung für die ganze Familie – von der Akutversorgung bis zur Langzeitbegleitung chronischer Erkrankungen.',
                icon: 'stethoscope',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Vorsorge & Check-up',
                text: 'Individuelle Gesundheitsvorsorge mit modernster Diagnostik. Wir erkennen Risiken frühzeitig und beraten Sie kompetent.',
                icon: 'shield-check',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Impfungen',
                text: 'Umfassende Impfberatung und -Durchführung gemäß STIKO-Empfehlungen. Reiseimpfungen und betriebliche Impfungen.',
                icon: 'syringe',
                image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Psychosomatik',
                text: 'Psychosomatische Grundversorgung bei stressbedingten Beschwerden, ErschöpfungszuStänden und psychischen Belastungen.',
                icon: 'brain',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Reisemedizin',
                text: 'Individuelle reisemedizinische Beratung mit Impfplan, Malariaprophylaxe und länderspezifischen Empfehlungen.',
                icon: 'plane',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
                href: '/demo/medical/leistungen',
              },
              {
                title: 'Labordiagnostik',
                text: 'Hauseigenes Labor für Sofortdiagnostik und umfassende Blutuntersuchungen. Ergebnisse oft noch am selben Tag.',
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
            headline: 'Wofür wir stehen',
            subline: 'Unsere Grundsätze für Ihre bestmögliche Versorgung',
            values: [
              {
                title: 'Patientenzentriert',
                text: 'Sie stehen im Mittelpunkt. Wir nehmen uns Zeit, hören zu und entwickeln gemeinsam mit Ihnen individuelle Behandlungskonzepte.',
                icon: 'heart',
              },
              {
                title: 'Evidenzbasiert',
                text: 'Unsere Therapien basieren auf aktuellen wissenschaftlichen Erkenntnissen und Leitlinien der medizinischen Fachgesellschaften.',
                icon: 'book-open',
              },
              {
                title: 'Digital & Modern',
                text: 'Online-Terminbuchung, elektronische Patientenakte, Videosprechstunde – wir nutzen moderne Technologie für Ihre Gesundheit.',
                icon: 'monitor',
              },
              {
                title: 'Interdisziplinär',
                text: 'Durch unser Netzwerk aus FachÄrzten, Therapeuten und Kliniken Gewährleisten wir eine umfassende Versorgung über Fachgrenzen hinweg.',
                icon: 'users',
              },
            ],
          },
        },
        {
          ...B, type: 'appointmentCta', id: 'md-home-appointment',
          data: {
            headline: 'Jetzt Termin vereinbaren',
            subline: 'Wir sind für Sie da – Wählen Sie Ihren bevorzugten Weg zu uns',
            options: [
              {
                title: 'Online buchen',
                text: 'Buchen Sie Ihren Wunschtermin bequem online – rund um die Uhr, auch am Wochenende.',
                icon: 'calendar',
                cta: { label: 'Zur Online-Buchung', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Telefonisch',
                text: 'Rufen Sie uns an – unser Empfangsteam hilft Ihnen gerne persönlich weiter.',
                icon: 'phone',
                cta: { label: '0221 – 123 456 0', href: 'tel:+492211234560' },
              },
              {
                title: 'Rückruf anfordern',
                text: 'Hinterlassen Sie Ihre Nummer und wir rufen Sie zeitnah zurück.',
                icon: 'phone-callback',
                cta: { label: 'Rückruf anfordern', href: '/demo/medical/kontakt#Rückruf' },
              },
            ],
          },
        },
        {
          ...B, type: 'faq', id: 'md-home-testimonials',
          data: {
            headline: 'Patientenstimmen',
            subline: 'Was unsere Patientinnen und Patienten über uns sagen',
            items: [
              {
                question: 'Maria K., 52 Jahre',
                answer:
                  'Ich fühle mich in der Praxis am Stadtpark bestens aufgehoben. Dr. Lindmann nimmt sich immer Zeit und erklärt alles verständlich. Die Online-Terminbuchung ist super praktisch.',
              },
              {
                question: 'Thomas R., 38 Jahre',
                answer:
                  'Endlich eine Praxis, die modern arbeitet! Kurze Wartezeiten, freundliches Team und die Akutsprechstunde hat mir schon mehrfach geholfen.',
              },
              {
                question: 'Fatima A., 45 Jahre',
                answer:
                  'Besonders schätze ich die Ausführliche Beratung und dass das Team mehrere Sprachen spricht. Meine ganze Familie ist hier Patient.',
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
            subline: 'Umfassende hausÄrztliche Versorgung für jedes Alter',
            services: [
              {
                title: 'Allgemeinmedizin',
                text: 'HausÄrztliche Grundversorgung, Akutbehandlung, Langzeitbetreuung und Überweisungsmanagement.',
                icon: 'stethoscope',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
              },
              {
                title: 'Vorsorge & Check-up',
                text: 'Gesundheits-Check-up ab 35, Hautkrebsscreening, Krebsvorsorge Männer, Jugendvorsorge J1/J2.',
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
                text: 'Psychosomatische Grundversorgung, Gesprächstherapie, Stressbewältigung und Burnout-Prävention.',
                icon: 'brain',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
              },
              {
                title: 'Reisemedizin',
                text: 'Individuelle Reiseberatung, Impfplan, Malariaprophylaxe, Höhenkrankheit, reisemedizinisches Attest.',
                icon: 'plane',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
              },
              {
                title: 'Labordiagnostik',
                text: 'Hauseigenes Labor: Blutbild, Entzündungswerte, Schilddrüse, Diabetes-Monitoring, Tumormarker.',
                icon: 'flask',
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80',
              },
              {
                title: 'Chronische Erkrankungen',
                text: 'DMP-Programme für Diabetes, Asthma, COPD und KHK. Strukturierte Langzeitbetreuung mit regelmäßigen Kontrollen.',
                icon: 'activity',
                image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&q=80',
              },
              {
                title: 'Sportmedizin',
                text: 'Sporttauglichkeitsuntersuchungen, Belastungs-EKG, Trainingsberatung und VerletzungsPrävention.',
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
            subline: 'So laufen unsere Häufigsten Behandlungen ab',
            treatments: [
              {
                title: 'Gesundheits-Check-up',
                text: 'Der Gesundheits-Check-up ist eine umfassende Vorsorgeuntersuchung, die ab dem 35. Lebensjahr alle drei Jahre von den gesetzlichen Krankenkassen Übernommen wird. Wir prüfen Herz-Kreislauf, Stoffwechsel und Organfunktionen.',
                image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80',
                durationLabel: 'ca. 45–60 Minuten',
                requirementLabel: 'Nüchtern erscheinen (12 Stunden)',
                noticeText: 'Bitte bringen Sie Ihren Impfpass und eine aktuelle Medikamentenliste mit.',
                steps: [
                  { title: 'Anamnese', text: 'Ausführliches Gespräch zu Vorerkrankungen, Lebensstil und familiärer Vorgeschichte.' },
                  { title: 'Körperliche Untersuchung', text: 'Abhören, Blutdruckmessung, Abtasten der Lymphknoten, Hautinspektion.' },
                  { title: 'Labordiagnostik', text: 'Blutentnahme für Blutbild, Cholesterin, Blutzucker, Leber- und Nierenwerte.' },
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
                  { title: 'Impfplan erstellen', text: 'Abgleich des Impfstatus mit länderspezifischen Empfehlungen und WHO-Richtlinien.' },
                  { title: 'Prophylaxe & Beratung', text: 'Malariaprophylaxe, Reiseapotheke, Verhaltenstipps für Hygiene und Ernährung.' },
                ],
                cta: { label: 'Reiseberatung buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Psychosomatische Grundversorgung',
                text: 'Die psychosomatische Grundversorgung bietet Ihnen einen geschützten Rahmen, um Körperliche Beschwerden mit seelischen Ursachen ganzheitlich zu behandeln. Wir kombinieren Gesprächstherapie mit praktischen Bewältigungsstrategien.',
                image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=900&q=80',
                durationLabel: 'ca. 50 Minuten pro Sitzung',
                requirementLabel: 'Keine besonderen Voraussetzungen',
                noticeText: 'Die Kosten werden von gesetzlichen und privaten Krankenkassen Übernommen.',
                steps: [
                  { title: 'Erstgespräch', text: 'Ausführliche Anamnese, Erfassung der Beschwerden und LebensumStände.' },
                  { title: 'Diagnostik', text: 'Abklärung Körperlicher Ursachen, ggf. Labordiagnostik und Fragebogenverfahren.' },
                  { title: 'Therapieplanung', text: 'Gemeinsame Entwicklung eines individuellen Behandlungsplans mit realistischen Zielen.' },
                  { title: 'Begleitende Sitzungen', text: 'regelmäßige Gespräche, Vermittlung von Entspannungstechniken und Stressbewältigung.' },
                ],
                cta: { label: 'Erstgespräch vereinbaren', href: '/demo/medical/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'diagnostics', id: 'md-leist-diagnostics',
          data: {
            headline: 'Unsere Diagnostik',
            subline: 'Moderne Geräte für präzise Ergebnisse',
            methods: [
              {
                title: 'Labordiagnostik',
                text: 'Unser hauseigenes Labor ermöglicht Sofortanalysen für Entzündungswerte, Blutzucker und Gerinnungsstatus. Umfassende Laborprofile werden in Kooperation mit einem zertifizierten Großlabor ausgewertet.',
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80',
                benefitLabel: 'Sofortergebnisse für CRP, Blutzucker, Troponin',
                methodLabel: 'Point-of-Care-Testing & Großlabor',
                cta: { label: 'Mehr erfahren', href: '/demo/medical/leistungen#labor' },
              },
              {
                title: 'EKG & Belastungs-EKG',
                text: 'Ruhe-EKG zur Erkennung von Herzrhythmusstörungen und Belastungs-EKG (Ergometrie) zur Beurteilung der kardialen Leistungsfähigkeit unter Körperlicher Anstrengung.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80',
                benefitLabel: 'Frühzeitige Erkennung kardialer Risiken',
                methodLabel: '12-Kanal-EKG & Fahrradergometrie',
                cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Ultraschall / Sonographie',
                text: 'Strahlungsfreie Bildgebung für Schilddrüse, Bauchorgane und Gefäße. Sofortige Befundung durch unsere erfahrenen Ärzte direkt in der Praxis.',
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80',
                benefitLabel: 'Schmerzfrei, Strahlungsfrei, sofortige Ergebnisse',
                methodLabel: 'Hochauflösendes Ultraschallgerät',
                cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
              },
              {
                title: 'Lungenfunktion',
                text: 'Spirometrie zur Diagnostik und Verlaufskontrolle von Asthma, COPD und anderen Atemwegserkrankungen. Wichtig für DMP-Programme und Sporttauglichkeit.',
                image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&q=80',
                benefitLabel: 'präzise Messung der Atemkapazität',
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
              'Lernen Sie die Menschen kennen, die sich Täglich für Ihre Gesundheit einsetzen. Unser eingespieltes Team aus Ärztinnen, Ärzten und medizinischen Fachangestellten freut sich auf Sie.',
            bgImage:
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1800&q=85',
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'doctorTeam', id: 'md-team-docs',
          data: {
            headline: 'Unsere Ärztinnen und Ärzte',
            subline: 'Fachliche Expertise und menschliche Nähe',
            doctors: [
              {
                name: 'Dr. med. Sarah Lindmann',
                title: 'FachÄrztin für Allgemeinmedizin',
                specialty: 'Praxisinhaberin',
                bio: 'Dr. Lindmann gründete die Praxis am Stadtpark 2015 mit der Vision einer modernen, patientenzentrierten Hausarztmedizin. Ihre Schwerpunkte liegen in der Vorsorgemedizin und psychosomatischen Grundversorgung. Sie engagiert sich aktiv in der Ärztlichen Fortbildung und ist Dozentin an der Universität Köln.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80',
                languages: ['Deutsch', 'Englisch', 'Französisch'],
                appointmentCta: { label: 'Termin bei Dr. Lindmann', href: '/demo/medical/kontakt' },
              },
              {
                name: 'Dr. med. Tobias Krueger',
                title: 'Facharzt für Innere Medizin',
                specialty: 'Angestellter Arzt',
                bio: 'Dr. Krueger verstärkt unser Team seit 2019 mit seiner Expertise in der internistischen Diagnostik. Seine Schwerpunkte sind Kardiologie, Diabetes und Sportmedizin. Vor seiner tätigkeit bei uns war er mehrere Jahre an der Uniklinik Köln tätig.',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80',
                languages: ['Deutsch', 'Englisch', 'Türkisch'],
                appointmentCta: { label: 'Termin bei Dr. Krueger', href: '/demo/medical/kontakt' },
              },
              {
                name: 'Lisa Bergmann',
                title: 'Ärztin in Weiterbildung',
                specialty: 'Allgemeinmedizin',
                bio: 'Frau Bergmann befindet sich in der letzten Phase ihrer Facharztweiterbildung für Allgemeinmedizin. Sie bringt frisches Wissen von der Universität mit und bereichert unser Team durch aktuelle wissenschaftliche Perspektiven.',
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
            subline: 'Herzlich, organisiert und immer für Sie da',
            members: [
              {
                name: 'Marina Petrov',
                role: 'Leitende MFA & Praxismanagerin',
                bio: 'Marina koordiniert den Praxisalltag und sorgt dafür, dass alles reibungslos läuft. Sie ist Ihre erste Ansprechpartnerin am Empfang.',
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
                bio: 'Ayse kümmert sich um Terminvergabe, Rezepte und Überweisungen. Sie spricht fließend Deutsch und Türkisch und hilft gerne weiter.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80',
              },
              {
                name: 'Tim Schaefer',
                role: 'MFA – EKG & Funktionsdiagnostik',
                bio: 'Tim ist zuständig für EKG-Ableitungen, Lungenfunktionstests und Ergometrie. Er erklärt jeden Untersuchungsschritt verständlich.',
                image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=900&q=80',
              },
            ],
          },
        },
        {
          ...B, type: 'certifications', id: 'md-team-certs',
          data: {
            headline: 'Qualifikationen & Zertifizierungen',
            subline: 'Kontinuierliche Weiterbildung für höchste BehandlungsQualität',
            certifications: [
              {
                title: 'DMP Diabetes mellitus',
                text: 'Strukturierte Behandlungsprogramme für Patienten mit Diabetes Typ 1 und Typ 2 gemäß den aktuellen Leitlinien.',
              },
              {
                title: 'Psychosomatische Grundversorgung',
                text: 'Zertifizierte Zusatzqualifikation für die Behandlung psychosomatischer Erkrankungen in der hausÄrztlichen Praxis.',
              },
              {
                title: 'Reisemedizin (DTG)',
                text: 'Zertifikat der Deutschen Gesellschaft für Tropenmedizin und Internationale Gesundheit für reisemedizinische Beratung.',
              },
              {
                title: 'Sportmedizin',
                text: 'Zusatzbezeichnung Sportmedizin für Sporttauglichkeitsuntersuchungen und leistungsmedizinische Betreuung.',
              },
              {
                title: 'Palliativmedizin',
                text: 'Zusatzweiterbildung Palliativmedizin für die Einfühlsame Begleitung von Patienten in der letzten Lebensphase.',
              },
            ],
          },
        },
      ],
    },

    // ─── 4. PATIENTEN ──────────────────────────────────────────
    {
      slug: 'patienten',
      title: 'für Patienten',
      sections: [
        {
          ...HERO, type: 'hero', id: 'md-pat-hero',
          data: {
            headline: 'Praktische Informationen für Ihren Besuch',
            subline:
              'Alles Wichtige rund um Ihren Praxisbesuch – von der Anmeldung über Sprechzeiten bis zu Downloads. Wir möchten, dass Sie sich bei uns gut aufgehoben fühlen.',
            bgImage:
              'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1800&q=85',
            primaryCta: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'patientInfo', id: 'md-pat-info',
          data: {
            headline: 'Gut vorbereitet in die Praxis',
            subline: 'Wichtige Hinweise für Ihren Besuch',
            cards: [
              {
                title: 'Erstbesuch',
                text: 'Bitte bringen Sie Ihre Versichertenkarte, einen Lichtbildausweis, Ihren Impfpass und eine aktuelle Medikamentenliste mit. Planen Sie ca. 30 Minuten für die Erstaufnahme ein. Den Anamnesebogen können Sie vorab herunterladen und ausgefüllt mitbringen.',
                icon: 'clipboard',
              },
              {
                title: 'Rezepte & Überweisungen',
                text: 'Folgerezepte und Überweisungen können Sie telefonisch oder über unser Online-Portal bestellen. In der Regel liegen diese innerhalb von 24 Stunden zur Abholung bereit. Bitte beachten Sie, dass Erstrezepte einen Arzttermin erfordern.',
                icon: 'file-text',
              },
              {
                title: 'Hausbesuche',
                text: 'für Patienten, die unsere Praxis nicht aufsuchen können, bieten wir Hausbesuche im Stadtgebiet Köln an. Bitte melden Sie Hausbesuche möglichst bis 10 Uhr vormittags an. In dringenden Fällen kommen wir auch kurzfristig.',
                icon: 'home',
              },
              {
                title: 'Videosprechstunde',
                text: 'für Kontrolltermine, Beratungen und Befundbesprechungen bieten wir Ihnen eine sichere Videosprechstunde an. Sie benötigen lediglich ein Smartphone oder einen Computer mit Kamera. Den Zugangslink erhalten Sie per E-Mail.',
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
                text: 'Wir sind als Hausarztpraxis zugelassen und rechnen direkt mit Ihrer Krankenkasse ab. Bitte bringen Sie Ihre elektronische Gesundheitskarte zu jedem Quartalswechsel mit. Die meisten Leistungen sind für Sie kostenfrei.',
                icon: 'shield',
              },
              {
                title: 'Privat Versicherte',
                text: 'Die Abrechnung erfolgt nach der Gebührenordnung für Ärzte (GOÄ). Sie erhalten eine detaillierte Rechnung, die Sie bei Ihrer Versicherung einreichen können. Wir beraten Sie vorab transparent über anfallende Kosten.',
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
                text: 'Fragebogen zu Ihrer Krankengeschichte für den Erstbesuch.',
                icon: 'download',
                href: '/demo/medical/downloads/Anamnesebogen.pdf',
              },
              {
                title: 'DSGVO-Einwilligung',
                text: 'Einwilligungserklärung zur Verarbeitung Ihrer Gesundheitsdaten.',
                icon: 'download',
                href: '/demo/medical/downloads/dsgvo-einwilligung.pdf',
              },
              {
                title: 'PatientenVerfügung',
                text: 'Vorlage für Ihre persönliche PatientenVerfügung. Wir beraten Sie gerne dazu.',
                icon: 'download',
                href: '/demo/medical/downloads/patientenVerfügung.pdf',
              },
              {
                title: 'Impfpass-Vorlage',
                text: 'Übersicht Ihrer bisherigen Impfungen zum SelbstausFüllen.',
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
            noticeText: 'Akutsprechstunde: Täglich 08:00 – 09:00 Uhr ohne Termin',
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
              'Im Notfall zählt jede Minute. Hier finden Sie alle wichtigen Nummern und Anlaufstellen für akute medizinische Situationen.',
            bgImage:
              'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1800&q=85',
            primaryCta: { label: 'Termin Akutsprechstunde', href: '/demo/medical/kontakt' },
          },
        },
        {
          ...B, type: 'emergencyInfo', id: 'md-notfall-info',
          data: {
            headline: 'Wichtige Notfallnummern & Anlaufstellen',
            subline: 'Bewahren Sie Ruhe und Wählen Sie die passende Anlaufstelle',
            entries: [
              {
                title: 'Akutsprechstunde',
                text: 'Bei akuten Beschwerden können Sie Täglich von 08:00 bis 09:00 Uhr ohne vorherige Terminvereinbarung in unsere Praxis kommen. Sie werden in der Reihenfolge Ihres Eintreffens behandelt.',
                phoneLabel: 'Praxistelefon: 0221 – 123 456 0',
                phoneHref: 'tel:+492211234560',
                icon: 'clock',
              },
              {
                title: 'Ärztlicher Bereitschaftsdienst',
                text: 'außerhalb unserer Sprechzeiten erreichen Sie den Ärztlichen Bereitschaftsdienst der KassenÄrztlichen Vereinigung. Dieser ist für nicht lebensbedrohliche Beschwerden zuständig, die nicht bis zur Nächsten Sprechstunde warten können.',
                phoneLabel: 'Telefon: 116 117 (kostenfrei)',
                phoneHref: 'tel:116117',
                icon: 'phone',
              },
              {
                title: 'Rettungsdienst',
                text: 'Bei lebensbedrohlichen Notfällen – Bewusstlosigkeit, starke Brustschmerzen, Atemnot, schwere Verletzungen, Schlaganfall-Verdacht – Wählen Sie sofort den Notruf. Jede Sekunde zählt.',
                phoneLabel: 'Notruf: 112',
                phoneHref: 'tel:112',
                icon: 'alert-triangle',
              },
              {
                title: 'Giftnotruf NRW',
                text: 'Bei Verdacht auf Vergiftungen – durch Medikamente, Reinigungsmittel, Pflanzen oder Chemikalien – wenden Sie sich an die Giftnotrufzentrale Bonn. Halten Sie wenn möglich die Verpackung bereit.',
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
              'Helle Räume, moderne Ausstattung und eine angenehme Atmosphäre. Unsere Praxis am Stadtpark wurde 2020 komplett renoviert und bietet Ihnen medizinische Versorgung auf höchstem Niveau.',
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
            subline: 'Verschaffen Sie sich einen Eindruck von unseren Räumlichkeiten',
            images: [
              { src: 'https://images.unsplash.com/photo-1629909615957-be38d6c1c5c5?w=900&q=80', alt: 'Empfangsbereich mit freundlichem Team', caption: 'Empfang' },
              { src: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80', alt: 'Helles Wartezimmer mit bequemer Bestuhlung', caption: 'Wartezimmer' },
              { src: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=80', alt: 'Moderner Behandlungsraum mit Untersuchungsliege', caption: 'Behandlungsraum 1' },
              { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80', alt: 'Behandlungsraum mit Ultraschallgerät', caption: 'Behandlungsraum 2' },
              { src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=900&q=80', alt: 'Behandlungsraum für kleinere Eingriffe', caption: 'Behandlungsraum 3' },
              { src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80', alt: 'Hauseigenes Labor mit Analysegeräten', caption: 'Labor' },
              { src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80', alt: 'EKG-Raum mit Ergometrie-Arbeitsplatz', caption: 'EKG-Raum' },
              { src: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=900&q=80', alt: 'Außenansicht der Praxis am Stadtpark', caption: 'Außenansicht' },
            ],
          },
        },
        {
          ...B, type: 'equipmentHighlights', id: 'md-praxis-equipment',
          data: {
            headline: 'Unsere Ausstattung',
            subline: 'Investition in modernste Medizintechnik für Ihre Gesundheit',
            items: [
              {
                title: 'Digitales Röntgen',
                text: 'In Kooperation mit der radiologischen Praxis im selben Gebäude bieten wir Ihnen digitale Röntgendiagnostik mit minimaler Strahlenbelastung. Termine werden direkt für Sie vereinbart.',
                image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&q=80',
                icon: 'x-ray',
              },
              {
                title: 'Modernes Ultraschallgerät',
                text: 'Hochauflösendes Sonographiegerät für Schilddrüse, Bauchorgane und Gefäßdiagnostik. Sofortige Befundung und Besprechung in der Sprechstunde.',
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=80',
                icon: 'monitor',
              },
              {
                title: 'EKG-System 12-Kanal',
                text: 'Digitales 12-Kanal-EKG für Ruhe- und Belastungsuntersuchungen mit automatischer Auswertung und Langzeitarchivierung.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80',
                icon: 'activity',
              },
              {
                title: 'Spirometrie',
                text: 'Digitales Spirometer für präzise Lungenfunktionsmessungen. Fluss-Volumen-Kurven und Trendanalysen für die Verlaufskontrolle bei Asthma und COPD.',
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
              'Wir freuen uns auf Ihren Besuch. Vereinbaren Sie jetzt Ihren Termin – online, telefonisch oder persönlich.',
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
            subline: 'Wählen Sie Ihren bevorzugten Weg zu einem Termin',
            options: [
              {
                title: 'Online buchen',
                text: 'Rund um die Uhr Verfügbar. Wählen Sie Arzt, Anlass und Ihren Wunschtermin bequem online.',
                icon: 'calendar',
                cta: { label: 'Zur Online-Terminbuchung', href: '/demo/medical/kontakt#termin' },
              },
              {
                title: 'Telefonisch',
                text: 'Montag bis Freitag während der Sprechzeiten erreichen Sie uns telefonisch.',
                icon: 'phone',
                cta: { label: '0221 – 123 456 0', href: 'tel:+492211234560' },
              },
              {
                title: 'Rückruf anfordern',
                text: 'Hinterlassen Sie Ihre Telefonnummer und wir melden uns schnellstmöglich bei Ihnen.',
                icon: 'phone-callback',
                cta: { label: 'Rückruf anfordern', href: '/demo/medical/kontakt#Rückruf' },
              },
            ],
          },
        },
        {
          ...B, type: 'locationContact', id: 'md-kontakt-location',
          data: {
            headline: 'So finden Sie uns',
            subline: 'Zentral gelegen am Kölner Stadtpark mit guter Anbindung',
            address: {
              name: 'Praxis am Stadtpark',
              street: 'Stadtparkweg 12',
              zip: '50735',
              city: 'Köln',
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
                text: 'Stadtparkweg 12, 50735 Köln',
                icon: 'map-pin',
              },
            ],
            directions: 'Barrierefreier Zugang im Erdgeschoss. Parkplätze direkt vor dem Haus. Haltestelle Linie 15 „Am Stadtpark" in 2 Minuten Fußweg.',
            formHeadline: 'Schreiben Sie uns',
            formFields: [
              { name: 'name', label: 'Ihr Name', type: 'text', required: true },
              { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true },
              { name: 'phone', label: 'Telefonnummer', type: 'tel', required: false },
              { name: 'subject', label: 'Betreff', type: 'select', options: ['Terminanfrage', 'Rezeptbestellung', 'Überweisung', 'Allgemeine Frage', 'Feedback'], required: true },
              { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
            ],
            formCta: 'Nachricht senden',
          },
        },
        {
          ...B, type: 'faq', id: 'md-kontakt-faq',
          data: {
            headline: 'Häufig gestellte Fragen',
            subline: 'Antworten auf die wichtigsten Fragen unserer Patienten',
            items: [
              {
                question: 'Wie kann ich einen Termin vereinbaren?',
                answer:
                  'Sie können Termine bequem über unser Online-Buchungssystem, telefonisch unter 0221 – 123 456 0 oder persönlich an unserem Empfang vereinbaren. für akute Beschwerden steht Ihnen Täglich von 08:00 bis 09:00 Uhr unsere offene Akutsprechstunde zur Verfügung.',
              },
              {
                question: 'Wie lange muss ich auf einen Termin warten?',
                answer:
                  'Routinetermine sind in der Regel innerhalb von 3–5 Werktagen Verfügbar. Vorsorgeuntersuchungen und Check-ups planen wir mit ca. 2 Wochen Vorlauf. Bei akuten Beschwerden kommen Sie einfach in unsere Tägliche Akutsprechstunde – ohne Wartezeit auf einen Termin.',
              },
              {
                question: 'Wie bestelle ich Folgerezepte oder Überweisungen?',
                answer:
                  'Folgerezepte und Überweisungen können Sie telefonisch, per E-Mail oder über unser Online-Portal bestellen. Bitte geben Sie Ihren Namen, Ihr Geburtsdatum und das gewünschte Medikament bzw. den Facharzt an. Die Dokumente liegen in der Regel am Nächsten Werktag zur Abholung bereit.',
              },
              {
                question: 'Nehmen Sie neue Patienten auf?',
                answer:
                  'Ja, wir nehmen gerne neue Patientinnen und Patienten auf – sowohl gesetzlich als auch privat Versicherte. Bitte bringen Sie zum Ersttermin Ihre Versichertenkarte, einen Lichtbildausweis und Ihren Impfpass mit. Den Anamnesebogen können Sie vorab auf unserer Website herunterladen.',
              },
              {
                question: 'Welche Sprachen werden in der Praxis gesprochen?',
                answer:
                  'Unser Team spricht Deutsch, Englisch, Türkisch, Französisch und Arabisch. So können wir viele Patientinnen und Patienten in ihrer Muttersprache betreuen und Missverständnisse bei medizinischen Themen vermeiden.',
              },
              {
                question: 'Ist die Praxis barrierefrei?',
                answer:
                  'Ja, unsere Praxis befindet sich im Erdgeschoss und ist vollständig barrierefrei zugänglich. Es gibt eine automatische Eingangstür, breite Flure und eine barrierefreie Toilette. Parkplätze für Menschen mit Behinderung sind direkt vor dem Eingang vorhanden.',
              },
            ],
          },
        },
      ],
    },
  ],
};
