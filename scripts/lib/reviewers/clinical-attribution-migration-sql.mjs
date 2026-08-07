/** Bundled additive SQL so Vercel admin functions do not depend on filesystem paths. */
export const CLINICAL_ATTRIBUTION_MIGRATION_SQL = `
begin;

alter table public.questions_master
  add column if not exists clinical_contributor_id text,
  add column if not exists clinical_contributor_assigned_at timestamptz,
  add column if not exists clinical_contributor_method text,
  add column if not exists clinical_contributor_approval_source text,
  add column if not exists clinical_reviewer_id text,
  add column if not exists clinically_reviewed_at timestamptz,
  add column if not exists editorial_review_status text,
  add column if not exists editorial_reviewer_id text,
  add column if not exists editorially_reviewed_at timestamptz,
  add column if not exists attribution_legacy_reviewed_by text,
  add column if not exists attribution_legacy_reviewed_at timestamptz,
  add column if not exists attribution_legacy_bulk_approval boolean not null default false;

comment on column public.questions_master.clinical_contributor_id is
  'Specialty-matched clinical contributor (not a page-level clinical review claim).';
comment on column public.questions_master.clinical_contributor_method is
  'e.g. specialty_matched_organizational_approval';
comment on column public.questions_master.clinical_reviewer_id is
  'True page-level clinical reviewer when a real review exists.';
comment on column public.questions_master.clinically_reviewed_at is
  'Date of true page-level clinical review only; never set from migration date.';
comment on column public.questions_master.editorial_reviewer_id is
  'Editorial reviewer id (e.g. deeper-editorial, rick-julian).';
comment on column public.questions_master.attribution_legacy_bulk_approval is
  'True when reviewed_at came from bulk corpus approval and must not be shown as clinical review date.';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'questions_master_clinical_contributor_method_valid'
  ) then
    alter table public.questions_master
      add constraint questions_master_clinical_contributor_method_valid
      check (
        clinical_contributor_method is null
        or clinical_contributor_method in (
          'specialty_matched_organizational_approval',
          'manual_override'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'questions_master_editorial_review_status_valid'
  ) then
    alter table public.questions_master
      add constraint questions_master_editorial_review_status_valid
      check (
        editorial_review_status is null
        or editorial_review_status in ('draft', 'reviewed', 'approved', 'published')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'questions_master_clinical_review_date_requires_reviewer'
  ) then
    alter table public.questions_master
      add constraint questions_master_clinical_review_date_requires_reviewer
      check (
        clinically_reviewed_at is null
        or clinical_reviewer_id is not null
      );
  end if;
end $$;

create index if not exists questions_master_clinical_contributor_id_idx
  on public.questions_master (clinical_contributor_id);

create index if not exists questions_master_clinical_reviewer_id_idx
  on public.questions_master (clinical_reviewer_id);

create index if not exists questions_master_editorial_reviewer_id_idx
  on public.questions_master (editorial_reviewer_id);

create index if not exists questions_master_attribution_legacy_bulk_idx
  on public.questions_master (attribution_legacy_bulk_approval)
  where attribution_legacy_bulk_approval = true;

commit;
`;
