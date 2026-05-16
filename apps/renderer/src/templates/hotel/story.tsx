'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

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
          {p.badgeText && <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{p.badgeText}</p>}
          <h2 className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{p.headline}</h2>
          {p.subline && <div className="mt-4 text-lg text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line leading-7 text-gray-600">{p.storyText}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-sm">
              <p className="text-sm italic leading-6 text-gray-900">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-semibold text-gray-900">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs text-gray-600">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{p.ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid gap-4">
          {p.imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {p.imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <motion.div key={`${s.label}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-gray-900">{s.value || ''}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-600">{s.label || ''}</p>
            </motion.div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <motion.div key={`${v.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-sm">
              <div className="shrink-0 text-brand-primary"><DynamicIcon name={v.icon || 'heart'} size={20} /></div>
              <div><h3 className="font-semibold text-gray-900">{v.title || ''}</h3>{v.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}</div>
            </motion.div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 relative border-l-2 border-[var(--brand-primary)]/30 pl-8">
          {p.milestones.map((m, i) => (
            <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--brand-primary)] bg-white" />
              {m.year && <p className="text-xs font-bold uppercase tracking-widest text-brand-primary">{m.year}</p>}
              <h3 className="mt-1 font-semibold text-gray-900">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
          {p.badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{p.headline}</h2>
          {p.subline && <div className="mt-4 font-light text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line font-light leading-7 text-gray-600">{p.storyText}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 border-l border-black/20 pl-5">
              <p className="text-sm italic font-light leading-6 text-gray-900">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-medium text-gray-900">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-light text-gray-600">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-10 inline-flex font-light text-gray-900 underline underline-offset-4">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-3">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border border-black/10"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border border-black/10"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px border border-black/10 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={`${s.label}-${i}`} className="border border-black/10 bg-white p-6 text-center">
              <p className="text-3xl font-light text-gray-900">{s.value || ''}</p>
              <p className="mt-1 text-xs font-light uppercase tracking-[0.2em] text-gray-600">{s.label || ''}</p>
            </div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-l border-black/20 pl-5">
              <DynamicIcon name={v.icon || 'heart'} size={18} className="text-gray-600" />
              <h3 className="mt-2 font-medium text-gray-900">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm font-light leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 grid gap-6 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {p.milestones.map((m, i) => (
            <div key={`${m.year}-${i}`}>
              {m.year && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-600">{m.year}</p>}
              <h3 className="mt-1 font-medium text-gray-900">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm font-light leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
          {p.badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-gray-900">{p.headline}</h2>
          {p.subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
          {p.storyText && <p className="mt-6 whitespace-pre-line leading-7 text-gray-600">{p.storyText}</p>}
          {p.founderQuote && (
            <div className="mt-8 border-l-4 border-[var(--brand-primary)] bg-black/5 p-5">
              <p className="text-sm italic font-bold text-gray-900">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-black uppercase text-gray-900">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-bold text-gray-600">{p.founderRole}</p>}
            </div>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-2">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0_#111827]"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border-2 border-[#111827]"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={`${s.label}-${i}`} className="border-2 border-[#111827] p-5 text-center shadow-[4px_4px_0_var(--brand-primary)]">
              <p className="text-3xl font-black text-gray-900">{s.value || ''}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-600">{s.label || ''}</p>
            </div>
          ))}
        </div>
      )}
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-2 border-[#111827] p-5 shadow-[4px_4px_0_#111827]">
              <DynamicIcon name={v.icon || 'heart'} size={20} className="text-brand-primary" />
              <h3 className="mt-2 font-black uppercase text-gray-900">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} className="border-2 border-[#111827] p-5">
              {m.year && <p className="text-xs font-black uppercase tracking-widest text-brand-primary">{m.year}</p>}
              <h3 className="mt-1 font-black uppercase text-gray-900">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
