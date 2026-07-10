'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type GalleryImage = { src: string; alt?: string; category?: string; caption?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function GalleryProSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const images = (data.images as GalleryImage[]) || [];
  const categories = (data.categories as string[]) || [...new Set(images.map(i => i.category).filter(Boolean))] as string[];
  const [filter, setFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter ? images.filter(i => i.category === filter) : images;

  const navigate = useCallback((dir: 1 | -1) => {
    setLightbox(prev => prev !== null ? (prev + dir + filtered.length) % filtered.length : null);
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [lightbox, navigate]);

  if (!images.length) return null;

  return (
    <div>
      {(badge || headline) && (
        <div className="mb-10 max-w-3xl">
          {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {headline && <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => setFilter(null)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${!filter ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow' : 'border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-muted)] hover:text-[color:var(--token-heading)]'}`}>Alle</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${filter === cat ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow' : 'border border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-muted)] hover:text-[color:var(--token-heading)]'}`}>{cat}</button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-3 space-y-3 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => (
            <motion.figure key={img.src} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3 }} className="group relative cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl" onClick={() => setLightbox(i)} data-edit-collection="images" data-edit-index={i}>
              <img data-edit-image="src" src={img.src} alt={img.alt || ''} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
              {(img.caption || img.category) && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-[linear-gradient(to_top,var(--token-image-overlay),transparent)] p-3 pt-8 text-sm text-[color:var(--token-on-dark-heading)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption && <span className="block font-medium" data-edit-path="caption">{img.caption}</span>}
                  {img.category && <span className="text-xs text-[color:var(--token-on-dark-muted)]">{img.category}</span>}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--token-image-overlay)] p-4 backdrop-blur-xl" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
            <button aria-label="Schließen" className="absolute right-6 top-6 z-10 text-[color:var(--token-on-dark-muted)] transition hover:text-[color:var(--token-on-dark-heading)]" onClick={() => setLightbox(null)}><X size={30} /></button>
            {filtered.length > 1 && (
              <>
                <button aria-label="Vorheriges Bild" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2 text-[color:var(--token-on-dark-muted)] transition hover:text-[color:var(--token-on-dark-heading)]" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={34} /></button>
                <button aria-label="Nächstes Bild" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2 text-[color:var(--token-on-dark-muted)] transition hover:text-[color:var(--token-on-dark-heading)]" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={34} /></button>
              </>
            )}
            <motion.img key={lightbox} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.2 }} src={filtered[lightbox].src} alt={filtered[lightbox].alt || ''} className="max-h-[85vh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            <div className="absolute inset-x-0 bottom-6 text-center">
              {filtered[lightbox].caption && <p className="mb-1.5 text-sm text-[color:var(--token-on-dark-heading)]">{filtered[lightbox].caption}</p>}
              <span className="text-xs text-[color:var(--token-on-dark-muted)]">{lightbox + 1} / {filtered.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
