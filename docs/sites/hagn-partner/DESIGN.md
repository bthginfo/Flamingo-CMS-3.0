---
name: "Hagn & Partner"
description: "Kanzlei-Edition: fotografische Titelstrecken, echte Persönlichkeiten und substanzielle Leseseiten."
colors:
  ink-navy: "#172E40"
  link-teal: "#2D616A"
  paper-chalk: "#F5F3ED"
  paper-alternate: "#EFEEE7"
  surface-white: "#FFFFFF"
  body-slate: "#33464C"
  muted-slate: "#53636A"
  divider-grey: "#BBC6C5"
  outline-grey: "#6E8388"
  input-grey: "#7E9296"
  ink-alternate: "#164654"
  ink-surface: "#194D5A"
  on-ink-body: "#E1E9E7"
  on-ink-muted: "#C0D2D0"
  on-ink-accent: "#CADFCE"
  on-ink-divider: "#587780"
  on-ink-outline: "#90A8AB"
  on-photo-muted: "#E1E8E9"
  photo-overlay: "rgba(9, 22, 31, .35)"
typography:
  display:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.75rem, 5.4vw, 5.8rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-.035em"
  display-portrait:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.7rem, 4.8vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-.035em"
  display-journal:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.8rem, 5.8vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-.035em"
  display-architectural:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.6rem, 4.5vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline-advanced:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.15rem, 5.4vw, 5.8rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-.035em"
  headline-directory:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2.3rem, 4.1vw, 3.8rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-.025em"
  headline:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  person-name:
    fontFamily: '"DM Serif Display", var(--font-outfit), system-ui, sans-serif'
    fontSize: "1.7rem"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "1rem"
    lineHeight: 1.75
  body-intro:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)"
    lineHeight: 1.75
  label:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.4
  control:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.25
  input:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "15px"
    lineHeight: 1.5
  navigation:
    fontFamily: '"Manrope", var(--font-inter), system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.025em"
rounded:
  card-button: "0.125rem"
  field: "0.75rem"
  header-action: "9999px"
  footer-mobile: "2rem"
  footer-desktop: "3rem"
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
  "20": "5rem"
  "24": "6rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    typography: "{typography.control}"
    rounded: "{rounded.card-button}"
    padding: "0.7rem 1.2rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    typography: "{typography.control}"
    rounded: "{rounded.card-button}"
    padding: "0.7rem 1.2rem"
  button-inverse:
    backgroundColor: "{colors.paper-chalk}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.control}"
    rounded: "{rounded.card-button}"
  button-advanced:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.card-button}"
    padding: "0.75rem 1.25rem"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.body-slate}"
    typography: "{typography.input}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  navigation:
    backgroundColor: "{colors.paper-chalk}"
    textColor: "{colors.ink-navy}"
    typography: "{typography.navigation}"
    height: "72px"
  atelier-selected:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.surface-white}"
    padding: "1.25rem 0.75rem"
  contact-panel:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.body-slate}"
    rounded: "{rounded.card-button}"
    padding: "1.25rem"
  person-name:
    textColor: "{colors.ink-navy}"
    typography: "{typography.person-name}"
  footer:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink-body}"
---

# Design System: Hagn & Partner

## Overview

**Creative North Star: "Kanzlei-Edition"**

Die Kanzlei-Edition verbindet großflächige Fotografie mit der Klarheit eines zeitgenössischen Magazins. DM Serif Display trägt die Titel; Manrope führt durch substanzielle Texte und eindeutige Aktionen. Kreidiges Papier und tiefe Tinte halten die unterschiedlichen Bildstrecken, Personenverzeichnisse und Leseseiten zusammen.

Authentische Porträts, Kanzleiräume und Arbeitsdetails zeigen die Kanzlei. Ergänzende, lokal gespeicherte Symbolfotografie gibt Rechtsgebieten einen eigenen situativen Kontext. Die sechs verwendeten fotografischen beziehungsweise personengeführten Eröffnungsfamilien unterscheiden sich sichtbar: Edition, Portrait, Journal, Architectural, Cinematic und Directory. Der vom Nutzer verworfene Korrespondenzaufbau ist keine Fortsetzungsregel. Diese Aufzeichnung beruht auf der fertig implementierten Variante, ohne freigegebenen Comp oder behauptete Vorlagentreue.

**Key Characteristics:**

- Fotografie ist im ersten Bildschirm sichtbar und prägt die Eröffnung.
- Großzügige Serifentitel wechseln mit konzentrierten Manrope-Leseflächen.
- Unterschiedliche Bildstrecken, interaktive Themenbühnen und echte Personen schaffen Seitenvielfalt.
- Papier, Tinte und eigenständige Farbrollen halten alle Zustände lesbar.
- Ein heller Schlussabschnitt führt in den dunkelblauen, oben gerundeten Footer.

