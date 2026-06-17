-- Deeper Global Claude answer rewrite staging columns
-- Apply in Supabase SQL editor before running scripts/rewrite-answers-claude.mjs
--
-- Safe migration: ADD COLUMN IF NOT EXISTS only. No ALTER, DROP, or UPDATE
-- on existing production columns (answer, short_answer, answer_sections,
-- slug, question, review_status, key_takeaways, etc.).

alter table public.questions_master
  add column if not exists staging_rewrite_at timestamptz,
  add column if not exists staging_rewrite_error text,
  add column if not exists staging_primary_term text,
  add column if not exists staging_canonical_answer text,
  add column if not exists staging_lede text,
  add column if not exists staging_key_takeaways jsonb,
  add column if not exists staging_what_you_might_be_experiencing text,
  add column if not exists staging_what_can_help text,
  add column if not exists staging_when_to_reach_out text,
  add column if not exists ymyl_flagged boolean not null default false,
  add column if not exists staging_rewrite_model text,
  add column if not exists staging_rewrite_prompt_version text;

comment on column public.questions_master.staging_rewrite_at is
  'Timestamp when Claude rewrite staging fields were last written.';

comment on column public.questions_master.staging_rewrite_error is
  'Last Claude rewrite error message when staging fields were not populated.';

comment on column public.questions_master.staging_primary_term is
  'Claude rewrite draft: primary_term — canonical condition or topic name.';

comment on column public.questions_master.staging_canonical_answer is
  'Claude rewrite draft: canonical_answer — machine-extractable answer, max 50 words.';

comment on column public.questions_master.staging_lede is
  'Claude rewrite draft: lede — opening summary (canonical_answer + human extension).';

comment on column public.questions_master.staging_key_takeaways is
  'Claude rewrite draft: key_takeaways — exactly 5 extractable bullet strings.';

comment on column public.questions_master.staging_what_you_might_be_experiencing is
  'Claude rewrite draft: what_you_might_be_experiencing — lived-experience section.';

comment on column public.questions_master.staging_what_can_help is
  'Claude rewrite draft: what_can_help — evidence-informed help section.';

comment on column public.questions_master.staging_when_to_reach_out is
  'Claude rewrite draft: when_to_reach_out — professional support and crisis guidance section.';

comment on column public.questions_master.ymyl_flagged is
  'Claude rewrite draft: YMYL safety topic detected during rewrite.';

comment on column public.questions_master.staging_rewrite_model is
  'Anthropic model ID used for the staging rewrite.';

comment on column public.questions_master.staging_rewrite_prompt_version is
  'Prompt version used for the staging rewrite.';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'questions_master_staging_key_takeaways_is_array') then
    alter table public.questions_master
      add constraint questions_master_staging_key_takeaways_is_array
      check (staging_key_takeaways is null or jsonb_typeof(staging_key_takeaways) = 'array');
  end if;
end $$;
