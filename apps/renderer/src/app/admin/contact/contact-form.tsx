'use client';

import { useState, useEffect, useRef } from 'react';
import { saveContactSettings, saveOpeningHours } from '../settings-actions';
import { toast } from 'sonner';
import { useSaveState, useRegisterSave } from '@/components/save-context';
import { Plus, Trash2 } from 'lucide-react';

type ContactData = { phone?: string; email?: string; address?: string };
type HoursRow = { day: string; hours: string };

export function ContactForm({ initialContact, initialHours }: { initialContact: ContactData; initialHours: HoursRow[] }) {
  const [contact, setContact] = useState({
    phone: initialContact.phone || '',
    email: initialContact.email || '',
    address: initialContact.address || '',
  });
  const [hours, setHours] = useState<HoursRow[]>(initialHours.length > 0 ? initialHours : [{ day: '', hours: '' }]);
  const [saving, setSaving] = useState(false);
  const { markDirty, markSaved } = useSaveState();
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current) markDirty(); else mounted.current = true; }, [contact, hours]);

  const doSave = async () => {
    setSaving(true);
    try {
      await saveContactSettings(contact);
      toast.success('Kontaktdaten gespeichert');
      markSaved();
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };
  useRegisterSave(doSave);

  const handleSaveContact = (e: React.FormEvent) => { e.preventDefault(); doSave(); };

  const handleSaveHours = async () => {
    setSaving(true);
    try {
      await saveOpeningHours(hours.filter(h => h.day.trim()));
      toast.success('Öffnungszeiten gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSaveContact} className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Kontaktdaten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Telefon</label>
            <input className="admin-input" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="z.B. 0221 / 98 76 54 0" />
          </div>
          <div>
            <label className="admin-label">E-Mail</label>
            <input className="admin-input" type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="info@example.de" />
          </div>
        </div>
        <div>
          <label className="admin-label">Adresse</label>
          <input className="admin-input" value={contact.address} onChange={e => setContact(c => ({ ...c, address: e.target.value }))} placeholder="Musterstraße 1, 50667 Köln" />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? 'Speichern…' : 'Kontaktdaten speichern'}
          </button>
        </div>
      </form>

      <div className="admin-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Öffnungszeiten</h2>
        <div className="space-y-3">
          {hours.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <input className="admin-input w-40" value={row.day} onChange={e => { const u = [...hours]; u[i] = { ...u[i], day: e.target.value }; setHours(u); }} placeholder="Mo–Fr" />
              <input className="admin-input flex-1" value={row.hours} onChange={e => { const u = [...hours]; u[i] = { ...u[i], hours: e.target.value }; setHours(u); }} placeholder="08:00 – 17:00 Uhr" />
              <button type="button" onClick={() => setHours(hours.filter((_, j) => j !== i))} className="admin-btn-ghost text-red-500 p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setHours([...hours, { day: '', hours: '' }])} className="admin-btn-secondary">
          <Plus size={16} /> Zeile hinzufügen
        </button>
        <div className="flex justify-end pt-2">
          <button type="button" onClick={handleSaveHours} disabled={saving} className="admin-btn-primary">
            {saving ? 'Speichern…' : 'Öffnungszeiten speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
