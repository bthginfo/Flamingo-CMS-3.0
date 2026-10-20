---
name: "Hagn & Partner"
description: "Perspektive: großflächige Fotografie, Manrope und offene fachliche Leseflächen."
colors:
  ink-navy: "#101820"
  link-blue: "#0B55C4"
  link-blue-hover: "#103B79"
  surface-white: "#FFFFFF"
  surface-cool: "#F2F5F7"
  surface-cool-deep: "#E8EDF2"
  body-slate: "#364451"
  muted-slate: "#596674"
  divider-grey: "#CED6DD"
  outline-grey: "#8393A1"
  ink-alternate: "#182634"
  on-ink-body: "#DCE4EB"
  on-ink-muted: "#B9C7D3"
  on-ink-link: "#BBD4FF"
  on-ink-divider: "#526677"
  on-ink-outline: "#95A8BA"
  on-photo-body: "#EEF3F8"
  on-photo-muted: "#CBD5E1"
  photo-scrim: "#09121B"
typography:
  display:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 7.7vw, 8.25rem)"
    fontWeight: 600
    lineHeight: 1.015
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.3rem, 7.8vw, 8.25rem)"
    fontWeight: 600
    lineHeight: 1.015
    letterSpacing: "-0.04em"
  portrait:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 6.4vw, 7rem)"
    fontWeight: 600
    lineHeight: 1.015
    letterSpacing: "-0.04em"
  compact:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 6.2vw, 6.5rem)"
    fontWeight: 600
    lineHeight: 1.015
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 5.6vw, 6.2rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  topic:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.25vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 2.55vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "1.075rem"
    fontWeight: 400
    lineHeight: 1.85
  lead:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
  control:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
  input:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  form-control:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.25
  navigation:
    fontFamily: "Manrope, var(--font-inter), system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.025em"
rounded:
  button: "0.5rem"
  field: "6px"
  portrait-grid: "12px"
  photo: "14px"
  inherited-card: "1rem"
  footer-mobile: "2rem"
  footer-desktop: "3rem"
  navigation-action: "9999px"
spacing:
  gutter-mobile: "1.5rem"
  gutter-sm: "2.5rem"
  gutter-lg: "4rem"
  chapter-mobile: "4rem"
  chapter-desktop: "6rem"
  compact-mobile: "3.5rem"
  compact-desktop: "5rem"
  field-gap: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.control}"
    rounded: "{rounded.button}"
    padding: "0.875rem 1.5rem"
  button-inverse:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.control}"
    rounded: "{rounded.button}"
    padding: "0.875rem 1.5rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    typography: "{typography.control}"
    rounded: "{rounded.button}"
    padding: "0.75rem 1.25rem"
  text-link:
    textColor: "{colors.link-blue}"
    typography: "{typography.control}"
    padding: "0.5rem 0"
  button-form:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.form-control}"
    rounded: "{rounded.button}"
    padding: "0.7rem 1.2rem"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.body-slate}"
    typography: "{typography.input}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  navigation:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.navigation}"
    height: "72px"
  topic-row:
    textColor: "{colors.ink-navy}"
    typography: "{typography.topic}"
    padding: "1.5rem 0"
  portrait-name:
    textColor: "{colors.ink-navy}"
  footer:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink-body}"
---

# Design System: Hagn & Partner

## Overview

**Creative North Star: "Perspektive"**

Perspektive verbindet eine fotografische Bühne mit großer, klarer Manrope-Typografie und offenen fachlichen Leseflächen. Die bestätigte Apple-Referenz zeigt sich in der Größe der Bilder, der reduzierten Hierarchie und dem Wechsel zwischen weitläufigen Kapiteln und konzentrierter Information. Weiß, kühles Hellgrau und dunkle Marinetöne tragen die Kanzleiidentität.

Originalporträts und Kanzleiaufnahmen verankern die Darstellung in der tatsächlichen Kanzlei. Ergänzende Symbolfotografie gibt den Rechtsgebieten einen situativen Kontext und bleibt als Symbolbild kenntlich. Die Bildkomposition, die Länge der Lesestrecke und die Informationsform folgen dem jeweiligen Inhalt.

**Key Characteristics:**

