'use client';

import { useState } from 'react';
import { updateReservationStatus } from './actions';

interface Reservation {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  date: string;
  time: string | null;
  guests: number | null;
  message: string | null;
  status: string;
  createdAt: Date | null;
}

export function ReservationList({ reservations: initial }: { reservations: Reservation[] }) {
  const [items, setItems] = useState(initial);

  async function handleStatus(id: string, status: string) {
    await updateReservationStatus(id, status);
    setItems(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="admin-card p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium truncate">{r.name}</p>
            <p className="text-sm text-zinc-500">
              {r.date}{r.time ? ` um ${r.time}` : ''} · {r.guests ?? 1} {(r.guests ?? 1) === 1 ? 'Gast' : 'Gäste'}
            </p>
            {r.email && <p className="text-xs text-zinc-400">{r.email}</p>}
            {r.message && <p className="text-xs text-zinc-400 mt-1 italic">{r.message}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            {r.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatus(r.id, 'confirmed')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Bestätigen
                </button>
                <button
                  onClick={() => handleStatus(r.id, 'cancelled')}
                  className="px-3 py-1 text-xs bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300"
                >
                  Absagen
                </button>
              </>
            )}
            {r.status === 'confirmed' && (
              <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded">Bestätigt</span>
            )}
            {r.status === 'cancelled' && (
              <span className="px-3 py-1 text-xs bg-zinc-100 text-zinc-500 rounded">Abgesagt</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
