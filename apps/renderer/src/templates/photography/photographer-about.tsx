'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PhotographerAboutSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Über mich';
  const headline = (data.headline as string) || '';
  const intro = (data.intro as string) || '';
  const story = (data.story as string) || '';
  const image = (data.image as string) || '';
  const facts = (data.facts as string[]) || [];
  const stats = (data.stats as Array<{ label: string; value: string }>) || [];
  const signature = (data.signature as string) || '';
  const values = (data.values as Array<{ title: string; text: string }>) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-start">
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image data-edit-image="image" src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
              </div>
            </motion.div>
          )}
          <div className={image ? 'md:col-span-3' : 'md:col-span-5 max-w-3xl mx-auto'}>
            <span className="section-badge" data-edit-path="badge">{badge}</span>
            {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
            {intro && <div className="text-[color:var(--token-muted)] text-lg leading-relaxed mt-4 rt-content" data-edit-rich="intro" dangerouslySetInnerHTML={{ __html: intro }} />}
            {story && <div className="text-[color:var(--token-muted)] leading-relaxed mt-4 rt-content" data-edit-rich="story" dangerouslySetInnerHTML={{ __html: story }} />}
            {facts.length > 0 && (
              <ul className="mt-8 space-y-2">
                {facts.map((fact, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2 text-[color:var(--token-muted)] text-sm" data-edit-collection="facts" data-edit-index={i}>
                    <span className="text-[color:var(--token-icon)] mt-0.5">•</span>
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {stats.map((st, i) => (
                  <div key={i} className="rounded-xl border border-[color-mix(in_srgb,var(--token-card-border)_60%,transparent)] p-4 text-center" data-edit-collection="stats" data-edit-index={i}>
                    <div className="text-2xl font-bold text-[color:var(--token-stat-value)]" data-edit-path="value">{st.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[color:var(--token-muted)]" data-edit-path="label">{st.label}</div>
                  </div>
                ))}
              </div>
            )}
            {signature && <p className="mt-6 font-display text-2xl italic text-[color:var(--token-heading)]" data-edit-path="signature">{signature}</p>}
            {values.length > 0 && (
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[color-mix(in_srgb,var(--token-badge-bg)_35%,transparent)] border border-[color-mix(in_srgb,var(--token-card-border)_10%,transparent)]" data-edit-collection="values" data-edit-index={i}>
                    <h4 className="font-semibold text-[color:var(--token-heading)] text-sm" data-edit-path="title">{v.title}</h4>
                    <div className="text-[color:var(--token-muted)] text-sm mt-1 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: v.text }} />
                  </div>
                ))}
              </div>
            )}
            {ctaHref && (
              <a href={ctaHref} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] rounded-lg text-sm font-medium hover:bg-[var(--token-section-bg-alt)] transition-colors" data-edit-path="ctaLabel">
                {ctaLabel || 'Kontakt aufnehmen'}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