Geltung: ausschließlich Hagn & Partner, extrahiert am 19.10.2026. Grundlage sind `tmp/hagn-rework-2026-10-19/hagn-content.json`, `scripts/hagn-partner/prepare-content.mjs` und die verwendeten Rendererkomponenten. Der Stand umfasst 24 native Seiten, 129 Sections, 19 registrierte Sectiontypen und 38 lokale Medien. Die Aufzeichnung ändert keine Oberfläche und erweitert keine globale Flamingo-Gestaltung. Produktfakten bleiben in [PRODUCT.md](PRODUCT.md), Bedienwege und Prüfbelege in [README.md](README.md).

## Colors

Kreidiges Papier, dunkelblaue Tinte und zurückhaltendes Blaugrün bilden den Farbcharakter. Die Frontmatter besitzt die normativen Werte; die achtstufigen OKLCH-Streifen im Sidecar sind synthetische Farbvorschauen, keine zusätzlichen CMS-Tokens.

### Primary

- **Ink Navy** (`ink-navy`): Haupttitel, primäre Aktionen, Navigationstext, dunkle Sections und Footer.
- **Link Teal** (`link-teal`): Links, Funktionssymbole und Akzente auf hellen Flächen.

### Secondary

- **Ink Alternate / Ink Surface** (`ink-alternate`, `ink-surface`): differenzierte dunkle Section- und Kartenflächen.
- **On Ink Accent** (`on-ink-accent`): Akzente und Hoverlinks im tintenfarbenen Kontext.

### Neutral

- **Paper Chalk / Paper Alternate** (`paper-chalk`, `paper-alternate`): Seitenpapier, Leseflächen und Bildplatzhalter. Paper Chalk trägt außerdem die inverse Aktion auf Tinte.
- **Surface White** (`surface-white`): helle Karten, Formularfelder, primäre Buttonschrift und Fototitel.
- **Body Slate / Muted Slate** (`body-slate`, `muted-slate`): Haupttext und sekundäre Angaben auf Papier.
- **Divider Grey / Outline Grey / Input Grey** (`divider-grey`, `outline-grey`, `input-grey`): feine Leselinien, sekundäre Aktionsrahmen und Feldgrenzen.
- **On Ink Body / Muted / Divider / Outline** (`on-ink-body`, `on-ink-muted`, `on-ink-divider`, `on-ink-outline`): zusammengehörige Lesetext-, Nebenangaben-, Linien- und Rahmenrollen auf Tinte.
- **On Photo Muted / Photo Overlay** (`on-photo-muted`, `photo-overlay`): eigenständige Vordergrund- und Overlayrollen für die filmische Eröffnung. Die verwendete Verkehrsrecht-Seite setzt den Overlaywert ausdrücklich im CMS.

**The Kontextfarben Rule.** Jede Fläche erhält ihr passendes Vordergrundpaar. Helle Karten innerhalb dunkler Sections und Text auf Fotos verwenden eigene Rollen; sie erben keine zufällige Textfarbe aus dem Umfeld.

Der Builder filtert Overrides nach den tatsächlich registrierten Rollen. Nicht verwendete Badge-Farbreserven im Export begründen keinen neuen visuellen Baustein.

## Typography

**Display Font:** DM Serif Display über `brand.headingFont`; die implementierte Rückfallkette steht in der Frontmatter.
**Body Font:** Manrope über `brand.bodyFont`; der vorhandene Schriftproxy liefert beide konfigurierten Familien über die Website.

**Character:** Ausdrucksstarke, ruhige Serifentitel geben der Fotografie ein redaktionelles Gegenüber. Die Sans-Serif-Schrift hält Rechtsthemen, Biografien, Formulare und Bedienung gut lesbar. Aufgezeichnete Gewichte sind die CSS-Anforderungen der Komponenten, keine Behauptung zusätzlicher Schriftschnitte.

### Hierarchy

