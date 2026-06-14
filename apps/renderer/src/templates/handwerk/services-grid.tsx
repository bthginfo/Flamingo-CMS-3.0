'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon, MediaDisplay } from '@/components/ui/icon-map';

import Link from 'next/link';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type CardData = { title: string; text?: string; icon?: string; image?: string; imagePosition?: string; mediaType?: 'icon' | 'image'; href?: string; ctaIcon?: string };

export function ServicesGridSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cards = ((data.manualCards as CardData[]) || (data.services as CardData[]) || []);
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const ctaIcon = (data.ctaIcon as string) || '';

  if (styleVariant === 'modern') return <ServicesModern headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaIcon={ctaIcon} />;
  if (styleVariant === 'bold') return <ServicesBold headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaIcon={ctaIcon} />;
  return <ServicesClassic headline={headline} subline={subline} badgeText={badgeText} cards={cards} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaIcon={ctaIcon} />;
}

type SProps = { headline: string; subline: string; badgeText: string; cards: CardData[]; ctaLabel: string; ctaHref: string; ctaIcon: string };

/* ─── CLASSIC: Rounded cards, soft shadows, icon on top, 3-column, hover lift ─── */
function ServicesClassic({ headline, subline, badgeText, cards, ctaLabel, ctaHref, ctaIcon }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-16">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const cardBody = (
            <div className="relative z-20 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--style-border-color,rgba(0,0,0,0.08))] bg-[var(--style-card-bg,#ffffff)] shadow-sm transition-all duration-300 group-hover:border-[var(--style-border-color,rgba(0,0,0,0.16))] group-hover:shadow-lg">
              {card.mediaType === 'image' && card.image ? (
                <div className="relative w-full overflow-hidden">
                  <div className="block sm:hidden">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        data-edit-image="image"
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        style={{ objectPosition: card.imagePosition || 'center' }}
                        sizes="100vw"
                      />
                    </div>
                    <div className="bg-[var(--style-card-bg,#ffffff)] p-6 text-left">
                      <h4 className="font-display mb-3 text-lg font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]" data-edit-path="title">
                        {card.title}
                      </h4>
                      {card.text && <div className="rt-content text-sm font-medium leading-relaxed text-[var(--style-body-color,var(--style-text-secondary,#6b7280))]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
                    </div>
                  </div>
                  <div className="relative hidden min-h-[220px] w-full overflow-hidden sm:block">
                    <Image
                      data-edit-image="image"
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: card.imagePosition || 'center' }}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.36)_48%,rgba(0,0,0,0.12))] sm:block" />
                    <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.20),transparent_34%,rgba(0,0,0,0.24))] sm:block" />
                    <div className="relative z-10 flex min-h-[230px] flex-col justify-start p-6 text-left sm:min-h-[220px]">
                      <h4 className="font-display mb-3 text-lg font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]" data-edit-path="title">
                        {card.title}
                      </h4>
                      {card.text && <div className="rt-content max-w-[28rem] text-sm font-medium leading-relaxed text-[color:var(--token-on-dark-body,rgba(255,255,255,0.90))] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                  {card.icon && (
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--style-accent-color,var(--brand-primary))_10%,transparent)] text-[var(--style-icon-color,var(--style-accent-color,var(--brand-primary)))] transition-transform duration-300 group-hover:scale-110">
                      <DynamicIcon editPath="icon" name={card.icon} size={24} />
                    </div>
                  )}
                  <h4 className="font-display mb-2 text-lg font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]" data-edit-path="title">
                    {card.title}
                  </h4>
                  {card.text && <div className="rt-content text-sm leading-relaxed text-[var(--style-body-color,var(--style-text-secondary,#6b7280))]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
                </div>
              )}
            </div>
          );

          return (
            <div
              key={index}
              className="relative group block h-full w-full p-2"
              data-edit-collection="manualCards"
              data-edit-index={index}
            >
              <motion.span
                className="pointer-events-none absolute inset-0 block h-full w-full rounded-3xl bg-[var(--style-accent-color,var(--brand-primary))]/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
              {card.href ? (
                <Link href={card.href} className="block h-full" data-edit-link="href">
                  {cardBody}
                </Link>
              ) : (
                cardBody
              )}
            </div>
          );
        })}
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

