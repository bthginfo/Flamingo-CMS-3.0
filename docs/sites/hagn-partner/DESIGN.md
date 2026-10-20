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
  reel-opening:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(3.05rem, 7vw, 7rem)"
    fontWeight: 600
    lineHeight: 1.025
    letterSpacing: "-0.04em"
  reel-chapter:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.3vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.09
    letterSpacing: "-0.03em"
  atlas:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7.5vw, 7rem)"
    fontWeight: 600
    lineHeight: 1.035
    letterSpacing: "-0.04em"
  atlas-item:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 2.9vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.13
    letterSpacing: "-0.025em"
  spread-headline:
    fontFamily: "Manrope, var(--font-outfit), system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 4.5vw, 5.3rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
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
  reel-control:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.link-blue}"
    width: "48px"
    height: "48px"
  atlas-frame:
    backgroundColor: "{colors.surface-cool}"
    textColor: "{colors.on-photo-body}"
    typography: "{typography.atlas-item}"
  portrait-name:
    textColor: "{colors.ink-navy}"
  footer:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink-body}"
---

# Design System: Hagn & Partner

## Overview

**Creative North Star: "Perspektive"**

Perspektive verbindet große fotografische Flächen mit klarer Manrope-Typografie und offenen fachlichen Lesestrecken. Die bestätigte Apple-informierte Richtung zeigt sich in Bildmaßstab, reduzierter Hierarchie und dem Wechsel zwischen weitläufigen Bildkapiteln und konzentrierter Information. Weiß, kühles Hellgrau, dunkle Marinetöne und blaue Verweise tragen die bestehende Kanzleiidentität.

Originalporträts und Kanzleiaufnahmen verankern die Darstellung in der tatsächlichen Kanzlei. Ergänzende Symbolfotografie gibt Situationen einen Kontext; Herkunft und Credits bleiben in Medienmetadaten, Sidecars und den vorhandenen rechtlichen Bildnachweisen. Bildproportionen, Textdichte und Informationsform folgen dem Inhalt. Die native Fotostrecke und der verlinkte Bildatlas ergänzen die vorhandenen Portrait-, Lese- und Serviceformen.

**Key Characteristics:**

- Große Fotografien, bewusste Asymmetrie und unterschiedliche Bildproportionen prägen die Komposition.
- Manrope verbindet Titel, Lesetext und Bedienung.
- Native Bildkapitel, offene Fachtexte, Porträts und zweckgebundene Dokumentlisten gliedern den Inhalt.
- Eigene Vordergrundrollen sichern helle, dunkle und fotografische Kontexte.
- Bewegung bleibt optional; Inhalt und native Ziele sind beim ersten Rendern vorhanden.
- Ein dunkelblauer, oben gerundeter Footer schließt die Seiten ab.

Geltung: Hagn & Partner, Quellenstand 20.10.2026. Grundlage sind die aktuellen Renderer und der eingefrorene Export `tmp/hagn-showcase-2026-10-20/hagn-content.json`: 24 Routen, 80 bearbeitbare Sections, zwölf verwendete Sectiontypen, 24 SEO-Zeilen und 39 Medien. SHA-256: `704c79cf5253416a7694afedb0c8240df3226815aac6242f83f0b1ffecec2681`. Der historische Seed `3cb1de89` gehört zur früheren Weltwahl; für diese codebasierte Kompositionsiteration wurden weder eine neue Katalogkarte noch ein neuer Seed oder Bild-Comp ausgewählt. Der zuvor synchronisierte [Oberflächenvertrag](.impeccable/surfaces/readme-md.md) hält die aktuelle Ausprägung fest. Produktfakten stehen in [PRODUCT.md](PRODUCT.md), Pflege und Releasebelege in [README.md](README.md).

## Colors

Weiß und kühle Grautöne bilden die großen Flächen, tiefe Marinetöne tragen Text und dunkle Kapitel, Blau kennzeichnet Verweise. Die Frontmatter besitzt die normativen Werte; synthetische OKLCH-Streifen im Sidecar dienen ausschließlich der Farbvorschau.

### Primary

- **Ink Navy:** Titel, Haupttextakzente, primäre Aktionen, dunkle Sections und Footer.
- **Link Blue / Link Blue Hover:** Verweise und Funktionssymbole auf hellen Flächen.

### Secondary

- **Ink Alternate:** Bildplatzhalter und ergänzende Flächen in dunklen Sections.
- **On Ink Link:** Links auf dunklem Grund; Hover führt zu Weiß.

