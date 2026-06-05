'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BlurImage as Image } from '@/components/ui/blur-image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryImage = { src: string; alt?: string; caption?: string; width?: number; height?: number };
type Props = { data: Record<string, unknown>; variant?: string | null };

export function GalleryGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const images = (data.images as GalleryImage[]) || [];
  const columns = (data.columns as number) || 3;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const navigate = useCallback((dir: 1 | -1) => {
    setLightbox(prev => prev !== null ? (prev + dir + images.length) % images.length : null);
  }, [images.length]);

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

  // Masonry: distribute images into columns by shortest column height
  const colCount = Math.min(columns, images.length);
  const masonryColumns: GalleryImage[][] = Array.from({ length: colCount }, () => []);
  const colHeights = new Array(colCount).fill(0);

  for (const img of images) {
    const ratio = (img.height && img.width) ? img.height / img.width : 1;
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    masonryColumns[shortest].push(img);
    colHeights[shortest] += ratio;
  }

  return (
    <div ref={ref}>
      {headline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </motion.div>
      )}

      {/* Masonry Grid */}
      <div className="flex gap-3" style={{ columnCount: colCount }}>
        {masonryColumns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-3" data-edit-collection="masonryColumns" data-edit-index={colIdx}>
            {col.map((img) => {
              const globalIdx = images.indexOf(img);
              const aspectRatio = (img.width && img.height) ? img.width / img.height : 1;
              return (
                <motion.button
                  key={globalIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: globalIdx * 0.04 }}
                  onClick={() => setLightbox(globalIdx)}
                  className="relative w-full rounded-xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio }}
                >
                  <Image src={img.src} alt={img.alt || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes={`(max-width: 768px) 50vw, ${Math.round(100 / colCount)}vw`} />
                  <div className="absolute inset-0 bg-[var(--token-section-bg-alt)/0] group-hover:bg-[var(--token-section-bg-alt)/20] transition-colors" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent text-[color:var(--token-on-dark-heading)] text-xs opacity-0 group-hover:opacity-100 transition-opacity" data-edit-path="caption">
                      {img.caption}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Connected Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--token-section-bg-alt)/95] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-[color:var(--token-on-dark-heading)/80] hover:text-[color:var(--token-on-dark-heading)] z-10" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            {images.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--token-on-dark-heading)/70] hover:text-[color:var(--token-on-dark-heading)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={36} /></button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--token-on-dark-heading)/70] hover:text-[color:var(--token-on-dark-heading)] z-10 p-2" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={36} /></button>
              </>
            )}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
              style={{ aspectRatio: (images[lightbox].width && images[lightbox].height) ? images[lightbox].width! / images[lightbox].height! : 4 / 3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt || ''}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
            {/* Counter + Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              {images[lightbox].caption && <p className="text-[color:var(--token-on-dark-heading)] text-sm mb-2" data-edit-path="caption">{images[lightbox].caption}</p>}
              <span className="text-[color:var(--token-on-dark-heading)/50] text-xs">{lightbox + 1} / {images.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
