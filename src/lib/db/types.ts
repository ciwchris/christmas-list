export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          has_been_purchased: boolean | null
          id: number
          inserted_at: string
          item: string | null
          purchased_at: string | null
          purchased_by_user_id: string | null
          user_id: string
        }
        Insert: {
          has_been_purchased?: boolean | null
          id?: number
          inserted_at?: string
          item?: string | null
          purchased_at?: string | null
          purchased_by_user_id?: string | null
          user_id: string
        }
        Update: {
          has_been_purchased?: boolean | null
          id?: number
          inserted_at?: string
          item?: string | null
          purchased_at?: string | null
          purchased_by_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_purchased_by_user_id_fkey"
            columns: ["purchased_by_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
