import test from 'node:test';
import assert from 'node:assert/strict';
import { assertRestrictedRuntimeRole } from './runtime-role-policy';

const restricted = { rolsuper:false, rolcreatedb:false, rolcreaterole:false, rolreplication:false, rolbypassrls:false, has_memberships:false };

test('accepts the actual SQL-created data-only capability shape', () => {
  assert.doesNotThrow(() => assertRestrictedRuntimeRole([restricted]));
});

test('rejects a Neon API app role with inherited administrator capabilities', () => {
  assert.throws(() => assertRestrictedRuntimeRole([{ ...restricted, rolcreatedb:true, rolcreaterole:true, rolreplication:true, rolbypassrls:true, has_memberships:true }]), /keine Verwaltungsrechte/);
  for (const capability of Object.keys(restricted)) {
    assert.throws(() => assertRestrictedRuntimeRole([{ ...restricted, [capability]:true }]), /keine Verwaltungsrechte/, capability);
  }
});

test('missing, ambiguous or incomplete capability evidence fails closed', () => {
  for (const records of [[], [restricted,restricted], [{}], [{ ...restricted, has_memberships:undefined }]]) {
    assert.throws(() => assertRestrictedRuntimeRole(records), /keine Verwaltungsrechte/);
  }
});
