import { getCategories } from '../../actions';
import { ProductForm } from '../product-form';

export default async function NewProductPage() {
  const categories = await getCategories();  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Neues Produkt</h1>
      <p className="text-zinc-500 text-sm mb-6">Erstelle ein neues Produkt für deinen Shop.</p>
      <ProductForm categories={categories} />
    </div>
  );
}
