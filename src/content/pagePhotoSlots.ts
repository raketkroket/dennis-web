// Fixed places on the pages where Dennis can choose a photo from his library
// (admin: Uitstraling → Foto's op de pagina's). The choice is stored in
// site_content as "photo.<slot>" = the media id; without a choice the
// built-in photo stays.

export interface PagePhotoSlot {
  id: string;
  label: string;
  page: string;
  path: string;
  /** Landscape or portrait shape, so Dennis can pick a photo that fits. */
  shape: 'liggend' | 'staand' | 'vierkant';
}

export const pagePhotoSlots: PagePhotoSlot[] = [
  { id: 'homeHero', label: 'Grote foto bovenaan', page: 'Homepage', path: '/', shape: 'liggend' },
  { id: 'homeServices', label: 'Foto bij de diensten', page: 'Homepage', path: '/', shape: 'staand' },
  { id: 'bathroomHero', label: 'Foto bovenaan', page: 'Badkamerrenovatie', path: '/badkamerrenovatie', shape: 'liggend' },
  { id: 'bathroomFeatures', label: 'Foto bij de werkzaamheden', page: 'Badkamerrenovatie', path: '/badkamerrenovatie', shape: 'vierkant' },
  { id: 'toiletHero', label: 'Foto bovenaan', page: 'WC-renovatie', path: '/wc-renovatie', shape: 'liggend' },
  { id: 'interiorHero', label: 'Foto bovenaan', page: 'Binnenrenovatie', path: '/binnenrenovatie', shape: 'liggend' },
  { id: 'calculatorHero', label: 'Foto bovenaan', page: 'Prijs berekenen', path: '/configurator', shape: 'liggend' },
  { id: 'aboutMain', label: 'Grote foto', page: 'Over ons', path: '/over-ons', shape: 'staand' },
  { id: 'aboutDetail', label: 'Kleine foto', page: 'Over ons', path: '/over-ons', shape: 'vierkant' },
  { id: 'localBathroom', label: 'Foto bovenaan', page: 'Badkamer renovatie Almere en Amsterdam', path: '/badkamer-renovatie-almere', shape: 'liggend' },
  { id: 'localToilet', label: 'Foto bovenaan', page: 'WC renovatie Almere en Amsterdam', path: '/wc-renovatie-almere', shape: 'liggend' },
];

export const pagePhotoKey = (slot: string) => `photo.${slot}`;
