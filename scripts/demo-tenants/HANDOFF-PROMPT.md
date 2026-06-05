# Handoff-Prompt für die nächste AI

> Diesen Block 1:1 an die übernehmende AI weiterreichen.

---

Du übernimmst die Befüllung der Flamingo-CMS-Demo-Tenants. Ein Tenant
(`handwerk` — Müller & Söhne Meisterbetrieb, Köln) ist vollständig befüllt und
live. Er ist deine **Referenz-Implementierung und Qualitätslatte**. Es bleiben
**16 Tenants** offen.

Dein Auftrag in einem Satz: Demos bauen, die ein potenzieller Kunde live sieht
und denkt *„das will ich für meine Branche".* — nicht: „passt schon, lass uns
weitermachen."

---

## 1. Was du zuerst tust (Pflicht-Onboarding)

1. **`scripts/demo-tenants/README.md`** lesen — Architektur, API-Wrapper, Runner.
2. **`scripts/demo-tenants/STATUS.md`** lesen — Tenant-Liste + DoD-Checkliste.
3. **`scripts/demo-tenants/handwerk.cjs`** *vollständig durchlesen* (alle ~1000
   Zeilen). Das ist die Vorlage. Wenn du etwas in deinem Tenant nicht findest,
   was hier drin ist, fehlt es vermutlich.
4. **Live-Site sichten:** `https://flamingo-renderer.vercel.app/?tenant=handwerk`
   — schau dir an, wie das Ergebnis aussehen muss.

---

## 2. Workflow pro Tenant

### Schritt 1 — Instructions ziehen

```bash
node scripts/demo-tenants/fetch-instructions.cjs <tenant>
```

Liest die **tenant-spezifischen** API-Regeln (`/api/v1/instructions`) und legt
sie in `scripts/demo-tenants/_cache/instructions-<tenant>.txt` ab. **Lies die
Datei vollständig.** Sie sagt dir:

- Pflicht-Pages (z.B. Restaurant braucht zwingend `speisekarte`)
- `availableSectionTypes` mit branchen­eigenen Sections (z.B. `reservation`,
  `propertySearch`, `roomShowcase`)
- Aktive Addons (Shop, Booking) — keine Shop-Sections wenn Addon aus
- Section-Daten-Schemas (Pflichtfelder, Array-Item-Strukturen)
- Bestehende Pages/Slugs

### Schritt 2 — Identität entwerfen (BEVOR du Code schreibst)

Schreib das als Kopfkommentar in dein Tenant-File:

- **Firmenname**, Stadt/Region, Story (Gründung, Personen, USP)
- **Brand-Palette:** Primär + Akzent + Section-Hintergrund — bewusst *anders*
  als alle bisherigen Tenants. Check die anderen `.cjs`-Files.
- **Typografie:** Heading + Body aus Google Fonts — *andere* Kombi als bisher
- **Tonalität:** warm/sachlich/künstlerisch/sportlich/sinnlich…
- **Bildwelt:** welches Unsplash-Motiv-Cluster?

### Schritt 3 — Tenant-File anlegen

```bash
cp scripts/demo-tenants/handwerk.cjs scripts/demo-tenants/<tenant>.cjs
```

PAT aus `_cache/instructions-<tenant>.txt` übernehmen. **Dann alles neu
schreiben.** Kein „Müller & Söhne 2.0". Keine Floskeln. Kein AI-Geschwurbel.

### Schritt 4 — Laufen lassen

```bash
node scripts/demo-tenants/<tenant>.cjs
```

Der Runner wipt alten Content, schreibt alles neu, ruft `publish` und gibt
`validate` aus. Bei `readyToPublish: false` oder `contentIssues/colorIssues`
mit severity `error`: Spec anpassen, neu laufen lassen.

### Schritt 5 — Live sichten

`https://flamingo-renderer.vercel.app/?tenant=<tenant>` (oder Tenant-Domain
aus den Instructions). **Pflicht:** *jede* Seite einmal scrollen, *jede*
Section anschauen. Wenn dir etwas auffällt — fixen.

### Schritt 6 — Status aktualisieren

`STATUS.md` auf ✅ DONE. Dann (und nur dann) nächster Tenant.

---

## 3. Qualitäts-Mindeststandard (verbindlich)

### Sektionen-Mindestmenge

| Page-Typ          | Min. Sections | Pflicht-Mix                                                                                  |
| ----------------- | ------------- | -------------------------------------------------------------------------------------------- |
| Startseite        | **12**        | Hero → socialProofBar → Storytelling → servicesGrid → featureShowcase → processSteps → bentoGrid → stats → timeline → statsCounter → testimonials → faq → ctaBand |
| Service-/Listenseite | **6**     | Hero → 1–2 Premium-Sections → collectionList/Grid → Testimonial → CTA                        |
| Über-uns          | **6**         | Hero → textImage → timeline → stats → team (+ values) → ctaBand                              |
| Kontakt           | **4**         | Hero → contact → openingHours/map → CTA                                                      |
| Impressum/DSGVO   | echt          | Volltext, branchen­spezifisch                                                                |

