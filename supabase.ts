import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.0';

// Helper to safely retrieve environment variables across different build tools/environments
const getEnvVar = (name: string): string => {
  // Check import.meta.env (Vite/ESM)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[name]) {
    return (import.meta as any).env[name];
  }
  // Check process.env (Node/Webpack/Vercel)
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Standard check to see if we have valid credentials
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://')
);

// To prevent the "supabaseUrl is required" error during initialization when keys are missing,
// we provide a syntactically valid URL and a dummy key. 
// The app logic (isSupabaseConfigured) ensures we don't actually attempt real calls if these are dummies.
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(finalUrl, finalKey);
