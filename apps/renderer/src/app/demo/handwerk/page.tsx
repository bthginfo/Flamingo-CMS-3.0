import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getStyleCssVars } from '@/lib/styles';
import type { SnapshotSection } from '@/lib/snapshot';
import { getDemoSiteData } from '../demo-data';

export const dynamic = 'force-static';

const base = { variant: null, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l', anchorId: null };

const sections: SnapshotSection[] = [
  {
    ...base,
    id: 'handwerk-hero',
    type: 'hero',
    container: 'full',
    spacingTop: 'none',
    spacingBottom: 'none',
    anchorId: 'hero',
    data: {
      headline: 'Mueller & Soehne Meisterbetrieb',
      subline: 'Sanitaer, Heizung und Baeder aus einer Hand seit ueber 35 Jahren in Koeln und Umgebung.',
      badgeText: 'Handwerk Demo',
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
      trustItems: ['Meisterbetrieb', 'Notdienst 24/7', 'Festpreisgarantie'],
      primaryCta: { label: 'Kostenlos anfragen', href: '#kontakt' },
      secondaryCta: { label: 'Leistungen ansehen', href: '#leistungen' },
    },
  },
  {
    ...base,
    id: 'handwerk-usp',
    type: 'uspStrip',
    data: {
      items: [
        { icon: 'shield-check', title: 'Meisterbetrieb', text: 'Alle Arbeiten durch ausgebildete Fachkraefte.' },
        { icon: 'clock', title: 'Termintreue', text: 'Verbindliche Termine innerhalb von 48 Stunden.' },
        { icon: 'banknote', title: 'Festpreisgarantie', text: 'Transparente Angebote ohne versteckte Kosten.' },
        { icon: 'phone', title: '24/7 Notdienst', text: 'Rohrbruch oder Heizungsausfall jederzeit erreichbar.' },
      ],
    },
  },
  {
    ...base,
    id: 'handwerk-services',
    type: 'servicesGrid',
    anchorId: 'leistungen',
    data: {
      headline: 'Unsere Leistungen',
      subline: 'Von der kleinen Reparatur bis zur kompletten Badsanierung.',
      badgeText: 'Leistungen',
      items: [
        {
          title: 'Badsanierung',
          text: 'Komplettbad aus einer Hand: Planung, Fliesen, Sanitaer und Montage in 10 Arbeitstagen.',
          image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80',
          icon: 'bath',
        },
        {
          title: 'Heizungsmodernisierung',
          text: 'Waermepumpe, Gas-Brennwert oder Hybridloesung mit Foerderberatung und Einbau.',
          image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80',
          icon: 'flame',
        },
        {
          title: 'Sanitaer & Rohrleitungen',
          text: 'Neuinstallation, Reparatur und Wartung von Trink- und Abwasserleitungen.',
          image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80',
          icon: 'wrench',
        },
        {
          title: 'Notdienst',
          text: 'Rohrbruch, Heizungsausfall oder Wasserrohrbruch: schnelle Hilfe rund um die Uhr.',
          image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80',
          icon: 'alert-triangle',
        },
      ],
    },
  },
  {
    ...base,
    id: 'handwerk-process',
    type: 'processSteps',
    data: {
      headline: 'So arbeiten wir',
      subline: 'Vom ersten Anruf bis zur sauberen Uebergabe alles aus einer Hand.',
      badgeText: 'Ablauf',
      items: [
        { title: 'Anfrage & Beratung', text: 'Sie schildern Ihr Anliegen telefonisch oder per Formular. Wir melden uns innerhalb eines Werktags.' },
        { title: 'Aufmass & Angebot', text: 'Vor-Ort-Termin, detailliertes Aufmass und transparentes Festpreisangebot.' },
        { title: 'Ausfuehrung', text: 'Termingerechte Umsetzung durch unsere eigenen Meister und Gesellen.' },
        { title: 'Abnahme & Gewaehrleistung', text: 'Gemeinsame Endkontrolle, Dokumentation und 5 Jahre Gewaehrleistung.' },
      ],
    },
  },
  {
    ...base,
    id: 'handwerk-testimonials',
    type: 'testimonials',
    data: {
      headline: 'Das sagen unsere Kunden',
      subline: 'Bewertungen aus abgeschlossenen Projekten.',
      badgeText: 'Referenzen',
      ratingValue: '4.9 von 5',
      ratingCount: '237 Bewertungen',
      items: [
        { quote: 'Badsanierung komplett in 8 Tagen, sauber und exakt wie besprochen. Top Handwerker.', name: 'Familie Bergmann', context: 'Badsanierung Koeln-Ehrenfeld', rating: 5 },
        { quote: 'Heizungstausch mit Foerderantrag alles ueber Mueller abgewickelt. Sehr professionell.', name: 'S. Weber', context: 'Heizungsmodernisierung', rating: 5 },
        { quote: 'Sonntagmorgen Rohrbruch, um 9 Uhr war der Monteur da. Schnell, freundlich, fair.', name: 'Thomas K.', context: 'Notdienst', rating: 5 },
      ],
    },
  },
  {
    ...base,
    id: 'handwerk-faq',
    type: 'faq',
    data: {
      headline: 'Haeufige Fragen',
      subline: 'Antworten zu Ablauf, Kosten und Terminen.',
      badgeText: 'FAQ',
      items: [
        { question: 'Wie schnell bekomme ich einen Termin?', answer: 'Standard-Termine vergeben wir innerhalb von 48 Stunden. Bei Notfaellen sind wir rund um die Uhr erreichbar.' },
        { question: 'Was kostet eine Badsanierung?', answer: 'Ein Komplettbad beginnt ab ca. 12.000 Euro. Nach dem Aufmass erhalten Sie ein verbindliches Festpreisangebot.' },
        { question: 'Bieten Sie Foerderberatung an?', answer: 'Ja, wir pruefen fuer jedes Heizungsprojekt die aktuellen BAFA- und KfW-Foerdermoeglichkeiten und uebernehmen die Antragstellung.' },
        { question: 'In welchem Umkreis arbeiten Sie?', answer: 'Wir sind in Koeln und im Umkreis von 30 Kilometern taetig.' },
      ],
    },
  },
  {
    ...base,
    id: 'handwerk-cta',
    type: 'ctaBand',
    data: {
      headline: 'Projekt besprechen?',
      subline: 'Kostenloses Erstgespraech und unverbindliches Angebot.',
      badgeText: 'Jetzt starten',
      ctaPrimary: { label: 'Kostenlos anfragen', href: '#kontakt' },
    },
  },
  {
    ...base,
    id: 'handwerk-contact',
    type: 'contact',
    anchorId: 'kontakt',
    data: {
      headline: 'Kontakt aufnehmen',
      subline: 'Fuer Anfragen, Termine und den Notdienst.',
      badgeText: 'Kontakt',
      formEnabled: true,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=85',
    },
  },
];

export default function HandwerkDemoPage() {
  const styleCssVars = getStyleCssVars('tradesman', 'classic');
  const { navItems, cta, brand, contact, socialLinks, footer } = getDemoSiteData('handwerk');
  return (
    <div data-style="classic" style={styleCssVars as React.CSSProperties}>
      <SiteHeader navItems={navItems} brand={brand} contact={contact} darkBg={true} cta={cta} />
      <main>{sections.map((section) => <SectionRenderer key={section.id} section={section} styleVariant="classic" industry="tradesman" />)}</main>
      <SiteFooter footer={footer} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
