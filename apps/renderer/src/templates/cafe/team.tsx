'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
type TeamMember = { name: string; role: string; image?: string; bio?: string };

export function CafeTeamSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || 'Unser Team';
  const subline = (data.subline as string) || '';
  const members = (data.members as TeamMember[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return <Classic headline={headline} subline={plain(subline)} members={members} ref={ref} inView={inView} />;
}

type TProps = { headline: string; subline: string; members: TeamMember[]; ref: React.RefObject<HTMLDivElement | null>; inView: boolean };

function Classic({ headline, subline, members, ref, inView }: TProps) {
  return (
    <div ref={ref} className="py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
        <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {members.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative bg-[var(--token-card-bg)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[color:var(--token-card-border)]" data-edit-collection="members" data-edit-index={i}>
            <div className="relative aspect-[3/4] overflow-hidden">
              {m.image ? (
                <Image data-edit-image="image" src={m.image} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <span className="text-5xl">☕</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {m.bio && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_90%,transparent)] text-sm leading-relaxed">{plain(m.bio)}</p>
                </div>
              )}
            </div>
            <div className="p-5 text-center">
              <h4 className="font-semibold text-lg text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h4>
              <p className="mt-0.5 text-sm font-medium text-[var(--token-card-muted)]" data-edit-path="role">{m.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

