'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Service = { title?: string; description?: string; text?: string; image?: string; icon?: string; category?: string; cta?: { label?: string; href?: string } };

export function ServiceOverviewSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Leistungen', 'Fachbereiche');
  const items = asList<Service>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return <Classic header={header} items={items} ctaPrimary={ctaPrimary} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Service[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const description = item.description || item.text || '';
          const descriptionEditPath = item.description ? 'description' : 'text';
          return (
            <article key={`${item.title}-${index}`} className="cms-card group flex h-full flex-col overflow-hidden border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="items" data-edit-index={index} data-card="">
              {item.image && <div className="cms-media-frame relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" /></div>}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {item.icon && !item.image && (
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--token-card-border)] bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]">
                    <DynamicIcon name={item.icon} editPath="icon" size={20} aria-hidden="true" />
                  </span>
                )}
                {item.category && <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-badge-text)]" data-edit-path="category">{item.category}</p>}
                <h3 className={`${item.category ? 'mt-2' : ''} text-xl font-bold leading-snug text-[color:var(--token-card-heading)]`} data-edit-path="title">{item.title || ''}</h3>
                {description && <div className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-[color:var(--token-card-body)] rt-content" data-edit-rich={descriptionEditPath} dangerouslySetInnerHTML={{ __html: description }} />}
                {item.cta?.label && <a href={item.cta.href || '#'} className="cms-button cms-button--primary mt-5 self-start bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight aria-hidden="true" size={14} className="cms-button-icon" /></a>}
              </div>
            </article>
          );
        })}
      </motion.div>
      {ctaPrimary.label && <div className="mt-8"><a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a></div>}
    </div>
  );
}

