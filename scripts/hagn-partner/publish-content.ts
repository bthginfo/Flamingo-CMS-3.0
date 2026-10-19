import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { checksumPublishedSnapshot, publishSnapshotAtomically } from '../../apps/renderer/src/lib/publish-snapshot';

type Row = Record<string, any>;
type Content = { tenant: Row; global: Row; navigation: Row; footer: Row; pages: Row[]; sections: Row[]; collections: Row[]; items: Row[]; seo: Row; seoPages: Row[]; media: Row[] };
const tid = 'a1853e0f-ff90-45ee-8fb2-8bada3812f67';
const baseUrl = 'https://flamingo-hagn-partner.vercel.app';

export function validateHagnContent(content: Content, connection?: string) {
  assert.equal(content.tenant.id, tid);
  assert.equal(content.tenant.slug, 'hagn-partner');
  assert.ok(content.pages.length >= 21, 'Incomplete site');
  assert.equal(content.collections.length, 0, 'This native-page launch has no collections');
  assert.equal(content.items.length, 0);
  assert.equal(content.global.contact.email, 'info@hagn-partner.de');
  assert.ok(content.seo.robots.includes('noindex'), 'The standalone staging host must not duplicate the original indexed domain');
  for (const rows of [content.pages, content.sections, content.seoPages]) {
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length, 'Duplicate identities');
    rows.forEach(row => assert.equal(row.tenant_id, tid, 'Cross-tenant payload'));
  }
  const pageIds = new Set(content.pages.map(row => row.id));
  assert.equal(new Set(content.pages.map(row => row.slug)).size, content.pages.length, 'Duplicate native routes');
  for (const section of content.sections) {
    assert.ok(pageIds.has(section.page_id), 'Orphan section');
    assert.ok(section.definition_key && section.schema_version > 0, 'Unregistered section');
  }
  assert.equal(content.seoPages.length, content.pages.length, 'Every page needs SEO settings');
  assert.equal(new Set(content.seoPages.map(row => row.page_id)).size, content.pages.length, 'SEO must cover distinct pages');
  for (const seo of content.seoPages) {
    assert.ok(pageIds.has(seo.page_id));
    assert.ok(seo.meta_title?.length > 0 && seo.meta_title.length <= 70);
    assert.ok(seo.meta_description?.length > 0 && seo.meta_description.length <= 170);
    assert.ok(seo.noindex);
    assert.equal(new URL(seo.canonical).origin, baseUrl);
  }
  if (connection) {
    const uri = new URL(connection);
    assert.equal(uri.hostname, 'ep-patient-moon-b9x888e5.c-7.eu-central-1.aws.neon.tech', 'Only the new isolated database is allowed');
    assert.equal(uri.username, 'flamingo_owner');
    assert.equal(uri.pathname, '/flamingo');
  }
}

export function hagnSnapshot(content: Content, generatedAt: string) {
  return {
    pages: [...content.pages].sort((a, b) => a.sort_order - b.sort_order).map(page => ({
      id: page.id, title: page.title, slug: page.slug, visible: page.visible,
      sections: content.sections.filter(row => row.page_id === page.id).sort((a, b) => a.sort_order - b.sort_order).map(row => ({
        id: row.id, type: row.type, definitionKey: row.definition_key, schemaVersion: row.schema_version,
        variant: row.variant ?? null, visible: row.visible, locked: row.locked ?? false, sortOrder: row.sort_order,
        container: row.container, spacingTop: row.spacing_top, spacingBottom: row.spacing_bottom,
        anchorId: row.anchor_id ?? null, data: row.data, styleOverrides: row.style_overrides ?? null,
      })),
    })),
    collections: [], generatedAt,
  };
}

