'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Instagram, RefreshCw, Unplug, CheckCircle2, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';

type ConnectionStatus =
  | { connected: false }
  | {
      connected: true;
      username: string;
      accountType: string;
      tokenExpiresAt: string;
      lastSyncedAt: string | null;
      syncStatus: string;
      syncError: string | null;
      postsCount: number;
    };

export function InstagramConnectPanel({
  sectionId,
  pageId,
}: { sectionId: string; pageId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [busy, setBusy] = useState<'sync' | 'disconnect' | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Surface any redirect-flash from the OAuth callback (igConnected=1 etc.)
  useEffect(() => {
    const connected = searchParams.get('igConnected');
    const igError = searchParams.get('igError');
    if (connected === '1') setMessage({ kind: 'ok', text: 'Instagram erfolgreich verbunden. Beiträge werden synchronisiert.' });
    else if (connected === '0' && igError) setMessage({ kind: 'err', text: `Verbindung fehlgeschlagen: ${igError}` });
  }, [searchParams]);

  const reload = () => {
    fetch('/api/auth/instagram/status', { cache: 'no-store' })
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: false }));
  };

  useEffect(() => { reload(); }, []);

  const startConnect = () => {
    const returnTo = `/admin/pages/${pageId}`;
    const params = new URLSearchParams({ sectionId, pageId, returnTo });
    window.location.href = `/api/auth/instagram/login?${params.toString()}`;
  };

  const sync = async () => {
    setBusy('sync');
    setMessage(null);
    try {
      const res = await fetch('/api/auth/instagram/sync', { method: 'POST' });
      const json = await res.json();
      if (json.ok) {
        setMessage({ kind: 'ok', text: `${json.count} Beiträge synchronisiert.` });
        reload();
        router.refresh();
      } else {
        setMessage({ kind: 'err', text: json.error || 'Sync fehlgeschlagen' });
      }
    } finally {
      setBusy(null);
    }
  };

  const disconnect = async () => {
    if (!confirm('Instagram-Verbindung wirklich trennen? Gespeicherte Beiträge werden gelöscht.')) return;
    setBusy('disconnect');
    setMessage(null);
    try {
      await fetch('/api/auth/instagram/disconnect', { method: 'POST' });
      setMessage({ kind: 'ok', text: 'Verbindung getrennt.' });
      reload();
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  if (status === null) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-500 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Status wird geladen…
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="rounded-xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-rose-50 to-amber-50 p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 p-3 text-white shadow-sm">
            <Instagram className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900">Instagram-Account verbinden</h3>
            <p className="mt-1 text-sm text-zinc-700">
              Verknüpfe deinen <strong>Instagram Business</strong>- oder <strong>Creator</strong>-Account, um deine
              neuesten Beiträge automatisch hier auf der Seite anzuzeigen. Die Verbindung läuft über die offizielle
              Instagram Graph API von Meta — wir speichern keine Login-Daten, sondern nur einen verschlüsselten
              Access-Token. Nach der Verbindung werden Beiträge stündlich automatisch aktualisiert.
            </p>
          </div>
        </div>

        <ul className="ml-1 grid gap-1.5 text-xs text-zinc-600">
          <li>• Voraussetzung: Instagram-Account ist auf <strong>Business</strong> oder <strong>Creator</strong> umgestellt</li>
          <li>• Du wirst zu Instagram weitergeleitet und akzeptierst dort den Zugriff</li>
          <li>• Token wird verschlüsselt gespeichert und alle 30 Tage automatisch verlängert — du musst dich nicht erneut anmelden</li>
          <li>• Verbindung kann jederzeit hier getrennt werden</li>
        </ul>

        <button
          type="button"
          onClick={startConnect}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Instagram className="h-4 w-4" /> Mit Instagram verbinden
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </button>

        {message && (
          <div
            className={`rounded-md px-3 py-2 text-sm ${
              message.kind === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    );
  }

  // Connected
  const tokenExpiresAt = new Date(status.tokenExpiresAt);
  const daysLeft = Math.max(0, Math.round((tokenExpiresAt.getTime() - Date.now()) / 86400000));
  const lastSynced = status.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString('de-DE') : 'noch nie';
  const hasError = status.syncStatus !== 'ok';

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Verbunden mit <span className="font-mono">@{status.username}</span>
            </h3>
            <p className="text-xs text-zinc-600">
              {status.accountType} · {status.postsCount} Beiträge gespeichert · Token gültig noch {daysLeft} Tage · letzter Sync: {lastSynced}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sync}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {busy === 'sync' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Jetzt synchronisieren
          </button>
          <button
            type="button"
            onClick={disconnect}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {busy === 'disconnect' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unplug className="h-3.5 w-3.5" />}
            Trennen
          </button>
        </div>
      </div>

      {hasError && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 flex-none mt-0.5" />
          <div>
            <strong>Letzter Sync-Fehler ({status.syncStatus}):</strong> {status.syncError || 'unbekannter Fehler'}.
            Versuche eine manuelle Synchronisierung oder verbinde den Account neu.
          </div>
        </div>
      )}

      {message && (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            message.kind === 'ok' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
