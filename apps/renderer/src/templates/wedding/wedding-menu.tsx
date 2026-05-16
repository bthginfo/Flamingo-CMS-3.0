'use client';

import { motion } from 'framer-motion';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type MenuItem = { name: string; description?: string };
type Course = { title: string; items: MenuItem[] };

export function WeddingMenuSection({ data }: Props) {
  const headline = (data.headline as string) || 'Menü';
  const subline = (data.subline as string) || '';
  const courses = (data.courses as Course[]) || [];
  const note = (data.note as string) || '';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-serif mb-3">{headline}</h2>
      {subline && <p className="text-gray-600 mb-10">{subline}</p>}

      <div className="space-y-8">
        {courses.map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-rose-500 text-sm uppercase tracking-widest font-medium mb-3">{course.title}</h3>
            <div className="space-y-2">
              {course.items.map((item, j) => (
                <div key={j}>
                  <p className="font-medium">{item.name}</p>
                  {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                </div>
              ))}
            </div>
            {i < courses.length - 1 && <div className="mt-6 mx-auto w-12 border-t border-rose-200" />}
          </motion.div>
        ))}
      </div>

      {note && <p className="mt-10 text-gray-500 text-sm italic">{note}</p>}
    </div>
  );
}
