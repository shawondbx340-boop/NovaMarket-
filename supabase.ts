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

// Project URL
const DEFAULT_URL = 'https://sdlktxfobysbsgpcokoc.supabase.co';

// Restored Correct API Key
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbGt0eGZvYnlzYnNncGNva29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDA1NTAsImV4cCI6MjA4MjMxNjU1MH0.qdX3jaUrEFnQEZPP8zSH8JOtjXd01_gkz4389nmjpw0'; 

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.startsWith('eyJ')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getRedirectUrl = () => {
  return window.location.origin;
};