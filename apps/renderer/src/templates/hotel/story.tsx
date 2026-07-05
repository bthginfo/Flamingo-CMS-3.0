'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';
import { plain } from '@/lib/strip-html';

type Value = { icon?: string; title?: string; text?: string };
type Milestone = { year?: string; title?: string; text?: string };
type Stat = { value?: string; label?: string };

export function HotelStorySection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Unsere Geschichte';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Über uns';
  const storyText = (data.storyText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const founderName = (data.founderName as string) || '';
  const founderRole = (data.founderRole as string) || '';
  const founderQuote = (data.founderQuote as string) || '';
  const stats = asList<Stat>(data.stats);
  const values = asList<Value>(data.values);
  const milestones = asList<Milestone>(data.milestones);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, stats, values, milestones, ctaPrimary };

  return <StoryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; storyText: string; imagePrimary: string; imageSecondary: string; founderName: string; founderRole: string; founderQuote: string; stats: Stat[]; values: Value[]; milestones: Milestone[]; ctaPrimary: { label?: string; href?: string } };

function StoryClassic(p: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          {p.badgeText && <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{p.badgeText}</span></p>}
          <h2 className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{p.headline}</h2>
          {p.subline && <div className="mt-4 text-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm italic leading-6 text-[color:var(--token-heading)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span>{p.founderQuote}<span className="text-[color:var(--token-quote)]">&rdquo;</span></p>
              {p.founderName && <p className="mt-3 font-semibold text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid gap-4">
          {p.imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image data-edit-image="imagePrimary" src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {p.imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageSecondary" src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <motion.div key={`${s.label || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 text-center shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-edit-collection="stats" data-edit-index={i}>
              <p className="text-3xl font-bold text-[color:var(--token-heading)]" data-edit-path="value">{s.value || ''}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="label">{s.label || ''}</p>
            </motion.div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <motion.div key={`${v.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-edit-collection="values" data-edit-index={i}>
              <div className="shrink-0 text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={v.icon || 'heart'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>{v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}</div>
            </motion.div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 relative border-l-2 border-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] pl-8">
          {p.milestones.map((m, i) => (
            <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0" data-edit-collection="milestones" data-edit-index={i}>
              <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--token-icon)] bg-[var(--token-card-bg)]" />
              {m.year && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]">{m.year}</p>}
              <h3 className="mt-1 font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

