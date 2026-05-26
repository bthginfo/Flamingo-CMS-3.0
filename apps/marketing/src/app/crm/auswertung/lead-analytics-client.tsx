'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Clock3, Lightbulb, Plus, Search, Target, TrendingUp, XCircle } from 'lucide-react';
import type { Lead } from '../leads/actions';

type LeadStatus = 'offen' | 'kontaktiert' | 'angenommen' | 'abgelehnt';
type IndustryRow = {
  name: string;
  total: number;
  open: number;
  contacted: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
  rejectionRate: number;
  score: number;
  source: 'crm' | 'manual' | 'recommended';
};

const MANUAL_STORAGE_KEY = 'flamingo-crm-manual-industries';

const RECOMMENDED_INDUSTRIES = [
  'Küchenstudios',
  'Möbelhäuser',
  'Innenarchitektur',
  'Bad & Sanitär',
  'Solar & Energie',
  'Heizung & Klima',
  'Fenster & Türen',
  'Immobilienmakler',
  'Hotels & Pensionen',
  'Restaurants',
  'Cafés & Bäckereien',
  'Zahnarztpraxen',
  'Facharztpraxen',
  'Kosmetikstudios',
  'Friseursalons',
  'Tattoo-Studios',
  'Fotografen',
  'Hochzeitslocations',
  'Steuerberater',
  'Kanzleien',
  'Physiotherapie',
  'Fitnessstudios',
  'Garten- und Landschaftsbau',
  'Bestatter',
  'Optiker & Hörakustiker',
  'Fahrschulen',
];

function normalize(value: string | null | undefined, fallback = 'Nicht angegeben') {
  const trimmed = (value || '').trim();
  return trimmed || fallback;
}

function rate(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function qualityScore(accepted: number, rejected: number, contacted: number, total: number) {
  const decided = accepted + rejected;
  const decisionRate = total > 0 ? decided / total : 0;
  const acceptance = decided > 0 ? accepted / decided : 0;
  const contactSignal = total > 0 ? contacted / total : 0;
  return Math.round((acceptance * 70 + decisionRate * 20 + contactSignal * 10) * 100);
}

function groupBy<T extends string>(leads: Lead[], getKey: (lead: Lead) => T) {
  const map = new Map<T, Lead[]>();
  for (const lead of leads) {
    const key = getKey(lead);
    map.set(key, [...(map.get(key) || []), lead]);
  }
  return map;
}

function buildIndustryRows(leads: Lead[], manualIndustries: string[]): IndustryRow[] {
  const byIndustry = groupBy(leads, lead => normalize(lead.industry));
  const allNames = new Set<string>([...RECOMMENDED_INDUSTRIES, ...manualIndustries, ...byIndustry.keys()]);

  return Array.from(allNames).map(name => {
    const items = byIndustry.get(name) || [];
    const total = items.length;
    const accepted = items.filter(lead => lead.status === 'angenommen').length;
    const rejected = items.filter(lead => lead.status === 'abgelehnt').length;
    const contacted = items.filter(lead => lead.status === 'kontaktiert').length;
    const open = items.filter(lead => lead.status === 'offen').length;
    const source: IndustryRow['source'] = total > 0 ? 'crm' : manualIndustries.includes(name) ? 'manual' : 'recommended';
    return {
      name,
      total,
      open,
      contacted,
      accepted,
      rejected,
      acceptanceRate: rate(accepted, accepted + rejected),
      rejectionRate: rate(rejected, accepted + rejected),
      score: qualityScore(accepted, rejected, contacted, total),
      source,
    };
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.total !== a.total) return b.total - a.total;
    return a.name.localeCompare(b.name, 'de');
  });
}

function buildRegionRows(leads: Lead[]) {
  return Array.from(groupBy(leads, lead => normalize(lead.location)).entries()).map(([location, items]) => {
    const accepted = items.filter(lead => lead.status === 'angenommen').length;
    const rejected = items.filter(lead => lead.status === 'abgelehnt').length;
    const topIndustry = Array.from(groupBy(items, lead => normalize(lead.industry)).entries())
      .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'Nicht angegeben';
    return {
      location,
      total: items.length,
      accepted,
      rejected,
      open: items.filter(lead => lead.status === 'offen').length,
      contacted: items.filter(lead => lead.status === 'kontaktiert').length,
      acceptanceRate: rate(accepted, accepted + rejected),
      topIndustry,
    };
  }).sort((a, b) => b.acceptanceRate - a.acceptanceRate || b.total - a.total);
}

