'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Panel = {
  image: string;
  title: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  overlayColor?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function HorizontalScrollShowcaseSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const panels = (data.panels as Panel[]) || [];
  const bgColor = (data.bgColor as string) || 'var(--token-section-bg, var(--style-section-bg, #09090b))';
  const textColor = (data.textColor as string) || 'var(--token-body, var(--style-body-color, #ffffff))';
  const dotColor = (data.dotColor as string) || 'var(--token-icon, var(--brand-primary, #ffffff))';
  const panelHeight = (data.panelHeight as string) || 'full'; // full | compact

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (panels.length === 0) return null;

  if (isMobile) {
    return <MobileCarousel headline={headline} subline={plain(subline)} panels={panels} bgColor={bgColor} textColor={textColor} dotColor={dotColor} />;
  }

  return <DesktopStickyScroll headline={headline} subline={plain(subline)} panels={panels} bgColor={bgColor} textColor={textColor} dotColor={dotColor} panelHeight={panelHeight} />;
}

function DesktopStickyScroll({ headline, subline, panels, bgColor, textColor, dotColor, panelHeight }: {
  headline: string; subline: string; panels: Panel[]; bgColor: string; textColor: string; dotColor: string; panelHeight: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(panels.length - 1) * 100}%`]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.round(v * (panels.length - 1));
    setActiveIndex(Math.min(idx, panels.length - 1));
  });

  const sectionHeight = panelHeight === 'compact' ? '80vh' : '100vh';

  return (
    <section ref={containerRef} style={{ height: `${panels.length * 100}vh`, backgroundColor: bgColor, color: textColor }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: sectionHeight }}>
        {/* Header */}
        {(headline || subline) && (
          <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10 max-w-md">
            {headline && <h2 className="text-2xl md:text-3xl font-bold" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-1 text-sm opacity-70" data-edit-path="subline">{plain(subline)}</p>}
          </div>
        )}

        {/* Panels track */}
        <motion.div className="flex h-full" style={{ x, width: `${panels.length * 100}%` }}>
          {panels.map((panel, i) => (
            <div key={i} className="relative flex-shrink-0 h-full" style={{ width: `${100 / panels.length}%` }} data-edit-collection="panels" data-edit-index={i}>
              <img src={panel.image} alt={panel.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: panel.overlayColor || 'rgba(0,0,0,0.4)' }} />
              <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-14 max-w-lg">
                <motion.h3
                  className="text-2xl md:text-4xl font-bold"
                  initial={{ opacity: 0, y: 30 }}
                  animate={i === activeIndex ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  {panel.title}
                </motion.h3>
                {panel.text && <p className="mt-3 opacity-80 leading-relaxed" data-edit-path="text">{plain(panel.text)}</p>}
                {panel.ctaLabel && panel.ctaHref && (
                  <a href={panel.ctaHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity">
                    {panel.ctaLabel} <span>→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {panels.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: dotColor, opacity: i === activeIndex ? 1 : 0.3, transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)' }}
             data-edit-collection="panels" data-edit-index={i}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileCarousel({ headline, subline, panels, bgColor, textColor, dotColor }: {
  headline: string; subline: string; panels: Panel[]; bgColor: string; textColor: string; dotColor: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    setActiveIndex(Math.round(scrollLeft / offsetWidth));
  };

  return (
    <section className="py-16" style={{ backgroundColor: bgColor, color: textColor }}>
      {(headline || subline) && (
        <div className="px-5 mb-6">
          {headline && <h2 className="text-2xl font-bold" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-1 text-sm opacity-70" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {panels.map((panel, i) => (
          <div key={i} className="flex-shrink-0 w-full snap-center px-4" data-edit-collection="panels" data-edit-index={i}>
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={panel.image} alt={panel.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: panel.overlayColor || 'rgba(0,0,0,0.4)' }} />
              <div className="relative z-10 flex flex-col justify-end h-full p-6">
                <h3 className="text-xl font-bold" data-edit-path="title">{panel.title}</h3>
                {panel.text && <p className="mt-2 text-sm opacity-80" data-edit-path="text">{plain(panel.text)}</p>}
                {panel.ctaLabel && panel.ctaHref && (
                  <a href={panel.ctaHref} className="mt-3 text-sm font-semibold opacity-90">{panel.ctaLabel} →</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {panels.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: dotColor, opacity: i === activeIndex ? 1 : 0.3 }}  data-edit-collection="panels" data-edit-index={i}/>
        ))}
      </div>
    </section>
  );
}
