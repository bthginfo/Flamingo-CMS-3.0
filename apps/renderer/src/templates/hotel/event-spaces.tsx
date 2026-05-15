'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Space = { name?: string; description?: string; image?: string; capacityLabel?: string; sizeLabel?: string; seatingOptions?: string[]; features?: string[]; inquiryCta?: { label?: string; href?: string } };
type Step = { title?: string; text?: string; icon?: string };

export function EventSpacesSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Events & Tagungen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Raeume';
  const spaces = asList<Space>(data.spaces);
  const processHeadline = (data.processHeadline as string) || '';
  const processSteps = asList<Step>(data.processSteps);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="grid gap-6 lg:grid-cols-3">
        {spaces.map((space, index) => (
          <article key={`${space.name}-${index}`} className="overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
            {space.image && <div className="relative aspect-[4/3]"><Image src={space.image} alt={space.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <h3 className="text-xl font-bold text-[var(--style-text-primary)]">{space.name || ''}</h3>
              {space.description && <p className="mt-3 text-sm text-[var(--style-text-secondary)]">{space.description}</p>}
              <p className="mt-3 text-xs text-[var(--style-text-secondary)]">{[space.capacityLabel, space.sizeLabel].filter(Boolean).join(' / ')}</p>
              {asList<string>(space.seatingOptions).length > 0 && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{asList<string>(space.seatingOptions).join(' / ')}</p>}
              {asList<string>(space.features).length > 0 && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{asList<string>(space.features).join(' / ')}</p>}
              {space.inquiryCta?.label && <a href={space.inquiryCta.href || '#'} className="mt-4 inline-flex font-semibold text-[var(--style-text-primary)]">{space.inquiryCta.label}</a>}
            </div>
          </article>
        ))}
      </div>
      {processHeadline && <h3 className="mt-10 text-2xl font-bold text-[var(--style-text-primary)]">{processHeadline}</h3>}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {processSteps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 p-5">
            <DynamicIcon name={step.icon || 'clipboard'} size={22} />
            <h4 className="mt-3 font-semibold text-[var(--style-text-primary)]">{step.title || ''}</h4>
            {step.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{step.text}</p>}
          </div>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}

