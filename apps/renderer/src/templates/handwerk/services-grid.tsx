'use client';

import { HoverEffect } from '@/components/ui/hover-effect';
import { DynamicIcon } from '@/components/ui/icon-map';
import { ActionGroup, PremiumSectionHeader } from '@/templates/shared/section-primitives';

import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type CardData = { title: string; text?: string; icon?: string; image?: string; imagePosition?: string; mediaType?: 'icon' | 'image'; href?: string; ctaIcon?: string };

export function ServicesGridSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cards = (data.manualCards as CardData[]) || (data.services as CardData[]) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const ctaIcon = (data.ctaIcon as string) || '';

  if (data.layout === 'index') {
    return <div>
      <PremiumSectionHeader headline={headline} subline={subline} richSubline={false} />
      <div className="grid gap-x-14 lg:grid-cols-2">
        {cards.map((card, index) => <article key={card.href || index} className="border-t border-[var(--token-divider)] py-7" data-edit-collection="manualCards" data-edit-index={index}>
          <h3 className="font-display text-2xl font-semibold leading-tight text-[color:var(--token-heading)]">
            <Link href={card.href || '#'} className="group flex items-start justify-between gap-5 py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]"><span data-edit-path="title">{card.title}</span><DynamicIcon name="ArrowUpRight" size={22} className="mt-1 shrink-0 text-[color:var(--token-icon)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </h3>
          {card.text && <p className="mt-3 max-w-[56ch] text-base leading-7 text-[color:var(--token-body)]" data-edit-path="text">{plain(card.text)}</p>}
        </article>)}
      </div>
    </div>;
  }

  return <ServicesClassic headline={headline} subline={plain(subline)} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaIcon={ctaIcon} />;
}

type SProps = { headline: string; subline: string; badgeText: string; cards: CardData[]; ctaLabel: string; ctaHref: string; ctaIcon: string };

/* ─── CLASSIC: Rounded cards, soft shadows, icon on top, 3-column, hover lift ─── */
function ServicesClassic({ headline, subline, badgeText, cards, ctaLabel, ctaHref, ctaIcon }: SProps) {
  const hoverItems = cards.map(c => ({
    title: c.title,
    description: c.text || '',
    icon: c.mediaType === 'image' && c.image ? undefined : (c.icon ? <DynamicIcon editPath="icon" name={c.icon} size={24} className="text-[color:var(--token-icon)]" /> : undefined),
    image: c.mediaType === 'image' ? c.image : undefined,
    imagePosition: c.imagePosition || 'center',
    link: c.href || undefined,
  }));

  return (
    <div>
      <PremiumSectionHeader eyebrow={badgeText} headline={headline} subline={subline} align="center" richSubline={false} />
      <HoverEffect items={hoverItems} />
      {ctaLabel && ctaHref && (
        <ActionGroup align="center" className="mt-12">
          <Link href={ctaHref} className="cms-button cms-button--primary">
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
            {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </ActionGroup>
      )}
    </div>
  );
}

