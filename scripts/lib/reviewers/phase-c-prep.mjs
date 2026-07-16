#!/usr/bin/env node
/**
 * Phase C preparation: QA sample, coherence analysis, unmatched transition,
 * apply-package artifacts. No production writes.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const OUT = join(root, 'reports/reviewer-migration');
const APPLY = join(OUT, 'apply-package');
const SITE = 'https://www.deeper.global';
const MIGRATABLE = 1068;
const HIGH_THRESHOLD = 80;
const SHARE_8PCT = MIGRATABLE * 0.08;

function readCsv(path) {
  const text = readFileSync(path, 'utf8').trim();
  if (!text) return [];
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });
    return row;
  });
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function csvEscape(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(','));
  return `${header}\n${lines.join('\n')}\n`;
}

function write(name, content, dir = OUT) {
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`);
  return path;
}

function classifyMatchType(reasons) {
  const r = reasons || '';
  const hasExact = /exact_topic:/.test(r);
  const hasAlias = /alias_keyword:|preferred_specialty_keyword:/.test(r);
  const hasTheme = /parent_theme:/.test(r);
  const hasKeywordAssist = hasAlias && !hasExact;
  if (hasExact && hasAlias) return 'exact_topic_plus_alias';
  if (hasExact) return 'exact_topic';
  if (hasTheme && hasAlias) return 'parent_theme_plus_alias';
  if (hasTheme) return 'parent_theme';
  if (hasAlias) return 'alias_keyword';
  return 'other';
}

function isYmyL(row) {
  const hay = `${row.answer_slug} ${row.deeper_topic} ${row.deeper_category} ${row.matched_specialty}`.toLowerCase();
  return /trauma|abuse|addict|substance|eating|arfid|pregnan|postpartum|ocd|obsess|chronic|diagnos|testing|suicid|self-harm|psychosis|withdrawal|domestic|narcissist/.test(
    hay
  );
}

function loadContributors() {
  const source = JSON.parse(
    readFileSync(join(root, 'src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json'), 'utf8')
  );
  const byId = new Map();
  for (const row of source) {
    const id = row.slug === 'alex-crenshaw' ? 'alex-crenshaw-phd' : row.slug;
    byId.set(id, row);
  }
  // supplemental alex specialties from generated peachtree completeness export
  const completeness = readCsv(join(OUT, 'profile-completeness.csv'));
  const sourceData = readCsv(join(OUT, 'clinician-source-data.csv'));
  for (const row of sourceData) {
    if (!byId.has(row.contributor_id)) continue;
    const cur = byId.get(row.contributor_id);
    cur._specialties = (row.specialties || '').split('|').filter(Boolean);
    cur._credentials = row.credentials;
    cur._title = row.professional_title;
  }
  for (const row of completeness) {
    if (!byId.has(row.contributor_id)) continue;
    Object.assign(byId.get(row.contributor_id), {
      _profile_status: row.profile_status,
      _publishable: row.publishable === 'true',
      _gaps: row.profile_gaps,
    });
  }
  return byId;
}

async function fetchTitles(slugs) {
  const titles = new Map();
  // batch via public API list is already known; fetch individually for sample only would be slow.
  // Use list endpoint once.
  const all = [];
  let offset = 0;
  const limit = 100;
  let total = null;
  while (true) {
    const res = await fetch(`${SITE}/api/v1/answers?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    if (total == null) total = data.total || data.total_count;
    const answers = data.answers || [];
    if (!answers.length) break;
    all.push(...answers);
    offset += answers.length;
    if (offset >= total) break;
  }
  for (const a of all) titles.set(a.slug, a.title || a.original_question || a.slug);
  return { titles, answers: all };
}

function pickQaSample(highRows, contributorById) {
  const byClinician = new Map();
  for (const row of highRows) {
    if (!byClinician.has(row.proposed_contributor_id)) byClinician.set(row.proposed_contributor_id, []);
    byClinician.get(row.proposed_contributor_id).push(row);
  }
  for (const rows of byClinician.values()) {
    rows.sort((a, b) => Number(a.score) - Number(b.score) || a.answer_slug.localeCompare(b.answer_slug));
  }

  const counts = [...byClinician.entries()].map(([id, rows]) => ({ id, count: rows.length }));
  counts.sort((a, b) => b.count - a.count);
  const top10 = new Set(counts.slice(0, 10).map((c) => c.id));
  const over8 = new Set(counts.filter((c) => c.count > SHARE_8PCT).map((c) => c.id));

  const selected = new Map();
  const add = (row, reason) => {
    if (!row) return;
    const key = row.answer_id || row.answer_slug;
    if (selected.has(key)) {
      const cur = selected.get(key);
      cur.sample_reasons = [...new Set([...cur.sample_reasons.split('|'), reason])].join('|');
      return;
    }
    selected.set(key, { ...row, sample_reasons: reason });
  };

  // Every clinician: at least 2 (or all if fewer)
  for (const [id, rows] of byClinician) {
    add(rows[0], 'every_clinician_lowest');
    if (rows.length > 1) add(rows[Math.floor(rows.length / 2)], 'every_clinician_mid');
    if (rows.length > 2) add(rows[rows.length - 1], 'every_clinician_highest');
  }

  // Top 10 clinicians: extra
  for (const id of top10) {
    const rows = byClinician.get(id) || [];
    add(rows[0], 'top10_lowest');
    add(rows[Math.min(2, rows.length - 1)], 'top10_extra');
  }

  // Over 8%
  for (const id of over8) {
    const rows = byClinician.get(id) || [];
    for (const row of rows.slice(0, 3)) add(row, 'share_gt_8pct');
  }

  // Near threshold
  const near = highRows
    .filter((r) => Number(r.score) >= HIGH_THRESHOLD && Number(r.score) <= HIGH_THRESHOLD + 5)
    .sort((a, b) => Number(a.score) - Number(b.score));
  for (const row of near.slice(0, 12)) add(row, 'near_high_medium_threshold');

  // Alias / parent-theme heavy
  for (const row of highRows) {
    const t = classifyMatchType(row.match_reasons);
    if (t.includes('alias') && selected.size < 200) add(row, 'alias_match');
    if (t.includes('parent_theme')) add(row, 'parent_theme_match');
  }

  // YMYL / specialty risk topics
  const riskBuckets = [
    ['trauma', /trauma|ptsd/],
    ['abuse', /abuse|domestic|narcissist/],
    ['addiction', /addict|substance|alcohol|relapse|sober/],
    ['eating', /eating|arfid|body image|bulim|anorex/],
    ['postpartum', /pregnan|postpartum|perinatal|infertil/],
    ['ocd', /ocd|obsess|intrusive|compulsion/],
    ['chronic', /chronic|illness|pain|cancer|caregiver/],
    ['testing', /test|diagnos|assessment|evaluation/],
  ];
  for (const [label, re] of riskBuckets) {
    const hits = highRows.filter((r) =>
      re.test(`${r.answer_slug} ${r.matched_specialty} ${r.deeper_topic} ${r.deeper_category}`.toLowerCase())
    );
    for (const row of hits.slice(0, 4)) add(row, `ymyl_${label}`);
  }

  // Theme coverage: at least 5 per major theme
  const byTheme = new Map();
  for (const row of highRows) {
    if (!byTheme.has(row.deeper_theme)) byTheme.set(row.deeper_theme, []);
    byTheme.get(row.deeper_theme).push(row);
  }
  for (const [theme, rows] of byTheme) {
    for (const row of rows.slice(0, 5)) add(row, `theme_${theme}`);
  }

  // Broad generalist large topic clusters
  const broadIds = counts.filter((c) => c.count >= 70).map((c) => c.id);
  for (const id of broadIds) {
    const rows = byClinician.get(id) || [];
    const byTopic = new Map();
    for (const row of rows) {
      if (!byTopic.has(row.deeper_topic)) byTopic.set(row.deeper_topic, []);
      byTopic.get(row.deeper_topic).push(row);
    }
    const topTopics = [...byTopic.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3);
    for (const [, topicRows] of topTopics) add(topicRows[0], 'broad_generalist_topic_cluster');
  }

  let sample = [...selected.values()];
  // Trim/pad toward ~100
  if (sample.length > 110) {
    // keep priority reasons
    const priority = /every_clinician|share_gt_8pct|ymyl_|near_high|top10|theme_/;
    const keep = sample.filter((r) => priority.test(r.sample_reasons));
    const rest = sample.filter((r) => !priority.test(r.sample_reasons));
    sample = [...keep, ...rest].slice(0, 105);
  }
  while (sample.length < 95 && highRows.length) {
    const row = highRows[sample.length % highRows.length];
    add(row, 'pad_to_100');
    sample = [...selected.values()];
    if (sample.length >= 100) break;
  }

  sample.sort((a, b) => a.proposed_contributor_id.localeCompare(b.proposed_contributor_id) || a.answer_slug.localeCompare(b.answer_slug));
  return sample.slice(0, 105);
}

function buildCoherence(highRows, contributorById) {
  const byClinician = new Map();
  for (const row of highRows) {
    if (!byClinician.has(row.proposed_contributor_id)) byClinician.set(row.proposed_contributor_id, []);
    byClinician.get(row.proposed_contributor_id).push(row);
  }

  const coverage = [];
  const outliers = [];
  const downgrades = [];

  for (const [id, rows] of byClinician) {
    const clinician = contributorById.get(id) || {};
    const specialties = clinician._specialties || clinician.specialties || [];
    const specialtyKeys = new Set(specialties.map((s) => String(s).toLowerCase()));
    const matchTypes = rows.map((r) => classifyMatchType(r.match_reasons));
    const exact = matchTypes.filter((t) => t.startsWith('exact_topic')).length;
    const alias = matchTypes.filter((t) => t.includes('alias')).length;
    const theme = matchTypes.filter((t) => t.includes('parent_theme')).length;
    const keyword = matchTypes.filter((t) => t === 'alias_keyword' || t === 'parent_theme_plus_alias').length;
    const topics = countMap(rows.map((r) => r.deeper_topic_name || r.deeper_topic));
    const themes = countMap(rows.map((r) => r.deeper_theme));
    const types = countMap(matchTypes);
    const topTopics = topN(topics, 5);
    const topThemes = topN(themes, 5);
    const majorThemes = [...themes.keys()];
    const parentThemePct = theme / rows.length;
    const keywordPct = keyword / rows.length;
    const lowest = [...rows].sort((a, b) => Number(a.score) - Number(b.score)).slice(0, 5);

    const flags = [];
    if (parentThemePct > 0.3) flags.push('parent_theme_gt_30pct');
    if (keywordPct > 0.1) flags.push('keyword_gt_10pct');
    if (majorThemes.length > 3) flags.push('spans_gt_3_major_themes');

    // outlier topics: topic not defensibly related to any specialty string/crosswalk hint
    for (const [topicName, count] of topics) {
      const topicKey = topicName.toLowerCase();
      const related = [...specialtyKeys].some(
        (s) =>
          topicKey.includes(s.slice(0, 6)) ||
          s.includes(topicKey.split(' ')[0]) ||
          relatedHeuristic(topicKey, s)
      );
      // broader: use deeper_topic id from a row
      const sample = rows.find((r) => (r.deeper_topic_name || r.deeper_topic) === topicName);
      const defensible = isTopicDefensible(sample?.deeper_topic, specialties);
      if (!defensible) {
        flags.push(`outlier_topic:${topicName}`);
        outliers.push({
          contributor_id: id,
          contributor_name: rows[0].proposed_contributor_name,
          topic: topicName,
          topic_id: sample?.deeper_topic,
          answer_count: count,
          verified_specialties: specialties.join('|'),
          reason: 'topic_outside_verified_specialty_crosswalk',
          recommended_action: 'review_crosswalk_or_downgrade_assignments',
        });
      }
    }

    // large share from one broad fallback
    const lifeTransitionsShare =
      rows.filter((r) => /life transitions/i.test(r.matched_specialty || '')).length / rows.length;
    if (lifeTransitionsShare > 0.25) flags.push('broad_fallback_life_transitions_gt_25pct');

    coverage.push({
      contributor_id: id,
      contributor_name: rows[0].proposed_contributor_name,
      proposed_count: rows.length,
      pct_migratable: ((rows.length / MIGRATABLE) * 100).toFixed(2),
      top_topics: topTopics.map(([k, v]) => `${k}:${v}`).join('|'),
      top_themes: topThemes.map(([k, v]) => `${k}:${v}`).join('|'),
      top_match_types: topN(types, 5)
        .map(([k, v]) => `${k}:${v}`)
        .join('|'),
      exact_matches: exact,
      alias_matches: alias,
      parent_theme_matches: theme,
      keyword_assisted_matches: keyword,
      specialty_breadth: specialties.length,
      outlier_topic_count: flags.filter((f) => f.startsWith('outlier_topic:')).length,
      lowest_scoring_slugs: lowest.map((r) => `${r.answer_slug}:${r.score}`).join('|'),
      flags: flags.join('|'),
      coherence_status: flags.length ? 'needs_review' : 'coherent',
    });

    if (flags.length) {
      for (const row of lowest) {
        downgrades.push({
          answer_id: row.answer_id,
          answer_slug: row.answer_slug,
          proposed_contributor_id: id,
          score: row.score,
          match_type: classifyMatchType(row.match_reasons),
          flags: flags.join('|'),
          automated_action: flags.some((f) => f.startsWith('outlier_topic') || f.includes('keyword_gt'))
            ? 'downgrade_to_medium_for_qa'
            : 'flag_for_human_qa',
        });
      }
    }
  }

  coverage.sort((a, b) => Number(b.proposed_count) - Number(a.proposed_count));
  return { coverage, outliers, downgrades };
}

function relatedHeuristic(topic, specialty) {
  const pairs = [
    [/anxiety|stress/, /anxiety|stress|panic|ocd|worry/],
    [/depression/, /depression|mood/],
    [/addiction|recovery/, /addict|substance|alcohol|drug/],
    [/trauma|safety/, /trauma|ptsd|abuse/],
    [/grief|loss/, /grief|loss|bereavement/],
    [/family|parent|teen/, /parent|family|child|teen|school/],
    [/relationship/, /relationship|couple|marital|codepend/],
    [/identity|self/, /self|esteem|shame|identity/],
    [/work|burnout/, /work|burnout|career|productivity/],
    [/neurodiverg|adhd/, /adhd|autism|executive|neuro/],
    [/therapy|care/, /testing|diagnostic|evaluation|therapy/],
    [/gender|sexual/, /lgbtq|transgender|lesbian|bisexual/],
    [/meaning|faith|spiritual/, /spirit|faith|meaning/],
    [/general mental|life transition/, /life transition|stress|mood|anxiety/],
  ];
  return pairs.some(([tRe, sRe]) => tRe.test(topic) && sRe.test(specialty));
}

function isTopicDefensible(topicId, specialties) {
  if (!topicId) return true;
  const joined = specialties.join(' ').toLowerCase();
  const map = {
    'anxiety-and-stress': /anxiety|stress|panic|ocd|obsess|worry|phobia/,
    depression: /depression|mood/,
    'addiction-and-recovery': /addict|substance|alcohol|drug|recovery|sober/,
    'trauma-and-safety': /trauma|ptsd|abuse/,
    'grief-and-loss': /grief|loss|bereavement/,
    'family-and-parenting': /parent|family|child|teen|school|adoption/,
    'teens-and-identity': /teen|child|school|parent|adolescent|youth/,
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
  if (!re) return false;
  return re.test(joined);
}

function countMap(values) {
  const m = new Map();
  for (const v of values) m.set(v, (m.get(v) || 0) + 1);
  return m;
}

function topN(map, n) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n);
}

function recruitmentGaps(unmatched) {
  const byTopic = countMap(unmatched.map((r) => r.deeper_topic_name || r.deeper_topic));
  const suggestions = {
    'loneliness-and-belonging': 'Loneliness / social connection specialist',
    'therapy-and-care-navigation': 'Care navigation / treatment options clinician',
    'general-mental-health': 'General adult psychopathology / life-stress clinician',
    'teens-and-identity': 'Adolescent identity clinician (non-coach)',
    'meaning-faith-and-existential-questions': 'Keep editorial (Rick) or spiritual-trauma clinician',
    'gender-sexuality-and-intimacy': 'LGBTQ+ affirming clinician with intimacy focus',
  };
  return [...byTopic.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({
      topic,
      unmatched_count: count,
      recommended_specialty_recruitment: suggestions[unmatched.find((u) => (u.deeper_topic_name || u.deeper_topic) === topic)?.deeper_topic] ||
        suggestions[topic] ||
        'Specialty clinician aligned to this topic cluster',
      impact_if_filled: count,
    }));
}

async function main() {
  mkdirSync(APPLY, { recursive: true });
  const highRows = readCsv(join(OUT, 'high-confidence-assignments.csv'));
  const unmatched = readCsv(join(OUT, 'unmatched-answers.csv'));
  const detail = readCsv(join(OUT, 'assignment-detail.csv'));
  const contributorById = loadContributors();
  const { titles } = await fetchTitles([]);

  const sample = pickQaSample(highRows, contributorById);
  const counts = countMap(highRows.map((r) => r.proposed_contributor_id));

  // Enrich sample with alternate candidates from detail best fields + title
  const detailBySlug = new Map(detail.map((d) => [d.answer_slug, d]));
  const qaRows = sample.map((row) => {
    const clinician = contributorById.get(row.proposed_contributor_id) || {};
    const specialties = clinician._specialties || [];
    const matchType = classifyMatchType(row.match_reasons);
    const score = Number(row.score);
    const margin = (score - HIGH_THRESHOLD).toFixed(2);
    const shareBefore = 0;
    const shareAfter = (((counts.get(row.proposed_contributor_id) || 0) / MIGRATABLE) * 100).toFixed(2);
    const others = detail
      .filter(
        (d) =>
          d.answer_slug === row.answer_slug ||
          (d.deeper_topic === row.deeper_topic &&
            d.proposed_contributor_id &&
            d.proposed_contributor_id !== row.proposed_contributor_id &&
            d.confidence === 'high')
      )
      .slice(0, 0); // placeholder; use best fields
    const whyWon = [
      `score=${score}`,
      `confidence=${row.confidence}`,
      `match_type=${matchType}`,
      row.soft_cap_impact && row.soft_cap_impact !== 'none' ? `soft_cap=${row.soft_cap_impact}` : null,
      'deterministic_tie_break_among_equals',
    ]
      .filter(Boolean)
      .join('; ');

    // Find other high candidates on same answer from medium/high detail: only one proposed; use match_reasons peers via same topic top clinicians
    const sameTopicAlts = highRows
      .filter((r) => r.deeper_topic === row.deeper_topic && r.proposed_contributor_id !== row.proposed_contributor_id)
      .reduce((acc, r) => {
        acc.set(r.proposed_contributor_id, (acc.get(r.proposed_contributor_id) || 0) + 1);
        return acc;
      }, new Map());
    const otherEligible = [...sameTopicAlts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, n]) => `${id}(topic_volume:${n})`)
      .join('|');

    return {
      answer_title: titles.get(row.answer_slug) || row.answer_slug,
      answer_slug: row.answer_slug,
      answer_url: `${SITE}/answers/${row.answer_slug}/`,
      answer_id: row.answer_id,
      proposed_clinician_id: row.proposed_contributor_id,
      proposed_clinician_name: row.proposed_contributor_name,
      clinician_credentials: clinician._credentials || clinician.credentials || '',
      clinician_professional_title: clinician._title || clinician.professionalTitle || '',
      verified_specialties: specialties.join('|'),
      matched_specialty: row.matched_specialty,
      deeper_topic: row.deeper_topic,
      deeper_topic_name: row.deeper_topic_name,
      deeper_category: row.deeper_category,
      deeper_theme: row.deeper_theme,
      exact_match_reason: row.match_reasons,
      assignment_score: row.score,
      confidence: row.confidence,
      confidence_threshold_margin: margin,
      match_type: matchType,
      other_eligible_clinicians: otherEligible,
      why_selected_won: whyWon,
      reviewer_share_before_pct: shareBefore.toFixed(2),
      reviewer_share_after_pct: shareAfter,
      sample_inclusion_reasons: row.sample_reasons,
      ymyl_flag: isYmyL(row) ? 'yes' : 'no',
      human_qa_decision: 'pending',
      human_qa_notes: '',
    };
  });

  const qaCols = [
    'answer_title',
    'answer_slug',
    'answer_url',
    'answer_id',
    'proposed_clinician_id',
    'proposed_clinician_name',
    'clinician_credentials',
    'clinician_professional_title',
    'verified_specialties',
    'matched_specialty',
    'deeper_topic',
    'deeper_topic_name',
    'deeper_category',
    'deeper_theme',
    'exact_match_reason',
    'assignment_score',
    'confidence',
    'confidence_threshold_margin',
    'match_type',
    'other_eligible_clinicians',
    'why_selected_won',
    'reviewer_share_before_pct',
    'reviewer_share_after_pct',
    'sample_inclusion_reasons',
    'ymyl_flag',
    'human_qa_decision',
    'human_qa_notes',
  ];
  write('qa-sample.csv', toCsv(qaRows, qaCols));

  const sampleByClinician = countMap(qaRows.map((r) => r.proposed_clinician_id));
  const sampleByTheme = countMap(qaRows.map((r) => r.deeper_theme));
  const md = `# Clinical contributor QA sample

Generated: ${new Date().toISOString()}

## Composition

- Sample size: **${qaRows.length}**
- Source pool: **${highRows.length}** high-confidence assignments
- Clinicians represented: **${sampleByClinician.size}** / 15 proposed
- Human QA decision column: \`pending\` (not auto-filled)

### By clinician

${[...sampleByClinician.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([id, n]) => `- ${id}: ${n}`)
  .join('\n')}

### By theme

${[...sampleByTheme.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([id, n]) => `- ${id}: ${n}`)
  .join('\n')}

### Inclusion strata

- every proposed clinician
- top 10 by volume
- share > 8% of migratable corpus
- near high/medium threshold (score 80–85)
- alias and parent-theme matches
- YMYL clusters (trauma, abuse, addiction, eating, postpartum, OCD, chronic illness, testing)
- ≥5 examples per major theme where available
- broad-generalist topic clusters

## Sample rows

| Title | Clinician | Topic | Score | Match type | QA |
| --- | --- | --- | ---: | --- | --- |
${qaRows
  .slice(0, 40)
  .map(
    (r) =>
      `| ${r.answer_title.replace(/\|/g, '/').slice(0, 70)} | ${r.proposed_clinician_name} | ${r.deeper_topic_name} | ${r.assignment_score} | ${r.match_type} | pending |`
  )
  .join('\n')}

Full machine-readable sample: \`qa-sample.csv\`.
`;
  write('qa-sample.md', md);

  const { coverage, outliers, downgrades } = buildCoherence(highRows, contributorById);
  write(
    'reviewer-coverage-coherence.csv',
    toCsv(coverage, [
      'contributor_id',
      'contributor_name',
      'proposed_count',
      'pct_migratable',
      'top_topics',
      'top_themes',
      'top_match_types',
      'exact_matches',
      'alias_matches',
      'parent_theme_matches',
      'keyword_assisted_matches',
      'specialty_breadth',
      'outlier_topic_count',
      'lowest_scoring_slugs',
      'flags',
      'coherence_status',
    ])
  );
  write(
    'reviewer-topic-outliers.csv',
    toCsv(outliers, [
      'contributor_id',
      'contributor_name',
      'topic',
      'topic_id',
      'answer_count',
      'verified_specialties',
      'reason',
      'recommended_action',
    ])
  );
  write(
    'coherence-automated-flags.csv',
    toCsv(downgrades, [
      'answer_id',
      'answer_slug',
      'proposed_contributor_id',
      'score',
      'match_type',
      'flags',
      'automated_action',
    ])
  );

  const flaggedSlugs = new Set(downgrades.filter((d) => d.automated_action === 'downgrade_to_medium_for_qa').map((d) => d.answer_slug));
  const surviving = highRows.filter((r) => !flaggedSlugs.has(r.answer_slug));
  const downgradedCount = highRows.length - surviving.length;

  // Unmatched editorial transition
  const unmatchedRows = unmatched.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    answer_title: titles.get(r.answer_slug) || r.answer_slug,
    answer_url: `${SITE}/answers/${r.answer_slug}/`,
    current_reviewer_id: r.current_reviewer_id,
    deeper_topic: r.deeper_topic,
    deeper_topic_name: r.deeper_topic_name,
    deeper_theme: r.deeper_theme,
    confidence: r.confidence,
    best_contributor_id: r.best_contributor_id,
    score: r.score,
    proposed_end_state: 'editorial_reviewed_by_deeper',
    proposed_clinical_contributor_id: '',
    proposed_clinical_reviewer_id: '',
    clear_named_person_attribution: 'yes',
    preserve_reviewed_at_legacy: 'yes',
    public_label: 'Editorially reviewed by Deeper',
    show_clinical_review_date: 'no',
  }));
  write(
    'unmatched-editorial-transition.csv',
    toCsv(unmatchedRows, [
      'answer_id',
      'answer_slug',
      'answer_title',
      'answer_url',
      'current_reviewer_id',
      'deeper_topic',
      'deeper_topic_name',
      'deeper_theme',
      'confidence',
      'best_contributor_id',
      'score',
      'proposed_end_state',
      'proposed_clinical_contributor_id',
      'proposed_clinical_reviewer_id',
      'clear_named_person_attribution',
      'preserve_reviewed_at_legacy',
      'public_label',
      'show_clinical_review_date',
    ])
  );

  const gaps = recruitmentGaps(unmatched);
  write(
    'specialist-recruitment-gaps.csv',
    toCsv(gaps, ['topic', 'unmatched_count', 'recommended_specialty_recruitment', 'impact_if_filled'])
  );

  // Apply package files
  const backfill = surviving.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    clinical_contributor_id: r.proposed_contributor_id,
    clinical_contributor_method: 'specialty_matched_organizational_approval',
    clinical_contributor_assigned_at: 'PENDING_APPLY_TIMESTAMP',
    approval_source: 'peachtree_psychology_susan_keenan',
    do_not_set_clinically_reviewed_at: true,
    preserve_reviewed_by_legacy: r.current_reviewer_id,
    preserve_reviewed_at_legacy: r.reviewed_at_legacy,
  }));
  write('clinical-contributor-backfill-923.json', { count: backfill.length, note: 'Surviving high-confidence after automated coherence downgrades', rows: backfill }, APPLY);
  // Also keep original 923 list
  write(
    'clinical-contributor-backfill-all-high.json',
    {
      count: highRows.length,
      rows: highRows.map((r) => ({
        answer_id: r.answer_id,
        answer_slug: r.answer_slug,
        clinical_contributor_id: r.proposed_contributor_id,
        clinical_contributor_method: 'specialty_matched_organizational_approval',
        preserve_reviewed_by_legacy: r.current_reviewer_id,
        preserve_reviewed_at_legacy: r.reviewed_at_legacy,
      })),
    },
    APPLY
  );

  const editorialMutation = unmatchedRows.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    editorial_review_status: 'reviewed',
    editorial_reviewer_id: 'deeper-editorial',
    editorially_reviewed_at: null,
    clinical_contributor_id: null,
    clinical_reviewer_id: null,
    clear_public_named_person: true,
    preserve_reviewed_by_legacy: r.current_reviewer_id,
    preserve_reviewed_at_legacy: 'from_db',
  }));
  write('editorial-transition-145.json', { count: editorialMutation.length, rows: editorialMutation }, APPLY);

  const rollback = [...highRows, ...unmatched].map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    original_reviewed_by: r.current_reviewer_id,
    original_reviewed_at: r.reviewed_at_legacy || null,
    original_review_status: 'reviewed',
  }));
  write('rollback-mapping.json', { count: rollback.length, rows: rollback }, APPLY);

  write(
    'phase-c-summary.json',
    {
      generated_at: new Date().toISOString(),
      high_confidence_original: highRows.length,
      high_confidence_surviving_after_coherence_flags: surviving.length,
      automated_coherence_downgrades: downgradedCount,
      flagged_for_human_qa_rows: downgrades.length,
      clinicians_needing_review: coverage.filter((c) => c.coherence_status === 'needs_review').map((c) => c.contributor_id),
      qa_sample_size: qaRows.length,
      unmatched_editorial_transition: unmatchedRows.length,
      recommended_crosswalk_revisions: [
        'Tighten Life Transitions → work-and-burnout / general-mental-health weights; require keyword support for high confidence',
        'Prevent Trauma specialty from winning meaning/faith pages unless trauma language is primary',
        'Require stronger perinatal keywords before Pregnancy specialty influences anxiety/depression pages',
        'Exclude coach (Jeannine) from non-executive-function family pages that lack student/parent/ADHD signals',
        'Add dedicated loneliness/social-connection specialty mapping or leave those medium/unmatched',
      ],
    }
  );

  console.log(
    JSON.stringify(
      {
        qa_sample: qaRows.length,
        coherence_needs_review: coverage.filter((c) => c.coherence_status === 'needs_review').length,
        outliers: outliers.length,
        high_original: highRows.length,
        high_surviving: surviving.length,
        downgraded: downgradedCount,
        unmatched: unmatchedRows.length,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
