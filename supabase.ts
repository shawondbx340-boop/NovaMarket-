import { createClient } from '@supabase/supabase-js';

/**
 * For Vite applications, environment variables must be prefixed with VITE_.
 * In development, these are loaded from .env files.
 * In production (Vercel/Netlify), these are pulled from the platform's Environment Variables settings.
 */

// Helper to get environment variables across different contexts
const getEnv = (key: string): string => {
  const meta = import.meta as any;
  if (meta.env && meta.env[key]) {
    return meta.env[key];
  }
  
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as Record<string, any>)[key] || '';
  }
  return '';
};

// User provided values as fallbacks if environment variables are missing
const DEFAULT_URL = 'https://sdlktxfobysbsgpcokoc.supabase.co';
const DEFAULT_KEY = 'sb_publishable_C2i2AOdT_TTAKe345on2LQ_LLyg86aW'; // Note: If this is actually a Stripe key, Supabase requests will fail with 401.

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

// Verification check: Ensuring keys are present and the URL is a valid format
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder-project')
);

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