- Große Fotografien und deutliche Titel prägen die Eröffnungen.
- Manrope verbindet Titel, Lesetext und Bedienung.
- Offene Themenzeilen, Porträts und Dokumentlisten gliedern den Inhalt.
- Eigene Vordergrundrollen sichern helle, dunkle und fotografische Kontexte.
- Ein dunkelblauer, oben gerundeter Footer schließt die Seiten ab.

Geltung: Hagn & Partner, Quellenstand 20.10.2026. Grundlage sind der eingefrorene Export in tmp/hagn-perspective-2026-10-20/hagn-content.json, der aktuelle Builder und die verwendeten Rendererkomponenten. Der Export enthält 24 native Routen, 82 bearbeitbare Sections, neun verwendete Sectiontypen, 24 SEO-Zeilen und 39 Medien. Diese Dokumentation beschreibt die Quelle; Browserbestätigung, CMS-Liveprüfung und Veröffentlichung besitzen separate Belege. Produktfakten stehen in [PRODUCT.md](PRODUCT.md), die Pflegeverträge in [README.md](README.md).

## Colors

Die Palette verwendet Weiß und kühle Grautöne als große Flächen, tiefe Marinetöne für Text und dunkle Kapitel und ein kontrolliertes Blau für Links. Die Frontmatter besitzt die normativen Werte; synthetische OKLCH-Streifen im Sidecar dienen ausschließlich der Farbvorschau.

### Primary

- **Ink Navy** (ink-navy): Titel, Haupttextakzente, primäre Aktionen, dunkle Sections und Footer.
- **Link Blue / Link Blue Hover** (link-blue, link-blue-hover): Verweise und Funktionssymbole auf hellen Flächen.

### Secondary

- **Ink Alternate** (ink-alternate): Bildplatzhalter und ergänzende Flächen in dunklen Sections.
- **On Ink Link** (on-ink-link): Links und Funktionsakzente auf dunklem Grund; Hover führt zu Weiß.

### Neutral

- **Surface White / Cool / Cool Deep**: Seitenfläche, ruhige Kapitelwechsel und Bildplatzhalter.
- **Body Slate / Muted Slate**: Lesetexte sowie sekundäre Angaben auf hellen Flächen.
- **Divider Grey / Outline Grey**: feine Inhaltslinien, sekundäre Aktionsrahmen und Feldgrenzen.
- **On Ink Body / Muted / Divider / Outline**: zusammengehörige Text-, Nebenangaben-, Linien- und Rahmenrollen auf dunklen Flächen.
- **On Photo Body / Muted**: Text und Bildnachweise auf den dunklen fotografischen Bühnen. Titel verwenden Surface White.
- **Photo Scrim**: die dunkle Ausgangsfarbe der mehrteiligen fotografischen Überlagerung. Sie erzeugt eine stabile Textzone und lässt das Motiv erkennbar.

**The Kontextfarben Rule.** Helle Flächen, dunkle Flächen und Fototext verwenden jeweils ihre eigenen Vordergrundrollen. Bildüberlagerungen sind Lesbarkeitshilfen; Verläufe dienen hier keiner dekorativen Schriftfüllung.

Der Builder übernimmt pro Section ausschließlich die registrierten Farbrollen. Vorhandene Badge- und Kartenreserven im Markenobjekt begründen keine zusätzlichen Hagn-Komponenten.

## Typography

**Display Font:** Manrope über brand.headingFont.
**Body Font:** Manrope über brand.bodyFont.

**Character:** Eine gemeinsame, kräftige Groteskschrift hält große Titel und sachliche Inhalte zusammen. Die Quelle fordert in den neuen Titeln überwiegend Gewicht (600); die Schriftfamilie wird über den bestehenden Website-Schriftproxy bereitgestellt. Die Frontmatter erfasst die tatsächlich gesetzten CSS-Werte, ohne eine verfügbare Schnittdatei oder einen gemessenen Browserwert zu behaupten.

### Hierarchy

