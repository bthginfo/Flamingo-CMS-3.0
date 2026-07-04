'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type GalleryImage = { src: string; alt?: string; category?: string; location?: string };

export function PortfolioGallerySection({ data }: Props) {
  const badge = (data.badge as string) || 'Portfolio';
  const headline = (data.headline as string) || 'Meine Arbeiten';
  const subline = (data.subline as string) || '';
  const images = (data.images as GalleryImage[]) || [];
  const categories = (data.categories as string[]) || [...new Set(images.map(i => i.category).filter(Boolean))];
  const cta = data.cta as { label: string; href: string; icon?: string } | undefined;

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

  const filterButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${active
      ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)]'
      : 'bg-[var(--token-section-bg-alt)] text-[color:var(--token-muted)] hover:bg-[var(--token-section-bg-alt,theme(colors.gray.200))]'}`;

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button onClick={() => setFilter(null)} className={filterButtonClass(!filter)}>
              Alle
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={filterButtonClass(filter === cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div key={img.src} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="break-inside-avoid cursor-pointer group relative rounded-lg overflow-hidden" onClick={() => setLightbox(i)} data-edit-collection="filtered" data-edit-index={i}>
                <Image data-edit-image="src" src={img.src} alt={img.alt || ''} width={600} height={800} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--token-section-bg-alt)_0%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--token-section-bg-alt)_30%,transparent)] transition-colors duration-300 flex items-end">
                  {(img.alt || img.location) && (
                    <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[color:var(--token-on-dark-heading)] text-sm">
                      {img.alt && <p className="font-medium">{img.alt}</p>}
                      {img.location && <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] text-xs" data-edit-path="location">{img.location}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {cta?.label && (
          <div className="text-center mt-12">
            <a data-edit-link="cta" href={cta.href} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] font-semibold rounded-full hover:opacity-90 transition-opacity shadow-lg">
              <span data-edit-path="label">{cta.label}</span>
              {cta.icon && <DynamicIcon editPath="cta.icon" name={cta.icon} size={18} />}
            </a>
          </div>
        )}
      </div>

      {/* Connected Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--token-section-bg-alt)_95%,transparent)] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)] hover:text-[color:var(--token-on-dark-heading)] z-10" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            {filtered.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] hover:text-[color:var(--token-on-dark-heading)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={36} /></button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] hover:text-[color:var(--token-on-dark-heading)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={36} /></button>
              </>
            )}
            <motion.img key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} src={filtered[lightbox].src} alt={filtered[lightbox].alt || ''} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              {filtered[lightbox].alt && <p className="text-[color:var(--token-on-dark-heading)] text-sm mb-2">{filtered[lightbox].alt}</p>}
              <span className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] text-xs">{lightbox + 1} / {filtered.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
