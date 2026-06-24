export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SocialPostFormat = 'question_only' | 'question_insight' | 'reflection';
export type SocialPostStatus = 'draft' | 'approved' | 'published' | 'failed';

export type Database = {
  public: {
    Tables: {
      modalities: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          slug: string;
          name: string;
          also_known_as: string[] | null;
          category: string;
          status: string;
          canonical_definition: string | null;
          lede: string | null;
          what_it_is: string | null;
          what_a_session_looks_like: string | null;
          what_it_treats: string | null;
          what_the_evidence_says: string | null;
          who_it_is_for: string | null;
          how_to_find_a_practitioner: string | null;
          key_takeaways: string[] | null;
          primary_term: string | null;
          canonical_answer: string | null;
          schema_description: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_status: string | null;
          source_refs: Json[] | null;
          staging_lede: string | null;
          staging_what_it_is: string | null;
          staging_what_a_session_looks_like: string | null;
          staging_what_it_treats: string | null;
          staging_what_the_evidence_says: string | null;
          staging_who_it_is_for: string | null;
          staging_how_to_find_a_practitioner: string | null;
          staging_key_takeaways: string[] | null;
          staging_canonical_answer: string | null;
          staging_rewrite_at: string | null;
          staging_rewrite_error: string | null;
          staging_rewrite_model: string | null;
          staging_rewrite_prompt_version: string | null;
          ymyl_flagged: boolean;
          related_question_slugs: string[] | null;
          related_modality_slugs: string[] | null;
          practitioner_specialty_tags: string[] | null;
          seo_title: string | null;
          meta_description: string | null;
          noindex: boolean;
        };
        Insert: Record<string, never>;
        Update: Partial<Database['public']['Tables']['modalities']['Row']>;
        Relationships: [];
      };
      questions_master: {
        Row: {
          id: string;
          question: string;
          improved_title: string | null;
          improved_meta_description: string | null;
          improved_summary: string | null;
          staging_lede: string | null;
          staging_key_takeaways: string[] | null;
          staging_canonical_answer: string | null;
          staging_primary_term: string | null;
          staging_what_you_might_be_experiencing: string | null;
          staging_what_can_help: string | null;
          staging_when_to_reach_out: string | null;
          staging_rewrite_at: string | null;
          staging_rewrite_prompt_version: string | null;
          short_answer: string;
          answer: string;
          answer_sections: Json[] | null;
          key_takeaways: string[] | null;
          care_note: string | null;
          related_questions: Json[] | null;
          suggested_schema_question: string | null;
          suggested_schema_answer: string | null;
          primary_theme: string | null;
          related_themes: Json[] | null;
          citation_notes: string | null;
          content_prompt_version: string | null;
          content_enriched_at: string | null;
          review_status: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          source_refs: Json[] | null;
          primary_entities: Json[] | null;
          related_entities: Json[] | null;
          triage: string | null;
          category: string | null;
          raw_category: string | null;
          slug: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Record<string, never>;
        Update: Partial<Database['public']['Tables']['questions_master']['Row']>;
        Relationships: [];
      };
      question_metrics_daily: {
        Row: {
          id: string;
          question_id: string;
          slug: string;
          date: string;
          impressions: number;
          clicks: number;
          source: string;
          synced_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          slug: string;
          date: string;
          impressions?: number;
          clicks?: number;
          source?: string;
          synced_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          slug?: string;
          date?: string;
          impressions?: number;
          clicks?: number;
          source?: string;
          synced_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'question_metrics_daily_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions_master';
            referencedColumns: ['id'];
          },
        ];
      };
      social_metrics: {
        Row: {
          post_id: string;
          impressions: number;
          likes: number;
          reposts: number;
          replies: number;
          profile_visits: number;
          link_clicks: number;
          pulled_at: string;
        };
        Insert: {
          post_id: string;
          impressions?: number;
          likes?: number;
          reposts?: number;
          replies?: number;
          profile_visits?: number;
          link_clicks?: number;
          pulled_at?: string;
        };
        Update: {
          post_id?: string;
          impressions?: number;
          likes?: number;
          reposts?: number;
          replies?: number;
          profile_visits?: number;
          link_clicks?: number;
          pulled_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'social_metrics_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'social_posts';
            referencedColumns: ['id'];
          },
        ];
      };
      social_posts: {
        Row: {
          id: string;
          question_id: string;
          format: SocialPostFormat;
          body: string;
          status: SocialPostStatus;
          x_post_id: string | null;
          scheduled_for: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          format: SocialPostFormat;
          body: string;
          status?: SocialPostStatus;
          x_post_id?: string | null;
          scheduled_for?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          format?: SocialPostFormat;
          body?: string;
          status?: SocialPostStatus;
          x_post_id?: string | null;
          scheduled_for?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'social_posts_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions_master';
            referencedColumns: ['id'];
          },
        ];
      };
      social_scores: {
        Row: {
          question_id: string;
          social_interest_score: number;
          computed_at: string;
        };
        Insert: {
          question_id: string;
          social_interest_score: number;
          computed_at?: string;
        };
        Update: {
          question_id?: string;
          social_interest_score?: number;
          computed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'social_scores_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions_master';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      featured_questions: {
        Row: {
          question_id: string;
          question: string;
          slug: string;
          category: string | null;
          impressions: number;
          clicks: number;
          publish_date: string;
          reviewer: string | null;
          status: string | null;
          ymyl_cleared: boolean;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never;
