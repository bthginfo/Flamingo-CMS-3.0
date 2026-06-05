'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function NoticeBannerSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const text = (data.text as string) || '';
  const bgColor = (data.bgColor as string) || 'var(--token-icon, var(--brand-primary, #2563eb))';
  const textColor = (data.textColor as string) || '#ffffff';
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
        {text && <div className="opacity-70 leading-relaxed max-w-2xl mx-auto mb-6 rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
        {(primaryCta?.label || secondaryCta?.label) && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {primaryCta?.label && (
              <a href={primaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5" style={{ backgroundColor: textColor, color: bgColor }}>
                <span data-edit-path="label">{primaryCta.label}</span>
                {primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={16} />}
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: textColor, color: textColor }}>
                <span data-edit-path="label">{secondaryCta.label}</span>
                {secondaryCta.icon && <DynamicIcon name={secondaryCta.icon} size={16} />}
              </a>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}
