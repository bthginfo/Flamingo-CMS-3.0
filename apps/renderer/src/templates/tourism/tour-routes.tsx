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
    <div className={`flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest ${className || 'text-[var(--token-muted)]'}`}>
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
          <motion.article key={`$<span data-edit-path="title">{route.title}</span>-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="routes" data-edit-index={index}>
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-[var(--token-badge-text)]" />
              <h3 className="mt-3 text-2xl font-bold text-[var(--token-heading)]" data-edit-path="title">{route.title || ''}</h3>
              {route.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: route.text }} />}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[var(--token-badge-text)]">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{route.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Modern({ header, routes, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <article key={`$<span data-edit-path="title">{route.title}</span>-${index}`} className="overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="routes" data-edit-index={index}>
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-[var(--token-badge-text)] font-light" />
              <h3 className="mt-3 text-2xl font-light text-[var(--token-heading)]" data-edit-path="title">{route.title || ''}</h3>
              {route.text && <div className="mt-3 text-sm font-light leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: route.text }} />}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="border border-[var(--token-card-border)] px-3 py-1 text-xs text-[var(--token-muted)]">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 font-semibold text-[var(--token-accent)]"><span data-edit-path="label">{route.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, routes, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <article key={`$<span data-edit-path="title">{route.title}</span>-${index}`} className="overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="routes" data-edit-index={index}>
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <RouteMeta route={route} className="text-[var(--token-badge-text)] font-black" />
              <h3 className="mt-3 text-2xl font-black uppercase text-[var(--token-heading)]" data-edit-path="title">{route.title || ''}</h3>
              {route.text && <div className="mt-3 text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: route.text }} />}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="border border-[var(--token-accent)] px-3 py-1 text-xs font-bold uppercase text-[var(--token-accent)]">{item}</span>)}</div>
              {route.cta?.label && <div className="mt-5"><a href={route.cta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{route.cta.label}</span><ArrowRight size={14} /></a></div>}
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}
