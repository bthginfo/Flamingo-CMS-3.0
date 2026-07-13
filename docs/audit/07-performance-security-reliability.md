# Performance, Security und Reliability

## Executive Risk Summary

Der Dependency- und Basis-Hardening-Stand ist besser als die UI-Bugs vermuten lassen: keine bekannten Production-Dependency-Advisories, credential literal scan grün, HTML-Sanitizer und Contrast-/Token-Tests vorhanden, Stripe-Signaturen tenantgebunden, Upload-Overwrite verhindert und viele Queries korrekt tenantgescoped.

Vor einem bezahlten Produktlaunch müssen dennoch zwei P0s geschlossen werden: die öffentliche Mail-Relay-API und irreversible Writes aus öffentlichen Demo-Sessions. Danach folgen fail-closed Publishing, der Reservation-Tenant-Filter, reale Admin-Stabilität und CI-Browsercoverage.

## Security — bestätigte Befunde

| Bereich | Positiv | Risiko | Priorität |
|---|---|---|---|
| Marketing Mail | SMTP Secrets serverseitig; Empfängerformat validiert | Unauthentifizierte Route erlaubt beliebige Empfänger/Inhalte/Attachments | P0 |
| Admin Auth | bcrypt 12, HS256 exp, HttpOnly/Secure/SameSite, IP-Throttle | Globales Master-Passwort für jeden Tenant; Rate-Limit nur Instanz; keine MFA/Userrollen | P1/P2 |
| Demo Auth | Rolle `demo`, 1h TTL, Publish/Upload teilweise gesperrt | Viele Server Actions akzeptieren Demo wie Admin; Media Delete ist irreversibel | P0 |
| Tenant Isolation | Mehrzahl der CRUD-Queries nutzt `and(id, tenantId)` | Reservation-Status update nur per ID; Policy nicht zentral erzwungen | P1 |
| PAT API | Tokens gehasht, widerrufbar, Ablauf, Tenant active check | Vollzugriff ohne Scopes/Quotas; Publish/Delete nicht approval-gated | P2 |
| Rich Text | Allowlist-Sanitizer mit Security-Tests | Neue Renderpfade müssen Sanitizer-Invariant einhalten | Hardening |
| Upload | 10 MB, image allowlist, random suffix, no overwrite, Tenant Payload | API-Upload ohne Magic-Byte/Re-encode; öffentliche Blobs; Demo Delete | P2/P0 |
| Stripe | Signatur mit tenant-spezifischem Secret; metadata/order tenant check | Live-Replay/Concurrent webhook nicht E2E-verifiziert | Hardening |
| PayPal | Server capture, Reference/Amount/Currency Check, Idempotency guard | Providerfehler/Timeout/Recovery nicht live verifiziert | Hardening |
| SumUp | Status serverseitig abgefragt | Kein sichtbarer Amount/Currency/Reference Check | Möglich/P2 |
| Forms | Size limit, honeypot, validation, HTML escape, rate limit | Distributed Spam-Limit unvollständig; Retention/Deletion nicht produktisiert | P2 |
| Instagram | Callback/status/deletion routes vorhanden | Token-Rotation/Provider-Ausfall/Privacy-Workflow nicht live geprüft | Unverifiziert |

### Security-Coverage-Status

„Kein bestätigter Befund“ ist keine Entwarnung; es bedeutet nur, dass im statischen Audit kein konkreter Exploitpfad belegt wurde.

