import { getContrastRatio, parseCssColor } from './color-engine';

export const MEDIA_OVERLAY_ACTION_DEFAULTS = {
  background: 'rgba(2, 6, 23, 0.66)',
  text: '#ffffff',
  border: 'rgba(255, 255, 255, 0.48)',
} as const;

// Renderer aliases are centralized here until definition metadata can carry
// the media-overlay capability directly.
const MEDIA_OVERLAY_SECTION_TYPES = new Set([
  'hero',
  'collectionHero',
  'cinematicHero',
  'glowHero',
  'floristHero',
  'fitnessHero',
  'locationHero',
  'immersiveCtaBanner',
  'trialSessionCta',
  'availabilityCta',
  'brandShowroom',
  'weddingFloristry',
  'heroConsulting',
]);

const MEDIA_CANVASES = ['#000000', '#ffffff'] as const;

export function isMediaOverlaySectionType(type: string): boolean {
  return MEDIA_OVERLAY_SECTION_TYPES.has(type);
}

function minimumContrast(foreground: string, background: string): number {
  return Math.min(...MEDIA_CANVASES.map((canvas) => getContrastRatio(foreground, background, canvas) ?? 0));
}

function chooseForeground(requested: string | undefined, background: string): { value: string; contrast: number } {
  const candidates = [requested, MEDIA_OVERLAY_ACTION_DEFAULTS.text, '#0f172a', '#000000']
    .filter((candidate): candidate is string => Boolean(candidate && parseCssColor(candidate)))
    .filter((candidate, index, all) => all.indexOf(candidate) === index)
    .map((value) => ({ value, contrast: minimumContrast(value, background) }))
    .sort((a, b) => b.contrast - a.contrast);

  const requestedCandidate = candidates.find((candidate) => candidate.value === requested);
  if (requestedCandidate && requestedCandidate.contrast >= 4.5) return requestedCandidate;
  return candidates[0] || { value: MEDIA_OVERLAY_ACTION_DEFAULTS.text, contrast: 0 };
}

function chooseBorder(requested: string | undefined, background: string, text: string): string {
  const candidates = [
    requested,
    MEDIA_OVERLAY_ACTION_DEFAULTS.border,
    'rgba(15, 23, 42, 0.58)',
    'rgba(255, 255, 255, 0.68)',
    text,
  ]
    .filter((candidate): candidate is string => Boolean(candidate && parseCssColor(candidate)))
    .filter((candidate, index, all) => all.indexOf(candidate) === index);
  const requestedCandidate = requested && candidates.includes(requested) ? requested : undefined;
  if (requestedCandidate && minimumContrast(requestedCandidate, background) >= 1.5) return requestedCandidate;
  return candidates.find((candidate) => minimumContrast(candidate, background) >= 1.5)
    || MEDIA_OVERLAY_ACTION_DEFAULTS.border;
}

export function resolveMediaOverlaySecondaryAction(input: {
  background?: string | null;
  text?: string | null;
  border?: string | null;
}): { background: string; text: string; border: string } {
  let background = input.background && parseCssColor(input.background)
    ? input.background
    : MEDIA_OVERLAY_ACTION_DEFAULTS.background;
  let foreground = chooseForeground(input.text || undefined, background);

  // A very transparent custom background can be unreadable on either a dark
  // or light photograph regardless of foreground. Repair the pair atomically.
  if (foreground.contrast < 4.5) {
    background = MEDIA_OVERLAY_ACTION_DEFAULTS.background;
    foreground = chooseForeground(input.text || undefined, background);
  }

  return {
    background,
    text: foreground.contrast >= 4.5 ? foreground.value : MEDIA_OVERLAY_ACTION_DEFAULTS.text,
    border: chooseBorder(input.border || undefined, background, foreground.value),
  };
}
