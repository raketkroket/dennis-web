import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { track, trackOnce } from '../lib/analytics';
import {
  calculateEstimate,
  formatEuro,
  formatNumber,
  optionGroups,
  optionsForRoom,
  parseDecimal,
  toggleOption,
  validateDimension,
  type CalculatorOption,
  type DimensionError,
  type RoomType,
} from '../lib/calculator';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';
import { loadCalculatorDraft, saveCalculatorDraft, saveQuoteConfiguration, type CalculatorDraft } from '../types/quote';
import { useStartedOnClient } from '../lib/hydration';
import EstimateBreakdown from './EstimateBreakdown';
import Img from './ui/Img';

// three.js is only downloaded when the calculator is opened.
const RoomPreview3D = lazy(() => import('./RoomPreview3D'));


const emptyDraft: CalculatorDraft = { step: 1, roomType: null, length: '', width: '', optionIds: [] };
const totalSteps = 4;

export default function Configurator() {
  const { language, t } = useLanguage();
  const pick = useLocalized();
  const navigate = useNavigate();
  const { calculator, projects } = useSiteContent();
  // On a prerendered page the first render must match the HTML (an empty
  // calculator); a saved draft is restored right after.
  const clientRender = useStartedOnClient();
  const [draft, setDraft] = useState<CalculatorDraft>(() => (clientRender ? loadCalculatorDraft() ?? emptyDraft : emptyDraft));
  const [restoreDraft] = useState(!clientRender);
  const [showErrors, setShowErrors] = useState(false);
  const [notice, setNotice] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const restoredStep = useRef(false);

  useEffect(() => {
    const saved = restoreDraft ? loadCalculatorDraft() : null;
    if (!saved) return;
    // Returning to a saved step is not a step change by the visitor: no scrolling.
    if (saved.step !== emptyDraft.step) restoredStep.current = true;
    setDraft(saved);
  }, [restoreDraft]);

  useEffect(() => saveCalculatorDraft(draft), [draft]);

  // Move focus to the new step's heading so keyboard and screen-reader users
  // land at the right place; the very first render keeps the page's focus.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (restoredStep.current) {
      restoredStep.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [draft.step]);

  const rooms = calculator.rooms.filter((room) => room.isActive);
  const room = rooms.find((candidate) => candidate.roomType === draft.roomType);
  const options = room ? optionsForRoom(calculator, room.roomType) : [];
  const lengthError = validateDimension(draft.length);
  const widthError = validateDimension(draft.width);
  const length = parseDecimal(draft.length);
  const width = parseDecimal(draft.width);
  const dimensionsValid = !lengthError && !widthError && length !== null && width !== null;
  // Drop choices that no longer exist (for example after a price-list change).
  const optionIds = draft.optionIds.filter((id) => options.some((option) => option.id === id));
  const result = useMemo(() => (room && dimensionsValid ? calculateEstimate(calculator, { roomType: room.roomType, length: length as number, width: width as number, optionIds }) : null), [calculator, room, dimensionsValid, length, width, optionIds]);
  const estimate = result?.ok ? result.estimate : null;

  const update = (patch: Partial<CalculatorDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const canEnter = (step: number) => step === 1 || (step === 2 && Boolean(room)) || (step >= 3 && Boolean(room) && dimensionsValid);
  const stepAllowed = canEnter(draft.step);

  // A saved draft can point at a step that is no longer reachable (for
  // example when a room was switched off in the admin); start over then.
  useEffect(() => {
    if (!stepAllowed) setDraft((current) => ({ ...current, step: current.roomType && rooms.some((candidate) => candidate.roomType === current.roomType) ? 2 : 1 }));
  }, [stepAllowed, rooms]);
  const goTo = (step: number) => {
    if (step > draft.step && !canEnter(step)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setNotice('');
    update({ step });
    if (step === 2 && room) trackOnce('calculator_start', { room_type: room.roomType });
    if (step === 4 && estimate) track('calculator_complete', { room_type: estimate.roomType, value: estimate.total, currency: 'EUR' });
  };

  const stepNames = [t('site.stepRoom'), t('site.stepSize'), t('site.stepOptions'), t('site.stepSummary')];
  const errorText = (error: DimensionError | null) => (error ? t({ required: 'site.errRequired', invalid: 'site.errInvalid', tooSmall: 'site.errTooSmall', tooLarge: 'site.errTooLarge' }[error]) : '');

  const onToggle = (option: CalculatorOption) => {
    const next = toggleOption(calculator, optionIds, option.id);
    const removed = optionIds.filter((id) => !next.includes(id) && id !== option.id);
    setNotice(removed.length ? fill(t('site.replaces'), { options: removed.map((id) => labelFor(id)).join(', ') }) : '');
    update({ optionIds: next });
  };
  const labelFor = (id: string) => {
    const option = calculator.options.find((candidate) => candidate.id === id);
    return option ? pick(option.labelNl, option.labelEn) : id;
  };

  const requestQuote = () => {
    if (!estimate || !room) return;
    track('calculator_quote_click', { room_type: room.roomType, value: estimate.total, currency: 'EUR' });
    saveQuoteConfiguration({ roomType: room.roomType, length: estimate.length, width: estimate.width, optionIds });
    navigate(`/contact?dienst=${room.roomType}`);
  };

  const preview = room && (
    <div>
      <p className="eyebrow-plain mb-3">{t('site.preview3dTitle')}</p>
      <Suspense fallback={<div className="aspect-[4/3] w-full bg-denra-stone sm:aspect-[16/10]" />}>
        <RoomPreview3D
          roomType={room.roomType}
          length={dimensionsValid ? length : null}
          width={dimensionsValid ? width : null}
          optionIds={optionIds}
          dimensionLabel={(value) => `${formatNumber(value, language)} m`}
          labels={{ evening: t('site.preview3dEvening'), day: t('site.preview3dDay'), reset: t('site.preview3dReset') }}
          description={fill(t('site.preview3dDescription'), {
            room: pick(room.labelNl, room.labelEn).toLowerCase(),
            length: formatNumber(dimensionsValid && length !== null ? length : room.roomType === 'wc' ? 1.4 : 3, language),
            width: formatNumber(dimensionsValid && width !== null ? width : room.roomType === 'wc' ? 0.95 : 2.2, language),
            options: optionIds.length ? `${t('site.preview3dWith')}${optionIds.map((id) => labelFor(id).toLowerCase()).join(', ')}` : '',
          })}
        />
      </Suspense>
      <p className="mt-2 text-[13px] text-denra-muted">{t('site.preview3dHint')}</p>
    </div>
  );

  const roomImage = (roomType: RoomType) => projects.find((project) => project.category === (roomType === 'wc' ? 'toilet' : 'badkamer') && project.isFeatured && project.cover)?.cover;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-8">
        {/* Progress */}
        <nav aria-label={t('common.calculatePrice')}>
          <ol className="grid grid-cols-4 border-t border-denra-ink/70">
            {stepNames.map((name, index) => {
              const step = index + 1;
              const done = step < draft.step;
              const current = step === draft.step;
              return (
                <li key={name} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => goTo(step)}
                    disabled={!current && !canEnter(step)}
                    aria-current={current ? 'step' : undefined}
                    aria-label={`${fill(t('site.stepOf'), { step, total: totalSteps })}: ${name}`}
                    className={`flex w-full flex-col items-start gap-1 border-t-2 pt-3 text-left transition-colors disabled:cursor-not-allowed ${current ? '-mt-px border-denra-ink' : done ? '-mt-px border-denra-bronze' : 'border-transparent'}`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center text-[13px] font-medium ${current ? 'bg-denra-ink text-denra-ivory' : done ? 'bg-denra-bronze text-denra-ivory' : 'border border-denra-ink/20 text-denra-muted'}`}>
                      {done ? <Check size={14} aria-hidden="true" /> : step}
                    </span>
                    <span className={`truncate text-[13px] sm:text-sm ${current ? 'font-medium text-denra-ink' : 'text-denra-muted'}`}>{name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {draft.step > 1 && preview && <div className="mt-8">{preview}</div>}

        <div className="mt-10">
          <p className="text-sm text-denra-muted">{fill(t('site.stepOf'), { step: draft.step, total: totalSteps })}</p>

          {draft.step === 1 && (
            <StepFrame headingRef={headingRef} title={t('configurator.chooseRoom')} intro={t('configurator.chooseRoomDescription')}>
              <fieldset>
                <legend className="sr-only">{t('configurator.chooseRoom')}</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {rooms.map((candidate) => {
                    const selected = draft.roomType === candidate.roomType;
                    const image = roomImage(candidate.roomType);
                    return (
                      <label key={candidate.roomType} className={`group relative cursor-pointer border bg-denra-paper transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-denra-bronze ${selected ? 'border-denra-ink ring-1 ring-denra-ink' : 'border-denra-ink/15 hover:border-denra-ink/50'}`}>
                        <input type="radio" name="room" value={candidate.roomType} checked={selected} onChange={() => update({ roomType: candidate.roomType, optionIds: [] })} className="sr-only" aria-label={`${pick(candidate.labelNl, candidate.labelEn)}: ${pick(candidate.descriptionNl, candidate.descriptionEn)}, ${t('site.calcFrom')} ${formatEuro(candidate.basePrice, language)}`} />
                        {image && <div className="frame aspect-[16/10]"><Img image={image.image} alt="" sizes="(min-width: 640px) 30vw, 100vw" /></div>}
                        <div className="flex items-start justify-between gap-4 p-5">
                          <div>
                            <p className="font-serif text-2xl">{pick(candidate.labelNl, candidate.labelEn)}</p>
                            <p className="mt-1 text-sm text-denra-muted">{pick(candidate.descriptionNl, candidate.descriptionEn)}</p>
                            <p className="mt-3 text-sm">{t('site.calcFrom')} <strong className="font-medium">{formatEuro(candidate.basePrice, language)}</strong> {t('configurator.includingVat')} · {fill(t('site.calcUpTo'), { area: formatNumber(candidate.includedArea, language) })}</p>
                          </div>
                          <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-denra-ink bg-denra-ink text-denra-ivory' : 'border-denra-ink/30'}`} aria-hidden="true">
                            {selected && <Check size={14} />}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {showErrors && !room && <p className="field-error" role="alert">{t('configurator.chooseRoom')}</p>}
            </StepFrame>
          )}

          {draft.step === 2 && room && (
            <StepFrame headingRef={headingRef} title={t('configurator.dimensionsTitle')} intro={t('site.sizeHelp')}>
              <div className="grid gap-5 sm:grid-cols-2">
                {([['length', t('site.sizeLength'), lengthError], ['width', t('site.sizeWidth'), widthError]] as const).map(([field, label, error]) => {
                  const invalid = Boolean(error) && (showErrors || draft[field] !== '');
                  return (
                    <div key={field}>
                      <label htmlFor={`calc-${field}`} className="field-label">{label} <span className="font-normal text-denra-muted">({t('site.metres')})</span></label>
                      <div className="relative">
                        <input
                          id={`calc-${field}`}
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          enterKeyHint="next"
                          placeholder={field === 'length' ? '2,5' : '1,8'}
                          value={draft[field]}
                          onChange={(event) => update({ [field]: event.target.value })}
                          aria-invalid={invalid}
                          aria-describedby={invalid ? `calc-${field}-error` : undefined}
                          className="field pr-12 text-lg"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-denra-muted" aria-hidden="true">m</span>
                      </div>
                      {invalid && <p id={`calc-${field}-error`} className="field-error">{errorText(error)}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 border-l-2 border-denra-bronze bg-denra-paper p-5" aria-live="polite">
                {dimensionsValid && length !== null && width !== null ? (
                  <>
                    <p><span className="text-denra-muted">{t('site.areaResult')}:</span> <strong className="font-serif text-2xl font-medium">{formatNumber(Math.round(length * width * 100) / 100, language)} m²</strong></p>
                    <p className="mt-1 text-sm text-denra-muted">{fill(t('site.areaIncluded'), { area: formatNumber(room.includedArea, language) })} {length * width > room.includedArea ? t('site.areaExtra') : ''}</p>
                  </>
                ) : (
                  <p className="text-sm text-denra-muted">{fill(t('site.areaIncluded'), { area: formatNumber(room.includedArea, language) })}</p>
                )}
              </div>
            </StepFrame>
          )}

          {draft.step === 3 && room && (
            <StepFrame headingRef={headingRef} title={t('configurator.optionsTitle')} intro={t('site.optionsHelp')}>
              <p className="sr-only" aria-live="polite">{notice}</p>
              {notice && <p className="mb-6 border-l-2 border-denra-bronze bg-denra-paper px-4 py-3 text-sm" aria-hidden="true">{notice}</p>}
              <div className="space-y-10">
                {optionGroups.map((group) => {
                  const groupOptions = options.filter((option) => option.group === group.id);
                  if (!groupOptions.length) return null;
                  return (
                    <fieldset key={group.id}>
                      <legend className="eyebrow-plain mb-3">{pick(group.labelNl, group.labelEn)}</legend>
                      <div className="grid gap-3">
                        {groupOptions.map((option) => {
                          const checked = optionIds.includes(option.id);
                          const conflicts = option.conflictsWith.filter((id) => options.some((candidate) => candidate.id === id));
                          const included = pick(option.includedNl, option.includedEn);
                          const note = pick(option.noteNl, option.noteEn);
                          return (
                            <label key={option.id} className={`flex cursor-pointer gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-denra-bronze sm:p-5 ${checked ? 'border-denra-ink bg-denra-paper ring-1 ring-denra-ink' : 'border-denra-ink/15 bg-denra-paper/60 hover:border-denra-ink/50'}`}>
                              <input type="checkbox" checked={checked} onChange={() => onToggle(option)} className="sr-only" aria-label={`${pick(option.labelNl, option.labelEn)}, + ${formatEuro(option.price, language)}`} aria-describedby={`opt-${option.id}-details`} />
                              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border ${checked ? 'border-denra-ink bg-denra-ink text-denra-ivory' : 'border-denra-ink/30 bg-white'}`} aria-hidden="true">
                                {checked && <Check size={15} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                  <span className="font-medium text-denra-ink">{pick(option.labelNl, option.labelEn)}</span>
                                  <span className="tabular-nums text-denra-ink">+ {formatEuro(option.price, language)}</span>
                                </span>
                                <span id={`opt-${option.id}-details`} className="mt-1.5 block space-y-1 text-sm leading-snug text-denra-muted">
                                  {included && <span className="block"><span className="text-denra-ink">{t('site.included')}:</span> {included}</span>}
                                  {note && <span className="block"><span className="text-denra-ink">{t('site.note')}:</span> {note}</span>}
                                  {conflicts.length > 0 && (
                                    <span className="block">{fill(t('site.cannotCombine'), { options: conflicts.map(labelFor).join(', ') })}</span>
                                  )}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </StepFrame>
          )}

          {draft.step === 4 && estimate && (
            <StepFrame headingRef={headingRef} title={t('site.summaryTitle')} intro={t('site.estimateNote')}>
              <div className="border-t border-denra-ink/70 pt-2">
                <EstimateBreakdown estimate={estimate} config={calculator} />
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <button type="button" onClick={() => goTo(1)} className="underline underline-offset-4 hover:text-denra-bronze">{t('site.change')} {t('site.stepRoom').toLowerCase()}</button>
                <button type="button" onClick={() => goTo(2)} className="underline underline-offset-4 hover:text-denra-bronze">{t('site.change')} {t('site.stepSize').toLowerCase()}</button>
                <button type="button" onClick={() => goTo(3)} className="underline underline-offset-4 hover:text-denra-bronze">{t('site.change')} {t('site.stepOptions').toLowerCase()}</button>
              </div>
              <div className="mt-8 space-y-3 bg-denra-stone p-5 text-sm leading-relaxed text-denra-muted">
                <p>{t('configurator.disclaimer')}</p>
                <p>{t('configurator.materialsIncluded')}</p>
              </div>
              <div className="mt-8">
                <button type="button" onClick={requestQuote} className="btn-primary w-full sm:w-auto">
                  {t('site.quoteWithCalc')}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p className="mt-3 text-sm text-denra-muted">{t('site.quoteWithCalcHelp')}</p>
              </div>
            </StepFrame>
          )}

          {/* The running total sits in the sidebar on large screens; on phones it is repeated here. */}
          {estimate && draft.step < totalSteps && (
            <p className="mt-10 flex items-baseline justify-between gap-4 border-t border-denra-ink/70 pt-4 lg:hidden" aria-live="polite">
              <span className="text-sm text-denra-muted">{t('site.liveTotal')} ({t('configurator.includingVat')})</span>
              <span className="font-serif text-2xl tabular-nums">{formatEuro(estimate.total, language)}</span>
            </p>
          )}

          {/* Step navigation */}
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-denra-line pt-6 lg:mt-10">
            {draft.step > 1 ? (
              <button type="button" onClick={() => goTo(draft.step - 1)} className="btn-secondary">
                <ArrowLeft size={16} aria-hidden="true" />
                {t('site.back')}
              </button>
            ) : <span />}
            {draft.step < totalSteps ? (
              <button type="button" onClick={() => goTo(draft.step + 1)} className="btn-primary">
                {draft.step === 3 ? t('site.toSummary') : t('site.next')}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => { setDraft(emptyDraft); saveQuoteConfiguration(null); }} className="inline-flex min-h-12 items-center gap-2 text-sm text-denra-muted hover:text-denra-ink">
                <RotateCcw size={15} aria-hidden="true" />
                {t('site.startOver')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Running estimate */}
      <aside className="lg:col-span-4" aria-label={t('site.liveTotal')}>
        <div className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
        <div className="bg-denra-night p-6 text-denra-ivory">
          <p className="eyebrow-plain text-denra-greige">{t('site.liveTotal')}</p>
          {estimate ? (
            <>
              <p className="mt-3 font-serif text-5xl tabular-nums">{formatEuro(estimate.total, language)}</p>
              <p className="mt-1 text-sm text-denra-ivory/60">{t('configurator.includingVat')} · {formatNumber(estimate.area, language)} m² · {pick(room?.labelNl ?? '', room?.labelEn)}</p>
              {estimate.options.length > 0 && (
                <ul className="mt-5 space-y-1.5 border-t border-denra-ivory/15 pt-4 text-sm text-denra-ivory/75">
                  {estimate.options.map((option) => <li key={option.id} className="flex justify-between gap-3"><span>{pick(option.labelNl, option.labelEn)}</span><span className="tabular-nums">+ {formatEuro(option.price, language)}</span></li>)}
                </ul>
              )}
            </>
          ) : room ? (
            <>
              <p className="mt-3 font-serif text-4xl tabular-nums">{t('site.calcFrom')} {formatEuro(room.basePrice, language)}</p>
              <p className="mt-2 text-sm text-denra-ivory/60">{fill(t('site.calcUpTo'), { area: formatNumber(room.includedArea, language) })} · {t('configurator.includingVat')}</p>
            </>
          ) : (
            <p className="mt-3 text-denra-ivory/70">{t('configurator.chooseRoomDescription')}</p>
          )}
          <p className="mt-6 border-t border-denra-ivory/15 pt-4 text-xs leading-relaxed text-denra-ivory/55">{t('site.estimateNote')}</p>
        </div>
        </div>
      </aside>
    </div>
  );
}

function StepFrame({ headingRef, title, intro, children }: { headingRef: RefObject<HTMLHeadingElement | null>; title: string; intro: string; children: ReactNode }) {
  return (
    <section className="mt-2">
      <h2 ref={headingRef} tabIndex={-1} className="display-md scroll-mt-[calc(var(--header-height)+1.5rem)] outline-none">{title}</h2>
      <p className="mt-3 max-w-2xl text-denra-muted">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}