| Kontrollbereich | Status | Evidenz / Restlücke |
|---|---|---|
| Authentication/Session | geprüft, Findings | Demo-Rolle, Master-Passwort, instanzlokales Rate Limit und fehlende Revocation; Cookieflags grundsätzlich vorhanden |
| Authorization/Tenant IDOR | geprüft, Findings | Reservation-Write und Demo-Mutationen bestätigt; kein zentrales invariant erzwingendes Repository/Capability Gate |
| CSRF | teilweise/unverifiziert | SameSite-Cookies und Next Server Actions vorhanden; kein dokumentierter Origin-/CSRF-Vertrag für alle Route Handlers, Demo-Cookie ist `SameSite=None` |
| XSS/Rich Text | geprüft, kein neuer Exploit bestätigt | Allowlist-Sanitizer und Tests vorhanden; neue/raw embed/JSON-LD-Pfade müssen im Sink-Inventar bleiben |
| SQL/Command Injection | geprüft, kein bestätigter Befund | Drizzle/parametrisierte SQL in Kernpfaden; Raw-SQL-/Script-Inventar nicht dynamisch gefuzzt |
| SSRF | teilweise, kein bestätigter Befund | kein generischer beliebiger Server-Fetch in geprüften Kernpfaden belegt; Provider-/Webhook-/Media-URL-Pfade benötigen Allowlist-/DNS-Rebinding-Tests |
| File Upload/MIME | geprüft, Finding | Größe/Extension/MIME vorhanden; API-Pfad ohne Magic-byte/Decode/Re-encode |
| Path Traversal | statisch geprüft, kein bestätigter Befund | Random/tenantbezogene Blobpfade; keine nutzergesteuerte lokale Dateipfadoperation im Runtime-Kern belegt |
| Open Redirect | teilweise geprüft | Demo `next` auf `/admin` begrenzt; Login/Checkout/Provider-Callbacks nicht als vollständiges Redirect-Inventar gefuzzt |
| CORS | unverified deployment contract | keine zentral dokumentierte permissive CORS-Policy gefunden; effektive Vercel-/Route-Header nicht vollständig gemessen |
| Security Headers/CSP | unverifiziert | kein belegter zentraler Headervertrag oder automatisierter Test für CSP, HSTS, frame-ancestors, Referrer-/Permissions-Policy |
| Session Fixation/Revocation | Hardening-Lücke | signierte JWTs/Overwrite vorhanden; keine serverseitige Sessionversion, Geräte-/Tokenrevocation oder Passwortwechsel-Invalidierung |
| Webhook Authenticity/Replay | teilweise geprüft | Stripe stark, PayPal plausibel, SumUp Amount/Reference-Lücke; Provider-Sandbox/Concurrency offen |
| Secrets | bestätigter externer Incident | Repo-Scan grün, aber im Task-Kontext geteilter Vercel-PAT muss widerrufen und Aktivität geprüft werden |
| Privacy/Deletion | Lücke | PII-Flächen inventarisiert; keine durchgängige Retention/DSAR/Deletion-Saga; `audit_log` ungenutzt |

## Auth-/Session-Hardening

1. `getSession` nur für Reads; Mutationen benötigen explizite Capability.
2. Tenant-/Platform-Admin als echte Identities mit MFA, Rotation und Audit Trail statt globalem Master-Passwort.
3. Distributed Rate Limits für Login, Demo, Contact, Booking, RSVP, Checkout und PAT.
4. Session Revocation/Password-change invalidation; JWT enthält derzeit keine Session-/Token-Version.
5. CSP, HSTS, frame-ancestors und weitere Security Headers als automatisierter Route-Test prüfen. Im Audit wurde kein zentraler, dokumentierter Header-Vertrag belegt.

## Privacy

Personenbezogene Daten liegen in Form Submissions, Reservations, RSVP, Booking Customers/Requests, Orders/Customers, Leads und CRM. Schema und UI enthalten Status/Archive, aber keine durchgängige Retention-/Export-/Deletion-State-Machine. `audit_log` existiert nur als Tabelle ohne aktive Schreiber.

Empfehlung:

- Retention pro Datentyp und Tenant;
- DSAR Export/Delete mit referenzieller Prüfung;
- Payment-/Invoice-Aufbewahrung getrennt von Marketingdaten;
- PII-redacted Logs;
- Consent-Version und Script-Kategorien als nachvollziehbare Historie;
- Media Usage Graph vor Delete.

## Performance — Messungen

### Production Builds

| Oberfläche | Messwert |
|---|---:|
| Renderer shared JS | 102 kB |
| Public Tenant Page First Load | ca. 496 kB |
| Demo Tenant Page First Load | ca. 500 kB |
| Page Editor First Load | ca. 818 kB |
| Collection Item Editor First Load | ca. 610 kB |
| Marketing Home/Kontakt/Preise First Load | ca. 223 kB |
| CRM Blog First Load | ca. 275 kB |
| Storybook Section-Lab chunk | 1.749 MB minified / 370 kB gzip |

Der Renderer-Build und Marketing-Build bestehen. Die Größen sind keine Funktionsfehler, aber über Budget für ein „fast and responsive“-Produkt, insbesondere auf Mobilgeräten.

