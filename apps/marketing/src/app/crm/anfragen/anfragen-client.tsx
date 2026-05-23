'use client';

import { useState, useTransition } from 'react';
import { Trash2, Mail, Eye, Archive, Clock } from 'lucide-react';
import { updateInquiryStatus, deleteInquiry, type Inquiry } from './actions';
import { toast } from 'sonner';

type InquiryStatus = 'neu' | 'gelesen' | 'beantwortet' | 'archiviert';

const STATUS_COLORS: Record<InquiryStatus, string> = {
  neu: 'bg-yellow-100 text-yellow-800',
  gelesen: 'bg-blue-100 text-blue-800',
  beantwortet: 'bg-green-100 text-green-800',
  archiviert: 'bg-slate-100 text-slate-600',
};

const STATUS_LABELS: Record<InquiryStatus, string> = {
  neu: 'Neu',
  gelesen: 'Gelesen',
  beantwortet: 'Beantwortet',
  archiviert: 'Archiviert',
};

export function AnfragenClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | 'alle'>('alle');

  function handleStatusChange(id: string, status: InquiryStatus) {
    startTransition(async () => {
      const updated = await updateInquiryStatus(id, status);
      setInquiries(inquiries.map(i => i.id === id ? updated : i));
      toast.success(`Status → ${STATUS_LABELS[status]}`);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Anfrage wirklich löschen?')) return;
    startTransition(async () => {
      await deleteInquiry(id);
      setInquiries(inquiries.filter(i => i.id !== id));
      toast.success('Gelöscht');
    });
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
    // Auto-mark as read
    const inq = inquiries.find(i => i.id === id);
    if (inq && inq.status === 'neu') {
      handleStatusChange(id, 'gelesen');
    }
  }

  const filtered = filter === 'alle' ? inquiries : inquiries.filter(i => i.status === filter);
  const newCount = inquiries.filter(i => i.status === 'neu').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Anfragen {newCount > 0 && <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{newCount} neu</span>}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Kontaktformular-Eingänge von flamingomedia.online</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['alle', 'neu', 'gelesen', 'beantwortet', 'archiviert'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === s ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'alle' ? `Alle (${inquiries.length})` : `${STATUS_LABELS[s]} (${inquiries.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Mail size={48} className="mx-auto mb-4 opacity-50" />
          <p>Noch keine Anfragen</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id} className={`border rounded-xl transition-all ${inq.status === 'neu' ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-200 bg-white'}`}>
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50/50 rounded-xl"
                onClick={() => toggleExpand(inq.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 truncate">{inq.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[inq.status]}`}>
                      {STATUS_LABELS[inq.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>{inq.email}</span>
                    {inq.branche && <span>· {inq.branche}</span>}
                    {inq.paket && <span>· {inq.paket}</span>}
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(inq.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {expandedId === inq.id && (
                <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{inq.message}</p>
                  {inq.source && <p className="text-xs text-slate-400 mb-3">Quelle: {inq.source}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${inq.email}?subject=Re: Ihre Anfrage bei FlamingoMedia`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(inq.id, 'beantwortet'); }}
                    >
                      <Mail size={14} /> Antworten
                    </a>
                    <select
                      value={inq.status}
                      onChange={(e) => { e.stopPropagation(); handleStatusChange(inq.id, e.target.value as InquiryStatus); }}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="neu">Neu</option>
                      <option value="gelesen">Gelesen</option>
                      <option value="beantwortet">Beantwortet</option>
                      <option value="archiviert">Archiviert</option>
                    </select>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(inq.id); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} /> Löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
