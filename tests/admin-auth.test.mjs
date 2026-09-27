import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdminAuthorized } from '../scripts/lib/admin-auth.mjs';

test('admin auth rejects when secret missing', () => {
  const req = { headers: {}, query: {} };
  const saved = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal(isAdminAuthorized(req), false);
  } finally {
    if (saved) process.env.CRON_SECRET = saved;
  }
});

test('admin auth accepts Bearer token', () => {
  const saved = process.env.CRON_SECRET;
  try {
    process.env.CRON_SECRET = 's3cr3t';
    const req = { headers: { authorization: 'Bearer s3cr3t' }, query: {} };
    assert.equal(isAdminAuthorized(req), true);
  } finally {
    if (saved) process.env.CRON_SECRET = saved;
  }
});

