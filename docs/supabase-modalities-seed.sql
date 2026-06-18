-- Seed initial modality records for the psychoeducation hub.
-- Safe to rerun: ON CONFLICT (slug) DO NOTHING.
-- Content fields are intentionally null; generation script fills staging fields.

INSERT INTO public.modalities (slug, name, also_known_as, category, practitioner_specialty_tags)
VALUES
  (
    'emdr-therapy',
    'EMDR',
    ARRAY['Eye Movement Desensitization and Reprocessing']::text[],
    'evidence-based',
    ARRAY['EMDR', 'trauma', 'PTSD']::text[]
  ),
  (
    'ifs-therapy',
    'IFS',
    ARRAY['Internal Family Systems', 'parts work']::text[],
    'evidence-based',
    ARRAY['IFS', 'parts work', 'trauma', 'self-leadership']::text[]
  ),
  (
    'dbt-therapy',
    'DBT',
    ARRAY['Dialectical Behavior Therapy']::text[],
    'evidence-based',
    ARRAY['DBT', 'borderline', 'emotion regulation', 'distress tolerance']::text[]
  ),
  (
    'cbt-therapy',
    'CBT',
    ARRAY['Cognitive Behavioral Therapy']::text[],
    'evidence-based',
    ARRAY['CBT', 'anxiety', 'depression', 'thought patterns']::text[]
  ),
  (
    'act-therapy',
    'ACT',
    ARRAY['Acceptance and Commitment Therapy']::text[],
    'evidence-based',
    ARRAY['ACT', 'values', 'psychological flexibility', 'mindfulness']::text[]
  ),
  (
    'cpt-therapy',
    'CPT',
    ARRAY['Cognitive Processing Therapy']::text[],
    'evidence-based',
    ARRAY['CPT', 'PTSD', 'trauma', 'cognitive']::text[]
  ),
  (
    'prolonged-exposure-therapy',
    'Prolonged Exposure',
    ARRAY['PE therapy']::text[],
    'evidence-based',
    ARRAY['prolonged exposure', 'PTSD', 'trauma', 'exposure']::text[]
  ),
  (
    'mbsr-therapy',
    'MBSR',
    ARRAY['Mindfulness-Based Stress Reduction']::text[],
    'evidence-based',
    ARRAY['MBSR', 'mindfulness', 'stress', 'chronic pain']::text[]
  ),
  (
    'somatic-experiencing',
    'Somatic Experiencing',
    ARRAY['SE', 'somatic therapy']::text[],
    'somatic',
    ARRAY['somatic', 'nervous system', 'trauma', 'body-based']::text[]
  ),
  (
    'brainspotting-therapy',
    'Brainspotting',
    ARRAY['BSP']::text[],
    'somatic',
    ARRAY['brainspotting', 'trauma', 'somatic', 'eye position']::text[]
  ),
  (
    'sensorimotor-psychotherapy',
    'Sensorimotor Psychotherapy',
    ARRAY['SP']::text[],
    'somatic',
    ARRAY['sensorimotor', 'somatic', 'trauma', 'body']::text[]
  ),
  (
    'aedp-therapy',
    'AEDP',
    ARRAY['Accelerated Experiential Dynamic Psychotherapy']::text[],
    'integrative',
    ARRAY['AEDP', 'attachment', 'emotion', 'transformation']::text[]
  ),
  (
    'eft-therapy',
    'EFT',
    ARRAY['Emotionally Focused Therapy', 'EFT couples']::text[],
    'integrative',
    ARRAY['EFT', 'couples', 'attachment', 'emotion']::text[]
  ),
  (
    'imago-therapy',
    'Imago Therapy',
    ARRAY[]::text[],
    'integrative',
    ARRAY['Imago', 'couples', 'relationship', 'dialogue']::text[]
  ),
  (
    'narrative-therapy',
    'Narrative Therapy',
    ARRAY[]::text[],
    'integrative',
    ARRAY['narrative', 'identity', 'externalizing', 'story']::text[]
  ),
  (
    'psychedelic-assisted-therapy',
    'Psychedelic-Assisted Therapy',
    ARRAY['PAT', 'ketamine therapy', 'MDMA therapy', 'psilocybin therapy']::text[],
    'emerging',
    ARRAY['psychedelic', 'ketamine', 'MDMA', 'psilocybin', 'emerging', 'research']::text[]
  )
ON CONFLICT (slug) DO NOTHING;
