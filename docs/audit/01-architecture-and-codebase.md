# Architektur und Codebase

Stand: 11. Juli 2026, Commit `2b2d26a7` (`origin/main`).

## Was das Produkt tatsächlich ist

Flamingo CMS ist kein einfacher Website-Renderer, sondern eine Multi-Tenant-Plattform aus öffentlichem Website-Renderer, integriertem CMS-Admin, Section-Builder, Publishing/Preview, Collections, Media, Formular-Inbox, SEO, Booking, Shop, Demo-System und einer PAT-basierten Content-API für AI-Agenten. Daneben existiert eine zweite Next.js-App für Flamingo Media Marketing und ein internes CRM.

Der Kern ist `apps/renderer`; die README-Aussage, Admin und Renderer seien „coming soon“, ist veraltet. Eine separate `apps/admin`-App existiert nicht. Der CI-Schritt `pnpm --filter @flamingo/admin build` ist ein bestätigter No-op.

## Repository-Map

| Bereich | Verantwortung | Wichtige Quellen |
|---|---|---|
| `apps/renderer` | Public Rendering, CMS-Admin, Live Preview, Demos, Content API, Shop, Booking | `src/app`, `src/templates`, `src/lib`, `src/components` |
| `apps/marketing` | Agentur-Website, CMS-Produktmarketing, CRM, Lead-/Mail-API | `src/app`, `src/middleware.ts` |
| `packages/db` | Drizzle/Neon-Datenmodell, 17 Migrationen, mehr als 50 Tabellen | `src/schema/index.ts`, `drizzle/*` |
| `packages/auth` | Passwort-Hashing, Admin-/Demo-JWT, Session-Cookie | `src/index.ts`, `src/cookie.ts` |
| `packages/schemas` | Zod-Schemas für Collections/Settings/Sections | `src/*` |
| `packages/design-tokens` | Token-Typen und -Definitionen | `src/tokens.ts` |
| `scripts` | Audits, Codegen, Demo-Seeding, DB-Hilfen; im Audit zusätzlich ein statischer Storybook-Server und Extreme-State-Runner | `scripts/*.cjs`, `scripts/*.ts`, `scripts/demo-tenants`, `serve-storybook-static.mjs`, `audit-section-storybook.mjs` |
| `tests` / Storybook | Playwright für Consent, Live-Demos, optionale Visual-Baselines; audit-only Section-Katalog | `tests/*.spec.ts`, `apps/renderer/src/stories/section-audit.stories.tsx` |
| `.github/workflows` | CI, Color-Audit | `ci.yml`, `color-audit.yml` |

Frameworks/Infrastruktur: Next.js 15.5, React 19, TypeScript, Tailwind 3, Framer Motion, Drizzle ORM, Neon Postgres, Vercel Blob, Stripe/PayPal/SumUp, Nodemailer, Tiptap, Embla, Storybook 10, Playwright und Axe.

## Hauptentitäten

```text
Tenant
├─ Domains, AdminSecret, Addons, API Tokens
├─ GlobalSettings (brand/design/contact/forms/SMTP-nahe Konfiguration)
├─ Navigation, Footer, SEO, Scripts/Consent
├─ Pages ──< PageSections
├─ Collections ──< CollectionItems
├─ MediaAssets
├─ PublishedSnapshots ──< PublishHistory
├─ FormSubmissions, RSVP, Reservations, Leads
├─ ShopSettings, Categories, Products/Variants, Orders/Invoices/Coupons/Shipping
├─ BookingSettings, Services, Resources, Rules, Blocks, Requests, StatusHistory
└─ InstagramConnections/Posts
```

Fast alle kundenbezogenen Tabellen tragen `tenantId`. Positive Beispiele sind zusammengesetzte Unique-Indizes für Page-Slugs und Collection-Slugs sowie tenant-gefilterte CRUD-Actions. Nicht alle Mutationen halten diesen Vertrag konsequent ein; siehe F-006 in `02-bugs-and-risks.md`.

## Tenant-Auflösung

1. Standalone-Deployment: `FIXED_TENANT_ID`.
2. Shared-/Domain-Modus: `tenant_domains.domain` aus Host-Header.
3. Lead-shared/slug-basierte Routen: erster Pfadteil bzw. expliziter Tenant-Slug.
4. Lokale Entwicklung: erster aktiver Tenant als Fallback.
5. Demos: `demo-{key}`/`isDemo=true` mit Industry-Legacy-Fallback.

