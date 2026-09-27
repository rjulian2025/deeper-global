import assert from 'node:assert/strict';
import test from 'node:test';

test('Social draft link builder adds UTMs', async () => {
  const mod = await import('../api/cron/generate-drafts.js');
  assert.ok(typeof mod.buildAnswerUtmUrl === 'function', 'buildAnswerUtmUrl export exists');
  const url = mod.buildAnswerUtmUrl({
    slug: 'why-do-i-feel-guilty',
    source: 'x',
    medium: 'social',
    campaign: 'social_question_only',
    content: 'why-do-i-feel-guilty',
  });
  assert.match(url, /^https:\/\/www\.deeper\.global\/answers\/why-do-i-feel-guilty\/\?/);
  assert.match(url, /utm_source=x/);
  assert.match(url, /utm_medium=social/);
  assert.match(url, /utm_campaign=social_question_only/);
  assert.match(url, /utm_content=why-do-i-feel-guilty/);
});

