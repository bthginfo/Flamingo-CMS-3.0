# PLAN v1 — Flamingo Media CMS + Renderer

> Erstellt: 2026-05-13
> Status: Aktiv

---

## Architekturentscheidungen

### A1: Monorepo (Turborepo)
- **Entscheidung:** Monorepo mit Turborepo
- **Begründung:** Shared Code (DB, Schemas, UI) zwischen Marketing, Admin, Renderer. Ein Repo = ein PR für Cross-Cutting Changes. Turbo cached Builds effizient. Pro-Kunde-Deployment via separater Vercel-Projekte, die denselben Code referenzieren.
- **Tradeoffs:** Etwas komplexere initiale Einrichtung. Vercel unterstützt Monorepos nativ.
- **Auswirkung Marketing 1:1:** Marketing-App ist eigenständig, eigene Dependencies, keine UI-Package-Abhängigkeit erzwungen.
- **Auswirkung Deployment:** Jede App hat eigenes Vercel-Projekt. Renderer-App wird pro Kunde als eigenes Vercel-Projekt deployed mit TENANT_ID Env Var.

### A2: Next.js App Router für Admin + Renderer
- **Entscheidung:** Next.js 15 App Router
- **Begründung:** SSR/SSG für Renderer (SEO, Performance), Server Actions für Admin, ISR für Publish/Cache, native Vercel-Integration.
- **Tradeoffs:** Marketing-Repo ist Vite SPA — wird als separate Next.js-App migriert (minimale technische Anpassung: react-router → Next.js file routing).

### A3: Marketing-App als eigenständige Next.js-App
- **Entscheidung:** Marketing-Seiten werden in eine eigene Next.js-App (`apps/marketing`) portiert
- **Begründung:** Das Original ist Vite + react-router SPA. Für SEO und Performance ist SSR/SSG besser. 1:1 optische Gleichheit bleibt erhalten, nur technische Routing-Schicht ändert sich.
- **TECHNISCH NOTWENDIGE ANPASSUNG:** react-router-dom → Next.js App Router file-based routing. BrowserRouter/Routes/Route entfällt. Links werden zu next/link. Komponenten, Styles, Assets, Fonts, Animationen bleiben 1:1.

### A4: Drizzle ORM
- **Entscheidung:** Drizzle ORM (nicht Prisma)
- **Begründung:** Leichtgewichtiger, SQL-nah, kein Generator-Step, bessere Edge-Kompatibilität, JSON-Operationen direkt. Für ein Custom CMS mit JSONB-Snapshots ideal. Type-safe ohne Codegen.
- **Tradeoffs:** Weniger Ökosystem als Prisma, aber ausreichend für dieses Projekt.
- **Migration:** drizzle-kit generate + push.
- **Seed:** TypeScript Seed-Scripts pro Branche.

### A5: Auth = Passwort + Cookie
- **Entscheidung:** Kein Auth-Framework, eigener Passwort-Check
- **Begründung:** MVP-Anforderung. bcrypt Hash, HttpOnly/Secure/SameSite Cookie, Server-side Middleware Guard.

---

## Meilensteine

### M1: Monorepo Scaffold + Marketing 1:1
- **Ziel:** Turborepo-Monorepo aufsetzen, Marketing-Seiten 1:1 portieren
- **Outcome:** Marketing-Seiten laufen unter /, /prozess, /preise, /ueber-uns, /kontakt mit identischem Aussehen
- **Betroffene Bereiche:** apps/marketing, configs
- **Definition of Done:**
  - Alle 5 Marketing-Routen rendern korrekt
  - Fonts, Assets, Animationen, Effekte identisch
  - Build erfolgreich
  - Responsive identisch
- **Test/Check:** Build, Dev-Server, visuelle Prüfung aller 5 Seiten
- **Risiken:** Framer Motion + Lenis Kompatibilität mit Next.js SSR (mittel, lösbar mit 'use client')
- **Next Actions:**
  1. Turborepo + pnpm Workspace initialisieren
  2. apps/marketing als Next.js App scaffolden
  3. Marketing-Komponenten 1:1 kopieren
  4. Routing anpassen (react-router → file-based)
  5. Assets + Fonts übernehmen
  6. Tailwind Config übernehmen
  7. Build + visuelle Prüfung

