'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HoverEffect } from '@/components/ui/hover-effect';
import { DynamicIcon, MediaDisplay } from '@/components/ui/icon-map';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type CardData = { title: string; text?: string; icon?: string; image?: string; mediaType?: 'icon' | 'image'; href?: string };

export function ServicesGridSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cards = (data.manualCards as CardData[]) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';

  if (styleVariant === 'modern') return <ServicesModern headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} />;
  if (styleVariant === 'bold') return <ServicesBold headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} />;
  return <ServicesClassic headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} />;
}

type SProps = { headline: string; subline: string; badgeText: string; cards: CardData[]; ctaLabel: string; ctaHref: string };

/* ─── CLASSIC: Rounded cards, soft shadows, icon on top, 3-column, hover lift ─── */
function ServicesClassic({ headline, subline, badgeText, cards, ctaLabel, ctaHref }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const hoverItems = cards.map(c => ({
    title: c.title,
    description: c.text || '',
    icon: c.mediaType === 'image' && c.image ? undefined : (c.icon ? <DynamicIcon name={c.icon} size={24} className="text-brand-primary" /> : undefined),
    image: c.mediaType === 'image' ? c.image : undefined,
    link: c.href || undefined,
  }));

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
        <HoverEffect items={hoverItems} />
      </motion.div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-center mt-12">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-dark transition-all shadow-md hover:shadow-lg">
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/* ─── MODERN: Borderless, only bottom line, 2-column, generous padding, outline icons ─── */
function ServicesModern({ headline, subline, badgeText, cards, ctaLabel, ctaHref }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-20">
        {badgeText && (
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4 tracking-wide uppercase">
            <span className="w-8 h-px bg-gray-300" />{badgeText}
          </div>
        )}
        {headline && <h2 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">{headline}</h2>}
        {subline && <p className="text-lg text-gray-400 mt-4 max-w-2xl">{subline}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {cards.map((card, i) => {
          const inner = (
            <div className="flex items-start gap-6">
              {card.icon && (
                <div className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-300 group-hover:text-brand-primary transition-colors">
                  <DynamicIcon name={card.icon} size={28} />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-primary transition-colors">{card.title}</h3>
                {card.text && <p className="text-gray-400 mt-2 leading-relaxed">{card.text}</p>}
                {card.href && (
                  <span className="inline-flex items-center gap-1 text-sm text-brand-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                )}
              </div>
            </div>
          );
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group py-10 px-8 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              {card.href ? <Link href={card.href} className="block">{inner}</Link> : inner}
            </motion.div>
          );
        })}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="mt-16">
          <Link href={ctaHref} className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary border-b border-brand-primary pb-1 hover:text-brand-dark hover:border-brand-dark transition-colors">
            {ctaLabel} <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/* ─── BOLD: Sharp edges, thick border, hard-offset shadow, 4-column tight grid ─── */
function ServicesBold({ headline, subline, badgeText, cards, ctaLabel, ctaHref }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12">
        {badgeText && (
          <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">
            {badgeText}
          </span>
        )}
        {headline && <h2 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">{headline}</h2>}
        {subline && <p className="text-gray-500 mt-3 font-medium">{subline}</p>}
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const inner = (
            <>
              {card.icon && (
                <div className="w-12 h-12 bg-brand-dark flex items-center justify-center mb-4">
                  <DynamicIcon name={card.icon} size={20} className="text-brand-accent" />
                </div>
              )}
              <h3 className="font-bold text-base uppercase tracking-wide text-gray-900">{card.title}</h3>
              {card.text && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{card.text}</p>}
              {card.href && (
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-brand-accent mt-3">
                  Details <ArrowRight size={12} />
                </span>
              )}
            </>
          );
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 border-3 border-gray-900 bg-white shadow-[4px_4px_0_#0d2137] hover:shadow-[-4px_4px_0_#f39c12] hover:border-brand-accent transition-all"
            >
              {card.href ? <Link href={card.href} className="block">{inner}</Link> : inner}
            </motion.div>
          );
        })}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="mt-10">
          <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-brand-accent font-bold uppercase tracking-wide border-3 border-brand-dark shadow-[4px_4px_0_#f39c12] hover:shadow-[-4px_4px_0_#f39c12] transition-all">
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
