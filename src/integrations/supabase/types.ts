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
      analysis_posts: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          author_id: string | null
          content: string
          created_at: string
          id: string
          publish_date: string | null
          risk_level: Database["public"]["Enums"]["user_risk_level"]
          title: string
          updated_at: string
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          publish_date?: string | null
          risk_level: Database["public"]["Enums"]["user_risk_level"]
          title: string
          updated_at?: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          publish_date?: string | null
          risk_level?: Database["public"]["Enums"]["user_risk_level"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_interactions: {
        Row: {
          ai_inferred_traits: Json | null
          created_at: string
          id: string
          message_text: string
          response_text: string | null
          user_id: string | null
        }
        Insert: {
          ai_inferred_traits?: Json | null
          created_at?: string
          id?: string
          message_text: string
          response_text?: string | null
          user_id?: string | null
        }
        Update: {
          ai_inferred_traits?: Json | null
          created_at?: string
          id?: string
          message_text?: string
          response_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_recommendations: {
        Row: {
          ai_recommendation: Json
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          ai_recommendation: Json
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          ai_recommendation?: Json
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          investment_bracket:
            | Database["public"]["Enums"]["investment_bracket"]
            | null
          personality_profile: Json | null
          risk_level: Database["public"]["Enums"]["user_risk_level"] | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          investment_bracket?:
            | Database["public"]["Enums"]["investment_bracket"]
            | null
          personality_profile?: Json | null
          risk_level?: Database["public"]["Enums"]["user_risk_level"] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          investment_bracket?:
            | Database["public"]["Enums"]["investment_bracket"]
            | null
          personality_profile?: Json | null
          risk_level?: Database["public"]["Enums"]["user_risk_level"] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          analysis_id: string | null
          commentary: string | null
          created_at: string
          entry_price: number
          id: string
          risk_level: Database["public"]["Enums"]["user_risk_level"]
          status: Database["public"]["Enums"]["signal_status"] | null
          stop_loss: number | null
          target_price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          analysis_id?: string | null
          commentary?: string | null
          created_at?: string
          entry_price: number
          id?: string
          risk_level: Database["public"]["Enums"]["user_risk_level"]
          status?: Database["public"]["Enums"]["signal_status"] | null
          stop_loss?: number | null
          target_price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          analysis_id?: string | null
          commentary?: string | null
          created_at?: string
          entry_price?: number
          id?: string
          risk_level?: Database["public"]["Enums"]["user_risk_level"]
          status?: Database["public"]["Enums"]["signal_status"] | null
          stop_loss?: number | null
          target_price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_type: "Stocks" | "Gold" | "Crypto" | "Forex" | "ETFs"
      investment_bracket: "under_10k" | "10k_to_50k" | "over_50k"
      signal_status: "active" | "closed" | "revised"
      user_risk_level: "Low" | "Medium" | "High"
      user_role: "user" | "analyst" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
