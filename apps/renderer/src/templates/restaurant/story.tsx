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
          {badgeText && <p className="inline-block rounded-full bg-brand-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-accent">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</h2>
          {subline && <div className="mt-4 text-lg text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          {storyText && <div className="mt-6 whitespace-pre-line leading-7 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagePrimary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></motion.div>}
          {imageSecondary && <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></motion.div>}
          {founderQuote && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col justify-center rounded-xl bg-brand-accent/10 p-5">
              <p className="text-sm italic leading-6 text-gray-900">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-semibold text-gray-900">{founderName}</p>}
              {founderRole && <p className="text-xs text-gray-500">{founderRole}</p>}
            </motion.div>
          )}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div key={`${v.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="shrink-0 rounded-full bg-brand-accent/10 p-2.5 text-brand-accent"><DynamicIcon name={v.icon || 'heart'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">{v.title || ''}</h3>
                {v.text && <div className="mt-1 text-sm leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16">
          <div className="relative border-l-2 border-brand-accent/30 pl-8">
            {milestones.map((m, i) => (
              <motion.div key={`${m.year}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-2 border-brand-accent bg-white" />
                {m.year && <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">{m.year}</p>}
                <h3 className="mt-1 font-semibold text-gray-900">{m.title || ''}</h3>
                {m.text && <div className="mt-1 text-sm leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light text-gray-900 sm:text-3xl md:text-5xl">{headline}</h2>
          <div className="mt-2 h-px w-16 bg-brand-accent" />
          {subline && <div className="mt-6 font-light leading-relaxed text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          {storyText && <div className="mt-6 whitespace-pre-line font-light leading-7 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          {founderQuote && (
            <blockquote className="mt-8 border-l-2 border-brand-accent pl-5">
              <p className="text-sm italic font-light leading-6 text-gray-900">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-medium text-gray-900">{founderName}</p>}
              {founderRole && <p className="text-xs font-light text-gray-500">{founderRole}</p>}
            </blockquote>
          )}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex border-b-2 border-[#111827] pb-1 font-medium text-gray-900">{ctaPrimary.label}</a>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border border-black/5"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative col-span-2 aspect-[16/9] overflow-hidden border border-black/5"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-l-2 border-brand-accent pl-5">
              <DynamicIcon name={v.icon || 'heart'} size={18} className="text-gray-500" />
              <h3 className="mt-2 font-medium text-gray-900">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm font-light leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16 grid gap-6 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div key={`${m.year}-${i}`}>
              {m.year && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{m.year}</p>}
              <h3 className="mt-1 font-medium text-gray-900">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm font-light leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
          {badgeText && <p className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-white">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-gray-900">{headline}</h2>
          <div className="mt-2 h-1.5 w-20 bg-brand-accent" />
          {subline && <div className="mt-4 font-bold text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          {storyText && <div className="mt-6 whitespace-pre-line leading-7 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: storyText }} />}
          {founderQuote && (
            <div className="mt-8 border-l-4 border-brand-accent bg-black/5 p-5">
              <p className="text-sm italic font-bold text-gray-900">&ldquo;{founderQuote}&rdquo;</p>
              {founderName && <p className="mt-3 font-black uppercase text-gray-900">{founderName}</p>}
              {founderRole && <p className="text-xs font-bold text-gray-500">{founderRole}</p>}
            </div>
          )}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border-2 border-[#111827]"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative col-span-2 aspect-[16/9] overflow-hidden border-2 border-[#111827]"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        </div>
      </div>
      {values.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div key={`${v.title}-${i}`} className="border-2 border-[#111827] p-5 shadow-[4px_4px_0_var(--brand-accent)]">
              <DynamicIcon name={v.icon || 'heart'} size={20} className="text-brand-accent" />
              <h3 className="mt-2 font-black uppercase text-gray-900">{v.title || ''}</h3>
              {v.text && <div className="mt-1 text-sm leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />}
            </div>
          ))}
        </div>
      )}
      {milestones.length > 0 && (
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div key={`${m.year}-${i}`} className="border-2 border-[#111827] p-5">
              {m.year && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{m.year}</p>}
              <h3 className="mt-1 font-black uppercase text-gray-900">{m.title || ''}</h3>
              {m.text && <div className="mt-1 text-sm leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
