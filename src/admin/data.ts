import type { SupabaseClient } from '@supabase/supabase-js';
import { mediaImage, projectSelect, type MediaRow, type ProjectRow } from '../content/load';
import type { ResponsiveImage } from '../content/types';

export interface LibraryPhoto extends MediaRow {
  image: ResponsiveImage | null;
  usedIn: { id: string; title_nl: string }[];
}

export async function listLibrary(client: SupabaseClient): Promise<LibraryPhoto[]> {
  const { data, error } = await client
    .from('media')
    .select('id, storage_path, static_key, width, height, alt_nl, alt_en, size_bytes, created_at, project_photos(projects(id, title_nl))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as (MediaRow & { project_photos: { projects: { id: string; title_nl: string } | null }[] })[]).map((row) => ({
    ...row,
    image: mediaImage(row),
    usedIn: row.project_photos.flatMap((link) => (link.projects ? [link.projects] : [])),
  }));
}

export async function listProjects(client: SupabaseClient): Promise<ProjectRow[]> {
  const { data, error } = await client.from('projects').select(projectSelect).order('sort_order').order('created_at');
  if (error) throw error;
  return data as unknown as ProjectRow[];
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}
