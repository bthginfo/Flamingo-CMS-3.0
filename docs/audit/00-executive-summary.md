# Flamingo CMS — Executive Audit Summary

Stand: 11. Juli 2026, Commit `2b2d26a7` (`origin/main`).

## Audit-Navigation

| Dokument | Inhalt |
|---|---|
| [00 Executive Summary](00-executive-summary.md) | Produkturteil, Top Findings, 30/60/90 |
| [01 Architektur und Codebase](01-architecture-and-codebase.md) | Systeme, Daten-/Publish-Flows, Autoritäten |
| [02 Bugs und Risiken](02-bugs-and-risks.md) | F-001–F-041, Evidenz und Testmatrix |
| [03 Admin UX](03-admin-ux-review.md) | 22 Journeys, IA, Mobile, Accessibility |
| [04 Section-Inventar](04-section-inventory.md) | 222 Typen, 553 Owner-Definitionen, Felder/Media/CTA/Komponenten |
| [05 Section-Qualitätsmatrix](05-section-quality-matrix.md) | 222 Einzelbewertungen, 271 Renderer-Varianten/3.794 Extremzustände plus 832 Production-Route-Viewports |
| [06 Design System](06-design-system.md) | Token-/Color-/Surface-Audit und Migration |
| [07 Performance, Security, Reliability](07-performance-security-reliability.md) | Messwerte und Security Coverage |
| [08 Product Opportunities](08-product-opportunities.md) | Chancen, AI API, Branchen-/Demo-Strategie |
| [09 Roadmap](09-implementation-roadmap.md) | Phase A–D, Akzeptanzkriterien, erster Batch |
| [10 Verification Log](10-verification-log.md) | Commands, Browserrouten, Grenzen |
| [Evidence Manifest](evidence/README.md) | portable Screenshots, Hashes, Production-Route- und Extreme-State-Matrix |

## Was Flamingo CMS ist

Flamingo CMS ist bereits eine umfangreiche Multi-Tenant-Website-Plattform für lokale Unternehmen: öffentlicher Renderer, integrierter Admin, Section Builder, Live Preview, Draft/Publish/Rollback, Media, Collections, Formulare, SEO, Booking, Shop, Demo-Tenants und eine PAT-basierte Content-/AI-API. Der Kern liegt in `apps/renderer`; `apps/marketing` enthält die Flamingo-Media-Website und CRM-nahe Funktionen. Neon Postgres, Drizzle, Next.js/React, Vercel Blob und wiederverwendbare Section Contracts bilden das technische Fundament.

Branchen sind in der tatsächlichen Architektur keine notwendige Systemgrenze. Tenant, Capabilities, Content und `definitionKey` sind grundsätzlich branchenunabhängig. Branchen sollten künftig hochwertige Demo-, Content- und Onboarding-Rezepte sein; technische Differenzierung sollte über Fähigkeiten wie Booking, Shop, Portfolio oder Events erfolgen.

## Gesamtbewertung

**Starkes Fundament, aber noch nicht sicher und vorhersehbar genug für bezahlten Self-Service.** Builds, Typechecks, 135 Unit-Tests, 36 Live-Demo-Smokes, Dependency-Audit und mehrere Token-/Security-Gates sind grün. Snapshot Publishing, Section Contracts, Tenant-Scoping in vielen Queries, HTML-Sanitizing, Crash Recovery und die Side-by-side Preview sind gute Bausteine.

Dem stehen zwei P0-Risiken gegenüber: persistente Demo-Writes sind direkt bestätigt; das öffentliche Mail-Relay ist bei aktivem Production-SMTP hochkonfident. Hinzu kommen ein möglicher Draft-Leak bei Snapshot-Fehlern, eine Tenant-Isolation-Lücke, ein reproduzierbarer Live-Admin-Crash und uneinheitliche Save-/Publish-Semantik. Optisch sind die Demos brauchbar, aber in der separaten 17-Tenant-Portfolio-Stichprobe **ohne** Handwerk folgen 15 Einstiege fast derselben Dramaturgie; Handwerk wurde zusätzlich tiefer geprüft. Die Library ist mit 222 kanonischen Section-Typen breit. Ein audit-only Storybook-Harness hat alle 553 registrierten Definitionen auf 271 tatsächlich unterschiedliche `(type, component)`-Renderer-Varianten verdichtet und 3.794 Zustände ohne Hard Failure gerendert. Derselbe Lauf belegt jedoch reale Resilienz-, Missing-Media-, Kontrast- und Wiederholungsprobleme. Die separate Production-Route-Matrix mit 208 Typen und 832 Viewports bleibt für Next-/RSC-/Hydration-Verhalten autoritativ.

**Produkturteil:** Kein kompletter Neubau nötig. Zuerst Sicherheits- und Zustandsverträge schließen, danach Admin-Vertrauen und Design Tokens stabilisieren. Premium-Qualität entsteht dann cohortweise aus wenigen exzellenten Section-Familien, starken Demo-Stories und automatisierten Qualitätsguardrails — nicht aus noch mehr Varianten.

## Stärkste Teile

