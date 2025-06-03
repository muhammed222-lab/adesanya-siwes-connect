
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl) {
  console.error("VITE_SUPABASE_URL environment variable is not set");
  throw new Error("Supabase URL is required. Please check your environment variables.");
}

if (!supabaseAnonKey) {
  console.error("VITE_SUPABASE_ANON_KEY environment variable is not set");
  throw new Error("Supabase anonymous key is required. Please check your environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
