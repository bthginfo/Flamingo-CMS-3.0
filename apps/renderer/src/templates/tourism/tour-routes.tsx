'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Route, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type TourRoute = { title?: string; text?: string; image?: string; category?: string; lengthLabel?: string; durationLabel?: string; difficultyLabel?: string; startLabel?: string; highlights?: string[]; cta?: { label?: string; href?: string } };

export function TourRoutesSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Routen & Touren', 'Unterwegs');
  const routes = asList<TourRoute>(data.routes);
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'modern') return <Modern header={header} routes={routes} ctaPrimary={ctaPrimary} />;
  if (styleVariant === 'bold') return <Bold header={header} routes={routes} ctaPrimary={ctaPrimary} />;
  return <Classic header={header} routes={routes} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; routes: TourRoute[]; ctaPrimary: { label?: string; href?: string } };

function RouteMeta({ route, className }: { route: TourRoute; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-gray-600'}`}>
      {route.lengthLabel && <span className="inline-flex items-center gap-1"><Route size={13} />{route.lengthLabel}</span>}
      {route.durationLabel && <span>{route.durationLabel}</span>}
      {route.category && <span>{route.category}</span>}
      {route.difficultyLabel && <span>{route.difficultyLabel}</span>}
      {route.startLabel && <span>{route.startLabel}</span>}
    </div>
  );
}

function Classic({ header, routes, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <motion.article key={`${route.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="overflow-hidden rounded-xl bg-white shadow-lg">
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-green-700" />
              <h3 className="mt-3 text-2xl font-bold text-gray-900">{route.title || ''}</h3>
              {route.text && <p className="mt-3 text-sm leading-6 text-gray-600">{route.text}</p>}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-800">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white">{route.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, routes, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <article key={`${route.title}-${index}`} className="overflow-hidden border border-black/10 bg-white">
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-teal-600 font-light" />
              <h3 className="mt-3 text-2xl font-light text-gray-900">{route.title || ''}</h3>
              {route.text && <p className="mt-3 text-sm font-light leading-6 text-gray-600">{route.text}</p>}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="border border-black/10 px-3 py-1 text-xs text-gray-600">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 font-semibold text-teal-600">{route.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, routes, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <article key={`${route.title}-${index}`} className="overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-orange-500 font-black" />
              <h3 className="mt-3 text-2xl font-black uppercase text-gray-900">{route.title || ''}</h3>
              {route.text && <p className="mt-3 text-sm leading-6 text-gray-600">{route.text}</p>}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="border border-orange-500 px-3 py-1 text-xs font-bold uppercase text-orange-500">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-2.5 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{route.cta.label}<ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}
