import type { CalculatorConfig, Estimate } from '../lib/calculator';
import { formatEuro, formatNumber } from '../lib/calculator';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';

interface EstimateBreakdownProps {
  estimate: Estimate;
  config: CalculatorConfig;
  tone?: 'light' | 'dark';
  compact?: boolean;
}

export default function EstimateBreakdown({ estimate, config, tone = 'light', compact = false }: EstimateBreakdownProps) {
  const { language, t } = useLanguage();
  const pick = useLocalized();
  const room = config.rooms.find((candidate) => candidate.roomType === estimate.roomType);
  const roomLabel = room ? pick(room.labelNl, room.labelEn).toLowerCase() : estimate.roomType;
  const line = tone === 'dark' ? 'border-denra-ivory/15' : 'border-denra-line';
  const muted = tone === 'dark' ? 'text-denra-ivory/60' : 'text-denra-muted';
  const row = `flex items-baseline justify-between gap-4 border-b ${line} py-2.5`;

  return (
    <div className={compact ? 'text-[15px]' : 'text-[16px]'}>
      <dl>
        <div className={row}><dt className={muted}>{t('form.room')}</dt><dd>{room ? pick(room.labelNl, room.labelEn) : estimate.roomType}</dd></div>
        <div className={row}><dt className={muted}>{t('form.dimensions')}</dt><dd>{formatNumber(estimate.length, language)} × {formatNumber(estimate.width, language)} m</dd></div>
        <div className={row}><dt className={muted}>{t('form.area')}</dt><dd>{formatNumber(estimate.area, language)} m²</dd></div>
      </dl>
      <dl className="mt-4">
        <div className={row}>
          <dt>{fill(t('site.basePrice'), { room: roomLabel, area: formatNumber(estimate.includedArea, language) })}</dt>
          <dd className="shrink-0 tabular-nums">{formatEuro(estimate.basePrice, language)}</dd>
        </div>
        {estimate.areaLines.map((areaLine) => (
          <div key={areaLine.fromArea} className={row}>
            <dt>{fill(t('site.extraArea'), { area: formatNumber(areaLine.squareMetres, language), rate: formatEuro(areaLine.ratePerM2, language) })}</dt>
            <dd className="shrink-0 tabular-nums">+ {formatEuro(Math.round(areaLine.amount), language)}</dd>
          </div>
        ))}
        {estimate.options.length ? [...estimate.options].sort((first, second) => first.sortOrder - second.sortOrder).map((option) => (
          <div key={option.id} className={row}>
            <dt>{pick(option.labelNl, option.labelEn)}</dt>
            <dd className="shrink-0 tabular-nums">+ {formatEuro(option.price, language)}</dd>
          </div>
        )) : (
          <div className={row}><dt className={muted}>{t('site.noOptionsChosen')}</dt><dd /></div>
        )}
      </dl>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className={`text-[12px] uppercase tracking-[0.18em] ${muted}`}>{t('site.total')}</p>
          <p className={muted + ' text-sm'}>{t('configurator.includingVat')}</p>
        </div>
        <p className="font-serif text-4xl tabular-nums">{formatEuro(estimate.total, language)}</p>
      </div>
    </div>
  );
}
