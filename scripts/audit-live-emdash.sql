-- Audit em-dashes in live (promoted) answer fields.
-- Run in Supabase SQL editor or via psql.
-- To apply, use the UPDATE statement at the bottom.

-- ── Count & sample ───────────────────────────────────────────────────────────

SELECT
  COUNT(*) FILTER (WHERE short_answer          LIKE '%—%' OR short_answer          LIKE '%–%') AS lede_hits,
  COUNT(*) FILTER (WHERE suggested_schema_answer LIKE '%—%' OR suggested_schema_answer LIKE '%–%') AS canonical_hits,
  COUNT(*) FILTER (WHERE improved_summary       LIKE '%—%' OR improved_summary       LIKE '%–%') AS summary_hits
FROM questions_master
WHERE staging_rewrite_prompt_version IS NOT NULL;

-- Sample affected rows
SELECT slug, LEFT(short_answer, 120) AS lede_preview
FROM questions_master
WHERE (short_answer LIKE '%—%' OR short_answer LIKE '%–%')
  AND staging_rewrite_prompt_version IS NOT NULL
LIMIT 20;

-- ── Repair live fields (run after reviewing the sample above) ────────────────
-- Replaces em-dash and en-dash with ', ' and cleans double commas.
-- Uncomment and run only after confirming the sample looks right.

/*
UPDATE questions_master
SET
  short_answer = TRIM(REGEXP_REPLACE(REGEXP_REPLACE(short_answer, '\s*[—–]\s*', ', ', 'g'), ',\s*,', ',', 'g')),
  improved_summary = TRIM(REGEXP_REPLACE(REGEXP_REPLACE(improved_summary, '\s*[—–]\s*', ', ', 'g'), ',\s*,', ',', 'g')),
  suggested_schema_answer = TRIM(REGEXP_REPLACE(REGEXP_REPLACE(suggested_schema_answer, '\s*[—–]\s*', ', ', 'g'), ',\s*,', ',', 'g'))
WHERE
  (short_answer LIKE '%—%' OR short_answer LIKE '%–%'
   OR improved_summary LIKE '%—%' OR improved_summary LIKE '%–%'
   OR suggested_schema_answer LIKE '%—%' OR suggested_schema_answer LIKE '%–%')
  AND staging_rewrite_prompt_version IS NOT NULL;
*/
