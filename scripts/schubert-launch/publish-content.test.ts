import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicationSnapshot, validatePublicationInput, type ContentExport } from './publish-content';
import { checksumPublishedSnapshot } from '../../apps/renderer/src/lib/publish-snapshot';

const tid='e7b96166-8c3d-4e9b-901a-3c4eadee4673';
function fixture():ContentExport {
  return {
    tenant:{id:tid,slug:'schubert-design'},global:{id:'settings',contact:{email:'schubert@schubertdesign.de'}},
    navigation:{tenant_id:tid},footer:{tenant_id:tid},
    pages:Array.from({length:8},(_,i)=>({id:`page-${i}`,slug:i===0?'startseite':`page-${i}`,tenant_id:tid,title:`Page ${i}`,sort_order:i,visible:true})),
    sections:[{id:'section-1',page_id:'page-0',tenant_id:tid,type:'editorialHero',definition_key:'editorialHero.shared.v1',schema_version:1,sort_order:0,visible:true,locked:false,container:'default',spacing_top:'m',spacing_bottom:'m',data:{headline:'A real heading'}}],
    collections:[{id:'collection-1',key:'projekte',label:'Projekte',tenant_id:tid}],
    items:[
      {id:'b',slug:'second',title:'Second',tenant_id:tid,collection_id:'collection-1',priority:0,published:true,data:{},created_at:'2026-10-01T10:00:00Z',updated_at:'2026-10-02T10:00:00Z'},
      {id:'a',slug:'first',title:'First',tenant_id:tid,collection_id:'collection-1',priority:1,published:true,data:{},created_at:'2026-10-01T10:00:00Z',updated_at:'2026-10-02T10:00:00Z'},
      {id:'c',slug:'private',title:'Private',tenant_id:tid,collection_id:'collection-1',priority:10,published:false,data:{},created_at:'2026-10-01T10:00:00Z',updated_at:'2026-10-02T10:00:00Z'},
    ],active:{snapshot:{}},
  };
}

test('rejects central/shared and unrelated database endpoints before connecting',()=>{
  const before=fixture();
  assert.throws(()=>validatePublicationInput('design',before,structuredClone(before),'postgresql://user:pass@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/db'),/isolated Neon endpoint/);
  assert.doesNotThrow(()=>validatePublicationInput('design',before,structuredClone(before),'postgresql://user:pass@ep-blue-mode-b93msu7q-pooler.c-7.eu-central-1.aws.neon.tech/flamingo'));
});
test('rejects cross-tenant rows, orphan sections and accidentally lost public routes',()=>{
  const before=fixture();const after=structuredClone(before);
  after.sections[0].tenant_id='wrong';assert.throws(()=>validatePublicationInput('design',before,after),/Cross-tenant/);
  after.sections[0].tenant_id=tid;after.sections[0].page_id='absent';assert.throws(()=>validatePublicationInput('design',before,after),/Orphan/);
  after.sections[0].page_id='page-0';after.items.pop();assert.throws(()=>validatePublicationInput('design',before,after),/Collection routes/);
});
test('snapshot matches CMS field names, scopes, public-item filtering and priority order',()=>{
  const value=buildPublicationSnapshot(fixture(),'2026-10-19T12:00:00Z');
  assert.equal(value.pages[0].sections[0].definitionKey,'editorialHero.shared.v1');
  assert.equal(value.pages[0].sections[0].anchorId,null);
  assert.equal(value.pages[1].sections.length,0);
  assert.deepEqual(value.collections[0].items.map(item=>item.slug),['first','second']);
  assert.equal(value.collections[0].items[0].updatedAt,'2026-10-02T10:00:00.000Z');
  assert.equal(checksumPublishedSnapshot(value),checksumPublishedSnapshot({...value,generatedAt:'later'}));
});
