'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Eye,
  FileText,
  Flag,
  LayoutTemplate,
  Palette,
  Rocket,
} from 'lucide-react';
import { usePreview } from '@/components/admin/preview-context';

type ChecklistStepId = 'company' | 'design' | 'content' | 'structure' | 'preview' | 'publish';

export type OnboardingChecklistState = Record<Exclude<ChecklistStepId, 'preview'>, boolean>;

type ChecklistStep = {
  id: ChecklistStepId;
  title: string;
  benefit: string;
  href?: string;
  cta: string;
  icon: typeof FileText;
};

const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'company',
    title: 'Unternehmensdaten bestätigen',
    benefit: 'Sorgt für korrekte Namen, Standorte und verlässliche Inhalte.',
    href: '/admin/business-profile',
    cta: 'Unternehmensprofil öffnen',
    icon: Flag,
  },
  {
    id: 'design',
    title: 'Marke und Design prüfen',
    benefit: 'Stellt sicher, dass Farben, Schriften und Kontraste zu deiner Marke passen.',
    href: '/admin/brand',
    cta: 'Design prüfen',
    icon: Palette,
  },
  {
    id: 'content',
    title: 'Seiten, Collections und Inhalte prüfen',
    benefit: 'Zeigt, ob alle wichtigen Themen vollständig und verständlich aufgebaut sind.',
    href: '/admin/pages',
    cta: 'Inhalte öffnen',
    icon: FileText,
  },
  {
    id: 'structure',
    title: 'Navigation, Footer und Rechtliches prüfen',
    benefit: 'Hilft Besuchern bei der Orientierung und hält Pflichtseiten erreichbar.',
    href: '/admin/navigation',
    cta: 'Navigation und Footer öffnen',
    icon: LayoutTemplate,
  },
  {
    id: 'preview',
    title: 'Desktop- und Mobile-Vorschau öffnen',
    benefit: 'Macht Abstände, Lesbarkeit und Bildausschnitte vor dem Launch sichtbar.',
    cta: 'Vorschau öffnen',
    icon: Eye,
  },
  {
    id: 'publish',
    title: 'Website veröffentlichen',
    benefit: 'Überträgt deinen gespeicherten Stand erst dann auf die öffentliche Website.',
    href: '/admin',
    cta: 'Zum Veröffentlichen',
    icon: Rocket,
  },
];

function checklistStorageKey(tenantId: string) {
  return `flamingo:onboarding:checklist:v2:${tenantId}`;
}

type StoredChecklistState = {
  previewCompleted?: boolean;
  deferred?: ChecklistStepId[];
  collapsed?: boolean;
};

export function OnboardingChecklist({
  tenantId,
  completed,
}: {
  tenantId: string;
  completed: OnboardingChecklistState;
}) {
  const preview = usePreview();
  const [stored, setStored] = useState<StoredChecklistState>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(checklistStorageKey(tenantId));
      if (value) setStored(JSON.parse(value) as StoredChecklistState);
    } catch {
      setStored({});
    } finally {
      setHydrated(true);
    }
  }, [tenantId]);

  const updateStored = (next: StoredChecklistState) => {
    setStored(next);
    localStorage.setItem(checklistStorageKey(tenantId), JSON.stringify(next));
  };

  const isCompleted = (id: ChecklistStepId) => id === 'preview'
    ? Boolean(stored.previewCompleted)
    : completed[id];
  const completedCount = useMemo(
    () => CHECKLIST_STEPS.filter(item => isCompleted(item.id)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completed, stored.previewCompleted],
  );
  const deferred = new Set(stored.deferred || []);
  const collapsed = stored.collapsed && completedCount < CHECKLIST_STEPS.length;

  const openPreview = () => {
    preview.open();
    updateStored({ ...stored, previewCompleted: true });
  };

  if (!hydrated) {
    return <div className="admin-card mb-8 h-24 animate-pulse bg-zinc-100" aria-label="Onboarding wird geladen" />;
  }

  return (
    <section className="admin-card mb-8 overflow-hidden" aria-labelledby="onboarding-checklist-title">
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-admin-accent">Startklar</span>
              <span className="text-xs font-semibold text-zinc-400">{completedCount} von {CHECKLIST_STEPS.length}</span>
            </div>
            <h2 id="onboarding-checklist-title" className="mt-1 text-lg font-semibold text-zinc-950">
              Deine Website in sechs Schritten prüfen
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Du kannst jeden Schritt später fortsetzen. Speichern und Veröffentlichen bleiben getrennt.
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateStored({ ...stored, collapsed: !collapsed })}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
            aria-expanded={!collapsed}
          >
            {collapsed ? 'Checkliste anzeigen' : 'Checkliste einklappen'}
            <ChevronDown size={15} className={`transition ${collapsed ? '' : 'rotate-180'}`} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-admin-accent transition-all"
            style={{ width: `${(completedCount / CHECKLIST_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {!collapsed && (
        <ol className="divide-y divide-zinc-100">
          {CHECKLIST_STEPS.map((item, index) => {
            const done = isCompleted(item.id);
            const isDeferred = !done && deferred.has(item.id);
            const Icon = item.icon;
            return (
              <li key={item.id} className="grid gap-4 px-5 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                <span className={`flex size-10 items-center justify-center rounded-xl ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                  {done ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
                  <span className="sr-only">{done ? 'Erledigt' : `Schritt ${index + 1}`}</span>
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-950">{item.title}</h3>
                    {isDeferred && <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">Später</span>}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{item.benefit}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {!done && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = deferred.has(item.id)
                          ? (stored.deferred || []).filter(id => id !== item.id)
                          : [...(stored.deferred || []), item.id];
                        updateStored({ ...stored, deferred: next });
                      }}
                      className="min-h-10 rounded-lg px-3 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
                    >
                      {isDeferred ? 'Wieder aufnehmen' : 'Später'}
                    </button>
                  )}
                  {item.id === 'preview' ? (
                    <button
                      type="button"
                      onClick={openPreview}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 transition hover:border-admin-accent/40 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
                    >
                      {item.cta} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 transition hover:border-admin-accent/40 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent"
                    >
                      {item.cta} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {completedCount === CHECKLIST_STEPS.length && (
        <div className="flex items-center gap-3 border-t border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-900 sm:px-6">
          <Circle className="fill-emerald-600 text-emerald-600" size={10} aria-hidden="true" />
          Deine Website-Grundlagen sind geprüft. Die Checkliste bleibt als Orientierung erhalten.
        </div>
      )}
    </section>
  );
}
