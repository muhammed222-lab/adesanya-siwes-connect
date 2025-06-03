
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Fallback values for when Supabase is not configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

// Check if environment variables are properly set
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are not set. Using fallback configuration for development.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a flag to check if Supabase is properly configured
export const isSupabaseReady = isSupabaseConfigured;
