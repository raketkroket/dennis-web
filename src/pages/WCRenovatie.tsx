import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';
import { GuidanceSection, RelatedProjects, ScopeSection, ServiceHero, useCategoryProjects } from '../components/service/ServiceBlocks';
import FaqSection from '../components/FaqSection';
import CTASection from '../components/CTASection';
import Reveal from '../components/ui/Reveal';

// Price ranges exactly as they were on the previous version of this page.
// They differ from the calculator's WC base price (see README, "Open points").
const workRanges = ['€300 tot €500', '€400 tot €900', '€700 tot €1.000', '€250 tot €450', '€900 tot €1.500', '€250 tot €450', '€150 tot €300'];
const adviceAmounts = ['€4.250', '+ €1.250', '+ €350', '+ €450', '+ €350'];

export default function WCRenovatie() {
  const { language, t } = useLanguage();
  const projects = useCategoryProjects('toilet');
  usePageTitle(t('wcPage.title'), t('wcPage.description'));
  const english = (value: string) => (language === 'en' ? value.replace(' tot ', ' to ').replace(/\./g, ',') : value);
  const work = t('wcPage.pricing').split('|').map((label, index) => ({ label, price: english(workRanges[index]) }));
  const advice = t('wcPage.advice').split('|').map((label, index) => ({ label, price: english(adviceAmounts[index]) }));

  return (
    <>
      <ServiceHero eyebrow={t('wcPage.eyebrow')} title={t('wcPage.title')} description={t('wcPage.description')} category="toilet" project={projects[0]} />
      <ScopeSection title={t('wcPage.featuresTitle')} description={t('wcPage.featuresDescription')} items={t('wcPage.features').split('|')} project={projects[1]} />

      <section className="py-20 md:py-28" aria-labelledby="wc-prices-heading">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t('wcPage.pricingEyebrow')}</p>
            <h2 id="wc-prices-heading" className="display-lg mt-5">{t('wcPage.pricingTitle')}</h2>
            <p className="lede mt-5">{t('wcPage.pricingDescription')}</p>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <dl className="border-t border-denra-ink/70">
                {work.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-6 border-b border-denra-line py-4">
                    <dt>{item.label}</dt>
                    <dd className="shrink-0 font-medium text-denra-bronze">{item.price}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 bg-denra-stone p-6">
                <p className="eyebrow-plain">{t('wcPage.pricingTotalLabel')}</p>
                <p className="mt-2 font-serif text-4xl">{english('€3.800 tot €5.200')}</p>
                <p className="mt-2 text-sm text-denra-muted">{t('wcPage.pricingTotalDescription')}</p>
              </div>
            </Reveal>
            <Reveal delay={0.06} className="bg-denra-night p-6 text-denra-ivory sm:p-8">
              <p className="eyebrow-plain text-denra-greige">{t('wcPage.adviceEyebrow')}</p>
              <h3 className="mt-3 font-serif text-3xl">{t('wcPage.adviceTitle')}</h3>
              <dl className="mt-6 border-t border-denra-ivory/20">
                {advice.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-6 border-b border-denra-ivory/15 py-3.5">
                    <dt className="text-denra-ivory/80">{item.label}</dt>
                    <dd className="shrink-0 font-medium">{item.price}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 font-serif text-4xl">{english('€5.500 tot €6.500')}</p>
              <p className="mt-4 text-sm leading-relaxed text-denra-ivory/60">{t('wcPage.adviceDescription')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <GuidanceSection eyebrow={t('wcPage.guidanceEyebrow')} title={t('wcPage.guidanceTitle')} paragraphs={[t('wcPage.guidanceFirst'), t('wcPage.guidanceSecond')]} conclusion={t('wcPage.guidanceConclusion')} />
      <RelatedProjects title={t('wcPage.projectsTitle')} category="toilet" projects={projects.slice(2)} />
      <FaqSection pages={['wc']} tone="stone" />
      <CTASection service="wc" />
    </>
  );
}
