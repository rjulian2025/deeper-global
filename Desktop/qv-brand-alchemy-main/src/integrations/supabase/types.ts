export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_last4: string
          account_type: string
          created_at: string | null
          currency: string | null
          id: string
          institution: string
          user_id: string
        }
        Insert: {
          account_last4: string
          account_type: string
          created_at?: string | null
          currency?: string | null
          id?: string
          institution: string
          user_id: string
        }
        Update: {
          account_last4?: string
          account_type?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          institution?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_operations: {
        Row: {
          cost_cents: number | null
          created_at: string | null
          id: string
          input_data: Json | null
          model_used: string | null
          operation_type: string
          output_data: Json | null
          practice_id: string | null
          processing_time_ms: number | null
          tokens_consumed: number | null
          user_id: string | null
        }
        Insert: {
          cost_cents?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json | null
          model_used?: string | null
          operation_type: string
          output_data?: Json | null
          practice_id?: string | null
          processing_time_ms?: number | null
          tokens_consumed?: number | null
          user_id?: string | null
        }
        Update: {
          cost_cents?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json | null
          model_used?: string | null
          operation_type?: string
          output_data?: Json | null
          practice_id?: string | null
          processing_time_ms?: number | null
          tokens_consumed?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_operations_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_operations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reports: {
        Row: {
          bias_watch: string | null
          created_at: string
          id: string
          situation_scan: Json
          strategic_outlook: Json
          tactical_actions: Json
          user_id: string
        }
        Insert: {
          bias_watch?: string | null
          created_at?: string
          id?: string
          situation_scan?: Json
          strategic_outlook?: Json
          tactical_actions?: Json
          user_id: string
        }
        Update: {
          bias_watch?: string | null
          created_at?: string
          id?: string
          situation_scan?: Json
          strategic_outlook?: Json
          tactical_actions?: Json
          user_id?: string
        }
        Relationships: []
      }
      api_usage_tracking: {
        Row: {
          api_provider: string
          created_at: string
          date: string
          endpoint: string
          id: string
          last_request_at: string
          requests_count: number
          updated_at: string
          user_id: string
          window_start: string
        }
        Insert: {
          api_provider: string
          created_at?: string
          date?: string
          endpoint: string
          id?: string
          last_request_at?: string
          requests_count?: number
          updated_at?: string
          user_id: string
          window_start?: string
        }
        Update: {
          api_provider?: string
          created_at?: string
          date?: string
          endpoint?: string
          id?: string
          last_request_at?: string
          requests_count?: number
          updated_at?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          practice_id: string | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          practice_id?: string | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          practice_id?: string | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          author_title: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          published_date: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          author_title?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_date?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          author_title?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_date?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          blog_id: string
          body: string | null
          created_at: string | null
          featured_image_url: string | null
          is_published: boolean | null
          profile_id: string | null
          publish_date: string | null
          slug: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          blog_id?: string
          body?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          is_published?: boolean | null
          profile_id?: string | null
          publish_date?: string | null
          slug?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          blog_id?: string
          body?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          is_published?: boolean | null
          profile_id?: string | null
          publish_date?: string | null
          slug?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      change_requests: {
        Row: {
          applied_at: string | null
          attempts: number | null
          created_at: string | null
          feedback: string | null
          final_output: string | null
          gpt_response: string | null
          new_value: string | null
          old_value: string | null
          profile_id: string | null
          raw_request: string | null
          request_id: string
          request_type: string | null
          status: string | null
          target_field: string | null
          target_table: string | null
          updated_at: string | null
          validator_result: string | null
        }
        Insert: {
          applied_at?: string | null
          attempts?: number | null
          created_at?: string | null
          feedback?: string | null
          final_output?: string | null
          gpt_response?: string | null
          new_value?: string | null
          old_value?: string | null
          profile_id?: string | null
          raw_request?: string | null
          request_id?: string
          request_type?: string | null
          status?: string | null
          target_field?: string | null
          target_table?: string | null
          updated_at?: string | null
          validator_result?: string | null
        }
        Update: {
          applied_at?: string | null
          attempts?: number | null
          created_at?: string | null
          feedback?: string | null
          final_output?: string | null
          gpt_response?: string | null
          new_value?: string | null
          old_value?: string | null
          profile_id?: string | null
          raw_request?: string | null
          request_id?: string
          request_type?: string | null
          status?: string | null
          target_field?: string | null
          target_table?: string | null
          updated_at?: string | null
          validator_result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      client_api_keys: {
        Row: {
          api_key: string
          client_email: string
          client_name: string
          created_at: string | null
          id: string
          last_used_at: string | null
          notes: string | null
          status: string | null
          usage_count: number | null
          usage_limit: number | null
          user_id: string | null
        }
        Insert: {
          api_key: string
          client_email: string
          client_name: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          notes?: string | null
          status?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id?: string | null
        }
        Update: {
          api_key?: string
          client_email?: string
          client_name?: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          notes?: string | null
          status?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          email: string
          id: string
          message: string | null
          meta: Json
          name: string
          phone: string | null
          site_id: string
          status: string
          submitted_at: string
          topic: string | null
          user_agent: string | null
          user_ip: unknown
        }
        Insert: {
          email: string
          id?: string
          message?: string | null
          meta?: Json
          name: string
          phone?: string | null
          site_id: string
          status?: string
          submitted_at?: string
          topic?: string | null
          user_agent?: string | null
          user_ip?: unknown
        }
        Update: {
          email?: string
          id?: string
          message?: string | null
          meta?: Json
          name?: string
          phone?: string | null
          site_id?: string
          status?: string
          submitted_at?: string
          topic?: string | null
          user_agent?: string | null
          user_ip?: unknown
        }
        Relationships: []
      }
      contact_rate_limits: {
        Row: {
          ip_address: unknown
          last_submission: string | null
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          ip_address: unknown
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          ip_address?: unknown
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          business_email_sent: boolean | null
          company: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          project: string
          status: string | null
          updated_at: string
          user_email_sent: boolean | null
        }
        Insert: {
          business_email_sent?: boolean | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          project: string
          status?: string | null
          updated_at?: string
          user_email_sent?: boolean | null
        }
        Update: {
          business_email_sent?: boolean | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          project?: string
          status?: string | null
          updated_at?: string
          user_email_sent?: boolean | null
        }
        Relationships: []
      }
      "Curtis Master Specs": {
        Row: {
          created_at: string
          id: string
          json: Json | null
          schema: string | null
          version: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          json?: Json | null
          schema?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          json?: Json | null
          schema?: string | null
          version?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          practice_id: string | null
          properties: Json | null
          revenue_impact_cents: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          practice_id?: string | null
          properties?: Json | null
          revenue_impact_cents?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          practice_id?: string | null
          properties?: Json | null
          revenue_impact_cents?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      export_jobs: {
        Row: {
          created_at: string | null
          download_count: number | null
          download_url: string | null
          expires_at: string | null
          export_format: string
          file_path: string | null
          id: string
          job_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          download_url?: string | null
          expires_at?: string | null
          export_format: string
          file_path?: string | null
          id?: string
          job_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          download_url?: string | null
          expires_at?: string | null
          export_format?: string
          file_path?: string | null
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scraping_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          flag_name: string
          id: string
          practice_id: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          flag_name: string
          id?: string
          practice_id?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          flag_name?: string
          id?: string
          practice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      financials: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      form_manifest: {
        Row: {
          download_url: string | null
          exported_on: string | null
          filename: string | null
          form_number: number | null
          id: number
          preview_url: string | null
          slug: string | null
          tier: string | null
          title: string | null
          tokens_validated: boolean | null
          tracking_pixel_present: boolean | null
        }
        Insert: {
          download_url?: string | null
          exported_on?: string | null
          filename?: string | null
          form_number?: number | null
          id?: number
          preview_url?: string | null
          slug?: string | null
          tier?: string | null
          title?: string | null
          tokens_validated?: boolean | null
          tracking_pixel_present?: boolean | null
        }
        Update: {
          download_url?: string | null
          exported_on?: string | null
          filename?: string | null
          form_number?: number | null
          id?: number
          preview_url?: string | null
          slug?: string | null
          tier?: string | null
          title?: string | null
          tokens_validated?: boolean | null
          tracking_pixel_present?: boolean | null
        }
        Relationships: []
      }
      forms: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          html: string
          html_download_url: string | null
          id: string
          pdf_url: string | null
          preview_image_url: string | null
          preview_url: string | null
          price: number | null
          slug: string | null
          tier: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          html: string
          html_download_url?: string | null
          id?: string
          pdf_url?: string | null
          preview_image_url?: string | null
          preview_url?: string | null
          price?: number | null
          slug?: string | null
          tier: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          html?: string
          html_download_url?: string | null
          id?: string
          pdf_url?: string | null
          preview_image_url?: string | null
          preview_url?: string | null
          price?: number | null
          slug?: string | null
          tier?: string
          title?: string
        }
        Relationships: []
      }
      google_integrations: {
        Row: {
          access_token_encrypted: string | null
          created_at: string | null
          google_resource_id: string | null
          id: string
          integration_type: string
          last_sync_at: string | null
          practice_id: string | null
          refresh_token_encrypted: string | null
          scopes: string[] | null
          sync_status: string | null
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string | null
          google_resource_id?: string | null
          id?: string
          integration_type: string
          last_sync_at?: string | null
          practice_id?: string | null
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          sync_status?: string | null
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string | null
          google_resource_id?: string | null
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          practice_id?: string | null
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_integrations_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      ingest_jobs: {
        Row: {
          created_at: string | null
          error: string | null
          finished_at: string | null
          id: string
          retries: number | null
          started_at: string | null
          statement_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          retries?: number | null
          started_at?: string | null
          statement_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          retries?: number | null
          started_at?: string | null
          statement_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingest_jobs_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "statements"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_drafts: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      internal_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          message: string | null
          practice_id: string | null
          resolved: boolean | null
          severity: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          message?: string | null
          practice_id?: string | null
          resolved?: boolean | null
          severity?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          message?: string | null
          practice_id?: string | null
          resolved?: boolean | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_alerts_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_generation_batches: {
        Row: {
          batch_number: number
          completed_at: string | null
          county: string
          created_at: string
          error_message: string | null
          id: string
          job_id: string
          leads_processed: number
          next_retry_at: string | null
          query: string
          rate_limited_until: string | null
          results_per_search: number
          retry_count: number | null
          status: string
          updated_at: string
        }
        Insert: {
          batch_number: number
          completed_at?: string | null
          county: string
          created_at?: string
          error_message?: string | null
          id?: string
          job_id: string
          leads_processed?: number
          next_retry_at?: string | null
          query: string
          rate_limited_until?: string | null
          results_per_search?: number
          retry_count?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          batch_number?: number
          completed_at?: string | null
          county?: string
          created_at?: string
          error_message?: string | null
          id?: string
          job_id?: string
          leads_processed?: number
          next_retry_at?: string | null
          query?: string
          rate_limited_until?: string | null
          results_per_search?: number
          retry_count?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_generation_batches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "lead_generation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_generation_jobs: {
        Row: {
          batch_delay_seconds: number | null
          completed_at: string | null
          completed_batches: number
          created_at: string
          current_daily_requests: number | null
          error_message: string | null
          failed_batches: number
          id: string
          last_batch_started_at: string | null
          max_daily_requests: number | null
          search_params: Json
          status: string
          total_batches: number
          total_leads: number
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_delay_seconds?: number | null
          completed_at?: string | null
          completed_batches?: number
          created_at?: string
          current_daily_requests?: number | null
          error_message?: string | null
          failed_batches?: number
          id?: string
          last_batch_started_at?: string | null
          max_daily_requests?: number | null
          search_params?: Json
          status?: string
          total_batches?: number
          total_leads?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_delay_seconds?: number | null
          completed_at?: string | null
          completed_batches?: number
          created_at?: string
          current_daily_requests?: number | null
          error_message?: string | null
          failed_batches?: number
          id?: string
          last_batch_started_at?: string | null
          max_daily_requests?: number | null
          search_params?: Json
          status?: string
          total_batches?: number
          total_leads?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_results: {
        Row: {
          address: string | null
          business_name: string
          county: string | null
          created_at: string
          decision_maker: string | null
          email: string | null
          email_status: string | null
          id: string
          phone: string | null
          raw_data: Json | null
          search_query: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          county?: string | null
          created_at?: string
          decision_maker?: string | null
          email?: string | null
          email_status?: string | null
          id?: string
          phone?: string | null
          raw_data?: Json | null
          search_query?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          county?: string | null
          created_at?: string
          decision_maker?: string | null
          email?: string | null
          email_status?: string | null
          id?: string
          phone?: string | null
          raw_data?: Json | null
          search_query?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      llm_usage_log: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          ip_address: unknown
          notes: string | null
          timestamp: string | null
          usage_type: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          ip_address?: unknown
          notes?: string | null
          timestamp?: string | null
          usage_type?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          ip_address?: unknown
          notes?: string | null
          timestamp?: string | null
          usage_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          deleted_at: string | null
          id: string
          joined_at: string | null
          permissions: Json | null
          practice_id: string | null
          role: string
          seat_type: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          practice_id?: string | null
          role: string
          seat_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          practice_id?: string | null
          role?: string
          seat_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          content: Json | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_summaries: {
        Row: {
          account_type: string
          expenses: number
          income: number
          month: number
          net_cashflow: number
          user_id: string
          year: number
        }
        Insert: {
          account_type: string
          expenses?: number
          income?: number
          month: number
          net_cashflow?: number
          user_id: string
          year: number
        }
        Update: {
          account_type?: string
          expenses?: number
          income?: number
          month?: number
          net_cashflow?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      narrative_context: {
        Row: {
          created_at: string
          data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      narratives: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      persona_responses: {
        Row: {
          answers: Json
          created_at: string | null
          email: string
          generated_persona: Json
          id: string
          image_category: string | null
          persona_title: string | null
          therapist_name: string | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          created_at?: string | null
          email: string
          generated_persona: Json
          id?: string
          image_category?: string | null
          persona_title?: string | null
          therapist_name?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          email?: string
          generated_persona?: Json
          id?: string
          image_category?: string | null
          persona_title?: string | null
          therapist_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      persona_submission_rate_limits: {
        Row: {
          ip_address: unknown
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          ip_address: unknown
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          ip_address?: unknown
          submission_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      practices: {
        Row: {
          deleted_at: string | null
          domain: string | null
          founded_at: string | null
          google_workspace_org_id: string | null
          id: string
          mrr_cents: number | null
          name: string
          slug: string | null
          status: string | null
          stripe_customer_id: string | null
          tier: string | null
        }
        Insert: {
          deleted_at?: string | null
          domain?: string | null
          founded_at?: string | null
          google_workspace_org_id?: string | null
          id?: string
          mrr_cents?: number | null
          name: string
          slug?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
        }
        Update: {
          deleted_at?: string | null
          domain?: string | null
          founded_at?: string | null
          google_workspace_org_id?: string | null
          id?: string
          mrr_cents?: number | null
          name?: string
          slug?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accreditations: string | null
          brand_words: string[] | null
          color_preferences: string | null
          confirmed_hipaa_tools: boolean | null
          confirmed_permissions: boolean | null
          created_at: string | null
          delivery_method: string | null
          dream_client: string | null
          email: string | null
          email_platform: string | null
          full_name: string
          gmb_place_id: string | null
          has_headshot: boolean | null
          has_logo: boolean | null
          has_website: boolean | null
          headshot_alt_choice: string | null
          headshot_file_url: string | null
          logo_alt_choice: string | null
          logo_file_url: string | null
          marketing_headache: string | null
          mobile: string | null
          modalities: string[] | null
          modalities_other: string | null
          moodboard_url: string | null
          office_location: string | null
          populations_served: string[] | null
          populations_served_other: string | null
          practice_name: string | null
          profile_id: string
          scheduler_platform: string | null
          site_goal: string | null
          specialties: string[] | null
          specialties_other: string | null
          success_criteria: string | null
          updated_at: string | null
          uses_email: boolean | null
          uses_google_workspace: boolean | null
          uses_scheduler: boolean | null
          uses_video: boolean | null
          vertical: string | null
          video_platform: string | null
          website_url: string | null
          workspace_domain: string | null
          workspace_id: string | null
          years_in_practice: string | null
        }
        Insert: {
          accreditations?: string | null
          brand_words?: string[] | null
          color_preferences?: string | null
          confirmed_hipaa_tools?: boolean | null
          confirmed_permissions?: boolean | null
          created_at?: string | null
          delivery_method?: string | null
          dream_client?: string | null
          email?: string | null
          email_platform?: string | null
          full_name: string
          gmb_place_id?: string | null
          has_headshot?: boolean | null
          has_logo?: boolean | null
          has_website?: boolean | null
          headshot_alt_choice?: string | null
          headshot_file_url?: string | null
          logo_alt_choice?: string | null
          logo_file_url?: string | null
          marketing_headache?: string | null
          mobile?: string | null
          modalities?: string[] | null
          modalities_other?: string | null
          moodboard_url?: string | null
          office_location?: string | null
          populations_served?: string[] | null
          populations_served_other?: string | null
          practice_name?: string | null
          profile_id?: string
          scheduler_platform?: string | null
          site_goal?: string | null
          specialties?: string[] | null
          specialties_other?: string | null
          success_criteria?: string | null
          updated_at?: string | null
          uses_email?: boolean | null
          uses_google_workspace?: boolean | null
          uses_scheduler?: boolean | null
          uses_video?: boolean | null
          vertical?: string | null
          video_platform?: string | null
          website_url?: string | null
          workspace_domain?: string | null
          workspace_id?: string | null
          years_in_practice?: string | null
        }
        Update: {
          accreditations?: string | null
          brand_words?: string[] | null
          color_preferences?: string | null
          confirmed_hipaa_tools?: boolean | null
          confirmed_permissions?: boolean | null
          created_at?: string | null
          delivery_method?: string | null
          dream_client?: string | null
          email?: string | null
          email_platform?: string | null
          full_name?: string
          gmb_place_id?: string | null
          has_headshot?: boolean | null
          has_logo?: boolean | null
          has_website?: boolean | null
          headshot_alt_choice?: string | null
          headshot_file_url?: string | null
          logo_alt_choice?: string | null
          logo_file_url?: string | null
          marketing_headache?: string | null
          mobile?: string | null
          modalities?: string[] | null
          modalities_other?: string | null
          moodboard_url?: string | null
          office_location?: string | null
          populations_served?: string[] | null
          populations_served_other?: string | null
          practice_name?: string | null
          profile_id?: string
          scheduler_platform?: string | null
          site_goal?: string | null
          specialties?: string[] | null
          specialties_other?: string | null
          success_criteria?: string | null
          updated_at?: string | null
          uses_email?: boolean | null
          uses_google_workspace?: boolean | null
          uses_scheduler?: boolean | null
          uses_video?: boolean | null
          vertical?: string | null
          video_platform?: string | null
          website_url?: string | null
          workspace_domain?: string | null
          workspace_id?: string | null
          years_in_practice?: string | null
        }
        Relationships: []
      }
      questions_master: {
        Row: {
          answer: string
          answer_html: string | null
          bullets: string | null
          category: string | null
          created_at: string | null
          id: string
          published: boolean | null
          question: string
          raw_category: string
          short_answer: string | null
          slug: string
          tier: string
          updated_at: string | null
          word_count: number
        }
        Insert: {
          answer: string
          answer_html?: string | null
          bullets?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          published?: boolean | null
          question: string
          raw_category: string
          short_answer?: string | null
          slug: string
          tier?: string
          updated_at?: string | null
          word_count: number
        }
        Update: {
          answer?: string
          answer_html?: string | null
          bullets?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          published?: boolean | null
          question?: string
          raw_category?: string
          short_answer?: string | null
          slug?: string
          tier?: string
          updated_at?: string | null
          word_count?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          practice_id: string | null
          requests_count: number | null
          window_start: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          practice_id?: string | null
          requests_count?: number | null
          window_start?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          practice_id?: string | null
          requests_count?: number | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_limits_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      scraped_content: {
        Row: {
          content_analysis: Json | null
          content_html: string | null
          content_markdown: string | null
          content_text: string | null
          content_type: string | null
          id: string
          images: Json | null
          job_id: string | null
          links: Json | null
          meta_description: string | null
          scraped_at: string | null
          seo_data: Json | null
          status: string | null
          title: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          content_analysis?: Json | null
          content_html?: string | null
          content_markdown?: string | null
          content_text?: string | null
          content_type?: string | null
          id?: string
          images?: Json | null
          job_id?: string | null
          links?: Json | null
          meta_description?: string | null
          scraped_at?: string | null
          seo_data?: Json | null
          status?: string | null
          title?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          content_analysis?: Json | null
          content_html?: string | null
          content_markdown?: string | null
          content_text?: string | null
          content_type?: string | null
          id?: string
          images?: Json | null
          job_id?: string | null
          links?: Json | null
          meta_description?: string | null
          scraped_at?: string | null
          seo_data?: Json | null
          status?: string | null
          title?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scraped_content_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scraping_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_jobs: {
        Row: {
          client_api_key_id: string | null
          completed_at: string | null
          completed_urls: number | null
          created_at: string | null
          error_message: string | null
          failed_urls: number | null
          id: string
          job_name: string
          progress: number | null
          scraping_config: Json | null
          started_at: string | null
          status: string | null
          target_urls: string[]
          total_urls: number
        }
        Insert: {
          client_api_key_id?: string | null
          completed_at?: string | null
          completed_urls?: number | null
          created_at?: string | null
          error_message?: string | null
          failed_urls?: number | null
          id?: string
          job_name: string
          progress?: number | null
          scraping_config?: Json | null
          started_at?: string | null
          status?: string | null
          target_urls: string[]
          total_urls: number
        }
        Update: {
          client_api_key_id?: string | null
          completed_at?: string | null
          completed_urls?: number | null
          created_at?: string | null
          error_message?: string | null
          failed_urls?: number | null
          id?: string
          job_name?: string
          progress?: number | null
          scraping_config?: Json | null
          started_at?: string | null
          status?: string | null
          target_urls?: string[]
          total_urls?: number
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_client_api_key_id_fkey"
            columns: ["client_api_key_id"]
            isOneToOne: false
            referencedRelation: "client_api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          created_at: string
          has_results: boolean
          id: string
          ip_address: unknown
          query: string
          results_count: number
          search_type: string
          timestamp: string
          user_agent: string | null
          user_session: string | null
        }
        Insert: {
          created_at?: string
          has_results?: boolean
          id?: string
          ip_address?: unknown
          query: string
          results_count?: number
          search_type?: string
          timestamp?: string
          user_agent?: string | null
          user_session?: string | null
        }
        Update: {
          created_at?: string
          has_results?: boolean
          id?: string
          ip_address?: unknown
          query?: string
          results_count?: number
          search_type?: string
          timestamp?: string
          user_agent?: string | null
          user_session?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown
          resource: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          resource?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          resource?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_builds: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          site_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          site_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          site_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_builds_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          created_at: string | null
          module_name: string
          site_id: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          module_name: string
          site_id: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          module_name?: string
          site_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_content_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_domains: {
        Row: {
          created_at: string | null
          host: string
          site_id: string
        }
        Insert: {
          created_at?: string | null
          host: string
          site_id: string
        }
        Update: {
          created_at?: string | null
          host?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_domains_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          contact_address: string
          contact_email: string
          contact_emails: string[] | null
          contact_phone: string
          created_at: string | null
          id: string
          is_multi_therapist_practice: boolean
          practice_name: string
          updated_at: string | null
        }
        Insert: {
          contact_address: string
          contact_email: string
          contact_emails?: string[] | null
          contact_phone: string
          created_at?: string | null
          id?: string
          is_multi_therapist_practice?: boolean
          practice_name: string
          updated_at?: string | null
        }
        Update: {
          contact_address?: string
          contact_email?: string
          contact_emails?: string[] | null
          contact_phone?: string
          created_at?: string | null
          id?: string
          is_multi_therapist_practice?: boolean
          practice_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      statements: {
        Row: {
          account_id: string
          created_at: string | null
          error: string | null
          file_path: string
          id: string
          period_end: string
          period_start: string
          source: string
          status: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          error?: string | null
          file_path: string
          id?: string
          period_end: string
          period_start: string
          source: string
          status?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          error?: string | null
          file_path?: string
          id?: string
          period_end?: string
          period_start?: string
          source?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statements_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          mrr_cents: number
          plan_name: string
          practice_id: string | null
          seat_count: number | null
          status: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mrr_cents: number
          plan_name: string
          practice_id?: string | null
          seat_count?: number | null
          status?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mrr_cents?: number
          plan_name?: string
          practice_id?: string | null
          seat_count?: number | null
          status?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          issue_type: string
          linked_operation: string | null
          practice_id: string | null
          resolution_notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          issue_type: string
          linked_operation?: string | null
          practice_id?: string | null
          resolution_notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          issue_type?: string
          linked_operation?: string | null
          practice_id?: string | null
          resolution_notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_linked_operation_fkey"
            columns: ["linked_operation"]
            isOneToOne: false
            referencedRelation: "system_operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_operations: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          operation_name: string
          practice_id: string | null
          retries: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation_name: string
          practice_id?: string | null
          retries?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation_name?: string
          practice_id?: string | null
          retries?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_operations_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_operations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_health: {
        Row: {
          ai_status: string | null
          email_status: string | null
          google_sync_status: string | null
          last_check: string | null
          notes: string | null
          practice_id: string
        }
        Insert: {
          ai_status?: string | null
          email_status?: string | null
          google_sync_status?: string | null
          last_check?: string | null
          notes?: string | null
          practice_id: string
        }
        Update: {
          ai_status?: string | null
          email_status?: string | null
          google_sync_status?: string | null
          last_check?: string | null
          notes?: string | null
          practice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_health_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: true
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_badges: {
        Row: {
          awarded_at: string | null
          badge_code: string | null
          id: string
          therapist_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_code?: string | null
          id?: string
          therapist_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_code?: string | null
          id?: string
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_badges_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_progress: {
        Row: {
          blog_count: number | null
          clarity_score: number | null
          created_at: string | null
          email_deliverability: number | null
          level: number | null
          nurture_completion: boolean | null
          persona_submissions: number | null
          therapist_id: string
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          blog_count?: number | null
          clarity_score?: number | null
          created_at?: string | null
          email_deliverability?: number | null
          level?: number | null
          nurture_completion?: boolean | null
          persona_submissions?: number | null
          therapist_id: string
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          blog_count?: number | null
          clarity_score?: number | null
          created_at?: string | null
          email_deliverability?: number | null
          level?: number | null
          nurture_completion?: boolean | null
          persona_submissions?: number | null
          therapist_id?: string
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_progress_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          created_at: string | null
          gift_sentence: string | null
          id: string
          ideal_client: string
          image_url: string | null
          location: string | null
          name: string
          site_id: string | null
          specialty: string
          tone_voice: string | null
          updated_at: string | null
          visual_style: string | null
          whisper_message: string | null
        }
        Insert: {
          created_at?: string | null
          gift_sentence?: string | null
          id?: string
          ideal_client: string
          image_url?: string | null
          location?: string | null
          name: string
          site_id?: string | null
          specialty: string
          tone_voice?: string | null
          updated_at?: string | null
          visual_style?: string | null
          whisper_message?: string | null
        }
        Update: {
          created_at?: string | null
          gift_sentence?: string | null
          id?: string
          ideal_client?: string
          image_url?: string | null
          location?: string | null
          name?: string
          site_id?: string | null
          specialty?: string
          tone_voice?: string | null
          updated_at?: string | null
          visual_style?: string | null
          whisper_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapists_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          account_type: string
          amount: number
          category: string | null
          created_at: string | null
          description: string
          id: string
          posted_at: string
          statement_id: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_type: string
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          posted_at: string
          statement_id?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_type?: string
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          posted_at?: string
          statement_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "statements"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_analytics: {
        Row: {
          client_api_key_id: string | null
          created_at: string | null
          credits_used: number | null
          event_data: Json | null
          event_type: string
          id: string
        }
        Insert: {
          client_api_key_id?: string | null
          created_at?: string | null
          credits_used?: number | null
          event_data?: Json | null
          event_type: string
          id?: string
        }
        Update: {
          client_api_key_id?: string | null
          created_at?: string | null
          credits_used?: number | null
          event_data?: Json | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_client_api_key_id_fkey"
            columns: ["client_api_key_id"]
            isOneToOne: false
            referencedRelation: "client_api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_records: {
        Row: {
          feature: string
          id: string
          practice_id: string | null
          quantity: number | null
          recorded_at: string | null
        }
        Insert: {
          feature: string
          id?: string
          practice_id?: string | null
          quantity?: number | null
          recorded_at?: string | null
        }
        Update: {
          feature?: string
          id?: string
          practice_id?: string | null
          quantity?: number | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_records_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_personal_context: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          global_role: string | null
          id: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          global_role?: string | null
          id?: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          global_role?: string | null
          id?: string
        }
        Relationships: []
      }
      weekly_checkins: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          mood: number | null
          note: string | null
          stress: number | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          mood?: number | null
          note?: string | null
          stress?: number | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          mood?: number | null
          note?: string | null
          stress?: number | null
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          context: Json | null
          created_at: string | null
          event_type: string | null
          id: string
          therapist_id: string | null
          xp_value: number | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          event_type?: string | null
          id?: string
          therapist_id?: string | null
          xp_value?: number | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          event_type?: string | null
          id?: string
          therapist_id?: string | null
          xp_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_contact_rate_limit: { Args: { ip_addr: unknown }; Returns: boolean }
      cleanup_old_search_analytics: { Args: never; Returns: undefined }
      get_therapist_site_id: { Args: { therapist_id: string }; Returns: string }
      has_admin_or_editor_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      remove_consecutive_duplicates: {
        Args: { input: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
