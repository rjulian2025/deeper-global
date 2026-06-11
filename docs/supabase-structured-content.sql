-- Deeper Global structured answer content layer
-- Keep the existing question, short_answer, and answer columns as legacy fallbacks while migrating the corpus.

alter table public.questions_master
  add column if not exists improved_title text,
  add column if not exists improved_meta_description text,
  add column if not exists improved_summary text,
  add column if not exists answer_sections jsonb,
  add column if not exists key_takeaways jsonb,
  add column if not exists care_note text,
  add column if not exists related_questions jsonb,
  add column if not exists suggested_schema_question text,
  add column if not exists suggested_schema_answer text,
  add column if not exists primary_theme text,
  add column if not exists related_themes jsonb,
  add column if not exists citation_notes text,
  add column if not exists content_prompt_version text,
  add column if not exists content_enriched_at timestamptz,
  add column if not exists review_status text default 'draft',
  add column if not exists reviewed_by text,
  add column if not exists source_refs jsonb,
  add column if not exists primary_entities jsonb,
  add column if not exists related_entities jsonb;

comment on column public.questions_master.improved_title is
  'Consumer-facing title rewritten for emotional precision, CTR, and usefulness while preserving the natural-language query.';

comment on column public.questions_master.improved_meta_description is
  'Search-result description intended to create a reason to click beyond generic AI summaries.';

comment on column public.questions_master.improved_summary is
  'First visible answer summary: direct, validating, and insight-led.';

comment on column public.questions_master.answer_sections is
  'Ordered array of answer sections: [{ "type": "what_may_be_happening", "heading": "What may be happening", "body": "..." }]';

comment on column public.questions_master.key_takeaways is
  'Short extractable bullets for readers, search engines, and AI citation surfaces.';

comment on column public.questions_master.care_note is
  'Optional safety/care boundary specific to this answer.';

comment on column public.questions_master.related_questions is
  'Real follow-up search questions related to this answer.';

comment on column public.questions_master.suggested_schema_question is
  'Question text optimized for machine-readable Question schema without changing the original query field.';

comment on column public.questions_master.suggested_schema_answer is
  'Concise answer text optimized for machine-readable Answer schema and AI extraction.';

comment on column public.questions_master.primary_theme is
  'Primary consumer-facing theme for the answer.';

comment on column public.questions_master.related_themes is
  'Secondary consumer-facing themes useful for internal linking and topic intelligence.';

comment on column public.questions_master.citation_notes is
  'Editorial notes about sources, evidence boundaries, or citation posture.';

comment on column public.questions_master.content_prompt_version is
  'Prompt version used to generate the enriched fields.';

comment on column public.questions_master.content_enriched_at is
  'Timestamp when the enriched fields were generated or promoted.';

comment on column public.questions_master.source_refs is
  'Optional reviewed source references: [{ "title": "...", "url": "...", "publisher": "..." }]';

comment on column public.questions_master.primary_entities is
  'Canonical entities directly represented by this question and answer.';

comment on column public.questions_master.related_entities is
  'Secondary entities useful for topic graphs and related content.';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'questions_master_answer_sections_is_array') then
    alter table public.questions_master
      add constraint questions_master_answer_sections_is_array
      check (answer_sections is null or jsonb_typeof(answer_sections) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_key_takeaways_is_array') then
    alter table public.questions_master
      add constraint questions_master_key_takeaways_is_array
      check (key_takeaways is null or jsonb_typeof(key_takeaways) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_related_questions_is_array') then
    alter table public.questions_master
      add constraint questions_master_related_questions_is_array
      check (related_questions is null or jsonb_typeof(related_questions) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_related_themes_is_array') then
    alter table public.questions_master
      add constraint questions_master_related_themes_is_array
      check (related_themes is null or jsonb_typeof(related_themes) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_source_refs_is_array') then
    alter table public.questions_master
      add constraint questions_master_source_refs_is_array
      check (source_refs is null or jsonb_typeof(source_refs) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_primary_entities_is_array') then
    alter table public.questions_master
      add constraint questions_master_primary_entities_is_array
      check (primary_entities is null or jsonb_typeof(primary_entities) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_related_entities_is_array') then
    alter table public.questions_master
      add constraint questions_master_related_entities_is_array
      check (related_entities is null or jsonb_typeof(related_entities) = 'array');
  end if;
end $$;

create table if not exists public.answer_enrichment_drafts (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  question_slug text not null,
  original_title text not null,
  original_category text,
  prompt_version text not null default 'deeper-answer-enrichment-v1',
  model text,
  enriched_title text not null,
  enriched_meta_description text not null,
  enriched_summary text not null,
  key_takeaways jsonb not null,
  enriched_answer_body jsonb not null,
  enriched_care_note text,
  related_questions jsonb not null,
  schema_question text not null,
  schema_answer text not null,
  primary_theme text,
  related_themes jsonb,
  source_refs jsonb not null default '[]'::jsonb,
  primary_entities jsonb not null default '[]'::jsonb,
  related_entities jsonb not null default '[]'::jsonb,
  citation_notes text,
  safety_flags jsonb not null default '[]'::jsonb,
  citation_gaps jsonb not null default '[]'::jsonb,
  enrichment_status text not null default 'draft',
  quality_passed boolean not null default false,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  promoted_at timestamptz
);

alter table public.answer_enrichment_drafts
  add column if not exists source_refs jsonb not null default '[]'::jsonb,
  add column if not exists primary_entities jsonb not null default '[]'::jsonb,
  add column if not exists related_entities jsonb not null default '[]'::jsonb;

comment on column public.answer_enrichment_drafts.source_refs is
  'Draft-stage source references to verify before promotion.';

comment on column public.answer_enrichment_drafts.primary_entities is
  'Draft-stage canonical entities to verify before promotion.';

comment on column public.answer_enrichment_drafts.related_entities is
  'Draft-stage secondary entities to verify before promotion.';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_key_takeaways_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_key_takeaways_is_array
      check (jsonb_typeof(key_takeaways) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_body_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_body_is_array
      check (jsonb_typeof(enriched_answer_body) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_related_questions_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_related_questions_is_array
      check (jsonb_typeof(related_questions) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_related_themes_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_related_themes_is_array
      check (related_themes is null or jsonb_typeof(related_themes) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_source_refs_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_source_refs_is_array
      check (jsonb_typeof(source_refs) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_primary_entities_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_primary_entities_is_array
      check (jsonb_typeof(primary_entities) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_related_entities_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_related_entities_is_array
      check (jsonb_typeof(related_entities) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_safety_flags_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_safety_flags_is_array
      check (jsonb_typeof(safety_flags) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_citation_gaps_is_array') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_citation_gaps_is_array
      check (jsonb_typeof(citation_gaps) = 'array');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'answer_enrichment_drafts_question_prompt_unique') then
    alter table public.answer_enrichment_drafts
      add constraint answer_enrichment_drafts_question_prompt_unique
      unique (question_id, prompt_version);
  end if;
end $$;
