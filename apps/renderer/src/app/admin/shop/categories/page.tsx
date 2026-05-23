import { getCategories } from '../actions';
import { CategoriesClient } from './categories-client';
import { ShopBackLink } from '../shop-back-link';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Kategorien</h1>
      <p className="text-zinc-500 text-sm mb-6">Organisiere Produkte in Kategorien.</p>
      <CategoriesClient categories={categories} />
    </div>
  );
}
