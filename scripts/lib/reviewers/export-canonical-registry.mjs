#!/usr/bin/env node
/**
 * Export canonical reviewer/contributor registry JSON for API consumption.
 * Replaces the stale hardcoded map in api/lib/answer-api.mjs.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const outPath = join(root, 'api/lib/reviewers-canonical.json');

const SITE_URL = 'https://www.deeper.global';

function main() {
  // Existing static profiles (subset fields) + Peachtree contributors.
  const source = JSON.parse(
    readFileSync(join(root, 'src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json'), 'utf8')
  );

  const profiles = {
    'rick-julian': {
      id: 'rick-julian',
      name: 'Rick Julian',
      specialty_label: 'Spirituality & Meaning',
      profile_url: `${SITE_URL}/reviewers/rick-julian/`,
      trust_role_label: 'Editorial Reviewer',
      attribution_role: 'editorialReviewer',
    },
    'alex-crenshaw-phd': {
      id: 'alex-crenshaw-phd',
      name: 'Dr. Alex Crenshaw, PhD',
      specialty_label: 'Adult ADHD Testing & Psychological Evaluation',
      profile_url: `${SITE_URL}/reviewers/alex-crenshaw-phd/`,
      trust_role_label: 'Clinical Reviewer',
      attribution_role: 'clinicalReviewer',
      practice_id: 'peachtree-psychology',
      practice_name: 'Peachtree Psychology',
      practice_profile_url: `${SITE_URL}/organizations/peachtree-psychology/`,
    },
    'michelle-morris-lpc': {
      id: 'michelle-morris-lpc',
      name: 'Michelle Morris, LPC, LPCC',
      specialty_label: 'Imago Couples Therapy & Neuroscience-Informed Relationships',
      profile_url: `${SITE_URL}/reviewers/michelle-morris-lpc/`,
      trust_role_label: 'Clinical Reviewer',
      attribution_role: 'clinicalReviewer',
    },
    'kenneth-w-christian-phd': {
      id: 'kenneth-w-christian-phd',
      name: 'Kenneth W. Christian, PhD',
      specialty_label: 'Performance, Purpose & Self-Limiting Patterns',
      profile_url: `${SITE_URL}/reviewers/kenneth-w-christian-phd/`,
      trust_role_label: 'Clinical contributor',
      attribution_role: 'clinicalContributor',
    },
    // Legacy alias: same person display, misnamed ID
    'david-k-gore-phd': {
      id: 'david-k-gore-phd',
      name: 'Kenneth W. Christian, PhD',
      specialty_label: 'Addiction & Recovery',
      profile_url: `${SITE_URL}/reviewers/david-k-gore-phd/`,
      trust_role_label: 'Clinical contributor',
      attribution_role: 'clinicalContributor',
      canonical_id: 'kenneth-w-christian-phd',
      identity_status: 'legacy_alias_misnamed',
    },
  };

  for (const row of source) {
    const id = row.slug === 'alex-crenshaw' ? 'alex-crenshaw-phd' : row.slug;
    if (profiles[id]) continue;
    profiles[id] = {
      id,
      name: row.fullName,
      specialty_label: (row.specialties || []).slice(0, 2).join(' · ') || row.professionalTitle,
      profile_url: row.externalPracticeUrl,
      trust_role_label: 'Clinical contributor',
      attribution_role: 'clinicalContributor',
      practice_id: 'peachtree-psychology',
      practice_name: 'Peachtree Psychology',
      practice_profile_url: `${SITE_URL}/organizations/peachtree-psychology/`,
      deeper_profile_activated: false,
    };
  }

  const aliases = {
    'david-k-gore-phd': 'david-k-gore-phd',
    'david k gore phd': 'david-k-gore-phd',
    'david k. gore phd': 'david-k-gore-phd',
    'david k. gore, phd': 'david-k-gore-phd',
    'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
    'kenneth w christian phd': 'kenneth-w-christian-phd',
    'kenneth w. christian phd': 'kenneth-w-christian-phd',
    'kenneth w. christian, phd': 'kenneth-w-christian-phd',
    'alex-crenshaw-phd': 'alex-crenshaw-phd',
    'alex crenshaw phd': 'alex-crenshaw-phd',
    'alex crenshaw, phd': 'alex-crenshaw-phd',
    'dr. alex crenshaw, phd': 'alex-crenshaw-phd',
    'dr. alex crenshaw phd': 'alex-crenshaw-phd',
    'rick-julian': 'rick-julian',
    'rick julian': 'rick-julian',
    'michelle-morris-lpc': 'michelle-morris-lpc',
    'michelle morris lpc': 'michelle-morris-lpc',
    'michelle morris lpc lpcc': 'michelle-morris-lpc',
    'michelle morris, lpc': 'michelle-morris-lpc',
    'michelle morris, lpc, lpcc': 'michelle-morris-lpc',
  };

  writeFileSync(
    outPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        source: 'scripts/lib/reviewers/export-canonical-registry.mjs',
        profiles,
        aliases,
      },
      null,
      2
    ) + '\n'
  );
  console.log(JSON.stringify({ wrote: outPath, profile_count: Object.keys(profiles).length }, null, 2));
}

main();
