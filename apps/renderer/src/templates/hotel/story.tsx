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

  if (styleVariant === 'modern') return <StoryModern {...props} />;
  if (styleVariant === 'bold') return <StoryBold {...props} />;
  return <StoryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; storyText: string; imagePrimary: string; imageSecondary: string; founderName: string; founderRole: string; founderQuote: string; stats: Stat[]; values: Value[]; milestones: Milestone[]; ctaPrimary: { label?: string; href?: string } };

function StoryClassic(p: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          {p.badgeText && <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]"><Star size={12} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{p.badgeText}</span></p>}
          <h2 className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{p.headline}</h2>
          {p.subline && <div className="mt-4 text-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-sm">
              <p className="text-sm italic leading-6 text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-semibold text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid gap-4">
          {p.imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {p.imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <motion.div key={`$<span data-edit-path="label">{s.label}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 text-center shadow-sm" data-edit-collection="stats" data-edit-index={i}>
              <p className="text-3xl font-bold text-[color:var(--token-heading)]" data-edit-path="value">{s.value || ''}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="label">{s.label || ''}</p>
            </motion.div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <motion.div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-sm" data-edit-collection="values" data-edit-index={i}>
              <div className="shrink-0 text-[color:var(--token-icon)]"><DynamicIcon name={v.icon || 'heart'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>{v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}</div>
            </motion.div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 relative border-l-2 border-[var(--token-icon)]/30 pl-8">
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

function StoryModern(p: Props) {
  return (
    <div>
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          {p.badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{p.headline}</h2>
          {p.subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line font-light leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 border-l border-black/20 pl-5">
              <p className="text-sm italic font-light leading-6 text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-medium text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-light text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-10 inline-flex font-light text-[color:var(--token-heading)] underline underline-offset-4" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-3">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border border-black/10"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border border-black/10"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px border border-black/10 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={`$<span data-edit-path="label">{s.label}</span>-${i}`} className="border border-black/10 bg-[var(--token-card-bg)] p-6 text-center" data-edit-collection="stats" data-edit-index={i}>
              <p className="text-3xl font-light text-[color:var(--token-heading)]" data-edit-path="value">{s.value || ''}</p>
              <p className="mt-1 text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted)]" data-edit-path="label">{s.label || ''}</p>
            </div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} className="border-l border-black/20 pl-5" data-edit-collection="values" data-edit-index={i}>
              <DynamicIcon name={v.icon || 'heart'} size={18} className="text-[color:var(--token-muted)]" />
              <h3 className="mt-2 font-medium text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 grid gap-6 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {p.milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} data-edit-collection="milestones" data-edit-index={i}>
              {m.year && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted)]">{m.year}</p>}
              <h3 className="mt-1 font-medium text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryBold(p: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          {p.badgeText && <p className="inline-block bg-[var(--token-btn-bg)/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="headline">{p.headline}</h2>
          {p.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <div className="mt-8 border-l-4 border-[var(--token-icon)] bg-[var(--token-section-bg-alt)/5] p-5">
              <p className="text-sm italic font-bold text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-black uppercase text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-bold text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </div>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-2">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0_#111827]"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border-2 border-[#111827]"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={`$<span data-edit-path="label">{s.label}</span>-${i}`} className="border-2 border-[#111827] p-5 text-center shadow-[4px_4px_0_var(--token-icon)]" data-edit-collection="stats" data-edit-index={i}>
              <p className="text-3xl font-black text-[color:var(--token-heading)]" data-edit-path="value">{s.value || ''}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="label">{s.label || ''}</p>
            </div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} className="border-2 border-[#111827] p-5 shadow-[4px_4px_0_#111827]" data-edit-collection="values" data-edit-index={i}>
              <DynamicIcon name={v.icon || 'heart'} size={20} className="text-[color:var(--token-icon)]" />
              <h3 className="mt-2 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} className="border-2 border-[#111827] p-5" data-edit-collection="milestones" data-edit-index={i}>
              {m.year && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-icon)]">{m.year}</p>}
              <h3 className="mt-1 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
