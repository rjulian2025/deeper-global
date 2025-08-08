-- One-time database cleanup to remove external links from questions_master
-- Run this in Supabase SQL editor

-- 0) BACKUP
CREATE TABLE IF NOT EXISTS questions_master_backup_2025_08_08 AS
SELECT * FROM questions_master;

-- 1) Strip Markdown links [text](http...)
UPDATE questions_master
SET answer = regexp_replace(
  answer,
  '\[([^\]]+)\]\((https?:\/\/[^)]+)\)',
  '\1',
  'g'
)
WHERE answer ~ '\[([^\]]+)\]\((https?:\/\/[^)]+)\)';

-- 2) Strip HTML anchors
UPDATE questions_master
SET answer = regexp_replace(
  answer,
  '<a[^>]*>(.*?)<\/a>',
  '\1',
  'gi'
)
WHERE answer ~ '<a[^>]*>.*?<\/a>';

-- 3) Remove bare URLs
UPDATE questions_master
SET answer = regexp_replace(
  answer,
  '(https?:\/\/[^\s)]+)',
  '',
  'g'
)
WHERE answer ~ '(https?:\/\/[^\s)]+)';

-- 4) Also clean short_answer field
UPDATE questions_master
SET short_answer = regexp_replace(
  short_answer,
  '\[([^\]]+)\]\((https?:\/\/[^)]+)\)',
  '\1',
  'g'
)
WHERE short_answer ~ '\[([^\]]+)\]\((https?:\/\/[^)]+)\)';

UPDATE questions_master
SET short_answer = regexp_replace(
  short_answer,
  '<a[^>]*>(.*?)<\/a>',
  '\1',
  'gi'
)
WHERE short_answer ~ '<a[^>]*>.*?<\/a>';

UPDATE questions_master
SET short_answer = regexp_replace(
  short_answer,
  '(https?:\/\/[^\s)]+)',
  '',
  'g'
)
WHERE short_answer ~ '(https?:\/\/[^\s)]+)';

-- 5) Also clean question field
UPDATE questions_master
SET question = regexp_replace(
  question,
  '\[([^\]]+)\]\((https?:\/\/[^)]+)\)',
  '\1',
  'g'
)
WHERE question ~ '\[([^\]]+)\]\((https?:\/\/[^)]+)\)';

UPDATE questions_master
SET question = regexp_replace(
  question,
  '<a[^>]*>(.*?)<\/a>',
  '\1',
  'gi'
)
WHERE question ~ '<a[^>]*>.*?<\/a>';

UPDATE questions_master
SET question = regexp_replace(
  question,
  '(https?:\/\/[^\s)]+)',
  '',
  'g'
)
WHERE question ~ '(https?:\/\/[^\s)]+)';

-- 6) Verify none remain
SELECT COUNT(*) AS remaining_with_urls
FROM questions_master
WHERE answer ~ '(https?://|www\.)' 
   OR short_answer ~ '(https?://|www\.)'
   OR question ~ '(https?://|www\.)';

-- 7) Show sample of cleaned content
SELECT 
  id,
  slug,
  LEFT(question, 100) as question_preview,
  LEFT(short_answer, 100) as short_answer_preview,
  LEFT(answer, 100) as answer_preview
FROM questions_master 
LIMIT 5;
