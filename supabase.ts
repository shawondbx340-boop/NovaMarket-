
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.0';

const getEnvVar = (name: string): string => {
  // ESM / Vite logic
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[name]) {
    return (import.meta as any).env[name];
  }
  // Node / Vercel legacy logic
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string;
  }
  // Global window fallback for some specialized environments
  if (typeof window !== 'undefined' && (window as any)._env_ && (window as any)._env_[name]) {
    return (window as any)._env_[name];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://')
);

// Fallback to avoid "supabaseUrl is required" error during bundle evaluation
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(finalUrl, finalKey);
