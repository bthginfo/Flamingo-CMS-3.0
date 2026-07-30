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

  return <Classic header={header} routes={routes} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; routes: TourRoute[]; ctaPrimary: { label?: string; href?: string } };

function RouteMeta({ route, className }: { route: TourRoute; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-[color:var(--token-muted)]'}`}>
      {route.lengthLabel && <span className="inline-flex items-center gap-1"><Route size={13} />{route.lengthLabel}</span>}
      {route.durationLabel && <span>{route.durationLabel}</span>}
      {route.category && <span data-edit-path="category">{route.category}</span>}
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
          <motion.article key={`${route.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-card data-edit-collection="routes" data-edit-index={index}>
            {route.image && <div className="relative aspect-[16/9]"><Image data-edit-image="image" src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-[color:var(--token-badge-text)]" />
              <h3 className="mt-3 text-2xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{route.title || ''}</h3>
              {route.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: route.text }} />}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[color:var(--token-badge-text)]">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{route.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

