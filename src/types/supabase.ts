
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
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          created_at: string
          password: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          created_at?: string
          password: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          created_at?: string
          password?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          matric_number: string
          department: string
          payment_status: string
          organization_name: string | null
          organization_address: string | null
          organization_state: string | null
          organization_lga: string | null
          organization_contact_person: string | null
          organization_phone_number: string | null
          supervisor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          matric_number: string
          department: string
          payment_status?: string
          organization_name?: string | null
          organization_address?: string | null
          organization_state?: string | null
          organization_lga?: string | null
          organization_contact_person?: string | null
          organization_phone_number?: string | null
          supervisor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          matric_number?: string
          department?: string
          payment_status?: string
          organization_name?: string | null
          organization_address?: string | null
          organization_state?: string | null
          organization_lga?: string | null
          organization_contact_person?: string | null
          organization_phone_number?: string | null
          supervisor_id?: string | null
          created_at?: string
        }
      }
      supervisors: {
        Row: {
          id: string
          user_id: string
          department: string
          phone_number: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          department: string
          phone_number: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          department?: string
          phone_number?: string
          created_at?: string
        }
      }
      coordinators: {
        Row: {
          id: string
          user_id: string
          department: string
          phone_number: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          department: string
          phone_number: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          department?: string
          phone_number?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          student_id: string
          week_number: number
          title: string
          description: string
          submission_date: string
          file_url: string | null
          feedback: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          week_number: number
          title: string
          description: string
          submission_date?: string
          file_url?: string | null
          feedback?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          week_number?: number
          title?: string
          description?: string
          submission_date?: string
          file_url?: string | null
          feedback?: string | null
          status?: string
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          message: string
          timestamp: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          message: string
          timestamp?: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          timestamp?: string
          read?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          reference_number: string
          payment_date: string
          status: string
          payment_method: string
          evidence: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          reference_number: string
          payment_date?: string
          status?: string
          payment_method: string
          evidence?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          reference_number?: string
          payment_date?: string
          status?: string
          payment_method?: string
          evidence?: string | null
          created_at?: string
        }
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
