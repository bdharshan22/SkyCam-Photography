import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

let supabase: any = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('System: Connected to Supabase');
} catch (e: any) {
  console.error('System: Supabase initialization error:', e);
  supabase = null;
}

export { supabase };