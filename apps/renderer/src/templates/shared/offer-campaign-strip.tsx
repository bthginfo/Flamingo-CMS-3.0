'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, Check } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function OfferCampaignStripSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || '';
  const offerLabel = (data.offerLabel as string) || '';
  const deadline = (data.deadline as string) || '';
  const benefits = (data.benefits as string[]) || [];
  const cta = (data.cta as Cta) || {};

  return (
    <section className="bg-[var(--token-section-bg, var(--style-section-bg,#070707))] px-4 py-8 text-[var(--token-body, var(--style-body-color,#ffffff))]">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--token-card-border, var(--style-border-color,rgba(255,255,255,0.10)))] bg-[var(--token-card-bg, var(--style-card-bg,#18181b))] shadow-2xl">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[280px] overflow-hidden">
            {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full bg-[var(--token-section-bg-alt, var(--style-section-bg-alt,#18181b))]" />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/58" />
            {offerLabel && (
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[var(--token-badge-bg, var(--style-badge-bg,#ffffff))] px-4 py-2 text-xs font-black uppercase text-[var(--token-badge-text, var(--style-badge-text,#111827))]">
                <BadgePercent size={16} />
                {offerLabel}
              </div>
            )}
          </div>
          <div className="p-6 md:p-10">
            {badge && <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--style-accent-color,var(--brand-primary,#fff))]">{badge}</div>}
            {headline && <h2 className="text-3xl font-black leading-tight text-[var(--token-heading, var(--style-heading-color,#ffffff))] md:text-5xl" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--token-body, var(--style-body-color,rgba(255,255,255,0.72)))]" data-edit-path="subline">{plain(subline)}</p>}
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="flex items-center gap-2 text-sm text-[var(--token-body, var(--style-body-color,rgba(255,255,255,0.85)))]" data-edit-collection="benefits" data-edit-index={index}>
                  <Check size={16} className="text-[var(--style-accent-color,var(--brand-primary,#fff))]" />
                  {benefit}
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {cta.label && <a href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,#fff)))] px-5 py-3 text-sm font-bold text-[var(--token-btn-text, var(--brand-btn-text,#111))]">{cta.label}<ArrowRight size={16} /></a>}
              {deadline && <div className="text-sm text-[var(--token-muted, var(--style-text-muted,rgba(255,255,255,0.65)))]">Gültig bis {deadline}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
