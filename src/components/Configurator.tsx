import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bath, Toilet, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { QuoteConfiguration } from '../types/quote';

type RoomType = 'badkamer' | 'wc';

interface ConfigState {
  roomType: RoomType | null;
  length: string;
  width: string;
  options: string[];
}

interface ConfigOption {
  id: string;
  label: string;
  price: number;
  note?: string;
}

const badkamerOptions: ConfigOption[] = [
  { id: 'verlaagd_plafond', label: 'Verlaagd plafond', price: 750, note: 'Inclusief: Vochtwerend plafond, montage. Opmerking: Stucwerk en spotjes apart.' },
  { id: 'spotjes', label: 'Spotjes', price: 500, note: 'Inclusief: Montage en bekabeling. Opmerking: Extra spot €125 per stuk.' },
  { id: 'tegelwerk_verstek', label: 'Tegelwerk in verstek', price: 600, note: 'Inclusief: Verstekafwerking. Opmerking: Afhankelijk van het aantal strekkende meters.' },
  { id: 'niche', label: 'Nis', price: 550, note: 'Inclusief: Constructie en waterdichting. Opmerking: LED-verlichting + €250.' },
  { id: 'drain', label: 'Drain', price: 450, note: 'Inclusief: Montage en aansluiting. Opmerking: Drain zelf niet inbegrepen.' },
  { id: 'inbouwkraan', label: 'Inbouwkraan', price: 550, note: 'Inclusief: Montage en aansluiting. Opmerking: Kraan zelf niet inbegrepen.' },
  { id: 'stucwerk', label: 'Stucwerk', price: 450, note: 'Inclusief: Voorbereiding en glad afwerken.' },
  { id: 'schilderwerk', label: 'Schilderwerk', price: 350, note: 'Inclusief: Twee lagen vochtbestendige verf.' },
  { id: 'vloerverwarming', label: 'Elektrische vloerverwarming', price: 900, note: 'Inclusief: Verwarmingsmat, thermostaat en montage. Opmerking: Tot ongeveer 6 m².' },
  { id: 'elektra', label: 'Elektra', price: 650, note: 'Inclusief: Lichtpunten en wandcontactdozen. Opmerking: Meterkastwerk apart.' },
  { id: 'sloopcontainer', label: 'Sloopcontainer', price: 250, note: 'Inclusief: Plaatsing en afvoer.' },
  { id: 'inbouwreservoir', label: 'Inbouwreservoir / toiletframe', price: 750, note: 'Inclusief: Montage en aansluiting. Opmerking: Frame wordt door klant geleverd.' },
  { id: 'geberit_duofix', label: 'Geberit Duofix inclusief montage', price: 1250, note: 'Inclusief: Frame en montage. Opmerking: Toilet niet inbegrepen.' },
  { id: 'toiletframe_ombouwen', label: 'Toiletframe ombouwen', price: 500, note: 'Inclusief: Betimmering. Opmerking: Tegelwerk apart.' },
  { id: 'hangtoilet_systeem', label: 'Compleet hangtoilet-systeem', price: 1850, note: 'Inclusief: Frame, ombouw en montage. Opmerking: Toilet en tegelwerk deels niet inbegrepen.' },
];

