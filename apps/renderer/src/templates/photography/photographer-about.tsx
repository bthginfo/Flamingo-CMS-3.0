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
  const values = (data.values as Array<{ title: string; text: string }>) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body,#a1a1aa)] mb-4" data-edit-path="badge">{badge}</p>
          {headline && <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] mb-16 break-words" data-edit-path="headline">{headline}</h2>}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {image && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative aspect-[3/4]">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
              </motion.div>
            )}
            <div className={image ? '' : 'md:col-span-2 max-w-2xl'}>
              {intro && <div className="text-[color:var(--token-muted,#71717a)] text-lg leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
              {story && <div className="text-[color:var(--token-body,#a1a1aa)] leading-relaxed mt-6 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
              {facts.length > 0 && (
                <ul className="mt-10 space-y-3 border-t border-[color:var(--token-card-border,#e4e4e7)] pt-8">
                  {facts.map((fact, i) => <li key={i} className="text-[color:var(--token-muted,#52525b)] text-sm" data-edit-collection="facts" data-edit-index={i}>{fact}</li>)}
                </ul>
              )}
              {values.length > 0 && (
                <div className="mt-10 space-y-4 border-t border-[color:var(--token-card-border,#e4e4e7)] pt-8">
                  {values.map((v, i) => (
                    <div key={i} data-edit-collection="values" data-edit-index={i}>
                      <h4 className="text-sm font-medium text-[color:var(--token-heading,#18181b)]" data-edit-path="title">{v.title}</h4>
                      <div className="text-[color:var(--token-body,#a1a1aa)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                    </div>
                  ))}
                </div>
              )}
              {ctaHref && <a href={ctaHref} className="inline-block mt-10 text-sm text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)] hover:opacity-70 transition-opacity"><span data-edit-path="ctaLabel">{ctaLabel || 'Kontakt aufnehmen'}</span> →</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg-alt,#09090b)] text-[color:var(--token-on-dark-heading,#ffffff)]">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          {headline && <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>}
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {image && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:col-span-2 relative aspect-[3/4]">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
                <div className="absolute inset-0 border-2 border-[color:var(--token-card-border,#ffffff)/20]" />
              </motion.div>
            )}
            <div className={image ? 'md:col-span-3' : 'md:col-span-5 max-w-3xl'}>
              {intro && <div className="text-[color:var(--token-on-dark-heading,#ffffff)/90] text-lg leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
              {story && <div className="text-[color:var(--token-on-dark-heading,#ffffff)/80] leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
              {facts.length > 0 && (
                <ul className="mt-8 space-y-2">
                  {facts.map((fact, i) => <li key={i} className="flex items-start gap-2 text-[color:var(--token-on-dark-heading,#ffffff)/70] text-sm" data-edit-collection="facts" data-edit-index={i}><span className="text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">—</span>{fact}</li>)}
                </ul>
              )}
              {values.length > 0 && (
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {values.map((v, i) => (
                    <div key={i} className="border border-[color:var(--token-card-border,#ffffff)/10] p-4" data-edit-collection="values" data-edit-index={i}>
                      <h4 className="font-bold text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))] text-sm" data-edit-path="title">{v.title}</h4>
                      <div className="text-[color:var(--token-on-dark-heading,#ffffff)/80] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                    </div>
                  ))}
                </div>
              )}
              {ctaHref && <a href={ctaHref} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity" data-edit-path="ctaLabel">{ctaLabel || 'Kontakt aufnehmen'}</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg,#ffffff)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 lg:gap-8 lg:gap-16 items-start">
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
              </div>
            </motion.div>
          )}
          <div className={image ? 'md:col-span-3' : 'md:col-span-5 max-w-3xl mx-auto'}>
            <span className="section-badge" data-edit-path="badge">{badge}</span>
            {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
            {intro && <div className="text-[color:var(--token-muted,#3f3f46)] text-lg leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
            {story && <div className="text-[color:var(--token-muted,#52525b)] leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
            {facts.length > 0 && (
              <ul className="mt-8 space-y-2">
                {facts.map((fact, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2 text-[color:var(--token-muted,#3f3f46)] text-sm" data-edit-collection="facts" data-edit-index={i}>
                    <span className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mt-0.5">•</span>
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            {values.length > 0 && (
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))]/[0.03] border border-[var(--token-card-border,var(--brand-primary,#1a5276))/10]" data-edit-collection="values" data-edit-index={i}>
                    <h4 className="font-semibold text-[color:var(--token-heading,#18181b)] text-sm" data-edit-path="title">{v.title}</h4>
                    <div className="text-[color:var(--token-muted,#52525b)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                  </div>
                ))}
              </div>
            )}
            {ctaHref && (
              <a href={ctaHref} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)] rounded-lg text-sm font-medium hover:bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))] transition-colors" data-edit-path="ctaLabel">
                {ctaLabel || 'Kontakt aufnehmen'}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