- **Display / Portrait / Journal:** die drei fließenden Eröffnungstitel der Frontmatter, mit enger Zeilenhöhe (1,02). Die Lesebreite beträgt je nach Familie (13ch), (16ch) oder (20ch).
- **Architectural:** etwas kompaktere Titel auf solider Lesefläche, maximal (15ch), mit der dokumentierten Zeilenhöhe (1,08).
- **Advanced Headline:** große Themen- und Kapitelüberschriften; für deutsche Komposita verwendet die Quelle automatische Silbentrennung und einen sicheren Umbruch.
- **Directory Headline:** ruhiger Verzeichnistitel, maximal (21ch). Auf der Teamseite ist er H1; Personen heißen dort H2. In nachfolgenden Verzeichnissen werden H2 und H3 verwendet.
- **Headline / Person Name:** gemeinsame Sectiontitel und deutlich abgesetzte Namen. Qualifikation und Schwerpunkt erhalten eigene Textzeilen unter dem Bild.
- **Body / Body Intro:** üblicher Lesetext und Einleitungen mit maximal (65ch). Editionseinleitungen sind schmaler, überwiegend (43ch), Portrait (46ch); sie wechseln ab `md` von (1rem / 1,75) zu (1,125rem / 2rem).
- **Label / Control / Input / Navigation:** funktionale Beschriftungen und Aktionen. Desktopnavigation ist versal; Inhaltsüberschriften erhalten keine zusätzlichen dekorativen Versalzeilen.

**The Leseflächen Rule.** Namen, belegte Qualifikationen und Schwerpunkte sind ohne Hover sichtbar. Jeder Seitenauftakt hat genau einen H1; die Überschriften im Personenverzeichnis folgen seinem Kontext.

## Layout

Die regulären CMS-Container reichen bis (80rem) mit seitlichem Innenabstand (1,5rem). Fotografische Eröffnungen erweitern die Bühne auf (1600px), Architectural und Material Atelier auf (1440px); der Header-Innenraum reicht bis (1480px). Das wiederkehrende Raster verwendet die dokumentierten Abstände. Advanced-Sections setzen häufig (3,5rem), ab `md` (5rem) Außenraum; Signature Path verwendet (4rem), ab `md` (6rem). Die allgemeine CMS-Hülle ergänzt je nach Section ihre eigenen Abstandswerte.

Edition legt auf Desktop eine solide Textfläche über den linken Rand einer Fotografie, die (74%) der Bühne einnimmt; die Bühne ist mindestens (740px) hoch. Mobil erscheint zuerst das Foto mit (420px) Höhe, danach die leicht überlappende Papierfläche. Portrait ordnet ab `lg` Foto und Text im Verhältnis (0,95:1,05) nebeneinander an; mobil liegt das Bild im Verhältnis (5:4) vor dem Titel. Journal führt mit einer redaktionellen Titel- und gegebenenfalls Kontaktzeile und einer anschließenden breiten Fotografie von (330px), ab `md` (470px), ab `lg` (510px) Höhe. Architectural verwendet ab `lg` ein (0,9:1,1)-Raster für Text und Foto. Cinematic verwendet eine bildfüllende Fläche von mindestens (100svh) mit eigenständigem Overlay und inverser Schrift.

Eröffnungen reservieren die gemessene feste Headerhöhe über `--opening-header-clearance`; der Ausgangswert beträgt (72px). Die Teamseite verwendet das offene Directory als eigenen Personenauftakt. Die beiden Rechtsseiten haben einen ruhigen Lesekopf und denselben notwendigen Headerabstand.

Material Atelier verbindet auswählbare Themen, Text und eine große Bildfläche. Das verwendete Editorial-Preset nutzt ab `lg` das Verhältnis (0,7:1,3); sein Bild wechselt von (5:4) zu (4:5). Directory verteilt größere Gruppen ab `sm` auf zwei, ab `xl` auf vier Spalten. Kleinere Gruppen folgen der vorhandenen Zwei- oder Dreispaltenlogik. Kontaktinformationen und Formular stapeln sich mobil und teilen ab `md` die Fläche; Namens- und E-Mail-Feld stehen ab `sm` nebeneinander.

`sm`, `md`, `lg`, `xl` und `2xl` entsprechen (640px), (768px), (1024px), (1280px) und (1536px). Die normale Desktopnavigation erscheint ab `xl`. Inhaltsaktionen füllen unter (640px) ihre verfügbare Breite. Bildfit, Alttext und Fokalpunkt bleiben pro unterstütztem Bildfeld CMS-gesteuert; Originalporträts verwenden überwiegend `center 25%`, die Home-Edition `55% center` und der filmische Verkehrsrechtauftakt `42% center`.

## Elevation & Depth

Fotografie, Überlappung, Papierflächen und feine Linien erzeugen den Hauptteil der Tiefe. Gemeinsame Aktionen und einige Inhaltskarten tragen weiche Schatten; offene Personenverzeichnisse bleiben durch Linien gegliedert. Die Quelle begründet kein global schattenfreies System.

### Shadow Vocabulary

