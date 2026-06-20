-- Deeper Global Semantic Enrichment V1
-- Non-destructive: adds optional JSONB column for human-question-centered metadata.
-- Run manually in Supabase SQL editor when ready to store approved enrichment.

alter table public.questions_master
  add column if not exists semantic_enrichment_v1 jsonb;

comment on column public.questions_master.semantic_enrichment_v1 is
  'Versioned semantic enrichment object centered on the human question. Supports alternate phrasings, related concerns, hubs, and next-step orientation. Educational only — not user diagnosis. Schema key: semantic_enrichment_v1.';

-- Optional: validate JSON shape at insert/update time (soft constraint via check)
-- Uncomment after first pilot promote if desired.
--
-- alter table public.questions_master
--   add constraint questions_master_semantic_enrichment_v1_is_object
--   check (
--     semantic_enrichment_v1 is null
--     or jsonb_typeof(semantic_enrichment_v1) = 'object'
--   );

-- Future V2: GIN index for search-heavy fields after corpus enrichment
-- create index if not exists questions_master_semantic_enrichment_v1_gin
--   on public.questions_master
--   using gin (semantic_enrichment_v1);