### Neutral

- **Surface White / Cool / Cool Deep:** Seitenfläche, Kapitelwechsel und Bildplatzhalter.
- **Body Slate / Muted Slate:** Lesetexte und sekundäre Angaben auf hellen Flächen.
- **Divider Grey / Outline Grey:** feine Inhaltslinien, Aktionsrahmen und Feldgrenzen.
- **On Ink Body / Muted / Divider / Outline:** Text-, Linien- und Rahmenrollen auf dunklen Flächen.
- **On Photo Body / Muted:** Text und optionale Bildnachweise auf dunklen Bildflächen; Fototitel verwenden Surface White.
- **Photo Scrim:** dunkle Ausgangsfarbe für die lesbare Textzone auf Fotografien.

**The Kontextfarben Rule.** Helle Flächen, dunkle Flächen und Fototext verwenden jeweils ihre eigenen Vordergrundrollen. Eine Änderung der normalen Sectionüberschrift verändert weder Fototitel noch benachbarte Sections.

Fototext in Reel und Atlas besitzt einen lokalen `data-color-context="dark"`. Titel und Fotoaktionen lesen `--token-on-dark-heading`, Lesetext liest `--token-on-dark-body`; die normalen Textflächen behalten `--token-heading`, `--token-body`, `--token-link` und `--token-link-hover`. Die passenden CMS-Rollen heißen `onDarkHeading`, `onDarkBody` und `imageOverlay`. Die normale Überschriftenfarbe darf nicht zur Fotovordergrundfarbe umgedeutet werden.

**The Lesbare Bildzone Rule.** Reel und Atlas legen die Abdunklung über die vollständige tatsächliche Textfläche. `--token-image-overlay` bestimmt die Farbe; die Deckkraft bleibt bis (3rem) vor der oberen Kante mindestens (88%), anschließend läuft sie transparent aus. Eine längere Beschreibung erweitert diese Zone mit dem Text.

Panorama und die registrierte immersive-Variante behalten ihre eigenen mehrteiligen Bildüberlagerungen. Der Builder übernimmt ausschließlich registrierte Farbrollen; textbasierte Briefings, Themen- und Ressourcenlisten erhalten keinen funktionslosen Bild-Overlay-Regler. Reserven im Markenobjekt begründen keine zusätzlichen Hagn-Komponenten.

## Typography

**Display Font:** Manrope über `brand.headingFont`.
**Body Font:** Manrope über `brand.bodyFont`.

**Character:** Eine gemeinsame kräftige Groteskschrift verbindet große Titel und sachliche Inhalte. Die Frontmatter beschreibt gesetzte CSS-Werte; sie behauptet keine zusätzliche Schriftdatei. Titel verwenden überwiegend Gewicht (600).

### Hierarchy

- **Reel Opening:** kurzer Seitentitel mit maximal (15ch). Die Frontmatter führt Größe, Zeilenhöhe und Laufweite. Showcase verwendet (2,6rem–6rem) bei (5,7vw), Zeilenhöhe (1,06).
- **Reel Chapter:** Bildkapiteltitel mit maximal (20ch); Beschreibungen folgen mit (1rem), ab md (1,075rem), Zeilenhöhe (1,7).
- **Atlas / Atlas Item:** eigene Auftakt- und Bildtitelrollen. Der Auftakt endet bei (16ch), Bildtitel bei (20ch). Unter (640px) erhalten Bildtitel (1,6rem–2,2rem) bei (6,8vw).
- **Display / Statement / Portrait / Compact:** die bestehenden Hero-H1-Rollen. Panorama endet bei (18ch), Statement bei (17ch), Portrait bei (13ch), Compact bei (21ch). Journal nutzt (3,3rem–8,25rem), (7,7vw), Zeilenhöhe (1,015), maximal (19ch).
- **Headline / Spread Headline:** Foto-Kapitelüberschriften; Spread besitzt die kleinere eigene Rolle aus der Frontmatter.
- **Topic / Title:** vorhandene fachliche Zwischenüberschriften. Topic bleibt eine unterstützte Bibliotheksrolle, im aktuellen Hagn-Export ist kein `topicExplorer` verwendet.
- **Body / Lead:** fachliche Texte liegen überwiegend bei (1,075rem–1,13rem), Zeilenhöhe (1,75–1,85), mit Lesebreiten bis (67ch). Editorial Briefing verwendet den Body-Wert der Frontmatter.
- **Label / Control / Input / Navigation:** funktionale Beschriftungen. Die Desktopnavigation ist versal und wächst ab 2xl auf (13px); Bildnachweise verwenden (0,75rem / 1,25rem).

