import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const REPORT_DIR = 'reports/gsc-indexing/2026-05-05';
const OUT_DIR = `${REPORT_DIR}/priority`;
const SITEMAP_PATH = '/tmp/deeper-sitemap-0.xml';
const SITE = 'https://www.deeper.global';

const GSC_FILES = {
  duplicateCanonical: `${REPORT_DIR}/extracted/duplicate-google-canonical/Table.csv`,
  crawledNotIndexed: `${REPORT_DIR}/extracted/crawled-not-indexed/Table.csv`,
  soft404: `${REPORT_DIR}/extracted/soft-404/Table.csv`,
};

const highIntentPatterns = [
  'therapy',
  'therapist',
  'professional-help',
  'treatment',
  'medication',
  'depression',
  'anxiety',
  'panic',
  'trauma',
  'ptsd',
  'suicid',
  'self-harm',
  'addiction',
  'recovery',
  'ocd',
  'checking',
  'intrusive',
  'sleep',
  'burnout',
  'relationship',
  'divorce',
  'abusive',
  'gaslighting',
  'adhd',
  'autistic',
];

const sensitivePatterns = [
  'suicid',
  'self-harm',
  'trauma',
  'ptsd',
  'abusive',
  'abuse',
  'addiction',
  'relapse',
  'pregnant',
  'pregnancy',
  'medication',
  'antidepressant',
  'panic',
  'depression',
  'intrusive-sexual',
];

const commercialCarePatterns = [
  'therapy',
  'therapist',
  'treatment',
  'professional-help',
  'first-therapy-session',
  'cant-afford-treatment',
  'medication',
  'inpatient',
  'outpatient',
];

const genericSimilarityPatterns = [
  'why-do-i-feel-like',
  'how-do-i-deal-with-feeling-like',
  'how-do-i-stop-feeling-like',
  'what-should-i-do-if',
  'what-if',
  'how-do-i-know-if',
];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  return lines.slice(1).map((line) => {
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

    return {
      url: cells[0],
      lastCrawled: cells[1],
    };
  });
}

function readRows(path) {
  return parseCsv(readFileSync(path, 'utf8'));
}

function normalizeUrl(value) {
  const url = new URL(value.replace(/^https:\/\/deeper\.global/, SITE));

  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname = `${url.pathname}/`;
  }

  url.search = '';
  url.hash = '';
  return url.toString();
}

function slugFromUrl(url) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? '';
}

function titleFromSlug(slug) {
  return slug
    .replace(/-\d{6}-\d{3}$/g, '')
    .replace(/-[a-z]\d[a-z]\d[a-z]\d$/i, '')
    .replace(/-[a-z]\d[a-z]\d$/i, '')
    .replace(/-\d+$/g, '')
    .split('-')
    .filter(Boolean)
    .map((word) => {
      if (['ai', 'adhd', 'ptsd', 'ocd'].includes(word)) return word.toUpperCase();
      if (word === 'im') return "I'm";
      if (word === 'dont') return "don't";
      if (word === 'cant') return "can't";
      if (word === 'isnt') return "isn't";
      if (word === 'whats') return "what's";
      return word;
    })
    .join(' ');
}

function hasPattern(slug, patterns) {
  return patterns.some((pattern) => slug.includes(pattern));
}

function topicBucket(slug) {
  if (/suicid|self-harm|crisis/.test(slug)) return 'Crisis / Safety';
  if (/trauma|ptsd|trigger|flashback|abuse|abusive/.test(slug)) return 'Trauma / Safety';
  if (/addiction|recovery|relapse|substance|drinking|sober/.test(slug)) return 'Addiction / Recovery';
  if (/therapy|therapist|treatment|professional-help|medication|antidepressant|inpatient|outpatient/.test(slug)) return 'Therapy / Care';
  if (/anxiety|panic|stress|overthinking|worry|checking|intrusive/.test(slug)) return 'Anxiety / OCD';
  if (/depression|depressed|pointless|empty|numb|fog/.test(slug)) return 'Depression';
  if (/relationship|partner|marriage|divorce|dating|ex-|gaslighting|cheating/.test(slug)) return 'Relationships';
  if (/sleep|night|2am|nightmares/.test(slug)) return 'Sleep';
  if (/work|career|job|burnout|boss|workplace|ai/.test(slug)) return 'Work / Burnout';
  if (/adhd|autis|neurodiverg/.test(slug)) return 'Neurodivergence';
  return 'General Self-Understanding';
}

function scoreAnswer({ url, gscStatus }) {
  const slug = slugFromUrl(url);
  const reasons = [];
  let score = 0;

  if (gscStatus.has('duplicateCanonical')) {
    score += 100;
    reasons.push('GSC duplicate canonical');
  }

  if (gscStatus.has('crawledNotIndexed')) {
    score += 60;
    reasons.push('GSC crawled but not indexed');
  }

  if (hasPattern(slug, sensitivePatterns)) {
    score += 25;
    reasons.push('safety-sensitive topic');
  }

  if (hasPattern(slug, commercialCarePatterns)) {
    score += 20;
    reasons.push('care-seeking / referral-intent topic');
  }

  if (hasPattern(slug, highIntentPatterns)) {
    score += 15;
    reasons.push('high-intent mental-health topic');
  }

  if (hasPattern(slug, genericSimilarityPatterns)) {
    score += 12;
    reasons.push('generic title pattern / similarity risk');
  }

  if (slug.length > 70 || /-\d{6}-\d{3}|-[a-z]\d[a-z]\d[a-z]\d/i.test(slug)) {
    score += 8;
    reasons.push('prototype-style slug');
  }

  return {
    url,
    slug,
    score,
    topic: topicBucket(slug),
    titleGuess: titleFromSlug(slug),
    gscStatus: [...gscStatus].join('; ') || 'submitted canonical',
    reasons: reasons.join('; '),
  };
}

