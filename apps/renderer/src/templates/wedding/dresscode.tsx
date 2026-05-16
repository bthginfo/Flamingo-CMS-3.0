'use client';

import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingDresscodeSection({ data }: Props) {
  const badge = (data.badge as string) || 'Dresscode';
  const headline = (data.headline as string) || 'Was ziehe ich an?';
  const text = (data.text as string) || '';
  const colors = (data.colors as string[]) || [];
  const hints = (data.hints as string[]) || [];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <span className="section-badge">{badge}</span>
        <h2 className="section-headline">{headline}</h2>
        {text && <p className="text-gray-600 text-lg mt-6 leading-relaxed">{text}</p>}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {colors.map((color, i) => (
              <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-14 h-14 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        )}
        {hints.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            {hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                <Shirt className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
