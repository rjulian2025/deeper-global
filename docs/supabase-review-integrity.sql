-- Deeper Global review integrity constraints for questions_master
--
-- IMPORTANT: Run data fixes BEFORE applying this migration:
--   npm run content:apply-integrity-fixes -- --apply
-- That script promotes Kenneth-attributed drafts, demotes duplicate slugs,
-- backfills related_questions, and corrects addiction prompt versions so
-- rows satisfy the constraints below.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'questions_master_review_status_valid') then
    alter table public.questions_master
      add constraint questions_master_review_status_valid
      check (
        review_status is null
        or review_status in ('draft', 'reviewed')
      );
  end if;

  if not exists (select 1 from pg_constraint where conname = 'questions_master_reviewed_at_required_with_reviewer') then
    alter table public.questions_master
      add constraint questions_master_reviewed_at_required_with_reviewer
      check (
        reviewed_by is null
        or reviewed_at is not null
      );
  end if;
end $$;

comment on constraint questions_master_review_status_valid on public.questions_master is
  'Restricts review_status to draft or reviewed after data remediation.';

comment on constraint questions_master_reviewed_at_required_with_reviewer on public.questions_master is
  'Requires reviewed_at whenever reviewed_by is set.';
