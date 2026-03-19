/**
 * Custom Vite plugin: Generate static HTML shell files for each route.
 * 
 * At build time, this creates individual HTML files for each public route
 * (e.g., dist/answers/branding-vs-marketing/index.html) containing:
 * - Route-specific <title> and <meta description>
 * - <noscript> content with key text for crawlers
 * - The same SPA entry point script
 * 
 * This gives Google an HTML file to index for each URL without requiring
 * Puppeteer or headless Chrome — just static file generation.
 */

import type { Plugin } from 'vite';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}

export function generateHtmlShells(routes: RouteMeta[]): Plugin {
  return {
    name: 'generate-html-shells',
    apply: 'build',
    closeBundle() {
      const distDir = join(process.cwd(), 'dist');
      let templateHtml: string;
      
      try {
        templateHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
      } catch {
        console.warn('[generate-html-shells] Could not read dist/index.html, skipping shell generation');
        return;
      }

      let generated = 0;

      for (const route of routes) {
        // Skip homepage — already has index.html
        if (route.path === '/') continue;
        // Skip noindex routes
        if (route.noindex) continue;

        const routePath = route.path.replace(/^\//, '');
        const outputDir = join(distDir, routePath);
        const outputFile = join(outputDir, 'index.html');

        // Generate route-specific HTML by replacing meta tags in the template
        let html = templateHtml;

        // Replace title
        html = html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${escapeHtml(route.title)}</title>`
        );

        // Replace meta description
        html = html.replace(
          /<meta name="description" content="[^"]*"/,
          `<meta name="description" content="${escapeHtml(route.description)}"`
        );

        // Replace canonical URL
        html = html.replace(
          /<link rel="canonical" href="[^"]*"/,
          `<link rel="canonical" href="https://www.qvbrands.com${route.path}"`
        );

        // Replace OG tags
        html = html.replace(
          /<meta property="og:url" content="[^"]*"/,
          `<meta property="og:url" content="https://www.qvbrands.com${route.path}"`
        );
        html = html.replace(
          /<meta property="og:title" content="[^"]*"/,
          `<meta property="og:title" content="${escapeHtml(route.title)}"`
        );
        html = html.replace(
          /<meta property="og:description" content="[^"]*"/,
          `<meta property="og:description" content="${escapeHtml(route.description)}"`
        );

        // Replace Twitter tags
        html = html.replace(
          /<meta name="twitter:title" content="[^"]*"/,
          `<meta name="twitter:title" content="${escapeHtml(route.title)}"`
        );
        html = html.replace(
          /<meta name="twitter:description" content="[^"]*"/,
          `<meta name="twitter:description" content="${escapeHtml(route.description)}"`
        );

        // Add noscript content for crawlers that don't execute JS
        html = html.replace(
          '<div id="root"></div>',
          `<div id="root"></div>\n    <noscript><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p><p><a href="https://www.qvbrands.com">QV BRANDS</a> — Strategic brand consultancy by Rick Julian.</p></noscript>`
        );

        try {
          mkdirSync(outputDir, { recursive: true });
          writeFileSync(outputFile, html, 'utf-8');
          generated++;
        } catch (err) {
          console.warn(`[generate-html-shells] Failed to write ${outputFile}:`, err);
        }
      }

      console.log(`[generate-html-shells] Generated ${generated} static HTML shells`);
    },
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
