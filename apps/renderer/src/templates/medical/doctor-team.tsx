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
          <article key={`${item.name}-${index}`} className="group overflow-hidden rounded-2xl bg-[var(--style-card-bg)] shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-text-secondary)]">{item.bio}</p>}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">{item.appointmentCta.label}<ArrowRight size={14} /></a>}
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
          <article key={`${item.name}-${index}`} className="group overflow-hidden border border-black/10 bg-[var(--style-card-bg)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-light text-[var(--style-text-primary)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.bio}</p>}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs font-light text-[var(--style-text-secondary)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{item.appointmentCta.label}<ArrowRight size={14} /></a>}
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
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {doctors.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.specialty && <p className="text-xs font-black uppercase tracking-widest text-teal-500">{item.specialty}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--style-text-primary)]">{[item.title, item.name].filter(Boolean).join(' ')}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--style-text-secondary)]">{item.bio}</p>}
              {item.languages && item.languages.length > 0 && <p className="mt-2 text-xs text-[var(--style-text-secondary)]">{item.languages.join(' / ')}</p>}
              {item.appointmentCta?.label && <a href={item.appointmentCta.href || '#'} className="mt-4 inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-4 py-2 text-sm font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{item.appointmentCta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
