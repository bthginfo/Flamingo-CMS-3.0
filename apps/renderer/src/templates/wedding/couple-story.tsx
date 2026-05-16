'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type Milestone = { year: string; title: string; text: string; image?: string };

export function CoupleStorySection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Geschichte';
  const subline = (data.subline as string) || '';
  const milestones = (data.milestones as Milestone[]) || [];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rose-200 hidden md:block" />

        <div className="space-y-12 md:space-y-16">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <span className="text-sm text-rose-400 font-medium">{m.year}</span>
                <h3 className="text-xl font-semibold mt-1">{m.title}</h3>
                <p className="text-gray-600 mt-2">{m.text}</p>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex w-4 h-4 rounded-full bg-rose-400 border-4 border-white shadow-sm shrink-0 z-10" />

              <div className="flex-1">
                {m.image && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                    <Image src={m.image} alt={m.title} fill className="object-cover" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
