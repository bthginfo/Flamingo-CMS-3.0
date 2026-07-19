import assert from 'node:assert/strict';
import test from 'node:test';
import { createNeonTenantProject } from './neon';

test('creates a tenant project with a nested production branch and obtains pooled and direct URIs', async () => {
  const previousKey = process.env.NEON_API_KEY;
  const previousOrg = process.env.NEON_ORG_ID;
  const previousFetch = globalThis.fetch;
  process.env.NEON_API_KEY = 'neon-test-key';
  process.env.NEON_ORG_ID = 'org-test-123';
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, init });
    if (url.endsWith('/projects')) {
      return Response.json({
        project: { id: 'project-test-123', region_id: 'aws-eu-central-1' },
        branch: { id: 'branch-test-123' },
        databases: [{ name: 'flamingo' }],
        roles: [{ name: 'flamingo_owner' }],
        operations: [],
      }, { status: 201 });
    }
    const pooled = url.includes('pooled=true');
    return Response.json({ uri: `postgresql://owner:secret@${pooled ? 'pooled' : 'direct'}.example/flamingo` });
  }) as typeof fetch;

  try {
    const result = await createNeonTenantProject('Kunde Nord');
    assert.equal(result.projectId, 'project-test-123');
    assert.match(result.pooledConnectionUri, /pooled\.example/);
    assert.match(result.directConnectionUri, /direct\.example/);
    assert.equal(requests.length, 3);

    const body = JSON.parse(String(requests[0]?.init?.body));
    assert.equal(body.project.name, 'flamingo-kunde-nord');
    assert.equal(body.project.org_id, 'org-test-123');
    assert.deepEqual(body.project.branch, {
      name: 'production',
      database_name: 'flamingo',
      role_name: 'flamingo_owner',
    });
    assert.equal(body.branch, undefined);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.NEON_API_KEY;
    else process.env.NEON_API_KEY = previousKey;
    if (previousOrg === undefined) delete process.env.NEON_ORG_ID;
    else process.env.NEON_ORG_ID = previousOrg;
  }
});
