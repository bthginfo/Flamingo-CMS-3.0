'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
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

const SORT_LABELS: Record<SortOption, string> = {
  'date-desc': 'Neueste zuerst',
  'date-asc': 'Älteste zuerst',
  'alpha-asc': 'A → Z',
  'alpha-desc': 'Z → A',
  'priority': 'Priorität',
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

  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);
  const sorted = useMemo(() => sortItems(items, sortBy), [items, sortBy]);

  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="text-3xl md:text-4xl font-bold" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="text-lg text-[color:var(--token-muted,#71717a)] mt-2" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      {showSortControls && items.length > 1 && (
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center gap-2 text-sm">
            <ArrowUpDown size={14} className="text-[color:var(--token-body,#a1a1aa)]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="border border-[color:var(--token-card-border,#e4e4e7)] rounded-lg px-3 py-1.5 text-sm bg-[var(--token-card-bg,#ffffff)] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-center text-[color:var(--token-body,#a1a1aa)] py-12">Noch keine Einträge vorhanden.</p>
      ) : (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {sorted.map((item, i) => (
            <motion.a
              key={item.slug}
              href={collectionBasePath ? `${collectionBasePath}/${item.slug}` : `/c/${item.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group block rounded-xl border border-[color:var(--token-card-border,#f4f4f5)] bg-[var(--token-card-bg,#ffffff)] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
             data-edit-collection="sorted" data-edit-index={i}>
              {showImage && item.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-lg group-hover:text-[var(--style-brand)] transition-colors">
                  {item.title}
                </h3>
                {showDate && item.date && (
                  <div className="flex items-center gap-1.5 text-xs text-[color:var(--token-body,#a1a1aa)] mt-2">
                    <Calendar size={12} />
                    <time>{new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</time>
                  </div>
                )}
                {showExcerpt && item.excerpt && (
                  <p className="text-sm text-[color:var(--token-muted,#71717a)] mt-2 line-clamp-3">{item.excerpt}</p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
