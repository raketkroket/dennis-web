import ReviewForm from '../components/ReviewForm';
import ReviewsSection from '../components/ReviewsSection';
import CTASection from '../components/CTASection';
import { Stars } from '../components/ReviewCard';
import { averageRating } from '../data/reviews';
import { useLanguage } from '../i18n/useLanguage';
import { fill, usePageTitle } from '../i18n/format';
import { usePublishedReviews } from '../hooks/usePublishedReviews';
import { formatNumber } from '../lib/calculator';

export default function Ervaringen() {
  const { language, t } = useLanguage();
  const reviews = usePublishedReviews(language);
  const rating = averageRating(reviews);
  const headline = t('reviewsPage.headline').split('|');
  usePageTitle(t('reviewsPage.experiences'), t('shared.reviewsDescription'));

  return (
    <>
      <section className="pb-12 pt-8 md:pb-16 md:pt-14" aria-labelledby="ervaringen-hero-heading">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('reviewsPage.experiences')}</p>
            <h1 id="ervaringen-hero-heading" className="display-xl mt-6">
              {headline.map((line, index) => <span key={line} className={`block ${index ? 'italic text-denra-bronze' : ''}`}>{line}</span>)}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            {rating !== null && (
              <div className="flex items-end gap-4 border-t border-denra-ink/70 pt-5">
                <p className="font-serif text-6xl leading-none">{formatNumber(rating, language, 1)}<span className="ml-1 text-2xl text-denra-muted">/ 5</span></p>
                <div className="pb-1">
                  <Stars rating={Math.round(rating)} size={16} />
                  <p className="mt-1 text-sm text-denra-muted">{fill(t('site.reviewsBasedOn'), { count: reviews.length })}</p>
                </div>
              </div>
            )}
            <p className="mt-6 font-serif text-xl leading-snug text-denra-ink/80">{t('reviewsPage.statement')}</p>
          </div>
        </div>
      </section>
      <ReviewsSection showIntro={false} />
      <ReviewForm />
      <CTASection title={t('reviewsPage.ctaTitle')} text={t('reviewsPage.ctaDescription')} />
    </>
  );
}
