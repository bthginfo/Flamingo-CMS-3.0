'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function BeforeAfterSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const description = (data.description as string) || '';
  const imageBefore = (data.imageBefore as string) || '';
  const imageAfter = (data.imageAfter as string) || '';
  const labelBefore = (data.labelBefore as string) || 'Vorher';
  const labelAfter = (data.labelAfter as string) || 'Nachher';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMove(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  }

  return (
    <div ref={ref}>
      {(headline || description) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--style-heading-weight,700)] tracking-[var(--style-heading-tracking,-0.02em)] text-[var(--token-body)]" data-edit-path="headline">{headline}</h2>}
          {description && <p className="mt-3 text-[var(--token-body)] text-lg max-w-2xl mx-auto" data-edit-path="description">{plain(description)}</p>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        ref={containerRef}
        className="relative aspect-[16/9] md:aspect-[21/9] rounded-[var(--token-card-radius)] overflow-hidden cursor-col-resize select-none shadow-[var(--style-card-shadow,0_4px_20px_rgba(0,0,0,0.06))]"
        onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX); }}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* After image (full) */}
        <div className="absolute inset-0">
          {imageAfter ? (
            <img src={imageAfter} alt={labelAfter} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center text-green-300 text-2xl">{labelAfter}</div>
          )}
        </div>

        {/* Before image (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          {imageBefore ? (
            <img src={imageBefore} alt={labelBefore} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center text-amber-300 text-2xl">{labelBefore}</div>
          )}
        </div>

        {/* Slider handle */}
        <div className="absolute top-0 bottom-0" style={{ left: `${sliderPos}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 w-1 bg-[var(--token-card-bg)] shadow-lg" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--token-card-bg)] shadow-xl flex items-center justify-center border-2 border-[var(--token-icon)]">
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-[var(--token-icon)]">
              <path d="M4 8L1 5.5V10.5L4 8ZM12 8L15 5.5V10.5L12 8Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold bg-[var(--token-section-bg-alt)/50] text-[color:var(--token-on-dark-heading)] rounded-full">{labelBefore}</span>
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-[var(--token-section-bg-alt)/50] text-[color:var(--token-on-dark-heading)] rounded-full">{labelAfter}</span>
      </motion.div>
    </div>
  );
}
