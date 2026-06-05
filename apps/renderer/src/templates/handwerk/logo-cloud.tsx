'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function LogoCloudSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const logos = (data.logos as { src: string; alt: string; href?: string }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          {headline && <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider" data-edit-path="headline">{headline}</h2>}
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
      >
        {logos.map((logo, i) => {
          const img = (
            <div className="relative h-10 w-28 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image data-edit-image="src" src={logo.src} alt={logo.alt} fill className="object-contain" />
            </div>
          );
          return logo.href ? (
            <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer">{img}</a>
          ) : (
            <div key={i}>{img}</div>
          );
        })}
      </motion.div>
    </div>
  );
}
