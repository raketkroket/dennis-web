import { photoLibrary } from './photoLibrary';
import type { SiteContent } from './types';

// The admin content baked into each page (scripts/prerender.mjs). Built-in
// photos are written as {"$photo": key}: the browser already has their
// addresses, so the long srcSet strings are not repeated in every page.

const keyBySrc = new Map(Object.entries(photoLibrary).map(([key, image]) => [image.src, key]));

export function packContent(content: SiteContent): string {
  return JSON.stringify(content, (_key, value) => {
    if (value && typeof value === 'object' && typeof value.src === 'string' && keyBySrc.has(value.src)) return { $photo: keyBySrc.get(value.src) };
    return value;
  });
}

export function unpackContent(text: string): SiteContent {
  return JSON.parse(text, (_key, value) => (value && typeof value === 'object' && typeof value.$photo === 'string' ? photoLibrary[value.$photo] ?? null : value));
}
