import type { PublishRepairItem, PublishResult } from './actions/publish';

type IssueGroup = {
  key: string;
  label: string;
  count: number;
  fields: string[];
};

const FIELD_LABELS: Record<string, string> = {
  headline: 'Headline',
  subline: 'Subline',
  metaTitle: 'SEO-Titel',
  metaDescription: 'SEO-Beschreibung',
  imageAlt: 'Bildbeschreibung',
  alt: 'Bildbeschreibung',
  label: 'Beschriftung',
};

function cleanPathToken(value: string): string {
  return value.replace(/^['"]|['"]$/g, '');
}

function locationContext(location = ''): { key: string; label: string; field?: string } {
  const pageMatch = location.match(/pages\[([^\]]+)\]/);
  const sectionMatch = location.match(/sections\[(\d+)\]/);
  const collectionMatch = location.match(/collections\[([^\]]+)\]/);
  const itemMatch = location.match(/\.items\[([^\]]+)\]/);
  const lastField = location.match(/\.([A-Za-z][\w-]*)$/)?.[1];

  if (pageMatch) {
    const page = cleanPathToken(pageMatch[1]);
    const pageLabel = /^\d+$/.test(page) ? `Seite ${Number(page) + 1}` : `Seite „${page}“`;
    const sectionLabel = sectionMatch ? ` · Sektion ${Number(sectionMatch[1]) + 1}` : '';
    return {
      key: `page:${page}:section:${sectionMatch?.[1] || '-'}`,
      label: `${pageLabel}${sectionLabel}`,
      field: lastField ? (FIELD_LABELS[lastField] || lastField) : undefined,
    };
  }

  if (collectionMatch) {
    const collection = cleanPathToken(collectionMatch[1]);
    const item = itemMatch ? cleanPathToken(itemMatch[1]) : '';
    return {
      key: `collection:${collection}:item:${item}`,
      label: item ? `Sammlung „${collection}“ · ${item}` : `Sammlung „${collection}“`,
      field: lastField ? (FIELD_LABELS[lastField] || lastField) : undefined,
    };
  }

  if (location.startsWith('brand')) return { key: 'brand', label: 'Marke', field: lastField };
  if (location.startsWith('navigation')) return { key: 'navigation', label: 'Navigation', field: lastField };
  if (location.startsWith('footer')) return { key: 'footer', label: 'Footer', field: lastField };
  if (location.toLowerCase().includes('color') || location.includes('styleOverrides')) {
    return { key: 'colors', label: 'Farben und Kontrast', field: lastField };
  }
  return { key: location || 'general', label: 'Allgemeine Inhalte', field: lastField };
}

function groupIssues(issues: PublishRepairItem[]): IssueGroup[] {
  const groups = new Map<string, IssueGroup>();
  for (const issue of issues) {
    const context = locationContext(issue.location);
    const current = groups.get(context.key) || {
      key: context.key,
      label: context.label,
      count: 0,
      fields: [],
    };
    current.count += 1;
    if (context.field && !current.fields.includes(context.field)) current.fields.push(context.field);
    groups.set(context.key, current);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function groupLabel(group: IssueGroup): string {
  const fields = group.fields.slice(0, 2).join(', ');
  const extraFields = group.fields.length > 2 ? ` +${group.fields.length - 2}` : '';
  const fieldLabel = fields ? ` – ${fields}${extraFields}` : '';
  return `${group.label}${fieldLabel} (${group.count})`;
}

function groupedDescription(issues: PublishRepairItem[], label: string): string {
  const groups = groupIssues(issues);
  const visible = groups.slice(0, 2).map(groupLabel).join('; ');
  const remainder = groups.length > 2 ? `; +${groups.length - 2} weitere Bereiche` : '';
  return `${issues.length} ${label} in ${groups.length} ${groups.length === 1 ? 'Bereich' : 'Bereichen'}: ${visible}${remainder}.`;
}

export function getPublishFailureDescription(result: PublishResult): string | undefined {
  const blockers = result.repairQueue || [];
  if (blockers.length === 0) {
    return result.code && result.code !== 'PUBLISH_PREFLIGHT_FAILED' ? result.code : undefined;
  }

  if (blockers.length === 1) {
    const issue = blockers[0];
    const context = locationContext(issue.location);
    const field = context.field ? ` · ${context.field}` : '';
    return `${context.label}${field}: ${issue.message || issue.code || 'Inhalt prüfen'}`;
  }

  return groupedDescription(blockers, 'blockierende Probleme');
}
