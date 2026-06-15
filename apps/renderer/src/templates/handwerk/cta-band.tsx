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
  // Colors come from styleOverrides (CSS vars: --style-section-bg, --style-heading-color, --style-accent-color)
  const colors = {
    bgColor: undefined as string | undefined,
    textColor: undefined as string | undefined,
    accentColor: undefined as string | undefined,
  };

  if (styleVariant === 'modern') return <CtaModern headline={headline} subline={plain(subline)} badgeText={badgeText} cta={cta} colors={colors} />;
  if (styleVariant === 'bold') return <CtaBold headline={headline} subline={plain(subline)} badgeText={badgeText} cta={cta} colors={colors} />;
  return <CtaClassic headline={headline} subline={plain(subline)} badgeText={badgeText} cta={cta} colors={colors} />;
}

type ColorOverrides = { bgColor?: string; textColor?: string; accentColor?: string };
type CProps = { headline: string; subline: string; badgeText: string; cta?: { label: string; href: string; icon?: string }; colors?: ColorOverrides };
const CTA_CARD_BG = 'linear-gradient(135deg, color-mix(in srgb, var(--token-card-bg, #0f172a) 92%, #000) 0%, color-mix(in srgb, var(--token-accent, #f59e0b) 30%, var(--token-card-bg, #0f172a)) 100%)';
const CTA_CARD_HEADING = 'var(--token-on-dark-heading, #fff)';
const CTA_CARD_BODY = 'color-mix(in srgb, var(--token-on-dark-body, #fff) 82%, transparent)';
const CTA_CARD_BADGE_BG = 'color-mix(in srgb, var(--token-on-dark-heading, #fff) 14%, transparent)';
const CTA_CARD_BADGE_TEXT = 'var(--token-on-dark-heading, #fff)';
const CTA_CARD_BADGE_BORDER = 'color-mix(in srgb, var(--token-on-dark-heading, #fff) 24%, transparent)';

/* ─── CLASSIC: Gradient bg, centered, pill cta, floating orbs ─── */
function CtaClassic({ headline, subline, badgeText, cta, colors }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const wrapStyle: React.CSSProperties = {
    background: colors?.bgColor ?? CTA_CARD_BG,
    border: '1px solid var(--token-card-border, rgba(15,23,42,0.08))',
    boxShadow: '0 24px 70px color-mix(in srgb, var(--token-heading, #0f172a) 12%, transparent), inset 0 1px 0 color-mix(in srgb, #fff 60%, transparent)',
  };
  if (colors?.textColor) wrapStyle.color = colors.textColor;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.98 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-4xl" style={wrapStyle}>
      <motion.div
        style={{
          y: bgY,
          background: 'linear-gradient(135deg, transparent 0%, color-mix(in srgb, var(--token-accent, #f59e0b) 14%, transparent) 100%)',
        }}
        className="absolute inset-0 scale-110 opacity-80"
      />
      <div className="relative z-10 px-6 py-12 text-center sm:py-16 md:py-24 lg:py-32" style={{ color: CTA_CARD_HEADING }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm backdrop-blur-sm" style={{ background: CTA_CARD_BADGE_BG, borderColor: CTA_CARD_BADGE_BORDER, color: CTA_CARD_BADGE_TEXT }}>
          <Sparkles size={14} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText || 'Jetzt Termin sichern'}</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight !leading-[1.1] text-white" style={{ color: colors?.textColor ?? CTA_CARD_HEADING }} data-edit-path="headline">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="rt-content mx-auto mb-10 max-w-2xl text-lg leading-8 sm:text-xl" style={{ color: CTA_CARD_BODY }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        {cta?.label && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
          <a data-edit-link="cta" href={cta.href} className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--token-btn-bg,#fff)] px-8 py-4 font-semibold text-[color:var(--token-btn-text,#0f172a)] transition-all hover:-translate-y-0.5 hover:brightness-110">
              <span data-edit-path="label">{cta.label}</span>{cta.icon && <DynamicIcon editPath="cta.icon" name={cta.icon} size={18} className="group-hover:translate-x-1 transition-transform" />}
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── MODERN: Pure text, large font, underline link, white bg ─── */
function CtaModern({ headline, subline, cta, colors }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const wrapStyle: React.CSSProperties = {
    background: colors?.bgColor ?? CTA_CARD_BG,
    border: '1px solid var(--token-card-border, rgba(15,23,42,0.08))',
    boxShadow: '0 18px 50px color-mix(in srgb, var(--token-heading, #0f172a) 8%, transparent)',
  };
  if (colors?.textColor) wrapStyle.color = colors.textColor;

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}
      className="rounded-4xl px-6 py-16 text-center md:py-24 lg:py-32" style={wrapStyle}>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight !leading-[1.1] max-w-4xl mx-auto text-white" style={{ color: colors?.textColor ?? CTA_CARD_HEADING }} data-edit-path="headline">
        {headline}
      </h2>
      {subline && <div className="rt-content mx-auto mt-6 max-w-2xl text-lg" style={{ color: CTA_CARD_BODY }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      {cta?.label && (
        <a data-edit-link="cta" href={cta.href} className="group mt-10 inline-flex items-center gap-3 border-b-2 border-[var(--token-btn-bg)] pb-1 text-lg font-medium text-[color:var(--token-btn-text)] transition-colors hover:text-[color:var(--token-accent)]">
          <span data-edit-path="label">{cta.label}</span>{cta.icon && <DynamicIcon editPath="cta.icon" name={cta.icon} size={18} className="group-hover:translate-x-1 transition-transform" />}
        </a>
      )}
    </motion.div>
  );
}

/* ─── BOLD: Full-width accent block, text left, angular ─── */
function CtaBold({ headline, subline, badgeText, cta, colors }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const wrapStyle: React.CSSProperties = {
    background: colors?.bgColor ?? CTA_CARD_BG,
    border: '1px solid var(--token-card-border, rgba(15,23,42,0.08))',
    boxShadow: '0 18px 50px color-mix(in srgb, var(--token-heading, #0f172a) 8%, transparent)',
  };
  if (colors?.textColor) wrapStyle.color = colors.textColor;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      className="flex flex-col items-start justify-between gap-8 rounded-4xl p-10 lg:flex-row lg:items-center lg:p-16" style={{ ...wrapStyle, color: CTA_CARD_HEADING }}>
      <div>
        {badgeText && <span className="mb-4 inline-block rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ background: CTA_CARD_BADGE_BG, borderColor: CTA_CARD_BADGE_BORDER, color: CTA_CARD_BADGE_TEXT }} data-edit-path="badgeText">{badgeText}</span>}
        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight text-white" style={{ color: CTA_CARD_HEADING }} data-edit-path="headline">{headline}</h2>
        {subline && <div className="rt-content mt-3 max-w-xl font-medium" style={{ color: CTA_CARD_BODY }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {cta?.label && (
        <a data-edit-link="cta" href={cta.href} className="inline-flex w-full shrink-0 items-center justify-between bg-[var(--token-btn-bg)] px-8 py-4 text-base font-bold uppercase tracking-wider text-[color:var(--token-btn-text)] shadow-[4px_4px_0_rgba(255,255,255,0.2)] transition-transform hover:translate-x-1 lg:w-auto lg:justify-center lg:gap-3">
          <span data-edit-path="label">{cta.label}</span>{cta.icon && <DynamicIcon editPath="cta.icon" name={cta.icon} size={18} />}
        </a>
      )}
    </motion.div>
  );
}
