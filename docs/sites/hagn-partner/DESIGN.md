---
name: "Hagn & Partner"
description: "Institutionelle Kanzleikorrespondenz mit Originalfotografie und offenen Verzeichnissen."
colors:
  "ink-navy": "#103B4A"
  "link-teal": "#195D67"
  "paper-ivory": "#FAF8F3"
  "paper-alternate": "#EFEEE7"
  "surface-white": "#FFFFFF"
  "body-slate": "#33464C"
  "muted-slate": "#53636A"
  "divider-grey": "#BBC6C5"
  "outline-grey": "#6E8388"
  "input-grey": "#7E9296"
  "ink-alternate": "#164654"
  "ink-surface": "#194D5A"
  "on-ink-body": "#E1E9E7"
  "on-ink-muted": "#C0D2D0"
  "on-ink-accent": "#CADFCE"
  "on-ink-divider": "#587780"
  "on-ink-outline": "#90A8AB"
typography:
  "display":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 6.7vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  "display-compact":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 5.5vw, 4.7rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  "headline":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.1vw, 3.8rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  "section-title":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  "practice-title":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  "person-name":
    fontFamily: "\"Cormorant Garamond\", var(--font-outfit), system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 500
    lineHeight: 1.25
  "body":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.75
  "body-intro":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)"
    lineHeight: 1.75
  "label":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
  "control":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.25
  "input":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  "navigation":
    fontFamily: "\"Manrope\", var(--font-inter), system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.025em"
rounded:
  "card-button": "0.125rem"
  "field": "0.75rem"
  "footer-mobile": "2rem"
  "footer-desktop": "3rem"
spacing:
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "7": "1.75rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "14": "3.5rem"
  "16": "4rem"
components:
  "button-primary":
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.control}"
    rounded: "{rounded.card-button}"
    padding: "0.7rem 1.2rem"
  "button-secondary":
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    typography: "{typography.control}"
    rounded: "{rounded.card-button}"
    padding: "0.7rem 1.2rem"
  "input-field":
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.body-slate}"
    typography: "{typography.input}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  "contact-panel":
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.card-button}"
    padding: "1.25rem"
  "contact-form":
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.body-slate}"
    rounded: "{rounded.card-button}"
    padding: "1.5rem"
  "navigation":
    backgroundColor: "{colors.paper-ivory}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.navigation}"
    height: "72px"
  "practice-row":
    textColor: "{colors.ink-navy}"
    typography: "{typography.practice-title}"
    padding: "1.75rem 0"
  "person-name":
    textColor: "{colors.ink-navy}"
    typography: "{typography.person-name}"
  "footer":
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink-body}"
---

# Design System: Hagn & Partner

## Overview

**Creative North Star: "Zeitgemäße Kanzleikorrespondenz"**

Warmes Papier, tiefe blaue Tinte und präzise Leselinien übersetzen die institutionelle Korrespondenz der Kanzlei in ein zeitgemäßes Websystem. Cormorant Garamond gibt Titeln Ruhe und Gewicht; Manrope führt durch Texte, Kontaktdaten und Bedienung. Offene Verzeichnisse lassen konkrete Rechtsgebiete und benannte Ansprechpartner im Vordergrund stehen.

Authentische Porträts, Besprechungsräume und Arbeitsdetails tragen die menschliche Seite der Kanzlei. Namen, Qualifikationen und Schwerpunkte stehen auf einer eigenen Lesefläche unter den Bildern. Die helle Navigation wahrt die Lesbarkeit des originalen Logos; helle Schlussabschnitte gehen in den tiefblauen, oben gerundeten Footer über.

Diese Aufzeichnung gilt ausschließlich für Hagn & Partner. Sie führt den bestehenden Gestaltungsvertrag mit der fertigen, codebasierten Umsetzung zusammen: Richtung „institutionelle Korrespondenz“, Kandidat 6, Konzept b56e9e6b. Eine freigegebene Bildkomposition ist keine Grundlage dieses Systems; maßgeblich sind die tatsächlich verwendeten CMS-Werte und Komponenten.

**Key Characteristics:**

- Offene, durch feine Linien gegliederte Verzeichnisse.
- Serifentitel mit gut lesbarem Sans-Serif-Text.
- Originalfotografie und sichtbare Qualifikationen.
- Echte Telefon- und Adressmarge im Einstieg.
- Eigenständige Farbrollen pro CMS-Section.

