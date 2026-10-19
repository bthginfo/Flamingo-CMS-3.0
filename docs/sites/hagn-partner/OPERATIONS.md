# Standalone operation

## Isolation

- Tenant: `a1853e0f-ff90-45ee-8fb2-8bada3812f67`, slug `hagn-partner`.
- Vercel: `flamingo-hagn-partner`, project `prj_16hFgzuMqFNt2DItBUgrukVwWMMO`.
- Neon: `withered-truth-75649965`, own production branch `br-patient-sky-b90jy4gz`, Frankfurt.
- The Neon organization was positively verified as `free` before creation. No paid-plan override was used.
- Renderer uses a SQL-created pooled role with data permissions, without schema ownership or inherited administrator membership. All six PostgreSQL capability checks are verified false. The shared provisioner now rejects privileged API-created roles and creates restricted roles through SQL. Migrations/imports require a separate owner connection. Bootstrap/import commands reject every other database host before opening a connection.
- No central Flamingo SQL access is used by these provisioning/import commands or the fixed-tenant renderer.

## Public access and database consumption

The new project sets `STANDALONE_PUBLIC_STATUS_CACHE_SECONDS=3600`. Published content and public settings also use the renderer's existing tenant-tagged caches. Saving settings, publishing and authenticated revalidation invalidate the corresponding tag.

This option changes only the public standalone active-status mirror. Without an override, all other projects retain the existing 60-second behavior. CMS sessions and PAT authorization continue to read current tenant status and revocation state. An external status change without cache invalidation can remain visible publicly for up to the configured hour; invalidate the tenant tag when suspending/reactivating this site.

Compute is fixed at 0.25 CU, with Free-plan automatic suspension. The Neon API value `suspend_timeout_seconds=0` means the default five-minute inactivity timeout, as documented in Neon's official API rules. No cron credential or database keep-alive is provisioned for this site. Caching reduces public read traffic; CMS/API use and cold cache refreshes still consume database resources. Monthly Free limits are not guaranteed by configuration alone.

## Mail and media

The recipient is `info@hagn-partner.de`. Platform SMTP uses the existing authenticated IONOS sender over port 587; it does not impersonate the law firm's domain. Delivery tests must not send actual enquiries without an explicit request. Browser verification blocks contact/form submission endpoints.

Original images and PDFs are imported into `apps/renderer/public/hagn-partner` with a source/hash inventory. They are served independently of the old website. CMS media uploads have a configured Blob token. A separate store-connection request was unnecessary because that token already existed in the new project's environment.

## Credentials

Administrator credentials and the tenant content API token are generated uniquely. A recovery copy is encrypted with Windows DPAPI for the current Windows user, outside this repository. No plaintext credentials, connection URLs or `.env` exports belong in Git, screenshots, build logs or documentation. Vercel production secrets are scoped to this project; preview deployments have no production database credentials.

## Search and domain migration

The accessible standalone staging domain is `https://flamingo-hagn-partner.vercel.app`. Titles, descriptions, canonical URLs, Open Graph data and local business information are stored in the CMS. Staging pages use `noindex,nofollow` to avoid competing with the current original website.

The existing `www.hagn-partner.de` domain and DNS are not changed by this launch. When the owner chooses the actual domain switch, attach/verify it in Vercel, update the tenant domain, `SITE_URL` and canonical base, change per-page canonicals together, then remove staging noindex and verify redirects, robots and sitemap on the final domain. Preserve the meaningful original route paths.

## Import and rollback

1. Build the pure content export with `scripts/hagn-partner/prepare-content.mjs`.
2. Validate with `scripts/hagn-partner/publish-content.ts` without `--apply`.
3. Supply the isolated owner connection privately and use `--apply`. After the initial import, `HAGN_EXPECTED_ACTIVE_CHECKSUM` must equal the current active publication. The publisher compares the complete draft/settings again inside its transaction to reject concurrent CMS edits.
4. Revalidate the actual target only after successful publication. Use the existing CMS publication history for subsequent editorial rollbacks.

The launch evidence and deployment identifiers are saved in the ignored `tmp/hagn-partner-2026-10-19` operational directory. That evidence is separate from design approval and never replaces a real browser check.
