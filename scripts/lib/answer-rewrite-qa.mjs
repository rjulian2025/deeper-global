const YMYL_TERMS = [
  'suicide', 'suicidal', 'self-harm', 'self harm', 'eating disorder', 'anorexia', 'bulimia',
  'psychosis', 'psychotic', 'dissociation', 'dissociative', 'substance', 'withdrawal',
  'medication', 'antidepressant', 'ssri', 'postpartum', 'pediatric', 'adolescent', 'teen',
];
const SUICIDE_IDEATION_TERMS = ['suicide', 'suicidal', 'self-harm', 'self harm', 'want to die', 'kill myself'];

export function wordCount(text) {
  return String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
}

function paragraphs(text) {
  return String(text ?? '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

function hasMarkdown(text) {
  return /(\*\*|##|^\s*-\s)/m.test(String(text ?? ''));
}

function hasEmDash(text) {
  return /[—–]/.test(String(text ?? ''));
}

function unresolvedHedges(text) {
  const issues = [];
  for (const paragraph of paragraphs(text)) {
    if (/\b(it depends|this varies)\b/i.test(paragraph)) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      for (let i = 0; i < sentences.length; i += 1) {
        if (/\b(it depends|this varies)\b/i.test(sentences[i])) {
          const rest = sentences.slice(i + 1).join(' ');
          if (!rest || rest.length < 20) issues.push(paragraph.slice(0, 120));
        }
      }
    }
  }
  return issues;
}

function voiceViolations(fields) {
  const fails = [];
  const banned = [
    { re: /\butilize\b/i, issue: 'uses "utilize"' },
    { re: /\bmental health journey\b/i, issue: 'uses "mental health journey"' },
    { re: /\bjourney\b/i, issue: 'uses "journey"' },
    { re: /it'?s okay to not be okay/i, issue: 'uses "it\'s okay to not be okay"' },
    { re: /^[^.?!]*\?\s*$/m, issue: 'opens with rhetorical question' },
    { re: /(?:^|\n\n)It'?s important to\b/i, issue: 'paragraph begins with "It\'s important to"' },
    { re: /^(As mentioned above|As noted)\b/im, issue: 'section opens with backward reference' },
  ];
  for (const [field, value] of Object.entries(fields)) {
    const text = Array.isArray(value) ? value.join('\n') : String(value ?? '');
    for (const rule of banned) {
      if (rule.re.test(text)) fails.push({ field, issue: rule.issue, severity: 'FAIL' });
    }
  }
  return fails;
}

function primaryTermMatches(question, primaryTerm) {
  const q = String(question ?? '').toLowerCase();
  const term = String(primaryTerm ?? '').toLowerCase().trim();
  if (!term) return false;
  const main = term.split('(')[0].trim();
  return q.includes(main) || main.split(/\s+/).filter((w) => w.length > 3).some((w) => q.includes(w));
}

function isYmyl(question) {
  const q = String(question ?? '').toLowerCase();
  return YMYL_TERMS.some((term) => q.includes(term));
}

function impliesSuicidalIdeation(question) {
  const q = String(question ?? '').toLowerCase();
  return SUICIDE_IDEATION_TERMS.some((term) => q.includes(term));
}

export function evaluateStagingRewrite(row) {
  const issues = [];
  const fields = {
    primary_term: row.staging_primary_term,
    canonical_answer: row.staging_canonical_answer,
    lede: row.staging_lede,
    key_takeaways: row.staging_key_takeaways,
    what_you_might_be_experiencing: row.staging_what_you_might_be_experiencing,
    what_can_help: row.staging_what_can_help,
    when_to_reach_out: row.staging_when_to_reach_out,
  };

  if (row.staging_rewrite_error) {
    issues.push({ field: 'staging_rewrite_error', issue: row.staging_rewrite_error, severity: 'FAIL', action: 'rerun' });
  }

  for (const key of Object.keys(fields)) {
    const val = fields[key];
    if (key === 'key_takeaways') {
      if (!Array.isArray(val) || val.length !== 5 || val.some((v) => !String(v).trim())) {
        issues.push({ field: key, issue: 'key_takeaways must contain exactly 5 non-empty items', severity: 'FAIL', action: 'rerun' });
      }
    } else if (!String(val ?? '').trim()) {
      issues.push({ field: key, issue: 'field missing or empty', severity: 'FAIL', action: 'rerun' });
    }
  }

  if (wordCount(fields.canonical_answer) > 50) {
    issues.push({ field: 'canonical_answer', issue: `${wordCount(fields.canonical_answer)} words (max 50)`, severity: 'FAIL', action: 'rerun' });
  }

  const canonical = String(fields.canonical_answer ?? '').trim();
  const lede = String(fields.lede ?? '').trim();
  if (canonical && lede && !lede.startsWith(canonical)) {
    issues.push({ field: 'lede', issue: 'does not open with canonical_answer verbatim', severity: 'FAIL', action: 'rerun' });
  }

  const experiencing = String(fields.what_you_might_be_experiencing ?? '').trim();
  if (lede && experiencing) {
    const ledeExtra = lede.slice(canonical.length).trim();
    const expOpen = experiencing.split(/[.!?]/)[0]?.trim() ?? '';
    if (ledeExtra && expOpen && expOpen.length > 20 && ledeExtra.includes(expOpen.slice(0, 40))) {
      issues.push({ field: 'lede', issue: 'duplicates opening of what_you_might_be_experiencing', severity: 'WARN', action: 'manual edit' });
    }
  }

  for (const [field, value] of Object.entries(fields)) {
    const text = Array.isArray(value) ? value.join('\n') : String(value ?? '');
    if (/review status/i.test(text)) {
      issues.push({ field, issue: 'contains "Review status"', severity: 'FAIL', action: 'rerun' });
    }
    if (hasMarkdown(text)) {
      issues.push({ field, issue: 'contains markdown formatting', severity: 'FAIL', action: 'rerun' });
    }
    if ((field === 'canonical_answer' || field === 'lede') && hasEmDash(text)) {
      issues.push({ field, issue: 'contains em-dash', severity: 'FAIL', action: 'rerun' });
    }
  }

  issues.push(...voiceViolations(fields));

  if (!primaryTermMatches(row.question, fields.primary_term)) {
    issues.push({ field: 'primary_term', issue: 'does not clearly match condition in question', severity: 'WARN', action: 'manual edit' });
  }

  for (const field of ['what_can_help', 'when_to_reach_out']) {
    const text = String(fields[field] ?? '');
    if (/\b(this|that|these|those|it|they)\b/i.test(text.split('\n\n')[0] ?? '') && !text.split('\n\n')[0].includes(String(fields.primary_term ?? ''))) {
      issues.push({ field, issue: 'opening may rely on prior context (spot-check)', severity: 'WARN', action: 'manual edit' });
    }
    for (const hedge of unresolvedHedges(text)) {
      issues.push({ field, issue: `unresolved hedge: "${hedge}…"`, severity: 'WARN', action: 'system prompt fix' });
    }
  }

  const combined = [fields.lede, fields.what_you_might_be_experiencing, fields.what_can_help, fields.when_to_reach_out].join(' ');
  const combinedWords = wordCount(combined);
  if (combinedWords < 350 || combinedWords > 550) {
    issues.push({ field: 'word_count', issue: `combined body ${combinedWords} words (target 350–550)`, severity: combinedWords < 300 || combinedWords > 600 ? 'FAIL' : 'WARN', action: 'rerun' });
  }

  if (Array.isArray(fields.key_takeaways)) {
    fields.key_takeaways.forEach((bullet, index) => {
      const wc = wordCount(bullet);
      if (wc < 15 || wc > 35) {
        issues.push({ field: `key_takeaways[${index}]`, issue: `${wc} words (target 15–35)`, severity: 'WARN', action: 'rerun' });
      }
    });
  }

  if (isYmyl(row.question) || impliesSuicidalIdeation(row.question)) {
    const reach = String(fields.when_to_reach_out ?? '');
    if (!reach.includes('988 (Suicide & Crisis Lifeline)')) {
      issues.push({ field: 'when_to_reach_out', issue: 'YMYL topic missing exact 988 crisis line phrase', severity: 'FAIL', action: 'rerun' });
    }
    if (!/\b(professional|therapist|clinician|doctor|psychiatrist|counselor|evaluation|provider)\b/i.test(reach)) {
      issues.push({ field: 'when_to_reach_out', issue: 'YMYL topic missing professional evaluation recommendation', severity: 'FAIL', action: 'rerun' });
    }
  }

  if (impliesSuicidalIdeation(row.question) && !isYmyl(row.question)) {
    issues.push({ field: 'question', issue: 'question implies suicidal ideation', severity: 'WARN', action: 'manual edit' });
  }

  const hasFail = issues.some((i) => i.severity === 'FAIL');
  const hasWarn = issues.some((i) => i.severity === 'WARN');
  return { issues, score: hasFail ? 'FAIL' : hasWarn ? 'WARN' : 'PASS' };
}