async function main() {
  const dir = resolve(process.env.HAGN_CONTENT_DIR || 'tmp/hagn-partner-2026-10-19');
  const content = JSON.parse(await readFile(resolve(dir, 'hagn-content.json'), 'utf8')) as Content;
  const apply = process.argv.includes('--apply');
  validateHagnContent(content, apply ? process.env.DATABASE_URL : undefined);
  const stamp = new Date().toISOString();
  const snapshot = hagnSnapshot(content, stamp);
  const checksum = checksumPublishedSnapshot(snapshot);
  const summary = { tenantId: tid, pages: content.pages.length, sections: content.sections.length, media: content.media.length, seoPages: content.seoPages.length, checksum, notificationEmail: content.global.contact.email };
  if (!apply) { console.log(JSON.stringify({ dryRun: true, ...summary })); return; }
  assert.ok(process.env.DATABASE_URL);
  const requireDb = createRequire(new URL('../../packages/db/package.json', import.meta.url));
  const { neon } = requireDb('@neondatabase/serverless');
  const { PgDialect } = requireDb('drizzle-orm/pg-core');
  const sql = neon(process.env.DATABASE_URL);
  const expected = process.env.HAGN_EXPECTED_ACTIVE_CHECKSUM?.trim() || '';
  // Re-read and compare the complete current draft/settings before applying.
  // The transaction repeats this guard, so a concurrent CMS save wins safely.
  const [before] = await sql`SELECT jsonb_build_object(
    'pages', (SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY id),'[]'::jsonb) FROM pages p WHERE tenant_id=${tid}),
    'sections', (SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY id),'[]'::jsonb) FROM page_sections s WHERE tenant_id=${tid}),
    'global', (SELECT to_jsonb(g) FROM global_settings g WHERE tenant_id=${tid}),
    'navigation', (SELECT to_jsonb(n) FROM navigation n WHERE tenant_id=${tid}),
    'footer', (SELECT to_jsonb(f) FROM footer f WHERE tenant_id=${tid}),
    'seo', (SELECT to_jsonb(o) FROM seo_global o WHERE tenant_id=${tid}),
    'seoPages', (SELECT coalesce(jsonb_agg(to_jsonb(o) ORDER BY id),'[]'::jsonb) FROM seo_page o WHERE tenant_id=${tid})
  ) AS draft, (SELECT checksum FROM published_snapshots WHERE tenant_id=${tid} AND is_active) AS checksum`;
  assert.equal(before.checksum || '', expected, 'Active publication changed; explicitly refresh the expected checksum');
  if (!expected) assert.equal(before.draft.pages.length, 0, 'Initial import may not overwrite an existing draft');
  const commands = [sql`SELECT pg_advisory_xact_lock(hashtextextended(${tid}::text,0))`];
  commands.push(sql`SELECT 1 / CASE WHEN
    (SELECT count(*) FROM tenants)=1 AND EXISTS(SELECT 1 FROM tenants WHERE id=${tid} AND slug='hagn-partner')
    AND coalesce((SELECT checksum FROM published_snapshots WHERE tenant_id=${tid} AND is_active),'')=${expected}
    AND jsonb_build_object(
      'pages',(SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY id),'[]'::jsonb) FROM pages p WHERE tenant_id=${tid}),
      'sections',(SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY id),'[]'::jsonb) FROM page_sections s WHERE tenant_id=${tid}),
      'global',(SELECT to_jsonb(g) FROM global_settings g WHERE tenant_id=${tid}),
      'navigation',(SELECT to_jsonb(n) FROM navigation n WHERE tenant_id=${tid}),
      'footer',(SELECT to_jsonb(f) FROM footer f WHERE tenant_id=${tid}),
      'seo',(SELECT to_jsonb(o) FROM seo_global o WHERE tenant_id=${tid}),
      'seoPages',(SELECT coalesce(jsonb_agg(to_jsonb(o) ORDER BY id),'[]'::jsonb) FROM seo_page o WHERE tenant_id=${tid})
    )=${JSON.stringify(before.draft)}::jsonb THEN 1 ELSE 0 END AS unchanged`);
  commands.push(sql`UPDATE tenants SET name=${content.tenant.name}, active_style=${content.tenant.active_style || 'classic'}, vercel_project_id=${process.env.HAGN_VERCEL_PROJECT_ID || null}, updated_at=${stamp}::timestamptz WHERE id=${tid}`);
  const g = content.global;
  commands.push(sql`INSERT INTO global_settings(tenant_id,brand,design,contact,opening_hours,business_profile,social_links,form_fields,auto_response)
    VALUES(${tid},${JSON.stringify(g.brand)}::jsonb,${JSON.stringify(g.design)}::jsonb,${JSON.stringify(g.contact)}::jsonb,${JSON.stringify(g.openingHours || [])}::jsonb,${JSON.stringify(g.businessProfile || null)}::jsonb,${JSON.stringify(g.socialLinks || {})}::jsonb,${JSON.stringify(g.formFields || [])}::jsonb,${JSON.stringify({enabled:false,subject:'',body:'',notificationEmail:g.contact.email})}::jsonb)
    ON CONFLICT(tenant_id) DO UPDATE SET brand=excluded.brand,design=excluded.design,contact=excluded.contact,opening_hours=excluded.opening_hours,business_profile=excluded.business_profile,social_links=excluded.social_links,form_fields=excluded.form_fields,auto_response=excluded.auto_response,updated_at=${stamp}::timestamptz`);
  commands.push(sql`INSERT INTO navigation(tenant_id,items,cta) VALUES(${tid},${JSON.stringify(content.navigation.items)}::jsonb,${JSON.stringify(content.navigation.cta)}::jsonb)
    ON CONFLICT(tenant_id) DO UPDATE SET items=excluded.items,cta=excluded.cta,updated_at=${stamp}::timestamptz`);
  commands.push(sql`INSERT INTO footer(tenant_id,columns,legal_links,cta) VALUES(${tid},${JSON.stringify(content.footer.columns)}::jsonb,${JSON.stringify(content.footer.legal_links)}::jsonb,${JSON.stringify(content.footer.cta)}::jsonb)
    ON CONFLICT(tenant_id) DO UPDATE SET columns=excluded.columns,legal_links=excluded.legal_links,cta=excluded.cta,updated_at=${stamp}::timestamptz`);
  commands.push(sql`INSERT INTO pages(id,tenant_id,title,slug,type,status,visible,sort_order)
    SELECT id,${tid},title,slug,type::page_type,'published',visible,sort_order FROM jsonb_to_recordset(${JSON.stringify(content.pages)}::jsonb) AS r(id uuid,title text,slug text,type text,visible boolean,sort_order integer)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,type=excluded.type,status=excluded.status,visible=excluded.visible,sort_order=excluded.sort_order,updated_at=${stamp}::timestamptz WHERE pages.tenant_id=${tid}`);
  commands.push(sql`DELETE FROM page_sections WHERE tenant_id=${tid} AND NOT(id=ANY(${content.sections.map(row=>row.id)}::uuid[]))`);
  commands.push(sql`INSERT INTO page_sections(id,tenant_id,page_id,type,definition_key,schema_version,variant,title_internal,visible,locked,container,spacing_top,spacing_bottom,anchor_id,style_overrides,data,sort_order)
    SELECT id,${tid},page_id,type,definition_key,schema_version,variant,title_internal,visible,locked,container,spacing_top,spacing_bottom,anchor_id,style_overrides,data,sort_order
    FROM jsonb_to_recordset(${JSON.stringify(content.sections)}::jsonb) AS r(id uuid,page_id uuid,type text,definition_key text,schema_version integer,variant text,title_internal text,visible boolean,locked boolean,container text,spacing_top text,spacing_bottom text,anchor_id text,style_overrides jsonb,data jsonb,sort_order integer)
    ON CONFLICT(id) DO UPDATE SET page_id=excluded.page_id,type=excluded.type,definition_key=excluded.definition_key,schema_version=excluded.schema_version,variant=excluded.variant,title_internal=excluded.title_internal,visible=excluded.visible,locked=excluded.locked,container=excluded.container,spacing_top=excluded.spacing_top,spacing_bottom=excluded.spacing_bottom,anchor_id=excluded.anchor_id,style_overrides=excluded.style_overrides,data=excluded.data,sort_order=excluded.sort_order,updated_at=${stamp}::timestamptz WHERE page_sections.tenant_id=${tid}`);
  const s = content.seo;
  commands.push(sql`INSERT INTO seo_global(tenant_id,default_title,title_template,default_description,default_og_image,canonical_base,locale,robots)
    VALUES(${tid},${s.default_title},${s.title_template},${s.default_description},${s.default_og_image},${baseUrl},'de_DE',${s.robots})
    ON CONFLICT(tenant_id) DO UPDATE SET default_title=excluded.default_title,title_template=excluded.title_template,default_description=excluded.default_description,default_og_image=excluded.default_og_image,canonical_base=excluded.canonical_base,locale=excluded.locale,robots=excluded.robots,updated_at=${stamp}::timestamptz`);
  commands.push(sql`INSERT INTO seo_page(id,tenant_id,page_id,meta_title,meta_description,og_image,canonical,noindex)
    SELECT id,${tid},page_id,meta_title,meta_description,og_image,canonical,noindex FROM jsonb_to_recordset(${JSON.stringify(content.seoPages)}::jsonb) AS r(id uuid,page_id uuid,meta_title text,meta_description text,og_image text,canonical text,noindex boolean)
    ON CONFLICT(tenant_id,page_id) DO UPDATE SET meta_title=excluded.meta_title,meta_description=excluded.meta_description,og_image=excluded.og_image,canonical=excluded.canonical,noindex=excluded.noindex,updated_at=${stamp}::timestamptz`);
  if (content.media.length) commands.push(sql`INSERT INTO media_assets(tenant_id,blob_url,pathname,filename,mime_type,size,width,height,alt,caption,folder,metadata)
    SELECT ${tid},blob_url,pathname,filename,mime_type,size,width,height,alt,caption,folder,metadata FROM jsonb_to_recordset(${JSON.stringify(content.media)}::jsonb) AS r(blob_url text,pathname text,filename text,mime_type text,size integer,width integer,height integer,alt text,caption text,folder text,metadata jsonb)
    ON CONFLICT(tenant_id,blob_url) DO UPDATE SET alt=excluded.alt,caption=excluded.caption,metadata=excluded.metadata`);
  const dialect = new PgDialect();
  const executor = { execute: async (statement: any) => {
    const query = dialect.sqlToQuery(statement);
    const result = await sql.transaction([...commands, sql.query(query.sql,query.params)]);
    return { rows: result[result.length-1] };
  }};
  const publication = await publishSnapshotAtomically(executor as never, { tenantId:tid, snapshot, checksum, createdBy:'hagn-partner-launch', publishDraftPages:true });
  await writeFile(resolve(dir,'publication.json'), JSON.stringify({...summary,...publication,appliedAt:stamp},null,2));
  console.log(JSON.stringify({applied:true,...summary,...publication}));
  if (process.env.REVALIDATE_SECRET && process.env.HAGN_REVALIDATE_URL) {
    const response = await fetch(`${process.env.HAGN_REVALIDATE_URL}/api/revalidate?tenant=${tid}`,{method:'POST',headers:{'x-revalidate-secret':process.env.REVALIDATE_SECRET}});
    assert.ok(response.ok,'Publication succeeded; cache invalidation failed');
    console.log(JSON.stringify({revalidated:true}));
  }
}

if (process.argv[1]?.replaceAll('\\','/').endsWith('/publish-content.ts')) {
  main().catch(error => { console.error(error instanceof assert.AssertionError ? error.message : `Hagn publication failed (code ${(error as {code?:string})?.code || 'unknown'}); SQL and credentials omitted.`); process.exitCode=1; });
}
