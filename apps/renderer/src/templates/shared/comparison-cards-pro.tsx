'use client';

import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Plan = { name: string; price?: string; note?: string; highlighted?: boolean; features?: string[]; missing?: string[]; ctaLabel?: string; ctaHref?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ComparisonCardsProSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const plans = (data.plans as Plan[]) || [];
  if (!plans.length) return null;

  return (
    <div>
      <div className="mx-auto mb-12 max-w-3xl text-center">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.article key={index} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className={`relative flex min-h-[460px] flex-col rounded-3xl border bg-[var(--token-card-bg,var(--style-card-bg,#fff))] p-6 text-[var(--token-body,var(--style-body-color,#27272a))] shadow-sm ${plan.highlighted ? 'border-[var(--token-btn-bg,var(--brand-btn-bg,var(--token-eyebrow,var(--brand-primary))))] shadow-2xl ring-2 ring-[color-mix(in_srgb,var(--token-btn-bg,var(--brand-btn-bg,var(--token-eyebrow,var(--brand-primary))))_18%,transparent)]' : 'border-[var(--token-card-border,var(--style-border-color,rgba(0,0,0,0.08)))]'}`} data-edit-collection="plans" data-edit-index={index}>
            {plan.highlighted && <div className="absolute right-5 top-5 rounded-full bg-[var(--token-badge-bg,var(--token-btn-bg,var(--brand-btn-bg,var(--token-eyebrow,var(--brand-primary)))))] px-3 py-1 text-xs font-black uppercase text-[var(--token-badge-text,var(--token-btn-text,#ffffff))]">Empfohlen</div>}
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--token-eyebrow,var(--style-accent-color,var(--token-icon,var(--brand-primary))))]">{plan.name}</div>
            {plan.price && <div className="mt-5 text-4xl font-black">{plan.price}</div>}
            {plan.note && <p className="mt-3 text-sm leading-6 text-[var(--token-muted,var(--style-text-muted,#71717a))]">{plan.note}</p>}
            <div className="mt-7 space-y-3">
              {(plan.features || []).map((feature, i) => <div key={i} className="flex gap-2 text-sm" data-edit-collection="features" data-edit-index={i}><Check size={17} className="text-[var(--token-check,var(--style-accent-color,var(--token-icon,var(--brand-primary))))]" />{feature}</div>)}
              {(plan.missing || []).map((feature, i) => <div key={i} className="flex gap-2 text-sm text-[var(--token-muted,var(--style-text-muted,#a1a1aa))]" data-edit-collection="missing" data-edit-index={i}><Minus size={17} />{feature}</div>)}
            </div>
            {plan.ctaLabel && <a href={plan.ctaHref || '#'} className="mt-auto inline-flex justify-center rounded-full bg-[var(--token-btn-bg,var(--brand-btn-bg,var(--token-icon,var(--brand-primary,#111))))] px-5 py-3 text-sm font-bold text-[var(--token-btn-text,var(--brand-btn-text,#fff))]" data-edit-path="ctaLabel">{plan.ctaLabel}</a>}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
