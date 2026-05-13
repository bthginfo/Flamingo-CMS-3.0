'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { changePassword } from '../security-actions';

export function SecurityForm() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirm) {
      toast.error('Die Passwörter stimmen nicht überein');
      return;
    }
    if (newPw.length < 8) {
      toast.error('Mindestens 8 Zeichen erforderlich');
      return;
    }
    setSaving(true);
    try {
      const result = await changePassword(current, newPw);
      if (result.success) {
        toast.success('Passwort geändert');
        setCurrent('');
        setNewPw('');
        setConfirm('');
      } else {
        toast.error(result.error || 'Fehler');
      }
    } catch {
      toast.error('Fehler beim Ändern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5 max-w-lg">
      <h2 className="font-semibold text-lg">Passwort ändern</h2>
      <div>
        <label className="admin-label">Aktuelles Passwort</label>
        <input className="admin-input" type="password" value={current} onChange={e => setCurrent(e.target.value)} required />
      </div>
      <div>
        <label className="admin-label">Neues Passwort</label>
        <input className="admin-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8} />
      </div>
      <div>
        <label className="admin-label">Neues Passwort bestätigen</label>
        <input className="admin-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Ändern…' : 'Passwort ändern'}
        </button>
      </div>
    </form>
  );
}