### Geltung und Belege

Stand der extrahierten Umsetzung: 19.10.2026. Der vorbereitete CMS-Export enthält 24 native Seiten, 107 Sections und 30 Originalmedien: 20 Fotos, ein Logo und neun PDFs. Dieses Dokument erweitert keine globale Flamingo- oder Schubert-Gestaltung.

Die Werte stammen aus `scripts/hagn-partner/prepare-content.mjs` und `tmp/hagn-partner-2026-10-19/hagn-content.json`; die Feldzuordnung steht in [README.md](README.md). Typografie, Formen und Verhalten wurden mit `correspondence-hero.tsx`, `team-spotlight.tsx`, `services-grid.tsx`, `contact.tsx`, `dynamic-contact-form.tsx`, `section-primitives.tsx`, `site-header.tsx`, `site-footer.tsx`, `section-renderer.tsx`, `globals.css`, `tenant-theme.ts`, `brand-colors.ts` und dem Consulting-Classic-Block in `styles.ts` abgeglichen. Die vorhandenen Review-Captures bleiben Releasebelege; diese Dokumentation eröffnet keine neue Sichtabnahme.

## Colors

Die Palette verbindet warmes Papier und tiefe blaue Tinte mit zurückhaltendem Blaugrün. Die Frontmatter enthält die normativen Farbwerte.

Die achtstufigen OKLCH-Streifen im Sidecar sind synthetische Vorschauen der Farbcharaktere. Sie sind keine zusätzlichen CMS-Farbtokens und verändern die extrahierten Farbwerte nicht.

### Primary

- **Ink Navy** (`ink-navy`): Titel, primäre Buttons, Navigationstext, tintenfarbene Sections und Footer.
- **Link Teal** (`link-teal`): Links, Funktionssymbole und Akzente im hellen Kontext.

### Secondary

- **Ink Alternate / Ink Surface** (`ink-alternate`, `ink-surface`): abgestufte dunkle Hintergründe im tintenfarbenen Kontext.
- **On Ink Accent** (`on-ink-accent`): helle blaugrüne Akzente auf dunklem Grund.

### Neutral

- **Paper Ivory / Paper Alternate** (`paper-ivory`, `paper-alternate`): Seitenpapier und alternative helle Sections; Paper Ivory dient auch als heller Titel- und Buttonwert im dunklen Kontext.
- **Surface White** (`surface-white`): Kontaktpaneele, Formular, Eingaben und helle Buttonschrift.
- **Body Slate / Muted Slate** (`body-slate`, `muted-slate`): Haupttext und sekundäre Angaben auf Papier.
- **Divider Grey / Outline Grey / Input Grey** (`divider-grey`, `outline-grey`, `input-grey`): Leselinien, sekundäre Buttonrahmen und Feldgrenzen.
- **On Ink Body / On Ink Muted** (`on-ink-body`, `on-ink-muted`): Lesetext und Nebenangaben auf Tinte.
- **On Ink Divider / On Ink Outline** (`on-ink-divider`, `on-ink-outline`): dunkle Kontextlinien und sekundäre Buttonrahmen.

**The Kontextfarben Rule.** Helle und tintenfarbene Sections verwenden jeweils ihre zusammengehörigen Hintergrund-, Text-, Linien- und Buttonrollen. Karten und Eingaben behalten ihre eigenen Vordergrundrollen.

Die registrierten Section-Overrides werden durch den Builder nach tatsächlich unterstützten Farbrollen gefiltert. Ein nicht verwendeter Badge-Wert im Export begründet keinen visuellen Badge-Baustein.

## Typography

**Display Font:** Cormorant Garamond, CMS `brand.headingFont`. Die implementierte Rückfallkette verwendet `var(--font-outfit)`, `system-ui` und `sans-serif`.
**Body Font:** Manrope, CMS `brand.bodyFont`, mit `var(--font-inter)`, `system-ui` und `sans-serif`.

**Character:** Die fein gezeichnete Serifenschrift trägt die Kanzleipersönlichkeit. Die Sans-Serif-Schrift hält Erklärungen, Verzeichnisse, Kontaktdaten und Bedienelemente klar. Der vorhandene Schriftproxy liefert die konfigurierten Familien über die Website aus.

