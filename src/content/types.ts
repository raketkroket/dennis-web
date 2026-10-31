import type { CalculatorConfig } from '../lib/calculator';
import type { BusinessSettings, Faq, PhotoKind, ProjectCategory } from './defaults';

export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
}

export interface ProjectPhoto {
  id: string;
  image: ResponsiveImage;
  kind: PhotoKind;
  captionNl: string;
  captionEn: string;
  altNl: string;
  altEn: string;
}

export interface Project {
  id: string;
  slug: string;
  category: ProjectCategory;
  titleNl: string;
  titleEn: string;
  summaryNl: string;
  summaryEn: string;
  location: string | null;
  reviewRef: string | null;
  isFeatured: boolean;
  cover: ProjectPhoto | null;
  photos: ProjectPhoto[];
}

export type TextOverrides = Record<string, { nl: string; en: string }>;

/** A photo Dennis chose for a fixed place on a page (Uitstraling → Foto's). */
export interface PagePhoto {
  image: ResponsiveImage;
  altNl: string;
  altEn: string;
}

export interface SiteContent {
  business: BusinessSettings;
  projects: Project[];
  faqs: Faq[];
  texts: TextOverrides;
  calculator: CalculatorConfig;
  /** Chosen photos by slot (see src/content/pagePhotos.ts). */
  pagePhotos: Record<string, PagePhoto>;
}
