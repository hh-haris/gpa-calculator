export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      gpa_posts: {
        Row: {
          class: string
          created_at: string
          device_info: Json | null
          gpa: number
          id: string
          message: string | null
          name: string | null
          section: string
          semester: string
          session_id: string
          type: string
          updated_at: string
        }
        Insert: {
          class: string
          created_at?: string
          device_info?: Json | null
          gpa: number
          id?: string
          message?: string | null
          name?: string | null
          section: string
          semester: string
          session_id: string
          type: string
          updated_at?: string
        }
        Update: {
          class?: string
          created_at?: string
          device_info?: Json | null
          gpa?: number
          id?: string
          message?: string | null
          name?: string | null
          section?: string
          semester?: string
          session_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      gpa_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reaction_type: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gpa_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "gpa_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_votes: {
        Row: {
          created_at: string
          id: string
          session_id: string
          suggestion_id: string | null
          vote_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          suggestion_id?: string | null
          vote_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          suggestion_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          additional_info: string | null
          created_at: string
          device_info: Json | null
          id: string
          is_verified_student: boolean | null
          name: string
          session_id: string
          suggestion: string
          updated_at: string
          votes: number | null
        }
        Insert: {
          additional_info?: string | null
          created_at?: string
          device_info?: Json | null
          id?: string
          is_verified_student?: boolean | null
          name: string
          session_id: string
          suggestion: string
          updated_at?: string
          votes?: number | null
        }
        Update: {
          additional_info?: string | null
          created_at?: string
          device_info?: Json | null
          id?: string
          is_verified_student?: boolean | null
          name?: string
          session_id?: string
          suggestion?: string
          updated_at?: string
          votes?: number | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          calculation_count: number | null
          created_at: string
          device_type: string | null
          gpa_calculated: number | null
          id: string
          ip_address: unknown | null
          is_returning_user: boolean | null
          session_id: string
          subjects_count: number | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          calculation_count?: number | null
          created_at?: string
          device_type?: string | null
          gpa_calculated?: number | null
          id?: string
          ip_address?: unknown | null
          is_returning_user?: boolean | null
          session_id?: string
          subjects_count?: number | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          calculation_count?: number | null
          created_at?: string
          device_type?: string | null
          gpa_calculated?: number | null
          id?: string
          ip_address?: unknown | null
          is_returning_user?: boolean | null
          session_id?: string
          subjects_count?: number | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
