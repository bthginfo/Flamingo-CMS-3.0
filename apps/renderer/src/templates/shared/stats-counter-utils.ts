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
  // The editorial copy migration changed the headline without adding the newer
  // explicit layout field, so both copy generations must resolve identically.
  const schuktuewBadge = badge === 'fakten' || badge === 'einsatz';
  const schuktuewHeadline = headline === 'projekt auf einen blick'
    || headline === 'eine bildwelt für den ganzen auftritt';
  return schuktuewBadge && schuktuewHeadline
    ? 'projectDossier'
    : 'default';
}

export function splitStatTextValue(value: number | string) {
  return String(value)
    .split(/\s*(?:·|•|\|)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}
