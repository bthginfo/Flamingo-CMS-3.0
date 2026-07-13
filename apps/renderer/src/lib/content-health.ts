export type ContentHealthSeverity = 'error' | 'warning' | 'info';

export type ContentHealthIssue = {
  source: 'content' | 'color' | 'freshness';
  severity: ContentHealthSeverity;
  code?: string;
  message: string;
  location?: string;
  hint?: string;
  repair?: { operation?: string; instruction?: string; acceptance?: string };
  pair?: { fg?: string; bg?: string; ratio?: number; required?: number };
};

export type NormalizedStoredContentAudit = {
  readyToPublish: boolean;
  summary?: Record<string, unknown>;
  issues: ContentHealthIssue[];
  freshnessWarnings: number;
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function issueSeverity(value: unknown): ContentHealthSeverity {
  return value === 'error' || value === 'warning' || value === 'info' ? value : 'warning';
}

function normalizeAuditIssue(value: unknown, fallbackSource: 'content' | 'color'): ContentHealthIssue | null {
  const raw = record(value);
  if (!raw) return null;
  const message = nonEmptyString(raw.message);
  if (!message) return null;
  const repair = record(raw.repair);
  const pair = record(raw.pair);
  return {
    source: raw.source === 'freshness' ? 'freshness' : fallbackSource,
    severity: issueSeverity(raw.severity),
    code: nonEmptyString(raw.code),
    message,
    location: nonEmptyString(raw.location),
    hint: nonEmptyString(raw.hint),
    repair: repair ? {
      operation: nonEmptyString(repair.operation),
      instruction: nonEmptyString(repair.instruction),
      acceptance: nonEmptyString(repair.acceptance),
    } : undefined,
    pair: pair ? {
      fg: nonEmptyString(pair.fg),
      bg: nonEmptyString(pair.bg),
      ratio: typeof pair.ratio === 'number' ? pair.ratio : undefined,
      required: typeof pair.required === 'number' ? pair.required : undefined,
    } : undefined,
  };
}

/** Normalizes the exact JSON shape returned by GET /content/validate for the admin report. */
export function normalizeStoredContentAudit(value: unknown): NormalizedStoredContentAudit {
  const payload = record(value) || {};
  const content = Array.isArray(payload.contentIssues) ? payload.contentIssues : [];
  const colors = Array.isArray(payload.colorIssues) ? payload.colorIssues : [];
  const issues = [
    ...content.map(issue => normalizeAuditIssue(issue, 'content')),
    ...colors.map(issue => normalizeAuditIssue(issue, 'color')),
  ].filter((issue): issue is ContentHealthIssue => Boolean(issue));
  return {
    readyToPublish: payload.readyToPublish === true,
    summary: record(payload.summary) || undefined,
    issues,
    freshnessWarnings: issues.filter(issue => issue.source === 'freshness').length,
  };
}

export type FreshnessIssue = Omit<ContentHealthIssue, 'source' | 'severity' | 'code' | 'repair'> & {
  source: 'freshness';
  severity: 'warning';
  code: 'freshness.expired_date';
  repair: { operation: 'review'; instruction: string; acceptance: string };
};

const EXPLICIT_DATE_KEYS = new Set(['validUntil', 'endDate', 'eventDate', 'publishedUntil']);

function joinPath(base: string, key: string | number): string {
  if (typeof key === 'number') return `${base}[${key}]`;
  return base ? `${base}.${key}` : key;
}

function datePart(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})(?:T.*)?$/);
  if (!match) return null;
  const parsed = new Date(`${match[1]}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== match[1] ? null : match[1];
}

function expiredIssue(location: string, value: string): FreshnessIssue {
  return {
    source: 'freshness',
    severity: 'warning',
    code: 'freshness.expired_date',
    location,
    message: `Das hinterlegte Datum ${value} liegt in der Vergangenheit.`,
    hint: 'Termin aktualisieren oder den abgelaufenen Inhalt entfernen.',
    repair: {
      operation: 'review',
      instruction: 'Prüfen Sie, ob der Inhalt noch aktuell ist, und aktualisieren oder entfernen Sie das Datum.',
      acceptance: 'Das Datum liegt heute oder in der Zukunft beziehungsweise der abgelaufene Inhalt wurde entfernt.',
    },
  };
}

/** Scans only explicitly named schema-like date fields; arbitrary prose is never interpreted. */
export function scanExplicitDateFreshness(root: unknown, options?: { baseLocation?: string; today?: string }): FreshnessIssue[] {
  const today = datePart(options?.today || new Date().toISOString()) || new Date().toISOString().slice(0, 10);
  const issues: FreshnessIssue[] = [];
  const seen = new WeakSet<object>();

  const visit = (value: unknown, location: string) => {
    if (!value || typeof value !== 'object') return;
    if (seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, joinPath(location, index)));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      const childLocation = joinPath(location, key);
      if (EXPLICIT_DATE_KEYS.has(key)) {
        const date = datePart(child);
        if (date && date < today) issues.push(expiredIssue(childLocation, date));
      }
      visit(child, childLocation);
    }
  };
  visit(root, options?.baseLocation || '');
  return issues;
}

export function scanSpecialOpeningDateFreshness(rows: unknown, today?: string): FreshnessIssue[] {
  if (!Array.isArray(rows)) return [];
  const normalizedToday = datePart(today || new Date().toISOString()) || new Date().toISOString().slice(0, 10);
  const issues: FreshnessIssue[] = [];
  rows.forEach((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return;
    const entry = row as Record<string, unknown>;
    if (entry.type !== 'special') return;
    const date = datePart(entry.date);
    if (date && date < normalizedToday) issues.push(expiredIssue(`openingHours[${index}].date`, date));
  });
  return issues;
}

export type ContentHealthLocationContext = {
  pages: Array<{ id: string; slug: string; title: string }>;
  collectionItems: Array<{ id: string; collectionKey: string; slug: string; title: string }>;
};

export type ContentHealthGroup = {
  key: string;
  label: string;
  href: string;
  issues: ContentHealthIssue[];
  errors: number;
  warnings: number;
};

function locationTarget(issue: ContentHealthIssue, context: ContentHealthLocationContext): { key: string; label: string; href: string } {
  const location = issue.location || '';
  const pageSlug = location.match(/pages\[([^\]]+)\]/)?.[1]
    || location.match(/^([^\s.→]+)\s*→\s*sections/)?.[1];
  if (pageSlug) {
    const page = context.pages.find(candidate => candidate.slug === pageSlug);
    return page
      ? { key: `page:${page.id}`, label: `Seite: ${page.title}`, href: `/admin/pages/${page.id}` }
      : { key: `page:${pageSlug}`, label: `Seite: ${pageSlug}`, href: '/admin/pages' };
  }

  const collectionMatch = location.match(/collections\[([^\]]+)\]\.items\[([^\]]+)\]/);
  if (collectionMatch) {
    const item = context.collectionItems.find(candidate => candidate.collectionKey === collectionMatch[1] && candidate.slug === collectionMatch[2]);
    return item
      ? { key: `item:${item.id}`, label: `Eintrag: ${item.title}`, href: `/admin/collections/${item.collectionKey}/${item.id}` }
      : { key: `collection:${collectionMatch[1]}`, label: `Sammlung: ${collectionMatch[1]}`, href: `/admin/collections/${collectionMatch[1]}` };
  }
  if (location.startsWith('brand')) return { key: 'brand', label: 'Marke & Design', href: '/admin/brand' };
  if (location.startsWith('contact') || location.startsWith('openingHours')) return { key: 'contact', label: 'Kontakt & Zeiten', href: '/admin/contact' };
  if (location.startsWith('navigation') || location.startsWith('footer')) return { key: 'navigation', label: 'Navigation & Footer', href: '/admin/navigation' };
  if (location.startsWith('siteProfile')) return { key: 'profile', label: 'Unternehmensprofil', href: '/admin/business-profile' };
  if (location.startsWith('pages') || location.startsWith('variety')) return { key: 'pages', label: 'Seitenübergreifend', href: '/admin/pages' };
  if (issue.source === 'color') return { key: 'colors', label: 'Farben & Kontrast', href: '/admin/brand' };
  return { key: 'general', label: 'Allgemeine Inhalte', href: '/admin/pages' };
}

export function groupContentHealthIssues(issues: ContentHealthIssue[], context: ContentHealthLocationContext): ContentHealthGroup[] {
  const groups = new Map<string, ContentHealthGroup>();
  for (const issue of issues) {
    const target = locationTarget(issue, context);
    const group = groups.get(target.key) || { ...target, issues: [], errors: 0, warnings: 0 };
    group.issues.push(issue);
    if (issue.severity === 'error') group.errors += 1;
    else if (issue.severity === 'warning') group.warnings += 1;
    groups.set(target.key, group);
  }
  return [...groups.values()]
    .map(group => ({ ...group, issues: group.issues.slice().sort((a, b) => Number(b.severity === 'error') - Number(a.severity === 'error')) }))
    .sort((a, b) => b.errors - a.errors || b.warnings - a.warnings || a.label.localeCompare(b.label, 'de'));
}
