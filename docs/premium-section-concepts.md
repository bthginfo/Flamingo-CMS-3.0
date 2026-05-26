# Premium Section Concepts

Ziel: visuell starke Sections, die trotzdem vollständig CMS-gesteuert bleiben. Jede neue Section braucht Renderer, Admin-Editor, Preview-Daten, API-Instructions, Section-Auswahl, Showcase-Preview, Color-Mapping und i18n-kompatible Datenfelder.

## Shared Premium Sections

### 1. Immersive CTA Banner
- Fullwidth CTA mit Hintergrundbild oder Video, Overlay, Parallax/Ken-Burns, optionaler Split-Maske und Sticky-Fokus beim Scrollen.
- CMS-Felder: eyebrow, headline, subline, bgImage, bgVideo, overlay, imageEffect, primaryCta, secondaryCta, trustItems, facts, alignment, height, colorOverrides.
- Nutzen: sehr gut für Kontakt, Buchung, Beratung, Reservierung, Shop-Kauf, Angebotsanfrage.

### 2. Proof Wall
- Premium Social-Proof-Band mit Bewertungen, Kennzahlen, Logos, Zertifikaten und kurzen Trust-Belegen in einer animierten Wand.
- CMS-Felder: headline, subline, metrics, testimonials, logos, badges, sourceLabels, animationSpeed, layoutVariant.
- Nutzen: branchenübergreifend stark vor CTAs oder auf Startseiten.

### 3. Interactive Decision Finder
- Kompakter geführter Auswahlblock: Nutzer wählen 2-4 Optionen, die Section empfiehlt passende Leistungen, Pakete oder nächste Schritte.
- CMS-Felder: questions, options, resultCards, resultCtas, fallbackCta, icons, scoringRules.
- Nutzen: erhöht Conversion, weil Nutzer schneller zur passenden Leistung finden.

### 4. Editorial Feature Rail
- Hochwertige horizontale oder gestaffelte Feature-Story mit großen Bildern, Microinteractions, sticky Text und kleinen Fakten.
- CMS-Felder: headline, subline, slides, image, kicker, text, facts, cta, scrollMode, mediaPosition.
- Nutzen: macht komplexe Leistungen, Markenwelten oder Prozesse emotionaler.

### 5. Premium Offer Strip
- Fullwidth Angebots-/Kampagnenleiste mit Countdown, Bild, Vorteilspunkten, CTA und optionalem Coupon/Code.
- CMS-Felder: badge, headline, subline, image, validUntil, benefits, code, primaryCta, secondaryCta, urgencyMode.
- Nutzen: Aktionen, Events, Saisonangebote, freie Termine, Launches.

## Branch-Specific Ideas

### Handwerk
- Project Scope Visualizer: zeigt Projektumfang von Soforthilfe bis Komplettsanierung mit Aufwand, Dauer und Gewerken.
- Material & Finish Selector: interaktive Materialkarten für Fliesen, Farben, Oberflächen, Armaturen oder Systeme.

### Restaurant
- Menu Mood Pairing: Gerichte, Weine und Anlässe als visuelle Pairing-Karten.
- Kitchen Rhythm Story: Tagesablauf der Küche vom Einkauf bis zum Service als Scroll-Story.

### Hotel
- Room Match Finder: Gäste wählen Anlass, Dauer und Komfortwunsch; passende Zimmer oder Angebote werden empfohlen.
- Spa Atmosphere Banner: ruhiges Fullscreen-Spa-Bild mit Tageszeiten, Treatments und Buchungs-CTA.

### Salon
- Look Builder: Stilrichtung, Farbintensität und Pflegeaufwand führen zu passenden Treatments.
- Transformation Gallery Pro: kuratierte Vorher/Nachher-Stories mit Technik, Dauer und Pflegehinweis.

### Tourismus
- Day Planner: interaktive Tagespläne nach Wetter, Saison, Schwierigkeit und Zielgruppe.
- Seasonal Panorama: Fullwidth Saisonbild mit Highlights, Events und Routenvorschlägen.

### Medical
- Patient Journey Guide: verständliche Journey von Terminbuchung, Vorbereitung, Untersuchung bis Nachsorge.
- Trust & Standards Panel: Zertifikate, Geräte, Hygiene, Datenschutz und Behandlungsstandards kompakt inszeniert.

### Wedding
- Guest Journey: Tagesablauf aus Gästesicht mit Ort, Zeit, Dresscode, Transport und RSVP-CTA.
- Memory Wall: große emotionale Bilderwand mit Story-Snippets, Countdown und wichtigen Infos.

### Photography
- Shoot Style Finder: Nutzer wählen Anlass, Stimmung und Nutzung; passende Pakete und Bildsprache werden empfohlen.
- Gallery Narrative: Editorial Portfolio-Story mit Bildserien, Locations, Lichtstimmung und Ergebnis.

### Consulting
- Case Strategy Map: erklärt Mandatsstrategie von Erstprüfung bis Umsetzung mit Risiken und Optionen.
- Expertise Signal Wall: Rechtsgebiete, Publikationen, Erfolge und Fachbeiträge als hochwertiger Kompetenzblock.

### Real Estate
- Property Value Journey: zeigt Bewertungslogik, Vergleichswerte, Vermarktung und Verkaufsstrategie.
- Neighborhood Intelligence: Lagefaktoren, POIs, Zielgruppen und Marktindikatoren als visuelle Standortkarte.

### Cafe
- Taste Flight Builder: Kaffee-, Kuchen- oder Drink-Empfehlungen nach Geschmack, Tageszeit und Anlass.
- Event Night Banner: atmosphärischer Fullwidth Event-CTA mit Datum, Line-up, Menü und Reservierung.

### Tattoo
- Tattoo Readiness Check: geführte Vorbereitung für Motiv, Stelle, Größe, Schmerzlevel und Pflege.
- Style Signature Wall: Stile, Artists, Flash-Motive und freie Slots als interaktive Galerie.

### Ecommerce
- Gift Finder: Geschenkberater nach Budget, Anlass, Geschmack und Lieferzeit.
- Drop / Launch Banner: Premium Launch-Section mit Countdown, Produktbild, Benefits und Shop-CTA.

### Retail
- Room Mood Builder: Stil, Raumgröße, Material und Budget führen zu passenden Wohnwelten.
- Showroom Moment Banner: Fullwidth Showroom-CTA mit Parallax, Materialdetails, Beratung und Terminbuchung.

## Implementation Checklist

- Section-Type in `section-types.ts` registrieren.
- Renderer in `templates/shared` oder branchenspezifischem Template anlegen.
- `SectionRenderer` Mapping und Full-Bleed-Verhalten prüfen.
- Admin-Editor mit allen Feldern bauen, inklusive Media, CTA, Repeater, Toggles und Farbsettings.
- Color Mapping in `section-color-editor.tsx` ergänzen.
- API-Instructions-Schema in `api/v1/instructions` ergänzen.
- Preview-Daten und `/demo/showcase` prüfen.
- i18n-Felder textuell sauber halten, Slugs/URLs/Bilder nicht übersetzen.
- Bestehende Tenants dürfen keine Migration brauchen; neue Sections sind additive Content-Blöcke.
