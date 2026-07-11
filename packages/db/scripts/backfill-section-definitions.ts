import { neon } from '@neondatabase/serverless';
import * as templateNamespace from '../../../apps/renderer/src/templates';

type TemplateRegistryModule = typeof import('../../../apps/renderer/src/templates');
const templateRegistry = (
  'default' in templateNamespace
    ? templateNamespace.default
    : templateNamespace
) as TemplateRegistryModule;
const {
  getSectionDefinitionByKey,
  resolveLegacySectionDefinitionKey,
} = templateRegistry;

type LegacySectionRow = {
  id: string;
  type: string;
  industry: string;
};

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes('--apply'),
  };
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  const { apply } = parseArgs(process.argv.slice(2));
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql<LegacySectionRow[]>`
    SELECT ps.id, ps.type, t.industry::text AS industry
    FROM page_sections ps
    INNER JOIN tenants t ON t.id = ps.tenant_id
    WHERE ps.definition_key IS NULL
    ORDER BY t.industry, ps.type, ps.id
  `;

  const groups = new Map<string, { ids: string[]; schemaVersion: number }>();
  const unresolved = new Map<string, number>();
  for (const row of rows) {
    const definitionKey = resolveLegacySectionDefinitionKey(row.industry, row.type);
    const definition = definitionKey ? getSectionDefinitionByKey(definitionKey) : null;
    if (!definition || definition.type !== row.type) {
      const identity = `${row.industry}:${row.type}`;
      unresolved.set(identity, (unresolved.get(identity) || 0) + 1);
      continue;
    }
    const group = groups.get(definitionKey) || { ids: [], schemaVersion: definition.schemaVersion };
    group.ids.push(row.id);
    groups.set(definitionKey, group);
  }

  const resolvable = Array.from(groups.values()).reduce((sum, group) => sum + group.ids.length, 0);
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    candidates: rows.length,
    resolvable,
    definitionKeys: groups.size,
    unresolved: Array.from(unresolved, ([identity, count]) => ({ identity, count })),
  }, null, 2));

  if (!apply || resolvable === 0) return;
  if (unresolved.size > 0) {
    throw new Error('Refusing a partial backfill while unresolved legacy identities exist.');
  }

  let updated = 0;
  for (const [definitionKey, group] of groups) {
    const result = await sql`
      UPDATE page_sections
      SET definition_key = ${definitionKey},
          schema_version = ${group.schemaVersion},
          updated_at = now()
      WHERE id = ANY(${group.ids}::uuid[])
        AND definition_key IS NULL
      RETURNING id
    `;
    updated += result.length;
  }

  const remaining = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count
    FROM page_sections
    WHERE definition_key IS NULL
  `;
  if (updated !== resolvable || remaining[0]?.count !== 0) {
    throw new Error(`Backfill verification failed: updated=${updated}, expected=${resolvable}, remaining=${remaining[0]?.count ?? 'unknown'}`);
  }
  console.log(`Backfilled and verified ${updated} page sections.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
