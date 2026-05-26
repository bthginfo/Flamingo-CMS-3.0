export type EditableSection = {
  id: string;
  type: string;
  variant: string | null;
  titleInternal: string | null;
  visible: boolean;
  locked: boolean;
  container: string;
  spacingTop: string;
  spacingBottom: string;
  anchorId: string | null;
  styleOverrides: Record<string, unknown> | null;
  data: Record<string, unknown>;
  sortOrder: number;
};

export type EditableSectionInput = Partial<EditableSection> & {
  id?: string;
  type: string;
  data?: Record<string, unknown> | null;
};

export const DEFAULT_EDITABLE_SECTION_META = {
  variant: null,
  titleInternal: null,
  visible: true,
  locked: false,
  container: 'default',
  spacingTop: 'm',
  spacingBottom: 'm',
  anchorId: null,
  styleOverrides: null,
  data: {},
  sortOrder: 0,
} satisfies Omit<EditableSection, 'id' | 'type'>;

export function createEmptyEditableSection(type: string, id: string, sortOrder = 0): EditableSection {
  return normalizeEditableSection({ id, type, sortOrder });
}

export function normalizeEditableSection(section: EditableSectionInput): EditableSection {
  return {
    id: section.id || '',
    type: section.type,
    variant: section.variant ?? DEFAULT_EDITABLE_SECTION_META.variant,
    titleInternal: section.titleInternal ?? DEFAULT_EDITABLE_SECTION_META.titleInternal,
    visible: section.visible !== false,
    locked: section.locked ?? DEFAULT_EDITABLE_SECTION_META.locked,
    container: section.container || DEFAULT_EDITABLE_SECTION_META.container,
    spacingTop: section.spacingTop || DEFAULT_EDITABLE_SECTION_META.spacingTop,
    spacingBottom: section.spacingBottom || DEFAULT_EDITABLE_SECTION_META.spacingBottom,
    anchorId: section.anchorId ?? DEFAULT_EDITABLE_SECTION_META.anchorId,
    styleOverrides: section.styleOverrides ?? DEFAULT_EDITABLE_SECTION_META.styleOverrides,
    data: section.data && typeof section.data === 'object' ? section.data : {},
    sortOrder: section.sortOrder ?? DEFAULT_EDITABLE_SECTION_META.sortOrder,
  };
}

export function sortEditableSections(sections: EditableSection[]): EditableSection[] {
  return [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
}
