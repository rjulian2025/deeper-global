import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = 'https://www.deeper.global';

export const PATH_BUCKETS = [
  { id: 'answer-detail', label: 'Answer pages', test: (path) => /^\/answers\/[^/]+\/?$/.test(path) && path !== '/answers/' },
  { id: 'answers-index', label: 'Answers library', test: (path) => path === '/answers/' || path.startsWith('/answers/page/') },
  { id: 'design-evolution', label: 'Design prototypes', test: (path) => path.startsWith('/design-evolution/') },
  { id: 'answers-random', label: 'Random answer', test: (path) => path.startsWith('/answers/random') },
  { id: 'categories', label: 'Category hubs', test: (path) => path.startsWith('/categories/') },
  { id: 'entities', label: 'Entity hubs', test: (path) => path.startsWith('/entities/') },
  { id: 'themes', label: 'Themes directory', test: (path) => path.startsWith('/themes/') },
  { id: 'modalities', label: 'Modalities', test: (path) => path.startsWith('/modalities/') },
  { id: 'weather-map', label: 'Weather map', test: (path) => path.startsWith('/weather-map') },
  { id: 'home', label: 'Homepage', test: (path) => path === '/' },
  { id: 'other', label: 'Other', test: () => true },
];

/** GSC export filenames or folder names → normalized reason slug */
export const REASON_ALIASES = {
  'crawled-not-indexed': 'crawled_not_indexed',
  'crawled_not_indexed': 'crawled_not_indexed',
  'discovered-currently-not-indexed': 'discovered_not_indexed',
  'discovered-not-indexed': 'discovered_not_indexed',
  'duplicate-google-canonical': 'duplicate_canonical',
  'duplicate-without-user-selected-canonical': 'duplicate_canonical',
  'duplicate-canonical': 'duplicate_canonical',
  'page-with-redirect': 'redirect',
  'redirect': 'redirect',
  'soft-404': 'soft_404',
  'not-found-404': 'not_found',
  'blocked-by-robots': 'blocked_robots',
  'indexed': 'indexed',
  'indexed-not-in-sitemap': 'indexed_not_in_sitemap',
  'submitted-and-indexed': 'indexed',
};

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((cell) => cell.trim());
  const urlColumn = headers.findIndex((header) => /^url$|^page$/i.test(header));
  const statusColumn = headers.findIndex((header) => /status|reason|indexing/i.test(header));
  const lastCrawledColumn = headers.findIndex((header) => /last crawled|last crawl/i.test(header));

  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const url = cells[urlColumn >= 0 ? urlColumn : 0]?.trim() ?? '';
    return {
      url,
      status: statusColumn >= 0 ? cells[statusColumn]?.trim() ?? '' : '',
      lastCrawled: lastCrawledColumn >= 0 ? cells[lastCrawledColumn]?.trim() ?? '' : cells[1]?.trim() ?? '',
    };
  });

  return { headers, rows: rows.filter((row) => row.url) };
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

export function normalizeSiteUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  try {
    const url = new URL(raw.replace(/^https:\/\/deeper\.global/i, SITE));
    if (!/deeper\.global/i.test(url.hostname)) return null;

    let pathname = decodeURIComponent(url.pathname);
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      pathname = `${pathname}/`;
    }

    url.pathname = pathname;
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

export function pathnameFromUrl(value) {
  const normalized = normalizeSiteUrl(value);
  if (!normalized) return null;
  return new URL(normalized).pathname;
}

export function bucketForPath(pathname) {
  for (const bucket of PATH_BUCKETS) {
    if (bucket.id === 'other') continue;
    if (bucket.test(pathname)) return bucket.id;
  }
  return 'other';
}

export function inferReasonFromPath(filePath) {
  const parts = filePath.split(/[/\\]/).map((part) => part.toLowerCase());
  for (const part of parts) {
    const normalized = part.replace(/\.csv$/i, '').replace(/^table$/i, '');
    if (REASON_ALIASES[normalized]) return REASON_ALIASES[normalized];
  }

  for (const [alias, reason] of Object.entries(REASON_ALIASES)) {
    if (filePath.toLowerCase().includes(alias)) return reason;
  }

  return 'unknown';
}

