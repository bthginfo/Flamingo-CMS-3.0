import { useState } from 'react';
import { Calculator, ExternalLink, ArrowRight } from 'lucide-react';

/* ─── Tirol funding tiers ─────────────────────────────────── */
type TirolSize = 'micro' | 'small' | 'medium_large';
const TIROL_TIERS: Record<TirolSize, { label: string; rate: number; maxProject: number }> = {
  micro:        { label: 'Kleinstunternehmen', rate: 0.30, maxProject: 100_000 },
  small:        { label: 'Kleine Unternehmen', rate: 0.20, maxProject: 300_000 },
  medium_large: { label: 'Mittlere & große Unternehmen', rate: 0.10, maxProject: 750_000 },
};

/* ─── Bayern funding tiers ────────────────────────────────── */
type BayernVariant = 'standard' | 'plus';
type BayernSize = 'small' | 'medium';
const BAYERN_TIERS: Record<BayernVariant, Record<BayernSize, { rate: number; maxGrant: number }>> = {
  standard: {
    small:  { rate: 0.50, maxGrant: 10_000 },
    medium: { rate: 0.30, maxGrant: 10_000 },
  },
  plus: {
    small:  { rate: 0.50, maxGrant: 50_000 },
    medium: { rate: 0.30, maxGrant: 50_000 },
  },
};

