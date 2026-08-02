# Flamingo CMS 3.0 – Repository-, Architektur- und Sicherheits-Audit

Stand: 2. August 2026
Audit-Branch: `codex/audit-critical-hardening`

## 1. Executive Summary

Flamingo CMS 3.0 ist ein umfangreiches Multi-Tenant-CMS mit öffentlichem Renderer, integriertem Admin, Marketing-/CRM-Control-Plane, Shared-Demo-Betrieb und Standalone-Tenants mit eigener Neon-Datenbank. Die Architektur ist grundsätzlich tragfähig, besitzt eine gute Section-Abstraktion und inzwischen belastbare automatisierte Vertragsprüfungen.

Im Audit wurden sieben sicherheits- oder datenintegritätsrelevante P1-Probleme direkt behoben. Dazu gehörten öffentliche Tenant-Selektion über manipulierte Hosts/IDs, Zugriff auf suspendierte Tenants, eine unvollständige Standalone-Datenmigration, nicht atomare Publish-/Rollback-Vorgänge und gespeicherte CSS-Injection. Sechs weitere P2-Probleme bei Tenant-Grenzen, Preview-Konsistenz, Cache-Invalidierung und Prüfscripten wurden ebenfalls korrigiert.

Alle verpflichtenden Qualitätsprüfungen sind grün: 498 Tests, Typecheck, Lint, beide Produktions-Builds, Dependency-Audit, Credential-Audit, Tenant-Crosstalk-Audit sowie sämtliche Section-, Token-, Farb- und Contract-Audits.

Der wichtigste verbleibende Sicherheitskompromiss ist `MASTER_ADMIN_PASSWORD`: Ein einziges Environment-Secret kann weiterhin jeden Tenant-Login überbrücken. Das Verhalten wurde nicht entfernt, weil es ein bestehender Betriebsweg ist. Vor einem größeren Kunden-Rollout sollte es durch zeitlich begrenzte, protokollierte Support-Freigaben ersetzt werden.

Vor Deployment ist Migration `0026_published_snapshot_versions.sql` auf Shared- und allen Standalone-Datenbanken auszuführen.

## 2. Architecture Overview

### Anwendungen

| Bereich | Aufgabe |
|---|---|
| `apps/renderer` | Öffentliche Websites, Admin-CMS, Live-Preview, Content API, Shop-, Booking- und Billing-Oberflächen |
| `apps/marketing` | Flamingo-Marketingseiten, CRM/Control-Plane, Tenant-Provisionierung und Standalone-Datenmigration |
| `apps/admin` | Separater historischer/ergänzender Admin-Bereich; nicht der primäre Tenant-Editor |

### Gemeinsame Pakete

| Paket | Aufgabe |
|---|---|
| `packages/db` | Drizzle-Schema, Neon-Verbindung, Migrationen und 73 Tabellenmodelle |
| `packages/auth` | Passwort-, Session- und Auth-Hilfen |
| `packages/design-tokens` | Semantische Design-Tokens und Farbverträge |
| `packages/schemas` | Gemeinsame Content-/API-Schemata |

### Zentrale Datenflüsse

1. Der Hostname beziehungsweise bei Shared-Demos ein erlaubter Pfad-Slug bestimmt den aktiven Tenant.
2. Der Admin bearbeitet Pages, Sections und Collection Items im Draft-Zustand.
3. Publish erzeugt einen unveränderlichen Snapshot für Pages, Sections und Collections.
4. Der öffentliche Renderer liest den aktiven Snapshot über einen Tenant-Cache-Tag.
5. Navigation, Footer und globale Design-/Tenant-Einstellungen werden derzeit separat live gelesen und nicht im Content-Snapshot versioniert.
6. Shared-Demos und Leads verwenden die Shared-Datenbank. Kunden-Tenants werden als Standalone-Projekt mit eigener Neon-Datenbank provisioniert.

### Externe Abhängigkeiten

- Neon Postgres und Drizzle ORM
- Vercel Deployments, Domains und Environment-Konfiguration
- Vercel Blob für Medien
- SMTP für Formular- und Rechnungsversand
- Stripe für Shop-/Payment-Flows
- Meta/Instagram-Integrationen
- PDF-/E-Rechnungsbibliotheken sowie Three.js für Advanced Sections

## 3. Ausgeführte Commands und Checks

