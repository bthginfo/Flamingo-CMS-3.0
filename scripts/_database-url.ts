/**
 * Fail closed when a maintenance script is started without an explicit DB.
 * Never add a credential-bearing fallback here or in an individual script.
 */
export function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for this maintenance script.');
  }
  return databaseUrl;
}
