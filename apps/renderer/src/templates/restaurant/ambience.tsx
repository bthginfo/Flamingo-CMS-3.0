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

  return <AmbienceClassic {...props} />;
}

function AmbienceClassic({ headline, subline, badgeText, imagePrimary, imageSecondary, imageTertiary, highlights, ctaPrimary }: AmbienceViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-lg"><Image data-edit-image="imagePrimary" src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageSecondary" src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        {imageTertiary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageTertiary" src={imageTertiary} alt="" fill className="object-cover" sizes="25vw" /></div>}
      </div>
      <div>
        {badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-8 grid gap-5">
          {highlights.map((highlight, index) => (
            <motion.div key={`${highlight.title || 'item'}-${index}`} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 rounded-xl bg-[var(--token-card-bg)] p-4 shadow-sm" data-edit-collection="highlights" data-edit-index={index}>
              <div className="mt-0.5 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] p-2 text-[color:var(--token-eyebrow)]"><DynamicIcon editPath="icon" name={highlight.icon || 'star'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{highlight.title || ''}</h3>
                {highlight.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: highlight.text }} />}
              </div>
            </motion.div>
          ))}
        </div>
        {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md transition-shadow hover:shadow-lg"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
      </div>
    </motion.div>
  );
}

