'use client';

import { NumberTicker } from '@/components/ui/fx';

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
          {/* Heading/subline render on-dark WHITE — needs a DARK scrim, not the
              light --token-section-bg-alt veil that washed them out over photos. */}
          <div className="absolute inset-0 bg-[var(--token-image-overlay)]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--token-section-bg)] via-[var(--token-section-bg-alt)] to-[var(--token-section-bg)]" />
      )}
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--token-badge-bg)] rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--token-badge-bg)] rounded-full blur-3xl opacity-30" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-2 text-sm font-medium text-[color:var(--token-badge-text)]">
            <Home size={16} />
            Immobilienbewertung
          </div>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${bgImage ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`} data-edit-path="headline">{headline}</h2>
          <p className={`text-lg mt-5 max-w-2xl mx-auto ${bgImage ? 'text-[color:var(--token-on-dark-body)]' : 'text-[color:var(--token-body)]'}`} data-edit-path="subline">{plain(subline)}</p>

          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center" data-edit-collection="stats" data-edit-index={i}>
                  <p className="text-2xl font-bold text-[color:var(--token-stat-value)]" data-edit-path="value">{(() => { const m = String(stat.value).match(/^([\d.,]+)(.*)$/); return m ? <><NumberTicker value={m[1]} />{m[2]}</> : stat.value; })()}</p>
                  <p className={`text-xs mt-1 ${bgImage ? 'text-[color:var(--token-on-dark-muted)]' : 'text-[color:var(--token-muted)]'}`} data-edit-path="label">{stat.label}</p>
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
