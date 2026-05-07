import { createClient } from '@supabase/supabase-js';

// Try NEXT_PUBLIC first (client & server), fallback to non-prefixed (server only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Fallback logic to prevent crashes if env vars are missing
const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

if (!isSupabaseConfigured && typeof window === 'undefined') {
  console.warn('Supabase: Environment variables are missing!');
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
