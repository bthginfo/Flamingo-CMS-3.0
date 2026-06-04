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

  if (styleVariant === 'modern') return <Modern headline={headline} subline={plain(subline)} members={members} ref={ref} inView={inView} />;
  if (styleVariant === 'bold') return <Bold headline={headline} subline={plain(subline)} members={members} ref={ref} inView={inView} />;
  return <Classic headline={headline} subline={plain(subline)} members={members} ref={ref} inView={inView} />;
}

type TProps = { headline: string; subline: string; members: TeamMember[]; ref: React.RefObject<HTMLDivElement | null>; inView: boolean };

function Classic({ headline, subline, members, ref, inView }: TProps) {
  return (
    <div ref={ref} className="py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
        <h2 className="section-headline">{headline}</h2>
        {subline && <p className="section-subline">{plain(subline)}</p>}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {members.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative bg-[var(--token-card-bg,#ffffff)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[color:var(--token-card-border,#f4f4f5)]">
            <div className="relative aspect-[3/4] overflow-hidden">
              {m.image ? (
                <Image src={m.image} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <span className="text-5xl">☕</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {m.bio && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[color:var(--token-on-dark-heading,#ffffff)/90] text-sm leading-relaxed">{plain(m.bio)}</p>
                </div>
              )}
            </div>
            <div className="p-5 text-center">
              <h4 className="font-semibold text-lg text-[color:var(--token-heading,#18181b)]">{m.name}</h4>
              <p className="text-sm text-amber-700 font-medium mt-0.5">{m.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Modern({ headline, subline, members, ref, inView }: TProps) {
  return (
    <div ref={ref} className="py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-14">
        <div className="flex items-center gap-3 text-xs text-[color:var(--token-body,#a1a1aa)] uppercase tracking-widest mb-3"><span className="w-8 h-px bg-stone-300" />Team</div>
        <h2 className="text-3xl md:text-4xl font-light text-[color:var(--token-heading,#18181b)] tracking-tight">{headline}</h2>
        {subline && <p className="text-[color:var(--token-body,#a1a1aa)] mt-3 text-lg">{plain(subline)}</p>}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {members.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
              {m.image ? (
                <Image src={m.image} alt={m.name} fill className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" sizes="(max-width: 640px) 50vw, 25vw" />
              ) : (
                <div className="w-full h-full bg-[var(--token-section-bg-alt,#f4f4f5)]" />
              )}
            </div>
            <h4 className="font-medium text-[color:var(--token-heading,#18181b)] text-sm">{m.name}</h4>
            <p className="text-xs text-[color:var(--token-body,#a1a1aa)] mt-0.5">{m.role}</p>
            {m.bio && <p className="text-xs text-[color:var(--token-muted,#71717a)] mt-1.5 leading-relaxed">{plain(m.bio)}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Bold({ headline, subline, members, ref, inView }: TProps) {
  return (
    <div ref={ref} className="py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">{headline}</h2>
        {subline && <p className="text-[color:var(--token-body,#a1a1aa)] mt-3">{plain(subline)}</p>}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative aspect-[3/4] rounded-lg overflow-hidden">
            {m.image ? (
              <Image src={m.image} alt={m.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 640px) 100vw, 25vw" />
            ) : (
              <div className="w-full h-full bg-[var(--token-section-bg-alt,#27272a)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h4 className="font-bold text-[color:var(--token-on-dark-heading,#ffffff)] text-lg">{m.name}</h4>
              <p className="text-amber-400 text-sm font-medium">{m.role}</p>
              {m.bio && <p className="text-[color:var(--token-on-dark-heading,#ffffff)/70] text-xs mt-1.5 leading-relaxed">{plain(m.bio)}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
