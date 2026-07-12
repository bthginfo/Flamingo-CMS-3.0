import assert from 'node:assert/strict';
import test from 'node:test';
import { didSectionPickerActionSucceed } from './section-picker-actions';

test('successful sync and async picker actions allow the modal to close', async () => {
  assert.equal(await didSectionPickerActionSucceed(() => undefined), true);
  assert.equal(await didSectionPickerActionSucceed(async () => true), true);
});

test('explicit and thrown picker failures keep the modal open', async () => {
  assert.equal(await didSectionPickerActionSucceed(() => false), false);
  assert.equal(await didSectionPickerActionSucceed(async () => false), false);
  assert.equal(await didSectionPickerActionSucceed(async () => { throw new Error('copy failed'); }), false);
});