const wcOptions: ConfigOption[] = [
  { id: 'verlaagd_plafond', label: 'Verlaagd plafond', price: 750, note: 'Inclusief: Vochtwerend plafond, montage. Opmerking: Stucwerk en spotjes apart.' },
  { id: 'spotjes', label: 'Spotjes', price: 500, note: 'Inclusief: Montage en bekabeling. Opmerking: Extra spot €125 per stuk.' },
  { id: 'tegelwerk_verstek', label: 'Tegelwerk in verstek', price: 600, note: 'Inclusief: Verstekafwerking. Opmerking: Afhankelijk van het aantal strekkende meters.' },
  { id: 'niche', label: 'Nis', price: 550, note: 'Inclusief: Constructie en waterdichting. Opmerking: LED-verlichting + €250.' },
  { id: 'drain', label: 'Drain', price: 450, note: 'Inclusief: Montage en aansluiting. Opmerking: Drain zelf niet inbegrepen.' },
  { id: 'inbouwkraan', label: 'Inbouwkraan', price: 550, note: 'Inclusief: Montage en aansluiting. Opmerking: Kraan zelf niet inbegrepen.' },
  { id: 'stucwerk', label: 'Stucwerk', price: 450, note: 'Inclusief: Voorbereiding en glad afwerken.' },
  { id: 'schilderwerk', label: 'Schilderwerk', price: 350, note: 'Inclusief: Twee lagen vochtbestendige verf.' },
  { id: 'vloerverwarming', label: 'Elektrische vloerverwarming', price: 900, note: 'Inclusief: Verwarmingsmat, thermostaat en montage. Opmerking: Tot ongeveer 6 m².' },
  { id: 'elektra', label: 'Elektra', price: 650, note: 'Inclusief: Lichtpunten en wandcontactdozen. Opmerking: Meterkastwerk apart.' },
  { id: 'sloopcontainer', label: 'Sloopcontainer', price: 250, note: 'Inclusief: Plaatsing en afvoer.' },
  { id: 'inbouwreservoir', label: 'Inbouwreservoir / toiletframe', price: 750, note: 'Inclusief: Montage en aansluiting. Opmerking: Frame wordt door klant geleverd.' },
  { id: 'geberit_duofix', label: 'Geberit Duofix inclusief montage', price: 1250, note: 'Inclusief: Frame en montage. Opmerking: Toilet niet inbegrepen.' },
  { id: 'toiletframe_ombouwen', label: 'Toiletframe ombouwen', price: 500, note: 'Inclusief: Betimmering. Opmerking: Tegelwerk apart.' },
  { id: 'hangtoilet_systeem', label: 'Compleet hangtoilet-systeem', price: 1850, note: 'Inclusief: Frame, ombouw en montage. Opmerking: Toilet en tegelwerk deels niet inbegrepen.' },
];

function calculatePrice(state: ConfigState): number {
  if (!state.roomType || !state.length || !state.width) return 0;
  const area = parseFloat(state.length) * parseFloat(state.width);
  if (isNaN(area) || area <= 0) return 0;
  const base = state.roomType === 'badkamer'
    ? area <= 5
      ? 7950
      : area <= 8
        ? 7950 + (area - 5) * 900
        : 10650 + (area - 8) * 1100
    : area <= 2
      ? 3950
      : 3950 + (area - 2) * 800;
  const options = state.roomType === 'badkamer' ? badkamerOptions : wcOptions;
  const extras = state.options.reduce((sum, id) => {
    const opt = options.find((o) => o.id === id);
    return sum + (opt ? opt.price : 0);
  }, 0);
  return Math.round(base + extras);
}