export function discoverCsvFiles(dir) {
  const files = [];

  function walk(current) {
    if (!existsSync(current)) return;

    for (const entry of readdirSync(current)) {
      const fullPath = join(current, entry);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (/\.csv$/i.test(entry)) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files.sort();
}

export function loadCoverageSources({ dir, csvFiles = [] }) {
  const sources = [];

  for (const filePath of csvFiles) {
    sources.push({ filePath, reason: inferReasonFromPath(filePath) });
  }

  if (dir) {
    for (const filePath of discoverCsvFiles(dir)) {
      if (sources.some((source) => source.filePath === filePath)) continue;
      sources.push({ filePath, reason: inferReasonFromPath(filePath) });
    }
  }

  return sources;
}

export function buildCoverageReport({ sources, generatedAt = new Date().toISOString() }) {
  const byReason = {};
  const byBucket = Object.fromEntries(PATH_BUCKETS.map((bucket) => [bucket.id, {}]));
  const urlsSeen = new Set();
  const rows = [];

  for (const source of sources) {
    const parsed = parseCsv(readFileSync(source.filePath, 'utf8'));
    const reason = source.reason;

    if (!byReason[reason]) {
      byReason[reason] = { count: 0, files: [], sample: [] };
    }

    byReason[reason].files.push(source.filePath);

    for (const row of parsed.rows) {
      const normalizedUrl = normalizeSiteUrl(row.url);
      if (!normalizedUrl) continue;

      const pathname = new URL(normalizedUrl).pathname;
      const bucket = bucketForPath(pathname);
      const dedupeKey = `${reason}|${normalizedUrl}`;

      if (urlsSeen.has(dedupeKey)) continue;
      urlsSeen.add(dedupeKey);

      byReason[reason].count += 1;
      if (byReason[reason].sample.length < 5) {
        byReason[reason].sample.push({ url: normalizedUrl, pathname, lastCrawled: row.lastCrawled });
      }

      byBucket[bucket][reason] = (byBucket[bucket][reason] ?? 0) + 1;
      byBucket[bucket].total = (byBucket[bucket].total ?? 0) + 1;

      rows.push({
        url: normalizedUrl,
        pathname,
        bucket,
        reason,
        lastCrawled: row.lastCrawled,
        sourceFile: source.filePath,
      });
    }
  }

  const hygiene = buildHygieneNotes({ byReason, byBucket, rows });

  return {
    version: 'gsc-index-coverage-v1',
    generated_at: generatedAt,
    site: SITE,
    source_files: sources.map((source) => ({ path: source.filePath, reason: source.reason })),
    totals: {
      urls: rows.length,
      reasons: Object.keys(byReason).length,
      source_files: sources.length,
    },
    by_reason: byReason,
    by_bucket: byBucket,
    hygiene,
    rows,
  };
}

function buildHygieneNotes({ byReason, byBucket, rows }) {
  const notes = [];

  const prototypeCount =
    (byBucket['design-evolution']?.total ?? 0) + (byBucket['answers-random']?.total ?? 0);
  if (prototypeCount > 0) {
    notes.push({
      id: 'prototype-urls-in-coverage',
      severity: 'info',
      message: `${prototypeCount} design-evolution or random-answer URLs appear in GSC indexing exports. These are noindex and now excluded from sitemap.xml.`,
      count: prototypeCount,
    });
  }

  const hubIndexed =
    (byReason.indexed?.count ?? 0) > 0
      ? rows.filter((row) => row.reason === 'indexed' && ['categories', 'entities', 'themes'].includes(row.bucket)).length
      : 0;
  if (hubIndexed > 0) {
    notes.push({
      id: 'hub-pages-indexed',
      severity: 'watch',
      message: `${hubIndexed} category/entity/theme hub URLs are marked indexed while site policy keeps them noindex. Verify canonicals and whether legacy URLs need redirects after seasoning.`,
      count: hubIndexed,
    });
  }

  const answerCrawledNotIndexed = rows.filter(
    (row) => row.bucket === 'answer-detail' && row.reason === 'crawled_not_indexed'
  ).length;
  if (answerCrawledNotIndexed > 0) {
    notes.push({
      id: 'answers-crawled-not-indexed',
      severity: 'action',
      message: `${answerCrawledNotIndexed} answer URLs are crawled but not indexed. Prioritize reviewed answers with enrichment before changing URL structure.`,
      count: answerCrawledNotIndexed,
    });
  }

  const duplicateCanonical = rows.filter((row) => row.reason === 'duplicate_canonical').length;
  if (duplicateCanonical > 0) {
    notes.push({
      id: 'duplicate-canonical',
      severity: 'watch',
      message: `${duplicateCanonical} URLs flagged as duplicate canonical in GSC. Do not add redirects during seasoning unless URLs 404.`,
      count: duplicateCanonical,
    });
  }

  if (rows.length === 0) {
    notes.push({
      id: 'no-data',
      severity: 'info',
      message: 'No URLs parsed. Export Page indexing tables from GSC into reports/gsc-indexing/{date}/ and re-run.',
      count: 0,
    });
  }

  return notes;
}

export function reportToMarkdown(report) {
  const lines = [
    '# GSC Index Coverage Summary',
    '',
    `Generated: ${report.generated_at}`,
    '',
    'Ingest GSC **Page indexing** CSV exports weekly before hygiene or sitemap policy changes.',
    '',
    '## Totals',
    '',
    `- URLs parsed: **${report.totals.urls}**`,
    `- Source files: **${report.totals.source_files}**`,
    `- Reason buckets: **${report.totals.reasons}**`,
    '',
    '## By indexing reason',
    '',
    '| Reason | Count | Sample |',
    '|---|---:|---|',
  ];

  for (const [reason, data] of Object.entries(report.by_reason).sort((a, b) => b[1].count - a[1].count)) {
    const sample = data.sample[0]?.pathname ?? '—';
    lines.push(`| ${reason} | ${data.count} | ${sample} |`);
  }

  lines.push('', '## By site section', '', '| Section | Total | Top reason |', '|---|---:|---|');

  for (const bucket of PATH_BUCKETS) {
    const data = report.by_bucket[bucket.id] ?? {};
    const total = data.total ?? 0;
    if (!total) continue;

    const reasons = Object.entries(data)
      .filter(([key]) => key !== 'total')
      .sort((a, b) => b[1] - a[1]);
    const topReason = reasons[0]?.[0] ?? '—';
    lines.push(`| ${bucket.label} | ${total} | ${topReason} |`);
  }

  if (report.hygiene.length) {
    lines.push('', '## Hygiene notes', '');
    for (const note of report.hygiene) {
      lines.push(`- **${note.severity.toUpperCase()}** — ${note.message}`);
    }
  }

  if (report.source_files.length) {
    lines.push('', '## Source files', '');
    for (const source of report.source_files) {
      lines.push(`- \`${source.path}\` (${source.reason})`);
    }
  }

  lines.push(
    '',
    '## Next step',
    '',
    'Run `npm run seo:priority` after exports are in place to rank answer URLs for enrichment.',
    ''
  );

  return `${lines.join('\n')}\n`;
}

export function writeCoverageReport(report, outDir) {
  mkdirSync(outDir, { recursive: true });
  const jsonPath = join(outDir, 'coverage-summary.json');
  const mdPath = join(outDir, 'coverage-summary.md');
  const csvPath = join(outDir, 'coverage-urls.csv');

  const slim = {
    ...report,
    rows: report.rows.map(({ url, pathname, bucket, reason, lastCrawled }) => ({
      url,
      pathname,
      bucket,
      reason,
      lastCrawled,
    })),
  };
  writeFileSync(jsonPath, `${JSON.stringify(slim, null, 2)}\n`);
  writeFileSync(mdPath, reportToMarkdown(report));

  const csvLines = ['url,pathname,bucket,reason,last_crawled'];
  for (const row of report.rows) {
    const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    csvLines.push([row.url, row.pathname, row.bucket, row.reason, row.lastCrawled].map(escape).join(','));
  }
  writeFileSync(csvPath, `${csvLines.join('\n')}\n`);

  return { jsonPath, mdPath, csvPath };
}

export function defaultReportDir(dateLabel) {
  return join('reports', 'gsc-indexing', dateLabel);
}

export function readmeForEmptyDir(dir) {
  return `# GSC Index Coverage exports

Drop Google Search Console **Page indexing** CSV exports here, then run:

\`\`\`bash
npm run seo:gsc-coverage -- --dir ${dir}
\`\`\`

Suggested export folders (names are flexible):

- \`crawled-not-indexed/Table.csv\`
- \`duplicate-google-canonical/Table.csv\`
- \`indexed/Table.csv\`
- \`discovered-not-indexed/Table.csv\`

Outputs are written to \`coverage-summary.json\`, \`coverage-summary.md\`, and \`coverage-urls.csv\` in this directory.
`;
}
