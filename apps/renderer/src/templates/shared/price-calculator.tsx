'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { buildLeadContextHref, persistLeadContext, type LeadContext } from '@/lib/lead-context';

type Choice = { label: string; price?: number };
type Option = {
  label: string;
  description?: string;
  type?: 'select' | 'toggle' | 'quantity';
  choices?: Choice[];
  price?: number;
  min?: number;
  max?: number;
};
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const fmt = (n: number, currency: string) =>
  `${n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;

export function PriceCalculatorSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || 'Was kostet mein Projekt?';
  const subline = (data.subline as string) || '';
  const currency = (data.currency as string) || '€';
  const basePrice = typeof data.basePrice === 'number' ? data.basePrice : 0;
  const baseLabel = (data.baseLabel as string) || 'Grundpreis';
  const priceNote = (data.priceNote as string) || 'Unverbindliche Schätzung — das finale Angebot erstellen wir individuell.';
  const options = (data.options as Option[]) || [];
  const cta = (data.cta as Cta) || {};

  const [selects, setSelects] = useState<Record<number, number>>({});
  const [toggles, setToggles] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const rows = useMemo(() => {
    const list: { label: string; amount: number }[] = [];
    if (basePrice > 0) list.push({ label: baseLabel, amount: basePrice });
    options.forEach((opt, i) => {
      const type = opt.type || (opt.choices?.length ? 'select' : 'toggle');
      if (type === 'select' && opt.choices?.length) {
        const choice = opt.choices[selects[i] ?? 0];
        if (choice && (choice.price ?? 0) !== 0) list.push({ label: `${opt.label}: ${choice.label}`, amount: choice.price ?? 0 });
      } else if (type === 'toggle') {
        if (toggles[i] && (opt.price ?? 0) !== 0) list.push({ label: opt.label, amount: opt.price ?? 0 });
      } else if (type === 'quantity') {
        const qty = quantities[i] ?? (opt.min ?? 0);
        if (qty > 0 && (opt.price ?? 0) !== 0) list.push({ label: `${qty} × ${opt.label}`, amount: qty * (opt.price ?? 0) });
      }
    });
    return list;
  }, [options, basePrice, baseLabel, selects, toggles, quantities]);

  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const leadContext = useMemo<LeadContext>(() => {
    const selections: string[] = [];
    if (basePrice > 0) selections.push(`${baseLabel}: ${fmt(basePrice, currency)}`);
    options.forEach((option, index) => {
      const type = option.type || (option.choices?.length ? 'select' : 'toggle');
      if (type === 'select' && option.choices?.length) {
        const choice = option.choices[selects[index] ?? 0];
        if (choice) selections.push(`${option.label}: ${choice.label}`);
      } else if (type === 'toggle' && toggles[index]) {
        selections.push(option.label);
      } else if (type === 'quantity') {
        const quantity = quantities[index] ?? (option.min ?? 0);
        if (quantity > 0) selections.push(`${option.label}: ${quantity}`);
      }
    });
    selections.push(`Gesamtschätzung: ${fmt(total, currency)}`);
    return { source: 'priceCalculator', summary: selections.join('\n') };
  }, [baseLabel, basePrice, currency, options, quantities, selects, toggles, total]);
  const leadHref = buildLeadContextHref(cta.href || '#kontakt', leadContext);
  if (!options.length && basePrice <= 0) return null;

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {options.map((opt, i) => {
            const type = opt.type || (opt.choices?.length ? 'select' : 'toggle');
            return (
              <motion.div key={`${opt.label}-${i}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 md:p-6" data-edit-collection="options" data-edit-index={i}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{opt.label}</h3>
                    {opt.description && <p className="mt-1 text-sm text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="description">{opt.description}</p>}
                  </div>
                  {type === 'toggle' && (
                    <button
                      role="switch"
                      aria-checked={!!toggles[i]}
                      onClick={() => setToggles((s) => ({ ...s, [i]: !s[i] }))}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${toggles[i] ? 'bg-[var(--token-btn-bg)]' : 'bg-[var(--token-card-border)]'}`}
                    >
                      <span className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--token-card-bg)] shadow transition-all duration-300 ${toggles[i] ? 'left-6' : 'left-1'}`} />
                    </button>
                  )}
                  {type === 'quantity' && (
                    <div className="flex items-center gap-3">
                      <button aria-label="Weniger" onClick={() => setQuantities((s) => ({ ...s, [i]: Math.max(opt.min ?? 0, (s[i] ?? (opt.min ?? 0)) - 1) }))} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--token-card-border)] text-[color:var(--token-heading)] transition hover:bg-[var(--token-badge-bg)]"><Minus size={15} /></button>
                      <span className="w-8 text-center font-bold tabular-nums text-[color:var(--token-heading)]">{quantities[i] ?? (opt.min ?? 0)}</span>
                      <button aria-label="Mehr" onClick={() => setQuantities((s) => ({ ...s, [i]: Math.min(opt.max ?? 99, (s[i] ?? (opt.min ?? 0)) + 1) }))} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--token-card-border)] text-[color:var(--token-heading)] transition hover:bg-[var(--token-badge-bg)]"><Plus size={15} /></button>
                    </div>
                  )}
                </div>
                {type === 'select' && (opt.choices?.length ?? 0) > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {opt.choices!.map((choice, ci) => (
                      <button
                        key={`${choice.label}-${ci}`}
                        onClick={() => setSelects((s) => ({ ...s, [i]: ci }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${(selects[i] ?? 0) === ci
                          ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] shadow'
                          : 'border border-[var(--token-card-border)] text-[color:var(--token-muted)] hover:text-[color:var(--token-heading)]'}`}
                      >
                        {choice.label}
                        {(choice.price ?? 0) !== 0 && <span className="ml-1.5 opacity-75">{(choice.price ?? 0) > 0 ? '+' : ''}{fmt(choice.price ?? 0, currency)}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {type === 'toggle' && (opt.price ?? 0) !== 0 && <p className="mt-2 text-sm font-semibold text-[color:var(--token-price)]">+{fmt(opt.price ?? 0, currency)}</p>}
                {type === 'quantity' && (opt.price ?? 0) !== 0 && <p className="mt-2 text-sm font-semibold text-[color:var(--token-price)]">{fmt(opt.price ?? 0, currency)} / Stück</p>}
              </motion.div>
            );
          })}
        </div>

        <motion.aside initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="h-fit rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-xl lg:sticky lg:top-28">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--token-label)]">Ihre Schätzung</h3>
          <div className="mt-4 space-y-2.5 border-b border-[var(--token-card-border)] pb-4">
            {rows.length === 0 && <p className="text-sm text-[color:var(--token-card-muted,var(--token-muted))]">Wählen Sie Optionen aus, um eine Schätzung zu sehen.</p>}
            {rows.map((row, ri) => (
              <div key={ri} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-[color:var(--token-card-body,var(--token-body))]">{row.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-[color:var(--token-card-heading,var(--token-heading))]">{fmt(row.amount, currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))]">Gesamt</span>
            <motion.span key={total} initial={{ scale: 1.12 }} animate={{ scale: 1 }} className="text-3xl font-black tabular-nums text-[color:var(--token-price)]">{fmt(total, currency)}</motion.span>
          </div>
          {priceNote && <p className="mt-3 text-xs leading-5 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="priceNote">{priceNote}</p>}
          {cta.label && (
            <a data-edit-link="cta" href={leadHref} onClick={() => persistLeadContext(leadContext)} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3.5 font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110">
              <span data-edit-path="label">{cta.label}</span>
              <ArrowRight size={17} />
            </a>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
