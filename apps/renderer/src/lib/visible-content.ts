export function isCssColorLiteral(value: unknown): boolean {
  if (typeof value !== 'string' || !value.trim()) return false;
  const input = value.trim();
  return /^#(?:[0-9a-f]{3,8})$/i.test(input)
    || /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\(/i.test(input)
    || /^(?:var|color-mix)\(/i.test(input);
}

export function visibleText(value: unknown): string {
  if (typeof value !== 'string') return '';
  const input = value.trim();
  return input && !isCssColorLiteral(input) ? input : '';
}
