import { useEffect, useMemo, useState } from 'react';
import type { PublishedReview, Review } from '../data/reviews';
import { dutchReviewDate, getReviews, mergePublishedReviews } from '../data/reviews';
import type { Language } from '../i18n/translations';
import { useSiteContent } from '../content/SiteContentProvider';

/** site_content key with the ids of built-in reviews Dennis hid in the admin. */
export const hiddenReviewsKey = 'reviews.hidden';
export const parseHiddenReviews = (value: string | undefined) => (value ?? '').split(',').map((id) => id.trim()).filter(Boolean);

/** site_content key with review dates Dennis changed in the admin: "id:YYYY-MM-DD,…". */
export const reviewDatesKey = 'reviews.dates';
export function parseReviewDates(value: string | undefined): Record<string, string> {
  const pairs = (value ?? '').split(',').map((pair) => pair.trim().split(':'));
  return Object.fromEntries(pairs.filter(([id, date]) => id && /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') && !Number.isNaN(Date.parse(date))));
}
export const serializeReviewDates = (dates: Record<string, string>) => Object.entries(dates).map(([id, date]) => `${id}:${date}`).join(',');

type PublishedReviewsResponse = {
  reviews?: PublishedReview[];
};

// One request per page load, shared by every component that shows reviews.
let request: Promise<PublishedReview[]> | null = null;

function loadPublishedReviews(): Promise<PublishedReview[]> {
  request ??= fetch('/api/review?published=1')
    .then(async (response) => {
      if (!response.ok) throw new Error(`Published reviews returned ${response.status}.`);
      return ((await response.json()) as PublishedReviewsResponse).reviews ?? [];
    })
    .catch((error: unknown) => {
      console.error('Could not load published reviews; showing the reviews built into the site.', error);
      request = null;
      return [];
    });
  return request;
}

export function usePublishedReviews(language: Language): Review[] {
  const [publishedReviews, setPublishedReviews] = useState<PublishedReview[]>([]);
  const { texts } = useSiteContent();
  const hidden = texts[hiddenReviewsKey]?.nl;
  const changedDates = texts[reviewDatesKey]?.nl;

  useEffect(() => {
    let active = true;
    loadPublishedReviews().then((reviews) => {
      if (active) setPublishedReviews(reviews);
    });
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => {
    const hiddenIds = new Set(parseHiddenReviews(hidden));
    const dates = parseReviewDates(changedDates);
    const builtIn = getReviews('nl')
      .filter((review) => !hiddenIds.has(review.id))
      .map((review) => (dates[review.id] ? { ...review, date: dutchReviewDate(dates[review.id]) } : review));
    const published = publishedReviews.map((review) => (dates[review.id] ? { ...review, createdAt: `${dates[review.id]}T12:00:00Z` } : review));
    return mergePublishedReviews(builtIn, published, language);
  }, [publishedReviews, language, hidden, changedDates]);
}
