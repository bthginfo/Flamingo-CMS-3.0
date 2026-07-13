/** Remove empty draft rows while preserving the entered content and order. */
export function compactStringList(value: readonly string[]): string[] {
  return value.filter(entry => entry.trim().length > 0);
}

export function serializeStringList(value: readonly string[]): string {
  return compactStringList(value).join('\n');
}

export function deserializeStringList(value: string): string[] {
  return value === '' ? [] : compactStringList(value.split('\n'));
}
