import test from 'node:test';
import assert from 'node:assert/strict';
import { isBearerAuthorized, resolveAdminSecret } from '../scripts/lib/admin-auth.mjs';

test('isBearerAuthorized accepts only Authorization header', () => {
  process.env.CRON_SECRET = 'topsecret';
  const secret = resolveAdminSecret();
  assert.equal(secret, 'topsecret');

  const reqHeaderOk = { headers: { authorization: `Bearer ${secret}` } };
  assert.equal(isBearerAuthorized(reqHeaderOk), true);

  const reqWrongHeader = { headers: { authorization: `Bearer wrong` } };
  assert.equal(isBearerAuthorized(reqWrongHeader), false);

  const reqQueryTrick = { headers: {}, query: { secret } };
  assert.equal(isBearerAuthorized(reqQueryTrick), false, 'query param must not authorize');
});

