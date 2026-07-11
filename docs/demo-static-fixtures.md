# Static demo fixtures

The files in `apps/renderer/src/app/demo/pages` and the matching data in
`demo-data.ts` are deprecated development fixtures. Public demo routes use the
database-backed tenant snapshot as their only production source of truth.

For local debugging, fixtures can be enabled explicitly:

```powershell
$env:DEMO_STATIC_FALLBACK='1'
pnpm dev:renderer
```

The flag is ignored when `NODE_ENV=production`. A missing tenant returns 404;
a failed database lookup remains an operational error. This prevents a database
incident or provisioning gap from silently publishing an outdated persona.

Long term, replace hand-maintained fixtures with generated, versioned snapshots
created from the same reviewed demo manifests as the live tenants. Generation
should include a content hash, schema version, validation report, and explicit
expiry, so local/offline previews stay reproducible without becoming a second
manually maintained content source.
