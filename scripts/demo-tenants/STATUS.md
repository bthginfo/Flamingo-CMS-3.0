# Demo Tenants — Status

Letzter Stand: siehe Commit-Datum. `pnpm audit:demos` prüft alle Quellen
schreibfrei. `✅ SOURCE` bedeutet nicht automatisch, dass die geänderte Quelle
bereits erneut in den Live-Tenant eingespielt wurde.

| # | Renderer-Slug | Population-Quelle | Persona / Ort | Status |
|---|---------------|-------------------|---------------|--------|
| 1 | handwerk | `handwerk.cjs` | Brüggemann Bäder & Wärme · Düsseldorf | ✅ SOURCE |
| 2 | hotel | `hotel.cjs` | Alpenglow Resort & Spa · Seefeld | ✅ SOURCE |
| 3 | restaurant | `restaurant.cjs` | Salzkorn · Hamburg | ✅ SOURCE |
| 4 | medical | `medical.cjs` | Praxis am Stadtgarten · Stuttgart | ✅ SOURCE |
| 5 | salon | `salon.cjs` | Atelier Isabelle · München | ✅ SOURCE |
| 6 | tourism | `tourismus.cjs` | Karwendel Kompass · Mittenwald | ✅ SOURCE |
| 7 | wedding | `wedding.cjs` | Mara & Elias · Starnberg | ✅ SOURCE |
| 8 | photography | `photography.cjs` | Lisa Morgenthaler Fotografie · Frankfurt | ✅ SOURCE |
| 9 | consulting | `populate-consulting-bergmann.mjs` | Bergmann & Partner Beratung · München | ✅ SOURCE |
|10 | realestate | `realestate.cjs` | Stadtkante Immobilien · Nürnberg | ✅ SOURCE |
|11 | cafe | `cafe.cjs` | SPIRAL Coffee & Plants · Innsbruck | ✅ SOURCE |
|12 | tattoo | `tattoo.cjs` | INK DISTRICT · Berlin | ✅ SOURCE |
|13 | shop | `ecommerce.cjs` | Vinothek Goldberg · München | ✅ SOURCE |
|14 | retail | `retail.cjs` | Möbelhaus Lichtblick · Regensburg | ✅ SOURCE |
|15 | florist | `populate-florist-bluetenwerk.mjs` | Blütenwerk Atelier · München | ✅ SOURCE |
|16 | fitness | `populate-fitness-pulse.mjs` | Pulse Studio · München | ✅ SOURCE |
|17 | location | `populate-location-lichtwerk.mjs` | Lichtwerk Loft · Ingolstadt | ✅ SOURCE |
|18 | eishockey | `eishockey.cjs` | EHC Donau Panther · Ingolstadt | ✅ SOURCE |

## Definition of Done pro Tenant

- [ ] `fetch-instructions.cjs <tenant>` ausgeführt und `_cache/instructions-<tenant>.txt` gelesen
- [ ] `<tenant>.cjs` angelegt, basierend auf `handwerk.cjs`
- [ ] **Identität neu erfunden** (Name, Stadt, Geschichte, Persönlichkeit) — kein Müller & Söhne 2.0
- [ ] **Brand-Palette eigenständig** (andere Primär/Akzent als alle vorherigen Tenants)
- [ ] **Typografie eigenständig** (andere Heading/Body-Fonts)
- [ ] **Bilder eigenständig** (eigene Unsplash-Auswahl, themenspezifisch)
- [ ] Pflicht-Pages aus den Instructions vollständig
- [ ] Mindestens **eine Kollektion** mit mind. 3 Items, sinnvoll genutzt in `servicesGrid`/`collectionList`
- [ ] Branchen­eigene Sections bevorzugt (z.B. `reservation` statt `contact` im Restaurant)
- [ ] Alle Pflicht­felder gefüllt, mind. 3 Einträge in Array-Feldern
- [ ] **Mindestens 12 Sections auf der Startseite, 6 auf jeder Unterseite** (Premium-Mix Pflicht: bentoGrid, featureShowcase, timeline, statsCounter, comparisonTable, portfolio, socialProofBar irgendwo verteilt)
- [ ] Mindestens 4 Items pro Karten-Array (services, processSteps, faq, etc.)
- [ ] Bei `trustItems` im Hero: `trustStripColor` gesetzt (sonst weiß-auf-weiß-Bug)
- [ ] WCAG-Kontrast geprüft (`--token-on-dark-*` bei dunklen Sektionen, `darkSectionTokens`-Helper benutzen)
- [ ] `pnpm audit:demos` läuft mit 18 Quellen und 0 Issues durch
- [ ] `node scripts/demo-tenants/run-all.cjs --dry-run <tenant>` läuft fehlerfrei
- [ ] Population ausschließlich mit expliziter `PAT_<TENANT>`-Env-Variable
- [ ] `validate` meldet `readyToPublish: true` (keine `colorIssues`/`contentIssues` mit severity error)
- [ ] Live-Site visuell geprüft
- [ ] STATUS.md auf ✅ DONE gesetzt
