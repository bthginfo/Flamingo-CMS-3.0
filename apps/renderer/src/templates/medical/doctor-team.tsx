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
              {item.specialty && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="bio" dangerouslySetInnerHTML={{ __html: item.bio }} />}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{item.appointmentCta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