Quellen: `apps/renderer/src/lib/snapshot.ts`, `tenant-host.ts`, `app/[[...slug]]/page.tsx`, `app/[tenant]/c/...`, `app/demo/[industry]/...`.

Die Branche ist technisch ein Rendering-/Default-Hinweis, keine harte Datenbarriere. `definitionKey` (`type.owner.v1`) entkoppelt gespeicherte Sections zunehmend von der Tenant-Branche. Das bestätigt die Produktempfehlung: Branchen als Demo-/Content-Rezepte führen, nicht als fundamentale CMS-Grenzen.

## Section-Architektur

```text
Admin Picker (section-types.ts)
        │ type + addon policy
        ▼
Write identity (section-write-identity.ts)
        │ definitionKey + schemaVersion
        ▼
DB page_sections / collection_items.data.sections
        │
        ├─ Editor defaults (section-editor-field-defaults.ts)
        ├─ API contracts (section-data-schemas.ts)
        ├─ Color contracts (generated + resolver + DOM scan)
        └─ Renderer registry (templates/index.ts)
                 specific owner → shared → legacy cross-industry fallback
```

Kanonische Oberfläche: 222 reale Section-Typen, 553 registrierte Owner-Definitionen, davon 205 Typen auswählbar und 217 mit API-Schema. Gleiche Typen/Owner können dieselbe Komponentenidentität verwenden; deshalb verdichtet die Laufzeitprüfung die 553 Definitionen auf 271 sinnvolle `(type, component identity)`-Renderer-Varianten statt jede Aliasdefinition blind doppelt zu testen. Das vorhandene `audit:sections` meldet 250 Typen, weil 28 `*Verein`-Contract-Keys wegen einer unvollständigen Suffix-RegEx als Typen fehlinterpretiert werden. Vollständiges Inventar: `04-section-inventory.md`.

Der audit-only Storybook-Katalog rendert jede der 271 Varianten in 14 Zuständen: vier Viewports, fünf Content-/Media-Extreme, explizite Light-/Dark-Paletten, Reduced Motion, CSS-Zoom-Proxy und vollständige Tab-Sequenz. Alle 3.794 Zustände wurden aufgezeichnet, 0 endeten als Route-Load-/Hard-Render-Ausfall. Diese Komponentenschicht ersetzt nicht die Next-Runtime: Die separate Production-Route-Matrix prüft 208 Fixture-Typen in 832 Viewports und hat den `availabilityCalendar`-Hydrationfehler nur dort reproduziert. Audit-Harness, Runner und statischer Server sind Testinfrastruktur; sie ändern keinen Production-Runtime-Pfad.

### Autoritätsreihenfolge bei Konflikten

| Frage | Autoritative Quelle | Nicht autoritativ |
|---|---|---|
| Welche gespeicherte Section-Definition rendert? | kompatibler DB-`definitionKey`/`schemaVersion`, aufgelöst durch Registry; Legacy nur Industry → Shared → explizite Fallback-Reihenfolge | Picker-Label, Preview-Fixture |
| Welche Daten darf API annehmen? | `getSectionSchemas` + serverseitige Section-/Addon-/Identity-Validierung | Editor-Defaults, TypeScript Props allein |
| Welche Komponente läuft? | `templates/index.ts`/Section Definition Registry | Industry-Name im Marketing oder Picker-Kategorie |
| Welche Felder zeigt Admin? | spezialisierter Editor, sonst Schema-Editor; muss gegen API-Vertrag geprüft werden | Previewdaten |
| Welche Defaults werden geschrieben? | serverseitige Creation Action nach Identity-/Schema-Normalisierung | reine Client-/Preview-Defaults |
| Welche Farben wirken? | normalisierte `styleOverrides` → semantische Slots → Tenant Theme CSS Vars | Rohwert ohne Contrast-/Slot-Validierung |
| Was ist öffentlich? | aktiver immutable Snapshot; heutiger Draft-Fallback ist als Risiko zu entfernen | Editor-Draft/Preview |

Diese Reihenfolge ist im Code verteilt, nicht als einzelnes Manifest durchgesetzt. Das detaillierte Inventar weist pro Typ Renderer, Schema, Editor und Fixture aus; Ziel ist ein generiertes Manifest, aus dem Picker, AI/API-Vertrag, Editor und Tests abgeleitet werden.

Stärken:

- stabile Definition-Keys und Schema-Version;
- API- und Editor-Verträge sind weitgehend vorhanden;
- Addon-Sections werden serverseitig geprüft;
- Style-Overrides werden grammatikalisch normalisiert;
- generierte Farbverträge und Mirror-/Crosstalk-Gates;
- Storybook Section Lab baut alle registrierten Sections; der audit-only Katalog verifiziert 271 sinnvolle Varianten in 3.794 Zuständen ohne Hard Failure.

