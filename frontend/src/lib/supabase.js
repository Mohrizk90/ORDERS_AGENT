import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Feature flags
export const ENABLE_REALTIME = import.meta.env.VITE_ENABLE_REALTIME === 'true';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
export const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Validate configuration
const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key');

if (!USE_MOCK_DATA && !isConfigured) {
  console.error(
    '⚠️ Supabase credentials not configured!\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local\n' +
    'Or enable mock data with VITE_USE_MOCK_DATA=true'
  );
}

export const isSupabaseConfigured = () => isConfigured || USE_MOCK_DATA;

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    // Suppress logging for expected errors (optional tables)
    db: {
      schema: 'public',
    },
  }
);

// Note: 404 errors for /alerts and /activity tables in the browser console are expected
// if those tables don't exist in your Supabase database. The app handles these gracefully
// by returning empty arrays. These are optional tables and the app works fine without them.

export default supabase;
