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

export function LeadsClient({ initialLeads, leadTenants }: { initialLeads: Lead[]; leadTenants: { id: string; name: string; slug: string }[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    company: '', email: '', status: 'offen' as LeadStatus, location: '', websiteOld: '', flamingoLink: '', contact: '', contactFirstName: '', contactLastName: '', anrede: '', responsible: 'Julius', tenantId: '', adminPassword: '',
  });

  function openNew() {
    setForm({ company: '', email: '', status: 'offen', location: '', websiteOld: '', flamingoLink: '', contact: '', contactFirstName: '', contactLastName: '', anrede: '', responsible: 'Julius', tenantId: '', adminPassword: '' });
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
      contactFirstName: lead.contactFirstName || '',
      contactLastName: lead.contactLastName || '',
      anrede: lead.anrede || '',
      responsible: lead.responsible || 'Julius',
      tenantId: lead.tenantId || '',
      adminPassword: lead.adminPassword || '',
    });
    setEditId(lead.id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.company.trim()) return;
    startTransition(async () => {
      const payload = { ...form, tenantId: form.tenantId || null };
      if (editId) {
        const updated = await updateLead(editId, payload);
        setLeads(leads.map(l => l.id === editId ? updated : l));
      } else {
        const created = await createLead(payload);
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
  const [emailVariant, setEmailVariant] = useState<'hat-website' | 'keine-website' | 'demo-seite'>('hat-website');
  const [emailTone, setEmailTone] = useState<'locker' | 'förmlich'>('locker');

  function getEmailBody(lead: Lead, variant: 'hat-website' | 'keine-website' | 'demo-seite', tone: 'locker' | 'förmlich') {
    const firstName = lead.contactFirstName || lead.contact?.split(' ')[0] || '';
    const lastName = lead.contactLastName || lead.contact?.split(' ').slice(1).join(' ') || '';
    const company = lead.company || '';
    const du = tone === 'locker';
    const anrede = lead.anrede || '';
    let greeting: string;
    if (du) {
      greeting = firstName ? `Hallo ${firstName}` : 'Hallo zusammen';
    } else {
      if (lastName && anrede) {
        greeting = `Sehr geehrte${anrede === 'Frau' ? '' : 'r'} ${anrede} ${lastName}`;
      } else if (lastName) {
        greeting = `Sehr geehrte/r Herr/Frau ${lastName}`;
      } else {
        greeting = 'Sehr geehrte Damen und Herren';
      }
    }

    if (variant === 'hat-website' && du) {
      return `${greeting},

wir sind Mario & Julius von Flamingo Media — wir bauen Websites für lokale Betriebe, die nicht nur gut aussehen, sondern die man auch komplett selbst steuern kann, ohne Technik-Kenntnisse.

Wir haben uns den Online-Auftritt von ${company} angeschaut und sehen da noch einiges an Potenzial. Gerade auf dem Handy und bei Google-Sichtbarkeit geht aktuell einiges verloren — und genau das sind die Stellen, wo neue Kund:innen abspringen.

Was wir anders machen als klassische Agenturen:

→ Eure Website steht in 7–10 Tagen — ab 1.450 €
→ Komplett individuell anpassbar — jede Farbe, jeder Text, jedes Bild, jedes Layout
→ Alles per Drag & Drop — kein Code, keine Technik nötig
→ Direkt vom Handy bearbeiten — Inhalte ändern von unterwegs
→ Jede Seite ist individuell gestaltbar — ihr seid nicht an starre Templates gebunden
→ Integrierter Onlineshop möglich — Produkte direkt über die Website verkaufen
→ Google-optimiert ab Tag 1 — damit neue Kund:innen euch finden
→ Hosting, Pflege & Updates komplett inklusive

Am besten schaut ihr euch einfach mal unsere Live-Demos an — da seht ihr direkt, wie das Ganze aussieht und funktioniert:
https://www.flamingomedia.online

Falls euch gefällt was ihr seht, können wir gerne kurz quatschen, wie so ein Projekt für ${company} aussehen würde.

Viele Grüße
Mario & Julius
Flamingo Media`;
    }

    if (variant === 'hat-website' && !du) {
      return `${greeting},

wir sind Mario & Julius von Flamingo Media — wir erstellen Websites für lokale Unternehmen, die nicht nur professionell aussehen, sondern die Sie auch komplett eigenständig verwalten können, ohne technisches Vorwissen.

Wir haben uns den Online-Auftritt von ${company} angesehen und sehen dort noch Potenzial. Gerade bei der mobilen Darstellung und Google-Sichtbarkeit gehen aktuell Anfragen verloren — und das sind genau die Stellen, an denen neue Kund:innen abspringen.

Was uns von klassischen Agenturen unterscheidet:

→ Ihre Website steht in 7–10 Tagen — ab 1.450 €
→ Komplett individuell anpassbar — jede Farbe, jeder Text, jedes Bild, jedes Layout
→ Alles per Drag & Drop — kein Code, keine Technik nötig
→ Direkt vom Handy bearbeiten — Inhalte ändern von überall
→ Jede Seite ist individuell gestaltbar — keine starren Templates
→ Integrierter Onlineshop möglich — Produkte direkt über die Website verkaufen
→ Google-optimiert ab Tag 1 — damit neue Kund:innen Sie finden
→ Hosting, Pflege & Updates komplett inklusive

Am besten verschaffen Sie sich selbst einen Eindruck — auf unserer Website finden Sie Live-Demos und Beispiele aus verschiedenen Branchen:
https://www.flamingomedia.online

Falls Ihnen gefällt was Sie sehen, können wir gerne kurz besprechen, wie ein Projekt für ${company} aussehen würde.

Mit freundlichen Grüßen
Mario & Julius
Flamingo Media`;
    }

    if (variant === 'keine-website' && du) {
      return `${greeting},

wir sind Mario & Julius von Flamingo Media — wir helfen lokalen Betrieben dabei, schnell und unkompliziert eine professionelle Website zu bekommen, die sie komplett selbst verwalten können.

Wir sind auf ${company} aufmerksam geworden und haben gesehen, dass ihr aktuell noch keinen eigenen Webauftritt habt. Verständlich — Website-Projekte waren bisher teuer, langwierig und man war immer auf Agenturen angewiesen. Aber genau das haben wir geändert.

Was ihr bei uns bekommt:

→ Professionelle Website in 7–10 Tagen online — ab 1.450 €
→ Komplett individuell — jede Farbe, jeder Text, jedes Layout nach euren Wünschen
→ Alles per Drag & Drop anpassbar — kein Code, keine Technik nötig
→ Direkt vom Handy bearbeiten — Inhalte ändern wann und wo ihr wollt
→ Sofort bei Google sichtbar — mit euren Leistungen, Öffnungszeiten, Kontakt
→ Integrierter Onlineshop möglich — falls ihr Produkte verkaufen wollt
→ Hosting, Pflege & Updates komplett inklusive — null Technik-Aufwand

Am besten schaut ihr euch direkt unsere Live-Demos an — da seht ihr in 2 Minuten, wie das Ganze aussieht und wie einfach es funktioniert:
https://www.flamingomedia.online

Falls euch gefällt was ihr seht, können wir gerne kurz quatschen, wie so ein Projekt bei euch aussehen würde.

Viele Grüße
Mario & Julius
Flamingo Media`;
    }

    if (variant === 'demo-seite') {
      const linkedTenant = leadTenants.find(t => t.id === lead.tenantId);
      const siteUrl = linkedTenant ? `https://${linkedTenant.slug}.flamingo-cms.app` : '[LINK ZUR SEITE]';
      const adminUrl = linkedTenant ? `https://${linkedTenant.slug}.flamingo-cms.app/admin` : '[LINK ZUM ADMIN]';
      const pw = lead.adminPassword || 'flamingo2025';

      if (du) {
        return `${greeting},

wir haben mal was für euch vorbereitet: eine Beispiel-Website für ${company}, die zeigt, wie euer Auftritt mit Flamingo Media aussehen könnte.

Hier könnt ihr sie euch live anschauen:
${siteUrl}

Natürlich sind die Inhalte nur exemplarisch befüllt — nicht alles wird 100 % stimmen. Aber ihr seht direkt, wie das Ganze wirkt und was alles möglich ist.

Das Beste: Ihr könnt euch auch selbst im Admin-Bereich einloggen und alles ausprobieren — Texte ändern, Bilder tauschen, Farben anpassen, neue Abschnitte hinzufügen. Alles per Drag & Drop, kein Code nötig, funktioniert sogar vom Handy:

Admin: ${adminUrl}
Passwort: ${pw}

Einfach mal reinschauen und rumspielen. Falls euch gefällt was ihr seht, können wir gerne kurz quatschen, wie wir das Ganze mit euren echten Inhalten finalisieren.

Viele Grüße
Mario & Julius
Flamingo Media`;
      } else {
        return `${greeting},

wir haben etwas für Sie vorbereitet: eine Beispiel-Website für ${company}, die zeigt, wie Ihr Auftritt mit Flamingo Media aussehen könnte.

Hier können Sie sie sich live anschauen:
${siteUrl}

Die Inhalte sind exemplarisch befüllt — nicht alles wird 100 % korrekt sein. Aber Sie sehen direkt, wie das Ganze wirkt und was alles möglich ist.

Das Besondere: Sie können sich auch selbst im Admin-Bereich einloggen und alles ausprobieren — Texte ändern, Bilder tauschen, Farben anpassen, neue Abschnitte hinzufügen. Alles per Drag & Drop, ohne Code, funktioniert sogar vom Smartphone:

Admin: ${adminUrl}
Passwort: ${pw}

Schauen Sie gerne mal rein und probieren Sie es aus. Falls Ihnen gefällt was Sie sehen, können wir gerne kurz besprechen, wie wir das Ganze mit Ihren echten Inhalten finalisieren.

Mit freundlichen Grüßen
Mario & Julius
Flamingo Media`;
      }
    }

    // keine-website + förmlich
    return `${greeting},

wir sind Mario & Julius von Flamingo Media — wir helfen lokalen Unternehmen dabei, schnell und unkompliziert eine professionelle Website aufzubauen, die sie komplett eigenständig verwalten können.

Wir sind auf ${company} aufmerksam geworden und haben festgestellt, dass Sie aktuell noch über keinen eigenen Webauftritt verfügen. Verständlich — Website-Projekte waren bisher teuer, langwierig und man war auf Agenturen angewiesen. Genau das haben wir geändert.

Was Sie bei uns erhalten:

→ Professionelle Website in 7–10 Tagen online — ab 1.450 €
→ Komplett individuell — jede Farbe, jeder Text, jedes Layout nach Ihren Wünschen
→ Alles per Drag & Drop anpassbar — kein Code, keine Technik nötig
→ Direkt vom Handy bearbeiten — Inhalte ändern wann und wo Sie möchten
→ Sofort bei Google sichtbar — mit Ihren Leistungen, Öffnungszeiten, Kontakt
→ Integrierter Onlineshop möglich — falls Sie Produkte verkaufen möchten
→ Hosting, Pflege & Updates komplett inklusive — kein Technik-Aufwand

Am besten verschaffen Sie sich selbst einen Eindruck — auf unserer Website finden Sie Live-Demos und Beispiele aus verschiedenen Branchen:
https://www.flamingomedia.online

Falls Ihnen gefällt was Sie sehen, können wir gerne kurz besprechen, wie ein Projekt für ${company} aussehen würde.

Mit freundlichen Grüßen
Mario & Julius
Flamingo Media`;
  }

  function openEmailModal(lead: Lead) {
    const company = lead.company || '';
    const body = getEmailBody(lead, emailVariant, emailTone);
    setEmailModal({
      to: lead.email || '',
      subject: `Professioneller Webauftritt für ${company}`,
      body,
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
                <label className="text-xs font-medium text-slate-500">Vorname</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.contactFirstName} onChange={e => setForm({ ...form, contactFirstName: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Nachname</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.contactLastName} onChange={e => setForm({ ...form, contactLastName: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Anrede</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.anrede} onChange={e => setForm({ ...form, anrede: e.target.value })}>
                  <option value="">—</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Admin-Passwort (Lead)</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.adminPassword} onChange={e => setForm({ ...form, adminPassword: e.target.value })} placeholder="z.B. flamingo2025" />
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
              <div>
                <label className="text-xs font-medium text-slate-500">Verknüpfter Tenant (Lead)</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={form.tenantId} onChange={e => setForm({ ...form, tenantId: e.target.value })}>
                  <option value="">— Keiner —</option>
                  {leadTenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>)}
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
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Typ:</span>
                <button
                  type="button"
                  onClick={() => { setEmailVariant('hat-website'); const lead = leads.find(l => l.id === emailModal.leadId); if (lead) setEmailModal({ ...emailModal, body: getEmailBody(lead, 'hat-website', emailTone) }); }}
                  className={`px-2.5 py-1 rounded-full font-medium transition ${emailVariant === 'hat-website' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >Hat Website</button>
                <button
                  type="button"
                  onClick={() => { setEmailVariant('keine-website'); const lead = leads.find(l => l.id === emailModal.leadId); if (lead) setEmailModal({ ...emailModal, body: getEmailBody(lead, 'keine-website', emailTone) }); }}
                  className={`px-2.5 py-1 rounded-full font-medium transition ${emailVariant === 'keine-website' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >Keine Website</button>
                <button
                  type="button"
                  onClick={() => { setEmailVariant('demo-seite'); const lead = leads.find(l => l.id === emailModal.leadId); if (lead) setEmailModal({ ...emailModal, body: getEmailBody(lead, 'demo-seite', emailTone) }); }}
                  className={`px-2.5 py-1 rounded-full font-medium transition ${emailVariant === 'demo-seite' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >Demo-Seite</button>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Ton:</span>
                <button
                  type="button"
                  onClick={() => { setEmailTone('locker'); const lead = leads.find(l => l.id === emailModal.leadId); if (lead) setEmailModal({ ...emailModal, body: getEmailBody(lead, emailVariant, 'locker') }); }}
                  className={`px-2.5 py-1 rounded-full font-medium transition ${emailTone === 'locker' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >Locker (Du)</button>
                <button
                  type="button"
                  onClick={() => { setEmailTone('förmlich'); const lead = leads.find(l => l.id === emailModal.leadId); if (lead) setEmailModal({ ...emailModal, body: getEmailBody(lead, emailVariant, 'förmlich') }); }}
                  className={`px-2.5 py-1 rounded-full font-medium transition ${emailTone === 'förmlich' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >Förmlich (Sie)</button>
              </div>
            </div>
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
