import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PriceOverview from '../components/PriceOverview';
import RelatedProjects from '../components/RelatedProjects';
import FaqList from '../components/FaqList';
import WhatsAppButton from '../components/WhatsAppButton';
import { useSiteContent } from '../content/SiteContentProvider';
import { sitePhotos } from '../data/sitePhotos';
import { altForSrc } from '../content/photoAlt';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';
import { calculateEstimate, formatEuro, formatNumber, type CalculatorConfig } from '../lib/calculator';

// Example bathrooms, worked out with the calculator's own prices so they
// change along with the prices Dennis sets in the admin.
const exampleSizes = [
  { length: 2.5, width: 2 },
  { length: 3, width: 2 },
  { length: 4, width: 2 },
  { length: 4, width: 2.5 },
];
const showerExample = { length: 3, width: 2, optionIds: ['drain', 'inbouwkraan', 'niche'] };

function examplePrices(config: CalculatorConfig) {
  const estimate = (length: number, width: number, optionIds: string[] = []) => {
    const result = calculateEstimate(config, { roomType: 'badkamer', length, width, optionIds });
    return result.ok ? result.estimate.total : null;
  };
  const sizes = exampleSizes.map(({ length, width }) => ({ area: length * width, total: estimate(length, width) }));
  const shower = { area: showerExample.length * showerExample.width, total: estimate(showerExample.length, showerExample.width, showerExample.optionIds) };
  return { sizes: sizes.filter((size) => size.total !== null), shower: shower.total === null ? null : shower };
}

