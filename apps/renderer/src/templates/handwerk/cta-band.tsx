'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CtaBandSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cta = data.ctaPrimary as { label: string; href: string; icon?: string } | undefined;
  const ctaSecondary = data.ctaSecondary as { label: string; href: string; icon?: string } | undefined;
  // Colors come from styleOverrides (CSS vars: --style-section-bg, --style-heading-color, --style-accent-color)
  const colors = {
    bgColor: undefined as string | undefined,
    textColor: undefined as string | undefined,
    accentColor: undefined as string | undefined,
  };

  return <CtaClassic headline={headline} subline={plain(subline)} badgeText={badgeText} cta={cta} ctaSecondary={ctaSecondary} colors={colors} />;
}

type ColorOverrides = { bgColor?: string; textColor?: string; accentColor?: string };
type Cta = { label: string; href: string; icon?: string };
type CProps = { headline: string; subline: string; badgeText: string; cta?: Cta; ctaSecondary?: Cta; colors?: ColorOverrides };
const CTA_CARD_BG = 'linear-gradient(135deg, color-mix(in srgb, var(--token-card-bg, #0f172a) 92%, #000) 0%, color-mix(in srgb, var(--token-accent) 30%, var(--token-card-bg, #0f172a)) 100%)';
// This band always renders on a dark gradient (card-bg mixed toward black +
// accent), so the heading must use the on-dark slot. Using --token-heading here
// made the title invisible on dark sections where that slot is the dark brand
// colour (it overrode the correct on-dark-heading className via inline style).
const CTA_CARD_HEADING = 'var(--token-on-dark-heading, #fff)';
const CTA_CARD_BODY = 'color-mix(in srgb, var(--token-on-dark-body, rgba(255,255,255,0.78)) 82%, transparent)';
// Badge is bound to its DEDICATED slots with NO borrowed fallback, so only the
// CMS "Badge"-Felder control it. Defaults come from the independent page-level
// --token-badge-* values in brand-colors.ts.
const CTA_CARD_BADGE_BG = 'var(--token-badge-bg)';
const CTA_CARD_BADGE_TEXT = 'var(--token-badge-text)';
const CTA_CARD_BADGE_BORDER = 'var(--token-badge-border)';

/* ─── CLASSIC: Gradient bg, centered, pill cta, floating orbs ─── */
function CtaClassic({ headline, subline, badgeText, cta, ctaSecondary, colors }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const wrapStyle: React.CSSProperties = {
    background: colors?.bgColor ?? CTA_CARD_BG,
    border: '1px solid var(--token-card-border)',
    boxShadow: '0 24px 70px color-mix(in srgb, var(--token-shadow) 12%, transparent), inset 0 1px 0 color-mix(in srgb, #fff 60%, transparent)',
  };
  if (colors?.textColor) wrapStyle.color = colors.textColor;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.98 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-4xl" style={wrapStyle}>
      <motion.div
        style={{
          y: bgY,
          background: 'linear-gradient(135deg, transparent 0%, color-mix(in srgb, var(--token-accent) 14%, transparent) 100%)',
        }}
        className="absolute inset-0 scale-110 opacity-80"
      />
      <div className="relative z-10 px-6 py-12 text-center sm:py-16 md:py-24 lg:py-32" style={{ color: CTA_CARD_HEADING }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm backdrop-blur-sm" style={{ background: CTA_CARD_BADGE_BG, borderColor: CTA_CARD_BADGE_BORDER, color: CTA_CARD_BADGE_TEXT }}>
          <Sparkles size={14} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText || 'Jetzt Termin sichern'}</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight !leading-[1.1] text-[var(--token-on-dark-heading,white)]" style={{ color: colors?.textColor ?? CTA_CARD_HEADING }} data-edit-path="headline">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="rt-content mx-auto mb-10 max-w-2xl text-lg leading-8 sm:text-xl" style={{ color: CTA_CARD_BODY }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        {(cta?.label || ctaSecondary?.label) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-4">
            {cta?.label && (
              <a data-edit-link="cta" href={cta.href} className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--token-btn-bg)] px-8 py-4 font-semibold text-[color:var(--token-btn-text)] transition-all hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{cta.label}</span>{cta.icon && <DynamicIcon editPath="cta.icon" name={cta.icon} size={18} className="group-hover:translate-x-1 transition-transform" />}
              </a>
            )}
            {ctaSecondary?.label && (
              <a data-edit-link="ctaSecondary" href={ctaSecondary.href} className="group inline-flex items-center gap-2.5 rounded-full border border-[color:var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-8 py-4 font-semibold text-[color:var(--token-btn-secondary-text)] transition-all hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{ctaSecondary.label}</span>{ctaSecondary.icon && <DynamicIcon editPath="ctaSecondary.icon" name={ctaSecondary.icon} size={18} className="group-hover:translate-x-1 transition-transform" />}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

