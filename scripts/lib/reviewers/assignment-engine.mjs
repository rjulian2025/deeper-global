/**
 * Deterministic clinical-contributor assignment engine (dry-run).
 * Reads answers from the public Deeper API when Supabase is unavailable.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');

const KEN_IDS = new Set(['david-k-gore-phd', 'kenneth-w-christian-phd']);
const PROTECTED_IDS = new Set(['alex-crenshaw-phd', 'michelle-morris-lpc', 'rick-julian']);
const SOFT_CAP_SHARE = 0.15;
const ASSIGNMENT_METHOD = 'specialty_matched_organizational_approval';
const APPROVAL_SOURCE = 'peachtree_psychology_susan_keenan';

const CANONICAL_TOPICS = [
  { name: 'Anxiety & Stress', slug: 'anxiety-and-stress', aliases: ['Anxiety and Stress', 'Anxiety & Worry', 'Anxiety Management', 'Generalized Anxiety', 'Intrusive Thoughts', 'Perfectionism & Control Issues', 'Social Anxiety', 'Panic', 'Stress'] },
  { name: 'Depression', slug: 'depression', aliases: ['Depression & Numbness', 'Depressive symptoms', 'Low mood', 'Mood disorders'] },
  { name: 'Addiction & Recovery', slug: 'addiction-and-recovery', aliases: ['Addiction and Recovery', 'Substance use recovery', 'Sobriety', 'Relapse prevention'] },
  { name: 'Trauma & Safety', slug: 'trauma-and-safety', aliases: ['Trauma & Grief', 'Trauma and Grief', 'Trauma & Triggers', 'Relationship Abuse', 'Crisis Support'] },
  { name: 'Therapy & Care Navigation', slug: 'therapy-and-care-navigation', aliases: ['Therapy & Mental Health', 'Therapy Navigation', 'Mental Health Treatment', 'Mental Health Access'] },
  { name: 'Identity & Self-Worth', slug: 'identity-and-self-worth', aliases: ['Identity and Self-Worth', 'Self-Worth', 'Self-worth', 'Identity', 'Self-esteem', 'Self-Compassion', 'Life Comparison', 'Money & Self-Worth', 'People Pleasing', 'Self-Actualization'] },
  { name: 'Relationships & Communication', slug: 'relationships-and-communication', aliases: ['Relationships and Communication', 'Relationships', 'Communication & Conflict', 'Relationship Insecurity', 'Attachment Styles & Relationship Dynamics', 'Forgiveness', 'Relationship Balance', 'Relationship Comparison', 'Relationship Identity', 'Relationships & Divorce', 'Codependency'] },
  { name: 'Family & Parenting', slug: 'family-and-parenting', aliases: ['Family and Parenting', 'Parenting', 'Family Relationships', 'Family Boundaries', 'Inner Child & Parenting'] },
  { name: 'Grief & Loss', slug: 'grief-and-loss', aliases: ['Grief and Loss', 'Bereavement', 'Loss', 'Complicated grief'] },
  { name: 'Work & Burnout', slug: 'work-and-burnout', aliases: ['Work and Burnout', 'Work & Life Balance', 'Work, Stress & Burnout', 'Workplace Mental Health', 'Career & Purpose', 'Workplace'] },
  { name: 'Teens & Identity', slug: 'teens-and-identity', aliases: ['Teen-Specific Questions', 'Teens', 'Youth'] },
  { name: 'Loneliness & Belonging', slug: 'loneliness-and-belonging', aliases: ['Loneliness & Isolation', 'Social Belonging', 'Social Connection'] },
  { name: 'Neurodivergence & Attention', slug: 'neurodivergence-and-attention', aliases: ['ADHD', 'Autism', 'Autistic', 'Neurodivergence'] },
  { name: 'Gender, Sexuality & Intimacy', slug: 'gender-sexuality-and-intimacy', aliases: ['Sexuality, Gender Identity, and Intimacy', 'Gender & Sexuality', 'Gender Identity'] },
  { name: 'Meaning, Faith & Existential Questions', slug: 'meaning-faith-and-existential-questions', aliases: ['Spiritual Struggle / Existential Crisis', 'Spiritual Doubt', 'Existential', 'Life Purpose'] },
  { name: 'General Mental Health', slug: 'general-mental-health', aliases: ['Mental Health', 'Physical Health', 'Emotional Regulation', 'Anger & Emotional Regulation', 'Current Events', 'Life Transitions', 'Social Media'] },
];

const TOPIC_THEME = {
  'anxiety-and-stress': 'anxiety-and-mood',
  depression: 'anxiety-and-mood',
  'relationships-and-communication': 'relationships-and-connection',
  'gender-sexuality-and-intimacy': 'relationships-and-connection',
  'loneliness-and-belonging': 'relationships-and-connection',
  'family-and-parenting': 'family-and-parenting',
  'teens-and-identity': 'family-and-parenting',
  'identity-and-self-worth': 'identity-and-self-worth',
  'trauma-and-safety': 'trauma-and-safety',
  'addiction-and-recovery': 'trauma-and-safety',
  'work-and-burnout': 'work-and-purpose',
  'meaning-faith-and-existential-questions': 'spirituality-and-meaning',
  'therapy-and-care-navigation': 'care-and-therapy',
  'neurodivergence-and-attention': 'care-and-therapy',
  'grief-and-loss': 'life-transitions-and-change',
  'general-mental-health': 'life-transitions-and-change',
};

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadJson(relPath) {
  return JSON.parse(readFileSync(join(root, relPath), 'utf8'));
}

function loadContributors() {
  // Parse generated TS-ish data via source JSON + role rules by reusing generator outputs from peachtree source.
  const source = loadJson('src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json');
  // Prefer reading the generated file's runtime export through a tiny dynamic eval of the JSON mirror we build here.
  return buildContributorRecords(source);
}

function buildContributorRecords(sourceRows) {
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

  return sourceRows.map((row) => {
    const rules = ROLE_RULES[row.slug];
    let specialties = [...(row.specialties || [])];
    if (row.slug === 'alex-crenshaw') {
      for (const s of ALEX_EXTRA) {
        if (!specialties.some((x) => normalize(x) === normalize(s))) specialties.push(s);
      }
    }
    const bio = row.fullBio || row.shortBio || '';
    const gaps = [];
    if (!(row.professionalTitle || row.credentials)) gaps.push('credentials_or_title');
    if (bio.trim().length < 120) gaps.push('bio_too_short');
    if (specialties.length < 3) gaps.push('specialties_lt_3');
    if (!row.externalPracticeUrl) gaps.push('externalPracticeUrl');
    if (!row.headshotUrl) gaps.push('headshotUrl');
    if (rules.roleClass === 'intern' || rules.assignmentEligibility === 'report_only') {
      gaps.push('report_only_or_intern');
    }
    const profileStatus =
      rules.roleClass === 'intern' || rules.assignmentEligibility === 'report_only'
        ? 'incomplete'
        : gaps.length
          ? 'incomplete'
          : 'complete';
    const publishable =
      profileStatus === 'complete' &&
      (rules.assignmentEligibility === 'public' || rules.assignmentEligibility === 'restricted');

    return {
      id: rules.id,
      slug: rules.id,
      fullName: row.fullName,
      credentials: row.credentials,
      professionalTitle: row.professionalTitle,
      specialties,
      roleClass: rules.roleClass,
      assignmentEligibility: rules.assignmentEligibility,
      roleRestrictions: rules.roleRestrictions || [],
      profileStatus,
      profileGaps: gaps,
      publishable,
      externalPracticeUrl: row.externalPracticeUrl,
      practiceName: 'Peachtree Psychology',
    };
  });
}

function loadCrosswalk() {
  // Minimal runtime crosswalk mirrored from TS source (keep in sync via shared aliases).
  // Import by parsing the TS file's exported array is brittle; embed essential map here from generated JSON.
  const { specialtyCrosswalk } = JSON.parse(
    readFileSync(join(root, 'src/data/reviewer-specialty-crosswalk.json'), 'utf8')
  );
  const byKey = new Map();
  for (const entry of specialtyCrosswalk) {
    byKey.set(normalize(entry.specialty), entry);
    for (const alias of entry.aliases) byKey.set(normalize(alias), entry);
  }
  return { specialtyCrosswalk, byKey };
}

function getCanonicalTopic(value) {
  const key = normalize(value);
  for (const topic of CANONICAL_TOPICS) {
    if (normalize(topic.name) === key || normalize(topic.slug) === key) return topic;
    if (topic.aliases.some((a) => normalize(a) === key)) return topic;
  }
  return CANONICAL_TOPICS.find((t) => t.slug === 'general-mental-health');
}

function stableTieBreak(answerId, contributorId) {
  return createHash('sha256').update(`${answerId}::${contributorId}`).digest('hex');
}

function answerSignals(answer) {
  const topicLabel = answer.topic || answer.category || answer.primary_theme || '';
  const canonical = getCanonicalTopic(topicLabel);
  const theme = TOPIC_THEME[canonical.slug] || 'life-transitions-and-change';
  const title = answer.title || answer.original_question || '';
  const question = answer.original_question || '';
  const summary = answer.summary || '';
  const hay = normalize([topicLabel, title, question, summary, answer.primary_theme || ''].join(' '));
  return {
    topicId: canonical.slug,
    topicName: canonical.name,
    themeId: theme,
    category: topicLabel,
    title,
    question,
    hay,
    hasMisleadingReviewDate: KEN_IDS.has(answer.reviewed_by) && Boolean(answer.reviewed_at),
  };
}

function clinicianSpecialtyEntries(contributor, byKey) {
  const entries = [];
  for (const specialty of contributor.specialties) {
    const hit = byKey.get(normalize(specialty));
    if (hit) entries.push({ specialty, entry: hit });
    else {
      // fallback: try partial alias contains
      for (const [key, entry] of byKey.entries()) {
        if (key.length >= 5 && (normalize(specialty).includes(key) || key.includes(normalize(specialty)))) {
          entries.push({ specialty, entry });
          break;
        }
      }
    }
  }
  return entries;
}

function scoreContributor(answer, signals, contributor, specialtyEntries) {
  const reasons = [];
  const exclusions = [];
  let score = 0;
  let matchedSpecialty = null;
  let matchTier = null;

  if (contributor.assignmentEligibility === 'report_only') {
    exclusions.push('report_only_eligibility');
  }
  if (contributor.roleRestrictions.includes('intern_not_public_attribution')) {
    exclusions.push('intern_not_public_attribution');
  }

  // Role restrictions for coaches: only coaching-aligned topics
  if (contributor.roleRestrictions.includes('coaching_only')) {
    const allowed = new Set(['neurodivergence-and-attention', 'teens-and-identity', 'family-and-parenting', 'work-and-burnout']);
    if (!allowed.has(signals.topicId) && !/(adhd|executive|student|parent|productivity|school)/.test(signals.hay)) {
      exclusions.push('coaching_only_topic_mismatch');
    }
  }

  if (exclusions.length) {
    return { score: 0, confidence: 'unmatched', reasons, exclusions, matchedSpecialty, matchTier };
  }

  for (const { specialty, entry } of specialtyEntries) {
    if (entry.excludedTopics?.includes(signals.topicId)) {
      exclusions.push(`excluded_topic:${signals.topicId}`);
      continue;
    }

    const topicHit = entry.eligibleTopics.find((t) => t.id === signals.topicId);
    if (topicHit) {
      const points = 100 * topicHit.weight;
      if (points > score || (points === score && topicHit.weight > 0.85)) {
        score = points;
        matchedSpecialty = specialty;
        matchTier = 'exact_topic_specialty';
        reasons.push(`exact_topic:${signals.topicId} via ${specialty} (w=${topicHit.weight})`);
      } else if (points === score) {
        reasons.push(`tied_topic:${signals.topicId} via ${specialty} (w=${topicHit.weight})`);
      } else {
        reasons.push(`alt_topic:${signals.topicId} via ${specialty} (w=${topicHit.weight})`);
      }
    }

    const themeHit = entry.eligibleThemes?.find((t) => t.id === signals.themeId);
    if (themeHit && score < 70) {
      const points = 70 * themeHit.weight;
      if (points > score) {
        score = points;
        matchedSpecialty = specialty;
        matchTier = 'parent_theme';
        reasons.push(`parent_theme:${signals.themeId} via ${specialty}`);
      }
    }

    // Alias / keyword support in title/question
    for (const alias of [entry.specialty, ...entry.aliases]) {
      const key = normalize(alias);
      if (key.length >= 4 && signals.hay.includes(key)) {
        const points = matchTier === 'exact_topic_specialty' ? Math.min(score + 8, 99) : 55;
        if (points > score) {
          score = points;
          matchedSpecialty = specialty;
          matchTier = matchTier === 'exact_topic_specialty' ? matchTier : 'alias_keyword';
          reasons.push(`alias_keyword:${alias}`);
        } else if (matchTier === 'exact_topic_specialty' && normalize(specialty) === key) {
          // Prefer the specialty keyword that actually appears in the answer text.
          matchedSpecialty = specialty;
          reasons.push(`preferred_specialty_keyword:${alias}`);
        }
        break;
      }
    }

    if (entry.roleRestrictions?.includes('requires_keyword_support')) {
      const hasKeyword = [entry.specialty, ...entry.aliases].some((a) => {
        const key = normalize(a);
        return key.length >= 4 && signals.hay.includes(key);
      });
      if (!hasKeyword && matchTier === 'exact_topic_specialty' && topicHit && topicHit.weight < 0.8) {
        // demote weak topic-only eating/chronic/perinatal matches
        score *= 0.5;
        reasons.push('demoted_missing_keyword_support');
      }
      if (!hasKeyword && matchTier !== 'exact_topic_specialty' && matchTier !== 'alias_keyword') {
        exclusions.push(`requires_keyword_support:${specialty}`);
      }
    }
  }

  if (!matchedSpecialty || score < 40) {
    return {
      score: 0,
      confidence: 'unmatched',
      reasons,
      exclusions: exclusions.length ? exclusions : ['no_defensible_specialty_match'],
      matchedSpecialty: null,
      matchTier: null,
    };
  }

  let confidence = 'low';
  if (matchTier === 'exact_topic_specialty' && score >= 80) confidence = 'high';
  else if (matchTier === 'exact_topic_specialty' && score >= 55) confidence = 'medium';
  else if (matchTier === 'alias_keyword' && score >= 55) confidence = 'medium';
  else if (matchTier === 'parent_theme' && score >= 50) confidence = 'medium';
  else confidence = 'low';

  // Broad identity/self-worth with only self-esteem specialty can be high if topic exact
  if (signals.topicId === 'identity-and-self-worth' && matchTier === 'exact_topic_specialty') {
    confidence = score >= 80 ? 'high' : confidence;
  }

  return { score, confidence, reasons, exclusions, matchedSpecialty, matchTier };
}

async function fetchAllAnswersFromApi() {
  const base = 'https://www.deeper.global/api/v1/answers';
  const limit = 100;
  let offset = 0;
  let total = null;
  const rows = [];
  while (true) {
    const res = await fetch(`${base}?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    if (total == null) total = data.total || data.total_count;
    const answers = data.answers || [];
    if (!answers.length) break;
    rows.push(...answers);
    offset += answers.length;
    if (offset >= total) break;
  }
  return rows;
}

export async function runAssignment({ includeMedium = false, includeReportOnly = false } = {}) {
  // Ensure crosswalk JSON exists
  const { writeCrosswalkJson } = await import('./export-crosswalk-json.mjs');
  writeCrosswalkJson();

  const contributors = loadContributors();
  const { byKey } = loadCrosswalk();
  const answers = await fetchAllAnswersFromApi();

  const kenAnswers = answers.filter((a) => KEN_IDS.has(a.reviewed_by));
  const protectedAnswers = answers.filter((a) => PROTECTED_IDS.has(a.reviewed_by));
  const migratable = kenAnswers.length;
  const softCap = Math.max(1, Math.floor(migratable * SOFT_CAP_SHARE));

  const eligibleContributors = contributors.filter((c) => {
    if (includeReportOnly) return true;
    return c.assignmentEligibility !== 'report_only';
  });

  const loadCounts = new Map(eligibleContributors.map((c) => [c.id, 0]));
  const details = [];
  const softCapExceptions = [];

  // First pass: score all
  const scored = kenAnswers.map((answer) => {
    const signals = answerSignals(answer);
    const candidates = [];
    for (const contributor of eligibleContributors) {
      const specialtyEntries = clinicianSpecialtyEntries(contributor, byKey);
      const result = scoreContributor(answer, signals, contributor, specialtyEntries);
      if (result.score > 0 && result.confidence !== 'unmatched') {
        candidates.push({ contributor, ...result });
      }
    }
    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.confidence !== b.confidence) {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.confidence] - order[b.confidence];
      }
      return stableTieBreak(answer.id || answer.slug, a.contributor.id).localeCompare(
        stableTieBreak(answer.id || answer.slug, b.contributor.id)
      );
    });
    return { answer, signals, candidates };
  });

  // Assign high (and optionally medium) with soft cap among near-ties
  for (const row of scored) {
    const { answer, signals, candidates } = row;
    const pool = candidates.filter((c) => {
      if (c.confidence === 'high') return true;
      if (includeMedium && c.confidence === 'medium') return true;
      return false;
    });

    let chosen = null;
    let softCapImpact = 'none';
    let confidence = 'unmatched';

    if (!pool.length) {
      const best = candidates[0];
      confidence = best?.confidence || 'unmatched';
      details.push(buildDetail({
        answer,
        signals,
        previous: answer.reviewed_by,
        chosen: null,
        best,
        confidence,
        softCapImpact,
        includeMedium,
      }));
      continue;
    }

    const topScore = pool[0].score;
    // Equally qualified = within 5% of top score and same confidence
    let tied = pool.filter(
      (c) => c.confidence === pool[0].confidence && c.score >= topScore * 0.95
    );

    // Apply soft cap among tied broad candidates
    const underCap = tied.filter((c) => (loadCounts.get(c.contributor.id) || 0) < softCap);
    if (underCap.length) {
      tied = underCap;
      softCapImpact = tied.length < pool.filter((c) => c.score >= topScore * 0.95).length ? 'applied_among_ties' : 'none';
    } else if (tied.length) {
      // All tied at/over cap: keep best specialty fit (may exceed)
      softCapImpact = 'exception_no_equal_under_cap';
      softCapExceptions.push({
        answer_id: answer.id,
        answer_slug: answer.slug,
        contributor_id: tied[0].contributor.id,
        score: tied[0].score,
        confidence: tied[0].confidence,
        reason: 'All equally qualified contributors at/over 15% soft cap; specialty fit retained',
      });
    }

    tied.sort((a, b) =>
      stableTieBreak(answer.id || answer.slug, a.contributor.id).localeCompare(
        stableTieBreak(answer.id || answer.slug, b.contributor.id)
      )
    );
    // Prefer publishable profiles for default proposal
    const publishableTied = tied.filter((c) => c.contributor.publishable);
    chosen = (publishableTied[0] || tied[0]);
    confidence = chosen.confidence;

    // Block public proposal when profile incomplete
    const blockedIncomplete = chosen && !chosen.contributor.publishable;
    if (blockedIncomplete) {
      details.push(buildDetail({
        answer,
        signals,
        previous: answer.reviewed_by,
        chosen: null,
        best: chosen,
        confidence: chosen.confidence,
        softCapImpact,
        includeMedium,
        blockedIncomplete: true,
      }));
      continue;
    }

    loadCounts.set(chosen.contributor.id, (loadCounts.get(chosen.contributor.id) || 0) + 1);
    details.push(buildDetail({
      answer,
      signals,
      previous: answer.reviewed_by,
      chosen,
      best: chosen,
      confidence,
      softCapImpact,
      includeMedium,
    }));
  }

  const high = details.filter((d) => d.proposed_contributor_id && d.confidence === 'high');
  const medium = details.filter((d) => d.confidence === 'medium');
  const low = details.filter((d) => d.confidence === 'low');
  const unmatched = details.filter((d) => d.confidence === 'unmatched' || (!d.proposed_contributor_id && d.confidence !== 'medium' && d.confidence !== 'low'));
  // Clarify buckets
  const proposed = details.filter((d) => d.proposed_contributor_id);
  const highProposed = proposed.filter((d) => d.confidence === 'high');
  const mediumProposed = proposed.filter((d) => d.confidence === 'medium');
  const mediumReported = details.filter((d) => d.confidence === 'medium');
  const lowReported = details.filter((d) => d.confidence === 'low');
  const unmatchedReported = details.filter((d) => d.confidence === 'unmatched' || (!d.proposed_contributor_id && !['high', 'medium', 'low'].includes(d.confidence)));
  const blockedIncomplete = details.filter((d) => d.blocked_incomplete);
  const trulyUnmatched = details.filter((d) => !d.proposed_contributor_id && d.confidence === 'unmatched');
  const mediumUnassigned = details.filter((d) => !d.proposed_contributor_id && d.confidence === 'medium');
  const lowUnassigned = details.filter((d) => !d.proposed_contributor_id && d.confidence === 'low');

  const distribution = {};
  for (const c of contributors) {
    distribution[c.id] = {
      fullName: c.fullName,
      proposed_high: highProposed.filter((d) => d.proposed_contributor_id === c.id).length,
      proposed_all_included: proposed.filter((d) => d.proposed_contributor_id === c.id).length,
      profileStatus: c.profileStatus,
      assignmentEligibility: c.assignmentEligibility,
      publishable: c.publishable,
    };
  }

  const kenRemainingHighOnly = migratable - highProposed.length;

  // Unmatched end-state scenarios
  const unmatchedForPolicy = details.filter((d) => !d.proposed_contributor_id);
  const unmatchedScenarios = {
    A_retain_ken: {
      count: unmatchedForPolicy.length,
      description: 'Retain current Ken attribution on unmatched answers',
    },
    B_remove_named_use_editorial: {
      count: unmatchedForPolicy.length,
      description:
        'Remove unsupported named-person attribution; mark as Deeper editorial review where editorial review is supported',
    },
    C_pending_future_specialist: {
      count: unmatchedForPolicy.length,
      description: 'Leave pending future specialist assignment without named clinical person',
    },
    recommendation:
      'Prefer scenario B for honesty: remove unsupported named-person attribution and use accurate Deeper editorial attribution without implying clinical review. Do not retain Ken on answers with no defensible specialty match.',
  };

  return {
    meta: {
      generated_at: new Date().toISOString(),
      mode: 'dry-run',
      source: 'public_api',
      includeMedium,
      soft_cap_share: SOFT_CAP_SHARE,
      soft_cap_count: softCap,
      assignment_method: ASSIGNMENT_METHOD,
      approval_source: APPROVAL_SOURCE,
      total_answers: answers.length,
      ken_evaluated: migratable,
      protected_preserved: protectedAnswers.length,
    },
    counts: {
      ken_evaluated: migratable,
      high_confidence_proposed: highProposed.length,
      medium_confidence_total: mediumReported.length,
      medium_confidence_proposed: mediumProposed.length,
      medium_unassigned_default: mediumUnassigned.length,
      low_confidence: lowUnassigned.length + lowReported.filter((d) => d.proposed_contributor_id).length,
      low_confidence_unassigned: lowUnassigned.length,
      unmatched: trulyUnmatched.length,
      blocked_incomplete_profiles: blockedIncomplete.length,
      ken_remaining_under_high_only: kenRemainingHighOnly,
      ken_remaining_if_medium_included: migratable - highProposed.length - (includeMedium ? mediumProposed.length : mediumReported.filter((d) => {
        // estimate medium that would assign if publishable
        return d.best_contributor_id && d.confidence === 'medium';
      }).length),
    },
    distribution,
    softCapExceptions,
    unmatchedScenarios,
    protectedAnswers: protectedAnswers.map((a) => ({
      id: a.id,
      slug: a.slug,
      reviewed_by: a.reviewed_by,
      reviewed_at: a.reviewed_at,
      topic: a.topic,
    })),
    details,
    contributors,
    answers,
  };
}

function buildDetail({
  answer,
  signals,
  previous,
  chosen,
  best,
  confidence,
  softCapImpact,
  includeMedium,
  blockedIncomplete = false,
}) {
  const publicName =
    previous === 'david-k-gore-phd' || previous === 'kenneth-w-christian-phd'
      ? 'Kenneth W. Christian, PhD'
      : previous;

  return {
    answer_id: answer.id,
    answer_slug: answer.slug,
    current_reviewer_id: previous,
    current_public_reviewer_name: publicName,
    proposed_contributor_id: chosen?.contributor?.id || null,
    proposed_contributor_name: chosen?.contributor?.fullName || null,
    best_contributor_id: best?.contributor?.id || null,
    best_contributor_name: best?.contributor?.fullName || null,
    matched_specialty: chosen?.matchedSpecialty || best?.matchedSpecialty || null,
    deeper_topic: signals.topicId,
    deeper_topic_name: signals.topicName,
    deeper_theme: signals.themeId,
    deeper_category: signals.category,
    score: chosen?.score || best?.score || 0,
    confidence,
    match_reasons: (chosen || best)?.reasons?.join('|') || '',
    exclusions_evaluated: (chosen || best)?.exclusions?.join('|') || '',
    soft_cap_impact: softCapImpact,
    profile_completeness: chosen?.contributor?.profileStatus || best?.contributor?.profileStatus || null,
    profile_publishable: chosen?.contributor?.publishable ?? best?.contributor?.publishable ?? null,
    blocked_incomplete: blockedIncomplete,
    proposed_public_label: chosen ? 'Clinical contributor' : null,
    assignment_method: chosen ? ASSIGNMENT_METHOD : null,
    approval_source_internal: chosen ? APPROVAL_SOURCE : null,
    misleading_review_date_today: signals.hasMisleadingReviewDate,
    reviewed_at_legacy: answer.reviewed_at || null,
    include_medium_mode: includeMedium,
  };
}
