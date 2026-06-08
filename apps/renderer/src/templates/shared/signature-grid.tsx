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
      <div className="relative min-h-[560px] overflow-hidden rounded-3xl bg-[var(--token-section-bg-alt)]">
        {image && <img data-edit-image="image" src={image} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          {badge && <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--token-badge-text)]" data-edit-path="badge">{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[color:var(--token-on-dark-heading)] md:text-5xl" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--token-on-dark-heading)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {traits.map((trait, index) => (
          <motion.article key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm" data-edit-collection="traits" data-edit-index={index}>
            {trait.icon && <DynamicIcon editPath="icon" name={trait.icon} size={28} className="mb-6 text-[color:var(--token-icon)]" />}
            <h3 className="text-xl font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{trait.title}</h3>
            {trait.text && <p className="mt-3 text-sm leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(trait.text)}</p>}
          </motion.article>
        ))}
        {stats.map((stat, index) => (
          <div key={`stat-${index}`} className="rounded-3xl bg-[var(--token-section-bg-alt)] p-6 text-[color:var(--token-on-dark-heading)]" data-edit-collection="stats" data-edit-index={index}>
            <div className="text-4xl font-black text-[color:var(--token-stat-value)]" data-edit-path="value">{stat.value}</div>
            <div className="mt-2 text-sm text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
