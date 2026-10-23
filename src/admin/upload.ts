import type { SupabaseClient } from '@supabase/supabase-js';
import { photoBucket, supabaseAnonKey, supabaseUrl } from '../lib/supabase';
import type { MediaRow } from '../content/load';

const maxInputBytes = 30 * 1024 * 1024;
const maxEdge = 2400;
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', ''];

export class UploadError extends Error {}

export type UploadStage = 'checking' | 'optimizing' | 'uploading' | 'saving' | 'done';

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Older Safari: fall back to an <img>, which also applies the EXIF rotation.
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Scales a phone photo down to at most 2400 px and compresses it (WebP, else JPEG). */
export async function optimizePhoto(file: File): Promise<{ blob: Blob; width: number; height: number; extension: 'webp' | 'jpg' }> {
  if (!acceptedTypes.includes(file.type)) throw new UploadError(`"${file.name}" is geen foto. Kies een JPG-, PNG-, WebP- of iPhone-foto.`);
  if (file.size > maxInputBytes) throw new UploadError(`"${file.name}" is groter dan 30 MB. Kies een kleinere foto.`);

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    throw new UploadError(`"${file.name}" kan niet worden gelezen. Probeer de foto opnieuw te kiezen, of maak er een schermafbeelding van.`);
  }
  const sourceWidth = 'naturalWidth' in source ? source.naturalWidth : source.width;
  const sourceHeight = 'naturalHeight' in source ? source.naturalHeight : source.height;
  if (sourceWidth < 600 && sourceHeight < 600) throw new UploadError(`"${file.name}" is te klein (${sourceWidth} × ${sourceHeight} pixels). Kies een foto van minstens 600 pixels breed of hoog.`);

  const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new UploadError('Deze browser kan foto’s niet verkleinen. Probeer een andere browser.');
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, width, height);
  if ('close' in source) source.close();

  const webp = await toBlob(canvas, 'image/webp', 0.82);
  if (webp && webp.type === 'image/webp') return { blob: webp, width, height, extension: 'webp' };
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.85);
  if (!jpeg) throw new UploadError(`"${file.name}" kon niet worden verwerkt.`);
  return { blob: jpeg, width, height, extension: 'jpg' };
}

function putWithProgress(path: string, blob: Blob, token: string, onProgress: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${supabaseUrl}/storage/v1/object/${photoBucket}/${path}`);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.setRequestHeader('apikey', supabaseAnonKey);
    request.setRequestHeader('Content-Type', blob.type);
    request.setRequestHeader('cache-control', 'max-age=31536000');
    request.setRequestHeader('x-upsert', 'false');
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) return resolve();
      if (request.status === 401 || request.status === 403) return reject(new UploadError('U bent niet (meer) ingelogd als beheerder. Log opnieuw in en probeer het nog eens.'));
      if (request.status === 413) return reject(new UploadError('De foto is te groot om te uploaden.'));
      reject(new UploadError(`Uploaden is niet gelukt (foutcode ${request.status}). Probeer het opnieuw.`));
    };
    request.onerror = () => reject(new UploadError('Geen verbinding. Controleer uw internet en probeer het opnieuw.'));
    request.send(blob);
  });
}

/** Optimizes, uploads and registers one photo. */
export async function uploadPhoto(client: SupabaseClient, file: File, onStage: (stage: UploadStage, progress?: number) => void): Promise<MediaRow> {
  onStage('checking');
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new UploadError('U bent niet (meer) ingelogd. Log opnieuw in en probeer het nog eens.');

  onStage('optimizing');
  const optimized = await optimizePhoto(file);
  const now = new Date();
  const path = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${optimized.extension}`;

  onStage('uploading', 0);
  await putWithProgress(path, optimized.blob, token, (fraction) => onStage('uploading', fraction));

  onStage('saving');
  const { data: media, error } = await client
    .from('media')
    .insert({ storage_path: path, width: optimized.width, height: optimized.height, size_bytes: optimized.blob.size })
    .select('id, storage_path, static_key, width, height, alt_nl, alt_en, size_bytes, created_at')
    .single();
  if (error) {
    await client.storage.from(photoBucket).remove([path]);
    throw new UploadError('De foto is geüpload maar kon niet worden opgeslagen in de fotobibliotheek. Probeer het opnieuw.');
  }
  onStage('done', 1);
  return media as MediaRow;
}
