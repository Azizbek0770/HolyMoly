import { createClient } from "@supabase/supabase-js";

// Use mock values for development when environment variables are not set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.mock-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock auth functions for development
export const mockAuthEnabled = !import.meta.env.VITE_SUPABASE_URL;
