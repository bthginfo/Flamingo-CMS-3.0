'use client';

import { useState } from 'react';
import { createApiToken, revokeApiToken } from './actions';
import { toast } from 'sonner';
import { Key, Trash2, Copy, CheckCircle, Bot, ExternalLink } from 'lucide-react';
import { buildAiStarterPrompt } from '@/lib/ai-starter-prompt';

type Token = {
  id: string;
  label: string;
  createdAt: Date | string;
  expiresAt: Date | string | null;
  lastUsedAt: Date | string | null;
  revoked: boolean;
};

export function AiApiClient({ existingToken, apiBase }: { existingToken: Token | null; apiBase: string }) {
  const [token, setToken] = useState<Token | null>(existingToken);
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);
  const [lifetime, setLifetime] = useState<string>('7');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const days = lifetime === 'unlimited' ? null : parseInt(lifetime, 10);
      const result = await createApiToken(days);
      setNewTokenValue(result.token);
      setToken({ id: 'new', label: 'AI Content Token', createdAt: new Date().toISOString(), expiresAt: days ? new Date(Date.now() + days * 86400000).toISOString() : null, lastUsedAt: null, revoked: false });
      toast.success('API-Key erstellt');
    } catch {
      toast.error('Fehler beim Erstellen');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('API-Key wirklich löschen? Er kann danach nicht mehr verwendet werden.')) return;
    try {
      await revokeApiToken();
      setToken(null);
      setNewTokenValue(null);
      toast.success('API-Key gelöscht');
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
    toast.success('Kopiert!');
  };

  const instructionsUrl = `${apiBase}/instructions`;
  const starterPrompt = buildAiStarterPrompt(instructionsUrl);

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Bot size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">KI-gestützte Inhaltsbefüllung</h2>
            <p className="text-zinc-600 text-sm leading-relaxed mt-1">
              Du hast keine Lust, deine Website selbst mit Inhalten zu befüllen? Kein Problem!
              Gib den API-Link und den API-Key einer KI deiner Wahl (z.B. ChatGPT, Claude, oder einer anderen KI),
              und sie kann deine komplette Website automatisch mit passenden Texten, Bildern, Seiten und Sections befüllen.
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed mt-2">
              Die KI kann alles, was du auch im CMS manuell machen kannst: Seiten anlegen, Sections hinzufügen und befüllen,
              Navigation und Footer einrichten, Markenfarben setzen, SEO-Felder ausfüllen, Kontaktdaten hinterlegen und am Ende alles publizieren.
              Sie kann allerdings <strong>keinen eigenen HTML-Code</strong> einfügen — das ist aus Sicherheitsgründen gesperrt.
            </p>
          </div>
        </div>
      </div>

      {/* API Link */}
      <div className="admin-card p-6 space-y-3">
        <h3 className="font-semibold text-sm text-zinc-700">Dein API-Link (Instructions-Endpoint)</h3>
        <p className="text-xs text-zinc-400">Diesen Link gibst du der KI zusammen mit deinem API-Key. Die KI ruft ihn zuerst auf, um zu erfahren, welche Seiten und Sections sie anlegen kann.</p>
        <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-3 font-mono text-sm text-zinc-700 border">
          <span className="flex-1 truncate">{instructionsUrl}</span>
          <button onClick={() => copyToClipboard(instructionsUrl, 'url')} className="shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors p-1">
            {copiedUrl ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Token Management */}
      <div className="admin-card p-6 space-y-5">
        <h3 className="font-semibold text-sm text-zinc-700">API-Key</h3>

        {token ? (
          <div className="space-y-4">
            {newTokenValue && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-emerald-800">🔑 Dein neuer API-Key — kopiere ihn jetzt! Er wird nur einmal angezeigt.</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 font-mono text-sm text-zinc-800 border border-emerald-200">
                  <span className="flex-1 break-all">{newTokenValue}</span>
                  <button onClick={() => copyToClipboard(newTokenValue, 'key')} className="shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors p-1">
                    {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between bg-zinc-50 rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Key size={18} className="text-purple-500" />
                <div>
                  <p className="text-sm font-medium">{token.label}</p>
                  <p className="text-xs text-zinc-400">
                    Erstellt: {new Date(token.createdAt).toLocaleDateString('de-DE')}
                    {token.expiresAt && <> · Gültig bis: {new Date(token.expiresAt).toLocaleDateString('de-DE')}</>}
                    {token.lastUsedAt && <> · Zuletzt genutzt: {new Date(token.lastUsedAt).toLocaleDateString('de-DE')}</>}
                  </p>
                </div>
              </div>
              <button onClick={handleRevoke} className="text-red-400 hover:text-red-600 p-2 transition-colors" title="Key löschen">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">Kein aktiver API-Key vorhanden. Erstelle einen neuen, um einer KI Zugriff auf deine Website zu geben.</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-600">Gültigkeit:</label>
              <select className="admin-input w-auto text-sm" value={lifetime} onChange={e => setLifetime(e.target.value)}>
                <option value="1">1 Tag</option>
                <option value="2">2 Tage</option>
                <option value="7">7 Tage</option>
                <option value="30">30 Tage</option>
                <option value="unlimited">Unbegrenzt</option>
              </select>
            </div>
            <button onClick={handleCreate} disabled={creating} className="admin-btn-primary flex items-center gap-2">
              <Key size={16} />
              {creating ? 'Wird erstellt...' : 'Neuen API-Key erstellen'}
            </button>
          </div>
        )}
      </div>

      {/* Help Prompt */}
      <div className="admin-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-zinc-700">Hilfs-Prompt für die KI</h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(starterPrompt);
              setCopiedPrompt(true);
              setTimeout(() => setCopiedPrompt(false), 2000);
              toast.success('Prompt kopiert!');
            }}
            className="shrink-0 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 bg-white border rounded-lg px-3 py-1.5 transition-colors"
          >
            {copiedPrompt ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copiedPrompt ? 'Kopiert!' : 'Kopieren'}
          </button>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Kopiere diesen Prompt und gib ihn der KI zusammen mit deinem API-Link und Key.
          Ersetze alle <span className="font-semibold text-zinc-700">[PLATZHALTER]</span> durch deine eigenen Angaben.
          <strong className="block mt-1">Tipp:</strong> Je mehr Informationen du der KI gibst, desto besser wird das Ergebnis.
          Du kannst z.B. Links zu deiner bisherigen Website, Texte aus Flyern, Kundenbewertungen oder eine Beschreibung deiner Wunsch-Tonalität mitgeben.
        </p>
        <div className="bg-zinc-50 rounded-lg p-4 border text-sm text-zinc-700 whitespace-pre-wrap break-words leading-relaxed font-mono overflow-x-auto max-w-full">
{starterPrompt}
        </div>
      </div>
    </div>
  );
}
