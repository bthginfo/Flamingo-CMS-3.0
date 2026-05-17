import { getApiToken } from './actions';
import { AiApiClient } from './ai-api-client';
import { headers } from 'next/headers';

export default async function AiApiPage() {
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
