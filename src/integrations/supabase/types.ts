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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          coin_reward: number
          created_at: string
          description: string
          icon: string
          id: string
          is_hidden: boolean | null
          name: string
          target: number
          xp_reward: number
        }
        Insert: {
          category: string
          coin_reward?: number
          created_at?: string
          description: string
          icon: string
          id?: string
          is_hidden?: boolean | null
          name: string
          target: number
          xp_reward?: number
        }
        Update: {
          category?: string
          coin_reward?: number
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_hidden?: boolean | null
          name?: string
          target?: number
          xp_reward?: number
        }
        Relationships: []
      }
      chests: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          rarity: string
          rewards: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          rarity: string
          rewards: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          rarity?: string
          rewards?: Json
        }
        Relationships: []
      }
      friend_challenges: {
        Row: {
          challenged_id: string
          challenged_score: number | null
          challenger_id: string
          challenger_score: number | null
          completed_at: string | null
          created_at: string
          expires_at: string
          id: string
          lesson_id: string
          status: Database["public"]["Enums"]["challenge_status"] | null
          winner_id: string | null
        }
        Insert: {
          challenged_id: string
          challenged_score?: number | null
          challenger_id: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          lesson_id: string
          status?: Database["public"]["Enums"]["challenge_status"] | null
          winner_id?: string | null
        }
        Update: {
          challenged_id?: string
          challenged_score?: number | null
          challenger_id?: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          lesson_id?: string
          status?: Database["public"]["Enums"]["challenge_status"] | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_challenges_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          accepted_at: string | null
          created_at: string
          friend_id: string
          id: string
          status: Database["public"]["Enums"]["friendship_status"] | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          friend_id: string
          id?: string
          status?: Database["public"]["Enums"]["friendship_status"] | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          friend_id?: string
          id?: string
          status?: Database["public"]["Enums"]["friendship_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          created_at: string
          id: string
          rank: number | null
          updated_at: string
          user_id: string
          week_end: string
          week_start: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          id?: string
          rank?: number | null
          updated_at?: string
          user_id: string
          week_end: string
          week_start: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          id?: string
          rank?: number | null
          updated_at?: string
          user_id?: string
          week_end?: string
          week_start?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      league_memberships: {
        Row: {
          demoted: boolean | null
          id: string
          joined_at: string
          league_id: string
          promoted: boolean | null
          rank: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          demoted?: boolean | null
          id?: string
          joined_at?: string
          league_id: string
          promoted?: boolean | null
          rank?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          demoted?: boolean | null
          id?: string
          joined_at?: string
          league_id?: string
          promoted?: boolean | null
          rank?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_memberships_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          id: string
          max_members: number | null
          name: string
          tier: Database["public"]["Enums"]["league_tier"]
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_members?: number | null
          name: string
          tier: Database["public"]["Enums"]["league_tier"]
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          max_members?: number | null
          name?: string
          tier?: Database["public"]["Enums"]["league_tier"]
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      lesson_attempts: {
        Row: {
          accuracy: number
          coins_earned: number
          completed_at: string
          id: string
          lesson_id: string
          questions_correct: number
          questions_total: number
          score: number
          stars_earned: number
          time_spent: number | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          accuracy: number
          coins_earned: number
          completed_at?: string
          id?: string
          lesson_id: string
          questions_correct: number
          questions_total: number
          score: number
          stars_earned: number
          time_spent?: number | null
          user_id: string
          xp_earned: number
        }
        Update: {
          accuracy?: number
          coins_earned?: number
          completed_at?: string
          id?: string
          lesson_id?: string
          questions_correct?: number
          questions_total?: number
          score?: number
          stars_earned?: number
          time_spent?: number | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          coins_reward: number
          created_at: string
          description: string | null
          difficulty: string
          id: string
          min_accuracy_for_stars: Json | null
          name: string
          order_index: number
          questions_count: number
          skill_id: string
          xp_reward: number
        }
        Insert: {
          coins_reward?: number
          created_at?: string
          description?: string | null
          difficulty: string
          id?: string
          min_accuracy_for_stars?: Json | null
          name: string
          order_index: number
          questions_count?: number
          skill_id: string
          xp_reward?: number
        }
        Update: {
          coins_reward?: number
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          min_accuracy_for_stars?: Json | null
          name?: string
          order_index?: number
          questions_count?: number
          skill_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_links: {
        Row: {
          child_id: string
          created_at: string
          id: string
          parent_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_links_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_links_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      power_ups: {
        Row: {
          coin_price: number
          created_at: string
          description: string
          duration_minutes: number | null
          effect_multiplier: number | null
          icon: string
          id: string
          name: string
          type: string
        }
        Insert: {
          coin_price?: number
          created_at?: string
          description: string
          duration_minutes?: number | null
          effect_multiplier?: number | null
          icon: string
          id?: string
          name: string
          type: string
        }
        Update: {
          coin_price?: number
          created_at?: string
          description?: string
          duration_minutes?: number | null
          effect_multiplier?: number | null
          icon?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          bio: string | null
          coins: number
          created_at: string
          daily_xp_earned: number
          daily_xp_goal: number
          display_name: string | null
          hearts: number
          id: string
          last_active_date: string | null
          level: number
          longest_streak: number
          max_hearts: number
          sound_enabled: boolean | null
          streak_count: number
          theme_preference: string | null
          total_lessons_completed: number
          total_xp_earned: number
          updated_at: string
          username: string
          xp: number
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          daily_xp_earned?: number
          daily_xp_goal?: number
          display_name?: string | null
          hearts?: number
          id: string
          last_active_date?: string | null
          level?: number
          longest_streak?: number
          max_hearts?: number
          sound_enabled?: boolean | null
          streak_count?: number
          theme_preference?: string | null
          total_lessons_completed?: number
          total_xp_earned?: number
          updated_at?: string
          username: string
          xp?: number
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          daily_xp_earned?: number
          daily_xp_goal?: number
          display_name?: string | null
          hearts?: number
          id?: string
          last_active_date?: string | null
          level?: number
          longest_streak?: number
          max_hearts?: number
          sound_enabled?: boolean | null
          streak_count?: number
          theme_preference?: string | null
          total_lessons_completed?: number
          total_xp_earned?: number
          updated_at?: string
          username?: string
          xp?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          name: string
          operation: string
          order_index: number
          parent_skill_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          operation: string
          order_index: number
          parent_skill_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          operation?: string
          order_index?: number
          parent_skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_parent_skill_id_fkey"
            columns: ["parent_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          is_unlocked: boolean | null
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chests: {
        Row: {
          chest_id: string
          earned_at: string
          id: string
          is_opened: boolean | null
          opened_at: string | null
          user_id: string
        }
        Insert: {
          chest_id: string
          earned_at?: string
          id?: string
          is_opened?: boolean | null
          opened_at?: string | null
          user_id: string
        }
        Update: {
          chest_id?: string
          earned_at?: string
          id?: string
          is_opened?: boolean | null
          opened_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chests_chest_id_fkey"
            columns: ["chest_id"]
            isOneToOne: false
            referencedRelation: "chests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_power_ups: {
        Row: {
          activated_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          power_up_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          power_up_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          power_up_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_power_ups_power_up_id_fkey"
            columns: ["power_up_id"]
            isOneToOne: false
            referencedRelation: "power_ups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_power_ups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          created_at: string
          id: string
          is_completed: boolean | null
          is_unlocked: boolean | null
          last_practiced_at: string | null
          lesson_id: string | null
          mastery_score: number | null
          skill_id: string
          stars: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          last_practiced_at?: string | null
          lesson_id?: string | null
          mastery_score?: number | null
          skill_id: string
          stars?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          is_unlocked?: boolean | null
          last_practiced_at?: string | null
          lesson_id?: string | null
          mastery_score?: number | null
          skill_id?: string
          stars?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quest_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          progress: number | null
          quest_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          quest_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          quest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "weekly_quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quest_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          allow_friend_requests: boolean | null
          created_at: string
          email_notifications: boolean | null
          id: string
          notifications_enabled: boolean | null
          profile_visibility: string | null
          show_in_leaderboard: boolean | null
          sound_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_friend_requests?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          profile_visibility?: string | null
          show_in_leaderboard?: boolean | null
          sound_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_friend_requests?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          profile_visibility?: string | null
          show_in_leaderboard?: boolean | null
          sound_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_quests: {
        Row: {
          coin_reward: number
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          name: string
          week_end: string
          week_start: string
          xp_reward: number
        }
        Insert: {
          coin_reward: number
          created_at?: string
          criteria: Json
          description: string
          icon: string
          id?: string
          name: string
          week_end: string
          week_start: string
          xp_reward: number
        }
        Update: {
          coin_reward?: number
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          name?: string
          week_end?: string
          week_start?: string
          xp_reward?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "parent" | "child"
      app_role: "parent" | "child" | "admin"
      challenge_status: "pending" | "active" | "completed" | "expired"
      friendship_status: "pending" | "accepted" | "declined" | "blocked"
      league_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
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
      account_type: ["parent", "child"],
      app_role: ["parent", "child", "admin"],
      challenge_status: ["pending", "active", "completed", "expired"],
      friendship_status: ["pending", "accepted", "declined", "blocked"],
      league_tier: ["bronze", "silver", "gold", "platinum", "diamond"],
    },
  },
} as const
