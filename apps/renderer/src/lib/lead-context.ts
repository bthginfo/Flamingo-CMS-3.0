export type LeadContext = {
  source: 'priceCalculator' | 'consultationBooking' | string;
  summary: string;
};

export const LEAD_CONTEXT_STORAGE_KEY = 'flamingo:lead-context';
const SOURCE_PARAM = 'lead_source';
const SUMMARY_PARAM = 'lead_summary';

function cleanContext(value: Partial<LeadContext> | null | undefined): LeadContext | null {
  const source = typeof value?.source === 'string' ? value.source.trim().slice(0, 100) : '';
  const summary = typeof value?.summary === 'string' ? value.summary.trim().slice(0, 1500) : '';
  return source && summary ? { source, summary } : null;
}

/** Direct section context wins; null/invalid direct data falls back safely. */
export function resolveLeadContext(
  direct: Partial<LeadContext> | null | undefined,
  fallback: Partial<LeadContext> | null | undefined,
): LeadContext | null {
  return cleanContext(direct) ?? cleanContext(fallback);
}

export function buildLeadContextHref(href: string | undefined, context: LeadContext): string {
  const cleaned = cleanContext(context);
  const target = href?.trim() || '#kontakt';
  if (!cleaned || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(target)) return target;

  const hashIndex = target.indexOf('#');
  const hash = hashIndex >= 0 ? target.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? target.slice(0, hashIndex) : target;
  const queryIndex = withoutHash.indexOf('?');
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const params = new URLSearchParams(queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : '');
  params.set(SOURCE_PARAM, cleaned.source);
  params.set(SUMMARY_PARAM, cleaned.summary);
  const query = params.toString();
  return `${path}?${query}${hash}`;
}

export function parseLeadContext(search: string, storedValue?: string | null): LeadContext | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const fromQuery = cleanContext({
    source: params.get(SOURCE_PARAM) || '',
    summary: params.get(SUMMARY_PARAM) || '',
  });
  if (fromQuery) return fromQuery;
  if (!storedValue) return null;
  try {
    return cleanContext(JSON.parse(storedValue) as Partial<LeadContext>);
  } catch {
    return null;
  }
}

export function persistLeadContext(context: LeadContext): void {
  const cleaned = cleanContext(context);
  if (!cleaned || typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(LEAD_CONTEXT_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Storage can be disabled; query parameters remain the durable fallback.
  }
}
