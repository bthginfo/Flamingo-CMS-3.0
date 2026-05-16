'use client';

type RsvpResponse = {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guestCount: number;
  guestNames: string | null;
  dietary: string | null;
  allergies: string | null;
  songWish: string | null;
  comment: string | null;
  createdAt: Date;
};

export function RsvpList({ responses }: { responses: RsvpResponse[] }) {
  return (
    <div className="admin-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-zinc-50 text-left text-xs text-zinc-500 uppercase">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Zusage</th>
            <th className="px-4 py-3">Personen</th>
            <th className="px-4 py-3">Begleitung</th>
            <th className="px-4 py-3">Ernährung</th>
            <th className="px-4 py-3">Musikwunsch</th>
            <th className="px-4 py-3">Datum</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(r => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-zinc-50">
              <td className="px-4 py-3">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-zinc-400">{r.email}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${r.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {r.attending ? 'Ja' : 'Nein'}
                </span>
              </td>
              <td className="px-4 py-3">{r.attending ? r.guestCount : '–'}</td>
              <td className="px-4 py-3 text-xs">{r.guestNames || '–'}</td>
              <td className="px-4 py-3 text-xs">
                {r.dietary || r.allergies ? (
                  <div>
                    {r.dietary && <span>{r.dietary}</span>}
                    {r.allergies && <span className="text-red-500 ml-1">⚠ {r.allergies}</span>}
                  </div>
                ) : '–'}
              </td>
              <td className="px-4 py-3 text-xs">{r.songWish || '–'}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString('de-DE') : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
