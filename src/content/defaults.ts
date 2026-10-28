// Default website content. The site shows this when Supabase is not
// configured, and scripts/generate-cms-seed.ts turns it into the seed
// migration so the database starts with exactly the same content.
// Keep this file free of runtime imports (the seed script loads it in Node).

export type ProjectCategory = 'badkamer' | 'toilet' | 'interieur';
export const projectCategories: ProjectCategory[] = ['badkamer', 'toilet', 'interieur'];

export type PhotoKind = 'result' | 'during' | 'before' | 'after';
export type ProjectStatus = 'published' | 'hidden' | 'archived';

export interface StaticPhoto {
  key: string;
  /** File name in fotos/ (or path in public/ when it starts with "/"). */
  file: string;
  width: number;
  height: number;
}

// Every project photo that ships with the website, under a stable key.
// The two files that were imported twice in the old sitePhotos.ts
// (badkamer5.jpeg and "dennis badkamer 13.png") appear once. badkamer67.jpeg
// and wc8.png are byte-for-byte different but visually identical copies of
// badkamer2.png and wc6.jpeg, so they are not listed (the files stay in fotos/).
export const staticPhotos: StaticPhoto[] = [
  { key: 'badkamer-1', file: 'badkamer1.png', width: 1086, height: 1448 },
  { key: 'badkamer-2', file: 'badkamer2.png', width: 1086, height: 1448 },
  { key: 'badkamer-3', file: 'badkamer3.png', width: 1086, height: 1448 },
  { key: 'badkamer-5', file: 'badkamer5.jpeg', width: 1105, height: 1423 },
  { key: 'badkamer-7', file: 'badkamer7.jpeg', width: 1086, height: 1448 },
  { key: 'badkamer-48', file: 'badkamer 48.jpeg', width: 1122, height: 1402 },
  { key: 'badkamer-66', file: 'badkamer 66.jpeg', width: 1086, height: 1448 },
  { key: 'badkamer-77', file: 'badkamer 77.jpeg', width: 1086, height: 1448 },
  { key: 'badkamer-88', file: 'badkamer 88.jpeg', width: 1054, height: 1492 },
  { key: 'badkamer-89', file: 'badkamer89.jpeg', width: 1071, height: 1469 },
  { key: 'badkamer-99', file: 'badkamer 99.jpeg', width: 1086, height: 1449 },
  { key: 'badkamer-790', file: 'BADKAMER790.jpeg', width: 1200, height: 1600 },
  { key: 'badkamer-denra-5', file: 'badkamer denra 5.jpeg', width: 1086, height: 1448 },
  { key: 'badkamer-dennis-1', file: 'badkamer dennis 1.png', width: 1023, height: 1537 },
  { key: 'badkamer-dennis-2', file: 'badkamer dennis 2.png', width: 1536, height: 1024 },
  { key: 'badkamer-dennis-3', file: 'badkamer dennsi 3.png', width: 1024, height: 1536 },
  { key: 'badkamer-dennis-4', file: 'badkamer dennis 4.png', width: 1023, height: 1537 },
  { key: 'badkamer-dennis-6', file: 'badkamer dennis 6.png', width: 1023, height: 1537 },
  { key: 'badkamer-dennis-7', file: 'dennis badkamer 7.png', width: 1086, height: 1448 },
  { key: 'badkamer-dennis-9', file: 'dennis badkamer 9.png', width: 1086, height: 1448 },
  { key: 'badkamer-dennis-10', file: 'dennis badkamer 10.png', width: 1086, height: 1448 },
  { key: 'badkamer-dennis-11', file: 'dennis badkamer 11.png', width: 1104, height: 1424 },
  { key: 'badkamer-dennis-13', file: 'dennis badkamer 13.png', width: 1023, height: 1537 },
  { key: 'badkamer-amersfoort', file: '/badkamer-amersfoort.jpeg', width: 736, height: 1600 },
  { key: 'wc-4', file: 'wc 4.png', width: 1023, height: 1537 },
  { key: 'wc-5', file: 'wc5.jpeg', width: 1086, height: 1448 },
  { key: 'wc-6', file: 'wc6.jpeg', width: 1086, height: 1448 },
  { key: 'wc-000', file: 'wc000.jpeg', width: 1086, height: 1448 },
  { key: 'wc-534', file: 'wc534.png', width: 1023, height: 1537 },
  { key: 'wc-980', file: 'wc980.jpeg', width: 1023, height: 1537 },
  { key: 'wc-72934', file: 'wc72934.jpeg', width: 1086, height: 1448 },
  { key: 'wc-reno-1', file: 'wcreno1.png', width: 1024, height: 1536 },
  { key: 'binnen', file: 'binnen.jpeg', width: 1085, height: 1449 },
  { key: 'binnen-22', file: 'binnen 22.jpeg', width: 1086, height: 1448 },
  { key: 'binnen-34', file: 'binnen 34.jpeg', width: 1448, height: 1086 },
  { key: 'binnen-56', file: 'binnen 56.jpeg', width: 1086, height: 1448 },
  { key: 'binnen-223', file: 'binnen 223.jpeg', width: 1086, height: 1448 },
  { key: 'binnen-890', file: 'binnen890.jpeg', width: 1448, height: 1086 },
  { key: 'binnen-slaapkamer-1', file: 'binnen slaapkamer 1 .jpeg', width: 1086, height: 1448 },
  { key: 'binnen-slaapkamer-99', file: 'binnen slaapkamere 99.jpeg', width: 1448, height: 1086 },
  { key: 'binnen-woonkamer-56', file: 'binnen woonkamer 56.jpeg', width: 1086, height: 1448 },
  { key: 'binnenrenovatie-1', file: 'binnenrenovatie1.png', width: 1086, height: 1448 },
  { key: 'binnenrenovatie-2', file: 'binnenrenovatie2.png', width: 941, height: 1672 },
  { key: 'binnenrenovatie-3', file: 'binnenrenovatie3.png', width: 1086, height: 1448 },
  { key: 'partoredjo-1', file: 'Partoredjo1.jpg', width: 768, height: 1024 },
  { key: 'partoredjo-2', file: 'Partoredjo2.jpg', width: 768, height: 1024 },
  { key: 'partoredjo-3', file: 'Partoredjo3.jpg', width: 768, height: 1024 },
  { key: 'partoredjo-4', file: 'Partoredjo4.jpg', width: 1200, height: 1600 },
  { key: 'partoredjo-5', file: 'Partoredjo5.jpg', width: 768, height: 1024 },
  { key: 'partoredjo-6', file: 'Partoredjo6.jpg', width: 768, height: 1024 },
  { key: 'natalie-diemen-1', file: 'natalie diemen 1.jpg', width: 768, height: 768 },
  { key: 'natalie-diemen-2', file: 'nataliediemen2.jpg', width: 1536, height: 2048 },
  { key: 'nikie-badkamer', file: '/nikie-badkamer.jpg', width: 384, height: 512 },
  { key: 'nikie-detail', file: '/nikie-detail.jpg', width: 384, height: 512 },
];

