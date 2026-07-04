'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Value = { icon?: string; title?: string; text?: string };
type Milestone = { year?: string; title?: string; text?: string };

export function RestaurantStorySection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Unsere Geschichte';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Über uns';
  const storyText = (data.storyText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const founderName = (data.founderName as string) || '';
  const founderRole = (data.founderRole as string) || '';
  const founderQuote = (data.founderQuote as string) || '';
  const values = asList<Value>(data.values);
  const milestones = asList<Milestone>(data.milestones);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary };

  return <StoryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; storyText: string; imagePrimary: string; imageSecondary: string; founderName: string; founderRole: string; founderQuote: string; values: Value[]; milestones: Milestone[]; ctaPrimary: ButtonValue };

function StoryClassic({ headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary }: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          {badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 text-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          {storyText && <div className="mt-6 whitespace-pre-line leading-7 text-[color:var(--token-muted)] rt-content" data-edit-rich="storyText" dangerouslySetInnerHTML={{ __html: storyText }} />}
          {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image data-edit-image="imagePrimary" src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageSecondary" src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></motion.div>}
          {founderQuote && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col justify-center rounded-xl bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] p-5">
              <p className="text-sm italic leading-6 text-[color:var(--token-heading)]"><span className="text-[color:var(--token-quote)]">&ldquo;</span>{founderQuote}<span className="text-[color:var(--token-quote)]">&rdquo;</span></p>
              {founderName && <p className="mt-3 font-semibold text-[color:var(--token-heading)]">{founderName}</p>}
              {founderRole && <p className="text-xs text-[color:var(--token-muted)]">{founderRole}</p>}
            </motion.div>
          )}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div key={`${v.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl bg-[var(--token-card-bg)] p-5 shadow-sm" data-edit-collection="values" data-edit-index={i}>
              <div className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] p-2.5 text-[color:var(--token-eyebrow)]"><DynamicIcon editPath="icon" name={v.icon || 'heart'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{v.title || ''}</h3>
                {v.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16">
          <div className="relative border-l-2 border-[color-mix(in_srgb,var(--token-card-border)_30%,transparent)] pl-8">
            {milestones.map((m, i) => (
              <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0" data-edit-collection="milestones" data-edit-index={i}>
                <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)]" />
                {m.year && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]">{m.year}</p>}
                <h3 className="mt-1 font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{m.title || ''}</h3>
                {m.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

