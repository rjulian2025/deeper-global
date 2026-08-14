-- Rollback for 20260716210000_clinical_attribution_model.sql
-- Safe only if no production code depends on these columns yet.
-- Prefer restoring answer values from reports/reviewer-migration/apply-package/rollback-mapping.json
-- before dropping columns if any backfill has been applied.

begin;

alter table public.questions_master
  drop constraint if exists questions_master_clinical_contributor_method_valid,
  drop constraint if exists questions_master_editorial_review_status_valid,
  drop constraint if exists questions_master_clinical_review_date_requires_reviewer;

drop index if exists questions_master_clinical_contributor_id_idx;
drop index if exists questions_master_clinical_reviewer_id_idx;
drop index if exists questions_master_editorial_reviewer_id_idx;
drop index if exists questions_master_attribution_legacy_bulk_idx;

alter table public.questions_master
  drop column if exists clinical_contributor_id,
  drop column if exists clinical_contributor_assigned_at,
  drop column if exists clinical_contributor_method,
  drop column if exists clinical_contributor_approval_source,
  drop column if exists clinical_reviewer_id,
  drop column if exists clinically_reviewed_at,
  drop column if exists editorial_review_status,
  drop column if exists editorial_reviewer_id,
  drop column if exists editorially_reviewed_at,
  drop column if exists attribution_legacy_reviewed_by,
  drop column if exists attribution_legacy_reviewed_at,
  drop column if exists attribution_legacy_bulk_approval;

commit;
