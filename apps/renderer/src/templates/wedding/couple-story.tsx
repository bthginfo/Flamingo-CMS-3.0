'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingCoupleStorySection({ data }: Props) {
  const badge = (data.badge as string) || 'Unsere Geschichte';
  const headline = (data.headline as string) || 'Wie alles begann';
  const story = (data.story as string) || '';
  const image = (data.image as string) || '';
  const milestones = (data.milestones as Array<{ date: string; text: string }>) || [];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {image && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2 max-w-3xl mx-auto'}>
            {story && <p className="text-gray-600 text-lg leading-relaxed mb-10">{story}</p>}
            {milestones.length > 0 && (
              <div className="space-y-6 border-l-2 border-brand-primary/20 pl-6">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <span className="text-sm font-semibold text-brand-primary">{m.date}</span>
                    <p className="text-gray-700 mt-1">{m.text}</p>
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