**The Lesbare Worte Rule.** Titel behalten normale Wortumbrüche. Reel, Atlas und Spread erlauben sprachabhängige automatische Silbentrennung; die vorhandenen Hero- und Leserollen verwenden manuelle Silbentrennung. Feature-Fotoüberschriften erhalten bis (360px) zusätzlich `min-inline-size: 0`, `max-inline-size: 100%`, `font-size: clamp(2.15rem,11.5vw,2.35rem)` und automatische deutsche Silbentrennung. Bei (320px) ergibt das (36,8px); größere Ansichten behalten die normale Kapitelgröße. Redaktioneller Umbruch, Breite und Schriftgröße sichern lange deutsche Wörter auch bei (320px); beliebiges Auftrennen im Wort ist kein Gestaltungsmittel.

## Layout

Der gemeinsame Innenraum endet bei (1512px). Seitliche Abstände wachsen von (24px) über (40px) ab sm auf (64px) ab lg. Reguläre Bild- und Lesekapitel setzen vertikal (64px), ab md (96px). Die fotografischen Komponenten führen ihre Abstände selbst; die jeweiligen äußeren CMS-Abstände stehen im Export auf `none`. Die Rechtsseiten behalten ihr Leseraster und eigenen oberen Abstand.

### Eröffnungen

- **Reel Opening:** Titel und Einleitung teilen ab lg ein Verhältnis von (1,6:1). Darunter folgen native Bildkapitel mit einer Mindesthöhe von (480px), ab md (550px), ab lg (580px). Die nächste Bildfläche bleibt bei mehreren Einträgen erkennbar.
- **Atlas:** eigener Titel und ab lg ein asymmetrischer Bildverbund. Seine Flächen führen unmittelbar zu den jeweiligen Rechtsgebieten.
- **Panorama:** vollbreite Fotografie mit Text unten links, mindestens (680px), ab md `min(780px, calc(100svh - 72px))`. Die Bildauswahl nutzt `sizes="(max-width: 767px) 1210px, 100vw"`, um die breite Bildebene eines bildfüllenden 16:9-Motivs zu versorgen.
- **Statement:** weiße Titelfläche im Verhältnis (1,55:1), darunter eine Aufnahme mit (310px), ab sm (430px), ab lg (470px) Höhe.
- **Portrait:** Bild zuerst auf Mobilgeräten, ab lg Text links und Originalporträt rechts. Das Bildformat ist (13:12), die Bildbreite höchstens (430px); der Größenhinweis liefert ab (768px) (430px). Diese Begrenzung erhält die verwendbare Porträtauflösung.
- **Journal:** Titel über asymmetrischer Bild-/Textfolge im Verhältnis (1,12:0,88); Bildformat (6:5), ab lg (7:5).
- **Compact:** kurzer typografischer Einstieg; ein optionales Bild verwendet (260px), ab md (360px) Höhe.
- **Contact Sheet, Editorial Contact und Legal Content:** eigenständige Personen-, Kontakt- und Leseauftakte. Zusammen mit Reel und Atlas ergeben sich zehn Eröffnungsfamilien im Export.

Der feste Header reserviert ausschließlich am führenden passenden Auftakt seine gemessene Höhe über `--opening-header-clearance` und `--site-nav-height`; der Ausgangswert beträgt (72px).

### Bildraster und Lesestrecken

Die Reel-Spur scrollt innerhalb ihrer eigenen Fläche. Ein Kapitel belegt mobil `calc(100vw - 4rem)`, ab sm (84vw), ab lg `min(82vw, 1248px)`. Ein einzelner Eintrag füllt die Spur. Seitenabstand und Scroll-Padding stimmen überein; ab lg zentrieren sie sich auf die breite Inhaltsfläche.

Der Atlas verwendet ab lg zwölf Spalten: wiederkehrend (7/5), (5/7) und ein um zwei Spalten eingerücktes Bild über acht Spalten. Mindesthöhen variieren zwischen (440px) und (580px). Ab sm entsteht ein zweispaltiger Rhythmus mit breiten Zwischenbildern. Unter (640px) folgen breite und wechselweise um (24px) eingerückte Einzelbilder mit verschiedenen Höhen; der letzte Eintrag schließt vollbreit. Eigene Regeln für einen, zwei und sechs Einträge sowie für letzte ungerade Einträge verhindern Lücken. Eine leere Liste lässt Titel, Einleitung und optionale Folgeaktion nutzbar.

