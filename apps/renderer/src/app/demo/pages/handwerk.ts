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
              { title: 'Badsanierung', text: 'Komplettbad aus einer Hand: Planung, Fliesen, Sanitär und Montage in 10 Arbeitstagen.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', icon: 'bath' },
              { title: 'Heizungsmodernisierung', text: 'Wärmepumpe, Gas-Brennwert oder Hybridlösung mit Förderberatung und Einbau.', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80', icon: 'flame' },
              { title: 'Sanitär & Rohrleitungen', text: 'Neuinstallation, Reparatur und Wartung von Trink- und Abwasserleitungen.', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80', icon: 'wrench' },
              { title: 'Notdienst', text: 'Rohrbruch, Heizungsausfall oder Wasserrohrbruch: schnelle Hilfe rund um die Uhr.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80', icon: 'alert-triangle' },
            ],
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
              { title: 'Badsanierung', text: 'Komplettbad aus einer Hand: Planung, Fliesen, Sanitär und Montage in 10 Arbeitstagen.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80', icon: 'bath' },
              { title: 'Heizungsmodernisierung', text: 'Wärmepumpe, Gas-Brennwert oder Hybridlösung mit Förderberatung und Einbau.', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80', icon: 'flame' },
              { title: 'Sanitär & Rohrleitungen', text: 'Neuinstallation, Reparatur und Wartung von Trink- und Abwasserleitungen.', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80', icon: 'wrench' },
              { title: 'Notdienst', text: 'Rohrbruch, Heizungsausfall oder Wasserrohrbruch: schnelle Hilfe rund um die Uhr.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80', icon: 'alert-triangle' },
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
          ...B, id: 'hw-cta-leist', type: 'ctaBand',
          data: {
            headline: 'Interesse geweckt?',
            subline: 'Gemeinsam finden wir die beste Lösung für Ihr Projekt.',
            badgeText: 'Nächster Schritt',
            ctaPrimary: { label: 'Kostenlos anfragen', href: '/demo/handwerk/kontakt' },
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
            subline: 'Referenzen und Kundenstimmen aus über 35 Jahren Handwerksarbeit.',
            badgeText: 'Projekte & Referenzen',
            bgImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1800&q=85',
            primaryCta: { label: 'Eigenes Projekt starten', href: '/demo/handwerk/kontakt' },
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
              { quote: 'Heizungstausch mit Förderantrag alles über Müller abgewickelt. Sehr professionell.', name: 'S. Weber', context: 'Heizungsmodernisierung', rating: 5 },
              { quote: 'Sonntagmorgen Rohrbruch, um 9 Uhr war der Monteur da. Schnell, freundlich, fair.', name: 'Thomas K.', context: 'Notdienst', rating: 5 },
            ],
          },
        },
        {
          ...B, id: 'hw-cta-proj', type: 'ctaBand',
          data: {
            headline: 'Ihr Projekt ist das Nächste?',
            subline: 'Lassen Sie sich unverbindlich beraten.',
            badgeText: 'Projekt starten',
            ctaPrimary: { label: 'Kontakt aufnehmen', href: '/demo/handwerk/kontakt' },
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
      ],
    },
  ],
};
