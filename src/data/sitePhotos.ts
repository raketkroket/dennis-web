import { photoLibrary } from '../content/photoLibrary';

// The photo order the original pages refer to by number (sitePhotos[0] and so
// on). Each entry now points at one optimised WebP from the photo library, so
// the two files that used to be imported twice are loaded once.
const order = [
  'badkamer-1', 'badkamer-2', 'badkamer-3', 'badkamer-5', 'badkamer-7',
  'binnenrenovatie-1', 'binnenrenovatie-2', 'binnenrenovatie-3',
  'wc-5', 'wc-6', 'wc-6', 'wc-reno-1',
  'badkamer-dennis-1', 'badkamer-dennis-2', 'badkamer-dennis-4', 'badkamer-5', 'badkamer-dennis-6', 'badkamer-dennis-3',
  'badkamer-dennis-7', 'badkamer-dennis-9', 'badkamer-dennis-10', 'badkamer-dennis-11', 'badkamer-dennis-13', 'badkamer-dennis-13',
  'badkamer-66', 'badkamer-77', 'badkamer-88', 'badkamer-99', 'badkamer-2', 'badkamer-89',
  'binnen-22', 'binnen-223', 'binnen-890', 'binnen-34', 'binnen-56', 'binnen-slaapkamer-1', 'binnen-slaapkamer-99', 'binnen-woonkamer-56', 'binnen',
  'wc-4', 'wc-534', 'wc-980', 'wc-72934', 'badkamer-denra-5', 'wc-000', 'badkamer-48', 'badkamer-790',
];

export const sitePhotos: string[] = order.map((key) => photoLibrary[key].src);
