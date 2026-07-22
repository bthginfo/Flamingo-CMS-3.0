'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function BookingCtaSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || 'Termin anfragen';
  const subline = (data.subline as string) || 'Schick uns Deine Idee und wir melden uns innerhalb von 48h.';
  const ctaLabel = (data.ctaLabel as string) || 'Terminanfrage starten';
  const ctaHref = (data.ctaHref as string) || '#kontakt';
  const hints = (data.hints as string[]) || [];

  return (
    <section className="relative overflow-hidden py-16 md:py-20 px-6 bg-[var(--token-section-bg-alt)] border-y border-[color:color-mix(in_srgb,var(--token-card-border)_25%,transparent)]">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--token-accent), transparent)' }} />
      <div className="relative max-w-3xl mx-auto text-center">
        {badge && (
          <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex rounded-full border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badge">{badge}</motion.span>
        )}
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[color:var(--token-on-dark-heading)] ${badge ? 'mt-5' : ''}`} data-edit-path="headline">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="mt-4 text-lg text-[color:var(--token-on-dark-body)]" data-edit-path="subline">{plain(subline)}</motion.p>}
        {hints.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 mt-7 text-sm text-[color:var(--token-on-dark-muted)]">
            {hints.map((h, i) => (
              <span key={i} className="flex items-center gap-2">
                <Check size={15} className="text-[color:var(--token-check)]" /><span data-edit-path={`hints.${i}`}>{h}</span>
              </span>
            ))}
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <a href={ctaHref} className="group inline-flex items-center gap-2.5 justify-center mt-9 px-9 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]" data-edit-path="ctaLabel">
            {ctaLabel}
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
