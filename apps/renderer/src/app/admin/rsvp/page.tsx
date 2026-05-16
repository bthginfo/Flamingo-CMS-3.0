import { getRsvpResponses } from './actions';
import { RsvpList } from './rsvp-list';

export default async function RsvpPage() {
  const responses = await getRsvpResponses();
  const attending = responses.filter(r => r.attending);
  const declined = responses.filter(r => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + (r.guestCount || 1), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">RSVP – Gäste-Rückmeldungen</h1>
      <p className="text-zinc-500 text-sm mb-6">Übersicht aller eingegangenen Zu- und Absagen.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{attending.length}</p>
          <p className="text-xs text-zinc-500">Zusagen</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-rose-500">{declined.length}</p>
          <p className="text-xs text-zinc-500">Absagen</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold">{totalGuests}</p>
          <p className="text-xs text-zinc-500">Gäste gesamt</p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="admin-card p-10 text-center text-zinc-400">Noch keine Rückmeldungen eingegangen.</div>
      ) : (
        <RsvpList responses={responses} />
      )}
    </div>
  );
}
