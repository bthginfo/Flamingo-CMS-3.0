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

// Storage convention for localized section data: the locale variants live
// under `de`/`en`/… and the DEFAULT locale's fields additionally live FLAT on
// the object — validators, search and locale-less render paths read the flat
// fields. This merge keeps that invariant on every save.
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
  const reserved = new Set<string>(['_localized', ...i18n.locales, i18n.defaultLocale, activeLocale]);
  const flatOf = (value: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(value).filter(([key]) => !reserved.has(key)));

  const locales: Record<string, unknown> = { _localized: true };
  if (existingData._localized) {
    for (const [key, value] of Object.entries(existingData)) {
      if (key !== '_localized' && reserved.has(key)) locales[key] = value;
    }
  } else {
    locales[i18n.defaultLocale] = flatOf(existingData);
  }
  if (!(i18n.defaultLocale in locales)) locales[i18n.defaultLocale] = flatOf(existingData);
  locales[activeLocale] = data;

  const defaultData = locales[i18n.defaultLocale];
  const flat = defaultData && typeof defaultData === 'object' && !Array.isArray(defaultData)
    ? flatOf(defaultData as Record<string, unknown>)
    : {};
  return { ...flat, ...locales };
}
