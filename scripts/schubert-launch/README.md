# Schubert launch content operations

This directory refines and publishes only `schubert-design` and `schubert-grabdenkmal`. The protected central Flamingo database is outside this workflow. Tenant product and visual rules are in [`docs/sites/schubert`](../../docs/sites/schubert/README.md).

## Inputs and pure preparation

Keep fresh, sanitized `design-before.json` and `grab-before.json` exports in an operational directory. Each export contains the exact tenant identity, draft pages/sections/collections/items, current active snapshot, settings, navigation and footer. Preserve the original exports for recovery. Do not commit exports, credentials or operational media dumps.

From the repository root:

```powershell
node scripts/schubert-launch/prepare-content.mjs tmp/schubert-launch-2026-10-19
```

The optional directory argument defaults to the directory shown above. Preparation only reads and writes local files: it performs no network requests and opens no database connections. It produces `design-after.json` and `grab-after.json`, preserving public route and collection identities while rebuilding the intended section compositions and snapshot representation.

An optional `asset-map.json` in the same directory is a JSON object mapping an original public URL to its approved replacement public URL. If it is absent, preparation uses the bundled `scripts/schubert-launch/asset-map.json`. Preparation recursively substitutes exact string matches. The map does not upload assets or check permission, content or HTTP availability. Verify the mapped assets separately before publication.

The bundled `media-manifest.json` records the original source, SHA-256 checksum, size and dimensions of ten original assets copied without modification. It documents the copied files; it contains no credentials.

## Review and dry run

Review the prepared copy, legal/contact details, all routes, photographs and template contracts. Run the relevant renderer checks and the bounded desktop/mobile browser audit before publication. No tool here provides an automatic legal or editorial approval.

```powershell
pnpm exec tsx --tsconfig apps/renderer/tsconfig.json scripts/schubert-launch/publish-content.ts design
pnpm exec tsx --tsconfig apps/renderer/tsconfig.json scripts/schubert-launch/publish-content.ts grab
```

Dry run is the default. `SCHUBERT_CONTENT_DIR` selects another input directory. Dry run validates the payloads, constructs the canonical snapshot and prints a summary without opening a database connection.

## Audit the public standalone sites

The temporary local `/quality/...` fixture route used during implementation is not delivered with the renderer. Use public mode for release verification:

```powershell
$env:SCHUBERT_QA_PUBLIC = '1'
$env:SCHUBERT_QA_ROUND = 'production'
node scripts/schubert-launch/audit-browser.mjs
```

The audit reads the prepared `design-after.json` and `grab-after.json` from `SCHUBERT_CONTENT_DIR` (or the default operational directory) to enumerate both sites' visible pages and published collection details. It uses the two configured standalone production URLs, with desktop 1440×1000 and mobile 390×844 viewports, and writes screenshots plus `audit.json` into `review-production/`. Chrome, Playwright and `@axe-core/playwright` must be available in the execution environment.

Optional `SCHUBERT_QA_ROUTES` is a comma-separated selection of `site:slug` entries, for example `design:kontakt,grab:c/leistungen/grabdenkmale`; omit it for the complete audit. `SCHUBERT_QA_URL` applies only to the temporary local fixture mode. The audit blocks contact/form submissions and never sends an inquiry. A nonzero exit code indicates recorded faults requiring review.

## Apply to an isolated tenant database

Supply credentials through the secure execution environment. Never paste them into this README, command history, logs or content files.

- `DATABASE_URL`: the selected tenant's isolated Neon database, with permissions needed for the content transaction.
- `REVALIDATE_SECRET`: the selected standalone renderer's existing revalidation secret.
- `SCHUBERT_CONTENT_DIR`: optional input/output directory.

```powershell
pnpm exec tsx --tsconfig apps/renderer/tsconfig.json scripts/schubert-launch/publish-content.ts design --apply
# Run the grab command in an environment containing Grab's own credentials.
pnpm exec tsx --tsconfig apps/renderer/tsconfig.json scripts/schubert-launch/publish-content.ts grab --apply
```

The publisher checks the exact allowed tenant UUID/slug, expected isolated Neon endpoint, route identities, ownership, duplicate IDs, section definitions and approved contact address before opening the connection. It then takes a tenant advisory lock and compares the current active snapshot and draft rows with the original export. A concurrent CMS edit or publication aborts the transaction; export again and reconcile rather than bypassing the guard.

Settings, navigation, footer, page/collection content, notification recipient and the new active publication are synchronized in one transaction. For Grab only, the publisher also registers the ten manifest assets in `media_assets` using `ON CONFLICT DO NOTHING`; it leaves existing asset rows intact. The publisher reuses the production canonical checksum and atomic snapshot helper. Historical snapshots and publication history remain available. It writes a small `*-publication.json` result locally.

When `REVALIDATE_SECRET` is supplied, apply calls the selected standalone's `/api/revalidate?tenant=...` endpoint after commit. A failed invalidation means the publication may already be committed; inspect the result and retry invalidation, rather than blindly republishing. Without the secret, explicit cache invalidation remains an operator responsibility.

Deploy required renderer template changes to both standalone projects before final acceptance. Both must be READY on the same intended code revision. Check actual production URLs, styles/scripts, content, all page/detail routes, heading outlines, mobile navigation and privacy/cookie controls. Verify each publication result and tenant cache invalidation, plus the actual notification recipient and SMTP configuration. SMTP connection verification without sending mail does not prove inquiry delivery. Do not send real form messages as part of a visual audit.

## Recovery and rollback

Preserve the original export, applied result and deployed source revision. Snapshot rollback alone restores published section content, but does not restore global settings, navigation, footer or CMS drafts.

For a complete content restore, export the current state as the new guarded `*-before.json`, prepare a reviewed `*-after.json` using the saved original content, and publish it through the same isolated transaction. This creates a new history entry and restores matching drafts/settings. Keep the source templates compatible with the restored content. Never erase publication history or renumber old snapshot versions.

## Release record

The durable production gates are in `docs/sites/schubert/README.md`. Keep run-specific source revision, deployment IDs, visual verdict, publication results, production checks and limitations in the local operational directory, deliberately outside Git: `audit-final.json`, `*-publication.json` and `release.json`. Preserve the records alongside recovery inputs. Do not commit exports or secrets, and do not create a source-only status commit merely to update deployment progress.
