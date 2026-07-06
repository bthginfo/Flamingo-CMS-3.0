# Flamingo CMS 3.0 — Project Knowledge Base

This file is auto-loaded by Claude Code every session. Keep it high-signal:
architecture, conventions, and the non-obvious gotchas that are expensive to
re-discover. Update it when you learn something a future session would need.

## What this is

Multi-tenant SaaS CMS + renderer + industry ("Branchen") template system for
customer websites. One renderer serves many tenants; each tenant has an
`industry` that selects which section templates and colour contracts apply.

- `apps/renderer` — Next.js app: public sites, `/admin` CMS, `/demo/[industry]`
  showcases, `/api/v1/*` content + shop API.
- `packages/db` — Drizzle schema (`packages/db/src/schema/index.ts`).
- `scripts/demo-tenants` — declarative demo-tenant populate tooling.

## Colour / token system (read before touching any section colour)

Three layers: `--brand-*` (tenant) → `--token-*` (section slots) → per-section
`styleOverrides`. The canonical field set lives in
`apps/renderer/src/lib/section-color-fields.ts` (`FIELD_DEFS`: ColorFieldKey →
cssVar, e.g. `headingColor` → `--token-heading`).

- **Per-section contracts** are CODE-GENERATED from what each template actually
  reads via `var(--token-*)`:
  `node scripts/generate-section-color-contracts.cjs` writes
  `apps/renderer/src/lib/section-color-contracts-generated.ts`
  (`_GENERATED` per-industry `${type}${IndustryPascal}`, `_GENERIC` per-type,
  `_ANY` cross-industry union). **Regenerate after ANY template colour change.**
- Resolution mirror: `section-color-resolver.ts` `getFieldsForSection(type,
  industry)` = industry-specific → generic → any → `['sectionBg']`. Alias:
  `handwerk → tradesman`.
- **No borrowed-token fallbacks** like `var(--token-A, var(--token-B))` on role
  tokens — that was the historical crosstalk bug. Page-level defaults in
  `brand-colors.ts` make each slot resolve independently. Card/on-dark text slots
  are theme-aware (resolved per-section), so use them bare.
- CI gate: `npm run check:section-colors` = contracts in-sync + render-mirror +
  role-coverage (`--strict`) + crosstalk. Must be green before pushing colour
  changes. (`tattoo-booking` has one known benign `label` gap.)

## Template architecture (post-cleanup)

- styleVariants (`modern`/`bold`/`minimal`) are GONE — `effectiveStyleVariant`
  is hardcoded `'classic'` and all variant branches/functions were deleted
  (−40 kB First-Load JS on the tenant route). Do not reintroduce them.
- Shared primitives live in `templates/shared/industry-kit.tsx`
  (SectionProps/ButtonValue/asButton/asList + SectionHeader/CtaButton/
  ImageCard/IconRows). The per-industry `types.ts`/`shared.tsx` of medical/
  tourism/salon/hotel/restaurant are thin re-exports. medical↔tourism
  story/faq/testimonials are wrappers around `templates/shared/
  industry-sections.tsx` (defaults = copy + fallback icon only).
- Every section type needs: registry entry (`templates/index.ts`
  SHARED_TEMPLATES or industry map), catalog entry (`admin/pages/[id]/
  section-types.ts`), data schema (`lib/section-data-schemas.ts`) AND
  preview data (`lib/section-preview-data.ts` — otherwise /demo/showcase
  previews render blank).
- `/demo/showcase` is NOT a tenant page: it's a static route
  (`app/demo/showcase/page.tsx`) that renders `/section-preview?type=X` in
  an iframe per catalogued type.
- Demo-tenant admin access without PATs: `GET /admin/demo-login?industry=<key>`
  issues a 1h admin JWT (rate-limited 10/h per IP). AI-API PATs can only be
  (re)created via the admin UI server action and REVOKE existing tokens.

## Backend gotchas (these cost hours — do not re-learn them)

