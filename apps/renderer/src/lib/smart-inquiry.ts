export type SmartInquiryChoice = {
  label: string;
  description?: string;
  icon?: string;
};

export type SmartInquirySelections = {
  goal?: string;
  scope?: string;
  timing?: string;
  budget?: string;
};

export type SmartInquiryGroup = {
  key: Exclude<keyof SmartInquirySelections, 'goal'>;
  label: string;
  options: SmartInquiryChoice[];
};

const MAX_CHOICES = 12;
const MAX_LABEL_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 360;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

/**
 * Normalizes the compact documented contract plus common AI-friendly variants.
 * A string list is accepted, as are objects using title/name/text instead of
 * label/description. Invalid and duplicate choices are removed deterministically.
 */
export function normalizeSmartInquiryChoices(value: unknown): SmartInquiryChoice[] {
  if (!Array.isArray(value)) return [];

  const choices: SmartInquiryChoice[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    let choice: SmartInquiryChoice | null = null;
    if (typeof item === 'string') {
      const label = cleanText(item, MAX_LABEL_LENGTH);
      if (label) choice = { label };
    } else if (item && typeof item === 'object' && !Array.isArray(item)) {
      const record = item as Record<string, unknown>;
      const label = cleanText(record.label ?? record.title ?? record.name ?? record.value, MAX_LABEL_LENGTH);
      if (label) {
        const description = cleanText(record.description ?? record.text ?? record.note, MAX_DESCRIPTION_LENGTH);
        const icon = cleanText(record.icon, 80);
        choice = {
          label,
          ...(description ? { description } : {}),
          ...(icon ? { icon } : {}),
        };
      }
    }

    if (!choice) continue;
    const duplicateKey = choice.label.toLocaleLowerCase('de');
    if (seen.has(duplicateKey)) continue;
    seen.add(duplicateKey);
    choices.push(choice);
    if (choices.length >= MAX_CHOICES) break;
  }

  return choices;
}

export function isSmartInquiryScopeComplete(
  groups: SmartInquiryGroup[],
  selections: SmartInquirySelections,
): boolean {
  return groups.every((group) => {
    if (group.options.length === 0) return true;
    const selected = selections[group.key];
    return Boolean(selected && group.options.some((option) => option.label === selected));
  });
}

export function buildSmartInquirySummary(
  selections: SmartInquirySelections,
  labels: Partial<Record<keyof SmartInquirySelections, string>> = {},
): string {
  const rows: Array<[keyof SmartInquirySelections, string]> = [
    ['goal', labels.goal || 'Ziel'],
    ['scope', labels.scope || 'Umfang'],
    ['timing', labels.timing || 'Zeitrahmen'],
    ['budget', labels.budget || 'Budget'],
  ];

  return rows
    .flatMap(([key, label]) => {
      const value = cleanText(selections[key], MAX_LABEL_LENGTH);
      return value ? [`${label}: ${value}`] : [];
    })
    .join('\n');
}
