import type { SupabaseClient } from '@supabase/supabase-js';
import { defaultCalculatorConfig, type CalculatorConfig } from '../lib/calculator';
import { calculatorFromRows, type CalculatorOptionRow, type CalculatorRoomRow, type CalculatorTierRow } from '../lib/calculatorRows';
import { storagePublicUrl } from '../lib/env';
import { defaultBusiness, defaultFaqs, defaultProjects, staticPhotos, type BusinessSettings, type Faq, type FaqPage, type PhotoKind, type ProjectCategory } from './defaults';
import { photoAlt } from './photoAlt';
import { photoLibrary } from './photoLibrary';
import type { Project, ProjectPhoto, ResponsiveImage, SiteContent, TextOverrides } from './types';

export interface MediaRow {
  id: string;
  storage_path: string | null;
  static_key: string | null;
  width: number;
  height: number;
  alt_nl: string;
  alt_en: string;
  size_bytes?: number | null;
  created_at?: string;
}

export function mediaImage(media: Pick<MediaRow, 'storage_path' | 'static_key' | 'width' | 'height'>): ResponsiveImage | null {
  if (media.static_key) return photoLibrary[media.static_key] ?? null;
  if (media.storage_path) return { src: storagePublicUrl(media.storage_path), width: media.width, height: media.height };
  return null;
}

export function defaultSiteContent(): SiteContent {
  const projects: Project[] = defaultProjects.map((project) => {
    const photos: ProjectPhoto[] = project.photos.flatMap((photo) => {
      const image = photoLibrary[photo.key];
      if (!image) return [];
      return [{
        id: photo.key,
        image,
        kind: photo.kind ?? 'result',
        captionNl: photo.captionNl ?? '',
        captionEn: photo.captionEn ?? '',
        altNl: photoAlt[photo.key]?.nl ?? project.titleNl,
        altEn: photoAlt[photo.key]?.en ?? project.titleEn,
      }];
    });
    return {
      id: project.slug,
      slug: project.slug,
      category: project.category,
      titleNl: project.titleNl,
      titleEn: project.titleEn,
      summaryNl: project.summaryNl,
      summaryEn: project.summaryEn,
      location: project.location,
      reviewRef: project.reviewRef ?? null,
      isFeatured: project.isFeatured,
      cover: photos.find((photo) => photo.id === project.coverKey) ?? photos[0] ?? null,
      photos,
    };
  });
  return { business: defaultBusiness, projects, faqs: defaultFaqs, texts: {}, calculator: defaultCalculatorConfig };
}

// Shapes of the database rows (see supabase/migrations/20261023120000_cms.sql).
export interface BusinessRow {
  company_name: string; legal_name: string; phone_display: string; phone_link: string; whatsapp_number: string; email: string;
  address_nl: string; address_en: string; hours_nl: string; hours_en: string; instagram_url: string; facebook_url: string; tiktok_url: string; service_areas: string[];
}

export const businessFromRow = (row: BusinessRow): BusinessSettings => ({
  companyName: row.company_name, legalName: row.legal_name, phoneDisplay: row.phone_display, phoneLink: row.phone_link,
  whatsappNumber: row.whatsapp_number, email: row.email, addressNl: row.address_nl, addressEn: row.address_en,
  hoursNl: row.hours_nl, hoursEn: row.hours_en, instagramUrl: row.instagram_url, facebookUrl: row.facebook_url,
  tiktokUrl: row.tiktok_url, serviceAreas: row.service_areas ?? [],
});

export const businessToRow = (business: BusinessSettings): BusinessRow => ({
  company_name: business.companyName, legal_name: business.legalName, phone_display: business.phoneDisplay, phone_link: business.phoneLink,
  whatsapp_number: business.whatsappNumber, email: business.email, address_nl: business.addressNl, address_en: business.addressEn,
  hours_nl: business.hoursNl, hours_en: business.hoursEn, instagram_url: business.instagramUrl, facebook_url: business.facebookUrl,
  tiktok_url: business.tiktokUrl, service_areas: business.serviceAreas,
});

export interface FaqRow { id: string; page: FaqPage; question_nl: string; answer_nl: string; question_en: string; answer_en: string; is_visible: boolean; sort_order: number }

export const faqFromRow = (row: FaqRow): Faq => ({
  id: row.id, page: row.page, questionNl: row.question_nl, answerNl: row.answer_nl, questionEn: row.question_en,
  answerEn: row.answer_en, isVisible: row.is_visible, sortOrder: row.sort_order,
});

