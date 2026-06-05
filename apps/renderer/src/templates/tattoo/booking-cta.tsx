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
    <section className="py-16 px-6 bg-[var(--token-section-bg-alt)] border-y border-[color:color-mix(in_srgb,var(--token-card-border)_5%,transparent)]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <p className="mt-3 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)]" data-edit-path="subline">{plain(subline)}</p>}
        {hints.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_40%,transparent)]">
            {hints.map((h, i) => <span key={i} className="flex items-center gap-1.5" data-edit-collection="hints" data-edit-index={i}>✓ {h}</span>)}
          </div>
        )}
        <a href={ctaHref} className="inline-flex items-center justify-center mt-8 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="ctaLabel">
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
