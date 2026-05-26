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
