import type { DemoSite } from './types';
import { B, HERO } from './types';

export const handwerkSite: DemoSite = {
  industry: 'tradesman',
  industryKey: 'handwerk',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'hw-hero', type: 'hero',
          data: {
            headline: 'Müller & Söhne Meisterbetrieb',
            subline: 'Sanitär, Heizung und Bäder aus einer Hand seit über 35 Jahren in Köln und Umgebung.',
            badgeText: 'Meisterbetrieb seit 1987',
            bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
            trustItems: ['Meisterbetrieb', 'Notdienst 24/7', 'Festpreisgarantie'],
            primaryCta: { label: 'Kostenlos anfragen', href: '/demo/handwerk/kontakt' },
            secondaryCta: { label: 'Leistungen ansehen', href: '/demo/handwerk/leistungen' },
          },
        },
        {
          ...B, id: 'hw-usp', type: 'uspStrip',
          data: {
            items: [
              { icon: 'shield-check', title: 'Meisterbetrieb', text: 'Alle Arbeiten durch ausgebildete Fachkräfte.' },
              { icon: 'clock', title: 'Termintreue', text: 'Verbindliche Termine innerhalb von 48 Stunden.' },
              { icon: 'banknote', title: 'Festpreisgarantie', text: 'Transparente Angebote ohne versteckte Kosten.' },
              { icon: 'phone', title: '24/7 Notdienst', text: 'Rohrbruch oder Heizungsausfall jederzeit erreichbar.' },
            ],
          },
        },
        {
          ...B, id: 'hw-services-home', type: 'servicesGrid',
          data: {
            headline: 'Unsere Leistungen',
            subline: 'Von der kleinen Reparatur bis zur kompletten Badsanierung.',
            badgeText: 'Leistungen',
            items: [
              { title: 'Badsanierung', text: 'Ihr Traumbad in 10 Tagen — Planung, Fliesen und Sanitär komplett aus einer Hand.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', icon: 'bath' },
              { title: 'Heizung & Wärmepumpe', text: 'Moderne Heizsysteme mit Förderberatung — bis zu 70 % Energieeinsparung.', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80', icon: 'flame' },
              { title: 'Notdienst 24/7', text: 'Rohrbruch oder Heizungsausfall? Unser Notdienst ist innerhalb von 60 Minuten vor Ort.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80', icon: 'alert-triangle' },
            ],
            ctaPrimary: { label: 'Alle Leistungen ansehen', href: '/demo/handwerk/leistungen' },
          },
        },
        {
          ...B, id: 'hw-testimonials-home', type: 'testimonials',
          data: {
            headline: 'Das sagen unsere Kunden',
            subline: 'Bewertungen aus abgeschlossenen Projekten.',
            badgeText: 'Referenzen',
            ratingValue: '4.9 von 5',
            ratingCount: '237 Bewertungen',
            items: [
              { quote: 'Badsanierung komplett in 8 Tagen, sauber und exakt wie besprochen. Top Handwerker.', name: 'Familie Bergmann', context: 'Badsanierung Köln-Ehrenfeld', rating: 5 },
              { quote: 'Heizungstausch mit Förderantrag alles über Müller abgewickelt. Sehr professionell.', name: 'S. Weber', context: 'Heizungsmodernisierung', rating: 5 },
              { quote: 'Sonntagmorgen Rohrbruch, um 9 Uhr war der Monteur da. Schnell, freundlich, fair.', name: 'Thomas K.', context: 'Notdienst', rating: 5 },
            ],
          },
        },
        {
          ...B, id: 'hw-stats', type: 'statsCounter',
          data: {
            headline: 'Zahlen & Fakten',
            stats: [
              { value: 2500, suffix: '+', label: 'Zufriedene Kunden' },
              { value: 35, suffix: ' Jahre', label: 'Erfahrung' },
              { value: 18, suffix: '', label: 'Mitarbeiter' },
              { value: 4.9, suffix: '★', label: 'Google-Bewertung' },
            ],
          },
        },
        {
          ...B, id: 'hw-cta-home', type: 'ctaBand',
          data: {
            headline: 'Projekt besprechen?',
            subline: 'Kostenloses Erstgespräch und unverbindliches Angebot.',
            badgeText: 'Jetzt starten',
            ctaPrimary: { label: 'Kostenlos anfragen', href: '/demo/handwerk/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'leistungen',
      title: 'Leistungen',
      sections: [
        {
          ...HERO, id: 'hw-leist-hero', type: 'hero',
          data: {
            headline: 'Unsere Leistungen',
            subline: 'Sanitär, Heizung, Badsanierung und 24/7-Notdienst — alles aus Meisterhand.',
            badgeText: 'Leistungen',
            bgImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=85',
            trustItems: ['Festpreisgarantie', 'Meisterbetrieb', '5 Jahre Gewährleistung'],
            primaryCta: { label: 'Jetzt anfragen', href: '/demo/handwerk/kontakt' },
          },
        },
        {
          ...B, id: 'hw-services-full', type: 'servicesGrid',
          data: {
            headline: 'Was wir für Sie tun',
            subline: 'Unser komplettes Leistungsspektrum im Überblick.',
            badgeText: 'Alle Leistungen',
            items: [
              { title: 'Badsanierung', text: 'Komplettbad aus einer Hand: 3D-Planung, Demontage, Rohinstallation, Fliesen, Sanitärobjekte und Montage in 10 Arbeitstagen. Barrierefrei auf Wunsch.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', icon: 'bath' },
              { title: 'Heizungsmodernisierung', text: 'Wärmepumpe (Luft/Wasser, Erdwärme), Gas-Brennwert oder Hybridlösung. Inkl. Fördermittelberatung (BAFA/KfW) und Antragstellung.', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80', icon: 'flame' },
              { title: 'Sanitär & Rohrleitungen', text: 'Neuinstallation und Reparatur von Trink- und Abwasserleitungen. Leckortung, Rohrspülung und Sanierung ohne großflächige Aufbrüche.', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80', icon: 'wrench' },
              { title: 'Notdienst 24/7', text: 'Rohrbruch, Heizungsausfall oder übergelaufene Leitung: Anfahrt innerhalb von 60 Min. im Kölner Stadtgebiet. Transparente Notdienst-Pauschale.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80', icon: 'alert-triangle' },
              { title: 'Fußbodenheizung', text: 'Verlegung in Neubau und Bestand (Trocken- und Nasssystem), hydraulischer Abgleich und Inbetriebnahme.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', icon: 'thermometer' },
              { title: 'Wartung & Service', text: 'Jährliche Heizungswartung, Trinkwasser-Check nach VDI 6023 und Legionellenprüfung für Mehrfamilienhäuser.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80', icon: 'settings' },
            ],
          },
        },
        {
          ...B, id: 'hw-process', type: 'processSteps',
          data: {
            headline: 'So arbeiten wir',
            subline: 'Vom ersten Anruf bis zur sauberen Übergabe alles aus einer Hand.',
            badgeText: 'Ablauf',
            items: [
              { title: 'Anfrage & Beratung', text: 'Sie schildern Ihr Anliegen telefonisch oder per Formular. Wir melden uns innerhalb eines Werktags.' },
              { title: 'Aufmass & Angebot', text: 'Vor-Ort-Termin, detailliertes Aufmass und transparentes Festpreisangebot.' },
              { title: 'Ausführung', text: 'Termingerechte Umsetzung durch unsere eigenen Meister und Gesellen.' },
              { title: 'Abnahme & Gewährleistung', text: 'Gemeinsame Endkontrolle, Dokumentation und 5 Jahre Gewährleistung.' },
            ],
          },
        },
        {
          ...B, id: 'hw-leist-faq', type: 'faq',
          data: {
            headline: 'Häufige Fragen zu unseren Leistungen',
            items: [
              { question: 'Wie lange dauert eine Badsanierung?', answer: 'Ein Standard-Komplettbad (6–12 qm) realisieren wir in 8–12 Arbeitstagen. Größere Projekte besprechen wir individuell.' },
              { question: 'Welche Heizung empfehlen Sie?', answer: 'Das hängt von Ihrem Gebäude ab. Wärmepumpen eignen sich besonders für gut gedämmte Häuser. Wir beraten Sie ehrlich und unabhängig.' },
              { question: 'Gibt es eine Gewährleistung?', answer: '5 Jahre auf alle von uns ausgeführten Arbeiten — das ist doppelt so lang wie der gesetzliche Mindeststandard.' },
            ],
          },
        },
        {
          ...B, id: 'hw-cta-leist', type: 'ctaBand',
          data: {
            headline: 'Interesse geweckt?',
            subline: 'Gemeinsam finden wir die beste Lösung für Ihr Projekt.',
            badgeText: 'Nächster Schritt',
            ctaPrimary: { label: 'Kostenlos anfragen', href: '/demo/handwerk/kontakt' },
          },
        },
        {
          ...B, id: 'hw-leist-partners', type: 'richText',
          data: {
            content: '<h2>Unsere Partner & Marken</h2><p>Wir arbeiten ausschließlich mit bewährten Herstellern: Grohe, Geberit, Viessmann, Vaillant, Kaldewei und Villeroy & Boch. So garantieren wir höchste Qualität und langfristige Ersatzteilverfügbarkeit für Ihr Projekt.</p>',
          },
        },
      ],
    },
    {
      slug: 'projekte',
      title: 'Projekte',
      sections: [
        {
          ...HERO, id: 'hw-proj-hero', type: 'hero',
          data: {
            headline: 'Unsere Projekte',
            subline: 'Referenzen und Vorher/Nachher-Ergebnisse aus über 35 Jahren Handwerksarbeit.',
            badgeText: 'Projekte & Referenzen',
            bgImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1800&q=85',
            primaryCta: { label: 'Eigenes Projekt starten', href: '/demo/handwerk/kontakt' },
          },
        },
        {
          ...B, id: 'hw-projects-gallery', type: 'gallery',
          data: {
            headline: 'Abgeschlossene Projekte',
            subline: 'Vorher/Nachher und Einblicke in unsere Arbeit.',
            badgeText: 'Galerie',
            items: [
              { title: 'Badsanierung Köln-Ehrenfeld', description: 'Komplettumbau eines 12 qm Bads in 8 Arbeitstagen: bodengleiche Dusche, Fußbodenheizung, Naturstein-Fliesen.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', tags: ['Badsanierung', '12 qm', '8 Tage'] },
              { title: 'Heizung Wärmepumpe Porz', description: 'Austausch einer 25 Jahre alten Ölheizung gegen eine Luft-Wasser-Wärmepumpe mit BAFA-Förderung (35% Zuschuss).', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80', tags: ['Heizung', 'Wärmepumpe', 'Förderung'] },
              { title: 'Rohrbruch-Sanierung Lindenthal', description: 'Sonntagmorgen Notdienst: Leckortung, Aufbruch und Reparatur einer geplatzten Kupferleitung in 4 Stunden.', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80', tags: ['Notdienst', 'Rohrbruch', '4 Stunden'] },
              { title: 'Barrierefreies Bad Sülz', description: 'Umbau für ein älteres Ehepaar: ebenerdige Dusche, Haltegriffe, rutschfeste Fliesen, absenkbares WC.', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=80', tags: ['Barrierefreiheit', 'Seniorengerecht'] },
              { title: 'Fußbodenheizung Neubau Nippes', description: '120 qm Fußbodenheizung im Neubau-EFH: Verlegung, Estrich-Koordination und Inbetriebnahme.', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80', tags: ['Fußbodenheizung', 'Neubau', '120 qm'] },
              { title: 'Gäste-WC Modernisierung Deutz', description: 'Kleines Gäste-WC (4 qm) mit Stil: Wandhängendes WC, Aufsatzwaschbecken, großformatige Fliesen in nur 5 Tagen.', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&q=80', tags: ['Gäste-WC', '4 qm', '5 Tage'] },
            ],
          },
        },
        {
          ...B, id: 'hw-testimonials-full', type: 'testimonials',
          data: {
            headline: 'Kundenstimmen',
            subline: 'Echte Bewertungen aus abgeschlossenen Projekten.',
            badgeText: 'Referenzen',
            ratingValue: '4.9 von 5',
            ratingCount: '237 Bewertungen',
            items: [
              { quote: 'Badsanierung komplett in 8 Tagen, sauber und exakt wie besprochen. Top Handwerker.', name: 'Familie Bergmann', context: 'Badsanierung Köln-Ehrenfeld', rating: 5 },
              { quote: 'Heizungstausch mit Förderantrag alles über Müller abgewickelt. Sehr professionell.', name: 'S. Weber', context: 'Heizungsmodernisierung Porz', rating: 5 },
              { quote: 'Sonntagmorgen Rohrbruch, um 9 Uhr war der Monteur da. Schnell, freundlich, fair.', name: 'Thomas K.', context: 'Notdienst Lindenthal', rating: 5 },
              { quote: 'Das barrierefreie Bad für meine Eltern ist wunderbar geworden. Alles durchdacht.', name: 'M. Hoffmann', context: 'Barrierefreies Bad Sülz', rating: 5 },
              { quote: 'Fußbodenheizung termingerecht eingebaut, null Probleme mit dem Estrichleger. Koordination top.', name: 'J. Schneider', context: 'Neubau Nippes', rating: 5 },
            ],
          },
        },
        {
          ...B, id: 'hw-proj-stats', type: 'statsCounter',
          data: {
            headline: 'Unsere Projektbilanz',
            stats: [
              { value: 850, suffix: '+', label: 'Badsanierungen' },
              { value: 420, suffix: '+', label: 'Heizungstausch' },
              { value: 99, suffix: '%', label: 'Termingerecht' },
              { value: 5, suffix: ' Jahre', label: 'Gewährleistung' },
            ],
          },
        },
        {
          ...B, id: 'hw-cta-proj', type: 'ctaBand',
          data: {
            headline: 'Ihr Projekt ist das Nächste?',
            subline: 'Lassen Sie sich unverbindlich beraten — Kostenloses Erstgespräch und Festpreisangebot.',
            badgeText: 'Projekt starten',
            ctaPrimary: { label: 'Kontakt aufnehmen', href: '/demo/handwerk/kontakt' },
          },
        },
        {
          ...B, id: 'hw-proj-text', type: 'richText',
          data: {
            content: '<h2>Vorher/Nachher ansehen?</h2><p>Auf Wunsch zeigen wir Ihnen unsere Referenzobjekte persönlich. Nach Absprache mit den Eigentümern können Sie sich fertige Bäder und Heizungsinstallationen vor Ort anschauen — damit Sie genau wissen, was Sie erwartet.</p>',
          },
        },
      ],
    },
    {
      slug: 'ueber-uns',
      title: 'über uns',
      sections: [
        {
          ...HERO, id: 'hw-about-hero', type: 'hero',
          data: {
            headline: 'über Müller & Söhne',
            subline: 'Familienunternehmen in dritter Generation — seit 1987 in Köln.',
            badgeText: 'über uns',
            bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
            primaryCta: { label: 'Kontakt aufnehmen', href: '/demo/handwerk/kontakt' },
          },
        },
        {
          ...B, id: 'hw-process-about', type: 'processSteps',
          data: {
            headline: 'Unsere Arbeitsweise',
            subline: 'Qualität, Termintreue und Transparenz in jedem Schritt.',
            badgeText: 'So arbeiten wir',
            items: [
              { title: 'Anfrage & Beratung', text: 'Sie schildern Ihr Anliegen telefonisch oder per Formular. Wir melden uns innerhalb eines Werktags.' },
              { title: 'Aufmass & Angebot', text: 'Vor-Ort-Termin, detailliertes Aufmass und transparentes Festpreisangebot.' },
              { title: 'Ausführung', text: 'Termingerechte Umsetzung durch unsere eigenen Meister und Gesellen.' },
              { title: 'Abnahme & Gewährleistung', text: 'Gemeinsame Endkontrolle, Dokumentation und 5 Jahre Gewährleistung.' },
            ],
          },
        },
        {
          ...B, id: 'hw-faq', type: 'faq',
          data: {
            headline: 'Häufige Fragen',
            subline: 'Antworten zu Ablauf, Kosten und Terminen.',
            badgeText: 'FAQ',
            items: [
              { question: 'Wie schnell bekomme ich einen Termin?', answer: 'Standard-Termine vergeben wir innerhalb von 48 Stunden. Bei Notfällen sind wir rund um die Uhr erreichbar.' },
              { question: 'Was kostet eine Badsanierung?', answer: 'Ein Komplettbad beginnt ab ca. 12.000 Euro. Nach dem Aufmass erhalten Sie ein verbindliches Festpreisangebot.' },
              { question: 'Bieten Sie Förderberatung an?', answer: 'Ja, wir prüfen für jedes Heizungsprojekt die aktuellen BAFA- und KfW-Fördermöglichkeiten und Übernehmen die Antragstellung.' },
              { question: 'In welchem Umkreis arbeiten Sie?', answer: 'Wir sind in Köln und im Umkreis von 30 Kilometern tätig.' },
            ],
          },
        },
        {
          ...B, id: 'hw-about-team', type: 'team',
          data: {
            headline: 'Unser Team',
            subline: '18 Mitarbeiter — vom Meister bis zum Auszubildenden.',
            members: [
              { name: 'Klaus Müller', role: 'Geschäftsführer & Meister', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
              { name: 'Stefan Müller', role: 'Betriebsleiter & Meister', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
              { name: 'Andrea Fischer', role: 'Büroleitung & Disposition', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
            ],
          },
        },
        {
          ...B, id: 'hw-about-cta', type: 'ctaBand',
          data: {
            headline: 'Teil des Teams werden?',
            subline: 'Wir suchen Gesellen, Meister und Auszubildende. Bewirb dich jetzt!',
            ctaPrimary: { label: 'Offene Stellen', href: '/demo/handwerk/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'hw-contact-hero', type: 'hero',
          data: {
            headline: 'Kontakt aufnehmen',
            subline: 'für Anfragen, Termine und den 24/7-Notdienst.',
            badgeText: 'Kontakt',
            bgImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=85',
            primaryCta: { label: 'Jetzt anrufen', href: 'tel:+49221987654' },
          },
        },
        {
          ...B, id: 'hw-contact', type: 'contact',
          data: {
            headline: 'Schreiben Sie uns',
            subline: 'Wir melden uns innerhalb eines Werktags.',
            badgeText: 'Kontaktformular',
            formEnabled: true,
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=85',
          },
        },
        {
          ...B, id: 'hw-contact-hours', type: 'richText',
          data: {
            content: '<h2>Erreichbarkeit</h2><p><strong>Büro:</strong> Mo–Fr 7:30–17:00 Uhr<br/><strong>Notdienst:</strong> 24/7 unter 0221-987654<br/><strong>Adresse:</strong> Industriestraße 12, 50996 Köln-Rodenkirchen</p><p>Kostenlose Parkplätze direkt vor der Tür. Auch samstags nach Vereinbarung.</p>',
          },
        },
        {
          ...B, id: 'hw-contact-faq', type: 'faq',
          data: {
            headline: 'Fragen zum Ablauf',
            items: [
              { question: 'Wie läuft die Anfrage ab?', answer: 'Füllen Sie das Formular aus oder rufen Sie uns an. Wir vereinbaren einen Vor-Ort-Termin und erstellen ein kostenloses Festpreisangebot.' },
              { question: 'Muss ich für den Vor-Ort-Termin bezahlen?', answer: 'Nein, der Vor-Ort-Termin inkl. Aufmass und Beratung ist bei uns immer kostenlos und unverbindlich.' },
            ],
          },
        },
      ],
    },
  ],
};
