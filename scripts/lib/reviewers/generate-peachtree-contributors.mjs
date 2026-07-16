#!/usr/bin/env node
/**
 * Generates src/data/clinical-contributors/peachtree.ts from verified source JSON.
 * Dry-run safe: local file generation only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const sourcePath = join(
  root,
  'src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json'
);
const outPath = join(root, 'src/data/clinical-contributors/peachtree.ts');

/** Existing Deeper-verified specialties for Alex (profile page scrape was incomplete). */
const ALEX_SUPPLEMENTAL_SPECIALTIES = [
  'Adult ADHD Testing',
  'Psychological Testing',
  'Diagnostic Evaluation',
  'OCD',
  'Anxiety',
  'Depression',
  'PTSD',
  'Evidence-Based Psychotherapy',
];

const ROLE_RULES = {
  'laura-hilsen': { roleClass: 'associate', assignmentEligibility: 'public', licenseTypes: ['APC'] },
  'michaela-hilburn': { roleClass: 'associate', assignmentEligibility: 'public', licenseTypes: ['LAPC'] },
  'liz-webb': { roleClass: 'associate', assignmentEligibility: 'public', licenseTypes: ['LAPC', 'NCC'] },
  'kelsey-donahue': { roleClass: 'licensed', assignmentEligibility: 'public', licenseTypes: ['LPC'] },
  'jackie-malone': { roleClass: 'associate', assignmentEligibility: 'public', licenseTypes: ['LAPC', 'CRC'] },
  'alex-crenshaw': {
    roleClass: 'licensed_psychologist',
    assignmentEligibility: 'public',
    licenseTypes: ['PhD', 'Licensed Psychologist'],
    deeperId: 'alex-crenshaw-phd',
  },
  'jeannine-jannot': {
    roleClass: 'coach',
    assignmentEligibility: 'restricted',
    licenseTypes: ['Ph.D.'],
    roleRestrictions: ['coaching_only', 'no_clinical_diagnosis_attribution'],
  },
  'lexi-cooper': { roleClass: 'licensed_social_worker', assignmentEligibility: 'public', licenseTypes: ['LMSW'] },
  'meredith-price': { roleClass: 'licensed', assignmentEligibility: 'public', licenseTypes: ['LPC'] },
  'sarah-evers': { roleClass: 'licensed', assignmentEligibility: 'public', licenseTypes: ['LPC', 'CRC', 'NCC'] },
  'samantha-bryant': { roleClass: 'licensed', assignmentEligibility: 'public', licenseTypes: ['LPC', 'NCC'] },
  'erin-benator': {
    roleClass: 'intern',
    assignmentEligibility: 'report_only',
    licenseTypes: [],
    roleRestrictions: ['intern_not_public_attribution'],
  },
  'lynn-lane': { roleClass: 'licensed_social_worker', assignmentEligibility: 'public', licenseTypes: ['LCSW', 'MDiv'] },
  'lauren-sanders': { roleClass: 'licensed', assignmentEligibility: 'public', licenseTypes: ['LPC', 'NCC'] },
  'susan-keenan': {
    roleClass: 'licensed_director',
    assignmentEligibility: 'public',
    licenseTypes: ['LPC', 'NCC', 'CPCS'],
  },
  'amanda-gaines': {
    roleClass: 'master_social_worker',
    assignmentEligibility: 'public',
    licenseTypes: [],
    credentialNote: 'Credentials abbreviation not stated on public profile; title is Master Social Worker.',
  },
};

function esc(value) {
  return JSON.stringify(value ?? null);
}

function slugToId(slug, rules) {
  if (rules.deeperId) return rules.deeperId;
  return slug;
}

