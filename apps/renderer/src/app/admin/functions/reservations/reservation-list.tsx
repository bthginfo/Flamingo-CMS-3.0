'use client';

import { useState } from 'react';
import { updateReservationStatus } from './actions';
import { toast } from 'sonner';

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
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await updateReservationStatus(id, status);
      setItems(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success(status === 'confirmed' ? 'Reservierung bestätigt' : 'Reservierung abgesagt');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status konnte nicht geändert werden');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="admin-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-medium truncate">{r.name}</p>
            <p className="text-sm text-zinc-500">
              {r.date}{r.time ? ` um ${r.time}` : ''} · {r.guests ?? 1} {(r.guests ?? 1) === 1 ? 'Gast' : 'Gäste'}
            </p>
            {r.email && <p className="text-xs text-zinc-400">{r.email}</p>}
            {r.message && <p className="text-xs text-zinc-400 mt-1 italic">{r.message}</p>}
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
            {r.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatus(r.id, 'confirmed')}
                  disabled={updating === r.id}
                  className="min-h-11 flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 sm:flex-none"
                >
                  Bestätigen
                </button>
                <button
                  onClick={() => handleStatus(r.id, 'cancelled')}
                  disabled={updating === r.id}
                  className="min-h-11 flex-1 rounded-lg bg-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 sm:flex-none"
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
