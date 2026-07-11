'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';
import { SectionHeader, baseHeader, asButton, asList, type ButtonValue } from './industry-kit';
import { FaqAccordion } from './faq-accordion';
import { ActionGroup, ActionLink } from './section-primitives';

// Parameterized story/faq/testimonials shared by the medical and tourism
// packs — the per-industry files are thin wrappers that only set the
// default copy (headline/badge) and fallback icon.

type Value = { icon?: string; title?: string; text?: string };
type Milestone = { year?: string; title?: string; text?: string };

export type IndustryDefaults = { headline: string; badge: string; icon?: string };

export function IndustryStorySection({ data, defaults }: { data: Record<string, unknown>; defaults: IndustryDefaults }) {
  const h = baseHeader(data, defaults.headline, defaults.badge);
  const storyText = (data.storyText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const founderName = (data.founderName as string) || '';
  const founderRole = (data.founderRole as string) || '';
  const founderQuote = (data.founderQuote as string) || '';
  const values = asList<Value>(data.values);
  const milestones = asList<Milestone>(data.milestones);
  const ctaPrimary = asButton(data.ctaPrimary);
  const iconFallback = defaults.icon || 'sparkles';

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <SectionHeader headline={h.headline} subline={plain(h.subline)} badgeText={h.badgeText} />
          {storyText && <p className="whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(storyText)}</p>}
          {founderQuote && (
            <blockquote className="mt-8 rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm italic leading-6 text-[color:var(--token-heading)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span>{founderQuote}<span className="text-[color:var(--token-quote)]">&rdquo;</span></p>
              {founderName && <p className="mt-3 font-semibold text-[color:var(--token-heading)]">{founderName}</p>}
              {founderRole && <p className="text-xs text-[color:var(--token-muted)]">{founderRole}</p>}
            </blockquote>
          )}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-lg bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]" data-edit-path="label">{ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid gap-4">
          {imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image data-edit-image="imagePrimary" src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageSecondary" src={imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div key={`${v.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-edit-collection="values" data-edit-index={i}>
              <div className="shrink-0 text-[color:var(--token-eyebrow)]"><DynamicIcon editPath="icon" name={v.icon || iconFallback} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>{v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}</div>
            </motion.div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
      <div className="mt-16 relative border-l-2 border-[var(--token-divider)] pl-8">
          {milestones.map((m, i) => (
            <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0" data-edit-collection="milestones" data-edit-index={i}>
        <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--token-divider)] bg-[var(--token-card-bg)]" />
              {m.year && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]">{m.year}</p>}
              <h3 className="mt-1 font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

type FaqItem = { question?: string; answer?: string };

export function IndustryFaqSection({ data, defaults }: { data: Record<string, unknown>; defaults: IndustryDefaults }) {
  const header = baseHeader(data, defaults.headline, defaults.badge);
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <SectionHeader {...header} />
      <FaqAccordion items={items} variant="divided" />
      {ctaPrimary.label && <ActionGroup className="mt-8"><ActionLink action={ctaPrimary} editKey="ctaPrimary" /></ActionGroup>}
    </div>
  );
}

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

function Stars({ count }: { count: number }) {
  return <div className="flex gap-0.5">{Array.from({ length: count || 5 }).map((_, i) => <Star className="text-[color:var(--token-rating-star)]" key={i} size={14} fill="currentColor" />)}</div>;
}

export function IndustryTestimonialsSection({ data, defaults }: { data: Record<string, unknown>; defaults: IndustryDefaults }) {
  const h = baseHeader(data, defaults.headline, defaults.badge);
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary: ButtonValue = asButton(data.ctaPrimary);

  return (
    <div>
      <SectionHeader headline={h.headline} subline={plain(h.subline)} badgeText={h.badgeText} />
      {(ratingValue || ratingCount) && <p className="mb-6 text-sm text-[color:var(--token-muted)]">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-edit-collection="items" data-edit-index={i}>
            <div className="text-[color:var(--token-eyebrow)]"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-[color:var(--token-heading)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span><span data-edit-path="quote">{plain(item.quote)}</span><span className="text-[color:var(--token-quote)]">&rdquo;</span></p>}
            <div className="mt-4 border-t border-[var(--token-card-border)] pt-3">
              <p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
              <p className="text-xs text-[color:var(--token-muted)]">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}
