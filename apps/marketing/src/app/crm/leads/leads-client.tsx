'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, ExternalLink, Mail } from 'lucide-react';
import { createLead, updateLead, deleteLead, type Lead } from './actions';
import { toast } from 'sonner';

type LeadStatus = 'offen' | 'kontaktiert' | 'angenommen' | 'abgelehnt';

const STATUS_COLORS: Record<LeadStatus, string> = {
  offen: 'bg-yellow-100 text-yellow-800',
  kontaktiert: 'bg-blue-100 text-blue-800',
  angenommen: 'bg-green-100 text-green-800',
  abgelehnt: 'bg-red-100 text-red-800',
};

export function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    company: '', email: '', status: 'offen' as LeadStatus, location: '', websiteOld: '', flamingoLink: '', contact: '', responsible: 'Julius',
  });

  function openNew() {
    setForm({ company: '', email: '', status: 'offen', location: '', websiteOld: '', flamingoLink: '', contact: '', responsible: 'Julius' });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(lead: Lead) {
    setForm({
      company: lead.company,
      email: lead.email || '',
      status: lead.status,
      location: lead.location || '',
      websiteOld: lead.websiteOld || '',
      flamingoLink: lead.flamingoLink || '',
      contact: lead.contact || '',
      responsible: lead.responsible || 'Julius',
    });
    setEditId(lead.id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.company.trim()) return;
    startTransition(async () => {
      if (editId) {
        const updated = await updateLead(editId, form);
        setLeads(leads.map(l => l.id === editId ? updated : l));
      } else {
        const created = await createLead(form);
        setLeads([created, ...leads]);
      }
      setShowForm(false);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Lead wirklich löschen?')) return;
    startTransition(async () => {
      await deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
    });
  }

  function handleStatusChange(id: string, status: LeadStatus) {
    startTransition(async () => {
      const updated = await updateLead(id, { status });
      setLeads(leads.map(l => l.id === id ? updated : l));
    });
  }

  // Email modal state
  const [emailModal, setEmailModal] = useState<{ to: string; subject: string; body: string; leadId: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  function openEmailModal(lead: Lead) {
    const firstName = lead.contact?.split(' ')[0] || 'Team';
    const company = lead.company || '';
    const defaultBody = `Hallo ${firstName},

wir sind Mario und Julius von Flamingo Media und helfen lokalen Betrieben dabei, schnell und unkompliziert zu einem professionellen Webauftritt zu kommen:
https://www.flamingomedia.online

Wir sind auf ${company} gestoßen und hatten den Eindruck, dass bei eurem aktuellen Online-Auftritt noch einiges an Potenzial liegt. Gerade für Betriebe wie euren ist die Website oft der erste Kontaktpunkt für neue Kund:innen. Wenn Design, Inhalte, Bilder oder mobile Darstellung nicht sofort überzeugen, gehen leider schnell Anfragen verloren.

Genau dafür haben wir Flamingo Media gebaut: professionelle Website-Templates für lokale Businesses, die deutlich schneller und günstiger umgesetzt werden können als klassische Agenturprojekte, aber trotzdem hochwertig aussehen und individuell angepasst werden.

Kurz gesagt, ihr profitiert von:

• schnellem Start mit passenden Branchen-Templates
• professionellem Design, angepasst an euren Betrieb
• einfachem CMS, damit ihr Inhalte selbst ändern könnt
• optional Foto & Video, falls ihr bessere Bilder für euren Auftritt braucht
• Hosting & Pflege, damit ihr euch nicht um Technik kümmern müsst
• auf Wunsch auch einem integrierten Onlineshop, direkt in eure Website eingebaut
• Beratung zu Fördermöglichkeiten, z. B. in Tirol oder Bayern

Wir bieten grob drei Richtungen an: eine schnelle Template-Website, ein individuelles Custom Design oder Website plus Foto-/Video-Produktion. Mehr Infos und Beispiele findet ihr direkt auf unserer Website:
https://www.flamingomedia.online

Gerne schicken wir euch auch unser kurzes Pitchdeck mit ein paar Beispielen und dem Ablauf.

Hättet ihr grundsätzlich Interesse an einem kurzen, unverbindlichen Austausch?

Viele Grüße
Mario & Julius`;

    setEmailModal({
      to: lead.email || '',
      subject: `Professioneller Webauftritt für ${company}`,
      body: defaultBody,
      leadId: lead.id,
    });
  }

  async function handleSendEmail() {
    if (!emailModal) return;
    if (!emailModal.to.trim()) { toast.error('Empfänger E-Mail fehlt'); return; }
    setSendingEmail(true);
    try {
      const res = await fetch('/api/send-lead-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailModal.to, subject: emailModal.subject, body: emailModal.body }),
      });
      if (!res.ok) throw new Error('Send failed');
      toast.success('E-Mail gesendet!');
      // Auto-update status to "kontaktiert"
      const lead = leads.find(l => l.id === emailModal.leadId);
      if (lead && lead.status === 'offen') {
        handleStatusChange(lead.id, 'kontaktiert');
      }
      setEmailModal(null);
    } catch {
      toast.error('E-Mail konnte nicht gesendet werden');
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leads</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> <span className="hidden sm:inline">Neuer Lead</span><span className="sm:hidden">Neu</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">{editId ? 'Lead bearbeiten' : 'Neuer Lead'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-500">Firma *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">E-Mail</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Ort</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
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
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })}>
                  <option value="Julius">Julius</option>
                  <option value="Mario">Mario</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Abbrechen</button>
              <button onClick={handleSave} disabled={isPending} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                {isPending ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table (desktop) / Cards (mobile) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setEmailModal(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl p-5 sm:p-6 space-y-4 max-h-[95vh] sm:max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold flex items-center gap-2"><Mail size={18} className="text-indigo-500" /> E-Mail an Lead</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Empfänger</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={emailModal.to} onChange={e => setEmailModal({ ...emailModal, to: e.target.value })} placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Betreff</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={emailModal.subject} onChange={e => setEmailModal({ ...emailModal, subject: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Nachricht</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm mt-1 min-h-[300px] resize-y" value={emailModal.body} onChange={e => setEmailModal({ ...emailModal, body: e.target.value })} />
              </div>
            </div>
            <p className="text-xs text-slate-400">Signatur (Mario & Julius, Flamingo Media) wird automatisch eingefügt.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEmailModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Abbrechen</button>
              <button onClick={handleSendEmail} disabled={sendingEmail} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 flex items-center gap-2">
                <Mail size={14} /> {sendingEmail ? 'Sende...' : 'Senden'}
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Desktop table */}
        <table className="hidden sm:table w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-3 font-medium text-slate-500">Firma</th>
              <th className="px-4 py-3 font-medium text-slate-500">Ort</th>
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
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">Noch keine Leads. Klicke &quot;Neuer Lead&quot; um einen anzulegen.</td></tr>
            )}
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer" onClick={() => openEdit(lead)}>
                <td className="px-4 py-3 font-medium text-slate-900">{lead.company}</td>
                <td className="px-4 py-3 text-slate-500">{lead.location}</td>
                <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => { e.stopPropagation(); handleStatusChange(lead.id, e.target.value as LeadStatus); }}
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
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEmailModal(lead)} className="text-indigo-400 hover:text-indigo-700" title="E-Mail senden"><Mail size={14} /></button>
                    <button onClick={() => handleDelete(lead.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-slate-100">
          {leads.length === 0 && (
            <div className="p-10 text-center text-slate-400">Noch keine Leads.</div>
          )}
          {leads.map(lead => (
            <div key={lead.id} className="p-4 space-y-2" onClick={() => openEdit(lead)}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{lead.company}</span>
                <select
                  value={lead.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => { e.stopPropagation(); handleStatusChange(lead.id, e.target.value as LeadStatus); }}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 ${STATUS_COLORS[lead.status]}`}
                >
                  <option value="offen">Offen</option>
                  <option value="kontaktiert">Kontaktiert</option>
                  <option value="angenommen">Angenommen</option>
                  <option value="abgelehnt">Abgelehnt</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {lead.location && <span>{lead.location}</span>}
                {lead.email && <span>{lead.email}</span>}
                {lead.contact && <span>{lead.contact}</span>}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">{lead.responsible}</span>
                <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEmailModal(lead)} className="text-indigo-400 hover:text-indigo-700"><Mail size={14} /></button>
                  {lead.websiteOld && <a href={lead.websiteOld.startsWith('http') ? lead.websiteOld : `https://${lead.websiteOld}`} target="_blank" rel="noopener noreferrer" className="text-slate-400"><ExternalLink size={14} /></a>}
                  {lead.flamingoLink && <a href={lead.flamingoLink.startsWith('http') ? lead.flamingoLink : `https://${lead.flamingoLink}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400"><ExternalLink size={14} /></a>}
                  <button onClick={() => handleDelete(lead.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