- **Display:** Panorama-H1 mit maximal (18ch). Die fließende Größe reicht bei einer Basis von (16px) von (51,2px) bis (132px).
- **Statement / Portrait / Compact:** unterschiedliche H1-Größen und Lesebreiten aus der Frontmatter. Statement endet bei (17ch), Portrait bei (13ch), Compact bei (21ch). Journal verwendet (3,3rem–8,25rem), (7,7vw), Zeilenhöhe (1,015) und maximal (19ch).
- **Headline:** die dokumentierte Foto-Kapitelüberschrift; benachbarte Komponenten verwenden eigene, eng verwandte Größen. Topic Explorer nutzt (2,8rem–6,2rem) bei (5,9vw), Editorial Briefing (2,7rem–6rem) bei (5,5vw), Dossier (2,5rem–4,8rem) bei (4,4vw), Resource List (2,5rem–5,25rem) bei (4,6vw).
- **Topic / Title:** große Themenzeilen und fachliche Zwischenüberschriften. Sie bleiben auf offenen Flächen sichtbar.
- **Body:** Editorial-Briefing-Text mit maximal (67ch). Andere Lesetexte liegen überwiegend bei (1,075rem–1,13rem), Zeilenhöhe (1,75–1,85) und (48–67ch).
- **Lead:** Panorama-Einleitung ab md; mobil (1,075rem) bei gleicher Zeilenhöhe. Journal-Einleitungen verwenden (1,15rem), ab md (1,25rem), Zeilenhöhe (1,75).
- **Label / Control / Input / Navigation:** funktionale Beschriftungen. Die Desktopnavigation ist versal und wächst ab 2xl auf (13px); der Inhalt verwendet normal gesetzte Titel. Bildnachweise sind kleiner (0,75rem / 1,25rem).

**The Lesbare Worte Rule.** Die neuen Kompositionen setzen normale Wortumbrüche und manuelle Silbentrennung. Deutsche Namen und Komposita erhalten ihre Zeilen durch redaktionellen Umbruch, Breite und Schriftgröße; beliebiges Auftrennen im Wort ist kein Gestaltungsmittel.

## Layout

Die neuen vollflächigen Sections verwenden einen gemeinsamen Innenraum bis (1512px). Seine seitlichen Abstände wachsen von (24px) über (40px) ab sm auf (64px) ab lg. Reguläre fotografische und redaktionelle Kapitel setzen vertikal (64px), ab md (96px). Kompakte Listen und einzelne Ansprechpartner verwenden kürzere, komponenteneigene Abstände. Fehlt eine Kapitelüberschrift, reduzieren Topic Explorer, Briefing und Resource List ihren oberen Abstand auf (20px), ab md (32px); sie führen dann den vorherigen Auftakt fort.

Die Sectionverträge der fünf neuen Typen verwenden fullBleed. Der Builder setzt deren äußere CMS-Abstände sowie die von contact und teamSpotlight auf none, weil die Komponenten ihren Innenraum selbst führen. Die Rechtsseiten bleiben im normalen Leseraster mit eigenem oberen CMS-Abstand.

### Eröffnungen

- **Panorama:** vollbreite fotografische Bühne, Text unten links. Mindesthöhe mobil (680px), ab md min(780px, 100svh − 72px). Der obere Textabstand beträgt mobil (96px), ab md (80px); die Unterkante erhält (48–64px). Das Foto wird priorisiert geladen. Die Panorama-Bildauslieferung verwendet sizes = "(max-width: 767px) 1210px, 100vw". Bei einer mobilen Bühne von (390 × 680px) zeichnet ein bildfüllendes 16:9-Motiv eine ungefähr (1209px) breite Bildebene; der Größenhinweis berücksichtigt diese Ebene bei der Auswahl der Bilddatei. Er ändert weder die sichtbare Layoutbreite noch den Fokalpunkt und ist eine Rendererregel, kein zusätzliches CMS-Feld.
- **Statement:** weiße Titelfläche über einer anschließenden Panoramaaufnahme. Ab lg trennt ein (1,55:1)-Raster Titel und Einleitung. Die Fotohöhe wächst von (310px) über (430px) auf (470px).
- **Portrait:** Bild zuerst auf Mobilgeräten, ab lg Text links und Originalporträt rechts im Verhältnis (1,08:1). Bildformat mobil (6:5), ab lg (4:5), maximale Höhe (700px).
- **Journal:** breiter Titel über einer asymmetrischen Foto-/Textkomposition. Ab lg liegt das Verhältnis bei (1,12:0,88), das Bild wechselt von (6:5) auf (7:5).
- **Compact:** kurzer typografischer Auftakt; ein optionales Bild hätte eine Höhe von (260px), ab md (360px). Die Hagn-Utility-Seiten verwenden diese Variante ohne Pflichtfoto.
- **Contact Sheet, Editorial Contact und Legal Content:** eigenständige Personen-, Kontakt- und Leseauftakte ergänzen die fünf Hero-Varianten. Im Export ergeben sich acht Eröffnungsformen.

