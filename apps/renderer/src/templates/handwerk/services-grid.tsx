'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HoverEffect } from '@/components/ui/hover-effect';
import { DynamicIcon, MediaDisplay } from '@/components/ui/icon-map';

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

  return <ServicesClassic headline={headline} subline={plain(subline)} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaIcon={ctaIcon} />;
}

type SProps = { headline: string; subline: string; badgeText: string; cards: CardData[]; ctaLabel: string; ctaHref: string; ctaIcon: string };

/* ─── CLASSIC: Rounded cards, soft shadows, icon on top, 3-column, hover lift ─── */
function ServicesClassic({ headline, subline, badgeText, cards, ctaLabel, ctaHref, ctaIcon }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const hoverItems = cards.map(c => ({
    title: c.title,
    description: c.text || '',
    icon: c.mediaType === 'image' && c.image ? undefined : (c.icon ? <DynamicIcon editPath="icon" name={c.icon} size={24} className="text-[color:var(--token-icon)]" /> : undefined),
    image: c.mediaType === 'image' ? c.image : undefined,
    imagePosition: c.imagePosition || 'center',
    link: c.href || undefined,
  }));

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
        <HoverEffect items={hoverItems} />
      </motion.div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-center mt-12">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] font-semibold rounded-full hover:brightness-95 transition-all shadow-md hover:shadow-lg">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}