Photo Chapter `spread` verteilt Titel und Text links sowie ein großes Hauptbild rechts; das zweite Bild sitzt ab lg versetzt über der Folgefläche. Der Zwischenrahmen verwendet die jeweilige Sectionfarbe, mobil (10px), ab md (16px). Feature nutzt ein (8/4)-Spaltenraster; Diptych paart Fotos im Verhältnis (1,18:0,82). Die unterstützte immersive-Variante bleibt im Hagn-Export unbenutzt.

Offene Rich-Text-Lesestrecken tragen die fachliche Tiefe. Briefing und Resource List bleiben für echte Überblicks- und Dokumentaufgaben verfügbar. Die fünf Kernrechtsgebiete besitzen unterschiedliche Sectionfolgen. Home-Reel und Rechtsgebietsatlas sind eigenständige Oberflächenkompositionen; ihre genaue Folge ist im Oberflächenvertrag festgehalten.

Das Personenverzeichnis zeigt große Gruppen ab md in zwei Spalten, eine ungerade letzte Person als breite Zeile. Kurze Vorschauen verwenden drei Spalten, einzelne Ansprechpartner ein kompaktes Raster. Qualifikationen und Kontaktdaten bleiben sichtbar. Die implementierten Breakpoints sind sm (640px), md (768px), lg (1024px), xl (1280px) und 2xl (1536px). Die normale Desktopnavigation erscheint ab xl.

## Elevation & Depth

Fotografien, überlagerte Bildränder, wechselnde Flächen und feine Linien schaffen Tiefe. Reel, Atlas, neue Bildkompositionen, Personen und Ressourcenlisten benötigen keine schwebenden Karten. Die vorhandene Formularaktion und der feste Header behalten ihre eigene Schattenbehandlung.

### Shadow Vocabulary

- **Gemeinsame CMS-Aktion:** `0 8px 24px var(--token-shadow)`, bei Hover mit feinem Zeiger `0 14px 32px var(--token-shadow)`.
- **Formularfeld:** `inset 0 1px 0 color-mix(in srgb, var(--token-card-bg) 75%, transparent)`.
- **Formularfokus:** `0 0 0 3px color-mix(in srgb, var(--token-accent) 16%, transparent)`.

**The Offene Flächen Rule.** Themen, Personen und Dokumente erhalten ihren Zusammenhang durch Abstand, Typografie und feine Linien. Eine neue Inhaltsgruppe erfordert keine zusätzliche schwebende Karte.

## Shapes

Reel und Atlas verwenden rechteckige fotografische Flächen. Spread erzeugt seine Überschneidung durch Bildproportion und farbgleichen Zwischenrahmen. Bestehende Feature-, Diptych-, Journal- und Hero-Porträts verwenden den Medienradius `photo`; Personenbilder den kleineren `portrait-grid`. Inhaltsaktionen folgen `button`, Kontaktfelder `field`.

Die Headerkontaktaktion bleibt pillenförmig. Der Footer besitzt seine eigene obere Rundung, `footer-mobile` und ab md `footer-desktop`. Diese Sonderformen geben Inhaltsflächen keine pauschale Rundung vor. Inhaltslinien sind fein (1px).

## Components

### Buttons

Primäre Heroaktionen haben mindestens (48px) Höhe, (200ms)-Übergänge und einen sichtbaren Fokus mit (2px) Outline und (4px) Abstand. Helle und dunkle Kontexte besitzen eigene Aktionsfarben. Sekundäre Aktionen verwenden ihre getrennten Hintergrund-, Text- und Rahmenrollen. Die gemeinsame Formularaktion behält mindestens (48px) Höhe und ihre vorhandene Schattenbehandlung.

Perspective Link ist eine beschriftete native Textaktion mit mindestens (44px) Höhe, Unterstreichung bei Hover und optionalen SVG-Symbolen vor und nach dem Text. `iconPrefix` und `iconSuffix` werden tatsächlich gerendert; ein fehlender Suffix verwendet den kompatiblen Standardpfeil, ein explizit leerer Suffix entfernt ihn. Lokale Pfade, Pfadanker, PDF-Dateien, `tel:` und `mailto:` bleiben native Ziele. Externe HTTPS-Ziele öffnen mit `noopener noreferrer` separat.

### Cards / Containers