function evaluateCompleteness(row, rules) {
  const gaps = [];
  const bio = row.fullBio || row.shortBio || '';
  const specialties = row.specialties || [];
  const title = row.professionalTitle || '';
  const credentials = row.credentials || '';

  if (!row.fullName) gaps.push('fullName');
  if (!title && !credentials) gaps.push('credentials_or_title');
  if (bio.trim().length < 120) gaps.push('bio_too_short');
  if (specialties.length < 3) gaps.push('specialties_lt_3');
  if (!row.externalPracticeUrl) gaps.push('externalPracticeUrl');
  if (!row.headshotUrl) gaps.push('headshotUrl');
  if (rules.roleClass === 'intern') gaps.push('intern_role');
  if (rules.assignmentEligibility === 'report_only') gaps.push('report_only_eligibility');

  const complete = gaps.filter((g) => g !== 'intern_role' && g !== 'report_only_eligibility').length === 0
    && rules.assignmentEligibility !== 'report_only'
    && rules.roleClass !== 'intern';

  // Interns / report-only are always incomplete for public directory.
  if (rules.roleClass === 'intern' || rules.assignmentEligibility === 'report_only') {
    return { profileStatus: 'incomplete', gaps, publishable: false };
  }

  return {
    profileStatus: complete ? 'complete' : 'incomplete',
    gaps,
    publishable: complete && rules.assignmentEligibility === 'public',
  };
}

function primarySpecialtyLabel(specialties) {
  if (!specialties?.length) return 'Mental health';
  return specialties.slice(0, 2).join(' · ');
}

function buildCredentialLine(row) {
  const parts = [row.credentials, row.professionalTitle].filter(Boolean);
  const unique = [];
  for (const part of parts) {
    if (!unique.some((u) => u.toLowerCase() === part.toLowerCase())) unique.push(part);
  }
  return unique.join(' · ') || row.professionalTitle || 'Peachtree Psychology';
}

const rows = JSON.parse(readFileSync(sourcePath, 'utf8'));
const records = [];

for (const row of rows) {
  const rules = ROLE_RULES[row.slug];
  if (!rules) throw new Error(`Missing role rules for ${row.slug}`);

  let specialties = [...(row.specialties || [])];
  const sourceNotes = [
    `Retrieved from ${row.externalPracticeUrl} on 2026-07-16.`,
    'Source of truth: Peachtree Psychology public clinician page.',
  ];

  if (row.slug === 'alex-crenshaw') {
    for (const spec of ALEX_SUPPLEMENTAL_SPECIALTIES) {
      if (!specialties.some((s) => s.toLowerCase() === spec.toLowerCase())) {
        specialties.push(spec);
      }
    }
    sourceNotes.push(
      'Supplemental specialties merged from existing Deeper alex-crenshaw-phd verified profile and Peachtree testing service pages (profile scrape omitted OCD/testing chips).'
    );
  }

  if (rules.credentialNote) sourceNotes.push(rules.credentialNote);
  if (row.missingFields?.length) {
    sourceNotes.push(`Missing on source page: ${row.missingFields.join(', ')}.`);
  }

  const completeness = evaluateCompleteness({ ...row, specialties }, rules);
  const id = slugToId(row.slug, rules);
  const deeperSlug = id;

  records.push({
    id,
    slug: deeperSlug,
    fullName: row.fullName,
    credentials: row.credentials,
    professionalTitle: row.professionalTitle,
    shortBio: row.shortBio,
    fullBio: row.fullBio,
    headshotUrl: row.headshotUrl,
    practiceId: 'peachtree-psychology',
    practiceName: 'Peachtree Psychology',
    practiceProfileUrl: `/organizations/peachtree-psychology/`,
    externalPracticeUrl: row.externalPracticeUrl,
    licenseTypes: rules.licenseTypes,
    licenseStates: ['GA'],
    specialties,
    specialtyAliases: [],
    eligibleTopicIds: [],
    eligibleThemeIds: [],
    excludedTopicIds: [],
    reviewedAnswerIds: [],
    attributionStatus: completeness.publishable ? 'eligible' : 'ineligible_public',
    profileStatus: completeness.profileStatus,
    profileGaps: completeness.gaps,
    schemaSameAs: [row.externalPracticeUrl],
    sourceNotes,
    roleClass: rules.roleClass,
    assignmentEligibility: rules.assignmentEligibility,
    roleRestrictions: rules.roleRestrictions || [],
    whoTheyWorkWith: row.whoTheyWorkWith || [],
    supervisionNotes: row.supervisionNotes || [],
    locationLine: row.location?.summary || null,
    specialtyLabel: primarySpecialtyLabel(specialties),
    credentialLine: buildCredentialLine(row),
    trustRoleLabel: 'Clinical contributor',
    reviewAttributionPrefix: 'Clinical contributor',
    disclaimer:
      'Specialty-matched clinical contributor attribution is educational and does not create a therapist-client relationship or imply page-by-page clinical review.',
  });
}

