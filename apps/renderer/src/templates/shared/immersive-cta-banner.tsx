'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Metric = { value: string; label: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ImmersiveCtaBannerSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || '';
  const imagePosition = (data.imagePosition as string) || 'center';
  const overlay = (data.overlay as string) || 'rgba(0,0,0,0.58)';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const metrics = (data.metrics as Metric[]) || [];
  const headingColor = image ? 'var(--token-on-dark-heading)' : 'var(--token-heading)';
  const bodyColor = image ? 'var(--token-on-dark-body)' : 'var(--token-body)';
  const mutedColor = image ? 'var(--token-on-dark-muted)' : 'var(--token-muted)';
  const metricCardBg = image
    ? 'color-mix(in srgb,var(--token-on-dark-heading) 12%,transparent)'
    : 'var(--token-card-bg)';
  const metricBorder = image
    ? 'color-mix(in srgb,var(--token-on-dark-heading) 24%,transparent)'
    : 'var(--token-card-border)';

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--token-section-bg)]">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-10 h-[calc(100%+80px)]">
        {image ? <img data-edit-image="image" src={image} alt="" className="h-full w-full object-cover" style={{ objectPosition: imagePosition }} /> : <div className="h-full bg-[var(--token-section-bg,theme(colors.zinc.950))]" />}
        <div className="absolute inset-0" style={{ background: overlay }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.18),transparent_28%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[620px] max-w-7xl items-end gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          {badge && <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_24%,transparent)] bg-[var(--token-badge-bg)] px-4 py-2 text-xs font-bold uppercase text-[color:var(--token-badge-text)] backdrop-blur"><Sparkles size={14} /><span data-edit-path="badge">{badge}</span></div>}
          {headline && <h2 className="max-w-4xl text-4xl font-black leading-none md:text-6xl lg:text-7xl" style={{ color: headingColor }} data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-6 max-w-2xl text-base leading-8 md:text-xl" style={{ color: bodyColor }} data-edit-path="subline">{plain(subline)}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="btn-primary inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)] shadow-2xl transition hover:brightness-110"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
            {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="btn-secondary inline-flex items-center gap-2 rounded-full border border-[color:var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-6 py-3 text-sm font-bold backdrop-blur transition hover:brightness-110" style={{ color: "var(--token-btn-secondary-text)" }} data-edit-path="label">{secondaryCta.label}</a>}
          </div>
        </div>

        {metrics.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border p-5 backdrop-blur-xl"
                style={{ background: metricCardBg, borderColor: metricBorder }}
               data-edit-collection="metrics" data-edit-index={index}>
                <div className="text-3xl font-black text-[color:var(--token-stat-value)]" data-edit-path="value">{metric.value}</div>
                <div className="mt-1 text-sm" style={{ color: mutedColor }} data-edit-path="label">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
