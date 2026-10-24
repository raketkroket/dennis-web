import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from './env';

export { photoBucket, storagePublicUrl, supabaseAnonKey, supabaseUrl } from './env';

/** Null when the site runs without Supabase; it then shows the built-in content. */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'denra-admin-auth' } })
  : null;
