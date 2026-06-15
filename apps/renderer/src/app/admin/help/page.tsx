import {
  BookOpen, ClipboardList, Eye, FileText, FolderOpen, Globe, HelpCircle,
  ImageIcon, Layers, Mail, Navigation, Palette, Phone, Rocket, Search,
  ShoppingBag,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { RestartTourButton } from '@/components/admin/onboarding-tour';
import { isShopActive } from '../shop/actions';

type HelpSectionProps = {
  title: string;
  intro: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

function HelpSection({ title, intro, icon, children, defaultOpen = false }: HelpSectionProps) {
  return (
    <details open={defaultOpen} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 transition hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-zinc-950">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-zinc-500">{intro}</span>
        </span>
        <span className="mt-2 text-zinc-400 transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="border-t border-zinc-100 px-5 pb-6 pt-5 text-sm leading-7 text-zinc-650">{children}</div>
    </details>
  );
}

function MiniTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-5 font-semibold text-zinc-950 first:mt-0">{children}</h3>;
}

function Hint({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">{children}</div>;
}

function Cards({ items }: { items: ReactNode[] }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      {items.map((item, index) => <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">{item}</div>)}
    </div>
  );
}

export default async function HelpPage() {
  const hasShop = await isShopActive();

  return (
    <div className="max-w-4xl space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-amber-50 p-7 md:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-20 rounded-full bg-admin-accent/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-admin-accent">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">Anleitung</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 md:text-4xl">Flamingo CMS verstehen und sicher bedienen</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
            Diese Anleitung erklärt die wichtigsten Admin-Bereiche ohne Fachbegriffe. Du erfährst, wo Inhalte gepflegt werden, wie Design und SEO funktionieren und was vor dem Veröffentlichen wichtig ist.
          </p>
          <div className="mt-5"><RestartTourButton /></div>
        </div>
      </div>

      <HelpSection title="Das Grundprinzip" intro="Seiten bestehen aus Sections. Änderungen werden erst durch Veröffentlichen live." icon={<HelpCircle size={20} />} defaultOpen>
        <p>Im CMS arbeitest du an einem Entwurf. Besucher sehen Änderungen erst, wenn du sie veröffentlichst. Dadurch kannst du Inhalte vorbereiten, in der Vorschau prüfen und danach sicher live stellen.</p>
        <Cards items={[
          <><strong>Seiten:</strong> Startseite, Leistungen, Über uns, Kontakt oder Landingpages.</>,
          <><strong>Sections:</strong> einzelne Inhaltsblöcke wie Hero, Galerie, FAQ, Kontaktformular, Popup oder CTA.</>,
          <><strong>Collections:</strong> wiederverwendbare Einträge wie Referenzen, Blogartikel oder Leistungen.</>,
          <><strong>Live-Website:</strong> der veröffentlichte Stand, den Besucher sehen.</>,
        ]} />
        <Hint>Empfohlener Ablauf: Inhalte pflegen, speichern, Vorschau prüfen, veröffentlichen.</Hint>
      </HelpSection>

      <HelpSection title="Seiten" intro="Hier legst du normale Seiten an und bestimmst ihre URL." icon={<FileText size={20} />}>
        <MiniTitle>Wofür Seiten gedacht sind</MiniTitle>
        <p>Eine Seite ist sinnvoll, wenn ein Thema eigenständig erklärt und gefunden werden soll. Beispiele sind Leistungen, Preise, Über uns, Kontakt oder eine spezielle Angebotsseite.</p>
        <Cards items={[
          <><strong>Titel:</strong> Der Name der Seite im CMS und oft auch die sichtbare Überschrift.</>,
          <><strong>Slug:</strong> Der URL-Teil, zum Beispiel <code className="rounded bg-white px-1.5 py-0.5 text-xs">/leistungen</code>.</>,
          <><strong>Sichtbarkeit:</strong> Unsichtbare Seiten bleiben gespeichert, erscheinen aber nicht öffentlich.</>,
          <><strong>SEO:</strong> Jede wichtige Seite sollte eigenen Titel und Beschreibung bekommen.</>,
        ]} />
      </HelpSection>

      <HelpSection title="Sections" intro="Sections sind die sichtbaren Bausteine einer Seite." icon={<Layers size={20} />}>
        <p>Öffne eine Seite, füge eine Section hinzu und fülle die Felder aus. Je nach Section gibt es Texte, Bilder, Listen, Buttons, Karten, Öffnungszeiten, Preise oder Popup-Einstellungen.</p>
        <MiniTitle>Farben pro Section</MiniTitle>
        <p>Die globalen Farben kommen aus “Marke & Design”. Wenn ein einzelner Bereich anders aussehen soll, kannst du die Farben direkt an dieser Section überschreiben, zum Beispiel Hintergrund, Text, Karten, Buttons oder Akzente.</p>
        <MiniTitle>Popup-Section</MiniTitle>
        <p>Ein Popup öffnet sich nach einer eingestellten Verzögerung. “Nur einmal” bedeutet: Nach dem Schließen erscheint es auf diesem Gerät nicht erneut. “Einmal pro Session” bedeutet: Es kann in einer neuen Browser-Sitzung wieder erscheinen.</p>
      </HelpSection>

      <HelpSection title="Inhalte bearbeiten" intro="Texte, Bilder, Buttons und Listen werden direkt in der jeweiligen Section gepflegt." icon={<FileText size={20} />}>
        <Cards items={[
          <><strong>Texte:</strong> Schreibe klar, kurz und mit erkennbarem nächsten Schritt.</>,
          <><strong>Buttons:</strong> Interne Links beginnen mit <code className="rounded bg-white px-1.5 py-0.5 text-xs">/</code>, externe Links mit <code className="rounded bg-white px-1.5 py-0.5 text-xs">https://</code>.</>,
          <><strong>Listen:</strong> FAQ, Leistungen, Team oder Standorte bestehen aus mehreren Einträgen.</>,
          <><strong>Vorschau:</strong> Prüfe lange Texte auch mobil, damit nichts gedrückt wirkt.</>,
        ]} />
      </HelpSection>

      <HelpSection title="Mediathek" intro="Alle Bilder und Dateien werden zentral hochgeladen und wiederverwendet." icon={<ImageIcon size={20} />}>
        <p>Lade Bilder in der Mediathek hoch und wähle sie anschließend in Sections aus. Gute Bilder sind klar, hell genug und zeigen das echte Angebot oder die Atmosphäre des Unternehmens.</p>
        <MiniTitle>Alt-Texte</MiniTitle>
        <p>Alt-Texte beschreiben kurz, was auf dem Bild zu sehen ist. Sie helfen Suchmaschinen und Menschen, die Screenreader nutzen.</p>
        <Hint>Beispiel: “Modern eingerichteter Beratungsraum mit Holztisch” ist besser als “Bild 1”.</Hint>
      </HelpSection>

      <HelpSection title="Kontakt & Zeiten" intro="Hier pflegst du die wichtigsten Kontaktinformationen des Unternehmens." icon={<Phone size={20} />}>
        <p>Telefon, E-Mail, Adresse, WhatsApp und Öffnungszeiten werden an mehreren Stellen genutzt: Kontaktbereich, Footer, Header-Infos, strukturierte Daten und teilweise auch in Sections.</p>
        <Cards items={[
          <><strong>Telefon:</strong> sollte klickbar sein und auf mobilen Geräten direkt anrufen können.</>,
          <><strong>E-Mail:</strong> wird für Kontaktlinks und Antworten genutzt.</>,
          <><strong>Adresse:</strong> wichtig für lokale Sichtbarkeit und Vertrauen.</>,
          <><strong>Öffnungszeiten:</strong> helfen Besuchern, direkt einzuschätzen, wann jemand erreichbar ist.</>,
        ]} />
      </HelpSection>

      <HelpSection title="Kontaktformular" intro="Hier steuerst du, welche Felder Besucher ausfüllen können." icon={<ClipboardList size={20} />}>
        <p>Das Kontaktformular ist die wichtigste Anfrage-Strecke. Es sollte nur Felder enthalten, die wirklich gebraucht werden. Zu viele Pflichtfelder senken oft die Zahl der Anfragen.</p>
        <MiniTitle>Typische Felder</MiniTitle>
        <Cards items={[
          <><strong>Name:</strong> für persönliche Ansprache.</>,
          <><strong>E-Mail oder Telefon:</strong> damit du antworten kannst.</>,
          <><strong>Nachricht:</strong> für Anliegen, Terminwunsch oder Projektdetails.</>,
          <><strong>Datenschutz:</strong> wichtig für rechtssichere Kontaktaufnahme.</>,
        ]} />
        <Hint>Wenn Anfragen ungenau sind, ergänze gezielte Felder. Wenn wenige Anfragen kommen, reduziere Pflichtfelder.</Hint>
      </HelpSection>

      <HelpSection title="Navigation & Footer" intro="Hier bestimmst du, wie Besucher durch die Website geführt werden." icon={<Navigation size={20} />}>
        <p>Die Navigation sollte nur die wichtigsten Ziele zeigen. Der Footer darf ausführlicher sein und kann zusätzliche Links wie Datenschutz, Impressum, Leistungen, Social Media oder Kontakt enthalten.</p>
        <MiniTitle>Empfehlung</MiniTitle>
        <p>Oben kurz und klar, unten vollständig. Besucher sollen schnell verstehen, wo sie Leistungen, Preise, Referenzen und Kontakt finden.</p>
      </HelpSection>

      <HelpSection title="Marke & Design" intro="Hier steuerst du das globale Erscheinungsbild der Website." icon={<Palette size={20} />}>
        <MiniTitle>Globale Farben</MiniTitle>
        <p>Primärfarbe, Sekundärfarbe und Akzentfarbe prägen Buttons, Links, Highlights und aktive Elemente. Zusätzlich kannst du globale Flächen wie Seitenhintergrund, Section-Hintergrund und Karten-Hintergrund festlegen.</p>
        <MiniTitle>Texte, Buttons, Badges und Karten</MiniTitle>
        <p>Du kannst Headline-Farben, Fließtext, Linkfarben, Button-Varianten, Badge-Farben, Kartenlinien, allgemeine Linien, Icons und Rundungen zentral einstellen. Einzelne Sections können diese Werte überschreiben.</p>
        <MiniTitle>Logo und Schriften</MiniTitle>
        <p>Logo, Logo-Anzeige, Überschriftenschrift und Fließtextschrift bestimmen stark, wie hochwertig die Website wirkt. Zwei gute Schriften reichen in der Regel aus.</p>
      </HelpSection>

      <HelpSection title="SEO & Sichtbarkeit" intro="SEO-Einstellungen bestimmen, wie Seiten in Google und beim Teilen erscheinen." icon={<Search size={20} />}>
        <Cards items={[
          <><strong>Seitentitel:</strong> sollte Thema und Nutzen klar benennen.</>,
          <><strong>Meta-Beschreibung:</strong> erklärt in ein bis zwei Sätzen, warum die Seite relevant ist.</>,
          <><strong>Open Graph Bild:</strong> erscheint häufig beim Teilen in WhatsApp, LinkedIn oder anderen Plattformen.</>,
          <><strong>Noindex:</strong> verhindert, dass eine Seite in Suchmaschinen erscheint. Nur bewusst nutzen.</>,
        ]} />
      </HelpSection>

      <HelpSection title="Collections" intro="Collections sind strukturierte Inhalte, die mehrfach genutzt werden können." icon={<FolderOpen size={20} />}>
        <p>Collections eignen sich für Referenzen, Blogartikel, Leistungen, Projekte, Immobilien, Teamprofile oder Produkte. Ein Collection Item kann eigene Inhalte, SEO-Daten und eigene Sections haben.</p>
        <Hint>Wenn Inhalte sortiert, gefiltert oder mehrfach ausgegeben werden sollen, ist eine Collection meist besser als eine normale Section.</Hint>
      </HelpSection>

      <HelpSection title="Social Media, Mail und Tracking" intro="Diese Bereiche verbinden die Website mit externen Kanälen und Tools." icon={<Globe size={20} />}>
        <Cards items={[
          <><strong>Social Media:</strong> Links zu Instagram, Facebook, LinkedIn und anderen Profilen.</>,
          <><strong>Mail-Server:</strong> Einstellungen für den Versand von Formular- oder Shop-Mails.</>,
          <><strong>Skripte & Tracking:</strong> Tracking-Codes, Pixel oder externe Tools. Nur einfügen, wenn du weißt, wofür sie gebraucht werden.</>,
          <><strong>Impressum & Datenschutz:</strong> Rechtliche Inhalte sollten immer vollständig und aktuell sein.</>,
        ]} />
      </HelpSection>

      {hasShop && (
        <HelpSection title="Shop" intro="Der Shop-Bereich ist aktiv und verwaltet Produkte, Kategorien, Bestellungen und Einstellungen." icon={<ShoppingBag size={20} />}>
          <MiniTitle>Produkte und Kategorien</MiniTitle>
          <p>Produkte enthalten Bilder, Preise, Beschreibung, Varianten und Lager-/Verfügbarkeitsinformationen. Kategorien helfen Besuchern beim Stöbern und Filtern.</p>
          <MiniTitle>Bestellungen</MiniTitle>
          <p>Unter Bestellungen siehst du neue Käufe, Status, Kundendaten und Zahlungsinformationen. Bearbeite Status sauber, damit intern klar ist, was offen, bezahlt, versendet oder abgeschlossen ist.</p>
          <MiniTitle>Versand, Coupons und Einstellungen</MiniTitle>
          <p>Versandmethoden, Rabattcodes, Rechnungen, Zahlungsanbieter und E-Mail-Einstellungen werden im Shop-Bereich gepflegt. Prüfe diese Einstellungen besonders sorgfältig, bevor der Shop live beworben wird.</p>
          <Hint>Shop-Seiten wie Shop, Warenkorb, Checkout und Danke-Seite sollten nicht wie normale Inhaltsseiten gelöscht werden. Sie gehören zum Kaufprozess.</Hint>
        </HelpSection>
      )}

      <HelpSection title="Vorschau und Veröffentlichen" intro="So prüfst du Änderungen, bevor Besucher sie sehen." icon={<Eye size={20} />}>
        <p>Die Vorschau zeigt, wie die Website mit deinen aktuellen Änderungen wirkt. Prüfe Startseite, wichtige Unterseiten, Kontaktformular und mobile Darstellung. Mit “Veröffentlichen” wird der aktuelle Stand live gestellt.</p>
      </HelpSection>

      <HelpSection title="KI API" intro="Für automatisches Befüllen kann die AI API Seiten, Sections und Inhalte anlegen." icon={<Rocket size={20} />}>
        <p>Die KI API kann verfügbare Section-Typen abrufen, Inhalte schreiben, Seiten anlegen, SEO-Daten setzen und veröffentlichen. API-Schlüssel erlauben Änderungen am jeweiligen Tenant und sollten nicht öffentlich geteilt werden.</p>
      </HelpSection>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white">
        <div className="flex items-center gap-3">
          <Mail size={22} className="text-admin-accent" />
          <h2 className="font-semibold">Brauchst du Unterstützung?</h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          Wenn etwas unklar ist oder du eine größere Änderung planst, melde dich kurz. Wir helfen bei Aufbau, Texten, SEO, Design und beim sicheren Veröffentlichen.
        </p>
        <a href="mailto:hello@flamingomedia.online" className="mt-5 inline-flex rounded-full bg-admin-accent px-5 py-3 text-sm font-bold text-white transition hover:brightness-110">
          hello@flamingomedia.online
        </a>
      </div>
    </div>
  );
}
