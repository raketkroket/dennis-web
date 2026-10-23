// Public Supabase settings. Kept apart from lib/supabase.ts so pages can
// check them and build photo URLs without loading the Supabase client.
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const photoBucket = 'project-photos';

export function storagePublicUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${photoBucket}/${path.split('/').map(encodeURIComponent).join('/')}`;
}
