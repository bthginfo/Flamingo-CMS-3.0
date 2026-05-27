# Lead-Shared Renderer

## Ziel

Leads sollen eigene Demo-Tenants bekommen, die im CRM schnell angelegt und als persönliche Vorschau verschickt werden können. Diese Leads laufen zuerst günstig auf dem gemeinsamen Renderer, haben aber eigene Inhalte, eigenes Admin-Passwort und eigene Vorschau-URL.

## Umgesetzt in diesem Branch

- Neuer Deployment-Modus `lead_shared` zusätzlich zu `shared` und `standalone`.
- `lead_shared` nutzt den normalen Shared Renderer. Es wird kein Vercel-Projekt pro Lead erstellt.
- URL ohne Custom Domain: `${RENDERER_URL}/:tenantSlug`.
- Admin-Login: `${RENDERER_URL}/admin/login?tenant=:tenantSlug`.
- Beim Provisioning wird `isLead = true` automatisch gesetzt.
- Im CRM gibt es neben `Shared Renderer` und `Standalone Projekt` jetzt `Lead-Shared`.
- Lead-Shared-Tenants können per CRM-Aktion in ein Standalone-Projekt umgezogen werden.

## Umzug zu Standalone

Der Tenant bleibt bestehen. Es wird kein Content exportiert oder importiert.

1. CRM-Aktion „Zu Standalone umziehen“ auslösen.
2. Standalone-Vercel-Projekt `flamingo-:slug` erstellen.
3. Preview-Domain `flamingo-:slug.vercel.app` eintragen.
4. `deploymentMode` auf `standalone` setzen.
5. `isLead` auf `false` setzen.

## DB-Themen

- Migration `0003_location_lead_shared.sql` erweitert `deployment_mode` um `lead_shared`.
- Dieselbe Migration erweitert `industry` um `location`.
- Optional später sinnvoll:
  - `lead_expires_at`
  - `lead_converted_at`
  - `lead_owner_note`
  - noindex/robots-Flag für Lead-Shared

## Offene Entscheidungen

- Ob Lead-Shared später zusätzlich eine eigene Lead-Domain wie `leads.flamingomedia.online/:slug` bekommt.
- Ob Lead-Demos automatisch ablaufen sollen.
- Ob Lead-Admins veröffentlichen dürfen oder nur speichern/previewen dürfen.
