export type StatsCounterLayout = 'default' | 'projectDossier';

function normalizedSignature(value: unknown) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('de-DE')
    .replace(/[.!?]+$/g, '');
}

export function resolveStatsCounterLayout(
  data: Record<string, unknown>,
  variant?: string | null,
): StatsCounterLayout {
  const configuredLayout = String(data.layout || variant || '').trim();
  if (configuredLayout === 'projectDossier') return 'projectDossier';

  const badge = normalizedSignature(data.badge || data.badgeText);
  const headline = normalizedSignature(data.headline);

  // Narrow compatibility bridge for the already-provisioned Schuktuew project facts.
  return badge === 'fakten' && headline === 'projekt auf einen blick'
    ? 'projectDossier'
    : 'default';
}

export function splitStatTextValue(value: number | string) {
  return String(value)
    .split(/\s*(?:·|•|\|)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}
