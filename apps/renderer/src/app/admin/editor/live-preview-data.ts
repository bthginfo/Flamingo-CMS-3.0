import type { EditableSection } from './editable-section';

export type EditorI18nConfig = {
  enabled: boolean;
  locales: string[];
  defaultLocale: string;
};

type PendingChanges = ReadonlyMap<string, Record<string, unknown>>;

export function buildLiveSections(
  sections: EditableSection[],
  pendingChanges: PendingChanges,
  override?: { sectionId: string; data: Record<string, unknown> },
): EditableSection[] {
  return sections.map((section) => {
    const newData = override?.sectionId === section.id ? override.data : pendingChanges.get(section.id);
    return { ...section, data: newData ?? section.data };
  });
}

export function mergeLocalizedSectionData({
  sectionId,
  data,
  sections,
  pendingChanges,
  i18n,
  activeLocale,
}: {
  sectionId: string;
  data: Record<string, unknown>;
  sections: EditableSection[];
  pendingChanges: PendingChanges;
  i18n?: EditorI18nConfig;
  activeLocale: string;
}): Record<string, unknown> {
  if (!i18n?.enabled) return data;

  const section = sections.find((candidate) => candidate.id === sectionId);
  const existingData = pendingChanges.get(sectionId) ?? section?.data ?? {};
  if (existingData._localized) {
    return { ...existingData, [activeLocale]: data };
  }

  return { _localized: true, [i18n.defaultLocale]: existingData, [activeLocale]: data };
}