| Prüfung | Ergebnis |
|---|---|
| `pnpm test` | Bestanden: 430 Renderer + 68 Marketing = 498 Tests |
| `pnpm typecheck` | Bestanden: 5 Tasks |
| `pnpm lint` | Bestanden: 2 Tasks |
| `pnpm build` | Bestanden: Marketing und Renderer |
| `pnpm check:tokens` | Bestanden: 5/5 Gates, 240 Templates, 54 Tokens, 3.904 Referenzen |
| `pnpm check:hardcoded-colors` | Bestanden: 62 Referenzen, unter Baseline 209 |
| `pnpm check:section-surface` | Bestanden nach Synchronisation der generierten Defaults |
| `pnpm audit:sections` | Bestanden: 269 Typen, 0 Issues |
| `pnpm audit:section-contracts` | Bestanden: 241 Contracts, 0 Issues |
| `pnpm check:section-colors` | Bestanden: 20 Branchen × 241 Section-Typen, keine Rollengaps |
| `pnpm check:env-contract` | Bestanden: keine fehlenden Build-Environment-Variablen |
| `pnpm audit:credentials` | Bestanden: 1.268 getrackte Dateien geprüft |
| `pnpm audit:crosstalk` | Bestanden |
| `pnpm audit --prod --audit-level high` | Keine bekannten Production-Vulnerabilities |
| `git diff --check` | Bestanden; nur lokale LF/CRLF-Hinweise |

Der erste Build-Lauf scheiterte an einer fehlenden lokalen Next-Binary-Verknüpfung. `pnpm install --frozen-lockfile --prefer-offline` reparierte die Installation; der anschließende vollständige Build war erfolgreich. Ohne `DATABASE_URL` protokollieren Robots-/Sitemap-Erzeugung erwartbare DB-Warnungen, brechen den Build aber nicht ab.

## 4. Findings

### SEC-01 – Manipulierbare öffentliche Tenant-Selektion

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/lib/snapshot.ts`, `apps/renderer/src/lib/public-tenant.ts`, `apps/renderer/src/lib/tenant-host.ts`
- Problem: Unbekannte Produktionshosts und explizite Tenant-UUIDs konnten Daten realer aktiver Tenants auswählen. Ein erratener Slug oder eine bekannte UUID reichte in mehreren öffentlichen Pfaden aus.
- Auswirkung: Potenzieller Cross-Tenant-Datenzugriff, insbesondere in Shared-Renderer-, Shop- und Widget-Flows.
- Fix: Pfadbasierte Auswahl ist auf aktive Shared-/Lead-Shared-Demos beziehungsweise Leads begrenzt. Standalone ist strikt an `FIXED_TENANT_ID` gebunden. Domain-Lookups verlangen einen aktiven Tenant.
- Verifikation: Boundary-Tests, Crosstalk-Audit, vollständige Testsuite.

### SEC-02 – Suspendierte Tenants blieben teilweise erreichbar

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/lib/active-tenant.ts`, `apps/renderer/src/lib/tenant-host.ts`, `apps/renderer/src/lib/public-tenant.ts`
- Problem: Fixed-Tenant-, Domain- und öffentliche Widget-Pfade prüften den Tenant-Status nicht konsistent.
- Auswirkung: Suspendierung war nicht überall wirksam; öffentliche Inhalte oder Funktionen konnten weiter erreichbar bleiben.
- Fix: Gemeinsamer gecachter Active-Tenant-Resolver und aktive Statusprüfung an allen betroffenen Grenzen.
- Verifikation: Public-Tenant- und Admin-Boundary-Tests.

### SEC-03 – Demo-Login-Fallback akzeptierte Nicht-Demos

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/app/admin/demo-login/route.ts`
- Problem: Der Legacy-Fallback orientierte sich an einem demoähnlichen Slug, nicht zwingend an `isDemo`.
- Auswirkung: Unter ungünstigen Datenkonstellationen konnte eine Demo-Session für einen Nicht-Demo-Tenant entstehen.
- Fix: Fallback verlangt `isDemo = true` und aktiven Tenant.
- Verifikation: Admin-Boundary-Tests.

### DATA-01 – Standalone-Migration ließ Billing-Daten aus

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/marketing/src/lib/tenant-data-migration.ts`
- Problem: Fünf tenantbezogene Tabellen fehlten in der Shared→Standalone-Kopie: Payments, Reminders, Recurring Schedules, Recurring Runs und Portal Links.
- Auswirkung: Unvollständige Kundenhistorie und funktionsunfähige Billing-Module nach Umzug.
- Fix: Alle Tabellen in referenziell korrekter Reihenfolge in Export, Import und Verifikation aufgenommen.
- Verifikation: Standalone-Database-Boundary-Tests und vollständige Marketing-Suite.

