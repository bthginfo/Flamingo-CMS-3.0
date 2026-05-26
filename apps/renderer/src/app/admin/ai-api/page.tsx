import { getApiToken } from './actions';
import { AiApiClient } from './ai-api-client';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export default async function AiApiPage() {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get('flamingo_demo')?.value === '1';

  if (isDemo) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">KI-API</h1>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-900">In der Demo nicht verfügbar</p>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            Die KI-API erzeugt Zugriffstoken und kann Inhalte verändern. Deshalb ist sie im öffentlichen Demo-Admin bewusst deaktiviert.
          </p>
        </div>
      </div>
    );
  }

  const token = await getApiToken();
  const h = await headers();
  const host = h.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiBase = `${protocol}://${host}/api/v1`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">KI-API</h1>
      <p className="text-zinc-500 text-sm mb-8">Lass eine KI deine Website mit Inhalten befüllen</p>
      <AiApiClient existingToken={token} apiBase={apiBase} />
    </div>
  );
}
