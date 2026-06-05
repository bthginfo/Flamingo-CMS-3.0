'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Doctor = { name?: string; title?: string; specialty?: string; bio?: string; image?: string; languages?: string[]; appointmentCta?: { label?: string; href?: string } };

export function DoctorTeamSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Aerztliches Team', 'Team');
  const doctors = asList<Doctor>(data.doctors);

  if (styleVariant === 'modern') return <Modern header={header} doctors={doctors} />;
  if (styleVariant === 'bold') return <Bold header={header} doctors={doctors} />;
  return <Classic header={header} doctors={doctors} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; doctors: Doctor[] };

function Classic({ header, doctors }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {doctors.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="doctors" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text)]">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-bold text-[var(--token-heading)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs text-[var(--token-muted)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{item.appointmentCta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, doctors }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {doctors.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="doctors" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-light uppercase tracking-widest text-[var(--token-badge-text)]">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-light text-[var(--token-heading)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[var(--token-body)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs font-light text-[var(--token-muted)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{item.appointmentCta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, doctors }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {doctors.map((item, index) => (
          <article key={`$<span data-edit-path="name">{item.name}</span>-${index}`} className="group overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="doctors" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--token-heading)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs text-[var(--token-muted)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{item.appointmentCta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