Der feste Header reserviert am ersten passenden Auftakt seine gemessene Höhe über --opening-header-clearance und --site-nav-height; der Ausgangswert beträgt (72px). Es gibt keinen zusätzlichen Headerabstand für jede folgende Section.

### Kapitel und Raster

Photo Chapter feature verteilt ab lg das Bild auf acht und den Text auf vier von zwölf Spalten. Diptych paart zwei Fotos im Verhältnis (1,18:0,82); das zweite Bild beginnt versetzt (64px), ab md (96px). Die registrierte immersive-Variante besitzt eine dunkle Bühne bis (1800px) Breite und mindestens (660px), ab md (740px) Höhe; sie ist im eingefrorenen Hagn-Export unbenutzt.

Der Themenindex verwendet großzügige native Disclosure-Zeilen. Editorial Briefing bietet offene Spalten, eine nummerierte Phasenfolge und ein Dossier mit Seitenkolumne. Resource List ordnet ab lg Gruppenüberschrift und Ressourcen im Verhältnis (0,6:1,6). Kontaktformular und Kontaktangaben teilen ab lg die Fläche im Verhältnis (0,85:1,15); mobil stehen Telefon und E-Mail vor dem Formular.

Das Personenverzeichnis zeigt umfangreiche Gruppen ab md in zwei großen Spalten. Bei einer ungeraden Anzahl erhält die letzte Person eine breite Bild-/Textzeile. Eine Vorschau mit drei Personen verwendet ab md drei Spalten; ein einzelner fachlicher Ansprechpartner erhält ein kompaktes eigenes Raster bis (1224px). Die Originalporträts behalten ihren individuellen Ausschnitt; der Hagn-Datenstand verwendet überwiegend center 25%.

Die implementierten Tailwind-Breakpoints sind sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). Die normale Desktopnavigation erscheint ab xl. Nur die gemeinsamen CMS-Buttons füllen unter (640px) die verfügbare Breite; die neuen Heroaktionen bleiben umbrechende Inlineaktionen. Der Panoramaauftakt besitzt mit imageMobilePosition einen eigenen mobilen Fokalpunkt unter (768px).

## Elevation & Depth

Große Fotografien, wechselnde helle und dunkle Flächen sowie feine Linien schaffen die wesentliche Tiefe. Die neuen Heroaktionen, Themenzeilen, Personenkompositionen und Ressourcenlisten setzen keine Karten-Schatten. Die gemeinsam verwendete Formularaktion und der feste Header besitzen weiterhin ihre eigene Schattenbehandlung.

### Shadow Vocabulary

- **Gemeinsame CMS-Aktion:** 0 8px 24px var(--token-shadow), bei Hover mit feinem Zeiger 0 14px 32px var(--token-shadow).
- **Formularfeld:** inset 0 1px 0 color-mix(in srgb, var(--token-card-bg) 75%, transparent).
- **Formularfokus:** 0 0 0 3px color-mix(in srgb, var(--token-accent) 16%, transparent).

Der Brand-/Consulting-Fallback für Schatten bleibt eine geteilte Rendererregel. Die neuen Hagn-Komponenten begründen keinen neuen globalen Schattenwert. Der Sidecar führt die Quell-Snippets und Bewegungswerte als Erweiterungen.

**The Offene Flächen Rule.** Themen, Personen und Dokumente erhalten ihren Zusammenhang durch Abstand, Typografie und feine Linien. Eine neue Inhaltsgruppe erfordert keine zusätzliche schwebende Karte.

## Shapes

Foto-Kapitel und große Hero-Porträts verwenden den Medienradius photo; Personen- und Themenbilder den etwas kleineren portrait-grid-Radius. Panorama- und Statement-Bilder bleiben vollflächig rechteckig. Die Inhaltsaktionen folgen button, die Kontaktfelder field. Der größere inherited-card-Radius bleibt Teil vorhandener gemeinsamer Formzustände.

Der Header besitzt eine pillenförmige Kontaktaktion. Der Footer verwendet seine eigene obere Rundung, footer-mobile und ab md footer-desktop. Diese funktionalen Sonderformen geben Inhaltsflächen keine pauschale Rundung vor. Inhaltslinien sind fein (1px).