Risiken:

- fünf Quellen müssen synchron bleiben; zwei Drift-Gates schlagen auf `main` fehl;
- CTA- und Media-Feldformen sind nicht normalisiert;
- `variant` ist gespeichert, aber kein konsistentes Variantenmodell;
- Legacy-Fallback macht fremde Sections renderbar, erhöht aber Migrations-/Testfläche;
- direkte und gestagte Saves sind im Editor vermischt.

## Datenfluss: Bearbeiten bis Public Rendering

```text
Admin UI
  → Server Action mit Session-Tenant
  → Pages/PageSections/Collections/Settings (Draft-Tabellen)
  → Live Preview via postMessage + Draft-Daten
  → Content-/Color-Preflight
  → PublishedSnapshot(JSON, checksum, version, isActive)
  → Cache-Tag tenant-{id} + Revalidate
  → Public Route liest aktiven Snapshot
  → SectionRenderer löst Definition + Tokens + Daten
```

Collection Items speichern Sections optional in `collection_items.data.sections`, nicht als eigene Rows. Produkte/Kategorien haben Stammdaten-Editoren, aber keine gleichwertige freie Entity-Section-Struktur. Das erzeugt unterschiedliche Persistenz-, Preview- und i18n-Fähigkeiten.

## Publishing-Flow

```text
Save pending editor data
  → GET-like stored-content validation
  → getDraftSnapshot(tenant)
  → checksum
  → page status draft→published
  → insert inactive snapshot
  → atomic SQL switch active snapshot
  → insert publish_history
  → revalidateTag/revalidatePath
```

`publishAction` versucht eine DB-Transaktion. `createDb` verwendet jedoch immer den Neon-HTTP-Treiber; damit ist der explizite nicht-transaktionale Ablauf praktisch der erwartete Pfad. Der Snapshot-Switch selbst ist ein SQL-Statement und durch einen partiellen Unique-Index geschützt; Page-Status, Snapshot, History und Revalidation sind jedoch nicht gemeinsam atomar. Die PAT-Publish-Route implementiert einen eigenen sequenziellen, checksum-deduplizierten Ablauf, aber keine vollständige Recovery-Idempotenz. Zwei Publishing-Implementierungen erhöhen Drift.

Rollback wechselt auf den vorherigen Snapshot und protokolliert `publish_history`. Eine History-/Rollback-UI ist im normalen Nutzerfluss nicht gleichwertig sichtbar.

## Authentifizierung und Autorisierung

| Oberfläche | Mechanismus | Bewertung |
|---|---|---|
| CMS Admin | HS256 JWT, HttpOnly/Secure/SameSite Cookie, bcrypt 12 | Solide Basis; globales Master-Passwort hat hohen Blast Radius |
| Public Demo Admin | öffentlich ausgegebenes JWT mit Rolle `demo`, 1h | Rollenmodell vorhanden, aber viele Mutationen nutzen nur `getSession()` |
| Content API | gehashte PATs, Ablauf/Widerruf, Tenant-Bindung | Gute Token-Speicherung; keine feinen Scopes/Rate-Limits |
| Marketing CRM | eigenes HS256 Cookie, Rolle `crm_admin` | CRM-Routen geschützt; eine Mail-API liegt außerhalb des Matchers |
| Shop-Webhooks | Provider-Signatur bzw. serverseitige Capture-Verifikation | Stripe gut tenantgebunden; Provider-Flows benötigen Live-E2E |

## Media-Lifecycle

- Client Upload erhält kurzlebiges Vercel-Blob-Upload-Token nach Admin-Sessionprüfung.
- Uploads sind public, zufällig gesuffixt, ohne Overwrite.
- `media_assets` speichert Tenant, URL, Pfad, MIME, Maße, Alt, Folder.
- Media-Library dedupliziert und prüft jede URL per HEAD; fehlende Rows werden beim Lesen gelöscht.
- Löschen prüft Tenant und andere Blob-Referenzen, kann aber von öffentlichen Demo-Sessions erreicht werden.
- API-Upload nutzt Content-Hash und Tenant-Pfad; deklarierter MIME/Extension wird geprüft, Magic Bytes nicht.

## Client/Server/Build-Grenzen

