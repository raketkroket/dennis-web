import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bath, Toilet, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

type RoomType = 'badkamer' | 'wc';

interface ConfigState {
  roomType: RoomType | null;
  length: string;
  width: string;
  options: string[];
}

const badkamerOptions = [
  { id: 'verlaagd_plafond', label: 'Verlaagd plafond', price: 800 },
  { id: 'spotjes', label: 'Spotjes', price: 350 },
  { id: 'tegelwerk_verstek', label: 'Tegelwerk in verstek', price: 600 },
  { id: 'niche', label: 'Niche', price: 450 },
  { id: 'drain', label: 'Drain', price: 300 },
  { id: 'inbouwkranen', label: 'Inbouwkranen', price: 500 },
  { id: 'stucwerk', label: 'Stucwerk', price: 400 },
  { id: 'schilderwerk', label: 'Schilderwerk', price: 350 },
  { id: 'vloerverwarming', label: 'Vloerverwarming', price: 900 },
  { id: 'elektra', label: 'Elektra', price: 600 },
  { id: 'pvc_vloer', label: 'PVC vloer', price: 500 },
];

const wcOptions = [
  { id: 'verlaagd_plafond', label: 'Verlaagd plafond', price: 400 },
  { id: 'spotjes', label: 'Spotjes', price: 200 },
  { id: 'tegelwerk_verstek', label: 'Tegelwerk in verstek', price: 300 },
  { id: 'stucwerk', label: 'Stucwerk', price: 250 },
  { id: 'schilderwerk', label: 'Schilderwerk', price: 200 },
  { id: 'elektra', label: 'Elektra', price: 300 },
  { id: 'pvc_vloer', label: 'PVC vloer', price: 250 },
];

const BASE_PRICE_PER_M2: Record<RoomType, number> = {
  badkamer: 1200,
  wc: 900,
};

function calculatePrice(state: ConfigState): number {
  if (!state.roomType || !state.length || !state.width) return 0;
  const area = parseFloat(state.length) * parseFloat(state.width);
  if (isNaN(area) || area <= 0) return 0;
  const base = area * BASE_PRICE_PER_M2[state.roomType];
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
    <div className="bg-white rounded-3xl border border-[#E8DDD0]/60 shadow-sm overflow-hidden">
      {/* Progress */}
      <div className="bg-[#FAF8F5] px-8 py-6 border-b border-[#E8DDD0]/60">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step > s
                      ? 'bg-[#D5C0A7] text-[#2C2416]'
                      : step === s
                      ? 'bg-[#2C2416] text-white'
                      : 'bg-[#E8DDD0] text-[#8A7A6A]'
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-[#2C2416]' : 'text-[#8A7A6A]'}`}>
                  {s === 1 ? 'Ruimte' : s === 2 ? 'Afmetingen' : 'Opties'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-colors duration-300 ${step > s ? 'bg-[#D5C0A7]' : 'bg-[#E8DDD0]'}`} />}
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
              <h3 className="font-serif text-2xl font-semibold text-[#2C2416] mb-2">Welke ruimte wilt u renoveren?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Selecteer het type ruimte voor een nauwkeurige prijsindicatie.</p>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { type: 'badkamer' as RoomType, icon: Bath, label: 'Badkamer', desc: 'Volledige badkamerrenovatie' },
                  { type: 'wc' as RoomType, icon: Toilet, label: 'WC', desc: 'Toilet renovatie' },
                ] as const).map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setConfig((prev) => ({ ...prev, roomType: type, options: [] }))}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D5C0A7] focus:ring-offset-2 ${
                      config.roomType === type
                        ? 'border-[#D5C0A7] bg-[#D5C0A7]/5'
                        : 'border-[#E8DDD0] hover:border-[#D5C0A7]/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${config.roomType === type ? 'bg-[#D5C0A7]' : 'bg-[#F5EFE6]'}`}>
                      <Icon size={22} className={config.roomType === type ? 'text-[#2C2416]' : 'text-[#D5C0A7]'} />
                    </div>
                    <p className="font-semibold text-[#2C2416] mb-1">{label}</p>
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
              <h3 className="font-serif text-2xl font-semibold text-[#2C2416] mb-2">Wat zijn de afmetingen?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Voer de lengte en breedte in meters in voor een nauwkeurige berekening.</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-[#2C2416] mb-2">
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
                    className="w-full border border-[#D4C5A9]/60 rounded-xl px-4 py-3 text-[#2C2416] placeholder-[#C4B8A8] focus:outline-none focus:ring-2 focus:ring-[#D5C0A7]/50 focus:border-[#D5C0A7] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-[#2C2416] mb-2">
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
                    className="w-full border border-[#D4C5A9]/60 rounded-xl px-4 py-3 text-[#2C2416] placeholder-[#C4B8A8] focus:outline-none focus:ring-2 focus:ring-[#D5C0A7]/50 focus:border-[#D5C0A7] transition-all duration-200"
                  />
                </div>
              </div>
              {config.length && config.width && parseFloat(config.length) > 0 && parseFloat(config.width) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#F5EFE6] rounded-xl"
                >
                  <p className="text-sm text-[#6B5D50]">
                    Oppervlakte: <span className="font-semibold text-[#2C2416]">{(parseFloat(config.length) * parseFloat(config.width)).toFixed(2)} m²</span>
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
              <h3 className="font-serif text-2xl font-semibold text-[#2C2416] mb-2">Welke opties wenst u?</h3>
              <p className="text-sm text-[#8A7A6A] mb-8">Selecteer de gewenste extra's voor uw renovatie.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentOptions.map((option) => {
                  const isSelected = config.options.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-1 ${
                        isSelected
                          ? 'border-[#D5C0A7] bg-[#D5C0A7]/5'
                          : 'border-[#E8DDD0] hover:border-[#D5C0A7]/40'
                      }`}
                    >
                      <span className="text-sm font-medium text-[#2C2416]">{option.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8A7A6A]">+€{option.price}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-[#D5C0A7] bg-[#D5C0A7]' : 'border-[#D4C5A9]'}`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Price result */}
              <div className="bg-[#2C2416] rounded-2xl p-6 text-white">
                <p className="text-xs tracking-[0.2em] uppercase text-[#D5C0A7] mb-2">Uw prijsindicatie</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-serif text-4xl font-semibold">
                    €{price.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-[#A89880] text-sm mb-1">indicatie</span>
                </div>
                <p className="text-xs text-[#7A6A58] mb-6">
                  Inclusief materiaal en arbeid. Exacte prijs na inspectie ter plaatse.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 bg-[#D5C0A7] text-[#2C2416] font-medium px-6 py-3.5 rounded-full hover:bg-[#C7AF94] hover:scale-105 transition-all duration-200 text-sm w-full"
                >
                  Vraag vrijblijvende offerte aan
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8DDD0]/60">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm font-medium text-[#8A7A6A] hover:text-[#2C2416] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Vorige
          </button>
          {step < 3 && (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="flex items-center gap-2 bg-[#D5C0A7] text-[#2C2416] text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#C7AF94] hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
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