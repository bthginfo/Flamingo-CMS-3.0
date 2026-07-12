export type TimelineViewEntry = {
  year?: string;
  title?: string;
  text?: string;
};

export type TestimonialViewItem = {
  quote?: string;
  name?: string;
  role?: string;
  image?: string;
  rating?: number;
};

export type IndexedCollectionItem<T> = {
  item: T;
  originalIndex: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Build the visible timeline view without losing the source-array index used
 * by live-preview editing paths.
 */
export function getVisibleTimelineEntries(data: Record<string, unknown>): {
  collectionKey: 'entries' | 'items' | 'steps';
  entries: IndexedCollectionItem<TimelineViewEntry>[];
} {
  const collectionKey = Array.isArray(data.entries)
    ? 'entries'
    : Array.isArray(data.items)
      ? 'items'
      : 'steps';
  const source = Array.isArray(data[collectionKey]) ? data[collectionKey] : [];
  const entries = source.flatMap((value, originalIndex) => {
    if (!isRecord(value)) return [];
    const item: TimelineViewEntry = {
      year: typeof value.year === 'string' ? value.year : undefined,
      title: typeof value.title === 'string' ? value.title : undefined,
      text: typeof value.text === 'string' ? value.text : undefined,
    };
    return item.year || item.title || item.text ? [{ item, originalIndex }] : [];
  });

  return { collectionKey, entries };
}

/** Preserve source indices when blank testimonial rows are not rendered. */
export function getVisibleTestimonialItems(value: unknown): IndexedCollectionItem<TestimonialViewItem>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate, originalIndex) => {
    if (!isRecord(candidate)) return [];
    const item: TestimonialViewItem = {
      quote: typeof candidate.quote === 'string' ? candidate.quote : undefined,
      name: typeof candidate.name === 'string' ? candidate.name : undefined,
      role: typeof candidate.role === 'string' ? candidate.role : undefined,
      image: typeof candidate.image === 'string' ? candidate.image : undefined,
      rating: typeof candidate.rating === 'number' ? candidate.rating : undefined,
    };
    return item.quote || item.name ? [{ item, originalIndex }] : [];
  });
}
