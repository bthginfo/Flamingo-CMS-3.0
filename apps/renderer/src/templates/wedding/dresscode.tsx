'use client';

import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingDresscodeSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Dresscode';
  const headline = (data.headline as string) || 'Was ziehe ich an?';
  const text = (data.text as string) || '';
  const colors = (data.colors as string[]) || [];
  const hints = (data.hints as string[]) || [];
  const p = { badge, headline, text, colors, hints };

  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type P = { badge: string; headline: string; text: string; colors: string[]; hints: string[] };

function Classic({ badge, headline, text, colors, hints }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <span className="section-badge">{badge}</span>
        <h2 className="section-headline">{headline}</h2>
        {text && <div className="text-gray-600 text-lg mt-6 leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
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

function Modern({ badge, headline, text, colors, hints }: P) {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-gray-900 mb-10">{headline}</h2>
        {text && <div className="text-gray-500 text-base leading-relaxed mb-12 rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
        {colors.length > 0 && (
          <div className="flex items-center gap-6 mb-12">
            {colors.map((color, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-16 h-16 border border-gray-200" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        )}
        {hints.length > 0 && (
          <div className="border-t border-gray-200 pt-8 space-y-4">
            {hints.map((hint, i) => (
              <p key={i} className="text-gray-600 text-sm">{hint}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Bold({ badge, headline, text, colors, hints }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-6">{headline}</h2>
        {text && <div className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            {colors.map((color, i) => (
              <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-16 h-16 border-2 border-white/20" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        )}
        {hints.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto mt-8">
            {hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-3 text-white/80 text-sm border border-white/10 p-4">
                <Shirt className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
