'use client';

import { motion } from 'framer-motion';
import { Shirt, Check, X } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingDresscodeSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Dresscode';
  const headline = (data.headline as string) || 'Was ziehe ich an?';
  const text = (data.text as string) || (data.description as string) || '';
  const colors = (data.colors as string[]) || [];
  const hints = (data.hints as string[]) || [];
  const dos = (data.dos as string[]) || [];
  const donts = (data.donts as string[]) || [];
  const note = (data.note as string) || '';
  const p = { badge, headline, text, colors, hints, dos, donts, note };

  return <Classic {...p} />;
}

type P = { badge: string; headline: string; text: string; colors: string[]; hints: string[]; dos: string[]; donts: string[]; note: string };

function Classic({ badge, headline, text, colors, hints, dos, donts, note }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-3xl mx-auto text-center">
        <span className="section-badge" data-edit-path="badge">{badge}</span>
        <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        {text && <div className="text-[color:var(--token-muted)] text-lg mt-6 leading-relaxed rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {colors.map((color, i) => (
              <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-14 h-14 rounded-full shadow-md border-2 border-[color:var(--token-card-border)]" style={{ backgroundColor: color }} title={color}  data-card data-edit-collection="colors" data-edit-index={i}/>
            ))}
          </div>
        )}
        {hints.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            {hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-3 text-[color:var(--token-muted)] text-sm" data-edit-collection="hints" data-edit-index={i}>
                <Shirt className="w-4 h-4 text-[color:var(--token-icon)] mt-0.5 shrink-0" />
                <span data-edit-path="hint">{hint}</span>
              </div>
            ))}
          </div>
        )}
        {(dos.length > 0 || donts.length > 0) && (
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2 max-w-2xl mx-auto">
            {dos.length > 0 && (
              <div className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--token-card-heading,var(--token-heading))]">Gerne gesehen</h3>
                <ul className="space-y-2.5">
                  {dos.map((d, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[color:var(--token-card-body,var(--token-body))]" data-card data-edit-collection="dos" data-edit-index={i}><Check size={16} className="mt-0.5 shrink-0 text-[color:var(--token-check)]" />{d}</li>)}
                </ul>
              </div>
            )}
            {donts.length > 0 && (
              <div className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--token-card-heading,var(--token-heading))]">Bitte vermeiden</h3>
                <ul className="space-y-2.5">
                  {donts.map((d, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-[color:var(--token-card-muted,var(--token-muted))]" data-card data-edit-collection="donts" data-edit-index={i}><X size={16} className="mt-0.5 shrink-0 text-[color:var(--token-danger)]" />{d}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        {note && <p className="mt-8 text-sm italic text-[color:var(--token-muted)]" data-edit-path="note">{note}</p>}
        
      </div>
    </section>
  );
}

