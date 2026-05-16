'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PhotographerAboutSection({ data }: Props) {
  const badge = (data.badge as string) || 'Über mich';
  const headline = (data.headline as string) || '';
  const intro = (data.intro as string) || '';
  const story = (data.story as string) || '';
  const image = (data.image as string) || '';
  const facts = (data.facts as string[]) || [];
  const values = (data.values as Array<{ title: string; text: string }>) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Image */}
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image src={image} alt={headline || 'Fotograf'} fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Text */}
          <div className={image ? 'md:col-span-3' : 'md:col-span-5 max-w-3xl mx-auto'}>
            <span className="section-badge">{badge}</span>
            {headline && <h2 className="section-headline">{headline}</h2>}
            {intro && <p className="text-gray-700 text-lg leading-relaxed mt-4">{intro}</p>}
            {story && <p className="text-gray-600 leading-relaxed mt-4">{story}</p>}

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
                    <p className="text-gray-600 text-sm mt-1">{v.text}</p>
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
