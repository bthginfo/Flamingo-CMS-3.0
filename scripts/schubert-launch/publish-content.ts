import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { checksumPublishedSnapshot, publishSnapshotAtomically } from '../../apps/renderer/src/lib/publish-snapshot';

type RecordRow = Record<string, any>;
export type ContentExport = {
  tenant: RecordRow; global: RecordRow; navigation: RecordRow; footer: RecordRow;
  pages: RecordRow[]; sections: RecordRow[]; collections: RecordRow[]; items: RecordRow[];
  active: RecordRow; seo?: RecordRow | null;
};
const targets = {
  design: { tenant: 'e7b96166-8c3d-4e9b-901a-3c4eadee4673', slug: 'schubert-design', endpoint: 'ep-blue-mode-b93msu7q', url: 'https://flamingo-schubert-design.vercel.app' },
  grab: { tenant: 'ff2102e2-f07e-4d44-9046-12c55d78a60d', slug: 'schubert-grabdenkmal', endpoint: 'ep-noisy-paper-b988tw4s', url: 'https://flamingo-schubert-grabdenkmal.vercel.app' },
} as const;

function identities(rows: RecordRow[], keys = ['id', 'slug']) {
  return rows.map(row => keys.map(key => String(row[key])).join('|')).sort();
}

/** Fail closed before opening a connection; this utility cannot target the shared database. */
export function validatePublicationInput(site: keyof typeof targets, before: ContentExport, after: ContentExport, connection?: string) {
  const target = targets[site];
  assert.ok(target, 'Unknown Schubert site');
  for (const payload of [before, after]) {
    assert.equal(payload.tenant.id, target.tenant, 'Wrong tenant');
    assert.equal(payload.tenant.slug, target.slug, 'Wrong site');
    assert.ok(payload.pages.length >= 8, 'Missing pages');
    assert.ok(payload.active?.snapshot, 'Missing snapshot');
    for (const rows of [payload.pages, payload.sections, payload.collections, payload.items]) {
      assert.equal(new Set(rows.map(row => row.id)).size, rows.length, 'Duplicate entity IDs');
      rows.forEach(row => assert.equal(row.tenant_id, target.tenant, 'Cross-tenant data'));
    }
    const pageIds = new Set(payload.pages.map(row => row.id));
    payload.sections.forEach(section => {
      assert.ok(pageIds.has(section.page_id), 'Orphan section');
      assert.ok(section.definition_key && section.schema_version > 0, 'Section definition missing');
    });
    for (const row of [payload.navigation, payload.footer]) assert.equal(row.tenant_id, target.tenant);
    assert.equal(payload.global.contact.email, 'schubert@schubertdesign.de', 'Unexpected contact destination');
  }
  assert.deepEqual(identities(after.pages), identities(before.pages), 'Existing page routes must be preserved');
  assert.deepEqual(identities(after.collections, ['id', 'key']), identities(before.collections, ['id', 'key']), 'Collections must be preserved');
  assert.deepEqual(identities(after.items, ['id', 'collection_id', 'slug']), identities(before.items, ['id', 'collection_id', 'slug']), 'Collection routes must be preserved');
  assert.equal(after.global.id, before.global.id, 'Settings identity changed');
  if (connection) {
    const uri = new URL(connection);
    assert.equal(uri.protocol, 'postgresql:');
    assert.ok(uri.hostname.startsWith(target.endpoint + '-') || uri.hostname.startsWith(target.endpoint + '.'), 'Expected isolated Neon endpoint');
    assert.ok(uri.hostname.endsWith('.neon.tech'), 'Expected Neon hostname');
  }
}

