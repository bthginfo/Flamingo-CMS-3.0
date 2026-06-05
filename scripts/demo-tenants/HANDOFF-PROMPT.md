# Handoff-Prompt für die nächste AI

> Diesen Block 1:1 an die übernehmende AI weiterreichen.

---

Du übernimmst die Befüllung der Flamingo-CMS-Demo-Tenants. Ein Tenant
(`handwerk`) ist bereits vollständig befüllt und live — er dient als
Referenz-Implementierung. Es bleiben **16 Tenants** offen.

## Was du zuerst tust

1. **Lies** `scripts/demo-tenants/README.md` und `scripts/demo-tenants/STATUS.md`.
2. **Sieh dir** `scripts/demo-tenants/handwerk.cjs` an — das ist deine Vorlage.
3. **Wähle den nächsten offenen Tenant** aus `STATUS.md` (oben nach unten).

## Workflow pro Tenant

1. Hol die offizielle, **tenant-spezifische** API-Anweisung:
   ```bash
   node scripts/demo-tenants/fetch-instructions.cjs <tenant>
   ```
   Lies `scripts/demo-tenants/_cache/instructions-<tenant>.txt` vollständig.
   Sie listet u.a. die Pflicht-Pages, die `availableSectionTypes` (inkl. branchen­eigener Sections), Addons (Shop, Booking) und Restriktionen.

2. **Identität entwerfen** (vor dem Code):
   - Firmenname, Stadt/Region, Story (Gründung, Personen, USP)
   - Brand-Palette (Primär + Akzent + Hintergrund-Cremenote) — *anders* als alle bisherigen Tenants
   - Typografie (Heading-Font + Body-Font aus Google Fonts) — *anders* als bisher
   - Tonalität (warm/sachlich/künstlerisch/sportlich…)
   - Bildwelt (welches Unsplash-Motiv-Cluster?)
   - Schreib das kurz als Kopfkommentar ins Tenant-File.

3. **Tenant-File anlegen** nach Vorlage von `handwerk.cjs`:
   ```bash
   cp scripts/demo-tenants/handwerk.cjs scripts/demo-tenants/<tenant>.cjs
   ```
   - PAT aus `fetch-instructions.cjs` übernehmen.
   - **Alle** Inhalte neu schreiben — kein Müller & Söhne 2.0.
   - **Branchen­eigene Sections** bevorzugen (z.B. Restaurant: `reservation`, `menuShowcase`; Hotel: `roomShowcase`, `bookingStrip`; Realestate: `propertySearch`).
   - Mindestens 6 Sections auf der Startseite, 3–5 auf jeder Unterseite, mind. 3 Einträge in jedem Array.
   - Mindestens **eine Collection** mit mind. 3 Items, verlinkt aus `servicesGrid`/`collectionList`.
   - Pflicht-Pages aus den Instructions vollständig (Impressum + Datenschutz immer mit echtem, branchen­spezifischem Text).
   - Collection-Item-Sections **brauchen `id: uuid()`** — siehe `handwerk.cjs`.
   - Bei dunklen Backgrounds **immer** `--token-on-dark-heading/body/muted` in `styleOverrides` setzen. Bei eigenem `--token-btn-bg` immer auch `--token-btn-text`.

4. **Laufen lassen**:
   ```bash
   node scripts/demo-tenants/<tenant>.cjs
   ```
   Der Runner wipt zuerst alten Content, schreibt dann alles neu, ruft `publish` und gibt am Ende `validate` aus.

5. **Validate-Output prüfen**. Wenn `readyToPublish: false` oder es `colorIssues`/`contentIssues` mit severity `error` gibt: Tenant-Spec anpassen, erneut laufen lassen (wipe sorgt für sauberen Re-Run).

6. **Live-Site sichten** unter `https://flamingo-renderer.vercel.app/?tenant=<tenant>` (oder der jeweiligen Tenant-Domain — siehe `existingPages`-Antwort der Instructions).

7. **STATUS.md aktualisieren** (✅ DONE).

8. **Erst dann** den nächsten Tenant beginnen. Niemals zwei Tenants parallel.

## Goldene Regeln

- **Realer Content, keine Floskeln.** Lies das Tenant-File einmal komplett laut vor — wenn es nach AI klingt, schreib es um.
- **Lokale Verankerung.** Stadt nennen, echte Straßen­namen wirken (frei erfunden, aber plausibel), regionale Bezüge.
- **Variation zwischen Tenants.** Keine zwei Tenants teilen Hero-Layout, Section­reihenfolge oder Brand-Familie. Wenn alle bisherigen Tenants eine dunkle Hero haben, mach die nächste hell mit Bild-Split.
- **Keine erfundenen Felder.** Nur Felder aus `sectionDataSchemas` benutzen (siehe Instructions). Unbekannte Felder werden ignoriert.
- **Slugs ohne führendes `/`.** Startseite: `slug: 'startseite'`. Andere: `kontakt`, `ueber-uns`, etc.
- **Footer-Columns nie leer.** Mind. 2 Links pro Column.
- **Navigation muss zu existierenden Slugs zeigen.**
- **Wenn Shop-/Booking-Addon nicht aktiv ist** (Instructions sagen es dir): keine entsprechenden Section-Typen verwenden.

## Tonalitäts­anker je Branche (Vorschlag, gerne abweichen)

- **restaurant**  — sinnlich, kurze Sätze, Produkt-fokussiert (Saison, Herkunft).
- **hotel**       — warm, gastgeberhaft, ortsverliebt.
- **salon**       — selbstbewusst, modisch, ich-Ansprache.
- **tourismus**   — bildreich, geo-spezifisch, einladend.
- **medical**     — sachlich, vertrauensbildend, klar; Datenschutz besonders ernst.
- **wedding**     — emotional, persönlich, kein Kitsch.
- **photography** — visuell-zurückhaltend, Bild im Vordergrund, sparsamer Text.
- **consulting**  — präzise, Outcome-orientiert, Zahlen.
- **realestate**  — sachlich-vertrauensvoll, Markt­kompetenz zeigen.
- **cafe**        — warm, persönlich, kleine Geschichten.
- **tattoo**      — selbst­bewusst, künstlerisch, Stil­richtungen explizit.
- **ecommerce**   — produkt­fokussiert, konversions­orientiert, Vertrauen (Versand, Retouren).
- **retail**      — Sortiments­breite + lokal, Beratung im Vordergrund.
- **florist**     — saisonal, sinnlich, Anlass­bezug.
- **fitness**     — energetisch, du-Ansprache, klare Pakete.
- **location**    — atmosphärisch, kapazitäts­transparent, Buchungs­logik klar.

## Wenn du steckenbleibst

- API-Antwort unklar? → `node -e "console.log(JSON.stringify(require('./scripts/demo-tenants/_cache/instructions-<tenant>.json').sectionDataSchemas.<sectionType>, null, 2))"`
- Validate meckert? → Lies die `contentIssues`/`colorIssues` exakt — sie sagen dir Section-ID, Feld und Grund.
- Section sieht im Frontend leer aus? → Häufigste Ursache: Array-Feld falsch benannt (z.B. `services` statt `manualCards` bei `servicesGrid`). Schema in den Instructions checken.

## Commit-Konvention

Pro abgeschlossenem Tenant ein Commit:
```
feat(demo): fill <tenant> tenant with premium content
```
Wenn du den Runner verbesserst:
```
chore(demo-runner): <was geändert>
```

Viel Erfolg.
