const GENERIC_TITLES = new Set([
  'flamingo cms',
  'home',
  'homepage',
  'start',
  'startseite',
  'willkommen',
  'website',
]);

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' und ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitTitle(value: string): string[] {
  return value
    .split(/\s+(?:\||—|–|·)\s+/)
    .map(part => part.trim())
    .filter(Boolean);
}

/** Remove repeated title segments while preserving their first spelling. */
export function dedupeSeoTitle(value: string): string {
  const segments = splitTitle(value);
  if (segments.length < 2) return value.trim();

  const seen = new Set<string>();
  const unique = segments.filter(segment => {
    const key = normalize(segment);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.join(' | ');
}

function stripTemplateAffix(title: string, affix: string, side: 'start' | 'end'): string {
  const titleParts = splitTitle(title);
  const affixParts = splitTitle(affix);
  if (titleParts.length === 0 || affixParts.length === 0) return title;

  const affixKey = normalize(affixParts.join(' '));
  const edge = side === 'start'
    ? titleParts.slice(0, affixParts.length)
    : titleParts.slice(-affixParts.length);
  if (normalize(edge.join(' ')) !== affixKey) return title;

  const remaining = side === 'start'
    ? titleParts.slice(affixParts.length)
    : titleParts.slice(0, -affixParts.length);
  return remaining.join(' | ');
}

export function isGenericSeoTitle(value: string | null | undefined): boolean {
  const key = normalize(value || '');
  return !key || GENERIC_TITLES.has(key);
}

/**
 * Compose metadata without producing "Brand | Brand" when AI-authored page
 * titles already contain the static part of the global title template.
 */
export function composeSeoTitle(input: {
  contentTitle?: string | null;
  defaultTitle?: string | null;
  titleTemplate?: string | null;
  brandName?: string | null;
  preferDefaultForGeneric?: boolean;
}): string {
  const fallback = input.defaultTitle?.trim() || input.brandName?.trim() || 'Website';
  let content = input.contentTitle?.trim() || fallback;

  if ((input.preferDefaultForGeneric ?? true) && isGenericSeoTitle(content) && input.defaultTitle?.trim()) {
    return dedupeSeoTitle(input.defaultTitle);
  }

  const template = input.titleTemplate?.trim();
  if (!template || !template.includes('%s')) return dedupeSeoTitle(content);

  const [before = '', after = ''] = template.split('%s');
  const cleanBefore = before.replace(/^[\s|—–·-]+|[\s|—–·-]+$/g, '');
  const cleanAfter = after.replace(/^[\s|—–·-]+|[\s|—–·-]+$/g, '');

  if (cleanBefore) content = stripTemplateAffix(content, cleanBefore, 'start');
  if (cleanAfter) content = stripTemplateAffix(content, cleanAfter, 'end');

  // A home/page title may be exactly the brand affix. Keep it once.
  if (!content.trim()) return dedupeSeoTitle(cleanAfter || cleanBefore || fallback);

  return dedupeSeoTitle(template.replace('%s', content));
}
