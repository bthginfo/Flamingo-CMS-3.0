const forbiddenCapabilities = ['rolsuper', 'rolcreatedb', 'rolcreaterole', 'rolreplication', 'rolbypassrls', 'has_memberships'] as const;

/** Neon Console/API roles are administrator roles, even when named "app". */
export function assertRestrictedRuntimeRole(records: Array<Record<string, unknown>>) {
  if (records.length !== 1 || forbiddenCapabilities.some(capability => records[0][capability] !== false)) {
    throw new Error('Die Runtime-Rolle darf keine Verwaltungsrechte oder geerbten Rollen besitzen. Begrenzte Neon-Rollen müssen per SQL angelegt werden.');
  }
}
