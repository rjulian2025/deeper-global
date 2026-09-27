import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listHtml(full)));
    else if (e.isFile() && e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

test('production build has no inline script with import/@/ and all inline scripts parse', async () => {
  const env = {
    ...process.env,
    VERCEL_ENV: 'production',
    PUBLIC_GA4_MEASUREMENT_ID: 'G-TEST123',
    PUBLIC_INDEXABLE: 'true',
  };
  // Build into a separate directory to avoid clobbering preview artifacts
  const res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'build', '--outDir', 'dist-prod'], {
    env,
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  assert.equal(res.status, 0, 'astro production build should succeed');

  const files = await listHtml(path.join(process.cwd(), 'dist-prod'));
  assert.ok(files.length > 0, 'dist-prod should contain HTML files');
  let checked = 0;
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const scriptRe = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = scriptRe.exec(html))) {
      const attrs = (m[1] || '').toLowerCase();
      const code = (m[2] || '').trim();
      if (!code) continue;
      // Skip non-JS inline scripts (e.g., application/ld+json)
      const typeMatch = attrs.match(/type\s*=\s*"([^"]+)"/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : '';
      if (type && type !== 'text/javascript' && type !== 'module') continue;
      // Should not contain ESM import statements or @/ alias
      assert.ok(!/^\s*import\s/m.test(code), `inline script must not contain import in ${file}`);
      assert.ok(!/@\//.test(code), `inline script must not contain @/ alias in ${file}`);
      // Script should parse
      vm.createScript(code);
      checked++;
    }
  }
  assert.ok(checked > 0, 'should have parsed at least one inline script');
});

