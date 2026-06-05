'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Principle = { title?: string; text?: string; eyebrow?: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PrinciplesGridSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const principles = ((data.principles as Principle[]) || []).filter(item => item.title || item.text);
  const cta = (data.cta as Cta) || {};
  if (!principles.length && !headline) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--token-section-bg, var(--token-section-bg, var(--style-section-bg,#f8fafc)))] py-24 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_32%,rgba(255,255,255,0.10))]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          {badge && <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--token-badge-border,var(--token-card-border, var(--style-border-color,rgba(15,23,42,0.10))))] bg-[var(--token-badge-bg,var(--token-badge-bg, var(--style-badge-bg,rgba(15,23,42,0.04))))] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--token-badge-text,var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--brand-primary,#0f172a)))))]"><Sparkles size={14} />{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[var(--token-heading,var(--token-heading, var(--style-heading-color,var(--style-text-primary,#0f172a))))] md:text-6xl lg:text-7xl">{headline}</h2>}
          {subline && <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--token-body,var(--token-body, var(--style-body-color,var(--style-text-secondary,#475569))))]">{plain(subline)}</p>}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.05 }}
              className="min-h-[280px] rounded-2xl border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(255,255,255,0.12))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#101018)))] px-8 py-10"
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-badge-bg,var(--token-badge-bg, var(--style-badge-bg,rgba(255,255,255,0.10))))] text-sm font-black text-[var(--token-icon,var(--token-icon, var(--style-icon-color,var(--token-icon, var(--brand-primary,#f24171)))))]">
                {String(index + 1).padStart(2, '0')}
              </div>
              {item.eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--token-eyebrow,var(--style-accent-color,var(--token-icon, var(--brand-primary,#f24171))))]">{item.eyebrow}</div>}
              {item.title && <h3 className="text-2xl font-black leading-tight text-[var(--token-heading,var(--token-heading, var(--style-heading-color,var(--style-text-primary,#0f172a))))]">{item.title}</h3>}
              {item.text && <p className="mt-4 text-sm leading-7 text-[var(--token-body,var(--token-body, var(--style-body-color,var(--style-text-secondary,#475569))))]">{plain(item.text)}</p>}
            </motion.article>
          ))}
        </div>

        {cta.label && (
          <a href={cta.href || '#'} className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,#ffffff)))] px-6 py-3 text-sm font-bold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#111111)))]">
            {cta.label}<ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
