export type OfferMatcherOption = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  matches: string[];
  tags: string[];
};

export type OfferMatcherQuestion = {
  id: string;
  label: string;
  description?: string;
  options: OfferMatcherOption[];
};

export type OfferMatcherOffer = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  reason?: string;
  priceLabel?: string;
  features: string[];
  tags: string[];
  priority: number;
  fallback: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type NormalizedOfferMatcherData = {
  questions: OfferMatcherQuestion[];
  offers: OfferMatcherOffer[];
};

export type OfferMatcherSelections = Record<string, string>;

export type OfferMatcherResult = {
  offer: OfferMatcherOffer;
  directMatches: number;
  tagMatches: number;
  matchedAnswers: number;
};

/** Shared deterministic weighted ranking used by guided recommendation experiences. */
export function getDeterministicWeightedResultId(
  resultIds: string[],
  scores: Readonly<Record<string, number>>,
): string {
  return resultIds
    .map((id, index) => ({ id, index, score: Number.isFinite(scores[id]) ? scores[id] : 0 }))
    .sort((left, right) => right.score - left.score || left.index - right.index)[0]?.id || '';
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function text(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function identifier(value: unknown, fallback: string): string {
  const normalized = text(value, 100)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

function uniqueId(candidate: string, used: Set<string>): string {
  if (!used.has(candidate)) {
    used.add(candidate);
    return candidate;
  }
  let suffix = 2;
  while (used.has(`${candidate}-${suffix}`)) suffix += 1;
  const result = `${candidate}-${suffix}`;
  used.add(result);
  return result;
}

function stringList(value: unknown, maxItems = 12): string[] {
  const source = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return Array.from(new Set(source.map((entry) => text(entry, 120)).filter(Boolean))).slice(0, maxItems);
}

export function safeOfferMatcherHref(value: unknown): string {
  let href = text(value, 500);
  if (/^tel:/i.test(href)) href = `tel:${href.slice(4).replace(/\s/g, '')}`;
  if (!href || /[\u0000-\u001f\u007f\s]/.test(href)) return '';
  if (href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))) return href;
  if (/^https?:\/\//i.test(href) || /^mailto:[^@]+@[^@]+\.[^@]+$/i.test(href) || /^tel:\+?[0-9().\-/]+$/i.test(href)) return href;
  return '';
}

function normalizeAction(value: unknown): { label: string; href: string } | undefined {
  if (!isRecord(value)) return undefined;
  const label = text(value.label, 100);
  const href = safeOfferMatcherHref(value.href);
  return label && href ? { label, href } : undefined;
}

function normalizeOption(value: unknown, index: number, used: Set<string>): OfferMatcherOption | null {
  if (!isRecord(value)) return null;
  const label = text(value.label, 160);
  if (!label) return null;
  return {
    id: uniqueId(identifier(value.id ?? value.value, identifier(label, `option-${index + 1}`)), used),
    label,
    description: text(value.description, 280) || undefined,
    icon: text(value.icon, 80) || undefined,
    matches: stringList(value.matches ?? value.offerIds).map((entry) => identifier(entry, '')).filter(Boolean),
    tags: stringList(value.tags).map((entry) => identifier(entry, '')).filter(Boolean),
  };
}

function normalizeQuestion(value: unknown, index: number, used: Set<string>): OfferMatcherQuestion | null {
  if (!isRecord(value)) return null;
  const label = text(value.label ?? value.question, 220);
  if (!label) return null;
  const optionIds = new Set<string>();
  const options = (Array.isArray(value.options) ? value.options : [])
    .map((option, optionIndex) => normalizeOption(option, optionIndex, optionIds))
    .filter((option): option is OfferMatcherOption => Boolean(option))
    .slice(0, 6);
  if (options.length < 2) return null;
  return {
    id: uniqueId(identifier(value.id, identifier(label, `question-${index + 1}`)), used),
    label,
    description: text(value.description, 320) || undefined,
    options,
  };
}

function normalizeOffer(value: unknown, index: number, used: Set<string>): OfferMatcherOffer | null {
  if (!isRecord(value)) return null;
  const title = text(value.title ?? value.label, 180);
  if (!title) return null;
  const primaryCta = normalizeAction(value.primaryCta ?? value.cta);
  const secondaryCta = normalizeAction(value.secondaryCta);
  const priority = typeof value.priority === 'number' && Number.isFinite(value.priority)
    ? Math.max(-100, Math.min(100, value.priority))
    : 0;
  return {
    id: uniqueId(identifier(value.id, identifier(title, `offer-${index + 1}`)), used),
    eyebrow: text(value.eyebrow, 100) || undefined,
    title,
    description: text(value.description, 500) || undefined,
    reason: text(value.reason, 500) || undefined,
    priceLabel: text(value.priceLabel, 100) || undefined,
    features: stringList(value.features, 8),
    tags: stringList(value.tags).map((entry) => identifier(entry, '')).filter(Boolean),
    priority,
    fallback: value.fallback === true,
    primaryCta,
    secondaryCta,
  };
}

/**
 * Converts persisted/AI-authored JSON into the narrow contract the interactive
 * renderer can trust. Invalid rows are ignored instead of crashing a page.
 */
export function normalizeOfferMatcherData(data: unknown): NormalizedOfferMatcherData | null {
  if (!isRecord(data)) return null;
  const questionIds = new Set<string>();
  const offerIds = new Set<string>();
  const questions = (Array.isArray(data.questions) ? data.questions : [])
    .map((question, index) => normalizeQuestion(question, index, questionIds))
    .filter((question): question is OfferMatcherQuestion => Boolean(question))
    .slice(0, 5);
  const offers = (Array.isArray(data.offers) ? data.offers : [])
    .map((offer, index) => normalizeOffer(offer, index, offerIds))
    .filter((offer): offer is OfferMatcherOffer => Boolean(offer))
    .slice(0, 8);

  if (questions.length < 2 || offers.length === 0) return null;
  return { questions, offers };
}

export function isOfferMatcherComplete(
  data: NormalizedOfferMatcherData,
  selections: OfferMatcherSelections,
): boolean {
  return data.questions.every((question) => question.options.some((option) => option.id === selections[question.id]));
}

/** Deterministic score: explicit offer mappings win, tags are a soft fallback. */
export function getOfferMatcherResult(
  data: NormalizedOfferMatcherData,
  selections: OfferMatcherSelections,
): OfferMatcherResult | null {
  if (!isOfferMatcherComplete(data, selections)) return null;

  const selectedOptions = data.questions.flatMap((question) => {
    const selected = question.options.find((option) => option.id === selections[question.id]);
    return selected ? [selected] : [];
  });

  const ranked = data.offers.map((offer, index) => {
    let directMatches = 0;
    let tagMatches = 0;
    let matchedAnswers = 0;
    const offerTags = new Set(offer.tags);
    for (const option of selectedOptions) {
      const direct = option.matches.includes(offer.id);
      const overlappingTags = option.tags.filter((tag) => offerTags.has(tag)).length;
      if (direct) directMatches += 1;
      tagMatches += overlappingTags;
      if (direct || overlappingTags > 0) matchedAnswers += 1;
    }
    return { offer, directMatches, tagMatches, matchedAnswers, index };
  }).sort((left, right) =>
    right.directMatches - left.directMatches
    || right.tagMatches - left.tagMatches
    || right.offer.priority - left.offer.priority
    || Number(right.offer.fallback) - Number(left.offer.fallback)
    || left.index - right.index,
  );

  const best = ranked[0];
  if (!best) return null;
  if (best.directMatches === 0 && best.tagMatches === 0) {
    const fallback = ranked
      .filter((entry) => entry.offer.fallback)
      .sort((left, right) => right.offer.priority - left.offer.priority || left.index - right.index)[0];
    return fallback || best;
  }
  return best;
}

export function buildOfferMatcherSummary(
  data: NormalizedOfferMatcherData,
  selections: OfferMatcherSelections,
  result?: OfferMatcherResult | null,
): string {
  const rows = data.questions.flatMap((question) => {
    const option = question.options.find((entry) => entry.id === selections[question.id]);
    return option ? [`${question.label}: ${option.label}`] : [];
  });
  if (result) rows.push(`Empfehlung: ${result.offer.title}`);
  return rows.join('\n');
}
