import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import os from 'node:os';
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
  // Build into a temp directory to avoid repo writes
  const tmpOut = mkdtempSync(path.join(os.tmpdir(), 'dg-dist-'));
  const res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'build', '--outDir', tmpOut], {
    env,
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  assert.equal(res.status, 0, 'astro production build should succeed');

  const files = await listHtml(tmpOut);
  assert.ok(files.length > 0, 'dist-prod should contain HTML files');
  let checked = 0;
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = scriptRe.exec(html))) {
      const attrs = (m[1] || '').toLowerCase();
      const code = (m[2] || '').trim();
      const srcMatch = attrs.match(/src\s*=\s*"([^"]+)"/i);
      const src = srcMatch ? srcMatch[1] : '';
      if (!code) {
        // External script: if data:, ensure it is not importing unresolved modules
        if (src && src.startsWith('data:')) {
          const decoded = Buffer.from(src.split('base64,')[1] || '', 'base64').toString('utf8');
          assert.ok(!/^\s*import\s/m.test(decoded), `data: module must not contain raw import in ${file}`);
          assert.ok(!/@\//.test(decoded), `data: module must not contain @/ alias in ${file}`);
        }
        continue;
      }
      // Skip non-JS inline scripts (e.g., application/ld+json)
      const typeMatch = attrs.match(/type\s*=\s*"([^"]+)"/i);
      const type = typeMatch ? typeMatch[1].toLowerCase() : '';
      if (type && type !== 'text/javascript' && type !== 'module') continue;
      // Inline module scripts are allowed but must not use @/ alias
      assert.ok(!/@\//.test(code), `inline script must not contain @/ alias in ${file}`);
      // Parse only classic scripts; module parsing is environment-specific
      if (!type || type === 'text/javascript') {
        vm.createScript(code);
      }
      checked++;
    }
  }
  assert.ok(checked > 0, 'should have parsed at least one inline script');

  // Emitted JS assets must not contain bare imports
  const jsFiles = [];
  const walk = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && full.endsWith('.js')) jsFiles.push(full);
    }
  };
  await walk(tmpOut);
  for (const js of jsFiles) {
    const code = readFileSync(js, 'utf8');
    const importRe = /import\\s+[^'"]*['"]([^'"]+)['"]/g;
    let im;
    while ((im = importRe.exec(code))) {
      const spec = im[1];
      const isBare = !spec.startsWith('.') && !spec.startsWith('/') && !spec.startsWith('data:') && !spec.startsWith('http');
      assert.ok(!isBare, `bare import "${spec}" found in emitted asset ${js}`);
    }
  }
});

