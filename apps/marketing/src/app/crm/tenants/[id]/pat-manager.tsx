'use client';

import { useState } from 'react';
import { Key, RefreshCw, XCircle, Copy, Check } from 'lucide-react';
import { generatePatAction, revokePatAction } from './pat-actions';

type ActiveToken = { id: string; label: string; createdAt: Date; lastUsedAt: Date | null } | null;

export function PatManager({ tenantId, activeToken }: { tenantId: string; activeToken: ActiveToken }) {
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await generatePatAction(tenantId);
      setGeneratedToken(res.token);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke() {
    if (!confirm('Token wirklich widerrufen? Alle API-Zugriffe werden sofort unterbrochen.')) return;
    setLoading(true);
    try {
      await revokePatAction(tenantId);
      setGeneratedToken(null);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="crm-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <Key size={14} /> AI Content Token (PAT)
        </h3>
      </div>

      {generatedToken && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <p className="text-xs text-amber-700 font-medium">⚠ Token wird nur einmal angezeigt — jetzt kopieren!</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-white border rounded px-3 py-2 break-all select-all">{generatedToken}</code>
            <button onClick={handleCopy} className="shrink-0 p-2 rounded bg-amber-100 hover:bg-amber-200 transition-colors">
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-amber-700" />}
            </button>
          </div>
          <p className="text-xs text-amber-600">Verwende diesen Token als Bearer-Token in API-Requests.</p>
        </div>
      )}

      {activeToken && !generatedToken && (
        <div className="text-sm text-slate-600 space-y-1">
          <p>Aktiver Token: <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{activeToken.label}</span></p>
          <p className="text-xs text-slate-400">
            Erstellt: {new Date(activeToken.createdAt).toLocaleDateString('de-DE')}
            {activeToken.lastUsedAt && ` · Zuletzt genutzt: ${new Date(activeToken.lastUsedAt).toLocaleDateString('de-DE')}`}
          </p>
        </div>
      )}

      {!activeToken && !generatedToken && (
        <p className="text-sm text-slate-400">Kein aktiver API-Token vorhanden.</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="crm-btn-primary text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={12} /> {activeToken || generatedToken ? 'Neu generieren' : 'Token generieren'}
        </button>
        {(activeToken || generatedToken) && (
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="crm-btn-danger text-xs flex items-center gap-1.5"
          >
            <XCircle size={12} /> Widerrufen
          </button>
        )}
      </div>

      <details className="text-xs text-slate-500">
        <summary className="cursor-pointer hover:text-slate-700">Nutzung & Endpoints</summary>
        <div className="mt-2 space-y-1 font-mono bg-slate-50 rounded p-3">
          <p>GET /api/v1/instructions → Schema & Anleitung</p>
          <p>POST /api/v1/content/pages → Seite erstellen</p>
          <p>PUT /api/v1/content/brand → Marke setzen</p>
          <p>PUT /api/v1/content/navigation → Navigation</p>
          <p>PUT /api/v1/content/footer → Footer</p>
          <p>POST /api/v1/content/publish → Veröffentlichen</p>
          <p className="mt-2 text-slate-400">Header: Authorization: Bearer flm_pat_...</p>
        </div>
      </details>
    </div>
  );
}
