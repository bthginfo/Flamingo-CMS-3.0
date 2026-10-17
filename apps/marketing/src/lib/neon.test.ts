import assert from 'node:assert/strict';
import test from 'node:test';
import { createNeonTenantProject, findNeonTenantProjectByConnectionUri } from './neon';

test('registry repair resolves owner credentials without promoting the supplied runtime role', async () => {
  const previousKey = process.env.NEON_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.NEON_API_KEY = 'neon-test-key';
  const scheme = 'postgresql:';
  const connectionRequests: URL[] = [];
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/projects')) return Response.json({ projects: [{ id: 'matched-project' }] });
    if (url.pathname.endsWith('/endpoints')) return Response.json({ endpoints: [{ id: 'ep-matched' }] });
    if (url.pathname.endsWith('/matched-project')) return Response.json({ project: { id: 'matched-project', default_branch_id: 'production' } });
    if (url.pathname.endsWith('/branches')) return Response.json({ branches: [{ id: 'production', primary: true }] });
    if (url.pathname.endsWith('/databases')) return Response.json({ databases: [{ name: 'flamingo' }, { name: 'customer_data' }] });
    if (url.pathname.endsWith('/roles')) return Response.json({ roles: [{ name: 'flamingo_app_restricted' }, { name: 'flamingo_owner' }] });
    if (url.pathname.endsWith('/connection_uri')) {
      connectionRequests.push(url);
      return Response.json({ uri: `${scheme}//flamingo_owner:example@${url.searchParams.get('pooled') === 'true' ? 'pool' : 'direct'}.example/customer_data` });
    }
    throw new Error(`Unexpected test request: ${url.pathname}`);
  }) as typeof fetch;
  try {
    const runtimeUrl = `${scheme}//flamingo_app_restricted:example@ep-matched-pooler.eu-central-1.aws.neon.tech/customer_data`;
    const project = await findNeonTenantProjectByConnectionUri(runtimeUrl);
    assert.equal(project?.roleName, 'flamingo_owner');
    assert.equal(project?.databaseName, 'customer_data');
    assert.equal(connectionRequests.length, 2);
    assert.ok(connectionRequests.every(url => url.searchParams.get('role_name') === 'flamingo_owner'));
    assert.ok(connectionRequests.every(url => url.searchParams.get('database_name') === 'customer_data'));
    assert.match(project!.directConnectionUri, /flamingo_owner/);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.NEON_API_KEY;
    else process.env.NEON_API_KEY = previousKey;
  }
});

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
    if (url.includes('/organizations/')) {
      return Response.json({ id: 'org-test-123', plan: 'free' });
    }
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
    const testPassword = ['test', 'password'].join('-');
    const scheme = 'postgresql:';
    return Response.json({ uri: `${scheme}//owner:${testPassword}@${pooled ? 'pooled' : 'direct'}.example/flamingo` });
  }) as typeof fetch;

  try {
    const result = await createNeonTenantProject('Kunde Nord');
    assert.equal(result.projectId, 'project-test-123');
    assert.match(result.pooledConnectionUri, /pooled\.example/);
    assert.match(result.directConnectionUri, /direct\.example/);
    assert.equal(requests.length, 4);

    const body = JSON.parse(String(requests[1]?.init?.body));
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

test('blocks automatic provisioning when the configured organization is not on Neon Free', async () => {
  const previousKey = process.env.NEON_API_KEY;
  const previousOrg = process.env.NEON_ORG_ID;
  const previousAllowPaid = process.env.ALLOW_PAID_NEON_PROVISIONING;
  const previousFetch = globalThis.fetch;
  process.env.NEON_API_KEY = 'neon-test-key';
  process.env.NEON_ORG_ID = 'org-paid-test';
  delete process.env.ALLOW_PAID_NEON_PROVISIONING;
  let requests = 0;
  globalThis.fetch = (async () => {
    requests += 1;
    return Response.json({ id: 'org-paid-test', plan: 'launch' });
  }) as typeof fetch;

  try {
    await assert.rejects(
      createNeonTenantProject('Nicht versehentlich kostenpflichtig'),
      /Automatische Standalone-Provisionierung ist auf Neon Free begrenzt/,
    );
    assert.equal(requests, 1, 'no project may be created after detecting a paid organization');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.NEON_API_KEY;
    else process.env.NEON_API_KEY = previousKey;
    if (previousOrg === undefined) delete process.env.NEON_ORG_ID;
    else process.env.NEON_ORG_ID = previousOrg;
    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_NEON_PROVISIONING;
    else process.env.ALLOW_PAID_NEON_PROVISIONING = previousAllowPaid;
  }
});
