import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

type Args = {
  tenant?: string;
  out?: string;
  pretty: boolean;
};

type SectionLike = {
  id?: string;
  type?: string;
  visible?: boolean;
  styleOverrides?: Record<string, unknown> | null;
  data?: Record<string, unknown>;
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { pretty: true };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--tenant') parsed.tenant = args[++i];
    else if (arg === '--out') parsed.out = args[++i];
    else if (arg === '--compact') parsed.pretty = false;
    else if (arg === '--help') {
      console.log('Usage: pnpm audit:tenant -- --tenant <tenant-id-or-slug> [--out reports/audit.json]');
      process.exit(0);
    }
  }
  return parsed;
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function summarizeSections(sections: SectionLike[]) {
  const sectionTypes = sections.map((section) => section.type || 'unknown');
  return {
    count: sections.length,
    visibleCount: sections.filter((section) => section.visible !== false).length,
    hiddenCount: sections.filter((section) => section.visible === false).length,
    typeCounts: countBy(sectionTypes),
    withStyleOverrides: sections.filter((section) => section.styleOverrides && Object.keys(section.styleOverrides).length > 0).length,
    missingType: sections.filter((section) => !section.type).map((section) => section.id || 'unknown'),
  };
}

function itemSections(item: { data: unknown }): SectionLike[] {
  const data = item.data && typeof item.data === 'object' ? item.data as Record<string, unknown> : {};
  return Array.isArray(data.sections) ? data.sections as SectionLike[] : [];
}

async function main() {
  const args = parseArgs();
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);
  const tenants = await sql`
    SELECT id, slug, name, industry, active_style, status, is_demo, i18n_enabled, i18n_locales, i18n_default_locale
    FROM tenants
    ORDER BY created_at
  `;

  const selectedTenants = args.tenant
    ? tenants.filter((tenant) => tenant.id === args.tenant || tenant.slug === args.tenant)
    : tenants;

  if (selectedTenants.length === 0) {
    throw new Error(`No tenant found for "${args.tenant}"`);
  }

  const audits = [];
  for (const tenant of selectedTenants) {
    const [
      pages,
      pageSections,
      collections,
      collectionItems,
      products,
      productCategories,
      seoPages,
      seoItems,
    ] = await Promise.all([
      sql`SELECT id, title, slug, type, status, visible, sort_order FROM pages WHERE tenant_id = ${tenant.id} ORDER BY sort_order`,
      sql`SELECT id, page_id, type, variant, visible, locked, container, spacing_top, spacing_bottom, anchor_id, style_overrides, data, sort_order FROM page_sections WHERE tenant_id = ${tenant.id} ORDER BY sort_order`,
      sql`SELECT id, key, label, settings FROM collections WHERE tenant_id = ${tenant.id} ORDER BY key`,
      sql`SELECT id, collection_id, slug, title, published, priority, data FROM collection_items WHERE tenant_id = ${tenant.id} ORDER BY priority`,
      sql`SELECT id, title, slug, status, category_id, images, meta_title, meta_description FROM products WHERE tenant_id = ${tenant.id} ORDER BY sort_order`,
      sql`SELECT id, name, slug, parent_id FROM product_categories WHERE tenant_id = ${tenant.id} ORDER BY sort_order`,
      sql`SELECT id, page_id, meta_title, meta_description, noindex FROM seo_page WHERE tenant_id = ${tenant.id}`,
      sql`SELECT id, collection_item_id, meta_title, meta_description, noindex FROM seo_item WHERE tenant_id = ${tenant.id}`,
    ]);

    const itemSectionsFlat = collectionItems.flatMap((item) => itemSections(item));
    const pageSectionTypes = pageSections.map((section) => section.type || 'unknown');
    const itemSectionTypes = itemSectionsFlat.map((section) => section.type || 'unknown');

    audits.push({
      generatedAt: new Date().toISOString(),
      tenant,
      pages: {
        count: pages.length,
        statusCounts: countBy(pages.map((page) => page.status || 'unknown')),
        typeCounts: countBy(pages.map((page) => page.type || 'unknown')),
        visibleCount: pages.filter((page) => page.visible !== false).length,
        slugs: pages.map((page) => page.slug),
      },
      pageSections: {
        ...summarizeSections(pageSections as SectionLike[]),
        pageIdsWithoutSections: pages
          .filter((page) => !pageSections.some((section) => section.page_id === page.id))
          .map((page) => ({ id: page.id, slug: page.slug, title: page.title })),
      },
      collections: {
        count: collections.length,
        keys: collections.map((collection) => collection.key),
      },
      collectionItems: {
        count: collectionItems.length,
        publishedCount: collectionItems.filter((item) => item.published === true).length,
        withSections: collectionItems.filter((item) => itemSections(item).length > 0).length,
        withoutSections: collectionItems.filter((item) => itemSections(item).length === 0).length,
        itemSections: summarizeSections(itemSectionsFlat),
      },
      shop: {
        products: products.length,
        productStatusCounts: countBy(products.map((product) => product.status || 'unknown')),
        categories: productCategories.length,
      },
      seo: {
        pagesWithSeo: seoPages.length,
        itemsWithSeo: seoItems.length,
        pagesWithoutSeo: pages.length - seoPages.length,
        collectionItemsWithoutSeo: collectionItems.length - seoItems.length,
      },
      sectionTypes: {
        all: Array.from(new Set([...pageSectionTypes, ...itemSectionTypes])).sort(),
        pageOnly: Array.from(new Set(pageSectionTypes.filter((type) => !itemSectionTypes.includes(type)))).sort(),
        itemOnly: Array.from(new Set(itemSectionTypes.filter((type) => !pageSectionTypes.includes(type)))).sort(),
      },
    });
  }

  const output = args.pretty ? JSON.stringify(audits, null, 2) : JSON.stringify(audits);
  if (args.out) {
    const outputPath = resolve(args.out);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${output}\n`, 'utf8');
    console.log(`Wrote tenant audit to ${outputPath}`);
  } else {
    console.log(output);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
