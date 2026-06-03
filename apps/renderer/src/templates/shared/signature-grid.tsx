'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Trait = { title: string; text?: string; icon?: string };
type Stat = { value: string; label: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function SignatureGridSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || '';
  const traits = (data.traits as Trait[]) || [];
  const stats = (data.stats as Stat[]) || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <div className="relative min-h-[560px] overflow-hidden rounded-3xl bg-[var(--style-section-bg-alt,#18181b)]">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          {badge && <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--style-badge-text,rgba(255,255,255,0.65))]">{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[var(--style-image-text-color,#ffffff)] md:text-5xl">{headline}</h2>}
          {subline && <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--style-image-text-color,rgba(255,255,255,0.72))]">{plain(subline)}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {traits.map((trait, index) => (
          <motion.article key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-3xl border border-[var(--style-border-color,rgba(0,0,0,0.08))] bg-[var(--style-card-bg,#fff)] p-6 shadow-sm">
            {trait.icon && <DynamicIcon name={trait.icon} size={28} className="mb-6 text-[var(--style-icon-color,var(--brand-primary))]" />}
            <h3 className="text-xl font-black text-[var(--style-heading-color,#111)]">{trait.title}</h3>
            {trait.text && <p className="mt-3 text-sm leading-7 text-[var(--style-body-color,#52525b)]">{plain(trait.text)}</p>}
          </motion.article>
        ))}
        {stats.map((stat, index) => (
          <div key={`stat-${index}`} className="rounded-3xl bg-[var(--style-section-bg-alt,#070707)] p-6 text-[var(--style-image-text-color,#ffffff)]">
            <div className="text-4xl font-black text-[var(--style-accent-color,#fff)]">{stat.value}</div>
            <div className="mt-2 text-sm text-[var(--style-text-secondary,rgba(255,255,255,0.62))]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
