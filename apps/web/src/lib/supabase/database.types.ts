/**
 * Hand-written subset of the generated Supabase types, covering Milestones 0–1.
 * Regenerate with `supabase gen types typescript --linked` when convenient.
 *
 * Note: Row/Insert/Update are inline object literals on purpose. Supabase's
 * types require table rows to satisfy Record<string, unknown>, which
 * TypeScript interfaces do not (they lack an implicit index signature) — using
 * an interface here silently collapses query results to `never`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          role:
            | "planning_next_12_months"
            | "actively_looking"
            | "just_browsing"
            | "agent_or_broker"
            | "creator"
            | null;
          intake_role: "searching" | "agent" | null;
          searching_with: "on_my_own" | "partner" | "family_or_friends" | null;
          region: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          referrer: string | null;
          referral_code: string;
          status_code: string;
          referred_by: string | null;
          email_confirmed_at: string | null;
          unsubscribed_at: string | null;
          last_notified_at: string | null;
          unsubscribe_token_hash: string | null;
          ip_hash: string;
          auth_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?:
            | "planning_next_12_months"
            | "actively_looking"
            | "just_browsing"
            | "agent_or_broker"
            | "creator"
            | null;
          intake_role?: "searching" | "agent" | null;
          searching_with?: "on_my_own" | "partner" | "family_or_friends" | null;
          region?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referrer?: string | null;
          referral_code: string;
          status_code: string;
          referred_by?: string | null;
          email_confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          last_notified_at?: string | null;
          unsubscribe_token_hash?: string | null;
          ip_hash: string;
          auth_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          intake_role?: "searching" | "agent" | null;
          email_confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          last_notified_at?: string | null;
          auth_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "waitlist_signups_referred_by_fkey";
            columns: ["referred_by"];
            isOneRelation: true;
            referencedRelation: "waitlist_signups";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          created_by: string;
          title: string;
          description: string | null;
          listing_status: "for_sale" | "off_market" | "sold" | "unknown";
          price_cents: number | null;
          currency: string;
          bedrooms: number | null;
          bathrooms: number | null;
          square_feet: number | null;
          property_type:
            | "house"
            | "apartment"
            | "condo"
            | "townhouse"
            | "multi_family"
            | "land"
            | "other";
          neighborhood: string;
          city: string;
          state: string | null;
          postal_code: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          title: string;
          description?: string | null;
          listing_status?: "for_sale" | "off_market" | "sold" | "unknown";
          price_cents?: number | null;
          currency?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          property_type?:
            | "house"
            | "apartment"
            | "condo"
            | "townhouse"
            | "multi_family"
            | "land"
            | "other";
          neighborhood: string;
          city: string;
          state?: string | null;
          postal_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          listing_status?: "for_sale" | "off_market" | "sold" | "unknown";
          price_cents?: number | null;
          currency?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          property_type?:
            | "house"
            | "apartment"
            | "condo"
            | "townhouse"
            | "multi_family"
            | "land"
            | "other";
          neighborhood?: string;
          city?: string;
          state?: string | null;
          postal_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "properties_created_by_fkey";
            columns: ["created_by"];
            isOneRelation: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      property_photos: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          position: number;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          storage_path: string;
          position?: number;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: {
          storage_path?: string;
          position?: number;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      property_price_history: {
        Row: {
          id: number;
          property_id: string;
          price_cents: number;
          previous_price_cents: number | null;
          currency: string;
          recorded_at: string;
        };
        Insert: {
          property_id: string;
          price_cents: number;
          previous_price_cents?: number | null;
          currency: string;
          recorded_at?: string;
        };
        Update: {
          price_cents?: number;
        };
        Relationships: [
          {
            foreignKeyName: "property_price_history_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      property_status_history: {
        Row: {
          id: number;
          property_id: string;
          status: "for_sale" | "off_market" | "sold" | "unknown";
          previous_status: "for_sale" | "off_market" | "sold" | "unknown" | null;
          recorded_at: string;
        };
        Insert: {
          property_id: string;
          status: "for_sale" | "off_market" | "sold" | "unknown";
          previous_status?: "for_sale" | "off_market" | "sold" | "unknown" | null;
          recorded_at?: string;
        };
        Update: {
          status?: "for_sale" | "off_market" | "sold" | "unknown";
        };
        Relationships: [
          {
            foreignKeyName: "property_status_history_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      property_confirmations: {
        Row: {
          id: number;
          property_id: string;
          confirmed_by: string;
          confirmed_at: string;
        };
        Insert: {
          property_id: string;
          confirmed_by: string;
          confirmed_at?: string;
        };
        Update: {
          confirmed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_confirmations_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "property_confirmations_confirmed_by_fkey";
            columns: ["confirmed_by"];
            isOneRelation: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          share_slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          is_public?: boolean;
          share_slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_public?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "collections_owner_id_fkey";
            columns: ["owner_id"];
            isOneRelation: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_items: {
        Row: {
          collection_id: string;
          property_id: string;
          added_by: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          collection_id: string;
          property_id: string;
          added_by: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey";
            columns: ["collection_id"];
            isOneRelation: true;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_added_by_fkey";
            columns: ["added_by"];
            isOneRelation: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      property_saves: {
        Row: {
          property_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          property_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_saves_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "property_saves_user_id_fkey";
            columns: ["user_id"];
            isOneRelation: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      property_field_provenance: {
        Row: {
          property_id: string;
          field: "title" | "description" | "listing_status" | "price" | "bedrooms" | "bathrooms" | "square_feet" | "property_type" | "neighborhood" | "city" | "state" | "postal_code" | "location";
          provenance: "user_submitted" | "verified";
          verified_at: string | null;
          source_ref: string | null;
        };
        Insert: {
          property_id: string;
          field: "title" | "description" | "listing_status" | "price" | "bedrooms" | "bathrooms" | "square_feet" | "property_type" | "neighborhood" | "city" | "state" | "postal_code" | "location";
          provenance?: "user_submitted" | "verified";
          verified_at?: string | null;
          source_ref?: string | null;
        };
        Update: {
          provenance?: "user_submitted" | "verified";
          verified_at?: string | null;
          source_ref?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_field_provenance_property_id_fkey";
            columns: ["property_id"];
            isOneRelation: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_members: {
        Row: {
          collection_id: string;
          user_id: string;
          role: "owner" | "editor" | "viewer";
          invited_by: string | null;
          joined_at: string;
        };
        Insert: {
          collection_id: string;
          user_id: string;
          role?: "owner" | "editor" | "viewer";
          invited_by?: string | null;
          joined_at?: string;
        };
        Update: {
          role?: "owner" | "editor" | "viewer";
          invited_by?: string | null;
        };
        Relationships: [];
      };
      collection_invites: {
        Row: {
          id: string;
          collection_id: string;
          invited_by: string;
          invitee_id: string | null;
          role: "editor" | "viewer";
          token_hash: string;
          max_uses: number;
          use_count: number;
          expires_at: string;
          revoked_at: string | null;
          declined_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          invited_by: string;
          invitee_id?: string | null;
          role?: "editor" | "viewer";
          token_hash: string;
          max_uses?: number;
          use_count?: number;
          expires_at: string;
          revoked_at?: string | null;
          declined_at?: string | null;
          created_at?: string;
        };
        Update: {
          revoked_at?: string | null;
          declined_at?: string | null;
        };
        Relationships: [];
      };
      collection_item_evaluations: {
        Row: {
          collection_id: string;
          property_id: string;
          user_id: string;
          rating: number;
          note: string | null;
          pros: string[];
          cons: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          collection_id: string;
          property_id: string;
          user_id: string;
          rating: number;
          note?: string | null;
          pros?: string[];
          cons?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rating?: number;
          note?: string | null;
          pros?: string[];
          cons?: string[];
        };
        Relationships: [];
      };
      collection_activity: {
        Row: {
          id: number;
          collection_id: string;
          actor_id: string | null;
          action:
            | "member_joined"
            | "member_left"
            | "member_removed"
            | "item_added"
            | "item_removed"
            | "evaluation_saved";
          property_id: string | null;
          target_user_id: string | null;
          created_at: string;
        };
        Insert: {
          collection_id: string;
          actor_id?: string | null;
          action:
            | "member_joined"
            | "member_left"
            | "member_removed"
            | "item_added"
            | "item_removed"
            | "evaluation_saved";
          property_id?: string | null;
          target_user_id?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      blocks: {
        Row: { blocker_id: string; blocked_id: string; created_at: string };
        Insert: { blocker_id: string; blocked_id: string; created_at?: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      content_likes: {
        Row: {
          user_id: string;
          target_type: "property" | "post";
          target_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          target_type: "property" | "post";
          target_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          target_type: "property" | "post";
          target_id: string;
          author_id: string;
          parent_id: string | null;
          body: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          deleted_by: string | null;
        };
        Insert: {
          id?: string;
          target_type: "property" | "post";
          target_id: string;
          author_id: string;
          parent_id?: string | null;
          body: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Update: {
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Relationships: [];
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string; created_at?: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: "property" | "post" | "comment" | "profile";
          target_id: string;
          reason:
            | "spam"
            | "harassment"
            | "false_information"
            | "inappropriate"
            | "personal_information"
            | "other";
          details: string | null;
          status: "open" | "reviewing" | "resolved" | "dismissed";
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: "property" | "post" | "comment" | "profile";
          target_id: string;
          reason:
            | "spam"
            | "harassment"
            | "false_information"
            | "inappropriate"
            | "personal_information"
            | "other";
          details?: string | null;
          status?: "open" | "reviewing" | "resolved" | "dismissed";
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: number;
          user_id: string;
          actor_id: string | null;
          type: "collection_invite" | "collection_activity" | "comment" | "like" | "follow";
          target_type: "property" | "post" | null;
          target_id: string | null;
          comment_id: string | null;
          collection_id: string | null;
          actor_ids: string[];
          actor_count: number;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          actor_id?: string | null;
          type: "collection_invite" | "collection_activity" | "comment" | "like" | "follow";
          target_type?: "property" | "post" | null;
          target_id?: string | null;
          comment_id?: string | null;
          collection_id?: string | null;
          actor_ids?: string[];
          actor_count?: number;
          read_at?: string | null;
          created_at?: string;
        };
        Update: { read_at?: string | null };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          kind: "text" | "photo" | "video";
          caption: string;
          categories: (
            | "walkthrough"
            | "renovation"
            | "architecture"
            | "interiors"
            | "neighborhood"
            | "before_after"
            | "diy"
            | "other"
          )[];
          property_id: string | null;
          neighborhood: string | null;
          city: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          deleted_by: string | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          kind: "text" | "photo" | "video";
          caption?: string;
          categories?: (
            | "walkthrough"
            | "renovation"
            | "architecture"
            | "interiors"
            | "neighborhood"
            | "before_after"
            | "diy"
            | "other"
          )[];
          property_id?: string | null;
          neighborhood?: string | null;
          city?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Update: {
          caption?: string;
          categories?: (
            | "walkthrough"
            | "renovation"
            | "architecture"
            | "interiors"
            | "neighborhood"
            | "before_after"
            | "diy"
            | "other"
          )[];
          property_id?: string | null;
          neighborhood?: string | null;
          city?: string | null;
        };
        Relationships: [];
      };
      post_photos: {
        Row: {
          id: string;
          post_id: string;
          storage_path: string;
          position: number;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          storage_path: string;
          position: number;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          size_bytes: number;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          storage_path: string;
          poster_path: string;
          duration_seconds: number;
          width: number;
          height: number;
          size_bytes: number;
          mime_type: "video/mp4" | "video/webm";
          captions: string | null;
          status: "uploaded" | "ready" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          storage_path: string;
          poster_path: string;
          duration_seconds: number;
          width: number;
          height: number;
          size_bytes: number;
          mime_type: "video/mp4" | "video/webm";
          captions?: string | null;
          status?: "uploaded" | "ready" | "failed";
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      user_media_usage: {
        Row: {
          user_id: string;
          photo_bytes: number;
          video_bytes: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          photo_bytes?: number;
          video_bytes?: number;
          updated_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      feed_preferences: {
        Row: {
          user_id: string;
          neighborhoods: string[];
          property_types: string[];
          updated_at: string;
        };
        Insert: {
          user_id: string;
          neighborhoods?: string[];
          property_types?: string[];
          updated_at?: string;
        };
        Update: {
          neighborhoods?: string[];
          property_types?: string[];
        };
        Relationships: [];
      };
    };
    Views: {
      content_like_counts: {
        Row: {
          target_type: "property" | "post";
          target_id: string;
          like_count: number;
        };
        Relationships: [];
      };
      profile_follow_counts: {
        Row: { user_id: string; follower_count: number; following_count: number };
        Relationships: [];
      };
      feed_properties: {
        Row: { id: string; created_at: string; relevance: number };
        Relationships: [];
      };
      watch_posts: {
        Row: {
          post_id: string;
          created_at: string;
          relevance: number;
          engagement_score: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      join_waitlist: {
        Args: {
          p_email: string;
          p_role?: string | null;
          p_searching_with?: string | null;
          p_region?: string | null;
          p_utm_source?: string | null;
          p_utm_medium?: string | null;
          p_utm_campaign?: string | null;
          p_referrer?: string | null;
          p_referral_code?: string | null;
          p_ip_hash: string;
          p_unsubscribe_token_hash?: string | null;
          p_intake_role?: "searching" | "agent" | null;
        };
        Returns: Json;
      };
      join_waitlist_admin: {
        Args: {
          p_email: string;
          p_role?: string | null;
          p_searching_with?: string | null;
          p_region?: string | null;
          p_utm_source?: string | null;
          p_utm_medium?: string | null;
          p_utm_campaign?: string | null;
          p_referrer?: string | null;
          p_referral_code?: string | null;
          p_ip_hash: string;
          p_unsubscribe_token_hash?: string | null;
          p_intake_role?: "searching" | "agent" | null;
        };
        Returns: Json;
      };
      confirm_waitlist_signup: {
        Args: { p_signup_id: string };
        Returns: Json;
      };
      get_waitlist_status: {
        Args: { p_code: string };
        Returns: Array<{
          position: number | null;
          total: number | null;
          referral_count: number;
          tier: string | null;
        }>;
      };
      get_waitlist_referral_code: {
        Args: { p_status_code: string };
        Returns: string | null;
      };
      waitlist_position: {
        Args: { p_signup_id: string };
        Returns: number | null;
      };
      waitlist_signup_count: {
        Args: Record<string, never>;
        Returns: number;
      };
      unsubscribe_waitlist: {
        Args: { p_token_hash: string };
        Returns: boolean;
      };
      claim_waitlist_notification: {
        Args: { p_token_hash: string };
        Returns: boolean;
      };
      stage_waitlist_survey: {
        Args: {
          p_signup_id: string;
          p_session_id: string;
          p_ip_hash: string;
          p_answers: Json;
        };
        Returns: Json;
      };
      promote_waitlist_survey: {
        Args: { p_signup_id: string; p_session_id: string };
        Returns: Json;
      };
      save_verified_waitlist_survey: {
        Args: { p_signup_id: string; p_ip_hash: string; p_answers: Json };
        Returns: Json;
      };
      waitlist_survey_signup_id: {
        Args: { p_status_code: string };
        Returns: string | null;
      };
      accept_collection_invite: {
        Args: { p_token_hash: string };
        Returns: string;
      };
      decline_collection_invite: {
        Args: { p_token_hash: string };
        Returns: undefined;
      };
      accept_collection_invite_by_id: {
        Args: { p_invite_id: string };
        Returns: string;
      };
      decline_collection_invite_by_id: {
        Args: { p_invite_id: string };
        Returns: undefined;
      };
      create_post: {
        Args: {
          p_kind: "text" | "photo" | "video";
          p_caption: string;
          p_categories: (
            | "walkthrough"
            | "renovation"
            | "architecture"
            | "interiors"
            | "neighborhood"
            | "before_after"
            | "diy"
            | "other"
          )[];
          p_property_id?: string | null;
          p_neighborhood?: string | null;
          p_city?: string | null;
          p_photos?: Json;
          p_video?: Json;
        };
        Returns: string;
      };
      soft_delete_post: {
        Args: { p_post_id: string };
        Returns: undefined;
      };
      delete_my_account: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      get_my_pending_invites: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          collection_name: string;
          collection_slug: string;
          role: "editor" | "viewer";
          expires_at: string;
        }[];
      };
    };
    Enums: {
      listing_status: "for_sale" | "off_market" | "sold" | "unknown";
      property_type:
        | "house"
        | "apartment"
        | "condo"
        | "townhouse"
        | "multi_family"
        | "land"
        | "other";
      field_provenance: "user_submitted" | "verified";
      collection_role: "owner" | "editor" | "viewer";
      collection_activity_action:
        | "member_joined"
        | "member_left"
        | "member_removed"
        | "item_added"
        | "item_removed"
        | "evaluation_saved";
      social_target_type: "property" | "post";
      report_target_type: "property" | "post" | "comment" | "profile";
      report_reason:
        | "spam"
        | "harassment"
        | "false_information"
        | "inappropriate"
        | "personal_information"
        | "other";
      report_status: "open" | "reviewing" | "resolved" | "dismissed";
      notification_type:
        | "collection_invite"
        | "collection_activity"
        | "comment"
        | "like"
        | "follow";
      post_kind: "text" | "photo" | "video";
      post_category:
        | "walkthrough"
        | "renovation"
        | "architecture"
        | "interiors"
        | "neighborhood"
        | "before_after"
        | "diy"
        | "other";
      video_status: "uploaded" | "ready" | "failed";
    };
    CompositeTypes: Record<never, never>;
  };
};