/** Same public shape and item ordering as getDraftSnapshot; never carries DB credentials. */
export function buildPublicationSnapshot(payload: ContentExport, generatedAt: string) {
  const sections = [...payload.sections].sort((a, b) => a.sort_order - b.sort_order);
  return {
    pages: [...payload.pages].sort((a,b)=>a.sort_order-b.sort_order).map(page => ({
      id: page.id, title: page.title, slug: page.slug, visible: page.visible,
      sections: sections.filter(section=>section.page_id===page.id).map(section=>({
        id:section.id, type:section.type, definitionKey:section.definition_key,
        schemaVersion:section.schema_version, variant:section.variant ?? null,
        visible:section.visible, locked:section.locked ?? false, sortOrder:section.sort_order,
        container:section.container, spacingTop:section.spacing_top, spacingBottom:section.spacing_bottom,
        anchorId:section.anchor_id ?? null, data:section.data, styleOverrides:section.style_overrides ?? null,
      })),
    })),
    collections: payload.collections.map(collection=>({
      id:collection.id, key:collection.key, label:collection.label,
      schema:collection.schema ?? null, settings:collection.settings ?? null,
      items:payload.items.filter(item=>item.collection_id===collection.id && item.published)
        .sort((a,b)=>b.priority-a.priority || Date.parse(b.updated_at)-Date.parse(a.updated_at) || a.id.localeCompare(b.id))
        .map(item=>({ id:item.id, slug:item.slug, title:item.title, data:item.data, priority:item.priority,
          createdAt:new Date(item.created_at).toISOString(), updatedAt:new Date(item.updated_at).toISOString() })),
    })),
    generatedAt,
  };
}

function sortedRows(rows: RecordRow[]) { return [...rows].sort((a,b)=>a.id.localeCompare(b.id)); }