export function LeadAnalyticsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [query, setQuery] = useState('');
  const [manualIndustries, setManualIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MANUAL_STORAGE_KEY);
      if (stored) setManualIndustries(JSON.parse(stored));
    } catch {
      setManualIndustries([]);
    }
  }, []);

  function saveManualIndustries(next: string[]) {
    setManualIndustries(next);
    localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(next));
  }

  function addIndustry() {
    const name = newIndustry.trim();
    if (!name) return;
    const exists = [...manualIndustries, ...RECOMMENDED_INDUSTRIES].some(item => item.toLowerCase() === name.toLowerCase());
    if (!exists) saveManualIndustries([...manualIndustries, name].sort((a, b) => a.localeCompare(b, 'de')));
    setNewIndustry('');
  }

  const statusCounts = useMemo(() => ({
    total: initialLeads.length,
    open: initialLeads.filter(lead => lead.status === 'offen').length,
    contacted: initialLeads.filter(lead => lead.status === 'kontaktiert').length,
    accepted: initialLeads.filter(lead => lead.status === 'angenommen').length,
    rejected: initialLeads.filter(lead => lead.status === 'abgelehnt').length,
  }), [initialLeads]);

  const industryRows = useMemo(() => buildIndustryRows(initialLeads, manualIndustries), [initialLeads, manualIndustries]);
  const regionRows = useMemo(() => buildRegionRows(initialLeads), [initialLeads]);
  const filteredIndustries = industryRows.filter(row => row.name.toLowerCase().includes(query.toLowerCase()));
  const bestIndustries = industryRows.filter(row => row.total > 0).slice(0, 5);
  const potentialIndustries = industryRows.filter(row => row.total === 0).slice(0, 8);
  const acceptanceRate = rate(statusCounts.accepted, statusCounts.accepted + statusCounts.rejected);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">CRM Intelligence</p>
          <h1 className="text-2xl font-bold text-slate-900">Lead-Auswertung</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Branchen, Regionen und Statusqualität auf Basis deiner bestehenden Leads. Manuell ergänzte Branchen werden lokal in diesem Browser gespeichert.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric icon={Target} label="Leads gesamt" value={statusCounts.total} />
        <Metric icon={CheckCircle2} label="Angenommen" value={statusCounts.accepted} tone="green" />
        <Metric icon={XCircle} label="Abgelehnt" value={statusCounts.rejected} tone="red" />
        <Metric icon={TrendingUp} label="Annahmequote" value={`${acceptanceRate}%`} tone="indigo" />
        <Metric icon={Clock3} label="Offen/Kontaktiert" value={`${statusCounts.open}/${statusCounts.contacted}`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Branchen-Ranking</h2>
              <p className="text-xs text-slate-500">Anfragen = Leads gesamt, Abschlüsse = Status angenommen.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Branche suchen..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                  <th className="px-4 py-3 font-semibold">Branche</th>
                  <th className="px-4 py-3 font-semibold">Anfragen</th>
                  <th className="px-4 py-3 font-semibold">Abschlüsse</th>
                  <th className="px-4 py-3 font-semibold">Abgelehnt</th>
                  <th className="px-4 py-3 font-semibold">Offen</th>
                  <th className="px-4 py-3 font-semibold">Quote</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndustries.map(row => (
                  <tr key={row.name} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-400">
                        {row.source === 'crm' ? 'aus CRM-Daten' : row.source === 'manual' ? 'manuell ergänzt' : 'Vorschlag'}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{row.total}</td>
                    <td className="px-4 py-3 text-emerald-700">{row.accepted}</td>
                    <td className="px-4 py-3 text-red-600">{row.rejected}</td>
                    <td className="px-4 py-3 text-slate-500">{row.open}</td>
                    <td className="px-4 py-3">{row.total > 0 ? `${row.acceptanceRate}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.min(row.score, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{row.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Plus size={16} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Branche ergänzen</h2>
            </div>
            <div className="flex gap-2">
              <input
                value={newIndustry}
                onChange={event => setNewIndustry(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && addIndustry()}
                placeholder="z.B. Tierarztpraxen"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button onClick={addIndustry} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Hinzufügen</button>
            </div>
            {manualIndustries.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {manualIndustries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => saveManualIndustries(manualIndustries.filter(item => item !== industry))}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600"
                  >
                    {industry}
                    <XCircle size={12} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <InsightList title="Beste Branchen" icon={BarChart3} rows={bestIndustries.map(row => `${row.name}: ${row.accepted}/${row.total} Abschlüsse, ${row.acceptanceRate}% Quote`)} empty="Noch keine belastbaren Branchen-Daten." />
          <InsightList title="Spannende Branchen" icon={Lightbulb} rows={potentialIndustries.map(row => row.name)} empty="Alle Vorschläge haben bereits Leads." />
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <h2 className="font-semibold text-slate-900">Regionen</h2>
          <p className="text-xs text-slate-500">Welche Orte liefern bereits Leads und wo ist die Annahmequote am besten?</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-3 font-semibold">Ort/Region</th>
                <th className="px-4 py-3 font-semibold">Leads</th>
                <th className="px-4 py-3 font-semibold">Angenommen</th>
                <th className="px-4 py-3 font-semibold">Abgelehnt</th>
                <th className="px-4 py-3 font-semibold">Annahmequote</th>
                <th className="px-4 py-3 font-semibold">Top-Branche</th>
              </tr>
            </thead>
            <tbody>
              {regionRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Noch keine regionalen Lead-Daten vorhanden.</td></tr>
              ) : regionRows.map(row => (
                <tr key={row.location} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.location}</td>
                  <td className="px-4 py-3">{row.total}</td>
                  <td className="px-4 py-3 text-emerald-700">{row.accepted}</td>
                  <td className="px-4 py-3 text-red-600">{row.rejected}</td>
                  <td className="px-4 py-3">{row.accepted + row.rejected > 0 ? `${row.acceptanceRate}%` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.topIndustry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = 'slate' }: { icon: React.ElementType; label: string; value: string | number; tone?: 'slate' | 'green' | 'red' | 'indigo' }) {
  const toneClass = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  }[tone];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon size={17} />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function InsightList({ title, icon: Icon, rows, empty }: { title: string; icon: React.ElementType; rows: string[]; empty: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-indigo-600" />
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(row => <li key={row} className="text-sm leading-5 text-slate-600">{row}</li>)}
        </ul>
      )}
    </section>
  );
}
