import { useSiteContent } from './SiteContentProvider';
import type { PagePhoto } from './types';

export { pagePhotoSlots, pagePhotoKey, type PagePhotoSlot } from './pagePhotoSlots';

/** The photo Dennis chose for this place, or null for the built-in photo. */
export function usePagePhoto(slot: string): PagePhoto | null {
  return useSiteContent().pagePhotos[slot] ?? null;
}

/** Alt text of a chosen photo in the visitor's language. */
export const pagePhotoAlt = (photo: PagePhoto, language: 'nl' | 'en') => (language === 'en' ? photo.altEn : photo.altNl);
