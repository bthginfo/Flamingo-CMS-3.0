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
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">{badge}</p>
          {headline && <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-gray-900 mb-16 break-words">{headline}</h2>}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {image && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative aspect-[3/4]">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
              </motion.div>
            )}
            <div className={image ? '' : 'md:col-span-2 max-w-2xl'}>
              {intro && <div className="text-gray-500 text-lg leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
              {story && <div className="text-gray-400 leading-relaxed mt-6 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
              {facts.length > 0 && (
                <ul className="mt-10 space-y-3 border-t border-gray-200 pt-8">
                  {facts.map((fact, i) => <li key={i} className="text-gray-600 text-sm">{fact}</li>)}
                </ul>
              )}
              {values.length > 0 && (
                <div className="mt-10 space-y-4 border-t border-gray-200 pt-8">
                  {values.map((v, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-medium text-gray-900">{v.title}</h4>
                      <div className="text-gray-400 text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                    </div>
                  ))}
                </div>
              )}
              {ctaHref && <a href={ctaHref} className="inline-block mt-10 text-sm text-gray-900 border-b border-gray-900 hover:opacity-70 transition-opacity">{ctaLabel || 'Kontakt aufnehmen'} →</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
          {headline && <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words">{headline}</h2>}
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {image && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:col-span-2 relative aspect-[3/4]">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
                <div className="absolute inset-0 border-2 border-white/20" />
              </motion.div>
            )}
            <div className={image ? 'md:col-span-3' : 'md:col-span-5 max-w-3xl'}>
              {intro && <div className="text-white/70 text-lg leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
              {story && <div className="text-white/50 leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
              {facts.length > 0 && (
                <ul className="mt-8 space-y-2">
                  {facts.map((fact, i) => <li key={i} className="flex items-start gap-2 text-white/70 text-sm"><span className="text-brand-accent">—</span>{fact}</li>)}
                </ul>
              )}
              {values.length > 0 && (
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {values.map((v, i) => (
                    <div key={i} className="border border-white/10 p-4">
                      <h4 className="font-bold text-brand-accent text-sm">{v.title}</h4>
                      <div className="text-white/60 text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                    </div>
                  ))}
                </div>
              )}
              {ctaHref && <a href={ctaHref} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-accent text-black font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity">{ctaLabel || 'Kontakt aufnehmen'}</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-white">
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
            <span className="section-badge">{badge}</span>
            {headline && <h2 className="section-headline">{headline}</h2>}
            {intro && <div className="text-gray-700 text-lg leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: intro }} />}
            {story && <div className="text-gray-600 leading-relaxed mt-4 rt-content" dangerouslySetInnerHTML={{ __html: story }} />}
            {facts.length > 0 && (
              <ul className="mt-8 space-y-2">
                {facts.map((fact, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-brand-primary mt-0.5">•</span>
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            {values.length > 0 && (
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-brand-primary/[0.03] border border-brand-primary/10">
                    <h4 className="font-semibold text-gray-900 text-sm">{v.title}</h4>
                    <div className="text-gray-600 text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: v.text }} />
                  </div>
                ))}
              </div>
            )}
            {ctaHref && (
              <a href={ctaHref} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
                {ctaLabel || 'Kontakt aufnehmen'}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