/* ─── MODERN: Borderless, only bottom line, 2-column, generous padding, outline icons ─── */
function ServicesModern({ headline, subline, badgeText, cards, ctaLabel, ctaHref, ctaIcon }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 md:mb-20">
        {badgeText && (
          <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-wide text-[color:var(--token-muted)]">
            <span className="h-px w-8 bg-[var(--token-card-border)]" /><span data-edit-path="badgeText">{badgeText}</span>
          </div>
        )}
        {headline && <h2 className="text-4xl font-light tracking-tight text-[color:var(--token-heading)] md:text-5xl lg:text-3xl" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="rt-content mt-4 max-w-2xl text-lg text-[color:var(--token-body)]" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {cards.map((card, i) => {
          const inner = (
            <div className="flex items-start gap-6">
              {card.icon && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[color:var(--token-icon)] transition-colors">
                  <DynamicIcon editPath="icon" name={card.icon} size={28} />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-[color:var(--token-heading)] transition-colors group-hover:text-[color:var(--token-accent)]" data-edit-path="title">{card.title}</h3>
                {card.text && <div className="rt-content mt-2 leading-relaxed text-[color:var(--token-body)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
                {card.href && (
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-[color:var(--token-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                    Mehr erfahren {card.icon && <DynamicIcon editPath="icon" name={card.icon} size={14} />}
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
              className="group border-b border-[var(--token-card-border)] px-8 py-10 transition-colors hover:bg-[var(--token-card-bg)]"
              data-edit-collection="manualCards"
              data-edit-index={i}
            >
              {card.href ? <Link href={card.href} className="block" data-edit-link="href">{inner}</Link> : inner}
            </motion.div>
          );
        })}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="mt-16">
          <Link href={ctaHref} className="inline-flex items-center gap-2 border-b border-[var(--token-accent)] pb-1 text-sm font-medium text-[color:var(--token-accent)] transition-colors hover:border-[var(--token-body)] hover:text-[color:var(--token-body)]">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={14} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/* ─── BOLD: Sharp edges, thick border, hard-offset shadow, 4-column tight grid ─── */
function ServicesBold({ headline, subline, badgeText, cards, ctaLabel, ctaHref, ctaIcon }: SProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12">
        {badgeText && (
          <span className="mb-4 inline-block bg-[var(--token-badge-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">
            {badgeText}
          </span>
        )}
        {headline && <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--token-heading)] lg:text-4xl" data-edit-path="headline">{headline}</h2>}
        {subline && <div className="rt-content mt-3 font-medium text-[color:var(--token-body)]" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const inner = (
            <>
              {card.icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[var(--token-body)]">
                  <DynamicIcon editPath="icon" name={card.icon} size={20} className="text-[color:var(--token-icon)]" />
                </div>
              )}
              <h3 className="text-base font-bold uppercase tracking-wide text-[color:var(--token-heading)]" data-edit-path="title">{card.title}</h3>
              {card.text && <div className="rt-content mt-2 text-sm leading-relaxed text-[color:var(--token-body)]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
              {card.href && (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-[color:var(--token-accent)]">
                  Details {card.ctaIcon && <DynamicIcon editPath="ctaIcon" name={card.ctaIcon} size={12} />}
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
              className="group border-3 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-[4px_4px_0_var(--token-body)] transition-all hover:border-[var(--token-accent)] hover:shadow-[-4px_4px_0_var(--token-accent)]"
              data-edit-collection="manualCards"
              data-edit-index={i}
            >
              {card.href ? <Link href={card.href} className="block" data-edit-link="href">{inner}</Link> : inner}
            </motion.div>
          );
        })}
      </div>
      {ctaLabel && ctaHref && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="mt-10">
          <Link href={ctaHref} className="inline-flex items-center gap-2 border-3 border-[var(--token-body)] bg-[var(--token-btn-bg)] px-8 py-3.5 font-bold uppercase tracking-wide text-[color:var(--token-btn-text)] shadow-[4px_4px_0_var(--token-accent)] transition-all hover:shadow-[-4px_4px_0_var(--token-accent)]">
            {ctaLabel} {ctaIcon && <DynamicIcon name={ctaIcon} size={16} />}
          </Link>
        </motion.div>
      )}
    </div>
  );
}
