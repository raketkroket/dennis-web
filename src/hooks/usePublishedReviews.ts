import { useEffect, useMemo, useState } from 'react';
import type { PublishedReview, Review } from '../data/reviews';
import { getReviews, mergePublishedReviews } from '../data/reviews';
import type { Language } from '../i18n/translations';

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

  useEffect(() => {
    let active = true;
    loadPublishedReviews().then((reviews) => {
      if (active) setPublishedReviews(reviews);
    });
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => mergePublishedReviews(getReviews('nl'), publishedReviews, language), [publishedReviews, language]);
}