- **Action at rest:** `0 8px 24px var(--token-shadow)`.
- **Action on hover:** `0 14px 32px var(--token-shadow)` mit kleinem Hub bei feinem Zeiger und Hover.
- **Inherited card:** `0 4px 16px rgba(15,23,42,0.06)` aus Consulting Classic, soweit keine Section einen eigenen Schatten verwendet.
- **Path cards:** `0 14px 42px var(--token-shadow)` mobil und `0 16px 48px var(--token-shadow)` im Desktoppfad.

Der Hagn-Sectionwert für `--token-shadow` ist `rgba(15, 35, 49, .12)`. Schatten bleiben eine abgestufte Zustands- und Flächenhilfe. Motionwerte und vollständige Zustandsregeln stehen im Sidecar, da die Frontmatter sie nicht aufnehmen kann.

## Shapes

Die Markenradien halten Inhaltskarten und gemeinsame Aktionen nahezu rechtwinklig. Eingabefelder verwenden den weicheren Feldradius. Der Header besitzt weiterhin seine eigene pillenförmige Kontaktaktion; diese vorhandene Funktionsform ist keine Vorgabe für Inhaltskarten oder dekorative Labels. Fotografische Bühnen sind sauber beschnittene Rechtecke.

Der Footer setzt eine eigene große obere Rundung: mobil `footer-mobile`, ab `md` `footer-desktop`. Linien sind fein (1px). Das gerundete Footerprofil bleibt der Abschluss der gesamten Seite und wird nicht auf jede Inhaltsfläche übertragen.

## Components

### Buttons

Klare Textaktionen mit direkt verständlicher Beschriftung. Primäre Aktionen auf Papier verwenden Ink Navy und Surface White; auf Tinte werden Paper Chalk und Ink Navy gepaart. Sekundäre Aktionen bleiben transparent mit eigener Rahmenrolle. Die Mindesthöhe des gemeinsamen Buttons beträgt (3rem). Bei Hover mit feinem Zeiger steigt er um (2px), der Pfeil rückt (3px) weiter. Aktiv kehrt der Hub zurück. Sichtbarer Tastaturfokus verwendet eine Outline von (2px).

Advanced-Aktionen verwenden kleinere, kräftigere Manrope-Beschriftungen und den gleichen Markenradius. Beschriftungen und Ziele kommen aus dem CMS. Insbesondere `signaturePath.items[].ctaLabel` bezeichnet die konkrete Folgeaktion; der Titel bleibt lediglich der kompatible Rückfall für ältere Daten.

### Cards / Containers

Helle und dunkle Inhaltsflächen nutzen jeweils ihre eigenen Kartenrollen. Die Schluss-Section `ctaSplit` verbindet eine helle Text- und Aktionshälfte mit einem großen Originalfoto. Ihr Innenraum wächst von (1,5rem) über (2rem) und (3rem) bis (3,5rem). Offene Personen- und Leistungsindizes behalten ihre Liniengliederung.

### Inputs / Fields

Weiße Felder, eigene Input-Grey-Grenze, Body Slate als Schrift und Muted Slate als Platzhalter. Die Mindesthöhe beträgt (3rem); der Innenabstand steht in der Frontmatter. Jedes Feld hat ein sichtbares Label. Das Nachrichtenfeld bleibt vertikal vergrößerbar. Formularzustände verwenden die vorhandenen semantischen Status- und Fehlerrollen; diese Aufzeichnung erfindet keine neue Hagn-Zustandspalette.

### Navigation

Hagn wählt im Marken-CMS ausdrücklich `brand.navMode = solid`. Der feste Header behält seine konfigurierte Paper-Chalk-Fläche und dunkle Links auch vor Fotografie. Das originale Logo bleibt sichtbar. Der konfigurierte Modus wird unter „Navigation & Header“ → „Navigationsfläche“ gepflegt; `auto` bleibt als kompatibler Modus für andere Daten unterstützt.

Die Navigation enthält Rechtsgebiete, Anwälte, Kanzlei, Service und Kontakt & Termin. Desktoplinks verwenden die dokumentierte Navigationstypografie, ab `2xl` (13px). Mobil öffnet ein beschrifteter Menüschalter einen Dialog auf derselben soliden Fläche; Fokusfalle, Schließen-Aktion, Escape und Fokuswiederherstellung gehören zum vorhandenen Verhalten. Die optionale obere Leiste ist im Hagn-Datenstand deaktiviert.

### Fotostrecken und Personen

