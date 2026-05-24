import { getReservations } from './actions';
import { ReservationList } from './reservation-list';

export default async function ReservationsPage() {
  const reservations = await getReservations();
  const pending = reservations.filter(r => r.status === 'pending');
  const confirmed = reservations.filter(r => r.status === 'confirmed');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reservierungen</h1>
      <p className="text-zinc-500 text-sm mb-6">Eingegangene Tisch-Reservierungen Ihrer Gäste.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{pending.length}</p>
          <p className="text-xs text-zinc-500">Offen</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{confirmed.length}</p>
          <p className="text-xs text-zinc-500">Bestätigt</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold">{reservations.length}</p>
          <p className="text-xs text-zinc-500">Gesamt</p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="admin-card p-10 text-center text-zinc-400">Noch keine Reservierungen eingegangen.</div>
      ) : (
        <ReservationList reservations={reservations} />
      )}
    </div>
  );
}
