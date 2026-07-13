# Verification Log

Audit date: 11. Juli 2026

Repository state: Branch `codex/full-hardening`, Commit `2b2d26a7` (`origin/main`)

Package manager: pnpm / Turborepo

Audit changes: neue Dokumentation/Evidenz unter `docs/audit/` sowie drei ausschließlich für Storybook-/Playwright-Audits verwendete Dateien: `apps/renderer/src/stories/section-audit.stories.tsx`, `scripts/audit-section-storybook.mjs` und `scripts/serve-storybook-static.mjs`. Kein Production-Runtime-Pfad wurde geändert. Zuvor begonnene UI-Arbeit liegt getrennt im Stash-Commit `67f842bce0a2a52e24ee96d6e85c29fc5c6a4121` (`paused-premium-ui-implementation-before-comprehensive-audit-2026-07-11`).

## Automated Repository Checks

| Command | Result | Evidence / Interpretation |
|---|---|---|
| `pnpm audit:credentials` | **PASS, begrenzter Scope** | 1.020 tracked files; keine Credential-Literale im Repository. Der im Task-Kontext geteilte Vercel-PAT liegt außerhalb dieses Scans und muss widerrufen werden |
| `pnpm check:env-contract` | **PASS** | 37 verwendete Env-Variablen; 36 build-relevante in Turbo; 0 fehlend |
| `pnpm audit --prod --audit-level low` | **PASS** | keine bekannte Production-Dependency-Advisory zum Auditzeitpunkt |
| `pnpm outdated --recursive` | **INFO** | vorwiegend Patch/Minor; große Migrationen u.a. Next 16, Tailwind 4, Zod 4, TypeScript 7; `@types/bcryptjs` deprecated |
| `pnpm lint` | **PASS** | Renderer und Marketing TypeScript-Lint/`tsc --noEmit`; initial 2/2 Tasks in 81,7 s. Finaler Lauf nach Audit-Harness: 2/2, Renderer uncached/Marketing cached, 16,8 s gesamt bzw. 12,494 s Turbo |
| `pnpm typecheck` / Package-Typechecks | **PASS** | Renderer, Marketing, Auth, DB und Schemas ohne Typfehler; finaler Renderer-Typecheck nach Audit-Story ebenfalls PASS, 115,8 s |
| `pnpm test` | **PASS** | Renderer: 135 Tests, 0 Fehler, ca. 33,8 s |
| `pnpm audit:crosstalk` | **PASS** | Token-Crosstalk-Prüfung grün |
| `pnpm check:hardcoded-colors` | **PASS** | 69 aktuelle Referenzen gegenüber Baseline 209; keine Regression |
| `pnpm check:tokens` | **PASS** | 220 Templates, 54 Tokens, 3.042 Referenzen, 5/5 Gates |
| `pnpm audit:demos` | **PASS** | 18 Demo-Quellen, 0 Source-Integrity-Issues |
| `pnpm audit:sections` | **PASS mit Tool-Defekt** | meldet 250 Typen/0 Issues; Quellabgleich zeigt 222 kanonische Typen. 28 `*Verein`-Contract-Keys werden wegen unvollständiger Suffix-RegEx fälschlich als Typen gezählt |
| `pnpm check:section-colors` | **FAIL** | generierter Color Contract als driftend gemeldet, obwohl Summary Added/Removed/Changed jeweils 0 zeigt; Gate/Generatorzustand inkonsistent |
| `pnpm check:section-surface` | **FAIL** | generierte Section-Surface-Defaults nicht synchron; reale Main-Branch-Regression |
| `pnpm --filter @flamingo/admin build` | **NO-OP / CI-Defekt** | Exit 0 mit „No projects matched“; `apps/admin` existiert nicht |
| `pnpm --filter @flamingo/renderer build` | **PASS** | Next.js Production Build, ca. 221,4 s; public first-load ca. 496 kB, Demo ca. 500 kB, Page Editor ca. 818 kB |
| `pnpm --filter @flamingo/marketing build` | **PASS** | Next.js Production Build, ca. 187,2 s; zentrale Seiten ca. 223 kB first-load |
| `pnpm build-storybook` | **PASS mit Budgetwarnung** | initialer Section-Lab Build ca. 198,6 s; finaler Build mit audit-only Katalog ca. 36,7 s; der große Section-Lab-Chunk bleibt ein separates Budgetthema |
| `pnpm qa:live-demos` | **PASS** | 36/36 Playwright-Smokes, 18 Tenants × Desktop/Mobile, 3,2 min |
| temporärer All-Section-Playwright-Runner | **PASS mit Findings und Reproduktionslücke** | 208 Fixture-Sections, 4 Viewports = 832 Zustände plus 208 Long-copy- und 208 Reduced-motion-States; 0 Route-Load-/Hard-Render-Ausfälle, aber 1 Hydration-`pageerror`; 335 s; zwei gezielte Rechecks. Vollständige Rohdatei: `C:\Users\vonin-ju\AppData\Local\Temp\flamingo-section-matrix-audit-20260711\results-final.json`; der ursprüngliche Inline-Runner wurde nicht persistiert |
| `node scripts/serve-storybook-static.mjs apps/renderer/storybook-static 6007` | **PASS / Testserver** | audit-only statischer Server auf `127.0.0.1`; kein Production-Server oder Produktpfad |
| `node --check scripts/audit-section-storybook.mjs` / `node --check scripts/serve-storybook-static.mjs` | **PASS** | beide audit-only Node-Skripte nach finalem Stand syntaktisch gültig |
| `node scripts/audit-section-storybook.mjs --base-url http://127.0.0.1:6007 --workers 4` | **PASS mit Findings** | 553 Definitionen → 222 Typen → 271 sinnvolle Renderer-Varianten; 14 Zustände je Variante, 3.794/3.794 aufgezeichnet, 0 Hard Failures, ca. 411 s. Portable Rohdaten: `evidence/section-extreme-matrix-summary.json` |
| derselbe Runner mit `--limit 1 --workers 1` nach Dokumentabschluss | **PASS** | Reproduzierbarkeits-Smoke: 1 Variante × 14 Zustände, 14/14 aufgezeichnet, 0 Hard Failures und 0 Page-/Console-Errors; ca. 4 s Runnerzeit |
| derselbe Runner mit `--visual-only` | **PASS** | 271/271 gesetzte Desktop-Default-Renders nach Font-/Image-Wait und kompletter Scroll-Settling-Sequenz; ca. 204 s; 14 Contact Sheets anschließend visuell geprüft |
| derselbe Runner mit `--keyboard-only` | **PASS** | korrigierter Tab-Algorithmus schließt `tabindex<0` aus und modelliert Radio-Gruppen als einen Tab-Stop; 271/271 Varianten, 0 unerreichbare sichtbare Controls, 0 Varianten ohne erkennbaren Focus Indicator; ca. 105 s |
| gezielter settled-default Axe-Recheck | **Findings** | `galleryGrid`/`galleryMoodboard`: 0 Violations; `headerBanner`: 1 kritischer `button-name`-Node; `priceCalculator`: 2 kritische `button-name`- und 13 ernste Contrast-Nodes; `rsvp`: 1 kritischer Label-Node; `shopProductGrid`: 2 kritische Label-, 1 kritischer Select-Name- und 2 ernste Contrast-Nodes. Rohresultat ist in der Extreme-Matrix eingebettet; kein Full-Matrix-Axe-Lauf |
| Audit-Dokument-/Evidence-Validatoren | **PASS** | 11/11 Pflichtdokumente; 222 Inventar- und 222 Qualitätszeilen; F-001–F-041 vollständig/eindeutig; Roadmap 1–30; 18/18 Evidence-Dateien vorhanden und SHA-256 korrekt; lokale Markdown-Links gültig; UTF-8 ohne Mojibake/Replacement-Zeichen; kein Vercel-PAT-Literal |