export async function loadCalculatorConfig(client: SupabaseClient): Promise<CalculatorConfig | null> {
  const [rooms, tiers, options] = await Promise.all([
    client.from('calculator_rooms').select('*'),
    client.from('calculator_tiers').select('*'),
    client.from('calculator_options').select('*'),
  ]);
  if (rooms.error || tiers.error || options.error) throw rooms.error ?? tiers.error ?? options.error;
  if (!rooms.data.length) return null;
  return calculatorFromRows(rooms.data as CalculatorRoomRow[], tiers.data as CalculatorTierRow[], options.data as CalculatorOptionRow[]);
}

export interface ProjectPhotoRow { id: string; sort_order: number; kind: PhotoKind; caption_nl: string; caption_en: string; media: MediaRow | null }
export interface ProjectRow {
  id: string; slug: string; category: ProjectCategory; title_nl: string; title_en: string; summary_nl: string; summary_en: string;
  location: string | null; review_ref: string | null; status: 'published' | 'hidden' | 'archived'; is_featured: boolean; sort_order: number;
  cover_media_id: string | null; updated_at?: string; project_photos: ProjectPhotoRow[];
}

export const projectSelect = 'id, slug, category, title_nl, title_en, summary_nl, summary_en, location, review_ref, status, is_featured, sort_order, cover_media_id, updated_at, project_photos(id, sort_order, kind, caption_nl, caption_en, media(id, storage_path, static_key, width, height, alt_nl, alt_en))';

export function projectFromRow(row: ProjectRow): Project {
  const photos = [...(row.project_photos ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((photo): ProjectPhoto[] => {
      const image = photo.media && mediaImage(photo.media);
      if (!photo.media || !image) return [];
      return [{
        id: photo.media.id,
        image,
        kind: photo.kind,
        captionNl: photo.caption_nl,
        captionEn: photo.caption_en,
        altNl: photo.media.alt_nl || row.title_nl,
        altEn: photo.media.alt_en || row.title_en || row.title_nl,
      }];
    });
  return {
    id: row.id, slug: row.slug, category: row.category, titleNl: row.title_nl, titleEn: row.title_en, summaryNl: row.summary_nl,
    summaryEn: row.summary_en, location: row.location, reviewRef: row.review_ref, isFeatured: row.is_featured,
    cover: photos.find((photo) => photo.id === row.cover_media_id) ?? photos[0] ?? null,
    photos,
  };
}

/**
 * Loads everything the public website shows. Each part falls back to the
 * built-in default on its own, so one failing table never empties the site.
 * Queries filter on published/visible explicitly because a logged-in admin
 * may also see hidden rows.
 */
export async function loadSiteContent(client: SupabaseClient, fallback: SiteContent): Promise<SiteContent> {
  const [business, texts, faqs, projects, calculator] = await Promise.allSettled([
    client.from('business_settings').select('*').eq('id', 1).maybeSingle(),
    client.from('site_content').select('key, value_nl, value_en'),
    client.from('faqs').select('*').eq('is_visible', true).order('sort_order'),
    client.from('projects').select(projectSelect).eq('status', 'published').order('sort_order'),
    loadCalculatorConfig(client),
  ]);

  const value = <T,>(result: PromiseSettledResult<{ data: T | null; error: unknown }>, name: string): T | null => {
    if (result.status === 'rejected' || result.value.error) {
      console.error(`Could not load ${name}; showing the built-in version.`, result.status === 'rejected' ? result.reason : result.value.error);
      return null;
    }
    return result.value.data;
  };

  const businessRow = value(business, 'business details') as BusinessRow | null;
  const textRows = value(texts, 'website texts') as { key: string; value_nl: string; value_en: string }[] | null;
  const faqRows = value(faqs, 'FAQs') as FaqRow[] | null;
  const projectRows = value(projects, 'projects') as ProjectRow[] | null;
  if (calculator.status === 'rejected') console.error('Could not load calculator prices; using the built-in prices.', calculator.reason);

  const overrides: TextOverrides = {};
  for (const row of textRows ?? []) overrides[row.key] = { nl: row.value_nl, en: row.value_en };

  return {
    business: businessRow ? businessFromRow(businessRow) : fallback.business,
    texts: overrides,
    faqs: faqRows ? faqRows.map(faqFromRow) : fallback.faqs,
    projects: projectRows ? projectRows.map(projectFromRow).filter((project) => project.photos.length > 0) : fallback.projects,
    calculator: calculator.status === 'fulfilled' && calculator.value ? calculator.value : fallback.calculator,
  };
}

export const staticPhotoKeys = staticPhotos.map((photo) => photo.key);
