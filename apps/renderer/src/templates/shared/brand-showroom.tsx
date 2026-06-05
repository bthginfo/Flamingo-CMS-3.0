'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';

type Highlight = { title: string; text: string };

type Props = { data: Record<string, unknown>; variant?: string | null };

export function BrandShowroomSection({ data }: Props) {
  const image = (data.image as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const highlights = (data.highlights as Highlight[]) || [];
  const cta = data.cta as { label: string; href: string } | undefined;
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.5;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative rounded-[var(--style-card-radius,1rem)] overflow-hidden min-h-[500px] md:min-h-[600px] flex items-end">
      {image ? (
        <img src={image} alt={headline} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--token-icon, var(--brand-primary,#1e3a5f))] to-[var(--token-subheading, var(--brand-secondary,#0f172a))]" />
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,${overlayOpacity * 0.3}) 50%, transparent 100%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full p-8 md:p-12"
      >
        <div className="max-w-5xl">
          {headline && <h2 className="font-display text-3xl md:text-5xl font-bold text-[color:var(--token-on-dark-heading,#ffffff)] mb-3" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="text-[color:var(--token-on-dark-heading,#ffffff)/80] text-lg md:text-xl max-w-2xl mb-8" data-edit-path="subline">{plain(subline)}</p>}

          {highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-[var(--token-card-bg,#ffffff)/10] backdrop-blur-sm border border-[color:var(--token-card-border,#ffffff)/20] rounded-lg p-4"
                 data-edit-collection="highlights" data-edit-index={i}>
                  <h4 className="font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] text-sm" data-edit-path="title">{h.title}</h4>
                  <p className="text-[color:var(--token-on-dark-heading,#ffffff)/70] text-xs mt-1" data-edit-path="text">{plain(h.text)}</p>
                </motion.div>
              ))}
            </div>
          )}

          {cta?.label && (
            <a href={cta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--token-icon, var(--brand-primary,#2563eb))] text-[color:var(--token-on-dark-heading,#ffffff)] font-semibold rounded-[var(--style-button-radius,0.75rem)] hover:brightness-110 transition-all shadow-lg">
              {cta.label}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
