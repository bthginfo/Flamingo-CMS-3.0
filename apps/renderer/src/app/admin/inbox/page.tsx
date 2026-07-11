import { getSubmissions } from './actions';
import { InboxList } from './inbox-list';

export default async function InboxPage() {
  const submissions = await getSubmissions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Posteingang</h1>
      <p className="text-zinc-500 text-sm mb-8">Eingegangene Kontaktanfragen Ihrer Website-Besucher.</p>
      {submissions.length === 0 ? (
        <div className="admin-card p-10 text-center text-zinc-400">Keine offenen Nachrichten. Archivierte Anfragen bleiben sicher gespeichert.</div>
      ) : (
        <InboxList submissions={submissions} />
      )}
    </div>
  );
}
