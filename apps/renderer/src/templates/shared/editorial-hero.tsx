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
    <section className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-28 lg:pb-28 lg:pt-32">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[42%] border-l border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] lg:block" />
      <div className={`mx-auto grid max-w-7xl items-center gap-12 ${imagePrimary ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-20' : ''}`}>
        <div className="max-w-3xl">
          {eyebrow && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="cms-eyebrow text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">
              <span aria-hidden="true" className="cms-eyebrow-mark" />
              {eyebrow}
            </motion.p>
          )}
          <h1 className="mt-5 max-w-[16ch] text-[clamp(2.6rem,7vw,5.8rem)] font-[var(--token-heading-weight)] leading-[0.98] tracking-[var(--token-heading-tracking)] text-[color:var(--token-heading)]" data-edit-path="headline"><WordReveal text={headline} /></h1>
          {text && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-[60ch] text-base leading-7 text-[color:var(--token-body)] rt-content sm:text-lg sm:leading-8" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="cms-button cms-button--primary group bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]">
                <span data-edit-path="label">{primaryCta.label}</span>
                <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />
              </a>
            )}
            {secondaryCta.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="cms-button cms-button--secondary border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)]">
                <span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </motion.div>
          {hint && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-5 max-w-xl text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</motion.p>}
        </div>

        {imagePrimary && (
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <motion.div initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.2, 0.75, 0.25, 1] }} className="relative aspect-[4/5] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_24px_70px_var(--token-shadow)]">
              <img data-edit-image="imagePrimary" src={imagePrimary} alt={headline} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            {imageSecondary && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="absolute -bottom-8 -left-8 hidden w-[42%] overflow-hidden rounded-[var(--token-card-radius)] border-[6px] border-[var(--token-section-bg)] bg-[var(--token-card-bg)] shadow-[0_18px_48px_var(--token-shadow)] md:block">
                <img data-edit-image="imageSecondary" src={imageSecondary} alt="" className="aspect-square h-full w-full object-cover" />
              </motion.div>
            )}
            <div aria-hidden="true" className="absolute -right-5 -top-5 -z-10 h-full w-full rounded-[var(--token-card-radius)] border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)]" />
          </div>
        )}
      </div>
    </section>
  );
}
