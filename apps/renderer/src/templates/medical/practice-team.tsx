'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Member = { name?: string; role?: string; bio?: string; image?: string };

export function PracticeTeamSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Praxisteam', 'Assistenz');
  const members = asList<Member>(data.members);

  if (styleVariant === 'modern') return <Modern header={header} members={members} />;
  if (styleVariant === 'bold') return <Bold header={header} members={members} />;
  return <Classic header={header} members={members} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; members: Member[] };

function Classic({ header, members }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden rounded-xl bg-white shadow-lg">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{item.role}</p>}
              <h3 className="mt-2 text-xl font-bold text-gray-900">{item.name || ''}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">{item.bio}</p>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, members }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden border border-black/10 bg-white">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{item.role}</p>}
              <h3 className="mt-2 text-xl font-light text-gray-900">{item.name || ''}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-gray-600">{item.bio}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, members }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((item, index) => (
          <article key={`${item.name}-${index}`} className="group overflow-hidden border-2 border-[#111827] bg-white shadow-[4px_4px_0_#111827]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.name || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" /></div>}
            <div className="p-5">
              {item.role && <p className="text-xs font-black uppercase tracking-widest text-teal-500">{item.role}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-gray-900">{item.name || ''}</h3>
              {item.bio && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">{item.bio}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
