'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Highlight = { title?: string; text?: string; icon?: string };

type AmbienceViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  imagePrimary: string;
  imageSecondary: string;
  imageTertiary: string;
  highlights: Highlight[];
  ctaPrimary: { label?: string; href?: string };
};

export function AmbienceSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Atmosphaere';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Restaurant';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const imageTertiary = (data.imageTertiary as string) || '';
  const highlights = asList<Highlight>(data.highlights);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props: AmbienceViewProps = { headline, subline, badgeText, imagePrimary, imageSecondary, imageTertiary, highlights, ctaPrimary };

  if (styleVariant === 'bold') return <AmbienceBold {...props} />;
  if (styleVariant === 'modern') return <AmbienceModern {...props} />;
  return <AmbienceClassic {...props} />;
}

function AmbienceClassic({ headline, subline, badgeText, imagePrimary, imageSecondary, imageTertiary, highlights, ctaPrimary }: AmbienceViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="grid grid-cols-2 gap-4">
        {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        {imageTertiary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image src={imageTertiary} alt="" fill className="object-cover" sizes="25vw" /></div>}
      </div>
      <div>
        {badgeText && <p className="inline-block rounded-full bg-brand-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-[700] text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 text-lg text-gray-500">{subline}</p>}
        <div className="mt-8 grid gap-5">
          {highlights.map((highlight, index) => (
            <motion.div key={`${highlight.title}-${index}`} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="mt-0.5 shrink-0 rounded-full bg-brand-accent/10 p-2 text-brand-accent"><DynamicIcon name={highlight.icon || 'star'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">{highlight.title || ''}</h3>
                {highlight.text && <p className="mt-1 text-sm leading-6 text-gray-500">{highlight.text}</p>}
              </div>
            </motion.div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-md transition-shadow hover:shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
    </motion.div>
  );
}

function AmbienceModern({ headline, subline, badgeText, imagePrimary, imageSecondary, imageTertiary, highlights, ctaPrimary }: AmbienceViewProps) {
  return (
    <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
      <div className="grid grid-cols-2 gap-3">
        {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border border-black/5"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {imageSecondary && <div className="relative aspect-square overflow-hidden border border-black/5"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        {imageTertiary && <div className="relative aspect-square overflow-hidden border border-black/5"><Image src={imageTertiary} alt="" fill className="object-cover" sizes="25vw" /></div>}
      </div>
      <div>
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light text-gray-900 sm:text-5xl">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-brand-accent" />
        {subline && <p className="mt-6 font-light leading-relaxed text-gray-500">{subline}</p>}
        <div className="mt-10 grid gap-6">
          {highlights.map((highlight, index) => (
            <div key={`${highlight.title}-${index}`} className="flex gap-4 border-l-2 border-brand-accent pl-5">
              <div className="mt-0.5 shrink-0 text-gray-500"><DynamicIcon name={highlight.icon || 'star'} size={18} /></div>
              <div>
                <h3 className="font-medium text-gray-900">{highlight.title || ''}</h3>
                {highlight.text && <p className="mt-1 text-sm font-light leading-6 text-gray-500">{highlight.text}</p>}
              </div>
            </div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 border-b-2 border-[#111827] pb-1 font-medium text-gray-900">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
    </div>
  );
}

function AmbienceBold({ headline, subline, badgeText, imagePrimary, imageSecondary, imageTertiary, highlights, ctaPrimary }: AmbienceViewProps) {
  return (
    <div className="bg-[#111827] p-6 text-white sm:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-2">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-none border-2 border-white/20"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-none border-2 border-white/20"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
          {imageTertiary && <div className="relative aspect-square overflow-hidden rounded-none border-2 border-white/20"><Image src={imageTertiary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
        <div>
          {badgeText && <p className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-900">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-black uppercase sm:text-5xl">{headline}</h2>
          <div className="mt-2 h-1.5 w-20 bg-brand-accent" />
          {subline && <p className="mt-4 text-lg text-white/70">{subline}</p>}
          <div className="mt-8 grid gap-4">
            {highlights.map((highlight, index) => (
              <div key={`${highlight.title}-${index}`} className="flex gap-4 border-2 border-white/20 p-4 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
                <div className="mt-0.5 shrink-0 text-brand-accent"><DynamicIcon name={highlight.icon || 'star'} size={20} /></div>
                <div>
                  <h3 className="font-bold uppercase">{highlight.title || ''}</h3>
                  {highlight.text && <p className="mt-1 text-sm leading-6 text-white/60">{highlight.text}</p>}
                </div>
              </div>
            ))}
          </div>
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-none border-2 border-white bg-white px-6 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_rgba(255,255,255,0.3)]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
        </div>
      </div>
    </div>
  );
}
