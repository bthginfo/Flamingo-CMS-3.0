'use client';

import { motion } from 'framer-motion';

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
          {date && <p className="text-white/70 text-sm font-mono uppercase tracking-widest mb-2">{date}</p>}
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase">{headline}</h2>
          {description && <p className="mt-3 text-white/80 max-w-xl mx-auto">{description}</p>}
          <a href={ctaHref} className="inline-flex items-center justify-center mt-6 px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm hover:bg-black/80 transition-colors">
            {ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
