import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// 1. Get values from environment variables (Vite uses import.meta.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 2. Define your actual project credentials as the "Final Fallback"
// This ensures that even if Vercel fails to load the .env, the app still works.
const projectUrl = SUPABASE_URL || "https://rrxsevbgtprbtfakidqe.supabase.co";
const projectKey = SUPABASE_PUBLISHABLE_KEY || "sb_publishable_e5udXFWl7w_gMFH_ezq-pg_Fx8KvzWd";

// 3. Logic check: If both are missing, warn the developer in the console
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "[Lamitna] Using hardcoded Supabase credentials. For better security, add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your Vercel Environment Variables."
  );
}

// 4. Initialize the singleton instance
export const supabase = createClient<Database>(projectUrl, projectKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});