function fmt(n: number) {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/* ─── Calculator component ────────────────────────────────── */
export function FundingCalculatorPage() {
  const [region, setRegion] = useState<'tirol' | 'bayern'>('tirol');
  const [projectCost, setProjectCost] = useState(50_000);

  // Tirol state
  const [tirolSize, setTirolSize] = useState<TirolSize>('micro');

  // Bayern state
  const [bayernVariant, setBayernVariant] = useState<BayernVariant>('standard');
  const [bayernSize, setBayernSize] = useState<BayernSize>('small');

  // Calculate
  let grantAmount = 0;
  let grantRate = 0;
  let note = '';

  if (region === 'tirol') {
    const tier = TIROL_TIERS[tirolSize];
    // If project exceeds max, the next-lower rate applies
    let effectiveRate = tier.rate;
    if (projectCost > tier.maxProject) {
      // Find the next lower tier rate
      const sizes: TirolSize[] = ['micro', 'small', 'medium_large'];
      const idx = sizes.indexOf(tirolSize);
      if (idx < sizes.length - 1) {
        effectiveRate = TIROL_TIERS[sizes[idx + 1]].rate;
        note = `Projektkosten übersteigen ${fmt(tier.maxProject)} – es gilt automatisch die nächstniedrigere Förderquote (${(effectiveRate * 100).toFixed(0)} %).`;
      }
    }
    grantRate = effectiveRate;
    grantAmount = Math.round(projectCost * effectiveRate);
  } else {
    const tier = BAYERN_TIERS[bayernVariant][bayernSize];
    grantRate = tier.rate;
    const raw = Math.round(projectCost * tier.rate);
    grantAmount = Math.min(raw, tier.maxGrant);
    if (raw > tier.maxGrant) {
      note = `Der Zuschuss ist bei Digitalbonus ${bayernVariant === 'plus' ? 'Plus' : 'Standard'} auf ${fmt(tier.maxGrant)} gedeckelt.`;
    }
  }

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-x max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-5">Förderrechner</p>
          <h1 className="headline-lg mb-6">
            Digitalisierungs&shy;zuschuss<br />
            <em className="italic-pop">berechnen</em>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Finde heraus, wie viel Förderung Du für Dein Digitalisierungsprojekt bekommen kannst.
            Wähle Dein Bundesland und gib Deine geplanten Projektkosten ein.
          </p>
        </div>

        {/* Region toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full p-1 bg-slate-100 border border-slate-200/60">
            <button
              onClick={() => setRegion('tirol')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${region === 'tirol' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🇦🇹 Tirol
            </button>
            <button
              onClick={() => setRegion('bayern')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${region === 'bayern' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🇩🇪 Bayern
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-8 space-y-6">
            <h3 className="font-display text-xl font-semibold flex items-center gap-2">
              <Calculator size={20} className="text-[var(--accent-color)]" /> Eingaben
            </h3>

            {/* Project cost slider */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Geplante Projektkosten
              </label>
              <input
                type="range"
                min={1000}
                max={region === 'tirol' ? 750_000 : 100_000}
                step={1000}
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                className="w-full accent-[var(--accent-color)]"
              />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>{fmt(1000)}</span>
                <span className="text-lg font-semibold text-slate-900">{fmt(projectCost)}</span>
                <span>{fmt(region === 'tirol' ? 750_000 : 100_000)}</span>
              </div>
            </div>

            {/* Tirol-specific: company size */}
            {region === 'tirol' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unternehmensgröße</label>
                <div className="space-y-2">
                  {(Object.entries(TIROL_TIERS) as [TirolSize, typeof TIROL_TIERS[TirolSize]][]).map(([key, tier]) => (
                    <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${tirolSize === key ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input
                        type="radio"
                        name="tirol-size"
                        checked={tirolSize === key}
                        onChange={() => setTirolSize(key)}
                        className="accent-[var(--accent-color)]"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-900">{tier.label}</span>
                        <span className="block text-xs text-slate-500">{(tier.rate * 100).toFixed(0)} % Förderquote · max. {fmt(tier.maxProject)} Projektkosten</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Bayern-specific: variant + size */}
            {region === 'bayern' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Digitalbonus-Variante</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['standard', 'plus'] as BayernVariant[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setBayernVariant(v)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${bayernVariant === v ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        {v === 'standard' ? 'Standard' : 'Plus (IT-Sicherheit)'}
                        <span className="block text-xs font-normal text-slate-400 mt-0.5">max. {fmt(BAYERN_TIERS[v].small.maxGrant)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unternehmensgröße</label>
                  <div className="space-y-2">
                    {([
                      ['small', 'Kleine Unternehmen (bis 50 MA)', '50 %'],
                      ['medium', 'Mittlere Unternehmen (bis 250 MA)', '30 %'],
                    ] as [BayernSize, string, string][]).map(([key, label, rate]) => (
                      <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${bayernSize === key ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input
                          type="radio"
                          name="bayern-size"
                          checked={bayernSize === key}
                          onChange={() => setBayernSize(key)}
                          className="accent-[var(--accent-color)]"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-900">{label}</span>
                          <span className="block text-xs text-slate-500">{rate} Förderquote</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Result card */}
          <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-8 flex flex-col">
            <h3 className="font-display text-xl font-semibold mb-6">Dein geschätzter Zuschuss</h3>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <p className="text-6xl md:text-7xl font-bold tracking-tight" style={{ color: 'var(--accent-color)' }}>
                {fmt(grantAmount)}
              </p>
              <p className="text-sm text-slate-500 mt-3">
                {(grantRate * 100).toFixed(0)} % von {fmt(projectCost)}
              </p>
              {note && (
                <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 max-w-sm">
                  {note}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-3">
              <p className="text-xs text-slate-400">
                Diese Berechnung ist eine unverbindliche Schätzung. Die tatsächliche Förderhöhe wird
                von der zuständigen Stelle nach Prüfung des Antrags festgelegt.
              </p>
              <a
                href={region === 'tirol'
                  ? 'https://www.tirol.gv.at/arbeit-wirtschaft/wirtschaft-und-arbeit/foerderungen/technologiefoerderungsprogramm/digitalisierungsfoerderungen/tiroler-digitalisierungsfoerderung-1/'
                  : 'https://www.digitalbonus.bayern/foerderprogramm/'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--accent-color)' }}
              >
                Alle Details beim {region === 'tirol' ? 'Land Tirol' : 'Freistaat Bayern'}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Info table */}
        <div className="mt-16 rounded-2xl border border-slate-200/60 bg-white overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-display text-lg font-semibold">
              {region === 'tirol' ? 'Tiroler Digitalisierungsförderung' : 'Digitalbonus Bayern'} – Übersicht
            </h3>
          </div>
          <div className="p-8">
            {region === 'tirol' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="pb-3 font-medium text-slate-500">Unternehmensgröße</th>
                      <th className="pb-3 font-medium text-slate-500">Max. Förderquote</th>
                      <th className="pb-3 font-medium text-slate-500">Max. Projektkosten</th>
                      <th className="pb-3 font-medium text-slate-500">Max. Zuschuss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(Object.values(TIROL_TIERS)).map((tier) => (
                      <tr key={tier.label}>
                        <td className="py-3 font-medium text-slate-900">{tier.label}</td>
                        <td className="py-3">{(tier.rate * 100).toFixed(0)} %</td>
                        <td className="py-3">≤ {fmt(tier.maxProject)}</td>
                        <td className="py-3 font-semibold" style={{ color: 'var(--accent-color)' }}>{fmt(Math.round(tier.maxProject * tier.rate))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs text-slate-400">
                  Förderung als verlorener Zuschuss (De-minimis-Beihilfe). Pro Unternehmen alle zwei Jahre ein Antrag möglich.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="pb-3 font-medium text-slate-500">Variante</th>
                      <th className="pb-3 font-medium text-slate-500">Kleine U. (≤ 50 MA)</th>
                      <th className="pb-3 font-medium text-slate-500">Mittlere U. (≤ 250 MA)</th>
                      <th className="pb-3 font-medium text-slate-500">Max. Zuschuss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Standard</td>
                      <td className="py-3">50 %</td>
                      <td className="py-3">30 %</td>
                      <td className="py-3 font-semibold" style={{ color: 'var(--accent-color)' }}>{fmt(10_000)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Plus (IT-Sicherheit)</td>
                      <td className="py-3">50 %</td>
                      <td className="py-3">30 %</td>
                      <td className="py-3 font-semibold" style={{ color: 'var(--accent-color)' }}>{fmt(50_000)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 text-xs text-slate-400">
                  Laufzeit bis 31.12.2027. Antragstellung bei der zuständigen Bezirksregierung.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center reveal">
          <p className="text-muted mb-6">
            Du möchtest die Förderung nutzen? Wir helfen Dir gerne bei der Planung und Umsetzung.
          </p>
          <a href="/kontakt" className="btn-accent">
            Jetzt beraten lassen <ArrowRight size={16} className="inline ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