### DATA-02 – Publish und Rollback waren nicht atomar

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/lib/publish-snapshot.ts`, `apps/renderer/src/app/admin/actions/publish.ts`, `apps/renderer/src/app/api/v1/content/publish/route.ts`
- Problem: Versionsbestimmung, Deaktivierung des alten Snapshots, Aktivierung des neuen Snapshots und Page-Promotion erfolgten in mehreren Statements. Der Neon-HTTP-Fallback war nicht transaktional; parallele Publishes konnten dieselbe Version erzeugen oder einen inkonsistenten aktiven Zustand hinterlassen.
- Auswirkung: Verlorene Publishes, doppelte Versionen, mehr als ein aktiver Snapshot oder teilweise veröffentlichte Inhalte.
- Fix: Ein gemeinsames atomisches CTE-Statement mit tenantbezogenem `pg_advisory_xact_lock`; Publish und Rollback nutzen denselben sicheren Pfad. Unique Index auf `(tenant_id, version)`.
- Verifikation: Publish-Snapshot- und Publish-Flow-Tests, Typecheck, Build.

### SEC-04 – Gespeicherte Style-/CSS-Injection

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/lib/brand-colors.ts`, `apps/renderer/src/lib/design-vars.ts`, `apps/renderer/src/app/[[...slug]]/page.tsx`, `apps/renderer/src/app/admin/settings-actions.ts`
- Problem: Persistierte Farb- und Designwerte konnten ohne ausreichend strikte Syntaxprüfung in CSS-Variablen beziehungsweise ein Style-Element gelangen.
- Auswirkung: Gespeicherte CSS-Manipulation, UI-Defacement und abhängig vom Browserkontext potenziell weitergehende Injection-Folgen.
- Fix: Whitelist der editierbaren Designfelder, strikte Farbvalidierung, normalisierte CSS-Werte und Escaping des Style-Element-Inhalts. Kontrastprobleme bleiben Warnungen und blockieren bewusst nicht das Speichern.
- Verifikation: Brand-, Design- und Section-Style-Tests sowie Farb-/Token-Audits.

### SEC-05 – Shop-Slug-Fallback überschritt Tenant-Grenzen

- Schweregrad: P1
- Status: Behoben
- Evidenz: `apps/renderer/src/app/shop/[slug]/page.tsx`
- Problem: Ein global eindeutiger Produkt-Slug konnte auf einen nicht öffentlich selektierbaren Tenant auflösen.
- Auswirkung: Produktdaten realer Kunden konnten über den Shared Renderer sichtbar werden.
- Fix: Fallback nur für aktive Shared-/Lead-Shared-Demo- oder Lead-Tenants; explizite IDs laufen über den zentralen Public-Tenant-Resolver.
- Verifikation: Public-Tenant-Boundary-Tests.

### SEC-06 – Globales Master-Passwort

- Schweregrad: P1
- Status: Offen / bewusst akzeptierter Betriebsweg
- Evidenz: `apps/renderer/src/app/admin/login/actions.ts`
- Problem: `MASTER_ADMIN_PASSWORD` überbrückt tenantbezogene Passwort-Hashes für jeden Tenant.
- Auswirkung: Ein Leak oder Missbrauch dieses einen Secrets kompromittiert sämtliche Adminbereiche gleichzeitig. Tenantbezogene Rotation begrenzt den Schaden nicht.
- Empfehlung: Durch kurzlebige, tenantbezogene und auditierte Support-Grants ersetzen. Bis dahin Secret strikt nur serverseitig halten, häufig rotieren, Zugriffe protokollieren und in Preview/Development nicht wiederverwenden.

### DATA-03 – Collection Item konnte fremde Collection-ID erhalten

- Schweregrad: P2
- Status: Behoben
- Evidenz: `apps/renderer/src/app/admin/collections/actions.ts`
- Problem: Der Create-Pfad schrieb zwar die Session-Tenant-ID, prüfte aber nicht, ob `collectionId` demselben Tenant gehört.
- Auswirkung: Inkonsistente Fremdschlüsselbeziehungen oder Cross-Tenant-Zuordnungen bei bekannter ID.
- Fix: Vor Insert wird der Besitz der Collection geprüft.
- Verifikation: Neue Actions-Tests.

