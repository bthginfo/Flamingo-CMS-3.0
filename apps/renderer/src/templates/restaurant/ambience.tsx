'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Highlight = { title?: string; text?: string; icon?: string };

export function AmbienceSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Atmosphaere';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Restaurant';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const imageTertiary = (data.imageTertiary as string) || '';
  const highlights = asList<Highlight>(data.highlights);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="grid grid-cols-2 gap-4">
        {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[var(--style-card-radius)]"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-[var(--style-card-radius)]"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        {imageTertiary && <div className="relative aspect-square overflow-hidden rounded-[var(--style-card-radius)]"><Image src={imageTertiary} alt="" fill className="object-cover" sizes="25vw" /></div>}
      </div>
      <div>
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-lg text-[var(--style-text-secondary)]">{subline}</p>}
        <div className="mt-8 grid gap-4">
          {highlights.map((highlight, index) => (
            <div key={`${highlight.title}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <div className="mt-1 text-[var(--style-text-primary)]"><DynamicIcon name={highlight.icon || 'star'} size={20} /></div>
              <div>
                <h3 className="font-semibold text-[var(--style-text-primary)]">{highlight.title || ''}</h3>
                {highlight.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-secondary)]">{highlight.text}</p>}
              </div>
            </div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
    </div>
  );
}
