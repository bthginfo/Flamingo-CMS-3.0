'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordReveal } from '@/components/ui/fx';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

/**
 * EditorialHero — calm, light hero: eyebrow + big heading + text and two CTAs
 * on the left, one large photo with an optional smaller overlapping photo on
 * the right. Made for brands that whisper instead of shout.
 */
export function EditorialHeroSection({ data }: Props) {
  const eyebrow = (data.eyebrow as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || (data.subline as string) || '';
  const imagePrimary = (data.imagePrimary as string) || (data.image as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const hint = (data.hint as string) || '';
  if (!headline) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--token-section-bg)] px-4 pb-16 pt-24 md:px-6 md:pb-24 md:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          {eyebrow && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">{eyebrow}</motion.p>}
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-[color:var(--token-heading)] md:text-5xl lg:text-6xl" data-edit-path="headline"><WordReveal text={headline} /></h1>
          {text && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-9 flex flex-wrap items-center gap-3">
            {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="group inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{primaryCta.label}</span>
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {secondaryCta.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-btn-secondary-border)] px-7 py-3.5 font-semibold text-[color:var(--token-heading)] transition hover:bg-[var(--token-badge-bg)]">
                <span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </motion.div>
          {hint && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-5 text-sm text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</motion.p>}
        </div>

        {imagePrimary && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <img data-edit-image="imagePrimary" src={imagePrimary} alt={headline} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            {imageSecondary && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute -bottom-8 -left-8 hidden w-2/5 overflow-hidden rounded-2xl border-4 border-[var(--token-section-bg)] shadow-xl md:block">
                <img data-edit-image="imageSecondary" src={imageSecondary} alt="" className="aspect-square h-full w-full object-cover" />
              </motion.div>
            )}
            <div aria-hidden className="absolute -right-6 -top-6 -z-10 h-full w-full rounded-[2rem] bg-[var(--token-badge-bg)]" />
          </div>
        )}
      </div>
    </section>
  );
}
