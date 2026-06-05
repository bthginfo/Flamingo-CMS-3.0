'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asList, asButton } from './types';
import { SectionHeader, baseHeader } from './shared';
import type { SectionProps, ButtonValue } from './types';
import { plain } from '@/lib/strip-html';

type Value = { icon?: string; title?: string; text?: string };
type Milestone = { year?: string; title?: string; text?: string };

export function MedicalStorySection({ data, styleVariant }: SectionProps) {
  const h = baseHeader(data, 'Unsere Praxis', 'Über uns');
  const storyText = (data.storyText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const founderName = (data.founderName as string) || '';
  const founderRole = (data.founderRole as string) || '';
  const founderQuote = (data.founderQuote as string) || '';
  const values = asList<Value>(data.values);
  const milestones = asList<Milestone>(data.milestones);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { ...h, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary };

  if (styleVariant === 'modern') return <Mod {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; storyText: string; imagePrimary: string; imageSecondary: string; founderName: string; founderRole: string; founderQuote: string; values: Value[]; milestones: Milestone[]; ctaPrimary: ButtonValue };

function Classic(p: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <SectionHeader headline={p.headline} subline={plain(p.subline)} badgeText={p.badgeText} />
          {p.storyText && <p className="whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 rounded-xl border border-black/10 bg-[var(--token-card-bg)] p-5 shadow-sm">
              <p className="text-sm italic leading-6 text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-semibold text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-lg bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)]" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid gap-4">
          {p.imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {p.imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
        </div>
      </div>
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <motion.div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl border border-black/10 bg-[var(--token-card-bg)] p-5 shadow-sm" data-edit-collection="values" data-edit-index={i}>
              <div className="shrink-0 text-[var(--token-eyebrow))]"><DynamicIcon name={v.icon || 'stethoscope'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>{v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}</div>
            </motion.div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 relative border-l-2 border-[var(--token-eyebrow))]/30 pl-8">
          {p.milestones.map((m, i) => (
            <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0" data-edit-collection="milestones" data-edit-index={i}>
              <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--token-eyebrow))] bg-[var(--token-card-bg)]" />
              {m.year && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-eyebrow))]">{m.year}</p>}
              <h3 className="mt-1 font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Mod(p: Props) {
  return (
    <div>
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeader headline={p.headline} subline={plain(p.subline)} badgeText={p.badgeText} />
          {p.storyText && <p className="whitespace-pre-line font-light leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <blockquote className="mt-8 border-l border-black/20 pl-5">
              <p className="text-sm italic font-light leading-6 text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-medium text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-light text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </blockquote>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-10 inline-flex font-medium text-[color:var(--token-heading)] underline underline-offset-4" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-3">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border border-black/10"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border border-black/10"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} className="border-l border-black/20 pl-5" data-edit-collection="values" data-edit-index={i}>
              <DynamicIcon name={v.icon || 'stethoscope'} size={18} className="text-[color:var(--token-muted)]" />
              <h3 className="mt-2 font-medium text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
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
              {m.text && <div className="mt-1 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Bold(p: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeader headline={p.headline} subline={plain(p.subline)} badgeText={p.badgeText} />
          {p.storyText && <p className="whitespace-pre-line leading-7 text-[color:var(--token-muted)]">{plain(p.storyText)}</p>}
          {p.founderQuote && (
            <div className="mt-8 border-l-4 border-[var(--token-eyebrow))] bg-[var(--token-section-bg-alt)/5] p-5">
              <p className="text-sm italic font-bold text-[color:var(--token-heading)]">&ldquo;{p.founderQuote}&rdquo;</p>
              {p.founderName && <p className="mt-3 font-black uppercase text-[color:var(--token-heading)]">{p.founderName}</p>}
              {p.founderRole && <p className="text-xs font-bold text-[color:var(--token-muted)]">{p.founderRole}</p>}
            </div>
          )}
          {p.ctaPrimary.label && <a href={p.ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]" data-edit-path="label">{p.ctaPrimary.label}</a>}
        </div>
        <div className="grid gap-2">
          {p.imagePrimary && <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#111827]"><Image src={p.imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {p.imageSecondary && <div className="relative aspect-[16/9] overflow-hidden border-2 border-[#111827]"><Image src={p.imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {p.values.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.values.map((v, i) => (
            <div key={`$<span data-edit-path="title">{v.title}</span>-${i}`} className="border-2 border-[#111827] p-5 shadow-[4px_4px_0_var(--token-eyebrow))]" data-edit-collection="values" data-edit-index={i}>
              <DynamicIcon name={v.icon || 'stethoscope'} size={20} className="text-[var(--token-eyebrow))]" />
              <h3 className="mt-2 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {p.milestones.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} className="border-2 border-[#111827] p-5" data-edit-collection="milestones" data-edit-index={i}>
              {m.year && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-eyebrow))]">{m.year}</p>}
              <h3 className="mt-1 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
