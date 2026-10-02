/** Drivers may wrap SQLSTATE in one or more `cause` objects. Never expose SQL/params. */
export function databaseErrorCode(error: unknown): string | undefined {
  const seen = new Set<object>();
  let current = error;
  for (let depth = 0; depth < 8 && current && typeof current === 'object'; depth++) {
    if (seen.has(current)) break;
    seen.add(current);
    const candidate = current as { code?: unknown; cause?: unknown };
    if (typeof candidate.code === 'string' && /^[0-9A-Z]{5}$/.test(candidate.code)) return candidate.code;
    current = candidate.cause;
  }
  return undefined;
}

export function apiErrorLogMetadata(error: unknown): { name: string; databaseCode?: string } {
  return {
    name: error instanceof Error ? error.name : 'UnknownError',
    databaseCode: databaseErrorCode(error),
  };
}
