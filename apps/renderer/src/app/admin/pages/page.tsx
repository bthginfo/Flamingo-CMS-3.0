import { getPagesAction, createPageAction, deletePageAction, ensureDefaultPages } from './actions';
import { PagesList } from './pages-list';

export default async function PagesPage() {
  await ensureDefaultPages();
  const pagesList = await getPagesAction();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Seiten</h1>
        <form action={createPageAction} className="flex gap-2 w-full sm:w-auto">
          <input name="title" placeholder="Neue Seite…" required className="admin-input flex-1 sm:w-56" />
          <button type="submit" className="admin-btn-primary whitespace-nowrap">+ Erstellen</button>
        </form>
      </div>
      <PagesList pages={pagesList} deleteAction={deletePageAction} />
    </div>
  );
}