## Components

### Buttons

Primäre Heroaktionen sind gefüllte Textaktionen mit einer Mindesthöhe von (3rem). Auf heller Fläche stehen Ink Navy und Weiß zusammen, auf dem Panorama Weiß und Ink Navy. Sekundäre Aktionen verwenden eine transparente Fläche und eine eigene Rahmenrolle. Hover erhöht die Helligkeit; aktiv verschiebt sich die primäre Aktion um (1px). Die Übergänge dauern (200ms). Ein sichtbarer Fokus nutzt eine Outline von (2px) mit Abstand (4px).

Perspective Link zeigt eine fachlich beschriftete Textaktion mit eingebettetem SVG-Pfeil, Mindesthöhe (44px), Farbwechsel und Unterstreichung bei Hover. Die kleine Pfeilbewegung ist an motion-safe gebunden. Die Formularaktion nutzt weiterhin den gemeinsamen CMS-Button mit (0,9375rem), Gewicht (650), Mindesthöhe (48px), eigenem Schatten und (220ms)-Übergängen.

### Cards / Containers

Die aktuellen Hauptmuster sind offene Bild-, Text- und Listenflächen. Die neun im Export verwendeten Sectiontypen sind perspectiveHero, photoChapter, topicExplorer, editorialBriefing, resourceList, teamSpotlight, contact, timeline und legalContent. Andere registrierte Bibliotheksvarianten bleiben für bestehende Daten verfügbar und gehören dadurch nicht automatisch zu dieser Hagn-Gestaltung.

### Inputs / Fields

Editorial Contact nutzt das bestehende DynamicContactForm. Die hellen Felder haben eine Mindesthöhe von (48px), den Feldradius aus der Frontmatter und sichtbare Labels. Name und E-Mail stehen ab sm nebeneinander. Telefon bleibt optional; Name, E-Mail und Anliegen sind Pflichtfelder. Das Nachrichtenfeld startet mit fünf Zeilen und lässt sich vertikal vergrößern. Fokus verwendet den blauen Feldrahmen und den bestehenden Halo; deaktivierte Bedienelemente zeigen den vorhandenen gesperrten Zustand. Status- und Fehlerfarben stammen aus den vorhandenen semantischen Rendererrollen.

### Navigation

brand.navMode ist solid: ein fester weißer Header mit Original-Kanzleilogo und dunklen Links. Der Innenraum reicht bis (1480px), die nominelle Höhe beträgt (72px). Desktoplinks heißen Rechtsgebiete, Anwälte, Kanzlei und Service; die eigene Kontaktaktion führt zu Kontakt & Termin. Die obere Leiste ist im gelieferten Datenstand deaktiviert.

Mobil öffnet ein beschrifteter Schalter den bestehenden Menüdialog. Fokusfalle, Escape, Schließen-Aktion und Fokuswiederherstellung gehören zum vorhandenen Verhalten. Farben werden im Marken-CMS gepflegt und stammen auch vor dunkler Fotografie aus dem gewählten soliden Navigationsmodus.

### Fotografische Kapitel

perspectiveHero besitzt die fünf oben beschriebenen Kompositionen. headline ist Klartext mit optionalen Zeilenumbrüchen und besitzt H1. image, imageAlt, imagePosition und imageMobilePosition steuern Motiv und Ausschnitt; caption und die beiden Aktionen sind unabhängige Felder. Leere Dachzeilen und Metadaten bleiben im Hagn-Export leer.

photoChapter besitzt feature, diptych und die derzeit unbenutzte immersive-Variante. Das Rich-Text-Feld wird vor Ausgabe bereinigt. Primär- und Zweitbild haben eigene Alttexte und Fokalpunkte. Die Überschrift besitzt H2.

### Themen, Fachtexte und Dokumente

topicExplorer verwendet native details/summary mit einer gemeinsamen Namensgruppe; das erste sichtbare Thema ist standardmäßig offen. Alle Titel und Zusammenfassungen bleiben sichtbar, der Inhalt ist bereits serverseitig im Dokument enthalten. Ein offenes Thema zeigt Foto, fachlichen Text, Fragen, Ansprechpartnerangaben und Link. Die Zeile ist mindestens (112px), ab md (132px) hoch. Das Öffnen erfordert keine Animation oder clientseitig nachgeladene Inhalte.