### Hierarchy

- **Display / Display Compact:** die zwei fließenden Haupttitelgrößen in der Frontmatter; mittlere Stärke (500), enge Zeilenführung (0,98), ausgeglichener Umbruch und maximal 18 Zeichenbreiten.
- **Headline:** Titel des Personenverzeichnisses, maximal 21 Zeichenbreiten; mittlere Stärke (500) und ruhige Zeilenführung (1,08).
- **Section Title:** gemeinsam verwendete Abschnittstitel mit stärkerem Gewicht (700), enger Laufweite und maximal 18 Zeichenbreiten.
- **Practice Title / Person Name:** gut unterscheidbare Titel der offenen Rechtsgebiets- und Personenverzeichnisse. Personennamen und vollständige Qualifikationen bleiben getrennte Zeilen.
- **Body / Body Intro:** Lesetext und Einleitungen. Der Einstieg verwendet (1rem), ab `sm` (1,125rem), mit Zeilenhöhe (1,8) und maximal 57 Zeichenbreiten. Andere Einleitungen reichen bis 65 Zeichenbreiten; Verzeichnisbeschreibungen verwenden (1rem / 1,75).
- **Label / Control / Input:** funktionale Feldbeschriftungen, Aktionen und Eingabetext. Kurze Kontakt- und Navigationsbezeichnungen können versal gesetzt sein; sie sind an eine konkrete Kontaktangabe oder Navigation gebunden.

**The Leseflächen Rule.** Namen, Qualifikationen und Schwerpunkte bleiben auf einer soliden, kontrastreichen Lesefläche sichtbar. Ein Bild oder Hover ist keine Voraussetzung, um diese Angaben zu lesen.

## Layout

Der reguläre CMS-Container reicht bis (80rem), mit seitlichem Innenabstand (1,5rem). Die Korrespondenz-Eröffnung besitzt einen eigenen Innencontainer von maximal (1320px); ihre Seitenabstände wachsen von (1,5rem) über (2,5rem) zu (3,5rem). Der Header-Innenraum reicht bis (1480px). Das wiederkehrende Abstandsraster folgt den in der Frontmatter dokumentierten Schritten.

Die Korrespondenz-Eröffnung ordnet ab `lg` Titel und Text neben einer Kontaktmarge von (250px) an. Darunter stehen das echte Foto und, wenn vorhanden, ein Linkregister von (310px). Die Kontaktmarge wird mobil unter den Einstieg gestellt und ab `sm` zweispaltig. Das Bild bleibt breit: im großen Einstieg (2:1), ab `sm` (3:1); kompakte Einstiege verwenden (16:5). Der Titel beginnt unter der gemessenen Headerfreistellung `--opening-header-clearance` plus (2,75rem). Die Navigation verwendet eine Ausgangshöhe von (72px).

Das Rechtsgebietsverzeichnis wird ab `lg` zweispaltig mit (3,5rem) Spaltenabstand. Das Personenverzeichnis folgt der tatsächlichen Zahl seiner Einträge: ab `sm` zwei Spalten, bei kleinen Gruppen ab `lg` drei, bei mehr als vier Personen ab `xl` vier. Ein einzelnes Profil nutzt ab `md` ein Bild neben dem Text. Porträts verwenden (5:4), Beschreibungen stehen darunter.

Kontaktinformationen und Formular stapeln sich mobil, teilen sich ab `md` den verfügbaren Raum und verwenden ab `lg` ein (2:3)-Verhältnis. Die Kartenabstände betragen (1rem), der Außenabstand zwischen Informations- und Formularbereich (2,5rem), ab `lg` (3rem). Namens- und E-Mail-Feld stehen ab `sm` nebeneinander.

Die gängigen CMS-Sections erhalten oben (3rem) und unten (1,5rem); Eröffnung, Text-Bild-, Lese- und Rechtstexte führen eigene Abstände. `sm`, `md`, `lg` und `xl` entsprechen (640px), (768px), (1024px) und (1280px); `2xl` (1536px) passt unter anderem die Navigation an.

## Elevation & Depth

Offene Verzeichnisse erhalten ihre Gliederung durch Papierflächen, Tinte, Linien und Fotografie. Der tatsächlich verwendete gemeinsame Button besitzt einen weichen Ambienteschatten und einen kleinen Hoverhub; Navigation und einzelne gemeinsame Komponenten behalten ihre implementierte Tiefe. Diese Umsetzung ist kein global schattenfreies System.