### Hauptursachen

- großer synchroner Template-/Section-Registry-Import in Public und Preview;
- Framer Motion und viele interaktive Templates im gemeinsamen Pfad;
- Page Editor importiert zahlreiche spezialisierte Industry-Editoren/Previewdaten;
- icon/component maps;
- Live Preview und DnD im Editor;
- Section Lab bündelt bewusst die ganze Library.

### Maßnahmen

1. Renderer-Definitionen component-level dynamisch laden oder build-time manifestieren.
2. Public Route lädt nur im Snapshot verwendete Section-Owners.
3. Industry-Editoren lazy nach geöffnetem Section-Typ.
4. Previewdaten/Picker-Katalog getrennt vom initialen Editor-Bundle.
5. Motion primitives und Icons gezielt importieren.
6. Budgets: Public <250 kB, Editor shell <350 kB, lazy section editor <100 kB pro Chunk als Startziel.

## Datenbank-/Serverperformance

Positive Beispiele:

- Draft Snapshot lädt Pages/Sections/Collections/Items in wenigen Batchqueries und gruppiert in Memory.
- Page Editor lädt mehrere unabhängige Settings per `Promise.all`.
- wichtige Tenant-/Slug-/Active Indizes existieren.
- Stripe per-tenant Webhook ist O(1).

Risiken:

- `getMediaAssets()` startet HEAD für jedes Asset und schreibt Dedupe/Delete während Read;
- Public Snapshot-Meta wird vor dem Cache-Closure aus DB gelesen; Cache schützt Snapshot, nicht zwingend jede Meta-Abfrage;
- große Snapshot-JSONs werden komplett gelesen/serialisiert;
- Reorder erzeugt N parallele Updates;
- Publish validiert/serialisiert komplette Tenant-Inhalte;
- PAT Debug liefert komplette Pages/Sections/Collections in einer Response;
- keine dokumentierten Paging-Limits in mehreren Admin-Listen/Content-API-Pfaden;
- Fire-and-forget E-Mails/Token-lastUsed können in Serverless nach Response verloren gehen.

Empfehlung: Pagination/limits, background jobs/outbox, bulk reorder SQL, snapshot size metrics/compression strategy, query timing/slow logs und Web Vitals/DB telemetry pro Tenant.

## Reliability

### Publishing

- Positiv: inactive insert vor atomarem Switch, Checksum-Deduplizierung, partieller Unique-Index für einen aktiven Snapshot, Cache Tags und Rollback History. Das ist noch keine vollständige Recovery-Idempotenz: Ein Retry repariert beispielsweise eine nach dem Switch fehlgeschlagene History nicht automatisch.
- Kritisch: Snapshot-Read-Error fällt auf Draft zurück.
- Hoch: Admin Publish fällt nicht-transaktional zurück; PAT/Admin haben eigene Implementierungen.
- Lücke: keine Fault-Injection-Tests, keine sichtbare Publish-Outbox/Retry, keine automatische Last-known-good-Auslieferung bei Snapshot-Store-Fehler.

Zielzustand: Public liest ausschließlich validierte immutable Snapshots. Publish ist eine idempotente State-Machine; ein Fehler vor Commit ändert Public nicht, ein Fehler nach Commit wird über Outbox/Revalidation nachgeholt.

### Editor

- BeforeUnload + 24h LocalStorage-Recovery sind gute Schutzmechanismen.
- Optimistische Mutationen besitzen keine konsistente Rollbackstrategie.
- Save-Semantik ist über mehrere Kanäle verteilt.
- Concurrent Editing besitzt keinen ETag/Revision/Conflict-Dialog.

### Shop/Booking

- Statushistorien, overlap guard migration, availability rules, calendar blocks und Providerprüfungen sind solide Grundlagen.
- Fehlende E2E-/Race-Tests für double submit, concurrent stock, invoice counter, DST/Timezone, overlapping instant booking und webhook replay.
- Credit-note/invoice number increment ist als Read→Insert→Increment sichtbar und sollte unter Concurrency transaktional/unique abgesichert werden.

## QA-Evidenz für Sections