Die zwölf im Export verwendeten Typen sind `editorialReel`, `imageAtlas`, `perspectiveHero`, `photoChapter`, `richText`, `editorialBriefing`, `resourceList`, `teamSpotlight`, `ctaBand`, `contact`, `timeline` und `legalContent`. Andere Bibliotheksvarianten bleiben unterstützt, ohne eine neue Standardkomposition für Hagn zu bilden.

### Inputs / Fields

Editorial Contact verwendet das bestehende DynamicContactForm mit sichtbaren Labels, mindestens (48px) hohen Feldern und dem Feldradius der Frontmatter. Name, E-Mail und Anliegen sind Pflichtfelder, Telefon optional. Das Nachrichtenfeld startet mit fünf Zeilen und ist vertikal vergrößerbar. Fokus nutzt den blauen Feldrahmen und den vorhandenen Halo. Status und Fehler behalten die semantischen Rendererrollen.

### Navigation

`brand.navMode = solid`: weißer fester Header, Original-Kanzleilogo, dunkle Links und eine Kontaktaktion. Innenraum bis (1480px), nominelle Höhe (72px). Die obere Leiste ist deaktiviert. Mobil öffnet der beschriftete Schalter den vorhandenen Dialog mit Fokusfalle, Escape, Schließen und Fokuswiederherstellung.

### Fotografische Erzählung und Atlas

`editorialReel` bietet `opening` und `showcase`, `titleAs = h1/h2`, Überschrift, Einleitung, Bildkapitel und optionale Folgeaktion. Die native Scroll-Snap-Spur unterstützt Touch, sichtbare (48px)-Vor-/Zurück-Schalter und bei fokussierter Spur Pfeiltasten sowie Home/End. Randpositionen deaktivieren den passenden Schalter; die aktive Kapitelbezeichnung wird höflich angekündigt. Kein automatisches Weiterblättern. Inhalte und Verweise sind bereits serverseitig vorhanden.

`imageAtlas` bietet dieselben Bildkapitelfelder, einen eigenen Titel und eine optionale Folgeaktion. Ein Eintrag mit Ziel ist ein vollständiger nativer Anker; die sichtbare Linkzeile darin ist ein Span. Es gibt keine verschachtelten Links. Ohne Ziel bleibt der Eintrag ein Artikel. Die Headline-Ebene steuert die folgende Bildtitelebene.

`perspectiveHero` behält fünf Layouts; `photoChapter` bietet `feature`, `diptych`, `spread` und `immersive`. Photo Chapter bereinigt Rich Text vor der Ausgabe. Haupt- und Zweitbild besitzen eigene Alttexte sowie Desktop- und Mobilfokalpunkte. Fototext ist unabhängig von normalem Text editierbar.

### Bewegung und Bildbearbeitung

**The Native zuerst Rule.** Native Ziele und wesentlicher Inhalt bleiben ohne JavaScript und ohne Bewegung zugänglich. Bewegung ergänzt das Foto; sie steuert weder die Lesbarkeit noch den Zugriff auf Kapitel.

Die Bewegungswahl lautet `none`, `subtle` oder `expressive`. Reel, Hero und Photo Chapter unterstützen `imageEffect = none/parallax/kenBurns`; Atlas hat keinen Regler für eine unimplementierte Bildfahrt. `hoverEffect = none/zoom/lift` wirkt nur bei feinem Zeiger und erlaubter Bewegung. `none` schaltet Bildfahrt, optionale Bildhoverbewegung und sanftes programmatisches Blättern aus.

Bildhover nutzt (550ms) mit `cubic-bezier(.16,1,.3,1)`, Atlasbewegung (450ms). Zoom beträgt (1,035), bei `expressive` (1,065); Lift versetzt um (−5px). Die optionale leichte Bildfahrt verwendet den vorhandenen ImageEffectWrapper. Bei `prefers-reduced-motion` entfallen Parallaxe, Bildskalierung, Hovertransforms und sanftes Scrollen; der globale CSS-Schutz bleibt zusätzlich aktiv.

Der eigene CMS-Editor zeigt wiederholbare Einträge als einklappbare Titel-/Thumbnailzeilen mit stabilen eindeutigen IDs. Hinzufügen, Mehrfachauswahl aus der Mediathek, Duplizieren, Entfernen und Verschieben nach oben/unten sind direkte Aktionen. Jeder Eintrag besitzt Titel, Beschreibung, Medienauswahl/Upload/direkte URL, Alttext, getrennte Desktop-/Mobilfokalpunkte und vollständige Link-/Symbolfelder. Bewegungsdetails erscheinen abhängig von der gewählten Bewegung. Die Symbolauswahl ist ein beschrifteter Dialog mit Fokusfalle, Escape und Fokuswiederherstellung; Symbole lassen sich ausdrücklich entfernen.