### UX-01 – Live-Preview wich bei Locale und Section-Root ab

- Schweregrad: P2
- Status: Behoben
- Evidenz: `apps/renderer/src/app/live-preview/page.tsx`, `apps/renderer/src/app/live-preview/client.tsx`, `apps/renderer/src/app/admin/pages/[id]/page-editor.tsx`
- Problem: `defaultLocale` fehlte in der Preview und eine Section konnte doppelte Root-Marker erhalten.
- Auswirkung: Übersetzungs-Fallbacks und direkte Feldbearbeitung konnten vom veröffentlichten Ergebnis abweichen.
- Fix: Locale-Vertrag vollständig durchgereicht und eindeutiger Preview-Section-Wrapper eingeführt.
- Verifikation: Live-Preview-Editability-Tests.

### CACHE-01 – Einstellungen invalidierten öffentliche Caches nicht vollständig

- Schweregrad: P2
- Status: Behoben
- Evidenz: `apps/renderer/src/app/admin/settings-actions.ts`
- Problem: Brand-, Design-, Footer- und weitere globale Saves konnten erfolgreich sein, ohne dass öffentliche Daten unmittelbar neu geladen wurden.
- Auswirkung: Admin und Live-Seite zeigten nach dem Speichern vorübergehend unterschiedliche Zustände.
- Fix: Gemeinsame tenantbezogene Tag- und Root-Layout-Invalidierung nach allen relevanten Settings-Saves.
- Verifikation: Brand-Preview-Save-Tests und Build.

### DATA-04 – Snapshot-Checksumme änderte sich ohne Content-Änderung

- Schweregrad: P2
- Status: Behoben
- Evidenz: `apps/renderer/src/lib/publish-snapshot.ts`
- Problem: `generatedAt` war Teil der Prüfsumme. Jeder Publish wirkte dadurch inhaltlich neu.
- Auswirkung: Unnötige Snapshot-Versionen und Datenbanklast.
- Fix: Kanonisches SHA-256 mit stabiler Key-Reihenfolge und ohne flüchtiges Root-`generatedAt`.
- Verifikation: Publish-Snapshot-Tests.

### QA-01 – Audit-Scripte erzeugten Fehlalarme und Drift

- Schweregrad: P2
- Status: Behoben
- Evidenz: `scripts/check-env-contract.ts`, `scripts/check-section-color-contracts.cjs`
- Problem: Scripts-Verzeichnisse wurden zu breit ausgeschlossen; CRLF/LF-Unterschiede erzeugten Section-Contract-Drift.
- Auswirkung: Echte Environment-Nutzung konnte übersehen werden, während harmlose Zeilenenden CI blockierten.
- Fix: Präzise Ausschlüsse, expliziter Vertrag für Runtime-only-Secrets und semantischer Zeilenvergleich bei Erhalt der Original-Line-Endings.
- Verifikation: Environment-, Section-Surface- und Section-Color-Checks.

### ARCH-01 – Publish versioniert nicht den vollständigen Site-Zustand

- Schweregrad: P2
- Status: Offen / Produktentscheidung
- Evidenz: `apps/renderer/src/lib/snapshot.ts`
- Problem: Pages, Sections und Collections sind atomar versioniert; Navigation, Footer, globale Design-, SEO- und Tenant-Einstellungen werden live separat gelesen.
- Auswirkung: Ein Rollback stellt nicht zwingend exakt die frühere Website wieder her.
- Empfehlung: Entweder den Vertrag ausdrücklich als „Content Publish“ benennen oder einen vollständigen `SiteSnapshot` inklusive Nav, Footer, SEO und Design einführen.

### ARCH-02 – Draft-Fallback bei nie veröffentlichten Tenants

- Schweregrad: P2
- Status: Offen / Legacy-Kompatibilität
- Evidenz: `apps/renderer/src/lib/snapshot.ts`
- Problem: Fehlt ein aktiver Snapshot, rendert die öffentliche Seite den Draft.
- Auswirkung: Ein frisch angelegter oder migrierter Tenant kann unveröffentlichte Änderungen öffentlich zeigen.
- Empfehlung: Neue Tenants mit einem expliziten initialen Snapshot provisionieren und Draft-Fallback nur für markierte Legacy-Tenants erlauben.

### UX-02 – Preview- und Accessibility-Restlücken