export default function BadkamerRenovatieKosten() {
  const { t, language } = useLanguage();
  const { calculator } = useSiteContent();
  const bathroom = calculator.rooms.find((room) => room.roomType === 'badkamer' && room.isActive);
  const euro = (value: number) => formatEuro(value, language);
  const area = (value: number) => formatNumber(value, language);
  const priceValues = bathroom ? { price: euro(bathroom.basePrice), area: area(bathroom.includedArea) } : null;
  const examples = examplePrices(calculator);
  const factorTitles = t('costPage.factorTitles').split('|');
  const factorTexts = t('costPage.factorTexts').split('|');
  const savingTips = t('costPage.savingTips').split('|');
  const savingTexts = t('costPage.savingTexts').split('|');
  const steps = t('costPage.steps').split('|');
  const stepTexts = t('costPage.stepTexts').split('|');
  const heroPhoto = sitePhotos[14];

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-20 bg-[#f7f1ea]" aria-label={t('costPage.heroAria')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
              <div className="max-w-xl min-w-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label bg-[#efe2d2] text-[#4d3d33]">{t('costPage.eyebrow')}</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold [overflow-wrap:anywhere] sm:[overflow-wrap:normal] text-[#231A12] leading-[0.96] mb-6">{t('costPage.title')}</h1>
                {priceValues && <p className="text-[#6B5D50] leading-relaxed mb-8 text-lg">{fill(t('costPage.intro'), priceValues)}</p>}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/configurator" className="inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm">
                    {t('common.calculatePrice')}
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-[#7a6552]/20 text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#231A12] hover:text-white transition-all duration-200 text-sm">
                    {t('localServicePage.quote')}
                  </Link>
                </div>
              </div>
              <div className="rounded-[32px] overflow-hidden aspect-[4/3] border border-[#d6c3a9] shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-[#efe4d5]">
                <img src={heroPhoto} alt={altForSrc(heroPhoto, language) ?? t('costPage.heroAlt')} width={900} height={675} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {examples.sizes.length > 0 && (
          <section className="py-20 bg-[#faf6f0]" aria-labelledby="kosten-voorbeelden-heading">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <h2 id="kosten-voorbeelden-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">{t('costPage.examplesTitle')}</h2>
              <p className="text-[#6B5D50] leading-relaxed mb-8">{t('costPage.examplesIntro')}</p>
              <div className="rounded-sm border border-[#cfbca7]/55 bg-[#f6f0e8]">
                <table className="w-full text-left">
                  <caption className="sr-only">{t('costPage.examplesTitle')}</caption>
                  <thead className="text-[10px] uppercase tracking-[0.16em] text-[#7a6552]">
                    <tr className="border-b border-[#cfbca7]/55">
                      <th scope="col" className="px-4 py-3 font-semibold">{t('costPage.exampleColumn')}</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">{t('costPage.exampleColumnPrice')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examples.sizes.map((example) => (
                      <tr key={example.area} className="border-b border-[#cfbca7]/40">
                        <th scope="row" className="px-4 py-3 font-medium text-[#231A12]">{fill(t('costPage.exampleArea'), { area: area(example.area) })}</th>
                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap text-[#231A12]">{euro(example.total!)}</td>
                      </tr>
                    ))}
                    {examples.shower && (
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-[#231A12]">{fill(t('costPage.exampleShower'), { area: area(examples.shower.area) })}</th>
                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap text-[#231A12]">{euro(examples.shower.total!)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-[#f4efe8]" aria-labelledby="kosten-factoren-heading">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 id="kosten-factoren-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">{t('costPage.factorsTitle')}</h2>
            <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-3xl">{t('costPage.factorsIntro')}</p>
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {factorTitles.map((title, index) => (
                <div key={title} className="border-t border-[#cfbca7]/55 pt-5">
                  <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">{title}</h3>
                  <p className="text-[#5f544a] leading-relaxed">{fill(factorTexts[index] ?? '', { area: priceValues?.area ?? '' })}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PriceOverview roomTypes={['badkamer']} id="kosten-prijzen" title={t('costPage.tableTitle')} />

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="kosten-niet-inbegrepen-heading">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 id="kosten-niet-inbegrepen-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">{t('costPage.excludedTitle')}</h2>
            <p className="text-[#6B5D50] leading-relaxed mb-6">{t('costPage.excludedIntro')}</p>
            <ul className="space-y-3 mb-6">
              {t('costPage.excluded').split('|').map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#4A3F35]">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[#e8ddcf] flex items-center justify-center shrink-0" aria-hidden="true"><Minus size={11} className="text-[#7a6552]" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#6B5D50]">{t('costPage.excludedNote')}</p>
          </div>
        </section>

        <section className="py-20 bg-[#f4efe8]" aria-labelledby="kosten-besparen-heading">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 id="kosten-besparen-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-10">{t('costPage.savingTitle')}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {savingTips.map((tip, index) => (
                <div key={tip} className="rounded-sm border border-[#cfbca7]/55 bg-[#faf6f0] p-6">
                  <h3 className="flex items-start gap-3 font-serif text-xl font-semibold text-[#231A12] mb-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#e8ddcf] flex items-center justify-center shrink-0" aria-hidden="true"><Check size={11} className="text-[#7a6552]" /></span>
                    {tip}
                  </h3>
                  <p className="text-sm text-[#5f544a] leading-relaxed">{savingTexts[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#231A12] text-[#F6F0E8]" aria-labelledby="kosten-stappen-heading">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 id="kosten-stappen-heading" className="font-serif text-4xl font-semibold mb-10">{t('costPage.stepsTitle')}</h2>
            <ol className="grid gap-8 md:grid-cols-4 mb-10">
              {steps.map((step, index) => (
                <li key={step}>
                  <span className="block font-serif text-3xl font-semibold text-[#cfbca7]/50 mb-2" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-semibold mb-2">{step}</h3>
                  <p className="text-sm text-[#ddd3c5] leading-relaxed">{stepTexts[index]}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/configurator" className="inline-flex items-center justify-center gap-2 bg-[#F6F0E8] text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e5dbcd] transition-all duration-200 text-sm">
                {t('common.calculatePrice')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-[#f6f0e8]/40 text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#F6F0E8] hover:text-[#231A12] transition-all duration-200 text-sm">
                {t('localServicePage.quote')}
              </Link>
            </div>
            <p className="mt-8 text-sm">
              <Link to="/badkamerrenovatie" className="text-[#f6f0e8] underline decoration-[#cfbca7]/50 underline-offset-4 hover:decoration-[#f6f0e8]">{t('costPage.bathroomLink')}</Link>
            </p>
          </div>
        </section>

        <RelatedProjects category="badkamer" title={t('costPage.projectsTitle')} id="kosten-projecten" limit={3} />
        <FaqList pages={['badkamer']} id="kosten-faq" />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