### Shadow Vocabulary

- **Primary action at rest:** `0 8px 24px var(--token-shadow)`.
- **Action on hover:** `0 14px 32px var(--token-shadow)`, bei feinem Zeiger und Hover, gemeinsam mit einem Hub von (−2px). Der aktuelle Markenschatten ist `rgba(15,23,42,0.08)`.
- **Inherited card:** `0 4px 16px rgba(15,23,42,0.06)` aus Consulting Classic, soweit die jeweilige Section keinen eigenen Wert setzt.
- **Contact surfaces:** `none`, ausschließlich als Section-Override auf `/kontakt`.

**The Kontakt nur mit Rahmen Rule.** Nur die Kontakt-Section auf /kontakt setzt --token-card-shadow auf none. Alle vier Infopaneele und das Formular konsumieren diesen Sectionwert; ihre weißen Flächen und 1px-Rahmen bleiben bestehen. Daraus entsteht kein globales Schattenverbot.

Der Karten-Schatten bleibt im CMS unter Section-Farben → Design → Karten-Schatten editierbar. Die Frontmatter enthält bewusst keine Schattenwerte; die Erweiterungen stehen im Sidecar.

## Shapes

Karten und allgemeine Inhaltsaktionen verwenden nahezu rechte Winkel über den Markenradius `card-button`. Eingabefelder und die funktionalen Kontakt-Symbolflächen verwenden den weicheren Feldradius. Linien bleiben fein (1px). Die Kontaktpaneele behalten weiße Flächen und einen durchgehenden Rahmen.

Fotografien im Korrespondenz- und Personenverzeichnis sind rechteckig und sauber beschnitten. Der Footer setzt eine bewusste andere Silhouette mit großen oberen Ecken: `footer-mobile`, ab `md` `footer-desktop`. Diese Footerform ist keine allgemeine Kartenform.

## Components

### Buttons

Ruhige, gut erkennbare Textaktionen. Primäre Aktionen verwenden Ink Navy auf heller Fläche mit Surface White als Schrift; im tintenfarbenen Kontext kehrt sich die Farbzuordnung zu Paper Ivory und Ink Navy um. Sekundäre Aktionen bleiben transparent und tragen den eigenen Umrisswert.

Der gemeinsame Button verwendet die dokumentierte Control-Typografie und Mindesthöhe (3rem). Unter (640px) füllt er die verfügbare Breite. Bei Hover mit feinem Zeiger steigt der Button leicht; der Pfeil rückt (3px) nach rechts. Aktiv fällt der Hub zurück. Sichtbarer Tastaturfokus verwendet eine Outline (2px); Korrespondenz- und Verzeichnislinks setzen ihren Fokus mit einem Abstand von (4px).

### Cards / Containers

Die vier Kontakt-Infopaneele verwenden den Markenradius, weiße Fläche, einen feinen Rahmen und den lokalen schattenfreien Wert. Ihr Innenabstand ist (1,25rem). Das Formular folgt demselben Flächenvertrag mit (1,5rem), ab `sm` (2rem), ab `lg` (2,5rem) Innenabstand. Seine Formularzeilen erhalten (1,25rem) Abstand.

Das offene Rechtsgebiets- und Personenverzeichnis bleibt ein Linien- und Spaltenlayout. Die Kontaktpaneele sind kein Muster für allgemeine Verzeichniskarten.

### Inputs / Fields

Weiße Felder mit eigenem Input Grey als Rahmen, Body Slate als Text und Muted Slate als Platzhalter. Sie haben Mindesthöhe (3rem), weiche Ecken und den dokumentierten Innenabstand. Jedes Feld erhält ein sichtbares Label. Das Nachrichtenfeld besitzt fünf sichtbare Zeilen und bleibt vertikal vergrößerbar.

Die gemeinsame Fokusoutline bleibt sichtbar. Fehlertexte und Statusmeldungen verwenden die vorhandenen Formularzustände und deren semantische Rollen; diese Dokumentation definiert keine neuen Zustandsfarben. Während des Sendens zeigt die Aktion den bestehenden Ladezustand und ist deaktiviert.

