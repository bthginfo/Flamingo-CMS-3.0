'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';

type Props = { data: Record<string, unknown>; variant?: string | null };

type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio?: string;
};

type ValueItem = {
  icon?: string;
  title: string;
  text: string;
  image?: string;
  mediaType?: 'icon' | 'image';
};

export function TeamSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const storyHeadline = (data.storyHeadline as string) || '';
  const storyText = (data.storyText as string) || '';
  const storyImage = (data.storyImage as string) || '';
  const valuesHeadline = (data.valuesHeadline as string) || 'Unsere Werte';
  const membersHeadline = (data.membersHeadline as string) || 'Unser Team';
  const members = (data.members as TeamMember[]) || [];
  const values = (data.values as ValueItem[]) || [];
  const stats = (data.stats as { value: string; label: string }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        {badgeText && (
          <div className="section-badge">
            <span>{badgeText}</span>
          </div>
        )}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>

      {/* Story block */}
      {(storyHeadline || storyText) && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24"
        >
          {storyImage && (
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={storyImage}
                  alt={storyHeadline || 'Unsere Geschichte'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
          <div className={storyImage ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'}>
            {storyHeadline && <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 text-gray-900">{storyHeadline}</h3>}
            {storyText && <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">{storyText}</p>}
          </div>
        </motion.div>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-primary/[0.03] to-brand-secondary/[0.03] border border-gray-100">
              <div className="font-display font-bold text-3xl lg:text-4xl text-brand-primary mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Values */}
      {values.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-24"
        >
          <h3 className="font-display font-bold text-2xl text-center mb-12 text-gray-900">{valuesHeadline}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                {val.mediaType === 'image' && val.image ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5">
                    <Image src={val.image} alt={val.title} fill className="object-cover" sizes="400px" />
                  </div>
                ) : val.icon ? (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                    <DynamicIcon name={val.icon} size={28} className="text-brand-primary" />
                  </div>
                ) : null}
                <h4 className="font-display font-semibold text-lg mb-2 text-gray-900">{val.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Team members */}
      {members.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-display font-bold text-2xl text-center mb-12 text-gray-900">{membersHeadline}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((m, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-5 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {m.image ? (
                    <Image src={m.image} alt={m.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
                      <DynamicIcon name="users" size={48} className="text-brand-primary/30" />
                    </div>
                  )}
                </div>
                <h4 className="font-display font-semibold text-lg text-gray-900">{m.name}</h4>
                <p className="text-sm text-brand-primary font-medium mb-2">{m.role}</p>
                {m.bio && <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{m.bio}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
