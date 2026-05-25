'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { products, productCategories } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function requireTenant() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session.tenantId;
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === ',' || ch === ';') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim());
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// Column name mapping (flexible header recognition)
const COLUMN_MAP: Record<string, string> = {
  // Product fields
  titel: 'title', title: 'title', name: 'title', produktname: 'title', product: 'title',
  beschreibung: 'description', description: 'description', desc: 'description',
  kurzbeschreibung: 'shortDescription', short_description: 'shortDescription', 'short description': 'shortDescription',
  preis: 'priceCents', price: 'priceCents', 'preis (eur)': 'priceCents', 'price (eur)': 'priceCents',
  vergleichspreis: 'comparePriceCents', compare_price: 'comparePriceCents', 'compare price': 'comparePriceCents', streichpreis: 'comparePriceCents',
  sku: 'sku', artikelnummer: 'sku', 'artikel-nr': 'sku', 'article number': 'sku',
  bestand: 'stock', stock: 'stock', lager: 'stock', menge: 'stock', quantity: 'stock',
  gewicht: 'weightGrams', weight: 'weightGrams', 'gewicht (g)': 'weightGrams', 'weight (g)': 'weightGrams',
  bilder: 'images', images: 'images', bild: 'images', image: 'images', bildurl: 'images', 'image url': 'images',
  kategorie: 'category', category: 'category', 'product category': 'category', warengruppe: 'category',
  status: 'status',
  steuersatz: 'taxClass', tax: 'taxClass', 'tax class': 'taxClass',
  highlights: 'highlights',
  'meta title': 'metaTitle', 'meta-title': 'metaTitle', 'seo titel': 'metaTitle',
  'meta description': 'metaDescription', 'meta-description': 'metaDescription', 'seo beschreibung': 'metaDescription',
};

function mapColumnName(header: string): string {
  return COLUMN_MAP[header.toLowerCase().trim()] || header;
}

function parsePrice(value: string): number {
  // Handle formats: "29,99", "29.99", "2999" (cents)
  const cleaned = value.replace(/[€$\s]/g, '');
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    // German format: 29,99
    return Math.round(parseFloat(cleaned.replace(',', '.')) * 100);
  }
  if (cleaned.includes('.')) {
    const num = parseFloat(cleaned);
    // If it looks like euros (has decimals), convert to cents
    return num < 10000 ? Math.round(num * 100) : Math.round(num);
  }
  // Plain number - assume cents if > 1000, otherwise euros
  const num = parseInt(cleaned);
  return num > 1000 ? num : num * 100;
}

export type ImportResult = {
  categoriesCreated: number;
  productsCreated: number;
  productsUpdated: number;
  errors: string[];
};

export async function importProductsCsv(csvContent: string): Promise<ImportResult> {
  const tenantId = await requireTenant();
  const db = getDb();
  const rows = parseCsv(csvContent);

  if (rows.length === 0) {
    return { categoriesCreated: 0, productsCreated: 0, productsUpdated: 0, errors: ['CSV enthält keine Daten'] };
  }

  const result: ImportResult = { categoriesCreated: 0, productsCreated: 0, productsUpdated: 0, errors: [] };

  // Load existing categories for this tenant
  const existingCategories = await db.select().from(productCategories).where(eq(productCategories.tenantId, tenantId));
  const categoryMap = new Map<string, string>(); // name/slug → id
  for (const cat of existingCategories) {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
    categoryMap.set(cat.slug, cat.id);
  }

  // Load existing products (by SKU or slug) for upsert
  const existingProducts = await db.select({ id: products.id, slug: products.slug, sku: products.sku }).from(products).where(eq(products.tenantId, tenantId));
  const productBySlug = new Map(existingProducts.map(p => [p.slug, p.id]));
  const productBySku = new Map(existingProducts.filter(p => p.sku).map(p => [p.sku!, p.id]));

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const row: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      row[mapColumnName(key)] = value;
    }

    try {
      const title = row.title;
      if (!title) {
        result.errors.push(`Zeile ${i + 2}: Kein Titel/Name gefunden`);
        continue;
      }

      const slug = slugify(title);
      const priceCents = row.priceCents ? parsePrice(row.priceCents) : 0;
      const comparePriceCents = row.comparePriceCents ? parsePrice(row.comparePriceCents) : undefined;
      const stock = row.stock ? parseInt(row.stock) || 0 : 0;
      const weightGrams = row.weightGrams ? parseInt(row.weightGrams) || undefined : undefined;
      const images = row.images ? row.images.split('|').map(u => u.trim()).filter(Boolean) : [];
      const highlights = row.highlights ? row.highlights.split('|').map(h => h.trim()).filter(Boolean) : [];
      const status = (row.status === 'active' || row.status === 'aktiv') ? 'active' as const : 'draft' as const;

      // Resolve or create category
      let categoryId: string | undefined;
      if (row.category) {
        const catKey = row.category.toLowerCase().trim();
        if (categoryMap.has(catKey)) {
          categoryId = categoryMap.get(catKey);
        } else {
          // Create new category
          const catSlug = slugify(row.category);
          const [newCat] = await db.insert(productCategories).values({
            tenantId,
            name: row.category.trim(),
            slug: catSlug || `cat-${Date.now()}`,
            sortOrder: categoryMap.size,
          }).returning({ id: productCategories.id });
          categoryId = newCat.id;
          categoryMap.set(catKey, newCat.id);
          categoryMap.set(catSlug, newCat.id);
          result.categoriesCreated++;
        }
      }

      // Check if product already exists (by SKU or slug)
      const existingId = (row.sku && productBySku.get(row.sku)) || productBySlug.get(slug);

      const productData = {
        title,
        slug,
        description: row.description || '',
        shortDescription: row.shortDescription || undefined,
        priceCents,
        comparePriceCents: comparePriceCents || undefined,
        sku: row.sku || undefined,
        stock,
        weightGrams,
        images,
        highlights,
        status,
        categoryId: categoryId || undefined,
        taxClass: row.taxClass || 'standard',
        metaTitle: row.metaTitle || undefined,
        metaDescription: row.metaDescription || undefined,
      };

      if (existingId) {
        await db.update(products).set({ ...productData, updatedAt: new Date() }).where(and(eq(products.id, existingId), eq(products.tenantId, tenantId)));
        result.productsUpdated++;
      } else {
        await db.insert(products).values({ tenantId, ...productData });
        productBySlug.set(slug, 'new');
        if (row.sku) productBySku.set(row.sku, 'new');
        result.productsCreated++;
      }
    } catch (err) {
      result.errors.push(`Zeile ${i + 2}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  }

  revalidatePath('/admin/shop/products');
  return result;
}

/** Generate a sample CSV template for download */
export async function getCsvTemplate(): Promise<string> {
  return `Titel;Beschreibung;Kurzbeschreibung;Preis;Vergleichspreis;SKU;Bestand;Gewicht (g);Kategorie;Status;Bilder;Highlights;Meta Title;Meta Description
Beispiel Produkt;Eine ausführliche Beschreibung;Kurze Beschreibung;29,99;39,99;ART-001;50;250;Kategorie A;aktiv;https://example.com/bild1.jpg|https://example.com/bild2.jpg;Highlight 1|Highlight 2;SEO Titel;SEO Beschreibung`;
}
