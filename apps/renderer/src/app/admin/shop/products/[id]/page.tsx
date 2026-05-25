import { getProduct, getCategories } from '../../actions';
import { ProductForm } from '../product-form';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);
  if (!product) notFound();

  return (
    <ProductForm
      categories={categories.map(c => ({ id: c.id, name: c.name }))}
      initial={{
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription || '',
        priceCents: product.priceCents,
        comparePriceCents: product.comparePriceCents,
        sku: product.sku || '',
        stock: product.stock,
        trackStock: product.trackStock,
        isDigital: product.isDigital,
        categoryId: product.categoryId,
        status: product.status,
        images: (product.images as string[]) || [],
        weightGrams: product.weightGrams,
        taxClass: product.taxClass,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        highlights: (product.highlights as string[]) || [],
      }}
    />
  );
}