- Immutable Snapshot- und Publish-History-Grundmodell mit Checksums, Rollback und Cache Tags.
- Multi-Tenant-Datenmodell mit weitgehend konsequenten `tenantId`-Filtern und sinnvollen Unique-Indizes.
- 222 renderbare Section-Typen, 553 registrierte Owner-Definitionen, stabile `definitionKey`/`schemaVersion`-Identität und umfangreiche Previewdaten.
- 271 sinnvolle Renderer-Varianten bestehen 3.794 audit-only Storybook-Zustände ohne Route-Load-/Hard-Render-Ausfall; die Production-Route-Matrix ergänzt 832 echte Viewport-Renders samt Hydration-Evidenz.
- Gute technische Baseline: Production Builds, Typechecks, Unit Tests, Sanitizer-/Contrast-/Token-Tests und keine bekannte Production-Dependency-Advisory.
- Admin-Side-by-side Preview sowie BeforeUnload und 24-Stunden-LocalStorage-Recovery als starke UX-Bausteine.
- Funktionsbreite: Pages, Collections, Media, Forms, Booking, Shop, SEO, Demos und AI API in einem konsistenten Tenant-Modell.

## Top Ten Findings

| Rang | Prio | Finding | Warum es zählt |
|---:|---|---|---|
| 1 | P0 | **Der im Task-Verlauf geteilte Vercel-PAT ist kompromittiert** | Token sofort widerrufen und Aktivität prüfen; Repository-Scan deckt Chat-Exposition nicht ab |
| 2 | P0 | **Öffentliche Marketing-Route ist bei aktivem SMTP ein frei parametrierbares Relay** | Beliebige Empfänger, Betreff, Inhalt und Attachment können ohne Auth an Plattform-SMTP übergeben werden |
| 3 | P0 | **Öffentliche Demo-Sessions können viele echte Mutationen auslösen** | Rolle `demo` wird von zahlreichen Server Actions wie Admin akzeptiert; Media Delete kann physisch und irreversibel sein |
| 4 | P1 | **Snapshot-Fehler fallen auf Draft-Tabellen zurück** | Ein Query-/Providerfehler kann unveröffentlichten Inhalt öffentlich machen; Public muss fail-closed sein |
| 5 | P1 | **Reservation-Update fehlt Tenant-Prädikat** | Eine bekannte fremde UUID kann tenantübergreifend mutiert werden; bestätigter Isolation-Vertragsbruch |
| 6 | P1 | **Publishing läuft mit dem konfigurierten Neon-HTTP-Treiber nicht vollständig transaktional** | Snapshot, Page Status und History können bei Teilfehlern auseinanderlaufen; Admin und PAT duplizieren Logik |
| 7 | P1 | **Realer `/admin/pages`-Flow crasht nach Demo-Login** | Kernjourney endet reproduzierbar in RSC Error Boundary, Digest `1429267296`; Retry erfolglos |
| 8 | P1/P2 | **Editor meldet bei optimistischen Mutationen zu früh Erfolg** | Add/Delete/Reorder schreiben sofort, ohne konsistente Rollbacks; Save-Zustand ist zwischen Text, Farbe und Struktur unterschiedlich |
| 9 | P1 | **Color-/Surface-Tokenvertrag driftet und rendert Preview/Demo/Public unterschiedlich** | Zwei Main-Branch-Gates scheitern; `sectionBgAlt`-Fallback und Demo-Font/Design-Lücken erzeugen reale Timeline-/Kontrastfehler |
| 10 | P1/P2 | **Section- und Demo-Qualität wird von grünen Smokes nicht geschützt** | 36/36 Smokes und 3.794/3.794 Storybook-Zustände laufen ohne Hard Failure trotz sichtbarer Fehler; Expanded-Content erzeugt Overflow in acht Renderer-Familien, Missing-Media-Stress gebrochene Bilder in 13 Varianten |

Details und Evidenz: `02-bugs-and-risks.md`, `07-performance-security-reliability.md`, `10-verification-log.md`.

## Fünf höchste UX-/Produktchancen

1. **Quality Copilot:** deterministische Site-Health-Checks plus kontrollierte AI-Vorschläge, Preview und Freigabe. Macht Websitequalität zum wiederkehrenden Produktnutzen.
2. **Goal-based Page Composer:** Nutzer wählen Geschäftsziel; das CMS schlägt einen begründeten Seitenplan statt 205 Section-Typen vor.
3. **Safe Publish Review:** Inhaltsdiff, responsive Screenshots, Link/Media/SEO/Contrast-Checks und garantierter Rollback vor dem Livegang.
4. **AI Site Plan API:** discover -> propose -> validate -> dry-run -> apply, mit engen Schemas, feldgenauen Fehlern, idempotenten Writes, PAT-Scopes und separatem Publish-Approval. So liefern auch schwächere Modelle gute Ergebnisse.
5. **Premium Demo Recipes:** sechs Experience-Familien und je Tenant eine eigene Conversion-Story, Seitendramaturgie, Bildwelt und sichtbare Business-Funktion.