const body = records
  .map((r) => {
    return `  {
    id: ${esc(r.id)},
    slug: ${esc(r.slug)},
    fullName: ${esc(r.fullName)},
    credentials: ${esc(r.credentials)},
    professionalTitle: ${esc(r.professionalTitle)},
    shortBio: ${esc(r.shortBio)},
    fullBio: ${esc(r.fullBio)},
    headshotUrl: ${esc(r.headshotUrl)},
    practiceId: ${esc(r.practiceId)},
    practiceName: ${esc(r.practiceName)},
    practiceProfileUrl: ${esc(r.practiceProfileUrl)},
    externalPracticeUrl: ${esc(r.externalPracticeUrl)},
    licenseTypes: ${esc(r.licenseTypes)},
    licenseStates: ${esc(r.licenseStates)},
    specialties: ${esc(r.specialties)},
    specialtyAliases: ${esc(r.specialtyAliases)},
    eligibleTopicIds: ${esc(r.eligibleTopicIds)},
    eligibleThemeIds: ${esc(r.eligibleThemeIds)},
    excludedTopicIds: ${esc(r.excludedTopicIds)},
    reviewedAnswerIds: ${esc(r.reviewedAnswerIds)},
    attributionStatus: ${esc(r.attributionStatus)},
    profileStatus: ${esc(r.profileStatus)},
    profileGaps: ${esc(r.profileGaps)},
    schemaSameAs: ${esc(r.schemaSameAs)},
    sourceNotes: ${esc(r.sourceNotes)},
    roleClass: ${esc(r.roleClass)},
    assignmentEligibility: ${esc(r.assignmentEligibility)},
    roleRestrictions: ${esc(r.roleRestrictions)},
    whoTheyWorkWith: ${esc(r.whoTheyWorkWith)},
    supervisionNotes: ${esc(r.supervisionNotes)},
    locationLine: ${esc(r.locationLine)},
    specialtyLabel: ${esc(r.specialtyLabel)},
    credentialLine: ${esc(r.credentialLine)},
    trustRoleLabel: ${esc(r.trustRoleLabel)},
    reviewAttributionPrefix: ${esc(r.reviewAttributionPrefix)},
    disclaimer: ${esc(r.disclaimer)},
  }`;
  })
  .join(',\n');

const file = `/**
 * Peachtree Psychology clinical contributors.
 *
 * Generated from verified public clinician pages.
 * Source: src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json
 * Regenerate: node scripts/lib/reviewers/generate-peachtree-contributors.mjs
 *
 * Do not invent credentials or specialties. Update source JSON, then regenerate.
 */

import type { ClinicalContributor } from './types';

export const peachtreeClinicalContributors: ClinicalContributor[] = [
${body}
];

export const peachtreeClinicalContributorsById = new Map(
  peachtreeClinicalContributors.map((c) => [c.id, c])
);

export const peachtreeClinicalContributorsBySlug = new Map(
  peachtreeClinicalContributors.map((c) => [c.slug, c])
);

export const PEACHTREE_CLINICIAN_IDS = peachtreeClinicalContributors.map((c) => c.id);
`;

writeFileSync(outPath, file);
console.log(
  JSON.stringify(
    {
      wrote: outPath,
      count: records.length,
      complete: records.filter((r) => r.profileStatus === 'complete').length,
      incomplete: records.filter((r) => r.profileStatus === 'incomplete').map((r) => r.id),
      reportOnly: records.filter((r) => r.assignmentEligibility === 'report_only').map((r) => r.id),
    },
    null,
    2
  )
);