export interface DefaultProjectPhoto {
  key: string;
  kind?: PhotoKind;
  captionNl?: string;
  captionEn?: string;
}

export interface DefaultProject {
  slug: string;
  category: ProjectCategory;
  titleNl: string;
  titleEn: string;
  summaryNl: string;
  summaryEn: string;
  location: string | null;
  /** Id of the matching review in src/data/reviews.ts, when the customer wrote one. */
  reviewRef?: string;
  isFeatured: boolean;
  coverKey: string;
  photos: DefaultProjectPhoto[];
}

const single = (key: string): Pick<DefaultProject, 'coverKey' | 'photos'> => ({ coverKey: key, photos: [{ key }] });

// The projects from the old Projecten.tsx with their original photo and
// location, plus three projects built from genuine reviews that came with
// photos. Old project 53 showed the same photo as project 2 in the same
// location and is merged into it. "Beelthoven" is kept as it was entered;
// it may be a misspelling of Bilthoven (see README).
export const defaultProjects: DefaultProject[] = [
  { slug: 'badkamer-almere-poort-6', category: 'badkamer', titleNl: 'Badkamer Almere Poort', titleEn: 'Bathroom, Almere Poort', summaryNl: 'Premium badkamer met een rustige, luxe materialenmix.', summaryEn: 'A premium bathroom with a calm, luxurious mix of materials.', location: 'Almere Poort', isFeatured: true, ...single('badkamer-dennis-1') },
  { slug: 'badkamer-almere-26', category: 'badkamer', titleNl: 'Badkamer Almere', titleEn: 'Bathroom, Almere', summaryNl: 'Een tijdloze badkamer met marmerlook, gouden kraan en sfeervolle nisverlichting.', summaryEn: 'A timeless bathroom with a marble look, a gold-tone tap and atmospheric niche lighting.', location: 'Almere', isFeatured: true, ...single('badkamer-77') },
  { slug: 'toilet-almere-stad-42', category: 'toilet', titleNl: 'Toilet Almere Stad', titleEn: 'Toilet, Almere Stad', summaryNl: 'Een moderne WC met marmerlook, wit sanitair en warme accessoires.', summaryEn: 'A contemporary toilet with a marble look, white sanitary ware and warm accessories.', location: 'Almere Stad', isFeatured: true, ...single('wc-980') },
  { slug: 'binnenrenovatie-amsterdam-centrum-24', category: 'interieur', titleNl: 'Binnenrenovatie Amsterdam Centrum', titleEn: 'Interior renovation, Amsterdam Centrum', summaryNl: 'Lichte ruimtes, natuurlijke materialen en een warme sfeer.', summaryEn: 'Light rooms, natural materials and a warm atmosphere.', location: 'Amsterdam Centrum', isFeatured: true, ...single('binnenrenovatie-2') },
  { slug: 'badkamer-almere-overgooi-2', category: 'badkamer', titleNl: 'Badkamer Almere Overgooi', titleEn: 'Bathroom, Almere Overgooi', summaryNl: 'Houten detail, ronde vormen en een zachte neutraliteit.', summaryEn: 'Wooden details, rounded forms and a soft neutral palette.', location: 'Almere Overgooi', isFeatured: true, ...single('badkamer-2') },
  { slug: 'toilet-amsterdam-centrum-18', category: 'toilet', titleNl: 'Toilet Amsterdam Centrum', titleEn: 'Toilet, Amsterdam Centrum', summaryNl: 'Een sfeervolle WC met warme natuursteenlook en zachte verlichting.', summaryEn: 'An atmospheric toilet with a warm natural-stone look and soft lighting.', location: 'Amsterdam Centrum', isFeatured: true, ...single('wc-5') },
  {
    slug: 'volledige-badkamerrenovatie',
    category: 'badkamer',
    titleNl: 'Volledige badkamerrenovatie',
    titleEn: 'Complete bathroom renovation',
    summaryNl: 'Een volledige badkamer: gepland in drie weken, opgeleverd binnen twee weken. Met een foto van tijdens de verbouwing.',
    summaryEn: 'A complete bathroom: planned for three weeks, finished within two. Including a photo taken during the work.',
    location: null,
    reviewRef: 'partoredjo-2019',
    isFeatured: false,
    coverKey: 'partoredjo-3',
    photos: [
      { key: 'partoredjo-3' },
      { key: 'partoredjo-1' },
      { key: 'partoredjo-2' },
      { key: 'partoredjo-6' },
      { key: 'partoredjo-5' },
      { key: 'partoredjo-4', kind: 'during', captionNl: 'Tijdens de verbouwing', captionEn: 'During the renovation' },
    ],
  },
  {
    slug: 'badkamer-diemen',
    category: 'badkamer',
    titleNl: 'Complete badkamer Diemen',
    titleEn: 'Complete bathroom, Diemen',
    summaryNl: 'Complete renovatie van een badkamer van 6 m², van slopen tot afmonteren in 8 werkdagen.',
    summaryEn: 'Complete renovation of a 6 m² bathroom, from demolition to final fitting in 8 working days.',
    location: 'Diemen',
    reviewRef: 'natalie-2019',
    isFeatured: false,
    coverKey: 'natalie-diemen-2',
    photos: [{ key: 'natalie-diemen-2' }, { key: 'natalie-diemen-1' }],
  },
  {
    slug: 'badkamer-tegelwerk-in-verstek',
    category: 'badkamer',
    titleNl: 'Badkamer met tegelwerk in verstek',
    titleEn: 'Bathroom with mitred tiling',
    summaryNl: 'Loodgieterswerk, elektra en tegelwerk door één vakman, met hoeken in verstek en een betegeld stopcontact.',
    summaryEn: 'Plumbing, electrics and tiling by one craftsman, with mitred corners and a tiled-in socket.',
    location: null,
    reviewRef: 'nikie-volkers-2026',
    isFeatured: false,
    coverKey: 'nikie-badkamer',
    photos: [{ key: 'nikie-badkamer' }, { key: 'nikie-detail', captionNl: 'Betegeld stopcontact', captionEn: 'Tiled-in socket' }],
  },
  { slug: 'badkamer-amersfoort-54', category: 'badkamer', titleNl: 'Modern minimalistische badkamer', titleEn: 'Modern minimalist bathroom', summaryNl: 'Modern en tijdloos, met warme tinten en verfijnde details.', summaryEn: 'Modern and timeless, with warm tones and refined details.', location: 'Amersfoort', isFeatured: false, ...single('badkamer-amersfoort') },
  { slug: 'badkamer-beelthoven-1', category: 'badkamer', titleNl: 'Luxe badkamer', titleEn: 'Luxury bathroom', summaryNl: 'Complete renovatie met luxe materialen en een rustige uitstraling.', summaryEn: 'A complete renovation with luxurious materials and a calm look.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-1') },
  { slug: 'badkamer-beelthoven-28', category: 'badkamer', titleNl: 'Badkamer Beelthoven', titleEn: 'Bathroom, Beelthoven', summaryNl: 'Zachte tinten en hoogwaardige afwerking voor dagelijks comfort.', summaryEn: 'Soft tones and a high-quality finish for everyday comfort.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-99') },
  { slug: 'badkamer-beelthoven-44', category: 'badkamer', titleNl: 'Badkamer Beelthoven', titleEn: 'Bathroom, Beelthoven', summaryNl: 'Warme materialen, zachte verlichting en een verfijnde afwerking.', summaryEn: 'Warm materials, soft lighting and a refined finish.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-dennis-10') },
  { slug: 'badkamer-beelthoven-45', category: 'badkamer', titleNl: 'Badkamer Beelthoven', titleEn: 'Bathroom, Beelthoven', summaryNl: 'Een rustige badkamer met natuurlijke tinten en luxe details.', summaryEn: 'A calm bathroom with natural tones and luxurious details.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-dennis-11') },
  { slug: 'badkamer-beelthoven-46', category: 'badkamer', titleNl: 'Badkamer Beelthoven', titleEn: 'Bathroom, Beelthoven', summaryNl: 'Een moderne badkamer met donkere tegels en warme accenten.', summaryEn: 'A contemporary bathroom with dark tiles and warm accents.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-88') },
  { slug: 'badkamer-beelthoven-52', category: 'badkamer', titleNl: 'Badkamer Beelthoven', titleEn: 'Bathroom, Beelthoven', summaryNl: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking.', summaryEn: 'A stylish bathroom with high-quality materials and a calm finish.', location: 'Beelthoven', isFeatured: false, ...single('badkamer-5') },
  { slug: 'badkamer-almere-overgooi-3', category: 'badkamer', titleNl: 'Badkamer Almere Overgooi', titleEn: 'Bathroom, Almere Overgooi', summaryNl: 'Warm, licht en tijdloos met hoogwaardige afwerking.', summaryEn: 'Warm, light and timeless, with a high-quality finish.', location: 'Almere Overgooi', isFeatured: false, ...single('badkamer-3') },
  { slug: 'badkamer-almere-overgooi-5', category: 'badkamer', titleNl: 'Boutique badkamer', titleEn: 'Boutique bathroom', summaryNl: 'Rustige materialen en een moderne, praktische indeling.', summaryEn: 'Calm materials and a modern, practical layout.', location: 'Almere Overgooi', isFeatured: false, ...single('badkamer-89') },
  { slug: 'badkamer-almere-poort-8', category: 'badkamer', titleNl: 'Badkamer Almere Poort', titleEn: 'Bathroom, Almere Poort', summaryNl: 'Natuurlijke afwerkingen en een moderne ruimtelijke indeling.', summaryEn: 'Natural finishes and a modern spatial layout.', location: 'Almere Poort', isFeatured: false, ...single('badkamer-dennis-4') },
  { slug: 'badkamer-almere-poort-11', category: 'badkamer', titleNl: 'Badkamer Almere Poort', titleEn: 'Bathroom, Almere Poort', summaryNl: 'Minimalistisch en strak met warme materialen.', summaryEn: 'Minimalist and clean-lined, with warm materials.', location: 'Almere Poort', isFeatured: false, ...single('badkamer-dennis-3') },
  { slug: 'badkamer-almere-poort-7', category: 'badkamer', titleNl: 'Badkamer Almere Poort', titleEn: 'Bathroom, Almere Poort', summaryNl: 'Houten accenten en een tijdloze, warme uitstraling.', summaryEn: 'Wooden accents and a timeless, warm look.', location: 'Almere Poort', isFeatured: false, ...single('badkamer-dennis-2') },
  { slug: 'badkamer-almere-buiten-10', category: 'badkamer', titleNl: 'Badkamer Almere Buiten', titleEn: 'Bathroom, Almere Buiten', summaryNl: 'Premium materiaalgebruik en zachte neutraliteit.', summaryEn: 'Premium materials and a soft neutral palette.', location: 'Almere Buiten', isFeatured: false, ...single('badkamer-dennis-6') },
  { slug: 'badkamer-amsterdam-noord-12', category: 'badkamer', titleNl: 'Badkamer Amsterdam Noord', titleEn: 'Bathroom, Amsterdam Noord', summaryNl: 'Luxe badkamer met subtiele natuurlijke details.', summaryEn: 'A luxurious bathroom with subtle natural details.', location: 'Amsterdam Noord', isFeatured: false, ...single('badkamer-dennis-7') },
  { slug: 'badkamer-amsterdam-noord-16', category: 'badkamer', titleNl: 'Badkamer Amsterdam Noord', titleEn: 'Bathroom, Amsterdam Noord', summaryNl: 'Premium badkamer met een warme natuurlijke sfeer.', summaryEn: 'A premium bathroom with a warm, natural atmosphere.', location: 'Amsterdam Noord', isFeatured: false, ...single('badkamer-dennis-13') },
  { slug: 'badkamer-amsterdam-noord-25', category: 'badkamer', titleNl: 'Badkamer Amsterdam Noord', titleEn: 'Bathroom, Amsterdam Noord', summaryNl: 'Warme materialen, zacht licht en een rustige afwerking.', summaryEn: 'Warm materials, soft light and a calm finish.', location: 'Amsterdam Noord', isFeatured: false, ...single('badkamer-66') },
  { slug: 'badkamer-zoetermeer-13', category: 'badkamer', titleNl: 'Badkamer Zoetermeer', titleEn: 'Bathroom, Zoetermeer', summaryNl: 'Zachte texturen en verfijnde, functionele badkamerarchitectuur.', summaryEn: 'Soft textures and refined, functional bathroom architecture.', location: 'Zoetermeer', isFeatured: false, ...single('badkamer-dennis-9') },
  { slug: 'badkamer-amsterdam-west-48', category: 'badkamer', titleNl: 'Badkamer Amsterdam West', titleEn: 'Bathroom, Amsterdam West', summaryNl: 'Een stijlvolle badkamer met rustige materialen en een verfijnde afwerking.', summaryEn: 'A stylish bathroom with calm materials and a refined finish.', location: 'Amsterdam West', isFeatured: false, ...single('badkamer-denra-5') },
  { slug: 'badkamer-amsterdam-centrum-30', category: 'badkamer', titleNl: 'Badkamer Amsterdam Centrum', titleEn: 'Bathroom, Amsterdam Centrum', summaryNl: 'Zachte materialen en een rustige premium uitstraling.', summaryEn: 'Soft materials and a calm, premium look.', location: 'Amsterdam Centrum', isFeatured: false, ...single('badkamer-7') },
  { slug: 'badkamer-amsterdam-50', category: 'badkamer', titleNl: 'Badkamer Amsterdam', titleEn: 'Bathroom, Amsterdam', summaryNl: 'Zachte materialen en een rustige premium uitstraling.', summaryEn: 'Soft materials and a calm, premium look.', location: 'Amsterdam', isFeatured: false, ...single('badkamer-48') },
  { slug: 'badkamer-almere-51', category: 'badkamer', titleNl: 'Badkamer Almere', titleEn: 'Bathroom, Almere', summaryNl: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking.', summaryEn: 'A stylish bathroom with high-quality materials and a calm finish.', location: 'Almere', isFeatured: false, ...single('badkamer-790') },
  { slug: 'toilet-almere-poort-19', category: 'toilet', titleNl: 'Toilet Almere Poort', titleEn: 'Toilet, Almere Poort', summaryNl: 'Een compacte WC met luxe materialen en een rustige uitstraling.', summaryEn: 'A compact toilet with luxurious materials and a calm look.', location: 'Almere Poort', isFeatured: false, ...single('wc-6') },
  { slug: 'toilet-amsterdam-zuid-21', category: 'toilet', titleNl: 'Toilet Amsterdam Zuid', titleEn: 'Toilet, Amsterdam Zuid', summaryNl: 'Een minimalistische WC met verfijnde details en warme tinten.', summaryEn: 'A minimalist toilet with refined details and warm tones.', location: 'Amsterdam Zuid', isFeatured: false, ...single('wc-reno-1') },
  { slug: 'toilet-zoetermeer-40', category: 'toilet', titleNl: 'Toilet Zoetermeer', titleEn: 'Toilet, Zoetermeer', summaryNl: 'Een warme WC met houten wand, nisverlichting en decoratieve details.', summaryEn: 'A warm toilet with a wooden wall, niche lighting and decorative details.', location: 'Zoetermeer', isFeatured: false, ...single('wc-4') },
  { slug: 'toilet-almere-buiten-41', category: 'toilet', titleNl: 'Toilet Almere Buiten', titleEn: 'Toilet, Almere Buiten', summaryNl: 'Een stijlvolle WC met zachte tegels, nis en moderne afwerking.', summaryEn: 'A stylish toilet with soft tiles, a niche and a modern finish.', location: 'Almere Buiten', isFeatured: false, ...single('wc-534') },
  { slug: 'toilet-amsterdam-centrum-43', category: 'toilet', titleNl: 'Toilet Amsterdam Centrum', titleEn: 'Toilet, Amsterdam Centrum', summaryNl: 'Een rustige WC met houtlook, ingebouwde planken en een zwevend toilet.', summaryEn: 'A calm toilet with a wood look, built-in shelves and a wall-hung toilet.', location: 'Amsterdam Centrum', isFeatured: false, ...single('wc-72934') },
  { slug: 'toilet-amsterdam-west-49', category: 'toilet', titleNl: 'Toilet Amsterdam West', titleEn: 'Toilet, Amsterdam West', summaryNl: 'Een moderne WC met een rustige uitstraling en nette afwerking.', summaryEn: 'A modern toilet with a calm look and a neat finish.', location: 'Amsterdam West', isFeatured: false, ...single('wc-000') },
  { slug: 'binnenrenovatie-amsterdam-oost-22', category: 'interieur', titleNl: 'Binnenrenovatie Amsterdam Oost', titleEn: 'Interior renovation, Amsterdam Oost', summaryNl: 'Stucwerk, vloeren en een heldere, natuurlijke finish.', summaryEn: 'Plastering, floors and a bright, natural finish.', location: 'Amsterdam Oost', isFeatured: false, ...single('binnenrenovatie-1') },
  { slug: 'slaapkamer-amsterdam-oost-23', category: 'interieur', titleNl: 'Slaapkamer renovatie', titleEn: 'Bedroom renovation', summaryNl: 'Helder, luxe en functioneel met een premium interieurgevoel.', summaryEn: 'Bright, luxurious and functional, with a premium interior feel.', location: 'Amsterdam Oost', isFeatured: false, ...single('binnenrenovatie-3') },
  { slug: 'woonkamer-amsterdam-centrum-37', category: 'interieur', titleNl: 'Woonkamer renovatie', titleEn: 'Living-room renovation', summaryNl: 'Een lichte leefruimte met natuurlijke materialen.', summaryEn: 'A bright living space with natural materials.', location: 'Amsterdam Centrum', isFeatured: false, ...single('binnen-woonkamer-56') },
  { slug: 'binnenrenovatie-amsterdam-centrum-34', category: 'interieur', titleNl: 'Binnenrenovatie Amsterdam Centrum', titleEn: 'Interior renovation, Amsterdam Centrum', summaryNl: 'Zorgvuldig gelegd vloerwerk voor een warme basis.', summaryEn: 'Carefully laid flooring for a warm base.', location: 'Amsterdam Centrum', isFeatured: false, ...single('binnen-56') },
  { slug: 'binnenrenovatie-amsterdam-centrum-31', category: 'interieur', titleNl: 'Binnenrenovatie Amsterdam Centrum', titleEn: 'Interior renovation, Amsterdam Centrum', summaryNl: 'Strakke wanden, natuurlijke vloeren en een lichte woonbasis.', summaryEn: 'Smooth walls, natural floors and a light base for living.', location: 'Amsterdam Centrum', isFeatured: false, ...single('binnen-22') },
  { slug: 'binnenrenovatie-almere-stad-32', category: 'interieur', titleNl: 'Binnenrenovatie Almere Stad', titleEn: 'Interior renovation, Almere Stad', summaryNl: 'Een frisse interieurafwerking met aandacht voor proportie.', summaryEn: 'A fresh interior finish with attention to proportion.', location: 'Almere Stad', isFeatured: false, ...single('binnen-223') },
  { slug: 'binnenrenovatie-almere-poort-47', category: 'interieur', titleNl: 'Binnenrenovatie Almere Poort', titleEn: 'Interior renovation, Almere Poort', summaryNl: 'Een lichte binnenrenovatie met een rustige, moderne afwerking.', summaryEn: 'A light interior renovation with a calm, modern finish.', location: 'Almere Poort', isFeatured: false, ...single('binnen-890') },
  { slug: 'binnenrenovatie-almere-stad-33', category: 'interieur', titleNl: 'Binnenrenovatie Almere Stad', titleEn: 'Interior renovation, Almere Stad', summaryNl: 'Licht, ruimte en een rustige afwerking van vloer tot plafond.', summaryEn: 'Light, space and a calm finish from floor to ceiling.', location: 'Almere Stad', isFeatured: false, ...single('binnen-34') },
  { slug: 'slaapkamer-almere-poort-35', category: 'interieur', titleNl: 'Slaapkamer renovatie', titleEn: 'Bedroom renovation', summaryNl: 'Een serene slaapkamer met een hoogwaardige afwerking.', summaryEn: 'A serene bedroom with a high-quality finish.', location: 'Almere Poort', isFeatured: false, ...single('binnen') },
  { slug: 'slaapkamer-almere-poort-36', category: 'interieur', titleNl: 'Slaapkamer renovatie', titleEn: 'Bedroom renovation', summaryNl: 'Rustige kleuren en maatwerkdetails voor meer comfort.', summaryEn: 'Calm colours and bespoke details for more comfort.', location: 'Almere Poort', isFeatured: false, ...single('binnen-slaapkamer-99') },
  { slug: 'binnenrenovatie-amsterdam-oostzaan-38', category: 'interieur', titleNl: 'Binnenrenovatie Amsterdam Oostzaan', titleEn: 'Interior renovation, Amsterdam Oostzaan', summaryNl: 'Een compleet vernieuwd interieur met tijdloze uitstraling.', summaryEn: 'A completely renewed interior with a timeless look.', location: 'Amsterdam Oostzaan', isFeatured: false, ...single('binnen-slaapkamer-1') },
];

export interface BusinessSettings {
  companyName: string;
  legalName: string;
  phoneDisplay: string;
  /** Phone number for tel: links, e.g. +31614966756. */
  phoneLink: string;
  /** WhatsApp number in international format without +, e.g. 31614966756. */
  whatsappNumber: string;
  email: string;
  addressNl: string;
  addressEn: string;
  hoursNl: string;
  hoursEn: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  serviceAreas: string[];
}

export const defaultBusiness: BusinessSettings = {
  companyName: 'Denra Badkamers',
  legalName: 'Denra Montage en Onderhoud',
  phoneDisplay: '+31 6 14 96 67 56',
  phoneLink: '+31614966756',
  whatsappNumber: '31614966756',
  email: 'info@denrabadkamers.nl',
  addressNl: 'Almere, Noord-Holland, Nederland',
  addressEn: 'Almere, North Holland, the Netherlands',
  hoursNl: 'Ma-Za: 08:00-18:00',
  hoursEn: 'Mon-Sat: 08:00-18:00',
  instagramUrl: 'https://www.instagram.com/denrabadkamers',
  facebookUrl: 'https://facebook.com/denrabadkamers',
  tiktokUrl: 'https://www.tiktok.com/@denrabadkamers.nl',
  serviceAreas: ['Almere', 'Amsterdam', 'Amstelveen', 'Lelystad', "'t Gooi", 'Haarlem', 'Blaricum', 'Hilversum', 'Laren', 'Weesp', 'Muiden', 'Eemnes', 'Diemen', 'Muiderberg', 'Naarden', 'Amersfoort'],
};

export type FaqPage = 'algemeen' | 'badkamer' | 'wc' | 'binnen';
export const faqPages: { id: FaqPage; label: string }[] = [
  { id: 'algemeen', label: 'Algemeen (ook op de homepage, de calculator en contact)' },
  { id: 'badkamer', label: 'Badkamerrenovatie' },
  { id: 'wc', label: 'WC-renovatie' },
  { id: 'binnen', label: 'Binnenrenovatie' },
];

export interface Faq {
  id: string;
  page: FaqPage;
  questionNl: string;
  answerNl: string;
  questionEn: string;
  answerEn: string;
  isVisible: boolean;
  sortOrder: number;
}

// Written from answers that already appeared on the local service pages and
// in the calculator disclaimer; no new promises.
export const defaultFaqs: Faq[] = [
  { id: 'faq-algemeen-regio', page: 'algemeen', questionNl: 'In welke regio werken jullie?', answerNl: 'Wij werken in Flevoland en Noord-Holland, onder andere in Almere, Amsterdam, Amstelveen, Lelystad, Haarlem, het Gooi en Amersfoort.', questionEn: 'Which region do you work in?', answerEn: 'We work in Flevoland and North Holland, including Almere, Amsterdam, Amstelveen, Lelystad, Haarlem, the Gooi area and Amersfoort.', isVisible: true, sortOrder: 10 },
  { id: 'faq-algemeen-calculator', page: 'algemeen', questionNl: 'Is de prijs uit de calculator definitief?', answerNl: 'Nee. De calculator geeft een vrijblijvende vanafprijs voor arbeid en normale bouwmaterialen. De definitieve prijs wordt vastgesteld na een opname op locatie.', questionEn: 'Is the price from the calculator final?', answerEn: 'No. The calculator gives a non-binding starting price for labour and standard construction materials. The final price is determined after an on-site assessment.', isVisible: true, sortOrder: 20 },
  { id: 'faq-algemeen-reactie', page: 'algemeen', questionNl: 'Hoe snel hoor ik iets na mijn aanvraag?', answerNl: 'Wij nemen binnen 24 uur contact met u op.', questionEn: 'How soon will I hear back after my request?', answerEn: 'We will contact you within 24 hours.', isVisible: true, sortOrder: 30 },
  { id: 'faq-badkamer-kosten', page: 'badkamer', questionNl: 'Wat kost een badkamerrenovatie?', answerNl: 'De prijs hangt af van de omvang, het sanitair, de afwerking en het benodigde werk zoals leidingwerk of verlaagde plafonds. Wij geven vooraf een duidelijke offerte op maat.', questionEn: 'How much does a bathroom renovation cost?', answerEn: 'The price depends on the scale, sanitary ware, finishing and required work such as plumbing or lowered ceilings. We provide a clear, tailored quote in advance.', isVisible: true, sortOrder: 10 },
  { id: 'faq-badkamer-duur', page: 'badkamer', questionNl: 'Hoe lang duurt een badkamerrenovatie?', answerNl: 'Voor een complete badkamerrenovatie is vaak een projectduur van enkele weken nodig, afhankelijk van de omvang, materiaalselectie en eventuele technische aanpassingen.', questionEn: 'How long does a bathroom renovation take?', answerEn: 'A complete bathroom renovation often takes several weeks, depending on the scope, material selection and any technical alterations.', isVisible: true, sortOrder: 20 },
  { id: 'faq-badkamer-compleet', page: 'badkamer', questionNl: 'Krijg ik een complete badkamer van A tot Z?', answerNl: 'Ja. Wij verzorgen het volledige traject: sloopwerk, leidingwerk, tegelwerk, sanitair, afwerking en styling, zodat u één aanspreekpunt heeft.', questionEn: 'Will I receive a complete bathroom from start to finish?', answerEn: 'Yes. We manage the complete process: demolition, plumbing, tiling, sanitary ware, finishing and styling, so you have one point of contact.', isVisible: true, sortOrder: 30 },
  { id: 'faq-wc-kosten', page: 'wc', questionNl: 'Wat kost een WC-renovatie?', answerNl: 'De kosten verschillen per keuze aan tegelwerk, sanitair, leidingwerk en afwerking. Wij geven u graag een concrete indicatie op basis van uw ruimte en wensen.', questionEn: 'How much does a toilet renovation cost?', answerEn: 'Costs vary according to your choices of tiling, sanitary ware, plumbing and finishing. We are happy to provide a specific estimate based on your room and requirements.', isVisible: true, sortOrder: 10 },
  { id: 'faq-wc-klein', page: 'wc', questionNl: 'Kan ik een kleine WC laten renoveren?', answerNl: 'Ja. Veel kleine toiletten kunnen prachtig worden opgewaardeerd met slimme materialen, een compacte indeling en een luxe uitstraling zonder grote verbouwing.', questionEn: 'Can I renovate a small toilet?', answerEn: 'Yes. Many small toilets can be transformed beautifully with smart materials, a compact layout and a refined look, without major construction work.', isVisible: true, sortOrder: 20 },
  { id: 'faq-wc-verbouwen', page: 'wc', questionNl: 'Doen jullie ook complete toiletverbouwingen?', answerNl: 'Ja, wij verzorgen ook complete toiletverbouwingen en WC-renovaties, inclusief leidingwerk, afwerking en het plaatsen van sanitair.', questionEn: 'Do you also carry out complete toilet refurbishments?', answerEn: 'Yes, we also manage complete toilet refurbishments and renovations, including plumbing, finishing and sanitary-ware installation.', isVisible: true, sortOrder: 30 },
];
