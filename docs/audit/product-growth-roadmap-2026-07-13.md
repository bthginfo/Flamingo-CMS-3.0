# Flamingo CMS: Product-, UI/UX- und Section-Roadmap

Stand: 2026-07-13

## Diagnose

Flamingo hat bereits die Breite eines starken Produkts: Multi-Tenant-CMS, Live-Vorschau, Farbrollen, Publishing-Preflight, Shop, Booking, AI-API, Goal-based Composer und mehr als 80 gemeinsame beziehungsweise branchenspezifische Sections.

Der nächste Sprung entsteht nicht durch wahllos mehr Sections. Es fehlen vor allem geschlossene Wirkungskreisläufe:

1. Ein verifiziertes Unternehmensprofil als gemeinsame Faktenquelle ist in der AI-API beschrieben, aber nicht als dauerhaftes CMS-Objekt etabliert.
2. Der Composer plant eine gute semantische Reihenfolge, bewertet aber noch nicht die komplette visuelle Dramaturgie einer Seite.
3. Sections haben Farben und Inhaltsfelder, aber noch keinen vollständigen Vertrag für Wirkung, Responsive-Verhalten, Analytics, Zustände und visuelle Grenzen.
4. Es gibt Consent und Speed Insights, aber keine produktweite, section-genaue Conversion-Schleife.
5. Branchen sind gleichzeitig Default, Registry-Owner und Verkaufslogik. Das koppelt Dinge, die getrennt gehören.

## Zielarchitektur: Branche entkoppeln

Ein Tenant braucht keine verpflichtende „Branche“ als zentrale Produktidentität. Sinnvoller sind fünf unabhängige Achsen:

| Achse | Zweck | Beispiel |
|---|---|---|
| Unternehmensprofil | verifizierte Fakten | Name, Standorte, Leistungen, Preise, Öffnungszeiten, Belege |
| Conversion-Ziel | Seitenlogik | Anfragen, Buchungen, Kauf, Vertrauen, Community |
| Experience-Familie | inhaltliche Dramaturgie | Expertise, Transformation, Hospitality, Planung, Produkte |
| Art Direction | visuelle Sprache | Editorial, Cinematic, Studio, Precision, Organic |
| Capabilities | technische Module | Shop, Booking, Mehrsprachigkeit, CRM |

Die Branche bleibt ein optionaler Preset- und Demo-Filter. Sie liefert Startwerte, geeignete Begriffe, Schema.org-Typen und kuratierte Rezepte, sperrt aber keine fachlich passende Section. Das bestehende `definitionKey`/Owner-Modell bleibt für Kompatibilität erhalten.

## Priorität 1: die größten Produkthebel

### A. Persistentes Business Profile

Ein zentrales, redaktionell freigegebenes Faktenmodell für:

- Identität, Standorte, Einzugsgebiete und Kontakt
- Leistungen/Produkte mit Preisstatus und Belegen
- Personen, Qualifikationen, Zertifikate und echte Bewertungen
- Öffnungszeiten inklusive Sonderzeiten
- Zielgruppen, Einwände, Tonalität und primäre Conversions
- Quellenstatus: verifiziert, unsicher, fehlt, veraltet

Sections, SEO, strukturierte Daten, AI und Kontaktformulare lesen daraus. „Einmal ändern, überall korrekt“ ist ein direkt verkaufbarer Nutzen.

### B. Composer 2.0: Seiten-Dramaturgie statt Section-Liste

Den bestehenden Guided/Catalog Switch behalten und den Guided-Modus erweitern:

1. Ziel und Experience-Familie wählen.
2. Art Direction wählen.
3. Composer zeigt eine komplette Seiten-Silhouette mit Einstieg, Angebot, Proof, Story und Abschluss.
4. Jede Stufe kann zwischen drei begründeten Alternativen wechseln.
5. Ein Rhythmus-Linter verhindert gleiche Layouts, Hintergründe oder Kartenmuster direkt hintereinander.
6. Vor dem Einfügen zeigt eine echte responsive Vorschau den Gesamtfluss.

### C. Section Contract 2.0

Jede Section bekommt zusätzlich zu Schema und Farben:

- semantische Aufgabe und erlaubte Composer-Stufen
- primäre/sekundäre Conversion-Events
- Mindest- und Maximalmengen für Text, Karten und Bilder
- definierte Empty-, Loading-, Error- und Disabled-States
- responsive Layout-Grenzen und sichere Fallbacks
- Accessibility-Vertrag: Tastatur, Fokus, Motion Reduction, Kontrast
- Bildrollen, Seitenverhältnisse und Focal-Point-Regeln
- erlaubte Art-Direction-Varianten
- visuelle Regression-Stories für Desktop, Tablet und Mobile

Das ist wichtiger als die Anzahl der Sections: Jede Section wird verlässlich premium.

### D. Conversion Intelligence

