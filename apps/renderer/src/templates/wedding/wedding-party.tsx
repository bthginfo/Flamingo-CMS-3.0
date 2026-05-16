'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingPartySection({ data }: Props) {
  const badge = (data.badge as string) || 'Unsere Crew';
  const headline = (data.headline as string) || 'Trauzeugen & Begleitung';
  const members = (data.members as Array<{ name: string; role: string; image?: string; text?: string }>) || [];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden bg-brand-primary/5">
                {m.image ? <Image src={m.image} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl text-brand-primary/30">{m.name[0]}</div>}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{m.name}</h3>
              <p className="text-brand-primary text-sm font-medium mt-1">{m.role}</p>
              {m.text && <div className="text-gray-600 text-sm mt-3 max-w-xs mx-auto rt-content" dangerouslySetInnerHTML={{ __html: m.text }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
