'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type StyleItem = {
  name: string;
  image: string;
  description?: string;
};

export function StyleGallerySection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Stile';
  const subline = (data.subline as string) || '';
  const styles = (data.styles as StyleItem[]) || [];
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const allTags = [...new Set(styles.map(s => s.name))];
  const displayed = activeFilter ? styles.filter(s => s.name === activeFilter) : styles;

  return (
    <section className="py-20 px-6 bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-white">{headline}</h2>
          {subline && <p className="mt-3 text-white/50 max-w-2xl mx-auto">{subline}</p>}
        </div>

        {/* Filter pills */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${!activeFilter ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
              Alle
            </button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${activeFilter === tag ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {displayed.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="break-inside-avoid mb-3 group relative overflow-hidden rounded-lg">
              {item.image && (
                <Image src={item.image} alt={item.name} width={400} height={500} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  {item.description && <p className="text-white/60 text-xs mt-0.5">{item.description}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {styles.length === 0 && (
          <p className="text-center text-white/30 py-12">Keine Bilder vorhanden.</p>
        )}
      </div>
    </section>
  );
}
