'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Menu = { title?: string; description?: string; timeLabel?: string; priceLabel?: string; cta?: { label?: string; href?: string } };
type Highlight = { title?: string; text?: string; image?: string };

export function HotelDiningSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Restaurant & Bar';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Genuss';
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const openingText = (data.openingText as string) || '';
  const menus = asList<Menu>(data.menus);
  const highlights = asList<Highlight>(data.highlights);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Header badgeText={badgeText} headline={headline} subline={subline} />
        {introText && <p className="text-[var(--style-text-secondary)] leading-7">{introText}</p>}
        {openingText && <p className="mt-4 text-sm font-semibold text-[var(--style-text-primary)]">{openingText}</p>}
        <div className="mt-6 grid gap-4">
          {menus.map((menu, index) => (
            <article key={`${menu.title}-${index}`} className="border-t border-black/10 pt-4">
              <div className="flex justify-between gap-4"><h3 className="font-bold text-[var(--style-text-primary)]">{menu.title || ''}</h3><span className="text-sm text-[var(--style-text-secondary)]">{menu.priceLabel || ''}</span></div>
              {menu.description && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{menu.description}</p>}
              {menu.timeLabel && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{menu.timeLabel}</p>}
              {menu.cta?.label && <a href={menu.cta.href || '#'} className="mt-3 inline-flex font-semibold text-[var(--style-text-primary)]">{menu.cta.label}</a>}
            </article>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-4">
        {image && <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--style-card-radius)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-4">
              {item.image && <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="25vw" /></div>}
              <h3 className="font-semibold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-2 text-sm text-[var(--style-text-secondary)]">{item.text}</p>}
            </article>
          ))}
        </div>
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