### Premium-Sections sind Pflicht (nicht „nice to have")

Über den ganzen Tenant verteilt müssen vorkommen:

- `bentoGrid` — asymmetrische Tiles, 4–6 Items, `span: '2'` mischen
- `featureShowcase` — Bild + 3–4 Features mit Icon
- `timeline` — historische Meilensteine (Über-uns) oder Prozess (Service-Seite)
- `statsCounter` — animierte KPIs, **max. 4 Items**, Labels kurz (max. ~24 Zeichen, sonst bricht das Layout)
- `comparisonTable` — Pakete/Tarife mit `highlightCol`
- `portfolio` — Projekte/Cases mit Stats
- `socialProofBar` — kleines Vertrauens-Strip nach dem Hero
- (branchen­spezifische Sections aus den Instructions zusätzlich)

### Item-Mindestmengen

- Karten-Arrays (services, processSteps, faq, team-members): **mind. 4 Items**
- Collections: **mind. 3 Items**, mit `id: uuid()` für jede Section
- Footer-Columns: mind. 2 Links pro Column
- Navigation: nur Slugs verlinken, die wirklich existieren

### Bilder

- **Jedes** `image`-Feld gefüllt — kein Default-Platzhalter
- Unsplash-IDs aus dem Helper `img(id)` in `handwerk.cjs` übernehmen oder
  passende neue suchen
- Bild-Themen müssen zur Branche passen (kein Pizza-Bild auf einer Tattoo-Site)

---

## 4. Renderer-Fallstricke (zwingend per Daten umgehen)

Diese Bugs sind **gefixt** (Phase 13), aber gut zu wissen wenn du Symptome siehst:

1. **Tailwind `bg-[var(--token-X)]/N` rendert opak.** Inzwischen überall durch
   `color-mix(in_srgb,var(--token-X)_N%,transparent)` ersetzt. Wenn du in einer
   neuen Section trotzdem solche Klassen schreibst — gleich `color-mix`
   benutzen, nicht das `/N`-Pattern.
2. **Hero `trustItems` ohne `trustStripColor`** rendert auf den meisten
   Templates als helles Kärtchen. Nach Phase 13 ist die Fallback-Variante
   reparariert, aber: **wenn du eine farbige Hero-Variante willst, setz
   `trustStripColor` explizit** (z.B. `'rgba(8,28,42,0.55)'`). Das ist
   robuster als sich auf die Defaults zu verlassen.
3. **Dunkle Section-Backgrounds** brauchen den `darkSectionTokens`-Helper:
   überschreibt *beide* Slot-Sets (`--token-heading` UND `--token-on-dark-*`)
   plus Buttons und Badges. Ohne das werden Headings/Buttons unsichtbar.
   Kopier den Helper aus `handwerk.cjs` (Zeilen ~36–52) in deinen Tenant.
4. **Eigene `--token-btn-bg`** → **immer** auch `--token-btn-text` setzen,
   sonst weiß-auf-weiß.
5. **Collection-Items** werden vom Runner automatisch auf `published: true`
   gesetzt. Nur überschreiben wenn du wirklich einen Draft willst.
