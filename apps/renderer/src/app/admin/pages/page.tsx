import { getPagesAction, createPageAction, deletePageAction, duplicatePageAction, ensureDefaultPages, getShopPageStatus, addShopPageAction } from './actions';
import { PagesList } from './pages-list';
import { isShopActive } from '@/app/admin/shop/actions';

export default async function PagesPage() {
  await ensureDefaultPages();
  const [pagesList, hasShop] = await Promise.all([getPagesAction(), isShopActive()]);
  const shopPages = hasShop ? await getShopPageStatus() : undefined;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Seiten</h1>
        <form action={createPageAction} className="flex gap-2 w-full sm:w-auto">
          <input name="title" placeholder="Neue Seite…" required className="admin-input flex-1 sm:w-56" />
          <button type="submit" className="admin-btn-primary whitespace-nowrap">+ Erstellen</button>
        </form>
      </div>
      <PagesList pages={pagesList} deleteAction={deletePageAction} duplicateAction={duplicatePageAction} hasShop={hasShop} shopPages={shopPages} addShopPageAction={addShopPageAction} />
    </div>
  );
}
