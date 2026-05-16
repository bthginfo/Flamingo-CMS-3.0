'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, Leaf, Wine } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingMenuSection({ data }: Props) {
  const badge = (data.badge as string) || 'Menü';
  const headline = (data.headline as string) || 'Unser Hochzeitsmenü';
  const courses = (data.courses as Array<{ title: string; items: Array<{ name: string; description?: string; tags?: string[] }> }>) || [];
  const note = (data.note as string) || '';

  const tagIcons: Record<string, React.ElementType> = { vegan: Leaf, vegetarisch: Leaf, wein: Wine };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="space-y-12">
          {courses.map((course, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> {course.title}
              </h3>
              <div className="space-y-4 pl-6 border-l-2 border-brand-primary/10">
                {course.items.map((item, j) => (
                  <div key={j}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.tags?.map(tag => {
                        const Icon = tagIcons[tag.toLowerCase()] || Leaf;
                        return <Icon key={tag} className="w-3.5 h-3.5 text-green-600" title={tag} />;
                      })}
                    </div>
                    {item.description && <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {note && <p className="text-center text-gray-500 text-sm mt-12 italic">{note}</p>}
      </div>
    </section>
  );
}
