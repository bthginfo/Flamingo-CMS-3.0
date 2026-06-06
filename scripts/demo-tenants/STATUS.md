# Demo Tenants — Status

Letzter Stand: siehe Commit-Datum.

| # | Tenant       | Branche                       | Status | Notizen                                          |
|---|--------------|-------------------------------|--------|--------------------------------------------------|
| 1 | handwerk     | SHK-Meisterbetrieb (Köln)     | ✅ DONE | Müller & Söhne — Referenz-Implementierung, 35+ Sections, Premium-Mix |
| 2 | restaurant   | Restaurant                    | ✅ DONE | Trattoria Dal Maestro — 9 Pages, 10 Collection Items, Premium-Mix, Live-Routen geprüft |
| 3 | hotel        | Hotel                         | ✅ DONE | Premium-Demo live geprüft                         |
| 4 | salon        | Friseur / Beauty              | ✅ DONE | Atelier Isabelle — Classic, Premium-Mix, Live-Routen geprüft |
| 5 | tourismus    | Tourismus / Destination       | ✅ DONE | Karwendel Kompass — Classic, Premium-Mix, Branchensections, Live-Routen geprüft |
| 6 | medical      | Arztpraxis                    | ⬜ TODO | Datenschutz besonders sorgfältig                 |
| 7 | wedding      | Hochzeitslocation / -planung  | ⬜ TODO | RSVP-Section nutzen                              |
| 8 | photography  | Fotograf:in                   | ⬜ TODO | Galerie-Sections                                 |
| 9 | consulting   | Beratung                      | ⬜ TODO | LinkedIn-Footer, B2B-Tonalität                   |
|10 | realestate   | Immobilienmakler:in           | ⬜ TODO | propertySearch / Collection                      |
|11 | cafe         | Café                          | ⬜ TODO | Speisekarte als Collection                       |
|12 | tattoo       | Tattoo-Studio                 | ⬜ TODO | Portfolio-Galerie                                |
|13 | ecommerce    | Online-Shop                   | ⬜ TODO | Shop-Addon vermutlich aktiv                      |
|14 | retail       | Stationärer Handel            | ⬜ TODO |                                                  |
|15 | florist      | Floristik                     | ⬜ TODO |                                                  |
|16 | fitness      | Fitness-Studio                | ⬜ TODO | Mitgliederpakete                                 |
|17 | location     | Eventlocation                 | ⬜ TODO | Verfügbarkeits-Kalender                          |

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
- [ ] `node scripts/demo-tenants/<tenant>.cjs` läuft fehlerfrei durch
- [ ] `validate` meldet `readyToPublish: true` (keine `colorIssues`/`contentIssues` mit severity error)
- [ ] Live-Site visuell geprüft
- [ ] STATUS.md auf ✅ DONE gesetzt