6. **statsCounter-Labels**: bei `value` mit `prefix`/`suffix` (z.B. `Ø ` /
   ` €`) bricht der Layout-Block, wenn das Label gleichzeitig lang ist.
   Faustregel: Wenn der Counter eine ungewöhnliche Zahlenform hat, halt das
   Label auf 2–3 Wörter („Förderung pro Heizungssanierung" → „Förderung Ø
   12.500 €" als Wert, oder Label kürzen).

---

## 5. Goldene Regeln (in Stein gemeißelt)

- **Realer Content, keine Floskeln.** Lies dein Tenant-File einmal laut.
  Klingt es nach AI? Schreib es um. Klingt es nach echtem Marketing? Gut.
- **Lokal verankern.** Stadt nennen. Echte (oder plausibel erfundene)
  Straßen­namen. Regionalbezüge in Tonalität und Beispielen.
- **Variation zwischen Tenants.** Keine zwei Tenants teilen Hero-Layout,
  Section-Reihenfolge oder Brand-Familie. Wenn die letzten drei Tenants alle
  dunkle Heros hatten — bau eine helle mit Bild-Split.
- **Keine erfundenen Felder.** Nur Felder aus `sectionDataSchemas` (siehe
  Instructions). Unbekannte Felder werden ignoriert und fehlen dann visuell.
- **Slugs ohne führendes `/`.** Startseite: `slug: 'startseite'`. Andere:
  `kontakt`, `ueber-uns`, etc.
- **Wenn ein Addon nicht aktiv ist** (Instructions sagen es): keine
  entsprechenden Section-Typen verwenden (kein `shopProductGrid` ohne
  Shop-Addon).
- **Niemals zwei Tenants parallel.** Ein Tenant — komplett — live geprüft —
  STATUS.md ✅ — *dann* der nächste.

---

## 6. Tonalitäts-Anker je Branche (Vorschlag, gerne abweichen)

| Branche      | Tonalität                                                                |
| ------------ | ------------------------------------------------------------------------ |
| restaurant   | sinnlich, kurze Sätze, Produkt-fokussiert (Saison, Herkunft)             |
| hotel        | warm, gastgeberhaft, ortsverliebt                                        |
| salon        | selbstbewusst, modisch, ich-Ansprache                                    |
| tourismus    | bildreich, geo-spezifisch, einladend                                     |
| medical      | sachlich, vertrauensbildend, klar — Datenschutz besonders ernst          |
| wedding      | emotional, persönlich, kein Kitsch                                       |
| photography  | visuell-zurückhaltend, Bild im Vordergrund, sparsamer Text               |
| consulting   | präzise, Outcome-orientiert, Zahlen                                      |
| realestate   | sachlich-vertrauensvoll, Markt­kompetenz zeigen                          |
| cafe         | warm, persönlich, kleine Geschichten                                     |
| tattoo       | selbstbewusst, künstlerisch, Stil­richtungen explizit                    |
| ecommerce    | produkt­fokussiert, konversions­orientiert, Vertrauen (Versand, Retouren) |
| retail       | Sortiments­breite + lokal, Beratung im Vordergrund                       |
| florist      | saisonal, sinnlich, Anlass­bezug                                         |
| fitness      | energetisch, du-Ansprache, klare Pakete                                  |
| location     | atmosphärisch, kapazitäts­transparent, Buchungs­logik klar               |

---

## 7. Wenn du steckenbleibst

- **Section-Schema unklar?**
  ```bash
  node -e "console.log(JSON.stringify(require('./scripts/demo-tenants/_cache/instructions-<tenant>.json').sectionDataSchemas.<sectionType>, null, 2))"
  ```
- **`validate` meckert?** Lies die `contentIssues`/`colorIssues` exakt — sie
  sagen dir Section-ID, Feld und Grund.
- **Section sieht im Frontend leer aus?** Häufigste Ursache: Array-Feld falsch
  benannt (z.B. `services` statt `manualCards` bei `servicesGrid`). Schema
  in den Instructions checken.
- **Farb-Bug auf der Live-Site?** Erst checken ob's nicht doch eine fehlende
  `--token-on-dark-*`-Überschreibung ist (siehe §4.3). Wenn ein echter
  Renderer-Bug — flaggen, nicht versuchen renderer-seitig zu fixen
  (separates Reviewer-Pair).

---

## 8. Commit-Konvention

Ein Commit pro abgeschlossenem Tenant:

```
feat(demo): fill <tenant> tenant with premium content
```

Wenn du am Runner/Lib schraubst:

```
chore(demo-runner): <was geändert>
```

Wenn du einen Renderer-Bug data-side umgehst und das dokumentieren willst:

```
fix(demo-<tenant>): work around renderer <bug-name>
```

---

## 9. Definition of Done — Checkliste pro Tenant

- [ ] `fetch-instructions.cjs <tenant>` ausgeführt, Cache gelesen
- [ ] `<tenant>.cjs` angelegt, basierend auf `handwerk.cjs`
- [ ] Identität neu erfunden (Name, Stadt, Geschichte, Persönlichkeit)
- [ ] Brand-Palette + Typografie eigenständig (≠ allen vorherigen Tenants)
- [ ] Bilder themenpassend, jedes `image`-Feld gefüllt
- [ ] **Startseite ≥12 Sections, Unterseiten ≥6**
- [ ] **Mindestens 5 Premium-Sections** (bentoGrid, featureShowcase, timeline,
      statsCounter, comparisonTable, portfolio, socialProofBar) über den Tenant
      verteilt
- [ ] Karten-Arrays haben ≥4 Items, Collections ≥3 Items
- [ ] Pflicht-Pages aus Instructions vollständig
- [ ] Branchen­eigene Sections bevorzugt (z.B. `reservation` im Restaurant)
- [ ] `darkSectionTokens`-Helper bei dunklen Sektionen verwendet
- [ ] Bei eigenem `--token-btn-bg` immer `--token-btn-text` mitgesetzt
- [ ] `node scripts/demo-tenants/<tenant>.cjs` läuft fehlerfrei durch
- [ ] `validate` meldet `readyToPublish: true` (keine `error`-Issues)
- [ ] **Live-Site jede Seite einmal gescrollt + visuell geprüft**
- [ ] Commit erstellt nach Konvention
- [ ] `STATUS.md` auf ✅ DONE

Viel Erfolg.
