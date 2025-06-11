import { createClient } from '@supabase/supabase-js';

// Always use environment variables for sensitive credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://mtaxaxfggfsgdgesdsze.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YXhheGZnZ2ZzZ2RnZXNkc3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNTc0MzMsImV4cCI6MjA2NDkzMzQzM30.ZF6UD2e2EShVm1sG6N58y5BnmYVKkQHl65o0T15-gAc";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});