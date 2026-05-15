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

  if (styleVariant === 'modern') return <StoryModern {...props} />;
  if (styleVariant === 'bold') return <StoryBold {...props} />;
  return <StoryClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; storyText: string; imagePrimary: string; imageSecondary: string; founderName: string; founderRole: string; founderQuote: string; values: Value[]; milestones: Milestone[]; ctaPrimary: ButtonValue };

function StoryClassic({ headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary }: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          {badgeText && <p className="inline-block rounded-full bg-[var(--style-accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 text-lg text-[var(--style-text-muted)]">{subline}</p>}
          {storyText && <p className="mt-6 whitespace-pre-line leading-7 text-[var(--style-text-muted)]">{storyText}</p>}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--style-brand)] px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-lg"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-square overflow-hidden rounded-2xl shadow-md"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></motion.div>}
          {founderQuote && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col justify-center rounded-2xl bg-[var(--style-accent)]/10 p-5">
              <p className="text-sm italic leading-6 text-[var(--style-text-primary)]">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-semibold text-[var(--style-text-primary)]">{founderName}</p>}
              {founderRole && <p className="text-xs text-[var(--style-text-muted)]">{founderRole}</p>}
            </motion.div>
          )}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div key={`${v.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-2xl bg-[var(--style-card-bg)] p-5 shadow-sm">
              <div className="shrink-0 rounded-full bg-[var(--style-accent)]/10 p-2.5 text-[var(--style-accent)]"><DynamicIcon name={v.icon || 'heart'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-[var(--style-text-primary)]">{v.title || ''}</h3>
                {v.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-muted)]">{v.text}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16">
          <div className="relative border-l-2 border-[var(--style-accent)]/30 pl-8">
            {milestones.map((m, i) => (
              <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-[var(--style-accent)] bg-white" />
                {m.year && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{m.year}</p>}
                <h3 className="mt-1 font-semibold text-[var(--style-text-primary)]">{m.title || ''}</h3>
                {m.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-muted)]">{m.text}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryModern({ headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary }: Props) {
  return (
    <div>
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light text-[var(--style-text-primary)] sm:text-5xl">{headline}</h2>
          <div className="mt-2 h-px w-16 bg-[var(--style-accent)]" />
          {subline && <p className="mt-6 font-light leading-relaxed text-[var(--style-text-muted)]">{subline}</p>}
          {storyText && <p className="mt-6 whitespace-pre-line font-light leading-7 text-[var(--style-text-muted)]">{storyText}</p>}
          {founderQuote && (
            <blockquote className="mt-8 border-l-2 border-[var(--style-accent)] pl-5">
              <p className="text-sm italic font-light leading-6 text-[var(--style-text-primary)]">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-medium text-[var(--style-text-primary)]">{founderName}</p>}
              {founderRole && <p className="text-xs font-light text-[var(--style-text-muted)]">{founderRole}</p>}
            </blockquote>
          )}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex border-b-2 border-[var(--style-text-primary)] pb-1 font-medium text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border border-black/5"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative col-span-2 aspect-[16/9] overflow-hidden border border-black/5"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-l-2 border-[var(--style-accent)] pl-5">
              <DynamicIcon name={v.icon || 'heart'} size={18} className="text-[var(--style-text-muted)]" />
              <h3 className="mt-2 font-medium text-[var(--style-text-primary)]">{v.title || ''}</h3>
              {v.text && <p className="mt-1 text-sm font-light leading-6 text-[var(--style-text-muted)]">{v.text}</p>}
            </div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16 grid gap-6 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div key={`${m.year}-${i}`}>
              {m.year && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{m.year}</p>}
              <h3 className="mt-1 font-medium text-[var(--style-text-primary)]">{m.title || ''}</h3>
              {m.text && <p className="mt-1 text-sm font-light leading-6 text-[var(--style-text-muted)]">{m.text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryBold({ headline, subline, badgeText, storyText, imagePrimary, imageSecondary, founderName, founderRole, founderQuote, values, milestones, ctaPrimary }: Props) {
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          {badgeText && <p className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase tracking-widest text-white">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
          <div className="mt-2 h-1.5 w-20 bg-[var(--style-accent)]" />
          {subline && <p className="mt-4 font-bold text-[var(--style-text-muted)]">{subline}</p>}
          {storyText && <p className="mt-6 whitespace-pre-line leading-7 text-[var(--style-text-muted)]">{storyText}</p>}
          {founderQuote && (
            <div className="mt-8 border-l-4 border-[var(--style-accent)] bg-black/5 p-5">
              <p className="text-sm italic font-bold text-[var(--style-text-primary)]">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-black uppercase text-[var(--style-text-primary)]">{founderName}</p>}
              {founderRole && <p className="text-xs font-bold text-[var(--style-text-muted)]">{founderRole}</p>}
            </div>
          )}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border-2 border-[var(--style-text-primary)]"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative col-span-2 aspect-[16/9] overflow-hidden border-2 border-[var(--style-text-primary)]"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-2 border-[var(--style-text-primary)] p-5 shadow-[4px_4px_0_var(--style-accent)]">
              <DynamicIcon name={v.icon || 'heart'} size={20} className="text-[var(--style-accent)]" />
              <h3 className="mt-2 font-black uppercase text-[var(--style-text-primary)]">{v.title || ''}</h3>
              {v.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-muted)]">{v.text}</p>}
            </div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} className="border-2 border-[var(--style-text-primary)] p-5">
              {m.year && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{m.year}</p>}
              <h3 className="mt-1 font-black uppercase text-[var(--style-text-primary)]">{m.title || ''}</h3>
              {m.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-muted)]">{m.text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
