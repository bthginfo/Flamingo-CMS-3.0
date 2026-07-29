'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { plain } from '@/lib/strip-html';

type CollectionItem = {
  title: string;
  slug: string;
  image?: string;
  excerpt?: string;
  date?: string;
  priority?: number;
};

type SortOption = 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc' | 'priority';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function sortItems(items: CollectionItem[], sortBy: SortOption): CollectionItem[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return (b.date ?? '').localeCompare(a.date ?? '');
      case 'date-asc':
        return (a.date ?? '').localeCompare(b.date ?? '');
      case 'alpha-asc':
        return a.title.localeCompare(b.title, 'de');
      case 'alpha-desc':
        return b.title.localeCompare(a.title, 'de');
      case 'priority':
        return (a.priority ?? 0) - (b.priority ?? 0);
      default:
        return 0;
    }
  });
}

function searchText(item: CollectionItem): string {
  return plain(`${item.title || ''} ${item.excerpt || ''} ${item.date || ''}`).toLocaleLowerCase('de-DE');
}

const SORT_LABELS: Record<SortOption, string> = {
  'date-desc': 'Neueste zuerst',
  'date-asc': 'Älteste zuerst',
  'alpha-asc': 'A → Z',
  'alpha-desc': 'Z → A',
  priority: 'Priorität',
};

export function CollectionListSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as CollectionItem[]) || [];
  const defaultSort = (data.sortBy as SortOption) || 'date-desc';
  const columns = (data.columns as number) || 3;
  const showImage = data.showImage !== false;
  const showDate = data.showDate !== false;
  const showExcerpt = data.showExcerpt !== false;
  const showSortControls = data.showSortControls !== false;
  const collectionBasePath = (data.collectionBasePath as string) || '';
  const paginate = data.paginate === true || data.pagination === true;
  const itemsPerPageRaw = Number(data.itemsPerPage || data.pageSize || 12);
  const itemsPerPage = Number.isFinite(itemsPerPageRaw) && itemsPerPageRaw > 0 ? Math.floor(itemsPerPageRaw) : 12;
  const showSearch = data.showSearch === true || (paginate && items.length > itemsPerPage);

  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('de-DE');
    if (!normalizedQuery) return items;
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const haystack = searchText(item);
      return terms.every((term) => haystack.includes(term));
    });
  }, [items, query]);

  const sorted = useMemo(() => sortItems(filtered, sortBy), [filtered, sortBy]);
  const pageCount = paginate ? Math.max(1, Math.ceil(sorted.length / itemsPerPage)) : 1;
  const pageStart = paginate ? (page - 1) * itemsPerPage : 0;
  const visibleItems = paginate ? sorted.slice(pageStart, pageStart + itemsPerPage) : sorted;
  const pageNumbers = useMemo(() => {
    if (pageCount <= 9) return Array.from({ length: pageCount }, (_, index) => index + 1);
    const start = Math.max(1, Math.min(page - 4, pageCount - 8));
    return Array.from({ length: 9 }, (_, index) => start + index);
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, query, items.length, itemsPerPage]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      {(headline || subline) && (
        <div className="mb-10 text-center">
          {headline && <h2 className="text-3xl font-bold md:text-4xl" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-2 text-lg text-[color:var(--token-muted)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      {((showSearch && items.length > 1) || (showSortControls && items.length > 1) || (paginate && pageCount > 1)) && (
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {showSearch && items.length > 1 ? (
            <label className="relative block w-full max-w-xl text-[color:var(--token-label)]">
              <span className="sr-only">Einträge durchsuchen</span>
              <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--token-muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={(data.searchPlaceholder as string) || 'Suche nach Titel oder Inhalt'}
                className="h-11 w-full rounded-full border border-[color:var(--token-input-border)] bg-[var(--token-input-bg)] pl-10 pr-4 text-sm text-[color:var(--token-heading)] outline-none transition focus:border-[var(--token-accent)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--token-accent)_18%,transparent)]"
              />
            </label>
          ) : <span />}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {paginate ? (
              <p className="text-sm text-[color:var(--token-muted)]">
                Seite {page} von {pageCount} · {sorted.length}{query ? ` von ${items.length}` : ''} Einträge
              </p>
            ) : <span />}
            {showSortControls && items.length > 1 && (
              <div className="inline-flex items-center gap-2 text-sm">
                <ArrowUpDown size={14} className="text-[color:var(--token-body)]" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="rounded-lg border border-[color:var(--token-input-border)] bg-[var(--token-input-bg)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="py-12 text-center text-[color:var(--token-card-body,var(--token-body))]">{query ? 'Keine Einträge für diese Suche gefunden.' : 'Noch keine Einträge vorhanden.'}</p>
      ) : (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {visibleItems.map((item, i) => {
            const editIndex = pageStart + i;
            return (
              <motion.a
                key={item.slug}
                href={collectionBasePath ? `${collectionBasePath}/${item.slug}` : `/c/${item.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 12) * 0.04, duration: 0.35 }}
                className="group block overflow-hidden rounded-xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm transition-shadow hover:shadow-md"
                data-edit-collection="items"
                data-edit-index={editIndex}
              >
                {showImage && item.image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      data-edit-image="image"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-[color:var(--token-link-hover)]" data-edit-path="title">
                    {item.title}
                  </h3>
                  {showDate && item.date && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--token-card-body,var(--token-body))]">
                      <Calendar size={12} />
                      <time>{new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</time>
                    </div>
                  )}
                  {showExcerpt && item.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-[color:var(--token-card-muted,var(--token-muted))]">{plain(item.excerpt)}</p>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>
      )}

      {paginate && pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Seitennavigation">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] px-4 text-sm font-semibold text-[color:var(--token-card-heading,var(--token-heading))] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-45"
          >
            <ChevronLeft size={16} /> Zurück
          </button>
          <span className="rounded-full px-4 text-sm font-semibold text-[color:var(--token-muted)] sm:hidden">{page}/{pageCount}</span>
          <div className="hidden items-center gap-1 sm:flex">
            {pageNumbers[0] > 1 && <span className="px-2 text-sm text-[color:var(--token-muted)]">…</span>}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={page === pageNumber ? 'page' : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-[color:color-mix(in_srgb,var(--token-accent)_10%,transparent)] aria-[current=page]:bg-[var(--token-btn-bg)] aria-[current=page]:text-[color:var(--token-btn-text)]"
              >
                {pageNumber}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < pageCount && <span className="px-2 text-sm text-[color:var(--token-muted)]">…</span>}
          </div>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={page === pageCount}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] px-4 text-sm font-semibold text-[color:var(--token-card-heading,var(--token-heading))] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-45"
          >
            Weiter <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}
