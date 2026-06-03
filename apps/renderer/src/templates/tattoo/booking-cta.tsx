'use client';

import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function BookingCtaSection({ data }: Props) {
  const headline = (data.headline as string) || 'Termin anfragen';
  const subline = (data.subline as string) || 'Schick uns Deine Idee und wir melden uns innerhalb von 48h.';
  const ctaLabel = (data.ctaLabel as string) || 'Terminanfrage starten';
  const ctaHref = (data.ctaHref as string) || '#kontakt';
  const hints = (data.hints as string[]) || [];

  return (
    <section className="py-16 px-6 bg-neutral-900 border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{headline}</h2>
        {subline && <p className="mt-3 text-white/50">{plain(subline)}</p>}
        {hints.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-white/40">
            {hints.map((h, i) => <span key={i} className="flex items-center gap-1.5">✓ {h}</span>)}
          </div>
        )}
        <a href={ctaHref} className="inline-flex items-center justify-center mt-8 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors" style={{ background: 'var(--brand-btn-bg, white)', color: 'var(--brand-btn-text, black)' }}>
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
