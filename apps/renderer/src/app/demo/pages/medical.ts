import type { DemoSite } from './types';
import { B, HERO } from './types';

export const medicalSite: DemoSite = {
  industry: 'medical',
  industryKey: 'medical',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'md-home-hero', type: 'hero',
          data: { headline: 'Praxis am Stadtpark', subline: 'Hausarztmedizin, Diagnostik und Praevention mit klarer Terminstruktur.', badgeText: 'Aerzte & Praxen Demo', bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&q=85', specialtyLabel: 'Allgemeinmedizin', emergencyHint: 'Akutsprechstunde taeglich 8:00-9:00', trustItems: ['Online-Termine', 'Kassen & Privat', 'Barrierearme Praxis'], primaryCta: { label: 'Termin buchen', href: '/demo/medical/patienten' }, emergencyCta: { label: 'Akutfall', href: '/demo/medical/notfall' }, secondaryCta: { label: 'Leistungen', href: '/demo/medical/leistungen' } },
        },
        {
          ...B, id: 'md-home-services', type: 'serviceOverview',
          data: { headline: 'Leistungen', subline: 'Medizinische Versorgung fuer Alltag, Vorsorge und akute Beschwerden.', badgeText: 'Versorgung', items: [{ title: 'Hausarztmedizin', text: 'Akute Beschwerden, Verlaufskontrollen und langfristige Betreuung.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=80', icon: 'stethoscope', category: 'Allgemein', cta: { label: 'Mehr erfahren', href: '/demo/medical/leistungen' } }], ctaPrimary: { label: 'Termin vereinbaren', href: '/demo/medical/patienten' } },
        },
        {
          ...B, id: 'md-home-appointment', type: 'appointmentCta',
          data: { headline: 'Termin vereinbaren', subline: 'Online, telefonisch oder per Rueckruf.', badgeText: 'Termin', introText: 'Bitte waehlen Sie je nach Anliegen Terminart und Dringlichkeit.', onlineCta: { label: 'Online buchen', href: '/demo/medical/kontakt' }, phoneCta: { label: 'Anrufen', href: 'tel:+49221123456' }, callbackCta: { label: 'Rueckruf anfragen', href: '/demo/medical/kontakt' }, externalCta: { label: 'Videosprechstunde', href: '/demo/medical/kontakt' }, notes: ['Akute Beschwerden morgens anmelden', 'Befunde bitte vorab senden'] },
        },
        {
          ...B, id: 'md-home-values', type: 'valuesGrid',
          data: { headline: 'Praxiswerte', subline: 'Medizin, die erklaert und begleitet.', badgeText: 'Haltung', items: [{ icon: 'heart-pulse', title: 'Verstaendlich', text: 'Befunde und Optionen werden klar erklaert.' }, { icon: 'clock', title: 'Planbar', text: 'Terminarten und Rueckrufe sind strukturiert.' }] },
        },
      ],
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      sections: [
        {
          ...HERO, id: 'md-leist-hero', type: 'hero',
          data: { headline: 'Unsere Leistungen', subline: 'Hausarztmedizin, Diagnostik und Vorsorge unter einem Dach.', badgeText: 'Leistungen', bgImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1800&q=85', primaryCta: { label: 'Termin buchen', href: '/demo/medical/kontakt' } },
        },
        {
          ...B, id: 'md-leist-services', type: 'serviceOverview',
          data: { headline: 'Leistungen', subline: 'Medizinische Versorgung fuer Alltag, Vorsorge und akute Beschwerden.', badgeText: 'Versorgung', items: [{ title: 'Hausarztmedizin', text: 'Akute Beschwerden, Verlaufskontrollen und langfristige Betreuung.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=80', icon: 'stethoscope', category: 'Allgemein', cta: { label: 'Mehr erfahren', href: '/demo/medical/kontakt' } }], ctaPrimary: { label: 'Termin vereinbaren', href: '/demo/medical/kontakt' } },
        },
        {
          ...B, id: 'md-leist-treatment', type: 'treatmentDetail',
          data: { headline: 'Behandlungsdetails', subline: 'Was Patientinnen und Patienten vor dem Termin wissen sollten.', badgeText: 'Ablauf', treatments: [{ title: 'Gesundheits-Check-up', text: 'Strukturierte Vorsorge mit Labor, Anamnese und persoenlicher Besprechung.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80', durationLabel: 'ca. 45 Minuten', requirementLabel: 'nuechtern nach Absprache', noticeText: 'Bitte Versicherungskarte und Medikamentenplan mitbringen.', steps: ['Anamnese', 'Untersuchung', 'Labor', 'Besprechung'], cta: { label: 'Check-up buchen', href: '/demo/medical/kontakt' } }] },
        },
        {
          ...B, id: 'md-leist-diagnostics', type: 'diagnostics',
          data: { headline: 'Diagnostik', subline: 'Schnelle Untersuchungen direkt in der Praxis.', badgeText: 'Diagnostik', items: [{ title: 'EKG & Belastungs-EKG', text: 'Herz-Kreislauf-Diagnostik bei Beschwerden, Vorsorge oder Verlaufskontrollen.', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&q=80', benefitLabel: 'direkt vor Ort', methodLabel: 'EKG', cta: { label: 'Anfragen', href: '/demo/medical/kontakt' } }] },
        },
      ],
    },
    {
      slug: 'team',
      title: 'Unser Team',
      sections: [
        {
          ...HERO, id: 'md-team-hero', type: 'hero',
          data: { headline: 'Unser Team', subline: 'Fachaerztliche Betreuung und ein eingespieltes Praxisteam.', badgeText: 'Team', bgImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=85', primaryCta: { label: 'Termin buchen', href: '/demo/medical/kontakt' } },
        },
        {
          ...B, id: 'md-team-doctors', type: 'doctorTeam',
          data: { headline: 'Aerzteteam', subline: 'Fachaerztliche Betreuung mit festen Ansprechpartnern.', badgeText: 'Team', doctors: [{ name: 'Dr. Lena Hoffmann', title: 'Fachaerztin fuer Allgemeinmedizin', specialty: 'Praevention & Innere Medizin', bio: 'Betreut Patientinnen und Patienten mit Schwerpunkt Vorsorge, Diabetes und Herz-Kreislauf.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80', languages: ['Deutsch', 'Englisch'], appointmentCta: { label: 'Termin bei Dr. Hoffmann', href: '/demo/medical/kontakt' } }] },
        },
        {
          ...B, id: 'md-team-practice', type: 'practiceTeam',
          data: { headline: 'Praxisteam', subline: 'Organisation, Diagnostik und Empfang arbeiten eng zusammen.', badgeText: 'Praxis', members: [{ name: 'Mara Schmitz', role: 'Praxismanagerin', bio: 'Koordiniert Termine, Rueckrufe und Befundkommunikation.', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=900&q=80' }] },
        },
        {
          ...B, id: 'md-team-certs', type: 'certifications',
          data: { headline: 'Qualifikationen', subline: 'Standards, Fortbildungen und Mitgliedschaften.', badgeText: 'Qualitaet', items: [{ icon: 'shield-check', title: 'DMP Diabetes', text: 'Strukturierte Versorgung und regelmaessige Verlaufskontrollen.', metaLabel: 'Zertifiziert' }] },
        },
      ],
    },
    {
      slug: 'patienten',
      title: 'Patienten-Info',
      sections: [
        {
          ...HERO, id: 'md-pat-hero', type: 'hero',
          data: { headline: 'Patienten-Informationen', subline: 'Alles Wichtige fuer Ihren Praxisbesuch auf einen Blick.', badgeText: 'Patienten', bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&q=85', primaryCta: { label: 'Termin buchen', href: '/demo/medical/kontakt' } },
        },
        {
          ...B, id: 'md-pat-info', type: 'patientInfo',
          data: { headline: 'Patienteninfo', subline: 'Gut vorbereitet zum Termin.', badgeText: 'Vorbereitung', introText: 'Viele Anliegen lassen sich schneller klaeren, wenn die wichtigsten Unterlagen bereitliegen.', cards: [{ icon: 'clipboard-list', title: 'Bitte mitbringen', text: 'Unterlagen fuer den ersten Besuch.', items: ['Versicherungskarte', 'Medikamentenplan', 'Vorbefunde'] }] },
        },
        {
          ...B, id: 'md-pat-insurance', type: 'insuranceInfo',
          data: { headline: 'Kassen & Privat', subline: 'Transparente Hinweise zu Abrechnung und Leistungen.', badgeText: 'Versicherung', items: [{ title: 'Gesetzlich versichert', text: 'Hausarztmedizin und medizinisch notwendige Diagnostik nach Kassenleistung.', image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=900&q=80', typeLabel: 'GKV', notice: 'Individuelle Gesundheitsleistungen werden vorher besprochen.', cta: { label: 'Frage stellen', href: '/demo/medical/kontakt' } }] },
        },
        {
          ...B, id: 'md-pat-downloads', type: 'downloadForms',
          data: { headline: 'Downloads', subline: 'Formulare und Informationen vor dem Termin.', badgeText: 'Formulare', items: [{ title: 'Anamnesebogen', text: 'Vor dem Ersttermin ausfuellen und mitbringen.', fileLabel: 'PDF', fileHref: '/downloads/anamnese.pdf', metaLabel: 'Erstbesuch' }] },
        },
        {
          ...B, id: 'md-pat-hours', type: 'openingHours',
          data: { headline: 'Sprechzeiten', subline: 'Regulaere Termine und Akutsprechstunde.', badgeText: 'Zeiten', days: [{ label: 'Mo-Fr', hours: '08:00-13:00', note: 'Sprechstunde' }, { label: 'Mo, Di, Do', hours: '15:00-18:00', note: 'Termine' }], acuteCareText: 'Akutsprechstunde taeglich 8:00-9:00 nach telefonischer Anmeldung.', holidayNote: 'Urlaubsvertretung wird auf der Startseite bekannt gegeben.', ctaPrimary: { label: 'Termin buchen', href: '/demo/medical/kontakt' } },
        },
      ],
    },
    {
      slug: 'notfall',
      title: 'Notfall',
      sections: [
        {
          ...HERO, id: 'md-notf-hero', type: 'hero',
          data: { headline: 'Notfallhinweise', subline: 'Wichtige Informationen fuer akute Beschwerden und Notfaelle.', badgeText: 'Notfall', bgImage: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1800&q=85', primaryCta: { label: 'Sprechzeiten ansehen', href: '/demo/medical/patienten' } },
        },
        {
          ...B, id: 'md-notf-info', type: 'emergencyInfo',
          data: { headline: 'Notfallhinweise', subline: 'Wohin Sie sich ausserhalb der Sprechzeiten wenden koennen.', badgeText: 'Akut', introText: 'Bei lebensbedrohlichen Symptomen bitte sofort den Notruf waehlen.', items: [{ title: 'Lebensbedrohlicher Notfall', text: 'Bei Atemnot, Brustschmerz oder Bewusstlosigkeit.', phoneLabel: '112', phoneHref: 'tel:112' }, { title: 'Aerztlicher Bereitschaftsdienst', text: 'Ausserhalb unserer Sprechzeiten.', phoneLabel: '116117', phoneHref: 'tel:116117' }], ctaPrimary: { label: 'Sprechzeiten ansehen', href: '/demo/medical/patienten' } },
        },
      ],
    },
    {
      slug: 'praxis',
      title: 'Unsere Praxis',
      sections: [
        {
          ...HERO, id: 'md-prax-hero', type: 'hero',
          data: { headline: 'Unsere Praxis', subline: 'Moderne Raeume und Ausstattung fuer Ihre Gesundheit.', badgeText: 'Praxis', bgImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1800&q=85', primaryCta: { label: 'Termin buchen', href: '/demo/medical/kontakt' } },
        },
        {
          ...B, id: 'md-prax-gallery', type: 'practiceGallery',
          data: { headline: 'Praxis-Galerie', subline: 'Einblicke in Empfang, Wartebereich und Behandlung.', badgeText: 'Praxis', images: [{ src: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80', alt: 'Praxisempfang', caption: 'Empfang', category: 'Ankommen' }, { src: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f1e4?w=900&q=80', alt: 'Behandlungszimmer', caption: 'Behandlung', category: 'Praxis' }] },
        },
        {
          ...B, id: 'md-prax-equipment', type: 'equipmentHighlights',
          data: { headline: 'Ausstattung', subline: 'Moderne Diagnostik fuer schnelle Entscheidungen.', badgeText: 'Technik', items: [{ title: 'Ultraschall', text: 'Abklaerung direkt in der Praxis.', image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=900&q=80', category: 'Diagnostik', benefitLabel: 'schnell verfuegbar', cta: { label: 'Termin anfragen', href: '/demo/medical/kontakt' } }] },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'md-kont-hero', type: 'hero',
          data: { headline: 'Kontakt & Anfahrt', subline: 'Erreichen Sie uns fuer Termine, Rezepte und Fragen.', badgeText: 'Kontakt', bgImage: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1800&q=85', primaryCta: { label: 'Anrufen', href: 'tel:+49221123456' } },
        },
        {
          ...B, id: 'md-kont-contact', type: 'locationContact',
          data: { headline: 'Kontakt & Anfahrt', subline: 'Praxis am Stadtpark in zentraler Lage.', badgeText: 'Kontakt', introText: 'Fuer Termine, Rezepte und Befundfragen erreichen Sie uns telefonisch oder per Formular.', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=900&q=80', mapEmbedUrl: '', formEnabled: true, namePlaceholder: 'Name', emailPlaceholder: 'E-Mail', messagePlaceholder: 'Nachricht', submitLabel: 'Anfrage senden', infoCards: [{ icon: 'phone', label: 'Telefon', value: '+49 221 123456' }, { icon: 'mail', label: 'E-Mail', value: 'praxis@example.de' }, { icon: 'map-pin', label: 'Adresse', value: 'Parkallee 12, 50667 Koeln' }], primaryCta: { label: 'Anrufen', href: 'tel:+49221123456' }, secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' } },
        },
        {
          ...B, id: 'md-kont-faq', type: 'faq',
          data: { headline: 'FAQ', subline: 'Haeufige Fragen vor dem Praxisbesuch.', badgeText: 'Fragen', items: [{ question: 'Kann ich Rezepte online anfragen?', answer: 'Wiederholungsrezepte koennen nach vorheriger Behandlung ueber das Kontaktformular angefragt werden.' }], ctaPrimary: { label: 'Kontakt aufnehmen', href: '/demo/medical/kontakt' } },
        },
      ],
    },
  ],
};
