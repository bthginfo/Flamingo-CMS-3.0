'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function NoticeBannerSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const text = (data.text as string) || '';
  const bgColor = 'var(--token-section-bg, transparent)';
  const textColor = 'var(--token-body, inherit)';
  const btnBg = 'var(--token-btn-bg)';
  const btnText = 'var(--token-btn-text)';
  const secondaryText = 'var(--token-btn-secondary-text)';
  const secondaryBorder = 'var(--token-btn-secondary-border)';
  const primaryCta = data.primaryCta as { label: string; href: string; icon?: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string; icon?: string } | undefined;

  return (
    <section className="w-full" style={{ backgroundColor: bgColor, color: textColor }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-12 md:py-16 text-center"
      >
        {headline && <h2 className="text-2xl md:text-3xl font-bold mb-3" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="text-lg md:text-xl opacity-80 mb-4" data-edit-path="subline">{plain(subline)}</p>}
        {text && <div className="opacity-70 leading-relaxed max-w-2xl mx-auto mb-6 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        {(primaryCta?.label || secondaryCta?.label) && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5" style={{ backgroundColor: btnBg, color: btnText }}>
                <span data-edit-path="label">{primaryCta.label}</span>
                {primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={16} />}
              </a>
            )}
            {secondaryCta?.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: secondaryBorder, color: secondaryText }}>
                <span data-edit-path="label">{secondaryCta.label}</span>
                {secondaryCta.icon && <DynamicIcon editPath="secondaryCta.icon" name={secondaryCta.icon} size={16} />}
              </a>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}