function toCsv(rows) {
  const headers = ['score', 'topic', 'slug', 'url', 'title_guess', 'gsc_status', 'reasons'];
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  return [
    headers.join(','),
    ...rows.map((row) =>
      [
        row.score,
        row.topic,
        row.slug,
        row.url,
        row.titleGuess,
        row.gscStatus,
        row.reasons,
      ]
        .map(escape)
        .join(',')
    ),
  ].join('\n');
}

function toMarkdown(rows, stats) {
  const lines = [
    '# Deeper Global Indexation Priority Score',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This report ranks canonical answer URLs by likely SEO leverage. It combines current sitemap URLs with GSC exclusion buckets and topic-risk heuristics. It is designed to decide what to enrich first, not to replace editorial judgment.',
    '',
    '## Summary',
    '',
    `- Canonical sitemap answers scored: ${stats.totalAnswers}`,
    `- Duplicate-canonical answers: ${stats.duplicateCanonical}`,
    `- Crawled-not-indexed canonical answers: ${stats.crawledNotIndexed}`,
    `- Priority 1 candidates: ${stats.p1}`,
    `- Priority 2 candidates: ${stats.p2}`,
    '',
    '## Priority Bands',
    '',
    '- P1: score 100+. Immediate enrichment/review before validation.',
    '- P2: score 80-99. Strong next cohort for content uniqueness and internal linking.',
    '- P3: score 60-79. Crawled-not-indexed candidates; enrich after P1/P2.',
    '',
    '## Top 75',
    '',
    '| Rank | Score | Topic | Slug | GSC status | Why |',
    '|---:|---:|---|---|---|---|',
  ];

  rows.slice(0, 75).forEach((row, index) => {
    lines.push(
      `| ${index + 1} | ${row.score} | ${row.topic} | ${row.slug} | ${row.gscStatus} | ${row.reasons} |`
    );
  });

  const byTopic = new Map();
  for (const row of rows) byTopic.set(row.topic, (byTopic.get(row.topic) ?? 0) + 1);

  lines.push('', '## Top Candidate Counts By Topic', '');
  [...byTopic.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => lines.push(`- ${topic}: ${count}`));

  lines.push(
    '',
    '## Recommended Workflow',
    '',
    '1. Enrich and manually review all P1 pages.',
    '2. Add contextual internal links from high-authority hubs to those P1 pages.',
    '3. Validate duplicate-canonical only after P1 pages are materially more distinct.',
    '4. Move to P2 pages by topic cohort, starting with Therapy / Care, Anxiety / OCD, Depression, and Trauma / Safety.',
    '5. Re-run this report after every GSC export refresh.'
  );

  return `${lines.join('\n')}\n`;
}

const sitemap = (readFileSync(SITEMAP_PATH, 'utf8').match(/<loc>([^<]+)<\/loc>/g) ?? [])
  .map((loc) => loc.replace(/<\/?loc>/g, ''))
  .map(normalizeUrl);
const answerUrls = sitemap.filter((url) => new URL(url).pathname.startsWith('/answers/') && !new URL(url).pathname.includes('/page/'));

const statusByUrl = new Map(answerUrls.map((url) => [url, new Set()]));

const duplicateRows = readRows(GSC_FILES.duplicateCanonical);
for (const row of duplicateRows) {
  const url = normalizeUrl(row.url);
  if (!statusByUrl.has(url)) statusByUrl.set(url, new Set());
  statusByUrl.get(url).add('duplicateCanonical');
}

const crawledRows = readRows(GSC_FILES.crawledNotIndexed);
for (const row of crawledRows) {
  if (!row.url.includes('/answers/')) continue;
  const url = normalizeUrl(row.url);
  if (!statusByUrl.has(url)) continue;
  statusByUrl.get(url).add('crawledNotIndexed');
}

const rows = [...statusByUrl.entries()]
  .filter(([url]) => answerUrls.includes(url))
  .map(([url, gscStatus]) => scoreAnswer({ url, gscStatus }))
  .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

const stats = {
  totalAnswers: rows.length,
  duplicateCanonical: rows.filter((row) => row.gscStatus.includes('duplicateCanonical')).length,
  crawledNotIndexed: rows.filter((row) => row.gscStatus.includes('crawledNotIndexed')).length,
  p1: rows.filter((row) => row.score >= 100).length,
  p2: rows.filter((row) => row.score >= 80 && row.score < 100).length,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/indexation-priority.csv`, `${toCsv(rows)}\n`);
writeFileSync(`${OUT_DIR}/indexation-priority.md`, toMarkdown(rows, stats));
writeFileSync(`${OUT_DIR}/priority-top-50-slugs.txt`, `${rows.slice(0, 50).map((row) => row.slug).join('\n')}\n`);

console.log(JSON.stringify(stats, null, 2));
