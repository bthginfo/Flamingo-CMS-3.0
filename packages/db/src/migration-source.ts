import { createHash } from 'node:crypto';

/** Windows checkouts and Linux deployments must share one migration identity. */
export function getMigrationSource(source: string, applied: ReadonlySet<string> = new Set()) {
  const sqlText = source.replace(/\r\n?/g, '\n');
  const digest = (value: string) => createHash('sha256').update(value).digest('hex');
  const hash = digest(sqlText);
  // Recognize the old platform-dependent hashes without executing their SQL
  // again. Adopting the canonical hash only appends to the migration ledger.
  const hashes = [...new Set([hash, digest(source), digest(sqlText.replace(/\n/g, '\r\n'))])];
  return { sqlText, hash, hashes, alreadyApplied: hashes.some(value => applied.has(value)) };
}
