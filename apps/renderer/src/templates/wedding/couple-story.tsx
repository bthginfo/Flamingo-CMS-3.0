'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type Milestone = { date?: string; year?: string; title?: string; text?: string; image?: string };

export function WeddingCoupleStorySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Unsere Geschichte';
  const headline = (data.headline as string) || 'Wie alles begann';
  const story = (data.story as string) || (data.subline as string) || '';
  const image = (data.image as string) || '';
  const milestones = (data.milestones as Milestone[]) || [];
  const p = { badge, headline, story, image, milestones };

  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type P = { badge: string; headline: string; story: string; image: string; milestones: Milestone[] };

function Classic({ badge, headline, story, image, milestones }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className={image ? 'grid md:grid-cols-2 gap-8 lg:gap-16 items-center' : ''}>
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'max-w-6xl mx-auto'}>
            {story && <p className="mx-auto max-w-3xl text-center text-[color:var(--token-muted)] text-lg leading-relaxed mb-10">{story}</p>}
            {milestones.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {milestones.map((m, i) => (
                  <motion.article key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-2xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm" data-edit-collection="milestones" data-edit-index={i}>
                    {m.image && <div className="relative aspect-[4/3]"><Image data-edit-image="image" src={m.image} alt={m.title || headline} fill className="object-cover" /></div>}
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--token-icon)]" data-edit-path={m.year ? 'year' : 'date'}>{m.year || m.date}</span>
                      {m.title && <h3 className="mt-3 text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{m.title}</h3>}
                      {m.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
                    </div>
                  </motion.article>
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
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
        {image && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative w-full aspect-[16/9] mb-16">
            <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
          </motion.div>
        )}
        {story && <p className="text-[color:var(--token-muted)] text-lg leading-relaxed max-w-3xl mb-16">{story}</p>}
        {milestones.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border-t border-[color:var(--token-card-border)] pt-6" data-edit-collection="milestones" data-edit-index={i}>
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--token-body)]" data-edit-path={m.year ? 'year' : 'date'}>{m.year || m.date}</span>
                {m.title && <h3 className="mt-3 text-lg font-medium text-[color:var(--token-heading)]" data-edit-path="title">{m.title}</h3>}
                {m.text && <div className="text-[color:var(--token-muted)] mt-3 text-sm leading-relaxed rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
        <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/4]">
              <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
              <div className="absolute inset-0 border-2 border-[color:var(--token-card-border)]" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2'}>
            {story && <p className="text-[color:var(--token-muted)] text-lg leading-relaxed mb-10">{story}</p>}
            {milestones.length > 0 && (
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border-l-4 border-[var(--token-card-border)] pl-5" data-edit-collection="milestones" data-edit-index={i}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path={m.year ? 'year' : 'date'}>{m.year || m.date}</span>
                    {m.title && <h3 className="mt-2 text-lg font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{m.title}</h3>}
                    {m.text && <div className="text-[color:var(--token-muted)] mt-2 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
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
