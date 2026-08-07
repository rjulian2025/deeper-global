#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'reports/reviewer-migration';
mkdirSync(OUT, { recursive: true });

function readCsv(path) {
  const text = readFileSync(path, 'utf8').trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(',');
  return lines.filter(Boolean).map((line) => {
    // simple parse sufficient for these files
    const values = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ',') {
        values.push(cur);
        cur = '';
      } else cur += ch;
    }
    values.push(cur);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });
    return row;
  });
}

function toCsv(rows, cols) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
}

const high = readCsv(join(OUT, 'high-confidence-assignments.csv'));
const counts = new Map();
for (const row of high) counts.set(row.proposed_contributor_id, (counts.get(row.proposed_contributor_id) || 0) + 1);

const source = JSON.parse(
  readFileSync('src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json', 'utf8')
);
const completeness = readCsv(join(OUT, 'profile-completeness.csv'));
const byId = new Map(completeness.map((r) => [r.contributor_id, r]));

const rows = source.map((c) => {
  const id = c.slug === 'alex-crenshaw' ? 'alex-crenshaw-phd' : c.slug;
  const comp = byId.get(id) || {};
  const gaps = (comp.profile_gaps || '').split('|').filter(Boolean);
  const missing_image = !c.headshotUrl;
  const missing_biography = !(c.fullBio || c.shortBio);
  const missing_credentials = !c.credentials;
  const missing_specialty_detail = !(c.specialties && c.specialties.length >= 3);
  if (missing_image) gaps.push('missing_image');
  if (missing_biography) gaps.push('missing_biography');
  if (missing_credentials) gaps.push('missing_credentials');
  if (missing_specialty_detail) gaps.push('missing_specialty_detail');

  let readiness = 'complete';
  if (comp.assignment_eligibility === 'report_only' || id === 'erin-benator') readiness = 'report_only';
  else if (missing_biography || (missing_image && id !== 'alex-crenshaw-phd')) readiness = 'incomplete';
  else if (missing_credentials) readiness = 'requires_source_correction';

  return {
    contributor_id: id,
    full_name: c.fullName,
    readiness,
    profile_status: comp.profile_status || '',
    assignment_eligibility: comp.assignment_eligibility || '',
    indexable_after_apply: readiness === 'complete' ? 'yes' : 'no',
    public_directory_after_apply:
      readiness === 'complete' && comp.assignment_eligibility === 'public' ? 'yes' : 'no',
    proposed_answer_count: counts.get(id) || 0,
    missing_image: missing_image ? 'yes' : 'no',
    missing_biography: missing_biography ? 'yes' : 'no',
    missing_credentials: missing_credentials ? 'yes' : 'no',
    missing_specialty_detail: missing_specialty_detail ? 'yes' : 'no',
    external_url: c.externalPracticeUrl,
    deeper_route: `/reviewers/${id}/`,
    route_prepared_noindex: id === 'alex-crenshaw-phd' ? 'no_existing_indexable' : 'yes',
    notes: [...new Set(gaps)].join('|'),
  };
});

const cols = [
  'contributor_id',
  'full_name',
  'readiness',
  'profile_status',
  'assignment_eligibility',
  'indexable_after_apply',
  'public_directory_after_apply',
  'proposed_answer_count',
  'missing_image',
  'missing_biography',
  'missing_credentials',
  'missing_specialty_detail',
  'external_url',
  'deeper_route',
  'route_prepared_noindex',
  'notes',
];
writeFileSync(join(OUT, 'profile-activation-readiness.csv'), toCsv(rows, cols));
console.log(
  JSON.stringify(
    {
      wrote: join(OUT, 'profile-activation-readiness.csv'),
      complete: rows.filter((r) => r.readiness === 'complete').length,
      incomplete: rows.filter((r) => r.readiness === 'incomplete').length,
      requires_source_correction: rows.filter((r) => r.readiness === 'requires_source_correction').length,
      report_only: rows.filter((r) => r.readiness === 'report_only').length,
    },
    null,
    2
  )
);
