import test from 'node:test';
import assert from 'node:assert/strict';

test('admin audit endpoint and library import and run', async () => {
  // Import the API handler just to ensure module loads
  const apiModule = await import('../api/admin/audit-data-integrity.js');
  assert.equal(typeof apiModule.default, 'function');

  const lib = await import('../scripts/lib/data-integrity-audit.mjs');
  assert.equal(typeof lib.runDataIntegrityAudit, 'function');

  // Mock Supabase client returning no rows
  const client = {
    from() {
      return {
        select() {
          return {
            order() {
              return {
                range() {
                  return Promise.resolve({ data: [], error: null });
                },
              };
            },
          };
        },
      };
    },
  };

  const report = await lib.runDataIntegrityAudit(client);
  assert.ok(report);
  assert.equal(report.summary.total_rows, 0);
  assert.ok(Array.isArray(report.inputs_loaded));
});
