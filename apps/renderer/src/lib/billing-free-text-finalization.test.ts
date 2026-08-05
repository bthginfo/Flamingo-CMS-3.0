import assert from 'node:assert/strict';
import test from 'node:test';
import { runOwnedFinalization } from './billing-free-text-finalization';

test('a stale finalizer cannot commit or release a replacement claim', async () => {
  type Row = { status: 'finalizing' | 'finalized'; token: string; artifact?: string };
  const row: Row = { status: 'finalizing', token: 'claim-a' };
  let finishA!: () => void;
  const waitForA = new Promise<void>(resolve => { finishA = resolve; });
  const cleaned: string[] = [];
  const run = (token: string, artifact: string, wait?: Promise<void>) => runOwnedFinalization({
    token,
    build: async () => { if (wait) await wait; return artifact; },
    commit: async (owner, built) => {
      if (row.status !== 'finalizing' || row.token !== owner) return null;
      row.status = 'finalized'; row.artifact = built;
      return built;
    },
    release: async owner => { if (row.status === 'finalizing' && row.token === owner) row.token = 'released-by-owner'; },
    cleanup: async built => { cleaned.push(built); },
  });

  const staleWorker = run('claim-a', 'artifact-a', waitForA);
  row.token = 'claim-b'; // atomic stale-claim replacement
  assert.equal(await run('claim-b', 'artifact-b'), 'artifact-b');
  finishA();
  await assert.rejects(staleWorker, /Sperre verloren/);
  assert.deepEqual(row, { status: 'finalized', token: 'claim-b', artifact: 'artifact-b' });
  assert.deepEqual(cleaned, ['artifact-a']);
});
