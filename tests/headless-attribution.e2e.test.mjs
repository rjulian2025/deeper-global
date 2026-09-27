import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { mkdtempSync, readFileSync } from 'node:fs';
import http from 'node:http';
import url from 'node:url';
// puppeteer is dynamically imported only when HEADLESS_E2E=true

function startStaticServer(rootDir, { stripAstroScripts = false } = {}) {
  const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url || '/');
    let filePath = path.join(rootDir, decodeURIComponent(reqUrl.pathname || '/'));
    try {
      // map directories to index.html
      if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      // 404 fallback
      let content = readFileSync(filePath, 'utf8');
      if (stripAstroScripts && filePath.endsWith('.html')) {
        content = content.replace(/<script[^>]*src="\/_astro\/[^"]+"[^>]*><\/script>/g, '');
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', filePath.endsWith('.html') ? 'text/html' : 'text/plain');
      res.end(content);
    } catch {
      // Try index.html at root
      try {
        let fallback = readFileSync(path.join(rootDir, 'index.html'), 'utf8');
        if (stripAstroScripts) {
          fallback = fallback.replace(/<script[^>]*src="\/_astro\/[^"]+"[^>]*><\/script>/g, '');
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(fallback);
      } catch {
        res.statusCode = 404;
        res.end('not found');
      }
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

test('headless: attribution ready and events carry ft_source; fallback flushes without init', async (t) => {
  if (process.env.HEADLESS_E2E !== 'true') {
    t.skip('Set HEADLESS_E2E=true to run headless browser test');
    return;
  }
  const { default: puppeteer } = await import('puppeteer');
  const env = { ...process.env, VERCEL_ENV: 'production', PUBLIC_GA4_MEASUREMENT_ID: 'G-TEST123', PUBLIC_INDEXABLE: 'true' };
  const out = mkdtempSync(path.join(os.tmpdir(), 'dg-e2e-'));
  const res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'build', '--outDir', out], { env, cwd: process.cwd(), stdio: 'inherit' });
  assert.equal(res.status, 0, 'production build must succeed');

  const { server, port } = await startStaticServer(out);
  const base = `http://127.0.0.1:${port}`;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  // Normal path
  await page.goto(`${base}/answers/?utm_source=x&utm_medium=social&utm_campaign=test&utm_content=slug`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__dgAttributionReady === true, { timeout: 5000 });
  const dl1 = await page.evaluate(() => (window.dataLayer || []).filter((e) => Array.isArray(e) && e[0] === 'event'));
  assert.ok(dl1.some((e) => e[1] === 'hub_viewed' && e[2] && e[2].ft_source === 'x'), 'hub_viewed missing ft_source on normal path');

  // Fallback path: serve HTML with Astro module scripts stripped so init never runs
  const { server: server2, port: port2 } = await startStaticServer(out, { stripAstroScripts: true });
  const base2 = `http://127.0.0.1:${port2}`;
  const page2 = await browser.newPage();
  await page2.goto(`${base2}/answers/?utm_source=y&utm_medium=social&utm_campaign=test&utm_content=slug`, { waitUntil: 'load' });
  // __dgAttributionReady may remain false; fallback should flush within ~3s and push hub_viewed without attribution
  await page2.waitForFunction(() => (window.dataLayer || []).some((e) => Array.isArray(e) && e[0] === 'event' && e[1] === 'hub_viewed'), { timeout: 3500 });
  const dl2 = await page2.evaluate(() => (window.dataLayer || []).filter((e) => Array.isArray(e) && e[0] === 'event'));
  const hv2 = dl2.find((e) => e[1] === 'hub_viewed');
  assert.ok(hv2, 'hub_viewed not sent on fallback');
  const params2 = hv2[2] || {};
  assert.ok(!('ft_source' in params2), 'fallback should not include attribution');

  await browser.close();
  server.close();
  server2.close();
});

