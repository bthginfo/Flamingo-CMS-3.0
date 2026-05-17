'use client';

import { useState } from 'react';
import {
  HelpCircle, FileText, Layers, ImageIcon, Search, FolderOpen, ChevronDown, ChevronRight,
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Upload, ArrowUpDown, Globe, Mail,
} from 'lucide-react';

type SectionProps = { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean };

function HelpSection({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-3 w-full px-5 py-4 text-left hover:bg-zinc-50 transition-colors">
        <span className="text-admin-accent">{icon}</span>
        <span className="font-semibold text-zinc-900 flex-1">{title}</span>
        {open ? <ChevronDown size={18} className="text-zinc-400" /> : <ChevronRight size={18} className="text-zinc-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed space-y-3 border-t border-zinc-100 pt-4">{children}</div>}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-admin-accent text-white text-xs font-bold flex items-center justify-center mt-0.5">{n}</span>
      <div>{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 text-sm">💡 {children}</div>;
}

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Hilfe & Anleitung</h1>
        <p className="text-zinc-500 mt-1">So funktioniert dein Flamingo CMS – Schritt für Schritt.</p>
      </div>

      {/* SEITEN */}
      <HelpSection title="Seiten erstellen & bearbeiten" icon={<FileText size={20} />} defaultOpen>
        <p>Seiten sind die Grundbausteine deiner Website. Jede Seite hat einen Titel, einen URL-Slug und beliebig viele Sektionen.</p>
        <h4 className="font-semibold text-zinc-800 mt-2">Neue Seite anlegen</h4>
        <Step n={1}>Gehe zu <strong>Seiten</strong> in der Seitenleiste.</Step>
        <Step n={2}>Klicke auf <span className="inline-flex items-center gap-1"><Plus size={14} /> <strong>Neue Seite</strong></span>.</Step>
        <Step n={3}>Vergib einen <strong>Titel</strong> (z.B. „Über uns") – der URL-Slug wird automatisch generiert.</Step>
        <Step n={4}>Klicke auf die neue Seite, um Sektionen hinzuzufügen.</Step>
        <Tip>Die Startseite hat den Slug <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">home</code> oder ist leer. Sie wird als Hauptseite angezeigt.</Tip>

        <h4 className="font-semibold text-zinc-800 mt-4">Seite bearbeiten</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><Pencil size={13} className="inline mb-0.5" /> Titel und Slug können jederzeit geändert werden.</li>
          <li><Eye size={13} className="inline mb-0.5" /> / <EyeOff size={13} className="inline mb-0.5" /> Sichtbarkeit: Unsichtbare Seiten erscheinen nicht auf der Website.</li>
          <li><Trash2 size={13} className="inline mb-0.5" /> Seite löschen: Löscht die Seite und alle zugehörigen Sektionen.</li>
        </ul>
        <Tip>Änderungen werden erst live, wenn du auf <strong>Veröffentlichen</strong> (grüner Button unten rechts) klickst.</Tip>
      </HelpSection>

      {/* SEKTIONEN */}
      <HelpSection title="Sektionen hinzufügen & anordnen" icon={<Layers size={20} />}>
        <p>Sektionen sind die einzelnen Blöcke einer Seite (z.B. Hero-Banner, Text & Bild, FAQ, Galerie usw.).</p>
        <h4 className="font-semibold text-zinc-800 mt-2">Sektion hinzufügen</h4>
        <Step n={1}>Öffne eine Seite über <strong>Seiten → [Seitenname]</strong>.</Step>
        <Step n={2}>Klicke auf <span className="inline-flex items-center gap-1"><Plus size={14} /> <strong>Sektion hinzufügen</strong></span>.</Step>
        <Step n={3}>Wähle den Sektionstyp aus der Liste (z.B. Hero, Text & Bild, Galerie, FAQ, …).</Step>
        <Step n={4}>Fülle die Felder aus – je nach Typ gibt es verschiedene Eingabefelder.</Step>

        <h4 className="font-semibold text-zinc-800 mt-4">Reihenfolge ändern</h4>
        <p><GripVertical size={13} className="inline mb-0.5" /> Ziehe Sektionen per Drag & Drop in die gewünschte Reihenfolge, oder nutze die <ArrowUpDown size={13} className="inline mb-0.5" /> Pfeil-Buttons.</p>

        <h4 className="font-semibold text-zinc-800 mt-4">Verfügbare Sektionstypen</h4>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            'Hero-Banner', 'Text & Bild', 'Nur Text (Rich-Text)', 'Galerie / Bildergitter',
            'Leistungen / Services', 'Service-Pakete', 'Team-Vorstellung', 'Testimonials / Bewertungen',
            'FAQ (Häufige Fragen)', 'Kontaktformular', 'Karte (Google Maps)', 'Zahlen & Statistiken',
            'Call-to-Action', 'Zeitstrahl / Timeline', 'Logo-Leiste (Partner)', 'Preisliste',
            'Öffnungszeiten', 'Hinweisbanner', 'HTML-Block',
          ].map(t => <span key={t} className="bg-zinc-100 rounded px-2 py-1">{t}</span>)}
        </div>
        <Tip>Im <strong>Sektionen-Showcase</strong> (Demo-Bereich) kannst du alle Typen live ansehen.</Tip>
      </HelpSection>

      {/* INHALTE */}
      <HelpSection title="Inhalte bearbeiten" icon={<Pencil size={20} />}>
        <p>Jede Sektion hat eigene Felder, die du direkt im Editor ausfüllen kannst:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Texte:</strong> Überschriften, Beschreibungen und Fließtext. Einige Felder unterstützen Rich-Text (fett, kursiv, Links, Listen).</li>
          <li><strong>Bilder:</strong> Klicke auf das Bildfeld → Bild aus der Mediathek wählen oder neu hochladen.</li>
          <li><strong>Listen:</strong> Bei FAQ, Services, Team etc. kannst du Einträge hinzufügen, bearbeiten und löschen.</li>
          <li><strong>Links / Buttons:</strong> URL und Button-Text eingeben. Interne Links beginnen mit <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">/seiten-slug</code>.</li>
        </ul>
        <Tip>Speichere regelmäßig – der grüne <strong>Veröffentlichen</strong>-Button macht alle Änderungen live.</Tip>
      </HelpSection>

      {/* MEDIATHEK */}
      <HelpSection title="Mediathek (Bilder & Dateien)" icon={<ImageIcon size={20} />}>
        <p>Die Mediathek verwaltet alle hochgeladenen Bilder und Dateien zentral.</p>
        <h4 className="font-semibold text-zinc-800 mt-2">Bilder hochladen</h4>
        <Step n={1}>Gehe zu <strong>Mediathek</strong> in der Seitenleiste.</Step>
        <Step n={2}>Klicke auf <span className="inline-flex items-center gap-1"><Upload size={14} /> <strong>Hochladen</strong></span> oder ziehe Dateien per Drag & Drop.</Step>
        <Step n={3}>Vergib einen <strong>Alt-Text</strong> (wichtig für SEO & Barrierefreiheit) über das Stift-Icon.</Step>

        <h4 className="font-semibold text-zinc-800 mt-4">Bilder verwenden</h4>
        <p>Beim Bearbeiten einer Sektion kannst du Bilder direkt aus der Mediathek auswählen. Bereits hochgeladene Bilder stehen sofort zur Verfügung.</p>
        <Tip>Verwende aussagekräftige Alt-Texte – sie helfen bei der Google-Bildersuche und Barrierefreiheit.</Tip>
      </HelpSection>

      {/* SEO */}
      <HelpSection title="SEO & Sichtbarkeit" icon={<Search size={20} />}>
        <p>Unter <strong>SEO & Sichtbarkeit</strong> steuerst du, wie deine Website in Google erscheint.</p>
        <h4 className="font-semibold text-zinc-800 mt-2">Globale SEO-Einstellungen</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Title-Template:</strong> z.B. <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">%s | Firmenname</code> – %s wird durch den Seitentitel ersetzt.</li>
          <li><strong>Standard-Beschreibung:</strong> Fallback, wenn eine Seite keine eigene Meta-Description hat.</li>
          <li><strong>Canonical Base:</strong> Die Haupt-URL deiner Website (z.B. https://www.meinefirma.de).</li>
          <li><strong>OG-Image:</strong> Standardbild für Social-Media-Vorschauen.</li>
        </ul>

        <h4 className="font-semibold text-zinc-800 mt-4">Seiten-SEO</h4>
        <p>Jede Seite kann eigene Meta-Daten haben: Titel, Beschreibung, OG-Image und noindex-Flag.</p>
        <Tip>Google zeigt ca. 60 Zeichen vom Titel und 160 Zeichen von der Beschreibung an.</Tip>
      </HelpSection>

      {/* COLLECTIONS */}
      <HelpSection title="Collections & Collection Items" icon={<FolderOpen size={20} />}>
        <p>Collections sind wiederverwendbare Datensammlungen – z.B. Referenzen, Portfolio-Projekte oder Produkte.</p>
        <h4 className="font-semibold text-zinc-800 mt-2">Collection anlegen</h4>
        <Step n={1}>Gehe zu <strong>Collections</strong> in der Seitenleiste.</Step>
        <Step n={2}>Klicke auf <span className="inline-flex items-center gap-1"><Plus size={14} /> <strong>Neue Collection</strong></span>.</Step>
        <Step n={3}>Vergib einen <strong>Namen</strong> und einen <strong>Key</strong> (z.B. „referenzen").</Step>

        <h4 className="font-semibold text-zinc-800 mt-4">Items hinzufügen</h4>
        <Step n={1}>Öffne die Collection.</Step>
        <Step n={2}>Klicke auf <span className="inline-flex items-center gap-1"><Plus size={14} /> <strong>Neues Item</strong></span>.</Step>
        <Step n={3}>Fülle Titel, Slug und die Datenfelder aus (Bild, Beschreibung, etc.).</Step>

        <h4 className="font-semibold text-zinc-800 mt-4">Collection in Sektionen verwenden</h4>
        <p>Sektionen wie <strong>Galerie</strong> oder <strong>Leistungen</strong> können Daten aus einer Collection beziehen. Wähle dazu im Sektions-Editor die gewünschte Collection aus.</p>
        <Tip>Collections eignen sich perfekt für Inhalte, die auf mehreren Seiten wiederverwendet werden sollen.</Tip>
      </HelpSection>

      {/* MARKE & DESIGN */}
      <HelpSection title="Marke & Design anpassen" icon={<Globe size={20} />}>
        <p>Unter <strong>Marke & Design</strong> passt du das Erscheinungsbild deiner Website an:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Logo:</strong> Lade dein Firmenlogo hoch (wird im Header und Footer angezeigt).</li>
          <li><strong>Farben:</strong> Primär- und Akzentfarbe bestimmen Buttons, Links und Highlights.</li>
          <li><strong>Schriften:</strong> Wähle Google-Fonts oder lade eigene Schriften hoch.</li>
          <li><strong>Design-Stil:</strong> Wechsle zwischen verschiedenen Branchenvorlagen (Modern, Elegant, Classic, …).</li>
          <li><strong>Erweiterte Farben:</strong> Hintergrund, Text, Karten, Badges und Trennlinien einzeln anpassen.</li>
        </ul>
        <Tip>Alle Farb- und Schriftänderungen werden sofort in der Vorschau sichtbar (nach Veröffentlichen).</Tip>
      </HelpSection>

      {/* VERÖFFENTLICHEN */}
      <HelpSection title="Veröffentlichen – so geht's live" icon={<Eye size={20} />}>
        <p>Im Flamingo CMS arbeitest du immer an einem <strong>Entwurf</strong>. Deine Änderungen sind erst für Besucher sichtbar, wenn du sie veröffentlichst.</p>
        <Step n={1}>Nimm alle gewünschten Änderungen vor (Seiten, Sektionen, Design, SEO, …).</Step>
        <Step n={2}>Klicke auf den grünen <strong>Veröffentlichen</strong>-Button (unten rechts, schwebendes Icon).</Step>
        <Step n={3}>Deine Website wird aktualisiert – fertig!</Step>
        <Tip>Du kannst beliebig viele Änderungen sammeln und mit einem Klick veröffentlichen.</Tip>
      </HelpSection>

      {/* KONTAKT */}
      <div className="border border-zinc-200 rounded-xl bg-gradient-to-br from-admin-accent/5 to-admin-accent/10 p-6 text-center space-y-3">
        <Mail size={28} className="mx-auto text-admin-accent" />
        <h3 className="font-semibold text-zinc-900">Brauchst du Hilfe?</h3>
        <p className="text-sm text-zinc-600">Wenn du Fragen hast oder Unterstützung brauchst, erreichst du uns jederzeit per E-Mail.</p>
        <a
          href="mailto:hello@flamingomedia.online"
          className="inline-block px-6 py-2.5 bg-admin-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
        >
          hello@flamingomedia.online
        </a>
      </div>
    </div>
  );
}
