'use client';

import { useState } from 'react';
import { GalleryGridSection } from '@/templates/handwerk/gallery-grid';
import { ActionLink, PremiumSectionHeader } from '@/templates/shared/section-primitives';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type GalleryImage = { src: string; alt?: string; category?: string; location?: string; width?: number; height?: number };

/** The portfolio uses the same keyboard-accessible viewer as ordinary galleries. */
export function PortfolioGallerySection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const images = ((data.images as GalleryImage[]) || []).filter(image => image.src);
  const categories = (data.categories as string[]) || [...new Set(images.map(image => image.category).filter((category): category is string => Boolean(category)))];
  const cta = data.cta as { label: string; href: string } | undefined;
  const [filter, setFilter] = useState<string | null>(null);
  const [limit, setLimit] = useState(18);
  const filtered = filter ? images.filter(image => image.category === filter) : images;
  function select(category: string | null) { setFilter(category); setLimit(18); }
  const filterClass = (selected: boolean) => `min-h-11 rounded-[var(--token-button-radius)] border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)] ${selected ? 'border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]' : 'border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)] hover:bg-[var(--token-section-bg-alt)]'}`;

  if (!images.length) return null;
  return <div>
    <PremiumSectionHeader headline={headline} subline={subline} />
    {categories.length > 1 && <div role="group" aria-label="Bilder nach Projekt filtern" className="mb-9 flex flex-wrap gap-2">
      <button type="button" aria-pressed={filter === null} onClick={() => select(null)} className={filterClass(!filter)}>Alle</button>
      {categories.map(category => <button type="button" key={category} aria-pressed={filter === category} onClick={() => select(category)} className={filterClass(filter === category)}>{category}</button>)}
    </div>}
    <p className="sr-only" aria-live="polite">{filtered.length} Bilder{filter ? ` in ${filter}` : ''}</p>
    <GalleryGridSection key={filter || 'all'} data={{ images: filtered.slice(0, limit).map(image => ({ ...image, caption: image.location || '' })), columns: 3 }} />
    {limit < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => setLimit(current => current + 18)} className="cms-button cms-button--secondary">Weitere Bilder anzeigen ({filtered.length - limit})</button></div>}
    {cta?.label && <div className="mt-10"><ActionLink action={cta} /></div>}
  </div>;
}
