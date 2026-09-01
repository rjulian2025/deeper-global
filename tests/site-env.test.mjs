import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  resolveGaMeasurementId,
  resolveIndexability,
  resolveRobotsMetaContent,
  resolveShouldLoadAnalytics,
} from '../src/lib/site-env-resolve.mjs';

describe('resolveIndexability', () => {
  it('treats PUBLIC_INDEXABLE=true as indexable', () => {
    assert.equal(resolveIndexability({ publicIndexable: 'true' }), true);
  });

  it('treats PUBLIC_INDEXABLE=false as non-indexable', () => {
    assert.equal(resolveIndexability({ publicIndexable: 'false' }), false);
  });

  it('treats Vercel preview as non-indexable', () => {
    assert.equal(resolveIndexability({ vercelEnv: 'preview', isProd: true }), false);
  });
});

describe('resolveRobotsMetaContent', () => {
  it('returns noindex,nofollow for preview builds', () => {
    assert.equal(resolveRobotsMetaContent({ publicIndexable: 'false' }), 'noindex, nofollow');
  });
});

describe('resolveGaMeasurementId', () => {
  it('returns null when measurement id is absent', () => {
    assert.equal(resolveGaMeasurementId({ gaMeasurementId: '' }), null);
  });

  it('trims configured measurement id', () => {
    assert.equal(resolveGaMeasurementId({ gaMeasurementId: ' G-TEST123 ' }), 'G-TEST123');
  });
});

describe('resolveShouldLoadAnalytics', () => {
  it('suppresses analytics on preview builds even with an id', () => {
    assert.equal(
      resolveShouldLoadAnalytics({
        gaMeasurementId: 'G-TEST123',
        vercelEnv: 'preview',
      }),
      false,
    );
  });

  it('loads analytics on production with configured id', () => {
    assert.equal(
      resolveShouldLoadAnalytics({
        gaMeasurementId: 'G-TEST123',
        vercelEnv: 'production',
      }),
      true,
    );
  });
});
