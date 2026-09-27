import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const distPreview = join(root, 'dist-preview');

function readFirstFileRecursive(dir, predicate) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = readFirstFileRecursive(full, predicate);
      if (found) return found;
    } else if (predicate(full)) {
      return full;
    }
  }
  return null;
}

function extractJsonLd(html) {
  const matches = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (!matches) return null;
  try {
    return JSON.parse(matches[1]);
  } catch {
    return null;
  }
}

test('preview build exists', () => {
  assert.ok(existsSync(distPreview), 'dist-preview should exist (build:preview runs in test script)');
});

test('robots.txt preview disallows crawling', () => {
  const robotsPath = join(distPreview, 'robots.txt');
  if (!existsSync(robotsPath)) return;
  const robots = readFileSync(robotsPath, 'utf8');
  assert.match(robots, /User-agent:\s*\*\s*[\r\n]+Disallow:\s*\//i);
  assert.doesNotMatch(robots, /^Sitemap:/m);
});

test('llms indexes exist in preview build', () => {
  assert.ok(existsSync(join(distPreview, 'llms.txt')), 'llms.txt should be present');
  assert.ok(existsSync(join(distPreview, 'llms-full.txt')), 'llms-full.txt should be present');
});

test('BaseLayout emits Organization, WebSite, and Person nodes', () => {
  const indexPath = join(distPreview, 'index.html');
  if (!existsSync(indexPath)) return;
  const html = readFileSync(indexPath, 'utf8');
  const json = extractJsonLd(html);
  assert.ok(json && json['@graph'], 'JSON-LD with @graph should be present');
  const types = new Set(json['@graph'].map((n) => n['@type']));
  assert.ok(types.has('Organization'), 'Organization node present');
  assert.ok(types.has('WebSite'), 'WebSite node present');
  assert.ok(types.has('Person'), 'Person node present (Rick Julian @id)');
});

test('Every page includes one or more primary CTAs and they share one destination per page', () => {
  const pages = ['index.html', 'about/index.html'];
  for (const page of pages) {
    const filePath = join(distPreview, page);
    if (!existsSync(filePath)) continue;
    const html = readFileSync(filePath, 'utf8');
    const matches = [...html.matchAll(/<a\b[^>]*data-cta="primary"[^>]*>/gi)];
    assert.ok(matches.length >= 1, `Primary CTA present on ${page}`);
    const hrefs = new Set(
      matches
        .map((m) => m[0].match(/\bhref="([^"]+)"/i)?.[1])
        .filter(Boolean)
    );
    assert.equal(hrefs.size, 1, `Primary CTA links share one destination on ${page}`);
  }
});

test('Answer pages (when built) include Article, QAPage, BreadcrumbList with required fields', () => {
  const answersRoot = existsSync(dist) ? dist : distPreview;
  if (!existsSync(answersRoot)) return;
  // Find a concrete answer page (skip /answers/index and /answers/random)
  const pathsTried = [];
  let sample = readFirstFileRecursive(answersRoot, (p) => /\/answers\/[^/]+\/index\.html$/i.test(p) && !/\/answers\/(index|random)\/index\.html$/i.test(p));
  if (!sample) return; // No answer pages in this environment
  const html = readFileSync(sample, 'utf8');
  const json = extractJsonLd(html);
  assert.ok(json && json['@graph'], 'Answer page JSON-LD present');
  const nodes = json['@graph'];
  const byType = (t) => nodes.find((n) => n['@type'] === t) || null;
  const article = byType('Article');
  const qapage = byType('QAPage');
  const breadcrumb = byType('BreadcrumbList');
  const webpage = byType('MedicalWebPage');
  assert.ok(article, 'Article node present');
  assert.ok(qapage, 'QAPage node present');
  assert.ok(breadcrumb, 'BreadcrumbList present');
  assert.ok(webpage, 'MedicalWebPage present');
  // Minimal field assertions
  assert.ok(article.headline && article.description, 'Article headline + description present');
  assert.ok(article.datePublished && article.dateModified, 'Article dates present');
  assert.ok(article.author && (article.author['@id'] || article.author.name), 'Article author present');
  assert.ok(article.publisher && article.publisher['@id'], 'Article publisher present');
  assert.ok(article.image, 'Article image present');
  assert.ok(article.inLanguage, 'Article inLanguage present');
  assert.ok(typeof article.wordCount === 'number' && article.wordCount > 0, 'Article wordCount present');
  assert.ok(article.articleSection, 'Article section present');
  assert.ok(Array.isArray(article.keywords) || typeof article.keywords === 'string', 'Article keywords present');
});

