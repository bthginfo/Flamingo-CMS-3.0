export type EditorialFieldGroup = 'content' | 'actions' | 'media' | 'details' | 'advanced';

export interface EditorialFieldEntry {
  key: string;
  value: unknown;
  group: EditorialFieldGroup;
  rank: number;
}

export const EDITORIAL_GROUPS: ReadonlyArray<{
  key: EditorialFieldGroup;
  label: string;
  description: string;
}> = [
  { key: 'content', label: 'Inhalt', description: 'Kernbotschaft, Überschrift und erklärende Texte.' },
  { key: 'actions', label: 'Aktionen', description: 'Buttons und Ziele für die nächsten Schritte.' },
  { key: 'media', label: 'Medien', description: 'Bilder, Videos und deren Darstellung.' },
  { key: 'details', label: 'Details', description: 'Ergänzende Einträge, Fakten und Listen.' },
  { key: 'advanced', label: 'Erweitert', description: 'Technische und selten benötigte Einstellungen.' },
];

const COMMON_LABELS: Record<string, string> = {
  hint: 'Hinweis',
  imagePrimary: 'Hauptbild',
  imageSecondary: 'Zusatzbild',
  mapUrl: 'Karten-Link',
  mapEmbed: 'Karten-Einbettung',
  mapEmbedUrl: 'Karten-Einbettung',
  namePlaceholder: 'Platzhalter für Name',
  emailPlaceholder: 'Platzhalter für E-Mail',
  messagePlaceholder: 'Platzhalter für Nachricht',
  ctaPrimary: 'Primärer Button',
  ctaSecondary: 'Sekundärer Button',
  primaryCta: 'Primärer Button',
  secondaryCta: 'Sekundärer Button',
  ctaLabel: 'Button-Text',
  ctaHref: 'Button-Ziel',
  suffixIcon: 'Icon nach dem Button-Text',
};

const CONTENT_ORDER = [
  /^(eyebrow|kicker|badgeText|badge|hint)$/i,
  /^(headline|heading|title|name)$/i,
  /^(subline|subtitle|intro|introText|lead)$/i,
  /^(text|content|description|excerpt|story|bio|quote|answer)$/i,
];
const ACTION_ORDER = [
  /^(primaryCta|ctaPrimary|primaryButton)$/i,
  /^(secondaryCta|ctaSecondary|secondaryButton)$/i,
  /^(cta|button|submitLabel|nextLabel|backLabel)$/i,
  /(cta|button|link).*(label|text)$/i,
  /(cta|button|link).*(href|url|target)$/i,
];
const MEDIA_ORDER = [
  /^(imagePrimary|image|heroImage|bgImage)$/i,
  /^(imageSecondary|bgImageMobile)$/i,
  /(photo|avatar|poster|logo|gallery|images)/i,
  /(video|media)/i,
];
const DETAIL_ORDER = [
  /^(items|cards|entries|features|facts|stats|steps|rows|columns)$/i,
  /^(highlights|values|services|members|logos|links|images)$/i,
];

function rankFor(key: string, patterns: readonly RegExp[]): number {
  const index = patterns.findIndex((pattern) => pattern.test(key));
  return index < 0 ? patterns.length + 20 : index;
}

export function getEditorialFieldGroup(key: string, value?: unknown): EditorialFieldGroup {
  if (/(_id|Ids?|slug|key|config|schema|definition|embedCode|mapEmbed|mapEmbedUrl|maxWidth|delayMs|triggerDelayMs)$/i.test(key)) return 'advanced';
  if (/(color|opacity|effect|position|layout|align|reversed|mode|style|provider|height|width|ratio|sortBy|count|frequency)$/i.test(key)) return 'advanced';
  if (/(cta|button|submit|checkout|continueShopping|nextLabel|backLabel)/i.test(key)) return 'actions';
  if (/(href|link)/i.test(key) && !/(embed|image|video|map)/i.test(key)) return 'actions';
  if (/(image|background|photo|avatar|poster|logo|gallery|video|media)/i.test(key)) return 'media';
  if (Array.isArray(value) || (value !== null && typeof value === 'object')) return 'details';
  if (DETAIL_ORDER.some((pattern) => pattern.test(key))) return 'details';
  if (CONTENT_ORDER.some((pattern) => pattern.test(key))) return 'content';
  return 'advanced';
}

export function getEditorialFieldRank(key: string, group: EditorialFieldGroup): number {
  if (group === 'content') return rankFor(key, CONTENT_ORDER);
  if (group === 'actions') return rankFor(key, ACTION_ORDER);
  if (group === 'media') return rankFor(key, MEDIA_ORDER);
  if (group === 'details') return rankFor(key, DETAIL_ORDER);
  return 100;
}

export function groupEditorialFields(
  source: Record<string, unknown>,
  hiddenKeys: ReadonlySet<string> = new Set(),
): Record<EditorialFieldGroup, EditorialFieldEntry[]> {
  const result: Record<EditorialFieldGroup, EditorialFieldEntry[]> = {
    content: [], actions: [], media: [], details: [], advanced: [],
  };

  Object.entries(source).forEach(([key, value]) => {
    if (hiddenKeys.has(key)) return;
    const group = getEditorialFieldGroup(key, value);
    result[group].push({ key, value, group, rank: getEditorialFieldRank(key, group) });
  });

  for (const entries of Object.values(result)) {
    entries.sort((left, right) => {
      if (left.rank !== right.rank) return left.rank - right.rank;
      const leftLabel = getCommonEditorialFieldLabel(left.key) || left.key;
      const rightLabel = getCommonEditorialFieldLabel(right.key) || right.key;
      return leftLabel.localeCompare(rightLabel, 'de') || left.key.localeCompare(right.key, 'de');
    });
  }
  return result;
}

export function getCommonEditorialFieldLabel(key: string): string | undefined {
  return COMMON_LABELS[key];
}

export function isEditorialValueComplete(value: unknown): boolean {
  if (typeof value === 'string') return value.replace(/<[^>]+>/g, '').trim().length > 0;
  if (typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.some(isEditorialValueComplete);
  if (value && typeof value === 'object') return Object.values(value).some(isEditorialValueComplete);
  return false;
}

export function getSectionEditorialSummary(data: Record<string, unknown>): {
  excerpt: string | null;
  complete: number;
  total: number;
  percentage: number;
} {
  const preferredKeys = ['headline', 'title', 'name', 'subline', 'intro', 'text', 'description'];
  let excerpt: string | null = null;
  for (const key of preferredKeys) {
    const value = data[key];
    if (typeof value === 'string' && isEditorialValueComplete(value)) {
      excerpt = value.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      break;
    }
  }
  const grouped = groupEditorialFields(data);
  const relevant = [...grouped.content, ...grouped.actions, ...grouped.media, ...grouped.details];
  const complete = relevant.filter((entry) => isEditorialValueComplete(entry.value)).length;
  const total = relevant.length;
  return { excerpt, complete, total, percentage: total ? Math.round((complete / total) * 100) : 0 };
}
