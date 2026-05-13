import { getPagesAction, createPageAction, deletePageAction } from './actions';
import { PagesList } from './pages-list';

export default async function PagesPage() {
  const pagesList = await getPagesAction();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seiten</h1>
        <form action={createPageAction}>
          <input name="title" placeholder="Neue Seite…" required className="admin-input mr-2 w-56" />
          <button type="submit" className="admin-btn-primary">+ Erstellen</button>
        </form>
      </div>
      <PagesList pages={pagesList} deleteAction={deletePageAction} />
    </div>
  );
}
