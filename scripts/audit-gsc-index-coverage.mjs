#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildCoverageReport,
  defaultReportDir,
  loadCoverageSources,
  readmeForEmptyDir,
  writeCoverageReport,
} from './lib/gsc-index-coverage.mjs';

function usage() {
  console.log(`Usage:
  npm run seo:gsc-coverage -- [--date YYYY-MM-DD] [--dir path] [--csv path ...]

Examples:
  npm run seo:gsc-coverage -- --date 2026-06-21
  npm run seo:gsc-coverage -- --dir reports/gsc-indexing/2026-06-21
  npm run seo:gsc-coverage -- --csv reports/gsc-indexing/2026-06-21/crawled-not-indexed/Table.csv

Export Page indexing tables from Google Search Console into reports/gsc-indexing/{date}/
before running hygiene or sitemap policy changes.`);
}

function parseArgs(argv) {
  const args = { date: new Date().toISOString().slice(0, 10), dir: null, csvFiles: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--date') {
      args.date = argv[index + 1] ?? args.date;
      index += 1;
    } else if (arg === '--dir') {
      args.dir = argv[index + 1] ?? null;
      index += 1;
    } else if (arg === '--csv') {
      const filePath = argv[index + 1];
      if (filePath) args.csvFiles.push(filePath);
      index += 1;
    }
  }

  if (!args.dir && args.csvFiles.length === 0) {
    args.dir = defaultReportDir(args.date);
  }

  return args;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const outDir = args.dir ?? defaultReportDir(args.date);

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'README.md'), readmeForEmptyDir(outDir));
  console.error(`Created ${outDir} with README.md — add GSC CSV exports and re-run.`);
  process.exit(1);
}

const sources = loadCoverageSources({ dir: args.csvFiles.length ? null : outDir, csvFiles: args.csvFiles });

if (!sources.length) {
  writeFileSync(join(outDir, 'README.md'), readmeForEmptyDir(outDir));
  console.error(`No CSV files found in ${outDir}. Add GSC Page indexing exports and re-run.`);
  process.exit(1);
}

const report = buildCoverageReport({ sources });
const paths = writeCoverageReport(report, outDir);

console.log(
  JSON.stringify(
    {
      urls: report.totals.urls,
      source_files: report.totals.source_files,
      hygiene_notes: report.hygiene.length,
      outputs: paths,
    },
    null,
    2
  )
);