`editorialHero.layout` bietet die verwendeten Varianten `edition`, `portrait`, `journal` und `architectural`. Titel, Text, Fotos, Alttexte, Ausschnitte, Fit, Kontaktzeilen und Aktionen sind registrierte CMS-Felder. `cinematicHero` besitzt eigene Bild-, Alttext-, Fokalpunkt-, Overlay- und Aktionsfelder; Hagn verwendet dort `imageEffect = none`. Die Fotografie bleibt erkennbar, während die Textrollen separat auf Lesbarkeit abgestimmt sind.

`teamSpotlight.layout = directory` zeigt Originalporträts mit sichtbarem Namen, vollständiger Qualifikation, Schwerpunkt und Profilverweis. `titleAs` führt die semantische Überschriftenhierarchie. Die vollständigen sieben Anwälte bleiben redaktionell einzeln pflegbar.

### Themenbühnen und Wege

Material Atelier verändert Bild, Beschreibung, Merkmale und Aktionslink gemeinsam. Ein fokussiertes oder angeklicktes Thema wird über `aria-pressed` markiert; aktive Fläche und Schrift verwenden das primäre Aktionspaar. Die Bildbeschreibung wird als Livebereich aktualisiert. Bildalttext und Fokalpunkt gehören zum jeweiligen Element.

Service Tabs besitzt beschriftete Tabs mit `aria-selected`, zugeordnetem Panel und Pfeiltasten-, Home- und End-Bedienung. Signature Path trägt bis zu sieben verknüpfte Stationen; mobil wird daraus eine vertikale Folge. Kapitelstrecken, Scroll Story und Guided Choice ergänzen diese Muster nach Inhalt. Hagn setzt `showKickers = false` bei Signature Path, Scroll Story und Guided Choice sowie `showNumbers = false` bei FAQ Contact Split. Die eigentlichen Pfadmarkierungen und die fachlichen Inhalte bleiben erhalten.

### Abschluss und Bewegung

Ein heller Schlussabschnitt, überwiegend `ctaSplit`, führt zu den echten Kontaktwegen und anschließend in den Footer `classic`. Die leere Footer-CTA verhindert eine zusätzliche generische Schlusskarte. Kontaktangaben und Links sind CMS-Inhalte.

Material Atelier wechselt im Editorial-Preset mit einer kurzen Überblendung und geringem Versatz; Service Tabs verwendet eine kürzere Überblendung. Der globale `prefers-reduced-motion`-Block kürzt CSS-Animationen und Übergänge und deaktiviert weiches Scrollen. Advanced-Scrollstrecken besitzen bereits gerenderte statische Rückfälle. Keine wichtige Information setzt eine Animation voraus.

## Do's and Don'ts

### Do:

- Do die Kanzlei-Edition durch sichtbare Fotografie, eigenständige Seitenkompositionen und substanzielle Leseflächen fortführen.
- Do DM Serif Display für Titel und Manrope für Texte und Bedienung über die CMS-Markenfelder verwenden.
- Do Originalporträts und belegte Qualifikationen ohne Hover lesbar halten.
- Do helle, dunkle und fotografische Flächen mit ihren eigenen Vordergrundrollen paaren.
- Do Bilder, Alttexte, Fokalpunkte, Aktionen und Zustände über die registrierten CMS-Felder pflegen.
- Do den soliden Papierheader und den hellen Abschluss vor dem dunkelblauen, oben gerundeten Footer erhalten.
- Do Hagns ausgeblendete dekorative Kicker und FAQ-Nummern bei Erweiterungen respektieren.

### Don't:

- Don't den verworfenen Korrespondenzauftakt als Hagn-Standard wieder einführen.
- Don't alle Hauptseiten auf dieselbe Eröffnungs- und Sectionfolge reduzieren.
- Don't fremde Personen, Räume oder Städte als tatsächliche Kanzlei, Mitarbeiter oder Standort ausgeben.
- Don't dekorative Werbekicker, erfundene Vertrauenssiegel oder juristische Erfolgsgarantien ergänzen.
- Don't Qualifikationen hinter Hover verstecken oder Bildausschnitte ohne Prüfung der jeweiligen Person übernehmen.
- Don't CMS-Inhalte, Farbrollen oder Kontaktdaten durch Hagn-spezifische Renderer-Konstanten ersetzen.

Nicht kanonisiert oder repariert: Zwei bereits vorhandene violette CMS-Headerwarnungen aus dem einmaligen Detektorbericht gehören nicht zum öffentlichen Hagn-System. Unbenutzte Bibliotheksvarianten, leere Badge-Felder und dekorative Footerreserven sind keine Gestaltungsregeln. Diese Dokumentation behebt keine UI und behauptet weder eine neue Gesamtabnahme noch eine rechtliche Freigabe.
