export type EditorialItem = Record<string, unknown> & { id: string };

/** A panel follows section/item identity, independently from order or React tree shape. */
export function editorialItemPanelId(sectionId: string, itemId: string): string {
  return `item-editor-${encodeURIComponent(sectionId)}-${encodeURIComponent(itemId)}`;
}

/** Fill missing/duplicate IDs deterministically, preserving every authored field. */
export function editorialItems(value: unknown): EditorialItem[] {
  if (!Array.isArray(value)) return [];
  const used = new Set<string>();
  return value.flatMap((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return [];
    const item = row as Record<string, unknown>;
    let id = typeof item.id === 'string' && item.id.trim() ? item.id : `item-${index + 1}`;
    while (used.has(id)) id = `${id}-copy`;
    used.add(id);
    return [{ ...item, id }];
  });
}

export function moveEditorialItem(items: EditorialItem[], id: string, direction: -1 | 1): EditorialItem[] {
  const index = items.findIndex(item => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function duplicateEditorialItem(items: EditorialItem[], id: string, newId: string): EditorialItem[] {
  const index = items.findIndex(item => item.id === id);
  if (index < 0 || items.some(item => item.id === newId)) return items;
  const duplicate = JSON.parse(JSON.stringify(items[index])) as EditorialItem;
  duplicate.id = newId;
  return [...items.slice(0, index + 1), duplicate, ...items.slice(index + 1)];
}

export function newEditorialItem(id: string, image = '', imageAlt = ''): EditorialItem {
  return { id, title: '', text: '', image, imageAlt, imagePosition: 'center', imageMobilePosition: '', link: { label: '', href: '', iconPrefix: '', iconSuffix: 'ArrowUpRight' } };
}
