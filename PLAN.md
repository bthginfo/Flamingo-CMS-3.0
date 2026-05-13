# PLAN v2 — Flamingo Media CMS + Renderer

> Erstellt: 2026-05-13 | Zuletzt aktualisiert: 2026-05-13
> Status: Aktiv

---

## Fortschritt

### ✅ Erledigt

| # | Milestone | Commit |
|---|-----------|--------|
| M1 | Monorepo Scaffold + Marketing 1:1 portiert | d600ddb |
| M2 | DB-Schema (21 Tabellen, Neon Postgres) | b7a1d6f |
| M3 | GitHub + Vercel Deployment | 3ab95e5 |
| M4 | Zod-Schemas + Auth-Package | d3dfe59 |
| M5 | Admin-App Scaffold (Login, Sidebar, Dashboard) | 8a370a0 |
| M6 | Page Editor + Section Builder (DnD) | 3379507 |
| M7 | Collections CRUD | 9453e3b |
| M8 | Draft/Preview/Publish Engine (Snapshot-Versioning) | 22995b5 |
| M9 | Renderer + Handwerk-Template (Skeleton) | 832e21c |
| M10 | Demo-Seed (Müller & Söhne) + Nav/Footer | 3ecb4ae |

### 🔨 In Arbeit

| # | Milestone | Beschreibung |
|---|-----------|--------------|
| M11 | Handwerk Premium-Design | Framer Motion, Typografie, Animationen, Hover-Effekte, responsive |

### ⬜ Offen

| # | Milestone | Prio | Beschreibung |
|---|-----------|------|--------------|
| M12 | Admin Settings-Seiten | Hoch | Brand, Kontakt, Nav, Footer, SEO, Skripte, Mail, Legal, Passwort — echte Formulare |
| M13 | Media-Upload (Vercel Blob) | Hoch | Bildverwaltung im Admin, Upload + Auswahl in Section-Editoren |
| M14 | Template-Galerie auf Marketing-Seite | Hoch | Übersicht aller Templates + Live-Preview mit Demo-Content |
| M15 | Kontaktformular-Backend | Mittel | SMTP-Versand via tenant_smtp oder Plattform-Mail |
| M16 | SEO-Engine | Mittel | Meta-Tags, OG-Tags, Sitemap.xml, robots.txt pro Tenant |
| M17 | Consent/Cookie-Banner | Mittel | Script-Kategorien + DSGVO-Banner im Renderer |
| M18 | Mobile Navigation (Renderer) | Mittel | Hamburger-Menu im Renderer-Header |
| M19 | Passwort-Ändern im Admin | Niedrig | Security-Seite funktional machen |
| M20 | Rollback-Funktion | Niedrig | Ältere Snapshots reaktivieren |
| M21 | Audit-Log UI | Niedrig | Änderungen im Admin anzeigen (Tabelle existiert) |
| M22 | Provisioning-System | Niedrig | Auto-Anlage neuer Kunden (Tenant + Domain + Vercel-Projekt) |
| M23 | Weitere Branchen-Templates | Später | Restaurant, Salon, Hotel, etc. |

---

## Architekturentscheidungen

| ID | Entscheidung | Begründung |
|----|-------------|------------|
| A1 | Monorepo (Turborepo + pnpm) | Shared Code, ein PR für Cross-Cutting, Turbo caches Builds |
| A2 | Next.js 15 App Router | SSR/SSG für Renderer, Server Actions, ISR, Vercel-native |
| A3 | Marketing als eigene Next.js-App | SEO/SSG besser als Vite SPA, react-router client-side als Brücke |
| A4 | Drizzle ORM | Leichtgewichtig, SQL-nah, Edge-kompatibel, JSONB-Snapshots |
| A5 | Auth = bcrypt + jose JWT | MVP-tauglich, HttpOnly Cookie, Middleware Guard |

## Repos & URLs

- **GitHub:** https://github.com/bthginfo/Flamingo-CMS-3.0
- **Vercel (Marketing):** flamingo-cms-3-0
- **DB:** Neon `neondb` (eu-central-1)
- **SMTP:** smtp.ionos.de / hello@flamingomedia.online

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
