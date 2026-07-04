'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, Leaf, Wine } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingMenuSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Menü';
  const subline = (data.subline as string) || '';
  const headline = (data.headline as string) || 'Unser Hochzeitsmenü';
  const courses = (data.courses as Array<{ title: string; items: Array<{ name: string; description?: string; tags?: string[] }> }>) || [];
  const note = (data.note as string) || '';
  const p = { badge, headline, subline, courses, note };

  return <Classic {...p} />;
}

type Course = { title: string; items: Array<{ name: string; description?: string; tags?: string[] }> };
type P = { badge: string; headline: string; subline?: string; courses: Course[]; note: string };

const tagIcons: Record<string, React.ElementType> = { vegan: Leaf, vegetarisch: Leaf, wein: Wine };

function Classic({ badge, headline, subline, courses, note }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="space-y-12">
          {courses.map((course, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} data-edit-collection="courses" data-edit-index={i}>
              <h3 className="text-lg font-semibold text-[color:var(--token-icon)] mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> <span data-edit-path="title">{course.title}</span>
              </h3>
              <div className="space-y-4 pl-6 border-l-2 border-[color-mix(in_srgb,var(--token-card-border)_10%,transparent)]">
                {course.items.map((item, j) => (
                  <div key={j} data-edit-collection="items" data-edit-index={j}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[color:var(--token-heading)]" data-edit-path="name">{item.name}</span>
                      {item.tags?.map(tag => { const Icon = tagIcons[tag.toLowerCase()] || Leaf; return <Icon key={tag} className="w-3.5 h-3.5 text-[var(--token-success)]" title={tag} />; })}
                    </div>
                    {item.description && <div className="text-[color:var(--token-muted)] text-sm mt-0.5 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: item.description }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {note && <p className="text-center text-[color:var(--token-muted)] text-sm mt-12 italic" data-edit-path="note">{note}</p>}
      </div>
    </section>
  );
}

