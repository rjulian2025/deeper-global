-- Additive migration: therapy modality psychoeducation hub table.
-- Safe to rerun. Does not modify any existing tables.

CREATE TABLE IF NOT EXISTS public.modalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  also_known_as text[],
  category text NOT NULL,
  status text NOT NULL DEFAULT 'draft',

  -- Content fields
  canonical_definition text,
  lede text,
  what_it_is text,
  what_a_session_looks_like text,
  what_it_treats text,
  what_the_evidence_says text,
  who_it_is_for text,
  how_to_find_a_practitioner text,
  key_takeaways jsonb,

  -- AI/schema fields
  primary_term text,
  canonical_answer text,
  schema_description text,

  -- Trust fields
  reviewed_by text,
  reviewed_at timestamptz,
  review_status text DEFAULT 'draft',
  source_refs jsonb,

  -- Staging fields (same pattern as questions_master)
  staging_lede text,
  staging_what_it_is text,
  staging_what_a_session_looks_like text,
  staging_what_it_treats text,
  staging_what_the_evidence_says text,
  staging_who_it_is_for text,
  staging_how_to_find_a_practitioner text,
  staging_key_takeaways jsonb,
  staging_canonical_answer text,
  staging_rewrite_at timestamptz,
  staging_rewrite_error text,
  staging_rewrite_model text,
  staging_rewrite_prompt_version text,
  ymyl_flagged boolean NOT NULL DEFAULT false,

  -- Metadata
  related_question_slugs text[],
  related_modality_slugs text[],
  practitioner_specialty_tags text[],
  seo_title text,
  meta_description text,
  noindex boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS modalities_slug_idx
  ON public.modalities (slug);

CREATE INDEX IF NOT EXISTS modalities_category_idx
  ON public.modalities (category);

CREATE INDEX IF NOT EXISTS modalities_status_idx
  ON public.modalities (status);

COMMENT ON TABLE public.modalities IS
  'Psychoeducation hub pages for therapy modalities.
   Each row is one treatment approach with structured
   content fields and staging equivalents.';

COMMENT ON COLUMN public.modalities.status IS
  'draft | reviewed | published';

COMMENT ON COLUMN public.modalities.category IS
  'evidence-based | somatic | integrative | emerging';

COMMENT ON COLUMN public.modalities.related_question_slugs IS
  'Slugs from questions_master that belong to this
   modality cluster.';

COMMENT ON COLUMN public.modalities.practitioner_specialty_tags IS
  'Tags matching Deeper practitioner specialties for
   cross-referencing.';
