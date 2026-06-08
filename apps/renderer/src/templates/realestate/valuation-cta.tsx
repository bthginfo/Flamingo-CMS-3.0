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
          <img data-edit-image="bgImage" src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--token-section-bg-alt)_80%,transparent)]" />
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--token-badge-border,var(--token-card-border))] bg-[var(--token-badge-bg)] px-4 py-2 text-sm font-medium text-[color:var(--token-badge-text)]">
            <Home size={16} />
            Immobilienbewertung
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          <p className="text-lg text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] mt-5 max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>

          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center" data-edit-collection="stats" data-edit-index={i}>
                  <p className="text-2xl font-bold text-[color:var(--token-stat-value,var(--token-accent))]" data-edit-path="value">{stat.value}</p>
                  <p className="text-xs text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] mt-1" data-edit-path="label">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <a
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-10 py-4 font-semibold text-[color:var(--token-btn-text)] shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
