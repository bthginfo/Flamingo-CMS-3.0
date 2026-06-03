'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, Leaf, Wine } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingMenuSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Menü';
  const headline = (data.headline as string) || 'Unser Hochzeitsmenü';
  const courses = (data.courses as Array<{ title: string; items: Array<{ name: string; description?: string; tags?: string[] }> }>) || [];
  const note = (data.note as string) || '';
  const p = { badge, headline, courses, note };

  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type Course = { title: string; items: Array<{ name: string; description?: string; tags?: string[] }> };
type P = { badge: string; headline: string; courses: Course[]; note: string };

const tagIcons: Record<string, React.ElementType> = { vegan: Leaf, vegetarisch: Leaf, wein: Wine };

function Classic({ badge, headline, courses, note }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg,#ffffff)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="space-y-12">
          {courses.map((course, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-lg font-semibold text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> {course.title}
              </h3>
              <div className="space-y-4 pl-6 border-l-2 border-[var(--token-card-border,var(--brand-primary,#1a5276))/10]">
                {course.items.map((item, j) => (
                  <div key={j}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[color:var(--token-heading,#18181b)]">{item.name}</span>
                      {item.tags?.map(tag => { const Icon = tagIcons[tag.toLowerCase()] || Leaf; return <Icon key={tag} className="w-3.5 h-3.5 text-green-600" title={tag} />; })}
                    </div>
                    {item.description && <div className="text-[color:var(--token-on-dark-muted,#71717a)] text-sm mt-0.5 rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {note && <p className="text-center text-[color:var(--token-on-dark-muted,#71717a)] text-sm mt-12 italic">{note}</p>}
      </div>
    </section>
  );
}

function Modern({ badge, headline, courses, note }: P) {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-on-dark-body,#a1a1aa)] mb-4">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] mb-16 break-words">{headline}</h2>
        <div className="space-y-16">
          {courses.map((course, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[color:var(--token-on-dark-body,#a1a1aa)] mb-6 border-b border-[color:var(--token-card-border,#e4e4e7)] pb-3">{course.title}</h3>
              <div className="space-y-6">
                {course.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-light text-[color:var(--token-heading,#18181b)]">{item.name}</span>
                      {item.description && <div className="text-[color:var(--token-on-dark-body,#a1a1aa)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}
                    </div>
                    {item.tags && <div className="flex gap-1 shrink-0">{item.tags.map(tag => { const Icon = tagIcons[tag.toLowerCase()] || Leaf; return <Icon key={tag} className="w-3 h-3 text-[color:var(--token-on-dark-body,#d4d4d8)]" />; })}</div>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {note && <p className="text-[color:var(--token-on-dark-body,#a1a1aa)] text-xs mt-16 tracking-wider uppercase">{note}</p>}
      </div>
    </section>
  );
}

function Bold({ badge, headline, courses, note }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words">{headline}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border,#18181b)] p-6">
              <h3 className="text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))] font-bold uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> {course.title}
              </h3>
              <div className="space-y-4">
                {course.items.map((item, j) => (
                  <div key={j}>
                    <span className="font-bold text-[color:var(--token-heading,#18181b)]">{item.name}</span>
                    {item.description && <div className="text-[color:var(--token-on-dark-muted,#71717a)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {note && <p className="text-[color:var(--token-on-dark-body,#a1a1aa)] text-sm mt-12 text-center italic">{note}</p>}
      </div>
    </section>
  );
}
