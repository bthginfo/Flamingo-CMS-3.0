import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { normalizeEditableSection, sortEditableSections, type EditableSection } from './editable-section';

export type PageSectionRowLike = {
  id: string;
  type: string;
  variant: string | null;
  titleInternal?: string | null;
  visible: boolean;
  locked?: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  styleOverrides?: Record<string, unknown> | null;
  data: Record<string, unknown>;
  sortOrder: number;
};

export type CollectionItemSectionLike = {
  id?: string;
  type?: string;
  variant?: string | null;
  titleInternal?: string | null;
  visible?: boolean;
  locked?: boolean;
  container?: string;
  spacingTop?: string;
  spacingBottom?: string;
  anchorId?: string | null;
  styleOverrides?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  sortOrder?: number;
};

export function pageSectionToEditableSection(section: PageSectionRowLike): EditableSection {
  return normalizeEditableSection(section);
}

export function pageSectionsToEditableSections(sections: PageSectionRowLike[]): EditableSection[] {
  return sortEditableSections(sections.map(pageSectionToEditableSection));
}

export function collectionItemSectionToEditableSection(
  section: CollectionItemSectionLike,
  index: number,
  createId: () => string,
): EditableSection | null {
  if (!section.type) return null;
  return normalizeEditableSection({
    id: section.id || createId(),
    type: section.type,
    variant: section.variant ?? null,
    titleInternal: section.titleInternal ?? null,
    visible: section.visible !== false,
    locked: section.locked ?? false,
    container: section.container || 'default',
    spacingTop: section.spacingTop || 'm',
    spacingBottom: section.spacingBottom || 'm',
    anchorId: section.anchorId ?? null,
    styleOverrides: section.styleOverrides ?? null,
    data: section.data ?? {},
    sortOrder: section.sortOrder ?? index,
  });
}

export function collectionItemSectionsToEditableSections(
  sections: unknown,
  createId: () => string,
): EditableSection[] {
  if (!Array.isArray(sections)) return [];
  return sections
    .map((section, index) => collectionItemSectionToEditableSection(section as CollectionItemSectionLike, index, createId))
    .filter((section): section is EditableSection => Boolean(section))
    .map((section, index) => ({ ...section, sortOrder: index }));
}

export function editableSectionsToCollectionItemSections(sections: EditableSection[]): CollectionItemSectionLike[] {
  return sections.map((section) => {
    const serialized: CollectionItemSectionLike = {
      id: section.id,
      type: section.type,
      variant: section.variant,
      visible: section.visible,
      container: section.container,
      spacingTop: section.spacingTop,
      spacingBottom: section.spacingBottom,
      anchorId: section.anchorId,
      data: section.data,
    };

    if (section.titleInternal) serialized.titleInternal = section.titleInternal;
    if (section.locked) serialized.locked = section.locked;
    if (section.styleOverrides) serialized.styleOverrides = section.styleOverrides;

    return serialized;
  });
}

export function editableSectionMetaPatch(section: EditableSection): Omit<EditableSection, 'id' | 'type' | 'data' | 'sortOrder'> {
  return {
    variant: section.variant,
    titleInternal: section.titleInternal,
    visible: section.visible,
    locked: section.locked,
    container: section.container,
    spacingTop: section.spacingTop,
    spacingBottom: section.spacingBottom,
    anchorId: section.anchorId,
    styleOverrides: section.styleOverrides,
  };
}

function clonePlainValue<T>(value: T): T {
  if (value == null || typeof value !== 'object') return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return true;
}

function getSectionSeedData(type: string): Record<string, unknown> {
  return {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}),
    ...(SECTION_PREVIEW_DATA[type] || {}),
  };
}

const DATA_KEY_ALIASES: Record<string, string[]> = {
  eyebrow: ['badgeText', 'badge'],
  badgeText: ['eyebrow', 'badge'],
  badge: ['badgeText', 'eyebrow'],
  image: ['bgImage', 'bgImageMobile'],
  bgImage: ['image', 'bgImageMobile'],
  bgImageMobile: ['image', 'bgImage'],
  overlay: ['overlayColor'],
  overlayColor: ['overlay'],
};

function remapSectionDataRecord(sourceData: Record<string, unknown>, targetType: string): Record<string, unknown> {
  const seed = getSectionSeedData(targetType);
  const nextData: Record<string, unknown> = clonePlainValue(seed);

  for (const key of Object.keys(seed)) {
    if (hasContent(sourceData[key])) {
      nextData[key] = clonePlainValue(sourceData[key]);
      continue;
    }

    const aliases = DATA_KEY_ALIASES[key] || [];
    const aliasKey = aliases.find((candidate) => hasContent(sourceData[candidate]));
    if (aliasKey) nextData[key] = clonePlainValue(sourceData[aliasKey]);
  }

  if ('facts' in nextData && !hasContent(sourceData.facts) && Array.isArray(sourceData.trustItems)) {
    nextData.facts = sourceData.trustItems
      .map((item) => {
        if (typeof item === 'string') return { value: '', label: item };
        if (!item || typeof item !== 'object') return null;
        const record = item as Record<string, unknown>;
        const label = typeof record.label === 'string' ? record.label : typeof record.value === 'string' ? record.value : '';
        const value = typeof record.value === 'string' ? record.value : '';
        return label ? { value, label } : null;
      })
      .filter((item): item is { value: string; label: string } => Boolean(item));
  }

  if ('trustItems' in nextData && !hasContent(sourceData.trustItems) && Array.isArray(sourceData.facts)) {
    nextData.trustItems = sourceData.facts
      .map((item) => {
        if (typeof item === 'string') return { label: item, icon: 'checkCircle' };
        if (!item || typeof item !== 'object') return null;
        const record = item as Record<string, unknown>;
        const label = typeof record.label === 'string' ? record.label : typeof record.value === 'string' ? record.value : '';
        return label ? { label, icon: 'checkCircle' } : null;
      })
      .filter((item): item is { label: string; icon: string } => Boolean(item));
  }

  return nextData;
}

export function remapSectionDataForType(data: Record<string, unknown>, targetType: string): Record<string, unknown> {
  if (data._localized) {
    const localizedData = data as Record<string, unknown>;
    const nextLocalized: Record<string, unknown> = { _localized: true };
    for (const [locale, localeValue] of Object.entries(localizedData)) {
      if (locale === '_localized') continue;
      nextLocalized[locale] = localeValue && typeof localeValue === 'object'
        ? remapSectionDataRecord(localeValue as Record<string, unknown>, targetType)
        : getSectionSeedData(targetType);
    }
    return nextLocalized;
  }

  return remapSectionDataRecord(data, targetType);
}

export function remapEditableSectionType(section: EditableSection, targetType: string): EditableSection {
  if (section.type === targetType) return section;
  return {
    ...section,
    type: targetType,
    data: remapSectionDataForType(section.data, targetType),
  };
}