- Schweregrad: P3
- Status: Offen
- Problem: Collection-Detail-Drafts werden nicht in allen Preview-Pfaden exakt wie Pages modelliert. Einige komplexe Admin-Modals besitzen noch unvollständige Fokusführung und Dialog-Semantik.
- Empfehlung: Preview-Vertrag mit E2E-Tests pro Collection-Typ ergänzen; Dialoge mit Fokusfalle, Rückgabe des Fokus und Screenreader-Beschriftung vereinheitlichen.

### API-01 – Uneinheitliche Partial-Update-Validierung

- Schweregrad: P2
- Status: Offen
- Problem: Einige PAT-API-Patchpfade validieren vollständige Payloads streng, partielle Updates aber weniger konsistent.
- Auswirkung: Ungültige Zwischenzustände und schlechtere Fehlermeldungen für externe AI-Clients.
- Empfehlung: Pro Ressource ein zentrales Full-/Patch-Schema verwenden und Contract-Tests für unbekannte Felder, leere Werte und Cross-Tenant-IDs ergänzen.

### DOC-01 – Veraltete Repository-Dokumentation

- Schweregrad: P3
- Status: Offen
- Problem: README-Angaben zu Apps und Datenmodell entsprechen nicht mehr vollständig dem aktuellen Stand; einzelne historische Texte besitzen Encoding-Artefakte.
- Empfehlung: Architekturübersicht und Betriebs-/Migrationshandbuch aus diesem Audit ableiten und README aktualisieren.

## 5. CMS Function Matrix

| Funktion | Implementiert | Tenant-Isolation | Preview | Publish/Rollback | Audit-Status |
|---|---:|---:|---:|---:|---|
| Pages | Ja | Ja | Ja | Ja | Grün |
| Sections | Ja, 269 Typen | Ja | Ja | Ja | Grün; Contract-Audits ohne Fehler |
| Navigation | Ja | Ja | Ja | Live, nicht im Snapshot | Gelb |
| Footer | Ja, Varianten und Farben | Ja | Ja | Live, nicht im Snapshot | Gelb |
| Global Settings | Ja | Ja | Teilweise live | Live, nicht im Snapshot | Gelb |
| Design/Themes | Ja | Ja | Ja | Live, nicht im Snapshot | Grün mit Architekturhinweis |
| Collections | Ja | Ja | Ja, Restlücken bei Details | Ja | Grün/Gelb |
| Media | Ja, Vercel Blob | Tenant-Pfade vorhanden | Ja | Referenzen im Snapshot | Grün; weitere Quoten-/Lifecycle-Tests sinnvoll |
| SEO | Ja | Ja | Teilweise | Nicht vollständig im Snapshot | Gelb |
| Live Preview | Ja | Ja | – | – | Grün nach Locale-/Root-Fix |
| Publish | Ja | Ja | – | Atomar | Grün |
| Rollback | Ja | Ja | – | Atomar für Content-Snapshot | Grün/Gelb |
| Forms | Ja | Ja | Ja | Settings live | Grün |
| SMTP/Mail | Ja | Tenant-/Fallback-Konfiguration | Testmöglichkeiten vorhanden | Nicht snapshotbasiert | Grün; Secret-Hygiene beibehalten |
| Consent/Datenschutz | Ja | Ja | Ja | Seiten/Settings getrennt | Gelb; E2E-Abdeckung erweitern |
| Tenant Management | Ja | Control-Plane + Standalone | N/A | Migration/Provisionierung | Grün nach Billing-Migrationsfix |
| Shop | Paid Add-on | Ja | Ja | Daten live/geschäftsbezogen | Grün nach Public-Tenant-Fix |
| Booking | Paid Add-on | Ja | Ja | Daten live/geschäftsbezogen | Grün |
| Billing/CRM | Paid Add-on | Ja | PDF-/UI-Preview | Revisions-/Statusmodell separat | Grün nach Migrationsergänzung |

## 6. Test Gap Analysis

Gut abgedeckt sind Section-Verträge, Token/Farben, Tenant-Grenzen auf Codeebene, Publish-Snapshots, Standalone-Migrationen und zentrale Admin-Actions.

Noch zu ergänzen:

