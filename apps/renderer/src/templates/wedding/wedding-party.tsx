'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingPartySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Unsere Crew';
  const headline = (data.headline as string) || 'Trauzeugen & Begleitung';
  const subline = (data.subline as string) || '';
  const members = ((data.members as Array<{ name: string; role?: string; relationship?: string; image?: string; text?: string }>) || []).map((m) => m && ({ ...m, role: m.role ?? m.relationship ?? '' }));
  const p = { badge, headline, subline, members };

  return <Classic {...p} />;
}

type P = { badge: string; headline: string; subline?: string; members: Array<{ name: string; role: string; image?: string; text?: string }> };

function Classic({ badge, headline, subline, members }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center" data-edit-collection="members" data-edit-index={i}>
              <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden bg-[color-mix(in_srgb,var(--token-badge-bg)_40%,transparent)]">
                {m.image ? <Image data-edit-image="image" src={m.image} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-[color:color-mix(in_srgb,var(--token-icon)_30%,transparent)]">{m.name[0]}</div>}
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h3>
              <p className="text-[color:var(--token-icon)] text-sm font-medium mt-1" data-edit-path="role">{m.role}</p>
              {m.text && <div className="text-[color:var(--token-muted)] text-sm mt-3 max-w-xs mx-auto rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

