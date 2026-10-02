import assert from 'node:assert/strict';
import test from 'node:test';
import { DrizzleQueryError } from 'drizzle-orm/errors';
import { apiErrorLogMetadata, databaseErrorCode } from './api-error-policy';

test('API duplicate detection follows the actual Drizzle query error cause', () => {
  const driverError = Object.assign(new Error('duplicate key value violates unique constraint'), { code: '23505' });
  const error = new DrizzleQueryError('insert into contact values ($1)', ['private@example.test'], driverError);
  assert.doesNotMatch(error.message, /unique|duplicate/);
  assert.equal(databaseErrorCode(error), '23505');
  assert.equal(databaseErrorCode(new Error('outer wrapper', { cause: error })), '23505');
});

test('API error logs omit query parameters and user content', () => {
  const error = new DrizzleQueryError('insert into contact values ($1)', ['private@example.test'], Object.assign(new Error('database error'), { code: '23505' }));
  assert.deepEqual(apiErrorLogMetadata(error), { name: 'Error', databaseCode: '23505' });
  assert.doesNotMatch(JSON.stringify(apiErrorLogMetadata(error)), /private@example|insert into/);
});

test('API error cause traversal is bounded and handles cycles or non-errors', () => {
  const cycle: { cause?: unknown } = {};
  cycle.cause = cycle;
  assert.equal(databaseErrorCode(cycle), undefined);
  for (const value of [null, undefined, '23505', { code: 'UNIQUE_ERROR' }]) assert.equal(databaseErrorCode(value), undefined);
  assert.equal(databaseErrorCode({ cause: { code: '23503' } }), '23503');
});
