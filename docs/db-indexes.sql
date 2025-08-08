-- Database Indexes for Deeper 2 Performance Optimization
-- Run these on your Supabase database for optimal query performance

-- Primary index for slug lookups (detail pages)
CREATE INDEX IF NOT EXISTS idx_questions_master_slug 
ON questions_master (slug);

-- Index for category filtering and sorting
CREATE INDEX IF NOT EXISTS idx_questions_master_category_updated 
ON questions_master (category, updated_at DESC);

-- Index for pagination and sorting by updated_at
CREATE INDEX IF NOT EXISTS idx_questions_master_updated_at 
ON questions_master (updated_at DESC);

-- Index for category-only queries
CREATE INDEX IF NOT EXISTS idx_questions_master_category 
ON questions_master (category) 
WHERE category IS NOT NULL;

-- Index for raw_category if used
CREATE INDEX IF NOT EXISTS idx_questions_master_raw_category 
ON questions_master (raw_category) 
WHERE raw_category IS NOT NULL;

-- Composite index for category + pagination
CREATE INDEX IF NOT EXISTS idx_questions_master_category_pagination 
ON questions_master (category, updated_at DESC, id);

-- Verify indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'questions_master'
ORDER BY indexname;


