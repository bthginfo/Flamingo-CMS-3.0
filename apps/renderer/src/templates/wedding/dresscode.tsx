'use client';

import { motion } from 'framer-motion';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

export function DresscodeSection({ data }: Props) {
  const headline = (data.headline as string) || 'Dresscode';
  const description = (data.description as string) || '';
  const colors = (data.colors as string[]) || [];
  const dos = (data.dos as string[]) || [];
  const donts = (data.donts as string[]) || [];
  const note = (data.note as string) || '';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-serif mb-4">{headline}</h2>
      {description && <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>}

      {colors.length > 0 && (
        <div className="flex justify-center gap-3 mb-8">
          {colors.map((c, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-12 h-12 rounded-full border shadow-sm"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6 text-left">
        {dos.length > 0 && (
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-700 mb-3">✓ Gerne gesehen</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {dos.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>
        )}
        {donts.length > 0 && (
          <div className="bg-red-50 rounded-xl p-5">
            <h3 className="font-semibold text-red-700 mb-3">✗ Bitte vermeiden</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {donts.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>
        )}
      </div>

      {note && <p className="mt-8 text-gray-500 text-sm italic">{note}</p>}
    </div>
  );
}
