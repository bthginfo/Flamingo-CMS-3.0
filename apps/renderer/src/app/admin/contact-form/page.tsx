'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';

type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  halfWidth?: boolean;
};

type AutoResponse = {
  enabled: boolean;
  subject: string;
  body: string;
  notificationEmail?: string;
};

const DEFAULT_FIELDS: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', required: true, halfWidth: true },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'E-Mail Adresse', required: true, halfWidth: true },
  { name: 'phone', label: 'Telefon', type: 'tel', placeholder: 'Telefon (optional)', required: false },
  { name: 'message', label: 'Nachricht', type: 'textarea', placeholder: 'Wie können wir Ihnen helfen?', required: true },
];

export default function ContactFormSettingsPage() {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [autoResponse, setAutoResponse] = useState<AutoResponse>({ enabled: false, subject: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/admin/api/contact-form').then(r => r.json()).then(data => {
      if (data.formFields?.length) setFields(data.formFields);
      if (data.autoResponse) setAutoResponse(data.autoResponse);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/admin/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formFields: fields, autoResponse }),
      });
      if (res.ok) toast.success('Formular-Einstellungen gespeichert.');
      else toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  }

  function addField() {
    const name = `field_${Date.now()}`;
    setFields([...fields, { name, label: 'Neues Feld', type: 'text', placeholder: '', required: false }]);
  }

  function removeField(index: number) {
    setFields(fields.filter((_, i) => i !== index));
  }

  function updateField(index: number, updates: Partial<FormField>) {
    setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f));
  }

  function moveField(from: number, to: number) {
    if (to < 0 || to >= fields.length) return;
    const arr = [...fields];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setFields(arr);
  }

  if (!loaded) return <div className="animate-pulse h-64 bg-zinc-100 rounded-xl" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Kontaktformular</h1>
      <p className="text-zinc-500 text-sm mb-8">Felder und automatische Antwort für das Kontaktformular konfigurieren.</p>

      {/* Form Fields Editor */}
      <div className="admin-card p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Formularfelder</h2>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={`${field.name}-${i}`} className="flex items-start gap-3 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
              <div className="flex flex-col gap-1 pt-2">
                <button type="button" onClick={() => moveField(i, i - 1)} className="text-zinc-400 hover:text-zinc-700 text-xs">▲</button>
                <GripVertical size={14} className="text-zinc-300" />
                <button type="button" onClick={() => moveField(i, i + 1)} className="text-zinc-400 hover:text-zinc-700 text-xs">▼</button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="admin-label">Label</label>
                  <input className="admin-input" value={field.label} onChange={e => updateField(i, { label: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Feldname</label>
                  <input className="admin-input" value={field.name} onChange={e => updateField(i, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
                </div>
                <div>
                  <label className="admin-label">Typ</label>
                  <select className="admin-input" value={field.type} onChange={e => updateField(i, { type: e.target.value as FormField['type'] })}>
                    <option value="text">Text</option>
                    <option value="email">E-Mail</option>
                    <option value="tel">Telefon</option>
                    <option value="textarea">Textbereich</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Placeholder</label>
                  <input className="admin-input" value={field.placeholder || ''} onChange={e => updateField(i, { placeholder: e.target.value })} />
                </div>
                {field.type === 'select' && (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="admin-label">Optionen (kommagetrennt)</label>
                    <input className="admin-input" value={field.options?.join(', ') || ''} onChange={e => updateField(i, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Option 1, Option 2, Option 3" />
                  </div>
                )}
                <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={field.required || false} onChange={e => updateField(i, { required: e.target.checked })} className="rounded" />
                    Pflichtfeld
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={field.halfWidth || false} onChange={e => updateField(i, { halfWidth: e.target.checked })} className="rounded" />
                    Halbe Breite
                  </label>
                </div>
              </div>
              <button type="button" onClick={() => removeField(i)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addField} className="mt-4 flex items-center gap-2 text-sm text-brand-primary hover:underline">
          <Plus size={16} /> Feld hinzufügen
        </button>
      </div>

      {/* Notification Email */}
      <div className="admin-card p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Benachrichtigungs-E-Mail</h2>
        <p className="text-zinc-500 text-sm mb-4">An diese Adresse wird eine schön formatierte Benachrichtigung gesendet, wenn jemand das Kontaktformular ausfüllt.</p>
        <div>
          <label className="admin-label">E-Mail-Adresse für Benachrichtigungen</label>
          <input className="admin-input" type="email" value={autoResponse.notificationEmail || ''} onChange={e => setAutoResponse(a => ({ ...a, notificationEmail: e.target.value }))} placeholder="info@ihre-firma.de" />
          <p className="text-xs text-zinc-400 mt-1">Leer = Benachrichtigung geht an die SMTP-Absenderadresse</p>
        </div>
      </div>

      {/* Auto-Response Settings */}
      <div className="admin-card p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Automatische Antwort</h2>
        <p className="text-zinc-500 text-sm mb-4">Sende automatisch eine Bestätigungsmail an den Absender. Verwende {'{name}'} als Platzhalter für den Namen.</p>
        <label className="flex items-center gap-2 text-sm mb-4">
          <input type="checkbox" checked={autoResponse.enabled} onChange={e => setAutoResponse(a => ({ ...a, enabled: e.target.checked }))} className="rounded" />
          Automatische Antwort aktivieren
        </label>
        {autoResponse.enabled && (
          <div className="space-y-4">
            <div>
              <label className="admin-label">Betreff</label>
              <input className="admin-input" value={autoResponse.subject} onChange={e => setAutoResponse(a => ({ ...a, subject: e.target.value }))} placeholder="Danke für Ihre Anfrage" />
            </div>
            <div>
              <label className="admin-label">Nachricht</label>
              <textarea className="admin-input" rows={5} value={autoResponse.body} onChange={e => setAutoResponse(a => ({ ...a, body: e.target.value }))} placeholder="Hallo {name}, vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen." />
            </div>
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
        {saving ? 'Speichern…' : 'Einstellungen speichern'}
      </button>
    </div>
  );
}
