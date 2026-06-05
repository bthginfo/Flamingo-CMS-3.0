'use client';

import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FlashDayBannerSection({ data }: Props) {
  const headline = (data.headline as string) || 'Flash Day';
  const date = (data.date as string) || '';
  const description = (data.description as string) || '';
  const ctaLabel = (data.ctaLabel as string) || 'Motiv sichern';
  const ctaHref = (data.ctaHref as string) || '#kontakt';
  const bgColor = (data.bgColor as string) || '#dc2626';

  return (
    <section className="py-12 px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          {date && <p className="text-[color:var(--token-on-dark-heading)/70] text-sm font-mono uppercase tracking-widest mb-2" data-edit-path="date">{date}</p>}
          <h2 className="text-3xl sm:text-5xl font-black text-[color:var(--token-on-dark-heading)] uppercase" data-edit-path="headline">{headline}</h2>
          {description && <p className="mt-3 text-[color:var(--token-on-dark-heading)/80] max-w-xl mx-auto" data-edit-path="description">{plain(description)}</p>}
          <a href={ctaHref} className="inline-flex items-center justify-center mt-6 px-8 py-3 bg-[var(--token-section-bg-alt)] text-[color:var(--token-on-dark-heading)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--token-section-bg-alt)/80] transition-colors" data-edit-path="ctaLabel">
            {ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
