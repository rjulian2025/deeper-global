import test from 'node:test';
import assert from 'node:assert/strict';

test('admin audit endpoint and library import and run', async () => {
  // Import the API handler just to ensure module loads
  const apiModule = await import('../api/admin/audit-data-integrity.js');
  assert.equal(typeof apiModule.default, 'function');
  const fixModule = await import('../api/admin/fix-duplicate-slugs.js');
  assert.equal(typeof fixModule.default, 'function');

  const lib = await import('../scripts/lib/data-integrity-audit.mjs');
  assert.equal(typeof lib.runDataIntegrityAudit, 'function');

  // Mock Supabase client returning no rows
  const client = {
    from() {
      return {
        select() {
          const chain = {
            order() {
              return chain;
            },
            range() {
              return Promise.resolve({ data: [], error: null });
            },
          };
          return chain;
        },
      };
    },
  };

  const report = await lib.runDataIntegrityAudit(client);
  assert.ok(report);
  assert.equal(report.summary.total_rows, 0);
  assert.ok(Array.isArray(report.inputs_loaded));

  // Admin endpoints must always advertise x-deploy-sha, even on 405/401
  const prevSha = process.env.VERCEL_GIT_COMMIT_SHA;
  process.env.VERCEL_GIT_COMMIT_SHA = 'TEST_SHA';
  const makeRes = () => {
    const headers = {};
    return {
      statusCode: 0,
      setHeader(k, v) { headers[k.toLowerCase()] = v; },
      end() {},
      get headers() { return headers; },
    };
  };
  // audit: wrong method -> 405, header present
  {
    const req = { method: 'POST', headers: {} };
    const res = makeRes();
    await apiModule.default(req, res);
    assert.equal(res.headers['x-deploy-sha'], 'TEST_SHA');
    assert.equal(res.statusCode, 405);
  }
  // audit: GET without auth -> 401, header present
  {
    const req = { method: 'GET', headers: {} };
    const res = makeRes();
    await apiModule.default(req, res);
    assert.equal(res.headers['x-deploy-sha'], 'TEST_SHA');
    assert.equal(res.statusCode, 401);
  }
  // fix: wrong method -> 405, header present
  {
    const req = { method: 'GET', headers: {} };
    const res = makeRes();
    await fixModule.default(req, res);
    assert.equal(res.headers['x-deploy-sha'], 'TEST_SHA');
    assert.equal(res.statusCode, 405);
  }
  // fix: POST without auth -> 401, header present
  {
    const req = { method: 'POST', headers: {} };
    const res = makeRes();
    await fixModule.default(req, res);
    assert.equal(res.headers['x-deploy-sha'], 'TEST_SHA');
    assert.equal(res.statusCode, 401);
  }
  // restore env
  if (prevSha === undefined) delete process.env.VERCEL_GIT_COMMIT_SHA;
  else process.env.VERCEL_GIT_COMMIT_SHA = prevSha;
});
