'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Slide = {
  imageBefore: string;
  imageAfter: string;
  labelBefore?: string;
  labelAfter?: string;
  caption?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function BeforeAfterSliderSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const slides = (data.slides as Slide[]) || [];
  const handleColor = (data.handleColor as string) || 'var(--token-icon, var(--brand-primary, #18181b))';
  const bgColor = (data.bgColor as string) || 'var(--token-section-bg, var(--style-section-bg, transparent))';
  const textColor = (data.textColor as string) || 'var(--token-body, var(--style-body-color, inherit))';
  const aspectRatio = (data.aspectRatio as string) || '16/9';

  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = slides[activeSlide];

  if (!currentSlide) return null;

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-5xl mx-auto px-5">
        {(headline || subline) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            {headline && <h2 className="text-3xl md:text-4xl font-bold text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,inherit)))]">{headline}</h2>}
            {subline && <p className="mt-3 max-w-xl mx-auto text-[var(--token-subheading, var(--style-subheading-color,var(--style-text-secondary,#71717a)))]">{plain(subline)}</p>}
          </motion.div>
        )}

        <SliderWidget slide={currentSlide} handleColor={handleColor} aspectRatio={aspectRatio} />

        {currentSlide.caption && (
          <p className="text-center text-sm text-[var(--token-muted, var(--style-text-muted,#71717a))] mt-4">{currentSlide.caption}</p>
        )}

        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ backgroundColor: i === activeSlide ? handleColor : '#d4d4d8' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SliderWidget({ slide, handleColor, aspectRatio }: { slide: Slide; handleColor: string; aspectRatio: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Auto-animate on first view
  useEffect(() => {
    if (isInView && !hasInteracted) {
      let frame: number;
      const start = performance.now();
      const animate = (time: number) => {
        const elapsed = time - start;
        if (elapsed < 1200) {
          // Ease out: go from 50 → 70 → 30 → 50
          const t = elapsed / 1200;
          const val = 50 + Math.sin(t * Math.PI * 2) * 20 * (1 - t);
          setPosition(val);
          frame = requestAnimationFrame(animate);
        } else {
          setPosition(50);
        }
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, [isInView, hasInteracted]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl select-none cursor-col-resize"
      style={{ aspectRatio }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After image (full) */}
      <img src={slide.imageAfter} alt={slide.labelAfter || 'Nachher'} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before image (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={slide.imageBefore} alt={slide.labelBefore || 'Vorher'} className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* Handle */}
      <div className="absolute top-0 bottom-0 w-0.5" style={{ left: `${position}%`, backgroundColor: handleColor }}>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: handleColor }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Pulse glow hint */}
        {!hasInteracted && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: handleColor }}
          />
        )}
      </div>

      {/* Labels */}
      {slide.labelBefore && position > 15 && (
        <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-1 rounded">
          {slide.labelBefore}
        </span>
      )}
      {slide.labelAfter && position < 85 && (
        <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-1 rounded">
          {slide.labelAfter}
        </span>
      )}
    </motion.div>
  );
}