editorialBriefing verwendet columns, sequence oder dossier. groups enthalten Überschrift, bereinigten Rich Text und optionale Punkte; stages enthalten Klartextphasen. Fehlt eine äußere Überschrift, werden die Gruppenüberschriften H2, sonst H3. Ein Hinweis und eine konkrete Folgeaktion schließen den Abschnitt optional ab.

resourceList gruppiert reale Dokumente und Verweise. Gruppen-IDs dürfen native Sprungziele bilden. Jede Ressource besitzt Titel, Zweck, Link, Format und Aktionsbeschriftung. PDF wählt das Downloadsymbol; der Formatwert begründet keine erfundene Dateigröße. Fehlt ein Gruppentitel, beansprucht die Liste die gesamte Inhaltsbreite. Die neun Kanzlei-PDFs stehen in einer zusammenhängenden Serviceliste.

### Personen und Kontakt

teamSpotlight.layout = contactSheet zeigt Originalporträts mit Namen, belegter Rolle und sichtbaren Schwerpunkten. Kontaktperson, Telefon und E-Mail sind eigene optionale Felder. titleAs legt den Verzeichniskopf als H1 oder H2 fest; Namen folgen eine Ebene darunter. Einzelne fachliche Ansprechpartner und kurze Vorschauen verwenden ihre jeweils implementierte Komposition.

contact.layout = editorial ist ausdrücklich wählbar und verändert bestehende Standardlayouts anderer Websites nicht. Die Kontaktseite besitzt einen eigenen H1, direkte Telefon-/E-Mail-Links, Bürozeiten und Adresse, das geteilte Formular und den Originalraum als folgendes Fotokapitel. showMap ist im Hagn-Stand false; ein Kartenlink öffnet erst nach Auswahl den externen Anbieter.

Der Footer classic enthält die Kanzlei-, Fachgebiets-, Kontakt- und Rechtslinks. Seine zusätzliche CTA ist leer. Die jeweiligen Seiten führen über ihre tatsächliche letzte Inhaltssection in den Footer; eine fotografische Schlusskarte ist keine allgemeine Pflicht.

## Do's and Don'ts

### Do:

- Do die Perspektive mit großen Fotografien, Manrope und offenen fachlichen Leseflächen fortführen.
- Do Eröffnung, Textdichte und Informationsform aus dem jeweiligen Seiteninhalt bestimmen.
- Do Originalporträts, Namen, belegte Qualifikationen und Schwerpunkte ohne Hover lesbar halten.
- Do helle, dunkle und fotografische Flächen mit ihren eigenen Vordergrundrollen paaren.
- Do Alttexte, passende Bildausschnitte, Links und unabhängige Farben über registrierte CMS-Felder pflegen.
- Do native Themenzeilen, sichtbaren Tastaturfokus und die vorhandene reduzierte Bewegung erhalten.

### Don't:

- Don't die verworfene beige Serifengestaltung als Hagn-Standard wieder einführen.
- Don't alle Seiten auf dieselbe Bildfolge, Kartenfolge oder Kontaktbelehrung reduzieren.
- Don't Symbolfotografie als Kanzleiraum, Kanzleipersonal, Mandantenaufnahme oder Ingolstädter Standort ausgeben.
- Don't dekorative Werbekicker, erfundene Vertrauenssiegel oder juristische Erfolgsgarantien ergänzen.
- Don't Wörter willkürlich teilen, Qualifikationen hinter Hover verstecken oder wichtige Inhalte von Animation abhängig machen.
- Don't CMS-Inhalte und Farbrollen durch Hagn-spezifische Renderer-Konstanten ersetzen.

Nicht kanonisiert oder repariert: Der vorhandene Detektorbericht nennt drei unveränderte Regeln in globals.css außerhalb der geänderten Zeilen: die Gradient-Text-Utility (580), den alten Gray-on-Red-Match (663) und den Accordion-Seitenstreifen (1092). Sie werden nicht zu Hagn-Gestaltungsregeln. Unbenutzte Bibliotheksvarianten und optionale Dachzeilen sind ebenfalls keine Vorgabe. Diese Quellendokumentation enthält keine Behauptung einer abgeschlossenen Browser-, Veröffentlichungs- oder Rechtsfreigabe.
