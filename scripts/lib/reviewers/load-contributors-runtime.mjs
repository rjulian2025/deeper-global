import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');

const ALEX_EXTRA = [
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
  'laura-hilsen': { id: 'laura-hilsen', roleClass: 'associate', assignmentEligibility: 'public' },
  'michaela-hilburn': { id: 'michaela-hilburn', roleClass: 'associate', assignmentEligibility: 'public' },
  'liz-webb': { id: 'liz-webb', roleClass: 'associate', assignmentEligibility: 'public' },
  'kelsey-donahue': { id: 'kelsey-donahue', roleClass: 'licensed', assignmentEligibility: 'public' },
  'jackie-malone': { id: 'jackie-malone', roleClass: 'associate', assignmentEligibility: 'public' },
  'alex-crenshaw': { id: 'alex-crenshaw-phd', roleClass: 'licensed_psychologist', assignmentEligibility: 'public' },
  'jeannine-jannot': {
    id: 'jeannine-jannot',
    roleClass: 'coach',
    assignmentEligibility: 'restricted',
    roleRestrictions: ['coaching_only', 'no_clinical_diagnosis_attribution'],
  },
  'lexi-cooper': { id: 'lexi-cooper', roleClass: 'licensed_social_worker', assignmentEligibility: 'public' },
  'meredith-price': { id: 'meredith-price', roleClass: 'licensed', assignmentEligibility: 'public' },
  'sarah-evers': { id: 'sarah-evers', roleClass: 'licensed', assignmentEligibility: 'public' },
  'samantha-bryant': { id: 'samantha-bryant', roleClass: 'licensed', assignmentEligibility: 'public' },
  'erin-benator': {
    id: 'erin-benator',
    roleClass: 'intern',
    assignmentEligibility: 'report_only',
    roleRestrictions: ['intern_not_public_attribution'],
  },
  'lynn-lane': { id: 'lynn-lane', roleClass: 'licensed_social_worker', assignmentEligibility: 'public' },
  'lauren-sanders': { id: 'lauren-sanders', roleClass: 'licensed', assignmentEligibility: 'public' },
  'susan-keenan': { id: 'susan-keenan', roleClass: 'licensed_director', assignmentEligibility: 'public' },
  'amanda-gaines': { id: 'amanda-gaines', roleClass: 'master_social_worker', assignmentEligibility: 'public' },
};

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function loadContributorsRuntime() {
  const source = JSON.parse(
    readFileSync(join(root, 'src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json'), 'utf8')
  );
  return source.map((row) => {
    const rules = ROLE_RULES[row.slug];
    if (!rules) throw new Error(`Missing role rules for ${row.slug}`);
    let specialties = [...(row.specialties || [])];
    if (row.slug === 'alex-crenshaw') {
      for (const s of ALEX_EXTRA) {
        if (!specialties.some((x) => normalize(x) === normalize(s))) specialties.push(s);
      }
    }
    const publishable =
      rules.assignmentEligibility !== 'report_only' &&
      rules.roleClass !== 'intern' &&
      Boolean(row.fullBio || row.shortBio) &&
      specialties.length >= 3;

    return {
      id: rules.id,
      slug: rules.id,
      fullName: row.fullName,
      // null when source profile omits credentials (e.g. Amanda Gaines until corrected)
      credentials: row.credentials ?? null,
      professionalTitle: row.professionalTitle,
      specialties,
      roleClass: rules.roleClass,
      assignmentEligibility: rules.assignmentEligibility,
      roleRestrictions: rules.roleRestrictions || [],
      publishable,
      profileStatus: publishable ? 'complete' : rules.assignmentEligibility === 'report_only' ? 'incomplete' : 'incomplete',
      externalPracticeUrl: row.externalPracticeUrl,
      practiceName: 'Peachtree Psychology',
    };
  });
}

export function contributorsById() {
  return new Map(loadContributorsRuntime().map((c) => [c.id, c]));
}

/** Loose specialty eligibility: replacement must share a defensibly related specialty with the answer topic. */
export function isReplacementEligible(contributor, topicId, answerHaystack = '') {
  if (!contributor) return false;
  if (contributor.assignmentEligibility === 'report_only' || contributor.roleClass === 'intern') return false;
  if (!contributor.publishable && contributor.assignmentEligibility !== 'restricted') return false;

  if (contributor.roleRestrictions.includes('coaching_only')) {
    const allowed = new Set([
      'neurodivergence-and-attention',
      'teens-and-identity',
      'family-and-parenting',
      'work-and-burnout',
    ]);
    const hay = normalize(answerHaystack);
    if (!allowed.has(topicId) && !/(adhd|executive|student|parent|productivity|school)/.test(hay)) {
      return false;
    }
  }

  const joined = contributor.specialties.join(' ').toLowerCase();
  const map = {
    'anxiety-and-stress': /anxiety|stress|panic|ocd|obsess|worry|phobia/,
    depression: /depression|mood/,
    'addiction-and-recovery': /addict|substance|alcohol|drug|recovery|sober/,
    'trauma-and-safety': /trauma|ptsd|abuse/,
    'grief-and-loss': /grief|loss|bereavement/,
    'family-and-parenting': /parent|family|child|teen|school|adoption/,
    'teens-and-identity': /teen|child|school|parent|adolescent|youth|adhd|neuro/,
    'relationships-and-communication': /relationship|couple|marital|codepend|divorce|infidelity|peer/,
    'identity-and-self-worth': /self|esteem|shame|identity|body image|perfection/,
    'work-and-burnout': /work|burnout|career|productivity|life transition/,
    'neurodivergence-and-attention': /adhd|autism|executive|neuro|testing|diagnostic/,
    'therapy-and-care-navigation': /testing|diagnostic|evaluation|assessment|therapy/,
    'gender-sexuality-and-intimacy': /lgbtq|transgender|lesbian|bisexual|sex/,
    'meaning-faith-and-existential-questions': /spirit|faith|meaning/,
    'loneliness-and-belonging': /relationship|peer|self|lgbtq|social/,
    'general-mental-health': /life transition|stress|anxiety|mood|anger|chronic|illness/,
  };
  const re = map[topicId];
  if (!re) return contributor.specialties.length > 0;
  return re.test(joined);
}

export function extractRuleKey(matchReasons, matchedSpecialty, topicId) {
  const reasons = matchReasons || '';
  const exact = reasons.match(/exact_topic:([^\s|]+)\s+via\s+([^|(]+)/);
  if (exact) return `exact_topic:${exact[1].trim()}<<${exact[2].trim()}`;
  const theme = reasons.match(/parent_theme:([^\s|]+)\s+via\s+([^|(]+)/);
  if (theme) return `parent_theme:${theme[1].trim()}<<${theme[2].trim()}`;
  const alias = reasons.match(/alias_keyword:([^|]+)/);
  if (alias) return `alias_keyword:${alias[1].trim()}<<${matchedSpecialty || 'unknown'}`;
  return `topic:${topicId || 'unknown'}<<${matchedSpecialty || 'unknown'}`;
}
