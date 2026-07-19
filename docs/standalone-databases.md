# Standalone tenant databases

## Architecture

- The marketing/CRM database is the control plane. It retains tenant identity, domains, CRM leads/customers and an encrypted database registry.
- A new `standalone` tenant gets its own Neon project, production branch and `flamingo` database.
- The tenant Vercel project receives only that tenant's pooled `DATABASE_URL` plus `FIXED_TENANT_ID`.
- Website content, admin credentials, submissions, shop, booking and integration data live in the dedicated database.
- `shared` and `lead_shared` tenants continue using the control-plane database until conversion.
- Connection URIs are AES-256-GCM encrypted in `tenant_database_connections`; they are never placed on the tenant row or logged.

## Required production configuration

Configure these on the marketing Vercel project:

- `NEON_API_KEY`: Neon organization API key with permission to create/delete projects.
- `NEON_ORG_ID`: optional when an organization API key already identifies the organization.
- `NEON_REGION_ID`: optional, defaults to `aws-eu-central-1`.
- `NEON_PG_VERSION`: optional, defaults to `17`.
- `CRM_CONFIG_ENCRYPTION_KEY`: stable random secret of at least 32 characters. Do not rotate without re-encrypting registry values.
- Existing Vercel provisioning variables (`VERCEL_TOKEN`, `VERCEL_TEAM_ID`, repository IDs, Blob configuration).

Add the same `CRM_CONFIG_ENCRYPTION_KEY` as a GitHub Actions repository secret. The database migration workflow migrates the control plane first and then every registered standalone database. A failed tenant migration fails the workflow and marks that database `migration_failed` instead of silently serving an incompatible schema.

## Provisioning and rollback

New standalone provisioning follows this order:

1. Create the control-plane tenant registry row.
2. Create and register a Neon project with encrypted connection URIs.
3. Apply the complete Drizzle migration history.
4. Seed all tenant data in the dedicated database.
5. Create/configure the Vercel project with the dedicated pooled URI and wait until the production deployment reports `READY`.
6. Attach domains and activate both control and data-plane tenant records.

If a required step fails, newly created Vercel/Neon resources and the control-plane tenant are removed. Existing Vercel auth and encryption secrets are preserved on retries; only `DATABASE_URL` and `FIXED_TENANT_ID` are updated.

## Existing standalone tenants

Legacy standalone tenants without a `tenant_database_connections` row still use the shared database. Migrate one explicitly:

```powershell
$env:TENANT_ID='<uuid>'
pnpm --filter @flamingo/marketing isolate:standalone
```

The CRM action for `shared` or `lead_shared → standalone` is fully automatic: it copies every tenant-owned table, waits for the isolated production deployment, compares every source/target table count and only then removes the shared customer-data copy in one transaction. A failed deployment or verification keeps the shared source and rolls back newly created infrastructure to the tenant's original mode and status.

The legacy isolation script remains a deliberately manual recovery tool. It copies the complete tenant data plane, switches the existing Vercel project and deploys it. After checking the public site, admin login, publish, form handling and paid features, remove only the old customer-data copy:

```powershell
$env:TENANT_ID='<uuid>'
$env:CONFIRM_TENANT_SLUG='<exact-slug>'
pnpm --filter @flamingo/marketing purge:standalone-shared-copy
```

The purge command verifies an active tenant and active snapshot in the dedicated database. The central tenant/domain registry remains intact.

## Operations

- Tenant deletion deletes its Vercel project and Neon project before the central registry row.
- CRM tenant details display the Neon project and isolation status.
- Domain checks and mutations target the standalone Vercel project, not the shared renderer.
- Run `pnpm --filter @flamingo/marketing migrate:standalone` only with the same encryption key used by the marketing application.
- Monitor Neon project quotas and billing. A project-per-tenant architecture provides isolation, but each project consumes account project quota and its own compute/storage allowance.
