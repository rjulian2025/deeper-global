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
        // Remove bundled Astro module scripts
        content = content.replace(/<script[^>]*src="\/_astro\/[^"]+"[^>]*><\/script>/g, '');
        // Remove any inline script (module or classic) that imports the attribution init (older heads)
        content = content.replace(/<script[^>]*>[\s\S]*?import\s+["']\.\.\/scripts\/attribution-init\.mjs["'][\s\S]*?<\/script>/gi, '');
        // Remove all inline module scripts (compiled bundles sometimes inline code without explicit imports)
        content = content.replace(/<script\s+type="module"(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '');
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
          fallback = fallback.replace(/<script[^>]*>[\s\S]*?import\s+["']\.\.\/scripts\/attribution-init\.mjs["'][\s\S]*?<\/script>/gi, '');
          fallback = fallback.replace(/<script\s+type="module"(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '');
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
  const env = {
    ...process.env,
    VERCEL_ENV: 'production',
    PUBLIC_GA4_MEASUREMENT_ID: 'G-TEST123',
    PUBLIC_INDEXABLE: 'true',
    // Avoid build-time Supabase guard meant for real CI deploys; safe for this synthetic test build
    CI: '',
    VERCEL: '',
  };
  const out = mkdtempSync(path.join(os.tmpdir(), 'dg-e2e-'));
  const res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'build', '--outDir', out], { env, cwd: process.cwd(), stdio: 'inherit' });
  assert.equal(res.status, 0, 'production build must succeed');

  // Register resource cleanups immediately so failures exit fast without hangs
  const cleanups = [];
  t.after(async () => {
    for (const fn of cleanups.reverse()) {
      try { await fn(); } catch {}
    }
  });

  const { server, port } = await startStaticServer(out);
  cleanups.push(() => new Promise((resolve) => {
    try { server.closeAllConnections?.(); } catch {}
    try { server.close(() => resolve()); } catch { resolve(); }
  }));
  const base = `http://127.0.0.1:${port}`;
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  cleanups.push(() => browser.close().catch(() => {}));
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
  // Normal path
  await page.goto(`${base}/answers/?utm_source=x&utm_medium=social&utm_campaign=test&utm_content=slug`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__dgAttributionReady === true, { timeout: 5000 });
  const dl1 = await page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e)).filter((e) => e[0] === 'event'));
  const hv1 = dl1.filter((e) => e[1] === 'hub_viewed');
  assert.equal(hv1.length, 1, 'hub_viewed must be sent exactly once on normal path');
  assert.ok(hv1[0][2] && hv1[0][2].ft_source === 'x', 'hub_viewed missing ft_source on normal path');
  // pagehide should not overwrite attribution
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.evaluate(() => window.deeperTrackEvent('hub_viewed', {}));
  const dl1b = await page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e)).filter((e) => e[0] === 'event' && e[1] === 'hub_viewed'));
  assert.ok(dl1b[dl1b.length - 1][2] && dl1b[dl1b.length - 1][2].ft_source === 'x', 'attribution lost after pagehide');

  // Fallback path: serve HTML with Astro module scripts stripped so init never runs
  const { server: server2, port: port2 } = await startStaticServer(out, { stripAstroScripts: true });
  cleanups.push(() => new Promise((resolve) => {
    try { server2.closeAllConnections?.(); } catch {}
    try { server2.close(() => resolve()); } catch { resolve(); }
  }));
  const base2 = `http://127.0.0.1:${port2}`;
  const page2 = await browser.newPage();
  await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
  await page2.goto(`${base2}/answers/?utm_source=y&utm_medium=social&utm_campaign=test&utm_content=slug`, { waitUntil: 'load' });
  // Ensure no leftover storage on fallback origin
  await page2.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} });
  // __dgAttributionReady may remain false; fallback should flush within ~3s and push hub_viewed without attribution
  await page2.waitForFunction(() => (window.dataLayer || []).some((e) => Array.from(e)[0] === 'event' && Array.from(e)[1] === 'hub_viewed'), { timeout: 3500 });
  const dl2 = await page2.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e)).filter((e) => e[0] === 'event'));
  const hv2 = dl2.find((e) => e[1] === 'hub_viewed');
  assert.ok(hv2, 'hub_viewed not sent on fallback');
  const params2 = hv2[2] || {};
  assert.ok(!('ft_source' in params2), 'fallback should not include attribution');
  // browser and servers will be closed by t.after() cleanup
});