Danach: Responsive Compare, Media Focal/Crop/Usage Intelligence, Guided Booking/Shop Setup, wiederverwendbare Business Objects und datenschutzarme Section-Analytics.

## Fünf wichtigste Section-System-Verbesserungen

1. **Semantische Token reparieren:** `base`, `alt`, `inverse`, `accent` und Surface/Text/Border-Rollen trennen; sichere Contrast States; identische Fonts/Tokens in Preview, Demo und Public.
2. **Hero-Familie konsolidieren und neu gestalten:** sichtbare CTA-Hierarchie, robuste Bild-Safe-Zones/Focal Points, Long-copy-Resilienz und wenige wirklich unterschiedliche Art Directions.
3. **FAQ-Familie neu rhythmisieren:** kein künstlicher Leerraum, zugängliches Accordion, Kategorien/Progressive Disclosure und optionaler Kontakt-Escalation-Pfad.
4. **Timeline/Process neu bauen:** sichtbare semantische Achse, kompakter Rhythmus, mobile Chronologie und robuste Zustände für 1/2/odd/many Items.
5. **Cohort-basierte Primitives + Visual Gate:** Heading/Container/CTA/Media/List/Rail standardisieren und jede Cohort mindestens gegen Default, 1/2/odd/9 Items, Long Copy, Missing/Portrait/Landscape/Low-quality Media, Light/Dark, Reduced Motion, Tastatur und Zoom-Proxy bei 390/430/1.024/1.440 prüfen.

Höchster Hebel nach Hero/FAQ/Timeline: Testimonials, Service/Feature Cards, Gallery/Before-after, Contact/CTA und Booking/Commerce Forms.

## Sofortige Aktionen

1. Den im Task-Verlauf geteilten Vercel-PAT sofort widerrufen, Aktivität prüfen und nur bei Bedarf least-privilege ersetzen; Wert nirgendwo erneut ausgeben.
2. Freie Mailroute schließen und SMTP-Zugänge bei verdächtiger Aktivität rotieren.
3. Demo-Rolle zentral von irreversiblen/systemweiten Writes sperren.
4. Public Snapshot Read fail-closed machen; Tenant-Prädikat für Reservation Update ergänzen.
5. Ursache des Live-Admin-RSC-Crashs mit Runtime-Logs isolieren und als Regressionstest fixieren.
6. Nicht-transaktionalen Publish-Fallback entfernen und Admin/PAT auf einen kanonischen Service führen.
7. Phantom-Admin-Build im CI ersetzen und Critical Browser Tests sowie beide Section-Gates verpflichtend machen.
8. Bis zur Stabilisierung keine breite Section-Neuentwicklung oder zusätzliche UI-Library einführen.

## 30 / 60 / 90 Tage

### In 30 Tagen

- betriebliche Token-Exposition und beide Produkt-P0s geschlossen; Snapshot-Fail-open und Reservation-Isolation behoben;
- RSC-Admin-Crash behoben;
- reale CI-Gates mit kritischen Auth/Tenant/Publish-Smokes;
- atomarer Publish-Service in Integration;
- finaler Token-/Surface-Vertrag und Baselines für Hero, FAQ, Timeline.

### In 60 Tagen

- kanonischer atomarer Publish-/Rollback-Workflow produktionsreif;
- einheitlicher Save-/Revision-/Conflict-Status im Editor;
- Admin-IA und mobile Overlayprobleme behoben;
- Tokenmigration abgeschlossen;
- Hero, FAQ und Timeline cohortweise neu ausgeliefert und visuell gegatet.

### In 90 Tagen

- zielorientierter Section Picker, sichere Media Lifecycle UX und Accessibility Baseline;
- nächste High-impact Cohorts auf Qualitätsniveau >=4/5;
- sechs klar unterschiedliche Demo-Familien mit starkem Content;
- Quality Copilot v1 mit deterministischen Checks als Beta;
- Goal-based Composer/AI-API als validierter Plan, Contract-Prototyp und Small-model-Eval-Corpus; produktive Pilotierung erst nach dem 90-Tage-Fundament.

## Freizugebender erster Batch

Der empfohlene erste Batch ist bewusst klein, unabhängig reviewbar und auf Sofort-Containment begrenzt:

- exponierten Vercel-PAT widerrufen und Aktivität prüfen;
- freie `send-lead-email`-Parameter entfernen und Route im Handler authentifizieren/zweckbinden oder bis dahin deaktivieren;
- öffentliches `/admin/demo-login` default-off schalten und dieselbe Sperre bei der Session-Verifikation erzwingen, sodass auch bereits ausgestellte Demo-JWTs abgewiesen werden; öffentliche Tenant-Demos bleiben online;
- Reservation Update mit `id + tenantId` scopen, Status allowlisten und affected-row prüfen;
- fokussierte Route-, Demo-Login- und Zwei-Tenant-Regressionstests.

Keine Schema-Migration, UI-Neugestaltung oder neue Production Dependency. Capability-Migration und Snapshot-Backfill bleiben getrennte Folgebatches. Exakte Akzeptanzkriterien stehen in `09-implementation-roadmap.md`.
