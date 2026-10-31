import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleHelp, MapPin, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RelatedProjects from '../components/RelatedProjects';
import ReviewCard from '../components/ReviewCard';
import ServiceArea from '../components/ServiceArea';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';
import { pagePhotoAlt, usePagePhoto } from '../content/pagePhotos';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';
import { usePublishedReviews } from '../hooks/usePublishedReviews';

type LocalServicePageProps = {
  city: string;
  serviceType: 'badkamer' | 'wc';
  /** Translation group with this page's title, intro, bullets and FAQ. */
  textKey: string;
};

export default function LocalServicePage({
  city,
  serviceType,
  textKey,
}: LocalServicePageProps) {
  const { t, language } = useLanguage();
  const title = t(`${textKey}.title`);
  const intro = t(`${textKey}.intro`);
  const bullets = t(`${textKey}.bullets`).split('|').filter(Boolean);
  const answers = t(`${textKey}.faqAnswers`).split('|');
  const faq = t(`${textKey}.faqQuestions`).split('|').filter(Boolean).map((question, index) => ({ question, answer: answers[index] ?? '' }));
  const isBathroom = serviceType === 'badkamer';
  const heroPhoto = usePagePhoto(isBathroom ? 'localBathroom' : 'localToilet');
  // Reviews from customers in this city, best rated first.
  const localReviews = usePublishedReviews(language)
    .filter((review) => review.city === city)
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 3);
  const guideLinks = isBathroom
    ? [{ to: '/badkamerrenovatie', label: t('site.bathroomGuide') }, { to: '/badkamer-renovatie-kosten', label: t('site.costGuide') }]
    : [{ to: '/wc-renovatie', label: t('site.toiletGuide') }];
  const service = t(isBathroom ? 'localServicePage.bathroomService' : 'localServicePage.toiletService');
  const scope = t(isBathroom ? 'localServicePage.bathroomScope' : 'localServicePage.toiletScope');
  const replace = (value: string) => value.replace('{city}', city).replace('{service}', service).replace('{scope}', scope);
  const cardTitles = t('localServicePage.cardTitles').split('|').map(replace);
  const cardDescriptions = t('localServicePage.cardDescriptions').split('|').map(replace);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="relative pt-40 pb-20 bg-c-f7f1ea" aria-label={`${title} ${t('localServicePage.hero')}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="denra-line" />
                  <span className="denra-label bg-c-efe4d8 text-c-4d3d33">{t('localServicePage.brand')}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-c-231a12 leading-[0.95] mb-6">
                  {title}
                </h1>
                <p className="text-lg text-c-5f544a leading-relaxed mb-8 max-w-xl">
                  {intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-c-231a12 text-c-f6f0e8 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-3a2d23 transition-all duration-200 text-sm"
                  >
                    {t('localServicePage.quote')}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-c-7a6552/20 text-c-231a12 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-231a12 hover:text-white transition-all duration-200 text-sm"
                  >
                    {t('localServicePage.consultation')}
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-sm text-c-4a3f35 font-medium">
                  <MapPin size={16} className="text-c-7a6552" />
                  {t('localServicePage.serviceArea')} {city} {t('localServicePage.surroundings')}
                </div>
              </div>

              <div className="rounded-[32px] overflow-hidden border border-c-d7c3a9 shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-c-efe4d5">
                <img
                  src={heroPhoto?.image.src ?? (isBathroom ? sitePhotos[0] : sitePhotos[8])}
                  srcSet={heroPhoto?.image.srcSet}
                  alt={heroPhoto ? pagePhotoAlt(heroPhoto, language) : `${t(isBathroom ? 'localServicePage.bathroomAlt' : 'localServicePage.toiletAlt')} ${city}`}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-c-faf6f0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {cardTitles.map((heading, index) => (
                <div key={heading} className="rounded-2xl border border-c-d9c7ae bg-c-f6efe7 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-c-efe4d5 flex items-center justify-center">
                      {index === 0 ? <Sparkles size={15} className="text-c-7a6552" /> : <Check size={15} className="text-c-7a6552" />}
                    </div>
                    <h2 className="font-serif text-2xl text-c-231a12">{heading}</h2>
                  </div>
                  <p className="text-c-5f544a leading-relaxed">
                    {cardDescriptions[index]}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-c-5f544a">
              <span className="font-semibold text-c-231a12">{t('site.localMoreTitle')}</span>{' '}
              {guideLinks.map((link, index) => (
                <React.Fragment key={link.to}>
                  {index > 0 && <span aria-hidden="true"> · </span>}
                  <Link to={link.to} className="text-c-231a12 underline decoration-c-7a6552/40 underline-offset-4 hover:decoration-c-231a12">{link.label}</Link>
                </React.Fragment>
              ))}
            </p>
          </div>
        </section>

        <section className="py-20 bg-c-f4efe8">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-semibold text-c-231a12 mb-4">
                {replace(t('localServicePage.whyTitle'))}
              </h2>
              <p className="text-c-5f544a max-w-2xl mx-auto">
                {isBathroom
                  ? replace(t('localServicePage.bathroomWhy'))
                  : replace(t('localServicePage.toiletWhy'))}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 rounded-xl border border-c-d9c7ae bg-c-faf6f0 p-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-c-efe4d5 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-c-7a6552" />
                  </div>
                  <p className="text-c-3d322d leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-c-f7f1ea">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-semibold text-c-231a12 text-center mb-10">
              {t('localServicePage.faqTitle')}
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-c-d7c3a9 bg-c-fbf7f3 p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-c-efe4d5 flex items-center justify-center shrink-0">
                      <CircleHelp size={15} className="text-c-7a6552" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-c-231a12 mb-2">{item.question}</h3>
                      <p className="text-c-5f544a leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {localReviews.length > 0 && (
          <section className="py-20 bg-c-faf6f0" aria-labelledby="lokaal-ervaringen-heading">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 id="lokaal-ervaringen-heading" className="font-serif text-4xl font-semibold text-c-231a12 mb-10">{fill(t('site.localReviewsTitle'), { place: city })}</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {localReviews.map((review) => <ReviewCard key={review.id} review={review} compact />)}
              </div>
            </div>
          </section>
        )}

        {/* Work done in this city, as entered in the admin. */}
        <RelatedProjects category={isBathroom ? 'badkamer' : 'toilet'} place={city} title={fill(t('site.relatedInPlace'), { place: city })} id="lokaal-projecten" />
        <ServiceArea service={serviceType} id="lokaal-werkgebied" />

        <section className="py-20 bg-c-231a12 text-c-f6f0e8">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl font-semibold mb-6">
              {replace(t('localServicePage.ctaTitle'))}
            </h2>
            <p className="text-c-ddd3c5 max-w-2xl mx-auto mb-8">
              {replace(t('localServicePage.ctaDescription'))}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-c-f6f0e8 text-c-231a12 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-e5dbcd transition-all duration-200 text-sm"
              >
                {t('localServicePage.quote')}
              </Link>
              <Link
                to="/projecten"
                className="inline-flex items-center justify-center gap-2 border border-c-f6f0e8/40 text-c-f6f0e8 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-f6f0e8 hover:text-c-231a12 transition-all duration-200 text-sm"
              >
                {t('localServicePage.viewProjects')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