Die bestehende Production-Route-Matrix deckt 208 Preview-Fixture-Typen an vier Viewports ab (**832 Zustände**). Ergänzend rendert ein test-only Storybook-Harness alle 222 kanonischen Typen als **271 sinnvolle `(type, component)`-Varianten**. Je Variante werden 14 Zustände geprüft: Default an vier Viewports; minimal mit einem Item; zwei Items plus Portraitmedium; drei Odd-Items plus Landscape/Long Copy; neun Items plus Maximalcopy/Low-quality-Medium; Missing Media; Light- und Dark-Palette; Reduced Motion; CSS-Zoom-Proxy; vollständige Tab-Traversal. Das ergibt **3.794/3.794 aufgezeichnete Zustände mit 0 Hard Failures**. Vollständige Rohzusammenfassung: [section-extreme-matrix-summary.json](evidence/section-extreme-matrix-summary.json).

Die zusätzliche Breite bestätigt konkrete Resilience- und Accessibility-Lücken, ohne Heuristiken als Production-Bugs zu überzeichnen:

- Realistisch erweiterter Inhalt läuft in acht benannten Renderer-Vertragsfamilien horizontal aus; nur `testimonialMarquee` ist zusätzlich im Default-Production-Fixture bestätigt.
- Missing-Media-Stress erzeugt in 13 Varianten kaputte Bilder. Required-invalid und optional-absent benötigen unterschiedliche Contracts.
- Targeted Axe bestätigt kritische Name-/Label-Fehler in vier Typen; 271/271 vollständige Tab-Traversals fanden zugleich 0 unerreichbare Controls und sichtbaren Fokus.
- 95/271 Varianten animieren unmittelbar nach Load trotz Reduced-Motion-Präferenz; darin sind endliche Entrances enthalten. Die Production-Route weist separat zehn Typen mit kontinuierlicher CSS-Animation nach.
- 215/271 Dark-Palette-Stresssignale sind ein Design-System-Indikator, kein Beleg für 215 Live-Bugs und kein Nachweis eines derzeit unterstützten Dark Mode.

Grenzen: Der Zoom-Lauf ist ein CSS-Proxy und ersetzt keinen nativen Browser-200-%-Test; manuelle Screen-Reader-Journeys sowie ein echter fotografischer Medien-/Crop-/Formatkorpus bleiben offen. Storybook ersetzt außerdem nicht die Production-Route für RSC-, Next-Image- und Hydration-Effekte.

## Dependency-Audit

`pnpm audit --prod --audit-level low`: keine bekannten Vulnerabilities.

Outdated: überwiegend Patch/Minor (React 19.2.6→19.2.7, Framer Motion, Tiptap, Stripe, Turbo). Große Sprünge Next 15→16, Tailwind 3→4, Zod 3→4, Lucide 0.x→1.x und TypeScript 5→7 sind geplante Migrationen, keine Audit-Quick-Fixes. `@types/bcryptjs` ist deprecated, weil moderne bcryptjs-Versionen eigene Typen liefern.

## Observability

Bestätigte Lücken:

- `audit_log` wird nicht beschrieben;
- Production RSC Error zeigt nur Digest, aber kein nutzerfreundliches Correlation-/Support-System;
- kritische Fire-and-forget E-Mails loggen nur Console;
- keine belegten Alerts für Publish failure, webhook failure, mail relay/volume, tenant-isolation denial oder Demo writes;
- kein Browser-/Lighthouse-Gate in CI.

Minimum:

- strukturierte Events mit requestId/tenantId/actor/action/result, PII-redacted;
- Error Tracker + Vercel Log drain;
- Publish/Payment/Booking/Email SLOs;
- Alert auf anomale Demo-/PAT-/Mail-Raten;
- Synthetic Journeys für Login→Pages→Editor und Public Snapshot.

## Security/Performance Acceptance Gates

- Keine öffentliche Route kann Plattform-SMTP zu frei gewählten Empfängern nutzen.
- Jede Mutation hat Capability + Tenant-Predicate + affected-row assertion.
- Demo ist read-only oder pro Session isoliert.
- Snapshotfehler liefern nie Draft.
- Public Tier-1 LCP/INP/CLS Budgets und Bundle Budget in CI.
- 1.000 Media-Assets laden paginiert ohne 1.000 synchrone Probes.
- Payment/Booking Race-/Replay-Suites bestehen.
- Dependency, credential, SAST/contract, E2E, Axe und Visual-Smoke sind Pflichtchecks.