**The Fortlaufende Bearbeitung Rule.** Jede aufeinanderfolgende Feld- oder Listenänderung aktualisiert sofort die kontrollierten Editorwerte und den ausstehenden Speicherstand. Bereits gesetzte Änderungsmarkierungen dürfen keine weitere Aktualisierung verhindern. Weitere Eingaben gehen vom zuletzt bearbeiteten Wert aus; Abschnittsidentität, Metadaten, andere Sprachstände und unberührte Inhalte bleiben erhalten.

### Fachtexte, Personen und Kontakt

Rich Text trägt die zusammenhängenden Lesestrecken. Briefing behält `columns`, `sequence` und `dossier`; Resource List gruppiert reale Dateien und native Sprungziele. `topicExplorer` bleibt als native Disclosure-Komponente kompatibel, kommt im aktuellen Export jedoch nicht vor. Sein früherer Platz im Home- und Verzeichnisaufbau ist keine geltende Vorgabe.

`teamSpotlight.layout = contactSheet` zeigt Originalporträts, Namen, belegte Rolle und Schwerpunkte offen. Kontaktperson, Telefon und E-Mail bleiben eigene Felder. `ctaBand.layout = plain` verwendet eine feine obere Linie, eine kurze Überschrift, Text und bis zu zwei native Aktionen. Der eigene Bandeditor erhält beide Ziele und Symbole auch beim Bearbeiten der Überschrift; individuelle Sekretariatskontakte dürfen nicht durch allgemeine Kanzleidaten ersetzt werden.

`contact.layout = editorial` führt Telefon, E-Mail, Bürozeiten und Adresse vor dem Formular. `showMap` ist false; der Kartenanbieter öffnet erst durch einen gewählten Link. Footer `classic` besitzt keine zusätzliche Footer-CTA.

## Do's and Don'ts

### Do:

- Do die Perspektive mit großen Fotografien, Manrope und offenen fachlichen Leseflächen fortführen.
- Do Eröffnung, Textdichte, Bildproportion und Informationsform aus dem jeweiligen Seiteninhalt bestimmen.
- Do Originalporträts, Namen, belegte Qualifikationen und Schwerpunkte ohne Hover lesbar halten.
- Do helle, dunkle und fotografische Flächen mit ihren eigenen Vordergrundrollen paaren.
- Do Alttexte, getrennte Bildausschnitte, native Ziele, optionale Symbole und Farben über die registrierten CMS-Felder pflegen.
- Do native Reelbedienung, ganze Atlasanker, sichtbaren Tastaturfokus und reduzierte Bewegung erhalten.

### Don't:

- Don't die verworfene beige Serifengestaltung als Hagn-Standard wieder einführen.
- Don't alle Seiten auf dieselbe Bildfolge, Kartenfolge oder Kontaktbelehrung reduzieren.
- Don't Symbolfotografie als Kanzleiraum, Kanzleipersonal, Mandantenaufnahme oder Ingolstädter Standort ausgeben.
- Don't öffentliche Produktionsregie, dekorative Werbekicker, erfundene Vertrauenssiegel oder juristische Erfolgsgarantien ergänzen.
- Don't Wörter willkürlich teilen, Qualifikationen hinter Hover verstecken oder wichtige Inhalte von Animation abhängig machen.
- Don't CMS-Inhalte, Symbolentscheidungen und Farbrollen durch Hagn-spezifische Renderer-Konstanten ersetzen.

Nicht kanonisiert oder repariert: Der vorhandene Detektorbericht führt die ältere Gradient-Text-Utility, den Gray-on-Red-Match und den Accordion-Seitenstreifen in globals.css auf. Diese Bibliothekswarnungen werden nicht zu Hagn-Gestaltungsregeln. Optionale Dachzeilen und unbenutzte Bibliotheksvarianten bilden ebenfalls keine Vorgabe. Die erneute Bereitstellung der nachgeführten Editorkorrektur sowie authentifizierte Produktionsspeicherung, API-Rücklesen, Neuladen und exaktes Wiederherstellen bleiben separate Releasebelege. Die erste öffentliche Sichtkontrolle bestätigt diesen Speicherzyklus nicht.