- **The DB driver (neon-http) has NO transactions.** Two consequences:
  1. `POST /publish` returns `500 "No transactions support in neon-http
     driver"`. This is expected; pages are created already-published and items
     with `published:true`, so **content is live without a successful publish**
     (the renderer reads the current state, not a publish snapshot). Treat
     publish failures as warnings.
  2. `createPage` inserts the page row BEFORE validating sections. A section
     validation `400` therefore leaves a **partial page row** with no rollback,
     so a naive retry collides on the unique slug with a `500`. Always make the
     FIRST POST clean; if you must retry, delete the partial row by slug first.
- **styleOverrides are validated strictly per section type.** The API rejects
  any `--token-*` a section doesn't render ("is not used by section type X",
  with a "Did you mean …?" hint). `/api/v1/instructions sectionStyleContracts`
  is now COMPLETE: borrowed/alias types (`story`, `contactLocation`, …) are
  appended with `source: 'borrowed'`. `scripts/demo-tenants/_lib/contracts.cjs`
  resolves the same contracts offline from the generated files.
- The keyword `transparent` is rejected as a style value — use `rgba(0,0,0,0)`.
- **Node's `https`/`fetch` ignore `HTTPS_PROXY`** in the sandbox, so direct
  egress is blocked. Tunnel via an HTTP CONNECT agent using `HTTPS_PROXY` +
  `/root/.ccr/ca-bundle.crt` (see `scripts/demo-tenants/_lib/api.cjs`
  `makeProxyAgent`). To view live pages, drive headless Chromium at
  `/opt/pw-browsers/chromium*/chrome-linux/` through the proxy, or fetch HTML via
  the CONNECT-agent.

## Demo tenants

- 13 declarative tenants in `scripts/demo-tenants/*.cjs` (export
  `{slug, pat, brand, pages, collections, …}`), run via
  `node scripts/demo-tenants/run-all.cjs [names…]`. PATs are injected from
  `PAT_<SLUG>` env vars — never commit live PATs.
- The runner (`_lib/runner.cjs`) trims each section's styleOverrides to its
  resolved contract before POST, wipes via `debug()` (not `GET /collections`,
  which omits items), and tolerates the publish 500.
- `_lib/theme.cjs` `darkTokens()` / per-tenant `darkSectionTokens` spread a full
  light-on-dark token set into dark sections; the runner trims the extras.
- 4 legacy tenants (florist, fitness, location, consulting) only have older
  `scripts/populate-*.mjs` (plain-key styleOverrides + direct `fetch`). Run them
  through `scripts/demo-tenants/run-legacy.cjs <path.mjs> <TOKEN_ENV>` which
  monkeypatches `fetch`: proxy tunnel + plain→`--token-*` mapping + contract
  trim + publish swallow.
- Demo public routes are `/demo/<industryKey>` (see IndustryKey in
  `demo-data.ts`). Note: ecommerce → `/demo/shop`, tourismus → `/demo/tourism`.
- Validate dark sections offline: `node scripts/demo-tenants/validate-contrast.cjs`.

## Shop

- Shop addon active = `tenantAddons` row, `addonKey='shop'`, `active=true`.
  Helper: `isShopActive(tenantId)` in `apps/renderer/src/lib/shop-pages.ts`.
- `ensureShopPages` auto-creates system pages incl. `widerrufsbelehrung`.
  The footer shows a prominent Widerruf link when `shopEnabled` (legal req).
- Shop sections live in `apps/renderer/src/templates/shared/shop-*.tsx`; section
  editors are in `apps/renderer/src/app/admin/pages/[id]/section-data-editor.tsx`.

## Conventions

- Develop on the assigned feature branch; deploy = push to `main` (Vercel
  auto-deploys). Commits are SSH-signed; keep committer `Claude
  <noreply@anthropic.com>`.
- Match surrounding code style. Run `apps/renderer` `npx tsc --noEmit` and the
  colour gate before pushing renderer changes.
- After template data-field changes: `npm run sync:section-surface` and commit
  the regenerated defaults (CI gate: `npm run check:section-surface`).
- **DB migrations are NOT auto-applied.** New SQL files in
  `packages/db/drizzle/` must be applied manually against the production DB:
  `DATABASE_URL=… pnpm --filter @flamingo/db push` (or run the SQL directly).
  The sandbox has no `DATABASE_URL` — applying migrations is a user action.
  Pending: `0012_media_assets_dedupe_unique.sql` (media duplicate guard).
