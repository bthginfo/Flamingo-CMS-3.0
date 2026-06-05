'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type GalleryImage = { src: string; alt?: string; category?: string; location?: string };

export function PortfolioGallerySection({ data, styleVariant }: Props) {
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

  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  const sectionClasses = isBold ? 'py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg-alt,#09090b)] text-[color:var(--token-on-dark-heading,#ffffff)]' : isModern ? 'py-24 md:py-36 px-4 md:px-6' : 'py-12 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg,#ffffff)]';

  return (
    <section className={sectionClasses}>
      <div className="max-w-7xl mx-auto">
        <div className={isModern ? 'mb-16' : 'text-center mb-12'}>
          {isBold && <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>}
          {isModern && <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body,#a1a1aa)] mb-4" data-edit-path="badge">{badge}</p>}
          {!isBold && !isModern && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {isModern ? (
            <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] break-words" data-edit-path="headline">{headline}</h2>
          ) : isBold ? (
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide break-words" data-edit-path="headline">{headline}</h2>
          ) : (
            <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          )}
          {subline && !isModern && !isBold && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>

        {categories.length > 1 && (
          <div className={`flex flex-wrap ${isModern ? '' : 'justify-center'} gap-2 mb-10`}>
            <button onClick={() => setFilter(null)} className={isModern ? `px-3 py-1.5 text-sm transition-colors ${!filter ? 'text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)]' : 'text-[color:var(--token-body,#a1a1aa)] hover:text-[color:var(--token-heading,#18181b)]'}` : isBold ? `px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${!filter ? 'bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)]' : 'text-[color:var(--token-on-dark-heading,#ffffff)/60] hover:text-[color:var(--token-on-dark-heading,#ffffff)] border border-[color:var(--token-card-border,#ffffff)/10]'}` : `px-4 py-2 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)]' : 'bg-[var(--token-section-bg-alt,#f4f4f5)] text-[color:var(--token-muted,#52525b)] hover:bg-gray-200'}`}>
              Alle
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={isModern ? `px-3 py-1.5 text-sm transition-colors ${filter === cat ? 'text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)]' : 'text-[color:var(--token-body,#a1a1aa)] hover:text-[color:var(--token-heading,#18181b)]'}` : isBold ? `px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filter === cat ? 'bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)]' : 'text-[color:var(--token-on-dark-heading,#ffffff)/60] hover:text-[color:var(--token-on-dark-heading,#ffffff)] border border-[color:var(--token-card-border,#ffffff)/10]'}` : `px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)]' : 'bg-[var(--token-section-bg-alt,#f4f4f5)] text-[color:var(--token-muted,#52525b)] hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className={isModern ? 'grid grid-cols-2 md:grid-cols-4 gap-1' : isBold ? 'columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2' : 'columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3'}>
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div key={img.src} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className={`${isModern ? 'relative aspect-square' : 'break-inside-avoid'} cursor-pointer group relative ${!isModern ? 'rounded-lg' : ''} overflow-hidden`} onClick={() => setLightbox(i)} data-edit-collection="filtered" data-edit-index={i}>
                <Image src={img.src} alt={img.alt || ''} {...(isModern ? { fill: true, className: 'object-cover transition-transform duration-500 group-hover:scale-105' } : { width: 600, height: 800, className: 'w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105' })} />
                {isBold && <div className="absolute inset-0 border border-[color:var(--token-card-border,#ffffff)/10]" />}
                <div className={`absolute inset-0 ${isBold ? 'bg-[var(--token-section-bg-alt,#000000)/0] group-hover:bg-[var(--token-section-bg-alt,#000000)/50]' : 'bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))/0] group-hover:bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))/30]'} transition-colors duration-300 flex items-end`}>
                  {(img.alt || img.location) && (
                    <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[color:var(--token-on-dark-heading,#ffffff)] text-sm">
                      {img.alt && <p className="font-medium">{img.alt}</p>}
                      {img.location && <p className="text-[color:var(--token-on-dark-heading,#ffffff)/70] text-xs">{img.location}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {cta?.label && (
          <div className={`${isModern ? '' : 'text-center'} mt-12`}>
            <a href={cta.href} className={isModern ? 'inline-block text-sm text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)] hover:opacity-70' : isBold ? 'inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity' : 'inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)] font-semibold rounded-full hover:opacity-90 transition-opacity shadow-lg'}>
              {cta.label}
              {cta.icon && <DynamicIcon name={cta.icon} size={18} />}
            </a>
          </div>
        )}
      </div>

      {/* Connected Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[var(--token-section-bg-alt,#000000)/95] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 text-[color:var(--token-on-dark-heading,#ffffff)/80] hover:text-[color:var(--token-on-dark-heading,#ffffff)] z-10" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            {filtered.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--token-on-dark-heading,#ffffff)/70] hover:text-[color:var(--token-on-dark-heading,#ffffff)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={36} /></button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--token-on-dark-heading,#ffffff)/70] hover:text-[color:var(--token-on-dark-heading,#ffffff)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={36} /></button>
              </>
            )}
            <motion.img key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }} src={filtered[lightbox].src} alt={filtered[lightbox].alt || ''} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              {filtered[lightbox].alt && <p className="text-[color:var(--token-on-dark-heading,#ffffff)] text-sm mb-2">{filtered[lightbox].alt}</p>}
              <span className="text-[color:var(--token-on-dark-heading,#ffffff)/50] text-xs">{lightbox + 1} / {filtered.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
