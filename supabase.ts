import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 */

const getEnv = (key: string): string => {
  const meta = import.meta as any;
  if (meta.env && meta.env[key]) return meta.env[key];
  if (typeof process !== 'undefined' && process.env) return (process.env as any)[key] || '';
  return '';
};

// The Project URL remains the same as previously seen
const DEFAULT_URL = 'https://sdlktxfobysbsgpcokoc.supabase.co';

// UPDATED: Correct Supabase Anon Key provided by user
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbGt0eGZvYnlzYnNncGNva29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDA1NTAsImV4cCI6MjA4MjMxNjU1MH0.qdX3jaUrEFnQEZPP8zSH8JOtjXd01_gkz4389nmjpw0'; 

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

// Check if the key is the incorrect Stripe format (legacy check, but good to keep)
export const isKeyIncorrect = supabaseAnonKey.startsWith('sb_') || supabaseAnonKey.startsWith('pk_');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !isKeyIncorrect
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to get the base redirect URL.
 * Ensure this matches what is entered in Supabase Dashboard -> Authentication -> URL Configuration
 */
export const getRedirectUrl = () => {
  // If we are on Vercel, use the current origin.
  // We remove trailing slashes to stay consistent.
  return window.location.origin.replace(/\/$/, '');
};
