-- Proposal: Guard against future duplicate slugs
-- Do not run automatically in CI; apply via controlled migration.
-- Postgres-safe concurrent creation to avoid table locking.
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS questions_master_slug_unique_idx
  ON public.questions_master (slug);

