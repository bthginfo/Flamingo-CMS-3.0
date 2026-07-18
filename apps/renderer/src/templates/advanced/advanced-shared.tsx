import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';

export type AdvancedCta = { label?: string; href?: string };

export function AdvancedIntro({ badge, headline, subline, aside, compact = false }: { badge?: string; headline?: string; subline?: string; aside?: ReactNode; compact?: boolean }) {
  return (
    <div className={`grid min-w-0 items-end gap-6 ${compact ? 'lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.42fr)]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.48fr)] lg:gap-7'}`}>
      <div className="min-w-0">
        {badge && <p className="section-badge mb-4 w-fit" data-edit-path="badge">{badge}</p>}
        {headline && <h2 className={`max-w-5xl hyphens-auto [overflow-wrap:anywhere] font-black text-[color:var(--token-heading)] ${compact ? 'text-[clamp(1.9rem,3.2vw,3.5rem)] leading-[.96] tracking-[-.045em]' : 'text-[clamp(2.15rem,5.4vw,5.8rem)] leading-[.92] tracking-[-.055em]'}`} data-edit-path="headline">{headline}</h2>}
      </div>
      <div className="min-w-0">
        {subline && <p className={`max-w-xl text-[color:var(--token-muted)] ${compact ? 'text-sm leading-6' : 'text-base leading-7 md:text-lg'}`} data-edit-path="subline">{plain(subline)}</p>}
        {aside}
      </div>
    </div>
  );
}

export function AdvancedLink({ cta, className = '' }: { cta?: AdvancedCta; className?: string }) {
  const href = safeContentUrl(cta?.href || '');
  if (!href || !cta?.label) return null;
  return <a href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)] ${className}`} data-edit-path="cta.label">{cta.label}<ArrowUpRight size={16} /></a>;
}

export function EmptyVisual({ label = 'Bild ergänzen' }: { label?: string }) {
  return <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_32%_20%,color-mix(in_srgb,var(--token-accent)_22%,transparent),transparent_48%),var(--token-section-bg-alt)] p-8 text-center text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-muted)]">{label}</div>;
}
