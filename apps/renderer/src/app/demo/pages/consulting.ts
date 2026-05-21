import type { DemoSite } from './types';
import { B, HERO } from './types';

export const consultingSite: DemoSite = {
  industry: 'consulting',
  industryKey: 'consulting',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'con-hero', type: 'hero',
          data: {
            headline: 'Recht. Klarheit. Lösungen.',
            subline: 'Kanzlei Bergmann & Partner — seit über 20 Jahren kompetente Rechtsberatung in Berlin für Privatpersonen und Unternehmen.',
            bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=85',
            overlayOpacity: 0.75,
            trustItems: ['Fachanwälte', 'Kostenlose Erstberatung', 'Über 500 gewonnene Fälle'],
            primaryCta: { label: 'Erstberatung vereinbaren', href: '/demo/consulting/kontakt' },
            secondaryCta: { label: 'Rechtsgebiete ansehen', href: '/demo/consulting/rechtsgebiete' },
          },
        },
        {
          ...B, id: 'con-areas-home', type: 'practiceAreas',
          data: {
            headline: 'Unsere Rechtsgebiete',
            subline: 'Fundierte Beratung in den Bereichen, die für Sie zählen.',
            badgeText: 'Kompetenzen',
            areas: [
              { title: 'Arbeitsrecht', text: 'Kündigungsschutz, Abfindungen, Aufhebungsverträge und Betriebsratsberatung.', icon: 'briefcase', href: '/demo/consulting/rechtsgebiete' },
              { title: 'Familienrecht', text: 'Scheidung, Unterhalt, Sorgerecht und Vermögensaufteilung.', icon: 'heart', href: '/demo/consulting/rechtsgebiete' },
              { title: 'Miet- & Immobilienrecht', text: 'Mietverträge, Räumungsklagen, Eigenbedarf und Gewerbemiete.', icon: 'home', href: '/demo/consulting/rechtsgebiete' },
              { title: 'Handels- & Gesellschaftsrecht', text: 'Firmengründung, Vertragsgestaltung, M&A und Gesellschafterstreitigkeiten.', icon: 'building-2', href: '/demo/consulting/rechtsgebiete' },
              { title: 'Strafrecht', text: 'Verteidigung in Ermittlungsverfahren, Wirtschaftsstrafrecht, Revision.', icon: 'shield', href: '/demo/consulting/rechtsgebiete' },
              { title: 'Erbrecht', text: 'Testamentsgestaltung, Erbstreitigkeiten und Nachlassverwaltung.', icon: 'scroll-text', href: '/demo/consulting/rechtsgebiete' },
            ],
          },
        },
        {
          ...B, id: 'con-results', type: 'caseResults',
          data: {
            headline: 'Unsere Erfolgsbilanz',
            subline: 'Zahlen, die für sich sprechen.',
            stats: [
              { value: 500, suffix: '+', label: 'Gewonnene Fälle', icon: 'trophy' },
              { value: 98, suffix: '%', label: 'Mandantenzufriedenheit', icon: 'heart' },
              { value: 20, suffix: '+', label: 'Jahre Erfahrung', icon: 'calendar' },
              { value: 4, label: 'Fachanwälte', icon: 'users' },
            ],
          },
        },
        {
          ...B, id: 'con-team-home', type: 'team',
          data: {
            headline: 'Ihre Anwälte',
            subline: 'Erfahrene Juristen mit persönlichem Einsatz.',
            badgeText: 'Team',
            members: [
              { name: 'Dr. Thomas Bergmann', role: 'Gründungspartner', specialization: 'Handels- & Gesellschaftsrecht', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
              { name: 'Katharina Weiß', role: 'Partnerin', specialization: 'Arbeitsrecht & Familienrecht', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
              { name: 'Markus Bauer', role: 'Senior Associate', specialization: 'Miet- & Immobilienrecht', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
            ],
          },
        },
        {
          ...B, id: 'con-testimonials-home', type: 'testimonials',
          data: {
            headline: 'Das sagen unsere Mandanten',
            badgeText: 'Bewertungen',
            items: [
              { quote: 'Dr. Bergmann hat meinen Kündigungsschutzprozess souverän gewonnen. Kompetent, ruhig und immer erreichbar.', name: 'Michael S.', context: 'Arbeitsrecht', rating: 5 },
              { quote: 'Die Scheidung war emotional sehr belastend, aber Frau Weiß hat alles professionell und empathisch abgewickelt.', name: 'Sandra K.', context: 'Familienrecht', rating: 5 },
              { quote: 'Herr Bauer hat unseren Mietstreit in drei Wochen beigelegt. Hervorragende Verhandlungsführung.', name: 'Ehepaar Werner', context: 'Mietrecht', rating: 5 },
            ],
          },
        },
        {
          ...B, id: 'con-cta-home', type: 'ctaBand',
          data: {
            headline: 'Rechtliche Fragen?',
            subline: 'Vereinbaren Sie jetzt Ihre kostenlose Erstberatung — unverbindlich und vertraulich.',
            ctaPrimary: { label: 'Erstberatung vereinbaren', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-logo-marquee', type: 'logoMarquee',
          data: {
            headline: 'Bekannt aus & Partner',
            logos: [
              { name: 'Handelsblatt', src: '/logos/handelsblatt.svg' },
              { name: 'JUVE Rechtsmarkt', src: '/logos/juve.svg' },
              { name: 'Legal Tribune Online', src: '/logos/lto.svg' },
              { name: 'IHK Berlin', src: '/logos/ihk-berlin.svg' },
              { name: 'DAV', src: '/logos/dav.svg' },
            ],
          },
        },
        {
          ...B, id: 'con-faq-home', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            items: [
              { question: 'Was kostet die Erstberatung?', answer: 'Die Erstberatung (30 Min.) ist bei uns kostenlos und unverbindlich.' },
              { question: 'Wie schnell erhalte ich einen Termin?', answer: 'In dringenden Fällen bieten wir Termine innerhalb von 48 Stunden an.' },
              { question: 'Arbeiten Sie auch mit Rechtsschutzversicherungen?', answer: 'Ja, wir rechnen direkt mit allen gängigen Rechtsschutzversicherungen ab.' },
            ],
          },
        },
      ],
    },
    {
      slug: 'rechtsgebiete',
      title: 'Rechtsgebiete',
      sections: [
        {
          ...HERO, id: 'con-hero-areas', type: 'hero',
          data: {
            headline: 'Rechtsgebiete',
            subline: 'In diesen Bereichen beraten und vertreten wir Sie kompetent und engagiert.',
            bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=85',
            overlayOpacity: 0.8,
            primaryCta: { label: 'Erstberatung vereinbaren', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-areas-page', type: 'practiceAreas',
          data: {
            headline: 'Unsere Rechtsgebiete im Überblick',
            subline: 'In diesen Bereichen beraten und vertreten wir Sie.',
            areas: [
              { title: 'Arbeitsrecht', text: 'Kündigungsschutz, Abfindungsverhandlung, Aufhebungsverträge, Arbeitszeugnisse, Betriebsratsberatung und Arbeitsvertragsgestaltung.', icon: 'briefcase' },
              { title: 'Familienrecht', text: 'Einvernehmliche und streitige Scheidung, Unterhaltsberechnung, Sorge- und Umgangsrecht, Zugewinnausgleich, Ehevertrag.', icon: 'heart' },
              { title: 'Miet- & Immobilienrecht', text: 'Mieterhöhung, Kündigung, Räumungsschutz, Eigenbedarf, Gewerbemietrecht, Maklerrecht und Kaufvertragsgestaltung.', icon: 'home' },
              { title: 'Handels- & Gesellschaftsrecht', text: 'GmbH-Gründung, Gesellschafterverträge, Geschäftsführerhaftung, Unternehmenskauf (M&A), Handelsregister.', icon: 'building-2' },
              { title: 'Strafrecht', text: 'Wirtschaftsstrafrecht, Betrug, Untreue, Verkehrsstrafsachen, Ermittlungsverfahren, Revision und Berufung.', icon: 'shield' },
              { title: 'Erbrecht', text: 'Testamente, Erbverträge, Pflichtteilsansprüche, Erbauseinandersetzung, Testamentsvollstreckung, Vorsorgevollmacht.', icon: 'scroll-text' },
            ],
          },
        },
        {
          ...B, id: 'con-fees', type: 'feeTable',
          data: {
            headline: 'Transparente Honorargestaltung',
            subline: 'Unsere Vergütungsmodelle auf einen Blick.',
            badgeText: 'Kosten',
            fees: [
              { title: 'Erstberatung', price: 'Kostenlos', description: 'Erstes Gespräch (30 Min.) zur Einschätzung Ihres Falls — unverbindlich und vertraulich.', icon: 'message-circle', highlighted: true },
              { title: 'Stundensatz', price: 'ab 250 €/h', description: 'Individuelle Abrechnung nach tatsächlichem Aufwand für Beratung und Vertretung.', icon: 'clock' },
              { title: 'Pauschalhonorar', price: 'nach Vereinbarung', description: 'Planbare Kosten für standardisierte Mandate wie Vertragserstellung oder Firmengründung.', icon: 'file-text' },
            ],
            footnote: 'Wir informieren Sie vor Mandatsübernahme transparent über die zu erwartenden Kosten. Raten­zahlung nach Absprache möglich.',
          },
        },
        {
          ...B, id: 'con-areas-faq', type: 'faq',
          data: {
            headline: 'Fragen zu unseren Rechtsgebieten',
            items: [
              { question: 'Bearbeiten Sie auch Fälle außerhalb Berlins?', answer: 'Ja, wir vertreten Mandanten bundesweit. Gerichtstermine außerhalb Berlins nehmen wir persönlich oder über Korrespondenzanwälte wahr.' },
              { question: 'Kann ich den Anwalt wechseln, wenn mein aktueller nicht weiterhilft?', answer: 'Ja, ein Anwaltswechsel ist jederzeit möglich. Wir übernehmen laufende Mandate und sichten die bereits erarbeitete Akte.' },
            ],
          },
        },
        {
          ...B, id: 'con-cta-areas', type: 'ctaBand',
          data: {
            headline: 'Ihr Fall ist einzigartig',
            subline: 'Lassen Sie uns gemeinsam die beste Strategie besprechen.',
            ctaPrimary: { label: 'Jetzt Termin vereinbaren', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-areas-testimonials', type: 'testimonials',
          data: {
            headline: 'Mandanten über unsere Arbeit',
            items: [
              { quote: 'Mein Mietrechtsfall schien aussichtslos — Herr Bauer hat eine Lösung gefunden, an die ich nie gedacht hätte.', name: 'Familie Richter', context: 'Mietrecht', rating: 5 },
              { quote: 'Dank Frau Weiß konnte ich mich einvernehmlich scheiden lassen. Alles in nur 4 Monaten geregelt.', name: 'Andreas T.', context: 'Familienrecht', rating: 5 },
            ],
          },
        },
      ],
    },
    {
      slug: 'team',
      title: 'Team',
      sections: [
        {
          ...HERO, id: 'con-hero-team', type: 'hero',
          data: {
            headline: 'Unser Team',
            subline: 'Erfahrene Juristen mit persönlichem Einsatz für Ihr Recht.',
            bgImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1800&q=85',
            overlayOpacity: 0.8,
            primaryCta: { label: 'Kontakt aufnehmen', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-team-page', type: 'team',
          data: {
            headline: 'Unsere Anwälte & Mitarbeiter',
            subline: 'Ein erfahrenes Team — persönlich, kompetent, engagiert.',
            members: [
              { name: 'Dr. Thomas Bergmann', role: 'Gründungspartner, Fachanwalt für Handelsrecht', specialization: 'Handels- & Gesellschaftsrecht, M&A', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', email: 'bergmann@bergmann-partner.de', phone: '+49 30 2589 4401' },
              { name: 'Katharina Weiß', role: 'Partnerin, Fachanwältin für Arbeitsrecht', specialization: 'Arbeitsrecht, Familienrecht', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', email: 'weiss@bergmann-partner.de', phone: '+49 30 2589 4402' },
              { name: 'Markus Bauer', role: 'Senior Associate', specialization: 'Miet- & Immobilienrecht', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', email: 'bauer@bergmann-partner.de' },
              { name: 'Lisa Hartmann', role: 'Rechtsanwaltsfachangestellte', specialization: 'Sekretariat & Mandantenverwaltung', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', email: 'hartmann@bergmann-partner.de' },
            ],
          },
        },
        {
          ...B, id: 'con-team-values', type: 'textImage',
          data: {
            headline: 'Unsere Arbeitsweise',
            text: 'Bei Bergmann & Partner steht der Mensch im Mittelpunkt. Wir nehmen uns Zeit für jeden Fall, kommunizieren verständlich und halten Sie über jeden Schritt auf dem Laufenden. Juristische Fachsprache übersetzen wir in klare Worte — damit Sie immer wissen, wo Sie stehen.',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...B, id: 'con-team-cta', type: 'ctaBand',
          data: {
            headline: 'Lernen Sie uns persönlich kennen',
            subline: 'Vereinbaren Sie ein unverbindliches Erstgespräch — telefonisch, per Video oder vor Ort.',
            ctaPrimary: { label: 'Termin vereinbaren', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-team-social', type: 'socialProofBar',
          data: {
            items: [
              { value: '20+', label: 'Anwälte & Berater' },
              { value: '95%', label: 'Erfolgsquote' },
              { value: '2.500+', label: 'Mandate bearbeitet' },
            ],
          },
        },
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'Über uns',
      sections: [
        {
          ...HERO, id: 'con-hero-about', type: 'hero',
          data: {
            headline: 'Über unsere Kanzlei',
            subline: 'Tradition, Kompetenz und persönliche Betreuung seit 2004.',
            bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85',
            overlayOpacity: 0.8,
            primaryCta: { label: 'Erstberatung vereinbaren', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-story', type: 'textImage',
          data: {
            headline: 'Kanzlei mit Tradition und Weitblick',
            text: '<p>Die Kanzlei Bergmann & Partner wurde 2004 von Dr. Thomas Bergmann in Berlin gegründet. Was als Ein-Mann-Kanzlei begann, ist heute ein Team aus vier Juristen, die sich auf die Bereiche Arbeitsrecht, Familienrecht, Mietrecht und Wirtschaftsrecht spezialisiert haben.</p><p>Unsere Philosophie: Rechtliche Exzellenz gepaart mit persönlicher Betreuung. Jeder Mandant erhält einen festen Ansprechpartner und transparente Kommunikation in jeder Phase seines Falls.</p>',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
            imagePosition: 'right',
          },
        },
        {
          ...B, id: 'con-process', type: 'processSteps',
          data: {
            headline: 'So läuft Ihre Beratung ab',
            badgeText: 'Ablauf',
            steps: [
              { title: 'Erstgespräch', text: 'Kostenlose Erstberatung: Wir hören zu, analysieren Ihren Fall und schätzen Ihre Erfolgsaussichten ein.', icon: 'message-circle' },
              { title: 'Strategie', text: 'Wir entwickeln eine maßgeschneiderte Strategie und besprechen Kosten und Zeitrahmen transparent.', icon: 'compass' },
              { title: 'Umsetzung', text: 'Ihr Anwalt übernimmt — von der Korrespondenz über Verhandlungen bis zur Vertretung vor Gericht.', icon: 'scale' },
              { title: 'Abschluss', text: 'Wir informieren Sie über das Ergebnis und beraten zu weiteren Schritten, falls nötig.', icon: 'check-circle' },
            ],
          },
        },
        {
          ...B, id: 'con-results-about', type: 'caseResults',
          data: {
            headline: 'Zahlen & Fakten',
            stats: [
              { value: 500, suffix: '+', label: 'Abgeschlossene Mandate', icon: 'folder' },
              { value: 20, suffix: '+', label: 'Jahre Berufserfahrung', icon: 'calendar' },
              { value: 98, suffix: '%', label: 'Weiterempfehlungsrate', icon: 'thumbs-up' },
              { value: 3, label: 'Fachanwaltstitel', icon: 'award' },
            ],
          },
        },
        {
          ...B, id: 'con-about-memberships', type: 'richText',
          data: {
            content: '<h2>Mitgliedschaften & Zertifizierungen</h2><p>Unsere Anwälte sind Mitglieder im Deutschen Anwaltverein (DAV), der Rechtsanwaltskammer Berlin und diversen Fachanwaltsvereinigungen. Dr. Bergmann ist zudem zertifizierter Mediator (DGM) und Wirtschaftsmediator.</p>',
          },
        },
        {
          ...B, id: 'con-about-testimonials', type: 'testimonials',
          data: {
            headline: 'Mandanten über die Kanzlei',
            items: [
              { quote: 'Professionell, menschlich und immer erreichbar. So stelle ich mir eine Kanzlei vor.', name: 'Dr. Rainer F.', context: 'Gesellschaftsrecht', rating: 5 },
              { quote: 'Herr Bergmann hat meine Firmengründung begleitet — von der Satzung bis zum Handelsregister alles aus einer Hand.', name: 'Sarah M.', context: 'GmbH-Gründung', rating: 5 },
            ],
          },
        },
      ],
    },
    {
      slug: 'aktuelles',
      title: 'Aktuelles',
      sections: [
        {
          ...HERO, id: 'con-hero-news', type: 'hero',
          data: {
            headline: 'Aktuelles & Fachbeiträge',
            subline: 'Aktuelle Entwicklungen aus der Rechtsprechung, verständlich aufbereitet.',
            bgImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=85',
            overlayOpacity: 0.8,
          },
        },
        {
          ...B, id: 'con-publications', type: 'publications',
          data: {
            headline: 'Fachbeiträge & Neuigkeiten',
            subline: 'Aktuelle Entwicklungen aus der Rechtsprechung, verständlich aufbereitet.',
            badgeText: 'Aktuelles',
            articles: [
              { title: 'Neue Regeln bei Kündigungen ab 2026', excerpt: 'Das Bundesarbeitsgericht hat die Anforderungen an betriebsbedingte Kündigungen verschärft. Was Arbeitgeber und Arbeitnehmer jetzt wissen müssen.', date: '12. Mai 2026', category: 'Arbeitsrecht', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80' },
              { title: 'Mietpreisbremse: Aktuelle Rechtsprechung', excerpt: 'Der BGH hat entschieden: Vermieter müssen bei Neuvermietung die Mietpreisbremse strikter einhalten. Ein Überblick über die wichtigsten Urteile.', date: '3. Mai 2026', category: 'Mietrecht', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80' },
              { title: 'GmbH-Gründung: Neue Möglichkeiten durch Online-Verfahren', excerpt: 'Seit 2025 können GmbHs vollständig digital gegründet werden. Wir erklären den Ablauf und worauf Sie achten sollten.', date: '21. April 2026', category: 'Gesellschaftsrecht', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80' },
            ],
          },
        },
        {
          ...B, id: 'con-news-newsletter', type: 'richText',
          data: {
            content: '<h2>📬 Rechts-Newsletter</h2><p>Monatlich erscheint unser Newsletter mit aktuellen Urteilen, Praxistipps und Veranstaltungshinweisen. Kostenlos, verständlich und abbestellbar. Bereits über 1.200 Abonnenten vertrauen auf unsere Einordnungen zu relevanten Rechtsfragen.</p>',
          },
        },
        {
          ...B, id: 'con-news-cta', type: 'ctaBand',
          data: {
            headline: 'Individuelle Rechtsfrage?',
            subline: 'Unsere Fachbeiträge ersetzen keine Beratung. Lassen Sie uns Ihren konkreten Fall besprechen.',
            ctaPrimary: { label: 'Erstberatung buchen', href: '/demo/consulting/kontakt' },
          },
        },
        {
          ...B, id: 'con-news-social', type: 'socialProofBar',
          data: {
            items: [
              { value: '50+', label: 'Fachbeiträge' },
              { value: '12', label: 'Rechtsgebiete' },
              { value: 'Monatlich', label: 'neue Artikel' },
            ],
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'con-hero-contact', type: 'hero',
          data: {
            headline: 'Kontakt & Erstberatung',
            subline: 'Schildern Sie uns Ihr Anliegen — wir melden uns innerhalb von 24 Stunden.',
            bgImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1800&q=85',
            overlayOpacity: 0.8,
            primaryCta: { label: 'Jetzt anrufen', href: 'tel:+493025894400' },
          },
        },
        {
          ...B, id: 'con-contact', type: 'contact',
          data: {
            headline: 'Kontakt & Erstberatung',
            subline: 'Schildern Sie uns Ihr Anliegen — wir melden uns innerhalb von 24 Stunden.',
            phone: '+49 30 2589 4400',
            email: 'kanzlei@bergmann-partner.de',
            address: 'Friedrichstraße 78, 10117 Berlin',
            hours: ['Mo–Fr: 09:00–18:00 Uhr', 'Sa: nach Vereinbarung', 'So: geschlossen'],
          },
        },
        {
          ...B, id: 'con-faq', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            badgeText: 'FAQ',
            items: [
              { question: 'Was kostet die Erstberatung?', answer: 'Die Erstberatung (ca. 30 Minuten) ist bei uns kostenlos und unverbindlich. Wir verschaffen uns einen Überblick und geben Ihnen eine erste Einschätzung.' },
              { question: 'Übernimmt meine Rechtsschutzversicherung die Kosten?', answer: 'In vielen Fällen ja. Wir klären die Deckungszusage direkt mit Ihrer Versicherung — Sie müssen sich um nichts kümmern.' },
              { question: 'Wie schnell erhalte ich einen Termin?', answer: 'In der Regel innerhalb von 48 Stunden. In dringenden Fällen (z.B. Kündigung erhalten) auch kurzfristiger.' },
              { question: 'Kann ich auch eine Online-Beratung erhalten?', answer: 'Ja, wir bieten Beratung per Video-Call an. Dies eignet sich vor allem für eine Ersteinschätzung oder wenn Sie nicht in Berlin vor Ort sind.' },
              { question: 'In welchen Sprachen beraten Sie?', answer: 'Unsere Kanzlei berät auf Deutsch und Englisch. Für andere Sprachen arbeiten wir mit vereidigten Dolmetschern zusammen.' },
            ],
          },
        },
        {
          ...B, id: 'con-contact-directions', type: 'textImage',
          data: {
            headline: 'So finden Sie uns',
            text: 'Unsere Kanzlei liegt direkt an der Friedrichstraße, 3 Minuten vom U-Bahnhof Stadtmitte (U2/U6). Eingang über den Innenhof, 2. OG. Barrierefreier Zugang über den Aufzug im Seiteneingang.\n\nParkplätze sind in der Tiefgarage Friedrichstraße (Einfahrt Mohrenstraße) verfügbar.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            imagePosition: 'left',
          },
        },
        {
          ...B, id: 'con-contact-trust', type: 'statsCounter',
          data: {
            headline: 'Warum Bergmann & Partner',
            stats: [
              { value: 24, suffix: 'h', label: 'Rückmeldung garantiert' },
              { value: 0, suffix: ' €', label: 'Erstberatung' },
              { value: 98, suffix: '%', label: 'Weiterempfehlung' },
              { value: 4.9, suffix: '★', label: 'Google-Bewertung' },
            ],
          },
        },
      ],
    },
  ],
};
