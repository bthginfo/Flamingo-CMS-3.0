'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ValuationCtaSection({ data }: Props) {
  const headline = (data.headline as string) || 'Was ist Ihre Immobilie wert?';
  const subline = (data.subline as string) || 'Erhalten Sie eine kostenlose und unverbindliche Bewertung durch unsere Experten.';
  const ctaLabel = (data.ctaLabel as string) || 'Kostenlose Bewertung anfordern';
  const ctaHref = (data.ctaHref as string) || '/kontakt';
  const bgImage = (data.bgImage as string) || '';
  const stats = (data.stats as { label: string; value: string }[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background image or gradient */}
      {bgImage ? (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[var(--token-section-bg-alt)/80]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
      )}
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Home size={16} />
            Immobilienbewertung
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          <p className="text-lg text-[color:var(--token-on-dark-heading)/70] mt-5 max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>

          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center" data-edit-collection="stats" data-edit-index={i}>
                  <p className="text-2xl font-bold text-amber-400" data-edit-path="value">{stat.value}</p>
                  <p className="text-xs text-[color:var(--token-on-dark-heading)/50] mt-1" data-edit-path="label">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 mt-10 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-[color:var(--token-on-dark-heading)] font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