- Next Server Components/Actions: DB-Zugriff, Auth, Persistenz, Publishing.
- Client Components: Editor, DnD, Live Preview, interaktive Sections, Shop/Booking-Flows.
- Middleware: Cookie-Anwesenheit/CRM-JWT, nicht vollständige Route-Autorisierung.
- Build: Next-Builds, Storybook, statische Contract-Gates; der neue Extreme-State-Harness läuft bislang nur audit-local, nicht als verbindliche Browser-QA in CI.
- Vercel Cron: stündlicher Instagram-Sync.

## Deployment und Provisioning

Renderer unterstützt `shared`, `lead_shared` und `standalone`. Der CRM-Flow in `apps/marketing/src/lib/provisioning.ts` führt sequenziell aus:

```text
Zombie-Tenant ggf. löschen
  → Tenant(status=provisioning)
  → AdminSecret → GlobalSettings → Navigation/Footer
  → Default Pages/Sections → initialer aktiver Snapshot
  → optional Vercel Project/Blob/Preview-/Custom-Domain
  → Tenant(status=active)
```

Stärke: neue Tenants erhalten sofort einen initialen Snapshot, wodurch der No-snapshot-Fallback grundsätzlich migrierbar ist. Risiko: Das ist keine transaktionale/idempotente Saga. Standalone-/Blob-/Domainfehler werden nur als Warning zurückgegeben; auch `shared`/`lead_shared` schlucken Domainfehler und markieren `domainConfigured` anschließend als wahr. Der Tenant wird trotzdem aktiv gesetzt. Ein Retry löscht einen `provisioning`-Tenant aus der DB, kompensiert aber keine möglicherweise bereits erzeugten externen Ressourcen. Vercel-Projekt-, Env- und Domainpfade sind teilweise idempotent, vollständige Ownership, Step-Persistenz und Kompensation sind jedoch nicht garantiert. Siehe F-035.

`tenant_domains`, `deploymentMode`, Vercel-Env- und Seed-/Provisioning-Skripte bilden die operative Schicht. Nötig sind persistente Step States, Idempotency Keys, Required-vs-optional Health Checks, Compensations und Aktivierung erst nach erfülltem Vertrag. README, CI und reale Struktur sind zusätzlich auseinander gelaufen.

## Verifizierte Annahmen

- Öffentliche Seiten lesen bei vorhandenem aktivem Snapshot tatsächlich Snapshot-Daten.
- Draft, Preview und Public sind konzeptionell getrennt.
- Tenant-Filter sind mehrheitlich vorhanden, aber nicht invariant erzwungen.
- Demos liegen in echten Tenant-Daten; statische Demo-Fixtures sind in Produktion deaktiviert.
- Branche ist keine notwendige technische Grenze.
- Section-Farben besitzen 54 deklarierte semantische Slots; Token-Gate besteht.
- 553 registrierte Section-Definitionen bilden 222 kanonische Typen und 271 sinnvolle Renderer-Varianten; Komponenten- und Production-Route-Tests sind bewusst getrennte Schichten.
- Shop/Booking/i18n sind Addons/Fähigkeiten, nicht eigene Apps.

## Offene Fragen / nicht verifiziert

- Welche echten Kundentenants besitzen noch keinen aktiven Snapshot?
- Ob alle 17 Migrationen in jeder Produktionsdatenbank angewendet sind.
- Recovery-Verhalten bei realem Neon-Ausfall während Publish/Checkout/Booking.
- Rollen-/Benutzerbedarf jenseits eines Tenant-Admin-Passworts.
- Aufbewahrung/Löschung personenbezogener Form-, Booking-, RSVP- und Shop-Daten.
- Live-E2E aller Payment-Provider und SMTP-Konfigurationen.
- Monitoring/Alerting für Publish, RSC-Fehler, Mail-/Webhook-Fehler und Demo-Mutationen.

## Empfohlene Architekturänderungen

1. Autorisierung als zentrale Policy (`read`, `draft-write`, `irreversible-write`, `publish`, `platform-admin`) statt verstreutem `getSession`/`getWritableSession`.
2. Public Snapshot Read fail-closed; Legacy-Fallback nur bei explizit verifiziertem „noch nie publiziert“.
3. Eine Publish-Domainfunktion für Admin und PAT, mit klarer Transaktionsfähigkeit/Outbox.
4. Einheitlicher Entity-Adapter für Page und Collection Item; Shop später additiv.
5. Normalisierte CTA-/Media-/Rich-Text-Contracts und migrationsfähige Schema-Versionen.
6. Audit-Log real anschließen; `draft_states`/`routes` entweder implementieren oder entfernen.
7. Branchen als kuratierte Experience-Rezepte über capability-basierter Section-Library.