## Browser- und Runtime-Inspektion

### Öffentliche Demos

Basis: `https://www.demo.flamingomedia.online`

- alle 18 Demo-Tenants: `handwerk`, `restaurant`, `hotel`, `medical`, `salon`, `tourism`, `wedding`, `photography`, `consulting`, `realestate`, `cafe`, `tattoo`, `shop`, `retail`, `florist`, `fitness`, `location`, `eishockey`;
- visuelle Portfolio-Ähnlichkeits-/Längenstichprobe: 17 Tenants ohne Handwerk; Handwerk separat mit tieferer Unterseiten-/Scrollprüfung;
- Desktop 1.440 px und Mobile 390 px für alle Tenants;
- Handwerk zusätzlich 768 px und Unterseiten/Scrollrichtungswechsel;
- kompletter Seiten-Scroll, sichtbare Navigation, CTA, Overlays und Console Exceptions;
- `/demo/showcase` auf Desktop/Mobile;
- isolierte `/section-preview`-Routen für FAQ und Timeline;
- `/robots.txt` und Sitemap-Verweis.

Ergebnis: keine JavaScript-Ausnahme in 34 automatisierten Full-scroll-Pässen außerhalb Handwerk; die offiziellen 36 Semantic/Responsive/A11y-Smokes sind grün. Trotzdem wurden reproduzierbare visuelle Fehler gefunden: unsichtbare sekundäre Hero-CTAs, Timeline ohne lesbare Achse, FAQ-Leerraum, Hotel-Dekoration über Text, falscher Showcase-Viewport, mobile Overlay-Kollisionen und nahezu identische Demo-Dramaturgien.

