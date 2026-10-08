import { useEffect, useState } from 'react';
import type { PublishedReview, Review } from '../data/reviews';
import { getReviews, mergePublishedReviews } from '../data/reviews';
import type { Language } from '../i18n/translations';

type PublishedReviewsResponse = {
  reviews?: PublishedReview[];
};

export function usePublishedReviews(language: Language): Review[] {
  const [publishedReviews, setPublishedReviews] = useState<PublishedReview[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/review?published=1', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load published reviews.');
        return response.json() as Promise<PublishedReviewsResponse>;
      })
      .then((response) => setPublishedReviews(response.reviews ?? []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Could not load published reviews.', error);
      });

    return () => controller.abort();
  }, []);

  return mergePublishedReviews(getReviews('nl'), publishedReviews, language);
}
