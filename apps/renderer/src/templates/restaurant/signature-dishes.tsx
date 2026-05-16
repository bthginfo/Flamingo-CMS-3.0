'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asList, type SectionProps } from './types';

type Dish = { name?: string; description?: string; price?: string; image?: string; label?: string; ingredients?: string[]; cta?: { label?: string; href?: string } };

type SignatureDishesViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  dishes: Dish[];
};

export function SignatureDishesSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Empfehlungen des Hauses';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Signature Dishes';
  const dishes = asList<Dish>(data.dishes);

  const props: SignatureDishesViewProps = { headline, subline, badgeText, dishes };

  if (styleVariant === 'bold') return <SignatureDishesBold {...props} />;
  if (styleVariant === 'modern') return <SignatureDishesModern {...props} />;
  return <SignatureDishesClassic {...props} />;
}

function SignatureDishesClassic({ headline, subline, badgeText, dishes }: SignatureDishesViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-10 max-w-3xl text-center mx-auto">
        {badgeText && <p className="inline-block rounded-full bg-brand-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</h2>
        {subline && <div className="mt-4 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {dishes.map((dish, index) => (
          <motion.article key={`${dish.name}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-md">
            {dish.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={dish.image} alt={dish.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {dish.label && <p className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-accent">{dish.label}</p>}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900">{dish.name || ''}</h3>
                {dish.price && <p className="shrink-0 font-bold text-gray-900">{dish.price}</p>}
              </div>
              {dish.description && <div className="mt-3 text-sm leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: dish.description }} />}
              {asList<string>(dish.ingredients).length > 0 && <p className="mt-4 text-xs text-gray-500">{asList<string>(dish.ingredients).join(' / ')}</p>}
              {dish.cta?.label && <a href={dish.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-primary">{dish.cta.label}<ArrowRight size={16} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

function SignatureDishesModern({ headline, subline, badgeText, dishes }: SignatureDishesViewProps) {
  return (
    <div>
      <div className="mb-12 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light text-gray-900 sm:text-3xl md:text-5xl">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-brand-accent" />
        {subline && <div className="mt-6 font-light text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {dishes.map((dish, index) => (
          <article key={`${dish.name}-${index}`} className="group border border-black/5">
            {dish.image && <div className="relative aspect-[4/3] overflow-hidden border-b border-black/5"><Image src={dish.image} alt={dish.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-6">
              {dish.label && <p className="text-xs font-light uppercase tracking-[0.15em] text-gray-500">{dish.label}</p>}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-medium text-gray-900">{dish.name || ''}</h3>
                {dish.price && <p className="shrink-0 font-medium text-gray-900">{dish.price}</p>}
              </div>
              {dish.description && <div className="mt-3 text-sm font-light leading-6 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: dish.description }} />}
              {asList<string>(dish.ingredients).length > 0 && <p className="mt-4 text-xs font-light text-gray-500">{asList<string>(dish.ingredients).join(' / ')}</p>}
              {dish.cta?.label && <a href={dish.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 border-b border-[#111827] pb-0.5 text-sm font-medium text-gray-900">{dish.cta.label}<ArrowRight size={16} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SignatureDishesBold({ headline, subline, badgeText, dishes }: SignatureDishesViewProps) {
  return (
    <div className="bg-[#111827] p-6 text-white sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-900">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-black uppercase sm:text-3xl md:text-5xl">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-brand-accent" />
        {subline && <div className="mt-4 text-white/70 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {dishes.map((dish, index) => (
          <article key={`${dish.name}-${index}`} className="group overflow-hidden rounded-none border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
            {dish.image && <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-white/20"><Image src={dish.image} alt={dish.name || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {dish.label && <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">{dish.label}</p>}
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold uppercase">{dish.name || ''}</h3>
                {dish.price && <p className="shrink-0 font-bold text-brand-accent">{dish.price}</p>}
              </div>
              {dish.description && <div className="mt-3 text-sm leading-6 text-white/60 rt-content" dangerouslySetInnerHTML={{ __html: dish.description }} />}
              {asList<string>(dish.ingredients).length > 0 && <p className="mt-4 text-xs text-white/50">{asList<string>(dish.ingredients).join(' / ')}</p>}
              {dish.cta?.label && <a href={dish.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-bold uppercase text-white">{dish.cta.label}<ArrowRight size={16} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