First-party, consent-gesteuerte Events mit Tenant- und Section-Bezug:

- Impression, Interaktion, CTA, Formularstart, Formularabschluss, Booking, Kauf
- Funnel pro Seite und Section
- „Diese Section wird gesehen, aber nicht genutzt“
- UTM-/Referrer-Auswertung
- einfache Varianten-Tests für Headline, CTA, Reihenfolge und Section-Variante
- Empfehlungen nur bei ausreichender Datenbasis

Damit verkauft Flamingo nicht nur Websites, sondern messbare Verbesserung.

### E. Publish Quality Gate

Vor Veröffentlichung automatisch:

- Screenshots bei 390, 768, 1280 und 1536 px
- Overflow, abgeschnittene Inhalte, leere CTA, defekte Links und Bilder
- Kontrast, Fokus, Tastatur und `prefers-reduced-motion`
- visuelle Differenz zur letzten Publikation
- Content-Freshness, abgelaufene Events/Angebote und inkonsistente Fakten
- klare Trennung zwischen blockierendem Fehler und Hinweis

## UI/UX-System für wirklich premium Sections

### Art Direction statt einer einzigen Karten-Sprache

Viele moderne Systeme wirken trotz guter Einzelkomponenten gleich, weil jede Section aus `rounded-3xl`, Schatten und Karten besteht. Flamingo sollte fünf visuelle Grammatiken anbieten:

- **Editorial:** starke Typografie, Linien, viel Weißraum, asymmetrische Bildschnitte
- **Cinematic:** Full-bleed Media, starke Kontraste, wenige große Aussagen
- **Studio:** Color Blocking, modulare Flächen, spielerische Typografie
- **Precision:** Raster, Tabellen, feine Rahmen, fachliche Ruhe
- **Organic:** weiche Masken, taktile Texturen, warme Bildführung

Eine Art Direction steuert Radius, Flächen, Typo-Skala, Bildmasken, Motion und Section-Übergänge. Farbwahl allein reicht nicht.

### Page Rhythm Engine

Automatische Regeln:

- nicht zwei Grids oder zwei dunkle Full-bleed-Sections direkt nacheinander
- maximal eine dominante Scroll-Interaktion pro Seite
- jede Seite braucht einen klaren visuellen Peak und eine ruhige Zone
- CTA-Häufigkeit nach Seitenlänge begrenzen
- Textbreite, Headline-Zeilen und vertikale Dichte kontrollieren
- mobile Reihenfolge und Touch-Ziele separat bewerten

### Bestehende Sections zuerst aufwerten

| Section-Familie | Aufwertung |
|---|---|
| Heroes | stabiles Nutzenversprechen, Art Direction, Mobile-Crop, Video-Poster, maximal zwei CTAs, sichtbarer Proof |
| Galerien | Swipe, Lightbox, Tastatur, Captions, Filter, progressive Bilder, intelligente Crop-Vorschau |
| Testimonials/Proof | Quelle, Datum, Logo/Portrait, Projektlink, Ergebniszeitraum, keine unbelegten Zahlen |
| FAQ | Suche, Deep Links, Schema.org, kontextueller Abschluss-CTA, mobile Einhandbedienung |
| Preise/Vergleich | sticky Auswahlhilfe, klare Empfehlung, Total Cost, Feature-Erklärungen, mobile Vergleichsansicht |
| Timelines/Prozess | durchgehende visuelle Linie, aktive Stufe, echte Deliverables, sichere kurze Mobile-Variante |
| CTAs/Formulare | progressive Felder, Inline-Validierung, Ergebnis-/Erwartungstext, Sticky Mobile Action Dock |
| Maps/Standorte | branded Map-Stil, Cluster, echte Projekte/Standorte, Listen-Fallback und Consent-State |

## Neue Wow-Sections mit echtem Nutzen

### 1. Guided Offer Matcher

Interaktiver 3–5-Schritt-Finder: Bedarf, Priorität, Budgetrahmen und Timing auswählen; danach konkrete Empfehlung mit Begründung, Preisrahmen und vorbefüllter Anfrage/Booking.

**Warum Wow:** flüssige Kartenübergänge, sichtbarer Fortschritt und personalisiertes Ergebnis.
**Warum wertvoll:** qualifiziert Leads statt nur Aufmerksamkeit zu erzeugen.

### 2. Local Proof Atlas

Eine gebrandete MapLibre-Karte mit geclusterten Projekten, Referenzen, Bewertungen oder Standorten. Filter nach Leistung; Klick öffnet Case-Drawer mit Bildern, Ergebnis und CTA.

**Warum Wow:** räumliche, interaktive Story.
**Warum wertvoll:** lokales Vertrauen und Service-Area-Kommunikation.

### 3. Outcome Simulator

