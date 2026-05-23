import { getProducts, getCategories } from '../actions';
import { ProductsList } from './products-client';

export default async function ProductsPage() {
  const [productList, categoryList] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Produkte</h1>
      <p className="text-zinc-500 text-sm mb-6">Alle Produkte deines Shops.</p>
      <ProductsList products={productList} categories={categoryList} />
    </div>
  );
}
