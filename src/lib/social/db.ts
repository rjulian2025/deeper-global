import { createClient } from '@supabase/supabase-js';
import type {
  Database,
  SocialPostFormat,
  Tables,
  TablesInsert,
} from '@/lib/database.types';
import { getCategoriesBySafetyTier } from './category-safety';

export type FeaturedQuestion = Tables<'featured_questions'>;
export type SocialPost = Tables<'social_posts'>;
export type SocialMetricsInsert = Omit<TablesInsert<'social_metrics'>, 'post_id'>;
export type SocialQuestionContent = Pick<
  Tables<'questions_master'>,
  'id' | 'question' | 'slug' | 'category' | 'short_answer' | 'key_takeaways'
>;
export type FeaturedQuestionStrategy =
  | 'top_impressions'
  | 'fastest_growing'
  | 'newest'
  | 'editors_choice'
  | 'random_deep_cut';

const importMetaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const runtimeEnv = importMetaEnv ?? process.env;

const supabaseUrl =
  runtimeEnv.SUPABASE_URL ??
  runtimeEnv.PUBLIC_SUPABASE_URL ??
  runtimeEnv.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey = runtimeEnv.SUPABASE_SERVICE_ROLE_KEY;

const socialSupabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;

function requireSocialSupabase() {
  if (!socialSupabase) {
    throw new Error('Missing SUPABASE_URL/PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for social posting data access.');
  }

  return socialSupabase;
}

function toIsoTimestamp(value: string | Date | null) {
  if (value === null) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function toPostgrestInList(values: string[]) {
  return `(${values.map((value) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')})`;
}

export async function getFeaturedQuestions(strategy: FeaturedQuestionStrategy, limit: number): Promise<FeaturedQuestion[]> {
  const client = requireSocialSupabase();
  const normalizedLimit = Math.max(1, Math.min(limit, 100));
  let query = client.from('featured_questions').select('*').limit(normalizedLimit);
  const excludedCategories = getCategoriesBySafetyTier('excluded');

  if (excludedCategories.length > 0) {
    query = query.not('category', 'in', toPostgrestInList(excludedCategories));
  }

  switch (strategy) {
    case 'top_impressions':
      query = query.order('impressions', { ascending: false, nullsFirst: false });
      break;
    case 'fastest_growing':
      // TODO: Add the growth source/table or RPC, then order by the agreed velocity metric.
      break;
    case 'newest':
      // TODO: Confirm whether newest should use questions_master.created_at or another editorial publish timestamp.
      query = query.order('publish_date', { ascending: false, nullsFirst: false });
      break;
    case 'editors_choice':
      // TODO: Add an editorial flag/source before filtering; reviewer alone is not enough to infer choice.
      break;
    case 'random_deep_cut':
      // TODO: Define "deep cut" thresholds and randomness source; avoid guessing from low impressions alone.
      break;
  }

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}

export async function createDraftPost(
  questionId: string,
  format: SocialPostFormat,
  body: string,
  scheduledFor: string | Date | null
): Promise<SocialPost> {
  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .insert({
      question_id: questionId,
      format,
      body,
      status: 'draft',
      scheduled_for: toIsoTimestamp(scheduledFor),
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getQuestionForSocialPost(questionId: string): Promise<SocialQuestionContent | null> {
  const { data, error } = await requireSocialSupabase()
    .from('questions_master')
    .select('id, question, slug, category, short_answer, key_takeaways')
    .eq('id', questionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getDraftsForReview(date: string): Promise<SocialPost[]> {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .select('*')
    .eq('status', 'draft')
    .gte('scheduled_for', start.toISOString())
    .lt('scheduled_for', end.toISOString())
    .order('scheduled_for', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function approvePost(postId: string): Promise<SocialPost> {
  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .update({ status: 'approved' })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getApprovedPostsToPublish(limit: number, now = new Date()): Promise<SocialPost[]> {
  const normalizedLimit = Math.max(1, Math.min(limit, 25));
  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .select('*')
    .eq('status', 'approved')
    .is('x_post_id', null)
    .or(`scheduled_for.is.null,scheduled_for.lte.${now.toISOString()}`)
    .order('scheduled_for', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true })
    .limit(normalizedLimit);

  if (error) throw error;
  return data ?? [];
}

export async function markPublished(postId: string, xPostId: string): Promise<SocialPost> {
  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .update({
      status: 'published',
      x_post_id: xPostId,
      published_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function markFailed(postId: string): Promise<SocialPost> {
  const { data, error } = await requireSocialSupabase()
    .from('social_posts')
    .update({ status: 'failed' })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function recordMetrics(postId: string, metrics: SocialMetricsInsert) {
  const { data, error } = await requireSocialSupabase()
    .from('social_metrics')
    .insert({
      post_id: postId,
      ...metrics,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
