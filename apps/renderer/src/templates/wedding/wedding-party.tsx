'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingPartySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Unsere Crew';
  const headline = (data.headline as string) || 'Trauzeugen & Begleitung';
  const members = (data.members as Array<{ name: string; role: string; image?: string; text?: string }>) || [];
  const p = { badge, headline, members };

  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type P = { badge: string; headline: string; members: Array<{ name: string; role: string; image?: string; text?: string }> };

function Classic({ badge, headline, members }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center" data-edit-collection="members" data-edit-index={i}>
              <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden bg-[var(--token-btn-bg)/5]">
                {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-[color:var(--token-icon)/30]">{m.name[0]}</div>}
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h3>
              <p className="text-[color:var(--token-icon)] text-sm font-medium mt-1" data-edit-path="role">{m.role}</p>
              {m.text && <div className="text-[color:var(--token-muted)] text-sm mt-3 max-w-xs mx-auto rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modern({ badge, headline, members }: P) {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start border-t border-[color:var(--token-card-border)] pt-6" data-edit-collection="members" data-edit-index={i}>
              <div className="relative w-20 h-20 shrink-0">
                {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full bg-[var(--token-section-bg-alt)] flex items-center justify-center text-2xl text-[color:var(--token-body)]">{m.name[0]}</div>}
              </div>
              <div>
                <h3 className="text-base font-medium text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--token-body)] mt-1" data-edit-path="role">{m.role}</p>
                {m.text && <div className="text-[color:var(--token-muted)] text-sm mt-3 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bold({ badge, headline, members }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border-2 border-[color:var(--token-card-border)] p-6 text-center hover:border-[var(--token-card-border)/50] transition-colors" data-edit-collection="members" data-edit-index={i}>
              <div className="relative w-24 h-24 mx-auto mb-4">
                {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full bg-[var(--token-section-bg-alt)] flex items-center justify-center text-3xl text-[color:var(--token-body)]">{m.name[0]}</div>}
              </div>
              <h3 className="text-lg font-bold text-[color:var(--token-heading)]" data-edit-path="name">{m.name}</h3>
              <p className="text-[color:var(--token-eyebrow)] text-xs font-bold uppercase tracking-widest mt-1" data-edit-path="role">{m.role}</p>
              {m.text && <div className="text-[color:var(--token-muted)] text-sm mt-3 rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
