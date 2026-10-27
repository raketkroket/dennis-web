import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';
import { formatEuro, formatNumber, optionGroups, optionsForRoom, type RoomType } from '../lib/calculator';

/**
 * The calculator's prices as a readable table: base price, price per extra
 * m² and every option with what it includes. Read from the same settings as
 * the calculator, so it changes when Dennis changes a price in the admin.
 */
export default function PriceOverview({ roomTypes, id }: { roomTypes: RoomType[]; id: string }) {
  const { t, language } = useLanguage();
  const pick = useLocalized();
  const { calculator } = useSiteContent();
  const rooms = calculator.rooms.filter((room) => room.isActive && roomTypes.includes(room.roomType));
  if (!rooms.length) return null;
  const options = optionsForRoom(calculator, rooms[0].roomType);
  const euro = (value: number) => formatEuro(value, language);
  const area = (value: number) => formatNumber(value, language);

  return (
    <section className="py-20 bg-[#f6f0e8]" aria-labelledby={`${id}-heading`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="denra-line" />
          <span className="denra-label">{t('site.priceLabel')}</span>
        </div>
        <h2 id={`${id}-heading`} className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
          {rooms.length === 1 ? fill(t('site.priceTitle'), { room: pick(rooms[0].descriptionNl, rooms[0].descriptionEn).toLowerCase() }) : t('site.priceTitleAll')}
        </h2>
        <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-3xl">{t('site.priceIntro')}</p>

        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          {rooms.map((room) => {
            const tiers = [...room.tiers].sort((first, second) => first.fromArea - second.fromArea);
            return (
              <article key={room.roomType} className="rounded-sm border border-[#cfbca7]/55 bg-[#faf6f0] p-6">
                <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-1">{pick(room.descriptionNl, room.descriptionEn)}</h3>
                <p className="font-serif text-4xl font-semibold text-[#231A12] mb-1">{t('site.calcFrom')} {euro(room.basePrice)}</p>
                <p className="text-sm text-[#6B5D50] mb-4">{fill(t('site.calcUpTo'), { area: area(room.includedArea) })} · {t('configurator.includingVat')}</p>
                <ul className="space-y-1.5 border-t border-[#cfbca7]/55 pt-4 text-sm text-[#4A3F35]">
                  {tiers.map((tier, index) => (
                    <li key={tier.fromArea}>
                      {tiers[index + 1]
                        ? fill(t('site.priceTierBetween'), { from: area(tier.fromArea), to: area(tiers[index + 1].fromArea), rate: euro(tier.ratePerM2) })
                        : fill(t('site.priceTierFrom'), { from: area(tier.fromArea), rate: euro(tier.ratePerM2) })}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-4">{t('site.priceOptionsTitle')}</h3>
        <div className="overflow-x-auto rounded-sm border border-[#cfbca7]/55 bg-[#faf6f0]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{t('site.priceOptionsTitle')}</caption>
            <thead className="text-[10px] uppercase tracking-[0.16em] text-[#7a6552]">
              <tr className="border-b border-[#cfbca7]/55">
                <th scope="col" className="px-4 py-3 font-semibold">{t('site.priceColumnOption')}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t('site.included')}</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">{t('site.priceColumnPrice')}</th>
              </tr>
            </thead>
            {optionGroups.map((group) => {
              const groupOptions = options.filter((option) => option.group === group.id);
              if (!groupOptions.length) return null;
              return (
                <tbody key={group.id} className="border-b border-[#cfbca7]/40 last:border-b-0">
                  <tr>
                    <th scope="rowgroup" colSpan={3} className="px-4 pt-4 pb-1 font-serif text-lg font-semibold text-[#231A12]">{pick(group.labelNl, group.labelEn)}</th>
                  </tr>
                  {groupOptions.map((option) => {
                    const note = pick(option.noteNl, option.noteEn);
                    return (
                      <tr key={option.id} className="align-top">
                        <th scope="row" className="px-3 sm:px-4 py-2 font-medium text-[#231A12]">{pick(option.labelNl, option.labelEn)}</th>
                        <td className="px-3 sm:px-4 py-2 text-[#6B5D50]">
                          {pick(option.includedNl, option.includedEn)}
                          {note && <span className="block text-xs text-[#8A7A6A]">{note}</span>}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right font-semibold whitespace-nowrap text-[#7a6552]">+ {euro(option.price)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
          </table>
        </div>
        <p className="mt-4 text-sm text-[#6B5D50]">{t('site.priceFootnote')}</p>
        <Link to="/configurator" className="mt-8 inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm">
          {t('common.calculatePrice')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