### Navigation

Helle, feste Navigation mit originalem Logo und den CMS-Einträgen Rechtsgebiete, Anwälte, Kanzlei und Service sowie „Kontakt & Termin“. Die Desktoplinks verwenden kurze, versale Manrope-Beschriftungen; ab `2xl` steigt die reguläre Größe auf (13px). Darunter steht das beschriftete Menüdialog-Verhalten mit Schließen-Aktion, originalem Logo und Kontaktzugang zur Verfügung. Die globale Fokusoutline bleibt aktiv. Die optionale obere Leiste ist im Hagn-Datenstand deaktiviert.

### Korrespondenz und offene Verzeichnisse

`editorialHero.layout = correspondence` verbindet den Titel, die echte Telefon- und Adressmarge, die Fotografie und das CMS-Linkregister. Alle Kontaktzeilen, Linktexte, Zieladressen, Bilder und Ausschnitte kommen aus den Sectionfeldern.

`servicesGrid.layout = index` zeigt die tatsächlichen Rechtsgebiete oder Dokumente als Textverzeichnis mit feinen Oberlinien. Die Beschreibungen benennen die Leistung direkt. `teamSpotlight.layout = directory` hält Originalporträts, Namen, Qualifikationen, Schwerpunkte und Profilverweise auf der Lesefläche sichtbar.

### Abschluss und Footer

`ctaBand.layout = plain` schließt auf hellem Papier mit einer Textaktion ab. Der folgende Footer verwendet die Variante `classic`, die Markenfarbe für den dunklen Hintergrund, helle Links, echte Kontaktangaben und seine großen oberen Ecken. Er begründet keine zusätzliche dunkle Werbekarte.

### Bewegung

Der Korrespondenzpfeil verschiebt sich bei Hover geringfügig nach rechts oben; gemeinsame Buttons und Footerlinks behalten ihre kleinen implementierten Zustandsbewegungen. Die Inhalte bleiben statisch vorhanden. Der globale `prefers-reduced-motion`-Block kürzt Animationen und Übergänge und deaktiviert weiches Scrollen; daraus folgt kein Versprechen, dass jeder Hover-Endzustand seine Geometrie beibehält.

## Do's and Don'ts

### Do:

- Do die institutionelle Korrespondenz durch offene Leselinien, eindeutige Verweise und echte Kontaktdaten fortführen.
- Do Cormorant Garamond für Titel und Manrope für Text und Bedienung über die CMS-Markenfelder verwenden.
- Do Namen, belegte Qualifikationen und Schwerpunkte ohne Hover lesbar halten.
- Do Rechtsgebiete im Verzeichnis unmittelbar mit ihrer konkreten Leistung beschreiben.
- Do Kontaktflächen über den lokalen Karten-Schatten steuern und ihre weißen Flächen sowie feinen Rahmen erhalten.
- Do Originalfotos, Bildpositionen, Alttexte und Verweise über die vorhandenen CMS-Felder pflegen.
- Do den hellen Abschluss vor dem tiefblauen, oben gerundeten Footer erhalten.

### Don't:

- Don't Namen oder Biografien über Fotos setzen oder Qualifikationen erst bei Hover offenlegen.
- Don't die offenen Rechtsgebiets- und Personenverzeichnisse durch austauschbare Symbolkarten ersetzen.
- Don't synthetische Personen oder fremde Räume als tatsächliche Kanzlei aufzeigen.
- Don't dekorative Pillen, erfundene Werbekicker oder juristische Embleme als neue Hagn-Bausteine hinzufügen.
- Don't die lokale Kontaktregel auf alle Sections oder andere Websites übertragen.
- Don't CMS-Inhalte, Farbrollen oder Kontaktdaten durch Hagn-spezifische JSX-Konstanten ersetzen.

Nicht kanonisiert oder repariert: Unbenutzte gemeinsame Varianten, dekorative Footer-Implementierungsdetails und reine Exportreserven werden nicht als neue Hagn-Regeln übernommen. Diese Dokumentation bewertet keine neuen Defekte und ändert keine UI. Quellen- und Fotorechteangaben bleiben in [MEDIA-PROVENANCE.json](MEDIA-PROVENANCE.json); die Quellwebsite nennt Stefan Bösl Fotografie für Fotos, nicht pauschal für Logo und PDFs.
