'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type ProofItem = { value: string; label: string; icon?: string; logo?: string };

export function SocialProofBarSection({ data }: Props) {
  const items = (data.items as ProofItem[]) || [];
  const bgStyle = (data.bgStyle as string) || 'light';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  if (!items.length) return null;

  const bg = bgStyle === 'dark'
    ? 'bg-[var(--token-section-bg)] text-[color:var(--token-heading)]'
    : bgStyle === 'primary'
      ? 'bg-[var(--token-accent)] text-[color:var(--token-badge-text)]'
      : 'bg-[var(--token-card-bg)] text-[color:var(--token-body)]';

  return (
    <div ref={ref} className={`${bg} rounded-xl border border-[var(--token-card-border)] px-4 py-6`}>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }} className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex flex-col items-center text-center gap-1" data-edit-collection="items" data-edit-index={i}>
            {item.logo ? (
              <Image data-edit-image="logo" src={item.logo} alt={item.label} width={80} height={40} className="object-contain mb-1 max-h-10" />
            ) : item.icon === 'star' ? (
              <div className="flex gap-0.5 mb-1">{Array.from({ length: 5 }).map((_, si) => <Star key={si} size={14} className="fill-[var(--token-rating-star,#facc15)] text-[var(--token-accent,theme(colors.yellow.400))]"  data-edit-collection="length" data-edit-index={si}/>)}</div>
            ) : null}
            <span className="text-2xl md:text-3xl font-bold leading-tight" data-edit-path="value">{item.value}</span>
            <span className="text-xs text-[color:var(--token-card-body,var(--token-body))] md:text-sm" data-edit-path="label">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
