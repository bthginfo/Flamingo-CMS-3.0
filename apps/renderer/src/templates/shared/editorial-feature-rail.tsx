'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Item = { kicker?: string; title: string; text?: string; image?: string; ctaLabel?: string; ctaHref?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function EditorialFeatureRailSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as Item[]) || [];
  if (!items.length) return null;

  return (
    <section data-theme="dark" className="overflow-hidden bg-[#070707] py-16 text-[#ffffff] md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          {badge && <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--style-accent-color,var(--brand-primary,#fff))]">{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[#ffffff] md:text-6xl">{headline}</h2>}
          {subline && <p className="mt-5 text-lg leading-8 text-[rgba(255,255,255,0.72)]">{plain(subline)}</p>}
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((item, index) => (
            <motion.article key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.06 }} className="group relative min-h-[560px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/12 bg-white/6 md:w-[520px]">
              {item.image && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-74 transition duration-700 group-hover:scale-105 group-hover:opacity-86" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                {item.kicker && <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[rgba(255,255,255,0.65)]">{item.kicker}</div>}
                <h3 className="text-3xl font-black leading-tight text-[#ffffff] md:text-4xl">{item.title}</h3>
                {item.text && <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(255,255,255,0.72)]">{plain(item.text)}</p>}
                {item.ctaLabel && <a href={item.ctaHref || '#'} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-950">{item.ctaLabel}<ArrowRight size={15} /></a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