Kein Preisrechner, sondern ein transparenter Nutzenrechner: Zeitersparnis, Energie-/Kostenpotenzial, Auslastung oder erwarteter Projektumfang. Eingaben, Annahmen und Ergebnis bleiben nachvollziehbar; Ergebnis kann in die Anfrage übernommen werden.

**Warum Wow:** animierte, aber belastbare Ergebnisvisualisierung.
**Warum wertvoll:** macht abstrakte Leistungen entscheidbar.

### 4. Hotspot Showroom

Zoom- und touchfähiges Bild/Grundriss mit editierbaren Hotspots für Räume, Produkte, Materialien oder Behandlungsschritte. Jeder Hotspot kann Medien, Fakten, Preis und CTA enthalten.

**Warum Wow:** Nutzer entdecken Inhalte selbst.
**Warum wertvoll:** ideal für Hotel, Location, Retail, Immobilien, Handwerk und Medizin.

### 5. Verified Trust Ledger

Eine ruhig gestaltete Proof-Section, die Qualifikationen, Zertifikate, Bewertungsquellen, Projektzahlen und Aktualisierungsdatum zusammenführt. Jede Behauptung hat optional eine Quelle.

**Warum Wow:** Daten und Belege werden hochwertig inszeniert.
**Warum wertvoll:** besonders für Medizin, Beratung, Handwerk und hochpreisige Leistungen.

### 6. Case Study Stage

Weiterentwicklung von `beforeAfterStoryPro`: sticky Medienbühne, Kapitel Problem → Entscheidung → Umsetzung → Ergebnis, Vorher/Nachher, echte Kennzahlen und Kundenstimme. Mobile als kompakte Kapitelkarten.

**Warum Wow:** kontrolliertes Scrollytelling mit einem klaren visuellen Peak.
**Warum wertvoll:** verkauft Ergebnis statt Leistungslisten.

### 7. Contextual Mobile Action Dock

Keine normale Section, sondern eine globale optionale Conversion-Leiste. Sie passt sich an den Kontext an: Anrufen, Route, Termin, Warenkorb oder Angebot. Sie erscheint erst nach dem Hero und respektiert Cookie-/Modal-/Checkout-Zustände.

**Warum Wow:** subtile Morph-Transitions und immer passender nächster Schritt.
**Warum wertvoll:** großer Mobile-Conversion-Hebel.

## Weitere Produktmodule

### Content Health

Geplanter oder manueller Scan auf:

- abgelaufene Angebote, Events und Sonderöffnungszeiten
- tote Links, fehlende Alt-Texte und leere Seiten
- widersprüchliche Preise, Adressen und Personen
- doppelte oder sehr ähnliche Texte
- veraltete Reviews und Case-Zahlen
- konkrete Draft-Fixes statt bloßer Warnungen

### Client Approval

Kommentar-Pins direkt in der Preview, Zustände „offen / beantwortet / freigegeben“, Freigabe pro Seite, Audit Trail und gebündelte Änderungsanfrage. Das spart Agenturzeit und macht den Prozess professioneller.

### Website Autopilot

Import aus bestehender Website, Google Business Profile, Dokumenten und freigegebenen Social-Kanälen. Erst Fakteninventar und Quellenprüfung, dann Seitenplan, dann feldweise Generierung. Keine One-shot-Website und keine erfundenen Fakten.

## Empfohlene Reihenfolge

| Phase | Umfang | Umsatz-/UX-Hebel | Aufwand |
|---|---|---:|---:|
| Jetzt | Business Profile, Section Contract 2.0, Publish QA, Page Rhythm | sehr hoch | mittel–hoch |
| Jetzt | Guided Composer mit Art Direction und Gesamtvorschau | sehr hoch | mittel |
| Jetzt | bestehende Hero/Proof/CTA/Preis-Familien aufwerten | hoch | mittel |
| Danach | Conversion Intelligence und Mobile Action Dock | sehr hoch | mittel–hoch |
| Danach | Offer Matcher, Proof Atlas, Outcome Simulator | hoch | mittel je Section |
| Danach | Content Health und Client Approval | hoch | mittel–hoch |
| Später | Website Autopilot und Experimente | sehr hoch | hoch |

## Technische Leitplanken

- Motion nur für gezielte Signature-Interaktionen; Scroll-Progress und Gesten sind vorhanden, aber jede Section braucht Reduced-Motion-Fallbacks.
- View Transitions für Finder, Galerie und Composer-Statewechsel progressiv einsetzen; ohne Support bleibt alles sofort bedienbar.
- React Aria Components für komplexe Picker, Dialoge, Tabs, Comboboxen und Menüs prüfen.
- MapLibre nur für echte Karten-Mehrwerte wie Proof Atlas; keine dekorative 3D-Karte.
- Playwright-Screenshot-Vergleiche als reproduzierbare Quality Gates in derselben CI-Umgebung ausführen.
- Keine große neue FE-Bibliothek ohne Bundle-, Accessibility- und Editor-Folgekosten zu prüfen.