### Realer Admin

Einstieg: `https://www.demo.flamingomedia.online/admin/demo-login?industry=handwerk`

Inspiziert:

- Dashboard und Onboarding-Tour;
- `/admin/pages` inklusive Retry;
- Page Editor bei Desktop, 768 px und 390 px;
- Section Picker;
- geöffnetes Section-Formular;
- Side-by-side Preview;
- Navigation, Media und Brand/Design;
- statische `/demo/admin`-Referenz als Vergleich, nicht als echte CMS-Runtime.

Bestätigt: `/admin/pages` endet nach öffentlichem Demo-Login reproduzierbar in einer RSC Error Boundary, Digest `1429267296`; Retry ändert den Zustand nicht. Außerdem kollidieren Tour, Cookie-Banner, Tooltips und mobile Aktionen. Positiv: Side-by-side Preview ist eine gute Basis.

## Screenshot Evidence

| Scope | Path |
|---|---|
| Portable, gehashte Kernevidenz | [Evidence Manifest](evidence/README.md) |
| Production-Route Section Matrix (komprimiert) | [JSON](evidence/section-runtime-matrix-summary.json) |
| Vollständige Storybook Extreme-State-Matrix | [JSON](evidence/section-extreme-matrix-summary.json) |
| 271 gesetzte Default-Captures + 14 Contact Sheets | `C:\Users\vonin-ju\AppData\Local\Temp\flamingo-section-extreme-audit-20260711-visual-final\` |
| 17 Tenant-Full-QA + Showcase/Section Preview | `C:\Users\vonin-ju\AppData\Local\Temp\flamingo-visual-qa-20260711-094418-000d54d5\` |
| Handwerk responsive/detail QA | `C:\Users\vonin-ju\AppData\Local\Temp\flamingo-handwerk-qa-20260711-094351\screenshots\` |
| Real/Admin comparison QA | `C:\Users\vonin-ju\AppData\Local\Temp\flamingo-admin-audit-20260711\screenshots\` |
| Original timeline screenshot | `C:\Users\vonin-ju\AppData\Local\Temp\codex-clipboard-99d0895d-a59a-4207-9f83-6f4e8667f19a.png` |
| Original FAQ screenshot | `C:\Users\vonin-ju\AppData\Local\Temp\codex-clipboard-ce529951-772c-454e-857f-f4dc05933d91.png` |

Besonders relevante Dateien sind dauerhaft im [Evidence Manifest](evidence/README.md) verlinkt; die lokalen Verzeichnisse enthalten zusätzlich alle Full-page- und Zwischenzustände.

### Extreme-State-Harness reproduzieren

Aus dem Repository-Root zunächst Storybook bauen und den audit-only Static Server in einem eigenen Terminal starten:

```powershell
pnpm build-storybook
node scripts/serve-storybook-static.mjs apps/renderer/storybook-static 6007
```

In einem zweiten Terminal erzeugt dieser Command eine frische vollständige Basismatrix, ohne die kuratierte Evidenzdatei mit nachträglich eingebetteten Axe-Rechecks zu überschreiben:

```powershell
node scripts/audit-section-storybook.mjs --base-url http://127.0.0.1:6007 --workers 4 --output "$env:TEMP\flamingo-section-extreme-repro.json"
```

Die gesetzten Visual- und korrigierten Keyboard-Sonderläufe sollten eigene temporäre Output-Dateien verwenden, damit sie die 14-State-Matrix nicht überschreiben:

```powershell
node scripts/audit-section-storybook.mjs --base-url http://127.0.0.1:6007 --workers 4 --visual-only --output "$env:TEMP\flamingo-section-visual.json" --screenshots "$env:TEMP\flamingo-section-extreme-audit\screenshots"
node scripts/audit-section-storybook.mjs --base-url http://127.0.0.1:6007 --workers 4 --keyboard-only --output "$env:TEMP\flamingo-section-keyboard.json"
```

Der Storybook-Harness ist wiederholbar und audit-only; externe Bilder/APIs können einzelne Console-Signale beeinflussen. Er ersetzt weder die Next-Production-Route-Matrix noch echte Tenant-/RSC-/Next-Image-/Hydration-Tests.

## Static Security/Logic Verification

Die folgenden kritischen Pfade wurden bis zu Route, Session Guard, Query und Side Effect verfolgt:

- freie Marketing-Mailroute -> Nodemailer/SMTP;
- öffentlicher Demo-JWT -> Server Actions -> Media/Pages/Settings/Publish;
- Public Snapshot Meta -> catch/null -> Draft-Tabellen;
- Admin/PAT Publish -> Snapshot/History/Page status/cache;
- Reservation Update -> ID-only predicate;
- Page CRUD -> Slug unique constraint, Navigation JSON und optimistic editor state;
- Media list/delete -> Blob HEAD/delete und DB writes;
- Stripe/PayPal/SumUp callbacks -> tenant/payment checks;
- PAT creation/auth -> hash, expiry, tenant resolution und fehlende scopes.

Es wurde **kein** praktischer Angriff auf Production durchgeführt. Die Demo-/Tenant-/Snapshot-/Publish-Pfade sind direkt im Code beweisbar. Die Mailroute ist unauthentifiziert implementiert; ob Production-SMTP im geprüften Deployment aktiv ist, wurde nicht durch einen Versand getestet. Demo-Daten wurden nicht destruktiv verändert.

## Section Coverage und Grenzen

- 222 kanonische Typen, 553 Owner-Definitionen, 205 Admin-selectable und 217 mit API-Schema wurden aus Registry, Picker, Schemas, Preview Fixtures, Editors und Contracts abgeglichen. Gleiche Komponentenziele wurden auf 271 sinnvolle `(type, component identity)`-Renderer-Varianten dedupliziert.
- Das Inventar enthält pro Typ exakte Top-level-/Nested-Verträge, Required/Optional, Media, CTA, Breakpointsignale, Dependencies und konkrete Editor-/Rendererpfade.
- **Production Route:** 208 Fixture-Typen liefen bei 1.440, 1.024, 430 und 390 px: 832 Viewportzustände plus je 208 Long-copy- und Reduced-motion-States. 0 Route-Load-/Hard-Render-Ausfälle; 1 horizontaler Overflow (`testimonialMarquee`), 1 reproduzierter Hydration Error (`availabilityCalendar`), 1 gebrochenes Fixture-Bild (`faqGallery`), 6 Heading-Level-Sprünge, 3 Typen mit heuristisch unbenannten Controls und 10 Typen mit kontinuierlicher CSS-Animation trotz Reduced Motion.
- **Audit-only Storybook:** Alle 271 Varianten und damit alle 222 Typen liefen in 14 Zuständen: vier Viewports; Default; 1, 2, odd 3 und 9 Items; Long/translated Copy; Missing/Portrait/Landscape/1-px-Low-quality Media; explizite Light-/Dark-Palette; Reduced Motion; CSS-Zoom-2-Proxy; komplette Tab-Sequenz und erste fünf ungefährliche Control-Aktivierungen. 3.794/3.794 Zustände wurden aufgezeichnet, 0 Hard Failures und 0 `pageerror`-States. 12 States enthielten überwiegend Storybook-/externe-Service-Console-Errors.
- Die Extreme-Matrix meldet 16 Body-Overflow-, 46 Clipping-, 24 Broken-Image-, 65 Unnamed-Interactive- und 479 Solid-Background-Contrast-Signal-States. Das sind Triage-Heuristiken, keine entsprechende Zahl bestätigter Produktbugs: Dark-Palette-Stress dominiert Contrast; Clamping kann beabsichtigt sein; Broken Images stammen überwiegend aus dem absichtlichen Missing-Media-State. Belastbar sind Expanded-Content-Overflows in acht Komponentenfamilien, Missing-Media-Broken-Images in 13 Varianten und ein Zoom-Overflow. `testimonialMarquee` bleibt zusätzlich auf der Production Route bestätigt.
- Reduced Motion ist zweigeteilt: 10 Production-Route-Typen zeigen kontinuierliche CSS-Animation; unmittelbar nach Storybook-Render laufen in 95/271 Varianten noch Animationen, darunter endliche Entrances. Der korrigierte Keyboard-Lauf erreicht dagegen in 271/271 Varianten alle erwarteten sichtbaren Tab-Controls und findet überall einen sichtbaren Focus Indicator.
- Der gezielte Axe-Recheck bestätigt kritische Naming-/Label-Probleme in vier Default-Typen (`headerBanner`, `priceCalculator`, `rsvp`, `shopProductGrid`); `galleryGrid` und `galleryMoodboard` sind im geschlossenen Defaultzustand ohne Violations. Icon-only Lightbox-Controls bleiben beim Öffnen eine Source-Level-Labelling-Lücke.
- [Production-Route-Rohdaten](evidence/section-runtime-matrix-summary.json), [vollständige Extreme-State-Rohdaten](evidence/section-extreme-matrix-summary.json) und die 222 individuellen Score-/Focus-Zeilen stehen in `05-section-quality-matrix.md`.
- **Verbleibende Grenzen:** CSS `zoom: 2` ist nur ein Reflow-Proxy, kein nativer Browser-Chrome-Zoom bei 200 %. Synthetische Portrait-/Landscape-/1-px-Medien ersetzen keinen realen fotografischen Qualitäts-/Crop-Korpus. Die Dark-Palette ist ein Design-System-Stresstest, kein bereits unterstützter Produktmodus. Vollständige manuelle Screen-Reader-/Switch-Control-Prüfung, ein Full-Matrix-Axe-Lauf und alle realen Tenant-Tokenkombinationen bleiben offen. Storybook kann Production-RSC, Next Image und Hydration nicht beweisen; deshalb bleiben beide Matrizen getrennt verpflichtend.

## Environment Limitations / Unverified

| Bereich | Blocker | Status |
|---|---|---|
| Datenbank-/Migration-Runtime | keine lokale `DATABASE_URL` oder produktionsnahe Test-DB | Schema/Migrationen statisch geprüft; echte Rollback-/Fault-Injection-Tests offen |
| SMTP/Blob/Payments | keine isolierten Provider-Testcredentials | Codepfade geprüft; keine echte Mail, Blob-Delete oder Paymenttransaktion ausgelöst |
| Vercel Logs/Tracing | kein sicher eingebundener, rotierter Runtime-Zugang im Auditprozess | Ursache des RSC-Digests bleibt hinter Error Boundary unverifiziert |
| Lighthouse/Web Vitals | kein reproduzierbarer lokaler Daten-/Deployment-Stack; Browser-QA priorisiert | Builds/Bundles gemessen; echte LCP/INP/CLS pro Tenant offen |
| Concurrency | keine realistische Multi-Session-Test-DB | Race-Risiken aus Code bewiesen/hochkonfident; Last-/Conflict-Test offen |
| Accessibility | Live-Smokes, korrigierter 271-Varianten-Keyboard-Lauf und gezielte Axe-Rechecks vorhanden | vollständiger Screen-Reader-, nativer 200%-Zoom-, Switch-Control- und Full-Matrix-Axe-Test offen |
| Visual Regression | audit-only 271-Varianten-Captures vorhanden; bestehender Produkt-Test überspringt ohne `VISUAL_REGRESSION=1`; keine reviewte Baseline | Contact Sheets/Rohscreens vorhanden, verbindliches CI-Gate fehlt |
| Privacy/Retention | keine produktive Daten-/Policy-Einsicht | Datenflächen inventarisiert; rechtliche Fristen/DSAR-Prozess offen |

## Interpretation

Grüne Builds und Smokes bedeuten: Die Codebase ist grundsätzlich baubar und viele Basissicherungen funktionieren. Sie widerlegen nicht die kritischen Autorisierungs- und Publishing-Pfade oder die sichtbaren Qualitätsprobleme. Zwei fehlgeschlagene Section-Gates, der No-op-Admin-CI-Schritt und der Live-Admin-Crash zeigen, dass der aktuelle „grüne“ Gesamtstatus nicht releasefähig genug ist.