async function main() {
  const site = process.argv[2] as keyof typeof targets;
  assert.ok(Object.hasOwn(targets, site), 'Usage: publish-content.ts <design|grab> [--apply]');
  const directory = resolve(process.env.SCHUBERT_CONTENT_DIR || 'tmp/schubert-launch-2026-10-19');
  const before: ContentExport = JSON.parse(await readFile(resolve(directory, `${site}-before.json`),'utf8'));
  const after: ContentExport = JSON.parse(await readFile(resolve(directory, `${site}-after.json`),'utf8'));
  const apply = process.argv.includes('--apply');
  validatePublicationInput(site, before, after, apply ? process.env.DATABASE_URL : undefined);
  const stamp = new Date().toISOString();
  after.items.forEach(item=>{item.updated_at=stamp;});
  const snapshot = buildPublicationSnapshot(after, stamp);
  const checksum = checksumPublishedSnapshot(snapshot);
  const target = targets[site];
  const summary = { site, tenant: target.tenant, pages:after.pages.length, sections:after.sections.length,
    items:after.items.length, checksum, notificationEmail:after.global.contact.email };
  if (!apply) { console.log(JSON.stringify({dryRun:true,...summary})); return; }
  assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
  const requireDb = createRequire(resolve('packages/db/package.json'));
  const { neon } = requireDb('@neondatabase/serverless');
  const { PgDialect } = requireDb('drizzle-orm/pg-core');
  const sql = neon(process.env.DATABASE_URL!);
  const tid = target.tenant;
  const commands = [sql`SELECT pg_advisory_xact_lock(hashtextextended(${tid}::text, 0))`];
  // Detect both a concurrent publication and unpublished CMS edits. A failed guard
  // aborts the entire Neon transaction before any content row is modified.
  commands.push(sql`SELECT 1 / CASE WHEN
    EXISTS(SELECT 1 FROM tenants WHERE id=${tid} AND slug=${target.slug})
    AND EXISTS(SELECT 1 FROM published_snapshots WHERE tenant_id=${tid} AND id=${before.active.id} AND checksum=${before.active.checksum} AND is_active)
    AND (SELECT jsonb_agg(to_jsonb(p) ORDER BY id) FROM pages p WHERE tenant_id=${tid})=${JSON.stringify(sortedRows(before.pages))}::jsonb
    AND (SELECT jsonb_agg(to_jsonb(s) ORDER BY id) FROM page_sections s WHERE tenant_id=${tid})=${JSON.stringify(sortedRows(before.sections))}::jsonb
    AND (SELECT jsonb_agg(to_jsonb(i) ORDER BY id) FROM collection_items i WHERE tenant_id=${tid})=${JSON.stringify(sortedRows(before.items))}::jsonb
    AND (SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM collections c WHERE tenant_id=${tid})=${JSON.stringify(sortedRows(before.collections))}::jsonb
    AND (SELECT to_jsonb(n) FROM navigation n WHERE tenant_id=${tid})=${JSON.stringify(before.navigation)}::jsonb
    AND (SELECT to_jsonb(f) FROM footer f WHERE tenant_id=${tid})=${JSON.stringify(before.footer)}::jsonb
    AND (SELECT jsonb_build_object('id',id,'brand',brand,'design',design,'contact',contact,'openingHours',opening_hours,'businessProfile',business_profile,'formFields',form_fields) FROM global_settings WHERE tenant_id=${tid})=${JSON.stringify(before.global)}::jsonb
    AND NOT EXISTS(SELECT 1 FROM page_sections WHERE id=ANY(${after.sections.map(s=>s.id)}::uuid[]) AND tenant_id<>${tid})
    THEN 1 ELSE 0 END AS unchanged_since_export`);
  commands.push(sql`UPDATE global_settings SET brand=${JSON.stringify(after.global.brand)}::jsonb,
    design=${JSON.stringify(after.global.design)}::jsonb, contact=${JSON.stringify(after.global.contact)}::jsonb,
    opening_hours=${JSON.stringify(after.global.openingHours)}::jsonb, form_fields=${JSON.stringify(after.global.formFields)}::jsonb,
    auto_response=coalesce(auto_response,'{"enabled":false,"subject":"","body":""}'::jsonb) || jsonb_build_object('notificationEmail',${after.global.contact.email}::text),
    updated_at=${stamp}::timestamptz WHERE tenant_id=${tid} AND id=${before.global.id}`);
  commands.push(sql`UPDATE navigation SET items=${JSON.stringify(after.navigation.items)}::jsonb, cta=${JSON.stringify(after.navigation.cta)}::jsonb, updated_at=${stamp}::timestamptz WHERE tenant_id=${tid}`);
  commands.push(sql`UPDATE footer SET columns=${JSON.stringify(after.footer.columns)}::jsonb, legal_links=${JSON.stringify(after.footer.legal_links)}::jsonb, cta=${JSON.stringify(after.footer.cta)}::jsonb, updated_at=${stamp}::timestamptz WHERE tenant_id=${tid}`);
  commands.push(sql`UPDATE pages p SET title=r.title, visible=r.visible, sort_order=r.sort_order, updated_at=${stamp}::timestamptz FROM jsonb_to_recordset(${JSON.stringify(after.pages)}::jsonb) AS r(id uuid,title text,visible boolean,sort_order integer) WHERE p.tenant_id=${tid} AND p.id=r.id`);
  commands.push(sql`UPDATE collections c SET label=r.label,schema=r.schema,settings=r.settings,updated_at=${stamp}::timestamptz
    FROM jsonb_to_recordset(${JSON.stringify(after.collections)}::jsonb) AS r(id uuid,label text,schema jsonb,settings jsonb) WHERE c.tenant_id=${tid} AND c.id=r.id`);
  commands.push(sql`DELETE FROM page_sections WHERE tenant_id=${tid} AND NOT(id=ANY(${after.sections.map(s=>s.id)}::uuid[]))`);
  commands.push(sql`INSERT INTO page_sections(id,tenant_id,page_id,type,definition_key,schema_version,variant,title_internal,visible,locked,container,spacing_top,spacing_bottom,anchor_id,style_overrides,data,sort_order,updated_at)
    SELECT id,${tid},page_id,type,definition_key,schema_version,variant,title_internal,visible,locked,container,spacing_top,spacing_bottom,anchor_id,style_overrides,data,sort_order,${stamp}::timestamptz
    FROM jsonb_to_recordset(${JSON.stringify(after.sections)}::jsonb) AS r(id uuid,page_id uuid,type text,definition_key text,schema_version integer,variant text,title_internal text,visible boolean,locked boolean,container text,spacing_top text,spacing_bottom text,anchor_id text,style_overrides jsonb,data jsonb,sort_order integer)
    ON CONFLICT(id) DO UPDATE SET type=excluded.type,definition_key=excluded.definition_key,schema_version=excluded.schema_version,
    variant=excluded.variant,title_internal=excluded.title_internal,visible=excluded.visible,locked=excluded.locked,container=excluded.container,
    spacing_top=excluded.spacing_top,spacing_bottom=excluded.spacing_bottom,anchor_id=excluded.anchor_id,style_overrides=excluded.style_overrides,
    data=excluded.data,sort_order=excluded.sort_order,updated_at=excluded.updated_at WHERE page_sections.tenant_id=${tid}`);
  commands.push(sql`UPDATE collection_items i SET title=r.title,data=r.data,priority=r.priority,published=r.published,updated_at=${stamp}::timestamptz
    FROM jsonb_to_recordset(${JSON.stringify(after.items)}::jsonb) AS r(id uuid,title text,data jsonb,priority integer,published boolean) WHERE i.tenant_id=${tid} AND i.id=r.id`);
  if (site === 'grab') {
    const media = JSON.parse(await readFile(new URL('./media-manifest.json', import.meta.url), 'utf8')) as RecordRow[];
    assert.ok(media.every(asset => new URL(asset.blob_url).hostname.endsWith('.public.blob.vercel-storage.com')), 'Media must use independent Blob hosting');
    commands.push(sql`INSERT INTO media_assets(tenant_id,blob_url,pathname,filename,mime_type,size,width,height,alt,caption,folder,metadata)
      SELECT ${tid},blob_url,pathname,filename,mime_type,size,width,height,alt,caption,folder,metadata
      FROM jsonb_to_recordset(${JSON.stringify(media)}::jsonb) AS r(blob_url text,pathname text,filename text,mime_type text,size integer,width integer,height integer,alt text,caption text,folder text,metadata jsonb)
      ON CONFLICT(tenant_id,blob_url) DO NOTHING`);
  }
  if (after.seo) commands.push(sql`INSERT INTO seo_global(tenant_id,default_title,title_template,default_description,default_og_image,canonical_base,locale,robots)
    VALUES(${tid},${after.seo.default_title ?? null},${after.seo.title_template ?? null},${after.seo.default_description ?? null},${after.seo.default_og_image ?? null},${target.url},'de_DE','index,follow')
    ON CONFLICT(tenant_id) DO UPDATE SET default_title=excluded.default_title,title_template=excluded.title_template,default_description=excluded.default_description,default_og_image=excluded.default_og_image,canonical_base=excluded.canonical_base,updated_at=${stamp}::timestamptz`);
  // Reuse the production publisher: execute its final SQL statement as the
  // last member of the SAME transaction as all draft/settings writes above.
  const dialect = new PgDialect();
  const publisher = { execute: async (statement:any) => {
    const query = dialect.sqlToQuery(statement);
    const results = await sql.transaction([...commands, sql.query(query.sql,query.params)]);
    return { rows: results[results.length-1] };
  }};
  const publication = await publishSnapshotAtomically(publisher as never, {
    tenantId:tid,snapshot,checksum,createdBy:'schubert-launch-quality-2026-10-19',publishDraftPages:true,
  });
  await writeFile(resolve(directory,`${site}-publication.json`), JSON.stringify({...summary,...publication,appliedAt:stamp},null,2));
  console.log(JSON.stringify({...summary,...publication,applied:true}));
  if (process.env.REVALIDATE_SECRET) {
    const response = await fetch(`${target.url}/api/revalidate?tenant=${tid}`,{method:'POST',headers:{'x-revalidate-secret':process.env.REVALIDATE_SECRET}});
    assert.ok(response.ok,'Publication succeeded but cache invalidation failed');
    console.log(JSON.stringify({revalidated:true,site}));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error:unknown)=>{ console.error(error instanceof assert.AssertionError ? error.message : `Publication failed (code ${(error as {code?:string})?.code || 'unknown'}); credentials and SQL payload omitted.`); process.exitCode=1; });
}