export default function Configurator() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    roomType: null,
    length: '',
    width: '',
    options: [],
  });

  const price = calculatePrice(config);
  const currentOptions = config.roomType === 'wc' ? wcOptions : badkamerOptions;
  const quoteConfiguration: QuoteConfiguration | null = config.roomType && config.length && config.width
    ? {
        roomType: config.roomType,
        length: parseFloat(config.length),
        width: parseFloat(config.width),
        area: Number((parseFloat(config.length) * parseFloat(config.width)).toFixed(2)),
        selectedOptions: currentOptions
          .filter((option) => config.options.includes(option.id))
          .map(({ id, label, price: optionPrice }) => ({ id, label, price: optionPrice })),
        totalPrice: price,
      }
    : null;

  const toggleOption = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      options: prev.options.includes(id)
        ? prev.options.filter((o) => o !== id)
        : [...prev.options, id],
    }));
  }, []);

  const canProceedStep1 = config.roomType !== null;
  const canProceedStep2 =
    config.length !== '' &&
    config.width !== '' &&
    parseFloat(config.length) > 0 &&
    parseFloat(config.width) > 0;

  return (
    <div className="bg-[#f8f3ec] rounded-sm border border-[#cfbca7]/55 overflow-hidden">
      {/* Progress */}
      <div className="bg-[#f4ede4] px-8 py-6 border-b border-[#cfbca7]/60">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step > s
                        ? 'bg-[#231A12] text-[#F6F0E8]'
                      : step === s
                        ? 'bg-[#7a6552] text-[#F6F0E8]'
                        : 'bg-[#e8ddcf] text-[#8A7A6A]'
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-[#231A12]' : 'text-[#8A7A6A]'}`}>
                  {s === 1 ? 'Ruimte' : s === 2 ? 'Afmetingen' : 'Opties'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-colors duration-300 ${step > s ? 'bg-[#7a6552]' : 'bg-[#e8ddcf]'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">Welke ruimte wilt u renoveren?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Selecteer het type ruimte voor een nauwkeurige prijsindicatie.</p>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { type: 'badkamer' as RoomType, icon: Bath, label: 'Badkamer', desc: 'Volledige badkamerrenovatie' },
                  { type: 'wc' as RoomType, icon: Toilet, label: 'WC', desc: 'Toilet renovatie' },
                ] as const).map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setConfig((prev) => ({ ...prev, roomType: type, options: [] }))}
                    className={`p-6 rounded-sm border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2 ${
                      config.roomType === type
                        ? 'border-[#7a6552] bg-[#e8ddcf]/30'
                        : 'border-[#cfbca7] hover:border-[#7a6552]/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-4 ${config.roomType === type ? 'bg-[#231A12]' : 'bg-[#f4ede4]'}`}>
                      <Icon size={22} className={config.roomType === type ? 'text-[#F6F0E8]' : 'text-[#7a6552]'} />
                    </div>
                    <p className="font-semibold text-[#231A12] mb-1">{label}</p>
                    <p className="text-xs text-[#8A7A6A]">{desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">Wat zijn de afmetingen?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Voer de lengte en breedte in meters in voor een nauwkeurige berekening.</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-[#231A12] mb-2">
                    Lengte (m)
                  </label>
                  <input
                    id="length"
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={config.length}
                    onChange={(e) => setConfig((prev) => ({ ...prev, length: e.target.value }))}
                    placeholder="bijv. 3.5"
                    className="denra-field"
                  />
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-[#231A12] mb-2">
                    Breedte (m)
                  </label>
                  <input
                    id="width"
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={config.width}
                    onChange={(e) => setConfig((prev) => ({ ...prev, width: e.target.value }))}
                    placeholder="bijv. 2.0"
                    className="denra-field"
                  />
                </div>
              </div>
              {config.length && config.width && parseFloat(config.length) > 0 && parseFloat(config.width) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#f4ede4] rounded-sm border border-[#cfbca7]/55"
                >
                  <p className="text-sm text-[#6B5D50]">
                    Oppervlakte: <span className="font-semibold text-[#231A12]">{(parseFloat(config.length) * parseFloat(config.width)).toFixed(2)} m²</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">Welke opties wenst u?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Selecteer de gewenste extra's voor uw renovatie.</p>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {currentOptions.map((option) => {
                  const isSelected = config.options.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`flex flex-col items-stretch gap-1 p-4 rounded-sm border transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-1 ${
                        isSelected
                          ? 'border-[#7a6552] bg-[#e8ddcf]/25'
                          : 'border-[#cfbca7] hover:border-[#7a6552]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span className="text-sm font-medium text-[#231A12] whitespace-nowrap">{option.label}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-[#8A7A6A]">+€{option.price}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-[#7a6552] bg-[#7a6552]' : 'border-[#cfbca7]'}`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                        </div>
                      </div>
                      {option.note && <p className="w-full text-left text-[11px] leading-snug text-[#8A7A6A]">{option.note}</p>}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#8A7A6A] mb-6">
                Vrijblijvende vanafprijs voor arbeid en normale bouwmaterialen. Sanitair, tegels, kranen, badkamermeubels en overige zichtmaterialen zijn niet inbegrepen, tenzij expliciet vermeld. Definitieve prijs wordt vastgesteld na opname op locatie.
              </p>

              {/* Price result */}
              <div className="bg-[#231A12] rounded-sm p-6 text-white">
                <p className="denra-label text-[#cfbca7] mb-2">Uw prijsindicatie</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-serif text-4xl font-semibold">
                    Vanaf €{price.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-[#b7a894] text-sm mb-1">incl. btw</span>
                </div>
                <p className="text-xs text-[#b7a894] mb-6">
                  Inclusief bouwmaterialen. Exclusief sanitair en tegels.
                </p>
                <Link
                  to="/contact"
                  state={{ quoteConfiguration }}
                  className="flex items-center justify-center gap-2 bg-[#f6f0e8] text-[#231A12] font-medium px-6 py-3.5 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e8ddcf] transition-all duration-200 text-sm w-full"
                >
                  Vraag vrijblijvende offerte aan
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#cfbca7]/60">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm font-medium text-[#8A7A6A] hover:text-[#231A12] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Vorige
          </button>
          {step < 3 && (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="flex items-center gap-2 bg-[#231A12] text-[#F6F0E8] text-sm font-medium px-6 py-2.5 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              Volgende
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}