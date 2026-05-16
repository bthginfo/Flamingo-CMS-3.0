'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type Member = { name: string; role: string; image?: string; text?: string; relationship?: string };

export function WeddingPartySection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Trauzeugen';
  const subline = (data.subline as string) || '';
  const members = (data.members as Member[]) || [];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            {m.image ? (
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 shadow-md">
                <Image src={m.image} alt={m.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-40 h-40 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-4 text-4xl">
                {m.name.charAt(0)}
              </div>
            )}
            <h3 className="text-lg font-semibold">{m.name}</h3>
            <p className="text-rose-500 text-sm font-medium">{m.role}</p>
            {m.relationship && <p className="text-gray-400 text-xs mt-1">{m.relationship}</p>}
            {m.text && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{m.text}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
