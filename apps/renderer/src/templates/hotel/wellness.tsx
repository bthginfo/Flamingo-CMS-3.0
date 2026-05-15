'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Treatment = { title?: string; text?: string; durationLabel?: string; priceLabel?: string; image?: string; cta?: { label?: string; href?: string } };
type Feature = { icon?: string; title?: string; text?: string };

export function WellnessSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Wellness';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Spa';
  const introText = (data.introText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const treatments = asList<Treatment>(data.treatments);
  const features = asList<Feature>(data.features);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Header badgeText={badgeText} headline={headline} subline={subline} />
        {introText && <p className="text-[var(--style-text-secondary)] leading-7">{introText}</p>}
        <div className="mt-8 grid gap-4">
          {features.map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={feature.icon || 'heart'} size={20} />
              <div><h3 className="font-semibold text-[var(--style-text-primary)]">{feature.title || ''}</h3>{feature.text && <p className="text-sm text-[var(--style-text-secondary)]">{feature.text}</p>}</div>
            </div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[var(--style-card-radius)]"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-[var(--style-card-radius)]"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
        {treatments.map((treatment, index) => (
          <article key={`${treatment.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5">
            {treatment.image && <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={treatment.image} alt={treatment.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="flex justify-between gap-4"><h3 className="font-bold text-[var(--style-text-primary)]">{treatment.title || ''}</h3><span className="text-sm text-[var(--style-text-secondary)]">{treatment.priceLabel || ''}</span></div>
            {treatment.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{treatment.text}</p>}
            {treatment.durationLabel && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{treatment.durationLabel}</p>}
            {treatment.cta?.label && <a href={treatment.cta.href || '#'} className="mt-4 inline-flex font-semibold text-[var(--style-text-primary)]">{treatment.cta.label}</a>}
          </article>
        ))}
      </div>
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}

