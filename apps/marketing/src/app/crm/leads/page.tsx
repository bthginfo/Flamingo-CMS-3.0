'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

type LeadStatus = 'offen' | 'kontaktiert' | 'angenommen' | 'abgelehnt';
type Responsible = 'Julius' | 'Mario';

interface Lead {
  id: string;
  company: string;
  email: string;
  status: LeadStatus;
  websiteOld: string;
  flamingoLink: string;
  contact: string;
  responsible: Responsible;
  createdAt: string;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  offen: 'bg-yellow-100 text-yellow-800',
  kontaktiert: 'bg-blue-100 text-blue-800',
  angenommen: 'bg-green-100 text-green-800',
  abgelehnt: 'bg-red-100 text-red-800',
};

const STORAGE_KEY = 'flamingo-crm-leads';

function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { setLeads(loadLeads()); }, []);
  useEffect(() => { if (leads.length > 0 || localStorage.getItem(STORAGE_KEY)) saveLeads(leads); }, [leads]);

  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    company: '', email: '', status: 'offen', websiteOld: '', flamingoLink: '', contact: '', responsible: 'Julius',
  });

  function openNew() {
    setForm({ company: '', email: '', status: 'offen', websiteOld: '', flamingoLink: '', contact: '', responsible: 'Julius' });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(lead: Lead) {
    setForm({ company: lead.company, email: lead.email, status: lead.status, websiteOld: lead.websiteOld, flamingoLink: lead.flamingoLink, contact: lead.contact, responsible: lead.responsible });
    setEditId(lead.id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.company.trim()) return;
    if (editId) {
      setLeads(leads.map(l => l.id === editId ? { ...l, ...form } : l));
    } else {
      setLeads([{ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...leads]);
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Lead wirklich löschen?')) return;
    setLeads(leads.filter(l => l.id !== id));
  }

  function updateStatus(id: string, status: LeadStatus) {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Neuer Lead
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">{editId ? 'Lead bearbeiten' : 'Neuer Lead'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-500">Firma *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">E-Mail</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Ansprechpartner</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Webseite (alt)</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.websiteOld} onChange={e => setForm({ ...form, websiteOld: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Flamingo Link</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.flamingoLink} onChange={e => setForm({ ...form, flamingoLink: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Status</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as LeadStatus })}>
                  <option value="offen">Offen</option>
                  <option value="kontaktiert">Kontaktiert</option>
                  <option value="angenommen">Angenommen</option>
                  <option value="abgelehnt">Abgelehnt</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Verantwortlich</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value as Responsible })}>
                  <option value="Julius">Julius</option>
                  <option value="Mario">Mario</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Abbrechen</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-3 font-medium text-slate-500">Firma</th>
              <th className="px-4 py-3 font-medium text-slate-500">E-Mail</th>
              <th className="px-4 py-3 font-medium text-slate-500">Status</th>
              <th className="px-4 py-3 font-medium text-slate-500">Ansprechpartner</th>
              <th className="px-4 py-3 font-medium text-slate-500">Verantwortlich</th>
              <th className="px-4 py-3 font-medium text-slate-500">Links</th>
              <th className="px-4 py-3 font-medium text-slate-500 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">Noch keine Leads. Klicke &quot;Neuer Lead&quot; um einen anzulegen.</td></tr>
            )}
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer" onClick={() => openEdit(lead)}>
                <td className="px-4 py-3 font-medium text-slate-900">{lead.company}</td>
                <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => { e.stopPropagation(); updateStatus(lead.id, e.target.value as LeadStatus); }}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[lead.status]}`}
                  >
                    <option value="offen">Offen</option>
                    <option value="kontaktiert">Kontaktiert</option>
                    <option value="angenommen">Angenommen</option>
                    <option value="abgelehnt">Abgelehnt</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-600">{lead.contact}</td>
                <td className="px-4 py-3 text-slate-600">{lead.responsible}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {lead.websiteOld && <a href={lead.websiteOld.startsWith('http') ? lead.websiteOld : `https://${lead.websiteOld}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700"><ExternalLink size={14} /></a>}
                    {lead.flamingoLink && <a href={lead.flamingoLink.startsWith('http') ? lead.flamingoLink : `https://${lead.flamingoLink}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-700"><ExternalLink size={14} /></a>}
                  </div>
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleDelete(lead.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
