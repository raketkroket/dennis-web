import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PriceOverview from '../components/PriceOverview';
import RelatedProjects from '../components/RelatedProjects';
import FaqList from '../components/FaqList';
import WhatsAppButton from '../components/WhatsAppButton';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';
import { calculateEstimate, formatEuro, formatNumber, optionsForRoom, type CalculatorConfig } from '../lib/calculator';

// A cost guide rather than a service page: its own layout, with a small
// price tool that uses the calculator's prices (and changes with them).

const quickAreas = [5, 6, 8, 10];

function bathroomEstimate(config: CalculatorConfig, area: number, optionIds: string[] = []) {
  const result = calculateEstimate(config, { roomType: 'badkamer', length: area / 2, width: 2, optionIds });
  return result.ok ? result.estimate : null;
}

export default function BadkamerRenovatieKosten() {
  const { t, language } = useLanguage();
  const pick = useLocalized();
  const { calculator } = useSiteContent();
  const bathroom = calculator.rooms.find((room) => room.roomType === 'badkamer' && room.isActive);
  const options = optionsForRoom(calculator, 'badkamer');
  const option = (id: string) => options.find((candidate) => candidate.id === id);
  const heating = option('vloerverwarming');
  const euro = (value: number) => formatEuro(value, language);
  const area = (value: number) => formatNumber(value, language);

  // Extras offered in the price tool, only when the calculator has all their parts.
  const extras = [
    { key: 'shower', ids: ['drain', 'inbouwkraan', 'niche'], label: t('costPage.optShower'), note: '' },
    { key: 'heating', ids: ['vloerverwarming'], label: heating ? pick(heating.labelNl, heating.labelEn) : '', note: heating ? pick(heating.noteNl, heating.noteEn) : '' },
    { key: 'ceiling', ids: ['verlaagd_plafond', 'spotjes'], label: t('costPage.optCeiling'), note: '' },
  ].filter((extra) => extra.ids.every((id) => option(id)));

  const [size, setSize] = useState(6);
  const [chosen, setChosen] = useState<string[]>([]);
  const chosenIds = extras.filter((extra) => chosen.includes(extra.key)).flatMap((extra) => extra.ids);
  const estimate = bathroomEstimate(calculator, size, chosenIds);
  const areaAmount = estimate?.areaLines.reduce((sum, line) => sum + line.amount, 0) ?? 0;
  const extrasAmount = estimate?.options.reduce((sum, item) => sum + item.price, 0) ?? 0;
  const quick = quickAreas.map((value) => ({ value, total: bathroomEstimate(calculator, value)?.total })).filter((item) => item.total !== undefined);

  const sections = [
    { id: 'rekenvoorbeeld', label: t('costPage.estimatorTitle') },
    { id: 'wat-bepaalt-de-prijs', label: t('costPage.factorsTitle') },
    { id: 'wel-en-niet', label: t('costPage.includedTitle') },
    { id: 'besparen', label: t('costPage.savingTitle') },
    { id: 'vaste-prijs', label: t('costPage.stepsTitle') },
  ];
  const factorTitles = t('costPage.factorTitles').split('|');
  const factorTexts = t('costPage.factorTexts').split('|');
  const savingTips = t('costPage.savingTips').split('|');
  const savingTexts = t('costPage.savingTexts').split('|');
  const steps = t('costPage.steps').split('|');
  const stepTexts = t('costPage.stepTexts').split('|');
  const includedArea = bathroom ? area(bathroom.includedArea) : '';

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="bg-[#f6f0e8] pt-36 pb-20 lg:pt-44" aria-label={t('costPage.heroAria')}>
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-16 lg:px-8">
            <div className="min-w-0">
              <p className="mb-6 inline-block border border-[#7a6552]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a6552]">{t('costPage.guideLabel')}</p>
              <h1 className="mb-6 font-serif text-4xl font-semibold leading-[0.98] text-[#231A12] [overflow-wrap:anywhere] sm:text-5xl sm:[overflow-wrap:normal] md:text-6xl">{t('costPage.title')}</h1>
              {bathroom && <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#6B5D50]">{fill(t('costPage.intro'), { price: euro(bathroom.basePrice), area: includedArea })}</p>}
              <nav aria-label={t('costPage.tocLabel')} className="border-t border-[#cfbca7]/60 pt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a6552]">{t('costPage.tocLabel')}</p>
                <ol className="space-y-2">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="group inline-flex min-h-8 items-baseline gap-3 text-[#231A12] hover:text-[#7a6552]">
                        <span className="font-serif text-sm text-[#7a6552]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                        <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-[#7a6552]/50">{section.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div id="rekenvoorbeeld" className="min-w-0 scroll-mt-28 rounded-sm border border-[#cfbca7]/70 bg-[#faf6f0] p-6 shadow-[0_24px_60px_rgba(35,26,18,0.08)] sm:p-8">
              <h2 className="mb-2 font-serif text-3xl font-semibold text-[#231A12]">{t('costPage.estimatorTitle')}</h2>
              <p className="mb-8 text-sm leading-relaxed text-[#6B5D50]">{t('costPage.estimatorIntro')}</p>

              <label htmlFor="kosten-oppervlakte" className="mb-3 flex items-baseline justify-between gap-4 text-sm font-medium text-[#231A12]">
                {t('costPage.areaLabel')}
                <output htmlFor="kosten-oppervlakte" className="font-serif text-2xl font-semibold">{area(size)} m²</output>
              </label>
              <input
                id="kosten-oppervlakte"
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                aria-valuetext={`${area(size)} m²`}
                className="mb-8 h-2 w-full cursor-pointer accent-[#231A12]"
              />

              {extras.length > 0 && (
                <fieldset className="mb-8">
                  <legend className="mb-3 text-sm font-medium text-[#231A12]">{t('costPage.extrasLabel')}</legend>
                  <div className="space-y-2">
                    {extras.map((extra) => (
                      <label key={extra.key} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-[#cfbca7]/60 bg-[#f6f0e8] px-4 py-3 text-sm text-[#4A3F35] has-[:checked]:border-[#231A12]">
                        <input
                          type="checkbox"
                          checked={chosen.includes(extra.key)}
                          onChange={() => setChosen((current) => (current.includes(extra.key) ? current.filter((key) => key !== extra.key) : [...current, extra.key]))}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#231A12]"
                        />
                        <span>
                          {extra.label}
                          {extra.note && <span className="block text-xs text-[#8A7A6A]">{extra.note}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {estimate && (
                <div className="bg-[#231A12] p-6 text-[#F6F0E8]" aria-live="polite">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cfbca7]">{t('costPage.totalLabel')}</p>
                  <p className="mt-1 font-serif text-5xl font-semibold">{euro(estimate.total)}</p>
                  <dl className="mt-5 space-y-1.5 border-t border-[#f6f0e8]/15 pt-4 text-sm text-[#ddd3c5]">
                    <div className="flex justify-between gap-4"><dt>{fill(t('costPage.lineBase'), { area: area(estimate.includedArea) })}</dt><dd>{euro(estimate.basePrice)}</dd></div>
                    {areaAmount > 0 && <div className="flex justify-between gap-4"><dt>{t('costPage.lineArea')}</dt><dd>+ {euro(areaAmount)}</dd></div>}
                    {extrasAmount > 0 && <div className="flex justify-between gap-4"><dt>{t('costPage.lineExtras')}</dt><dd>+ {euro(extrasAmount)}</dd></div>}
                  </dl>
                  <p className="mt-4 text-xs text-[#cfbca7]">{t('costPage.totalNote')}</p>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/configurator" className="inline-flex flex-1 items-center justify-center gap-2 bg-[#231A12] px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#F6F0E8] transition-all duration-200 hover:bg-[#3a2d23]">
                  {t('costPage.exactCta')}
                  <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex flex-1 items-center justify-center gap-2 border border-[#7a6552]/30 px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#231A12] transition-all duration-200 hover:bg-[#231A12] hover:text-white">
                  {t('localServicePage.quote')}
                </Link>
              </div>

              {quick.length > 0 && (
                <div className="mt-8 border-t border-[#cfbca7]/60 pt-5">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a6552]">{t('costPage.quickLabel')}</h3>
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {quick.map((item) => (
                      <li key={item.value} className="border border-[#cfbca7]/60 px-3 py-2">
                        <span className="block text-xs text-[#6B5D50]">{fill(t('costPage.exampleArea'), { area: area(item.value) })}</span>
                        <span className="font-semibold text-[#231A12]">{euro(item.total!)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="wat-bepaalt-de-prijs" className="scroll-mt-20 bg-[#faf6f0] py-24" aria-labelledby="kosten-factoren-heading">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="kosten-factoren-heading" className="mb-5 font-serif text-4xl font-semibold leading-tight text-[#231A12] md:text-5xl">{t('costPage.factorsTitle')}</h2>
              <p className="max-w-md leading-relaxed text-[#6B5D50]">{t('costPage.factorsIntro')}</p>
            </div>
            <ol className="divide-y divide-[#cfbca7]/60 border-y border-[#cfbca7]/60">
              {factorTitles.map((title, index) => (
                <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4.5rem_1fr]">
                  <span className="font-serif text-3xl font-semibold leading-none text-[#7a6552] sm:text-4xl" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="mb-2 font-serif text-2xl font-semibold text-[#231A12]">{title}</h3>
                    <p className="leading-relaxed text-[#5f544a]">{fill(factorTexts[index] ?? '', { area: includedArea })}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="wel-en-niet" className="scroll-mt-20 bg-[#f4efe8] py-24" aria-labelledby="kosten-inbegrepen-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 id="kosten-inbegrepen-heading" className="mb-4 font-serif text-4xl font-semibold text-[#231A12]">{t('costPage.includedTitle')}</h2>
            <p className="mb-10 max-w-3xl leading-relaxed text-[#6B5D50]">{t('costPage.excludedIntro')}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-[#cfbca7]/70 bg-[#faf6f0] p-7">
                <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a6552]">{t('costPage.includedLabel')}</h3>
                <ul className="space-y-3">
                  {t('costPage.included').split('|').map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#231A12]"><Check size={18} className="mt-0.5 shrink-0 text-[#7a6552]" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#231A12] p-7 text-[#F6F0E8]">
                <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cfbca7]">{t('costPage.excludedLabel')}</h3>
                <ul className="space-y-3">
                  {t('costPage.excluded').split('|').map((item) => (
                    <li key={item} className="flex items-start gap-3"><Minus size={18} className="mt-0.5 shrink-0 text-[#cfbca7]" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-[#6B5D50]">{t('costPage.excludedNote')}</p>
          </div>
        </section>

        <PriceOverview roomTypes={['badkamer']} id="kosten-prijzen" title={t('costPage.tableTitle')} />

        <section id="besparen" className="scroll-mt-20 bg-[#faf6f0] py-24" aria-labelledby="kosten-besparen-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 id="kosten-besparen-heading" className="mb-12 font-serif text-4xl font-semibold text-[#231A12]">{t('costPage.savingTitle')}</h2>
            <div className="grid gap-10 md:grid-cols-3">
              {savingTips.map((tip, index) => (
                <div key={tip} className="border-l-2 border-[#7a6552]/50 pl-6">
                  <h3 className="mb-3 font-serif text-2xl font-semibold leading-snug text-[#231A12]">{tip}</h3>
                  <p className="leading-relaxed text-[#5f544a]">{savingTexts[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vaste-prijs" className="scroll-mt-20 bg-[#231A12] py-24 text-[#F6F0E8]" aria-labelledby="kosten-stappen-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 id="kosten-stappen-heading" className="mb-12 font-serif text-4xl font-semibold">{t('costPage.stepsTitle')}</h2>
            <ol className="mb-12 grid gap-8 md:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step}>
                  <span className="mb-2 block font-serif text-3xl font-semibold text-[#cfbca7]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mb-2 font-semibold">{step}</h3>
                  <p className="text-sm leading-relaxed text-[#ddd3c5]">{stepTexts[index]}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/configurator" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#F6F0E8] px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#231A12] transition-all duration-200 hover:bg-[#e5dbcd]">
                {t('common.calculatePrice')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#f6f0e8]/40 px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#F6F0E8] transition-all duration-200 hover:bg-[#F6F0E8] hover:text-[#231A12]">
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
