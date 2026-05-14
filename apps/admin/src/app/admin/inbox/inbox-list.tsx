'use client';

import { useState } from 'react';
import { updateSubmissionStatus } from './actions';
import { Mail, Archive, Eye } from 'lucide-react';

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  page: string | null;
  status: 'new' | 'read' | 'archived';
  createdAt: Date;
};

export function InboxList({ submissions }: { submissions: Submission[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = submissions.find(s => s.id === selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
        {submissions.map(s => (
          <button
            key={s.id}
            onClick={async () => {
              setSelected(s.id);
              if (s.status === 'new') await updateSubmissionStatus(s.id, 'read');
            }}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected === s.id ? 'border-brand-primary bg-brand-primary/5' : 'border-zinc-200 hover:border-zinc-300'
            } ${s.status === 'new' ? 'font-semibold' : ''}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm truncate">{s.name}</span>
              {s.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
            </div>
            <div className="text-xs text-zinc-400 truncate mt-0.5">{s.email}</div>
            <div className="text-xs text-zinc-400 mt-1">{new Date(s.createdAt).toLocaleDateString('de-DE')}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="lg:col-span-2">
        {active ? (
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{active.name}</h2>
              <button
                onClick={() => updateSubmissionStatus(active.id, 'archived')}
                className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
              >
                <Archive size={14} /> Archivieren
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-zinc-400">E-Mail:</span> {active.email}</div>
              <div><span className="text-zinc-400">Telefon:</span> {active.phone || '–'}</div>
              {active.page && <div className="col-span-2"><span className="text-zinc-400">Seite:</span> {active.page}</div>}
            </div>
            <div className="bg-zinc-50 rounded-xl p-4 text-sm whitespace-pre-wrap">{active.message}</div>
            <div className="text-xs text-zinc-400">Eingegangen am {new Date(active.createdAt).toLocaleString('de-DE')}</div>
          </div>
        ) : (
          <div className="admin-card p-10 text-center text-zinc-400 flex flex-col items-center gap-2">
            <Mail size={32} />
            <span>Nachricht auswählen</span>
          </div>
        )}
      </div>
    </div>
  );
}