### M2: Datenbank-Schema + Packages
- **Ziel:** Postgres-Schema mit Drizzle, alle Tabellen, Migrations
- **Outcome:** 21 Tabellen, Indexes, Types, Seed-Grundlage
- **Betroffene Bereiche:** packages/db
- **Definition of Done:** Schema kompiliert, Migration generiert, Types exportiert
- **Test/Check:** drizzle-kit push gegen lokale/dev DB, TypeCheck
- **Risiken:** Neon/Vercel Postgres Connection Pooling

### M3: CMS Admin Shell + Auth
- **Ziel:** Admin-App mit Passwortschutz, Sidebar, Dashboard
- **Outcome:** Login, geschützter Bereich, Navigationsstruktur
- **Betroffene Bereiche:** apps/admin, packages/auth
- **Definition of Done:** Login funktioniert, Admin Shell rendert, alle Menüpunkte sichtbar

### M4: Seiteneditor + Section Builder
- **Ziel:** Pages CRUD, Section hinzufügen/entfernen/sortieren, Draft speichern
- **Outcome:** Vollständiger Seiteneditor mit Section-Formular
- **Betroffene Bereiche:** apps/admin, packages/cms-core, packages/schemas

### M5: Collections + Content-Modell
- **Ziel:** Services, Projects, Team, News Collections im Admin
- **Outcome:** CRUD für Collection Items, Slug-Verwaltung
- **Betroffene Bereiche:** apps/admin, packages/db

### M6: Draft → Preview → Publish
- **Ziel:** Draft-State, Preview-URLs, Publish-Snapshots, Rollback
- **Outcome:** Vollständiger Content-Lifecycle
- **Betroffene Bereiche:** packages/cms-core, apps/admin, apps/renderer

### M7: Renderer + Handwerk Template
- **Ziel:** Frontend-Renderer, Section Registry, 3 Design-Styles, Handwerk Demo Content
- **Outcome:** Funktionierende Kundenwebsite aus Snapshot
- **Betroffene Bereiche:** apps/renderer, packages/renderer-core, packages/seeds

### M8: Global Settings + SEO + Media
- **Ziel:** Brand, Kontakt, Navigation, Footer, SEO, Vercel Blob Media
- **Outcome:** Alle Settings im Admin steuerbar
- **Betroffene Bereiche:** apps/admin, packages/db, packages/media, packages/seo

### M9: Provisioning + Multi-Tenant Deployment
- **Ziel:** Tenant anlegen, Vercel-Projekt erstellen, Domain verbinden
- **Outcome:** Neuer Kunde wird end-to-end provisioniert
- **Betroffene Bereiche:** apps/flamingo-admin, scripts

### M10: Polish, Testing, Launch-Readiness
- **Ziel:** E2E Tests, A11y Audit, Performance Audit, Demo Content Qualität
- **Outcome:** Production-ready MVP
- **Betroffene Bereiche:** Alle

---

## Changelog

- v1 (2026-05-13): Initialer Plan erstellt. Repo-Analyse abgeschlossen. Architekturentscheidungen A1–A5 dokumentiert. 10 Meilensteine definiert.

---

## Offene Fragen

1. **Postgres-Anbieter:** Vercel Postgres oder Neon direkt?
   - ANNAHME: Neon via Vercel Integration (bessere Free Tier, Branching)
2. **pnpm vs npm:** Monorepo favorisiert pnpm
   - ANNAHME: pnpm
3. **Next.js Version:** 15.x (aktuell stabil)
   - ANNAHME: Next.js 15 mit App Router
4. **Tailwind Version:** Original hat 3.x, neues Projekt auch 3.x?
   - ANNAHME: Tailwind 3.x (Kompatibilität mit Marketing-Code)