1. Browser-E2E für vollständige Journeys: Login → Edit → Preview → Save → Publish → Rollback.
2. Zwei-Tenant-E2E-Matrix für alle Paid-Module inklusive erratener IDs und Slugs.
3. Parallelitäts-Integrationstest gegen eine reale Neon-Testdatenbank für gleichzeitiges Publish/Rollback.
4. Provisioning-E2E vom CRM bis zur migrierten Standalone-App einschließlich aller Add-on-Tabellen.
5. Visuelle Regressionstests für kritische Sections, Footer-Varianten und mobile Breakpoints.
6. Accessibility-Tests für Dialoge, Drag-and-drop, Live-Editor und komplexe Advanced Sections.
7. API-Contract-Fuzzing für PATCH-/Bulk-Endpunkte und schwächere AI-Clients.
8. Cache-E2E: Settings ändern, publizieren und sofortige Sichtbarkeit auf Root-, Collection- und Detailseiten prüfen.

## 7. Technical Debt

- Content-Snapshot und globale Site-Einstellungen besitzen unterschiedliche Lebenszyklen.
- Das globale Master-Passwort ist ein hoher operativer Single Point of Failure.
- Historische Legacy-Fallbacks erschweren klare Draft-/Publish-Garantien.
- Renderer und Admin teilen sehr große Section-Kataloge; Generatoren und Audits halten sie synchron, erhöhen aber Änderungsaufwand.
- Einige Admin-Bereiche verwenden noch unterschiedliche Formular- und Dialogmuster.
- Build-Zeit-Routen protokollieren ohne Datenbank erwartbare, aber störende Warnungen.
- README und Betriebsdokumentation sind gegenüber Implementierung und Schema zurückgefallen.

## 8. Prioritized Action Plan

### Sofort vor Deployment

1. Migration `0026_published_snapshot_versions.sql` auf Shared- und allen Standalone-Datenbanken ausführen.
2. Branch deployen und Smoke-Tests für einen Shared-Demo-, einen aktiven Standalone- und einen suspendierten Tenant durchführen.
3. Parallel-Publish und Rollback einmal gegen die produktionsnahe Neon-Umgebung testen.

### Nächster Security-Sprint

1. `MASTER_ADMIN_PASSWORD` durch auditierte, kurzlebige Support-Grants ersetzen.
2. Full-vs-Patch-Validierung der Content API vereinheitlichen.
3. Provisioning- und Cross-Tenant-E2E-Suite ergänzen.

### Nächster Produkt-/Architektur-Sprint

1. Entscheidung „Content Snapshot“ versus „Full Site Snapshot“ treffen.
2. Draft-Fallback für neue Tenants entfernen und initialen Snapshot provisionieren.
3. Collection-Detail-Preview und Rollback-Vertrag vervollständigen.
4. Admin-Dialoge und Formulare auf ein gemeinsames Accessibility-/UX-Muster bringen.

## 9. Changes

- Öffentliche Tenant-Auflösung und Suspendierungsgrenzen gehärtet.
- Demo-Login, Shop und Widgets gegen Cross-Tenant-Selektion abgesichert.
- Standalone-Migration um sämtliche fehlenden Billing-Tabellen ergänzt.
- Atomaren Publish-/Rollback-Service mit Advisory Lock und eindeutigen Versionen eingeführt.
- Snapshot-Prüfsumme kanonisiert und unveränderte Publishes dedupliziert.
- Brand-/Design-Eingaben validiert, CSS-Ausgabe gehärtet und öffentliche Cache-Invalidierung vereinheitlicht.
- Collection-Ownership beim Erstellen geprüft.
- Live-Preview für Locale und Section-Root-Vertrag korrigiert.
- Environment-, Section-Surface- und Color-Audit-Scripte stabilisiert.
- Neue Regressionstests für alle genannten Grenzen ergänzt.

## 10. Final Status

| Gate | Status |
|---|---|
| Lint | Bestanden |
| Typecheck | Bestanden |
| Unit-/Contract-Tests | Bestanden, 498/498 |
| Production Build | Bestanden, beide Apps |
| Dependency Audit | Bestanden, keine bekannten Production-Vulnerabilities |
| Credential Audit | Bestanden |
| Tenant Crosstalk Audit | Bestanden |
| Section-/Token-/Color-Audits | Bestanden |
| Kritische P1-Fixes | Implementiert und getestet |
| Offene P1-Risiken | 1: globales Master-Passwort, bewusst nicht entfernt |
| Deployment-Voraussetzung | Migration 0026 auf allen Tenant-Datenbanken |

Gesamturteil: Der Branch ist nach Migration und produktionsnahem Smoke-Test für ein kontrolliertes Deployment geeignet. Für einen breiteren Enterprise-Rollout sollten Master-Passwort und Full-Site-Rollback-Vertrag vorher geklärt werden.
