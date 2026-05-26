import { readFileSync } from 'node:fs';

type Diff = {
  path: string;
  before: unknown;
  after: unknown;
};

function usage(): never {
  console.log('Usage: pnpm audit:tenant:diff -- <before.json> <after.json>');
  process.exit(0);
}

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function at(value: unknown, path: string): unknown {
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object') return (current as Record<string, unknown>)[key];
    return undefined;
  }, value);
}

function stable(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    out[key] = sortValue((value as Record<string, unknown>)[key]);
  }
  return out;
}

function main() {
  const [, , beforePath, afterPath] = process.argv;
  if (!beforePath || !afterPath || beforePath === '--help') usage();

  const before = readJson(beforePath);
  const after = readJson(afterPath);
  const beforeAudit = Array.isArray(before) ? before[0] : before;
  const afterAudit = Array.isArray(after) ? after[0] : after;

  const watchedPaths = [
    'tenant.id',
    'tenant.slug',
    'pages.count',
    'pages.statusCounts',
    'pages.typeCounts',
    'pages.slugs',
    'pageSections.count',
    'pageSections.visibleCount',
    'pageSections.hiddenCount',
    'pageSections.typeCounts',
    'pageSections.withStyleOverrides',
    'collections.count',
    'collections.keys',
    'collectionItems.count',
    'collectionItems.publishedCount',
    'collectionItems.withSections',
    'collectionItems.withoutSections',
    'collectionItems.itemSections.count',
    'collectionItems.itemSections.typeCounts',
    'collectionItems.itemSections.withStyleOverrides',
    'shop.products',
    'shop.productStatusCounts',
    'shop.categories',
    'seo.pagesWithSeo',
    'seo.itemsWithSeo',
    'sectionTypes.all',
    'sectionTypes.pageOnly',
    'sectionTypes.itemOnly',
  ];

  const diffs: Diff[] = [];
  for (const path of watchedPaths) {
    const beforeValue = at(beforeAudit, path);
    const afterValue = at(afterAudit, path);
    if (stable(beforeValue) !== stable(afterValue)) {
      diffs.push({ path, before: beforeValue, after: afterValue });
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    compared: { beforePath, afterPath },
    diffCount: diffs.length,
    diffs,
  };

  console.log(JSON.stringify(result, null, 2));
  if (process.argv.includes('--fail-on-diff') && diffs.length > 0) process.exit(1);
}

main();
