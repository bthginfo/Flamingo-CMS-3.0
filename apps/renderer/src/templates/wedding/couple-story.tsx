'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingCoupleStorySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Unsere Geschichte';
  const headline = (data.headline as string) || 'Wie alles begann';
  const story = (data.story as string) || '';
  const image = (data.image as string) || '';
  const milestones = (data.milestones as Array<{ date: string; text: string }>) || [];
  const p = { badge, headline, story, image, milestones };

  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type P = { badge: string; headline: string; story: string; image: string; milestones: Array<{ date: string; text: string }> };

function Classic({ badge, headline, story, image, milestones }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg,#ffffff)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2 max-w-3xl mx-auto'}>
            {story && <p className="text-[color:var(--token-muted,#52525b)] text-lg leading-relaxed mb-10">{story}</p>}
            {milestones.length > 0 && (
              <div className="space-y-6 border-l-2 border-[var(--token-card-border,var(--brand-primary,#1a5276))/20] pl-6">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} data-edit-collection="milestones" data-edit-index={i}>
                    <span className="text-sm font-semibold text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{m.date}</span>
                    <div className="text-[color:var(--token-muted,#3f3f46)] mt-1 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Modern({ badge, headline, story, image, milestones }: P) {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body,#a1a1aa)] mb-4" data-edit-path="badge">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
        {image && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative w-full aspect-[16/9] mb-16">
            <Image src={image} alt={headline} fill className="object-cover" />
          </motion.div>
        )}
        {story && <p className="text-[color:var(--token-muted,#71717a)] text-lg leading-relaxed max-w-3xl mb-16">{story}</p>}
        {milestones.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border-t border-[color:var(--token-card-border,#e4e4e7)] pt-6" data-edit-collection="milestones" data-edit-index={i}>
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--token-body,#a1a1aa)]">{m.date}</span>
                <div className="text-[color:var(--token-muted,#3f3f46)] mt-3 text-sm leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Bold({ badge, headline, story, image, milestones }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/4]">
              <Image src={image} alt={headline} fill className="object-cover" />
              <div className="absolute inset-0 border-2 border-[color:var(--token-card-border,#d4d4d8)]" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2'}>
            {story && <p className="text-[color:var(--token-muted,#52525b)] text-lg leading-relaxed mb-10">{story}</p>}
            {milestones.length > 0 && (
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border-l-4 border-[var(--token-card-border,var(--brand-accent,#f39c12))] pl-5" data-edit-collection="milestones" data-edit-index={i}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{m.date}</span>
                    <div className="text-[color:var(--token-muted,#3f3f46)] mt-2 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
