import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';

test('internal nav links do not include UTMs', async () => {
  const file = path.join(process.cwd(), 'src/layouts/BaseLayout.astro');
  const text = await fs.readFile(file, 'utf8');
  // Parse hrefs and ensure no internal link (starts with "/") contains "utm_"
  const offending = [];
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    const href = m[1];
    if (href.startsWith('/') && href.includes('utm_')) offending.push(href);
  }
  assert.equal(offending.length, 0, `Found internal links with UTMs: ${offending.join(', ')}`);
});

