'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, Check } from 'lucide-react';

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
    <section data-theme="dark" className="bg-[#070707] px-4 py-8 text-[#ffffff]">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#18181b] shadow-2xl">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[280px] overflow-hidden">
            {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full bg-zinc-900" />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/58" />
            {offerLabel && <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase text-zinc-950"><BadgePercent size={16} />{offerLabel}</div>}
          </div>
          <div className="p-6 md:p-10">
            {badge && <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--style-accent-color,var(--brand-primary,#fff))]">{badge}</div>}
            {headline && <h2 className="text-3xl font-black leading-tight text-[#ffffff] md:text-5xl">{headline}</h2>}
            {subline && <p className="mt-4 max-w-2xl text-base leading-7 text-[rgba(255,255,255,0.72)]">{subline}</p>}
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.78)]">
                  <Check size={16} className="text-[var(--style-accent-color,var(--brand-primary,#fff))]" />{benefit}
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {cta.label && <a href={cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--brand-primary,#fff))] px-5 py-3 text-sm font-bold text-[var(--brand-btn-text,#111)]">{cta.label}<ArrowRight size={16} /></a>}
              {deadline && <div className="text-sm text-[rgba(255,255,255,0.58)]">Gültig bis {deadline}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
